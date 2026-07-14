import { useState, useEffect } from 'react';
import { supabase } from '@/supabase/config';
import { useAuth } from '@/context/AuthContext';
import { Calendar, MapPin, Clock, BookOpen, IndianRupee, HelpCircle, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('demo_requests')
        .select(`
          *,
          tutor_assignments (
            id,
            status,
            notes,
            tutors (
              full_name,
              email,
              phone
            )
          )
        `)
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching student requests:', error);
      toast.error('Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchRequests();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Contacted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Tutor Assigned': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-primary/5 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary">My Tuition Requests</h2>
          <p className="text-gray-500 text-sm mt-1">Track the status of your demo and tutor requests.</p>
        </div>
        <button
          onClick={fetchRequests}
          className="p-2 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-xl transition-all border border-gray-100"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">You haven't submitted any tutor requests yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((req) => (
            <div key={req.id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(req.status)}`}>
                    {req.status}
                  </span>
                  <h3 className="text-lg font-bold text-primary mt-2">
                    {req.subject} Tuition for Class {req.class}
                  </h3>
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(req.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 text-sm text-gray-600 mb-4 border-b border-gray-50 pb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>Location: <strong className="text-gray-800">{req.location}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span>Mode: <strong className="text-gray-800">{req.mode}</strong></span>
                </div>
                {req.timing && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Timing: <strong className="text-gray-800">{req.timing}</strong></span>
                  </div>
                )}
                {req.budget && (
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-gray-400" />
                    <span>Budget: <strong className="text-gray-800">{req.budget}</strong></span>
                  </div>
                )}
              </div>

              {/* Show assigned tutor details if applicable */}
              {req.tutor_assignments && req.tutor_assignments.length > 0 && (
                <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100/50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-800 mb-2">Assigned Tutor Information</h4>
                  {req.tutor_assignments.map((assignment) => (
                    <div key={assignment.id} className="space-y-1.5 text-sm">
                      {assignment.tutors ? (
                        <>
                          <p className="text-gray-800 font-semibold">Tutor: {assignment.tutors.full_name}</p>
                          <p className="text-gray-600">Email: {assignment.tutors.email}</p>
                          <p className="text-gray-600">Phone: {assignment.tutors.phone}</p>
                        </>
                      ) : (
                        <p className="text-gray-600">Assigning process is active...</p>
                      )}
                      {assignment.notes && (
                        <p className="text-gray-500 italic mt-1.5 text-xs">Note: "{assignment.notes}"</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
