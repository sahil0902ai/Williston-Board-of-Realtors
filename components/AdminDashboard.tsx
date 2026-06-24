'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, logoutUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, Users, Layers, Building, Bed, CreditCard, 
  ArrowUpFromLine, ArrowDownToLine, Users2, FileText, Bell, 
  Settings, LogOut, Search, Shield, Eye, Check, X, ShieldAlert, 
  ArrowUpRight, ArrowDownRight, Edit, Trash2, Mail, Phone, 
  Calendar, User, FileUp, CheckCircle, RefreshCw, ChevronRight, 
  Download, Plus, AlertCircle, Lock, MapPin, Menu
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

function timeAgo(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export default function AdminDashboard({ adminSecret }: { adminSecret?: string }) {
  // Local fetch wrapper to automatically attach Authorization header for API calls
  const fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    headers.set('Authorization', `Bearer ${adminSecret || 'williston_admin_secret_2025'}`);
    const fetchFn = typeof window !== 'undefined' ? window.fetch : globalThis.fetch;
    return fetchFn(input, { ...init, headers });
  };

  // Live Clock
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Authentication State
  const [loggedIn, setLoggedIn] = useState(false);
  const [authUsername, setAuthUsername] = useState('willistonadmin');
  const [authPassword, setAuthPassword] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutMsg, setLockoutMsg] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState('overview');

  // Mobile responsive sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Core Data States
  const [investors, setInvestors] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [investmentsFilter, setInvestmentsFilter] = useState('All');

  // API Integration States
  const [analytics, setAnalytics] = useState<any>(null);
  const [barChartData, setBarChartData] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);

  // Deposit Action Modals State
  const [confirmDepositTarget, setConfirmDepositTarget] = useState<any>(null);
  const [rejectDepositTarget, setRejectDepositTarget] = useState<any>(null);
  const [depositRejectionReason, setDepositRejectionReason] = useState('');

  // Withdrawal Action Modals State
  const [withdrawalRejectionReason, setWithdrawalRejectionReason] = useState('');

  // KYC Verification Modal State
  const [kycRejectionReason, setKycRejectionReason] = useState('');

  const fetchAdminData = async () => {
    setAdminLoading(true);
    try {
      // 1. Fetch Analytics
      const analyticsRes = await fetch('/api/admin/analytics');
      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        if (data.success) {
          setAnalytics(data.analytics);
          setTransactions(data.analytics.recentTransactions || []);
          if (data.analytics.monthlySignups && data.analytics.monthlySignups.length > 0) {
            setBarChartData(data.analytics.monthlySignups);
          }
          if (data.analytics.planDistribution && data.analytics.planDistribution.length > 0) {
            setPieChartData(data.analytics.planDistribution);
          }
        }
      }

      // 2. Fetch Investors
      const usersRes = await fetch('/api/admin/users?limit=100');
      if (usersRes.ok) {
        const data = await usersRes.json();
        if (data.success) {
          const mapped = data.users.map((u: any) => ({
            id: u.id,
            name: u.full_name,
            email: u.email,
            phone: u.phone || 'N/A',
            plan: u.investor_level || 'starter',
            amountInvested: parseFloat(u.total_invested || 0),
            returnsPaid: parseFloat(u.total_returns || 0),
            dateJoined: new Date(u.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            status: u.account_status === 'active' ? 'Active' : 'Suspended',
            referralsCount: 0,
            address: u.country || 'N/A',
            docUploaded: u.kyc_id_url ? 'Verification Docs' : '',
            kycStatus: u.kyc_status,
            kycIdUrl: u.kyc_id_url,
            kycSelfieUrl: u.kyc_selfie_url,
            walletBalance: parseFloat(u.wallet_balance || 0)
          }));
          setInvestors(mapped);
        }
      }

      // 3. Fetch Deposits
      const depRes = await fetch('/api/admin/deposits/list');
      if (depRes.ok) {
        const data = await depRes.json();
        if (data.success) {
          setDeposits(data.deposits);
        }
      }

      // 4. Fetch Withdrawals
      const wdRes = await fetch('/api/admin/withdrawals/list');
      if (wdRes.ok) {
        const data = await wdRes.json();
        if (data.success) {
          setWithdrawals(data.withdrawals);
        }
      }

      // 5. Fetch Plans
      const planRes = await fetch('/api/admin/plans');
      if (planRes.ok) {
        const data = await planRes.json();
        if (Array.isArray(data)) {
          setPlans(data);
        } else if (data.success && Array.isArray(data.plans)) {
          setPlans(data.plans);
        }
      }

      // 6. Fetch Rentals
      const rentalsRes = await fetch('/api/rentals');
      if (rentalsRes.ok) {
        const data = await rentalsRes.json();
        if (Array.isArray(data)) {
          setRentals(data);
        }
      }

      // 7. Fetch Properties Catalog
      const propertiesRes = await fetch('/api/properties');
      if (propertiesRes.ok) {
        const data = await propertiesRes.json();
        if (Array.isArray(data)) {
          setProperties(data);
        }
      }

      // 8. Fetch Investments List
      const investmentsRes = await fetch('/api/admin/investments/list');
      if (investmentsRes.ok) {
        const data = await investmentsRes.json();
        if (data.success && Array.isArray(data.investments)) {
          setInvestments(data.investments);
        }
      }

      const settingsRes = await fetch('/api/admin/settings');
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        if (data.success && data.settings) {
          setSettingsBankName(data.settings.bank_name || '');
          setSettingsAccountNumber(data.settings.bank_account_number || '');
          setSettingsAccountName(data.settings.bank_account_name || '');
          setSettingsBankWhatsapp(data.settings.bank_whatsapp || '');
          setSettingsBankUssd(data.settings.bank_ussd || '');
          setSettingsBTC(data.settings.payment_btc_address || '');
          setSettingsUSDT(data.settings.payment_usdt_address || '');
          setSettingsETH(data.settings.payment_eth_address || '');
          setSettingsUsdToNgn(data.settings.exchange_rate_usd_ngn || 1600);
        }
      }
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setAdminLoading(false);
    }
  };

  const playNotificationSound = () => {
    try {
      // Play a beautiful premium synth alert sound immediately using Web Audio API
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        
        // Tone 1: C5
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
        gain1.gain.setValueAtTime(0.08, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.15);

        // Tone 2: E5
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        gain2.gain.setValueAtTime(0.08, ctx.currentTime + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(ctx.currentTime + 0.1);
        osc2.stop(ctx.currentTime + 0.35);
      }
      
      // Attempt standard mp3 notification
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {});
    } catch (e) {
      console.warn('Audio play failed/blocked:', e);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchAdminData();

      // Realtime listener for deposits
      const channel = supabase
        .channel('admin-deposits-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'deposits' },
          (payload) => {
            fetchAdminData();
            if (payload.eventType === 'INSERT') {
              playNotificationSound();
              const amt = parseFloat(payload.new.amount || '0');
              const formattedAmt = isNaN(amt) ? '' : `₦${amt.toLocaleString()}`;
              showToast(`🔔 New deposit — ${formattedAmt} submitted!`);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [loggedIn]);

  // Modals & Panels State
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [viewingReceipt, setViewingReceipt] = useState<any>(null);
  const [confirmApproveWD, setConfirmApproveWD] = useState<any>(null);
  const [confirmRejectWD, setConfirmRejectWD] = useState<any>(null);
  const [confirmDeleteInv, setConfirmDeleteInv] = useState<any>(null);
  const [editingInvestor, setEditingInvestor] = useState<any>(null);
  const [kycReviewUser, setKycReviewUser] = useState<any>(null);

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
  const [notifTarget, setNotifTarget] = useState('all');
  const [notifType, setNotifType] = useState('info');
  const [notifSubject, setNotifSubject] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [broadcastAlert, setBroadcastAlert] = useState('');

  // Settings State
  const [settingsTab, setSettingsTab] = useState('payment_details');
  const [settingsBankName, setSettingsBankName] = useState('OPay');
  const [settingsAccountNumber, setSettingsAccountNumber] = useState('9167455410');
  const [settingsAccountName, setSettingsAccountName] = useState('Chukwuebuka Irenaus Onyegere');
  const [settingsBankWhatsapp, setSettingsBankWhatsapp] = useState('+2349167455410');
  const [settingsBankUssd, setSettingsBankUssd] = useState('*955#');
  const [settingsBTC, setSettingsBTC] = useState('YOUR_BTC_WALLET_ADDRESS');
  const [settingsUSDT, setSettingsUSDT] = useState('YOUR_USDT_TRC20_ADDRESS');
  const [settingsETH, setSettingsETH] = useState('YOUR_ETH_ADDRESS');
  const [settingsUsdToNgn, setSettingsUsdToNgn] = useState(1600);

  // Recent Actions Log
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, time: '10 mins ago', investor: 'Emeka Okonkwo', action: 'Withdrawal Request', amount: '$50,000', status: 'Pending' },
    { id: 2, time: '25 mins ago', investor: 'Tunde Adebayor', action: 'New Registration', amount: '-', status: 'Completed' },
    { id: 3, time: '1 hour ago', investor: 'Emeka Musa', action: 'Deposit Confirmed', amount: '$500,000', status: 'Completed' },
    { id: 4, time: '2 hours ago', investor: 'Olumide Adebayor', action: 'Withdrawal Request', amount: '$120,000', status: 'Pending' },
    { id: 5, time: '4 hours ago', investor: 'Grace Ojo', action: 'New Investment', amount: '$75,000', status: 'Completed' },
    { id: 6, time: '1 day ago', investor: 'Fatima Bello', action: 'Deposit Confirmed', amount: '$80,000', status: 'Completed' },
    { id: 7, time: '1 day ago', investor: 'John Smith', action: 'Property Enquiry', amount: '-', status: 'Replied' },
    { id: 8, time: '2 days ago', investor: 'Sarah Doe', action: 'New Investment', amount: '$150,000', status: 'Completed' },
    { id: 9, time: '2 days ago', investor: 'Tunde Bello', action: 'New Registration', amount: '-', status: 'Completed' },
    { id: 10, time: '3 days ago', investor: 'Olumide Adebayor', action: 'Deposit Confirmed', amount: '$30,000', status: 'Completed' },
  ]);

  // Load sessionStorage Admin Authentication session
  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated') === 'true';
    if (isAuth) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setLoggedIn(false);
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (failedAttempts >= 3) {
      setLockoutMsg('Access blocked. Too many wrong attempts.');
      return;
    }

    const targetPassword = adminSecret || 'williston_admin_secret_2025';
    if (
      authUsername.trim().toLowerCase() === 'willistonadmin' &&
      authPassword === targetPassword
    ) {
      sessionStorage.setItem('admin_authenticated', 'true');
      setLoggedIn(true);
      setLoginError('');
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 3) {
        setLockoutMsg('Access blocked. Too many wrong attempts.');
      } else {
        setLoginError(`Access Denied. (${3 - newAttempts} attempts remaining)`);
      }
    }
  };

  // Broadcast Handler
  const handleBroadcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifSubject.trim() || !notifBody.trim()) return;

    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: notifSubject,
          message: notifBody,
          type: notifType,
          target: notifTarget
        })
      });

      if (res.ok) {
        showToast('Announcement broadcasted successfully');
        setBroadcastAlert(`Successfully broadcasted notification to ${notifTarget}!`);
        setTimeout(() => setBroadcastAlert(''), 4000);

        // Add to recent activity
        const newAct = {
          id: Date.now(),
          time: 'Just now',
          investor: notifTarget === 'all' ? 'All Users' : notifTarget,
          action: `Broadcast: ${notifSubject}`,
          amount: '-',
          status: 'Completed'
        };
        setRecentActivities(prev => [newAct, ...prev.slice(0, 9)]);

        setNotifSubject('');
        setNotifBody('');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to send announcement');
      }
    } catch (err) {
      console.error(err);
      alert('Error broadcasting announcement');
    }
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
  const handleApproveWithdrawal = async () => {
    if (!confirmApproveWD) return;
    try {
      const res = await fetch('/api/admin/withdrawals/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          withdrawalId: confirmApproveWD.id,
          action: 'approve'
        })
      });
      if (res.ok) {
        showToast(`Withdrawal of $${confirmApproveWD.amount.toLocaleString()} marked as paid`);
        fetchAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to approve withdrawal');
      }
    } catch (e) {
      console.error('Approve withdrawal error:', e);
    } finally {
      setConfirmApproveWD(null);
    }
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
  const handleConfirmDepositAction = async (dep: any) => {
    try {
      const res = await fetch('/api/admin/deposits/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          depositId: dep.id,
          action: 'confirm'
        })
      });
      if (res.ok) {
        showToast(`✅ Confirmed — ₦${dep.amount.toLocaleString()} added to ${dep.investorName?.split(' ')[0] || 'User'}'s wallet`);
        
        if (dep.phone) {
          const cleanPhone = dep.phone.replace(/[\s\-\+]/g, '');
          const waMessage = `Hello ${dep.investorName}, we have successfully confirmed your deposit of ₦${dep.amount.toLocaleString()}. It has been credited to your wallet balance. Thank you!`;
          const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;
          window.open(waUrl, '_blank');
        }

        fetchAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to confirm deposit');
      }
    } catch (e) {
      console.error('Confirm deposit error:', e);
    } finally {
      setConfirmDepositTarget(null);
    }
  };

  const handleRejectDepositAction = async (dep: any, reason: string) => {
    if (!reason.trim()) {
      alert('Rejection reason is required');
      return;
    }
    try {
      const res = await fetch('/api/admin/deposits/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          depositId: dep.id,
          action: 'reject',
          rejectionReason: reason
        })
      });
      if (res.ok) {
        showToast(`Deposit rejected — User notified`);
        fetchAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to reject deposit');
      }
    } catch (e) {
      console.error('Reject deposit error:', e);
    } finally {
      setRejectDepositTarget(null);
      setDepositRejectionReason('');
    }
  };

  // Reject Withdrawal Action
  const handleRejectWithdrawalAction = async (wd: any, reason: string) => {
    if (!reason.trim()) {
      alert('Rejection reason is required');
      return;
    }
    try {
      const res = await fetch('/api/admin/withdrawals/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          withdrawalId: wd.id,
          action: 'reject',
          rejectionReason: reason
        })
      });
      if (res.ok) {
        showToast(`Withdrawal rejected & refunded`);
        fetchAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to reject withdrawal');
      }
    } catch (e) {
      console.error('Reject withdrawal error:', e);
    } finally {
      setConfirmRejectWD(null);
      setWithdrawalRejectionReason('');
    }
  };

  // Save Settings helper
  const handleSaveSettings = async (keysPayload: { [key: string]: any }) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: keysPayload })
      });
      if (res.ok) {
        showToast('Settings successfully saved');
        fetchAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save settings');
      }
    } catch (e) {
      console.error(e);
      alert('Error saving settings');
    }
  };

  // Toggle Plan Active
  const handleTogglePlanActive = async (plan: any) => {
    const newStatus = !(plan.is_active !== undefined ? plan.is_active : plan.enabled);
    try {
      const res = await fetch('/api/admin/plans', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          is_active: newStatus
        })
      });
      if (res.ok) {
        showToast(`Plan ${plan.name} is now ${newStatus ? 'enabled' : 'disabled'}`);
        fetchAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update plan status');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating plan status');
    }
  };

  // Plans update
  const handleSavePlanSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    try {
      const res = await fetch('/api/admin/plans', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: editingPlan.id,
          name: editingPlan.name,
          roi_percent: editingPlan.roi_percent || editingPlan.roi,
          duration_days: editingPlan.duration_days,
          min_deposit: editingPlan.min_deposit || editingPlan.minAmount,
          max_deposit: editingPlan.max_deposit,
          is_active: editingPlan.is_active !== undefined ? editingPlan.is_active : editingPlan.enabled
        })
      });

      if (res.ok) {
        fetchAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save plan settings');
      }
    } catch (err) {
      console.error('Edit plan error:', err);
    } finally {
      setEditingPlan(null);
    }
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
  const handleSaveInvestorEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvestor) return;

    try {
      const prevInv = investors.find(inv => inv.id === editingInvestor.id);
      if (prevInv && prevInv.status !== editingInvestor.status) {
        const statusMap: any = {
          'Active': 'active',
          'Suspended': 'suspended',
          'Pending': 'pending'
        };
        const dbStatus = statusMap[editingInvestor.status] || 'active';

        // 1. Update status
        if (dbStatus === 'active' || dbStatus === 'suspended') {
          const res = await fetch('/api/admin/users/update-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: editingInvestor.id,
              status: dbStatus
            })
          });
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Failed to update user status');
          }
        }

        // 2. KYC Decision review
        if (editingInvestor.status === 'Active' && prevInv.kycStatus !== 'approved') {
          const res = await fetch('/api/admin/users/kyc-review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: editingInvestor.id,
              decision: 'approved'
            })
          });
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Failed to approve KYC verification');
          }
        }
      }

      fetchAdminData();
      if (selectedInvestor?.id === editingInvestor.id) {
        setSelectedInvestor(editingInvestor);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update investor account');
      console.error(err);
    } finally {
      setEditingInvestor(null);
    }
  };

  // Toast Alert Notification State
  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg('');
    }, 4000);
  };

  // Direct Account suspension/activation trigger
  const handleUpdateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/users/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: newStatus })
      });
      if (res.ok) {
        showToast(`Account successfully ${newStatus === 'suspended' ? 'suspended' : 'activated'}`);
        fetchAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update user status');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Direct KYC review trigger
  const handleKYCReview = async (userId: string, decision: 'approved' | 'rejected', reason?: string) => {
    try {
      const res = await fetch('/api/admin/users/kyc-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, decision, reason })
      });
      if (res.ok) {
        showToast(`KYC status successfully updated to ${decision}`);
        fetchAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to process KYC review');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Manual maturity trigger
  const handleMarkAsMatured = async (investmentId: string) => {
    if (!confirm("Are you sure you want to manually mature this investment? This will credit the return amount to the user's wallet.")) return;
    try {
      const res = await fetch('/api/admin/investments/mature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investmentId })
      });
      if (res.ok) {
        showToast('Investment successfully matured!');
        fetchAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to mature investment');
      }
    } catch (err) {
      console.error(err);
      alert('Error maturing investment');
    }
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

  // Rentals & Properties States & Actions
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: '',
    location: '',
    type: 'Residential',
    type_display: '',
    price: '',
    roi: '',
    status: 'Open',
    image_url: ''
  });

  const handleUpdateRentalStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/rentals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        fetchAdminData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update status');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating rental status');
    }
  };

  const handleRejectRental = async (id: string) => {
    if (!confirm('Are you sure you want to reject and remove this booking?')) return;
    try {
      const res = await fetch(`/api/rentals?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchAdminData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to reject booking');
      }
    } catch (e) {
      console.error(e);
      alert('Error rejecting booking');
    }
  };

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProperty)
      });
      if (res.ok) {
        setShowAddPropertyModal(false);
        setNewProperty({
          name: '',
          location: '',
          type: 'Residential',
          type_display: '',
          price: '',
          roi: '',
          status: 'Open',
          image_url: ''
        });
        fetchAdminData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to add property');
      }
    } catch (e) {
      console.error(e);
      alert('Error adding property');
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property listing?')) return;
    try {
      const res = await fetch(`/api/properties?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchAdminData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete property');
      }
    } catch (e) {
      console.error(e);
      alert('Error deleting property');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    setUploadingImage(true);
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNewProperty(prev => ({ ...prev, image_url: data.imageUrl }));
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
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
    const statusLower = d.status?.toLowerCase();
    if (depositFilter === 'Pending') {
      return statusLower === 'pending';
    }
    if (depositFilter === 'Confirmed Today') {
      if (statusLower !== 'confirmed') return false;
      const depDate = d.created_at ? new Date(d.created_at) : new Date(d.date);
      const today = new Date();
      return depDate.toDateString() === today.toDateString();
    }
    if (depositFilter === 'Rejected') {
      return statusLower === 'rejected' || statusLower === 'failed';
    }
    return true; // 'All'
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
      <div className="min-h-screen bg-[#04091A] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0A1628] border border-gold/30 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 border-2 border-gold flex items-center justify-center text-gold font-serif font-bold text-3xl mb-4 shadow-lg shadow-gold/5">W</div>
            <h1 className="font-serif text-2xl font-bold tracking-widest text-gold mb-1">WILLISTON ADMIN</h1>
            <span className="text-[10px] uppercase tracking-widest text-red-500 font-bold bg-red-950/30 px-2 py-0.5 rounded border border-red-500/10 flex items-center gap-1">
              <ShieldAlert size={12} /> Restricted Access
            </span>
          </div>

          {lockoutMsg ? (
            <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-200 text-xs text-center leading-relaxed">
              <ShieldAlert size={24} className="mx-auto mb-2 text-red-500 animate-bounce" />
              <span>{lockoutMsg}</span>
            </div>
          ) : (
            <form onSubmit={handleAdminLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Username</label>
                <input suppressHydrationWarning
                  type="text"
                  required
                  placeholder="Username"
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  className="w-full bg-[#04091A] border border-border-subtle rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Password</label>
                <input suppressHydrationWarning
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-[#04091A] border border-border-subtle rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              {loginError && (
                <div className="p-3 bg-red-950/30 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-medium">
                  {loginError}
                </div>
              )}

              <button suppressHydrationWarning
                type="submit"
                className="w-full py-3.5 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl transition text-xs shadow-lg shadow-gold/5 uppercase tracking-wider font-sans"
              >
                Enter Admin Panel
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: MAIN ADMIN DASHBOARD
  // ==========================================

  const barChartToRender = barChartData && barChartData.length > 0 ? barChartData : barData;
  const pieChartToRender = pieChartData && pieChartData.length > 0 ? pieChartData : pieData;
  const totalPieValue = pieChartToRender.reduce((sum, item) => sum + item.value, 0) || 1;

  return (
    <div className="min-h-screen bg-navy text-white flex">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[rgba(4,9,26,0.97)] z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Dark Charcoal Sidebar #060D1A */}
      <aside className={`fixed lg:relative top-0 left-0 h-full w-64 bg-[#060D1A] border-r border-border-subtle flex flex-col shrink-0 z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold flex items-center justify-center text-gold font-serif font-bold text-lg">W</div>
            <div>
              <div className="font-serif text-sm font-bold tracking-wider text-gold">WILLISTON ADMIN</div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gold"></span> Staff Portal
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="lg:hidden text-gray-text hover:text-white flex items-center justify-center"
            style={{
              minHeight: '44px',
              minWidth: '44px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ pointerEvents: 'none' }}>
              <X size={20} />
            </span>
          </button>
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
            onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'overview' ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white hover:bg-navy-light/20'
            }`}
            style={{
              minHeight: '44px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ pointerEvents: 'none' }} className="flex items-center gap-3 w-full">
              <LayoutDashboard size={18} /> Overview
            </span>
          </button>

          <button 
            onClick={() => { setActiveTab('deposits'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'deposits' ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white hover:bg-navy-light/20'
            }`}
            style={{
              minHeight: '44px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ pointerEvents: 'none' }} className="flex items-center gap-3 w-full">
              <ArrowDownToLine size={18} /> Deposits 
              {pendingDepositsCount > 0 && (
                <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === 'deposits' ? 'bg-navy text-gold' : 'bg-red-500 text-white'
                }`}>{pendingDepositsCount}</span>
              )}
            </span>
          </button>

          <button 
            onClick={() => { setActiveTab('withdrawals'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'withdrawals' ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white hover:bg-navy-light/20'
            }`}
            style={{
              minHeight: '44px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ pointerEvents: 'none' }} className="flex items-center gap-3 w-full">
              <ArrowUpFromLine size={18} /> Withdrawals 
              {pendingWithdrawalsCount > 0 && (
                <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === 'withdrawals' ? 'bg-navy text-gold' : 'bg-amber-500 text-navy'
                }`}>{pendingWithdrawalsCount}</span>
              )}
            </span>
          </button>
          
          <button 
            onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'users' ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white hover:bg-navy-light/20'
            }`}
            style={{
              minHeight: '44px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ pointerEvents: 'none' }} className="flex items-center gap-3 w-full">
              <Users size={18} /> Users
            </span>
          </button>

          <button 
            onClick={() => { setActiveTab('investments'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'investments' ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white hover:bg-navy-light/20'
            }`}
            style={{
              minHeight: '44px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ pointerEvents: 'none' }} className="flex items-center gap-3 w-full">
              <Layers size={18} /> Investments
            </span>
          </button>

          <button 
            onClick={() => { setActiveTab('properties'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'properties' ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white hover:bg-navy-light/20'
            }`}
            style={{
              minHeight: '44px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ pointerEvents: 'none' }} className="flex items-center gap-3 w-full">
              <Building size={18} /> Properties
            </span>
          </button>

          <button 
            onClick={() => { setActiveTab('announcements'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'announcements' ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white hover:bg-navy-light/20'
            }`}
            style={{
              minHeight: '44px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ pointerEvents: 'none' }} className="flex items-center gap-3 w-full">
              <Bell size={18} /> Announcements
            </span>
          </button>

          <button 
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === 'settings' ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white hover:bg-navy-light/20'
            }`}
            style={{
              minHeight: '44px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ pointerEvents: 'none' }} className="flex items-center gap-3 w-full">
              <Settings size={18} /> Settings
            </span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border-subtle">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 transition"
            style={{
              minHeight: '44px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ pointerEvents: 'none' }} className="flex items-center gap-3 w-full">
              <LogOut size={18} /> Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col bg-navy">
        
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-border-subtle bg-[#060D1A] flex items-center justify-between px-6 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="lg:hidden text-gray-text hover:text-white flex items-center justify-center mr-1"
              style={{
                minHeight: '44px',
                minWidth: '44px',
                cursor: 'pointer',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span style={{ pointerEvents: 'none' }} className="flex items-center justify-center">
                <Menu size={20} />
              </span>
            </button>
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold flex items-center justify-center text-gold font-serif font-bold text-lg hidden lg:flex">W</div>
            <span className="font-serif text-sm font-bold tracking-wider text-gold">WILLISTON ADMIN</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-xs text-gray-text font-semibold flex items-center gap-1.5">
              <User size={14} className="text-gold" />
              Admin: <span className="text-white">Administrator</span>
            </div>

            {/* Live Clock */}
            <div className="text-xs text-gray-text font-mono flex items-center gap-1.5 bg-navy/60 border border-border-subtle px-3 py-1.5 rounded-lg">
              <Calendar size={14} className="text-gold" />
              <span>
                {currentTime ? currentTime.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) + ' ' + currentTime.toLocaleTimeString() : '...'}
              </span>
            </div>

            <button 
              onClick={handleLogout}
              className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1.5 bg-red-950/20 px-3 py-1.5 rounded-lg border border-red-500/10 transition"
            >
              <LogOut size={14} /> Logout
            </button>
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
                {/* Card 1: Total Users */}
                <div 
                  onClick={() => setActiveTab('users')}
                  className="bg-navy-mid border border-gold/20 hover:border-gold/40 rounded-xl p-5 cursor-pointer transition duration-200"
                >
                  <div className="text-[10px] text-gold uppercase tracking-wider font-bold mb-1">Total Users</div>
                  <div className="text-xl font-bold font-serif text-white">
                    {analytics ? analytics.totalUsers.toLocaleString() : '...'}
                  </div>
                  <div className="text-[9px] text-green-400 mt-2 flex items-center">
                    <ArrowUpRight size={10} className="mr-0.5" /> +{analytics ? analytics.newUsersToday : 0} today
                  </div>
                </div>

                {/* Card 2: Pending Deposits */}
                <div 
                  onClick={() => { setActiveTab('deposits'); setDepositFilter('⏳ Pending'); }}
                  className="bg-navy-mid border border-red-500/20 hover:border-red-500/40 rounded-xl p-5 cursor-pointer transition duration-200"
                >
                  <div className="text-[10px] text-red-400 uppercase tracking-wider font-bold mb-1">Pending Deposits</div>
                  <div className="text-xl font-bold font-serif text-red-500">
                    {analytics ? analytics.pendingDeposits.count : pendingDepositsCount}
                  </div>
                  <div className="text-[9px] text-red-400 mt-2 hover:underline font-medium">
                    Needs Action
                  </div>
                </div>

                {/* Card 3: Pending Withdrawals */}
                <div 
                  onClick={() => { setActiveTab('withdrawals'); setWithdrawalFilter('Pending'); }}
                  className="bg-navy-mid border border-amber-500/20 hover:border-amber-500/40 rounded-xl p-5 cursor-pointer transition duration-200"
                >
                  <div className="text-[10px] text-amber-400 uppercase tracking-wider font-bold mb-1">Pending Withdrawals</div>
                  <div className="text-xl font-bold font-serif text-amber-500">
                    {analytics ? analytics.pendingWithdrawals.count : pendingWithdrawalsCount}
                  </div>
                  <div className="text-[9px] text-amber-400 mt-2 hover:underline font-medium">
                    Needs Action
                  </div>
                </div>

                {/* Card 4: Total Deposited Today */}
                <div className="bg-navy-mid border border-green-500/20 rounded-xl p-5">
                  <div className="text-[10px] text-green-400 uppercase tracking-wider font-bold mb-1">Deposited Today</div>
                  <div className="text-xl font-bold font-serif text-green-400">
                    {analytics ? `$${analytics.totalDepositedToday.toLocaleString()}` : '...'}
                  </div>
                  <div className="text-[9px] text-gray-500 mt-2">Confirmed today</div>
                </div>

                {/* Card 5: Total Platform Balance */}
                <div className="bg-navy-mid border border-gold/20 rounded-xl p-5">
                  <div className="text-[10px] text-gold uppercase tracking-wider font-bold mb-1">Platform Balance</div>
                  <div className="text-xl font-bold font-serif text-gold">
                    {analytics ? `$${analytics.platformBalance.toLocaleString()}` : '...'}
                  </div>
                  <div className="text-[9px] text-green-400 mt-2">Sum of all wallets</div>
                </div>

                {/* Card 6: Total Paid Out */}
                <div className="bg-navy-mid border border-blue-500/20 rounded-xl p-5">
                  <div className="text-[10px] text-blue-400 uppercase tracking-wider font-bold mb-1">Total Paid Out</div>
                  <div className="text-xl font-bold font-serif text-blue-400">
                    {analytics ? `$${analytics.totalWithdrawn.toLocaleString()}` : '...'}
                  </div>
                  <div className="text-[9px] text-gray-500 mt-2">Approved payouts</div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left: Bar Chart */}
                <div className="bg-navy-mid border border-border-subtle rounded-xl p-6 flex flex-col">
                  <h3 className="text-md font-serif text-gold mb-6 font-semibold">New Investors per Month (Jan - Jun)</h3>
                  <div className="h-[240px] w-full mt-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barChartToRender} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
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
                          data={pieChartToRender}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={4}
                          dataKey="value"
                          stroke="none"
                          isAnimationActive={false}
                        >
                          {pieChartToRender.map((entry, index) => (
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
                    {pieChartToRender.map((entry, index) => {
                      const pct = Math.round((entry.value / totalPieValue) * 100);
                      return (
                        <div key={entry.name} className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></div>
                          <span className="text-[11px] text-gray-text">{entry.name} ({pct}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="bg-navy-mid border border-border-subtle rounded-xl overflow-hidden p-6 shadow-xl">
                <h3 className="text-md font-serif font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {(transactions.length > 0 ? transactions : recentActivities).slice(0, 20).map((act: any) => {
                    const timeStr = act.date ? timeAgo(act.date) : act.time;
                    const actionType = (act.type || act.action || '').toLowerCase();
                    
                    let colorClass = 'text-blue-400';
                    if (actionType.includes('deposit')) {
                      colorClass = 'text-green-400';
                    } else if (actionType.includes('withdraw')) {
                      colorClass = 'text-amber-400';
                    } else if (actionType.includes('invest') || actionType.includes('return')) {
                      colorClass = 'text-gold';
                    }

                    const amt = typeof act.amount === 'number' 
                      ? `$${act.amount.toLocaleString()}` 
                      : String(act.amount).startsWith('₦')
                      ? String(act.amount).replace('₦', '$')
                      : act.amount;

                    return (
                      <div 
                        key={act.id || act.reference} 
                        className={`p-3.5 rounded-xl border border-border-subtle/50 flex justify-between items-center bg-navy-light/10 hover:border-gold/25 transition duration-200`}
                      >
                        <div className="text-xs text-gray-text font-medium flex items-center gap-2">
                          <span className="text-[10px] text-gray-500 font-mono">{timeStr}</span>
                          <span className="text-border-subtle font-normal">|</span>
                          <span className="text-white font-semibold">{act.investor}</span>
                          <span className="text-border-subtle font-normal">|</span>
                          <span className={`${colorClass} font-semibold`}>{act.type || act.action}</span>
                          <span className="text-border-subtle font-normal">|</span>
                          <span className="text-gold font-mono font-bold">{amt}</span>
                        </div>
                        <div>
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                            act.status === 'completed' || act.status === 'Confirmed' || act.status === 'Approved' || act.status === 'Completed'
                              ? 'bg-green-500/10 text-green-400 border border-green-500/10' 
                              : act.status === 'pending' || act.status === 'Pending'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10'
                              : 'bg-red-500/10 text-red-400 border border-red-500/10'
                          }`}>{act.status}</span>
                        </div>
                      </div>
                    );
                  })}
                  {transactions.length === 0 && recentActivities.length === 0 && (
                    <p className="text-center text-xs text-gray-text py-8">No recent transactions logged.</p>
                  )}
                </div>
              </div>

            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Header */}
              <div>
                <h1 className="text-3xl font-serif font-bold text-white mb-2">Users Management</h1>
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
                        <th className="p-4 font-semibold">Name</th>
                        <th className="p-4 font-semibold">Email</th>
                        <th className="p-4 font-semibold">Plan</th>
                        <th className="p-4 font-semibold">Total Invested</th>
                        <th className="p-4 font-semibold">Wallet Balance</th>
                        <th className="p-4 font-semibold">KYC Status</th>
                        <th className="p-4 font-semibold">Account Status</th>
                        <th className="p-4 font-semibold font-mono">Joined</th>
                        <th className="p-4 font-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {displayedInvestors.map((inv) => (
                        <tr key={inv.id} className="hover:bg-navy-light/20 transition-colors">
                          <td className="p-4 font-semibold text-white">
                            <div>{inv.name}</div>
                            <div className="text-[9px] text-gray-text/50 font-mono mt-0.5">{inv.id}</div>
                          </td>
                          <td className="p-4 text-xs text-gray-300">{inv.email}</td>
                          <td className="p-4 text-xs text-gold font-medium">{inv.plan}</td>
                          <td className="p-4 font-mono text-xs">₦{inv.amountInvested.toLocaleString()}</td>
                          <td className="p-4 font-mono text-xs text-green-400">₦{inv.walletBalance.toLocaleString()}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                              String(inv.kycStatus).toLowerCase() === 'approved' || String(inv.kycStatus).toLowerCase() === 'verified'
                                ? 'bg-green-500/10 text-green-400 border border-green-500/10'
                                : String(inv.kycStatus).toLowerCase() === 'submitted'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/10'
                                : String(inv.kycStatus).toLowerCase() === 'rejected'
                                ? 'bg-red-500/10 text-red-400 border border-red-500/10'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/10'
                            }`}>{inv.kycStatus || 'pending'}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                              inv.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                            }`}>{inv.status}</span>
                          </td>
                          <td className="p-4 text-xs text-gray-text font-mono">{inv.dateJoined}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => setSelectedInvestor(inv)} 
                                className="px-2 py-1 bg-navy border border-border-subtle rounded text-[10px] hover:border-gold transition flex items-center gap-1"
                              >
                                <Eye size={10} /> Profile
                              </button>
                              
                              {String(inv.kycStatus).toLowerCase() === 'submitted' && (
                                <button 
                                  onClick={() => setKycReviewUser(inv)}
                                  className="px-2 py-1 bg-blue-950/40 border border-blue-500/30 text-blue-400 rounded text-[10px] font-bold hover:bg-blue-600 hover:text-white transition flex items-center gap-1"
                                >
                                  Verify KYC
                                </button>
                              )}

                              <button 
                                onClick={() => handleUpdateUserStatus(inv.id, inv.status === 'Active' ? 'suspended' : 'active')}
                                className={`px-2 py-1 rounded text-[10px] font-bold border transition ${
                                  inv.status === 'Active'
                                    ? 'bg-red-950/20 border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white'
                                    : 'bg-green-950/20 border-green-500/30 text-green-400 hover:bg-green-600 hover:text-white'
                                }`}
                              >
                                {inv.status === 'Active' ? 'Suspend' : 'Reactivate'}
                              </button>

                              <button 
                                onClick={() => {
                                  setTransactionSearchQuery(inv.email);
                                  setActiveTab('transactions');
                                }}
                                className="px-2 py-1 bg-navy border border-border-subtle rounded text-[10px] hover:border-gold transition"
                              >
                                Tx Log
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {displayedInvestors.length === 0 && (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-gray-text text-sm">No users found matching the filter query.</td>
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
              TAB VIEW: INVESTMENTS
              ========================================== */}
          {activeTab === 'investments' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Header */}
              <div>
                <h1 className="text-3xl font-serif font-bold text-white mb-2">Investments Management</h1>
                <p className="text-gray-text text-sm">Review and manually mature user investment plans across the platform.</p>
              </div>

              {/* Filters */}
              <div className="flex bg-navy-mid border border-border-subtle rounded-xl p-4">
                <div className="flex gap-1.5">
                  {['All', 'Active', 'Matured'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setInvestmentsFilter(f)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                        investmentsFilter === f ? 'bg-gold text-navy font-bold' : 'text-gray-text hover:text-white hover:bg-navy-light/30'
                      }`}
                    >
                      {f}
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
                        <th className="p-4 font-semibold">User</th>
                        <th className="p-4 font-semibold">Plan</th>
                        <th className="p-4 font-semibold">Amount</th>
                        <th className="p-4 font-semibold">ROI %</th>
                        <th className="p-4 font-semibold">Start Date</th>
                        <th className="p-4 font-semibold">End Date</th>
                        <th className="p-4 font-semibold">Daily Profit</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {investments
                        .filter(inv => {
                          if (investmentsFilter === 'All') return true;
                          return String(inv.status).toLowerCase() === investmentsFilter.toLowerCase();
                        })
                        .map((inv) => (
                          <tr key={inv.id} className="hover:bg-navy-light/20 transition-colors">
                            <td className="p-4">
                              <div className="font-semibold text-white">{inv.userName}</div>
                              <div className="text-[10px] text-gray-500 font-mono mt-0.5">{inv.userEmail}</div>
                            </td>
                            <td className="p-4 text-xs font-bold text-gold uppercase">{inv.planName}</td>
                            <td className="p-4 font-mono text-xs font-semibold">₦{inv.amount.toLocaleString()}</td>
                            <td className="p-4 font-mono text-xs text-green-400 font-bold">{inv.roi}%</td>
                            <td className="p-4 text-xs text-gray-300 font-mono">{inv.startDate}</td>
                            <td className="p-4 text-xs text-gray-300 font-mono">{inv.endDate}</td>
                            <td className="p-4 font-mono text-xs text-gold">₦{(inv.dailyProfit || 0).toLocaleString()}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                                inv.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/10' : 'bg-gray-500/10 text-gray-400'
                              }`}>{inv.status}</span>
                            </td>
                            <td className="p-4">
                              <div className="flex justify-center">
                                {inv.status === 'active' ? (
                                  <button
                                    onClick={() => handleMarkAsMatured(inv.id)}
                                    className="px-2.5 py-1.5 bg-gold hover:bg-gold-light text-navy font-bold rounded-lg text-[10px] transition shadow"
                                  >
                                    Mark as Matured
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-gray-text/50 font-mono italic">Matured</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      {investments.length === 0 && (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-gray-text text-sm">No investments registered yet on the platform.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
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
                          <td className="p-4 font-mono text-gold">₦{p.minAmount.toLocaleString()}</td>
                          <td className="p-4 font-mono font-bold text-green-400">{p.roi}%</td>
                          <td className="p-4 text-gray-300">{p.activeInvestors}</td>
                          <td className="p-4 font-mono">₦{p.totalInvested.toLocaleString()}</td>
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
              TAB VIEW: PROPERTIES CATALOG
              ========================================== */}
          {activeTab === 'properties' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-serif font-bold text-white mb-2">Properties Catalog</h1>
                  <p className="text-gray-text text-sm">Add, remove, and manage properties listed in the investments catalog.</p>
                </div>
                <button
                  onClick={() => setShowAddPropertyModal(true)}
                  className="px-4 py-2.5 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl text-xs flex items-center gap-2 self-start md:self-auto transition shadow-lg"
                >
                  <Plus size={16} /> Add Property
                </button>
              </div>

              {/* Property Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((prop) => (
                  <div key={prop.id} className="bg-navy-mid border border-border-subtle rounded-xl overflow-hidden flex flex-col group hover:border-gold/30 transition duration-300">
                    <div className="relative aspect-[4/3] bg-navy flex flex-col items-center justify-center border-b border-border-subtle">
                      {prop.image_url ? (
                        <img src={prop.image_url} alt={prop.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <>
                          <Building size={48} className="text-gray-600 mb-2" />
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">No Image</span>
                        </>
                      )}
                      
                      <div className="absolute top-3 left-3 bg-[rgba(4,9,26,0.9)] border border-white/10 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded text-white flex items-center gap-1.5 shadow-lg">
                        <div className={`w-1.5 h-1.5 rounded-full ${prop.status === 'Hot Deal' ? 'bg-gold' : prop.status === 'Coming Soon' ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                        {prop.status}
                      </div>

                      <button
                        onClick={() => handleDeleteProperty(prop.id)}
                        className="absolute bottom-3 right-3 p-2 bg-red-950/80 border border-red-500/30 rounded-lg text-red-400 hover:text-white hover:bg-red-600 transition"
                        title="Delete Property"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-gold uppercase tracking-widest font-bold">{prop.type_display || prop.type}</span>
                        <h3 className="font-serif text-lg text-white font-bold mt-1 line-clamp-1">{prop.name}</h3>
                        <p className="text-gray-text text-xs mt-2 flex items-center gap-1">
                          <MapPin size={12} className="shrink-0 text-gold" /> <span className="line-clamp-1">{prop.location}</span>
                        </p>
                      </div>

                      <div className="border-t border-border-subtle/55 my-4"></div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="text-gray-text uppercase tracking-widest text-[9px]">Price</div>
                          <div className="font-bold text-white mt-0.5">{prop.price}</div>
                        </div>
                        <div>
                          <div className="text-gray-text uppercase tracking-widest text-[9px]">ROI</div>
                          <div className="font-bold text-gold mt-0.5">{prop.roi}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {properties.length === 0 && (
                  <div className="col-span-full py-16 text-center bg-navy-mid border border-dashed border-white/5 rounded-xl">
                    <Building size={48} className="text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-serif text-white font-bold">No Catalog Listings</h3>
                    <p className="text-gray-text text-xs mt-1">Add your first property above to display co-ownership investments on properties catalog.</p>
                  </div>
                )}
              </div>

              {/* Add Property Modal */}
              {showAddPropertyModal && (
                <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
                  <div className="w-full max-w-lg bg-navy-light border border-border-gold rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-serif font-bold text-gold">Add Property Listing</h3>
                      <button onClick={() => setShowAddPropertyModal(false)} className="text-gray-text hover:text-white"><X size={20} /></button>
                    </div>

                    <form onSubmit={handleAddProperty} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Property Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Williston Plaza"
                            value={newProperty.name}
                            onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Location</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Houston, TX"
                            value={newProperty.location}
                            onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Property Type</label>
                          <select
                            value={newProperty.type}
                            onChange={(e) => setNewProperty({ ...newProperty, type: e.target.value })}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none"
                          >
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Land">Land</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Type Display label</label>
                          <input
                            type="text"
                            placeholder="e.g. Mixed-Use Commercial"
                            value={newProperty.type_display}
                            onChange={(e) => setNewProperty({ ...newProperty, type_display: e.target.value })}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Price Target</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. ₦850,000 / Unit"
                            value={newProperty.price}
                            onChange={(e) => setNewProperty({ ...newProperty, price: e.target.value })}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">ROI Percent</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 28%"
                            value={newProperty.roi}
                            onChange={(e) => setNewProperty({ ...newProperty, roi: e.target.value })}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Status badge</label>
                          <select
                            value={newProperty.status}
                            onChange={(e) => setNewProperty({ ...newProperty, status: e.target.value })}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none"
                          >
                            <option value="Open">Open</option>
                            <option value="Hot Deal">Hot Deal</option>
                            <option value="Coming Soon">Coming Soon</option>
                          </select>
                        </div>
                      </div>

                      {/* Image Upload Input */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Custom Image Upload</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Or enter image URL manually..."
                            value={newProperty.image_url}
                            onChange={(e) => setNewProperty({ ...newProperty, image_url: e.target.value })}
                            className="flex-1 bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold"
                          />
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="property-image-upload"
                              disabled={uploadingImage}
                            />
                            <label
                              htmlFor="property-image-upload"
                              className={`px-4 py-2.5 bg-navy border border-border-gold text-gold font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer hover:bg-gold hover:text-navy transition ${uploadingImage ? 'opacity-50 cursor-wait' : ''}`}
                            >
                              <FileUp size={14} /> {uploadingImage ? 'Uploading...' : 'Upload'}
                            </label>
                          </div>
                        </div>
                        {newProperty.image_url && (
                          <div className="mt-3 relative aspect-video w-32 rounded-lg border border-border-subtle overflow-hidden bg-navy/40">
                            <img src={newProperty.image_url} alt="Uploaded Property Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 justify-end pt-4 border-t border-border-subtle">
                        <button
                          type="button"
                          onClick={() => setShowAddPropertyModal(false)}
                          className="px-4 py-2 bg-navy border border-border-subtle rounded-lg text-xs text-gray-text hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={uploadingImage}
                          className="px-4 py-2 bg-gold hover:bg-gold-light text-navy text-xs font-bold rounded-lg transition disabled:opacity-50"
                        >
                          Add Listing
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              TAB VIEW: RENTALS MANAGEMENT
              ========================================== */}
          {activeTab === 'rentals' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-serif font-bold text-white mb-2">Rentals Booking Flow</h1>
                <p className="text-gray-text text-sm">Review, approve, and manage guest check-ins/check-outs for furnished apartments.</p>
              </div>

              {/* Table */}
              <div className="bg-navy-mid border border-border-subtle rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-navy-light/40 text-gray-text text-xs uppercase tracking-wider">
                        <th className="p-4 font-semibold">Guest</th>
                        <th className="p-4 font-semibold">Apartment</th>
                        <th className="p-4 font-semibold font-mono">Check-in / Check-out</th>
                        <th className="p-4 font-semibold font-mono">Duration</th>
                        <th className="p-4 font-semibold">Price</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {rentals.map((r) => (
                        <tr key={r.id} className="hover:bg-navy-light/20 transition-colors">
                          <td className="p-4">
                            <div className="font-semibold text-white">{r.guest_name}</div>
                            <div className="text-[10px] text-gray-text/75">{r.guest_email} &bull; {r.guest_phone || 'No phone'}</div>
                          </td>
                          <td className="p-4 text-xs font-bold text-gold uppercase">{r.apartment_type === '2bed' ? '2 Bedroom Apartment' : '3 Bedroom Apartment'}</td>
                          <td className="p-4 text-xs font-mono text-gray-300">
                            {new Date(r.checkin_date).toLocaleDateString()} &mdash; {new Date(r.checkout_date).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-xs text-gray-300 uppercase tracking-widest">{r.duration_type}</td>
                          <td className="p-4 font-mono font-bold text-white">₦{parseFloat(r.total_price || 0).toLocaleString()}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                              r.status === 'confirmed' ? 'bg-green-500/10 text-green-400' :
                              r.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                              r.status === 'checked_in' ? 'bg-blue-500/10 text-blue-400' :
                              'bg-gray-500/10 text-gray-400'
                            }`}>{r.status.replace('_', ' ')}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              {r.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateRentalStatus(r.id, 'confirmed')}
                                    className="px-2.5 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-[10px] font-bold transition flex items-center gap-1"
                                  >
                                    <Check size={10} /> Approve
                                  </button>
                                  <button
                                    onClick={() => handleRejectRental(r.id)}
                                    className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold transition flex items-center gap-1"
                                  >
                                    <X size={10} /> Reject
                                  </button>
                                </>
                              )}
                              
                              {r.status === 'confirmed' && (
                                <button
                                  onClick={() => handleUpdateRentalStatus(r.id, 'checked_in')}
                                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold transition flex items-center gap-1"
                                >
                                  Check-In
                                </button>
                              )}

                              {r.status === 'checked_in' && (
                                <button
                                  onClick={() => handleUpdateRentalStatus(r.id, 'checked_out')}
                                  className="px-2.5 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-[10px] font-bold transition flex items-center gap-1"
                                >
                                  Check-Out
                                </button>
                              )}

                              {r.status === 'checked_out' && (
                                <span className="text-[10px] text-gray-text/50 font-mono italic">Audit Log Sealed</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      
                      {rentals.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-gray-text text-sm">No rental bookings registered yet.</td>
                        </tr>
                      )}
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
                <p className="text-gray-text text-sm">Approve payout settlements. Check banking accounts details prior to confirming Bank, Opay, or Crypto transfers.</p>
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
          {activeTab === 'deposits' && (() => {
            const getRelativeTime = (dateStr: string) => {
              try {
                const date = new Date(dateStr);
                const now = new Date();
                const diffMs = now.getTime() - date.getTime();
                const diffMins = Math.floor(diffMs / 60000);
                if (diffMins < 1) return 'Just now';
                if (diffMins < 60) return `${diffMins} minutes ago`;
                const diffHours = Math.floor(diffMins / 60);
                if (diffHours < 24) return `${diffHours} hours ago`;
                const diffDays = Math.floor(diffHours / 24);
                return `${diffDays} days ago`;
              } catch (e) {
                return 'recently';
              }
            };

            const pendingCount = deposits.filter(d => d.status?.toLowerCase() === 'pending').length;
            const confirmedTodayCount = deposits.filter(d => d.status?.toLowerCase() === 'confirmed' && (d.created_at ? new Date(d.created_at).toDateString() === new Date().toDateString() : true)).length;
            const rejectedCount = deposits.filter(d => d.status?.toLowerCase() === 'rejected' || d.status?.toLowerCase() === 'failed').length;

            return (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* Header */}
                <div>
                  <h1 className="text-3xl font-serif font-bold text-white mb-2">Deposit Confirmations</h1>
                  <p className="text-gray-text text-sm">Verify wire deposits and bank receipt proof uploads. Approve to update account balances.</p>
                </div>

                {/* Filters */}
                <div className="flex bg-navy-mid border border-border-subtle rounded-xl p-4">
                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      { id: 'Pending', label: `🔴 Pending (${pendingCount})` },
                      { id: 'Confirmed Today', label: `✅ Confirmed Today (${confirmedTodayCount})` },
                      { id: 'Rejected', label: `❌ Rejected (${rejectedCount})` },
                      { id: 'All', label: 'All' }
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setDepositFilter(f.id)}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                          depositFilter === f.id ? 'bg-[#C9A84C] text-[#04091A] font-bold' : 'text-gray-text hover:text-white hover:bg-navy-light/30'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block bg-navy-mid border border-border-subtle rounded-xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-navy-light/40 text-gray-text text-xs uppercase tracking-wider font-sans">
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
                      <tbody className="divide-y divide-border-subtle font-sans">
                        {filteredDeposits.map((d) => (
                          <tr key={d.id} className="hover:bg-navy-light/20 transition-colors">
                            <td className="p-4 font-mono text-xs text-gray-text">{d.id.substring(0, 8)}</td>
                            <td className="p-4 font-semibold text-white">
                              <div>{d.investorName}</div>
                              {d.phone && (
                                <div className="flex flex-col gap-0.5 mt-0.5">
                                  <a href={`tel:${d.phone}`} className="text-gold text-xs font-mono hover:underline block">
                                    📞 {d.phone}
                                  </a>
                                  <a 
                                    href={`https://wa.me/${d.phone.replace(/[\s\-\+]/g, '')}?text=${encodeURIComponent(`Hello ${d.investorName}, we received your deposit request of ₦${d.amount.toLocaleString()} (${d.email}). We are confirming it now and will notify you shortly.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-400 text-[10px] hover:underline flex items-center gap-0.5 font-bold"
                                  >
                                    💬 WhatsApp Chat
                                  </a>
                                </div>
                              )}
                            </td>
                            <td className="p-4 font-mono font-bold text-gold">₦{d.amount.toLocaleString()}</td>
                            <td className="p-4 text-xs">{d.method === 'bank_transfer' ? 'OPay Transfer' : d.method}</td>
                            <td className="p-4 font-mono text-xs text-gray-300">{d.reference}</td>
                            <td className="p-4 text-xs text-gray-text font-mono">{d.date}</td>
                            <td className="p-4">
                              <div className="flex justify-center">
                                {d.receipt ? (
                                  <button 
                                    onClick={() => setViewingReceipt(d)}
                                    className="px-2.5 py-1 bg-navy border border-border-subtle hover:border-gold rounded text-[10px] transition flex items-center gap-1 text-gold"
                                  >
                                    <Eye size={10} /> View Proof
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-gray-text italic">No Proof</span>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                                d.status?.toLowerCase() === 'confirmed' ? 'bg-green-500/10 text-green-400' :
                                d.status?.toLowerCase() === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                                'bg-red-500/10 text-red-400'
                              }`}>{d.status}</span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-2">
                                {d.status?.toLowerCase() === 'pending' ? (
                                  <>
                                    <button 
                                      onClick={() => setConfirmDepositTarget(d)} 
                                      className="px-2.5 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-[10px] font-bold transition flex items-center gap-1"
                                    >
                                      <Check size={10} /> Confirm
                                    </button>
                                    <button 
                                      onClick={() => setRejectDepositTarget(d)} 
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

                {/* Mobile Cards View */}
                <div className="block md:hidden space-y-4">
                  {filteredDeposits.map((d) => {
                    const statusLower = d.status?.toLowerCase();
                    const relativeTime = d.created_at ? getRelativeTime(d.created_at) : 'recently';
                    const cleanPhone = d.phone ? d.phone.replace(/[\s\-\+]/g, '') : '';
                    const waTextMsg = `Hello ${d.investorName}, we received your deposit request of ₦${d.amount.toLocaleString()} (${d.email}). We are confirming it now and will notify you shortly.`;
                    
                    return (
                      <div key={d.id} className="bg-navy-mid border border-border-subtle rounded-xl p-5 space-y-4 shadow-xl font-sans">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] text-gray-text uppercase tracking-wider font-bold mb-0.5">Amount</p>
                            <p className="text-2xl font-bold text-[#C9A84C] font-mono">₦{d.amount.toLocaleString()}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                            statusLower === 'confirmed' ? 'bg-green-500/10 text-green-400' :
                            statusLower === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-red-500/10 text-red-400'
                          }`}>{d.status}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs border-t border-b border-border-subtle/50 py-3">
                          <div>
                            <p className="text-gray-text text-[10px] uppercase font-bold mb-0.5">User</p>
                            <p className="text-white font-semibold">{d.investorName}</p>
                            {d.phone && (
                              <a href={`tel:${d.phone}`} className="text-[#C9A84C] font-mono hover:underline block mt-0.5">
                                📞 Call user
                              </a>
                            )}
                          </div>
                          <div>
                            <p className="text-gray-text text-[10px] uppercase font-bold mb-0.5">Method</p>
                            <p className="text-gray-300 font-semibold">{d.method === 'bank_transfer' ? 'OPay Transfer' : d.method}</p>
                          </div>
                          <div>
                            <p className="text-gray-text text-[10px] uppercase font-bold mb-0.5">Submitted</p>
                            <p className="text-gray-text font-mono">{relativeTime}</p>
                          </div>
                          <div>
                            <p className="text-gray-text text-[10px] uppercase font-bold mb-0.5">Reference</p>
                            <p className="text-gray-300 font-mono break-all">{d.reference}</p>
                          </div>
                        </div>

                        <div className="space-y-2 pt-1">
                          {d.receipt && (
                            <button 
                              onClick={() => setViewingReceipt(d)}
                              className="w-full py-2 bg-navy border border-border-subtle hover:border-gold rounded-lg text-xs transition flex items-center justify-center gap-1.5 text-gold font-bold"
                            >
                              <Eye size={12} /> View Proof
                            </button>
                          )}

                          {d.phone && (
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waTextMsg)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2 bg-navy border border-border-subtle hover:border-gold rounded-lg text-xs transition flex items-center justify-center gap-1.5 text-green-400 font-bold"
                            >
                              📲 Message User on WhatsApp
                            </a>
                          )}

                          {statusLower === 'pending' && (
                            <div className="flex flex-col gap-2 pt-2">
                              <button 
                                onClick={() => setConfirmDepositTarget(d)} 
                                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 shadow-lg"
                              >
                                <Check size={16} /> Confirm
                              </button>
                              <button 
                                onClick={() => setRejectDepositTarget(d)} 
                                className="w-full py-2.5 bg-navy border border-red-500/50 hover:bg-red-950/20 text-red-400 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
                              >
                                <X size={14} /> Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {filteredDeposits.length === 0 && (
                    <div className="bg-navy-mid border border-border-subtle rounded-xl p-8 text-center text-gray-text text-sm">
                      No deposits found matching the filter query.
                    </div>
                  )}
                </div>

              </div>
            );
          })()}

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
          {activeTab === 'announcements' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Header */}
              <div>
                <h1 className="text-3xl font-serif font-bold text-white mb-2">Broadcast Center</h1>
                <p className="text-gray-text text-sm">Send bulk communications to investors via targeted notifications feeds.</p>
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
                    
                    {/* Target & Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Target Group</label>
                        <select 
                          value={notifTarget} 
                          onChange={(e) => setNotifTarget(e.target.value)}
                          className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                        >
                          <option value="all">All Users</option>
                          <option value="active investors">Active Investors</option>
                          <option value="pending kyc">Pending KYC</option>
                          <option value="starter">Starter Plan Investors</option>
                          <option value="growth">Growth Plan Investors</option>
                          <option value="premium">Premium Plan Investors</option>
                          <option value="elite">Elite Plan Investors</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Type</label>
                        <select 
                          value={notifType} 
                          onChange={(e) => setNotifType(e.target.value)}
                          className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                        >
                          <option value="info">Info (blue)</option>
                          <option value="success">Success (green)</option>
                          <option value="warning">Warning (amber)</option>
                          <option value="error">Alert (red)</option>
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

                    {/* Message Textarea */}
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

                    {/* Buttons */}
                    <div className="flex gap-4 pt-2">
                      <button 
                        type="submit" 
                        className="px-6 py-3 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl transition text-xs shadow-lg shadow-gold/5"
                      >
                        Send Announcement
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
                    { id: 'payment_details', label: 'Payment Details' },
                    { id: 'plans', label: 'Plans' },
                    { id: 'exchange_rate', label: 'Exchange Rate' }
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
                  
                  {/* Payment Details tab */}
                  {settingsTab === 'payment_details' && (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveSettings({
                        bank_name: settingsBankName,
                        bank_account_number: settingsAccountNumber,
                        bank_account_name: settingsAccountName,
                        bank_whatsapp: settingsBankWhatsapp,
                        bank_ussd: settingsBankUssd,
                        payment_btc_address: settingsBTC,
                        payment_usdt_address: settingsUSDT,
                        payment_eth_address: settingsETH
                      });
                    }} className="space-y-4">
                      <h3 className="text-sm uppercase tracking-wider text-gold font-bold mb-4 font-serif">Payment details settings</h3>
                      <p className="text-[11px] text-gray-text leading-relaxed font-sans mb-4">
                        Update the bank details, WhatsApp contact, USSD code, and crypto addresses where users send funds.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-text mb-2 font-bold uppercase tracking-wider">Bank Name</label>
                          <input 
                            type="text" 
                            required
                            value={settingsBankName}
                            onChange={(e) => setSettingsBankName(e.target.value)}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold"
                            placeholder="Zenith Bank, GTBank, OPay etc."
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-text mb-2 font-bold uppercase tracking-wider">Account Number</label>
                          <input 
                            type="text" 
                            required
                            value={settingsAccountNumber}
                            onChange={(e) => setSettingsAccountNumber(e.target.value)}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold"
                            placeholder="10-digit account number"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-text mb-2 font-bold uppercase tracking-wider">Account Name</label>
                          <input 
                            type="text" 
                            required
                            value={settingsAccountName}
                            onChange={(e) => setSettingsAccountName(e.target.value)}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold"
                            placeholder="Account name"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-text mb-2 font-bold uppercase tracking-wider">WhatsApp Contact</label>
                          <input 
                            type="text" 
                            required
                            value={settingsBankWhatsapp}
                            onChange={(e) => setSettingsBankWhatsapp(e.target.value)}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold"
                            placeholder="WhatsApp number e.g. +2349167455410"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-text mb-2 font-bold uppercase tracking-wider">USSD Transfer Code</label>
                          <input 
                            type="text" 
                            required
                            value={settingsBankUssd}
                            onChange={(e) => setSettingsBankUssd(e.target.value)}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold"
                            placeholder="USSD transfer code e.g. *955#"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-text mb-2 font-bold uppercase tracking-wider">BTC Wallet Address</label>
                          <input 
                            type="text" 
                            required
                            value={settingsBTC}
                            onChange={(e) => setSettingsBTC(e.target.value)}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold font-mono"
                            placeholder="Bitcoin Address"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-text mb-2 font-bold uppercase tracking-wider">USDT TRC20 Address</label>
                          <input 
                            type="text" 
                            required
                            value={settingsUSDT}
                            onChange={(e) => setSettingsUSDT(e.target.value)}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold font-mono"
                            placeholder="USDT TRC20 Address"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-text mb-2 font-bold uppercase tracking-wider">ETH Address</label>
                          <input 
                            type="text" 
                            required
                            value={settingsETH}
                            onChange={(e) => setSettingsETH(e.target.value)}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold font-mono"
                            placeholder="ETH Address"
                          />
                        </div>
                      </div>
                      <button type="submit" className="px-4 py-2.5 bg-gold hover:bg-gold-light text-navy text-xs font-bold rounded-lg transition mt-4">Save Payment Accounts</button>
                    </form>
                  )}

                  {/* Plans settings tab */}
                  {settingsTab === 'plans' && (
                    <div className="space-y-4">
                      <h3 className="text-sm uppercase tracking-wider text-gold font-bold mb-4 font-serif">Investment Plans Configuration</h3>
                      <p className="text-[11px] text-gray-text leading-relaxed font-sans mb-4">
                        Edit minimum deposit thresholds, cycle return percentages, and enable/disable investment programs.
                      </p>
                      
                      <div className="bg-navy border border-border-subtle rounded-xl overflow-hidden shadow-lg">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-navy-light/40 text-gray-text uppercase tracking-wider">
                                <th className="p-3 font-semibold">Plan Name</th>
                                <th className="p-3 font-semibold">Minimum Deposit</th>
                                <th className="p-3 font-semibold">Annual ROI %</th>
                                <th className="p-3 font-semibold text-center">Status</th>
                                <th className="p-3 font-semibold text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                              {plans.map((p) => {
                                const planMin = p.min_deposit !== undefined ? p.min_deposit : p.minAmount || 0;
                                const planRoi = p.roi_percent !== undefined ? p.roi_percent : p.roi || 0;
                                const isActive = p.is_active !== undefined ? p.is_active : p.enabled;
                                
                                return (
                                  <tr key={p.id} className={`hover:bg-navy-light/20 transition-colors ${!isActive ? 'opacity-50' : ''}`}>
                                    <td className="p-3 font-bold text-white uppercase">{p.name}</td>
                                    <td className="p-3 font-mono text-gold font-bold">₦{planMin.toLocaleString()}</td>
                                    <td className="p-3 font-mono text-green-400 font-bold">{planRoi}%</td>
                                    <td className="p-3 text-center">
                                      <button
                                        onClick={() => handleTogglePlanActive(p)}
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                          isActive ? 'bg-gold' : 'bg-gray-700'
                                        }`}
                                      >
                                        <span
                                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-navy shadow ring-0 transition duration-200 ease-in-out ${
                                            isActive ? 'translate-x-5' : 'translate-x-0'
                                          }`}
                                        />
                                      </button>
                                    </td>
                                    <td className="p-3 text-center">
                                      <button
                                        onClick={() => {
                                          setEditingPlan({
                                            id: p.id,
                                            name: p.name,
                                            minAmount: planMin,
                                            roi: planRoi,
                                            duration_days: p.duration_days,
                                            max_deposit: p.max_deposit,
                                            is_active: isActive
                                          });
                                        }}
                                        className="px-2.5 py-1 bg-navy border border-border-subtle rounded hover:border-gold hover:text-gold transition text-[10px] font-bold"
                                      >
                                        Edit Config
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Exchange Rates tab */}
                  {settingsTab === 'exchange_rate' && (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveSettings({
                        exchange_rate_usd_ngn: settingsUsdToNgn
                      });
                    }} className="space-y-4">
                      <h3 className="text-sm uppercase tracking-wider text-gold font-bold mb-4 font-serif">USD to NGN Exchange Rate</h3>
                      <p className="text-[11px] text-gray-text leading-relaxed font-sans mb-4">
                        Update the conversion rate for US Dollars to Nigerian Naira. This is used when displaying manual conversion rates on the website.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-text mb-2 font-bold uppercase tracking-wider">USD to NGN (₦)</label>
                          <input 
                            type="number" 
                            required
                            value={settingsUsdToNgn}
                            onChange={(e) => setSettingsUsdToNgn(Number(e.target.value))}
                            className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-gold"
                            placeholder="1550"
                          />
                        </div>
                      </div>
                      <button type="submit" className="px-4 py-2.5 bg-gold hover:bg-gold-light text-navy text-xs font-bold rounded-lg transition mt-4">Update Rate</button>
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

      {/* 1. Modal: Confirmation Approve Withdrawal (Mark as Paid) */}
      {confirmApproveWD && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-navy-light border border-border-gold rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-gold mb-4">
              <CheckCircle size={24} />
              <h3 className="text-lg font-serif font-bold text-white">Confirm Payout</h3>
            </div>
            
            <div className="text-sm text-gray-300 leading-relaxed mb-6 font-sans">
              Confirm you have manually sent <strong className="text-gold">₦{confirmApproveWD.amount.toLocaleString()}</strong> to:
              <span className="block bg-navy/50 p-3 border border-border-subtle rounded-lg mt-3 text-xs font-mono text-white leading-relaxed">
                Method: <strong className="text-gold uppercase">{confirmApproveWD.method}</strong>
                {(confirmApproveWD.method === 'Crypto' || confirmApproveWD.method === 'Bitcoin' || confirmApproveWD.method === 'USDT' || confirmApproveWD.method === 'ETH' || confirmApproveWD.method === 'bitcoin' || confirmApproveWD.method === 'usdt') && (
                  <>
                    <br />
                    Crypto Address: <strong className="text-white">{confirmApproveWD.walletAddress}</strong>
                  </>
                )}
                {(confirmApproveWD.method === 'Bank Transfer' || confirmApproveWD.method === 'bank_transfer') && (
                  <>
                    <br />
                    Bank/Wallet: <strong className="text-white">{confirmApproveWD.bank}</strong>
                    <br />
                    Account/Phone No: <strong className="text-white">{confirmApproveWD.accountNo}</strong>
                  </>
                )}
                {confirmApproveWD.method !== 'Crypto' && confirmApproveWD.method !== 'Bitcoin' && confirmApproveWD.method !== 'USDT' && confirmApproveWD.method !== 'ETH' && confirmApproveWD.method !== 'bitcoin' && confirmApproveWD.method !== 'usdt' && confirmApproveWD.method !== 'Bank Transfer' && confirmApproveWD.method !== 'bank_transfer' && (
                  <>
                    <br />
                    Details: <strong className="text-white">{confirmApproveWD.accountNo || confirmApproveWD.walletAddress || 'N/A'}</strong>
                  </>
                )}
                <br />
                Beneficiary: <strong className="text-white">{confirmApproveWD.investorName}</strong>
              </span>
            </div>

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
              <h3 className="text-lg font-serif font-bold text-white font-normal font-sans">Reject Withdrawal Request</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-300 leading-relaxed font-sans">
                Enter the reason for rejecting the withdrawal request of <strong className="text-gold">₦{confirmRejectWD.amount.toLocaleString()}</strong> by <strong className="text-white">{confirmRejectWD.investorName}</strong>:
              </p>
              
              <textarea
                value={withdrawalRejectionReason}
                onChange={(e) => setWithdrawalRejectionReason(e.target.value)}
                required
                placeholder="e.g. Account details mismatch, insufficient verified balance..."
                className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold font-sans"
                rows={3}
              />
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button 
                onClick={() => { setConfirmRejectWD(null); setWithdrawalRejectionReason(''); }} 
                className="px-4 py-2 bg-navy border border-border-subtle rounded-lg text-xs transition text-gray-text hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleRejectWithdrawalAction(confirmRejectWD, withdrawalRejectionReason)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition"
              >
                Reject & Refund
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
              <div className="w-full bg-navy p-3 border border-border-subtle rounded-lg mt-4 space-y-1 text-xs font-sans">
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
                    onClick={() => { setConfirmDepositTarget(viewingReceipt); setViewingReceipt(null); }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg"
                  >
                    Confirm Deposit
                  </button>
                  <button 
                    onClick={() => { setRejectDepositTarget(viewingReceipt); setViewingReceipt(null); }}
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

      {/* 3a. Modal: Confirm Deposit */}
      {confirmDepositTarget && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-navy-light border border-border-gold rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-gold mb-4">
              <CheckCircle size={24} />
              <h3 className="text-lg font-serif font-bold text-white font-normal">Confirm Deposit</h3>
            </div>
            
            <p className="text-sm text-gray-300 leading-relaxed mb-6 font-sans">
              Confirm you received <strong className="text-gold">₦{confirmDepositTarget.amount.toLocaleString()}</strong> in your <strong className="text-white">{confirmDepositTarget.method === 'opay' || confirmDepositTarget.method === 'OPay Transfer' || confirmDepositTarget.method === 'OPay Bank Transfer' ? 'OPay' : 'bank'}</strong> account from <strong className="text-white">{confirmDepositTarget.investorName}</strong>?
            </p>

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setConfirmDepositTarget(null)} 
                className="px-4 py-2 bg-navy border border-border-subtle hover:border-gold rounded-lg text-xs transition text-gray-text hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleConfirmDepositAction(confirmDepositTarget)}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg transition"
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3b. Modal: Reject Deposit */}
      {rejectDepositTarget && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-navy-light border border-red-500/30 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-lg font-serif font-bold text-white font-normal">Reject Deposit Request</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-300 leading-relaxed font-sans">
                Enter the reason for rejecting the deposit of <strong className="text-gold">₦{rejectDepositTarget.amount.toLocaleString()}</strong> by <strong className="text-white">{rejectDepositTarget.investorName}</strong>:
              </p>
              
              <textarea
                value={depositRejectionReason}
                onChange={(e) => setDepositRejectionReason(e.target.value)}
                required
                placeholder="e.g. Reference code invalid, transaction not found..."
                className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold font-sans"
                rows={3}
              />
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button 
                onClick={() => { setRejectDepositTarget(null); setDepositRejectionReason(''); }} 
                className="px-4 py-2 bg-navy border border-border-subtle rounded-lg text-xs transition text-gray-text hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleRejectDepositAction(rejectDepositTarget, depositRejectionReason)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition"
              >
                Reject
              </button>
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
                <label className="block text-xs text-gray-text mb-2">Minimum Investment Amount (₦)</label>
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
      {/* 8. KYC Review Modal */}
      {kycReviewUser && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-navy-light border border-border-gold rounded-2xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-serif font-bold text-gold">Verify KYC: {kycReviewUser.name}</h3>
              <button onClick={() => setKycReviewUser(null)} className="text-gray-text hover:text-white"><X size={20} /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* ID Document Preview */}
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-gray-text font-bold mb-2">ID Document</span>
                <div className="bg-navy rounded-xl border border-border-subtle p-2 flex items-center justify-center min-h-[300px] overflow-hidden font-sans">
                  {kycReviewUser.kycIdUrl ? (
                    <img 
                      src={kycReviewUser.kycIdUrl} 
                      alt="KYC ID Document" 
                      className="max-h-[300px] object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-xs text-gray-text italic">No ID document uploaded</div>
                  )}
                </div>
              </div>

              {/* Selfie Preview */}
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Selfie Photo</span>
                <div className="bg-navy rounded-xl border border-border-subtle p-2 flex items-center justify-center min-h-[300px] overflow-hidden font-sans">
                  {kycReviewUser.kycSelfieUrl ? (
                    <img 
                      src={kycReviewUser.kycSelfieUrl} 
                      alt="KYC Selfie Photo" 
                      className="max-h-[300px] object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-xs text-gray-text italic">No selfie photo uploaded</div>
                  )}
                </div>
              </div>
            </div>

            {/* Rejection Reason */}
            <div className="mb-6 font-sans">
              <label className="block text-xs uppercase tracking-wider text-gray-text font-bold mb-2">Rejection Reason (Required only for Reject)</label>
              <textarea
                value={kycRejectionReason}
                onChange={(e) => setKycRejectionReason(e.target.value)}
                placeholder="Enter rejection reason if you decide to reject this KYC..."
                className="w-full bg-navy border border-border-subtle rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-gold font-sans"
                rows={3}
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-border-subtle">
              <button 
                onClick={() => setKycReviewUser(null)} 
                className="px-4 py-2 bg-navy border border-border-subtle rounded-lg text-xs text-gray-text hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  handleKYCReview(kycReviewUser.id, 'rejected', kycRejectionReason);
                  setKycReviewUser(null);
                  setKycRejectionReason('');
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition"
              >
                Reject KYC
              </button>
              <button 
                onClick={() => {
                  handleKYCReview(kycReviewUser.id, 'approved');
                  setKycReviewUser(null);
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg transition"
              >
                Approve KYC
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="fixed top-5 right-5 z-[1000] bg-[#C9A84C] text-[#04091A] px-6 py-4 rounded-xl shadow-2xl border border-[#C9A84C]/30 flex items-center gap-3 font-semibold text-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg('')} className="text-[#04091A]/70 hover:text-[#04091A] font-bold ml-2">×</button>
        </div>
      )}

    </div>
  );
}
