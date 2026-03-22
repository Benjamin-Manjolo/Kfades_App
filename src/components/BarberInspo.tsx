import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

interface StyleEntry {
  user: string;
  caption: string;
  date: string;
  styleName: string;
  description: string;
  price: number;
  duration: number;
  popular?: boolean;
}

const styleData: StyleEntry[] = [
  {
    user: 'theo_cuts_mw',
    caption: 'Clean fade, sharp lines. This is what we live for 🔥',
    date: new Date().toDateString(),
    styleName: 'Clean Fade',
    description: 'Sharp skin fade with crisp lines — the signature Kfades look.',
    price: 3000,
    duration: 35,
    popular: true,
  },
  {
    user: 'theo_cuts_mw',
    caption: 'Low cut with a crisp lineup — nothing beats a fresh cut 💈',
    date: new Date().toDateString(),
    styleName: 'Low Cut & Lineup',
    description: 'Classic low cut finished with a razor-sharp lineup.',
    price: 2500,
    duration: 30,
    popular: true,
  },
  {
    user: 'theo_cuts_mw',
    caption: 'Bald fade done right. Come get yours today 😎',
    date: new Date().toDateString(),
    styleName: 'Bald Fade',
    description: 'Full bald fade blended to perfection — zero to smooth.',
    price: 3500,
    duration: 40,
    popular: true,
  },
  {
    user: 'theo_cuts_mw',
    caption: 'Taper fade with a beard trim — the full package ✂️',
    date: new Date().toDateString(),
    styleName: 'Taper Fade + Beard',
    description: 'Taper fade paired with a sculpted beard trim. The full package.',
    price: 4500,
    duration: 50,
    popular: true,
  },
  {
    user: 'theo_cuts_mw',
    caption: 'Before the prices change lets do it with passion 😊😊',
    date: new Date().toDateString(),
    styleName: 'Signature Cut',
    description: 'Custom cut tailored to your head shape and style preference.',
    price: 3000,
    duration: 35,
  },
  {
    user: 'theo_cuts_mw',
    caption: 'Mid fade looking immaculate. Book your slot now 🙌',
    date: new Date().toDateString(),
    styleName: 'Mid Fade',
    description: 'Mid-length fade for a clean, balanced look on all hair types.',
    price: 3000,
    duration: 35,
  },
  {
    user: 'theo_cuts_mw',
    caption: 'Fresh cut = fresh confidence. Walk in, walk out a king 👑',
    date: new Date().toDateString(),
    styleName: 'Classic Haircut',
    description: 'Timeless haircut with clippers and scissors — always clean.',
    price: 2500,
    duration: 30,
  },
  {
    user: 'theo_cuts_mw',
    caption: 'Skin fade with waves — crafted with precision 🌊',
    date: new Date().toDateString(),
    styleName: 'Skin Fade + Waves',
    description: 'Skin fade styled with deep waves. Precision barbering at its best.',
    price: 4000,
    duration: 45,
  },
  {
    user: 'theo_cuts_mw',
    caption: 'The beard game is strong here 💪✂️',
    date: new Date().toDateString(),
    styleName: 'Beard Shape-Up',
    description: 'Full beard sculpt and trim — defined edges, clean neck.',
    price: 1500,
    duration: 20,
  },
  {
    user: 'theo_cuts_mw',
    caption: 'Drop fade, no cap. Every cut tells a story 📖',
    date: new Date().toDateString(),
    styleName: 'Drop Fade',
    description: 'Drop fade that follows the ear curve — smooth and stylish.',
    price: 3500,
    duration: 40,
  },
  {
    user: 'theo_cuts_mw',
    caption: 'Classic cut, timeless style. See you in the chair 💈',
    date: new Date().toDateString(),
    styleName: 'Scissor Cut',
    description: 'Full scissor cut for a natural, textured finish.',
    price: 2500,
    duration: 30,
  },
  {
    user: 'theo_cuts_mw',
    caption: 'High top fade — bold choices for bold people 🔝',
    date: new Date().toDateString(),
    styleName: 'High Top Fade',
    description: 'Bold high top silhouette with a tight fade underneath.',
    price: 4000,
    duration: 45,
  },
  {
    user: 'theo_cuts_mw',
    caption: 'Another satisfied client leaving with a smile 😁',
    date: new Date().toDateString(),
    styleName: 'Taper Cut',
    description: 'Neat taper that gradually blends — perfect everyday look.',
    price: 2800,
    duration: 30,
  },
  {
    user: 'theo_cuts_mw',
    caption: 'Precision is everything. Every line matters ✨',
    date: new Date().toDateString(),
    styleName: 'Line-Up & Edge',
    description: 'Razor-precise lineup and edge detailing for a sharp finish.',
    price: 1500,
    duration: 20,
  },
];

