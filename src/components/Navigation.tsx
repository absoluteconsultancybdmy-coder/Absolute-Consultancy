import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const navLinks = [
  { label: 'Courses', href: '/courses' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Pathways', href: '#destinations' },
  { label: 'Recruit', href: '#recruitment' },
  { label: 'Why Malaysia?', href: '/journey' },
  { label: 'Stories', href: '#testimonials' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 80);
    };
    const handleScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (href: string): boolean => {
    if (href.startsWith('/')) {
      return location.pathname === href || location.pathname.startsWith(href + '/');
    }
    if (location.pathname !== '/') return false;
    const currentHash = location.hash || '#hero';
    return currentHash === href;
  };

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      if (href.startsWith('/')) {
        navigate(href);
        window.scrollTo({ top: 0, behavior: 'auto' });
        return;
      }
      if (location.pathname !== '/') {
        if (href !== '#hero') {
          sessionStorage.setItem('scrollToSection', href.replace('#', ''));
        }
        navigate('/');
        if (href === '#hero') {
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 200);
        }
        return;
      }
      if (href === '#hero') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      // Target is lazy-mounted and not in the DOM yet.
      // Progressively scroll down to trigger its IntersectionObserver,
      // then smooth-scroll to the target.
      const tryMountThenScroll = (attempt: number) => {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        } else if (attempt < 40) {
          window.scrollBy({ top: 500, behavior: 'auto' });
          setTimeout(() => tryMountThenScroll(attempt + 1), 150);
        }
      };
      tryMountThenScroll(0);
    }, 300);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-mist/95' : 'bg-transparent'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 lg:px-10 h-20">
          {/* Logo */}
          <button
            onClick={() => scrollTo('#hero')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img src={`${import.meta.env.BASE_URL}images/logo.webp`} alt="Absolute Consultancy Firm" width={40} height={40} className="h-10 w-auto" decoding="async" />
            <span className="small-caps text-kimono hidden sm:inline tracking-wider" style={{ fontSize: '12px' }}>
              ABSOLUTE CONSULTANCY
            </span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`nav-link small-caps cursor-pointer bg-transparent transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-gold underline underline-offset-[6px] decoration-1'
                    : 'text-kimono/75 hover:text-kimono'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop right side */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => scrollTo('/portal/login')}
              className="nav-link small-caps cursor-pointer bg-transparent text-kimono/75 transition-colors duration-200 hover:text-kimono"
            >
              Sign In
            </button>
            <button
              onClick={() => scrollTo('#contact')}
              className="pill-button pill-button-outline text-[11px] py-3 px-6"
            >
              Free Consultation
            </button>
            {/* Social mini-icons */}
            <div className="flex items-center gap-2 ml-1">
              {[
                { href: 'https://wa.me/60175631621', label: 'WhatsApp', icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z' },
                { href: 'https://www.instagram.com/absolute_consultancy?igsh=NHYyaDRqM2FpdWZh&utm_source=qr', label: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                { href: 'https://www.facebook.com/share/18bRc7r8cA/?mibextid=wwXIfr', label: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              ].map(({ href, icon, label }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-7 h-7 flex items-center justify-center border border-gold/40 rounded-full text-gold hover:text-mist hover:bg-gold transition-all duration-200">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={icon}/></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col gap-[5px] p-2 cursor-pointer"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
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
        className="fixed inset-0 z-50 lg:hidden flex flex-col justify-center items-center"
        style={{
          background: 'rgba(2, 22, 53,0.97)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
          transition: 'opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Gold hairline top */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'rgb(var(--color-gold) / 0.3)' }} />

        <nav className="flex flex-col items-center gap-8">
          {navLinks.map((link, i) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`font-display font-bold cursor-pointer bg-transparent uppercase transition-colors duration-200 ${
                isActive(link.href)
                  ? 'text-gold underline underline-offset-8 decoration-2'
                  : 'text-kimono/80 hover:text-gold'
              }`}
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
          className="pill-button pill-button-outline mt-12"
          style={{
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 400ms 360ms, transform 400ms 360ms cubic-bezier(0.16,1,0.3,1), background-color 300ms, color 300ms, border-color 300ms',
          }}
        >
          Free Consultation
        </button>

        <button
          onClick={() => scrollTo('/portal/login')}
          className="mt-5 font-body text-sm uppercase tracking-wider text-kimono/70 transition-colors hover:text-gold"
          style={{
            opacity: menuOpen ? 1 : 0,
            transition: 'opacity 400ms 400ms, color 200ms',
          }}
        >
          Student &amp; Agent Sign In
        </button>

        {/* Social links row */}
        <div className="mt-8 flex gap-5" style={{
          opacity: menuOpen ? 1 : 0,
          transition: 'opacity 400ms 420ms',
        }}>
          {[
            { href: 'https://wa.me/60175631621', label: 'WhatsApp' },
            { href: 'https://www.instagram.com/absolute_consultancy?igsh=NHYyaDRqM2FpdWZh&utm_source=qr', label: 'Instagram' },
            { href: 'https://www.facebook.com/share/18bRc7r8cA/?mibextid=wwXIfr', label: 'Facebook' },
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

        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'rgb(var(--color-gold) / 0.3)' }} />
      </div>
    </>
  );
}
