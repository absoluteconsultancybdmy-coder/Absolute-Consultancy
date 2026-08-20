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
      'Absolute Consultancy Firm ("we", "us", "our") is a Malaysia-based education consultancy that helps Bangladeshi students gain admission to Malaysian universities and navigate the student visa process. We are headquartered in Cyberjaya, Selangor, and we operate a local support team in Bangladesh to assist students before they travel.',
      'This Privacy Policy explains what personal information we collect, why we collect it, how we share it, and what choices you have over your data. By using our website, contacting us, or engaging our advisory services, you confirm that you have read and understood this policy.',
      'We have written this policy in plain language because we believe you should not need a lawyer to understand how your information is handled. If anything is unclear, please reach out to us using the contact details at the bottom of this page.',
    ],
  },
  {
    title: 'Information We Collect',
    body: [
      'Information you provide to us. When you contact us, book a consultation, or apply through us to a partner university, we collect the information you choose to share. This typically includes your full name, email address, phone number, WhatsApp number, nationality, date of birth, passport details, academic background (schools, grades, transcripts), English language test scores, your study preferences (course, level, location, budget), and any other information you choose to provide in messages or forms.',
      'Information we collect automatically. When you visit our website, we may automatically receive basic technical information such as your IP address, browser type, device type, the pages you visit, and the time of your visit. This is used in aggregate to understand how visitors use our site and to keep it working properly.',
      'Information from third parties. Where relevant to your application, we may receive information about you from third parties — for example, confirmation of admission from a partner university, or visa processing updates from EMGS (Education Malaysia Global Services). We treat this information with the same care as information you provide directly.',
    ],
  },
  {
    title: 'How We Use Your Information',
    body: [
      'We use your personal information to provide and improve our advisory services. This includes matching you with Malaysian universities whose programs fit your academic background and goals, preparing and submitting your application documents, supporting your student visa application through EMGS, and keeping you informed about the status of your application at every step.',
      'We also use your contact details to communicate with you about your case — for example, to ask follow-up questions, share updates, request additional documents, or arrange calls with our team. If you have opted in, we may occasionally send you guides, resources, and event invitations that are directly relevant to students applying to study in Malaysia.',
      'We do not sell your personal data to anyone. We do not share it with marketers, advertisers, or data brokers, and we do not use it for any purpose that is unrelated to the services you have asked us to provide.',
    ],
  },
  {
    title: 'Data Sharing',
    body: [
      'Universities. We share your application materials — including your academic transcripts, personal statement, and supporting documents — with the Malaysian universities you choose to apply to. We share only the information that is reasonably required for an admission decision, and we do not share your file with a university you have not selected.',
      'Visa and immigration authorities. To process your Malaysian student visa, we share your documents and personal details with EMGS (Education Malaysia Global Services) and, where required, with the Malaysian Immigration Department. These authorities have their own privacy practices, which govern how they handle your information once it has been submitted.',
      'Service providers. We use a small number of trusted third-party tools to deliver our services — for example, WhatsApp Business for messaging, an email provider for communications, and a cloud storage provider for documents. These providers are contractually obligated to protect your data and to use it only for the services they provide to us.',
      'We do not share your data with marketers, advertisers, social media platforms, or any other unrelated third parties. We will never sell, rent, or trade your personal information.',
    ],
  },
  {
    title: 'Cookies and Tracking',
    body: [
      'We use a minimal set of cookies on this website. This includes a small cookie that remembers your cookie consent preference and, where strictly necessary, basic session data that keeps the site working properly. These cookies do not track you across other websites.',
      'We do not use third-party advertising cookies, and we do not allow third-party advertising networks to set cookies on our site. We may use a privacy-respecting analytics tool to understand which pages are most useful to visitors; if we do, that tool is configured so that no personal data — and no data that identifies you individually — is shared with us or with any third party.',
      'You can clear cookies or block them through your browser settings at any time. Blocking essential cookies may affect how the site functions, but it will not prevent you from contacting us by email or phone.',
    ],
  },
  {
    title: 'Your Rights',
    body: [
      'Access. You can ask us for a copy of the personal information we hold about you. We will provide this in a commonly used format within a reasonable timeframe.',
      'Correction. If any of the information we hold about you is inaccurate or out of date, you can ask us to correct it. In many cases, the fastest way to do this is simply to send us the correct details by email.',
      'Deletion. You can ask us to permanently delete your personal data. We will do so unless we are legally required to retain certain records — for example, financial records for accounting purposes, or records that an immigration authority requires us to keep on file.',
      'Opt-out of marketing. If you no longer wish to receive our guides, resources, or event invitations, you can unsubscribe at any time using the link at the bottom of any email we send, or by contacting us directly.',
      'To exercise any of these rights, please email us at info@absolutefirm.com. We may need to verify your identity before acting on a request, to make sure we are not disclosing your data to anyone who is not you.',
    ],
  },
  {
    title: 'Data Security',
    body: [
      'We take the security of your personal information seriously. Our website uses HTTPS encryption to protect data in transit, and documents we hold on your behalf are stored on secure cloud infrastructure with encryption at rest.',
      'Access to your personal data is limited to members of our team who need it to support your application. All team members are bound by confidentiality obligations and are trained on responsible data handling.',
      'We retain your data for as long as we are actively supporting your case, and for a reasonable period afterwards to comply with our legal, accounting, and record-keeping obligations. Once that period has passed, your data is securely deleted from our active systems. We may retain anonymised, aggregated statistics that cannot identify you.',
    ],
  },
  {
    title: 'International Data Transfers',
    body: [
      'Your personal information is primarily stored on secure systems in Malaysia. Because we work closely with students in Bangladesh, some of your data may also be accessed by our local team in Bangladesh for the purpose of preparing and supporting your application.',
      'When we transfer personal data between Malaysia and Bangladesh, we do so using safeguards designed to ensure an adequate level of protection — including encryption in transit, access controls, and contractual obligations on the receiving team.',
      'If you are located in another country and choose to use our services, you understand that your information may be transferred to, stored in, and processed in Malaysia and/or Bangladesh. We will take reasonable steps to ensure your data is treated securely and in line with this policy wherever it is processed.',
    ],
  },
  {
    title: "Children's Privacy",
    body: [
      'Our services are intended for students who are at least 16 years old. Some of the students we support are minors, particularly those applying for pre-university or foundation programs. Where a student is under 18, we require the consent of a parent or legal guardian before collecting or processing their personal information.',
      'We do not knowingly collect personal data from children under the age of 16 without verifiable parental consent. If you believe we have collected information from a child under 16 without proper consent, please contact us at info@absolutefirm.com and we will delete the information promptly.',
    ],
  },
  {
    title: 'Changes to This Policy',
    body: [
      'We may update this Privacy Policy from time to time to reflect changes in our practices, the services we offer, or applicable law. The most current version will always be available on this page, with the "Last updated" date shown at the top.',
      'If we make a significant change — for example, a change to the types of data we collect or how we share it — we will make reasonable efforts to notify you by email (if we have your address) or by posting a clear notice on our website before the change takes effect.',
    ],
  },
  {
    title: 'Contact Us',
    body: [
      'If you have any questions about this Privacy Policy, or if you would like to exercise any of the rights described above, please contact us using the details below. We aim to respond to all privacy-related enquiries within a reasonable timeframe.',
      'Absolute Consultancy Firm — Email: info@absolutefirm.com — Phone: +60 17-563 1621 — Address: Cyberjaya, Selangor, Malaysia.',
    ],
  },
];

export default function PrivacyPage() {
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
            Privacy
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
            Privacy <span className="text-gold">Policy</span>
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
              This is a privacy framework that reflects our actual practices. It is not a substitute for legal advice. Last updated: 6 June 2026.
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
              This policy is a starting framework that reflects how Absolute Consultancy Firm actually handles personal information today. It is not a substitute for legal advice and should be reviewed and tailored to your specific operations by a qualified legal professional before being published as the final version.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
