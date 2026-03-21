import React, { useState } from 'react';
import NavBar from './NavBar';

const descriptions = [
  { user: 'theo_cuts_mw', caption: 'Clean fade, sharp lines. This is what we live for 🔥', date: new Date().toDateString() },
  { user: 'theo_cuts_mw', caption: 'Low cut with a crisp lineup — nothing beats a fresh cut 💈',date: new Date().toDateString() },
  { user: 'theo_cuts_mw', caption: 'Bald fade done right. Come get yours today 😎', date: new Date().toDateString() },
  { user: 'theo_cuts_mw', caption: 'Taper fade with a beard trim — the full package ✂️', date: new Date().toDateString() },
  { user: 'theo_cuts_mw', caption: 'Before the prices change lets do it with passion 😊😊', date: new Date().toDateString() },
  { user: 'theo_cuts_mw', caption: 'Mid fade looking immaculate. Book your slot now 🙌', date: new Date().toDateString() },
  { user: 'theo_cuts_mw', caption: 'Fresh cut = fresh confidence. Walk in, walk out a king 👑', date: new Date().toDateString() },
  { user: 'theo_cuts_mw', caption: 'Skin fade with waves — crafted with precision 🌊',date: new Date().toDateString() },
  { user: 'theo_cuts_mw', caption: 'The beard game is strong here 💪✂️', date: new Date().toDateString() },
  { user: 'theo_cuts_mw', caption: 'Drop fade, no cap. Every cut tells a story 📖', date: new Date().toDateString() },
  { user: 'theo_cuts_mw', caption: 'Classic cut, timeless style. See you in the chair 💈', date: new Date().toDateString() },
  { user: 'theo_cuts_mw', caption: 'High top fade — bold choices for bold people 🔝', date: new Date().toDateString() },
  { user: 'theo_cuts_mw', caption: 'Another satisfied client leaving with a smile 😁', date: new Date().toDateString() },
  { user: 'theo_cuts_mw', caption: 'Precision is everything. Every line matters ✨', date: new Date().toDateString() },
];

const BarberInspo: React.FC = () => {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const images = [
    '1.png','2.png','3.png','4.png','5.png','6.png',
    '7.png','8.png','9.png','10.png','11.png','12.png',
    '13.png','14.png',
  ];

  const current = previewIndex !== null ? descriptions[previewIndex] : null;

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

        <div className='font-semibold text-xl w-full bg-white fixed top-0 left-0 z-50 p-3'>
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
              }}
            >
              <img
                src={`/Barber-Inspo/${image}`}
                alt={`Haircut ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewIndex !== null && current && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
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
            }}
          >
            <button
              onClick={() => setPreviewIndex(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'black',
                fontSize: '22px',
                cursor: 'pointer',
              }}
            >
              ←
            </button>

            <span
              style={{
                flex: 1,
                textAlign: 'center',
                fontWeight: 600,
              }}
            >
              CUT
            </span>
          </div>

          {/* Image */}
          <img
            src={`/Barber-Inspo/${images[previewIndex]}`}
            alt="Preview"
            style={{
              width: '100%',
              maxHeight: '70vh',
              objectFit: 'cover',
            }}
          />

          {/* Caption */}
          <div style={{ padding: '16px' }}>
            <p style={{ marginBottom: '6px', fontSize: '14px' }}>
              <span style={{ fontWeight: 700 }}>
                {current.user}{' '}
              </span>
              <span style={{ color: 'rgba(0,0,0,0.75)' }}>
                {current.caption}
              </span>
            </p>

            <p style={{ fontSize: '11px', color: 'rgba(0,0,0,0.4)' }}>
              {current.date}
            </p>

            <button
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '14px',
                background: 'black',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Book This Style →
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BarberInspo;