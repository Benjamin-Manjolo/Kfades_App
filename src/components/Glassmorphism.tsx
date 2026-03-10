import { useState } from "react";

const styles = `
 
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .scene {
    min-height: 100vh;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Outfit', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* The colorful blobs BEHIND everything */
  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.7;
  }
  .blob-pink  { width:300px; height:300px; background:#e040fb; top:5%;   left:10%;  }
  .blob-blue  { width:350px; height:350px; background:#2979ff; top:50%;  right:5%;  }
  .blob-teal  { width:250px; height:250px; background:#00bcd4; bottom:5%; left:35%; }

  /* ===== THE GLASS RECIPE ===== */
  .glass {
    background: rgba(255, 255, 255, 0.10);   /* 1. see-through white */
    backdrop-filter: blur(18px);              /* 2. frosted blur       */
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(255,255,255,0.20); /* 3. soft white rim     */
    border-radius: 24px;
  }

  /* Variations — just change the opacity */
  .glass-lighter { background: rgba(255,255,255,0.18); }
  .glass-darker  { background: rgba(0,0,0,0.20);       }

  /* ===== BUTTON ===== */
  .btn {
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    backdrop-filter: blur(10px);
    color: white;
    border-radius: 12px;
    padding: 10px 24px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn:hover { background: rgba(255,255,255,0.25); transform: scale(1.04); }
  .btn-accent {
    background: rgba(41,121,255,0.55);
    border-color: rgba(41,121,255,0.4);
  }
  .btn-accent:hover { background: rgba(41,121,255,0.75); }

  /* ===== INPUT ===== */
  .glass-input {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 12px;
    padding: 10px 14px;
    color: white;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    outline: none;
    width: 100%;
    transition: border 0.2s, background 0.2s;
  }
  .glass-input::placeholder { color: rgba(255,255,255,0.35); }
  .glass-input:focus {
    border-color: rgba(41,121,255,0.6);
    background: rgba(255,255,255,0.13);
  }

  /* ===== TAG / BADGE ===== */
  .tag {
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 99px;
    padding: 4px 12px;
    font-size: 12px;
    color: rgba(255,255,255,0.75);
    cursor: pointer;
    transition: all 0.2s;
  }
  .tag:hover, .tag.on { background: rgba(41,121,255,0.4); border-color: rgba(41,121,255,0.5); color: white; }

  /* ===== PROGRESS ===== */
  .track {
    background: rgba(255,255,255,0.1);
    border-radius: 99px;
    height: 8px;
    overflow: hidden;
  }
  .fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, #2979ff, #e040fb);
    transition: width 0.6s ease;
  }

  /* ===== TOGGLE ===== */
  .toggle-wrap {
    width: 48px; height: 26px;
    border-radius: 99px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    position: relative;
    cursor: pointer;
    transition: background 0.3s;
  }
  .toggle-wrap.on { background: rgba(41,121,255,0.55); border-color: rgba(41,121,255,0.4); }
  .toggle-knob {
    position: absolute;
    top: 3px; left: 3px;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: white;
    transition: left 0.3s;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  }
  .toggle-wrap.on .toggle-knob { left: 25px; }

  .divider { height:1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); margin: 4px 0; }
  .label { color: rgba(255,255,255,0.45); font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px; }
`;

export default function Glassmorphism() {
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [activeTag, setActiveTag] = useState("Design");
  const [progress] = useState(68);
  const [liked, setLiked] = useState(false);

  return (
    <>
    
      <div className="scene">

        {/* Blobs — these sit BEHIND everything, making glass glow */}
        <div className="blob blob-pink" />
        <div className="blob blob-blue" />
        <div className="blob blob-teal" />

        {/* The main card */}
        <div className="glass" style={{ width: 360, padding: 28, display: "flex", flexDirection: "column", gap: 22 }}>

          {/* Header */}
          <div>
            <p className="label">Profile Card</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Avatar — a glass circle */}
                <div className="glass glass-lighter" style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                  🧑‍🎨
                </div>
                <div>
                  <p style={{ color: "white", fontWeight: 600, fontSize: 16 }}>Alex Rivera</p>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>UI Designer</p>
                </div>
              </div>
              {/* Like button */}
              <button
                className="btn"
                style={{ padding: "8px 12px", fontSize: 18, color: liked ? "#f48fb1" : "rgba(255,255,255,0.6)" }}
                onClick={() => setLiked(!liked)}
              >
                {liked ? "❤️" : "🤍"}
              </button>
            </div>
          </div>

          <div className="divider" />

          {/* Tags */}
          <div>
            <p className="label">Skills</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Design", "React", "Figma", "CSS"].map(t => (
                <span key={t} className={`tag ${activeTag === t ? "on" : ""}`} onClick={() => setActiveTag(t)}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Input */}
          <div>
            <p className="label">Message</p>
            <input className="glass-input" placeholder="Say something..." />
          </div>

          {/* Progress */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <p className="label" style={{ margin: 0 }}>Project Progress</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{progress}%</p>
            </div>
            <div className="track">
              <div className="fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Toggles */}
          <div>
            <p className="label">Settings</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Notifications", val: toggle1, set: setToggle1 },
                { label: "Dark Mode",     val: toggle2, set: setToggle2 },
              ].map(({ label, val, set }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>{label}</span>
                  <div className={`toggle-wrap ${val ? "on" : ""}`} onClick={() => set(!val)}>
                    <div className="toggle-knob" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="divider" />

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" style={{ flex: 1 }}>Cancel</button>
            <button className="btn btn-accent" style={{ flex: 1 }}>Save Profile</button>
          </div>

        </div>

        {/* 📌 The Glass Recipe — floating label */}
        <div className="glass glass-darker" style={{
          position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
          padding: "10px 20px", display: "flex", gap: 20, whiteSpace: "nowrap"
        }}>
          {[
            { code: "rgba(255,255,255, 0.10)", label: "① transparent bg" },
            { code: "backdrop-filter: blur(18px)", label: "② frosted blur" },
            { code: "border: 1px solid rgba(255,255,255,0.20)", label: "③ soft rim" },
          ].map(({ code, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <p style={{ color: "#2979ff", fontSize: 11, fontFamily: "monospace" }}>{code}</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>{label}</p>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}