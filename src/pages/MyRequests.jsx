import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useRequestStore } from '../store/requestStore';
import StatusTracker from '../components/ui/StatusTracker';
import { HeartPulse, PhoneCall, RefreshCw, CheckCircle2, Clock, Users, ArrowRight } from 'lucide-react';

export default function MyRequests() {
  const { user } = useAuthStore();
  const { myRequests, fetchMyRequests, fetchRequestDetails, selectedRequest, updateStatus } = useRequestStore();
  const [activeReqId, setActiveReqId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMyRequests(user.id);
    }
  }, [user, fetchMyRequests]);

  useEffect(() => {
    if (myRequests.length > 0 && !activeReqId) {
      setActiveReqId(myRequests[0].id);
      fetchRequestDetails(myRequests[0].id);
    }
  }, [myRequests, activeReqId, fetchRequestDetails]);

  const handleSelectRequest = (id) => {
    setActiveReqId(id);
    fetchRequestDetails(id);
  };

  const handleStatusChange = async (newStatus) => {
    if (activeReqId) {
      await updateStatus(activeReqId, newStatus);
      fetchRequestDetails(activeReqId);
    }
  };

  return (
    <div className="w-full py-8 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 dark:text-white flex items-center gap-3">
              <HeartPulse className="w-8 h-8 text-rose-500 animate-pulse" />
              Real-Time Request Tracker
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Track donor responses, notifications, and arranged blood units in real time.
            </p>
          </div>

          <button 
            onClick={() => user && fetchMyRequests(user.id)}
            className="glass-card hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 font-extrabold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer border border-slate-200 dark:border-slate-800"
          >
            <RefreshCw className="w-4 h-4 text-rose-500" /> Refresh Live Pipeline
          </button>
        </div>

        {myRequests.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 text-center space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <HeartPulse className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-heading font-black text-slate-900 dark:text-white">No Active Emergency Requests</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              You haven't posted any emergency blood requests yet. If a medical emergency arises, post a request to notify compatible nearby donors.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col: Request List Sidebar */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-widest">Your Posted Requests</h3>
              {myRequests.map((req) => {
                const isSelected = req.id === activeReqId;
                return (
                  <div
                    key={req.id}
                    onClick={() => handleSelectRequest(req.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'glass-card border-rose-500 ring-2 ring-rose-500/30 shadow-xl'
                        : 'bg-white dark:bg-[#070a13] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-gradient-to-r from-rose-500 to-red-600 text-white font-black text-xs rounded-xl shadow-md">
                        {req.blood_group}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-extrabold">{req.status}</span>
                    </div>

                    <h4 className="font-heading font-extrabold text-base text-slate-900 dark:text-white mt-3">{req.hospital_name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Patient: {req.patient_name} • {req.units} Unit(s)</p>
                  </div>
                );
              })}
            </div>

            {/* Right Col: Detailed Tracker & Responses */}
            {selectedRequest && (
              <div className="lg:col-span-2 space-y-8">
                
                <StatusTracker status={selectedRequest.status} />

                <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 dark:border-slate-800/80">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
                    <div>
                      <h2 className="text-2xl font-heading font-black text-slate-900 dark:text-white">{selectedRequest.patient_name}</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{selectedRequest.hospital_name}, {selectedRequest.city}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusChange('Blood Arranged')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        Mark Arranged
                      </button>
                      <button
                        onClick={() => handleStatusChange('Completed')}
                        className="px-4 py-2 glass-card hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-extrabold rounded-xl transition-all cursor-pointer"
                      >
                        Mark Completed
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-widest mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4 text-rose-500" /> Accepted Donor Responses ({selectedRequest.accepted_count || 0})
                    </h4>

                    {(!selectedRequest.responses || selectedRequest.responses.length === 0) ? (
                      <div className="p-8 text-center bg-slate-50 dark:bg-[#070a13] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                        <Clock className="w-6 h-6 text-rose-500 mx-auto animate-spin" />
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold italic">
                          Waiting for matching donors to accept your request... Instant SMS & Email alerts dispatched!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedRequest.responses.map((resp) => (
                          <div key={resp.id} className="p-4 bg-slate-50 dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-md">
                                {resp.donor_blood_group || 'O+'}
                              </div>
                              <div>
                                <h5 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                  {resp.donor_name}
                                  <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-full uppercase border border-emerald-500/20">
                                    {resp.response}
                                  </span>
                                </h5>
                                {resp.notes && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">"{resp.notes}"</p>}
                              </div>
                            </div>
                            {resp.donor_phone && (
                              <a
                                href={`tel:${resp.donor_phone}`}
                                className="px-3.5 py-2 bg-gradient-to-r from-rose-500 to-red-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 shrink-0"
                              >
                                <PhoneCall className="w-3.5 h-3.5" /> Call Donor
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
