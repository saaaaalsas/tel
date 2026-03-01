
import React, { useState, useEffect } from 'react';
import { User, UserRole, Course, Assignment, Submission, RoomBooking, AcademicEvent } from './types';
import { INITIAL_COURSES, MOCK_USERS } from './constants';
import Sidebar from './components/Sidebar';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Classroom from './views/Classroom';
import CalendarView from './views/CalendarView';
import BookingForm from './views/BookingForm';
import Settings from './views/Settings';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [academicEvents, setAcademicEvents] = useState<AcademicEvent[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<'id' | 'en'>('id');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setCurrentUser(userDoc.data() as User);
          } else {
            // Fallback if doc doesn't exist
            setCurrentUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              role: UserRole.STUDENT,
              avatar: firebaseUser.photoURL || 'https://picsum.photos/seed/user/200'
            });
          }
        } else {
          setCurrentUser(null);
        }
      } catch (err: any) {
        console.error("Firestore Error:", err);
        if (err.code === 'permission-denied') {
          // If permission denied, we might still want to show the login screen
          setCurrentUser(null);
        }
      } finally {
        // Keep loading for at least 2 seconds as requested
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = async () => {
    await auth.signOut();
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-teladan-navy transition-colors duration-300">
        <div className="relative mb-8">
          <div className="w-32 h-32 border-4 border-white/10 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 border-t-4 border-white rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center p-4">
             <img 
               src="https://lh3.googleusercontent.com/d/1OjBe_s-XJKZ-44j1mk3FLocHg5JjzdMd" 
               alt="SMAN 3 Logo" 
               className="w-full h-full object-contain drop-shadow-2xl animate-bounce"
               referrerPolicy="no-referrer"
             />
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-sm font-medium text-white/60 tracking-widest animate-pulse">
            sinkronisasi database teladan
          </h2>
          <div className="flex gap-2">
            <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const isAdmin = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.GURU_ADMIN;
  const isTeacher = currentUser.role === UserRole.TEACHER || currentUser.role === UserRole.GURU_ADMIN;

  const t = {
    dashboard: lang === 'id' ? `Halo, ${(currentUser.name || 'User').split(' ')[0]}!` : `Hello, ${(currentUser.name || 'User').split(' ')[0]}!`,
    dashboardSub: lang === 'id' ? 'Selamat datang di Tel-Finder. Pusat kendali akademik terpadu Anda.' : 'Welcome to Tel-Finder. Your integrated academic command center.',
    classroom: lang === 'id' ? 'Classroom' : 'Classroom',
    classroomSub: lang === 'id' ? 'Kelola materi dan tugas akademikmu secara terpadu.' : 'Manage your course materials and academic tasks in one place.',
    calendar: lang === 'id' ? 'Kalender' : 'Calendar',
    calendarSub: lang === 'id' ? 'Lihat ketersediaan fasilitas sekolah hari ini.' : 'See school facility availability today.',
    booking: lang === 'id' ? (isAdmin ? 'Kelola Sarpras' : 'Sarpras') : (isAdmin ? 'Manage Facilities' : 'Facilities'),
    bookingSub: lang === 'id' ? 'Pantau status ketersediaan semua sarana dan prasarana sekolah.' : 'Monitor the availability status of all school facilities and infrastructure.',
    settings: lang === 'id' ? 'Pengaturan' : 'Settings',
    settingsSub: lang === 'id' ? 'Kelola profil dan preferensi aplikasi.' : 'Manage your profile and app preferences.',
  };

  const userCourses = courses.filter(c => {
    if (currentUser?.role === UserRole.TEACHER || currentUser?.role === UserRole.GURU_ADMIN) {
      return c.teacherId === currentUser.id;
    }
    if (currentUser?.role === UserRole.STUDENT) {
      return c.enrolledStudentIds?.includes(currentUser.id);
    }
    return true;
  });

  return (
    <div className={`flex flex-col md:flex-row h-screen w-full overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'dark bg-teladan-navy text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={currentUser} 
        onLogout={handleLogout}
        lang={lang}
      />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-10 animate-fade-slide pb-24 md:pb-10">
        <header className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-semibold text-slate-800 dark:text-white tracking-tight leading-none">
              {(activeTab === 'dashboard' && t.dashboard) ||
               (activeTab === 'classroom' && t.classroom) ||
               (activeTab === 'calendar' && t.calendar) ||
               (activeTab === 'booking' && t.booking) ||
               (activeTab === 'settings' && t.settings)}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg font-medium max-w-2xl">
              {(activeTab === 'dashboard' && t.dashboardSub) ||
               (activeTab === 'classroom' && t.classroomSub) ||
               (activeTab === 'calendar' && t.calendarSub) ||
               (activeTab === 'booking' && t.bookingSub) ||
               (activeTab === 'settings' && t.settingsSub)}
            </p>
          </div>
          <div className="flex items-center gap-4 relative">
             <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-2 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 md:gap-4 shadow-sm px-4 md:px-5 h-12 md:h-14">
                <span className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${currentUser.role === UserRole.TEACHER ? 'bg-teladan-blue' : currentUser.role === UserRole.ADMIN ? 'bg-teladan-red' : currentUser.role === UserRole.GURU_ADMIN ? 'bg-purple-500' : 'bg-teladan-blue'} animate-pulse`}></span>
                <span className="text-[10px] md:text-sm font-semibold uppercase tracking-widest text-slate-700 dark:text-slate-200">{currentUser.role}</span>
             </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <Dashboard 
            user={currentUser} 
            courses={userCourses} 
            assignments={assignments} 
            bookings={bookings}
            submissions={submissions}
            users={users}
            onSelectCourse={(course) => {
              setSelectedCourse(course);
              setActiveTab('classroom');
            }}
            onAddCourse={() => {
              setShowJoinModal(true);
              setActiveTab('classroom');
            }}
          />
        )}
        {activeTab === 'classroom' && (
          <Classroom 
            user={currentUser} 
            courses={courses} 
            setCourses={setCourses}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            showJoinModal={showJoinModal}
            setShowJoinModal={setShowJoinModal}
            assignments={assignments}
            setAssignments={setAssignments}
            submissions={submissions}
            setSubmissions={setSubmissions}
          />
        )}
        {activeTab === 'calendar' && (
          <CalendarView 
            bookings={bookings} 
            userRole={currentUser.role} 
            setBookings={setBookings} 
            academicEvents={academicEvents}
            setAcademicEvents={setAcademicEvents}
          />
        )}
        {activeTab === 'booking' && (
          <BookingForm 
            user={currentUser} 
            bookings={bookings} 
            setBookings={setBookings} 
          />
        )}
        {activeTab === 'settings' && (
          <Settings 
            user={currentUser}
            setUser={setCurrentUser}
            theme={theme}
            setTheme={setTheme}
            lang={lang}
            setLang={setLang}
          />
        )}
      </main>
    </div>
  );
};

export default App;
