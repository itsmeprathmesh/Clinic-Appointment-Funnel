import { useState } from 'react';
import { DollarSign, Clock, MessageSquare, Star, CheckCircle2 } from 'lucide-react';
import { SERVICES, ALL_REVIEWS } from '../utils/mockData';

export default function Services({ onSelectServiceForBooking }) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'consultation' | 'followup'

  const filteredReviews = activeFilter === 'all' 
    ? ALL_REVIEWS 
    : ALL_REVIEWS.filter(r => r.serviceId === activeFilter);

  return (
    <div className="section-padding" style={{ backgroundColor: 'hsla(var(--primary), 0.02)', borderTop: '1px solid hsl(var(--border))' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="badge badge-secondary" style={{ marginBottom: '12px' }}>Transparent Offerings</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '16px' }}>Clinical Services & Transparent Pricing</h2>
          <p style={{ color: 'hsl(var(--text-muted))', maxWidth: '600px', margin: '0 auto' }}>
            We list all expected times and costs upfront. Choose a tier to view targeted patient testimonials and filter verified reviews.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          marginBottom: '56px'
        }}>
          {SERVICES.map(service => (
            <div 
              key={service.id} 
              className="glass-panel" 
              style={{
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-md)',
                border: activeFilter === service.id ? '2px solid hsl(var(--primary))' : '1px solid var(--glass-border)',
                transform: activeFilter === service.id ? 'scale(1.02)' : 'none',
                transition: 'all var(--transition-normal)',
                cursor: 'pointer'
              }}
              onClick={() => setActiveFilter(service.id)}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: '6px' }}>{service.tier}</span>
                    <h3 style={{ fontSize: '1.4rem' }}>{service.name}</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'hsl(var(--primary))' }}>
                      ${service.price}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Self-Pay Base</div>
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))', lineHeight: 1.5, marginBottom: '24px' }}>
                  {service.description}
                </p>

                {/* Treatment Times Breakdown */}
                <div style={{
                  backgroundColor: 'hsl(var(--background))',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '24px',
                  border: '1px solid hsl(var(--border))'
                }}>
                  <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'hsl(var(--text-muted))', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} /> Expected Duration: {service.duration}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span>Pre-triage & Intake check:</span>
                      <strong>{service.expectedTimes.triage}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span>Direct physician evaluation:</span>
                      <strong>{service.expectedTimes.physician}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span>Care plan delivery & Rx sync:</span>
                      <strong>{service.expectedTimes.carePlan}</strong>
                    </div>
                  </div>
                </div>

                {/* Insurance Copay Tiers */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'hsl(var(--text-muted))', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarSign size={14} /> Insurance Cost Coverage
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {service.pricingTiers.map((tier, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderBottom: idx < service.pricingTiers.length - 1 ? '1px dashed hsl(var(--border))' : 'none', paddingBottom: '6px' }}>
                        <div>
                          <strong>{tier.name}</strong>
                          <div style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))' }}>{tier.details}</div>
                        </div>
                        <span style={{ fontWeight: 700, color: 'hsl(var(--secondary))' }}>{tier.rate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div style={{ marginTop: '16px' }}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectServiceForBooking(service.id);
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Book This Service
                </button>
                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: '8px' }}>
                  {activeFilter === service.id ? "✓ Currently showing filtered reviews" : "Click card to view reviews below"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Social Proof Aggregator Section */}
        <div className="glass-panel" style={{
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Controls header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            borderBottom: '1px solid hsl(var(--border))',
            paddingBottom: '20px',
            marginBottom: '24px'
          }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={20} style={{ color: 'hsl(var(--primary))' }} />
                Dynamic Social Proof
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', marginTop: '2px' }}>
                Showing verified reviews filtered for medical services.
              </p>
            </div>

            {/* Filter buttons */}
            <div style={{ display: 'flex', gap: '8px', backgroundColor: 'hsl(var(--background))', padding: '4px', borderRadius: 'var(--radius-md)' }}>
              {[
                { id: 'all', label: 'All Reviews' },
                { id: 'consultation', label: 'Consultations' },
                { id: 'followup', label: 'Follow-ups' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  style={{
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: activeFilter === f.id ? 'hsl(var(--surface))' : 'transparent',
                    color: activeFilter === f.id ? 'hsl(var(--text))' : 'hsl(var(--text-muted))',
                    boxShadow: activeFilter === f.id ? 'var(--shadow-sm)' : 'none',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="animate-fade-in" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {filteredReviews.length > 0 ? (
              filteredReviews.map(review => (
                <div key={review.id} style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{review.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-light))' }}>{review.date}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', color: '#FBBF24' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          fill={i < Math.floor(review.rating) ? "#FBBF24" : "none"} 
                          color={i < Math.floor(review.rating) ? "#FBBF24" : "hsl(var(--border))"} 
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'hsl(var(--primary))', backgroundColor: 'hsl(var(--primary-light))', padding: '1px 6px', borderRadius: '4px' }}>
                      {review.serviceId === 'consultation' ? 'Consultation' : 'Follow-up'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', lineHeight: 1.4, fontStyle: 'italic' }}>
                    "{review.comment}"
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'hsl(var(--secondary))', fontWeight: 600, marginTop: '4px' }}>
                    <CheckCircle2 size={12} />
                    Verified Patient Check-in
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'hsl(var(--text-muted))' }}>
                No reviews found for this filter.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
