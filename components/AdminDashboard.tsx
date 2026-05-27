'use client';

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Layers, Building, Bed, CreditCard, 
  ArrowUpFromLine, ArrowDownToLine, Users2, FileText, Bell, 
  Settings, LogOut, Search, Shield, Eye, Check, X, ShieldAlert, 
  ArrowUpRight, ArrowDownRight, Edit, Trash2, Mail, Phone, 
  Calendar, User, FileUp, CheckCircle, RefreshCw, ChevronRight, 
  Download, Plus, AlertCircle, Lock
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

// ==========================================
// MOCK DATA SEEDS
// ==========================================

const initialPlans = [
  { id: 'foundation', name: 'Foundation Plan', minAmount: 500, roi: 18, activeInvestors: 1450, totalInvested: 450000, enabled: true },
  { id: 'prosperity', name: 'Prosperity Plan', minAmount: 5000, roi: 24, activeInvestors: 2200, totalInvested: 1200000, enabled: true },
  { id: 'commercial', name: 'Commercial Property', minAmount: 40000, roi: 28, activeInvestors: 840, totalInvested: 550000, enabled: true },
  { id: 'luxury', name: 'Luxury Property', minAmount: 80000, roi: 35, activeInvestors: 357, totalInvested: 200000, enabled: true },
];

const initialInvestors = Array.from({ length: 45 }).map((_, idx) => {
  const plans = ['Foundation Plan', 'Prosperity Plan', 'Commercial Property', 'Luxury Property'];
  const statuses = ['Active', 'Active', 'Active', 'Pending', 'Suspended'];
  const firstNames = ['Emeka', 'Chinedu', 'Tunde', 'Olumide', 'John', 'Sarah', 'Grace', 'David', 'Fatima', 'Yusuf'];
  const lastNames = ['Okonkwo', 'Adebayor', 'Musa', 'Bello', 'Smith', 'Doe', 'Ojo', 'Nwachukwu', 'Ali', 'Ibrahim'];
  
  const fName = firstNames[idx % firstNames.length];
  const lName = lastNames[idx % lastNames.length];
  const status = statuses[idx % statuses.length];
  const plan = plans[idx % plans.length];
  const amountInvested = (idx + 1) * 7500 + 500;
  const returnsPaid = Math.floor(amountInvested * 0.22);
  const daysAgo = idx * 3 + 2;
  const joinDate = new Date();
  joinDate.setDate(joinDate.getDate() - daysAgo);

  return {
    id: `INV-${1000 + idx}`,
    name: `${fName} ${lName}`,
    email: `${fName.toLowerCase()}.${lName.toLowerCase()}${idx}@williston.com`,
    phone: `+234 80${idx % 9} 123 45${idx % 10}`,
    plan: plan,
    amountInvested: amountInvested,
    returnsPaid: returnsPaid,
    dateJoined: joinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    status: status,
    referralsCount: idx % 4,
    address: `${12 + idx} Herbert Macaulay Way, Yaba, Lagos`,
    docUploaded: idx % 3 === 0 ? 'International Passport.pdf' : idx % 3 === 1 ? 'Driver License.png' : 'Utility Bill.pdf'
  };
});

const initialWithdrawals = [
  { id: 'WD-8901', investorName: 'Emeka Okonkwo', email: 'emeka.okonkwo@williston.com', amount: 50000, bank: 'GTBank', accountNo: '0123455678', date: '2026-05-26', status: 'Pending' },
  { id: 'WD-8902', investorName: 'Olumide Adebayor', email: 'olumide@williston.com', amount: 120000, bank: 'Access Bank', accountNo: '0987654321', date: '2026-05-25', status: 'Pending' },
  { id: 'WD-8903', investorName: 'Chinedu Musa', email: 'chinedu@williston.com', amount: 35000, bank: 'Zenith Bank', accountNo: '0555666777', date: '2026-05-24', status: 'Approved' },
  { id: 'WD-8904', investorName: 'Sarah Smith', email: 'sarah@williston.com', amount: 150000, bank: 'UBA', accountNo: '0222333444', date: '2026-05-23', status: 'Rejected' },
  { id: 'WD-8905', investorName: 'Tunde Bello', email: 'tunde@williston.com', amount: 80000, bank: 'GTBank', accountNo: '0888999000', date: '2026-05-22', status: 'Pending' },
  { id: 'WD-8906', investorName: 'Grace Doe', email: 'grace@williston.com', amount: 95000, bank: 'Access Bank', accountNo: '0777111222', date: '2026-05-21', status: 'Pending' },
  { id: 'WD-8907', investorName: 'John Musa', email: 'john@williston.com', amount: 200000, bank: 'Sterling Bank', accountNo: '0666444888', date: '2026-05-20', status: 'Pending' },
  { id: 'WD-8908', investorName: 'Fatima Ali', email: 'fatima@williston.com', amount: 45000, bank: 'Zenith Bank', accountNo: '0444555666', date: '2026-05-19', status: 'Pending' },
  { id: 'WD-8909', investorName: 'David Ojo', email: 'david@williston.com', amount: 70000, bank: 'GTBank', accountNo: '0111222333', date: '2026-05-18', status: 'Pending' },
  { id: 'WD-8910', investorName: 'Yusuf Ibrahim', email: 'yusuf@williston.com', amount: 30000, bank: 'UBA', accountNo: '0333555777', date: '2026-05-17', status: 'Pending' },
  { id: 'WD-8911', investorName: 'Olumide adequacy', email: 'olumide.ad@williston.com', amount: 110000, bank: 'Access Bank', accountNo: '0111888222', date: '2026-05-16', status: 'Pending' },
  { id: 'WD-8912', investorName: 'Grace Nwachukwu', email: 'grace.n@williston.com', amount: 65000, bank: 'GTBank', accountNo: '0222444666', date: '2026-05-15', status: 'Pending' },
];

const initialDeposits = [
  { id: 'DP-7001', investorName: 'Tunde Adebayor', amount: 150000, method: 'Bank Transfer', reference: 'TXN-90281-GTB', date: '2026-05-27', status: 'Pending', receipt: 'https://picsum.photos/seed/receipt1/600/800' },
  { id: 'DP-7002', investorName: 'Emeka Musa', amount: 500000, method: 'Bank Transfer', reference: 'TXN-44281-ZEN', date: '2026-05-26', status: 'Confirmed', receipt: 'https://picsum.photos/seed/receipt2/600/800' },
  { id: 'DP-7003', investorName: 'Fatima Bello', amount: 80000, method: 'Bank Transfer', reference: 'TXN-11202-ACC', date: '2026-05-25', status: 'Failed', receipt: 'https://picsum.photos/seed/receipt3/600/800' },
  { id: 'DP-7004', investorName: 'David Nwachukwu', amount: 120000, method: 'Bank Transfer', reference: 'TXN-88273-UBA', date: '2026-05-24', status: 'Pending', receipt: 'https://picsum.photos/seed/receipt4/600/800' },
];

const initialTransactions = [
  { date: '2026-05-27', type: 'Deposit', investor: 'Tunde Adebayor', amount: 150000, balance: 2450000000, reference: 'TXN-90281-GTB', status: 'Pending' },
  { date: '2026-05-26', type: 'Withdrawal', investor: 'Chinedu Musa', amount: 35000, balance: 2449850000, reference: 'WD-8903-PAID', status: 'Completed' },
  { date: '2026-05-26', type: 'Deposit', investor: 'Emeka Musa', amount: 500000, balance: 2449885000, reference: 'TXN-44281-ZEN', status: 'Completed' },
  { date: '2026-05-25', type: 'New Investment', investor: 'Olumide adequacy', amount: 110000, balance: 2449385000, reference: 'INV-PLAN-PRO', status: 'Completed' },
  { date: '2026-05-25', type: 'Withdrawal Request', investor: 'Olumide Adebayor', amount: 120000, balance: 2449495000, reference: 'WD-8902', status: 'Pending' },
];

const barData = [
  { name: 'Jan', value: 380 },
  { name: 'Feb', value: 450 },
  { name: 'Mar', value: 610 },
  { name: 'Apr', value: 580 },
  { name: 'May', value: 720 },
  { name: 'Jun', value: 940 },
];

const pieData = [
  { name: 'Foundation', value: 35 },
  { name: 'Prosperity', value: 45 },
  { name: 'Commercial', value: 12 },
  { name: 'Luxury', value: 8 },
];

const CHART_COLORS = ['#0A1433', '#C9A84C', '#1E3A8A', '#4F46E5'];

