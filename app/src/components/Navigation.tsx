import { useState, useEffect } from 'react';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Pathways', href: '#destinations' },
  { label: 'Stories', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      if (href === '#hero') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-mist/85 backdrop-blur-xl' : 'bg-transparent'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 lg:px-10 h-20">
          {/* Logo */}
          <button
            onClick={() => scrollTo('#hero')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img src="/Absolute-Consultancy/images/logo.png" alt="Absolute Consultancy Firm" className="h-10 w-auto" />
            <span className="small-caps text-kimono hidden sm:inline tracking-wider" style={{ fontSize: '12px' }}>
              ABSOLUTE CONSULTANCY
            </span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="nav-link small-caps text-kimono/75 hover:text-kimono cursor-pointer bg-transparent transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop right side */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => scrollTo('#contact')}
              className="pill-button pill-button-outline text-[11px] py-3 px-6"
            >
              Free Consultation
            </button>
            {/* Social mini-icons */}
            <div className="flex items-center gap-2 ml-1">
              {[
                { href: 'https://wa.me/601756316210', icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' },
                { href: 'https://facebook.com/AbsoluteConsultancyFirm', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              ].map(({ href, icon }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-7 h-7 flex items-center justify-center border border-gold/40 rounded-full text-gold hover:text-mist hover:bg-gold transition-all duration-200">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d={icon}/></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col gap-[5px] p-2 cursor-pointer"
            aria-label="Toggle menu"
          >
            <span
              className="block w-6 h-px bg-kimono transition-all duration-300 origin-center"
              style={{
                transform: menuOpen ? 'rotate(45deg) translateY(3px)' : 'none',
              }}
            />
            <span
              className="block w-6 h-px bg-kimono transition-all duration-300"
              style={{ opacity: menuOpen ? 0 : 1, transform: menuOpen ? 'scaleX(0)' : 'scaleX(1)' }}
            />
            <span
              className="block w-6 h-px bg-kimono transition-all duration-300 origin-center"
              style={{
                transform: menuOpen ? 'rotate(-45deg) translateY(-3px)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay menu */}
      <div
        className="fixed inset-0 z-40 lg:hidden flex flex-col justify-center items-center"
        style={{
          background: 'rgba(10,10,10,0.97)',
          backdropFilter: 'blur(24px)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
          transition: 'opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Gold hairline top */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'rgba(201,162,52,0.3)' }} />

        <nav className="flex flex-col items-center gap-8">
          {navLinks.map((link, i) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="font-display font-bold text-kimono/80 hover:text-gold cursor-pointer bg-transparent uppercase transition-colors duration-200"
              style={{
                fontSize: 'clamp(28px, 8vw, 48px)',
                letterSpacing: '0.08em',
                transitionDelay: menuOpen ? `${i * 60}ms` : '0ms',
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: menuOpen ? 1 : 0,
                transition: `opacity 400ms ${i * 60}ms, transform 400ms ${i * 60}ms cubic-bezier(0.16,1,0.3,1), color 200ms`,
              }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Mobile CTA */}
        <button
          onClick={() => scrollTo('#contact')}
          className="mt-12 px-10 py-4 rounded-full font-body text-sm uppercase tracking-widest"
          style={{
            border: '1px solid rgba(201,162,52,0.6)',
            color: '#C9A234',
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 400ms 360ms, transform 400ms 360ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          Free Consultation
        </button>

        {/* Social links row */}
        <div className="mt-8 flex gap-5" style={{
          opacity: menuOpen ? 1 : 0,
          transition: 'opacity 400ms 420ms',
        }}>
          {[
            { href: 'https://wa.me/601756316210', label: 'WhatsApp' },
            { href: 'https://facebook.com/AbsoluteConsultancyFirm', label: 'Facebook' },
            { href: 'https://youtube.com/@absoluteconsultancy', label: 'YouTube' },
          ].map(({ href, label }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              className="small-caps text-mouse hover:text-gold transition-colors duration-200"
              style={{ fontSize: '10px' }}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'rgba(201,162,52,0.3)' }} />
      </div>
    </>
  );
}
