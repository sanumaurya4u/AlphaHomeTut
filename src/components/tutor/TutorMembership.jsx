import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Shield, Zap, ChevronRight, Loader2, XCircle } from 'lucide-react';
import { getMemberships, createMembership, updateMembershipStatus } from '@/services/membershipService';
import { loadRazorpayScript, createRazorpayOrder, verifyRazorpayPayment, openRazorpayCheckout } from '@/services/razorpayService';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function TutorMembership({ tutorId }) {
  const [currentPlan, setCurrentPlan] = useState('Basic');
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const { user, profile } = useAuth();

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

  const handleUpgrade = async (plan) => {
    if (!tutorId) {
      toast.error('Please log in first');
      return;
    }

    const priceNum = parseInt(plan.price.replace(/[^0-9]/g, '') || '0', 10);
    if (priceNum <= 0) {
      toast.error('Cannot process payment for a free plan');
      return;
    }

    setUpgrading(true);

    try {
      // Step 1: Load Razorpay checkout script
      await loadRazorpayScript();

      // Step 2: Create order via backend (amount in paise)
      const amountInPaise = priceNum * 100;
      
      // Razorpay enforces a strict 40 character limit on the receipt field
      let receiptId = `mem_${plan.id}_${tutorId}`.replace(/-/g, '');
      if (receiptId.length > 40) receiptId = receiptId.substring(0, 40);
      
      const orderData = await createRazorpayOrder(
        amountInPaise,
        'INR',
        receiptId
      );

      // Step 3: Open Razorpay checkout modal
      const paymentResult = await openRazorpayCheckout({
        order_id: orderData.order_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Alpha Home Tuition',
        description: `${plan.name} Membership Plan`,
        prefill: {
          name: profile?.full_name || user?.user_metadata?.full_name || '',
          email: user?.email || '',
          contact: profile?.phone || '',
        },
        theme: { color: '#061B45' },
      });

      // Step 4: Verify payment signature via backend
      const verification = await verifyRazorpayPayment(
        paymentResult.razorpay_payment_id,
        paymentResult.razorpay_order_id,
        paymentResult.razorpay_signature
      );

      if (!verification.verified) {
        toast.error('Payment verification failed. Please contact support.');
        return;
      }

      // Step 5: Record membership in Supabase
      const membership = await createMembership({
        tutor_id: tutorId,
        plan_name: plan.name,
        amount: priceNum,
        payment_status: 'Completed'
      });

      toast.success(`Successfully upgraded to ${plan.name}!`);
      setCurrentPlan(plan.name);
    } catch (error) {
      console.error('Payment error:', error);

      if (error.message === 'Payment cancelled by user') {
        toast('Payment cancelled', { icon: '↩️' });
      } else {
        toast.error(error.message || 'Payment failed. Please try again.');
      }
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
    </motion.div>
  );
}
