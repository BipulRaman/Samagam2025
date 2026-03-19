import { useState, useEffect, useMemo } from 'react'

const UPI_ID = 'biharnavodayapariwar@sbi'

export function SamagamForm() {
  const [snackbarMsg, setSnackbarMsg] = useState('')

  const { toName, fromName } = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return {
      toName: params.get('t'),
      fromName: params.get('f'),
    }
  }, [])

  useEffect(() => {
    const id = 'samagam-form-styles'
    if (document.getElementById(id)) return
    const style = document.createElement('style')
    style.id = id
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

      .sf-wrap { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 0; }

      .sf-invite {
        max-width: 600px; margin: 0 auto; padding: 0; background: #fff;
        border-radius: 0; overflow: hidden;
        box-shadow: none;
        border: none; color: #333; line-height: 1.7; font-size: 0.95rem;
      }

      .sf-header {
        background: linear-gradient(135deg, #7b1530 0%, #a3213f 50%, #7b1530 100%);
        padding: 24px 16px 20px; text-align: center; color: #fff; position: relative; overflow: hidden;
      }
      .sf-header::before {
        content: ''; position: absolute; inset: 0;
        background: radial-gradient(circle at 20% 80%, rgba(255,215,0,0.12) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%);
      }
      .sf-header h2 { font-size: 1.4rem; font-weight: 800; margin: 0 0 2px; position: relative; letter-spacing: 0.02em; }
      .sf-header .sf-subtitle { font-size: 0.82rem; opacity: 0.85; font-weight: 400; position: relative; }
      .sf-body { padding: 16px 12px 20px; }
      .sf-body p { margin: 6px 0; }
      .sf-body b { color: #222; }
      .sf-body ul { padding-left: 0; margin: 10px 0; list-style: none; }
      .sf-body li { margin: 0; padding: 8px 0 8px 0; display: flex; align-items: flex-start; gap: 10px; border-bottom: 1px solid #f5f5f5; }
      .sf-body li:last-child { border-bottom: none; }
      .sf-body li .sf-icon { flex-shrink: 0; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; background: #fdf2f4; }
      .sf-body a { color: #7b1530; text-decoration: none; font-weight: 500; }
      .sf-body a:hover { text-decoration: underline; }

      .sf-hr { height: 1px; margin: 18px 0; background: linear-gradient(90deg, transparent, #e8e0e2, transparent); border: none; }

      .sf-tagline { text-align: center; color: #7b1530; font-style: italic; font-size: 0.92rem; margin: 4px 0 0; }

      .sf-payment-card {
        background: #fafafa; border: 1px solid #eee; border-radius: 14px; padding: 16px 18px; margin: 6px 0;
      }
      .sf-payment-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #888; margin-bottom: 8px; }

      .sf-code { user-select: all; display: inline; padding: 3px 8px; margin: 0; white-space: nowrap; background: #fff; border: 1px solid #e8e8e8; border-radius: 6px; font-family: 'SF Mono', 'Fira Code', 'Courier New', monospace; font-size: 0.88rem; color: #333; }

      .sf-upi-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
      .sf-copy-btn {
        display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px;
        border: 1.5px solid #ddd; border-radius: 8px; background: #fff; cursor: pointer;
        font-size: 0.78rem; font-weight: 600; color: #666; transition: all 0.2s;
        font-family: inherit;
      }
      .sf-copy-btn:hover { border-color: #7b1530; background: #fdf2f4; color: #7b1530; }

      .sf-bank-grid { display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; margin-top: 10px; align-items: center; }
      .sf-bank-label { font-size: 0.82rem; color: #888; font-weight: 500; }

      .sf-register-wrap { text-align: center; margin: 4px 0; }
      .sf-register-btn {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 14px 40px; background: linear-gradient(135deg, #7b1530, #a3213f);
        color: #fff !important; font-weight: 700; font-size: 1rem; border: none; border-radius: 12px;
        cursor: pointer; text-decoration: none !important; transition: all 0.3s;
        box-shadow: 0 4px 16px rgba(123,21,48,0.25);
        font-family: inherit; letter-spacing: 0.02em;
      }
      .sf-register-btn:visited { color: #fff !important; text-decoration: none !important; }
      .sf-register-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(123,21,48,0.35); text-decoration: none !important; color: #fff !important; }
      .sf-register-btn:active { transform: translateY(0); color: #fff !important; }

      .sf-section-title {
        font-size: 0.78rem; font-weight: 700; color: #7b1530; margin: 0 0 10px;
        text-transform: uppercase; letter-spacing: 0.06em;
        display: flex; align-items: center; gap: 8px;
      }
      .sf-section-title::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, #e8d0d5, transparent); }

      .sf-sponsor-card {
        background: #fafafa; border: 1px solid #eee; border-radius: 14px; padding: 16px 18px; margin: 8px 0;
      }
      .sf-sponsor-type { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #b08a30; margin-bottom: 6px; }
      .sf-sponsor-name { font-size: 0.88rem; color: #444; margin-bottom: 10px; }
      .sf-sponsors-row { display: flex; flex-wrap: nowrap; gap: 12px; align-items: center; }
      .sf-sponsor-img-wrap {
        flex: 1; min-width: 0; height: 80px; border-radius: 14px; overflow: hidden;
        background: #fff; border: 1px solid #eee;
        display: flex; align-items: center; justify-content: center; padding: 4px 4px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.04);
      }
      .sf-sponsor-img-wrap img { max-height: 100%; max-width: 100%; object-fit: contain; }
      .sf-sponsor-img-wrap.sf-title-logo { height: 120px; padding: 6px 8px; }
      .sf-sponsor-img-wrap.sf-title-logo img { max-width: 320px; }

      .sf-footer { text-align: center; padding-top: 4px; }
      .sf-footer p { color: #888; font-size: 0.88rem; }
      .sf-rsvp { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #aaa; margin-top: 12px; }
      .sf-rsvp-name { font-size: 1rem; color: #7b1530; font-weight: 700; margin-top: 2px; }

      .sf-snackbar {
        position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
        background: #1a1a1a; color: #fff; padding: 12px 24px; border-radius: 12px;
        font-size: 0.85rem; font-weight: 500; z-index: 9999;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        animation: sf-slideUp 0.3s ease-out;
      }
      @keyframes sf-slideUp { from { opacity: 0; transform: translateX(-50%) translateY(12px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
    `
    document.head.appendChild(style)
  }, [])

  const copyUpi = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setSnackbarMsg('UPI ID copied to clipboard')
      setTimeout(() => setSnackbarMsg(''), 2000)
    })
  }

  return (
    <div className="sf-wrap">
      <div className="sf-invite">

        {/* ── Header Banner ── */}
        <div className="sf-header">
          <h2>Bihar Navodayan Samagam 5.0</h2>
          <div className="sf-subtitle">State-level Navodaya Alumni Meet of Bihar</div>
        </div>

        {/* ── Body ── */}
        <div className="sf-body">
          <p>Dear {toName ? <b>{toName}</b> : 'Navodayans'},</p>
          <p>
            We are delighted to invite you to the 5th season of{' '}
            <b>Bihar Navodayan Samagam</b>, Bihar's state-level Alumni Meet.
          </p>
          <p className="sf-tagline">Let's Reunite &amp; Relive Our Cherished Memories</p>

          <div className="sf-hr" />

          {/* ── Program Details ── */}
          <h6 className="sf-section-title">Program Details</h6>
          <ul>
            <li>
              <span className="sf-icon">📅</span>
              <span><b>Date:</b> April 5th, 2026 (Sunday)</span>
            </li>
            <li>
              <span className="sf-icon">🕘</span>
              <span><b>Time:</b> 9:00 AM – 9:00 PM</span>
            </li>
            <li>
              <span className="sf-icon">📍</span>
              <span>
                <b>Venue:</b>{' '}
                <a href="https://maps.app.goo.gl/XRUuMqs17XjaDH668" target="_blank" rel="noopener noreferrer">
                  Urja Auditorium Stadium, Shastri Nagar, Patna
                </a>
              </span>
            </li>
            <li>
              <span className="sf-icon">📞</span>
              <span><b>Contact:</b> 9304619105 · 7061353629 · 9699445941</span>
            </li>
          </ul>

          <div className="sf-hr" />

          {/* ── Register Button ── */}
          <div className="sf-register-wrap">
            <a
              href="https://forms.gle/Xs338fJ1cvijRaX96"
              target="_blank"
              rel="noopener noreferrer"
              className="sf-register-btn"
            >
              Register Now
            </a>
          </div>

          <div className="sf-hr" />

          {/* ── Payment Info ── */}
          <h6 className="sf-section-title">Payment Details</h6>
          <div className="sf-payment-card">
            <div className="sf-payment-label">UPI</div>
            <div className="sf-upi-row">
              <span className="sf-code">{UPI_ID}</span>
              <button className="sf-copy-btn" type="button" onClick={copyUpi} title="Copy UPI ID">
                📋 Copy
              </button>
            </div>

            <div className="sf-payment-label" style={{ marginTop: 14 }}>Bank Transfer</div>
            <div className="sf-bank-grid">
              <span className="sf-bank-label">Name</span>
              <span className="sf-code">Bihar Navodaya Pariwar</span>
              <span className="sf-bank-label">A/C No.</span>
              <span className="sf-code">43636412130</span>
              <span className="sf-bank-label">IFSC</span>
              <span className="sf-code">SBIN0004232</span>
            </div>
          </div>

          <div className="sf-hr" />

          {/* ── Sponsors ── */}
          <h6 className="sf-section-title">Sponsors</h6>

          <div className="sf-sponsor-card">
            <div className="sf-sponsor-type">🏆 Title Sponsor</div>
            <div className="sf-sponsor-name">
              O. P. Jindal University (OPJU), Raigarh (C.G.) — NAAC 'A' Grade Accredited University
            </div>
            <div className="sf-sponsors-row">
              <div className="sf-sponsor-img-wrap sf-title-logo">
                <img src="https://sam.bipul.in/images/OPJU.jpeg" alt="OPJU" />
              </div>
            </div>
          </div>

          <div className="sf-sponsor-card">
            <div className="sf-sponsor-type">🤝 Co-Sponsors</div>
            <div className="sf-sponsor-name">Incure Hospital · Balajee Global · Beauty Island</div>
            <div className="sf-sponsors-row">
              <div className="sf-sponsor-img-wrap">
                <img src="https://sam.bipul.in/images/IncureHospital.jpeg" alt="Incure Hospital" />
              </div>
              <div className="sf-sponsor-img-wrap">
                <img src="https://sam.bipul.in/images/BalaJee.jpeg" alt="Balajee Global" />
              </div>
              <div className="sf-sponsor-img-wrap">
                <img src="https://sam.bipul.in/images/BeutyIsland.jpeg" alt="Beauty Island" />
              </div>
            </div>
          </div>

          <div className="sf-hr" />

          {/* ── Footer ── */}
          <div className="sf-footer">
            <p>We look forward to seeing you there!</p>
            <div className="sf-rsvp">RSVP</div>
            <div className="sf-rsvp-name">{fromName ? fromName : 'Bihar Navodaya Pariwar'}</div>
          </div>
        </div>
      </div>

      {snackbarMsg && <div className="sf-snackbar">{snackbarMsg}</div>}
    </div>
  )
}
