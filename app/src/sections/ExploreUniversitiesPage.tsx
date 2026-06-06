import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import * as React from 'react';

// Pre-generated splash dot positions to avoid impure Math.random during render
const SPLASH_DOTS = Array.from({ length: 40 }, (_, i) => ({
  width: Math.random() * 6 + 2,
  height: Math.random() * 6 + 2,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  background: i % 3 === 0 ? '#C9A234' : i % 3 === 1 ? '#D4AF37' : '#FFD700',
}));

interface University {
  name: string;
  shortName: string;
  location: string;
  type: string;
  programmes: string[];
  courses: string[];
  accent: string;
  tag: string;
  founded: string;
  students: string;
  ranking: string;
  description: string;
  highlights: string[];
  campusImage: string;
  campusTourVideo: string;
  website: string;
}

const allUniversities: University[] = [
  {
    name: 'Asia Pacific University (APU)',
    shortName: 'APU',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['IT', 'Engineering', 'Business', 'Computing', 'Design', 'Actuarial Science', 'Marketing', 'Psychology'],
    courses: ['BSc (Hons) in Computer Science', 'BSc (Hons) in Software Engineering', 'BEng (Hons) in Electrical & Electronic Engineering', 'BA (Hons) in Business Management', 'BSc (Hons) in Information Technology', 'BA (Hons) in Digital Marketing', 'BSc (Hons) in Actuarial Science', 'BA (Hons) in Design & Multimedia'],
    accent: '#1A3A6B',
    tag: '5-Star SETARA',
    founded: '1993',
    students: '12,000+',
    ranking: 'QS World Top 401+ | 5-Star SETARA',
    description: "One of Malaysia's highest-rated universities with a 5-Star SETARA rating. APU is especially strong in technology and computing, with students from over 130 countries making it one of the most diverse campuses in Malaysia.",
    highlights: ['5-Star SETARA Rating', '130+ Nationalities on Campus', 'QS Top 401+', 'Strong IT & Computing', 'Excellent Graduate Employability', 'Modern KL Campus'],
    campusImage: '/University Photos/AsiaPacificUniversity.jpeg',
    campusTourVideo: 'https://www.youtube.com/embed/OhmGgJV9qNI',
    website: 'https://www.apu.edu.my',
  },
  {
    name: 'INTI International University',
    shortName: 'INTI',
    location: 'Nilai, Negeri Sembilan',
    type: 'Private',
    programmes: ['Business', 'Engineering', 'Computing', 'Hospitality', 'Health Sciences', 'Arts & Design', 'Culinary'],
    courses: ['BA (Hons) Business Administration', 'BEng (Hons) Civil Engineering', 'BSc (Hons) Computer Science', 'BA (Hons) Hotel Management', 'BSc (Hons) Physiotherapy', 'BA (Hons) Graphic Design', 'Diploma in Culinary Arts'],
    accent: '#CC4400',
    tag: 'International Network',
    founded: '1986',
    students: '8,000+',
    ranking: 'Top 5 Private Universities in Malaysia',
    description: 'With campuses in Nilai and Subang Jaya, INTI offers globally recognised qualifications through its international university partnerships. Students can transfer credits or complete degrees at partner universities worldwide.',
    highlights: ['International Transfer Programmes', 'Partner Universities Worldwide', 'Nilai & Subang Campuses', 'Top 5 Private Universities', 'Strong Hospitality School', 'Hope Education Group'],
    campusImage: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/W1himgzsyLQ',
    website: 'https://newinti.edu.my',
  },
  {
    name: "Taylor's University",
    shortName: "Taylor's",
    location: 'Subang Jaya, Selangor',
    type: 'Private',
    programmes: ['Hospitality', 'Law', 'Architecture', 'Business', 'Medicine', 'Engineering', 'Education', 'Pharmacy'],
    courses: ['BA (Hons) International Hospitality Management', 'LLB (Hons) Bachelor of Laws', 'Bachelor of Architecture', 'BSc (Hons) Accounting & Finance', 'Bachelor of Medicine', 'BEng (Hons) Mechanical Engineering', 'BED (Hons) Primary Education', 'Master of Pharmacy'],
    accent: '#4A0080',
    tag: 'Award Winning',
    founded: '1969',
    students: '12,000+',
    ranking: 'QS World #253 (2026)',
    description: "One of Malaysia's oldest and most reputable private institutions. Taylor's is globally recognised for its Hospitality, Law, and Architecture programmes, and offers award-winning degrees in a beautiful Subang Jaya campus.",
    highlights: ['Established 1969', 'Award-Winning Hospitality School', 'MyQUEST 2022 Competitive', 'QS World #253', 'Beautiful Campus', 'Strong Industry Partnerships'],
    campusImage: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/NSuKhrtt9zo',
    website: 'https://university.taylors.edu.my',
  },
  {
    name: 'UCSI University',
    shortName: 'UCSI',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Medicine', 'Pharmacy', 'Architecture', 'Music', 'Business', 'Engineering', 'Computer Science'],
    courses: ['MBBS Bachelor of Medicine', 'Master of Pharmacy', 'Bachelor of Architecture', 'BMus (Hons) Classical Music', 'BBA (Hons) Finance', 'BEng (Hons) Chemical Engineering', 'BSc (Hons) Data Science'],
    accent: '#1B5E20',
    tag: 'QS Ranked',
    founded: '1986',
    students: '10,000+',
    ranking: 'QS World Top 601+',
    description: 'A leading private university in KL offering over 100 programmes. UCSI is especially renowned for its Medicine, Pharmacy, and Architecture programmes, and boasts a rooftop bar and vibrant student life.',
    highlights: ['QS World Ranked', 'Top Medicine & Pharmacy', 'Award-Winning Architecture', 'Rooftop Campus Facilities', 'Strong Alumni Network', 'Located in KL'],
    campusImage: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/07RlVINKWU4',
    website: 'https://www.ucsiuniversity.edu.my',
  },
  {
    name: 'University of Wollongong Malaysia',
    shortName: 'UOW',
    location: 'Glenmarie, Shah Alam',
    type: 'Private',
    programmes: ['Business', 'Engineering', 'Computing', 'Communication', 'Creative Arts', 'Health Sciences'],
    courses: ['BCom (Hons) Accounting', 'BEng (Hons) Electrical Engineering', 'BSc (Hons) Computer Science', 'BA (Hons) Communication', 'BA (Hons) Digital Media', 'BSc (Hons) Nursing'],
    accent: '#0B3D91',
    tag: 'Australian Partner',
    founded: '2004',
    students: '5,000+',
    ranking: 'QS World Top 500+ (Main Campus)',
    description: 'UOW Malaysia is a branch campus of the University of Wollongong, Australia, ranked among the top 1% of universities worldwide. Students earn an Australian degree in Malaysia with the option to transfer to Wollongong campus in Australia.',
    highlights: ['Australian University Degree', 'Transfer to Australia', 'QS World Top 500+', 'Strong Engineering & IT', 'Modern Glenmarie Campus', 'Global Recognition'],
    campusImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.uow.edu.my',
  },
  {
    name: 'University of Cyberjaya (UoC)',
    shortName: 'UoC',
    location: 'Cyberjaya, Selangor',
    type: 'Private',
    programmes: ['Medicine', 'Pharmacy', 'IT', 'Business', 'Health Sciences', 'Nursing', 'Biomedical Engineering', 'Psychology'],
    courses: ['MBBS Bachelor of Medicine & Surgery', 'Master of Pharmacy', 'BSc (Hons) Biomedical Engineering', 'BSc (Hons) Nursing', 'BSc (Hons) Psychology', 'BBA (Hons) Healthcare Management', 'BSc (Hons) Medical Biotechnology'],
    accent: '#005A8B',
    tag: 'Health Focus',
    founded: '2005',
    students: '4,000+',
    ranking: 'QS Top 601+ | 5-Star SETARA',
    description: "Located in Malaysia's smart city Cyberjaya, UoC is a premier health sciences university with a 5-Star SETARA rating. It excels in Medicine, Pharmacy, and Nursing with a state-of-the-art eco-friendly campus.",
    highlights: ['5-Star SETARA Rating', 'Top Medicine & Health Sciences', 'Eco-Friendly Smart Campus', 'QS Top 601+', 'Top 200 Global Health SDG Ranking', 'Located in Cyberjaya'],
    campusImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/irmFggZ7DN4',
    website: 'https://cyberjaya.edu.my',
  },
  {
    name: 'International Islamic University Malaysia (IIUM)',
    shortName: 'IIUM',
    location: 'Gombak, Selangor',
    type: 'Public',
    programmes: ['Islamic Studies', 'Law', 'Engineering', 'Medicine', 'Economics', 'IT', 'Architecture'],
    courses: ['LLB Bachelor of Laws (Shariah & Civil)', 'BEng (Hons) Mechanical Engineering', 'MBBS Doctor of Medicine', 'BBA (Hons) Economics', 'BSc (Hons) Computer Science', 'Bachelor of Architecture', 'BA (Hons) Islamic Revealed Knowledge'],
    accent: '#006400',
    tag: 'Top Public Islamic',
    founded: '1983',
    students: '30,000+',
    ranking: 'QS World Top 601+',
    description: 'A premier public university established by the Organisation of Islamic Cooperation. IIUM integrates Islamic values with modern academic disciplines, renowned for its Law, Engineering, and Medicine programmes.',
    highlights: ['Established by OIC', '100+ Countries Represented', 'Dual-Language (English & Arabic)', 'Top Islamic Law Programme', 'Affordable Public Fees', 'Beautiful Gombak Campus'],
    campusImage: 'https://images.unsplash.com/photo-1592280762920-9fb0e84e51d1?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.iium.edu.my',
  },
  {
    name: 'KL University of Science & Technology',
    shortName: 'KLUST',
    location: 'Kajang, Selangor',
    type: 'Private',
    programmes: ['Engineering', 'IT', 'Business', 'Design', 'Hospitality', 'Education'],
    courses: ['BEng (Hons) Mechanical Engineering', 'BSc (Hons) Software Engineering', 'BBA (Hons) Management', 'BA (Hons) Interior Design', 'BA (Hons) Hotel Management', 'BED (Hons) Education'],
    accent: '#B8860B',
    tag: 'Science & Tech',
    founded: '2000',
    students: '3,000+',
    ranking: 'MQA Accredited',
    description: 'KL University of Science & Technology (KLUST) focuses on applied science, technology, and engineering education. Located in Kajang, it offers practical, industry-oriented programmes with modern labs and facilities.',
    highlights: ['Applied Science Focus', 'Industry-Oriented Curriculum', 'Modern Labs & Facilities', 'Affordable Tuition', 'Small Class Sizes', 'Kajang Campus'],
    campusImage: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.klust.edu.my',
  },
  {
    name: 'MAHSA University',
    shortName: 'MAHSA',
    location: 'Bandar Saujana Putra, Selangor',
    type: 'Private',
    programmes: ['Medicine', 'Nursing', 'Pharmacy', 'Engineering', 'Dentistry', 'Business'],
    courses: ['MBBS Bachelor of Medicine', 'BSc (Hons) Nursing', 'Master of Pharmacy', 'BEng (Hons) Biomedical Engineering', 'Bachelor of Dental Surgery', 'BBA (Hons) Healthcare Management'],
    accent: '#C62828',
    tag: 'Medical Sciences',
    founded: '2005',
    students: '5,000+',
    ranking: 'MQA Accredited | 5-Star SETARA',
    description: 'MAHSA University specialises in medical and health sciences education, offering one of the most comprehensive ranges of health programmes in Malaysia. Located in Bandar Saujana Putra, it features modern simulation labs.',
    highlights: ['5-Star SETARA Rating', 'Comprehensive Medical Programmes', 'Modern Simulation Labs', 'Strong Clinical Partnerships', 'Affordable Medical Education', 'Bandar Saujana Campus'],
    campusImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.mahsa.edu.my',
  },
  {
    name: 'Multimedia University (MMU)',
    shortName: 'MMU',
    location: 'Cyberjaya, Selangor',
    type: 'Private',
    programmes: ['Computer Science', 'Engineering', 'Creative Multimedia', 'Business', 'Law', 'Cinematic Arts', 'Animation'],
    courses: ['BSc (Hons) Computer Science', 'BEng (Hons) Electronics Engineering', 'BA (Hons) Multimedia Arts', 'BBA (Hons) Business Analytics', 'LLB (Hons) Bachelor of Laws', 'BA (Hons) Cinematic Arts', 'BA (Hons) Animation & Visual Effects'],
    accent: '#7B0000',
    tag: 'Tech Leader',
    founded: '1994',
    students: '18,000+',
    ranking: 'QS Asia #207 (2025)',
    description: "Malaysia's first private university, founded by Telekom Malaysia. MMU is a premier research institution at the heart of the Multimedia Super Corridor (MSC), renowned for engineering, IT, creative multimedia, and strong industry connections.",
    highlights: ['Malaysia\'s First Private University', 'QS Asia Top 250', 'Olympic-sized Swimming Pool', '200-acre Campus', '13 Research Centres', 'Strong Tech Industry Links'],
    campusImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.mmu.edu.my',
  },
  {
    name: 'Nilai University',
    shortName: 'Nilai',
    location: 'Nilai, Negeri Sembilan',
    type: 'Private',
    programmes: ['Business', 'Engineering', 'Hospitality', 'Health Sciences', 'IT', 'Education'],
    courses: ['BBA (Hons) Accounting & Finance', 'BEng (Hons) Mechanical Engineering', 'BA (Hons) Hospitality Management', 'BSc (Hons) Nursing', 'BSc (Hons) Information Technology', 'BED (Hons) Education'],
    accent: '#2E7D32',
    tag: 'Campus Life',
    founded: '1997',
    students: '5,000+',
    ranking: 'MQA Accredited | SETARA Tier 5',
    description: 'Nilai University is located in the student town of Nilai, offering a vibrant campus life with modern facilities. Programmes in business, engineering, and hospitality are popular, and the campus features excellent sports and residential facilities.',
    highlights: ['Vibrant Campus Life', 'Modern Sports Facilities', 'On-Campus Accommodation', 'Diverse Programmes', 'Student Town Location', 'Established 1997'],
    campusImage: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.nilai.edu.my',
  },
  {
    name: 'SEGi University',
    shortName: 'SEGi',
    location: 'Petaling Jaya, Selangor',
    type: 'Private',
    programmes: ['Medicine', 'Dentistry', 'Business', 'Engineering', 'IT', 'Pharmacy', 'Education', 'Psychology'],
    courses: ['MBBS Bachelor of Medicine', 'Bachelor of Dental Surgery', 'BBA (Hons) Finance', 'BEng (Hons) Civil Engineering', 'BSc (Hons) Computer Science', 'Master of Pharmacy', 'BED (Hons) Early Childhood Education', 'BA (Hons) Psychology'],
    accent: '#006400',
    tag: 'Affordable',
    founded: '1977',
    students: '9,000+',
    ranking: 'SETARA Tier 5',
    description: 'One of Malaysia\'s oldest private institutions, SEGi offers affordable education across medicine, dentistry, engineering and business. Multiple campuses across Malaysia make it accessible to students nationwide.',
    highlights: ['Established 1977', 'Affordable Fees', 'Top Dentistry School', 'Multiple Campuses', 'Medicine & Pharmacy', 'Strong Industry Links'],
    campusImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/6mnJu2Oy7OI',
    website: 'https://www.segi.edu.my',
  },
  {
    name: 'Universiti Kuala Lumpur (UniKL)',
    shortName: 'UniKL',
    location: 'Kuala Lumpur',
    type: 'Public',
    programmes: ['Engineering', 'IT', 'Business', 'Aviation', 'Medical Sciences', 'Design'],
    courses: ['BEng (Hons) Aerospace Engineering', 'BSc (Hons) Software Engineering', 'BBA (Hons) Aviation Management', 'Bachelor of Aircraft Maintenance', 'BSc (Hons) Medical Imaging', 'BA (Hons) Fashion Design'],
    accent: '#1A237E',
    tag: 'Technical Focus',
    founded: '2002',
    students: '15,000+',
    ranking: 'MQA Accredited',
    description: 'UniKL is a multi-campus technical university owned by Majlis Amanah Rakyat (MARA). It specialises in engineering, aviation, and technical education with 14 institutes across Malaysia.',
    highlights: ['MARA-Owned University', '14 Institutes Nationwide', 'Aviation & Aerospace Focus', 'Strong Technical Training', 'Industry Partnerships', 'Affordable Public Fees'],
    campusImage: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.unikl.edu.my',
  },
  {
    name: 'Universiti Antarabangsa Abdul Razak (UNIRAZAK)',
    shortName: 'UNIRAZAK',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Business', 'Education', 'IT', 'Law', 'Accounting', 'Humanities'],
    courses: ['BBA (Hons) Business Administration', 'BED (Hons) Education', 'BSc (Hons) Information Systems', 'LLB (Hons) Bachelor of Laws', 'BCom (Hons) Accounting', 'BA (Hons) English & Communication'],
    accent: '#880E4F',
    tag: 'Business & Education',
    founded: '1997',
    students: '6,000+',
    ranking: 'MQA Accredited',
    description: 'UNIRAZAK is a private university in KL known for its strong business, education, and accounting programmes. Named after Malaysia\'s second Prime Minister, it produces graduates with strong managerial and leadership skills.',
    highlights: ['Strong Business Programme', 'Education & Teaching Focus', 'Named After Tun Abdul Razak', 'Located in KL', 'Affordable Tuition', 'Leadership Development'],
    campusImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.unirazak.edu.my',
  },
  {
    name: 'Universiti Tunku Abdul Rahman (UNITAR)',
    shortName: 'UNITAR',
    location: 'Kampar, Perak / Petaling Jaya, Selangor',
    type: 'Private',
    programmes: ['Business', 'IT', 'Engineering', 'Education', 'Communication', 'Chinese Studies'],
    courses: ['BBA (Hons) Marketing', 'BSc (Hons) Software Engineering', 'BEng (Hons) Electrical Engineering', 'BED (Hons) Education', 'BA (Hons) Journalism', 'BA (Hons) Chinese Studies'],
    accent: '#FF6F00',
    tag: 'Founded by MCA',
    founded: '1997',
    students: '15,000+',
    ranking: 'MQA Accredited',
    description: 'Founded by the Malaysian Chinese Association (MCA), UNITAR is one of Malaysia\'s well-established private universities with campuses in Kampar and Petaling Jaya.',
    highlights: ['Founded by MCA', 'Two Campuses Available', 'Wide Range of Programmes', 'Affordable Tuition', 'Strong Education Faculty', 'Accessible to All Communities'],
    campusImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.unitar.edu.my',
  },
  {
    name: 'Universiti Tenaga Nasional (UNITEN)',
    shortName: 'UNITEN',
    location: 'Putrajaya',
    type: 'Private',
    programmes: ['Engineering', 'IT', 'Business', 'Accounting', 'Energy Management', 'Computer Science'],
    courses: ['BEng (Hons) Power Engineering', 'BSc (Hons) Computer Science', 'BBA (Hons) Entrepreneurship', 'BCom (Hons) Accounting', 'BSc (Hons) Energy Management', 'BSc (Hons) Cybersecurity'],
    accent: '#0D47A1',
    tag: 'Energy University',
    founded: '1997',
    students: '7,000+',
    ranking: 'MQA Accredited | QS Asia Top 400',
    description: 'UNITEN is Malaysia\'s premier energy university, owned by Tenaga Nasional Berhad (TNB). Located in Putrajaya, it specialises in power engineering, energy management, and IT.',
    highlights: ['Owned by TNB', 'Power Engineering Specialty', 'Energy Management Focus', 'Putrajaya Campus', 'QS Asia Top 400', 'Strong Industry Links'],
    campusImage: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.uniten.edu.my',
  },
  {
    name: 'UOW Malaysia KDU University',
    shortName: 'UMW',
    location: 'Utama, Selangor',
    type: 'Private',
    programmes: ['Business', 'Engineering', 'Computing', 'Hospitality', 'Design', 'Communication'],
    courses: ['BCom (Hons) Finance', 'BEng (Hons) Electrical Engineering', 'BSc (Hons) Computer Science', 'BA (Hons) Culinary Arts', 'BA (Hons) Graphic Design', 'BA (Hons) Public Relations'],
    accent: '#5C6BC0',
    tag: 'Swiss & Australian Partners',
    founded: '1983',
    students: '3,500+',
    ranking: 'MQA Accredited',
    description: 'UOW Malaysia KDU (formerly KDU University College) offers Swiss-inspired culinary arts programmes alongside strong engineering and business faculties. Now partnered with University of Wollongong for globally recognised degrees.',
    highlights: ['Swiss Culinary Partnership', 'University of Wollongong Degree', 'Top Hospitality & Culinary', 'Modern Selangor Campus', 'Industry-Ready Graduates', 'Established 1983'],
    campusImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/g5RhGYuzu-s',
    website: 'https://www.uow.edu.my',
  },
  {
    name: 'Universiti Tunku Abdul Rahman (UTAR)',
    shortName: 'UTAR',
    location: 'Kampar, Perak / Petaling Jaya, Selangor',
    type: 'Private',
    programmes: ['Engineering', 'Business', 'IT', 'Medicine', 'Chinese Studies', 'Agriculture'],
    courses: ['BEng (Hons) Civil Engineering', 'BBA (Hons) Accounting', 'BSc (Hons) Data Science', 'BSc (Hons) Biomedical Science', 'BA (Hons) Chinese Studies', 'BSc (Hons) Agriculture Science'],
    accent: '#0D47A1',
    tag: 'Research University',
    founded: '2002',
    students: '25,000+',
    ranking: 'QS World Top 800+',
    description: 'Founded by the Malaysian Chinese Association, UTAR is one of Malaysia\'s top private universities with a strong research focus. Its Kampar campus is one of the largest in Malaysia.',
    highlights: ['QS World Top 800+', 'Strong Research Focus', 'Two Campuses (Kampar & PJ)', '25,000+ Students', 'Top Engineering & Business', 'MCA Founded'],
    campusImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.utar.edu.my',
  },
  {
    name: 'Brickfields Asia College',
    shortName: 'BAC',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Law', 'Business', 'Creative Arts', 'Communication', 'Pre-University'],
    courses: ['LLB (Hons) Law (University of London)', 'BBA (Hons) Business Management', 'BA (Hons) Digital Media', 'BA (Hons) Communication', 'Cambridge A-Levels', 'Foundation in Arts'],
    accent: '#3E2723',
    tag: 'Law Specialist',
    founded: '1991',
    students: '5,000+',
    ranking: 'Top Law Pathway',
    description: 'Brickfields Asia College (BAC) is Malaysia\'s premier pathway institution for law degrees. Through its partnership with the University of London, students can earn a globally recognised LLB from KL.',
    highlights: ['University of London Law Degree', 'Study Law in Malaysia', 'Creative Arts Programmes', 'Affordable Tuition', 'Located in KL', 'Established 1991'],
    campusImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.bac.edu.my',
  },
  {
    name: 'Reliance College',
    shortName: 'Reliance',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Business', 'IT', 'Accounting', 'Law Enforcement', 'Security Management'],
    courses: ['BBA (Hons) Business Management', 'BSc (Hons) Information Technology', 'BCom (Hons) Accounting', 'Diploma in Law Enforcement', 'Diploma in Security Management', 'Foundation in Business'],
    accent: '#37474F',
    tag: 'Unique Programmes',
    founded: '1995',
    students: '1,500+',
    ranking: 'MQA Accredited',
    description: 'Reliance College is a private institution in KL offering unique programmes including business, IT, and specialised courses in law enforcement and security management.',
    highlights: ['Law Enforcement Programme', 'Security Management', 'Business & IT', 'Niche Education Options', 'Established 1995', 'Located in KL'],
    campusImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.reliance.edu.my',
  },
  {
    name: 'Alfa University College',
    shortName: 'Alfa',
    location: 'Subang Jaya, Selangor',
    type: 'Private',
    programmes: ['Business', 'Education', 'Design', 'Health Sciences', 'Pre-University'],
    courses: ['BBA (Hons) Marketing', 'BED (Hons) Education', 'BA (Hons) Interior Design', 'Diploma in Nursing', 'Foundation in Science', 'Cambridge A-Levels'],
    accent: '#1565C0',
    tag: 'Education & Design',
    founded: '1998',
    students: '3,000+',
    ranking: 'MQA Accredited',
    description: 'Alfa University College in Subang Jaya specialises in education, business, and design. Known for its Foundation and A-Level programmes, Alfa provides pathways to top universities locally and abroad.',
    highlights: ['Strong Foundation Programme', 'Education & Teaching Focus', 'Design Programmes', 'Pathway to Top Universities', 'Subang Jaya Campus', 'Affordable Fees'],
    campusImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.alfa.edu.my',
  },
  {
    name: 'City University Malaysia',
    shortName: 'City',
    location: 'Petaling Jaya, Selangor',
    type: 'Private',
    programmes: ['Business', 'IT', 'Engineering', 'Design', 'Hospitality', 'Mass Communication'],
    courses: ['BBA (Hons) Business Administration', 'BSc (Hons) Software Engineering', 'BEng (Hons) Mechanical Engineering', 'BA (Hons) Graphic Design', 'BA (Hons) Hotel Management', 'BA (Hons) Mass Communication'],
    accent: '#283593',
    tag: 'Urban Campus',
    founded: '1984',
    students: '6,000+',
    ranking: 'MQA Accredited | SETARA Tier 5',
    description: 'City University Malaysia in Petaling Jaya is a multidisciplinary private university offering business, engineering, design, and communication programmes.',
    highlights: ['SETARA Tier 5', 'Multidisciplinary Programmes', 'Strong Industry Connections', 'Petaling Jaya Campus', 'Modern Facilities', 'Established 1984'],
    campusImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.city.edu.my',
  },
  {
    name: 'Kings University College',
    shortName: 'Kings',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Business', 'IT', 'Accounting', 'Marketing', 'English Language', 'Pre-University'],
    courses: ['BBA (Hons) Business Management', 'BSc (Hons) Information Technology', 'BCom (Hons) Accounting', 'BA (Hons) Marketing', 'BA (Hons) English Language', 'Foundation in Business'],
    accent: '#4169E1',
    tag: 'Business & IT',
    founded: '2000',
    students: '2,000+',
    ranking: 'MQA Accredited',
    description: 'Kings University College offers affordable, quality education in business, IT, and accounting. Located in KL, it provides a supportive learning environment with flexible programme options.',
    highlights: ['Affordable Tuition', 'Business & IT Focus', 'Flexible Programme Options', 'Supportive Learning Environment', 'MQA Accredited', 'Located in KL'],
    campusImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.kings.edu.my',
  },
  {
    name: 'Lincoln University College',
    shortName: 'Lincoln',
    location: 'Petaling Jaya, Selangor',
    type: 'Private',
    programmes: ['Medicine', 'Pharmacy', 'Dentistry', 'Business', 'IT', 'Engineering'],
    courses: ['MBBS Bachelor of Medicine & Surgery', 'Master of Pharmacy', 'Bachelor of Dental Surgery', 'BBA (Hons) Management', 'BSc (Hons) Computer Science', 'BEng (Hons) Electrical Engineering'],
    accent: '#01579B',
    tag: 'QS Ranked',
    founded: '2002',
    students: '8,000+',
    ranking: 'QS World Top 501+ (2026)',
    description: 'Lincoln University College is a QS-ranked private institution offering medicine, dentistry, pharmacy, and business programmes. Located in Petaling Jaya, it provides affordable medical education with modern simulation labs.',
    highlights: ['QS World Top 501+', 'Affordable Medical Programmes', 'Simulation Lab Facilities', 'Modern Campus', 'Diverse Faculty', 'Petaling Jaya Location'],
    campusImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.lincoln.edu.my',
  },
  {
    name: 'Malaysian Institute of Art (MIA)',
    shortName: 'IIMAT',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Fine Arts', 'Graphic Design', 'Illustration', 'Digital Art', 'Fashion Design', 'Visual Communication'],
    courses: ['BA (Hons) Fine Arts', 'BA (Hons) Graphic Design', 'BA (Hons) Illustration', 'BA (Hons) Digital Art', 'BA (Hons) Fashion Design', 'Diploma in Visual Communication'],
    accent: '#AD1457',
    tag: 'Creative Arts',
    founded: '1967',
    students: '2,500+',
    ranking: 'MQA Accredited',
    description: "Malaysian Institute of Art (MIA) is Malaysia's oldest art institution, offering specialist education in fine arts, graphic design, and fashion. Located in KL.",
    highlights: ['Established 1967', 'Malaysia\'s Oldest Art Institution', 'Fine Arts & Design', 'Strong Alumni Network', 'Creative Portfolio Support', 'KL City Location'],
    campusImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.mia.edu.my',
  },
  {
    name: 'London School of Business & Finance',
    shortName: 'LSBF',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Business', 'Accounting', 'Finance', 'Digital Marketing', 'MBA', 'Data Analytics'],
    courses: ['BSc (Hons) Business Administration', 'BSc (Hons) Accounting & Finance', 'MSc Financial Management', 'Master of Business Administration (MBA)', 'BSc (Hons) Digital Marketing', 'BSc (Hons) Data Science & Analytics'],
    accent: '#1A237E',
    tag: 'Global Qualification',
    founded: '2003',
    students: '4,000+',
    ranking: 'Global Accreditation',
    description: 'LSBF Malaysia is part of the global LSBF network headquartered in London. It offers globally recognised business, finance, and accounting qualifications with UK-accredited degree programmes taught in KL.',
    highlights: ['UK-Accredited Degrees', 'Global LSBF Network', 'Business & Finance Focus', 'Internationally Recognised', 'KL City Centre Campus', 'Flexible Study Options'],
    campusImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.lsbf.edu.my',
  },
  {
    name: 'Sunway University',
    shortName: 'Sunway',
    location: 'Petaling Jaya, Selangor',
    type: 'Private',
    programmes: ['Business', 'Sciences', 'Arts', 'Computing', 'Law', 'Medical Sciences'],
    courses: ['BBA (Hons) Finance', 'BSc (Hons) Biomedical Science', 'BA (Hons) International Business', 'BSc (Hons) Data Analytics', 'LLB (Hons) Bachelor of Laws', 'BSc (Hons) Medical Biology'],
    accent: '#B8860B',
    tag: 'Premier Private',
    founded: '1987',
    students: '9,000+',
    ranking: 'QS World #253 (2026)',
    description: 'Ranked #253 globally in QS 2026, Sunway University is one of Malaysia\'s most prestigious private universities. Located within the integrated Sunway City.',
    highlights: ['QS World #253 (2026)', 'FIFA-Certified Football Field', 'Canopy Walk', 'Integrated Smart City Campus', 'Strong Medical Sciences', 'Top Business School'],
    campusImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/g5RhGYuzu-s',
    website: 'https://sunwayuniversity.edu.my',
  },
  {
    name: 'Universiti Putra Malaysia (UPM)',
    shortName: 'UPM',
    location: 'Serdang, Selangor',
    type: 'Public',
    programmes: ['Agriculture', 'Engineering', 'Medicine', 'Veterinary Science', 'Computer Science', 'Economics'],
    courses: ['BSc (Hons) Agriculture', 'BEng (Hons) Civil Engineering', 'Doctor of Veterinary Medicine', 'BSc (Hons) Computer Science', 'BBA (Hons) Economics', 'BSc (Hons) Food Science'],
    accent: '#2E7D32',
    tag: 'Top Research Public',
    founded: '1931',
    students: '25,000+',
    ranking: 'QS World #134 (2026)',
    description: 'UPM is one of Malaysia\'s top research universities, ranked #134 globally. Originally an agricultural college, it has grown into a comprehensive public university.',
    highlights: ['QS World #134 (2026)', 'Top Research University', 'Veterinary Medicine', 'Agriculture Excellence', 'Beautiful Serdang Campus', 'Affordable Public Fees'],
    campusImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.upm.edu.my',
  },
  {
    name: 'Universiti Teknologi Malaysia (UTM)',
    shortName: 'UTM',
    location: 'Johor Bahru, Johor / KL',
    type: 'Public',
    programmes: ['Engineering', 'Architecture', 'IT', 'Science', 'Management', 'Education'],
    courses: ['BEng (Hons) Civil Engineering', 'Bachelor of Architecture', 'BSc (Hons) Computer Science', 'BSc (Hons) Physics', 'BBA (Hons) Management', 'BED (Hons) Technical Education'],
    accent: '#0D47A1',
    tag: 'Top Engineering Public',
    founded: '1972',
    students: '20,000+',
    ranking: 'QS World #188 (2026)',
    description: 'UTM is Malaysia\'s premier engineering and technology university, ranked #188 globally. With campuses in Johor Bahru and KL, it is the top choice for engineering education.',
    highlights: ['QS World #188 (2026)', 'Top Engineering University', 'Two Campuses (JB & KL)', 'Strong Research Output', 'Industry Partnerships', 'Affordable Public Fees'],
    campusImage: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.utm.my',
  },
  {
    name: 'University of Malaya (UM)',
    shortName: 'UM',
    location: 'Kuala Lumpur',
    type: 'Public',
    programmes: ['Medicine', 'Engineering', 'Law', 'Business', 'Science', 'Arts', 'Education'],
    courses: ['MBBS Bachelor of Medicine', 'BEng (Hons) Electrical Engineering', 'LLB (Hons) Bachelor of Laws', 'BBA (Hons) Accounting', 'BSc (Hons) Physics', 'BA (Hons) English Literature', 'BED (Hons) Education'],
    accent: '#C62828',
    tag: '#1 in Malaysia',
    founded: '1949',
    students: '28,000+',
    ranking: 'QS World #60 (2026)',
    description: 'University of Malaya is Malaysia\'s oldest and highest-ranked university, placed #60 globally in QS 2026. Located in KL, it offers the widest range of programmes.',
    highlights: ['QS World #60 (2026)', 'Malaysia\'s #1 University', 'Oldest University in Malaysia', 'Comprehensive Programmes', 'World-Class Research', 'KL City Campus'],
    campusImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.um.edu.my',
  },
  {
    name: 'Unicam University Malaysia',
    shortName: 'UNICAM',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Business', 'IT', 'Psychology', 'Education', 'Health Sciences', 'Pre-University'],
    courses: ['BBA (Hons) Business Management', 'BSc (Hons) Information Technology', 'BA (Hons) Psychology', 'BED (Hons) Education', 'BSc (Hons) Nursing', 'Foundation in Business'],
    accent: '#4A148C',
    tag: 'Growing Institution',
    founded: '2010',
    students: '2,000+',
    ranking: 'MQA Accredited',
    description: 'Unicam University Malaysia is a growing private institution in KL offering business, IT, psychology, and health sciences programmes with a focus on practical education and small class sizes.',
    highlights: ['Small Class Sizes', 'Practical Education', 'Business & Psychology', 'Personalised Learning', 'Affordable Tuition', 'Located in KL'],
    campusImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.unicam.edu.my',
  },
  {
    name: 'Asia-E University',
    shortName: 'AEU',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Business', 'IT', 'Engineering', 'Education', 'Liberal Arts'],
    courses: ['BBA (Hons) Business Administration', 'BSc (Hons) Information Technology', 'BEng (Hons) Electrical Engineering', 'BED (Hons) Education', 'BA (Hons) Liberal Arts'],
    accent: '#2E86AB',
    tag: 'Growing Institution',
    founded: '2004',
    students: '5,000+',
    ranking: 'MQA Accredited',
    description: 'Asia-E University is a private institution in KL offering programmes in business, IT, engineering, and education. Known for its multicultural environment and affordable tuition.',
    highlights: ['MQA Accredited Programmes', 'Affordable Tuition', 'Multicultural Environment', 'Industry-Focused Curriculum', 'Located in KL', 'Growing Student Community'],
    campusImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.aeu.edu.my',
  },
];

