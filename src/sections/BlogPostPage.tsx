import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

type Category = 'GUIDE' | 'NEWS' | 'STUDENT STORY';

interface BlogPostMeta {
  slug: string;
  category: Category;
  cover: string;
  date: string;
  title: string;
  excerpt: string;
  author: string;
  authorIsTeam: boolean;
  authorPhoto: string | null;
  authorRole: string;
  authorBio: string;
  authorCredentials: string;
  readTime: string;
}

interface BlogCard {
  slug: string;
  category: Category;
  cover: string;
  date: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
}

const TOP_NAV: ReadonlyArray<{ label: string; id: string }> = [
  { label: 'About', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Pathways', id: 'destinations' },
  { label: 'Stories', id: 'testimonials' },
  { label: 'Resources', id: 'resources' },
  { label: 'Contact', id: 'contact' },
];

const POSTS: ReadonlyArray<BlogPostMeta> = [
  {
    slug: 'visa-guide-2026',
    category: 'GUIDE',
    cover: `${import.meta.env.BASE_URL}images/Ginting_Highland.jpg`,
    date: '18 May 2026',
    title: '2026 Malaysia Student Visa Guide for Bangladeshi Applicants',
    excerpt:
      'Step-by-step breakdown of the EMGS application process, document requirements, processing times, and how to avoid the most common rejection reasons.',
    author: 'Kazi Mahir Muhtasib',
    authorIsTeam: false,
    authorPhoto: `${import.meta.env.BASE_URL}images/coo-profile.png`,
    authorRole: 'Chief Operating Officer',
    authorBio:
      'Mahir founded Absolute Consultancy Firm after experiencing the Malaysian education system firsthand. A graduate of Multimedia University (MMU), he has personally guided 200+ students through their journey from Bangladesh to Malaysia.',
    authorCredentials: 'MMU Alumnus · 6+ years in education consulting',
    readTime: '8 min read',
  },
  {
    slug: 'malaysia-qs-2026',
    category: 'NEWS',
    cover: `${import.meta.env.BASE_URL}images/services-section.jpg`,
    date: '04 May 2026',
    title: 'Malaysia Rises to #12 in QS Best Student Cities 2026',
    excerpt:
      'Kuala Lumpur continues its climb in global rankings, with affordable living, world-class universities, and a thriving international community.',
    author: 'The Absolute Team',
    authorIsTeam: true,
    authorPhoto: null,
    authorRole: 'Editorial Desk',
    authorBio:
      'Our editorial team covers Malaysian higher education, Bangladeshi student mobility, and the policies that shape the journey from Dhaka to KL. We work with our counsellors and partner universities to bring you the most useful, accurate news.',
    authorCredentials: 'Absolute Consultancy Firm · Editorial',
    readTime: '5 min read',
  },
  {
    slug: 'nusrat-taylors-story',
    category: 'STUDENT STORY',
    cover: `${import.meta.env.BASE_URL}images/hero-graduate.png`,
    date: '21 Apr 2026',
    title: "From Dhaka to Taylor's: How Nusrat Built Her Dream Career",
    excerpt:
      'A first-person account of the application journey, arriving in Malaysia, finding community, and landing a marketing internship at a top KL firm within six months.',
    author: 'Kazi Mahir Muhtasib',
    authorIsTeam: false,
    authorPhoto: `${import.meta.env.BASE_URL}images/coo-profile.png`,
    authorRole: 'Chief Operating Officer',
    authorBio:
      'Mahir founded Absolute Consultancy Firm after experiencing the Malaysian education system firsthand. A graduate of Multimedia University (MMU), he has personally guided 200+ students through their journey from Bangladesh to Malaysia.',
    authorCredentials: 'MMU Alumnus · 6+ years in education consulting',
    readTime: '7 min read',
  },
];

const POSTS_BY_SLUG: Readonly<Record<string, BlogPostMeta>> = Object.freeze(
  POSTS.reduce<Record<string, BlogPostMeta>>((acc, post) => {
    acc[post.slug] = post;
    return acc;
  }, {})
);

function PostVisaGuide() {
  return (
    <>
      <section className="blog-prose">
        <p className="font-serif text-cream/75 text-[18px] lg:text-[19px] leading-[1.85] mb-7">
          Every year, hundreds of Bangladeshi students get accepted into Malaysian universities — and then
          lose weeks, sometimes months, because of the visa process. The Malaysian student visa is the
          single biggest reason students delay their intake, miss orientation, or quietly drop out before
          they ever board a plane. This guide walks you through the entire EMGS process the way our
          counsellors walk every Absolute student through it: step by step, document by document, with the
          mistakes to avoid written plainly.
        </p>
      </section>

      <h2 className="blog-h2">The EMGS process in 5 stages</h2>
      <p className="blog-p">
        EMGS — the Education Malaysia Global Services — is the single government body that processes
        every international student visa for Malaysia. Whether you are heading to a public university, a
        private institution, or a branch campus, the same five-stage flow applies.
      </p>
      <ol className="blog-ol">
        <li><strong>Offer letter.</strong> You apply to a Malaysian university, receive a conditional or unconditional offer, and accept it. Pay the required deposit to confirm your seat.</li>
        <li><strong>VAL — Visa Approval Letter.</strong> The university submits your documents to EMGS on your behalf. EMGS reviews your file and, if approved, issues a Visa Approval Letter (VAL). This is the document that lets you travel.</li>
        <li><strong>SEV — Single Entry Visa.</strong> For most Bangladeshi applicants, EMGS will issue a Single Entry Visa (SEV) stamp into your passport. You collect this from the nearest Malaysian High Commission — usually in Dhaka.</li>
        <li><strong>Arrival &amp; endorsement.</strong> You fly to Malaysia, clear immigration, and complete your post-arrival medical screening. Your university submits your passport for student pass endorsement.</li>
        <li><strong>Student Pass.</strong> Your passport is returned with the student pass sticker, valid for the duration of your programme. You are now officially a Malaysian student.</li>
      </ol>

      <h2 className="blog-h2">Document checklist</h2>
      <p className="blog-p">
        Most of the documents below are common to every Bangladeshi applicant. Your university may ask
        for one or two extras, but if you have these ready, you will not be the student holding up the
        intake.
      </p>
      <ul className="blog-ul">
        <li><strong>Passport</strong> — valid for at least 18 months, with at least 4 blank pages.</li>
        <li><strong>Academic transcripts &amp; certificates</strong> — SSC, HSC, and any higher qualifications. O-level/A-level equivalents if applicable.</li>
        <li><strong>English proficiency</strong> — IELTS / TOEFL / MUET, depending on the programme's requirement.</li>
        <li><strong>Financial proof</strong> — recent bank statement or fixed deposit certificate showing the funds your programme requires.</li>
        <li><strong>Passport photos</strong> — blue background, in the size specified by your university.</li>
        <li><strong>Medical report</strong> — the EMGS-approved medical form, completed by a panel clinic in Bangladesh.</li>
        <li><strong>Sponsorship letter</strong> — from a parent or guardian, declaring who is funding your studies.</li>
        <li><strong>Personal statement / SOP</strong> — explaining your programme choice and your post-graduation plans.</li>
      </ul>

      <h2 className="blog-h2">Processing times</h2>
      <p className="blog-p">
        A clean file typically takes <strong>four to eight weeks</strong> from university submission to
        VAL. During the peak intake months (June to September for the September/October intake, and
        November to January for the February/March intake), processing can stretch longer. The fastest
        way to keep your application out of the queue is to submit a complete, error-free file the
        first time.
      </p>

      <h2 className="blog-h2">Common rejection reasons — and how to avoid them</h2>
      <p className="blog-p">
        In our experience, more than 90% of visa refusals fall into one of five buckets. None of them
        are about the student being "not good enough" — they are about the file not telling a coherent
        story.
      </p>
      <ul className="blog-ul">
        <li><strong>A weak or generic SOP.</strong> EMGS officers read these. If your statement is copied from a template, or does not connect your background to your chosen programme, the file raises questions. Be specific about why Malaysia, why this university, why this programme, and what you plan to do after.</li>
        <li><strong>Insufficient or unexplained funds.</strong> The bank balance is one piece. The officer also wants to see a believable income source and a clear link to the sponsor. A large sudden deposit without context is a red flag.</li>
        <li><strong>Programme mismatch.</strong> If your previous studies are in commerce but you are applying to an engineering programme, expect questions. Bridging modules or a foundation year solves this — applying directly does not.</li>
        <li><strong>Prior refusals.</strong> A previous refusal from another country is not fatal, but it must be addressed honestly in your file. Hiding it is worse.</li>
        <li><strong>Weak home ties.</strong> The officer is trying to assess whether you will return home after your studies. Family, property, a job offer back in Bangladesh, or a clear business succession plan all help.</li>
      </ul>

      <div className="blog-callout">
        <p className="blog-callout-eyebrow">A note from our visa desk</p>
        <p className="blog-callout-body">
          The single most common reason Bangladeshi students get stuck is not a bad profile — it is a
          messy file. Re-uploads, wrong photo sizes, and bank statements that do not match the sponsor
          letter can each add two to three weeks.
        </p>
      </div>

      <h2 className="blog-h2">What to do if your visa is rejected</h2>
      <p className="blog-p">
        A rejection is not the end of the road. You will receive a written reason, and most refusals
        can be addressed with additional documentation, a stronger SOP, or a re-application in the
        next intake. The worst thing to do is to keep applying to different programmes with the same
        weak file. The second worst is to approach a new agent who promises a "guaranteed visa" — that
        is not how EMGS works. Work with someone who will tell you honestly what to fix.
      </p>

      <h2 className="blog-h2">A practical 12-week timeline</h2>
      <p className="blog-p">
        Assuming a September intake, this is the rhythm we recommend. Adjust the dates backwards for
        a February intake.
      </p>
      <ul className="blog-ul">
        <li><strong>Weeks 1–4:</strong> Finalise your university shortlist, take the English test if needed, gather transcripts.</li>
        <li><strong>Weeks 5–6:</strong> Submit applications, receive and accept your offer letter, pay the deposit.</li>
        <li><strong>Weeks 7–8:</strong> Complete your medical, prepare financial documents, draft your SOP with a counsellor.</li>
        <li><strong>Weeks 9–10:</strong> University submits your file to EMGS. Monitor your EMGS tracker daily.</li>
        <li><strong>Weeks 11–12:</strong> Receive VAL, collect your SEV from the Malaysian High Commission, book your flight.</li>
      </ul>

      <h2 className="blog-h2">How Absolute Consultancy Firm helps</h2>
      <p className="blog-p">
        We handle the entire EMGS submission for you. That means we prepare your document pack,
        review every file before upload, chase your university on follow-ups, and keep you updated
        through the tracker. Our visa team — led by a former EMGS officer — has processed 500+ student
        visas with a 99% approval rate. If you would like us to take over your file, the first step is
        a free 20-minute consultation.
      </p>
    </>
  );
}

function PostMalaysiaQS() {
  return (
    <>
      <section className="blog-prose">
        <p className="font-serif text-cream/75 text-[18px] lg:text-[19px] leading-[1.85] mb-7">
          Kuala Lumpur has moved up again. In the most recent QS Best Student Cities ranking, Malaysia's
          capital has climbed into the global top 15, cementing its position as Southeast Asia's most
          underrated study destination. For Bangladeshi students weighing where to spend the next three
          or four years, the new ranking is more than a headline — it is a signal that the
          affordability-versus-quality calculation has shifted decisively in Malaysia's favour.
        </p>
      </section>

      <h2 className="blog-h2">What the new ranking means</h2>
      <p className="blog-p">
        QS Best Student Cities ranks cities on a blend of factors: university quality, employer
        reputation, affordability, student mix, desirability, and safety. Kuala Lumpur's rise reflects
        a city that is getting measurably better at every one of those criteria at once. It is not the
        result of a single initiative — it is the cumulative effect of years of investment in
        universities, public transport, and student services.
      </p>

      <h2 className="blog-h2">Why this matters for Bangladeshi students specifically</h2>
      <p className="blog-p">
        The "Big Four" destinations — the United Kingdom, the United States, Australia, and Canada —
        have all, in their own way, become harder for Bangladeshi students in the last three years.
        Visa rules have tightened and total cost of attendance has climbed sharply. Malaysia offers
        a recognised degree, taught in English, in a time zone close to Bangladesh, at a fraction of
        the cost, with clear routes to world-class campuses.
      </p>

      <h2 className="blog-h2">The factors driving Malaysia's rise</h2>
      <p className="blog-p">
        Four factors in particular stand out in QS's methodology.
      </p>
      <ul className="blog-ul">
        <li><strong>Affordability.</strong> Tuition at most Malaysian private universities is in the range of RM 25,000 to RM 60,000 per year for a full degree — roughly one-fifth to one-eighth of comparable UK or Australian programmes. Living costs in KL are similarly accessible, especially when set against London, Sydney, or Toronto.</li>
        <li><strong>English-medium programmes.</strong> The vast majority of international programmes at Malaysian private universities are taught entirely in English. Bangladeshi students who have studied in the English-medium system adjust quickly.</li>
        <li><strong>Multicultural environment.</strong> Malaysia is home to large Indian, Chinese, and Malay communities alongside tens of thousands of international students. For a Bangladeshi student, the cultural proximity is meaningful — halal food is universal, the dress code is comfortable, and there is a sizeable South Asian student community on most major campuses.</li>
        <li><strong>Safety and infrastructure.</strong> KL is regularly rated one of the safest major capitals in Asia. Public transport is modern, English is widely spoken, and the cost of a data plan, a meal out, or a Grab ride is genuinely student-friendly.</li>
      </ul>

      <h2 className="blog-h2">Malaysian universities in the global top</h2>
      <p className="blog-p">
        The ranking momentum is being driven by strong performance at the university level too. Four
        Malaysian universities are consistently placed in the QS World University Rankings, with the
        University of Malaya leading the pack and Universiti Putra Malaysia, Universiti Sains Malaysia,
        and Universiti Kebangsaan Malaysia close behind. On the private side, institutions such as
        Taylor's University, Sunway University, and Monash University Malaysia continue to climb
        regional subject rankings in business, hospitality, engineering, and the health sciences.
      </p>

      <div className="blog-callout">
        <p className="blog-callout-eyebrow">The takeaway</p>
        <p className="blog-callout-body">
          A QS-ranked degree from a Malaysian private university is, in employer perception, a
          different product than it was five years ago. It is now closer to a regional top-tier
          degree than a budget alternative.
        </p>
      </div>

      <h2 className="blog-h2">The "displacement effect"</h2>
      <p className="blog-p">
        International education analysts have started using a specific term for what is happening:
        the "displacement effect." As the UK, US, Australia, and Canada become harder, students who
        would historically have gone to those countries are turning to alternatives — Germany,
        Ireland, the UAE, and most visibly, Malaysia. Malaysian international enrolment has grown
        steadily through this period, and a meaningful slice of that growth is from South Asia.
      </p>

      <h2 className="blog-h2">What Bangladeshi students should take away</h2>
      <p className="blog-p">
        A higher ranking is not, by itself, a reason to choose Malaysia. But the structural factors
        behind the ranking — affordability, English-medium programmes, multicultural environment, and
        employer recognition — are the same factors that determine whether your degree will actually
        pay off. Malaysia is no longer the "second choice" destination. For a growing number of
        Bangladeshi students, it is the first choice on its own merits.
      </p>
    </>
  );
}

function PostNusratStory() {
  return (
    <>
      <section className="blog-prose">
        <p className="font-serif text-cream/75 text-[18px] lg:text-[19px] leading-[1.85] mb-7">
          My name is Nusrat Jahan, and this is the story of how I went from being a confused HSC
          graduate in Dhaka to working in marketing in Kuala Lumpur. I am writing it the way I would
          have wanted to read it a year ago — plainly, with the bits I wish someone had told me.
        </p>
      </section>

      <h2 className="blog-h2">Background: where I started</h2>
      <p className="blog-p">
        I completed my HSC in Dhaka in 2024 with good grades but no clear plan. My parents wanted me
        to go to a public university in Bangladesh, but I knew the admission competition that year
        was going to be brutal, and I was not confident. Some of my cousins had studied in Malaysia
        and come back with strong degrees and good jobs. I started thinking about it seriously.
      </p>

      <h2 className="blog-h2">How I found Absolute Consultancy Firm</h2>
      <p className="blog-p">
        I first heard about Absolute from a friend's older sister who had been placed at Monash
        Malaysia through them. I had also seen their Facebook page — it looked professional, the
        content was actually about Malaysian universities (not just generic "study abroad" stuff), and
        they had a real office in Dhaka. I walked in for a consultation on a Tuesday afternoon. I
        met Kazi Mahir, who had himself graduated from MMU. That detail mattered to me — he had
        walked the same path he was now guiding me on.
      </p>

      <h2 className="blog-h2">The application journey</h2>
      <p className="blog-p">
        I knew I wanted to do business, but I did not know which university was the right fit. Mahir
        and the team sat with me and talked through three options in detail. We eventually settled on
        Taylor's University for the Bachelor of Business Administration, mostly because of the
        internship structure and the campus environment. I applied in late March, got a conditional
        offer in April, and submitted my final documents by May.
      </p>

      <h2 className="blog-h2">The visa process</h2>
      <p className="blog-p">
        This was the part I was most nervous about, and the part where Absolute earned their fee.
        Their visa team — Rifat, in particular — went through my file line by line. Two things
        surprised me: first, the level of detail in the EMGS submission (every page, every
        translation, every sponsor declaration); second, the speed. From university submission to
        my VAL, it took just over five weeks. I collected my SEV from the Malaysian High Commission
        in Dhaka, and I had a flight booked within the week.
      </p>

      <div className="blog-callout">
        <p className="blog-callout-eyebrow">What I wish I had known</p>
        <p className="blog-callout-body">
          The visa process is mostly about file quality, not luck. If your documents are clean, the
          timeline is predictable. If they are not, it can drag for months.
        </p>
      </div>

      <h2 className="blog-h2">Arriving in Kuala Lumpur</h2>
      <p className="blog-p">
        I flew into KLIA in the early evening. Nadia from the Absolute team was at the airport with a
        name board. She helped me get a SIM card, took me to my accommodation at Taylor's, and made
        sure I was settled before she left. That first night felt overwhelming in a way I had not
        expected — even small things like which bus to take or how to top up a Touch'nGo card. Having
        a familiar face in the airport made a real difference.
      </p>

      <h2 className="blog-h2">My first months</h2>
      <p className="blog-p">
        Taylor's campus in Subang Jaya is a small city of its own — students from 80+ countries,
        lecture halls, libraries, and enough halal food options to keep me very happy. I made friends
        quickly, partly because there is a sizeable Bangladeshi community on campus. Classes were
        harder than I expected, but in a good way — case studies, group projects, presentations. By
        the second month I had a part-time job at a café near campus, mostly to practice English with
        customers.
      </p>

      <h2 className="blog-h2">Landing the internship</h2>
      <p className="blog-p">
        Around month four, I started applying for internships through Taylor's career portal. I sent
        out maybe thirty applications. Most did not reply. Two gave me interview slots. I got an
        offer from a mid-sized marketing agency in KL city centre, and I started in month six — a
        six-month internship in digital marketing, working on social campaigns for regional brands.
        The internship was paid, the team was young, and I learned more in those six months than I
        had in two years of class.
      </p>

      <h2 className="blog-h2">Lessons learned</h2>
      <p className="blog-p">
        A few things I would tell any Bangladeshi student thinking about Malaysia.
      </p>
      <ul className="blog-ul">
        <li>Choose your university for the right reasons. Ranking is one input, but the internship structure, the campus environment, and the alumni network matter more for your first job.</li>
        <li>Treat the visa process as a project, not an event. Start early, document everything, and ask your counsellor to review your file twice before submission.</li>
        <li>The first month is the hardest. Plan to feel homesick. Plan to feel overwhelmed. Plan to figure it out anyway.</li>
        <li>Get a part-time job early. It does not have to be glamorous. The English practice and the network matter more than the pay cheque.</li>
      </ul>

      <h2 className="blog-h2">Where I am now</h2>
      <p className="blog-p">
        I am writing this a year after arriving in KL. I am in the final year of my degree, working
        part-time at the same marketing agency (they offered me a continued role once my internship
        ended), and starting to think seriously about where I want to be after graduation. I have not
        ruled out going back to Dhaka. I have also not ruled out staying. For the first time in my
        life, I feel like the decision is actually mine.
      </p>
    </>
  );
}

function renderPostBody(slug: string) {
  switch (slug) {
    case 'visa-guide-2026':
      return <PostVisaGuide />;
    case 'malaysia-qs-2026':
      return <PostMalaysiaQS />;
    case 'nusrat-taylors-story':
      return <PostNusratStory />;
    default:
      return null;
  }
}

function RelatedCard({ post, onOpen }: { post: BlogPostMeta; onOpen: (slug: string) => void }) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(post.slug)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(post.slug);
        }
      }}
      className="related-card group rounded-2xl overflow-hidden cursor-pointer flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
      style={{
        background: 'rgb(var(--color-gold) / 0.03)',
        border: '1px solid rgb(var(--color-gold) / 0.07)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        opacity: 0,
        transition: 'transform 250ms ease, border-color 300ms ease, background 300ms ease, box-shadow 300ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgb(var(--color-gold) / 0.45)';
        e.currentTarget.style.background = 'rgb(var(--color-gold) / 0.05)';
        e.currentTarget.style.boxShadow = '0 18px 40px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgb(var(--color-gold) / 0.07)';
        e.currentTarget.style.background = 'rgb(var(--color-gold) / 0.03)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
        <img
          src={post.cover}
          alt=""
          width={800}
          height={500}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          onError={(e) => {
            e.currentTarget.style.opacity = '0.15';
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(2, 22, 53,0.25) 0%, rgba(2, 22, 53,0) 35%, rgba(2, 22, 53,0.55) 100%)',
          }}
        />
        <div className="absolute top-3 left-3">
          <span
            className="px-2.5 py-1 rounded-full text-[9px] font-body uppercase"
            style={{
              background: 'rgb(var(--color-gold))',
              color: 'rgb(var(--color-mist))',
              fontWeight: 700,
              letterSpacing: '0.18em',
            }}
          >
            {post.category}
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-6">
        <h3
          className="font-display font-bold text-kimono mb-3"
          style={{
            fontSize: 'clamp(17px, 1.6vw, 20px)',
            letterSpacing: '0.01em',
            lineHeight: 1.25,
          }}
        >
          {post.title}
        </h3>
        <p
          className="font-serif font-light text-cream/60 mb-5"
          style={{
            fontSize: '14px',
            lineHeight: 1.65,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.excerpt}
        </p>
        <div className="mt-auto pt-4 flex items-center justify-between" style={{ borderTop: '1px solid rgb(var(--color-gold) / 0.06)' }}>
          <span className="font-body text-cream/60" style={{ fontSize: '11px' }}>
            {post.date} · {post.readTime}
          </span>
          <span
            className="inline-flex items-center gap-1.5 font-body text-gold transition-all duration-300 group-hover:gap-2.5"
            style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }}
          >
            Read
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const post = slug ? POSTS_BY_SLUG[slug] : undefined;
  const relatedPosts: BlogPostMeta[] = POSTS.filter((p) => p.slug !== slug);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Absolute Consultancy Firm`;
    } else {
      document.title = 'Article Not Found | Absolute Consultancy Firm';
    }
    return () => {
      document.title = 'Absolute Consultancy Firm | Study Abroad Consultants — Malaysia & Bangladesh';
    };
  }, [post]);

  useEffect(() => {
    if (prefersReducedMotion) {
      if (heroRef.current) {
        heroRef.current.querySelectorAll<HTMLElement>('[data-anim]').forEach((el) => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      }
      if (bodyRef.current) {
        bodyRef.current.querySelectorAll<HTMLElement>('.blog-h2, .blog-prose, .blog-p, .blog-ul, .blog-ol, .blog-callout').forEach((el) => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      }
      if (relatedRef.current) {
        relatedRef.current.querySelectorAll<HTMLElement>('.related-card, [data-anim]').forEach((el) => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      }
      return;
    }

    const ctx = gsap.context(() => {
      if (heroRef.current) {
        const els = heroRef.current.querySelectorAll<HTMLElement>('[data-anim]');
        if (els.length) {
          gsap.fromTo(
            els,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out' }
          );
        }
      }

      if (bodyRef.current) {
        const bodyEls = bodyRef.current.querySelectorAll<HTMLElement>(
          '.blog-h2, .blog-prose, .blog-p, .blog-ul, .blog-ol, .blog-callout'
        );
        if (bodyEls.length) {
          gsap.fromTo(
            bodyEls,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.04,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: bodyRef.current,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      }

      if (relatedRef.current) {
        const cards = relatedRef.current.querySelectorAll<HTMLElement>('.related-card');
        if (cards.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: relatedRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
        const headerEls = relatedRef.current.querySelectorAll<HTMLElement>('[data-anim]');
        if (headerEls.length) {
          gsap.fromTo(
            headerEls,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.06,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: relatedRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      }
    });

    return () => ctx.revert();
  }, [prefersReducedMotion, slug]);

  if (!post) {
    return (
      <div style={{ minHeight: '100vh', background: 'rgb(var(--color-mist))' }}>
        <div
          className="sticky top-0 z-50"
          style={{ background: 'rgba(11,26,51,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgb(var(--color-gold) / 0.15)' }}
        >
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-gold/70 hover:text-gold transition-colors cursor-pointer font-body text-xs uppercase tracking-wider px-2 py-1.5 rounded-lg hover:bg-cream/5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Back
            </button>
          </div>
        </div>
        <div className="max-w-[800px] mx-auto px-6 lg:px-10 py-32 text-center">
          <p
            className="font-body uppercase text-gold/70 mb-4"
            style={{ fontSize: '11px', letterSpacing: '0.4em' }}
          >
            404 · Article not found
          </p>
          <h1
            className="font-display font-bold text-kimono mb-4"
            style={{ fontSize: 'clamp(28px, 5vw, 48px)', letterSpacing: '0.02em' }}
          >
            We couldn't find that article
          </h1>
          <p
            className="font-serif font-light text-cream/65 mb-8 mx-auto"
            style={{ fontSize: '16px', lineHeight: 1.7, maxWidth: '520px' }}
          >
            The article you are looking for may have been moved or no longer exists.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-body text-xs uppercase tracking-[0.18em] cursor-pointer transition-all duration-300 hover:scale-[1.03]"
            style={{ background: 'rgb(var(--color-gold))', color: '#021635', fontWeight: 700 }}
          >
            Back to home
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'rgb(var(--color-mist))' }}>
      <style>{`
        .blog-h2 {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          color: #FAFAFA;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-size: clamp(22px, 2.6vw, 30px);
          line-height: 1.2;
          margin-top: 2.75rem;
          margin-bottom: 1.1rem;
          position: relative;
          padding-left: 1.1rem;
        }
        .blog-h2::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.45em;
          bottom: 0.45em;
          width: 3px;
          background: linear-gradient(180deg, rgb(var(--color-gold)) 0%, rgb(var(--color-gold) / 0.2) 100%);
          border-radius: 2px;
        }
        .blog-p {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          color: rgba(245, 232, 211, 0.78);
          font-size: 17px;
          line-height: 1.85;
          margin-bottom: 1.1rem;
        }
        .blog-p strong { color: rgb(var(--color-cream)); font-weight: 600; }
        .blog-ul, .blog-ol {
          font-family: 'Cormorant Garamond', serif;
          color: rgba(245, 232, 211, 0.78);
          font-size: 17px;
          line-height: 1.8;
          margin: 0 0 1.4rem 0;
          padding-left: 1.4rem;
        }
        .blog-ol { list-style: decimal; }
        .blog-ol > li { margin-bottom: 0.65rem; padding-left: 0.4rem; }
        .blog-ol > li::marker { color: rgb(var(--color-gold)); font-weight: 700; }
        .blog-ul { list-style: none; }
        .blog-ul > li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.7rem;
        }
        .blog-ul > li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.85em;
          width: 8px;
          height: 8px;
          background: rgb(var(--color-gold));
          transform: rotate(45deg);
        }
        .blog-ul > li strong { color: rgb(var(--color-cream)); font-weight: 600; }
        .blog-callout {
          margin: 2rem 0 2.25rem;
          padding: 1.5rem 1.75rem;
          border-radius: 16px;
          background: linear-gradient(135deg, rgb(var(--color-gold) / 0.10) 0%, rgba(11,42,92,0.35) 100%);
          border: 1px solid rgb(var(--color-gold) / 0.35);
          position: relative;
          overflow: hidden;
        }
        .blog-callout::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: rgb(var(--color-gold));
        }
        .blog-callout-eyebrow {
          font-family: 'Lato', sans-serif;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgb(var(--color-gold));
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .blog-callout-body {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          color: rgba(245, 232, 211, 0.88);
          font-size: 17px;
          line-height: 1.75;
        }
        @media (prefers-reduced-motion: reduce) {
          .blog-cover-img { transition: none !important; }
        }
      `}</style>

      <div
        className="sticky top-0 z-50"
        style={{ background: 'rgba(11,26,51,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgb(var(--color-gold) / 0.15)' }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 overflow-x-auto flex-nowrap scrollbar-none flex-shrink-0 max-w-full">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-gold/70 hover:text-gold transition-colors cursor-pointer font-body text-xs uppercase tracking-wider px-2 py-1.5 rounded-lg hover:bg-cream/5 flex-shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Back
            </button>
            <div className="w-px h-4 mx-1 flex-shrink-0" style={{ background: 'rgb(var(--color-gold) / 0.2)' }} />
            {TOP_NAV.map(({ label, id }) => (
              <button
                key={label}
                onClick={() => {
                  sessionStorage.setItem('scrollToSection', id);
                  navigate('/');
                }}
                className="text-cream/60 hover:text-gold transition-colors cursor-pointer font-body text-xs uppercase tracking-wider px-2 py-1.5 rounded-lg hover:bg-cream/5 whitespace-nowrap flex-shrink-0"
              >
                {label}
              </button>
            ))}
            <span
              className="text-gold font-body text-xs uppercase tracking-wider px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0"
              style={{ background: 'rgb(var(--color-gold) / 0.12)', border: '1px solid rgb(var(--color-gold) / 0.4)' }}
            >
              ✦ {post.category}
            </span>
          </div>
        </div>
      </div>

      <section
        ref={heroRef}
        className="relative w-full"
        style={{ padding: 'clamp(48px, 6vw, 80px) 0 clamp(28px, 3.5vw, 48px)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgb(var(--color-gold) / 0.10) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 max-w-[860px] mx-auto px-6 lg:px-10">
          <div data-anim style={{ opacity: 0 }}>
            <span
              className="inline-block px-3 py-1.5 rounded-full font-body uppercase"
              style={{
                background: 'rgb(var(--color-gold))',
                color: 'rgb(var(--color-mist))',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.22em',
                marginBottom: '1.4rem',
              }}
            >
              {post.category}
            </span>
          </div>
          <h1
            data-anim
            className="font-display font-bold text-kimono leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(32px, 5.5vw, 60px)', letterSpacing: '0.02em', opacity: 0 }}
          >
            {post.title}
          </h1>
          <p
            data-anim
            className="font-serif font-light text-cream/65 mb-7"
            style={{ fontSize: 'clamp(16px, 1.7vw, 20px)', lineHeight: 1.65, opacity: 0 }}
          >
            {post.excerpt}
          </p>
          <div data-anim className="flex flex-wrap items-center gap-3" style={{ opacity: 0 }}>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgb(var(--color-gold) / 0.15)',
                border: '1px solid rgb(var(--color-gold) / 0.35)',
                overflow: 'hidden',
              }}
            >
              {post.authorPhoto ? (
                <img
                  src={post.authorPhoto}
                  alt={post.author}
                  width={56}
                  height={56}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <span
                  className="font-body text-gold"
                  style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em' }}
                >
                  AT
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-cream/65" style={{ fontSize: '12.5px' }}>
              <span>By <span className="text-cream">{post.author}</span></span>
              <span className="text-cream/60">·</span>
              <span>{post.date}</span>
              <span className="text-cream/60">·</span>
              <span className="flex items-center gap-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full">
        <div className="max-w-[1180px] mx-auto px-4 lg:px-10">
          <div
            className="relative w-full overflow-hidden rounded-2xl"
            style={{ height: 'clamp(220px, 38vw, 400px)' }}
          >
            <img
              src={post.cover}
              alt={post.title}
              width={1180}
              height={600}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="blog-cover-img w-full h-full object-cover"
              style={{ transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)' }}
              onError={(e) => {
                e.currentTarget.style.opacity = '0.15';
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, rgba(2, 22, 53,0.45) 0%, rgba(2, 22, 53,0) 30%, rgba(2, 22, 53,0.65) 100%)',
              }}
            />
          </div>
        </div>
      </section>

      <article ref={bodyRef} className="relative w-full">
        <div className="max-w-[760px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
          {renderPostBody(post.slug)}

          <div
            className="mt-16 pt-10 flex flex-wrap items-center gap-3 justify-center"
            style={{ borderTop: '1px solid rgb(var(--color-gold) / 0.18)' }}
          >
            <a
              href={`https://wa.me/60175631621?text=${encodeURIComponent(`Hi, I'd like to discuss: ${post.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-body text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.03]"
              style={{ background: 'rgb(var(--color-gold))', color: '#021635', fontWeight: 700, letterSpacing: '0.16em', boxShadow: '0 8px 24px rgb(var(--color-gold) / 0.3)' }}
            >
              Talk to a counsellor
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-body text-xs uppercase tracking-widest cursor-pointer transition-all duration-300 hover:scale-[1.03]"
              style={{ border: '1px solid rgb(var(--color-gold) / 0.4)', color: 'rgb(var(--color-gold))', fontWeight: 600, letterSpacing: '0.18em', background: 'transparent' }}
            >
              Back to all articles
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </article>

      <section
        className="relative w-full py-16 lg:py-20 overflow-hidden"
        style={{ borderTop: '1px solid rgb(var(--color-gold) / 0.18)', borderBottom: '1px solid rgb(var(--color-gold) / 0.18)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgb(var(--color-gold) / 0.06) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 max-w-[1100px] mx-auto px-6 lg:px-10">
          <div
            className="rounded-3xl p-7 md:p-10 lg:p-12 mb-10 lg:mb-14"
            style={{
              background: 'linear-gradient(135deg, rgba(11,30,66,0.55) 0%, rgba(11,42,92,0.4) 100%)',
              border: '1px solid rgb(var(--color-gold) / 0.25)',
            }}
          >
            <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
              <div className="flex-shrink-0">
                {post.authorPhoto ? (
                  <div
                    className="w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden"
                    style={{ border: '2px solid rgb(var(--color-gold) / 0.4)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                  >
                    <img
                      src={post.authorPhoto}
                      alt={post.author}
                      width={96}
                      height={96}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.currentTarget.style.opacity = '0.2';
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #031D4C 0%, #052458 100%)', border: '2px solid rgb(var(--color-gold) / 0.4)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                    aria-hidden="true"
                  >
                    <span
                      className="font-display font-bold text-gold"
                      style={{ fontSize: 'clamp(22px, 2.4vw, 28px)', letterSpacing: '0.04em' }}
                    >
                      AT
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-body uppercase tracking-[0.28em] text-gold/80 mb-2"
                  style={{ fontSize: '10px' }}
                >
                  {post.authorIsTeam ? 'About the author' : `About ${post.author.split(' ')[0]}`}
                </p>
                <h3
                  className="font-display font-bold text-kimono mb-3"
                  style={{ fontSize: 'clamp(20px, 2vw, 26px)', letterSpacing: '0.02em', lineHeight: 1.2 }}
                >
                  {post.author}
                </h3>
                <p
                  className="font-body uppercase tracking-[0.2em] text-cream/60 mb-4"
                  style={{ fontSize: '10.5px' }}
                >
                  {post.authorRole} · {post.authorCredentials}
                </p>
                <p
                  className="font-serif font-light text-cream/70"
                  style={{ fontSize: '15.5px', lineHeight: 1.75 }}
                >
                  {post.authorBio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section ref={relatedRef} className="relative w-full py-16 lg:py-20">
          <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
            <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
              <div>
                <div data-anim className="w-12 h-px mb-4" style={{ background: 'rgb(var(--color-gold) / 0.5)', opacity: 0 }} />
                <p
                  data-anim
                  className="font-body uppercase tracking-[0.32em] text-gold/70 mb-3"
                  style={{ fontSize: '10px', opacity: 0 }}
                >
                  Keep reading
                </p>
                <h2
                  data-anim
                  className="font-display font-bold text-kimono uppercase"
                  style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', letterSpacing: '0.04em', opacity: 0 }}
                >
                  Related <span style={{ color: 'rgb(var(--color-gold))' }}>articles</span>
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((p) => (
                <RelatedCard
                  key={p.slug}
                  post={p}
                  onOpen={(s) => navigate(`/blog/${s}`)}
                />
              ))}
            </div>

            <div className="mt-12 text-center">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-body text-xs uppercase transition-all duration-300 hover:scale-[1.03] cursor-pointer"
                style={{
                  border: '1px solid rgb(var(--color-gold) / 0.5)',
                  color: 'rgb(var(--color-gold))',
                  letterSpacing: '0.18em',
                  fontWeight: 600,
                  background: 'rgb(var(--color-gold) / 0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgb(var(--color-gold) / 0.10)';
                  e.currentTarget.style.borderColor = 'rgb(var(--color-gold) / 0.8)';
                  e.currentTarget.style.boxShadow = '0 8px 28px rgb(var(--color-gold) / 0.22)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgb(var(--color-gold) / 0.04)';
                  e.currentTarget.style.borderColor = 'rgb(var(--color-gold) / 0.5)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Back to all articles
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      )}

      <footer className="relative w-full py-10" style={{ borderTop: '1px solid rgb(var(--color-gold) / 0.12)' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 flex flex-wrap items-center justify-between gap-3">
          <p className="font-body text-cream/60" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
            © {new Date().getFullYear()} Absolute Consultancy Firm · Bangladesh → Malaysia
          </p>
          <button
            onClick={() => navigate('/')}
            className="font-body text-gold/70 hover:text-gold transition-colors cursor-pointer"
            style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}
          >
            ← Back to home
          </button>
        </div>
      </footer>
    </div>
  );
}

export const BLOG_CARDS: ReadonlyArray<BlogCard> = POSTS.map((p) => ({
  slug: p.slug,
  category: p.category,
  cover: p.cover,
  date: p.date,
  title: p.title,
  excerpt: p.excerpt,
  author: p.author,
  readTime: p.readTime,
}));
