import React, { useState, useRef, useEffect, useCallback } from 'react'
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

  // ── Crowd silhouette as inline SVG data URI ──
  const crowdSvg = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 60"><g fill="rgba(0,0,0,0.35)"><ellipse cx="30" cy="50" rx="14" ry="10"/><ellipse cx="30" cy="36" rx="8" ry="8"/><ellipse cx="70" cy="50" rx="14" ry="10"/><ellipse cx="70" cy="34" rx="8" ry="8"/><ellipse cx="110" cy="52" rx="14" ry="10"/><ellipse cx="110" cy="38" rx="8" ry="8"/><ellipse cx="150" cy="48" rx="14" ry="10"/><ellipse cx="150" cy="34" rx="8" ry="8"/><ellipse cx="190" cy="50" rx="14" ry="10"/><ellipse cx="190" cy="36" rx="8" ry="8"/><ellipse cx="230" cy="52" rx="14" ry="10"/><ellipse cx="230" cy="38" rx="8" ry="8"/><ellipse cx="270" cy="48" rx="14" ry="10"/><ellipse cx="270" cy="34" rx="8" ry="8"/><ellipse cx="310" cy="50" rx="14" ry="10"/><ellipse cx="310" cy="36" rx="8" ry="8"/><ellipse cx="350" cy="52" rx="14" ry="10"/><ellipse cx="350" cy="38" rx="8" ry="8"/><ellipse cx="390" cy="48" rx="14" ry="10"/><ellipse cx="390" cy="34" rx="8" ry="8"/><ellipse cx="430" cy="50" rx="14" ry="10"/><ellipse cx="430" cy="36" rx="8" ry="8"/><ellipse cx="470" cy="52" rx="14" ry="10"/><ellipse cx="470" cy="38" rx="8" ry="8"/><ellipse cx="510" cy="48" rx="14" ry="10"/><ellipse cx="510" cy="34" rx="8" ry="8"/><ellipse cx="550" cy="50" rx="14" ry="10"/><ellipse cx="550" cy="36" rx="8" ry="8"/><ellipse cx="590" cy="50" rx="14" ry="10"/><ellipse cx="590" cy="36" rx="8" ry="8"/></g></svg>`)}`

  const innerSize = DP_SIZE - BORDER * 2

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
      .sdp-input:focus { border-color: #43a047 !important; box-shadow: 0 0 0 3px rgba(67,160,71,0.15) !important; }
      .sdp-input::placeholder { color: #aaa !important; }
      .sdp-btn-upload { transition: all 0.25s ease !important; }
      .sdp-btn-upload:hover { background: #e8f5e9 !important; border-color: #43a047 !important; color: #2e7d32 !important; }
      .sdp-btn-download { transition: all 0.25s ease !important; }
      .sdp-btn-download:hover { transform: translateY(-2px) !important; box-shadow: 0 6px 20px rgba(46,125,50,0.35) !important; }
      .sdp-btn-download:active { transform: translateY(0) !important; }
      .sdp-recrop:hover { border-color: #43a047 !important; color: #2e7d32 !important; background: #f1f8e9 !important; }
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
              color: '#1b5e20',
              letterSpacing: '-0.01em',
            }}>
              🎭 Samagam DP Generator
            </h2>
            <p style={{ color: '#777', fontSize: '0.82rem', fontWeight: 500, margin: 0 }}>
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
                onChange={e => setName(e.target.value.slice(0, 25))}
                placeholder="e.g. Rahul Kumar"
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
                  border: '2.5px solid #43a047', boxShadow: '0 2px 8px rgba(67,160,71,0.2)',
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
              }}>
                <div ref={canvasRef} style={{
                  width: DP_SIZE, height: DP_SIZE, borderRadius: '50%', position: 'relative', overflow: 'hidden',
                  background: '#4caf50',
                }}>
                  {/* Inner circle */}
                  <div style={{
                    position: 'absolute', top: BORDER, left: BORDER,
                    width: innerSize, height: innerSize, borderRadius: '50%', overflow: 'hidden',
                    background: 'linear-gradient(180deg, #c62828 0%, #b71c1c 20%, #880e4f 45%, #4a148c 75%, #311b92 100%)',
                  }}>
                    {/* Crowd top */}
                    <div style={{
                      position: 'absolute', top: 95, left: 0, right: 0, height: 45, opacity: 0.45,
                      backgroundImage: `url("${crowdSvg}")`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat',
                    }} />

                    {/* Crowd bottom */}
                    <div style={{
                      position: 'absolute', bottom: 50, left: 0, right: 0, height: 45, opacity: 0.35,
                      backgroundImage: `url("${crowdSvg}")`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat',
                    }} />

                    {/* Title */}
                    <div style={{
                      position: 'absolute', top: 50, left: 0, right: 0, textAlign: 'center',
                      fontFamily: "'Noto Sans Devanagari', sans-serif", color: '#ffd700',
                      fontWeight: 900, lineHeight: 1.15,
                    }}>
                      <div style={{ fontSize: '2.4rem' }}>बिहार नवोदयन</div>
                      <div style={{ fontSize: '2.4rem' }}>समागम -2026</div>
                    </div>

                    {/* Gold divider line */}
                    <div style={{
                      position: 'absolute', top: 178, left: 60, right: 60, height: 3,
                      background: 'linear-gradient(90deg, transparent, #ffd700, transparent)',
                    }} />

                    {/* Date & Venue */}
                    <div style={{
                      position: 'absolute', top: 192, left: 0, right: 0, textAlign: 'center',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}>
                      <span style={{ fontSize: '1.3rem' }}>📅</span>
                      <span style={{
                        fontFamily: "'Noto Sans Devanagari', sans-serif", color: '#ffd700',
                        fontSize: '1.1rem', fontWeight: 700,
                      }}>
                        5 अप्रैल 2026, ऊर्जा ऑडिटोरियम, पटना
                      </span>
                    </div>

                    {/* Gold divider line 2 */}
                    <div style={{
                      position: 'absolute', top: 228, left: 60, right: 60, height: 3,
                      background: 'linear-gradient(90deg, transparent, #ffd700, transparent)',
                    }} />

                    {/* Photo circle */}
                    <div style={{
                      position: 'absolute', top: 250, right: 80,
                      width: 190, height: 190, borderRadius: '50%',
                      border: '4px solid rgba(255,255,255,0.4)',
                      overflow: 'hidden', background: '#333',
                    }}>
                      {croppedPhoto ? (
                        <img src={croppedPhoto} alt="photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#999', fontSize: '0.75rem', textAlign: 'center', padding: 8,
                        }}>
                          Upload Photo
                        </div>
                      )}
                    </div>

                    {/* Name & JNV */}
                    <div style={{
                      position: 'absolute', top: 280, left: 60,
                      fontFamily: "'Noto Sans', sans-serif", color: '#fff',
                      maxWidth: 240, overflow: 'hidden',
                    }}>
                      <div style={{
                        fontSize: name.length > 18 ? '1.3rem' : '1.65rem',
                        fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {name || 'Your Name'}
                      </div>
                      <div style={{ fontSize: '1.1rem', color: '#ddd', marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {jnv || 'JNV District'}
                      </div>
                    </div>
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
                : 'linear-gradient(135deg, #43a047 0%, #2e7d32 50%, #43a047 100%)',
              backgroundSize: '200% auto',
              animation: !isExporting ? 'sdp-shimmer 3s linear infinite' : 'none',
              color: '#fff', border: 'none', borderRadius: 12,
              fontSize: '1rem', fontWeight: 700, cursor: isExporting ? 'wait' : 'pointer',
              boxShadow: isExporting ? 'none' : '0 4px 14px rgba(46,125,50,0.25)',
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
          {/* Modal header */}
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
                style={{ width: 150, accentColor: '#43a047' }} />
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
                  background: 'linear-gradient(135deg, #43a047, #2e7d32)',
                  color: '#fff', border: 'none', borderRadius: 10,
                  fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  boxShadow: '0 2px 12px rgba(46,125,50,0.3)',
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