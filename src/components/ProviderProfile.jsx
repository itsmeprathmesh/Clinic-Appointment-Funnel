import { useState, useRef } from 'react';
import { Award, GraduationCap, FileText, CheckCircle, Play, Pause, RotateCcw } from 'lucide-react';
import { PROVIDERS } from '../utils/mockData';

export default function ProviderProfile() {
  const [selectedDocId, setSelectedDocId] = useState(PROVIDERS[0].id);
  const [cvTab, setCvTab] = useState('experience'); // 'experience' | 'education' | 'publications'
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const videoRef = useRef(null);

  const doctor = PROVIDERS.find(p => p.id === selectedDocId);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (speed) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="section-padding" style={{ borderTop: '1px solid hsl(var(--border))' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '12px' }}>Verified Credentials</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '16px' }}>Meet Our Care Leadership</h2>
          <p style={{ color: 'hsl(var(--text-muted))', maxWidth: '600px', margin: '0 auto' }}>
            Verify credentials, view clinical experience, and listen to introductory videos directly from our board-certified doctors.
          </p>

          {/* Doctor Selection Tabs */}
          <div style={{
            display: 'inline-flex',
            marginTop: '24px',
            backgroundColor: 'hsl(var(--border))',
            padding: '4px',
            borderRadius: 'var(--radius-md)'
          }}>
            {PROVIDERS.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedDocId(p.id);
                  setIsPlaying(false);
                  setPlaybackSpeed(1);
                }}
                style={{
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: selectedDocId === p.id ? 'hsl(var(--surface))' : 'transparent',
                  color: selectedDocId === p.id ? 'hsl(var(--text))' : 'hsl(var(--text-muted))',
                  boxShadow: selectedDocId === p.id ? 'var(--shadow-sm)' : 'none',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {p.name.split(',')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Left Column: Doctor Profile & Video Player */}
          <div className="glass-panel" style={{
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            {/* Doctor Headshot & Details */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <img
                src={doctor.image}
                alt={doctor.name}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-full)',
                  objectFit: 'cover',
                  border: '3px solid hsl(var(--primary-light))'
                }}
              />
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>{doctor.name}</h3>
                <p style={{ color: 'hsl(var(--primary))', fontSize: '0.85rem', fontWeight: 600 }}>{doctor.title}</p>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  <span className="badge badge-secondary" style={{ textTransform: 'none', fontSize: '0.7rem' }}>
                    <CheckCircle size={10} /> Verified Provider
                  </span>
                </div>
              </div>
            </div>

            {/* Video Player Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                aspectRatio: '16/9',
                backgroundColor: '#000',
                boxShadow: 'var(--shadow-md)'
              }}>
                <video
                  ref={videoRef}
                  src={doctor.videoUrl}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onEnded={() => setIsPlaying(false)}
                />

                {/* Subtitle Overlay (FR-FE-002) */}
                {showSubtitles && isPlaying && (
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    textAlign: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    color: '#fff',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    pointerEvents: 'none',
                    zIndex: 20,
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(4px)'
                  }}>
                    {selectedDocId === 'dr-jenkins' 
                      ? '"Hello, I\'m Dr. Jenkins. I believe medicine should be collaborative, and transparency is our first priority."'
                      : '"Hi, I\'m Dr. Fletcher. My goal is to ensure your cardiac care is seamless, prompt, and stress-free."'}
                  </div>
                )}

                {/* Play Overlay */}
                {!isPlaying && (
                  <div 
                    onClick={handlePlayPause}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 15,
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'hsl(var(--primary))',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 20px hsla(var(--primary), 0.4)',
                      transition: 'transform var(--transition-fast)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <Play size={28} fill="#fff" style={{ marginLeft: '4px' }} />
                    </div>
                    <span style={{ color: '#fff', marginTop: '12px', fontWeight: 600, fontSize: '0.85rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                      Watch 60s Introduction
                    </span>
                  </div>
                )}
              </div>

              {/* Video Controls bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                backgroundColor: 'hsl(var(--background))',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid hsl(var(--border))'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={handlePlayPause}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', 
                      color: 'hsl(var(--text))', display: 'flex', alignItems: 'center'
                    }}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button 
                    onClick={handleRestart}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', 
                      color: 'hsl(var(--text))', display: 'flex', alignItems: 'center'
                    }}
                    title="Restart"
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(var(--text-muted))', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input 
                      type="checkbox" 
                      checked={showSubtitles} 
                      onChange={(e) => setShowSubtitles(e.target.checked)} 
                    />
                    CC
                  </label>
                  
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 1.25, 1.5].map(speed => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        style={{
                          border: 'none',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          backgroundColor: playbackSpeed === speed ? 'hsl(var(--primary))' : 'transparent',
                          color: playbackSpeed === speed ? '#fff' : 'hsl(var(--text-muted))'
                        }}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications & Badges */}
            <div>
              <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'hsl(var(--text-muted))', marginBottom: '12px', letterSpacing: '0.05em' }}>
                Verified Certifications
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {doctor.certifications.map((cert, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid hsl(var(--border))',
                    backgroundColor: 'hsl(var(--background))'
                  }}>
                    <Award size={20} style={{ color: 'hsl(var(--secondary))', flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{cert.name}</span>
                      <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))' }}>Issued by {cert.issuer} • {cert.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: CV Triage Accordion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              minHeight: '400px',
              boxShadow: 'var(--shadow-lg)'
            }}>
              {/* Tabs */}
              <div style={{
                display: 'flex',
                borderBottom: '2px solid hsl(var(--border))',
                marginBottom: '24px',
                gap: '20px'
              }}>
                {[
                  { id: 'experience', label: 'Clinical Experience', icon: Award },
                  { id: 'education', label: 'Education & Training', icon: GraduationCap },
                  { id: 'publications', label: 'Publications & Research', icon: FileText }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setCvTab(tab.id)}
                      style={{
                        border: 'none',
                        background: 'none',
                        padding: '12px 4px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: cvTab === tab.id ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))',
                        borderBottom: cvTab === tab.id ? '2px solid hsl(var(--primary))' : '2px solid transparent',
                        marginBottom: '-2px',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Contents */}
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {cvTab === 'experience' && (
                  doctor.cv.experience.map((exp, i) => (
                    <div key={i} style={{ display: 'flex', gap: '16px', borderBottom: i < doctor.cv.experience.length - 1 ? '1px solid hsl(var(--border))' : 'none', paddingBottom: '16px' }}>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%', 
                        backgroundColor: 'hsl(var(--primary))', marginTop: '6px', flexShrink: 0
                      }} />
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{exp.role}</h4>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(var(--primary))', backgroundColor: 'hsl(var(--primary-light))', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>
                            {exp.period}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', fontWeight: 500, margin: '2px 0 6px 0' }}>{exp.institution}</div>
                        <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', lineHeight: 1.5 }}>{exp.description}</p>
                      </div>
                    </div>
                  ))
                )}

                {cvTab === 'education' && (
                  doctor.cv.education.map((edu, i) => (
                    <div key={i} style={{ display: 'flex', gap: '16px', borderBottom: i < doctor.cv.education.length - 1 ? '1px solid hsl(var(--border))' : 'none', paddingBottom: '16px' }}>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%', 
                        backgroundColor: 'hsl(var(--secondary))', marginTop: '6px', flexShrink: 0
                      }} />
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{edu.degree}</h4>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(var(--secondary))', backgroundColor: 'hsl(var(--secondary-light))', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>
                            {edu.period}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', fontWeight: 500, margin: '2px 0 6px 0' }}>{edu.institution}</div>
                        {edu.honors && <p style={{ fontSize: '0.8rem', color: 'hsl(var(--secondary))', fontWeight: 600 }}>Honors: {edu.honors}</p>}
                      </div>
                    </div>
                  ))
                )}

                {cvTab === 'publications' && (
                  doctor.cv.publications.map((pub, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', paddingBottom: '12px' }}>
                      <FileText size={18} style={{ color: 'hsl(var(--primary))', flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.4 }}>"{pub.title}"</h4>
                        <div style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', marginTop: '4px' }}>
                          Published in <strong style={{ color: 'hsl(var(--text))' }}>{pub.journal}</strong> • {pub.year}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
