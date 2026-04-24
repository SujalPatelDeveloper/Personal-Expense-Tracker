import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import { BarChart2, TrendingUp, TrendingDown, PieChart as PieChartIcon, Calendar, ArrowRight, AlertCircle, ShoppingCart, Coffee, Car, Home, Zap, Heart, GraduationCap, Gamepad2, MoreHorizontal } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './Analytics.css';

const CATEGORIES = [
  { name: 'Food & Dining', icon: Coffee, color: '#f59e0b' },
  { name: 'Shopping', icon: ShoppingCart, color: '#6366f1' },
  { name: 'Transport', icon: Car, color: '#3b82f6' },
  { name: 'Housing', icon: Home, color: '#10b981' },
  { name: 'Utilities', icon: Zap, color: '#ef4444' },
  { name: 'Health', icon: Heart, color: '#ec4899' },
  { name: 'Education', icon: GraduationCap, color: '#8b5cf6' },
  { name: 'Entertainment', icon: Gamepad2, color: '#14b8a6' },
  { name: 'Other', icon: MoreHorizontal, color: '#6b7280' },
];

export default function Analytics() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [filterPeriod, setFilterPeriod] = useState('week');
  const [trendPeriod, setTrendPeriod] = useState('week');

  useEffect(() => {
    if (!user) return;
    const fetchExpenses = async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (!error && data) {
        setExpenses(data);
      }
    };
    fetchExpenses();
  }, [user]);

  const stats = useMemo(() => {
    const now = new Date();

    const getFY = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = d.getMonth();
      return month < 3 ? `${year - 1}-${year}` : `${year}-${year + 1}`;
    };

    const currentFY = getFY(now);

    let filteredData = [...expenses];
    if (filterPeriod === 'week') {
      const startOfWeek = new Date(now);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);
      filteredData = expenses.filter(e => new Date(e.date) >= startOfWeek);
    } else if (filterPeriod === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filteredData = expenses.filter(e => new Date(e.date) >= startOfMonth);
    } else if (filterPeriod === 'fy') {
      filteredData = expenses.filter(e => getFY(e.date) === currentFY);
    } else if (filterPeriod.startsWith('fy-')) {
      const selectedFY = filterPeriod.replace('fy-', '');
      filteredData = expenses.filter(e => getFY(e.date) === selectedFY);
    }

    const currentMonth = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const totalThisMonth = currentMonth.reduce((s, e) => s + e.amount, 0);
    const avgDaily = currentMonth.length > 0 ? totalThisMonth / now.getDate() : 0;

    // Category breakdown for insights (using filteredData)
    const categoryMap = {};
    filteredData.forEach(e => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });

    const totalFiltered = filteredData.reduce((s, e) => s + e.amount, 0);
    const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0] || ['None', 0];

    // Trend calculation
    let trendData = [];
    if (trendPeriod === 'week') {
      const startOfWeek = new Date(now);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);

      trendData = [...Array(7)].map((_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        const dayTotal = expenses
          .filter(e => e.date === dateStr)
          .reduce((s, e) => s + e.amount, 0);
        return {
          label: d.toLocaleDateString('en-US', { weekday: 'short' }),
          amount: dayTotal,
          fullDate: dateStr
        };
      });
    } else if (trendPeriod === 'month') {
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      trendData = [...Array(daysInMonth)].map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth(), i + 1);
        const dateStr = d.toISOString().split('T')[0];
        const dayTotal = expenses
          .filter(e => e.date === dateStr)
          .reduce((s, e) => s + e.amount, 0);
        return {
          label: i + 1,
          amount: dayTotal,
          fullDate: dateStr
        };
      });
    } else if (trendPeriod === 'fy' || trendPeriod.startsWith('fy-')) {
      const targetFY = trendPeriod === 'fy' ? currentFY : trendPeriod.replace('fy-', '');
      const startYear = parseInt(targetFY.split('-')[0]);

      // April to March (12 months)
      trendData = [...Array(12)].map((_, i) => {
        const monthIndex = (i + 3) % 12; // Start from April (3)
        const yearOffset = i < 9 ? 0 : 1; // Jan-Mar are next year
        const d = new Date(startYear + yearOffset, monthIndex, 1);

        const monthTotal = expenses
          .filter(e => {
            const ed = new Date(e.date);
            return ed.getMonth() === monthIndex && ed.getFullYear() === (startYear + yearOffset);
          })
          .reduce((s, e) => s + e.amount, 0);

        return {
          label: d.toLocaleDateString('en-US', { month: 'short' }),
          amount: monthTotal,
          fullDate: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        };
      });
    }

    // Available months & FYs for dropdown
    const availableMonths = [];
    const availableFYs = [];
    const monthsSet = new Set();
    const fySet = new Set();

    expenses.forEach(e => {
      const d = new Date(e.date);
      const mKey = `${d.getFullYear()}-${d.getMonth() + 1}`;
      const fKey = getFY(e.date);

      if (!monthsSet.has(mKey)) {
        monthsSet.add(mKey);
        availableMonths.push({
          year: d.getFullYear(),
          month: d.getMonth() + 1,
          label: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        });
      }

      if (!fySet.has(fKey)) {
        fySet.add(fKey);
        availableFYs.push(fKey);
      }
    });
    availableMonths.sort((a, b) => b.year - a.year || b.month - a.month);
    availableFYs.sort((a, b) => {
      const yA = parseInt(a.split('-')[0]);
      const yB = parseInt(b.split('-')[0]);
      return yB - yA;
    });

    // Weekend vs Weekday calculation
    let weekendSpend = 0;
    let weekdaySpend = 0;
    expenses.forEach(e => {
      const d = new Date(e.date);
      const day = d.getDay();
      if (day === 0 || day === 6) weekendSpend += e.amount;
      else weekdaySpend += e.amount;
    });

    return { 
      totalThisMonth, 
      avgDaily, 
      topCategory, 
      trendData, 
      currentMonth, 
      categoryMap, 
      totalFiltered, 
      availableMonths, 
      availableFYs, 
      currentFY,
      weekendSpend,
      weekdaySpend
    };
  }, [expenses, filterPeriod, trendPeriod]);

  const maxTrend = Math.max(...stats.trendData.map(d => d.amount), 1);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="analytics-page">
      <div className="container">
        <div className="analytics-header animate-fadeInUp">
          <h1 className="analytics-title">Financial <span className="accent-text">Analytics</span></h1>
          <p className="analytics-subtitle">Deep dive into your spending patterns</p>
        </div>

        <div className="analytics-grid">
          {/* Summary Cards */}
          <div className="analytics-summary animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <div className="ana-card glass-card">
              <div className="ana-card-icon" style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary)' }}>
                <TrendingUp size={20} />
              </div>
              <div className="ana-card-info">
                <span>Monthly Spend</span>
                <h3>{formatCurrency(stats.totalThisMonth)}</h3>
              </div>
            </div>
            <div className="ana-card glass-card">
              <div className="ana-card-icon" style={{ background: 'var(--info-soft)', color: 'var(--info)' }}>
                <Calendar size={20} />
              </div>
              <div className="ana-card-info">
                <span>Daily Average</span>
                <h3>{formatCurrency(stats.avgDaily)}</h3>
              </div>
            </div>
            <div className="ana-card glass-card">
              <div className="ana-card-icon" style={{ background: 'var(--warning-soft)', color: 'var(--warning)' }}>
                <PieChartIcon size={20} />
              </div>
              <div className="ana-card-info">
                <span>Top Category</span>
                <h3>{stats.topCategory[0]}</h3>
              </div>
            </div>
          </div>

          {/* Main Charts Row */}
          <div className="analytics-charts-row animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="chart-card glass-card trend-card">
              <div className="chart-header-flex">
                <h3>Spending Trend ({trendPeriod === 'week' ? 'This Week' : trendPeriod === 'month' ? 'This Month' : `Financial Year ${trendPeriod === 'fy' ? stats.currentFY : trendPeriod.replace('fy-', '')}`})</h3>
                <div className="period-selector">
                  <select
                    className="period-dropdown"
                    value={trendPeriod}
                    onChange={(e) => setTrendPeriod(e.target.value)}
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="fy">Financial Year {stats.currentFY}</option>
                    {stats.availableFYs.filter(fy => fy !== stats.currentFY).map(fy => (
                      <option key={fy} value={`fy-${fy}`}>Financial Year {fy}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="bar-chart-scroll-wrapper">
                <div className="bar-chart-container">
                  {stats.trendData.map((day, i) => (
                    <div key={i} className="bar-column">
                      <div className="bar-wrapper">
                        <div
                          className="bar-fill"
                          style={{ height: `${(day.amount / maxTrend) * 100}%` }}
                        >
                          <div className="bar-tooltip">
                            <span className="tooltip-value">{formatCurrency(day.amount)}</span>
                          </div>
                          {(day.amount / maxTrend) > 0.3 && (
                            <div className="bar-value-vertical">
                              {formatCurrency(day.amount)}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="bar-label">{day.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="trend-insights">
                <div className="trend-stat">
                  <span className="trend-stat-label">Peak Spending</span>
                  <div className="trend-stat-value">
                    {formatCurrency(maxTrend)}
                    <span className="trend-date-tag">
                      {stats.trendData.find(d => d.amount === maxTrend)?.label}
                    </span>
                  </div>
                  <span className="trend-stat-detail">Highest single day outlay</span>
                </div>
                <div className="trend-stat">
                  <span className="trend-stat-label">{trendPeriod === 'week' ? 'Weekly' : trendPeriod === 'month' ? 'Monthly' : 'FY'} Total</span>
                  <div className="trend-stat-value">
                    {formatCurrency(stats.trendData.reduce((s, d) => s + d.amount, 0))}
                  </div>
                  <span className="trend-stat-detail">
                    Avg. {formatCurrency(stats.trendData.reduce((s, d) => s + d.amount, 0) / stats.trendData.length)} / day
                  </span>
                </div>
              </div>
            </div>

            <div className="chart-card glass-card">
              <div className="chart-header-flex">
                <h3>Category Insights</h3>
                <div className="period-selector">
                  <select
                    className="period-dropdown"
                    value={filterPeriod}
                    onChange={(e) => setFilterPeriod(e.target.value)}
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="fy">Financial Year {stats.currentFY}</option>
                    {stats.availableFYs.filter(fy => fy !== stats.currentFY).map(fy => (
                      <option key={fy} value={`fy-${fy}`}>Financial Year {fy}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pie-chart-section">
                <div className="pie-chart-container">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={Object.entries(stats.categoryMap).map(([name, value]) => ({
                          name,
                          value,
                          color: (CATEGORIES.find(c => c.name === name) || CATEGORIES[8]).color
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                        animationBegin={0}
                        animationDuration={1200}
                      >
                        {Object.entries(stats.categoryMap).map(([name], index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={(CATEGORIES.find(c => c.name === name) || CATEGORIES[8]).color}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '16px',
                          border: '1px solid rgba(0,0,0,0.05)',
                          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                          backdropFilter: 'blur(10px)',
                          padding: '12px 16px'
                        }}
                        itemStyle={{ fontWeight: 700, fontSize: '14px' }}
                        formatter={(value) => formatCurrency(value)}
                      />
                      <text
                        x="50%"
                        y="48%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="pie-center-total-label"
                      >
                        Total
                      </text>
                      <text
                        x="50%"
                        y="58%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="pie-center-total-value"
                      >
                        {formatCurrency(stats.totalFiltered)}
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="category-insights-list">
                  {Object.entries(stats.categoryMap)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([name, amount], i) => {
                      const cat = CATEGORIES.find(c => c.name === name) || CATEGORIES[8];
                      return (
                        <div key={i} className="insight-item">
                          <div className="insight-left">
                            <div className="insight-icon" style={{ color: cat.color, background: `${cat.color}15` }}>
                              <cat.icon size={16} />
                            </div>
                            <span>{name}</span>
                          </div>
                          <div className="insight-right">
                            <span className="insight-amount">{formatCurrency(amount)}</span>
                            <span className="insight-percent">
                              {stats.totalFiltered > 0 ? ((amount / stats.totalFiltered) * 100).toFixed(0) : 0}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          {/* Smart Insights Section */}
          <div className="smart-insights-section animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="glass-card smart-insights-card">
              <div className="smart-header">
                <AlertCircle size={20} className="smart-icon" />
                <h3>Smart Recommendations</h3>
              </div>
              <div className="smart-grid">
                <div className="smart-tip">
                  <div className="tip-bullet"></div>
                  <p>You spend <span className="text-bold">{((stats.weekendSpend / (stats.weekendSpend + stats.weekdaySpend)) * 100).toFixed(0)}%</span> of your money on weekends. Try limiting non-essential weekend shopping.</p>
                </div>
                <div className="smart-tip">
                  <div className="tip-bullet"></div>
                  <p>Daily average is <span className="text-bold">{formatCurrency(stats.avgDaily)}</span>. Try setting a daily limit of {formatCurrency(stats.avgDaily * 0.9)} to save 10% this month.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
