import { useState, useEffect } from 'react';
import { 
  Users, RefreshCw, Send, AlertTriangle, 
  Trash2, Mail, MessageSquare, PhoneCall, BarChart3, Radio 
} from 'lucide-react';
import { MOCK_WAITLIST } from '../utils/mockData';

export default function AdminDashboard({ 
  bookings, 
  setBookings, 
  availableSlots, 
  setAvailableSlots, 
  analyticsData 
}) {
  const [ehrSyncActive, setEhrSyncActive] = useState(true);
  const [syncLogs, setSyncLogs] = useState([
    "EHR Sync Initialized.",
    "Connected to Cerner/Epic API endpoints.",
    "Fetched clinical schedule (12 active slots synchronized)."
  ]);
  const [notificationLogs, setNotificationLogs] = useState([
    { type: 'SMS', recipient: 'Sarah Connor', msg: 'Booking confirmed: Your consultation is tomorrow at 9:00 AM. (T-24h)', status: 'Delivered', time: '10 min ago' },
    { type: 'Email', recipient: 'Marcus Aurelius', msg: 'Calendar invite sent: Routine follow-up on Monday at 10:30 AM.', status: 'Sent', time: '30 min ago' }
  ]);
  
  // Waitlist alerts
  const [activeWaitlistAlert, setActiveWaitlistAlert] = useState(null);
  const [waitlistLogs, setWaitlistLogs] = useState([]);

  // Auto-generate EHR Sync log ticker
  useEffect(() => {
    if (!ehrSyncActive) return;

    const interval = setInterval(() => {
      const msgs = [
        "Epic EHR database synced successfully.",
        "Verified clinic capacity availability (98.2% accuracy).",
        "Checked insurance eligibility gateway connectivity: OK.",
        "Synchronized doctor credentials ledger."
      ];
      const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
      const timestamp = new Date().toLocaleTimeString();
      setSyncLogs(prev => [`[${timestamp}] ${randomMsg}`, ...prev.slice(0, 10)]);
    }, 8000);

    return () => clearInterval(interval);
  }, [ehrSyncActive]);

  // EHR sync toggle callback
  const handleSyncToggle = () => {
    const timestamp = new Date().toLocaleTimeString();
    if (ehrSyncActive) {
      setSyncLogs(prev => [`[${timestamp}] WARNING: Bi-directional EHR synchronization paused by administrator.`, ...prev]);
    } else {
      setSyncLogs(prev => [`[${timestamp}] EHR synchronization resumed. Synchronizing local state...`, ...prev]);
    }
    setEhrSyncActive(!ehrSyncActive);
  };

  // Simulate cancellation and trigger waitlist fulfill
  const handleCancelBooking = (bookingId) => {
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (!targetBooking) return;

    // 1. Remove from bookings
    const updatedBookings = bookings.filter(b => b.id !== bookingId);
    setBookings(updatedBookings);

    // 2. Mark slot as available again in the schedule
    const updatedSlots = availableSlots.map(slot => {
      const match = targetBooking.time.includes(slot.time) && targetBooking.time.includes(slot.day);
      if (match) {
        return { ...slot, available: true, patientName: null };
      }
      return slot;
    });
    setAvailableSlots(updatedSlots);

    // 3. Find candidate on waitlist for this service
    const candidate = MOCK_WAITLIST.find(w => w.serviceId === targetBooking.serviceId) || MOCK_WAITLIST[0];
    
    // 4. Trigger SMS Waitlist alert
    setActiveWaitlistAlert({
      bookingId,
      timeSlot: targetBooking.time,
      serviceId: targetBooking.serviceId,
      serviceName: targetBooking.serviceName,
      candidate: candidate
    });

    const timestamp = new Date().toLocaleTimeString();
    setNotificationLogs(prev => [
      { 
        type: 'SMS (Waitlist)', 
        recipient: candidate.name, 
        msg: `ALERT: A slot for ${targetBooking.serviceName} is now open at ${targetBooking.time}. Reply to claim immediately!`, 
        status: 'Sent', 
        time: 'Just now' 
      },
      ...prev
    ]);

    setWaitlistLogs(prev => [
      `[${timestamp}] Monday open slot detected. Notifying waitlisted candidate: ${candidate.name} (${candidate.phone})`,
      ...prev
    ]);
  };

  // Claim slot for waitlist candidate
  const handleClaimSlot = () => {
    if (!activeWaitlistAlert) return;
    const { candidate, timeSlot, serviceId, serviceName } = activeWaitlistAlert;

    // Generate new booking for candidate
    const newBooking = {
      id: `booking-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: candidate.name,
      patientEmail: candidate.email,
      patientPhone: candidate.phone,
      providerId: serviceId === 'consultation' ? 'dr-jenkins' : 'dr-fletcher',
      serviceId: serviceId,
      serviceName: serviceName,
      time: timeSlot,
      duration: serviceId === 'consultation' ? '45 mins' : '15 mins',
      triageCategory: serviceId === 'consultation' ? 'Comprehensive Diagnostic' : 'Standard Check-in',
      insuranceCarrier: 'Self-Pay Base',
      copay: 'None (Self-Pay)',
      status: "Confirmed",
      rawSymptoms: "Recovered from waitlist query queue"
    };

    setBookings(prev => [...prev, newBooking]);

    // Mark slot as occupied by candidate
    const updatedSlots = availableSlots.map(slot => {
      const match = timeSlot.includes(slot.time) && timeSlot.includes(slot.day);
      if (match) {
        return { ...slot, available: false, patientName: candidate.name };
      }
      return slot;
    });
    setAvailableSlots(updatedSlots);

    const timestamp = new Date().toLocaleTimeString();
    setWaitlistLogs(prev => [
      `[${timestamp}] SUCCESS: ${candidate.name} claimed slot ${timeSlot} within 45s of text. Auto-booking finalized.`,
      ...prev
    ]);

    setActiveWaitlistAlert(null);
  };

  // Funnel Analytics Calculations
  const funnelData = [
    { label: "1. Landing Viewers", count: analyticsData.funnelStart || 150, color: "hsl(var(--primary))" },
    { label: "2. Checked Services", count: analyticsData.viewServices || 112, color: "hsl(200, 90%, 50%)" },
    { label: "3. Initiated Triage", count: analyticsData.triageStarted || 84, color: "hsl(180, 80%, 45%)" },
    { label: "4. Verified Insurance", count: analyticsData.insuranceChecked || 61, color: "hsl(162, 72%, 46%)" },
    { label: "5. Final EHR Booking", count: bookings.length + (analyticsData.bookingsCompleted || 3), color: "hsl(142, 72%, 35%)" }
  ];

  return (
    <div className="section-padding animate-fade-in" style={{ borderTop: '1px solid hsl(var(--border))' }}>
      <div className="container">
        
        {/* Header Dashboard Status */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div>
            <span className="badge badge-primary" style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
              <Radio size={14} className={ehrSyncActive ? "animate-pulse" : ""} />
              Mark's Administrator Space
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '8px' }}>Clinic Funnel Operations</h2>
          </div>

          {/* EHR Sync Controller - FR-BE-002 */}
          <div className="glass-panel" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '12px 24px',
            borderRadius: 'var(--radius-md)'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>EHR Bi-Directional Sync</div>
              <div style={{ fontSize: '0.72rem', color: ehrSyncActive ? 'hsl(var(--secondary))' : 'hsl(var(--danger))', fontWeight: 600 }}>
                {ehrSyncActive ? "● Epic API Online (Active)" : "○ Offline (Paused)"}
              </div>
            </div>
            
            <button
              onClick={handleSyncToggle}
              className="btn"
              style={{
                padding: '8px 16px',
                fontSize: '0.8rem',
                backgroundColor: ehrSyncActive ? 'hsl(var(--danger))' : 'hsl(var(--secondary))',
                color: '#fff',
                borderColor: 'transparent'
              }}
            >
              {ehrSyncActive ? "Pause Sync" : "Enable Sync"}
            </button>
          </div>
        </div>

        {/* Live Waitlist Notification Alert banner */}
        {activeWaitlistAlert && (
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'hsla(var(--warning), 0.1)',
            border: '2px solid hsl(var(--warning))',
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            animation: 'pulse 3s infinite ease-in-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <AlertTriangle size={32} style={{ color: 'hsl(var(--warning))', flexShrink: 0, marginTop: '4px' }} />
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'hsl(var(--text))' }}>
                  Waitlist Fulfillment Triggered
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', marginTop: '2px' }}>
                  Slot open: <strong style={{ color: 'hsl(var(--text))' }}>{activeWaitlistAlert.timeSlot}</strong> for {activeWaitlistAlert.serviceName}.
                </p>
                <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>
                  Notified candidate: <strong style={{ color: 'hsl(var(--text))' }}>{activeWaitlistAlert.candidate.name}</strong> ({activeWaitlistAlert.candidate.phone}).
                </p>
              </div>
            </div>
            <button
              onClick={handleClaimSlot}
              className="btn"
              style={{
                backgroundColor: 'hsl(var(--secondary))',
                color: '#fff',
                borderColor: 'transparent',
                boxShadow: '0 4px 12px hsla(var(--secondary), 0.3)',
                padding: '12px 24px',
                fontWeight: 700
              }}
            >
              Claim Slot for {activeWaitlistAlert.candidate.name.split(' ')[0]} (Simulate Client Action)
            </button>
          </div>
        )}

        {/* Grid Panels */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Left Column: Live Bookings & Funnel Graph */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Live Bookings Table - FR-BE-002 */}
            <div className="glass-panel" style={{
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} style={{ color: 'hsl(var(--primary))' }} />
                Live Booked Slots (EHR Synced database)
              </h3>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid hsl(var(--border))', color: 'hsl(var(--text-muted))' }}>
                      <th style={{ padding: '12px 8px' }}>Patient</th>
                      <th style={{ padding: '12px 8px' }}>Provider</th>
                      <th style={{ padding: '12px 8px' }}>Service / Tier</th>
                      <th style={{ padding: '12px 8px' }}>Slot Time</th>
                      <th style={{ padding: '12px 8px' }}>Copay (Ins)</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid hsl(var(--border))', transition: 'background var(--transition-fast)' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'hsl(var(--surface-hover))'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td style={{ padding: '16px 8px' }}>
                          <strong style={{ display: 'block' }}>{b.patientName}</strong>
                          <span style={{ fontSize: '0.72rem', color: 'hsl(var(--text-light))' }}>{b.patientPhone}</span>
                        </td>
                        <td style={{ padding: '16px 8px', fontWeight: 500 }}>
                          {b.providerId === 'dr-jenkins' ? 'Dr. Jenkins' : 'Dr. Fletcher'}
                        </td>
                        <td style={{ padding: '16px 8px' }}>
                          <div style={{ fontWeight: 600 }}>{b.serviceName}</div>
                          <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '2px 6px', marginTop: '2px' }}>
                            {b.triageCategory}
                          </span>
                        </td>
                        <td style={{ padding: '16px 8px', fontWeight: 600 }}>{b.time}</td>
                        <td style={{ padding: '16px 8px', color: 'hsl(var(--secondary))', fontWeight: 700 }}>{b.copay}</td>
                        <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="btn btn-secondary"
                            style={{
                              padding: '6px 10px',
                              fontSize: '0.75rem',
                              color: 'hsl(var(--danger))',
                              borderColor: 'hsla(var(--danger), 0.2)',
                              gap: '4px'
                            }}
                            title="Cancel Booking & Trigger Waitlist Alert"
                          >
                            <Trash2 size={12} />
                            <span>Cancel</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual Funnel Analytics Chart - FR-BE-003 */}
            <div className="glass-panel" style={{
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 size={20} style={{ color: 'hsl(var(--primary))' }} />
                Patient Acquisition Funnel Analysis
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', marginBottom: '24px' }}>
                Real-time conversion steps and drop-off analytics. (Updated live based on clinic visitor traffic).
              </p>

              {/* Funnel Graph Graphic */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {funnelData.map((step, idx) => {
                  // Calculate conversion relative to first step
                  const baseCount = funnelData[0].count;
                  const percentage = baseCount > 0 ? Math.round((step.count / baseCount) * 100) : 0;
                  
                  // Calculate drop-off rate from previous step
                  let dropOff = 0;
                  if (idx > 0 && funnelData[idx-1].count > 0) {
                    dropOff = Math.round(((funnelData[idx-1].count - step.count) / funnelData[idx-1].count) * 100);
                  }

                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {/* Step label */}
                      <div style={{ width: '150px', fontSize: '0.85rem', fontWeight: 600 }}>{step.label}</div>
                      
                      {/* Bar and Conversion */}
                      <div style={{ flex: 1, position: 'relative' }}>
                        <div style={{
                          height: '24px',
                          backgroundColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${percentage}%`,
                            height: '100%',
                            backgroundColor: step.color,
                            transition: 'width var(--transition-slow)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingRight: '8px',
                            color: '#fff',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}>
                            {percentage > 25 && `${step.count}`}
                          </div>
                        </div>
                        {percentage <= 25 && (
                          <span style={{ position: 'absolute', left: `${percentage + 2}%`, top: '2px', fontSize: '0.8rem', fontWeight: 700 }}>
                            {step.count}
                          </span>
                        )}
                      </div>

                      {/* Yield Percent */}
                      <div style={{ width: '80px', fontSize: '0.85rem', fontWeight: 700, textAlign: 'right', color: 'hsl(var(--primary))' }}>
                        {percentage}% Yield
                      </div>

                      {/* Drop-off coordinates - FR-BE-003 */}
                      <div style={{ width: '100px', fontSize: '0.8rem', color: 'hsl(var(--danger))', fontWeight: 600 }}>
                        {idx > 0 && `-${dropOff}% Drop`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: EHR Logs & Omnichannel Logs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* EHR Logs */}
            <div className="glass-panel" style={{
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw size={16} className={ehrSyncActive ? "animate-spin" : ""} style={{ color: 'hsl(var(--primary))' }} />
                EHR Bi-directional Sync Stream
              </h3>
              
              <div style={{
                backgroundColor: 'hsl(var(--background))',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                minHeight: '160px',
                maxHeight: '220px',
                overflowY: 'auto',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--text-muted))',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                {syncLogs.map((log, index) => (
                  <div key={index} style={{
                    color: log.includes('WARNING') ? 'hsl(var(--danger))' : 'inherit',
                    lineHeight: 1.3
                  }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Omnichannel Outreach logs - FR-BE-001 */}
            <div className="glass-panel" style={{
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={16} style={{ color: 'hsl(var(--primary))' }} />
                Omnichannel Patient Outreach Logs
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {notificationLogs.map((log, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    paddingBottom: '12px',
                    borderBottom: idx < notificationLogs.length - 1 ? '1px solid hsl(var(--border))' : 'none'
                  }}>
                    <div style={{
                      backgroundColor: log.type.includes('SMS') ? 'hsl(var(--primary-light))' : 'hsl(var(--secondary-light))',
                      color: log.type.includes('SMS') ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      flexShrink: 0
                    }}>
                      {log.type.includes('SMS') ? <MessageSquare size={16} /> : <Mail size={16} />}
                    </div>

                    <div style={{ flex: 1, fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                        <span>To: {log.recipient} ({log.type})</span>
                        <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-light))' }}>{log.time}</span>
                      </div>
                      <p style={{ color: 'hsl(var(--text-muted))', marginTop: '2px', lineHeight: 1.3 }}>
                        {log.msg}
                      </p>
                      <span className="badge badge-secondary" style={{ fontSize: '0.6rem', padding: '1px 6px', marginTop: '4px', textTransform: 'capitalize' }}>
                        {log.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Waitlist Logs */}
            <div className="glass-panel" style={{
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PhoneCall size={16} style={{ color: 'hsl(var(--primary))' }} />
                Smart Waitlist Fulfillment Stream
              </h3>

              <div style={{
                backgroundColor: 'hsl(var(--background))',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                minHeight: '120px',
                maxHeight: '180px',
                overflowY: 'auto',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--text-muted))',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                {waitlistLogs.length > 0 ? (
                  waitlistLogs.map((log, idx) => (
                    <div key={idx} style={{
                      color: log.includes('SUCCESS') ? 'hsl(var(--secondary))' : 'inherit',
                      lineHeight: 1.3
                    }}>
                      {log}
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    No waitlist activities logged. Simulate a cancel above to test.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
