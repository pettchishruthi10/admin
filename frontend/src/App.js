import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  Settings, 
  Gift, 
  Calendar, 
  BookOpen, 
  DollarSign, 
  BarChart3,
  Menu,
  X,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  LogOut,
  Home,
  Mail,
  Phone,
  MapPin,
  Clock,
  Ban,
  CheckCircle,
  XCircle,
  Star,
  TrendingUp
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import './App.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement);

// Auth Context
const AuthContext = createContext();

// Mock Data
const mockData = {
  admin: {
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User'
  },
  participants: [
    { id: '1', name: 'John Smith', email: 'john@email.com', phone: '+1234567890', status: 'Active', registrationDate: '2024-01-15', location: 'New York', bookings: 5 },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1234567891', status: 'Active', registrationDate: '2024-02-20', location: 'Los Angeles', bookings: 3 },
    { id: '3', name: 'Mike Davis', email: 'mike@email.com', phone: '+1234567892', status: 'Blocked', registrationDate: '2024-03-10', location: 'Chicago', bookings: 1 },
    { id: '4', name: 'Emma Wilson', email: 'emma@email.com', phone: '+1234567893', status: 'Active', registrationDate: '2024-04-05', location: 'Miami', bookings: 8 },
    { id: '5', name: 'David Brown', email: 'david@email.com', phone: '+1234567894', status: 'Active', registrationDate: '2024-05-12', location: 'Seattle', bookings: 2 }
  ],
  practitioners: [
    { id: '1', name: 'Dr. Lisa Anderson', email: 'lisa@email.com', modality: 'Yoga', status: 'Approved', registrationDate: '2024-01-10', approvalStatus: 'Approved', rating: 4.8, classes: 15 },
    { id: '2', name: 'Mark Thompson', email: 'mark@email.com', modality: 'Sound Healing', status: 'Pending', registrationDate: '2024-02-15', approvalStatus: 'Pending', rating: 0, classes: 0 },
    { id: '3', name: 'Dr. Jennifer Lee', email: 'jennifer@email.com', modality: 'Meditation', status: 'Approved', registrationDate: '2024-03-01', approvalStatus: 'Approved', rating: 4.9, classes: 22 },
    { id: '4', name: 'Robert Garcia', email: 'robert@email.com', modality: 'Breathwork', status: 'Rejected', registrationDate: '2024-04-01', approvalStatus: 'Rejected', rating: 0, classes: 0 },
    { id: '5', name: 'Amy Chen', email: 'amy@email.com', modality: 'Reiki', status: 'Approved', registrationDate: '2024-05-01', approvalStatus: 'Approved', rating: 4.7, classes: 8 }
  ],
  modalities: [
    { id: '1', name: 'Yoga', description: 'Physical and mental practice', isActive: true, practitionerCount: 5 },
    { id: '2', name: 'Sound Healing', description: 'Healing through sound vibrations', isActive: true, practitionerCount: 3 },
    { id: '3', name: 'Meditation', description: 'Mindfulness and meditation practices', isActive: true, practitionerCount: 8 },
    { id: '4', name: 'Breathwork', description: 'Conscious breathing techniques', isActive: true, practitionerCount: 2 },
    { id: '5', name: 'Reiki', description: 'Energy healing practice', isActive: true, practitionerCount: 4 }
  ],
  giftCards: [
    { id: '1', name: 'Wellness Starter', value: 50, validity: 365, usageCount: 25, isActive: true },
    { id: '2', name: 'Premium Experience', value: 100, validity: 365, usageCount: 15, isActive: true },
    { id: '3', name: 'Ultimate Journey', value: 200, validity: 365, usageCount: 8, isActive: true },
    { id: '4', name: 'Monthly Pass', value: 150, validity: 30, usageCount: 12, isActive: false }
  ],
  classes: [
    { id: '1', title: 'Morning Yoga Flow', practitioner: 'Dr. Lisa Anderson', date: '2024-06-15', time: '08:00', mode: 'In-Person', modality: 'Yoga', status: 'Upcoming', participants: 15, isHidden: false },
    { id: '2', title: 'Sound Bath Meditation', practitioner: 'Mark Thompson', date: '2024-06-16', time: '19:00', mode: 'Online', modality: 'Sound Healing', status: 'Upcoming', participants: 8, isHidden: false },
    { id: '3', title: 'Mindfulness Practice', practitioner: 'Dr. Jennifer Lee', date: '2024-06-14', time: '18:00', mode: 'Hybrid', modality: 'Meditation', status: 'Completed', participants: 20, isHidden: false },
    { id: '4', title: 'Breathwork Session', practitioner: 'Amy Chen', date: '2024-06-17', time: '10:00', mode: 'In-Person', modality: 'Breathwork', status: 'Upcoming', participants: 12, isHidden: true },
    { id: '5', title: 'Reiki Healing Circle', practitioner: 'Amy Chen', date: '2024-06-18', time: '16:00', mode: 'In-Person', modality: 'Reiki', status: 'Upcoming', participants: 6, isHidden: false }
  ],
  bookings: [
    { id: '1', class: 'Morning Yoga Flow', participant: 'John Smith', practitioner: 'Dr. Lisa Anderson', date: '2024-06-15', mode: 'In-Person', status: 'Confirmed', amount: 25 },
    { id: '2', class: 'Sound Bath Meditation', participant: 'Sarah Johnson', practitioner: 'Mark Thompson', date: '2024-06-16', mode: 'Online', status: 'Confirmed', amount: 30 },
    { id: '3', class: 'Mindfulness Practice', participant: 'Emma Wilson', practitioner: 'Dr. Jennifer Lee', date: '2024-06-14', mode: 'Hybrid', status: 'Completed', amount: 20 },
    { id: '4', class: 'Reiki Healing Circle', participant: 'David Brown', practitioner: 'Amy Chen', date: '2024-06-18', mode: 'In-Person', status: 'Cancelled', amount: 35 },
    { id: '5', class: 'Morning Yoga Flow', participant: 'Emma Wilson', practitioner: 'Dr. Lisa Anderson', date: '2024-06-15', mode: 'In-Person', status: 'Confirmed', amount: 25 }
  ]
};

