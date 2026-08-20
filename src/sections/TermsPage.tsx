import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Section {
  title: string;
  body: string[];
}

const SECTIONS: Section[] = [
  {
    title: 'Introduction',
    body: [
      'These Terms of Service ("terms") govern your use of Absolute Consultancy Firm\'s ("we", "us", "our") advisory services and our website. By contacting us, booking a consultation, or using our services to apply to a Malaysian university, you agree to these terms.',
      'We are an independent education advisory service. We are not a university, an immigration authority, or a government body. Admission and visa decisions are made entirely by the respective institutions and authorities, and our role is to support, advise, and guide you through that process.',
      'Please read these terms carefully. If anything is unclear, contact us at info@absolutefirm.com before engaging our services.',
    ],
  },
  {
    title: 'Our Services',
    body: [
      'We provide education advisory and application support for students applying to Malaysian universities. Our core services include a free initial consultation to understand your goals and assess your options, university shortlisting and matching based on your academic background, preferences, and budget, support preparing and submitting your application documents, and assistance with EMGS (Education Malaysia Global Services) student visa processing.',
      'Once you have been admitted, we provide pre-departure guidance — including information about arrival, accommodation, banking, and life in Malaysia — and we offer a limited period of post-arrival support to help you settle in.',
      'We do not guarantee admission to any specific university, programme, or intake, and we do not guarantee approval of any student visa application. Admission decisions are made by universities, and visa decisions are made by EMGS and the Malaysian Immigration Department. What we do guarantee is that we will support your application with reasonable skill, care, and diligence.',
    ],
  },
  {
    title: 'Your Obligations',
    body: [
      'Provide accurate information. You agree to provide accurate, complete, and truthful information about yourself, your academic history, your test scores, and your goals. Submitting false or misleading information — including forged or altered documents — can result in visa refusal, cancellation of admission, or termination of our services, and may carry serious consequences under Malaysian law.',
      'Submit genuine documents. All academic transcripts, certificates, and test reports you submit through us must be genuine. Where a document needs to be attested or verified, we will let you know.',
      'Stay in touch. We need to be able to reach you throughout your application. Please respond to our messages promptly, keep your contact details up to date, and inform us immediately of any change in your circumstances — for example, a change in your family situation, finances, or study plans.',
      'Pay third-party fees directly. Any application fees, tuition deposits, EMGS processing fees, or visa fees are paid by you directly to the issuing institution. We will never collect these on their behalf unless explicitly agreed in writing.',
    ],
  },
  {
    title: 'Fees and Payments',
    body: [
      'Our consultation and advisory services are free for students. We do not charge a fee for the advice we provide, the documents we prepare, or the visa support we offer.',
      'We do not charge application fees on behalf of universities. If a university charges an application fee, you will pay that fee directly to the university through their own payment channels.',
      'EMGS processing fees, medical examination fees, security bond fees, and any other official charges are paid by you directly to EMGS, the relevant medical centre, or the relevant authority. We will guide you through these payments, but we do not collect them ourselves.',
      'We do not have hidden fees. If we ever offer a paid service in the future — for example, a premium add-on — the cost and scope will be clearly explained and agreed in writing before any work begins.',
    ],
  },
  {
    title: 'Refunds and Cancellations',
    body: [
      'Because our advisory services are free, there are no service fees to refund. If you change your mind about studying in Malaysia, you can stop using our services at any time — simply let us know in writing.',
      'University application fees, EMGS processing fees, visa fees, medical examination fees, and any other fees paid to third-party institutions are non-refundable through us. Refund policies for those fees are set by the institutions themselves, and we will help you understand the relevant policy where it is unclear.',
      'If you withdraw from our service mid-application, we will, on request, return any original documents we hold on your behalf (such as original transcripts or certificates) through a tracked delivery method at your cost.',
    ],
  },
  {
    title: 'Intellectual Property',
    body: [
      'All content on our website — including text, graphics, logos, photographs, guides, and downloadable resources — is owned by Absolute Consultancy Firm or our licensors and is protected by copyright and other applicable laws.',
      'You may use our resources for personal, non-commercial purposes. For example, you are welcome to read our guides, share links to our articles, and download a checklist to help you prepare your own application.',
      'You may not reproduce, publish, distribute, modify, or sell our content for commercial purposes without our written permission. If you would like to use something you have seen on our site in a way that is not covered above, please email us at info@absolutefirm.com.',
    ],
  },
  {
    title: 'Limitation of Liability',
    body: [
      'We provide our advisory services with reasonable skill, care, and diligence. We will not, however, be liable for any decision made by a university, EMGS, the Malaysian Immigration Department, or any other third party — including decisions to refuse admission, refuse a visa, delay processing, or revoke a previously granted approval.',
      'To the maximum extent permitted by law, we are not liable for any indirect, consequential, incidental, or special damages arising out of or in connection with our services — including, but not limited to, loss of opportunity, loss of income, or emotional distress.',
      'Because our advisory services are provided free of charge, where liability cannot be excluded by law, our total liability for any claim connected to your application is limited to the value of the fees (if any) that you have paid to us in the twelve months before the claim arose.',
    ],
  },
  {
    title: 'Third-Party Services',
    body: [
      'In the course of supporting your application and relocation, we may refer you to third-party services — for example, banks that offer student accounts, accommodation providers, travel agents, or medical centres approved for student visa examinations.',
      'We select these providers carefully, but once you choose to use a third-party service, your relationship is with that provider, and their own terms, pricing, and policies apply. We are not responsible for the acts or omissions of any third-party provider, and we do not guarantee the quality, availability, or outcome of their services.',
      'Any links to third-party websites on our site are provided for your convenience. We do not control those sites and are not responsible for their content or practices.',
    ],
  },
  {
    title: 'Governing Law',
    body: [
      'These terms are governed by the laws of Malaysia. Any dispute, claim, or controversy arising out of or in connection with these terms — including any question about their existence or validity — will be resolved in the courts of Malaysia, unless mandatory consumer protection law in your country of residence gives you the right to bring a claim in that country.',
      'Nothing in this section limits your rights as a consumer under the laws that apply to you.',
    ],
  },
  {
    title: 'Changes to These Terms',
    body: [
      'We may update these terms from time to time to reflect changes in our services, our practices, or applicable law. The most current version will always be available on this page, with the "Last updated" date at the top.',
      'If we make a significant change, we will make reasonable efforts to notify you by email or by posting a clear notice on our website. Your continued use of our services after the updated terms take effect constitutes your acceptance of the changes.',
    ],
  },
  {
    title: 'Contact Us',
    body: [
      'If you have any questions about these terms or about our services, please reach out to us. We are happy to clarify anything before you commit to working with us.',
      'Absolute Consultancy Firm — Email: info@absolutefirm.com — Phone: +60 17-563 1621 — Address: Cyberjaya, Selangor, Malaysia.',
    ],
  },
];

