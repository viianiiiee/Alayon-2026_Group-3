export const HOUSES = [
  {
    id: 'JAVA',
    name: 'House of Java',
    shortName: 'Java',
    color: '#7C3AED',
    colorLight: '#A78BFA',
    colorDark: '#4C1D95',
    gold: '#F59E0B',
    glow: 'rgba(124,58,237,0.35)',
    logo: '/logos/java.png',
    bgGradient: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%)',
    description: 'Bold. Crowned. Unstoppable.',
    leader4th: 'Ana Reyes',
    leader3rd: 'Carlo Santos',
    secretary: 'Liza Dela Cruz',
    houseParent: 'Prof. M. Garcia',
    houseMaster: 'Dr. R. Santos',
    yearReps: ['Mark Sy (1st)', 'Dana Cruz (2nd)', 'Carlo Santos (3rd)', 'Ana Reyes (4th)'],
    points: 1810,
    members: 65,
    rank: 2,
  },
  {
    id: 'PYTHON',
    name: 'House of Python',
    shortName: 'Python',
    color: '#D97706',
    colorLight: '#FCD34D',
    colorDark: '#1C1917',
    gold: '#F59E0B',
    glow: 'rgba(217,119,6,0.35)',
    logo: '/logos/python.png',
    bgGradient: 'linear-gradient(135deg, #1C1917 0%, #B45309 100%)',
    description: 'Patient. Precise. Lethal.',
    leader4th: 'Maria Lim',
    leader3rd: 'Jose Tan',
    secretary: 'Rosa Ramos',
    houseParent: 'Prof. L. Cruz',
    houseMaster: 'Dr. P. Reyes',
    yearReps: ['Ben Castro (1st)', 'Kim Uy (2nd)', 'Jose Tan (3rd)', 'Maria Lim (4th)'],
    points: 1690,
    members: 63,
    rank: 3,
  },
  {
    id: 'PERL',
    name: 'House of Perl',
    shortName: 'Perl',
    color: '#DC2626',
    colorLight: '#FCA5A5',
    colorDark: '#7F1D1D',
    gold: '#F59E0B',
    glow: 'rgba(220,38,38,0.35)',
    logo: '/logos/perl.png',
    bgGradient: 'linear-gradient(135deg, #7F1D1D 0%, #DC2626 100%)',
    description: 'Fierce. Relentless. Crimson.',
    leader4th: 'Pedro Sy',
    leader3rd: 'Rosa Dela Cruz',
    secretary: 'Marco Tan',
    houseParent: 'Prof. D. Martinez',
    houseMaster: 'Dr. A. Lim',
    yearReps: ['Jay Gomez (1st)', 'Iris Ramos (2nd)', 'Rosa Dela Cruz (3rd)', 'Pedro Sy (4th)'],
    points: 1950,
    members: 67,
    rank: 1,
  },
]

export const getHouse = id => HOUSES.find(h => h.id === id)

export const ACTIVITIES = {
  sports: [
    { id: 'BKT-M', name: 'Basketball (Men)',           category: 'Sports',  date: '2026-11-20', status: 'upcoming' },
    { id: 'BKT-W', name: 'Basketball (Women)',         category: 'Sports',  date: '2026-11-21', status: 'upcoming' },
    { id: 'VLY-M', name: 'Volleyball (Men)',           category: 'Sports',  date: '2026-11-24', status: 'upcoming' },
    { id: 'VLY-W', name: 'Volleyball (Women)',         category: 'Sports',  date: '2026-11-25', status: 'upcoming' },
    { id: 'TOW',   name: 'Tug-of-War',                 category: 'Larong Pinoy', date: '2026-11-27', status: 'upcoming' },
    { id: 'SHR',   name: 'Shirt Relay',                category: 'Larong Pinoy', date: '2026-11-27', status: 'upcoming' },
    { id: 'LNG',   name: 'Longest Line',               category: 'Larong Pinoy', date: '2026-11-27', status: 'upcoming' },
  ],
  arts: [
    { id: 'DNC',   name: 'Dance Competition',          category: 'Arts',    date: '2026-12-04', status: 'upcoming' },
    { id: 'SNE',   name: 'Duet Singing Competition',   category: 'Arts',    date: '2026-12-05', status: 'upcoming' },
    { id: 'DGA',   name: 'Digital Art Contest',        category: 'Arts',    date: '2026-12-06', status: 'upcoming' },
    { id: 'CVS',   name: 'Commercial Video Skit',      category: 'Arts',    date: '2026-12-08', status: 'upcoming' },
    { id: 'CPV',   name: 'College Promotional Video',  category: 'Arts',    date: '2026-12-08', status: 'upcoming' },
    { id: 'PGT',   name: 'Mr. & Ms. CISC Pageant',    category: 'Arts',    date: '2026-12-12', status: 'upcoming' },
  ],
  online: [
    { id: 'ESP',   name: 'E-Sports (Mobile Legends)',  category: 'Online',  date: '2026-11-28', status: 'upcoming' },
    { id: 'VLR',   name: 'Valorant Tournament',        category: 'Online',  date: '2026-11-29', status: 'upcoming' },
  ],
}

