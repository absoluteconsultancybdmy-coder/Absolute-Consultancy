import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const destinations = ['UiTM', 'MMU', 'UCSI University', 'APU', 'Sunway University', "Taylor's University", 'HELP University', 'INTI University', 'University of Cyberjaya', 'SEGi University', 'Limkokwing', 'Other'];

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formPanelRef = useRef<HTMLDivElement>(null);
  const cooCardRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', destination: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(formPanelRef.current, { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', toggleActions: 'play none none none' } }
      );
      gsap.fromTo(cooCardRef.current, { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.8, delay: 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', toggleActions: 'play none none none' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // WhatsApp redirect with form data
    const msg = `Hi, I'm ${formData.name}. I'm interested in ${formData.destination}. ${formData.message}`;
    window.open(`https://wa.me/601756316210?text=${encodeURIComponent(msg)}`, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section ref={sectionRef} className="relative w-full py-32 lg:py-40 overflow-hidden" id="contact">
      <div className="absolute inset-0 z-0">
        <img src="/Absolute-Consultancy/images/contact-bg.jpg" alt="Campus" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.45) 50%, rgba(10,10,10,0.75) 100%)' }} />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left — Form */}
          <div ref={formPanelRef} className="glass-panel p-10 lg:p-12 max-w-[480px]" style={{ opacity: 0 }}>
            <h2 className="font-serif font-light text-kimono mb-3" style={{ fontSize: 'clamp(28px, 4vw, 36px)' }}>
              Ready to study in Malaysia?
            </h2>
            <p className="small-caps text-mouse mb-10">
              Leave your details — our COO will personally reach out within 24 hours.
            </p>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(37,211,102,0.2)' }}>
                  <svg className="w-8 h-8" style={{ color: '#25D366' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-kimono font-body text-lg">Opening WhatsApp for you!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <input type="text" placeholder="Full Name" className="form-input-underline"
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div>
                  <input type="tel" placeholder="WhatsApp Number (e.g. +880 or +60)"
                    className="form-input-underline" value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                </div>
                <div>
                  <select className="form-input-underline cursor-pointer appearance-none bg-transparent"
                    value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} required>
                    <option value="" disabled className="bg-mist text-mouse">Preferred University</option>
                    {destinations.map((dest) => (
                      <option key={dest} value={dest} className="bg-mist text-kimono">{dest}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <textarea placeholder="Tell us about your academic background and goals"
                    rows={4} className="form-input-underline resize-none"
                    value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                </div>
                <button type="submit" className="pill-button pill-button-primary w-full mt-4">
                  Send via WhatsApp
                </button>
              </form>
            )}
          </div>

          {/* Right — COO Contact Card */}
          <div ref={cooCardRef} className="max-w-[360px] lg:ml-auto" style={{ opacity: 0 }}>
            {/* COO photo card */}
            <div className="rounded-2xl overflow-hidden mb-6" style={{ border: '1px solid rgba(201,162,52,0.2)' }}>
              <div className="h-[280px] overflow-hidden">
                <img src="/Absolute-Consultancy/images/coo-photo2.png" alt="COO"
                  className="w-full h-full object-cover object-top" />
              </div>
              <div className="p-6" style={{ background: 'rgba(11,30,66,0.95)', backdropFilter: 'blur(16px)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#25D366' }} />
                  <span className="small-caps text-mouse" style={{ fontSize: '10px' }}>Available Now</span>
                </div>
                <h3 className="font-serif font-light text-kimono mb-1" style={{ fontSize: '18px' }}>
                  Speak to our COO
                </h3>
                <p className="font-body text-gold text-sm">Chief Operating Officer</p>
                <p className="small-caps text-mouse mt-2" style={{ fontSize: '10px' }}>
                  Certified Education Counsellor · 10+ Years Experience
                </p>
              </div>
            </div>

            {/* Contact buttons */}
            <div className="space-y-3">
              <a href="https://wa.me/601756316210" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-4 rounded-2xl text-white text-sm font-body transition-all duration-300 hover:scale-[1.02]"
                style={{ backgroundColor: '#25D366' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <div>
                  <p className="font-semibold">WhatsApp COO</p>
                  <p className="text-white/70 text-xs">+60 17-563 1621</p>
                </div>
              </a>

              <a href="https://www.facebook.com/share/1YXW4n6zKN/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-4 rounded-2xl text-white text-sm font-body transition-all duration-300 hover:scale-[1.02]"
                style={{ backgroundColor: '#1877F2' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <div>
                  <p className="font-semibold">Facebook</p>
                  <p className="text-white/70 text-xs">Absolute Consultancy Firm</p>
                </div>
              </a>

              <a href="https://youtube.com/@absoluteconsultancy" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-4 rounded-2xl text-white text-sm font-body transition-all duration-300 hover:scale-[1.02]"
                style={{ backgroundColor: '#FF0000' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <div>
                  <p className="font-semibold">YouTube</p>
                  <p className="text-white/70 text-xs">@absoluteconsultancy</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
