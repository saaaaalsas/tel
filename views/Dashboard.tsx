
import React from 'react';
import { User, UserRole, Course, Assignment, RoomBooking, Submission } from '../types';

interface DashboardProps {
  user: User;
  courses: Course[];
  assignments: Assignment[];
  bookings: RoomBooking[];
  submissions: Submission[];
  users?: User[];
  onSelectCourse: (course: Course) => void;
  onAddCourse: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, courses, assignments, bookings, submissions, users = [], onSelectCourse, onAddCourse }) => {
  const userSubmissions = submissions.filter(s => s.studentId === user.id);
  const remainingAssignments = assignments.length - userSubmissions.length;

  const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.GURU_ADMIN;

  const stats = [
    { 
      label: 'Kelas Aktif', 
      value: courses.length, 
      icon: 'solar:folder-bold-duotone', 
      color: 'text-teladan-blue', 
      bg: 'bg-blue-50',
      darkBg: 'dark:bg-blue-950/30',
      show: !isAdmin 
    },
    { 
      label: 'Sisa Tugas', 
      value: remainingAssignments < 0 ? 0 : remainingAssignments, 
      icon: 'solar:clipboard-list-bold-duotone', 
      color: 'text-teladan-red', 
      bg: 'bg-red-50',
      darkBg: 'dark:bg-red-950/30',
      show: user.role === UserRole.STUDENT
    },
    { 
      label: 'Peminjaman', 
      value: bookings.length, 
      icon: 'solar:key-minimalistic-square-bold-duotone', 
      color: 'text-teladan-blue', 
      bg: 'bg-blue-50',
      darkBg: 'dark:bg-blue-950/30',
      show: false
    },
    { 
      label: 'Total Pengguna', 
      value: users.length, 
      icon: 'solar:users-group-rounded-bold-duotone', 
      color: 'text-purple-500', 
      bg: 'bg-purple-50',
      darkBg: 'dark:bg-purple-950/30',
      show: isAdmin
    },
  ].filter(stat => stat.show);

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-slide">
      {/* Stats Grid */}
      <div className={`grid grid-cols-1 ${stats.length === 2 ? 'sm:grid-cols-2' : stats.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'} gap-4 md:gap-6`}>
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-5 md:p-8 rounded-3xl md:rounded-[2rem] border border-neutral-200 dark:border-slate-700 shadow-sm flex items-center gap-4 md:gap-6 group hover:shadow-md transition-all">
            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${stat.bg} ${stat.darkBg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
              <iconify-icon icon={stat.icon} width="28" className="md:hidden"></iconify-icon>
              <iconify-icon icon={stat.icon} width="36" className="hidden md:block"></iconify-icon>
            </div>
            <div>
              <p className="text-[10px] md:text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {user.role === UserRole.ADMIN && (
        <div className="grid grid-cols-1 gap-6 md:gap-8">
          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-neutral-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-xl md:text-2xl font-semibold mb-6 text-slate-900 dark:text-white flex items-center gap-3">
               <iconify-icon icon="solar:users-group-rounded-bold-duotone" className="text-teladan-blue"></iconify-icon>
               Distribusi Pengguna
            </h3>
            <div className="space-y-4">
              {[
                { role: UserRole.STUDENT, label: 'Siswa', color: 'bg-teladan-blue' },
                { role: UserRole.TEACHER, label: 'Guru', color: 'bg-emerald-500' },
                { role: UserRole.ADMIN, label: 'Admin', color: 'bg-teladan-red' },
                { role: UserRole.GURU_ADMIN, label: 'Guru Admin', color: 'bg-purple-500' },
              ].map(r => {
                const count = users.filter(u => u.role === r.role).length;
                const percentage = users.length > 0 ? (count / users.length) * 100 : 0;
                return (
                  <div key={r.role} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{r.label}</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${r.color} rounded-full`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {user.role === UserRole.STUDENT && (
        <div className="grid grid-cols-1 gap-6 md:gap-8">
          <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-neutral-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-xl md:text-2xl font-semibold mb-6 text-slate-900 dark:text-white flex items-center gap-3">
               <iconify-icon icon="solar:book-bookmark-bold-duotone" className="text-teladan-blue"></iconify-icon>
               Mata Pelajaran Anda
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.length > 0 ? courses.map((course) => (
                <div 
                  key={course.id} 
                  onClick={() => onSelectCourse(course)}
                  className="p-4 md:p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 flex items-center gap-3 md:gap-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer group border border-transparent hover:border-teladan-blue dark:hover:border-teladan-blue"
                >                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${course.color} flex items-center justify-center text-white shadow-lg shadow-blue-100 dark:shadow-none flex-shrink-0`}>
                     <iconify-icon icon="solar:folder-bold-duotone" width="24" className="md:hidden"></iconify-icon>
                     <iconify-icon icon="solar:folder-bold-duotone" width="28" className="hidden md:block"></iconify-icon>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-semibold text-slate-800 dark:text-white truncate text-base md:text-lg">{course.name}</h4>
                    <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wider">{course.code}</p>
                  </div>
                  <iconify-icon icon="solar:alt-arrow-right-bold-duotone" className="ml-auto opacity-0 group-hover:opacity-100 text-teladan-blue" width="20"></iconify-icon>
                </div>
              )) : (
                <div className="col-span-full text-center py-10 md:py-12 text-slate-400 dark:text-slate-500 font-semibold bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                  Belum ada mata pelajaran terdaftar.
                </div>
              )}
            </div>
            <button 
              onClick={onAddCourse}
              className="w-full mt-6 md:mt-8 py-3 md:py-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 font-semibold hover:border-teladan-blue hover:text-teladan-blue transition-all flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <iconify-icon icon="solar:add-circle-bold-duotone"></iconify-icon>
              Tambah Mata Pelajaran
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
