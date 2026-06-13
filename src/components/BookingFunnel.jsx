import { useState, useEffect } from 'react';
import { 
  Activity, ShieldCheck, CalendarCheck, CheckCircle, AlertCircle, 
  Loader2, Lock, ArrowRight, ArrowLeft, RefreshCw 
} from 'lucide-react';
import { SERVICES, MOCK_INSURANCE_CARRIERS } from '../utils/mockData';
import { getCachedBookingState, cacheBookingState, clearBookingState } from '../utils/storage';

const getRoutedService = (symptoms) => {
  if (!symptoms || symptoms.length === 0) return null;
  const consultationMatchCount = symptoms.filter(s => 
    ["Chronic chest discomfort", "Unexplained fatigue", "First-time clinical screening", "Persistent headache/nausea"].includes(s)
  ).length;

  const followupMatchCount = symptoms.filter(s => 
    ["Medication adjustments", "Lab results review", "Blood pressure check"].includes(s)
  ).length;

  if (consultationMatchCount >= followupMatchCount) {
    return SERVICES.find(s => s.id === 'consultation');
  } else {
    return SERVICES.find(s => s.id === 'followup');
  }
};

const getCachedState = () => {
  try {
    return getCachedBookingState() || {};
  } catch {
    return {};
  }
};

