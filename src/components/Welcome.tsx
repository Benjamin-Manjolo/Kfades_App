
import { useNavigate } from 'react-router-dom';


const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const images = [
      '1.png','2.png', '3.png', '4.png', '5.png',
    '6.png', '7.png', '8.png', '9.png', '10.png','11.png','12.png', '13.png', '14.png', 
  ];

  const leftImages = images.filter((_, i) => i % 2 === 0);
  const rightImages = images.filter((_, i) => i % 2 !== 0);

  const handleGetStarted = () => {
    navigate('/services');
  };

  return (
    <>
 
      
      <div
        className="welcome-root bg-white min-h-screen overflow-hidden relative"
        
      >
         
      

        {/* ── Scrolling columns background ── */}
        <div
          className="columns-reveal absolute inset-0 opacity-0"
          style={{
            perspective: '1000px',
            perspectiveOrigin: '50% 38%',
            zIndex: 0,
          }}
        >
          <div
            style={{
              transform: 'rotateX(22deg)',
              transformStyle: 'preserve-3d',
              display: 'flex',
              gap: '10px',
              height: '130%',
              marginTop: '-5%',
              padding: '0 6px',
            }}
          >
            {/* LEFT — scrolls down */}
            <div
              className="scroll-col"
              style={{
                flex: 1,
                overflow: 'hidden',
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 78%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 78%, transparent 100%)',
              }}
            >
              <div className="animate-scroll-down flex flex-col gap-2">
                {[...leftImages, ...leftImages].map((image, index) => (
                  <div key={index} style={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <img
                      src={`/Barber-Inspo/${image}`}
                      alt={`cut-${index}`}
                      style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — scrolls up */}
            <div
              className="scroll-col"
              style={{
                flex: 1,
                overflow: 'hidden',
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 78%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 78%, transparent 100%)',
              }}
            >
              <div className="animate-scroll-up flex flex-col gap-2">
                {[...rightImages, ...rightImages].map((image, index) => (
                  <div key={index} style={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <img
                      src={`/Barber-Inspo/${image}`}
                      alt={`cut-${index}`}
                      style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dark overlay over columns */}
          <div className="" />
        </div>

        {/* ── Hero content ── */}
        <div
          className="fixed bottom-0  flex flex-col items-center rounded-xl justify-center min-h-[20%] bg-white/10 backdrop-blur-sm px-6 text-center"
          style={{ zIndex: 2, paddingTop: '80px', paddingBottom: '0px' }}
        >

          {/* Eyebrow */}
          <div className="hero-eyebrow flex items-center gap-2 mb-5 opacity-0">
            <div className="divider-line" style={{ width: '24px' }} />
            <span style={{ fontSize: '11px', letterSpacing: '0.18em', color: 'black', fontWeight: 500, textTransform: 'uppercase' }}>
              The Barber's Business Partner
            </span>
            <div className="divider-line" style={{ width: '24px' }} />
          </div>

        

          {/* Sub */}
          <p
            className="hero-sub opacity-0 mb-8"
            style={{
              fontSize: '14px',
              lineHeight: '1.75',
              color: 'rgba(0, 0, 0, 0.55)',
          
              fontWeight: 300,
            }}
          >
            Leading provider of online booking barbershop, salons
            and flexible services — all in one place.
          </p>

          {/* CTA */}
          <div className="hero-cta opacity-0 mb-8">
            <button className="bg-black p-3 rounded-2xl text-white" onClick={handleGetStarted}>
              Get Started →
            </button>
          </div>

         

          {/* Stats row */}
          <div
            className="hero-pills opacity-0 flex gap-3 w-full"
            style={{ maxWidth: '340px', animationDelay: '0.85s' }}
          >
            <div className="stat-card">
              <p style={{ fontSize: '22px', fontWeight: 700, color: 'black', fontFamily: 'Playfair Display, serif', margin: 0 }}>10k+</p>
              <p style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.45)', margin: '3px 0 0', letterSpacing: '0.05em' }}>Clients</p>
            </div>
            <div className="stat-card">
              <p style={{ fontSize: '22px', fontWeight: 700, color: 'black', fontFamily: 'Playfair Display, serif', margin: 0 }}>99.9%</p>
              <p style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.45)', margin: '3px 0 0', letterSpacing: '0.05em' }}>Uptime</p>
            </div>
            <div className="stat-card">
              <p style={{ fontSize: '22px', fontWeight: 700, color: 'black', fontFamily: 'Playfair Display, serif', margin: 0 }}>24/7</p>
              <p style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.45)', margin: '3px 0 0', letterSpacing: '0.05em' }}>Support</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Welcome;