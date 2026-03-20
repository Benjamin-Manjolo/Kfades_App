
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

// ── Status helpers ──────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { dot: string; pill: string; label: string }> = {
  pending:   { dot: 'bg-amber-400',  pill: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',  label: 'Pending'   },
  confirmed: { dot: 'bg-blue-400',   pill: 'bg-blue-500/15  text-blue-400  border border-blue-500/30',   label: 'Confirmed' },
  completed: { dot: 'bg-emerald-400',pill: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30', label: 'Completed' },
  cancelled: { dot: 'bg-red-400',    pill: 'bg-white/15   text-red-400   border border-red-500/30',    label: 'Cancelled' },
  'no-show': { dot: 'bg-gray-500',   pill: 'bg-gray-500/15  text-black  border border-gray-500/30',   label: 'No-show'   },
};

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG['pending'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ── Stat card ────────────────────────────────────────────────────────────────
const StatCard: React.FC<{ label: string; value: string | number; accent: string; icon: any }> = ({ label, value, accent, icon }) => (
  <div className="bg-white rounded-lg p-5 flex items-center gap-4 backdrop-blur-sm">
    <div className={`w-10 h-10 rounded-md flex items-center justify-center text-md ${accent}`}>
      {icon}
    </div>
    <div>
      <p className="text-black text-xs uppercase tracking-widest">{label}</p>
      <p className="text-black text-2xl font-bold mt-0.5">{value}</p>
    </div>
  </div>
);

// ── Main ─────────────────────────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'analytics'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) { navigate('/admin'); return; }
    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('https://kfades.onrender.com/api/bookings');
      const result = await response.json();
      if (result.success && result.rawData) {
        setBookings(result.rawData);
        const newNotifications: Notification[] = result.rawData.slice(0, 5).map((booking: Booking, index: number) => ({
          id: index,
          message: `New booking from ${booking.customer_name} — ${booking.service_name}`,
          type: booking.status === 'pending' ? 'warning' : 'success',
          timestamp: new Date(booking.created_at).toLocaleString(),
          read: false,
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
      const response = await fetch(`https://kfades.onrender.com/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const markNotificationRead = (id: number) =>
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));

  const unreadCount = notifications.filter(n => !n.read).length;

  // ── Analytics ──
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const todayBookings = bookings.filter(b => b.date === new Date().toISOString().split('T')[0]).length;

  const serviceCounts = bookings.reduce((acc, b) => {
    acc[b.service_name] = (acc[b.service_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topServices = Object.entries(serviceCounts).sort(([, a], [, b]) => b - a).slice(0, 5);

  const filteredBookings = filterStatus === 'all' ? bookings : bookings.filter(b => b.status === filterStatus);

  const TAB_LABELS: Array<{ key: typeof activeTab; label: string }> = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'bookings',  label: 'Bookings'  },
    { key: 'analytics', label: 'Analytics' },
  ];

  return (
    <>
      

      <div className="min-h-screen">

        {/* ── Header ── */}
        <header className="bg-white  px-6 py-4 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
           

            <div className="flex items-center gap-3">
              {/* Notification bell */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(o => !o)}
                  className="relative p-2 rounded-md border border-[#3D444D] text-black hover:text-black hover:bg-white/5 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="fixed left-0 top-12 w-80 bg-white  shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-3 ">
                      <p className="text-black text-sm font-semibold">Notifications</p>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-black text-sm text-center py-6">No notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`px-4 py-3  cursor-pointer hover:bg-white/5 transition-colors ${n.read ? 'opacity-50' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-black text-xs leading-relaxed">{n.message}</p>
                            {!n.read && <span className="w-2 h-2 rounded-full bg-blue-400 mt-1 shrink-0" />}
                          </div>
                          <p className="text-black text-[10px] mt-1">{n.timestamp}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="text-sm text-black hover:text-red-400 border border-[#3D444D] hover:border-red-500/50 px-4 py-2 rounded-md transition-colors duration-200 fixed right-0"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* ── Tabs ── */}
        <nav className="bg-white/80  px-6 backdrop-blur-sm">
          <div className="flex gap-0 max-w-7xl mx-auto">
            {TAB_LABELS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === key
                    ? 'border-black text-black font-bold'
                    : 'border-transparent text-black hover:font-bold'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>

        {/* ── Content ── */}
        <main className="p-6 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <p className="text-black text-sm tracking-wide">Loading bookings…</p>
            </div>
          ) : (
            <>

              {/* ── DASHBOARD TAB ── */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6 ">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Total Revenue"    value={`MWK ${totalRevenue.toLocaleString()}`} accent="bg-black/50" icon="" />
                    <StatCard label="Total Bookings"   value={bookings.length}   accent="bg-black/50"    icon="" />
                    <StatCard label="Pending"          value={pendingBookings}   accent="bg-black/50"  icon="" />
                    <StatCard label="Today"            value={todayBookings}     accent="bg-black/50" icon="" />
                  </div>

                  {/* Recent Bookings */}
                  <div className="bg-white rounded-lg overflow-hidden backdrop-blur-sm">
                    <div className="px-5 py-4 ">
                      <h2 className="text-black font-semibold tracking-wide">Recent Bookings</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-white">
                            {['Customer', 'Service', 'Date & Time', 'Status', 'Price'].map(h => (
                              <th key={h} className="px-5 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#3D444D]">
                          {bookings.slice(0, 5).map(booking => (
                            <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-5 py-4">
                                <p className="text-black font-medium">{booking.customer_name}</p>
                                <p className="text-black text-xs">{booking.phone}</p>
                              </td>
                              <td className="px-5 py-4 text-black">{booking.service_name}</td>
                              <td className="px-5 py-4">
                                <p className="text-black">{new Date(booking.date).toLocaleDateString()}</p>
                                <p className="text-black text-xs">{booking.time}</p>
                              </td>
                              <td className="px-5 py-4"><StatusPill status={booking.status} /></td>
                              <td className="px-5 py-4 text-black font-medium">MWK {booking.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {bookings.length === 0 && (
                        <p className="text-center text-black py-10 text-sm">No bookings yet</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── BOOKINGS TAB ── */}
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  {/* Filter */}
<div className="relative">
  <select
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value)}
    className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all duration-200 capitalize"
   
    >
    {['all', 'pending', 'confirmed', 'completed', 'cancelled', 'no-show'].map(s => (
      <option key={s} value={s} className="capitalize">
        {s.charAt(0).toUpperCase() + s.slice(1)}
      </option>
    ))}
    
    </select>
   

  {/* Custom chevron icon */}
 
</div>

                  {/* Table */}
                  <div className="bg-white rounded-lg overflow-hidden backdrop-blur-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-white">
                            {['ID', 'Customer', 'Service', 'Date & Time', 'Address', 'Payment', 'Status', 'Actions'].map(h => (
                              <th key={h} className="px-5 py-3 text-left text-xs font-medium text-black uppercase tracking-wider whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#3D444D]">
                          {filteredBookings.map(booking => (
                            <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-5 py-4 text-black font-mono text-xs">#{booking.booking_id?.slice(-6)}</td>
                              <td className="px-5 py-4">
                                <p className="text-black font-medium">{booking.customer_name}</p>
                                <p className="text-black text-xs">{booking.phone}</p>
                              </td>
                              <td className="px-5 py-4">
                                <p className="text-black">{booking.service_name}</p>
                                <p className="text-black text-xs">MWK {booking.price}</p>
                              </td>
                              <td className="px-5 py-4">
                                <p className="text-black">{new Date(booking.date).toLocaleDateString()}</p>
                                <p className="text-black text-xs">{booking.time}</p>
                              </td>
                              <td className="px-5 py-4 text-black text-xs max-w-[140px] truncate">{booking.address}</td>
                              <td className="px-5 py-4 text-black capitalize text-xs">{booking.payment_option}</td>
                              <td className="px-5 py-4"><StatusPill status={booking.status} /></td>
                              <td className="px-5 py-4">
                                <select
                                  value={booking.status}
                                  onChange={(e) => updateBookingStatus(booking.booking_id, e.target.value)}
                                  className="bg-white border border-[#3D444D] text-black text-xs rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors"
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
                      <p className="text-center text-black py-10 text-sm">No bookings found</p>
                    )}
                  </div>
                </div>
              )}

              {/* ── ANALYTICS TAB ── */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Top row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Total Revenue', value: `MWK ${totalRevenue.toLocaleString()}`, sub: `From ${bookings.length} bookings`, accent: ' bg-white border-2-blue' },
                      { label: 'Completed',     value: completedBookings,                      sub: `${bookings.length > 0 ? Math.round((completedBookings / bookings.length) * 100) : 0}% completion rate`, accent: 'bg-white border-2-blue' },
                      { label: 'Avg. Booking',  value: `MWK ${bookings.length > 0 ? Math.round(totalRevenue / bookings.length).toLocaleString() : 0}`, sub: 'Per service', accent: 'bg-white border-2-blue' },
                    ].map(card => (
                      <div key={card.label} className={`border-2 rounded-lg p-6 backdrop-blur-sm ${card.accent}`}>
                        <p className="text-black text-xs uppercase tracking-widest">{card.label}</p>
                        <p className="text-black text-3xl font-bold mt-2">{card.value}</p>
                        <p className="text-black text-xs mt-1">{card.sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Top Services */}
                  <div className="bg-white rounded-lg backdrop-blur-sm overflow-hidden">
                    <div className="px-5 py-4 ">
                      <h2 className="text-black font-semibold tracking-wide">Top Services</h2>
                    </div>
                    <div className="p-5 space-y-4">
                      {topServices.length === 0 ? (
                        <p className="text-black text-sm text-center py-4">No data yet</p>
                      ) : topServices.map(([service, count], index) => (
                        <div key={service} className="flex items-center gap-4">
                          <span className="text-md font-bold text-black w-6 text-center">#{index + 1}</span>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1.5">
                              <span className="text-black text-sm font-medium">{service}</span>
                              <span className="text-black text-xs">{count} bookings</span>
                            </div>
                            <div className="w-full bg-white rounded-full h-1.5 border border-[#3D444D]">
                              <div
                                className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-1.5 rounded-full transition-all duration-700"
                                style={{ width: `${(count / bookings.length) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Methods & Status side-by-side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Payment methods */}
                    <div className="bg-white rounded-lg backdrop-blur-sm overflow-hidden">
                      <div className="px-5 py-4 ">
                        <h2 className="text-black font-semibold tracking-wide">Payment Methods</h2>
                      </div>
                      <div className="p-5 grid grid-cols-3 gap-3">
                        {Object.entries(
                          bookings.reduce((acc, b) => {
                            acc[b.payment_option] = (acc[b.payment_option] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        ).map(([method, count]) => (
                          <div key={method} className="bg-white border border-[#3D444D] rounded-lg p-3 text-center">
                            <p className="text-black text-md font-bold">{count}</p>
                            <p className="text-black text-xs capitalize mt-0.5">{method}</p>
                            <p className="text-black text-[10px] mt-0.5">{Math.round((count / bookings.length) * 100)}%</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status distribution */}
                    <div className="bg-white rounded-lg backdrop-blur-sm overflow-hidden">
                      <div className="px-5 py-4 ">
                        <h2 className="text-black font-semibold tracking-wide">Booking Status</h2>
                      </div>
                      <div className="p-8 grid grid-cols-2 gap-4">
                        {['pending', 'confirmed', 'completed', 'cancelled', 'no-show'].map(status => {
                          const count = bookings.filter(b => b.status === status).length;
                          return (
                            <div key={status} className="bg-white border  rounded-lg p-8 text-center">
                              <p className="text-black text-md font-bold">{count}</p>
                              <StatusPill status={status} />
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
    </>
  );
};

export default AdminDashboard;