export const events = [
  { id: 'E001', title: 'House Opening Program',          category: 'Opening',   date: '2026-08-02', status: 'completed', scores: { PERL: 1, JAVA: 2, PYTHON: 3 }, notes: 'Official launch of the CISC House System' },
  { id: 'E002', title: '2-Minute Saludo Presentation',   category: 'Sports',    date: '2026-10-15', status: 'completed', scores: { PERL: 15, JAVA: 10, PYTHON: 5 }, notes: '' },
  { id: 'E003', title: 'Street Dance Competition',       category: 'Arts',      date: '2026-10-22', status: 'completed', scores: { PERL: 15, JAVA: 10, PYTHON: 5 }, notes: 'Perl dominates with power performance' },
  { id: 'E004', title: 'Digital Art Contest',            category: 'Arts',      date: '2026-11-05', status: 'completed', scores: { PERL: 15, JAVA: 10, PYTHON: 5 }, notes: '' },
  { id: 'E005', title: 'Intramural Basketball (Men)',    category: 'Sports',    date: '2026-11-10', status: 'ongoing',   scores: {}, notes: 'Finals in progress' },
  { id: 'E006', title: 'Duet Singing Competition',       category: 'Arts',      date: '2026-11-15', status: 'upcoming',  scores: {}, notes: '' },
  { id: 'E007', title: 'Volleyball (Women)',             category: 'Sports',    date: '2026-11-21', status: 'upcoming',  scores: {}, notes: '' },
  { id: 'E008', title: 'Mr. & Ms. CISC Pageant',        category: 'Arts',      date: '2026-12-12', status: 'upcoming',  scores: {}, notes: 'Grand finale event' },
]

export const members = [
  { id: 'S001', name: 'Ana Reyes',      houseId: 'JAVA',   yearLevel: 4, section: 'BSCS 4-A', role: 'House Leader', gender: 'F', avatar: 'AR' },
  { id: 'S002', name: 'Carlo Santos',   houseId: 'JAVA',   yearLevel: 3, section: 'BSCS 3-B', role: 'House Leader', gender: 'M', avatar: 'CS' },
  { id: 'S003', name: 'Liza Dela Cruz', houseId: 'JAVA',   yearLevel: 2, section: 'BSIT 2-A', role: 'Secretary',    gender: 'F', avatar: 'LD' },
  { id: 'S004', name: 'Mark Sy',        houseId: 'JAVA',   yearLevel: 1, section: 'BSCS 1-C', role: 'Year Rep',     gender: 'M', avatar: 'MS' },
  { id: 'S005', name: 'Dana Cruz',      houseId: 'JAVA',   yearLevel: 2, section: 'BSCS 2-A', role: 'Year Rep',     gender: 'F', avatar: 'DC' },
  { id: 'S006', name: 'James Reyes',    houseId: 'JAVA',   yearLevel: 1, section: 'BSIT 1-B', role: 'Member',       gender: 'M', avatar: 'JR' },
  { id: 'S007', name: 'Maria Lim',      houseId: 'PYTHON', yearLevel: 4, section: 'BSCS 4-B', role: 'House Leader', gender: 'F', avatar: 'ML' },
  { id: 'S008', name: 'Jose Tan',       houseId: 'PYTHON', yearLevel: 3, section: 'BSIT 3-A', role: 'House Leader', gender: 'M', avatar: 'JT' },
  { id: 'S009', name: 'Rosa Ramos',     houseId: 'PYTHON', yearLevel: 2, section: 'BSCS 2-C', role: 'Secretary',    gender: 'F', avatar: 'RR' },
  { id: 'S010', name: 'Ben Castro',     houseId: 'PYTHON', yearLevel: 1, section: 'BSCS 1-A', role: 'Year Rep',     gender: 'M', avatar: 'BC' },
  { id: 'S011', name: 'Kim Uy',         houseId: 'PYTHON', yearLevel: 2, section: 'BSIT 2-B', role: 'Year Rep',     gender: 'F', avatar: 'KU' },
  { id: 'S012', name: 'Noel Gomez',     houseId: 'PYTHON', yearLevel: 3, section: 'BSCS 3-A', role: 'Member',       gender: 'M', avatar: 'NG' },
  { id: 'S013', name: 'Pedro Sy',       houseId: 'PERL',   yearLevel: 4, section: 'BSCS 4-C', role: 'House Leader', gender: 'M', avatar: 'PS' },
  { id: 'S014', name: 'Rosa Dela Cruz', houseId: 'PERL',   yearLevel: 3, section: 'BSIT 3-B', role: 'House Leader', gender: 'F', avatar: 'RD' },
  { id: 'S015', name: 'Marco Tan',      houseId: 'PERL',   yearLevel: 2, section: 'BSCS 2-B', role: 'Secretary',    gender: 'M', avatar: 'MT' },
  { id: 'S016', name: 'Jay Gomez',      houseId: 'PERL',   yearLevel: 1, section: 'BSCS 1-B', role: 'Year Rep',     gender: 'M', avatar: 'JG' },
  { id: 'S017', name: 'Iris Ramos',     houseId: 'PERL',   yearLevel: 2, section: 'BSIT 2-C', role: 'Year Rep',     gender: 'F', avatar: 'IR' },
  { id: 'S018', name: 'Grace Santos',   houseId: 'PERL',   yearLevel: 1, section: 'BSIT 1-A', role: 'Member',       gender: 'F', avatar: 'GS' },
]