export default function AdminDashboard() {
  // Authentication State
  const [loggedIn, setLoggedIn] = useState(false);
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutMsg, setLockoutMsg] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState('overview');

  // Core Data States
  const [investors, setInvestors] = useState(initialInvestors);
  const [plans, setPlans] = useState(initialPlans);
  const [withdrawals, setWithdrawals] = useState(initialWithdrawals);
  const [deposits, setDeposits] = useState(initialDeposits);
  const [transactions, setTransactions] = useState(initialTransactions);

  // Modals & Panels State
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [viewingReceipt, setViewingReceipt] = useState<any>(null);
  const [confirmApproveWD, setConfirmApproveWD] = useState<any>(null);
  const [confirmRejectWD, setConfirmRejectWD] = useState<any>(null);
  const [confirmDeleteInv, setConfirmDeleteInv] = useState<any>(null);
  const [editingInvestor, setEditingInvestor] = useState<any>(null);

  // Filters & Search
  const [searchInvestorQuery, setSearchInvestorQuery] = useState('');
  const [investorFilter, setInvestorFilter] = useState('All');
  const [withdrawalFilter, setWithdrawalFilter] = useState('Pending');
  const [depositFilter, setDepositFilter] = useState('Pending');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('All');
  const [transactionSearchQuery, setTransactionSearchQuery] = useState('');
  const [investorPage, setInvestorPage] = useState(1);

  // Bulk Actions
  const [selectedWithdrawalIds, setSelectedWithdrawalIds] = useState<string[]>([]);

  // Notifications State
  const [notifTarget, setNotifTarget] = useState('All Investors');
  const [notifChannel, setNotifChannel] = useState('All');
  const [notifSubject, setNotifSubject] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [broadcastAlert, setBroadcastAlert] = useState('');

  // Settings State
  const [settingsTab, setSettingsTab] = useState('general');
  const [settingsGeneral, setSettingsGeneral] = useState({
    siteName: 'Williston Board of Realtors & Investments',
    email: 'support@williston.app',
    phone: '+1 (713) 000-0000',
    address: 'Houston Financial Center, Houston, TX'
  });
  const [settingsExchangeRates, setSettingsExchangeRates] = useState({
    usd: 1550,
    gbp: 1940,
    eur: 1680
  });
  const [settingsPayments, setSettingsPayments] = useState({
    bankName: 'Guaranty Trust Bank (GTB)',
    accountName: 'Williston Real Estate & Wealth Management LTD',
    accountNo: '0691238472'
  });
  const [settingsSecurity, setSettingsSecurity] = useState({
    newPassword: '',
    confirmPassword: '',
    twoFactor: true,
    sessionTimeout: 30
  });

  // Recent Actions Log
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, time: '10 mins ago', investor: 'Emeka Okonkwo', action: 'Withdrawal Request', amount: '₦50,000', status: 'Pending' },
    { id: 2, time: '25 mins ago', investor: 'Tunde Adebayor', action: 'New Registration', amount: '-', status: 'Completed' },
    { id: 3, time: '1 hour ago', investor: 'Emeka Musa', action: 'Deposit Confirmed', amount: '₦500,000', status: 'Completed' },
    { id: 4, time: '2 hours ago', investor: 'Olumide Adebayor', action: 'Withdrawal Request', amount: '₦120,000', status: 'Pending' },
    { id: 5, time: '4 hours ago', investor: 'Grace Ojo', action: 'New Investment', amount: '₦75,000', status: 'Completed' },
    { id: 6, time: '1 day ago', investor: 'Fatima Bello', action: 'Deposit Confirmed', amount: '₦80,000', status: 'Completed' },
    { id: 7, time: '1 day ago', investor: 'John Smith', action: 'Property Enquiry', amount: '-', status: 'Replied' },
    { id: 8, time: '2 days ago', investor: 'Sarah Doe', action: 'New Investment', amount: '₦150,000', status: 'Completed' },
    { id: 9, time: '2 days ago', investor: 'Tunde Bello', action: 'New Registration', amount: '-', status: 'Completed' },
    { id: 10, time: '3 days ago', investor: 'Olumide Adebayor', action: 'Deposit Confirmed', amount: '₦30,000', status: 'Completed' },
  ]);

  // Load session storage
  useEffect(() => {
    const isAuthed = sessionStorage.getItem('admin_authenticated');
    if (isAuthed === 'true') {
      setLoggedIn(true);
    }
  }, []);

  // Authentication Lockout Check
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (failedAttempts >= 3) {
      setLockoutMsg('Unauthorized Access! Your session has been locked due to 3 failed login attempts.');
      return;
    }

    if (authUsername === 'willistonadmin' && authPassword === 'admin2025') {
      setLoggedIn(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setLoginError('');
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      if (nextAttempts >= 3) {
        setLockoutMsg('Unauthorized Access! Your session has been locked due to 3 failed login attempts.');
      } else {
        setLoginError(`Invalid username or password. Attempt ${nextAttempts} of 3.`);
      }
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    sessionStorage.removeItem('admin_authenticated');
    setAuthUsername('');
    setAuthPassword('');
    setFailedAttempts(0);
    setLockoutMsg('');
    setActiveTab('overview');
  };

  // Broadcast Handler
  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifSubject.trim() || !notifBody.trim()) return;

    setBroadcastAlert(`Successfully broadcasted notification via ${notifChannel} to ${notifTarget}!`);
    setTimeout(() => setBroadcastAlert(''), 4000);

    // Add to recent activity
    const newAct = {
      id: Date.now(),
      time: 'Just now',
      investor: notifTarget,
      action: `Broadcast: ${notifSubject}`,
      amount: '-',
      status: 'Sent'
    };
    setRecentActivities(prev => [newAct, ...prev.slice(0, 9)]);

    setNotifSubject('');
    setNotifBody('');
  };

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'Returns Credited') {
      setNotifSubject('Daily Profit Returns Credited');
      setNotifBody('Hello,\n\nWe are pleased to inform you that your profit returns for the active investment cycle have been calculated and credited to your wallet. You can view or request withdrawal via the dashboard wallet tab.\n\nThank you for investing with Williston.');
    } else if (val === 'New Property Listed') {
      setNotifSubject('New Premium Investment Property Listed!');
      setNotifBody('Dear Investor,\n\nA new commercial housing development in River Oaks, Houston has been listed for co-ownership. Lock in your shares now to yield an estimated 28% annual return.\n\nBest Regards,\nWilliston Investment Team');
    } else if (val === 'Plan Expiry Reminder') {
      setNotifSubject('Investment Plan Maturity Reminder');
      setNotifBody('Hello,\n\nThis is to notify you that your current investment plan will reach its maturity date in 7 days. Your capital and returns will be paid directly into your primary bank account.\n\nVerify your details remain correct.');
    } else if (val === 'Welcome New Investor') {
      setNotifSubject('Welcome to Williston Wealth Platform');
      setNotifBody('Dear Investor,\n\nWelcome to Williston Board of Realtors & Investments! We are excited to support you on your wealth generation journey. Complete your verification to initiate your first investment.');
    }
  };

  // Withdrawals Approval
  const handleApproveWithdrawal = () => {
    if (!confirmApproveWD) return;
    
    // Update local state
    setWithdrawals(prev => 
      prev.map(w => w.id === confirmApproveWD.id ? { ...w, status: 'Approved' } : w)
    );

    // Add to transaction ledger
    const newTx = {
      date: new Date().toISOString().split('T')[0],
      type: 'Withdrawal',
      investor: confirmApproveWD.investorName,
      amount: confirmApproveWD.amount,
      balance: 2449815000,
      reference: `${confirmApproveWD.id}-PAID`,
      status: 'Completed'
    };
    setTransactions(prev => [newTx, ...prev]);

    // Log in recent activity
    const newAct = {
      id: Date.now(),
      time: 'Just now',
      investor: confirmApproveWD.investorName,
      action: 'Withdrawal Approved',
      amount: `₦${confirmApproveWD.amount.toLocaleString()}`,
      status: 'Completed'
    };
    setRecentActivities(prev => [newAct, ...prev.slice(0, 9)]);

    setConfirmApproveWD(null);
  };

  // Bulk Actions
  const handleBulkApprove = () => {
    if (selectedWithdrawalIds.length === 0) return;

    setWithdrawals(prev => 
      prev.map(w => selectedWithdrawalIds.includes(w.id) ? { ...w, status: 'Approved' } : w)
    );

    selectedWithdrawalIds.forEach(id => {
      const wd = withdrawals.find(w => w.id === id);
      if (wd) {
        // Add to transaction ledger
        const newTx = {
          date: new Date().toISOString().split('T')[0],
          type: 'Withdrawal',
          investor: wd.investorName,
          amount: wd.amount,
          balance: 2449815000,
          reference: `${wd.id}-PAID`,
          status: 'Completed'
        };
        setTransactions(prev => [newTx, ...prev]);
      }
    });

    setSelectedWithdrawalIds([]);
  };

  const handleBulkReject = () => {
    if (selectedWithdrawalIds.length === 0) return;

    setWithdrawals(prev => 
      prev.map(w => selectedWithdrawalIds.includes(w.id) ? { ...w, status: 'Rejected' } : w)
    );
    setSelectedWithdrawalIds([]);
  };

  // Deposits Confirm/Reject
  const handleConfirmDeposit = (dep: any) => {
    setDeposits(prev => 
      prev.map(d => d.id === dep.id ? { ...d, status: 'Confirmed' } : d)
    );

    // Add to transaction ledger
    const newTx = {
      date: new Date().toISOString().split('T')[0],
      type: 'Deposit',
      investor: dep.investorName,
      amount: dep.amount,
      balance: 2450385000,
      reference: dep.reference,
      status: 'Completed'
    };
    setTransactions(prev => [newTx, ...prev]);

    // Update investor balance inside initial list
    setInvestors(prev => 
      prev.map(inv => inv.name === dep.investorName ? { ...inv, amountInvested: inv.amountInvested + dep.amount } : inv)
    );

    // Log in recent activity
    const newAct = {
      id: Date.now(),
      time: 'Just now',
      investor: dep.investorName,
      action: 'Deposit Confirmed',
      amount: `₦${dep.amount.toLocaleString()}`,
      status: 'Completed'
    };
    setRecentActivities(prev => [newAct, ...prev.slice(0, 9)]);
  };

  const handleRejectDeposit = (dep: any) => {
    setDeposits(prev => 
      prev.map(d => d.id === dep.id ? { ...d, status: 'Failed' } : d)
    );
  };

  // Plans update
  const handleSavePlanSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    setPlans(prev => 
      prev.map(p => p.id === editingPlan.id ? { ...editingPlan } : p)
    );
    setEditingPlan(null);
  };

  // Delete Investor
  const handleDeleteInvestor = () => {
    if (!confirmDeleteInv) return;
    setInvestors(prev => prev.filter(inv => inv.id !== confirmDeleteInv.id));
    setConfirmDeleteInv(null);
    if (selectedInvestor?.id === confirmDeleteInv.id) {
      setSelectedInvestor(null);
    }
  };

  // Edit Investor
  const handleSaveInvestorEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvestor) return;
    
    setInvestors(prev => 
      prev.map(inv => inv.id === editingInvestor.id ? { ...editingInvestor } : inv)
    );

    if (selectedInvestor?.id === editingInvestor.id) {
      setSelectedInvestor(editingInvestor);
    }

    setEditingInvestor(null);
  };

  // Export CSV simulation
  const handleExportCSV = () => {
    const headers = 'Date,Type,Investor,Amount,Balance,Reference,Status\n';
    const rows = transactions.map(t => `${t.date},${t.type},${t.investor},${t.amount},${t.balance},${t.reference},${t.status}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `williston_transactions_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  // Calculate pending counts
  const pendingWithdrawalsCount = withdrawals.filter(w => w.status === 'Pending').length;
  const pendingDepositsCount = deposits.filter(d => d.status === 'Pending').length;

  // Filtered lists
  const filteredInvestors = investors.filter(inv => {
    const matchesSearch = inv.name.toLowerCase().includes(searchInvestorQuery.toLowerCase()) || 
                          inv.email.toLowerCase().includes(searchInvestorQuery.toLowerCase()) ||
                          inv.id.toLowerCase().includes(searchInvestorQuery.toLowerCase());
    
    if (investorFilter === 'All') return matchesSearch;
    if (investorFilter === 'Active') return matchesSearch && inv.status === 'Active';
    if (investorFilter === 'Inactive') return matchesSearch && inv.status === 'Suspended';
    if (investorFilter === 'Pending Verification') return matchesSearch && inv.status === 'Pending';
    return matchesSearch;
  });

  const filteredWithdrawals = withdrawals.filter(w => {
    if (withdrawalFilter === 'All') return true;
    return w.status === withdrawalFilter;
  });

  const filteredDeposits = deposits.filter(d => {
    if (depositFilter === 'All') return true;
    return d.status === depositFilter;
  });

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.investor.toLowerCase().includes(transactionSearchQuery.toLowerCase()) ||
                          t.reference.toLowerCase().includes(transactionSearchQuery.toLowerCase());
    const matchesType = transactionTypeFilter === 'All' ? true : t.type.toLowerCase().includes(transactionTypeFilter.toLowerCase());
    return matchesSearch && matchesType;
  });

  // Investor Pagination details
  const itemsPerPage = 20;
  const totalInvestorPages = Math.ceil(filteredInvestors.length / itemsPerPage);
  const displayedInvestors = filteredInvestors.slice(
    (investorPage - 1) * itemsPerPage,
    investorPage * itemsPerPage
  );

  // ==========================================
  // VIEW: FAKE LOGIN GATE
  // ==========================================

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold via-navy to-navy pointer-events-none"></div>
        <div className="w-full max-w-md bg-navy-light/60 backdrop-blur-md border border-border-subtle rounded-2xl p-8 relative z-10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold flex items-center justify-center text-gold mb-4 shadow-lg animate-pulse">
              <Lock size={28} />
            </div>
            <h1 className="text-2xl font-serif text-white font-bold tracking-wider">Admin Access Only</h1>
            <p className="text-gray-text text-sm mt-1">Provide credentials to enter platform manager</p>
          </div>

          {lockoutMsg ? (
            <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl flex items-start gap-3 mb-6 text-red-200 text-sm">
              <ShieldAlert size={20} className="shrink-0 text-red-500" />
              <div>
                <div className="font-bold text-red-400">Lockout Triggered</div>
                <div>{lockoutMsg}</div>
                <div className="text-xs text-red-500/80 mt-2">Contact technical security manager to restore administration portal session.</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {loginError && (
                <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-text/50"><User size={16} /></span>
                  <input 
                    type="text" 
                    required 
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    className="w-full bg-navy border border-border-subtle rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-gold"
                    placeholder="Enter admin username"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-text/50"><Lock size={16} /></span>
                  <input 
                    type="password" 
                    required 
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-navy border border-border-subtle rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-gold"
                    placeholder="••••••••"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-3.5 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl transition shadow-lg shadow-gold/10"
                suppressHydrationWarning
              >
                Access Portal
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-border-subtle/50 text-center text-[10px] text-gray-text/50 uppercase tracking-widest font-mono">
            Williston Board of Realtors &copy; 2026
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: MAIN ADMIN DASHBOARD
  // ==========================================

  return (
    <div className="min-h-screen bg-navy text-white flex">
      {/* Sidebar - Dark Charcoal Sidebar #060D1A */}
      <aside className="w-64 bg-[#060D1A] border-r border-border-subtle flex flex-col shrink-0">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold flex items-center justify-center text-gold font-serif font-bold text-lg">W</div>
            <div>
              <div className="font-serif text-sm font-bold tracking-wider text-gold">WILLISTON ADMIN</div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gold"></span> Staff Portal
              </div>
            </div>
          </div>
        </div>

        {/* Admin profile detail card */}
        <div className="p-4 mx-4 my-4 bg-navy-light/40 border border-border-subtle/40 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-bold">SA</div>
          <div>
            <div className="text-xs font-semibold text-white flex items-center gap-1">
              Super Admin 
              <span className="text-[10px] bg-gold/20 text-gold px-1 rounded-sm border border-gold/10 flex items-center"><Shield size={10} className="mr-0.5" /></span>
            </div>
            <div className="text-[10px] text-gray-text/60">willistonadmin</div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-1">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'overview' ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white hover:bg-navy-light/20'
            }`}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          
          <button 
            onClick={() => setActiveTab('investors')} 
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'investors' ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white hover:bg-navy-light/20'
            }`}
          >
            <Users size={18} /> All Investors
          </button>

          <button 
            onClick={() => setActiveTab('plans')} 
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'plans' ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white hover:bg-navy-light/20'
            }`}
          >
            <Layers size={18} /> Investment Plans
          </button>

          <button 
            onClick={() => {}} 
            disabled
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 cursor-not-allowed opacity-50"
          >
            <Building size={18} /> Properties <span className="text-[9px] bg-gray-700 text-gray-300 px-1 rounded ml-auto">Hold</span>
          </button>

          <button 
            onClick={() => {}} 
            disabled
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 cursor-not-allowed opacity-50"
          >
            <Bed size={18} /> Rentals <span className="text-[9px] bg-gray-700 text-gray-300 px-1 rounded ml-auto">Hold</span>
          </button>

          <button 
            onClick={() => setActiveTab('transactions')} 
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'transactions' ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white hover:bg-navy-light/20'
            }`}
          >
            <CreditCard size={18} /> Transactions
          </button>

          <button 
            onClick={() => setActiveTab('withdrawals')} 
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'withdrawals' ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white hover:bg-navy-light/20'
            }`}
          >
            <ArrowUpFromLine size={18} /> Withdrawals 
            {pendingWithdrawalsCount > 0 && (
              <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === 'withdrawals' ? 'bg-navy text-gold' : 'bg-red-500 text-white'
              }`}>{pendingWithdrawalsCount}</span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('deposits')} 
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'deposits' ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white hover:bg-navy-light/20'
            }`}
          >
            <ArrowDownToLine size={18} /> Deposits 
            {pendingDepositsCount > 0 && (
              <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === 'deposits' ? 'bg-gold/20 text-gold' : 'bg-amber-500 text-navy'
              }`}>{pendingDepositsCount}</span>
            )}
          </button>

          <button 
            onClick={() => {}} 
            disabled
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 cursor-not-allowed opacity-50"
          >
            <Users2 size={18} /> Referrals
          </button>

          <button 
            onClick={() => {}} 
            disabled
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 cursor-not-allowed opacity-50"
          >
            <FileText size={18} /> Blog / News
          </button>

          <button 
            onClick={() => setActiveTab('notifications')} 
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'notifications' ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white hover:bg-navy-light/20'
            }`}
          >
            <Bell size={18} /> Broadcast
          </button>

          <button 
            onClick={() => setActiveTab('settings')} 
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'settings' ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white hover:bg-navy-light/20'
            }`}
          >
            <Settings size={18} /> Settings
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border-subtle">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col bg-navy">
        
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-border-subtle bg-navy-mid flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-gold" />
            <span className="text-xs uppercase tracking-wider text-gold font-bold">Super Admin Panel</span>
          </div>

          <div className="flex items-center gap-6">
            {/* Live NGN Rate */}
            <div className="text-xs bg-navy/60 border border-border-subtle px-3.5 py-1.5 rounded-lg flex items-center gap-2 text-gray-text">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Exchange Rate: <strong className="text-white">₦{settingsExchangeRates.usd} / USD</strong>
            </div>

            {/* Time Stamp */}
            <div className="text-xs text-gray-text font-mono flex items-center gap-1.5">
              <Calendar size={14} /> 2026-05-27
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="p-8 max-w-6xl w-full mx-auto space-y-8">

          {/* ==========================================
              TAB VIEW: OVERVIEW
              ========================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Heading */}
              <div>
                <h1 className="text-3xl font-serif font-bold text-white mb-2">System Overview</h1>
                <p className="text-gray-text text-sm">Real-time metrics, active plan distributions, and client actions.</p>
              </div>

              {/* 6 KPI Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="bg-navy-mid border border-border-subtle rounded-xl p-5">
                  <div className="text-[10px] text-gray-text uppercase tracking-wider font-bold mb-1">Total Investors</div>
                  <div className="text-xl font-bold font-serif text-white">4,847</div>
                  <div className="text-[9px] text-green-400 mt-2 flex items-center"><ArrowUpRight size={10} className="mr-0.5" /> +28 this week</div>
                </div>

                <div className="bg-navy-mid border border-border-subtle rounded-xl p-5">
                  <div className="text-[10px] text-gray-text uppercase tracking-wider font-bold mb-1">Funds Invested</div>
                  <div className="text-xl font-bold font-serif text-white">₦2.4B</div>
                  <div className="text-[9px] text-green-400 mt-2 flex items-center"><ArrowUpRight size={10} className="mr-0.5" /> +₦45M monthly</div>
                </div>

                <div className="bg-navy-mid border border-border-subtle rounded-xl p-5">
                  <div className="text-[10px] text-gray-text uppercase tracking-wider font-bold mb-1">Returns Paid</div>
                  <div className="text-xl font-bold font-serif text-white">₦485M</div>
                  <div className="text-[9px] text-gray-500 mt-2">Paid on maturity</div>
                </div>

                <div className="bg-navy-mid border border-border-subtle rounded-xl p-5 relative">
                  <div className="text-[10px] text-gray-text uppercase tracking-wider font-bold mb-1">Pending WD</div>
                  <div className="text-xl font-bold font-serif text-white flex items-center gap-2">
                    {pendingWithdrawalsCount}
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping absolute top-5 right-5"></span>
                  </div>
                  <div className="text-[9px] text-red-400 mt-2 font-bold cursor-pointer hover:underline" onClick={() => { setActiveTab('withdrawals'); setWithdrawalFilter('Pending'); }}>Needs Approval</div>
                </div>

                <div className="bg-navy-mid border border-border-subtle rounded-xl p-5">
                  <div className="text-[10px] text-gray-text uppercase tracking-wider font-bold mb-1">Active Properties</div>
                  <div className="text-xl font-bold font-serif text-white">8</div>
                  <div className="text-[9px] text-gold mt-2">3 Under Dev</div>
                </div>

                <div className="bg-navy-mid border border-border-subtle rounded-xl p-5">
                  <div className="text-[10px] text-gray-text uppercase tracking-wider font-bold mb-1">Monthly Rev</div>
                  <div className="text-xl font-bold font-serif text-gold">₦48M</div>
                  <div className="text-[9px] text-green-400 mt-2 flex items-center"><ArrowUpRight size={10} className="mr-0.5" /> +5% vs April</div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left: Bar Chart */}
                <div className="bg-navy-mid border border-border-subtle rounded-xl p-6 flex flex-col">
                  <h3 className="text-md font-serif text-gold mb-6 font-semibold">New Investors per Month (Jan - Jun)</h3>
                  <div className="h-[240px] w-full mt-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#04091A', borderColor: '#ffffff20', borderRadius: '8px' }} />
                        <Bar dataKey="value" fill="#C9A84C" radius={[4, 4, 0, 0]} maxBarSize={30} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right: Donut Chart */}
                <div className="bg-navy-mid border border-border-subtle rounded-xl p-6 flex flex-col">
                  <h3 className="text-md font-serif text-gold mb-6 font-semibold">Investment Distribution by Plan</h3>
                  <div className="h-[180px] w-full flex items-center justify-center relative my-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={4}
                          dataKey="value"
                          stroke="none"
                          isAnimationActive={false}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#04091A', borderColor: '#ffffff20', borderRadius: '8px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl font-bold font-serif">100%</span>
                      <span className="text-[10px] text-gray-text">Co-owned</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {pieData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[index] }}></div>
                        <span className="text-[11px] text-gray-text">{entry.name} ({entry.value}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity Table */}
              <div className="bg-navy-mid border border-border-subtle rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border-subtle">
                  <h3 className="text-md font-serif font-bold text-white">Recent Activity</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-navy-light/40 text-gray-text text-xs uppercase tracking-wider">
                        <th className="p-4 font-semibold">Time</th>
                        <th className="p-4 font-semibold">Investor</th>
                        <th className="p-4 font-semibold">Action</th>
                        <th className="p-4 font-semibold">Amount</th>
                        <th className="p-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {recentActivities.map((act) => (
                        <tr key={act.id} className="hover:bg-navy-light/20 transition-colors">
                          <td className="p-4 text-gray-text text-xs">{act.time}</td>
                          <td className="p-4 font-medium text-white">{act.investor}</td>
                          <td className="p-4 text-gray-300">{act.action}</td>
                          <td className="p-4 font-mono text-gold">{act.amount}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                              act.status === 'Completed' || act.status === 'Sent' || act.status === 'Replied'
                                ? 'bg-green-500/10 text-green-400' 
                                : 'bg-amber-500/10 text-amber-400'
                            }`}>{act.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==========================================
              TAB VIEW: ALL INVESTORS
              ========================================== */}
          {activeTab === 'investors' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Header */}
              <div>
                <h1 className="text-3xl font-serif font-bold text-white mb-2">Investors Management</h1>
                <p className="text-gray-text text-sm">Review register database details, audit balances, and update verify statuses.</p>
              </div>

              {/* Filters & Search Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-mid border border-border-subtle rounded-xl p-4">
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'Active', 'Pending Verification', 'Inactive'].map((f) => (
                    <button
                      key={f}
                      onClick={() => { setInvestorFilter(f); setInvestorPage(1); }}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                        investorFilter === f ? 'bg-gold text-navy font-bold shadow-lg' : 'text-gray-text hover:text-white hover:bg-navy-light/30'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-80">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-text/50"><Search size={14} /></span>
                  <input
                    type="text"
                    placeholder="Search by ID, name, email..."
                    value={searchInvestorQuery}
                    onChange={(e) => { setSearchInvestorQuery(e.target.value); setInvestorPage(1); }}
                    className="w-full bg-navy border border-border-subtle rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="bg-navy-mid border border-border-subtle rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-navy-light/40 text-gray-text text-xs uppercase tracking-wider">
                        <th className="p-4 font-semibold">ID</th>
                        <th className="p-4 font-semibold">Name</th>
                        <th className="p-4 font-semibold">Email</th>
                        <th className="p-4 font-semibold">Primary Plan</th>
                        <th className="p-4 font-semibold">Invested</th>
                        <th className="p-4 font-semibold">Returns Paid</th>
                        <th className="p-4 font-semibold font-mono">Joined</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {displayedInvestors.map((inv) => (
                        <tr key={inv.id} className="hover:bg-navy-light/20 transition-colors">
                          <td className="p-4 font-mono text-xs text-gray-text">{inv.id}</td>
                          <td className="p-4 font-semibold text-white">{inv.name}</td>
                          <td className="p-4 text-xs text-gray-300">{inv.email}</td>
                          <td className="p-4 text-xs text-gold font-medium">{inv.plan}</td>
                          <td className="p-4 font-mono text-xs">₦{inv.amountInvested.toLocaleString()}</td>
                          <td className="p-4 font-mono text-xs text-green-400">₦{inv.returnsPaid.toLocaleString()}</td>
                          <td className="p-4 text-xs text-gray-text font-mono">{inv.dateJoined}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                              inv.status === 'Active' ? 'bg-green-500/10 text-green-400' :
                              inv.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                              'bg-red-500/10 text-red-400'
                            }`}>{inv.status}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => setSelectedInvestor(inv)} 
                                className="px-2 py-1 bg-navy border border-border-subtle rounded text-[10px] hover:border-gold transition flex items-center gap-1"
                              >
                                <Eye size={10} /> Profile
                              </button>
                              <button 
                                onClick={() => setEditingInvestor({ ...inv })} 
                                className="p-1 bg-navy border border-border-subtle rounded text-gray-text hover:text-gold hover:border-gold transition"
                                title="Edit"
                              >
                                <Edit size={10} />
                              </button>
                              <button 
                                onClick={() => setConfirmDeleteInv(inv)} 
                                className="p-1 bg-navy border border-border-subtle rounded text-red-400 hover:bg-red-500/10 hover:border-red-500 transition"
                                title="Delete"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {displayedInvestors.length === 0 && (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-gray-text text-sm">No investors found matching the filter query.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalInvestorPages > 1 && (
                  <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-between bg-navy-light/20">
                    <span className="text-xs text-gray-text">
                      Showing Page <strong>{investorPage}</strong> of <strong>{totalInvestorPages}</strong> ({filteredInvestors.length} total records)
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setInvestorPage(prev => Math.max(prev - 1, 1))}
                        disabled={investorPage === 1}
                        className="px-3 py-1.5 bg-navy border border-border-subtle rounded-lg text-xs font-semibold hover:border-gold disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setInvestorPage(prev => Math.min(prev + 1, totalInvestorPages))}
                        disabled={investorPage === totalInvestorPages}
                        className="px-3 py-1.5 bg-navy border border-border-subtle rounded-lg text-xs font-semibold hover:border-gold disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==========================================
              TAB VIEW: PLANS MANAGEMENT
              ========================================== */}
          {activeTab === 'plans' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Header */}
              <div>
                <h1 className="text-3xl font-serif font-bold text-white mb-2">Investment Plans</h1>
                <p className="text-gray-text text-sm">Update investment return percentages, minimum plan prices, and activate/deactivate packages.</p>
              </div>

              {/* Plans Table */}
              <div className="bg-navy-mid border border-border-subtle rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-navy-light/40 text-gray-text text-xs uppercase tracking-wider">
                        <th className="p-4 font-semibold">Plan Name</th>
                        <th className="p-4 font-semibold">Minimum Amount</th>
                        <th className="p-4 font-semibold">Annual ROI %</th>
                        <th className="p-4 font-semibold">Active Investors</th>
                        <th className="p-4 font-semibold">Total Funds Invested</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {plans.map((p) => (
                        <tr key={p.id} className={`hover:bg-navy-light/20 transition-colors ${!p.enabled ? 'opacity-50' : ''}`}>
                          <td className="p-4 font-bold text-white">{p.name}</td>
                          <td className="p-4 font-mono text-gold">${p.minAmount.toLocaleString()}</td>
                          <td className="p-4 font-mono font-bold text-green-400">{p.roi}%</td>
                          <td className="p-4 text-gray-300">{p.activeInvestors}</td>
                          <td className="p-4 font-mono">${p.totalInvested.toLocaleString()}</td>
                          <td className="p-4">
                            <button
                              onClick={() => setPlans(prev => prev.map(item => item.id === p.id ? { ...item, enabled: !item.enabled } : item))}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                p.enabled ? 'bg-gold' : 'bg-gray-700'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-navy shadow ring-0 transition duration-200 ease-in-out ${
                                  p.enabled ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center">
                              <button
                                onClick={() => setEditingPlan({ ...p })}
                                className="px-3 py-1.5 bg-navy border border-border-subtle rounded-lg text-xs font-semibold hover:border-gold hover:text-gold transition flex items-center gap-1.5"
                              >
                                <Edit size={12} /> Edit Config
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==========================================
              TAB VIEW: WITHDRAWALS
              ========================================== */}
          {activeTab === 'withdrawals' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Header */}
              <div>
                <h1 className="text-3xl font-serif font-bold text-white mb-2">Withdrawal Approvals</h1>
                <p className="text-gray-text text-sm">Approve payout settlements. Check banking accounts details prior to confirming GTBank ACH/Zelle/Crypto transfers.</p>
              </div>

              {/* Filters & Bulk Actions Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-mid border border-border-subtle rounded-xl p-4">
                <div className="flex gap-1.5">
                  {['Pending', 'Approved', 'Rejected', 'All'].map((s) => (
                    <button
                      key={s}
                      onClick={() => { setWithdrawalFilter(s); setSelectedWithdrawalIds([]); }}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                        withdrawalFilter === s ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white hover:bg-navy-light/30'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Bulk Actions Button */}
                {selectedWithdrawalIds.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-text font-bold">{selectedWithdrawalIds.length} Selected:</span>
                    <button 
                      onClick={handleBulkApprove} 
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-bold transition"
                    >
                      Approve Selected
                    </button>
                    <button 
                      onClick={handleBulkReject} 
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition"
                    >
                      Reject Selected
                    </button>
                  </div>
                )}
              </div>

              {/* Table */}
              <div className="bg-navy-mid border border-border-subtle rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-navy-light/40 text-gray-text text-xs uppercase tracking-wider">
                        <th className="p-4 font-semibold w-10 text-center">
                          <input 
                            type="checkbox"
                            className="rounded accent-gold"
                            checked={filteredWithdrawals.length > 0 && selectedWithdrawalIds.length === filteredWithdrawals.filter(w => w.status === 'Pending').length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedWithdrawalIds(filteredWithdrawals.filter(w => w.status === 'Pending').map(w => w.id));
                              } else {
                                setSelectedWithdrawalIds([]);
                              }
                            }}
                          />
                        </th>
                        <th className="p-4 font-semibold">ID</th>
                        <th className="p-4 font-semibold">Investor Name</th>
                        <th className="p-4 font-semibold">Payout Amount</th>
                        <th className="p-4 font-semibold">Bank / Crypto</th>
                        <th className="p-4 font-semibold">Account Address</th>
                        <th className="p-4 font-semibold font-mono">Req. Date</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {filteredWithdrawals.map((w) => (
                        <tr 
                          key={w.id} 
                          className={`hover:bg-navy-light/20 transition-colors ${
                            w.status === 'Pending' ? 'border-l-4 border-l-amber-500' : ''
                          }`}
                        >
                          <td className="p-4 text-center">
                            {w.status === 'Pending' && (
                              <input 
                                type="checkbox"
                                className="rounded accent-gold"
                                checked={selectedWithdrawalIds.includes(w.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedWithdrawalIds(prev => [...prev, w.id]);
                                  } else {
                                    setSelectedWithdrawalIds(prev => prev.filter(id => id !== w.id));
                                  }
                                }}
                              />
                            )}
                          </td>
                          <td className="p-4 font-mono text-xs text-gray-text">{w.id}</td>
                          <td className="p-4 font-semibold text-white">
                            <div>{w.investorName}</div>
                            <div className="text-[10px] text-gray-500 font-normal">{w.email}</div>
                          </td>
                          <td className="p-4 font-mono font-bold text-gold">₦{w.amount.toLocaleString()}</td>
                          <td className="p-4 font-semibold text-gray-200">{w.bank}</td>
                          <td className="p-4 font-mono text-xs text-gray-300">{w.accountNo}</td>
                          <td className="p-4 text-xs text-gray-text font-mono">{w.date}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                              w.status === 'Approved' ? 'bg-green-500/10 text-green-400' :
                              w.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                              'bg-red-500/10 text-red-400'
                            }`}>{w.status}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              {w.status === 'Pending' ? (
                                <>
                                  <button 
                                    onClick={() => setConfirmApproveWD(w)} 
                                    className="px-2.5 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-[10px] font-bold transition flex items-center gap-1"
                                  >
                                    <Check size={10} /> Approve
                                  </button>
                                  <button 
                                    onClick={() => setConfirmRejectWD(w)} 
                                    className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold transition flex items-center gap-1"
                                  >
                                    <X size={10} /> Reject
                                  </button>
                                </>
                              ) : (
                                <span className="text-[10px] text-gray-text/50 font-mono italic">Audit Log Sealed</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredWithdrawals.length === 0 && (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-gray-text text-sm">No withdrawal payouts found matching filter.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==========================================
              TAB VIEW: DEPOSITS
              ========================================== */}
          {activeTab === 'deposits' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Header */}
              <div>
                <h1 className="text-3xl font-serif font-bold text-white mb-2">Deposit Confirmations</h1>
                <p className="text-gray-text text-sm">Verify wire deposits and bank receipt proof uploads. Approve to update account balances.</p>
              </div>

              {/* Filters */}
              <div className="flex bg-navy-mid border border-border-subtle rounded-xl p-4">
                <div className="flex gap-1.5">
                  {['Pending', 'Confirmed', 'Failed', 'All'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setDepositFilter(s)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                        depositFilter === s ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white hover:bg-navy-light/30'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="bg-navy-mid border border-border-subtle rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-navy-light/40 text-gray-text text-xs uppercase tracking-wider">
                        <th className="p-4 font-semibold">ID</th>
                        <th className="p-4 font-semibold">Investor Name</th>
                        <th className="p-4 font-semibold">Amount</th>
                        <th className="p-4 font-semibold">Method</th>
                        <th className="p-4 font-semibold">Reference code</th>
                        <th className="p-4 font-semibold font-mono">Date</th>
                        <th className="p-4 font-semibold text-center">Receipt Proof</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {filteredDeposits.map((d) => (
                        <tr key={d.id} className="hover:bg-navy-light/20 transition-colors">
                          <td className="p-4 font-mono text-xs text-gray-text">{d.id}</td>
                          <td className="p-4 font-semibold text-white">{d.investorName}</td>
                          <td className="p-4 font-mono font-bold text-gold">₦{d.amount.toLocaleString()}</td>
                          <td className="p-4 text-xs">{d.method}</td>
                          <td className="p-4 font-mono text-xs text-gray-300">{d.reference}</td>
                          <td className="p-4 text-xs text-gray-text font-mono">{d.date}</td>
                          <td className="p-4">
                            <div className="flex justify-center">
                              <button 
                                onClick={() => setViewingReceipt(d)}
                                className="px-2.5 py-1 bg-navy border border-border-subtle hover:border-gold rounded text-[10px] transition flex items-center gap-1 text-gold"
                              >
                                <Eye size={10} /> View Proof
                              </button>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                              d.status === 'Confirmed' ? 'bg-green-500/10 text-green-400' :
                              d.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                              'bg-red-500/10 text-red-400'
                            }`}>{d.status}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              {d.status === 'Pending' ? (
                                <>
                                  <button 
                                    onClick={() => handleConfirmDeposit(d)} 
                                    className="px-2.5 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-[10px] font-bold transition flex items-center gap-1"
                                  >
                                    <Check size={10} /> Confirm
                                  </button>
                                  <button 
                                    onClick={() => handleRejectDeposit(d)} 
                                    className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold transition flex items-center gap-1"
                                  >
                                    <X size={10} /> Reject
                                  </button>
                                </>
                              ) : (
                                <span className="text-[10px] text-gray-text/50 font-mono italic">Audited</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredDeposits.length === 0 && (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-gray-text text-sm">No deposits found matching the filter query.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==========================================
              TAB VIEW: TRANSACTIONS (FULL LEDGER)
              ========================================== */}
          {activeTab === 'transactions' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-serif font-bold text-white mb-2">Transactions Audit Ledger</h1>
                  <p className="text-gray-text text-sm">Comprehensive ledger logs of all system deposits, payouts, and reinvestments.</p>
                </div>
                
                <button 
                  onClick={handleExportCSV}
                  className="px-4 py-2.5 bg-navy border border-border-gold hover:bg-gold/10 text-gold rounded-xl text-xs font-bold transition flex items-center gap-2 self-start md:self-auto"
                >
                  <Download size={14} /> Download CSV
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-mid border border-border-subtle rounded-xl p-4">
                <div className="flex gap-1.5">
                  {['All', 'Deposit', 'Withdrawal', 'Investment'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTransactionTypeFilter(t)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                        transactionTypeFilter === t ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white hover:bg-navy-light/30'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-80">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-text/50"><Search size={14} /></span>
                  <input
                    type="text"
                    placeholder="Search by investor or reference..."
                    value={transactionSearchQuery}
                    onChange={(e) => setTransactionSearchQuery(e.target.value)}
                    className="w-full bg-navy border border-border-subtle rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="bg-navy-mid border border-border-subtle rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-navy-light/40 text-gray-text text-xs uppercase tracking-wider">
                        <th className="p-4 font-semibold font-mono">Date</th>
                        <th className="p-4 font-semibold">Type</th>
                        <th className="p-4 font-semibold">Investor</th>
                        <th className="p-4 font-semibold">Amount</th>
                        <th className="p-4 font-semibold">System Balance</th>
                        <th className="p-4 font-semibold">Reference</th>
                        <th className="p-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {filteredTransactions.map((t, idx) => (
                        <tr key={idx} className="hover:bg-navy-light/20 transition-colors">
                          <td className="p-4 text-xs text-gray-text font-mono">{t.date}</td>
                          <td className="p-4 font-semibold">
                            <span className="flex items-center gap-1.5">
                              {t.type === 'Deposit' ? <ArrowDownRight size={14} className="text-green-400" /> : <ArrowUpRight size={14} className="text-red-400" />}
                              {t.type}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-white">{t.investor}</td>
                          <td className={`p-4 font-mono font-bold ${t.type === 'Deposit' ? 'text-green-400' : 'text-red-400'}`}>
                            {t.type === 'Deposit' ? '+' : '-'}₦{t.amount.toLocaleString()}
                          </td>
                          <td className="p-4 font-mono text-xs text-gray-300">₦{t.balance.toLocaleString()}</td>
                          <td className="p-4 font-mono text-xs text-gray-300">{t.reference}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                              t.status === 'Completed' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>{t.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==========================================
              TAB VIEW: BROADCAST NOTIFICATIONS
              ========================================== */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Header */}
              <div>
                <h1 className="text-3xl font-serif font-bold text-white mb-2">Broadcast Center</h1>
                <p className="text-gray-text text-sm">Send bulk communications to investors via multiple delivery channels.</p>
              </div>

              {broadcastAlert && (
                <div className="p-4 bg-green-950/40 border border-green-500/30 rounded-xl flex items-center gap-3 text-green-200 text-sm">
                  <CheckCircle size={20} className="shrink-0 text-green-500" />
                  <span>{broadcastAlert}</span>
                </div>
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Form */}
                <div className="lg:col-span-2 bg-navy-mid border border-border-subtle rounded-xl p-6 shadow-xl">
                  <form onSubmit={handleBroadcastSubmit} className="space-y-5">
                    
                    {/* Target & Channel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Target Group</label>
                        <select 
                          value={notifTarget} 
                          onChange={(e) => setNotifTarget(e.target.value)}
                          className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                        >
                          <option>All Investors</option>
                          <option>Foundation Plan Investors</option>
                          <option>Prosperity Plan Investors</option>
                          <option>Diaspora (US/UK) Investors</option>
                          <option>Single Investor (Custom ID)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Delivery Channels</label>
                        <select 
                          value={notifChannel} 
                          onChange={(e) => setNotifChannel(e.target.value)}
                          className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                        >
                          <option value="All">All Channels (Email + SMS + In-App)</option>
                          <option value="Email">Email Message Only</option>
                          <option value="SMS">SMS Message Only</option>
                          <option value="In-App">In-App Notification Only</option>
                        </select>
                      </div>
                    </div>

                    {/* Quick Templates Selection */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Quick Message Templates</label>
                      <select 
                        onChange={handleTemplateSelect}
                        className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2.5 text-xs text-gold font-bold focus:outline-none focus:border-gold"
                        defaultValue=""
                      >
                        <option value="" disabled>-- Select a template to auto-fill --</option>
                        <option value="Returns Credited">Plan Return payout Credited</option>
                        <option value="New Property Listed">New Property co-ownership Open</option>
                        <option value="Plan Expiry Reminder">Plan Expiry maturity reminder</option>
                        <option value="Welcome New Investor">Welcome New Investor message</option>
                      </select>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Subject / Headline</label>
                      <input 
                        type="text"
                        required
                        value={notifSubject}
                        onChange={(e) => setNotifSubject(e.target.value)}
                        placeholder="Enter message title"
                        className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                      />
                    </div>

                    {/* Body */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Message Body</label>
                      <textarea 
                        rows={8}
                        required
                        value={notifBody}
                        onChange={(e) => setNotifBody(e.target.value)}
                        placeholder="Write your email/SMS broadcast body details here..."
                        className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold font-mono whitespace-pre-wrap leading-relaxed"
                      />
                    </div>

                    {/* Schedule Picker */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Schedule Dispatch (Optional)</label>
                      <input 
                        type="datetime-local"
                        value={scheduledDateTime}
                        onChange={(e) => setScheduledDateTime(e.target.value)}
                        className="bg-navy border border-border-subtle rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-2">
                      <button 
                        type="submit" 
                        className="px-6 py-3 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl transition text-xs shadow-lg shadow-gold/5"
                      >
                        {scheduledDateTime ? 'Schedule Broadcast' : 'Send Broadcast Now'}
                      </button>
                    </div>

                  </form>
                </div>

                {/* Right: Live Preview Panel */}
                <div className="bg-navy-mid border border-border-subtle rounded-xl p-6 h-fit shadow-xl">
                  <h3 className="text-xs uppercase tracking-wider text-gray-text font-bold mb-4">Live Inbox Preview</h3>
                  
                  <div className="bg-navy rounded-xl border border-border-subtle/80 overflow-hidden">
                    {/* Preview Header */}
                    <div className="bg-[#060D1A] p-4 border-b border-border-subtle flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gold/10 border border-gold flex items-center justify-center text-gold font-serif font-bold text-[10px]">W</div>
                      <div>
                        <div className="text-[10px] font-bold text-white leading-tight">Williston Support</div>
                        <div className="text-[8px] text-gray-500">to: {notifTarget}</div>
                      </div>
                    </div>
                    
                    {/* Preview Body */}
                    <div className="p-4 space-y-3 font-sans min-h-[160px]">
                      <div className="text-xs font-bold text-white">{notifSubject || '(Enter subject line)'}</div>
                      <div className="text-[10px] text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {notifBody || 'Message preview text will appear here as you type. Use templates for immediate layout testing.'}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==========================================
              TAB VIEW: ADMIN SETTINGS
              ========================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Header */}
              <div>
                <h1 className="text-3xl font-serif font-bold text-white mb-2">Admin Settings</h1>
                <p className="text-gray-text text-sm">Configure global app parameters, currency exchange bounds, and payment target details.</p>
              </div>

              {/* Tabs Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Side tabs */}
                <div className="bg-navy-mid border border-border-subtle rounded-xl p-4 flex flex-col gap-1.5 h-fit shadow-lg">
                  {[
                    { id: 'general', label: 'General Info' },
                    { id: 'exchange', label: 'Exchange Rates' },
                    { id: 'payments', label: 'Payment Accounts' },
                    { id: 'security', label: 'Admin Security' }
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setSettingsTab(sub.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold transition ${
                        settingsTab === sub.id ? 'bg-gold text-navy font-bold shadow' : 'text-gray-text hover:text-white hover:bg-navy-light/10'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>

                {/* Sub Tab Panel */}
                <div className="lg:col-span-3 bg-navy-mid border border-border-subtle rounded-xl p-6 shadow-lg">
                  
                  {/* General settings tab */}
                  {settingsTab === 'general' && (
                    <div className="space-y-4">
                      <h3 className="text-sm uppercase tracking-wider text-gold font-bold mb-4">Platform General Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-text mb-2">Site Title</label>
                          <input 
                            type="text" 
                            value={settingsGeneral.siteName}
                            onChange={(e) => setSettingsGeneral({ ...settingsGeneral, siteName: e.target.value })}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-text mb-2">Contact Email</label>
                          <input 
                            type="email" 
                            value={settingsGeneral.email}
                            onChange={(e) => setSettingsGeneral({ ...settingsGeneral, email: e.target.value })}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-text mb-2">Contact Phone</label>
                          <input 
                            type="text" 
                            value={settingsGeneral.phone}
                            onChange={(e) => setSettingsGeneral({ ...settingsGeneral, phone: e.target.value })}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-text mb-2">HQ Address</label>
                          <input 
                            type="text" 
                            value={settingsGeneral.address}
                            onChange={(e) => setSettingsGeneral({ ...settingsGeneral, address: e.target.value })}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-bold rounded-lg transition mt-4">Save General Info</button>
                    </div>
                  )}

                  {/* Exchange Rates tab */}
                  {settingsTab === 'exchange' && (
                    <div className="space-y-4">
                      <h3 className="text-sm uppercase tracking-wider text-gold font-bold mb-4">Currency Exchange Rates (Manual Entry)</h3>
                      <p className="text-[11px] text-gray-text leading-relaxed font-normal">Update exchange rates manual values applied across the platform for NGN equivalents.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <div>
                          <label className="block text-xs text-gray-text mb-2">USD to NGN (₦)</label>
                          <input 
                            type="number" 
                            value={settingsExchangeRates.usd}
                            onChange={(e) => setSettingsExchangeRates({ ...settingsExchangeRates, usd: Number(e.target.value) })}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-text mb-2">GBP to NGN (₦)</label>
                          <input 
                            type="number" 
                            value={settingsExchangeRates.gbp}
                            onChange={(e) => setSettingsExchangeRates({ ...settingsExchangeRates, gbp: Number(e.target.value) })}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-text mb-2">EUR to NGN (₦)</label>
                          <input 
                            type="number" 
                            value={settingsExchangeRates.eur}
                            onChange={(e) => setSettingsExchangeRates({ ...settingsExchangeRates, eur: Number(e.target.value) })}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-bold rounded-lg transition mt-4">Save Exchange Rates</button>
                    </div>
                  )}

                  {/* Payments Account settings */}
                  {settingsTab === 'payments' && (
                    <div className="space-y-4">
                      <h3 className="text-sm uppercase tracking-wider text-gold font-bold mb-4">Platform Deposit Bank Account</h3>
                      <p className="text-[11px] text-gray-text leading-relaxed font-normal font-sans">This bank account details are displayed directly to users on their deposit panel during checkout wire transfer uploads.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <div>
                          <label className="block text-xs text-gray-text mb-2">Bank Name</label>
                          <input 
                            type="text" 
                            value={settingsPayments.bankName}
                            onChange={(e) => setSettingsPayments({ ...settingsPayments, bankName: e.target.value })}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-text mb-2">Account Name</label>
                          <input 
                            type="text" 
                            value={settingsPayments.accountName}
                            onChange={(e) => setSettingsPayments({ ...settingsPayments, accountName: e.target.value })}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-text mb-2">Account Number</label>
                          <input 
                            type="text" 
                            value={settingsPayments.accountNo}
                            onChange={(e) => setSettingsPayments({ ...settingsPayments, accountNo: e.target.value })}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-bold rounded-lg transition mt-4">Save Payment Accounts</button>
                    </div>
                  )}

                  {/* Security configurations */}
                  {settingsTab === 'security' && (
                    <form className="space-y-4">
                      <h3 className="text-sm uppercase tracking-wider text-gold font-bold mb-4">Admin Credentials & Security</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-text mb-2">New Password</label>
                          <input 
                            type="password" 
                            value={settingsSecurity.newPassword}
                            onChange={(e) => setSettingsSecurity({ ...settingsSecurity, newPassword: e.target.value })}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold"
                            placeholder="Enter new admin password"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-text mb-2">Confirm Password</label>
                          <input 
                            type="password" 
                            value={settingsSecurity.confirmPassword}
                            onChange={(e) => setSettingsSecurity({ ...settingsSecurity, confirmPassword: e.target.value })}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold"
                            placeholder="Confirm new admin password"
                          />
                        </div>
                      </div>

                      <div className="border-t border-border-subtle/50 pt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-white">Enable Multi-Factor (2FA) Code Gate</div>
                            <div className="text-[10px] text-gray-500">Require secondary OTP check at admin authentication</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSettingsSecurity({ ...settingsSecurity, twoFactor: !settingsSecurity.twoFactor })}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              settingsSecurity.twoFactor ? 'bg-gold' : 'bg-gray-700'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-navy shadow ring-0 transition duration-200 ease-in-out ${
                                settingsSecurity.twoFactor ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between border-t border-border-subtle/50 pt-4">
                          <div>
                            <div className="text-xs font-bold text-white">Session Timeout Interval</div>
                            <div className="text-[10px] text-gray-500">Auto log out administrator after inactive minutes</div>
                          </div>
                          <select 
                            value={settingsSecurity.sessionTimeout}
                            onChange={(e) => setSettingsSecurity({ ...settingsSecurity, sessionTimeout: Number(e.target.value) })}
                            className="bg-navy border border-border-subtle rounded-lg px-3 py-1 text-xs text-white focus:outline-none focus:border-gold"
                          >
                            <option value="15">15 Minutes</option>
                            <option value="30">30 Minutes</option>
                            <option value="60">1 Hour</option>
                          </select>
                        </div>
                      </div>
                      
                      <button className="px-4 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-bold rounded-lg transition mt-4">Save Security Configs</button>
                    </form>
                  )}

                </div>
              </div>

            </div>
          )}

        </div>

      </main>

      {/* ==========================================
          MODALS & FLYOUT DETAILS PANELS
          ========================================== */}

      {/* 1. Modal: Confirmation Approve Withdrawal (GTBank specific) */}
      {confirmApproveWD && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-navy-light border border-border-gold rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-gold mb-4">
              <CheckCircle size={24} />
              <h3 className="text-lg font-serif font-bold text-white">Confirm Transfer</h3>
            </div>
            
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              Confirm you have sent <strong className="text-gold">₦{confirmApproveWD.amount.toLocaleString()}</strong> to:
              <br />
              <span className="block bg-navy/50 p-3 border border-border-subtle rounded-lg mt-3 text-xs font-mono text-white leading-relaxed">
                Bank: <strong className="text-white">{confirmApproveWD.bank}</strong>
                <br />
                Account No: <strong className="text-white">{confirmApproveWD.accountNo}</strong>
                <br />
                Beneficiary: <strong className="text-white">{confirmApproveWD.investorName}</strong>
              </span>
            </p>

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setConfirmApproveWD(null)} 
                className="px-4 py-2 bg-navy border border-border-subtle hover:border-gold rounded-lg text-xs transition text-gray-text hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleApproveWithdrawal}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg transition"
              >
                Yes, Mark as Paid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal: Confirmation Reject Withdrawal */}
      {confirmRejectWD && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-navy-light border border-red-500/30 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-lg font-serif font-bold text-white font-normal">Reject Withdrawal Request</h3>
            </div>
            
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              Are you sure you want to reject the withdrawal request of <strong className="text-gold">₦{confirmRejectWD.amount.toLocaleString()}</strong> by <strong className="text-white">{confirmRejectWD.investorName}</strong>? 
              This will return the status as Rejected in the investor's audit list.
            </p>

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setConfirmRejectWD(null)} 
                className="px-4 py-2 bg-navy border border-border-subtle rounded-lg text-xs transition text-gray-text hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setWithdrawals(prev => prev.map(w => w.id === confirmRejectWD.id ? { ...w, status: 'Rejected' } : w));
                  setConfirmRejectWD(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition"
              >
                Yes, Reject Payout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: View Bank Receipt Receipt Proof */}
      {viewingReceipt && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-navy-light border border-border-subtle rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 bg-[#060D1A] border-b border-border-subtle flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white font-normal">Deposit Proof: {viewingReceipt.investorName}</h3>
              <button onClick={() => setViewingReceipt(null)} className="text-gray-text hover:text-white"><X size={18} /></button>
            </div>
            
            {/* Receipt Image Content */}
            <div className="p-6 flex flex-col items-center justify-center bg-navy/40">
              <img 
                src={viewingReceipt.receipt} 
                alt="Uploaded bank receipt transaction proof" 
                className="max-h-[400px] object-contain rounded-lg border border-border-subtle shadow"
              />
              <div className="w-full bg-navy p-3 border border-border-subtle rounded-lg mt-4 space-y-1 text-xs">
                <div>Reference Code: <strong className="text-gold font-mono">{viewingReceipt.reference}</strong></div>
                <div>Amount: <strong className="text-white">₦{viewingReceipt.amount.toLocaleString()}</strong></div>
                <div>Requested Date: <strong className="text-white">{viewingReceipt.date}</strong></div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border-subtle flex justify-end gap-3 bg-[#060D1A]">
              <button 
                onClick={() => setViewingReceipt(null)}
                className="px-4 py-2 bg-navy border border-border-subtle rounded-lg text-xs text-gray-text hover:text-white"
              >
                Close Preview
              </button>
              {viewingReceipt.status === 'Pending' && (
                <>
                  <button 
                    onClick={() => { handleConfirmDeposit(viewingReceipt); setViewingReceipt(null); }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg"
                  >
                    Confirm Deposit
                  </button>
                  <button 
                    onClick={() => { handleRejectDeposit(viewingReceipt); setViewingReceipt(null); }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal: Edit Investment Plan Configuration */}
      {editingPlan && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-navy-light border border-border-gold rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-serif font-bold text-gold mb-4">Edit {editingPlan.name} Settings</h3>
            
            <form onSubmit={handleSavePlanSettings} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-text mb-2">Minimum Investment Amount ($)</label>
                <input 
                  type="number"
                  required
                  value={editingPlan.minAmount}
                  onChange={(e) => setEditingPlan({ ...editingPlan, minAmount: Number(e.target.value) })}
                  className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-text mb-2">Annual ROI percentage (%)</label>
                <input 
                  type="number"
                  required
                  value={editingPlan.roi}
                  onChange={(e) => setEditingPlan({ ...editingPlan, roi: Number(e.target.value) })}
                  className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setEditingPlan(null)} 
                  className="px-4 py-2 bg-navy border border-border-subtle rounded-lg text-xs text-gray-text hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-bold rounded-lg"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: Confirm Delete Investor */}
      {confirmDeleteInv && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-navy-light border border-red-500/30 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-lg font-serif font-bold text-white font-normal font-sans">Delete Investor Account</h3>
            </div>
            
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              Are you sure you want to permanently delete the account of <strong className="text-white">{confirmDeleteInv.name}</strong> ({confirmDeleteInv.id})? 
              This action cannot be undone. All active plan details and logs will be deleted from the database.
            </p>

            <div className="flex gap-3 justify-end">
              <button 
                type="button"
                onClick={() => setConfirmDeleteInv(null)} 
                className="px-4 py-2 bg-navy border border-border-subtle rounded-lg text-xs text-gray-text hover:text-white"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleDeleteInvestor}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg"
              >
                Yes, Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Modal: Edit Investor Settings */}
      {editingInvestor && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-navy-light border border-border-gold rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-serif font-bold text-gold mb-4">Edit {editingInvestor.name} Profile</h3>
            
            <form onSubmit={handleSaveInvestorEdit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-text mb-2">Full Name</label>
                <input 
                  type="text"
                  required
                  value={editingInvestor.name}
                  onChange={(e) => setEditingInvestor({ ...editingInvestor, name: e.target.value })}
                  className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-text mb-2">Email Address</label>
                <input 
                  type="email"
                  required
                  value={editingInvestor.email}
                  onChange={(e) => setEditingInvestor({ ...editingInvestor, email: e.target.value })}
                  className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-text mb-2">Phone Number</label>
                <input 
                  type="text"
                  required
                  value={editingInvestor.phone}
                  onChange={(e) => setEditingInvestor({ ...editingInvestor, phone: e.target.value })}
                  className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-text mb-2">Address</label>
                <input 
                  type="text"
                  required
                  value={editingInvestor.address}
                  onChange={(e) => setEditingInvestor({ ...editingInvestor, address: e.target.value })}
                  className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-text mb-2">Verification Status</label>
                <select 
                  value={editingInvestor.status}
                  onChange={(e) => setEditingInvestor({ ...editingInvestor, status: e.target.value })}
                  className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Active">Active / Verified</option>
                  <option value="Pending">Pending Verification</option>
                  <option value="Suspended">Suspended / Blocked</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-border-subtle">
                <button 
                  type="button"
                  onClick={() => setEditingInvestor(null)} 
                  className="px-4 py-2 bg-navy border border-border-subtle rounded-lg text-xs text-gray-text"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-bold rounded-lg"
                >
                  Save Profile Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Slide-over drawer: Investor Profile Details */}
      {selectedInvestor && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-navy/70 backdrop-blur-xs transition-opacity" onClick={() => setSelectedInvestor(null)}></div>
          <div className="absolute inset-y-0 right-0 max-w-xl w-full bg-navy-mid border-l border-border-subtle flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-6 border-b border-border-subtle bg-[#060D1A] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold font-bold">
                  {selectedInvestor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-md font-serif font-bold text-white leading-tight">{selectedInvestor.name}</h3>
                  <div className="text-[10px] text-gray-500 font-mono">{selectedInvestor.id} &bull; Joined {selectedInvestor.dateJoined}</div>
                </div>
              </div>
              <button onClick={() => setSelectedInvestor(null)} className="text-gray-text hover:text-white"><X size={20} /></button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Personal Info Grid */}
              <div className="bg-navy p-4 border border-border-subtle rounded-xl space-y-3 text-xs">
                <h4 className="text-[10px] uppercase tracking-wider text-gold font-bold mb-2">Personal Details</h4>
                <div className="flex justify-between"><span className="text-gray-text">Email Address</span><span className="text-white font-medium">{selectedInvestor.email}</span></div>
                <div className="flex justify-between"><span className="text-gray-text">Phone Number</span><span className="text-white font-medium">{selectedInvestor.phone}</span></div>
                <div className="flex justify-between"><span className="text-gray-text">Residential Address</span><span className="text-white text-right max-w-[70%] leading-relaxed">{selectedInvestor.address}</span></div>
                <div className="flex justify-between"><span className="text-gray-text">Status Badge</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-bold tracking-wider ${
                    selectedInvestor.status === 'Active' ? 'bg-green-500/10 text-green-400' :
                    selectedInvestor.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>{selectedInvestor.status}</span>
                </div>
              </div>

              {/* Investments History */}
              <div className="bg-navy p-4 border border-border-subtle rounded-xl space-y-3 text-xs">
                <h4 className="text-[10px] uppercase tracking-wider text-gold font-bold mb-2">Active Investments</h4>
                <div className="p-3 bg-navy-light/40 border border-border-subtle rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{selectedInvestor.plan}</div>
                    <div className="text-[10px] text-gray-text font-mono mt-0.5">ROI: 24% per cycle</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-white font-bold">₦{selectedInvestor.amountInvested.toLocaleString()}</div>
                    <div className="text-[9px] text-green-400 mt-0.5">Yielding returns</div>
                  </div>
                </div>
              </div>

              {/* Transactions logs */}
              <div className="bg-navy p-4 border border-border-subtle rounded-xl space-y-3 text-xs">
                <h4 className="text-[10px] uppercase tracking-wider text-gold font-bold mb-2">Referrals & Affiliates</h4>
                <div className="flex justify-between items-center">
                  <span className="text-gray-text">Total Referrals Registered</span>
                  <span className="font-bold text-white font-mono">{selectedInvestor.referralsCount}</span>
                </div>
                {selectedInvestor.referralsCount > 0 ? (
                  <div className="text-[10px] text-gray-500 italic mt-1 font-sans">
                    Generates 5% instant commission payout to wallet per active cycle.
                  </div>
                ) : (
                  <div className="text-[10px] text-gray-600 italic">No invitees registered on partner link.</div>
                )}
              </div>

              {/* Document verification */}
              <div className="bg-navy p-4 border border-border-subtle rounded-xl space-y-3 text-xs">
                <h4 className="text-[10px] uppercase tracking-wider text-gold font-bold mb-2">Uploaded Verification Files</h4>
                <div className="flex items-center justify-between p-2.5 bg-navy-light/40 border border-border-subtle/80 rounded-lg">
                  <span className="font-mono text-[10px] text-white flex items-center gap-1.5"><FileUp size={12} className="text-gold" /> {selectedInvestor.docUploaded}</span>
                  <button className="text-[9px] text-gold hover:underline">Download file</button>
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-border-subtle bg-[#060D1A] flex justify-end gap-3">
              <button 
                onClick={() => { setEditingInvestor({ ...selectedInvestor }); }} 
                className="px-4 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-bold rounded-lg transition"
              >
                Edit Account Profile
              </button>
              <button 
                onClick={() => setSelectedInvestor(null)} 
                className="px-4 py-2 bg-navy border border-border-subtle rounded-lg text-xs text-gray-text hover:text-white"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
