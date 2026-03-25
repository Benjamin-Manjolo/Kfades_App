import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Payout {
  id: string;
  tx_ref: string;
  charge_id: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  mobile: string;
  note?: string;
  error_message?: string;
  created_at: string;
}

interface PayoutStats {
  total: number;
  totalAmount: number;
  successCount: number;
  failedCount: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE = 'https://kfades.onrender.com/paychangu/payouts';

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: Payout['status'] }> = ({ status }) => {
  const styles: Record<Payout['status'], string> = {
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    failed:  'bg-red-50 text-red-600 border border-red-200',
  };
  const dots: Record<Payout['status'], string> = {
    pending: 'bg-amber-400',
    success: 'bg-emerald-500',
    failed:  'bg-red-500',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard: React.FC<{ label: string; value: string; sub?: string; accent?: boolean }> = ({
  label, value, sub, accent = false
}) => (
  <div className={`rounded-xl p-4 border ${accent ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-100'}`}>
    <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${accent ? 'text-gray-400' : 'text-gray-400'}`}>{label}</p>
    <p className={`text-2xl font-semibold tracking-tight ${accent ? 'text-white' : 'text-black'}`}>{value}</p>
    {sub && <p className={`text-xs mt-0.5 ${accent ? 'text-gray-500' : 'text-gray-400'}`}>{sub}</p>}
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const RowSkeleton: React.FC = () => (
  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 animate-pulse">
    <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0" />
    <div className="flex-1 space-y-1.5">
      <div className="h-3 bg-gray-100 rounded w-2/5" />
      <div className="h-2.5 bg-gray-100 rounded w-1/3" />
    </div>
    <div className="h-5 w-16 bg-gray-100 rounded-full" />
    <div className="h-4 w-20 bg-gray-100 rounded" />
  </div>
);

// ─── Manual Payout Modal ──────────────────────────────────────────────────────

interface ManualModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ManualPayoutModal: React.FC<ManualModalProps> = ({ onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [txRef, setTxRef] = useState(`MANUAL_${Date.now()}`);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount), tx_ref: txRef, note }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Payout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-black">Manual Payout</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-black text-lg leading-none">×</button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Amount (MWK)</label>
            <input
              type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="e.g. 2500"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Reference</label>
            <input
              type="text" value={txRef} onChange={e => setTxRef(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Note (optional)</label>
            <input
              type="text" value={note} onChange={e => setNote(e.target.value)}
              placeholder="e.g. Weekly earnings"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          {error && <p className="text-xs text-red-500 flex items-center gap-1"><span>⚠</span>{error}</p>}
        </div>
        <div className="px-5 pb-5 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-black text-white text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2">
            {loading ? (
              <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>Sending…</>
            ) : 'Send Payout'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const PayoutHistory: React.FC = () => {
  const navigate = useNavigate();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [stats, setStats] = useState<PayoutStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'success' | 'failed'>('all');
  const [showModal, setShowModal] = useState(false);

  // Admin gate — redirect if not logged in
  useEffect(() => {
    const isAdmin = localStorage.getItem('adminLoggedIn');
    if (!isAdmin) navigate('/admin');
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [payoutsRes, statsRes] = await Promise.all([
        fetch(API_BASE),
        fetch(`${API_BASE}/stats`),
      ]);
      const payoutsJson = await payoutsRes.json();
      const statsJson   = await statsRes.json();

      if (payoutsJson.success) setPayouts(payoutsJson.data || []);
      if (statsJson.success)   setStats(statsJson.data);
    } catch {
      setError('Failed to load payout data. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = filter === 'all' ? payouts : payouts.filter(p => p.status === filter);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      + ' · '
      + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.4s ease forwards; }
      `}</style>

      {showModal && (
        <ManualPayoutModal
          onClose={() => setShowModal(false)}
          onSuccess={() => { fetchData(); }}
        />
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="text-gray-400 hover:text-black transition-colors text-lg leading-none"
              >
                ←
              </button>
              <h1 className="text-sm font-semibold text-black">Payout History</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchData}
                className="text-xs text-gray-400 hover:text-black transition-colors px-2 py-1"
              >
                Refresh
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="bg-black text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
              >
                + Manual
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 gap-3 fade-up">
              <StatCard
                accent
                label="Total Paid Out"
                value={`MWK ${stats.totalAmount.toLocaleString()}`}
                sub={`${stats.successCount} successful`}
              />
              <div className="grid grid-rows-2 gap-3">
                <StatCard label="Pending" value={String(stats.total - stats.successCount - stats.failedCount)} />
                <StatCard label="Failed" value={String(stats.failedCount)} />
              </div>
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 fade-up">
            {(['all', 'pending', 'success', 'failed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  filter === f ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-xs text-red-600">
              ⚠ {error}
            </div>
          )}

          {/* Payout list */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden fade-up">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-3xl mb-2">💸</p>
                <p className="text-sm font-medium text-gray-400">No payouts yet</p>
                <p className="text-xs text-gray-300 mt-0.5">Payouts appear here after bookings are confirmed</p>
              </div>
            ) : (
              filtered.map((payout, i) => (
                <div
                  key={payout.id}
                  className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
                    payout.status === 'success' ? 'bg-emerald-50' :
                    payout.status === 'pending' ? 'bg-amber-50' : 'bg-red-50'
                  }`}>
                    {payout.status === 'success' ? '✓' : payout.status === 'pending' ? '⏳' : '✕'}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-black truncate">
                      {payout.note || payout.charge_id}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(payout.created_at)}</p>
                    {payout.error_message && (
                      <p className="text-xs text-red-400 mt-0.5 truncate">{payout.error_message}</p>
                    )}
                  </div>

                  {/* Status */}
                  <StatusBadge status={payout.status} />

                  {/* Amount */}
                  <p className="text-sm font-semibold text-black shrink-0">
                    MWK {Number(payout.amount).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Mobile number hint */}
          <p className="text-center text-xs text-gray-300 pb-4">
            Payouts sent to {process.env.REACT_APP_BARBER_MOBILE || '···'}
          </p>

        </div>
      </div>
    </>
  );
};

export default PayoutHistory;