// Generate revenue data
const generateRevenueData = () => {
  const today = new Date();
  const dailyData = [];
  const weeklyData = [];
  const monthlyData = [];
  
  // Daily data for last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i);
    dailyData.push({
      date: format(date, 'MM/dd'),
      revenue: Math.floor(Math.random() * 500) + 200
    });
  }
  
  // Weekly data for last 12 weeks
  for (let i = 11; i >= 0; i--) {
    const date = subDays(today, i * 7);
    weeklyData.push({
      date: format(date, 'MMM dd'),
      revenue: Math.floor(Math.random() * 2000) + 1000
    });
  }
  
  // Monthly data for last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    monthlyData.push({
      date: format(date, 'MMM yyyy'),
      revenue: Math.floor(Math.random() * 8000) + 4000
    });
  }
  
  return { dailyData, weeklyData, monthlyData };
};

// Auth Provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    if (email === mockData.admin.email && password === mockData.admin.password) {
      const userData = { email, name: mockData.admin.name };
      setUser(userData);
      localStorage.setItem('adminUser', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
  };

  const forgotPassword = (email) => {
    // Mock forgot password functionality
    return email === mockData.admin.email;
  };

  const resetPassword = (token, password) => {
    // Mock reset password functionality
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, forgotPassword, resetPassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Login Component
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Forgot your password?
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium">Demo Credentials:</p>
          <p className="text-sm text-blue-700">Email: admin@example.com</p>
          <p className="text-sm text-blue-700">Password: admin123</p>
        </div>
      </div>
    </div>
  );
};

