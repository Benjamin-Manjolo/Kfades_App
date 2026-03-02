import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Booking {
  id: number;
  booking_id: string;
  service_name: string;
  price: number;
  date: string;
  time: string;
  customer_name: string;
  phone: string;
  address: string;
  special_requests: string | null;
  payment_option: string;
  status: string;
  created_at: string;
}

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'analytics'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin');
      return;
    }
    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/bookings');
      const result = await response.json();
      if (result.success && result.rawData) {
        setBookings(result.rawData);
        
        // Generate notifications from bookings
        const newNotifications: Notification[] = result.rawData.slice(0, 5).map((booking: Booking, index: number) => ({
          id: index,
          message: `New booking from ${booking.customer_name} - ${booking.service_name}`,
          type: booking.status === 'pending' ? 'warning' : 'success',
          timestamp: new Date(booking.created_at).toLocaleString(),
          read: false
        }));
        setNotifications(newNotifications);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin');
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const markNotificationRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Analytics calculations
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const todayBookings = bookings.filter(b => b.date === new Date().toISOString().split('T')[0]).length;

  // Service popularity
  const serviceCounts = bookings.reduce((acc, b) => {
    acc[b.service_name] = (acc[b.service_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topServices = Object.entries(serviceCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const filteredBookings = filterStatus === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-800 text-white px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Kfades Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="relative p-2 hover:bg-gray-700 rounded"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm px-6 py-3">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'bookings' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Analytics
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-600">${totalRevenue}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-500 text-sm">Total Bookings</p>
                    <p className="text-3xl font-bold text-blue-600">{bookings.length}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-500 text-sm">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600">{pendingBookings}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-500 text-sm">Today's Bookings</p>
                    <p className="text-3xl font-bold text-purple-600">{todayBookings}</p>
                  </div>
                </div>

                {/* Notifications Panel */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Recent Notifications</h2>
                  </div>
                  <div className="p-4">
                    {notifications.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No notifications</p>
                    ) : (
                      <div className="space-y-3">
                        {notifications.map(notification => (
                          <div 
                            key={notification.id}
                            onClick={() => markNotificationRead(notification.id)}
                            className={`p-4 rounded-lg cursor-pointer flex justify-between items-center ${
                              notification.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-400' :
                              notification.type === 'success' ? 'bg-green-50 border-l-4 border-green-400' :
                              'bg-gray-50 border-l-4 border-gray-400'
                            } ${notification.read ? 'opacity-60' : ''}`}
                          >
                            <div>
                              <p className="text-gray-800">{notification.message}</p>
                              <p className="text-sm text-gray-500">{notification.timestamp}</p>
                            </div>
                            {!notification.read && (
                              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Recent Bookings</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {bookings.slice(0, 5).map(booking => (
                          <tr key={booking.id}>
                            <td className="px-6 py-4">
                              <p className="font-medium text-gray-800">{booking.customer_name}</p>
                              <p className="text-sm text-gray-500">{booking.phone}</p>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{booking.service_name}</td>
                            <td className="px-6 py-4 text-gray-600">
                              {new Date(booking.date).toLocaleDateString()}
                              <br />
                              <span className="text-sm">{booking.time}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-800">${booking.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex gap-4 items-center">
                    <label className="text-gray-700 font-medium">Filter by Status:</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No Show</option>
                    </select>
                  </div>
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredBookings.map(booking => (
                          <tr key={booking.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-500">#{booking.booking_id?.slice(-6)}</td>
                            <td className="px-6 py-4">
                              <p className="font-medium text-gray-800">{booking.customer_name}</p>
                              <p className="text-sm text-gray-500">{booking.phone}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-gray-800">{booking.service_name}</p>
                              <p className="text-sm text-gray-500">${booking.price}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-gray-800">{new Date(booking.date).toLocaleDateString()}</p>
                              <p className="text-sm text-gray-500">{booking.time}</p>
                            </td>
                            <td className="px-6 py-4 text-gray-600 text-sm max-w-xs truncate">{booking.address}</td>
                            <td className="px-6 py-4 text-gray-600 capitalize">{booking.payment_option}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={booking.status}
                                onChange={(e) => updateBookingStatus(booking.booking_id, e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="no-show">No Show</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredBookings.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      No bookings found
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Revenue & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
                    <p className="text-green-100">Total Revenue</p>
                    <p className="text-4xl font-bold mt-2">${totalRevenue}</p>
                    <p className="text-green-100 text-sm mt-2">From {bookings.length} bookings</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
                    <p className="text-blue-100">Completed Bookings</p>
                    <p className="text-4xl font-bold mt-2">{completedBookings}</p>
                    <p className="text-blue-100 text-sm mt-2">{bookings.length > 0 ? Math.round((completedBookings / bookings.length) * 100) : 0}% completion rate</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
                    <p className="text-purple-100">Average Booking Value</p>
                    <p className="text-4xl font-bold mt-2">${bookings.length > 0 ? Math.round(totalRevenue / bookings.length) : 0}</p>
                    <p className="text-purple-100 text-sm mt-2">Per service</p>
                  </div>
                </div>

                {/* Top Services */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Top Services</h2>
                  </div>
                  <div className="p-6">
                    {topServices.length === 0 ? (
                      <p className="text-gray-500 text-center">No data available</p>
                    ) : (
                      <div className="space-y-4">
                        {topServices.map(([service, count], index) => (
                          <div key={service} className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-gray-300">#{index + 1}</span>
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <span className="font-medium text-gray-800">{service}</span>
                                <span className="text-gray-600">{count} bookings</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${(count / bookings.length) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Payment Methods</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(
                        bookings.reduce((acc, b) => {
                          acc[b.payment_option] = (acc[b.payment_option] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([method, count]) => (
                        <div key={method} className="bg-gray-50 rounded-lg p-4 text-center">
                          <p className="text-3xl font-bold text-gray-800">{count}</p>
                          <p className="text-gray-600 capitalize">{method}</p>
                          <p className="text-sm text-gray-500">{Math.round((count / bookings.length) * 100)}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Booking Status Distribution */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Booking Status</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {['pending', 'confirmed', 'completed', 'cancelled', 'no-show'].map(status => {
                        const count = bookings.filter(b => b.status === status).length;
                        return (
                          <div key={status} className="text-center p-4 rounded-lg bg-gray-50">
                            <p className="text-2xl font-bold text-gray-800">{count}</p>
                            <p className="text-gray-600 capitalize">{status}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
