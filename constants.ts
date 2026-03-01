
import { UserRole, Course, Room, User } from './types';

export const MOCK_TEACHER = {
  id: 't1',
  name: 'Budi Santoso, M.Pd',
  email: 'budi.santoso@school.id',
  role: UserRole.TEACHER,
  avatar: 'https://picsum.photos/seed/teacher/200',
  nisn: '197508122000031001',
  password: 'password123'
};

export const MOCK_STUDENT = {
  id: 's1',
  name: 'Ananda Putra',
  email: 'ananda.putra@student.id',
  role: UserRole.STUDENT,
  avatar: 'https://picsum.photos/seed/student/200',
  nisn: '0056789123',
  class: 'XI-A',
  password: 'password123'
};

export const MOCK_ADMIN = {
  id: 'a1',
  name: 'Admin Tel-Finder',
  email: 'admin@school.id',
  role: UserRole.ADMIN,
  avatar: 'https://picsum.photos/seed/admin/200',
  password: 'admin'
};

export const MOCK_GURU_ADMIN = {
  id: 'ga1',
  name: 'Siti Aminah, S.Kom',
  email: 'siti.aminah@school.id',
  role: UserRole.GURU_ADMIN,
  avatar: 'https://picsum.photos/seed/guruadmin/200',
  nisn: '198501012010012001',
  password: 'password123'
};

export const MOCK_TEACHER_2 = {
  id: 't2',
  name: 'Dewi Lestari, S.Pd',
  email: 'dewi.lestari@school.id',
  role: UserRole.TEACHER,
  avatar: 'https://picsum.photos/seed/teacher2/200',
  nisn: '198005202005012002',
  password: 'password123'
};

export const MOCK_STUDENT_2 = {
  id: 's2',
  name: 'Rizky Ramadhan',
  email: 'rizky.ramadhan@student.id',
  role: UserRole.STUDENT,
  avatar: 'https://picsum.photos/seed/student2/200',
  nisn: '0067890123',
  class: 'X-B',
  password: 'password123'
};

export const MOCK_TEACHER_3 = {
  id: 't3',
  name: 'Ahmad Hidayat, S.T',
  email: 'ahmad.hidayat@school.id',
  role: UserRole.TEACHER,
  avatar: 'https://picsum.photos/seed/teacher3/200',
  nisn: '199003152015011003',
  password: 'password123'
};

export const MOCK_STUDENT_3 = {
  id: 's3',
  name: 'Bunga Citra',
  email: 'bunga.citra@student.id',
  role: UserRole.STUDENT,
  avatar: 'https://picsum.photos/seed/student3/200',
  nisn: '0078901234',
  class: 'XII-IPA-1',
  password: 'password123'
};

export const MOCK_USERS: User[] = [
  MOCK_TEACHER, 
  MOCK_TEACHER_2, 
  MOCK_TEACHER_3,
  MOCK_STUDENT, 
  MOCK_STUDENT_2, 
  MOCK_STUDENT_3,
  MOCK_ADMIN, 
  MOCK_GURU_ADMIN
];

export const INITIAL_COURSES: Course[] = [];

const generateClassRooms = (): Room[] => {
  const levels = ['X', 'XI', 'XII'] as const;
  const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const rooms: Room[] = [];

  levels.forEach(level => {
    sections.forEach(section => {
      rooms.push({
        id: `room-${level}-${section}`,
        name: `Kelas ${level}-${section}`,
        capacity: 36,
        type: 'Classroom',
        level: level
      });
    });
  });
  return rooms;
};

const specialRooms: Room[] = [
  { id: 'av', name: 'Ruangan Audio Visual', capacity: 50, type: 'Facility' },
  { id: 'rsg', name: 'Ruangan Serba Guna', capacity: 200, type: 'Facility' },
  { id: 'l-utama', name: 'Lapangan Utama', capacity: 500, type: 'Field' },
  { id: 'l-basket', name: 'Lapangan Basket', capacity: 50, type: 'Field' },
  { id: 'l-futsal', name: 'Lapangan Futsal', capacity: 50, type: 'Field' },
  { id: 'pendopo', name: 'Pendopo', capacity: 100, type: 'Facility' },
  { id: 'l-badminton', name: 'Lapangan Badminton', capacity: 20, type: 'Field' },
  { id: 'perpus', name: 'Perpustakaan', capacity: 80, type: 'Library' },
  { id: 'r-musik', name: 'Ruang Musik', capacity: 20, type: 'Facility' },
  { id: 'm-l1', name: 'Masjid Lantai Satu', capacity: 300, type: 'Religion' },
  { id: 'm-l2', name: 'Masjid Lantai Dua', capacity: 200, type: 'Religion' },
  { id: 'lr-l1', name: 'Lorong Lantai Satu', capacity: 30, type: 'Common' },
  { id: 'lr-l2', name: 'Lorong Lantai Dua', capacity: 30, type: 'Common' },
  { id: 'lr-l3', name: 'Lorong Lantai Tiga', capacity: 30, type: 'Common' },
  { id: 'lab-kimia', name: 'Lab Kimia', capacity: 40, type: 'Laboratory' },
  { id: 'lab-fisika', name: 'Lab Fisika', capacity: 40, type: 'Laboratory' },
  { id: 'lab-biologi', name: 'Lab Biologi', capacity: 40, type: 'Laboratory' },
  { id: 'lab-komp1', name: 'Lab Komputer Satu', capacity: 40, type: 'Laboratory' },
  { id: 'lab-komp2', name: 'Lab Komputer Dua', capacity: 40, type: 'Laboratory' },
  { id: 'lab-komp3', name: 'Lab Komputer Tiga', capacity: 40, type: 'Laboratory' },
  { id: 'lab-komp4', name: 'Lab Komputer Empat', capacity: 40, type: 'Laboratory' },
  { id: 'r-osis', name: 'Ruang OSIS', capacity: 20, type: 'Facility' },
  { id: 'r-pmr', name: 'Ruang PMR', capacity: 20, type: 'Facility' },
  { id: 'r-titellic', name: 'Ruang TItelic', capacity: 30, type: 'Facility' },
];

export const ROOMS: Room[] = [...generateClassRooms(), ...specialRooms];

export const EQUIPMENT = [
  { id: 'eq-1', name: 'Proyektor', type: 'Electronic', quantity: 10 },
  { id: 'eq-2', name: 'Mic', type: 'Audio', quantity: 10 },
  { id: 'eq-3', name: 'Receiver Mic', type: 'Audio', quantity: 5 },
  { id: 'eq-4', name: 'Kabel Roll', type: 'Utility', quantity: 15 },
  { id: 'eq-5', name: 'Kabel HDMI', type: 'Electronic', quantity: 15 },
];

export const NAV_ITEMS = [
  { id: 'dashboard', label_id: 'Beranda', label_en: 'Dashboard', icon: 'solar:widget-2-bold-duotone' },
  { id: 'classroom', label_id: 'Kelas', label_en: 'Classroom', icon: 'solar:book-bookmark-bold-duotone' },
  { id: 'calendar', label_id: 'Kalender', label_en: 'Calendar', icon: 'solar:calendar-bold-duotone' },
  { id: 'booking', label_id: 'Sarpras', label_en: 'Facilities', icon: 'solar:key-minimalistic-bold-duotone' },
];
