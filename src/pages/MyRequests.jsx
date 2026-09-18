import React, { useEffect, useState } from 'react';
import { useRequestStore } from '../store/requestStore';
import { useAuthStore } from '../store/authStore';
import StatusTracker from '../components/ui/StatusTracker';
import { HeartPulse, Users, PhoneCall, Clock, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyRequests() {
  const { user } = useAuthStore();
  const { myRequests, fetchMyRequests, updateRequestStatus } = useRequestStore();
  const [activeReqId, setActiveReqId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMyRequests(user.id);
    }
  }, [user, fetchMyRequests]);

  useEffect(() => {
    if (myRequests.length > 0 && !activeReqId) {
      setActiveReqId(myRequests[0].id);
    }
  }, [myRequests, activeReqId]);

  const selectedRequest = myRequests.find(r => r.id === activeReqId);

  const handleSelectRequest = (id) => {
    setActiveReqId(id);
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedRequest) return;
    await updateRequestStatus(selectedRequest.id, newStatus);
    toast.success(`Request status updated to "${newStatus}"`);
    if (user) fetchMyRequests(user.id);
  };

  return (
    <div className="w-full py-8 text-slate-900 bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <HeartPulse className="w-7 h-7 text-red-600" />
              Real-Time Request Tracker
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Track donor responses, notifications, and arranged blood units in real time.
            </p>
          </div>

          <button 
            onClick={() => user && fetchMyRequests(user.id)}
            className="bg-white hover:bg-slate-50 px-3.5 py-2 rounded-lg text-slate-700 font-semibold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer border border-slate-200"
          >
            <RefreshCw className="w-3.5 h-3.5 text-red-600" /> Refresh Pipeline
          </button>
        </div>

        {myRequests.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center space-y-3 border border-slate-200 max-w-lg mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Active Emergency Requests</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              You haven't posted any emergency blood requests yet. If a medical emergency arises, post a request to notify compatible nearby donors.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Request List Sidebar */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Your Posted Requests</h3>
              {myRequests.map((req) => {
                const isSelected = req.id === activeReqId;
                return (
                  <div
                    key={req.id}
                    onClick={() => handleSelectRequest(req.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-red-600 ring-1 ring-red-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-red-600 text-white font-bold text-xs rounded-md">
                        {req.blood_group}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{req.status}</span>
                    </div>

                    <h4 className="font-semibold text-sm text-slate-900 mt-2">{req.hospital_name}</h4>
                    <p className="text-xs text-slate-500 font-normal mt-0.5">Patient: {req.patient_name} • {req.units} Unit(s)</p>
                  </div>
                );
              })}
            </div>

            {/* Right Col: Detailed Tracker & Responses */}
            {selectedRequest && (
              <div className="lg:col-span-2 space-y-6">
                
                <StatusTracker status={selectedRequest.status} />

                <div className="glass-card rounded-2xl p-6 shadow-xs space-y-5 border border-slate-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{selectedRequest.patient_name}</h2>
                      <p className="text-xs text-slate-500 mt-0.5 font-normal">{selectedRequest.hospital_name}, {selectedRequest.city}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusChange('Blood Arranged')}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer"
                      >
                        Mark Arranged
                      </button>
                      <button
                        onClick={() => handleStatusChange('Completed')}
                        className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-all cursor-pointer shadow-xs"
                      >
                        Mark Completed
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-red-600" /> Accepted Donor Responses ({selectedRequest.accepted_count || 0})
                    </h4>

                    {(!selectedRequest.responses || selectedRequest.responses.length === 0) ? (
                      <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                        <Clock className="w-5 h-5 text-red-600 mx-auto animate-spin" />
                        <p className="text-xs text-slate-500 font-medium">
                          Waiting for matching donors to accept your request... Instant SMS & Email alerts dispatched!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {selectedRequest.responses.map((resp) => (
                          <div key={resp.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                {resp.donor_blood_group || 'O+'}
                              </div>
                              <div>
                                <h5 className="font-semibold text-xs text-slate-900 flex items-center gap-2">
                                  {resp.donor_name}
                                  <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-[10px] font-semibold rounded-md border border-slate-300">
                                    {resp.response}
                                  </span>
                                </h5>
                                {resp.notes && <p className="text-xs text-slate-500 mt-0.5 font-normal">"{resp.notes}"</p>}
                              </div>
                            </div>
                            {resp.donor_phone && (
                              <a
                                href={`tel:${resp.donor_phone}`}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-1.5 shrink-0"
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
