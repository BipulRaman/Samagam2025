import { useState, useRef, useEffect, useCallback } from 'react'
import { toPng } from 'html-to-image'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'

const DP_SIZE = 600
const BORDER = 16

// ── Crop helper ──────────────────────────────────────────────
function getCroppedImg(src: string, crop: Area): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = crop.width
      canvas.height = crop.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = reject
    img.src = src
  })
}

// Normalize image orientation (fixes stretched/rotated photos on mobile)
function normalizeImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.92))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      // Fallback to FileReader
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    }
    img.src = url
  })
}

export function SamagamPic() {
  const [name, setName] = useState('')
  const [jnv, setJnv] = useState('')
  const [photoSrc, setPhotoSrc] = useState<string | null>(null)
  const [croppedPhoto, setCroppedPhoto] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [cropState, setCropState] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const canvasRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [scale, setScale] = useState(1)

  const updateScale = useCallback(() => {
    if (!wrapperRef.current) return
    const available = wrapperRef.current.clientWidth - 32
    setScale(available < DP_SIZE ? available / DP_SIZE : 1)
  }, [])

  useEffect(() => {
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [updateScale])

  // ── Photo handling ──
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setPhotoSrc(reader.result as string)
      setShowCropper(true)
      setCropState({ x: 0, y: 0 })
      setZoom(1)
    }
    reader.readAsDataURL(file)
  }

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  const handleCropDone = async () => {
    if (!photoSrc || !croppedAreaPixels) return
    const cropped = await getCroppedImg(photoSrc, croppedAreaPixels)
    setCroppedPhoto(cropped)
    setShowCropper(false)
  }

  const handleExport = async () => {
    if (!canvasRef.current) return
    setIsExporting(true)
    try {
      const dataUrl = await toPng(canvasRef.current, { pixelRatio: 4, cacheBust: true })
      const fileName = `Samagam_DP${name ? `_${name.replace(/ /g, '_')}` : ''}`
      const link = document.createElement('a')
      link.download = `${fileName}.png`
      link.href = dataUrl
      link.click()
    } finally {
      setIsExporting(false)
    }
  }

  const innerSize = DP_SIZE - BORDER * 2

  // Ornamental ring SVG (decorative dots around perimeter)
  const ornamentRingSvg = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 568 568"><circle cx="284" cy="284" r="278" fill="none" stroke="rgba(255,215,0,0.25)" stroke-width="1"/><circle cx="284" cy="284" r="268" fill="none" stroke="rgba(255,215,0,0.12)" stroke-width="0.5"/>${Array.from({length:36},(_,i)=>{const a=i*10*Math.PI/180;return`<circle cx="${284+273*Math.cos(a)}" cy="${284+273*Math.sin(a)}" r="2.5" fill="rgba(255,215,0,0.3)"/>`}).join('')}</svg>`)}`

  // Inject keyframe styles once
  useEffect(() => {
    const id = 'samagam-dp-styles'
    if (document.getElementById(id)) return
    const style = document.createElement('style')
    style.id = id
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      @keyframes sdp-shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      @keyframes sdp-fadeIn {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .sdp-input { transition: all 0.25s ease !important; }
      .sdp-input:focus { border-color: #8b1a2b !important; box-shadow: 0 0 0 3px rgba(139,26,43,0.1) !important; }
      .sdp-input::placeholder { color: #bbb !important; }
      .sdp-btn-upload { transition: all 0.25s ease !important; }
      .sdp-btn-upload:hover { background: #fdf2f4 !important; border-color: #8b1a2b !important; color: #8b1a2b !important; }
      .sdp-btn-download { transition: all 0.25s ease !important; }
      .sdp-btn-download:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 24px rgba(139,26,43,0.35) !important; }
      .sdp-btn-download:active { transform: translateY(0) !important; }
      .sdp-recrop:hover { border-color: #8b1a2b !important; color: #8b1a2b !important; background: #fdf2f4 !important; }
    `
    document.head.appendChild(style)
  }, [])

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: '20px 12px',
      animation: 'sdp-fadeIn 0.5s ease-out',
    }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        {/* ── Card Container ── */}
        <div style={{
          background: '#ffffff',
          borderRadius: 16, padding: '24px 22px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)',
          border: '1px solid #e8e8e8',
        }}>

          {/* ── Header ── */}
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <h2 style={{
              fontSize: '1.4rem', fontWeight: 800, margin: '0 0 4px',
              color: '#7b1530',
              letterSpacing: '-0.01em',
            }}>
              Samagam DP Generator
            </h2>
            <p style={{ color: '#999', fontSize: '0.82rem', fontWeight: 500, margin: 0 }}>
              बिहार नवोदयन समागम 2026 — Create your profile picture
            </p>
          </div>

          {/* ── Divider ── */}
          <div style={{
            height: 1, margin: '0 0 20px',
            background: 'linear-gradient(90deg, transparent, #e0e0e0, transparent)',
          }} />

          {/* ── Form Fields ── */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label style={{
                fontWeight: 600, display: 'block', marginBottom: 6,
                fontSize: '0.78rem', color: '#555',
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                Your Name
              </label>
              <input
                className="sdp-input"
                type="text" value={name}
                onChange={e => setName(e.target.value.slice(0, 65))}
                placeholder="e.g. Rahul Kumar"
                maxLength={65}
                style={{
                  width: '100%', padding: '11px 14px',
                  border: '1.5px solid #ddd', borderRadius: 10,
                  fontSize: '0.95rem', boxSizing: 'border-box',
                  outline: 'none', color: '#333',
                  background: '#fafafa',
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label style={{
                fontWeight: 600, display: 'block', marginBottom: 6,
                fontSize: '0.78rem', color: '#555',
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                JNV Name
              </label>
              <input
                className="sdp-input"
                type="text" value={jnv}
                onChange={e => setJnv(e.target.value.slice(0, 25))}
                placeholder="e.g. JNV Madhubani"
                maxLength={25}
                style={{
                  width: '100%', padding: '11px 14px',
                  border: '1.5px solid #ddd', borderRadius: 10,
                  fontSize: '0.95rem', boxSizing: 'border-box',
                  outline: 'none', color: '#333',
                  background: '#fafafa',
                }}
              />
            </div>
          </div>

          {/* ── Photo Upload Row ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
            marginBottom: 20,
          }}>
            <label
              className="sdp-btn-upload"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                background: '#f5f5f5', borderRadius: 10, cursor: 'pointer',
                fontWeight: 600, fontSize: '0.88rem', color: '#555',
                border: '1.5px dashed #ccc',
              }}>
              <span style={{ fontSize: '1.05rem' }}>📷</span>
              {croppedPhoto ? 'Change Photo' : 'Upload Photo'}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>

            {croppedPhoto && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                animation: 'sdp-fadeIn 0.3s ease-out',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', overflow: 'hidden',
                  border: '2.5px solid #8b1a2b', boxShadow: '0 2px 8px rgba(139,26,43,0.15)',
                }}>
                  <img src={croppedPhoto} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <button
                  className="sdp-recrop"
                  onClick={() => { setShowCropper(true); setCropState({ x: 0, y: 0 }); setZoom(1) }}
                  style={{
                    padding: '5px 12px', border: '1.5px solid #ddd', borderRadius: 8,
                    background: '#fff', cursor: 'pointer', fontSize: '0.8rem',
                    color: '#666', fontWeight: 500,
                  }}>
                  Re-crop
                </button>
              </div>
            )}
          </div>

          {/* ── Divider ── */}
          <div style={{
            height: 1, margin: '0 0 20px',
            background: 'linear-gradient(90deg, transparent, #e0e0e0, transparent)',
          }} />

          {/* ── DP Preview ── */}
          <div style={{
            borderRadius: 14, padding: 12, marginBottom: 18,
            background: '#f5f5f5',
            border: '1px solid #eee',
            display: 'flex', justifyContent: 'center',
          }}>
            <div ref={wrapperRef} style={{ overflow: 'hidden', width: '100%', maxWidth: DP_SIZE }}>
              <div style={{
                width: DP_SIZE, height: DP_SIZE, transformOrigin: 'top left', transform: `scale(${scale})`,
                marginBottom: -(DP_SIZE * (1 - scale)),
              }}>
                <div ref={canvasRef} style={{
                  width: DP_SIZE, height: DP_SIZE, borderRadius: '50%', position: 'relative', overflow: 'hidden',
                  background: 'linear-gradient(135deg, #1a6b1e 0%, #2e8b32 30%, #3da044 60%, #2e8b32 100%)',
                }}>
                  {/* Gold inner ring accent */}
                  <div style={{
                    position: 'absolute', top: 10, left: 10, right: 10, bottom: 10,
                    borderRadius: '50%', border: '2px solid rgba(255,215,0,0.4)',
                  }} />

                  {/* Inner circle - main content area */}
                  <div style={{
                    position: 'absolute', top: BORDER, left: BORDER,
                    width: innerSize, height: innerSize, borderRadius: '50%', overflow: 'hidden',
                    background: 'radial-gradient(ellipse at 50% 30%, #d4342a 0%, #b22a22 20%, #8c2240 38%, #6a1e55 55%, #4a1a6a 72%, #2d1560 88%, #1e0f45 100%)',
                  }}>
                    {/* Subtle radial light overlay for depth */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.08) 0%, transparent 60%)',
                    }} />

                    {/* Ornamental dots ring */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      backgroundImage: `url("${ornamentRingSvg}")`,
                      backgroundSize: '100% 100%',
                    }} />

                    {/* Top decorative arc line */}
                    <div style={{
                      position: 'absolute', top: 35, left: 80, right: 80, height: 1,
                      background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.2), transparent)',
                    }} />

                    {/* Title block */}
                    <div style={{
                      position: 'absolute', top: 46, left: 0, right: 0, textAlign: 'center',
                      fontFamily: "'Noto Sans Devanagari', sans-serif",
                      fontWeight: 900, lineHeight: 1.1,
                    }}>
                      <div style={{
                        fontSize: '2.6rem', color: '#FFD700',
                        textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 30px rgba(255,215,0,0.15)',
                        letterSpacing: '0.02em',
                      }}>बिहार नवोदयन</div>
                      <div style={{
                        fontSize: '2.6rem', color: '#FFD700',
                        textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 30px rgba(255,215,0,0.15)',
                        letterSpacing: '0.02em',
                      }}>समागम 2026</div>
                    </div>

                    {/* Ornamental divider with diamond */}
                    <div style={{
                      position: 'absolute', top: 176, left: 40, right: 40, height: 12,
                      display: 'flex', alignItems: 'center',
                    }}>
                      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #FFD700)' }} />
                      <div style={{
                        width: 8, height: 8, background: '#FFD700', transform: 'rotate(45deg)',
                        margin: '0 8px', flexShrink: 0,
                      }} />
                      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #FFD700, transparent)' }} />
                    </div>

                    {/* Date & Venue in a subtle banner */}
                    <div style={{
                      position: 'absolute', top: 196, left: 30, right: 30,
                      background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.25) 20%, rgba(0,0,0,0.25) 80%, transparent)',
                      borderRadius: 20, padding: '6px 0',
                      textAlign: 'center',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                      <span style={{
                        fontFamily: "'Noto Sans Devanagari', sans-serif", color: '#FFD700',
                        fontSize: '0.95rem', fontWeight: 700,
                        letterSpacing: '0.02em',
                      }}>
                        📅 5 अप्रैल 2026 · ऊर्जा ऑडिटोरियम, पटना
                      </span>
                    </div>

                    {/* Second ornamental divider */}
                    <div style={{
                      position: 'absolute', top: 234, left: 40, right: 40, height: 12,
                      display: 'flex', alignItems: 'center',
                    }}>
                      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.4))' }} />
                      <div style={{
                        width: 5, height: 5, background: 'rgba(255,215,0,0.5)', borderRadius: '50%',
                        margin: '0 6px', flexShrink: 0,
                      }} />
                      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(255,215,0,0.4), transparent)' }} />
                    </div>

                    {/* Photo circle - hero element with double ring */}
                    <div style={{
                      position: 'absolute', top: 255, left: '50%', transform: 'translateX(28%)',
                      width: 200, height: 200, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FFD700, #DAA520, #FFD700)',
                      padding: 4, boxSizing: 'border-box',
                    }}>
                      <div style={{
                        width: '100%', height: '100%', borderRadius: '50%',
                        overflow: 'hidden', background: '#1e0f45',
                      }}>
                        {croppedPhoto ? (
                          <img src={croppedPhoto} alt="photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{
                            width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'rgba(255,215,0,0.3)', fontSize: '0.8rem', textAlign: 'center', padding: 8,
                            fontFamily: "'Inter', sans-serif",
                          }}>
                            Your Photo
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Name & JNV - centered in left half */}
                    <div style={{
                      position: 'absolute', top: 280, left: 50, right: 245,
                      fontFamily: "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
                      overflow: 'hidden',
                      textAlign: 'center',
                    }}>
                      <div style={{
                        fontSize: name.length > 35 ? '1.4rem' : name.length > 22 ? '1.6rem' : name.length > 14 ? '1.9rem' : '2.4rem',
                        fontWeight: 600, overflow: 'hidden',
                        color: '#fff',
                        textShadow: '0 2px 6px rgba(0,0,0,0.4)',
                        lineHeight: 1.3,
                        whiteSpace: 'normal', wordWrap: 'break-word',
                        maxHeight: '4em',
                      }}>
                        {name || 'Your Name'}
                      </div>
                      <div style={{
                        fontSize: '1.15rem', color: '#FFD700', marginTop: 5, fontWeight: 600,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        opacity: 0.85,
                      }}>
                        {jnv || 'JNV District'}
                      </div>
                    </div>

                    {/* Bottom branding */}
                    <div style={{
                      position: 'absolute', bottom: 40, left: 0, right: 0,
                      textAlign: 'center',
                      fontFamily: "'Noto Sans', sans-serif",
                      fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.12em',
                      color: 'rgba(255,215,0,0.5)',
                      textTransform: 'uppercase',
                    }}>
                      Bihar Navodaya Pariwar
                    </div>

                    {/* Bottom decorative arc */}
                    <div style={{
                      position: 'absolute', bottom: 30, left: 80, right: 80, height: 1,
                      background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.15), transparent)',
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Download Button ── */}
          <button
            className="sdp-btn-download"
            onClick={handleExport}
            disabled={isExporting}
            style={{
              width: '100%', padding: '14px 20px',
              background: isExporting
                ? '#e0e0e0'
                : 'linear-gradient(135deg, #8b1a2b 0%, #6d1426 50%, #8b1a2b 100%)',
              backgroundSize: '200% auto',
              animation: !isExporting ? 'sdp-shimmer 3s linear infinite' : 'none',
              color: '#fff', border: 'none', borderRadius: 12,
              fontSize: '1rem', fontWeight: 700, cursor: isExporting ? 'wait' : 'pointer',
              boxShadow: isExporting ? 'none' : '0 4px 14px rgba(139,26,43,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              letterSpacing: '0.02em',
            }}>
            <span style={{ fontSize: '1.1rem' }}>{isExporting ? '⏳' : '⬇'}</span>
            {isExporting ? 'Generating...' : 'Download DP'}
          </button>
        </div>
      </div>

      {/* ── Crop Modal ── */}
      {showCropper && photoSrc && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
          zIndex: 1000, display: 'flex', flexDirection: 'column',
          animation: 'sdp-fadeIn 0.2s ease-out',
        }}>
          <div style={{
            padding: '14px 20px',
            background: 'rgba(0,0,0,0.5)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', fontFamily: "'Inter', sans-serif" }}>
              Crop your photo
            </span>
            <button onClick={() => setShowCropper(false)} style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '1.5rem',
              cursor: 'pointer', padding: '4px 8px', lineHeight: 1,
            }}>
              ✕
            </button>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <Cropper
              image={photoSrc}
              crop={cropState}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCropState}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div style={{
            padding: '16px 20px', display: 'flex', gap: 14,
            justifyContent: 'center', alignItems: 'center',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#aaa', fontSize: '0.82rem', fontWeight: 500 }}>Zoom</span>
              <input type="range" min={1} max={3} step={0.05} value={zoom}
                onChange={e => setZoom(Number(e.target.value))}
                style={{ width: 150, accentColor: '#8b1a2b' }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowCropper(false)}
                style={{
                  padding: '10px 24px', background: 'rgba(255,255,255,0.1)',
                  color: '#ccc', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 10, fontWeight: 600, fontSize: '0.92rem',
                  cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                }}>
                Cancel
              </button>
              <button onClick={handleCropDone}
                style={{
                  padding: '10px 28px',
                  background: 'linear-gradient(135deg, #8b1a2b, #6d1426)',
                  color: '#fff', border: 'none', borderRadius: 10,
                  fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  boxShadow: '0 2px 12px rgba(139,26,43,0.3)',
                }}>
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}