// Forgot Password Component
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const success = forgotPassword(email);
      if (success) {
        setMessage('Password reset link has been sent to your email address.');
      } else {
        setError('Email address not found.');
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Forgot Password</h1>
          <p className="text-gray-600 mt-2">Enter your email to reset your password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <p className="text-sm text-green-700">{message}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

// Layout Component
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Participants', path: '/participants', icon: Users },
    { name: 'Practitioners', path: '/practitioners', icon: UserCheck },
    { name: 'Services', path: '/services', icon: Settings },
    { name: 'Gift Cards', path: '/gift-cards', icon: Gift },
    { name: 'Classes', path: '/classes', icon: Calendar },
    { name: 'Bookings', path: '/bookings', icon: BookOpen },
    { name: 'Revenue', path: '/revenue', icon: DollarSign },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-red-600 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {menuItems.find(item => isActive(item.path))?.name || 'Dashboard'}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {format(new Date(), 'MMM dd, yyyy')}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [revenueData, setRevenueData] = useState(generateRevenueData());

  const stats = [
    {
      name: 'Total Practitioners',
      value: mockData.practitioners.length,
      change: '+12%',
      changeType: 'positive',
      icon: UserCheck,
      color: 'blue'
    },
    {
      name: 'Total Participants',
      value: mockData.participants.length,
      change: '+18%',
      changeType: 'positive',
      icon: Users,
      color: 'green'
    },
    {
      name: 'Total Bookings',
      value: mockData.bookings.length,
      change: '+25%',
      changeType: 'positive',
      icon: BookOpen,
      color: 'purple'
    },
    {
      name: 'Monthly Revenue',
      value: '$12,450',
      change: '+15%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'orange'
    }
  ];

  const getChartData = () => {
    let data = revenueData.weeklyData;
    if (timeRange === 'day') data = revenueData.dailyData;
    if (timeRange === 'month') data = revenueData.monthlyData;

    return {
      labels: data.map(item => item.date),
      datasets: [
        {
          label: 'Revenue',
          data: data.map(item => item.revenue),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  const bookingStatusData = {
    labels: ['Confirmed', 'Completed', 'Cancelled'],
    datasets: [
      {
        data: [15, 8, 2],
        backgroundColor: ['#10B981', '#3B82F6', '#EF4444'],
        borderWidth: 0
      }
    ]
  };

  const modalityData = {
    labels: mockData.modalities.map(m => m.name),
    datasets: [
      {
        label: 'Practitioners',
        data: mockData.modalities.map(m => m.practitionerCount),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className={`text-sm mt-2 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
          <div className="flex space-x-2">
            {['day', 'week', 'month'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="h-80">
          <Line 
            data={getChartData()} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                  }
                },
                x: {
                  grid: {
                    display: false
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Booking Status</h3>
          <div className="h-64">
            <Doughnut 
              data={bookingStatusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Practitioners by Modality</h3>
          <div className="h-64">
            <Bar 
              data={modalityData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">New practitioner approved</p>
              <p className="text-sm text-gray-600">Dr. Jennifer Lee was approved for Meditation classes</p>
            </div>
            <div className="text-sm text-gray-500">2 hours ago</div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">New booking received</p>
              <p className="text-sm text-gray-600">Emma Wilson booked Morning Yoga Flow class</p>
            </div>
            <div className="text-sm text-gray-500">4 hours ago</div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">New participant registered</p>
              <p className="text-sm text-gray-600">David Brown joined the platform</p>
            </div>
            <div className="text-sm text-gray-500">6 hours ago</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Table Component
const DataTable = ({ 
  data, 
  columns, 
  searchable = true, 
  filterable = true, 
  exportable = true,
  onRowAction,
  filters = [],
  searchPlaceholder = "Search...",
  emptyMessage = "No data available"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter and search data
  const filteredData = data.filter(item => {
    const matchesSearch = searchTerm === '' || 
      Object.values(item).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesFilters = Object.entries(filterValues).every(([key, value]) => {
      if (!value) return true;
      return item[key]?.toString().toLowerCase().includes(value.toLowerCase());
    });
    
    return matchesSearch && matchesFilters;
  });

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleExport = () => {
    const csvContent = [
      columns.map(col => col.header).join(','),
      ...sortedData.map(row => 
        columns.map(col => row[col.key] || '').join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            {filterable && filters.length > 0 && (
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                {filters.map(filter => (
                  <select
                    key={filter.key}
                    value={filterValues[filter.key] || ''}
                    onChange={(e) => setFilterValues(prev => ({
                      ...prev,
                      [filter.key]: e.target.value
                    }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{filter.label}</option>
                    {filter.options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ))}
              </div>
            )}
            
            {exportable && (
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && sortConfig.key === column.key && (
                      <span className="text-blue-500">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {onRowAction && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onRowAction ? 1 : 0)} className="px-6 py-8 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map(column => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  {onRowAction && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {onRowAction(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Participants Component
const Participants = () => {
  const [participants, setParticipants] = useState(mockData.participants);

  const columns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'phone', header: 'Phone', sortable: true },
    { key: 'location', header: 'Location', sortable: true },
    { key: 'bookings', header: 'Bookings', sortable: true },
    { key: 'registrationDate', header: 'Registration Date', sortable: true },
    { 
      key: 'status', 
      header: 'Status', 
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: ['Active', 'Blocked']
    }
  ];

  const handleParticipantAction = (participant) => {
    const toggleStatus = () => {
      setParticipants(prev => 
        prev.map(p => 
          p.id === participant.id 
            ? { ...p, status: p.status === 'Active' ? 'Blocked' : 'Active' }
            : p
        )
      );
    };

    return (
      <div className="flex space-x-2">
        <button
          onClick={toggleStatus}
          className={`px-3 py-1 rounded text-xs font-medium ${
            participant.status === 'Active'
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {participant.status === 'Active' ? 'Block' : 'Unblock'}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Participants Management</h2>
        <p className="text-gray-600 mb-6">
          Manage participant accounts, view their activity, and control access to the platform.
        </p>
        
        <DataTable
          data={participants}
          columns={columns}
          filters={filters}
          onRowAction={handleParticipantAction}
          searchPlaceholder="Search participants..."
          emptyMessage="No participants found"
        />
      </div>
    </div>
  );
};

// Practitioners Component
const Practitioners = () => {
  const [practitioners, setPractitioners] = useState(mockData.practitioners);

  const columns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'modality', header: 'Modality', sortable: true },
    { key: 'classes', header: 'Classes', sortable: true },
    { 
      key: 'rating', 
      header: 'Rating', 
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400" />
          <span>{value > 0 ? value.toFixed(1) : 'N/A'}</span>
        </div>
      )
    },
    { key: 'registrationDate', header: 'Registration Date', sortable: true },
    { 
      key: 'approvalStatus', 
      header: 'Approval Status', 
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Approved' 
            ? 'bg-green-100 text-green-800' 
            : value === 'Pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'status', 
      header: 'Account Status', 
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Active' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
  ];

  const filters = [
    {
      key: 'approvalStatus',
      label: 'Approval Status',
      options: ['Approved', 'Pending', 'Rejected']
    },
    {
      key: 'status',
      label: 'Account Status',
      options: ['Active', 'Blocked']
    },
    {
      key: 'modality',
      label: 'Modality',
      options: ['Yoga', 'Sound Healing', 'Meditation', 'Breathwork', 'Reiki']
    }
  ];

  const handlePractitionerAction = (practitioner) => {
    const approve = () => {
      setPractitioners(prev => 
        prev.map(p => 
          p.id === practitioner.id 
            ? { ...p, approvalStatus: 'Approved', status: 'Active' }
            : p
        )
      );
    };

    const reject = () => {
      setPractitioners(prev => 
        prev.map(p => 
          p.id === practitioner.id 
            ? { ...p, approvalStatus: 'Rejected', status: 'Blocked' }
            : p
        )
      );
    };

    const toggleBlock = () => {
      setPractitioners(prev => 
        prev.map(p => 
          p.id === practitioner.id 
            ? { ...p, status: p.status === 'Active' ? 'Blocked' : 'Active' }
            : p
        )
      );
    };

    return (
      <div className="flex space-x-2">
        {practitioner.approvalStatus === 'Pending' && (
          <>
            <button
              onClick={approve}
              className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200"
            >
              Approve
            </button>
            <button
              onClick={reject}
              className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200"
            >
              Reject
            </button>
          </>
        )}
        {practitioner.approvalStatus === 'Approved' && (
          <button
            onClick={toggleBlock}
            className={`px-3 py-1 rounded text-xs font-medium ${
              practitioner.status === 'Active'
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {practitioner.status === 'Active' ? 'Block' : 'Unblock'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Practitioners Management</h2>
        <p className="text-gray-600 mb-6">
          Approve or reject practitioner applications, manage their accounts, and monitor their performance.
        </p>
        
        <DataTable
          data={practitioners}
          columns={columns}
          filters={filters}
          onRowAction={handlePractitionerAction}
          searchPlaceholder="Search practitioners..."
          emptyMessage="No practitioners found"
        />
      </div>
    </div>
  );
};

// Services Component
const Services = () => {
  const [modalities, setModalities] = useState(mockData.modalities);
  const [showModal, setShowModal] = useState(false);
  const [editingModality, setEditingModality] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', isActive: true });

  const columns = [
    { key: 'name', header: 'Service Name', sortable: true },
    { key: 'description', header: 'Description', sortable: true },
    { key: 'practitionerCount', header: 'Practitioners', sortable: true },
    { 
      key: 'isActive', 
      header: 'Status', 
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingModality) {
      setModalities(prev => 
        prev.map(m => 
          m.id === editingModality.id 
            ? { ...m, ...formData }
            : m
        )
      );
    } else {
      const newModality = {
        id: Date.now().toString(),
        ...formData,
        practitionerCount: 0
      };
      setModalities(prev => [...prev, newModality]);
    }
    setShowModal(false);
    setEditingModality(null);
    setFormData({ name: '', description: '', isActive: true });
  };

  const handleEdit = (modality) => {
    setEditingModality(modality);
    setFormData({ 
      name: modality.name, 
      description: modality.description, 
      isActive: modality.isActive 
    });
    setShowModal(true);
  };

  const handleDelete = (modality) => {
    if (window.confirm(`Are you sure you want to delete ${modality.name}?`)) {
      setModalities(prev => prev.filter(m => m.id !== modality.id));
    }
  };

  const handleModalityAction = (modality) => {
    return (
      <div className="flex space-x-2">
        <button
          onClick={() => handleEdit(modality)}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(modality)}
          className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200"
        >
          Delete
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Services & Modalities</h2>
            <p className="text-gray-600 mt-2">
              Manage the services and modalities offered by practitioners on your platform.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </div>
        
        <DataTable
          data={modalities}
          columns={columns}
          onRowAction={handleModalityAction}
          searchPlaceholder="Search services..."
          emptyMessage="No services found"
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingModality ? 'Edit Service' : 'Add New Service'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingModality(null);
                    setFormData({ name: '', description: '', isActive: true });
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {editingModality ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Gift Cards Component  
const GiftCards = () => {
  const [giftCards, setGiftCards] = useState(mockData.giftCards);
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState({ name: '', value: '', validity: '', isActive: true });

  const columns = [
    { key: 'name', header: 'Card Name', sortable: true },
    { 
      key: 'value', 
      header: 'Value', 
      sortable: true,
      render: (value) => `$${value}`
    },
    { 
      key: 'validity', 
      header: 'Validity (Days)', 
      sortable: true
    },
    { key: 'usageCount', header: 'Usage Count', sortable: true },
    { 
      key: 'isActive', 
      header: 'Status', 
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCard) {
      setGiftCards(prev => 
        prev.map(card => 
          card.id === editingCard.id 
            ? { ...card, ...formData, value: parseFloat(formData.value), validity: parseInt(formData.validity) }
            : card
        )
      );
    } else {
      const newCard = {
        id: Date.now().toString(),
        ...formData,
        value: parseFloat(formData.value),
        validity: parseInt(formData.validity),
        usageCount: 0
      };
      setGiftCards(prev => [...prev, newCard]);
    }
    setShowModal(false);
    setEditingCard(null);
    setFormData({ name: '', value: '', validity: '', isActive: true });
  };

  const handleEdit = (card) => {
    setEditingCard(card);
    setFormData({ 
      name: card.name, 
      value: card.value.toString(), 
      validity: card.validity.toString(),
      isActive: card.isActive 
    });
    setShowModal(true);
  };

  const handleDelete = (card) => {
    if (window.confirm(`Are you sure you want to delete ${card.name}?`)) {
      setGiftCards(prev => prev.filter(c => c.id !== card.id));
    }
  };

  const handleCardAction = (card) => {
    return (
      <div className="flex space-x-2">
        <button
          onClick={() => handleEdit(card)}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(card)}
          className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200"
        >
          Delete
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Gift Cards Management</h2>
            <p className="text-gray-600 mt-2">
              Create and manage gift card types with different values and validity periods.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
            <span>Add Gift Card</span>
          </button>
        </div>
        
        <DataTable
          data={giftCards}
          columns={columns}
          onRowAction={handleCardAction}
          searchPlaceholder="Search gift cards..."
          emptyMessage="No gift cards found"
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingCard ? 'Edit Gift Card' : 'Add New Gift Card'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value ($)
                </label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validity (Days)
                </label>
                <input
                  type="number"
                  value={formData.validity}
                  onChange={(e) => setFormData(prev => ({ ...prev, validity: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCard(null);
                    setFormData({ name: '', value: '', validity: '', isActive: true });
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {editingCard ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Classes Component
const Classes = () => {
  const [classes, setClasses] = useState(mockData.classes);

  const columns = [
    { key: 'title', header: 'Class Title', sortable: true },
    { key: 'practitioner', header: 'Practitioner', sortable: true },
    { key: 'date', header: 'Date', sortable: true },
    { key: 'time', header: 'Time', sortable: true },
    { key: 'mode', header: 'Mode', sortable: true },
    { key: 'modality', header: 'Modality', sortable: true },
    { key: 'participants', header: 'Participants', sortable: true },
    { 
      key: 'status', 
      header: 'Status', 
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Upcoming' 
            ? 'bg-blue-100 text-blue-800' 
            : value === 'Completed'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'isHidden', 
      header: 'Visibility', 
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          !value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {!value ? 'Visible' : 'Hidden'}
        </span>
      )
    },
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: ['Upcoming', 'Completed', 'Cancelled']
    },
    {
      key: 'modality',
      label: 'Modality',
      options: ['Yoga', 'Sound Healing', 'Meditation', 'Breathwork', 'Reiki']
    },
    {
      key: 'mode',
      label: 'Mode',
      options: ['In-Person', 'Online', 'Hybrid']
    }
  ];

  const handleClassAction = (classItem) => {
    const toggleVisibility = () => {
      setClasses(prev => 
        prev.map(c => 
          c.id === classItem.id 
            ? { ...c, isHidden: !c.isHidden }
            : c
        )
      );
    };

    return (
      <div className="flex space-x-2">
        <button
          onClick={toggleVisibility}
          className={`px-3 py-1 rounded text-xs font-medium ${
            !classItem.isHidden
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {!classItem.isHidden ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Classes Management</h2>
        <p className="text-gray-600 mb-6">
          Manage all classes created by practitioners, control their visibility, and monitor attendance.
        </p>
        
        <DataTable
          data={classes}
          columns={columns}
          filters={filters}
          onRowAction={handleClassAction}
          searchPlaceholder="Search classes..."
          emptyMessage="No classes found"
        />
      </div>
    </div>
  );
};

// Bookings Component
const Bookings = () => {
  const [bookings] = useState(mockData.bookings);

  const columns = [
    { key: 'class', header: 'Class', sortable: true },
    { key: 'participant', header: 'Participant', sortable: true },
    { key: 'practitioner', header: 'Practitioner', sortable: true },
    { key: 'date', header: 'Date', sortable: true },
    { key: 'mode', header: 'Mode', sortable: true },
    { 
      key: 'amount', 
      header: 'Amount', 
      sortable: true,
      render: (value) => `$${value}`
    },
    { 
      key: 'status', 
      header: 'Status', 
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Confirmed' 
            ? 'bg-blue-100 text-blue-800' 
            : value === 'Completed'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: ['Confirmed', 'Completed', 'Cancelled']
    },
    {
      key: 'mode',
      label: 'Mode',
      options: ['In-Person', 'Online', 'Hybrid']
    }
  ];

  const totalRevenue = bookings
    .filter(booking => booking.status === 'Completed')
    .reduce((sum, booking) => sum + booking.amount, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{bookings.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-100">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {bookings.filter(b => b.status === 'Confirmed').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {bookings.filter(b => b.status === 'Completed').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-purple-100">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">${totalRevenue}</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-100">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Bookings Management</h2>
        <p className="text-gray-600 mb-6">
          View and manage all bookings across your platform with detailed filtering options.
        </p>
        
        <DataTable
          data={bookings}
          columns={columns}
          filters={filters}
          searchPlaceholder="Search bookings..."
          emptyMessage="No bookings found"
        />
      </div>
    </div>
  );
};

// Revenue Component
const Revenue = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [revenueData] = useState(generateRevenueData());
  const [modalityFilter, setModalityFilter] = useState('');

  const getChartData = () => {
    let data = revenueData.monthlyData;
    if (timeRange === 'day') data = revenueData.dailyData;
    if (timeRange === 'week') data = revenueData.weeklyData;

    return {
      labels: data.map(item => item.date),
      datasets: [
        {
          label: 'Revenue',
          data: data.map(item => item.revenue),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  const totalRevenue = revenueData.monthlyData.reduce((sum, item) => sum + item.revenue, 0);
  const avgRevenue = totalRevenue / revenueData.monthlyData.length;

  const modalityRevenue = mockData.modalities.map(modality => ({
    name: modality.name,
    revenue: Math.floor(Math.random() * 10000) + 2000,
    bookings: Math.floor(Math.random() * 50) + 10
  }));

  const modalityChartData = {
    labels: modalityRevenue.map(item => item.name),
    datasets: [
      {
        label: 'Revenue by Modality',
        data: modalityRevenue.map(item => item.revenue),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderWidth: 1
      }
    ]
  };

  const handleExportRevenue = () => {
    const csvContent = [
      'Date,Revenue',
      ...revenueData.monthlyData.map(item => `${item.date},${item.revenue}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-report-${timeRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-2">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                +15% from last period
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-100">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">${Math.round(avgRevenue).toLocaleString()}</p>
              <p className="text-sm text-blue-600 mt-2">Per month</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-100">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${revenueData.monthlyData[revenueData.monthlyData.length - 1]?.revenue.toLocaleString()}
              </p>
              <p className="text-sm text-purple-600 mt-2">Current period</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-purple-100">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              {['day', 'week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={handleExportRevenue}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
        <div className="h-80">
          <Line 
            data={getChartData()} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                  },
                  ticks: {
                    callback: function(value) {
                      return '$' + value.toLocaleString();
                    }
                  }
                },
                x: {
                  grid: {
                    display: false
                  }
                }
              }
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Modality */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue by Modality</h3>
            <select
              value={modalityFilter}
              onChange={(e) => setModalityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Modalities</option>
              {mockData.modalities.map(modality => (
                <option key={modality.id} value={modality.name}>{modality.name}</option>
              ))}
            </select>
          </div>
          <div className="h-64">
            <Bar 
              data={modalityChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                      callback: function(value) {
                        return '$' + value.toLocaleString();
                      }
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Revenue Breakdown Table */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Breakdown</h3>
          <div className="space-y-4">
            {modalityRevenue.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${item.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">
                    ${Math.round(item.revenue / item.bookings)} avg
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/participants" element={
            <ProtectedRoute>
              <Layout>
                <Participants />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/practitioners" element={
            <ProtectedRoute>
              <Layout>
                <Practitioners />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/services" element={
            <ProtectedRoute>
              <Layout>
                <Services />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/gift-cards" element={
            <ProtectedRoute>
              <Layout>
                <GiftCards />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/classes" element={
            <ProtectedRoute>
              <Layout>
                <Classes />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute>
              <Layout>
                <Bookings />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/revenue" element={
            <ProtectedRoute>
              <Layout>
                <Revenue />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;