export default function BookingFunnel({ 
  onBookingSuccess, 
  onAnalyticsEvent, 
  availableSlots, 
  setAvailableSlots 
}) {
  const cached = getCachedState();

  // 1. Core Form State
  const [step, setStep] = useState(cached.step || 1);
  const [patientName, setPatientName] = useState(cached.patientName || '');
  const [patientEmail, setPatientEmail] = useState(cached.patientEmail || '');
  const [patientPhone, setPatientPhone] = useState(cached.patientPhone || '');
  const [selectedSymptoms, setSelectedSymptoms] = useState(cached.selectedSymptoms || []);
  
  // Triage Routing Results
  const [assignedService, setAssignedService] = useState(() => getRoutedService(cached.selectedSymptoms));

  // Insurance State
  const [insuranceCarrier, setInsuranceCarrier] = useState(cached.insuranceCarrier || '');
  const [policyId, setPolicyId] = useState(cached.policyId || '');
  const [insuranceVerifying, setInsuranceVerifying] = useState(false);
  const [insuranceVerified, setInsuranceVerified] = useState(false);
  const [copay, setCopay] = useState(null);
  const [insuranceMessage, setInsuranceMessage] = useState('');

  // Slot Selection
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Cache Recovery Alert
  const [restoredAlert, setRestoredAlert] = useState(() => {
    const cachedData = getCachedState();
    return Object.keys(cachedData).length > 0;
  });

  // 2. Load cached indicators on mount (one-shot logging)
  useEffect(() => {
    const cachedData = getCachedBookingState();
    if (cachedData) {
      const timer = setTimeout(() => setRestoredAlert(false), 5000);
      
      if (onAnalyticsEvent) {
        onAnalyticsEvent('form_restored', { step: cachedData.step });
      }
      return () => clearTimeout(timer);
    } else {
      if (onAnalyticsEvent) {
        onAnalyticsEvent('funnel_start', { step: 1 });
      }
    }
  }, [onAnalyticsEvent]);

  // 3. Cache state on changes - FR-FE-004
  useEffect(() => {
    if (patientName || patientEmail || selectedSymptoms.length > 0 || insuranceCarrier || policyId || step > 1) {
      cacheBookingState({
        patientName,
        patientEmail,
        patientPhone,
        selectedSymptoms,
        insuranceCarrier,
        policyId,
        step
      });
    }
  }, [patientName, patientEmail, patientPhone, selectedSymptoms, insuranceCarrier, policyId, step]);

  // Track page transitions for Mark's conversion analytics - FR-BE-003
  const transitionToStep = (nextStep) => {
    setStep(nextStep);
    if (onAnalyticsEvent) {
      onAnalyticsEvent(`step_${nextStep}_entered`, {
        patientName,
        hasSymptoms: selectedSymptoms.length > 0,
        insuranceCarrier,
        isVerified: insuranceVerified
      });
    }
  };

  // Symptom List (Compiled from both services in mockData)
  const allSymptomOptions = [
    { value: "Chronic chest discomfort", label: "Chronic chest discomfort (Dr. Fletcher triage)", type: "consultation" },
    { value: "Unexplained fatigue", label: "Unexplained fatigue (Dr. Jenkins triage)", type: "consultation" },
    { value: "First-time clinical screening", label: "First-time comprehensive consultation", type: "consultation" },
    { value: "Persistent headache/nausea", label: "Persistent/Recurring headache or symptoms", type: "consultation" },
    { value: "Medication adjustments", label: "Refills / Medication adjustment check-in", type: "followup" },
    { value: "Lab results review", label: "Review recent blood panels or diagnostic lab results", type: "followup" },
    { value: "Blood pressure check", label: "Cardiovascular/Blood pressure progress tracking", type: "followup" }
  ];

  const handleSymptomToggle = (symptom) => {
    let updated;
    if (selectedSymptoms.includes(symptom)) {
      updated = selectedSymptoms.filter(s => s !== symptom);
    } else {
      updated = [...selectedSymptoms, symptom];
    }
    setSelectedSymptoms(updated);
    setAssignedService(getRoutedService(updated));
  };


  // Simulate Insurance Verification check - Module A
  const verifyInsurance = () => {
    if (!insuranceCarrier || !policyId) return;
    setInsuranceVerifying(true);
    setInsuranceVerified(false);
    setInsuranceMessage("Connecting to insurance verification network...");

    setTimeout(() => {
      setInsuranceMessage("Validating contract ID and group numbers...");
      setTimeout(() => {
        const carrierInfo = MOCK_INSURANCE_CARRIERS.find(c => c.name === insuranceCarrier);
        if (carrierInfo) {
          setInsuranceVerified(true);
          setInsuranceVerifying(false);
          setCopay(carrierInfo.copay);
          setInsuranceMessage(`✓ Active coverage confirmed. Copayment: $${carrierInfo.copay}.00`);
          if (onAnalyticsEvent) {
            onAnalyticsEvent('insurance_verified', { carrier: insuranceCarrier });
          }
        } else {
          setInsuranceVerified(false);
          setInsuranceVerifying(false);
          setInsuranceMessage("⚠ Carrier not found or credentials mismatched. Please review.");
        }
      }, 1200);
    }, 1000);
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (!selectedSlot) return;

    // Update slots state (set selected slot as occupied)
    const updatedSlots = availableSlots.map(s => {
      if (s.id === selectedSlot.id) {
        return { ...s, available: false, patientName };
      }
      return s;
    });
    setAvailableSlots(updatedSlots);

    const booking = {
      id: `booking-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName,
      patientEmail,
      patientPhone,
      providerId: assignedService.id === 'consultation' ? 'dr-jenkins' : 'dr-fletcher',
      serviceId: assignedService.id,
      serviceName: assignedService.name,
      time: `${selectedSlot.day}, ${selectedSlot.time}`,
      duration: assignedService.duration,
      triageCategory: assignedService.tier,
      insuranceCarrier: insuranceVerified ? insuranceCarrier : 'Self-Pay Base',
      copay: insuranceVerified ? `$${copay}` : 'None (Self-Pay)',
      status: "Confirmed",
      rawSymptoms: selectedSymptoms.join(', ')
    };

    // Remove cache
    clearBookingState();
    
    // Log success
    if (onAnalyticsEvent) {
      onAnalyticsEvent('funnel_completion', { bookingId: booking.id, price: assignedService.price });
    }

    onBookingSuccess(booking);
  };

  return (
    <div className="container" style={{ padding: '40px 16px', maxWidth: '780px' }}>
      
      {/* Recovery Notice */}
      {restoredAlert && (
        <div className="glass-panel" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'hsla(var(--primary), 0.1)',
          borderColor: 'hsl(var(--primary))',
          color: 'hsl(var(--primary))',
          marginBottom: '24px',
          animation: 'fadeIn 0.5s ease'
        }}>
          <RefreshCw size={20} className="animate-spin" style={{ animationDuration: '3s' }} />
          <div>
            <strong style={{ fontSize: '0.9rem' }}>Progress Recovered:</strong>
            <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>We restored your unsaved triage and profile inputs to prevent data loss.</p>
          </div>
        </div>
      )}

      <div className="glass-panel" style={{
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        boxShadow: 'var(--shadow-xl)'
      }}>
        
        {/* Stepper indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            height: '2px',
            backgroundColor: 'hsl(var(--border))',
            top: '18px',
            left: '32px',
            right: '32px',
            zIndex: 1
          }} />
          <div style={{
            position: 'absolute',
            height: '2px',
            backgroundColor: 'hsl(var(--primary))',
            top: '18px',
            left: '32px',
            width: `${((step - 1) / 3) * 88}%`,
            zIndex: 1,
            transition: 'width var(--transition-normal)'
          }} />

          {[
            { s: 1, label: "Triage" },
            { s: 2, label: "Insurance" },
            { s: 3, label: "Schedule" },
            { s: 4, label: "Confirm" }
          ].map(item => (
            <div key={item.s} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 10,
              flex: 1
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.9rem',
                backgroundColor: step > item.s 
                  ? 'hsl(var(--primary))' 
                  : step === item.s 
                    ? 'hsl(var(--surface))' 
                    : 'hsl(var(--background))',
                color: step > item.s 
                  ? '#fff' 
                  : step === item.s 
                    ? 'hsl(var(--primary))' 
                    : 'hsl(var(--text-muted))',
                border: `2px solid ${step >= item.s ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                transition: 'all var(--transition-normal)'
              }}>
                {step > item.s ? "✓" : item.s}
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: step === item.s ? 700 : 500,
                color: step === item.s ? 'hsl(var(--text))' : 'hsl(var(--text-light))',
                marginTop: '6px'
              }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: Symptom Triage */}
        {step === 1 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>1. Smart Symptom Triage</h3>
              <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>
                Complete our quick checklist. The system automatically routes you to the appropriate appointment length.
              </p>
            </div>

            {/* Profile Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Full Name</label>
                <input 
                  type="text" 
                  value={patientName} 
                  onChange={e => setPatientName(e.target.value)} 
                  placeholder="Sarah Jenkins"
                  className="input"
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Email Address</label>
                <input 
                  type="email" 
                  value={patientEmail} 
                  onChange={e => setPatientEmail(e.target.value)} 
                  placeholder="sarah@example.com"
                  className="input"
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Phone Number (for SMS notifications)</label>
              <input 
                type="tel" 
                value={patientPhone} 
                onChange={e => setPatientPhone(e.target.value)} 
                placeholder="(555) 000-0000"
                className="input"
                required
              />
            </div>

            {/* Symptoms Checklist */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '12px' }}>
                Select symptoms or consultation goals:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {allSymptomOptions.map(opt => (
                  <label 
                    key={opt.value} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: selectedSymptoms.includes(opt.value) ? 'hsl(var(--primary-light))' : 'hsl(var(--background))',
                      border: `1px solid ${selectedSymptoms.includes(opt.value) ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedSymptoms.includes(opt.value)}
                      onChange={() => handleSymptomToggle(opt.value)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: selectedSymptoms.includes(opt.value) ? 600 : 500 }}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Triage Output Alert */}
            {assignedService && (
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'hsl(var(--secondary-light))',
                border: '1px solid hsl(var(--secondary))',
                color: 'hsl(var(--success))',
                marginTop: '8px',
                animation: 'fadeIn 0.4s ease'
              }}>
                <Activity size={20} style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ fontSize: '0.9rem' }}>Automated Triage Routing:</strong>
                  <p style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '2px' }}>
                    Based on symptoms, you have been routed to: <strong>{assignedService.name}</strong>.
                  </p>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '4px' }}>
                    Allocated Duration: {assignedService.duration} | Base Cost: ${assignedService.price}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button 
                onClick={() => transitionToStep(2)}
                disabled={!patientName || !patientEmail || !patientPhone || selectedSymptoms.length === 0}
                className="btn btn-primary"
                style={{ opacity: (!patientName || !patientEmail || !patientPhone || selectedSymptoms.length === 0) ? 0.6 : 1 }}
              >
                Proceed to Insurance Gateway <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Insurance Gateway */}
        {step === 2 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>2. Real-Time Insurance Gateway</h3>
              <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>
                Verify your health policy in real-time to check eligibility, network standing, and final copays.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              backgroundColor: 'hsl(var(--background))',
              padding: '20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid hsl(var(--border))'
            }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Select Insurance Network</label>
                <select 
                  className="input"
                  value={insuranceCarrier} 
                  onChange={e => {
                    setInsuranceCarrier(e.target.value);
                    setInsuranceVerified(false);
                    setCopay(null);
                  }}
                >
                  <option value="">-- Select Network --</option>
                  {MOCK_INSURANCE_CARRIERS.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Policy / Member ID</label>
                <input 
                  type="text" 
                  className="input"
                  placeholder="e.g. BCBS-98764A"
                  value={policyId}
                  onChange={e => {
                    setPolicyId(e.target.value);
                    setInsuranceVerified(false);
                  }}
                  disabled={!insuranceCarrier}
                />
              </div>
            </div>

            {/* Check Button & Real-time verified indicators */}
            {insuranceCarrier && policyId && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  type="button"
                  onClick={verifyInsurance}
                  disabled={insuranceVerifying}
                  className="btn btn-secondary"
                  style={{
                    backgroundColor: 'hsl(var(--surface))',
                    borderColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary))',
                    gap: '8px'
                  }}
                >
                  {insuranceVerifying ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Contacting Gateway Server...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>Verify My Eligibility</span>
                    </>
                  )}
                </button>

                {insuranceMessage && (
                  <div style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    backgroundColor: insuranceVerified ? 'hsl(var(--secondary-light))' : 'hsla(var(--primary), 0.05)',
                    border: `1px solid ${insuranceVerified ? 'hsl(var(--secondary))' : 'hsl(var(--border))'}`,
                    color: insuranceVerified ? 'hsl(var(--success))' : 'hsl(var(--text))',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    animation: 'fadeIn 0.3s ease'
                  }}>
                    {insuranceVerified ? (
                      <CheckCircle size={18} style={{ color: 'hsl(var(--secondary))', flexShrink: 0 }} />
                    ) : (
                      <Loader2 size={16} className="animate-spin" style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
                    )}
                    <span>{insuranceMessage}</span>
                  </div>
                )}
              </div>
            )}

            {/* Pricing transparency note */}
            {!insuranceVerified && (
              <div style={{
                display: 'flex',
                gap: '8px',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'hsla(var(--warning), 0.08)',
                color: 'hsl(var(--warning))',
                fontSize: '0.8rem',
                border: '1px solid hsla(var(--warning), 0.3)'
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Self-Pay Note:</strong> You may proceed without verifying insurance. The checkout will fall back to our transparent self-pay tier: <strong>${assignedService?.price}</strong>.
                </span>
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <button onClick={() => transitionToStep(1)} className="btn btn-secondary">
                <ArrowLeft size={16} /> Back to Symptoms
              </button>
              <button 
                onClick={() => transitionToStep(3)}
                className="btn btn-primary"
              >
                Choose Appointment Slot <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: EHR Slot Scheduling */}
        {step === 3 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>3. EHR Synchronized Slots</h3>
              <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>
                Select an open slot. Our two-way EHR synchronization ensures these calendar times are locked in real-time.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '12px'
            }}>
              {availableSlots.map(slot => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => slot.available && setSelectedSlot(slot)}
                  disabled={!slot.available}
                  style={{
                    padding: '16px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${
                      !slot.available 
                        ? 'hsl(var(--border))' 
                        : selectedSlot?.id === slot.id 
                          ? 'hsl(var(--primary))' 
                          : 'hsl(var(--border))'
                    }`,
                    backgroundColor: !slot.available 
                      ? 'hsl(var(--background))' 
                      : selectedSlot?.id === slot.id 
                        ? 'hsl(var(--primary-light))' 
                        : 'hsl(var(--surface))',
                    color: !slot.available 
                      ? 'hsl(var(--text-light))' 
                      : selectedSlot?.id === slot.id 
                        ? 'hsl(var(--primary))' 
                        : 'hsl(var(--text))',
                    cursor: slot.available ? 'pointer' : 'not-allowed',
                    opacity: !slot.available ? 0.6 : 1,
                    transition: 'all var(--transition-fast)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{slot.day}</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800 }}>{slot.time}</span>
                  <span style={{ 
                    fontSize: '0.65rem', 
                    fontWeight: 600, 
                    color: !slot.available ? 'hsl(var(--danger))' : 'hsl(var(--secondary))' 
                  }}>
                    {slot.available ? 'Available' : 'Occupied'}
                  </span>
                </button>
              ))}
            </div>

            {/* Navigation buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <button onClick={() => transitionToStep(2)} className="btn btn-secondary">
                <ArrowLeft size={16} /> Back to Insurance
              </button>
              <button 
                onClick={() => transitionToStep(4)}
                disabled={!selectedSlot}
                className="btn btn-primary"
                style={{ opacity: !selectedSlot ? 0.6 : 1 }}
              >
                Review & Confirm <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Confirm */}
        {step === 4 && (
          <form onSubmit={handleSubmitBooking} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>4. Review & Confirm Booking</h3>
              <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>
                Verify your intake details before locking your slot in the clinic database.
              </p>
            </div>

            {/* Summarized Details */}
            <div style={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', display: 'block' }}>Patient</span>
                  <strong style={{ fontSize: '1rem' }}>{patientName}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', display: 'block' }}>{patientEmail} | {patientPhone}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', display: 'block' }}>Appointment Slot</span>
                  <strong style={{ fontSize: '1rem' }}>{selectedSlot?.day}, {selectedSlot?.time}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'hsl(var(--primary))', fontWeight: 600 }}>Duration: {assignedService?.duration}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', display: 'block' }}>Triage Tier</span>
                  <strong style={{ fontSize: '0.9rem', color: 'hsl(var(--secondary))' }}>{assignedService?.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', display: 'block' }}>({assignedService?.tier})</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', display: 'block' }}>Payment Detail</span>
                  {insuranceVerified ? (
                    <div>
                      <strong style={{ fontSize: '1rem', color: 'hsl(var(--success))' }}>Verified Copay: ${copay}.00</strong>
                      <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', display: 'block' }}>Network: {insuranceCarrier}</span>
                    </div>
                  ) : (
                    <div>
                      <strong style={{ fontSize: '1rem' }}>Self-Pay: ${assignedService?.price}.00</strong>
                      <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', display: 'block' }}>No insurance verified</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', display: 'block', marginBottom: '4px' }}>Selected Symptoms Log</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedSymptoms.map(s => (
                    <span key={s} style={{
                      fontSize: '0.75rem',
                      padding: '4px 8px',
                      backgroundColor: 'hsl(var(--surface))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Compliance Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid hsl(var(--border))',
              backgroundColor: 'hsla(var(--success), 0.05)'
            }}>
              <Lock size={20} style={{ color: 'hsl(var(--secondary))' }} />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'hsl(var(--success))' }}>AES-256 Encrypted Transfer</div>
                <div style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))' }}>
                  This intake form isolates Protected Health Information (PHI) before syncing with standard legacy databases.
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <button type="button" onClick={() => transitionToStep(3)} className="btn btn-secondary">
                <ArrowLeft size={16} /> Back to Schedule
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ backgroundColor: 'hsl(var(--secondary))', borderColor: 'hsl(var(--secondary))' }}
              >
                <CalendarCheck size={18} /> Sync Booking with EHR
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