export const attendanceLogs = [
  { id: 'A001', studentId: 'S001', name: 'Ana Reyes',      houseId: 'JAVA',   event: 'Street Dance Competition', date: '2026-10-22', time: '07:42 AM', status: 'present' },
  { id: 'A002', studentId: 'S002', name: 'Carlo Santos',   houseId: 'JAVA',   event: 'Street Dance Competition', date: '2026-10-22', time: '07:55 AM', status: 'present' },
  { id: 'A003', studentId: 'S007', name: 'Maria Lim',      houseId: 'PYTHON', event: 'Street Dance Competition', date: '2026-10-22', time: '08:01 AM', status: 'present' },
  { id: 'A004', studentId: 'S008', name: 'Jose Tan',       houseId: 'PYTHON', event: 'Street Dance Competition', date: '2026-10-22', time: '—',        status: 'absent' },
  { id: 'A005', studentId: 'S013', name: 'Pedro Sy',       houseId: 'PERL',   event: 'Street Dance Competition', date: '2026-10-22', time: '08:10 AM', status: 'late' },
  { id: 'A006', studentId: 'S014', name: 'Rosa Dela Cruz', houseId: 'PERL',   event: 'Street Dance Competition', date: '2026-10-22', time: '07:50 AM', status: 'present' },
]

export const attendanceDeductionTable = [
  { absentees: '3 members',      deduction: 1 },
  { absentees: '5 members',      deduction: 2 },
  { absentees: '7 members',      deduction: 3 },
  { absentees: '9 members',      deduction: 4 },
  { absentees: '11+ members',    deduction: 5 },
]

export const announcements = [
  {
    id: 'AN001', title: 'House System AY 2025–2026 — Officially Launched!',
    body: 'The CISC House System is now officially launched! All students have been assigned to their respective houses: House of Java, House of Python, and House of Perl. Check the House Management page for your house assignment and report to your House Leader.',
    author: 'Admin', date: '2026-08-02', status: 'published', pinned: true, target: 'All Houses', urgent: true,
  },
  {
    id: 'AN002', title: 'Intramural Basketball Finals — This Friday!',
    body: 'The much-awaited Basketball Finals (Men) is happening this Friday at the CISC Gymnasium. All house members are required to attend and show your support. Failure to attend without valid reason will result in attendance deduction.',
    author: 'Admin', date: '2026-11-08', status: 'published', pinned: true, target: 'All Houses', urgent: true,
  },
  {
    id: 'AN003', title: 'Duet Singing Competition — Registration Now Open',
    body: 'Each house must submit ONE pair of representatives for the Duet Singing Competition on November 15. Submit forms to your House Leader by November 12. Collection of money is strictly prohibited—be resourceful.',
    author: 'Admin', date: '2026-11-09', status: 'published', pinned: false, target: 'All Houses', urgent: false,
  },
  {
    id: 'AN004', title: 'Monthly House Meeting Reminder — November',
    body: 'All houses are required to hold their November monthly meeting before November 20. Room assignments will be released by House Masters. Off-campus meetings are strictly prohibited without written consent.',
    author: 'Admin', date: '2026-11-07', status: 'published', pinned: false, target: 'All Houses', urgent: false,
  },
  {
    id: 'AN005', title: 'Mr. & Ms. CISC Pageant — Nomination Guidelines (Draft)',
    body: 'Each house must nominate ONE Mr. CISC and ONE Ms. CISC representative. Nominees must demonstrate outstanding personality, talent, and advocacy. Final guidelines to be released on November 20.',
    author: 'Admin', date: '2026-11-10', status: 'draft', pinned: false, target: 'All Houses', urgent: false,
  },
]

