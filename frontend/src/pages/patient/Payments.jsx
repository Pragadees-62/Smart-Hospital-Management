/**
 * Patient Payments Page
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiCheckCircle, FiClock, FiX, FiCreditCard } from 'react-icons/fi';
import DashboardLayout from '../../components/common/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../utils/api';
import { formatDate, formatCurrency, getStatusClass } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Payments = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [payModal, setPayModal] = useState(null);
  const [payMethod, setPayMethod] = useState('cash');

  const fetchBills = async () => {
    try {
      const res = await api.get('/payments');
      setBills(res.data.data || []);
    } catch { toast.error('Failed to load bills'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBills(); }, []);

  const handlePay = async () => {
    setPayingId(payModal.id);
    try {
      await api.put(`/payments/${payModal.id}/pay`, {
        payment_method: payMethod,
        transaction_id: `TXN${Date.now()}`
      });
      toast.success('Payment successful!');
      setPayModal(null);
      fetchBills();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally { setPayingId(null); }
  };

  const totalPaid = bills.filter(b => b.payment_status === 'paid').reduce((s, b) => s + (b.amount || 0), 0);
  const totalPending = bills.filter(b => b.payment_status === 'pending').reduce((s, b) => s + (b.amount || 0), 0);

  return (
    <DashboardLayout title="Payments & Billing">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Bills', value: bills.length, icon: FiDollarSign, color: 'blue' },
          { label: 'Total Paid', value: formatCurrency(totalPaid), icon: FiCheckCircle, color: 'green' },
          { label: 'Pending', value: formatCurrency(totalPending), icon: FiClock, color: 'orange' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
              color === 'blue' ? 'bg-blue-100' : color === 'green' ? 'bg-emerald-100' : 'bg-orange-100'
            }`}>
              <Icon size={18} className={
                color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-emerald-600' : 'text-orange-600'
              } />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Bills List */}
      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-50">
            <h3 className="font-bold text-gray-900">Billing History</h3>
          </div>
          {bills.length === 0 ? (
            <div className="p-12 text-center">
              <FiDollarSign size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No bills found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {bills.map((bill, i) => (
                <motion.div
                  key={bill.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        bill.payment_status === 'paid' ? 'bg-green-100' : 'bg-orange-100'
                      }`}>
                        {bill.payment_status === 'paid'
                          ? <FiCheckCircle size={18} className="text-green-600" />
                          : <FiClock size={18} className="text-orange-600" />
                        }
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Bill #{bill.id?.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {bill.appointments?.doctors?.users?.full_name
                            ? `Dr. ${bill.appointments.doctors.users.full_name}`
                            : 'Consultation'}
                        </p>
                        <p className="text-xs text-gray-400">{formatDate(bill.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(bill.amount)}</p>
                      <span className={getStatusClass(bill.payment_status)}>{bill.payment_status}</span>
                      {bill.payment_status === 'pending' && (
                        <button
                          onClick={() => setPayModal(bill)}
                          className="block mt-2 btn-primary text-xs py-1.5 px-4"
                        >
                          Pay Now
                        </button>
                      )}
                      {bill.payment_method && (
                        <p className="text-xs text-gray-400 mt-1 capitalize">{bill.payment_method}</p>
                      )}
                    </div>
                  </div>

                  {/* Bill Items */}
                  {bill.items && bill.items.length > 0 && (
                    <div className="mt-3 bg-gray-50 rounded-xl p-3">
                      <div className="grid grid-cols-2 gap-1">
                        {bill.items.map((item, j) => (
                          <div key={j} className="flex justify-between text-xs text-gray-600">
                            <span>{item.description}</span>
                            <span className="font-medium">{formatCurrency(item.amount)}</span>
                          </div>
                        ))}
                      </div>
                      {bill.discount > 0 && (
                        <div className="flex justify-between text-xs text-green-600 mt-1 pt-1 border-t border-gray-200">
                          <span>Discount</span>
                          <span>-{formatCurrency(bill.discount)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payment Modal */}
      {payModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg">Complete Payment</h3>
              <button onClick={() => setPayModal(null)} className="p-2 rounded-lg hover:bg-gray-100">
                <FiX size={18} />
              </button>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 mb-5 text-center">
              <p className="text-gray-500 text-sm">Amount Due</p>
              <p className="text-4xl font-bold text-blue-700">{formatCurrency(payModal.amount)}</p>
            </div>

            <div className="mb-5">
              <label className="input-label">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'cash', label: '💵 Cash' },
                  { value: 'card', label: '💳 Card' },
                  { value: 'upi', label: '📱 UPI' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setPayMethod(value)}
                    className={`py-3 rounded-xl text-sm font-semibold transition-all border-2 ${
                      payMethod === value
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setPayModal(null)} className="btn-secondary flex-1">Cancel</button>
              <button
                onClick={handlePay}
                disabled={!!payingId}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <FiCreditCard size={16} />
                {payingId ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Payments;
