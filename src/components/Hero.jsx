import { ShieldCheck, HeartPulse, RefreshCw, Star } from 'lucide-react';

export default function Hero({ onBookNowClick, onExploreProvidersClick }) {
  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      padding: '80px 24px',
      background: 'radial-gradient(100% 100% at 50% 0%, hsla(var(--primary), 0.05) 0%, hsla(var(--background), 0) 100%)'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '48px',
        alignItems: 'center'
      }}>
        {/* Left Side: Call to Action */}
        <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center' }}>
            <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} />
              HIPAA Compliant & EHR Synced
            </span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', 
            fontWeight: 800, 
            letterSpacing: '-0.03em', 
            color: 'hsl(var(--text))',
            lineHeight: 1.1
          }}>
            Healthcare Built on <br />
            <span style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Trust & Transparency
            </span>
          </h1>

          <p style={{ 
            fontSize: '1.15rem', 
            color: 'hsl(var(--text-muted))', 
            lineHeight: 1.6,
            maxWidth: '540px'
          }}>
            Skip the endless telephone hold music. Complete our 30-second symptom triage, instantly verify your insurance eligibility, and schedule direct clinic slots with zero double-booking errors.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button 
              onClick={onBookNowClick}
              className="btn btn-primary" 
              style={{ padding: '14px 28px', fontSize: '1rem', boxShadow: '0 4px 20px hsla(var(--primary), 0.25)' }}
            >
              Book in 3 Clicks
            </button>
            <button 
              onClick={onExploreProvidersClick}
              className="btn btn-secondary" 
              style={{ padding: '14px 28px', fontSize: '1rem' }}
            >
              Meet Our Board Specialists
            </button>
          </div>

          {/* Trust Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
            <div style={{ display: 'flex', color: '#FBBF24' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="#FBBF24" />
              ))}
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              4.9/5 from over 10,000+ patient evaluations
            </span>
          </div>
        </div>

        {/* Right Side: Trust & Funnel Illustration */}
        <div className="animate-fade-in" style={{ 
          position: 'relative', 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Main graphic container */}
          <div className="glass-panel" style={{
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '440px',
            padding: '32px',
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Active Acquisition Flow</h3>
            
            {/* Stage 1 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: 'hsla(var(--primary), 0.08)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid hsl(var(--primary))'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <HeartPulse style={{ color: 'hsl(var(--primary))' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>1. Smart Symptom Triage</div>
                  <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Routes to correct duration</div>
                </div>
              </div>
              <span className="badge badge-primary">Active</span>
            </div>

            {/* Stage 2 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: 'hsla(var(--secondary), 0.08)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid hsl(var(--secondary))'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShieldCheck style={{ color: 'hsl(var(--secondary))' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>2. Insurance Gate</div>
                  <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Copay checked in 10s</div>
                </div>
              </div>
              <span className="badge badge-secondary" style={{ backgroundColor: 'hsla(var(--secondary), 0.2)', color: 'hsl(var(--secondary))' }}>Instant</span>
            </div>

            {/* Stage 3 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: 'hsla(var(--text), 0.05)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid hsl(var(--border))'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <RefreshCw style={{ color: 'hsl(var(--text-muted))' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>3. EHR Direct Calendar</div>
                  <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>No double-booking errors</div>
                </div>
              </div>
              <span className="badge" style={{ backgroundColor: 'hsl(var(--border))', color: 'hsl(var(--text-muted))' }}>100% Synced</span>
            </div>
          </div>

          {/* Decorative blur elements */}
          <div style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'hsla(var(--primary), 0.15)',
            filter: 'blur(60px)',
            top: '-20px',
            right: '-20px',
            zIndex: 1
          }} />
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'hsla(var(--secondary), 0.12)',
            filter: 'blur(50px)',
            bottom: '-40px',
            left: '-20px',
            zIndex: 1
          }} />
        </div>
      </div>
    </div>
  );
}