export const pointsLog = [
  { id: 'P001', houseId: 'PERL',   event: '2-Minute Saludo Presentation',  category: 'Sports',    place: 1, points: +15, awardedBy: 'Admin Cruz', date: '2026-10-15', note: '1st Place — Flawless execution' },
  { id: 'P002', houseId: 'JAVA',   event: '2-Minute Saludo Presentation',  category: 'Sports',    place: 2, points: +10, awardedBy: 'Admin Cruz', date: '2026-10-15', note: '2nd Place' },
  { id: 'P003', houseId: 'PYTHON', event: '2-Minute Saludo Presentation',  category: 'Sports',    place: 3, points: +5,  awardedBy: 'Admin Cruz', date: '2026-10-15', note: '3rd Place' },
  { id: 'P004', houseId: 'PERL',   event: 'Street Dance Competition',       category: 'Arts',      place: 1, points: +15, awardedBy: 'Admin R.',   date: '2026-10-22', note: '1st Place — Power performance' },
  { id: 'P005', houseId: 'JAVA',   event: 'Street Dance Competition',       category: 'Arts',      place: 2, points: +10, awardedBy: 'Admin R.',   date: '2026-10-22', note: '2nd Place' },
  { id: 'P006', houseId: 'PYTHON', event: 'Street Dance Competition',       category: 'Arts',      place: 3, points: +5,  awardedBy: 'Admin R.',   date: '2026-10-22', note: '3rd Place' },
  { id: 'P007', houseId: 'PERL',   event: 'Digital Art Contest',            category: 'Arts',      place: 1, points: +15, awardedBy: 'Admin Cruz', date: '2026-11-05', note: '1st Place — Stunning entry' },
  { id: 'P008', houseId: 'JAVA',   event: 'Digital Art Contest',            category: 'Arts',      place: 2, points: +10, awardedBy: 'Admin Cruz', date: '2026-11-05', note: '2nd Place' },
  { id: 'P009', houseId: 'PYTHON', event: 'Digital Art Contest',            category: 'Arts',      place: 3, points: +5,  awardedBy: 'Admin Cruz', date: '2026-11-05', note: '3rd Place' },
  { id: 'P010', houseId: 'PERL',   event: 'Mentoring Program (Oct)',        category: 'Volunteerism', place: null, points: +10, awardedBy: 'Admin Cruz', date: '2026-10-30', note: 'Community service excellence' },
  { id: 'P011', houseId: 'JAVA',   event: 'Mentoring Program (Oct)',        category: 'Volunteerism', place: null, points: +5, awardedBy: 'Admin Cruz', date: '2026-10-30', note: 'Peer mentoring session' },
  { id: 'P012', houseId: 'PYTHON', event: 'Community Contribution (Oct)',   category: 'Volunteerism', place: null, points: +10, awardedBy: 'Admin R.', date: '2026-10-30', note: 'Bayanihan clean-up' },
  { id: 'P013', houseId: 'PERL',   event: 'Attendance Bonus — House Opening', category: 'Attendance', place: null, points: +5, awardedBy: 'System', date: '2026-08-02', note: '100% attendance' },
  { id: 'P014', houseId: 'PYTHON', event: 'Misconduct Deduction',           category: 'Deduction', place: null, points: -2, awardedBy: 'Admin Cruz', date: '2026-10-20', note: 'Disruptive behavior during event' },
]

