'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Database, Users, CreditCard, DollarSign, Lock } from 'lucide-react';
import { formatEthiopianBirr } from '@/lib/utils';

const AdminPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showFirstTimeSetup, setShowFirstTimeSetup] = useState(false);
  const [adminData, setAdminData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: ''
  });

  // Check authentication on mount
  useEffect(() => {
    const adminAuth = localStorage.getItem('nile-pay-admin-auth');
    const adminProfile = localStorage.getItem('nile-pay-admin-profile');

    if (adminAuth === 'authenticated') {
      setIsAuthenticated(true);
      if (!adminProfile) {
        setShowFirstTimeSetup(true);
      }
      fetchStats();
    }
  }, []);

  const handleLogin = () => {
    if (adminData.username === 'kraimatic' && adminData.password === 'Amanzewdie@2022') {
      localStorage.setItem('nile-pay-admin-auth', 'authenticated');
      setIsAuthenticated(true);

      // Check if this is first time login
      const adminProfile = localStorage.getItem('nile-pay-admin-profile');
      if (!adminProfile) {
        setShowFirstTimeSetup(true);
      } else {
        fetchStats();
      }
      setMessage('✅ Admin login successful!');
    } else {
      setMessage('❌ Invalid admin credentials');
    }
  };

  const handleFirstTimeSetup = () => {
    if (adminData.email && adminData.fullName) {
      const profile = {
        email: adminData.email,
        fullName: adminData.fullName,
        setupDate: new Date().toISOString()
      };
      localStorage.setItem('nile-pay-admin-profile', JSON.stringify(profile));
      setShowFirstTimeSetup(false);
      setMessage('✅ Admin profile setup complete!');
      fetchStats();
    } else {
      setMessage('❌ Please fill in all required fields');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nile-pay-admin-auth');
    setIsAuthenticated(false);
    setShowFirstTimeSetup(false);
    setAdminData({ username: '', password: '', email: '', fullName: '' });
    setMessage('');
  };

  const handleInitialize = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'initialize' }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ Ethiopian Banking System initialized successfully!');
        await fetchStats();
      } else {
        setMessage('❌ Failed to initialize system: ' + (result.error?.message || 'Unknown error'));
      }
    } catch (error) {
      setMessage('❌ Error: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedBanks = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'seed-banks' }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ Ethiopian banks seeded successfully!');
        await fetchStats();
      } else {
        setMessage('❌ Failed to seed banks: ' + (result.error?.message || 'Unknown error'));
      }
    } catch (error) {
      setMessage('❌ Error: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDemoUser = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-demo-user' }),
      });
      
      const result = await response.json();
      
      if (result) {
        setMessage(`✅ Demo user created: ${result.user?.first_name} ${result.user?.last_name}`);
        await fetchStats();
      } else {
        setMessage('❌ Failed to create demo user');
      }
    } catch (error) {
      setMessage('❌ Error: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/seed');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch stats on component mount
  useState(() => {
    fetchStats();
  });

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="text-4xl mb-4">🇪🇹</div>
            <CardTitle className="text-2xl text-green-600">Nile Pay Admin</CardTitle>
            <CardDescription>Ethiopian Banking System Administration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter admin username"
                value={adminData.username}
                onChange={(e) => setAdminData({...adminData, username: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={adminData.password}
                onChange={(e) => setAdminData({...adminData, password: e.target.value})}
              />
            </div>
            <Button onClick={handleLogin} className="w-full bg-green-600 hover:bg-green-700">
              <Lock className="mr-2 h-4 w-4" />
              Login to Admin Panel
            </Button>
            {message && (
              <div className="text-sm text-center p-2 rounded bg-gray-50">
                {message}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // First Time Setup
  if (showFirstTimeSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="text-4xl mb-4">👋</div>
            <CardTitle className="text-2xl text-green-600">Welcome, Admin!</CardTitle>
            <CardDescription>Please complete your profile setup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={adminData.fullName}
                onChange={(e) => setAdminData({...adminData, fullName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={adminData.email}
                onChange={(e) => setAdminData({...adminData, email: e.target.value})}
              />
            </div>
            <Button onClick={handleFirstTimeSetup} className="w-full bg-green-600 hover:bg-green-700">
              Complete Setup
            </Button>
            {message && (
              <div className="text-sm text-center p-2 rounded bg-gray-50">
                {message}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">🇪🇹 Nile Pay Admin</h1>
          <p className="text-gray-600">Initialize and manage the Ethiopian Banking System</p>
        </div>
        <Button onClick={handleLogout} variant="outline" size="sm">
          Logout
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Button 
          onClick={handleInitialize}
          disabled={isLoading}
          className="h-20 bg-green-600 hover:bg-green-700"
        >
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Database className="mr-2" />}
          Initialize System
        </Button>
        
        <Button 
          onClick={handleSeedBanks}
          disabled={isLoading}
          variant="outline"
          className="h-20"
        >
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : <CreditCard className="mr-2" />}
          Seed Banks Only
        </Button>
        
        <Button 
          onClick={handleCreateDemoUser}
          disabled={isLoading}
          variant="outline"
          className="h-20"
        >
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Users className="mr-2" />}
          Create Demo User
        </Button>
      </div>

      {/* Status Message */}
      {message && (
        <div className="mb-6 p-4 rounded-lg bg-gray-50 border">
          <p className="text-sm">{message}</p>
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.userCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bank Accounts</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.accountCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.transactionCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatEthiopianBirr(stats.totalBalance)}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
          <CardDescription>How to set up your Nile Pay Ethiopian Banking System</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Badge variant="outline" className="mb-2">Step 1</Badge>
            <p className="text-sm text-gray-600">
              Click "Initialize System" to set up Ethiopian banks and create demo users with accounts and transactions.
            </p>
          </div>
          <div>
            <Badge variant="outline" className="mb-2">Step 2</Badge>
            <p className="text-sm text-gray-600">
              Use the demo accounts to test payment transfers, view transactions, and explore the Ethiopian banking features.
            </p>
          </div>
          <div>
            <Badge variant="outline" className="mb-2">Step 3</Badge>
            <p className="text-sm text-gray-600">
              Create additional demo users as needed using the "Create Demo User" button.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