function UniversityModal({ uni, onClose }: { uni: University; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[900px] max-h-[90vh] overflow-y-auto rounded-3xl"
        style={{ background: 'linear-gradient(135deg, #0B1E42 0%, #0B2A5C 100%)', border: '1px solid rgba(201,162,52,0.3)' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center text-cream/70 hover:text-cream transition-colors"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          ✕
        </button>

        <div className="relative h-[220px] overflow-hidden rounded-t-3xl">
          <img src={uni.campusImage} alt={uni.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(11,30,66,1) 0%, transparent 60%)' }} />
          <div className="absolute bottom-4 left-6 right-16">
            <span className="px-3 py-1 rounded-full text-[10px] font-body uppercase tracking-widest mb-2 inline-block"
              style={{ background: uni.type === 'Public' ? 'rgba(212,248,122,0.2)' : 'rgba(201,162,52,0.2)', color: uni.type === 'Public' ? '#D4F87A' : '#C9A234', border: `1px solid ${uni.type === 'Public' ? 'rgba(212,248,122,0.4)' : 'rgba(201,162,52,0.4)'}` }}>
              {uni.type} University
            </span>
            <h2 className="font-display font-bold text-kimono" style={{ fontSize: 'clamp(20px, 3vw, 32px)', letterSpacing: '0.02em' }}>{uni.name}</h2>
            <p className="font-body text-mouse text-sm mt-1">📍 {uni.location}</p>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <div className="grid grid-cols-3 gap-4 mb-8 p-4 rounded-2xl" style={{ background: 'rgba(201,162,52,0.08)', border: '1px solid rgba(201,162,52,0.15)' }}>
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
                  <span key={p} className="text-[11px] px-3 py-1 rounded-full font-body text-cream/70" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>{p}</span>
                ))}
              </div>

              <h3 className="font-body font-semibold text-gold mb-3 uppercase tracking-widest text-xs">Courses</h3>
              <ul className="space-y-2 mb-6">
                {uni.courses.map(c => (
                  <li key={c} className="flex items-center gap-2 text-cream/70 text-sm font-body">
                    <span style={{ color: '#C9A234', fontSize: '8px' }}>◆</span> {c}
                  </li>
                ))}
              </ul>

              <h3 className="font-body font-semibold text-gold mb-3 uppercase tracking-widest text-xs">Highlights</h3>
              <ul className="space-y-2">
                {uni.highlights.map(h => (
                  <li key={h} className="flex items-center gap-2 text-cream/70 text-sm font-body">
                    <span style={{ color: '#C9A234' }}>✓</span> {h}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <a
                href={`https://wa.me/60175631621?text=Hi, I'm interested in studying at ${uni.name}. Please help me with the application.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-body text-sm uppercase tracking-widest text-white transition-all duration-300 hover:scale-[1.02] mb-3"
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

export default function ExploreUniversitiesPage({ onBack }: { onBack: () => void }) {
  const splashRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [splashVisible, setSplashVisible] = useState(true);

  const filteredUniversities = useMemo(() => {
    const sorted = [...allUniversities].sort((a, b) => a.name.localeCompare(b.name));
    if (!searchQuery.trim()) return sorted;
    const q = searchQuery.toLowerCase();
    return sorted.filter(uni =>
      uni.name.toLowerCase().includes(q) ||
      uni.shortName.toLowerCase().includes(q) ||
      uni.location.toLowerCase().includes(q) ||
      uni.programmes.some(p => p.toLowerCase().includes(q)) ||
      uni.courses.some(c => c.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  useEffect(() => {
    if (!splashRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => setSplashVisible(false)
    });

    tl.fromTo('.splash-dot',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, stagger: 0.02, ease: 'back.out(2)' }
    )
    .fromTo('.splash-text',
      { opacity: 0, y: 40, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo('.splash-subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    )
    .to({}, { duration: 1.5 })
    .to(splashRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
    });

    return () => { tl.kill(); };
  }, []);

  useEffect(() => {
    if (!splashVisible && contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
      gsap.fromTo('.uni-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.03, ease: 'power2.out', delay: 0.3 }
      );
    }
  }, [splashVisible]);

  // When search results change, ensure all cards are visible
  useEffect(() => {
    if (!splashVisible) {
      gsap.set('.uni-card', { opacity: 1, y: 0 });
    }
  }, [filteredUniversities.length, splashVisible]);

  return (
    <>
      {selectedUni && <UniversityModal uni={selectedUni} onClose={() => setSelectedUni(null)} />}

      {splashVisible && (
        <div
          ref={splashRef}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #0B1E42 50%, #0A0A0A 100%)' }}
        >
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
                  boxShadow: '0 0 8px rgba(201,162,52,0.6)',
                }}
              />
            ))}
          </div>

          <div className="absolute w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(201,162,52,0.15) 0%, transparent 70%)' }} />

          <div className="relative z-10 text-center px-6">
            <div className="splash-text" style={{ opacity: 0 }}>
              <h1
                className="font-display font-bold uppercase"
                style={{
                  fontSize: 'clamp(32px, 8vw, 72px)',
                  letterSpacing: '0.15em',
                  background: 'linear-gradient(135deg, #C9A234 0%, #FFD700 40%, #D4AF37 60%, #C9A234 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: 'none',
                  filter: 'drop-shadow(0 0 30px rgba(201,162,52,0.3))',
                }}
              >
                PATHWAY TO
              </h1>
              <h1
                className="font-display font-bold uppercase -mt-2"
                style={{
                  fontSize: 'clamp(36px, 9vw, 80px)',
                  letterSpacing: '0.2em',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFFFFF 50%, #FFD700 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 40px rgba(255,215,0,0.4))',
                }}
              >
                SUCCESS
              </h1>
            </div>
            <div className="splash-subtitle mt-6" style={{ opacity: 0 }}>
              <p className="font-body text-cream/50 uppercase tracking-[0.3em]" style={{ fontSize: 'clamp(10px, 1.5vw, 13px)' }}>
                Explore 32 Partner Universities
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-12 h-px" style={{ background: 'rgba(201,162,52,0.4)' }} />
                <div className="w-2 h-2 rounded-full" style={{ background: '#C9A234' }} />
                <div className="w-12 h-px" style={{ background: 'rgba(201,162,52,0.4)' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content — always rendered underneath */}
      <div ref={contentRef} style={{ opacity: splashVisible ? 0 : 1, minHeight: '100vh', background: '#0B1A33' }}>
        <div className="sticky top-0 z-50" style={{ background: 'rgba(11,26,51,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(201,162,52,0.15)' }}>
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-3 flex items-center gap-4">
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-gold/70 hover:text-gold transition-colors cursor-pointer font-body text-xs uppercase tracking-wider px-2 py-1.5 rounded-lg hover:bg-white/5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Home
              </button>
              <div className="w-px h-4 mx-1" style={{ background: 'rgba(201,162,52,0.2)' }} />
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
                    onBack();
                  }}
                  className="text-cream/40 hover:text-gold transition-colors cursor-pointer font-body text-xs uppercase tracking-wider px-2 py-1.5 rounded-lg hover:bg-white/5 hidden md:block"
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'rgba(201,162,52,0.5)' }}>
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search universities, programmes, courses..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-full font-body text-xs text-cream/90 placeholder:text-cream/30 outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,162,52,0.25)' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream/70 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            <span className="font-body text-xs text-cream/40 whitespace-nowrap hidden sm:block">
              {filteredUniversities.length} universities
            </span>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-12 pb-8">
          <div className="w-16 h-px mb-6" style={{ background: 'rgba(201,162,52,0.5)' }} />
          <h2 className="font-display font-bold text-kimono uppercase"
            style={{ fontSize: 'clamp(28px, 5vw, 52px)', letterSpacing: '0.05em', lineHeight: 1.1 }}>
            ALL PARTNER<br />
            <span style={{ WebkitTextStroke: '1px rgba(201,162,52,0.5)', color: 'transparent' }}>UNIVERSITIES</span>
          </h2>
          <p className="font-serif font-light text-cream/50 mt-4 max-w-[500px]" style={{ fontSize: 'clamp(14px, 1.5vw, 18px)', lineHeight: 1.7 }}>
            Browse all 32 partner universities. Search by name, programme, or course to find your perfect match.
          </p>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pb-20">
          {filteredUniversities.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-body text-cream/40 text-lg">No universities found matching "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-6 py-2 rounded-full font-body text-sm uppercase tracking-wider cursor-pointer"
                style={{ border: '1px solid rgba(201,162,52,0.4)', color: '#C9A234' }}
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredUniversities.map((uni, i) => (
                <div
                  key={uni.name}
                  className="uni-card rounded-xl p-6 flex flex-col gap-4 cursor-pointer group"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    transition: 'border-color 300ms ease, transform 300ms ease, background 300ms ease',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget;
                    el.style.borderColor = `${uni.accent}60`;
                    el.style.transform = 'translateY(-6px)';
                    el.style.background = 'rgba(255,255,255,0.06)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget;
                    el.style.borderColor = 'rgba(255,255,255,0.07)';
                    el.style.transform = 'translateY(0)';
                    el.style.background = 'rgba(255,255,255,0.03)';
                  }}
                  onClick={() => setSelectedUni(uni)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-1 rounded-full text-[9px] font-body uppercase tracking-wider flex-shrink-0"
                      style={{ background: `${uni.accent}30`, color: '#C9A234', border: `1px solid ${uni.accent}40` }}>
                      {uni.tag}
                    </span>
                    <span className="text-[10px] font-body uppercase tracking-wider"
                      style={{ color: uni.type === 'Public' ? '#D4F87A' : '#C9A234' }}>
                      {uni.type}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-body font-semibold text-kimono leading-snug" style={{ fontSize: 'clamp(14px, 1.5vw, 16px)' }}>{uni.name}</h3>
                    <p className="font-body text-mouse text-xs mt-1 flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                      {uni.location}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {uni.programmes.slice(0, 3).map(p => (
                      <span key={p} className="text-[9px] px-2 py-0.5 rounded font-body text-mouse/70" style={{ background: 'rgba(255,255,255,0.05)' }}>{p}</span>
                    ))}
                    {uni.programmes.length > 3 && (
                      <span className="text-[9px] px-2 py-0.5 rounded font-body text-gold/60" style={{ background: 'rgba(201,162,52,0.08)' }}>+{uni.programmes.length - 3} more</span>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-[10px] font-body text-mouse/50">{uni.ranking}</span>
                    <span className="text-[11px] font-body text-gold/70 group-hover:text-gold transition-colors flex items-center gap-1">
                      View Details
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </span>
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