export const auditLog = [
  { id: 'AU001', action: 'Points awarded',       actor: 'Admin Cruz', target: 'Perl +15 (Saludo Presentation — 1st)',  timestamp: '2026-10-15 17:00' },
  { id: 'AU002', action: 'Points awarded',       actor: 'Admin R.',   target: 'Perl +15 (Street Dance — 1st)',         timestamp: '2026-10-22 18:00' },
  { id: 'AU003', action: 'Points deducted',      actor: 'Admin Cruz', target: 'Python -2 (Misconduct — disruptive)',   timestamp: '2026-10-20 10:00' },
  { id: 'AU004', action: 'Announcement published', actor: 'Admin Cruz', target: 'House System Officially Launched',  timestamp: '2026-08-02 08:00' },
  { id: 'AU005', action: 'Event finalized',      actor: 'Admin Cruz', target: 'Digital Art Contest — scores locked',  timestamp: '2026-11-05 17:00' },
  { id: 'AU006', action: 'Attendance bonus',     actor: 'System',     target: 'Perl +5 (100% attendance — Opening)',  timestamp: '2026-08-02 20:00' },
]

export const trendData = [
  { month: 'Aug', Java: 300, Python: 275, Perl: 320 },
  { month: 'Sep', Java: 650, Python: 570, Perl: 720 },
  { month: 'Oct', Java: 1120, Python: 990, Perl: 1250 },
  { month: 'Nov', Java: 1810, Python: 1690, Perl: 1950 },
]

export const dashStats = {
  totalStudents: 598,
  totalEvents: events.length,
  completedEvents: events.filter(e => e.status === 'completed').length,
  ongoingEvents: events.filter(e => e.status === 'ongoing').length,
  upcomingEvents: events.filter(e => e.status === 'upcoming').length,
  academicYear: 'AY 2025–2026',
  semester: '1st Semester',
}

export const lostFoundItems = [
  {
    id: 'LF001', type: 'found', item: 'Black HP Laptop',
    description: 'HP Pavilion 15 black, CISC sticker on back cover, in blue laptop bag',
    category: 'Electronics', foundAt: 'Library 2nd Floor',
    foundBy: 'Ana Reyes', foundByHouse: 'JAVA', foundDate: '2026-11-10',
    status: 'unclaimed', claimedBy: null, claimDate: null, returnDate: null,
  },
  {
    id: 'LF002', type: 'found', item: 'ID Card — Pedro Villamor',
    description: 'CISC student ID, 3rd year BSCS. Found near the cafeteria.',
    category: 'Documents', foundAt: 'Cafeteria Entrance',
    foundBy: 'Marco Tan', foundByHouse: 'PERL', foundDate: '2026-11-09',
    status: 'claimed', claimedBy: 'Pedro Villamor (S041)', claimDate: '2026-11-11', returnDate: null,
  },
  {
    id: 'LF003', type: 'found', item: 'Samsung Galaxy A55',
    description: 'Black Samsung phone, cracked screen protector, no case. Found between chairs.',
    category: 'Electronics', foundAt: 'Room 302',
    foundBy: 'Kim Uy', foundByHouse: 'PYTHON', foundDate: '2026-11-11',
    status: 'verified', claimedBy: 'Mia Santos (S052)', claimDate: '2026-11-11', returnDate: null,
  },
  {
    id: 'LF004', type: 'found', item: 'Maroon Umbrella',
    description: 'Maroon/black foldable umbrella with wooden handle. No name tag.',
    category: 'Accessories', foundAt: 'Main Corridor Gate 1',
    foundBy: 'Jay Gomez', foundByHouse: 'PERL', foundDate: '2026-11-08',
    status: 'returned', claimedBy: 'Leo Ferrer (S019)', claimDate: '2026-11-09', returnDate: '2026-11-10',
  },
  {
    id: 'LF005', type: 'found', item: 'Calculus Textbook',
    description: 'Thomas\' Calculus 14th Ed., has "BSIT 2-A" written on cover',
    category: 'Books', foundAt: 'Library Study Area',
    foundBy: 'Grace Santos', foundByHouse: 'PERL', foundDate: '2026-11-11',
    status: 'unclaimed', claimedBy: null, claimDate: null, returnDate: null,
  },
  {
    id: 'LF006', type: 'found', item: 'Water Tumbler (Blue)',
    description: 'Blue stainless HydroFlask-style tumbler, stickers of anime characters',
    category: 'Accessories', foundAt: 'Gym Bleachers',
    foundBy: 'Rosa Dela Cruz', foundByHouse: 'PERL', foundDate: '2026-11-10',
    status: 'unclaimed', claimedBy: null, claimDate: null, returnDate: null,
  },
]
