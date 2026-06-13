import { Activity, LayoutDashboard, UserCheck, Calendar } from 'lucide-react';

export default function Navbar({ 
  isAdmin, 
  setIsAdmin, 
  nextAvailableSlot, 
  onBookNowClick 
}) {
  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      borderRadius: '0 0 var(--radius-md) var(--radius-md)'
    }}>
      {/* Brand logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          backgroundColor: 'hsl(var(--primary-light))',
          padding: '8px',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'hsl(var(--primary))'
        }}>
          <Activity size={24} />
        </div>
        <div>
          <span style={{ 
            fontFamily: 'var(--font-heading)',
            fontSize: '1.25rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ClinicCapture OS
          </span>
          <div style={{ fontSize: '0.65rem', color: 'hsl(var(--text-muted))', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Trust-First Ecosystem
          </div>
        </div>
      </div>

      {/* Capacity & Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* Capacity Indicator - FR-FE-001 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          backgroundColor: 'hsl(var(--secondary-light))',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'hsl(var(--secondary))',
          boxShadow: '0 2px 8px hsla(var(--secondary), 0.08)'
        }}>
          <span className="capacity-dot-pulse" />
          <span>Next Available: <strong style={{ color: 'hsl(var(--text))' }}>{nextAvailableSlot}</strong></span>
        </div>

        {/* Desktop Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => setIsAdmin(!isAdmin)}
            className="btn btn-secondary" 
            style={{ 
              padding: '8px 16px', 
              fontSize: '0.85rem',
              gap: '6px',
              borderStyle: 'dashed',
              color: isAdmin ? 'hsl(var(--secondary))' : 'hsl(var(--text-muted))',
              borderColor: isAdmin ? 'hsl(var(--secondary))' : 'hsl(var(--border))'
            }}
            title={isAdmin ? "Switch to Patient View" : "Switch to Admin Dashboard"}
          >
            {isAdmin ? (
              <>
                <UserCheck size={16} />
                <span>Patient Portal</span>
              </>
            ) : (
              <>
                <LayoutDashboard size={16} />
                <span>Admin Panel</span>
              </>
            )}
          </button>

          {!isAdmin && (
            <button 
              onClick={onBookNowClick}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.85rem', gap: '6px' }}
            >
              <Calendar size={16} />
              <span>Book Appointment</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
