import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProviderProfile from './components/ProviderProfile';
import Services from './components/Services';
import BookingFunnel from './components/BookingFunnel';
import AdminDashboard from './components/AdminDashboard';
import Chatbot from './components/Chatbot';
import { DEFAULT_BOOKINGS } from './utils/mockData';
import { Shield, Info, CheckCircle2, Moon, Sun, ToggleLeft, ToggleRight } from 'lucide-react';


const INITIAL_SLOTS = [
  { id: 'slot-1', day: 'Monday', time: '9:00 AM', available: false, patientName: 'Sarah Connor' },
  { id: 'slot-2', day: 'Monday', time: '10:30 AM', available: false, patientName: 'Marcus Aurelius' },
  { id: 'slot-3', day: 'Monday', time: '2:30 PM', available: true, patientName: null },
  { id: 'slot-4', day: 'Tuesday', time: '10:00 AM', available: true, patientName: null },
  { id: 'slot-5', day: 'Tuesday', time: '1:00 PM', available: false, patientName: 'Elizabeth Bennett' },
  { id: 'slot-6', day: 'Wednesday', time: '11:30 AM', available: true, patientName: null },
  { id: 'slot-7', day: 'Thursday', time: '2:00 PM', available: true, patientName: null },
  { id: 'slot-8', day: 'Friday', time: '3:30 PM', available: true, patientName: null }
];

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [bookings, setBookings] = useState(DEFAULT_BOOKINGS);
  const [availableSlots, setAvailableSlots] = useState(INITIAL_SLOTS);
  
  // Real-time tracking of patient behavioral steps
  const [analyticsData, setAnalyticsData] = useState({
    funnelStart: 124,
    viewServices: 98,
    triageStarted: 62,
    insuranceChecked: 41,
    bookingsCompleted: 3
  });

  // Success Modal State
  const [successBooking, setSuccessBooking] = useState(null);

  // References for scrolling
  const bookingRef = useRef(null);
  const providersRef = useRef(null);

  // Apply dark class to body
  useEffect(() => {
    const bodyClass = document.body.classList;
    if (darkMode) {
      bodyClass.add('dark-theme');
    } else {
      bodyClass.remove('dark-theme');
    }
  }, [darkMode]);

  // Track patient actions dynamically to feed Mark's Analytics
  const handleAnalyticsEvent = (event, data) => {
    console.log(`[Funnel Analytics] Event: ${event}`, data);
    setAnalyticsData(prev => {
      const copy = { ...prev };
      if (event === 'funnel_start') copy.funnelStart += 1;
      if (event === 'step_1_entered') copy.triageStarted += 1;
      if (event === 'insurance_verified') copy.insuranceChecked += 1;
      if (event === 'funnel_completion') {
        copy.bookingsCompleted += 1;
      }
      return copy;
    });
  };

  const handleSelectServiceForBooking = (serviceId) => {
    // Record that client checked service pricing
    handleAnalyticsEvent('view_services', { serviceId });
    scrollToBooking();
  };

  const scrollToBooking = () => {
    if (bookingRef.current) {
      bookingRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToProviders = () => {
    if (providersRef.current) {
      providersRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookingSuccess = (newBooking) => {
    setBookings(prev => [...prev, newBooking]);
    setSuccessBooking(newBooking);
  };

  // Determine dynamic next available slot for headercapacity ticker - FR-FE-001
  const firstFree = availableSlots.find(s => s.available);
  const nextAvailableSlotText = firstFree 
    ? `${firstFree.day} ${firstFree.time}` 
    : "Join Waitlist";

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navbar Container */}
      <Navbar 
        isAdmin={isAdmin} 
        setIsAdmin={setIsAdmin} 
        nextAvailableSlot={nextAvailableSlotText}
        onBookNowClick={scrollToBooking}
      />

      {/* Floating Theme Switcher */}
      <div style={{
        position: 'fixed',
        left: '24px',
        bottom: '24px',
        zIndex: 99,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 14px',
        borderRadius: 'var(--radius-full)',
        boxShadow: 'var(--shadow-md)'
      }} className="glass-panel">
        <Sun size={16} style={{ color: darkMode ? 'hsl(var(--text-light))' : '#FBBF24' }} />
        <button 
          onClick={() => setDarkMode(!darkMode)}
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            color: 'hsl(var(--primary))'
          }}
          title="Toggle light/dark theme"
        >
          {darkMode ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
        </button>
        <Moon size={16} style={{ color: darkMode ? 'hsl(var(--primary))' : 'hsl(var(--text-light))' }} />
      </div>

      {/* MAIN VIEW CONTROLLER */}
      {isAdmin ? (
        // MARK'S ADMIN SYSTEM
        <AdminDashboard 
          bookings={bookings} 
          setBookings={setBookings}
          availableSlots={availableSlots}
          setAvailableSlots={setAvailableSlots}
          analyticsData={analyticsData}
        />
      ) : (
        // SARAH'S PATIENT TRUST FUNNEL
        <main style={{ flex: 1 }}>
          <Hero 
            onBookNowClick={scrollToBooking} 
            onExploreProvidersClick={scrollToProviders}
          />
          
          {/* Meet Providers section anchor */}
          <div ref={providersRef}>
            <ProviderProfile />
          </div>

          <Services 
            onSelectServiceForBooking={handleSelectServiceForBooking}
          />

          {/* Booking section anchor */}
          <div 
            ref={bookingRef} 
            style={{ 
              borderTop: '1px solid hsl(var(--border))', 
              paddingTop: '40px',
              backgroundColor: 'hsla(var(--primary), 0.01)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <span className="badge badge-primary" style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                <Shield size={14} /> HIPAA Secure Check-in Zone
              </span>
            </div>
            
            <BookingFunnel 
              onBookingSuccess={handleBookingSuccess}
              onAnalyticsEvent={handleAnalyticsEvent}
              availableSlots={availableSlots}
              setAvailableSlots={setAvailableSlots}
            />
          </div>
        </main>
      )}

      {/* Chatbot overlay */}
      {!isAdmin && <Chatbot />}

      {/* Booking Success Modal */}
      {successBooking && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div className="glass-panel" style={{
            width: '90%',
            maxWidth: '540px',
            borderRadius: 'var(--radius-lg)',
            padding: '40px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-xl)',
            backgroundColor: 'hsl(var(--surface))'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'hsl(var(--secondary-light))',
              color: 'hsl(var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '12px' }}>
              Appointment Synchronized!
            </h3>
            
            <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.95rem', marginBottom: '24px' }}>
              Hi <strong>{successBooking.patientName}</strong>, your appointment slot has been successfully locked in our clinic calendar.
            </p>

            <div style={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '32px'
            }}>
              <div style={{ fontSize: '0.85rem' }}>
                <span style={{ color: 'hsl(var(--text-light))' }}>Provider:</span>{' '}
                <strong>{successBooking.providerId === 'dr-jenkins' ? 'Dr. Sarah Jenkins' : 'Dr. Mark Fletcher'}</strong>
              </div>
              <div style={{ fontSize: '0.85rem' }}>
                <span style={{ color: 'hsl(var(--text-light))' }}>Service:</span>{' '}
                <strong>{successBooking.serviceName} ({successBooking.duration})</strong>
              </div>
              <div style={{ fontSize: '0.85rem' }}>
                <span style={{ color: 'hsl(var(--text-light))' }}>Locked Slot:</span>{' '}
                <strong>{successBooking.time}</strong>
              </div>
              <div style={{ fontSize: '0.85rem' }}>
                <span style={{ color: 'hsl(var(--text-light))' }}>Payment Copay:</span>{' '}
                <strong style={{ color: 'hsl(var(--secondary))' }}>{successBooking.copay}</strong>
              </div>
              <div style={{ fontSize: '0.85rem' }}>
                <span style={{ color: 'hsl(var(--text-light))' }}>Record ID:</span>{' '}
                <code style={{ fontSize: '0.8rem', backgroundColor: 'hsl(var(--border))', padding: '2px 6px', borderRadius: '4px' }}>
                  {successBooking.id}
                </code>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'hsla(var(--primary), 0.05)',
              fontSize: '0.8rem',
              color: 'hsl(var(--text-muted))',
              marginBottom: '24px',
              textAlign: 'left'
            }}>
              <Info size={16} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
              <span>
                Our Omnichannel Hub is sending your email invite and SMS reminders (at T-48h, T-24h, T-2h). You can review these logs by switching to the Admin Panel.
              </span>
            </div>

            <button 
              onClick={() => setSuccessBooking(null)}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Return to Homepage
            </button>
          </div>
        </div>
      )}

      {/* Compliance Footer */}
      <footer style={{
        backgroundColor: 'hsl(var(--surface))',
        borderTop: '1px solid hsl(var(--border))',
        padding: '32px 24px',
        marginTop: 'auto',
        fontSize: '0.8rem',
        color: 'hsl(var(--text-muted))'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <strong>ClinicCapture OS v2.0 (Advanced Patient Funnel Prototype)</strong>
            <p style={{ marginTop: '4px' }}>Designed for rapid, trust-first onboarding and administrative automation.</p>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>HIPAA Compliant & Isolated PHI (AES-256)</span>
            <span>WCAG 2.1 AA Compliant</span>
            <span>EHR Two-Way Epic Synced</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
