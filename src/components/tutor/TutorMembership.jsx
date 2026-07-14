import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Shield, Zap, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { getMemberships, createMembership, updateMembershipStatus } from '@/services/membershipService';
import toast from 'react-hot-toast';
import Modal from '@/components/admin/Modal';

export default function TutorMembership({ tutorId }) {
  const [currentPlan, setCurrentPlan] = useState('Basic');
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  
  // Payment Modal States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    const fetchMembership = async () => {
      if (!tutorId) {
        setLoading(false);
        return;
      }
      try {
        const res = await getMemberships();
        const userM = (res.data || []).find(
          (m) => m.tutor_id === tutorId && new Date(m.end_date) > new Date()
        );
        if (userM) {
          setCurrentPlan(userM.plan);
        }
      } catch (error) {
        console.error('Failed to fetch membership:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMembership();
  }, [tutorId]);

  const handleUpgrade = (plan) => {
    if (!tutorId) {
      toast.error('Please log in first');
      return;
    }
    setSelectedPlan(plan);
    setUpiId('');
    setPaymentError('');
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!tutorId || !selectedPlan) return;
    
    const formattedUpi = upiId.trim().toLowerCase();
    if (formattedUpi !== 'sanumauryau@ybl') {
      setPaymentError("Payment failed: Invalid UPI ID. Please use 'sanumauryau@ybl'");
      toast.error('Transaction Failed');
      return;
    }

    setUpgrading(true);
    setPaymentError('');
    try {
      const amount = parseInt(selectedPlan.price.replace(/[^0-9]/g, '') || '0', 10);
      const membership = await createMembership({
        tutor_id: tutorId,
        plan_name: selectedPlan.name,
        amount: amount,
      });

      if (membership?.id) {
        await updateMembershipStatus(membership.id, 'Completed');
      }

      toast.success(`Successfully upgraded to ${selectedPlan.name}`);
      setCurrentPlan(selectedPlan.name);
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to upgrade membership');
    } finally {
      setUpgrading(false);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Basic',
      price: 'Free',
      period: 'Forever',
      icon: Shield,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      border: 'border-gray-200',
      features: [
        'Profile listed in directory',
        'Apply to 3 tuitions/month',
        'Standard support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '₹499',
      period: '/month',
      icon: Star,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      border: 'border-secondary',
      popular: true,
      features: [
        'Featured profile badge',
        'Apply to unlimited tuitions',
        'Priority support',
        'Get notified of new leads first'
      ]
    },
    {
      id: 'platinum',
      name: 'Platinum',
      price: '₹999',
      period: '/month',
      icon: Zap,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      border: 'border-primary',
      features: [
        'Everything in Premium',
        'Guaranteed 2 tuitions/month',
        'Dedicated relationship manager',
        'Premium lead access'
      ]
    }
  ];

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">Membership Plans</h2>
        <p className="text-gray-500">Upgrade your membership to get more leads and stand out.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative bg-white rounded-3xl border-2 p-6 flex flex-col ${
              currentPlan === plan.name ? 'border-primary shadow-xl shadow-primary/5' : `border-gray-100 hover:${plan.border} transition-colors hover:shadow-lg`
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-secondary text-primary font-bold text-xs px-4 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
            )}
            
            {currentPlan === plan.name && (
              <span className="absolute top-4 right-4 bg-emerald-100 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Current
              </span>
            )}

            <div className={`w-14 h-14 rounded-2xl ${plan.bgColor} ${plan.color} flex items-center justify-center mb-6`}>
              <plan.icon className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-primary">{plan.name}</h3>
            <div className="mt-2 mb-6 flex items-baseline gap-1">
              <span className="text-3xl font-black text-primary">{plan.price}</span>
              <span className="text-gray-500 text-sm font-medium">{plan.period}</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${plan.color}`} />
                  <span className="text-gray-600 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              disabled={currentPlan === plan.name || upgrading}
              onClick={() => handleUpgrade(plan)}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                currentPlan === plan.name
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-light hover:shadow-md'
              }`}
            >
              {currentPlan === plan.name ? 'Current Plan' : (upgrading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upgrade Now')}
              {currentPlan !== plan.name && !upgrading && <ChevronRight className="w-4 h-4" />}
            </button>
          </motion.div>
        ))}
      </div>

      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setUpiId('');
          setPaymentError('');
        }}
        title="Complete Payment"
        size="sm"
      >
        <div className="flex flex-col gap-5">
          {/* Plan Summary */}
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
            <p className="text-sm text-gray-500 font-medium">Selected Plan</p>
            <div className="flex justify-between items-center mt-1">
              <span className="font-bold text-lg text-primary">{selectedPlan?.name} Plan</span>
              <span className="font-extrabold text-xl text-primary">{selectedPlan?.price}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Validity: 1 Year (Auto-renewing)</p>
          </div>

          {/* UPI Payment Instructions */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              Enter UPI ID for Payment
            </label>
            <div className="relative">
              <input
                type="text"
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value);
                  if (paymentError) setPaymentError('');
                }}
                placeholder="e.g. yourname@upi"
                className={`w-full px-4 py-3 rounded-xl border-2 text-sm transition-all focus:outline-none ${
                  paymentError 
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' 
                    : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                }`}
              />
            </div>
            
            {paymentError && (
              <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {paymentError}
              </p>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 leading-relaxed">
              <strong>Demo Mode Instructions:</strong> Please use the UPI ID <code className="bg-amber-100 px-1 py-0.5 rounded font-mono select-all text-amber-900 font-bold">sanumauryau@ybl</code> to simulate a successful payment. Any other ID will fail.
            </div>
          </div>

          {/* Payment Actions */}
          <button
            disabled={upgrading || !upiId.trim()}
            onClick={handleConfirmPayment}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              !upiId.trim() || upgrading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-light hover:shadow-md'
            }`}
          >
            {upgrading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              'Pay Now'
            )}
          </button>
        </div>
      </Modal>
    </motion.div>
  );
}
