import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import MalaysiaMap from '../components/MalaysiaMap';
import UniversityLogo from '../components/UniversityLogo';


// Pre-generated splash dot positions to avoid impure Math.random during render
const SPLASH_DOTS = Array.from({ length: 40 }, (_, i) => ({
  width: Math.random() * 6 + 2,
  height: Math.random() * 6 + 2,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  background: i % 3 === 0 ? 'rgb(var(--color-gold))' : i % 3 === 1 ? '#D4AF37' : '#FFD700',
}));

interface University {
  name: string;
  shortName: string;
  location: string;
  type: string;
  programmes: string[];
  studyLevels: string[];
  accent: string;
  tag: string;
  founded: string;
  students: string;
  ranking: string;
  description: string;
  highlights: string[];
  campusImage: string;
  /** Partner-catalogue mark; absent for the institutions it does not list. */
  logo?: string;
  campusTourVideo: string;
  website: string;
}

const allUniversities: University[] = [
  {
    name: 'Asia Pacific University of Technology & Innovation (APU)',
    shortName: 'APU',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['IT & Computing', 'Engineering', 'Business', 'Design & Media', 'Actuarial Science', 'Accounting & Finance', 'Psychology', 'Architecture', 'Animation & VFX', 'Petroleum Engineering'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#1A3A6B',
    tag: '5-Star SETARA',
    founded: '1993',
    students: '12,000+',
    ranking: 'QS World Top 401+ | 5-Star SETARA',
    description: "One of Malaysia's highest-rated universities with a 5-Star SETARA rating. APU is especially strong in technology and computing, with students from over 130 countries making it one of the most diverse campuses in Malaysia.",
    highlights: ['5-Star SETARA Rating', '130+ Nationalities on Campus', 'QS Top 401+', 'Strong IT & Computing', 'Excellent Graduate Employability', 'Modern KL Campus'],
    campusImage: `${import.meta.env.BASE_URL}images/AsiaPacificUniversity.jpeg`,
    logo: `${import.meta.env.BASE_URL}images/university-logos/apu.webp`,
    campusTourVideo: 'https://www.youtube.com/embed/OhmGgJV9qNI',
    website: 'https://www.apu.edu.my',
  },
  {
    name: 'INTI International University',
    shortName: 'INTI',
    location: 'Nilai, Negeri Sembilan',
    type: 'Private',
    programmes: ['Business', 'Engineering', 'Computing & IT', 'Hospitality & Culinary', 'Health Sciences', 'Arts & Design', 'Mass Communication', 'Pre-University', 'Biotechnology', 'Accounting', 'American Degree Transfer'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#CC4400',
    tag: 'International Network',
    founded: '1986',
    students: '8,000+',
    ranking: 'Top 5 Private Universities in Malaysia',
    description: 'With campuses in Nilai and Subang Jaya, INTI offers globally recognised qualifications through its international university partnerships. Students can transfer credits or complete degrees at partner universities worldwide.',
    highlights: ['International Transfer Programmes', 'Partner Universities Worldwide', 'Nilai & Subang Campuses', 'Top 5 Private Universities', 'Strong Hospitality School', 'Hope Education Group'],
    campusImage: `${import.meta.env.BASE_URL}images/INTIUniversity.jpeg`,
    logo: `${import.meta.env.BASE_URL}images/university-logos/inti.webp`,
    campusTourVideo: 'https://www.youtube.com/embed/W1himgzsyLQ',
    website: 'https://newinti.edu.my',
  },
  {
    name: "Taylor's University",
    shortName: "Taylor's",
    location: 'Subang Jaya, Selangor',
    type: 'Private',
    programmes: ['Hospitality & Tourism', 'Law', 'Architecture', 'Business & Finance', 'Medicine', 'Engineering', 'Education', 'Pharmacy', 'Computer Science', 'Biosciences', 'Media & Communication', 'Psychology', 'Design', 'Actuarial Studies', 'Biotechnology'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#4A0080',
    tag: 'Award Winning',
    founded: '1969',
    students: '12,000+',
    ranking: 'QS World #253 (2026)',
    description: "One of Malaysia's oldest and most reputable private institutions. Taylor's is globally recognised for its Hospitality, Law, and Architecture programmes, and offers award-winning degrees in a beautiful Subang Jaya campus.",
    highlights: ['Established 1969', 'Award-Winning Hospitality School', 'MyQUEST 2022 Competitive', 'QS World #253', 'Beautiful Campus', 'Strong Industry Partnerships'],
    campusImage: `${import.meta.env.BASE_URL}images/TaylorUniversity.jpeg`,
    logo: `${import.meta.env.BASE_URL}images/university-logos/taylors.webp`,
    campusTourVideo: 'https://www.youtube.com/embed/NSuKhrtt9zo',
    website: 'https://university.taylors.edu.my',
  },
  {
    name: 'UCSI University',
    shortName: 'UCSI',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Medicine', 'Pharmacy', 'Architecture', 'Music', 'Business', 'Engineering', 'Computer Science'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#1B5E20',
    tag: 'QS Ranked',
    founded: '1986',
    students: '10,000+',
    ranking: 'QS World Top 601+',
    description: 'A leading private university in KL offering over 100 programmes. UCSI is especially renowned for its Medicine, Pharmacy, and Architecture programmes, and boasts a rooftop bar and vibrant student life.',
    highlights: ['QS World Ranked', 'Top Medicine & Pharmacy', 'Award-Winning Architecture', 'Rooftop Campus Facilities', 'Strong Alumni Network', 'Located in KL'],
    campusImage: `${import.meta.env.BASE_URL}images/UCSIUniversity.jpeg`,
    logo: `${import.meta.env.BASE_URL}images/university-logos/ucsi.webp`,
    campusTourVideo: 'https://www.youtube.com/embed/07RlVINKWU4',
    website: 'https://www.ucsiuniversity.edu.my',
  },
  {
    name: 'University of Wollongong Malaysia (UOW)',
    shortName: 'UOW',
    location: 'Glenmarie, Shah Alam',
    type: 'Private',
    programmes: ['Business', 'Engineering', 'Computing', 'Communication', 'Creative Arts', 'Health Sciences'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#0B3D91',
    tag: 'Australian Partner',
    founded: '2004',
    students: '5,000+',
    ranking: 'QS World Top 500+ (Main Campus)',
    description: 'UOW Malaysia is a branch campus of the University of Wollongong, Australia, ranked among the top 1% of universities worldwide. Students earn an Australian degree in Malaysia with the option to transfer to Wollongong campus in Australia.',
    highlights: ['Australian University Degree', 'Transfer to Australia', 'QS World Top 500+', 'Strong Engineering & IT', 'Modern Glenmarie Campus', 'Global Recognition'],
    campusImage: `${import.meta.env.BASE_URL}images/UniversityOfWollong.jpeg`,
    logo: `${import.meta.env.BASE_URL}images/university-logos/uow.webp`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.uow.edu.my',
  },
  {
    name: 'University of Cyberjaya (UOC)',
    shortName: 'UoC',
    location: 'Cyberjaya, Selangor',
    type: 'Private',
    programmes: ['Medicine', 'Pharmacy', 'Nursing', 'IT', 'Business', 'Health Sciences', 'Biomedical Engineering', 'Psychology', 'Education', 'Mass Communication', 'Multimedia & Animation', 'Dietetics', 'Occupational Safety & Health', 'Physiotherapy', 'Cosmetics'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#005A8B',
    tag: 'Health Focus',
    founded: '2005',
    students: '4,000+',
    ranking: 'QS Top 601+ | 5-Star SETARA',
    description: "Located in Malaysia's smart city Cyberjaya, UoC is a premier health sciences university with a 5-Star SETARA rating. It excels in Medicine, Pharmacy, and Nursing with a state-of-the-art eco-friendly campus.",
    highlights: ['5-Star SETARA Rating', 'Top Medicine & Health Sciences', 'Eco-Friendly Smart Campus', 'QS Top 601+', 'Top 200 Global Health SDG Ranking', 'Located in Cyberjaya'],
    campusImage: `${import.meta.env.BASE_URL}images/UniversityOfCyberjaya.jpeg`,
    logo: `${import.meta.env.BASE_URL}images/university-logos/cyberjaya.webp`,
    campusTourVideo: 'https://www.youtube.com/embed/irmFggZ7DN4',
    website: 'https://cyberjaya.edu.my',
  },
  {
    name: 'International Islamic University Malaysia (IIUM)',
    shortName: 'IIUM',
    location: 'Gombak, Selangor',
    type: 'Public',
    programmes: ['Islamic Studies', 'Law', 'Engineering', 'Medicine', 'Economics', 'IT', 'Architecture'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#006400',
    tag: 'Top Public Islamic',
    founded: '1983',
    students: '30,000+',
    ranking: 'QS World Top 601+',
    description: 'A premier public university established by the Organisation of Islamic Cooperation. IIUM integrates Islamic values with modern academic disciplines, renowned for its Law, Engineering, and Medicine programmes.',
    highlights: ['Established by OIC', '100+ Countries Represented', 'Dual-Language (English & Arabic)', 'Top Islamic Law Programme', 'Affordable Public Fees', 'Beautiful Gombak Campus'],
    campusImage: `${import.meta.env.BASE_URL}images/IIUM.jpeg`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.iium.edu.my',
  },
  {
    name: 'Kuala Lumpur University of Science and Technology (KLUST)',
    shortName: 'IUKL',
    location: 'Kajang, Selangor',
    type: 'Private',
    programmes: ['Engineering', 'IT', 'Business', 'Design', 'Hospitality', 'Education'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#B8860B',
    tag: 'Science & Tech',
    founded: '2000',
    students: '3,000+',
    ranking: 'MQA Accredited',
    description: 'KL University of Science & Technology (KLUST) focuses on applied science, technology, and engineering education. Located in Kajang, it offers practical, industry-oriented programmes with modern labs and facilities.',
    highlights: ['Applied Science Focus', 'Industry-Oriented Curriculum', 'Modern Labs & Facilities', 'Affordable Tuition', 'Small Class Sizes', 'Kajang Campus'],
    campusImage: `${import.meta.env.BASE_URL}images/IUKL.jpeg`,
    logo: `${import.meta.env.BASE_URL}images/university-logos/klust.webp`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.klust.edu.my',
  },
  {
    name: 'MAHSA University',
    shortName: 'MAHSA',
    location: 'Bandar Saujana Putra, Selangor',
    type: 'Private',
    programmes: ['Medicine', 'Nursing', 'Pharmacy', 'Engineering', 'Dentistry', 'Business', 'IT', 'Physiotherapy', 'Biomedical Sciences', 'Accounting', 'Architecture', 'Hospitality', 'Education', 'Biotechnology', 'Medical Imaging', 'Environmental Health', 'Quantity Surveying'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#C62828',
    tag: 'Medical Sciences',
    founded: '2005',
    students: '5,000+',
    ranking: 'MQA Accredited | 5-Star SETARA',
    description: 'MAHSA University specialises in medical and health sciences education, offering one of the most comprehensive ranges of health programmes in Malaysia. Located in Bandar Saujana Putra, it features modern simulation labs and clinical facilities.',
    highlights: ['5-Star SETARA Rating', 'Comprehensive Medical Programmes', 'Modern Simulation Labs', 'Strong Clinical Partnerships', 'Affordable Medical Education', 'Bandar Saujana Campus'],
    campusImage: `${import.meta.env.BASE_URL}images/Mahsa.jpeg`,
    logo: `${import.meta.env.BASE_URL}images/university-logos/mahsa.webp`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.mahsa.edu.my',
  },
  {
    name: 'Multimedia University (MMU)',
    shortName: 'MMU',
    location: 'Cyberjaya, Selangor',
    type: 'Private',
    programmes: ['Computer Science', 'Engineering', 'Creative Multimedia', 'Business & Management', 'Law', 'Cinematic Arts', 'Animation & VFX', 'Accounting', 'Marketing', 'Robotics', 'Artificial Intelligence', 'Cybersecurity'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#7B0000',
    tag: 'Tech Leader',
    founded: '1994',
    students: '18,000+',
    ranking: 'QS Asia #207 (2025)',
    description: "Malaysia's first private university, founded by Telekom Malaysia. MMU is a premier research institution at the heart of the Multimedia Super Corridor (MSC), renowned for engineering, IT, creative multimedia, and strong industry connections.",
    highlights: ['Malaysia\'s First Private University', 'QS Asia Top 250', 'Olympic-sized Swimming Pool', '200-acre Campus', '13 Research Centres', 'Strong Tech Industry Links'],
    campusImage: `${import.meta.env.BASE_URL}images/MMU.jpeg`,
    logo: `${import.meta.env.BASE_URL}images/university-logos/mmu.webp`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.mmu.edu.my',
  },
  {
    name: 'Nilai University',
    shortName: 'Nilai',
    location: 'Nilai, Negeri Sembilan',
    type: 'Private',
    programmes: ['Business & Management', 'Accounting & Finance', 'Engineering', 'Hospitality & Culinary', 'Nursing', 'IT & Computer Science', 'Education', 'Biotechnology', 'Aircraft Maintenance', 'Digital Marketing'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#2E7D32',
    tag: 'Campus Life',
    founded: '1997',
    students: '5,000+',
    ranking: 'MQA Accredited | SETARA Tier 5',
    description: 'Nilai University is located in the student town of Nilai, offering a vibrant campus life with modern facilities. Programmes in business, engineering, and hospitality are popular, and the campus features excellent sports and residential facilities.',
    highlights: ['Vibrant Campus Life', 'Modern Sports Facilities', 'On-Campus Accommodation', 'Diverse Programmes', 'Student Town Location', 'Established 1997'],
    campusImage: `${import.meta.env.BASE_URL}images/NilaiUniversity.jpeg`,
    logo: `${import.meta.env.BASE_URL}images/university-logos/nilai.webp`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.nilai.edu.my',
  },
  {
    name: 'SEGi University',
    shortName: 'SEGi',
    location: 'Petaling Jaya, Selangor',
    type: 'Private',
    programmes: ['Medicine', 'Dentistry', 'Business & Accounting', 'Engineering', 'IT', 'Pharmacy', 'Education', 'Psychology', 'Optometry', 'Physiotherapy', 'Nursing', 'Law', 'Creative Arts', 'Communication Studies', 'Biomedical Science', 'Hospitality & Culinary Arts', 'Pre-University'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#006400',
    tag: 'Affordable',
    founded: '1977',
    students: '9,000+',
    ranking: 'SETARA Tier 5',
    description: 'One of Malaysia\'s oldest private institutions, SEGi offers affordable education across medicine, dentistry, engineering and business. Multiple campuses across Malaysia make it accessible to students nationwide.',
    highlights: ['Established 1977', 'Affordable Fees', 'Top Dentistry School', 'Multiple Campuses', 'Medicine & Pharmacy', 'Strong Industry Links'],
    campusImage: `${import.meta.env.BASE_URL}images/SEGiUniversity.jpeg`,
    logo: `${import.meta.env.BASE_URL}images/university-logos/segi.webp`,
    campusTourVideo: 'https://www.youtube.com/embed/6mnJu2Oy7OI',
    website: 'https://www.segi.edu.my',
  },
  {
    name: 'Universiti Kuala Lumpur (UNIKL)',
    shortName: 'UniKL',
    location: 'Kuala Lumpur',
    type: 'Public',
    programmes: ['Engineering', 'IT', 'Business', 'Aviation', 'Medical Sciences', 'Design'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#1A237E',
    tag: 'Technical Focus',
    founded: '2002',
    students: '15,000+',
    ranking: 'MQA Accredited',
    description: 'UniKL is a multi-campus technical university owned by Majlis Amanah Rakyat (MARA). It specialises in engineering, aviation, and technical education with 14 institutes across Malaysia, producing highly skilled technical graduates.',
    highlights: ['MARA-Owned University', '14 Institutes Nationwide', 'Aviation & Aerospace Focus', 'Strong Technical Training', 'Industry Partnerships', 'Affordable Public Fees'],
    campusImage: `${import.meta.env.BASE_URL}images/UniversityKualaLumpur.jpeg`,
    logo: `${import.meta.env.BASE_URL}images/university-logos/unikl.webp`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.unikl.edu.my',
  },
  {
    name: 'Universiti Tun Abdul Razak (UNIRAZAK)',
    shortName: 'UNIRAZAK',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Business', 'Education', 'IT', 'Law', 'Accounting', 'Humanities'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#880E4F',
    tag: 'Business & Education',
    founded: '1997',
    students: '6,000+',
    ranking: 'MQA Accredited',
    description: 'UNIRAZAK is a private university in KL known for its strong business, education, and accounting programmes. Named after Malaysia\'s second Prime Minister, it produces graduates with strong managerial and leadership skills.',
    highlights: ['Strong Business Programme', 'Education & Teaching Focus', 'Named After Tun Abdul Razak', 'Located in KL', 'Affordable Tuition', 'Leadership Development'],
    campusImage: `${import.meta.env.BASE_URL}images/UNIRAZAK.jpeg`,
    logo: `${import.meta.env.BASE_URL}images/university-logos/unirazak.webp`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.unirazak.edu.my',
  },
  {
    name: 'UNITAR International University',
    shortName: 'UNITAR',
    location: 'Kampar, Perak / Petaling Jaya, Selangor',
    type: 'Private',
    programmes: ['Business', 'IT', 'Engineering', 'Education', 'Communication', 'Chinese Studies'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#FF6F00',
    tag: 'Founded by MCA',
    founded: '1997',
    students: '15,000+',
    ranking: 'MQA Accredited',
    description: 'Founded by the Malaysian Chinese Association (MCA), UNITAR is one of Malaysia\'s well-established private universities. With campuses in Kampar and Petaling Jaya, it offers a wide range of programmes with a focus on accessibility and quality.',
    highlights: ['Founded by MCA', 'Two Campuses Available', 'Wide Range of Programmes', 'Affordable Tuition', 'Strong Education Faculty', 'Accessible to All Communities'],
    campusImage: `${import.meta.env.BASE_URL}images/UNITAR.jpeg`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.unitar.edu.my',
  },
  {
    name: 'Universiti Tenaga Nasional (UNITEN)',
    shortName: 'UNITEN',
    location: 'Putrajaya',
    type: 'Private',
    programmes: ['Engineering', 'IT', 'Business', 'Accounting', 'Energy Management', 'Computer Science'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#0D47A1',
    tag: 'Energy University',
    founded: '1997',
    students: '7,000+',
    ranking: 'MQA Accredited | QS Asia Top 400',
    description: 'UNITEN is Malaysia\'s premier energy university, owned by Tenaga Nasional Berhad (TNB). Located in Putrajaya, it specialises in power engineering, energy management, and IT, with unique programmes not available at other universities.',
    highlights: ['Owned by TNB', 'Power Engineering Specialty', 'Energy Management Focus', 'Putrajaya Campus', 'QS Asia Top 400', 'Strong Industry Links'],
    campusImage: `${import.meta.env.BASE_URL}images/UNITENUniversity.jpeg`,
    logo: `${import.meta.env.BASE_URL}images/university-logos/uniten.webp`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.uniten.edu.my',
  },

  {
    name: 'Brickfields Asia College',
    shortName: 'BAC',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Law', 'Business', 'Creative Arts', 'Communication', 'Pre-University'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#3E2723',
    tag: 'Law Specialist',
    founded: '1991',
    students: '5,000+',
    ranking: 'Top Law Pathway',
    description: 'Brickfields Asia College (BAC) is Malaysia\'s premier pathway institution for law degrees. Through its partnership with the University of London, students can earn a globally recognised LLB from KL, alongside creative arts and business programmes.',
    highlights: ['University of London Law Degree', 'Study Law in Malaysia', 'Creative Arts Programmes', 'Affordable Tuition', 'Located in KL', 'Established 1991'],
    campusImage: `${import.meta.env.BASE_URL}images/BrickFieldsAsiaCollage.jpeg`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.bac.edu.my',
  },
    {
      name: 'Reliance College',
      shortName: 'Reliance',
      location: 'Kuala Lumpur',
      type: 'Private',
      programmes: ['Business', 'Accounting', 'Finance', 'IT', 'Pre-University'],
      studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
      accent: '#1565C0',
      tag: 'Business & Finance',
      founded: '1998',
      students: '2,000+',
      ranking: 'MQA Accredited',
      description: 'Reliance College in Kuala Lumpur offers business, accounting, and finance programmes with strong industry connections. Known for its quality education and affordable tuition, it provides pathways to professional qualifications.',
      highlights: ['Business & Finance Focus', 'Professional Qualification Pathways', 'Affordable Tuition', 'Industry Connections', 'KL City Campus', 'Quality Education'],
      campusImage: `${import.meta.env.BASE_URL}images/RelianceCollage.jpeg`,
      campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
      website: 'https://www.reliance.edu.my',
    },
  {
    name: 'ALFA University College',
    shortName: 'Alfa',
    location: 'Subang Jaya, Selangor',
    type: 'Private',
    programmes: ['Business', 'Education', 'Design', 'Health Sciences', 'Pre-University'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#1565C0',
    tag: 'Education & Design',
    founded: '1998',
    students: '3,000+',
    ranking: 'MQA Accredited',
    description: 'Alfa University College in Subang Jaya specialises in education, business, and design. Known for its Foundation and A-Level programmes, Alfa provides pathways to top universities locally and abroad.',
    highlights: ['Strong Foundation Programme', 'Education & Teaching Focus', 'Design Programmes', 'Pathway to Top Universities', 'Subang Jaya Campus', 'Affordable Fees'],
    campusImage: `${import.meta.env.BASE_URL}images/AlfaUniversity.jpeg`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.alfa.edu.my',
  },
  {
    name: 'City University Malaysia',
    shortName: 'City',
    location: 'Petaling Jaya, Selangor',
    type: 'Private',
    programmes: ['Business', 'IT', 'Engineering', 'Design', 'Hospitality', 'Mass Communication'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#283593',
    tag: 'Urban Campus',
    founded: '1984',
    students: '6,000+',
    ranking: 'MQA Accredited | SETARA Tier 5',
    description: 'City University Malaysia in Petaling Jaya is a multidisciplinary private university offering business, engineering, design, and communication programmes. With a 5-Star SETARA rating, it focuses on industry-ready graduates.',
    highlights: ['SETARA Tier 5', 'Multidisciplinary Programmes', 'Strong Industry Connections', 'Petaling Jaya Campus', 'Modern Facilities', 'Established 1984'],
    campusImage: `${import.meta.env.BASE_URL}images/CityUniversity.jpeg`,
    logo: `${import.meta.env.BASE_URL}images/university-logos/city.webp`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.city.edu.my',
  },
    {
      name: 'Kings University College',
      shortName: 'Kings',
      location: 'Petaling Jaya, Selangor',
      type: 'Private',
      programmes: ['Business', 'Accounting', 'Engineering', 'IT', 'Hospitality'],
      studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
      accent: '#8B0000',
      tag: 'Growing Institution',
      founded: '2005',
      students: '1,500+',
      ranking: 'MQA Accredited',
      description: 'Kings University College in Petaling Jaya offers business, engineering, and hospitality programmes. With a focus on practical education and industry readiness, it provides quality education at affordable fees.',
      highlights: ['Practical Education Focus', 'Engineering & Business', 'Industry-Ready Graduates', 'Affordable Fees', 'Petaling Jaya Campus', 'Growing Student Community'],
      campusImage: `${import.meta.env.BASE_URL}images/KingsUniversityCollage.jpeg`,
      logo: `${import.meta.env.BASE_URL}images/university-logos/kings.webp`,
      campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
      website: 'https://www.kings.edu.my',
    },
  {
    name: 'Lincoln University College',
    shortName: 'Lincoln',
    location: 'Petaling Jaya, Selangor',
    type: 'Private',
    programmes: ['Medicine', 'Pharmacy', 'Dentistry', 'Business', 'IT', 'Engineering'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#01579B',
    tag: 'QS Ranked',
    founded: '2002',
    students: '8,000+',
    ranking: 'QS World Top 501+ (2026)',
    description: 'Lincoln University College is a QS-ranked private institution offering medicine, dentistry, pharmacy, and business programmes. Located in Petaling Jaya, it provides affordable medical education with modern simulation labs.',
    highlights: ['QS World Top 501+', 'Affordable Medical Programmes', 'Simulation Lab Facilities', 'Modern Campus', 'Diverse Faculty', 'Petaling Jaya Location'],
    campusImage: `${import.meta.env.BASE_URL}images/LincolnUniversityCollage.jpeg`,
    logo: `${import.meta.env.BASE_URL}images/university-logos/lincoln.webp`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.lincoln.edu.my',
  },
  {
    name: 'International Institute of Management and Technology (IIMAT)',
    shortName: 'IIMAT',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Fine Arts', 'Graphic Design', 'Illustration', 'Digital Art', 'Fashion Design', 'Visual Communication'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#AD1457',
    tag: 'Creative Arts',
    founded: '1967',
    students: '2,500+',
    ranking: 'MQA Accredited',
    description: "Malaysian Institute of Art (MIA) is Malaysia's oldest art institution, offering specialist education in fine arts, graphic design, and fashion. Located in KL, it has produced generations of leading Malaysian artists and designers.",
    highlights: ['Established 1967', 'Malaysia\'s Oldest Art Institution', 'Fine Arts & Design', 'Strong Alumni Network', 'Creative Portfolio Support', 'KL City Location'],
    campusImage: `${import.meta.env.BASE_URL}images/IIMAT.jpeg`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.mia.edu.my',
  },
  {
    name: 'London School of Business and Finance Malaysia (LSBF)',
    shortName: 'LSBF',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Business', 'Accounting', 'Finance', 'Digital Marketing', 'MBA', 'Data Analytics'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#1A237E',
    tag: 'Global Qualification',
    founded: '2003',
    students: '4,000+',
    ranking: 'Global Accreditation',
    description: 'LSBF Malaysia is part of the global LSBF network headquartered in London. It offers globally recognised business, finance, and accounting qualifications with UK-accredited degree programmes taught in KL.',
    highlights: ['UK-Accredited Degrees', 'Global LSBF Network', 'Business & Finance Focus', 'Internationally Recognised', 'KL City Centre Campus', 'Flexible Study Options'],
    campusImage: `${import.meta.env.BASE_URL}images/LSBF.jpeg`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.lsbf.edu.my',
  },
  {
    name: 'Sunway University',
    shortName: 'Sunway',
    location: 'Petaling Jaya, Selangor',
    type: 'Private',
    programmes: ['Business', 'Sciences', 'Arts', 'Computing', 'Law', 'Medical Sciences'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#B8860B',
    tag: 'Premier Private',
    founded: '1987',
    students: '9,000+',
    ranking: 'QS World #253 (2026)',
    description: 'Ranked #253 globally in QS 2026, Sunway University is one of Malaysia\'s most prestigious private universities. Located within the integrated Sunway City, students enjoy world-class facilities including a FIFA-certified football field.',
    highlights: ['QS World #253 (2026)', 'FIFA-Certified Football Field', 'Canopy Walk', 'Integrated Smart City Campus', 'Strong Medical Sciences', 'Top Business School'],
    campusImage: `${import.meta.env.BASE_URL}images/SunWayUniversity.jpeg`,
    logo: `${import.meta.env.BASE_URL}images/university-logos/sunway.webp`,
    campusTourVideo: 'https://www.youtube.com/embed/g5RhGYuzu-s',
    website: 'https://sunwayuniversity.edu.my',
  },


  {
    name: 'University College Of Aviation Malaysia (UNICAM)',
    shortName: 'UNICAM',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Business', 'IT', 'Psychology', 'Education', 'Health Sciences', 'Pre-University'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#4A148C',
    tag: 'Growing Institution',
    founded: '2010',
    students: '2,000+',
    ranking: 'MQA Accredited',
    description: 'Unicam University Malaysia is a growing private institution in KL offering business, IT, psychology, and health sciences programmes. With a focus on practical education and small class sizes, it provides personalised learning experiences.',
    highlights: ['Small Class Sizes', 'Practical Education', 'Business & Psychology', 'Personalised Learning', 'Affordable Tuition', 'Located in KL'],
    campusImage: `${import.meta.env.BASE_URL}images/UniCam.jpeg`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.unicam.edu.my',
  },
  {
    name: 'Asia e University',
    shortName: 'AEU',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Business', 'IT', 'Engineering', 'Education', 'Liberal Arts'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#2E86AB',
    tag: 'Growing Institution',
    founded: '2004',
    students: '5,000+',
    ranking: 'MQA Accredited',
    description: 'Asia-E University is a private institution in KL offering programmes in business, IT, engineering, and education. Known for its multicultural environment and affordable tuition, AEU provides quality education with a focus on practical skills.',
    highlights: ['MQA Accredited Programmes', 'Affordable Tuition', 'Multicultural Environment', 'Industry-Focused Curriculum', 'Located in KL', 'Growing Student Community'],
    campusImage: `${import.meta.env.BASE_URL}images/AsiaEUniversity.jpeg`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.aeu.edu.my',
  },
  {
    name: 'Monash University Malaysia',
    shortName: 'MONASH',
    location: 'Subang Jaya, Selangor',
    type: 'Private',
    programmes: ['Medicine', 'Engineering', 'Business', 'IT', 'Pharmacy', 'Arts'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#c8102e',
    tag: 'Global Top 50',
    founded: '1998',
    students: '8,000+',
    ranking: 'QS World #42 (2026)',
    description: 'Monash University Malaysia is a full campus of Monash University, Australia\'s largest university. Ranked #42 globally, students receive the same Australian degree in Malaysia with access to global exchange programmes across Monash campuses worldwide.',
    highlights: ['QS World #42', 'Australian Degree in Malaysia', 'Global Campus Exchange', 'Top Medicine & Pharmacy', 'World-Class Research', 'Modern Subang Campus'],
    campusImage: `${import.meta.env.BASE_URL}images/MonashUniversity.jpeg`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.monash.edu.my',
  },
  {
    name: 'Heriot-Watt University Malaysia',
    shortName: 'HW',
    location: 'Putrajaya',
    type: 'Private',
    programmes: ['Engineering', 'Business', 'Computer Science', 'Actuarial Science', 'Psychology', 'Architecture'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#003366',
    tag: 'Global Top 300',
    founded: '2014',
    students: '3,000+',
    ranking: 'QS World #256 (2026)',
    description: 'Heriot-Watt University Malaysia is a campus of the UK\'s Heriot-Watt University, ranked #256 globally. Students earn a British degree in Malaysia with the option to transfer to campuses in Edinburgh, Dubai or the UK.',
    highlights: ['British Degree in Malaysia', 'QS World #256', 'Global Campus Transfer', 'Top Engineering School', 'Putrajaya Campus', 'Industry-Focused Programmes'],
    campusImage: `${import.meta.env.BASE_URL}images/HeriotWatt.jpeg`,
    logo: `${import.meta.env.BASE_URL}images/university-logos/hw.webp`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.hw.ac.uk/malaysia',
  },
  {
    name: 'University College MAIWP International (UCMI)',
    shortName: 'UCMI',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Business', 'IT', 'Hospitality', 'Education', 'Engineering'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#1a5f9e',
    tag: 'MQA Accredited',
    founded: '2005',
    students: '2,000+',
    ranking: 'MQA Accredited',
    description: 'UCMI is a private institution in Kuala Lumpur offering programmes in business, IT, hospitality, education and engineering. It provides quality education with a focus on industry readiness and practical skills.',
    highlights: ['Industry-Ready Graduates', 'Business & IT Focus', 'Practical Education', 'KL City Campus', 'Affordable Tuition', 'Growing Institution'],
    campusImage: `${import.meta.env.BASE_URL}images/UCMI.jpeg`,
    logo: `${import.meta.env.BASE_URL}images/university-logos/ucmi.webp`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.ucmi.edu.my',
  },
  {
    name: 'University Malaysia of Computer Science & Engineering (UNIMY)',
    shortName: 'UNIMY',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Engineering', 'IT', 'Business', 'Design', 'Education'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#2c3e50',
    tag: 'MQA Accredited',
    founded: '2006',
    students: '2,000+',
    ranking: 'MQA Accredited',
    description: 'UNIMY is a private institution in Kuala Lumpur focusing on engineering, IT, business, design and education. It offers quality programmes with practical training and strong industry partnerships.',
    highlights: ['Practical Training', 'Industry Partnerships', 'Engineering & IT Focus', 'KL Campus', 'Quality Education', 'Student Development'],
    campusImage: `${import.meta.env.BASE_URL}images/UniMY.jpeg`,
    logo: `${import.meta.env.BASE_URL}images/university-logos/unimy.webp`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.unimy.edu.my',
  },
  {
    name: 'University of Wales Malaysia (UMW)',
    shortName: 'UMW',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Business', 'IT', 'Engineering', 'Accounting', 'Education'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#800020',
    tag: 'International Partnership',
    founded: '2000',
    students: '2,500+',
    ranking: 'MQA Accredited',
    description: 'University Malaya Wales offers programmes in business, IT, engineering, accounting and education. With international partnerships, it provides quality education and pathways to global qualifications.',
    highlights: ['International Partnerships', 'Global Qualifications', 'Business & IT Focus', 'KL Campus', 'Affordable Education', 'Student Support'],
    campusImage: `${import.meta.env.BASE_URL}images/UniversityMalayaWales.jpeg`,
    logo: `${import.meta.env.BASE_URL}images/university-logos/umw.webp`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.umw.edu.my',
  },
  {
    name: 'Veritas University College',
    shortName: 'VUC',
    location: 'Petaling Jaya, Selangor',
    type: 'Private',
    programmes: ['Business', 'Law', 'Education', 'Communications', 'Psychology', 'Digital Transformation'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#6A1B9A',
    tag: 'Online Education Leader',
    ranking: 'BrandLaureate Best Brand in Online Education',
    founded: '2013',
    students: '2,000+',
    description: 'Veritas University College is a leading private institution in Petaling Jaya offering affordable pre-university, undergraduate and postgraduate courses. Founded in 2013, VUC is the first institution to adopt the "Pay It Forward" ethos.',
    highlights: ['Pay It Forward Ethos', 'BrandLaureate Award Winner', 'Online & Blended Learning', 'Petaling Jaya Campus', 'Affordable Education', 'Established 2013'],
    campusImage: `${import.meta.env.BASE_URL}images/AlfaUniversity.jpeg`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://veritas.edu.my',
  },
  {
    name: 'IACT College',
    shortName: 'IACT',
    location: 'Petaling Jaya, Selangor',
    type: 'Private',
    programmes: ['Advertising', 'Broadcasting & Film', 'Graphic Design', 'Mass Communication', 'Media Studies', 'Public Relations'],
    studyLevels: ['Foundation', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#E65100',
    tag: 'Premier Creative College',
    ranking: 'IAA Accredited',
    founded: '1970',
    students: '3,000+',
    description: "IACT College is Malaysia's premier creative communication specialist, founded in the 1970s by the Malaysian Advertisers Association. The only college in Malaysia accredited by the International Advertising Association in New York.",
    highlights: ['IAA Accredited (New York)', 'Founded in 1970s', 'Premier Creative College', 'Industry Partnerships', 'Menara BAC Campus', 'Strong Alumni Network'],
    campusImage: `${import.meta.env.BASE_URL}images/AlfaUniversity.jpeg`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.iact.edu.my',
  },
  {
    name: 'MAHSA Avenue International College (MAIC)',
    shortName: 'MAIC',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Graphic Design', 'Mass Communication', 'IT', 'Business', 'HR Management', 'Multimedia', 'Animation', 'Fashion Marketing'],
    studyLevels: ['Certificate', 'Diploma', 'Bachelor', 'Master', 'PhD'],
    accent: '#C62828',
    tag: 'Creative & Technical',
    ranking: 'MQA Accredited',
    founded: '2005',
    students: '1,500+',
    description: 'MAHSA Avenue International College offers diploma and certificate programmes in graphic design, mass communication, IT, business, multimedia, and animation in Kuala Lumpur.',
    highlights: ['Creative Programmes', 'Industry-Relevant Curriculum', 'Kuala Lumpur Campus', 'Affordable Tuition', 'Practical Training', 'MAHSA Group'],
    campusImage: `${import.meta.env.BASE_URL}images/Mahsa.jpeg`,
    logo: `${import.meta.env.BASE_URL}images/university-logos/maic.webp`,
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://maic.edu.my',
  },
];

function UniversityModal({ uni, onClose }: { uni: University; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="on-navy relative w-full max-w-[900px] max-h-[85vh] overflow-y-auto rounded-3xl"
        style={{ background: 'linear-gradient(135deg, #031D4C 0%, #052458 100%)', border: '1px solid rgb(var(--color-gold) / 0.3)', WebkitOverflowScrolling: 'touch' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close university details"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center text-cream/70 hover:text-cream transition-colors"
          style={{ background: 'rgb(var(--color-gold) / 0.1)' }}
        >
          ✕
        </button>

        <div className="relative h-[220px] overflow-hidden rounded-t-3xl">
          <img src={uni.campusImage} alt={uni.name} width={900} height={220} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-600 ease-out hover:scale-[1.08]" onError={(e) => { console.warn('Image failed:', uni.campusImage); e.currentTarget.style.opacity = '0.15'; }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(11,30,66,1) 0%, transparent 60%)' }} />
          <div className="absolute bottom-4 left-6 right-16">
            <span className="px-3 py-1 rounded-full text-[10px] font-body uppercase tracking-widest mb-2 inline-block"
              style={{ background: uni.type === 'Public' ? 'rgba(212,248,122,0.2)' : 'rgb(var(--color-gold) / 0.2)', color: uni.type === 'Public' ? '#D4F87A' : 'rgb(var(--color-gold))', border: `1px solid ${uni.type === 'Public' ? 'rgba(212,248,122,0.4)' : 'rgb(var(--color-gold) / 0.4)'}` }}>
              {uni.type} University
            </span>
            <h2 className="font-display font-bold text-kimono" style={{ fontSize: 'clamp(20px, 3vw, 32px)', letterSpacing: '0.02em' }}>{uni.name}</h2>
            <p className="font-body text-mouse text-sm mt-1">📍 {uni.location}</p>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <div className="grid grid-cols-3 gap-4 mb-8 p-4 rounded-2xl" style={{ background: 'rgb(var(--color-gold) / 0.08)', border: '1px solid rgb(var(--color-gold) / 0.15)' }}>
            {[
              { label: 'Founded', value: uni.founded },
              { label: 'Students', value: uni.students },
              { label: 'Ranking', value: uni.ranking },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="font-display font-bold text-gold text-lg">{stat.value}</p>
                <p className="font-body text-mouse text-xs uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="font-body font-semibold text-gold mb-3 uppercase tracking-widest text-xs">About</h3>
              <p className="font-serif font-light text-cream/75 text-sm leading-relaxed mb-6">{uni.description}</p>

              <h3 className="font-body font-semibold text-gold mb-3 uppercase tracking-widest text-xs">Programmes</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {uni.programmes.map(p => (
                  <span key={p} className="text-[11px] px-3 py-1 rounded-full font-body text-cream/70" style={{ background: 'rgb(var(--color-gold) / 0.07)', border: '1px solid rgb(var(--color-gold) / 0.1)' }}>{p}</span>
                ))}
              </div>

              <h3 className="font-body font-semibold text-gold mb-3 uppercase tracking-widest text-xs">Study Levels</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {uni.studyLevels.map(s => (
                  <span key={s} className="text-[11px] px-3 py-1 rounded-full font-body text-cream/70" style={{ background: 'rgb(var(--color-gold) / 0.07)', border: '1px solid rgb(var(--color-gold) / 0.1)' }}>{s}</span>
                ))}
              </div>

              <h3 className="font-body font-semibold text-gold mb-3 uppercase tracking-widest text-xs">Highlights</h3>
              <ul className="space-y-2">
                {uni.highlights.map(h => (
                  <li key={h} className="flex items-center gap-2 text-cream/70 text-sm font-body">
                    <span style={{ color: 'rgb(var(--color-gold))' }}>✓</span> {h}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <a
                href={`https://wa.me/60175631621?text=Hi, I'm interested in studying at ${uni.name}. Please help me with the application.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-body text-sm uppercase tracking-widest text-kimono transition-all duration-300 hover:scale-[1.02] mb-3"
                style={{ background: '#25D366' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Apply via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type TypeFilter = 'All' | 'Private' | 'Public';

const RECENT_PLACEMENTS = [
  'Nusrat → MMU',
  'Tanvir → Asia Pacific',
  'Arisha → Taylor’s',
  'Rahim → Monash',
  'Sadia → Sunway',
  'Imran → UCSI',
  'Faiza → Heriot-Watt',
  'Karim → APU',
];

export default function ExploreUniversitiesPage() {
  const navigate = useNavigate();
  const splashRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);
  const marqueePausedRef = useRef(false);
  const typeFilterJustChangedRef = useRef(false);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [splashVisible, setSplashVisible] = useState(true);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [headerCount, setHeaderCount] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    return () => {
      if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, []);

  const typeCounts = useMemo(() => ({
    all: allUniversities.length,
    private: allUniversities.filter(u => u.type === 'Private').length,
    public: allUniversities.filter(u => u.type === 'Public').length,
  }), []);

  const filteredUniversities = useMemo(() => {
    const byType = typeFilter === 'All'
      ? [...allUniversities]
      : allUniversities.filter(u => u.type === typeFilter);
    const byCity = selectedCity
      ? byType.filter(u => u.location.toLowerCase().includes(selectedCity.toLowerCase()))
      : byType;
    const sorted = byCity.sort((a, b) => a.name.localeCompare(b.name));
    if (!searchQuery.trim()) return sorted;
    const q = searchQuery.toLowerCase();
    return sorted.filter(uni =>
      uni.name.toLowerCase().includes(q) ||
      uni.shortName.toLowerCase().includes(q) ||
      uni.location.toLowerCase().includes(q) ||
      uni.programmes.some(p => p.toLowerCase().includes(q)) ||
      uni.studyLevels.some(s => s.toLowerCase().includes(q))
    );
  }, [searchQuery, typeFilter, selectedCity]);

  useEffect(() => {
    if (!splashRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setSplashVisible(false);
      }
    });

    // Phase 1: Gold particles pop in
    tl.fromTo('.splash-dot',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, stagger: 0.02, ease: 'back.out(2)' }
    )
    // Phase 2: Reveal text
    .fromTo('.splash-text',
      { opacity: 0, y: 40, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.3'
    )
    // Phase 3: Subtitle
    .fromTo('.splash-subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    )
    // Phase 4: Hold
    .to({}, { duration: 1.5 })
    // Phase 5: Fade out splash
    .to(splashRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
    });

    return () => { tl.kill(); };
  }, []);

  useEffect(() => {
    if (!splashVisible && contentRef.current) {
      // Fade in content container
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
      // Initial card stagger — only on first load
      gsap.fromTo('.uni-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.03, ease: 'power2.out', delay: 0.3 }
      );
    }
  }, [splashVisible]);

  // When search results change, ensure all cards are visible; when type filter changes, stagger in
  useEffect(() => {
    if (splashVisible || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.uni-card');
    if (cards.length === 0) return;
    if (typeFilterJustChangedRef.current) {
      typeFilterJustChangedRef.current = false;
      gsap.fromTo(cards,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.03, ease: 'power2.out' }
      );
    } else {
      gsap.set(cards, { opacity: 1, y: 0 });
    }
  }, [filteredUniversities.length, splashVisible, typeFilter]);

  // Live counter for "30+ Partner Universities"
  useEffect(() => {
    if (splashVisible) return;
    if (prefersReducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeaderCount(30);
      return;
    }
    setHeaderCount(0);
    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: 30,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => setHeaderCount(Math.round(obj.val)),
    });
    return () => { tween.kill(); };
  }, [splashVisible, prefersReducedMotion]);

  // Recently placed marquee animation
  useEffect(() => {
    const track = marqueeTrackRef.current;
    if (!track) return;
    if (prefersReducedMotion) {
      track.style.transform = 'translateX(0)';
      return;
    }
    let pos = 0;
    let raf = 0;
    let lastTime = performance.now();
    const speed = 40;
    let started = false;

    const animate = (now: number) => {
      if (marqueePausedRef.current) {
        lastTime = now;
        raf = requestAnimationFrame(animate);
        return;
      }
      const singleWidth = track.scrollWidth / 2;
      if (singleWidth === 0) {
        raf = requestAnimationFrame(animate);
        return;
      }
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      pos -= speed * delta;
      if (Math.abs(pos) >= singleWidth) pos = 0;
      track.style.transform = `translateX(${pos}px)`;
      raf = requestAnimationFrame(animate);
    };

    const timer = window.setTimeout(() => {
      started = true;
      lastTime = performance.now();
      raf = requestAnimationFrame(animate);
    }, 250);

    return () => {
      window.clearTimeout(timer);
      if (started) cancelAnimationFrame(raf);
    };
  }, [prefersReducedMotion]);

  const handleTypeFilter = (next: TypeFilter) => {
    if (next === typeFilter) return;
    const cards = gridRef.current?.querySelectorAll('.uni-card');
    if (!cards || cards.length === 0) {
      typeFilterJustChangedRef.current = true;
      setTypeFilter(next);
      return;
    }
    gsap.to(cards, {
      opacity: 0,
      y: -8,
      duration: 0.2,
      ease: 'power2.in',
      stagger: 0.015,
      onComplete: () => {
        typeFilterJustChangedRef.current = true;
        setTypeFilter(next);
      },
    });
  };

  return (
    <>
      <style>{`@keyframes kenBurnsFeatured { from { transform: scale(1) translate(0, 0); } to { transform: scale(1.12) translate(-2%, -1.5%); } } .uni-image { transition: transform 500ms ease-out; } .uni-card:hover .uni-image { transform: scale(1.05); } @keyframes cityBannerIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } } @media (prefers-reduced-motion: reduce) { .uni-image { transition: none; } .uni-card:hover .uni-image { transform: none; } }`}</style>
      {selectedUni && <UniversityModal uni={selectedUni} onClose={() => setSelectedUni(null)} />}

      {/* Splash Screen */}
      {splashVisible && (
        <div
          ref={splashRef}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: 'rgb(var(--color-mist))' }}
        >
          {/* Magic particles */}
          <div className="absolute inset-0 overflow-hidden">
            {SPLASH_DOTS.map((dot, i) => (
              <div
                key={dot.width + dot.height + dot.left + dot.top + i}
                className="splash-dot absolute rounded-full"
                style={{
                  width: dot.width,
                  height: dot.height,
                  left: dot.left,
                  top: dot.top,
                  background: dot.background,
                  boxShadow: '0 0 8px rgb(var(--color-gold) / 0.6)',
                }}
              />
            ))}
          </div>

          {/* Radial glow */}
          <div className="absolute w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgb(var(--color-gold) / 0.15) 0%, transparent 70%)' }} />

          {/* Text */}
          <div className="relative z-10 text-center px-6">
            <div className="splash-text" style={{ opacity: 0 }}>
              <h1
                className="font-display font-bold uppercase"
                style={{
                  fontSize: 'clamp(32px, 8vw, 72px)',
                  letterSpacing: '0.15em',
                  background: 'linear-gradient(135deg, rgb(var(--color-gold)) 0%, #FFD700 40%, #D4AF37 60%, rgb(var(--color-gold)) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: 'none',
                  filter: 'drop-shadow(0 0 30px rgb(var(--color-gold) / 0.3))',
                }}
              >
                PATHWAY TO
              </h1>
              <h1
                className="font-display font-bold uppercase -mt-2"
                style={{
                  fontSize: 'clamp(36px, 9vw, 80px)',
                  letterSpacing: '0.2em',
                  background: 'linear-gradient(135deg, #FFD700 0%, rgb(var(--color-gold)) 50%, #FFD700 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 40px rgba(255,215,0,0.4))',
                }}
              >
                SUCCESS
              </h1>
            </div>
            <div className="splash-subtitle mt-6" style={{ opacity: 0 }}>
              <p className="font-body text-cream/60 uppercase tracking-[0.3em]" style={{ fontSize: 'clamp(10px, 1.5vw, 13px)' }}>
                Explore 30+ Partner Universities
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-12 h-px" style={{ background: 'rgb(var(--color-gold) / 0.4)' }} />
                <div className="w-2 h-2 rounded-full" style={{ background: 'rgb(var(--color-gold))' }} />
                <div className="w-12 h-px" style={{ background: 'rgb(var(--color-gold) / 0.4)' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content — always rendered underneath */}
      <div ref={contentRef} style={{ opacity: splashVisible ? 0 : 1, minHeight: '100vh', background: 'rgb(var(--color-mist))' }}>
        {/* Top bar */}
        <div className="on-navy sticky top-0 z-50" style={{ background: 'rgba(11,26,51,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgb(var(--color-gold) / 0.15)' }}>
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-3 flex flex-wrap items-center gap-2">
            {/* Left: HOME + nav links */}
            <div className="flex items-center gap-1 overflow-x-auto flex-nowrap scrollbar-none flex-shrink-0 max-w-full">
                <button
                  onClick={() => {
                    sessionStorage.setItem('scrollToSection', 'destinations');
                    navigate('/');
                  }}
                  className="flex items-center gap-1.5 text-gold/70 hover:text-gold transition-colors cursor-pointer font-body text-xs uppercase tracking-wider px-2 py-1.5 rounded-lg hover:bg-cream/5 flex-shrink-0"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  Back
                </button>
              <div className="w-px h-4 mx-1 flex-shrink-0" style={{ background: 'rgb(var(--color-gold) / 0.2)' }} />
              {([
                { label: 'About', id: 'about' },
                { label: 'Services', id: 'services' },
                { label: 'Pathways', id: 'destinations' },
                { label: 'Stories', id: 'testimonials' },
                { label: 'Contact', id: 'contact' },
              ] as const).map(({ label, id }) => (
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
            </div>

            {/* Center: Search */}
            <div className="relative flex-1 min-w-0 max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'rgb(var(--color-gold) / 0.5)' }}>
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-full font-body text-xs text-cream/90 placeholder:text-cream/60 outline-none"
                style={{ background: 'rgb(var(--color-gold) / 0.06)', border: '1px solid rgb(var(--color-gold) / 0.25)' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/60 hover:text-cream/70 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Right: count */}
            <span className="font-body text-xs text-cream/60 whitespace-nowrap flex-shrink-0">
              {filteredUniversities.length}
            </span>
          </div>
        </div>

        {/* Page header */}
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-12 pb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex-1 min-w-0">
            <div className="w-16 h-px mb-6" style={{ background: 'rgb(var(--color-gold) / 0.5)' }} />
            <h2 className="font-display font-bold text-kimono uppercase"
              style={{ fontSize: 'clamp(28px, 5vw, 52px)', letterSpacing: '0.05em', lineHeight: 1.1 }}>
              ALL PARTNER<br />
              <span style={{ WebkitTextStroke: '1px rgb(var(--color-gold) / 0.5)', color: 'transparent' }}>UNIVERSITIES</span>
            </h2>
            <p className="font-serif font-light text-cream/60 mt-4 max-w-[500px]" style={{ fontSize: 'clamp(14px, 1.5vw, 18px)', lineHeight: 1.7 }}>
              Browse all{' '}
              <span
                className="font-display font-bold text-gold"
                style={{ display: 'inline-block', minWidth: '1.6em', textAlign: 'left' }}
              >
                {headerCount}
              </span>
              + partner universities. Search by name, programme, or course to find your perfect match.
            </p>
          </div>
          <div className="flex-shrink-0 hidden md:flex items-center gap-6">
            <MalaysiaMap
              selectedPin={selectedCity}
              onPinSelect={(label) => {
                setSelectedCity(label);
                if (label && gridRef.current) {
                  window.setTimeout(() => {
                    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 60);
                }
              }}
            />
            <img
              src={`${import.meta.env.BASE_URL}images/logo.webp`}
              alt="Absolute Consultancy"
              width="180"
              height="180"
              loading="lazy"
              decoding="async"
              className="w-36 h-36 lg:w-44 lg:h-44 object-contain"
              style={{
                filter: 'drop-shadow(0 0 24px rgb(var(--color-gold) / 0.18))',
              }}
            />
          </div>
        </div>

        {/* Recently placed marquee (md+) */}
        <div className="hidden md:block max-w-[1280px] mx-auto px-6 lg:px-10 mb-10">
          <div
            className="on-navy relative overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, rgba(11,30,66,0.7) 0%, rgba(11,42,92,0.7) 50%, rgba(11,30,66,0.7) 100%)',
              border: '1px solid rgb(var(--color-gold) / 0.2)',
              borderRadius: '999px',
              height: '44px',
            }}
            onMouseEnter={() => { marqueePausedRef.current = true; }}
            onMouseLeave={() => { marqueePausedRef.current = false; }}
          >
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 font-body uppercase tracking-widest text-gold/70 pointer-events-none"
              style={{ fontSize: '10px', letterSpacing: '0.2em' }}
            >
              ★ Recently Placed
            </span>
            <div
              ref={marqueeTrackRef}
              className="flex items-center h-full whitespace-nowrap will-change-transform"
              style={{ width: 'max-content', paddingLeft: '160px' }}
            >
              {[...RECENT_PLACEMENTS, ...RECENT_PLACEMENTS].map((p, i) => (
                <span
                  key={i}
                  className="inline-flex items-center flex-shrink-0 font-body"
                  style={{
                    fontSize: '11px',
                    color: 'rgb(var(--color-cream))',
                    background: 'linear-gradient(90deg, rgb(var(--color-gold) / 0.18) 0%, rgb(var(--color-gold) / 0.06) 100%)',
                    border: '1px solid rgb(var(--color-gold) / 0.25)',
                    borderRadius: '999px',
                    height: '26px',
                    padding: '0 14px',
                    margin: '0 6px',
                    letterSpacing: '0.05em',
                    gap: '6px',
                  }}
                >
                  <span style={{ color: 'rgb(var(--color-gold))' }}>🎓</span> {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Universities Grid */}
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pb-20">
          {/* Active city banner */}
          {selectedCity && (
            <div
              className="mb-5 flex items-center justify-between gap-3 px-4 py-2.5 rounded-full"
              style={{
                background: 'linear-gradient(90deg, rgb(var(--color-gold) / 0.12) 0%, rgb(var(--color-gold) / 0.04) 100%)',
                border: '1px solid rgb(var(--color-gold) / 0.4)',
                animation: 'cityBannerIn 350ms ease-out',
              }}
            >
              <span className="font-body text-xs text-cream/80 flex items-center gap-2" style={{ letterSpacing: '0.08em' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--color-gold))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-gold font-semibold uppercase">{selectedCity}</span>
                <span className="text-cream/60">·</span>
                <span>{filteredUniversities.length} {filteredUniversities.length === 1 ? 'university' : 'universities'}</span>
              </span>
              <button
                onClick={() => setSelectedCity(null)}
                className="font-body text-xs uppercase tracking-wider text-cream/60 hover:text-gold cursor-pointer flex items-center gap-1.5 transition-colors duration-200"
                aria-label="Clear city filter"
              >
                Clear
                <span aria-hidden>✕</span>
              </button>
            </div>
          )}
          {/* Type filter pills */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {(['All', 'Private', 'Public'] as const).map(filter => {
              const count = filter === 'All' ? typeCounts.all : filter === 'Private' ? typeCounts.private : typeCounts.public;
              const isActive = typeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => handleTypeFilter(filter)}
                  className="px-5 py-2 rounded-full font-body text-xs uppercase tracking-wider cursor-pointer"
                  style={{
                    background: isActive ? 'rgb(var(--color-gold))' : 'transparent',
                    color: isActive ? '#FFFFFF' : 'rgb(var(--color-gold))',
                    border: `1px solid ${isActive ? 'rgb(var(--color-gold))' : 'rgb(var(--color-gold) / 0.4)'}`,
                    fontWeight: isActive ? 700 : 500,
                    transition: 'background 250ms ease, color 250ms ease, border-color 250ms ease, transform 200ms ease',
                    letterSpacing: '0.12em',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.borderColor = 'rgb(var(--color-gold))';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.borderColor = 'rgb(var(--color-gold) / 0.4)';
                  }}
                >
                  {filter} <span style={{ opacity: isActive ? 0.7 : 0.6 }}>({count})</span>
                </button>
              );
            })}
          </div>

          {filteredUniversities.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-body text-cream/60 text-lg">
                No universities found
                {searchQuery && ` matching "${searchQuery}"`}
                {typeFilter !== 'All' && ` in ${typeFilter}`}
                {selectedCity && ` in ${selectedCity}`}
              </p>
              <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-6 py-2 rounded-full font-body text-sm uppercase tracking-wider cursor-pointer"
                    style={{ border: '1px solid rgb(var(--color-gold) / 0.4)', color: 'rgb(var(--color-gold))' }}
                  >
                    Clear Search
                  </button>
                )}
                {typeFilter !== 'All' && (
                  <button
                    onClick={() => handleTypeFilter('All')}
                    className="px-6 py-2 rounded-full font-body text-sm uppercase tracking-wider cursor-pointer"
                    style={{ border: '1px solid rgb(var(--color-gold) / 0.4)', color: 'rgb(var(--color-gold))' }}
                  >
                    Show All Types
                  </button>
                )}
                {selectedCity && (
                  <button
                    onClick={() => setSelectedCity(null)}
                    className="px-6 py-2 rounded-full font-body text-sm uppercase tracking-wider cursor-pointer"
                    style={{ border: '1px solid rgb(var(--color-gold) / 0.4)', color: 'rgb(var(--color-gold))' }}
                  >
                    Show All Cities
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUniversities.map((uni) => (
                <div
                  key={uni.name}
                  className="uni-card rounded-2xl overflow-hidden cursor-pointer group relative flex flex-col"
                  style={{
                    background: 'rgb(var(--color-gold) / 0.03)',
                    border: '1px solid rgb(var(--color-gold) / 0.07)',
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                    transition: 'transform 180ms ease-out, border-color 300ms ease, background 300ms ease, box-shadow 300ms ease',
                    minHeight: '380px',
                  }}
                  onMouseMove={e => {
                    if (prefersReducedMotion) return;
                    const el = e.currentTarget;
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const rotateY = ((x / rect.width) - 0.5) * 8;
                    const rotateX = ((y / rect.height) - 0.5) * -8;
                    el.style.transition = 'transform 80ms ease-out, border-color 200ms ease, background 200ms ease, box-shadow 250ms ease';
                    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
                    el.style.borderColor = 'rgb(var(--color-gold) / 0.55)';
                    el.style.background = 'rgb(var(--color-gold) / 0.06)';
                    el.style.boxShadow = `0 25px 50px rgba(0,0,0,0.45), 0 0 0 1px rgb(var(--color-gold) / 0.35), inset 0 1px 0 rgb(var(--color-gold) / 0.15)`;
                    const dot = el.querySelector('.tilt-dot') as HTMLElement | null;
                    if (dot) {
                      dot.style.left = `${x}px`;
                      dot.style.top = `${y}px`;
                      dot.style.opacity = '1';
                    }
                  }}
                  onMouseEnter={e => {
                    if (prefersReducedMotion) {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.borderColor = `${uni.accent}60`;
                      e.currentTarget.style.background = 'rgb(var(--color-gold) / 0.06)';
                    }
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget;
                    el.style.transition = 'transform 500ms ease, border-color 400ms ease, background 400ms ease, box-shadow 400ms ease';
                    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
                    el.style.borderColor = 'rgb(var(--color-gold) / 0.07)';
                    el.style.background = 'rgb(var(--color-gold) / 0.03)';
                    el.style.boxShadow = 'none';
                    const dot = el.querySelector('.tilt-dot') as HTMLElement | null;
                    if (dot) dot.style.opacity = '0';
                  }}
                  onClick={() => setSelectedUni(uni)}
                >
                  <span
                    className="tilt-dot absolute w-2.5 h-2.5 rounded-full pointer-events-none"
                    style={{
                      background: 'rgb(var(--color-gold))',
                      boxShadow: '0 0 14px rgb(var(--color-gold) / 0.9), 0 0 4px rgba(255,215,0,0.6)',
                      transform: 'translate(-50%, -50%)',
                      opacity: 0,
                      transition: 'opacity 250ms ease',
                      zIndex: 5,
                    }}
                    aria-hidden="true"
                  />

                  {/* The scrim over the photo is dark, so the tokens inside it
                      have to resolve to their on-navy values or the title and
                      badges come out navy-on-navy. */}
                  <div className="on-navy relative overflow-hidden" style={{ height: '200px', flexShrink: 0 }}>
                    <div
                      className="absolute inset-0"
                      style={{
                        animation: !prefersReducedMotion
                          ? 'kenBurnsFeatured 9s ease-in-out infinite alternate'
                          : 'none',
                      }}
                    >
                      <img
                        src={uni.campusImage}
                        alt={uni.name}
                        loading="lazy"
                        decoding="async"
                        className="uni-image w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.opacity = '0.15'; }}
                      />
                    </div>
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: 'linear-gradient(to top, rgba(11,26,51,0.97) 0%, rgba(11,26,51,0.5) 45%, transparent 75%)' }}
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-[9px] font-body uppercase tracking-wider"
                        style={{ background: 'rgb(var(--color-gold))', color: '#021635', fontWeight: 700, letterSpacing: '0.12em' }}
                      >
                        ★ Featured
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-[9px] font-body uppercase tracking-wider"
                        style={{
                          background: uni.type === 'Public' ? 'rgba(212,248,122,0.2)' : 'rgb(var(--color-gold) / 0.2)',
                          color: uni.type === 'Public' ? '#D4F87A' : 'rgb(var(--color-gold))',
                          border: `1px solid ${uni.type === 'Public' ? 'rgba(212,248,122,0.4)' : 'rgb(var(--color-gold) / 0.4)'}`,
                        }}
                      >
                        {uni.type}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 flex items-end gap-3 p-4">
                      {/* White tile behind the mark: most partner logos are dark
                          artwork on transparent, which would vanish against the
                          scrim. Institutions the catalogue does not carry fall
                          back to the wordmark. Hidden from assistive tech — the
                          name is right beside it. */}
                      <div aria-hidden="true" className="shrink-0">
                        {uni.logo ? (
                          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white p-1.5 shadow-md">
                            <img
                              src={uni.logo}
                              alt=""
                              width={44}
                              height={44}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-contain"
                            />
                          </div>
                        ) : (
                          <UniversityLogo shortName={uni.shortName} accent={uni.accent} size={44} />
                        )}
                      </div>
                      <div className="min-w-0">
                      <h3
                        className="font-display font-bold text-kimono leading-tight"
                        style={{ fontSize: 'clamp(15px, 1.5vw, 18px)', letterSpacing: '0.02em' }}
                      >
                        {uni.name}
                      </h3>
                      <p
                        className="font-body text-mouse mt-1.5 flex items-center gap-1"
                        style={{ fontSize: '11px' }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                        {uni.location}
                      </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <p
                      className="font-serif font-light text-cream/65"
                      style={{
                        fontSize: '12px',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {uni.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {uni.programmes.slice(0, 3).map(p => (
                        <span key={p} className="text-[9px] px-2 py-0.5 rounded font-body text-mouse" style={{ background: 'rgb(var(--color-gold) / 0.05)' }}>{p}</span>
                      ))}
                      {uni.programmes.length > 3 && (
                        <span className="text-[9px] px-2 py-0.5 rounded font-body text-gold/60" style={{ background: 'rgb(var(--color-gold) / 0.08)' }}>+{uni.programmes.length - 3} more</span>
                      )}
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-[10px] font-body text-mouse">{uni.ranking}</span>
                      <span className="text-[11px] font-body text-gold/70 group-hover:text-gold transition-colors flex items-center gap-1">
                        View Details
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
