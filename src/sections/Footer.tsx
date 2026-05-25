const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Pathways', href: '#destinations' },
  { label: 'Stories', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  {
    label: 'WhatsApp',
    href: 'https://wa.me/60175631621',
    icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@absoluteconsultancy',
    icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/AbsoluteConsultancyFirm',
    icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
];

export default function Footer() {
  const scrollTo = (href: string) => {
    if (href === '#hero') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full bg-mist pt-16 pb-10">
      {/* Top gold hairline */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'rgba(201,162,52,0.3)' }} />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Left — Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/Absolute-Consultancy/images/logo.png" alt="Absolute Consultancy Firm" className="h-12 w-auto" />
            </div>
            <p className="small-caps text-mouse mb-4" style={{ fontSize: '11px', lineHeight: 1.7 }}>
              Malaysia<br />
              Est. 2024 · Registered Education Consultancy
            </p>
            <p className="font-serif font-light text-mouse/60" style={{ fontSize: '13px', lineHeight: 1.6 }}>
              Helping elite students from Malaysia<br />
              and Bangladesh reach the world's<br />
              finest universities since 2024.
            </p>
          </div>

          {/* Center — Nav */}
          <div className="flex flex-col items-start md:items-center">
            <p className="small-caps text-gold/60 mb-6" style={{ fontSize: '10px' }}>Navigate</p>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="nav-link small-caps text-kimono/60 hover:text-kimono cursor-pointer bg-transparent text-left transition-colors duration-200"
                  style={{ fontSize: '11px' }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right — Social + contact */}
          <div className="flex flex-col items-start md:items-end">
            <p className="small-caps text-gold/60 mb-6" style={{ fontSize: '10px' }}>Connect</p>
            <div className="flex flex-col gap-3">
              {socialLinks.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon flex items-center gap-3 group"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d={icon} />
                  </svg>
                  <span className="small-caps text-mouse group-hover:text-kimono transition-colors duration-200" style={{ fontSize: '11px' }}>
                    {label}
                  </span>
                </a>
              ))}
              <a
                href="tel:+60175631621"
                className="small-caps text-mouse hover:text-gold transition-colors duration-200 flex items-center gap-3 mt-2"
                style={{ fontSize: '11px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.89 9.37 19.79 19.79 0 01.82 .74 2 2 0 012.81 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l.96-.96a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
                +60 17-563 1621
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="text-mouse/50 font-body" style={{ fontSize: '11px' }}>
            &copy; {new Date().getFullYear()} Absolute Consultancy Firm. All Rights Reserved.
          </p>
          <p className="text-mouse/35 font-body italic" style={{ fontSize: '11px' }}>
            Designed for students who dare to dream further.
          </p>
        </div>
      </div>
    </footer>
  );
}
