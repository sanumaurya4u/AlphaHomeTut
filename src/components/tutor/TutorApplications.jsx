import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, IndianRupee, Clock, Search, ChevronRight, Loader2 } from 'lucide-react';
import { getDemoRequests, assignTutorToRequest } from '@/services/demoRequestService';
import { getAssignments } from '@/services/assignmentService';
import toast from 'react-hot-toast';

export default function TutorApplications({ tutorId }) {
  const [availableTuitions, setAvailableTuitions] = useState([]);
  const [appliedTuitions, setAppliedTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [demoRes, assignmentsRes] = await Promise.all([
          getDemoRequests({ status: 'Pending' }),
          getAssignments()
        ]);
        setAvailableTuitions(demoRes.data || []);
        
        const userAssignments = tutorId 
          ? (assignmentsRes.data || []).filter(a => a.tutor_id === tutorId) 
          : (assignmentsRes.data || []);
        setAppliedTuitions(userAssignments);
      } catch (error) {
        toast.error('Failed to fetch applications data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tutorId]);

  const handleApply = async (reqId) => {
    if (!tutorId) {
      toast.error('You must be logged in as a tutor to apply');
      return;
    }
    setApplying(reqId);
    try {
      await assignTutorToRequest(reqId, tutorId, 'Applied from portal');
      toast.success('Successfully applied to tuition');
      // Refresh
      const [demoRes, assignmentsRes] = await Promise.all([
        getDemoRequests({ status: 'Pending' }),
        getAssignments()
      ]);
      setAvailableTuitions(demoRes.data || []);
      const userAssignments = tutorId 
        ? (assignmentsRes.data || []).filter(a => a.tutor_id === tutorId) 
        : (assignmentsRes.data || []);
      setAppliedTuitions(userAssignments);
    } catch (error) {
      toast.error('Failed to apply');
    } finally {
      setApplying(null);
    }
  };

  const filteredAvailable = availableTuitions.filter(t => 
    t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-12">
      {/* Applied Tuitions Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary">Your Applications</h2>
        </div>
        <div className="grid gap-4">
          {appliedTuitions.length === 0 ? (
            <p className="text-gray-500">You haven't applied to any tuitions yet.</p>
          ) : (
            appliedTuitions.map((a, i) => {
              const t = a.demo_requests || {};
              const isDemo = a.status === 'Demo Scheduled';
              const statusColor = isDemo ? 'text-blue-600 bg-blue-50' : 'text-amber-600 bg-amber-50';
              return (
                <motion.div 
                  key={a.id} 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-primary text-lg">{t.subject || 'Unknown Subject'} — {t.class || 'N/A'}</h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" />{t.location || 'N/A'}</span>
                        <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4 text-gray-400" />{t.budget ? `${t.budget}/month` : 'Negotiable'}</span>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-xl text-sm font-bold ${statusColor} border ${statusColor.replace('bg-', 'border-').replace('50', '200')}`}>
                      {a.status || 'Applied'}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </section>

      {/* Available Tuitions Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-primary">Available for you</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by area or subject..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary outline-none w-full sm:w-64" 
            />
          </div>
        </div>
        
        <div className="grid gap-4">
          {filteredAvailable.length === 0 ? (
            <p className="text-gray-500">No available tuitions found.</p>
          ) : (
            filteredAvailable.map((t, i) => (
              <motion.div 
                key={t.id} 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i * 0.1) }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-primary text-lg group-hover:text-secondary transition-colors">{t.subject}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">{t.class}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${t.mode === 'Online' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>{t.mode || 'Home'}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3">
                      <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg"><MapPin className="w-3.5 h-3.5" />{t.location}</span>
                      <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg"><Clock className="w-3.5 h-3.5" />{t.preferred_time || 'Any time'}</span>
                      <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg font-medium"><IndianRupee className="w-3.5 h-3.5" />{t.budget ? `${t.budget}/mo` : 'Negotiable'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 md:mt-0">
                    <p className="text-xs text-gray-400 md:hidden">Posted recently</p>
                    <button 
                      onClick={() => handleApply(t.id)}
                      disabled={applying === t.id}
                      className="bg-secondary hover:bg-secondary-light text-primary font-bold px-6 py-3 rounded-xl text-sm transition-all flex-shrink-0 flex items-center gap-2 disabled:opacity-50"
                    >
                      {applying === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply Now'}
                      {applying !== t.id && <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
