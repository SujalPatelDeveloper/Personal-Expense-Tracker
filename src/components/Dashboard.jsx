import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Plus, Trash2, Edit3, X, Check, TrendingUp, TrendingDown,
  Wallet, Calendar, Filter, Search, ArrowUpRight, ArrowDownRight,
  ShoppingCart, Coffee, Car, Home, Zap, Heart, GraduationCap,
  Gamepad2, MoreHorizontal, ChevronDown, IndianRupee, PieChart,
  Repeat, Bell, CreditCard, Clock
} from 'lucide-react';
import './Dashboard.css';

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

const getCategoryData = (name) => CATEGORIES.find(c => c.name === name) || CATEGORIES[8];

export default function Dashboard() {
  const { user } = useAuth();
  const storageKey = `trackit-expenses-${user?.id}`;
  const recurringStorageKey = `trackit-recurring-${user?.id}`;

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem(recurringStorageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [showRecurringForm, setShowRecurringForm] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(expenses));
  }, [expenses, storageKey]);

  useEffect(() => {
    localStorage.setItem(recurringStorageKey, JSON.stringify(subscriptions));
  }, [subscriptions, recurringStorageKey]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (showForm || showRecurringForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showForm, showRecurringForm]);

  const resetForm = () => {
    setForm({
      title: '',
      amount: '',
      category: 'Food & Dining',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;

    if (editingId) {
      setExpenses(prev => prev.map(exp =>
        exp.id === editingId
          ? { ...exp, ...form, amount: parseFloat(form.amount) }
          : exp
      ));
    } else {
      const newExpense = {
        id: Date.now().toString(),
        ...form,
        amount: parseFloat(form.amount),
        createdAt: new Date().toISOString()
      };
      setExpenses(prev => [newExpense, ...prev]);
    }
    resetForm();
  };

  const handleEdit = (expense) => {
    setForm({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
      notes: expense.notes || ''
    });
    setEditingId(expense.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(exp =>
        exp.title.toLowerCase().includes(term) ||
        exp.category.toLowerCase().includes(term) ||
        exp.notes?.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (filterCategory !== 'All') {
      result = result.filter(exp => exp.category === filterCategory);
    }

    // Period filter
    const now = new Date();
    if (filterPeriod === 'today') {
      const today = now.toISOString().split('T')[0];
      result = result.filter(exp => exp.date === today);
    } else if (filterPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      result = result.filter(exp => new Date(exp.date) >= weekAgo);
    } else if (filterPeriod === 'month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      result = result.filter(exp => new Date(exp.date) >= monthStart);
    }

    // Sort by date desc
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
    return result;
  }, [expenses, searchTerm, filterCategory, filterPeriod]);

  // Statistics
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = expenses.filter(exp => {
      const d = new Date(exp.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const lastMonth = expenses.filter(exp => {
      const d = new Date(exp.date);
      const lm = new Date(now.getFullYear(), now.getMonth() - 1);
      return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
    });

    const thisMonthTotal = thisMonth.reduce((s, e) => s + e.amount, 0);
    const lastMonthTotal = lastMonth.reduce((s, e) => s + e.amount, 0);

    // Calculate recurring commitment for the month
    const monthlyRecurringTotal = subscriptions.reduce((acc, sub) => {
      const amount = sub.amount;
      if (sub.frequency === 'yearly') return acc + (amount / 12);
      if (sub.frequency === 'weekly') return acc + (amount * 4);
      return acc + amount;
    }, 0);

    const totalAll = expenses.reduce((s, e) => s + e.amount, 0);
    const todayTotal = expenses
      .filter(e => e.date === now.toISOString().split('T')[0])
      .reduce((s, e) => s + e.amount, 0);

    const adjustedThisMonthTotal = thisMonthTotal + monthlyRecurringTotal;

    const percentChange = lastMonthTotal > 0
      ? ((adjustedThisMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1)
      : 0;

    return {
      thisMonthTotal: adjustedThisMonthTotal,
      actualSpend: thisMonthTotal,
      recurringCommitment: monthlyRecurringTotal,
      lastMonthTotal,
      totalAll,
      todayTotal,
      percentChange,
      thisMonth
    };
  }, [expenses]);

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const totals = {};
    const data = filterPeriod === 'all' ? expenses : filteredExpenses;
    data.forEach(exp => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });
    const grandTotal = Object.values(totals).reduce((s, v) => s + v, 0);
    return Object.entries(totals)
      .map(([name, amount]) => ({
        name,
        amount,
        percent: grandTotal > 0 ? (amount / grandTotal * 100).toFixed(1) : 0,
        ...getCategoryData(name)
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, filteredExpenses, filterPeriod]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="dashboard" id="dashboard-page">
      {/* Welcome */}
      <div className="container">
        <div className="dash-welcome animate-fadeInUp">
          <div>
            <h1 className="dash-welcome-title">
              Welcome back, <span className="accent-text">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="dash-welcome-sub">Here's your financial overview</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => { resetForm(); setShowForm(true); }}
            id="add-expense-btn"
          >
            <Plus size={18} />
            Add Expense
          </button>
        </div>

        {/* Stat Cards */}
        <div className="stat-cards animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <div className="stat-card glass-card">
            <div className="stat-card-header">
              <span className="stat-card-label">This Month</span>
              <div className="stat-card-icon" style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary)' }}>
                <Calendar size={18} />
              </div>
            </div>
            <div className="stat-card-value">{formatCurrency(stats.thisMonthTotal)}</div>
            <div className={`stat-card-change ${parseFloat(stats.percentChange) > 0 ? 'up' : 'down'}`}>
              {parseFloat(stats.percentChange) > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span>{Math.abs(stats.percentChange)}% vs last month</span>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-card-header">
              <span className="stat-card-label">Today</span>
              <div className="stat-card-icon" style={{ background: 'var(--warning-soft)', color: 'var(--warning)' }}>
                <TrendingUp size={18} />
              </div>
            </div>
            <div className="stat-card-value">{formatCurrency(stats.todayTotal)}</div>
            <div className="stat-card-sub">{expenses.filter(e => e.date === new Date().toISOString().split('T')[0]).length} transactions</div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-card-header">
              <span className="stat-card-label">Total Expenses</span>
              <div className="stat-card-icon" style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}>
                <Wallet size={18} />
              </div>
            </div>
            <div className="stat-card-value">{formatCurrency(stats.totalAll)}</div>
            <div className="stat-card-sub">{expenses.length} total entries</div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-card-header">
              <span className="stat-card-label">Avg / Day (Month)</span>
              <div className="stat-card-icon" style={{ background: 'var(--success-soft)', color: 'var(--success)' }}>
                <PieChart size={18} />
              </div>
            </div>
            <div className="stat-card-value">
              {formatCurrency(stats.thisMonth.length > 0 ? stats.thisMonthTotal / new Date().getDate() : 0)}
            </div>
            <div className="stat-card-sub">daily average</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="dash-grid animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          {/* Expenses List */}
          <div className="dash-main">
            {/* Filters */}
            <div className="dash-filters glass-card">
              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  className="input-field search-input"
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  id="search-expenses"
                />
              </div>
              <div className="filter-group">
                <div className="select-wrapper">
                  <Filter size={14} className="select-icon" />
                  <select
                    className="input-field filter-select"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    id="filter-category"
                  >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="select-chevron" />
                </div>
                <div className="select-wrapper">
                  <Calendar size={14} className="select-icon" />
                  <select
                    className="input-field filter-select"
                    value={filterPeriod}
                    onChange={(e) => setFilterPeriod(e.target.value)}
                    id="filter-period"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                  <ChevronDown size={14} className="select-chevron" />
                </div>
              </div>
            </div>

            {/* Expense Items */}
            <div className="expense-list" id="expense-list">
              {filteredExpenses.length === 0 ? (
                <div className="empty-state glass-card">
                  <Wallet size={48} className="empty-icon" />
                  <h3>No expenses found</h3>
                  <p>{expenses.length === 0
                    ? 'Start tracking by adding your first expense!'
                    : 'Try adjusting your filters or search term.'
                  }</p>
                  {expenses.length === 0 && (
                    <button className="btn btn-primary" onClick={() => setShowForm(true)} id="empty-add-btn">
                      <Plus size={18} />
                      Add First Expense
                    </button>
                  )}
                </div>
              ) : (
                filteredExpenses.map((expense) => {
                  const cat = getCategoryData(expense.category);
                  const CatIcon = cat.icon;
                  return (
                    <div key={expense.id} className="expense-item glass-card" id={`expense-${expense.id}`}>
                      <div className="expense-item-left">
                        <div className="expense-cat-icon" style={{ background: `${cat.color}15`, color: cat.color }}>
                          <CatIcon size={20} />
                        </div>
                        <div className="expense-info">
                          <h4 className="expense-title">{expense.title}</h4>
                          <div className="expense-meta">
                            <span className="expense-category-tag" style={{ color: cat.color, background: `${cat.color}12` }}>
                              {expense.category}
                            </span>
                            <span className="expense-date">{formatDate(expense.date)}</span>
                          </div>
                          {expense.notes && <p className="expense-notes">{expense.notes}</p>}
                        </div>
                      </div>
                      <div className="expense-item-right">
                        <span className="expense-amount">{formatCurrency(expense.amount)}</span>
                        <div className="expense-actions">
                          <button
                            className="btn-icon action-edit"
                            onClick={() => handleEdit(expense)}
                            aria-label="Edit"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            className="btn-icon action-delete"
                            onClick={() => handleDelete(expense.id)}
                            aria-label="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Sidebar – Category Breakdown */}
          <div className="dash-sidebar">
            <div className="category-card glass-card">
              <h3 className="sidebar-title">Category Breakdown</h3>
              {categoryBreakdown.length === 0 ? (
                <p className="sidebar-empty">No data yet</p>
              ) : (
                <div className="category-list">
                  {categoryBreakdown.map((cat) => {
                    const CatIcon = cat.icon;
                    return (
                      <div key={cat.name} className="category-item">
                        <div className="category-item-left">
                          <div className="category-icon-sm" style={{ background: `${cat.color}15`, color: cat.color }}>
                            <CatIcon size={16} />
                          </div>
                          <div>
                            <div className="category-name">{cat.name}</div>
                            <div className="category-amount">{formatCurrency(cat.amount)}</div>
                          </div>
                        </div>
                        <div className="category-percent">{cat.percent}%</div>
                      </div>
                    );
                  })}
                  {/* Visual bars */}
                  <div className="category-bars">
                    {categoryBreakdown.map((cat) => (
                      <div key={cat.name} className="bar-row">
                        <div className="bar-track">
                          <div
                            className="bar-fill"
                            style={{ width: `${cat.percent}%`, background: cat.color }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recurring Payments Section */}
            <div className="recurring-card glass-card">
              <div className="sidebar-header-row">
                <h3 className="sidebar-title">Recurring</h3>
                <button className="btn-icon-sm" onClick={() => setShowRecurringForm(true)} title="Manage Recurring">
                  <Repeat size={14} />
                </button>
              </div>

              <div className="recurring-summary-small">
                {subscriptions.length === 0 ? (
                  <p className="sidebar-empty">No active subscriptions</p>
                ) : (
                  <div className="mini-sub-list">
                    {subscriptions.slice(0, 3).map(sub => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const next = new Date(sub.nextDate);
                      next.setHours(0, 0, 0, 0);
                      if (next < today) next.setMonth(next.getMonth() + 1);
                      const daysLeft = Math.ceil((next - today) / (1000 * 60 * 60 * 24));

                      return (
                        <div key={sub.id} className="mini-sub-item">
                          <div className="mini-sub-info">
                            <span className="mini-sub-name">{sub.name}</span>
                            <span className={`mini-sub-days ${daysLeft <= 5 ? 'due' : ''}`}>
                              {daysLeft}d left
                            </span>
                          </div>
                          <div className="mini-sub-amount">{formatCurrency(sub.amount)}</div>
                        </div>
                      );
                    })}
                    {subscriptions.length > 3 && (
                      <button className="view-all-link" onClick={() => setShowRecurringForm(true)}>
                        + {subscriptions.length - 3} more payments
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-card glass-card">
              <h3 className="sidebar-title">Recent Activity</h3>
              {expenses.slice(0, 5).map((exp) => {
                const cat = getCategoryData(exp.category);
                return (
                  <div key={exp.id} className="recent-item">
                    <div className="recent-dot" style={{ background: cat.color }}></div>
                    <div className="recent-info">
                      <span className="recent-name">{exp.title}</span>
                      <span className="recent-date">{formatDate(exp.date)}</span>
                    </div>
                    <span className="recent-amount">{formatCurrency(exp.amount)}</span>
                  </div>
                );
              })}
              {expenses.length === 0 && <p className="sidebar-empty">No recent activity</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={resetForm} id="expense-modal-overlay">
          <div className="modal glass-card animate-fadeInUp" onClick={(e) => e.stopPropagation()} id="expense-modal">
            <div className="modal-header">
              <h2>{editingId ? 'Edit Expense' : 'Add New Expense'}</h2>
              <button className="btn-icon" onClick={resetForm} id="modal-close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form" id="expense-form">
              <div className="input-group">
                <label htmlFor="expense-title">Title</label>
                <input
                  type="text"
                  id="expense-title"
                  className="input-field"
                  placeholder="e.g., Grocery Shopping"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className="modal-row">
                <div className="input-group">
                  <label htmlFor="expense-amount">Amount (₹)</label>
                  <input
                    type="number"
                    id="expense-amount"
                    className="input-field"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="expense-date">Date</label>
                  <input
                    type="date"
                    id="expense-date"
                    className="input-field"
                    value={form.date}
                    onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="expense-category">Category</label>
                <select
                  id="expense-category"
                  className="input-field"
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                >
                  {CATEGORIES.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="expense-notes">Notes (optional)</label>
                <textarea
                  id="expense-notes"
                  className="input-field modal-textarea"
                  placeholder="Add any notes..."
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" id="expense-submit">
                  <Check size={18} />
                  {editingId ? 'Update' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recurring Management Modal */}
      {showRecurringForm && (
        <div className="modal-overlay" onClick={() => setShowRecurringForm(false)}>
          <div className="modal glass-card animate-fadeInUp" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <div className="modal-header-with-icon">
                <Repeat size={20} className="accent-text" />
                <h2>Manage Recurring Payments</h2>
              </div>
              <button className="btn-icon" onClick={() => setShowRecurringForm(false)}><X size={20} /></button>
            </div>

            <div className="modal-body">
              <div className="sub-manager-list">
                {subscriptions.map(sub => (
                  <div key={sub.id} className="sub-manager-item">
                    <div className="sub-manager-info">
                      <strong>{sub.name}</strong>
                      <span>{formatCurrency(sub.amount)} / {sub.frequency}</span>
                    </div>
                    <button
                      className="btn-icon-sm action-delete"
                      onClick={() => setSubscriptions(prev => prev.filter(s => s.id !== sub.id))}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {subscriptions.length === 0 && <p className="sidebar-empty">No active subscriptions. Add one below.</p>}
              </div>

              <div className="sub-add-form">
                <h4>Add New Recurring</h4>
                <div className="modal-row">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Netflix"
                    id="new-sub-name"
                  />
                  <input
                    type="number"
                    className="input-field"
                    placeholder="Amount"
                    id="new-sub-amount"
                  />
                </div>
                <div className="modal-row">
                  <select className="input-field" id="new-sub-freq">
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      const name = document.getElementById('new-sub-name').value;
                      const amount = document.getElementById('new-sub-amount').value;
                      const freq = document.getElementById('new-sub-freq').value;
                      if (!name || !amount) return;

                      const newSub = {
                        id: Date.now().toString(),
                        name,
                        amount: parseFloat(amount),
                        frequency: freq,
                        nextDate: new Date().toISOString().split('T')[0]
                      };
                      setSubscriptions(prev => [...prev, newSub]);
                      document.getElementById('new-sub-name').value = '';
                      document.getElementById('new-sub-amount').value = '';
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
