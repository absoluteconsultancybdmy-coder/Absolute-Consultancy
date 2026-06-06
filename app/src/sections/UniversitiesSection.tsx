import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface University {
  name: string;
  shortName: string;
  location: string;
  type: string;
  programmes: string[];
  accent: string;
  tag: string;
  founded: string;
  students: string;
  ranking: string;
  description: string;
  highlights: string[];
  campusImage: string;
  logoColor: string;
  campusTourVideo: string;
  website: string;
}

const universities: University[] = [
  {
    name: "Taylor's University",
    shortName: "Taylor's",
    location: 'Subang Jaya, Selangor',
    type: 'Private',
    programmes: ['Hospitality', 'Law', 'Architecture', 'Business', 'Medicine', 'Engineering'],
    accent: '#4A0080',
    tag: 'Award Winning',
    founded: '1969',
    students: '12,000+',
    ranking: 'QS World #253 (2026)',
    description: "One of Malaysia's oldest and most reputable private institutions. Taylor's is globally recognised for its Hospitality, Law, and Architecture programmes, and offers award-winning degrees in a beautiful Subang Jaya campus.",
    highlights: ['Established 1969', 'Award-Winning Hospitality School', 'MyQUEST 2022 Competitive', 'QS World #253', 'Beautiful Campus', 'Strong Industry Partnerships'],
    campusImage: '/images/TaylorUniversity.jpeg',
    logoColor: '#4A0080',
    campusTourVideo: 'https://www.youtube.com/embed/NSuKhrtt9zo',
    website: 'https://university.taylors.edu.my',
  },
  {
    name: 'Sunway University',
    shortName: 'Sunway',
    location: 'Petaling Jaya, Selangor',
    type: 'Private',
    programmes: ['Business', 'Sciences', 'Arts', 'Computing', 'Law', 'Medical Sciences'],
    accent: '#B8860B',
    tag: 'Premier Private',
    founded: '1987',
    students: '9,000+',
    ranking: 'QS World #253 (2026)',
    description: 'Ranked #253 globally in QS 2026, Sunway University is one of Malaysia\'s most prestigious private universities. Located within the integrated Sunway City, students enjoy world-class facilities including a FIFA-certified football field.',
    highlights: ['QS World #253 (2026)', 'FIFA-Certified Football Field', 'Canopy Walk', 'Integrated Smart City Campus', 'Strong Medical Sciences', 'Top Business School'],
    campusImage: '/images/SunWayUniversity.jpeg',
    logoColor: '#B8860B',
    campusTourVideo: 'https://www.youtube.com/embed/g5RhGYuzu-s',
    website: 'https://sunwayuniversity.edu.my',
  },
  {
    name: 'Monash University Malaysia',
    shortName: 'Monash',
    location: 'Bandar Sunway, Selangor',
    type: 'Private',
    programmes: ['Medicine', 'Engineering', 'Business', 'Pharmacy', 'Computer Science', 'Arts & Sciences'],
    accent: '#005A8B',
    tag: 'Group of Eight',
    founded: '1998',
    students: '9,000+',
    ranking: 'QS World #57 (2026)',
    description: 'Monash University Malaysia is the first foreign university campus in Malaysia and a branch of Australia\'s prestigious Group of Eight. Students earn the same degree as the main campus in Melbourne, with globally recognised programmes in medicine, engineering, business, and pharmacy on a state-of-the-art campus in Bandar Sunway.',
    highlights: ['QS World #57 (2026)', 'Australian Group of Eight', 'Same Degree as Melbourne Campus', 'Top Medicine & Engineering', 'Global Exchange Opportunities', 'Research-Intensive University'],
    campusImage: '/images/MonashUniversity.jpeg',
    logoColor: '#005A8B',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.monash.edu.my',
  },
  {
    name: 'Asia Pacific University (APU)',
    shortName: 'APU',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['IT', 'Engineering', 'Business', 'Computing', 'Design', 'Actuarial Science'],
    accent: '#1A3A6B',
    tag: '5-Star SETARA',
    founded: '1993',
    students: '12,000+',
    ranking: 'QS World Top 401+ | 5-Star SETARA',
    description: 'One of Malaysia\'s highest-rated universities with a 5-Star SETARA rating. APU is especially strong in technology and computing, with students from over 130 countries making it one of the most diverse campuses in Malaysia.',
    highlights: ['5-Star SETARA Rating', '130+ Nationalities on Campus', 'QS Top 401+', 'Strong IT & Computing', 'Excellent Graduate Employability', 'Modern KL Campus'],
    campusImage: '/images/AsiaPacificUniversity.jpeg',
    logoColor: '#1A3A6B',
    campusTourVideo: 'https://www.youtube.com/embed/OhmGgJV9qNI',
    website: 'https://www.apu.edu.my',
  },
  {
    name: 'INTI International University',
    shortName: 'INTI',
    location: 'Nilai, Negeri Sembilan',
    type: 'Private',
    programmes: ['Business', 'Engineering', 'Computing', 'Hospitality', 'Health Sciences'],
    accent: '#CC4400',
    tag: 'International Network',
    founded: '1986',
    students: '8,000+',
    ranking: 'Top 5 Private Universities in Malaysia',
    description: 'With campuses in Nilai and Subang Jaya, INTI offers globally recognised qualifications through its international university partnerships. Students can transfer credits or complete degrees at partner universities worldwide.',
    highlights: ['International Transfer Programmes', 'Partner Universities Worldwide', 'Nilai & Subang Campuses', 'Top 5 Private Universities', 'Strong Hospitality School', 'Hope Education Group'],
    campusImage: '/images/INTIUniversity.jpeg',
    logoColor: '#CC4400',
    campusTourVideo: 'https://www.youtube.com/embed/W1himgzsyLQ',
    website: 'https://newinti.edu.my',
  },
  {
    name: 'SEGi University',
    shortName: 'SEGi',
    location: 'Petaling Jaya, Selangor',
    type: 'Private',
    programmes: ['Medicine', 'Dentistry', 'Business', 'Engineering', 'IT', 'Pharmacy'],
    accent: '#006400',
    tag: 'Affordable',
    founded: '1977',
    students: '9,000+',
    ranking: 'SETARA Tier 5',
    description: 'One of Malaysia\'s oldest private institutions, SEGi offers affordable education across medicine, dentistry, engineering and business. Multiple campuses across Malaysia make it accessible to students nationwide.',
    highlights: ['Established 1977', 'Affordable Fees', 'Top Dentistry School', 'Multiple Campuses', 'Medicine & Pharmacy', 'Strong Industry Links'],
    campusImage: '/images/SEGiUniversity.jpeg',
    logoColor: '#006400',
    campusTourVideo: 'https://www.youtube.com/embed/6mnJu2Oy7OI',
    website: 'https://www.segi.edu.my',
  },
  {
    name: 'University of Cyberjaya (UoC)',
    shortName: 'UoC',
    location: 'Cyberjaya, Selangor',
    type: 'Private',
    programmes: ['Medicine', 'Pharmacy', 'IT', 'Business', 'Health Sciences', 'Nursing', 'Biomedical Engineering'],
    accent: '#005A8B',
    tag: 'Health Focus',
    founded: '2005',
    students: '4,000+',
    ranking: 'QS Top 601+ | 5-Star SETARA',
    description: "Located in Malaysia's smart city Cyberjaya, UoC is a premier health sciences university with a 5-Star SETARA rating. It excels in Medicine, Pharmacy, and Nursing with a state-of-the-art eco-friendly campus.",
    highlights: ['5-Star SETARA Rating', 'Top Medicine & Health Sciences', 'Eco-Friendly Smart Campus', 'QS Top 601+', 'Top 200 Global Health SDG Ranking', 'Located in Cyberjaya'],
    campusImage: '/images/UniversityOfCyberjaya.jpeg',
    logoColor: '#005A8B',
    campusTourVideo: 'https://www.youtube.com/embed/irmFggZ7DN4',
    website: 'https://cyberjaya.edu.my',
  },
  {
    name: 'UCSI University',
    shortName: 'UCSI',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Medicine', 'Pharmacy', 'Architecture', 'Music', 'Business', 'Engineering', 'Computer Science'],
    accent: '#1B5E20',
    tag: 'QS Ranked',
    founded: '1986',
    students: '10,000+',
    ranking: 'QS World Top 601+',
    description: 'A leading private university in KL offering over 100 programmes. UCSI is especially renowned for its Medicine, Pharmacy, and Architecture programmes, and boasts a rooftop bar and vibrant student life.',
    highlights: ['QS World Ranked', 'Top Medicine & Pharmacy', 'Award-Winning Architecture', 'Rooftop Campus Facilities', 'Strong Alumni Network', 'Located in KL'],
    campusImage: '/images/UCSIUniversity.jpeg',
    logoColor: '#1B5E20',
    campusTourVideo: 'https://www.youtube.com/embed/07RlVINKWU4',
    website: 'https://www.ucsiuniversity.edu.my',
  },
  {
    name: 'Universiti Teknologi MARA (UiTM)',
    shortName: 'UiTM',
    location: 'Shah Alam, Selangor',
    type: 'Public',
    programmes: ['Business', 'Engineering', 'Law', 'Medicine', 'IT', 'Art & Design', 'Sciences'],
    accent: '#1A3A6B',
    tag: 'Top Public',
    founded: '1956',
    students: '150,000+',
    ranking: "Malaysia's Largest University",
    description: "Malaysia's largest public university with over 150,000 students across 35 campuses nationwide. UiTM is a prestigious public institution known for its Business, Law, and Engineering faculties with strong government recognition.",
    highlights: ["Malaysia's Largest University", '35 Campuses Nationwide', '150,000+ Students', 'Prestigious Public Status', 'Strong Government Recognition', 'Established 1956'],
    campusImage: '/images/UniversityKualaLumpur.jpeg',
    logoColor: '#1A3A6B',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.uitm.edu.my',
  },
  {
    name: 'Multimedia University (MMU)',
    shortName: 'MMU',
    location: 'Cyberjaya, Selangor',
    type: 'Private',
    programmes: ['Computer Science', 'Engineering', 'Creative Multimedia', 'Business', 'Law', 'Cinematic Arts'],
    accent: '#7B0000',
    tag: 'Tech Leader',
    founded: '1994',
    students: '18,000+',
    ranking: 'QS Asia #207 (2025)',
    description: "Malaysia's first private university, founded by Telekom Malaysia. MMU is a premier research institution at the heart of the Multimedia Super Corridor (MSC), renowned for engineering, IT, creative multimedia, and strong industry connections.",
    highlights: ['Malaysia\'s First Private University', 'QS Asia Top 250', 'Olympic-sized Swimming Pool', '200-acre Campus', '13 Research Centres', 'Strong Tech Industry Links'],
    campusImage: '/images/MMU.jpeg',
    logoColor: '#7B0000',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.mmu.edu.my',
  },
  {
    name: 'Limkokwing University',
    shortName: 'LUCT',
    location: 'Cyberjaya, Selangor',
    type: 'Private',
    programmes: ['Design', 'Architecture', 'Communication', 'Business', 'Fashion', 'Multimedia'],
    accent: '#1A1A2E',
    tag: 'Creative Hub',
    founded: '1991',
    students: '30,000+',
    ranking: '150+ Countries Represented',
    description: 'The most internationally diverse university in Malaysia with students from 150+ countries. Limkokwing is the go-to institution for creative arts, design, fashion, and communication — with a visually stunning campus.',
    highlights: ['150+ Countries on Campus', 'Top Creative Arts University', 'Award-Winning Architecture Campus', 'Fashion & Design Hub', 'Global Campuses Network', 'Affordable Programmes'],
    campusImage: '/images/CityUniversity.jpeg',
    logoColor: '#1A1A2E',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.limkokwing.net',
  },
  {
    name: 'KDU University College',
    shortName: 'KDU',
    location: 'Utama, Selangor',
    type: 'Private',
    programmes: ['Culinary Arts', 'Business', 'Engineering', 'Computing', 'Hospitality', 'Design'],
    accent: '#B8600A',
    tag: 'Swiss Partner',
    founded: '1983',
    students: '3,500+',
    ranking: 'Top Culinary School Malaysia',
    description: "Malaysia's top culinary arts institution with a partnership with Swiss schools. KDU offers world-class hospitality and culinary programmes, alongside strong engineering and business faculties in a modern Selangor campus.",
    highlights: ['Swiss Culinary Partnership', 'Top Culinary Arts School', 'Modern Selangor Campus', 'Strong Hospitality', 'Industry-Ready Graduates', 'Established 1983'],
    campusImage: '/images/BrickFieldsAsiaCollage.jpeg',
    logoColor: '#B8600A',
    campusTourVideo: 'https://www.youtube.com/embed/g5RhGYuzu-s',
    website: 'https://kdu.edu.my',
  },
  {
    name: 'HELP University',
    shortName: 'HELP',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Psychology', 'Business', 'Law', 'IT', 'Economics', 'Social Sciences'],
    accent: '#8B0000',
    tag: 'Established 1986',
    founded: '1986',
    students: '5,000+',
    ranking: 'Top KL Private University',
    description: 'Established in 1986, HELP University is one of KL\'s most respected institutions especially known for Psychology, Law, and Business. It offers a personal, nurturing environment with strong academic rigour.',
    highlights: ['Founded 1986', 'Malaysia\'s Top Psychology School', 'Strong Law Programme', 'Personal Learning Environment', 'Located in KL City', 'Affordable Fees'],
    campusImage: '/images/LSBF.jpeg',
    logoColor: '#8B0000',
    campusTourVideo: 'https://www.youtube.com/embed/NSuKhrtt9zo',
    website: 'https://www.help.edu.my',
  },
  {
    name: 'International Islamic University Malaysia (IIUM)',
    shortName: 'IIUM',
    location: 'Gombak, Selangor',
    type: 'Public',
    programmes: ['Islamic Studies', 'Law', 'Engineering', 'Medicine', 'Economics', 'IT', 'Architecture'],
    accent: '#006400',
    tag: 'Top Public Islamic',
    founded: '1983',
    students: '30,000+',
    ranking: 'QS World Top 601+',
    description: 'A premier public university established by the Organisation of Islamic Cooperation (IIUM integrates Islamic values with modern academic disciplines. It is renowned for its Law (Shariah & Civil), Engineering, and Medicine programmes, attracting students from over 100 countries.',
    highlights: ['Established by OIC', '100+ Countries Represented', 'Dual-Language System (English & Arabic)', 'Top Islamic Law Programme', 'Affordable Public Fees', 'Beautiful Gombak Campus'],
    campusImage: '/images/IIUM.jpeg',
    logoColor: '#006400',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.iium.edu.my',
  },
  {
    name: 'Asia-E University',
    shortName: 'AEU',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Business', 'IT', 'Engineering', 'Education', 'Liberal Arts'],
    accent: '#2E86AB',
    tag: 'Growing Institution',
    founded: '2004',
    students: '5,000+',
    ranking: 'MQA Accredited',
    description: 'Asia-E University is a private institution in KL offering programmes in business, IT, engineering, and education. Known for its multicultural environment and affordable tuition, AEU provides quality education with a focus on practical skills and industry readiness.',
    highlights: ['MQA Accredited Programmes', 'Affordable Tuition', 'Multicultural Environment', 'Industry-Focused Curriculum', 'Located in KL', 'Growing Student Community'],
    campusImage: '/images/AsiaEUniversity.jpeg',
    logoColor: '#2E86AB',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.aeu.edu.my',
  },
  {
    name: 'Berjaya University College',
    shortName: 'Berjaya UC',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Culinary Arts', 'Hospitality', 'Business', 'Tourism', 'Liberal Arts'],
    accent: '#C41E3A',
    tag: 'Hospitality Focus',
    founded: '2008',
    students: '3,000+',
    ranking: 'Specialised Hospitality',
    description: 'Berjaya University College specialises in hospitality, culinary arts, and tourism management. Backed by the Berjaya Corporation Group, students benefit from direct industry connections, internships at Berjaya hotels and resorts, and a curriculum designed by industry leaders.',
    highlights: ['Berjaya Corporation Backing', 'Top Culinary Arts Programme', 'Industry Internships at Berjaya Hotels', 'Hands-On Practical Training', 'Located in KL City Centre', 'Strong Hospitality Network'],
    campusImage: '/images/Mahsa.jpeg',
    logoColor: '#C41E3A',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.berjaya.edu.my',
  },
  {
    name: 'Cats College',
    shortName: 'Cats',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Business', 'IT', 'Creative Arts', 'Communication', 'Psychology'],
    accent: '#FF6B35',
    tag: 'Creative & Business',
    founded: '1999',
    students: '2,500+',
    ranking: 'MQA Accredited',
    description: 'Cats College is a private college in KL known for its creative arts, business, and IT programmes. With a focus on practical, industry-relevant education, Cats College prepares students for the modern workplace through hands-on projects and real-world training.',
    highlights: ['Established 1999', 'Creative Arts Focus', 'Industry-Relevant Curriculum', 'Practical Learning Approach', 'Affordable Programmes', 'Located in KL'],
    campusImage: '/images/UCMI.jpeg',
    logoColor: '#FF6B35',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.cats.edu.my',
  },
  {
    name: 'Genovasi University College',
    shortName: 'Genovasi',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Business', 'IT', 'Design', 'Education', 'Health Sciences'],
    accent: '#6A0DAD',
    tag: 'Innovation Focus',
    founded: '2010',
    students: '2,000+',
    ranking: 'MQA Accredited',
    description: 'Genovasi University College is a forward-thinking institution focused on innovation and entrepreneurship. Offering programmes in business, IT, design, and health sciences, Genovasi equips students with creative problem-solving skills and an entrepreneurial mindset.',
    highlights: ['Entrepreneurship Focus', 'Innovation-Driven Curriculum', 'Modern Facilities', 'Small Class Sizes', 'Industry Partnerships', 'Located in KL'],
    campusImage: '/images/UniCam.jpeg',
    logoColor: '#6A0DAD',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.genovasi.edu.my',
  },
  {
    name: 'Geomatika University College',
    shortName: 'Geomatika',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Surveying', 'Geoinformatics', 'Built Environment', 'Business', 'IT'],
    accent: '#228B22',
    tag: 'Surveying Specialist',
    founded: '1998',
    students: '2,000+',
    ranking: 'Specialised Institution',
    description: 'Geomatika University College is Malaysia\'s leading institution for surveying, geoinformatics, and built environment education. It produces highly sought-after graduates in land surveying, GIS, and construction management with strong industry demand.',
    highlights: ['Top Surveying Programme', 'GIS & Geoinformatics Specialist', 'Strong Industry Demand', 'Practical Field Training', 'MQA Accredited', 'Established 1998'],
    campusImage: '/images/AlfaUniversity.jpeg',
    logoColor: '#228B22',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.geomatika.edu.my',
  },
  {
    name: 'IACT College',
    shortName: 'IACT',
    location: 'Petaling Jaya, Selangor',
    type: 'Private',
    programmes: ['Mass Communication', 'Broadcasting', 'Advertising', 'Public Relations', 'Media Studies'],
    accent: '#E63946',
    tag: 'Media & Communication',
    founded: '1970',
    students: '3,000+',
    ranking: 'Top Media College',
    description: 'One of Malaysia\'s oldest and most respected media colleges, IACT has been producing top media professionals since 1970. Its programmes in mass communication, broadcasting, and advertising are industry-renowned, with graduates working at major media outlets across Southeast Asia.',
    highlights: ['Established 1970', 'Top Media & Communication College', 'Industry-Standard Studios', 'Strong Alumni in Media', 'Hands-On Production Training', 'Petaling Jaya Campus'],
    campusImage: '/images/IIMAT.jpeg',
    logoColor: '#E63946',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.iact.edu.my',
  },
  {
    name: 'IHM College',
    shortName: 'IHM',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Hospitality', 'Culinary Arts', 'Tourism', 'Event Management'],
    accent: '#D4A017',
    tag: 'Hospitality Training',
    founded: '2005',
    students: '1,500+',
    ranking: 'Specialised Hospitality',
    description: 'IHM College is a specialised hospitality and culinary arts institution in KL. With industry-standard kitchens and training facilities, IHM produces graduates ready for careers in hotels, restaurants, and event management across Malaysia and beyond.',
    highlights: ['Industry-Standard Kitchens', 'Hands-On Culinary Training', 'Hotel & Restaurant Partnerships', 'Event Management Programme', 'Affordable Fees', 'Located in KL'],
    campusImage: '/images/LincolnUniversityCollage.jpeg',
    logoColor: '#D4A017',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.ihm.edu.my',
  },
  {
    name: 'Kings University College',
    shortName: 'Kings',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Business', 'IT', 'Accounting', 'Marketing', 'English Language'],
    accent: '#4169E1',
    tag: 'Business & IT',
    founded: '2000',
    students: '2,000+',
    ranking: 'MQA Accredited',
    description: 'Kings University College offers affordable, quality education in business, IT, and accounting. Located in KL, it provides a supportive learning environment with flexible programme options designed for both local and international students.',
    highlights: ['Affordable Tuition', 'Business & IT Focus', 'Flexible Programme Options', 'Supportive Learning Environment', 'MQA Accredited', 'Located in KL'],
    campusImage: '/images/KingsUniversityCollage.jpeg',
    logoColor: '#4169E1',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.kings.edu.my',
  },
  {
    name: 'Kuala Lumpur Metropolitan University College (KLMUC)',
    shortName: 'KLMUC',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Business', 'IT', 'Engineering', 'Education', 'Law'],
    accent: '#8B4513',
    tag: 'Metropolitan',
    founded: '1991',
    students: '4,000+',
    ranking: 'MQA Accredited',
    description: 'KLMUC is a well-established private university college in KL offering a wide range of programmes in business, IT, engineering, and law. With over 30 years of experience, KLMUC provides quality education with strong industry connections.',
    highlights: ['Established 1991', 'Wide Range of Programmes', 'Strong Industry Connections', 'Affordable Fees', 'Experienced Faculty', 'Located in KL'],
    campusImage: '/images/UNIRAZAK.jpeg',
    logoColor: '#8B4513',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.klmuc.edu.my',
  },
  {
    name: 'Mont Royale College',
    shortName: 'Mont Royale',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Business', 'Accounting', 'IT', 'Early Childhood Education', 'English'],
    accent: '#708090',
    tag: 'Affordable Education',
    founded: '2005',
    students: '1,500+',
    ranking: 'MQA Accredited',
    description: 'Mont Royale College is a private college in KL known for its affordable tuition and quality education in business, accounting, and early childhood education. It provides a nurturing environment with personalised attention for each student.',
    highlights: ['Very Affordable Fees', 'Small Class Sizes', 'Early Childhood Education', 'Personalised Attention', 'MQA Accredited', 'Located in KL'],
    campusImage: '/images/UNITENUniversity.jpeg',
    logoColor: '#708090',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.montroyale.edu.my',
  },
  {
    name: 'Nilai University College (NMUC)',
    shortName: 'NMUC',
    location: 'Nilai, Negeri Sembilan',
    type: 'Private',
    programmes: ['Business', 'IT', 'Engineering', 'Hospitality', 'Health Sciences'],
    accent: '#2E7D32',
    tag: 'Campus Life',
    founded: '1997',
    students: '5,000+',
    ranking: 'MQA Accredited',
    description: 'Nilai University College is located in the student town of Nilai, offering a vibrant campus life with modern facilities. Programmes in business, engineering, and hospitality are popular choices, and the campus features excellent sports and residential facilities.',
    highlights: ['Vibrant Campus Life', 'Modern Sports Facilities', 'On-Campus Accommodation', 'Diverse Programmes', 'Student Town Location', 'Established 1997'],
    campusImage: '/images/NilaiUniversity.jpeg',
    logoColor: '#2E7D32',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.nilai.edu.my',
  },
  {
    name: 'Universiti Sains Islam Malaysia (USIM)',
    shortName: 'USIM',
    location: 'Nilai, Negeri Sembilan',
    type: 'Public',
    programmes: ['Islamic Studies', 'Science', 'Medicine', 'Dentistry', 'Engineering', 'IT'],
    accent: '#1B5E20',
    tag: 'Public Islamic Science',
    founded: '1998',
    students: '10,000+',
    ranking: 'MQA Accredited',
    description: 'USIM is Malaysia\'s premier public university integrating Islamic sciences with modern scientific disciplines. It offers unique programmes combining Islamic studies with medicine, dentistry, engineering, and science, producing well-rounded graduates.',
    highlights: ['Public University Status', 'Islamic + Science Integration', 'Medicine & Dentistry', 'Affordable Public Fees', 'Modern Nilai Campus', 'Research-Focused'],
    campusImage: '/images/HeriotWatt.jpeg',
    logoColor: '#1B5E20',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.usim.edu.my',
  },
  {
    name: 'Universiti Tunku Abdul Rahman (UTAR)',
    shortName: 'UTAR',
    location: 'Kampar, Perak / Petaling Jaya, Selangor',
    type: 'Private',
    programmes: ['Engineering', 'Business', 'IT', 'Medicine', 'Chinese Studies', 'Agriculture'],
    accent: '#0D47A1',
    tag: 'Research University',
    founded: '2002',
    students: '25,000+',
    ranking: 'QS World Top 800+',
    description: 'Founded by the Malaysian Chinese Association, UTAR is one of Malaysia\'s top private universities with a strong research focus. Its Kampar campus is one of the largest in Malaysia, and UTAR is known for engineering, business, and Chinese studies.',
    highlights: ['QS World Top 800+', 'Strong Research Focus', 'Two Campuses (Kampar & PJ)', '25,000+ Students', 'Top Engineering & Business', 'MCA Founded'],
    campusImage: '/images/UNITAR.jpeg',
    logoColor: '#0D47A1',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.utar.edu.my',
  },
  {
    name: 'Universiti Tun Hussein Onn Malaysia (UTHM)',
    shortName: 'UTHM',
    location: 'Batu Pahat, Johor',
    type: 'Public',
    programmes: ['Engineering', 'IT', 'Business', 'Education', 'Technical & Vocational'],
    accent: '#1565C0',
    tag: 'Technical Public',
    founded: '1993',
    students: '15,000+',
    ranking: 'MQA Accredited',
    description: 'UTHM is a public technical university specialising in engineering, IT, and technical education. Known for producing highly skilled technical graduates, UTHM has strong partnerships with industries and government agencies across Malaysia.',
    highlights: ['Public Technical University', 'Engineering & IT Focus', 'Strong Industry Partnerships', 'Affordable Public Fees', 'Technical & Vocational Education', 'Batu Pahat Campus'],
    campusImage: '/images/UniversityMalayaWales.jpeg',
    logoColor: '#1565C0',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.uthm.edu.my',
  },
  {
    name: 'Xiamen University Malaysia',
    shortName: 'Xiamen Malaysia',
    location: 'Sepang, Selangor',
    type: 'Private',
    programmes: ['Engineering', 'Business', 'Marine Science', 'Chinese Studies', 'Medicine', 'IT'],
    accent: '#C62828',
    tag: 'Chinese Branch Campus',
    founded: '2016',
    students: '5,000+',
    ranking: 'QS World Top 400+ (Main Campus)',
    description: 'Xiamen University Malaysia is the first overseas branch campus of a Chinese university. Located in Sepang, it offers the same prestigious degree as its main campus in China, with programmes taught in English. A unique option for students seeking a Chinese university experience in Malaysia.',
    highlights: ['First Chinese Branch Campus in Malaysia', 'QS Top 400+ Main Campus', 'English-Medium Instruction', 'Affordable Chinese Degree', 'Modern Sepang Campus', 'Growing Reputation'],
    campusImage: '/images/UniversityOfWollong.jpeg',
    logoColor: '#C62828',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.xmu.edu.my',
  },
  {
    name: 'Veritas University College',
    shortName: 'Veritas',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Business', 'IT', 'Accounting', 'Marketing', 'Entrepreneurship'],
    accent: '#5C6BC0',
    tag: 'Business Focused',
    founded: '2005',
    students: '2,000+',
    ranking: 'MQA Accredited',
    description: 'Veritas University College is a private institution in KL specialising in business, IT, and entrepreneurship education. With a focus on producing industry-ready graduates, Veritas offers practical programmes with real-world business projects and internships.',
    highlights: ['Business & Entrepreneurship Focus', 'Practical Curriculum', 'Industry Projects', 'Affordable Fees', 'MQA Accredited', 'Located in KL'],
    campusImage: '/images/IUKL.jpeg',
    logoColor: '#5C6BC0',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.veritas.edu.my',
  },
  {
    name: 'YPC College',
    shortName: 'YPC',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Business', 'Accounting', 'IT', 'English Language', 'Pre-University'],
    accent: '#00897B',
    tag: 'Foundation Specialist',
    founded: '2000',
    students: '1,500+',
    ranking: 'MQA Accredited',
    description: 'YPC College is a private college in KL offering foundation, diploma, and degree programmes in business, accounting, and IT. Known for its strong pre-university programmes, YPC provides a pathway for students to progress to top universities in Malaysia and abroad.',
    highlights: ['Strong Foundation Programmes', 'Pathway to Top Universities', 'Affordable Tuition', 'Business & Accounting Focus', 'Personalised Support', 'Located in KL'],
    campusImage: '/images/UniMY.jpeg',
    logoColor: '#00897B',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.ypc.edu.my',
  },
  {
    name: 'Imperium International College',
    shortName: 'Imperium',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Business', 'IT', 'Accounting', 'Communication', 'Pre-University'],
    accent: '#7B1FA2',
    tag: 'International Pathway',
    founded: '2005',
    students: '2,000+',
    ranking: 'MQA Accredited',
    description: 'Imperium International College offers internationally recognised programmes in business, IT, and communication. With strong university partnerships, Imperium provides pathway programmes that allow students to transfer to partner universities worldwide.',
    highlights: ['International Pathway Programmes', 'University Transfer Options', 'Business & IT Focus', 'Global Partnerships', 'Affordable Fees', 'Located in KL'],
    campusImage: '/images/LSBF.jpeg',
    logoColor: '#7B1FA2',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.imperium.edu.my',
  },
  {
    name: 'Reliance College',
    shortName: 'Reliance',
    location: 'Kuala Lumpur',
    type: 'Private',
    programmes: ['Business', 'IT', 'Accounting', 'Law Enforcement', 'Security Management'],
    accent: '#37474F',
    tag: 'Unique Programmes',
    founded: '1995',
    students: '1,500+',
    ranking: 'MQA Accredited',
    description: 'Reliance College is a private institution in KL offering unique programmes including business, IT, and specialised courses in law enforcement and security management. It provides niche education options not commonly found at other institutions.',
    highlights: ['Law Enforcement Programme', 'Security Management', 'Business & IT', 'Niche Education Options', 'Established 1995', 'Located in KL'],
    campusImage: '/images/RelianceCollage.jpeg',
    logoColor: '#37474F',
    campusTourVideo: 'https://www.youtube.com/embed/zBK8Q8wpldg',
    website: 'https://www.reliance.edu.my',
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
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center text-cream/70 hover:text-cream transition-colors"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          ✕
        </button>

        {/* Hero image */}
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
          {/* Stats row */}
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
            {/* Left */}
            <div>
              <h3 className="font-body font-semibold text-gold mb-3 uppercase tracking-widest text-xs">About</h3>
              <p className="font-serif font-light text-cream/75 text-sm leading-relaxed mb-6">{uni.description}</p>

              <h3 className="font-body font-semibold text-gold mb-3 uppercase tracking-widest text-xs">Programmes</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {uni.programmes.map(p => (
                  <span key={p} className="text-[11px] px-3 py-1 rounded-full font-body text-cream/70" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>{p}</span>
                ))}
              </div>

              <h3 className="font-body font-semibold text-gold mb-3 uppercase tracking-widest text-xs">Highlights</h3>
              <ul className="space-y-2">
                {uni.highlights.map(h => (
                  <li key={h} className="flex items-center gap-2 text-cream/70 text-sm font-body">
                    <span style={{ color: '#C9A234' }}>✓</span> {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right - Video */}
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

function UniversityCard({ uni, index, onClick }: { uni: University; index: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: (index % 4) * 0.1,
        scrollTrigger: { trigger: ref.current, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  }, [index]);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className="rounded-xl p-6 flex flex-col gap-4 cursor-pointer group"
      style={{
        opacity: 0,
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
        {uni.programmes.slice(0, 4).map(p => (
          <span key={p} className="text-[9px] px-2 py-0.5 rounded font-body text-mouse/70" style={{ background: 'rgba(255,255,255,0.05)' }}>{p}</span>
        ))}
        {uni.programmes.length > 4 && (
          <span className="text-[9px] px-2 py-0.5 rounded font-body text-gold/60" style={{ background: 'rgba(201,162,52,0.08)' }}>+{uni.programmes.length - 4} more</span>
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
  );
}

export default function UniversitiesSection({ onExploreMore }: { onExploreMore?: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);

  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 80%', toggleActions: 'play none none none' }
      }
    );
  }, []);

  return (
    <>
      {selectedUni && <UniversityModal uni={selectedUni} onClose={() => setSelectedUni(null)} />}

      <section ref={sectionRef} className="relative w-full py-32 lg:py-44" id="destinations"
        style={{ backgroundColor: '#0B1A33', backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(11,42,92,0.6) 0%, transparent 60%)' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">

          {/* Header */}
          <div ref={headerRef} className="mb-16" style={{ opacity: 0 }}>
            <div className="w-16 h-px mb-8" style={{ background: 'rgba(201,162,52,0.5)' }} />
            <h2 className="font-display font-bold text-kimono uppercase"
              style={{ fontSize: 'clamp(36px, 6.5vw, 80px)', letterSpacing: '0.05em', lineHeight: 1.05 }}>
              OUR PARTNER<br />
              <span style={{ WebkitTextStroke: '1px rgba(201,162,52,0.5)', color: 'transparent' }}>UNIVERSITIES</span>
            </h2>
            <p className="font-serif font-light text-cream/55 mt-6 max-w-[560px]" style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', lineHeight: 1.75 }}>
              We are officially partnered with Malaysia's leading universities. Click any university to explore campus photos, programmes, and watch the campus tour video.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              {['Free Offer Letter', '99% Visa Rate', 'Certified Counsellors', 'End-to-End Support'].map(badge => (
                <span key={badge} className="px-4 py-2 rounded-full text-[11px] font-body uppercase tracking-wider"
                  style={{ border: '1px solid rgba(201,162,52,0.4)', color: '#C9A234' }}>
                  ✓ {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {universities.map((uni, i) => (
              <UniversityCard key={uni.name} uni={uni} index={i} onClick={() => setSelectedUni(uni)} />
            ))}
          </div>

          {/* Explore More Universities */}
          <div className="mt-16 text-center">
            <button
              onClick={onExploreMore}
              className="px-10 py-4 rounded-full font-body text-sm uppercase tracking-widest cursor-pointer transition-all duration-300 hover:scale-[1.03]"
              style={{
                border: '1px solid rgba(201,162,52,0.5)',
                color: '#C9A234',
                background: 'transparent',
              }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.background = '#C9A234'; el.style.color = '#0A0A0A'; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'transparent'; el.style.color = '#C9A234'; }}
            >
              Explore More Universities ▼
            </button>
            <p className="font-body text-cream/30 text-xs mt-3">{universities.length} universities available</p>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <p className="font-serif font-light text-cream/40 mb-8" style={{ fontSize: '16px' }}>
              Don't see your preferred university? We work with 50+ partner universities worldwide.
            </p>
            <button
              className="px-12 py-4 rounded-full font-body text-sm uppercase tracking-widest cursor-pointer"
              style={{ border: '1px solid rgba(201,162,52,0.5)', color: '#C9A234', background: 'transparent', transition: 'all 300ms cubic-bezier(0.16,1,0.3,1)' }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.background = '#C9A234'; el.style.color = '#0A0A0A'; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'transparent'; el.style.color = '#C9A234'; }}
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ask About Your University
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