export default function TermsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#021635' }}>
      <div
        className="sticky top-0 z-50"
        style={{ background: 'rgba(11,26,51,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgb(var(--color-gold) / 0.15)' }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-3 flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-gold/70 hover:text-gold transition-colors cursor-pointer font-body text-xs uppercase tracking-wider px-2 py-1.5 rounded-lg hover:bg-cream/5"
            aria-label="Back to home"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back
          </button>
          <div className="w-px h-4 mx-1" style={{ background: 'rgb(var(--color-gold) / 0.2)' }} aria-hidden="true" />
          <span
            className="font-body text-xs uppercase tracking-wider px-2 py-1.5 rounded-lg whitespace-nowrap"
            style={{ background: 'rgb(var(--color-gold) / 0.1)', border: '1px solid rgb(var(--color-gold) / 0.3)', color: 'var(--color-gold)' }}
            aria-current="page"
          >
            Terms
          </span>
        </div>
      </div>

      <section
        className="relative w-full"
        style={{ padding: 'clamp(56px, 8vw, 96px) 0 clamp(24px, 4vw, 40px)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgb(var(--color-gold) / 0.10) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 max-w-[820px] mx-auto px-6 lg:px-10">
          <p
            className="font-body uppercase tracking-[0.4em] text-gold/70 mb-4"
            style={{ fontSize: '11px' }}
          >
            Legal
          </p>
          <h1
            className="font-display font-bold text-kimono leading-[0.95] mb-6"
            style={{ fontSize: 'clamp(36px, 6vw, 72px)', letterSpacing: '0.02em' }}
          >
            Terms of <span className="text-gold">Service</span>
          </h1>
          <p
            className="font-serif font-light text-cream/60"
            style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            Last updated · 6 June 2026
          </p>
        </div>
      </section>

      <section className="relative w-full pb-24">
        <div className="max-w-[820px] mx-auto px-6 lg:px-10">
          <div
            className="rounded-2xl p-8 lg:p-10 mb-8"
            style={{
              background: 'linear-gradient(135deg, rgba(11,30,66,0.7) 0%, rgba(11,42,92,0.55) 100%)',
              border: '1px solid rgb(var(--color-gold) / 0.2)',
            }}
          >
            <p
              className="font-body uppercase tracking-[0.28em] text-gold/70 mb-3"
              style={{ fontSize: '10px' }}
            >
              Framework · Not legal advice
            </p>
            <p
              className="font-serif font-light text-cream/75"
              style={{ fontSize: '17px', lineHeight: 1.7 }}
            >
              These terms reflect our actual service practices. They are not legal advice. Last updated: 6 June 2026.
            </p>
          </div>

          <div className="space-y-10">
            {SECTIONS.map((section, i) => (
              <article key={section.title}>
                <div className="flex items-baseline gap-4 mb-3">
                  <span
                    className="font-body text-gold/60"
                    style={{ fontSize: '12px', letterSpacing: '0.18em' }}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <h2
                      className="font-display font-bold text-kimono"
                      style={{ fontSize: 'clamp(22px, 2.6vw, 30px)', letterSpacing: '0.02em', lineHeight: 1.15 }}
                    >
                      {section.title}
                    </h2>
                    <div className="mt-3 h-px" style={{ background: 'linear-gradient(90deg, rgb(var(--color-gold) / 0.5) 0%, transparent 100%)' }} />
                  </div>
                </div>
                <div className="space-y-3 pl-0 sm:pl-10">
                  {section.body.map((para, j) => (
                    <p
                      key={j}
                      className="font-serif font-light text-cream/70"
                      style={{ fontSize: '15.5px', lineHeight: 1.75 }}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div
            className="mt-14 p-6 lg:p-8 rounded-2xl"
            style={{
              background: 'rgb(var(--color-gold) / 0.06)',
              border: '1px solid rgb(var(--color-gold) / 0.18)',
            }}
          >
            <p
              className="font-body uppercase tracking-[0.28em] text-gold/70 mb-2"
              style={{ fontSize: '10px' }}
            >
              Framework
            </p>
            <p
              className="font-serif font-light text-cream/65"
              style={{ fontSize: '14px', lineHeight: 1.7 }}
            >
              These terms of service are a starting framework that reflects how Absolute Consultancy Firm actually operates today. They are not a substitute for legal advice and should be reviewed and tailored to your specific operations by a qualified legal professional before being published as the final version.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