const BarberInspo: React.FC = () => {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const images = [
    '1.png', '2.png', '3.png', '4.png', '5.png', '6.png',
    '7.png', '8.png', '9.png', '10.png', '11.png', '12.png',
    '13.png', '14.png',
  ];

  const current = previewIndex !== null ? styleData[previewIndex] : null;

  const handleBookStyle = (entry: StyleEntry) => {
    const service = {
      id: `inspo_${entry.styleName.toLowerCase().replace(/\s+/g, '_')}`,
      name: entry.styleName,
      description: entry.description,
      price: entry.price,
      duration: entry.duration,
      image: previewIndex !== null ? `/Barber-Inspo/${images[previewIndex!]}` : '',
      popular: entry.popular ?? false,
    };
    localStorage.setItem('selectedService', JSON.stringify(service));
    navigate('/calendar');
  };

  return (
    <>
      <div
        className="min-h-screen overflow-hidden"
        style={{
          backgroundImage: "url('/bgimage.png')",
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          position: 'relative',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginTop: 0,
          padding: 0,
          boxSizing: 'border-box',
        }}
      >
        <NavBar />

        <div className="font-semibold text-xl w-full bg-white fixed top-0 left-0 z-50 p-3">
          Haircut Inspirations
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '3px',
            marginTop: '60px',
            justifyItems: 'center',
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => setPreviewIndex(index)}
              style={{
                width: '100%',
                maxWidth: '140px',
                aspectRatio: '3/4',
                overflow: 'hidden',
                borderRadius: '4px',
                background: '#f0f0f0',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <img
                src={`/Barber-Inspo/${image}`}
                alt={styleData[index]?.styleName ?? `Haircut ${index + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {styleData[index]?.popular && (
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    background: 'black',
                    color: 'white',
                    fontSize: '9px',
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: '999px',
                  }}
                >
                  Popular
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Preview Modal ── */}
      {previewIndex !== null && current && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            width: '100vw', height: '100vh',
            zIndex: 50,
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {/* Top bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              position: 'sticky',
              top: 0,
              background: '#fff',
              zIndex: 10,
            }}
          >
            <button
              onClick={() => setPreviewIndex(null)}
              style={{ background: 'none', border: 'none', color: 'black', fontSize: '22px', cursor: 'pointer' }}
            >
              ←
            </button>
            <span style={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: '15px' }}>
              {current.styleName}
            </span>
            {current.popular && (
              <span
                style={{
                  background: 'black', color: 'white',
                  fontSize: '10px', fontWeight: 600,
                  padding: '3px 10px', borderRadius: '999px',
                }}
              >
                Popular
              </span>
            )}
          </div>

          {/* Image */}
          <img
            src={`/Barber-Inspo/${images[previewIndex]}`}
            alt={current.styleName}
            style={{ width: '100%', maxHeight: '55vh', objectFit: 'cover' }}
          />

          {/* Style Info */}
          <div style={{ padding: '16px' }}>

            {/* Name + price */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'black', margin: 0 }}>
                {current.styleName}
              </h2>
              <span style={{ fontSize: '16px', fontWeight: 700, color: 'black' }}>
                MWK {current.price.toLocaleString()}
              </span>
            </div>

            {/* Duration */}
            <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.45)', marginBottom: '8px' }}>
              ⏱ {current.duration} min session
            </p>

            {/* Description */}
            <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.7)', lineHeight: '1.6', marginBottom: '12px' }}>
              {current.description}
            </p>

            <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', margin: '12px 0' }} />

            {/* Caption */}
            <p style={{ marginBottom: '4px', fontSize: '13px' }}>
              <span style={{ fontWeight: 700 }}>{current.user} </span>
              <span style={{ color: 'rgba(0,0,0,0.6)' }}>{current.caption}</span>
            </p>
            <p style={{ fontSize: '11px', color: 'rgba(0,0,0,0.35)', marginBottom: '24px' }}>
              {current.date}
            </p>

            {/* Book Button */}
            <button
              onClick={() => handleBookStyle(current)}
              style={{
                width: '100%',
                padding: '14px',
                background: 'black',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                letterSpacing: '0.02em',
              }}
            >
              Book This Style →
            </button>

            <p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(0,0,0,0.35)', marginTop: '10px' }}>
              MWK {current.price.toLocaleString()} · {current.duration} min · Pay on arrival or online
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default BarberInspo;