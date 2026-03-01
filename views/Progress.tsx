
import React from 'react';
import { User, Course, Assignment, Submission } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ProgressProps {
  user: User;
  courses: Course[];
  assignments: Assignment[];
  submissions: Submission[];
}

const Progress: React.FC<ProgressProps> = ({ user, courses, assignments, submissions }) => {
  const userSubmissions = submissions.filter(s => s.studentId === user.id);
  const gradedSubmissions = userSubmissions.filter(s => s.grade !== undefined);
  
  const avgGrade = gradedSubmissions.length > 0 
    ? (gradedSubmissions.reduce((acc, curr) => acc + (curr.grade || 0), 0) / gradedSubmissions.length).toFixed(1)
    : '0';

  const completedCount = userSubmissions.length;
  const missingCount = assignments.length - completedCount;

  const pieData = [
    { name: 'Selesai', value: completedCount, color: '#10b981' },
    { name: 'Belum', value: missingCount > 0 ? missingCount : 0, color: '#f43f5e' },
  ];

  const performanceData = gradedSubmissions.length > 0 ? gradedSubmissions.map((s, i) => ({
    week: `T${i+1}`,
    grade: s.grade
  })) : [
    { week: '-', grade: 0 }
  ];

  return (
    <div className="space-y-8 animate-fade-slide">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-neutral-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full border-8 border-sky-100 dark:border-sky-900/50 flex items-center justify-center text-3xl font-semibold text-sky-500 mb-4">
            {avgGrade}
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Rata-rata Nilai</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Capaian akademik semester ini</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-neutral-200 dark:border-slate-700 shadow-sm md:col-span-2">
           <h3 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white">Analisis Ketuntasan Tugas</h3>
           <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-[180px] h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#0f172a', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase">Tugas Selesai</span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">{completedCount}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase">Tugas Belum Selesai</span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">{missingCount > 0 ? missingCount : 0}</span>
                 </div>
                 <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-sky-500 rounded-full transition-all duration-1000"
                      style={{ width: `${(completedCount / (assignments.length || 1)) * 100}%` }}
                    ></div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-neutral-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-2xl font-semibold mb-8 text-slate-900 dark:text-white">Tren Performa Belajar</h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorGrade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b833" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600}} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600}} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#0f172a', color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey="grade" 
                stroke="#0ea5e9" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorGrade)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-neutral-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white">Detail Nilai per Mata Pelajaran</h3>
        <div className="space-y-4">
           {courses.map(course => {
             const courseSubmissions = userSubmissions.filter(s => {
               const assignment = assignments.find(a => a.id === s.assignmentId);
               return assignment?.courseId === course.id;
             });
             const courseAvg = courseSubmissions.length > 0 
               ? (courseSubmissions.reduce((acc, curr) => acc + (curr.grade || 0), 0) / courseSubmissions.length).toFixed(1)
               : 'N/A';
             
             return (
               <div key={course.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-between group hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-600">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${course.color} flex items-center justify-center text-white`}>
                      <iconify-icon icon="solar:folder-bold-duotone" width="24"></iconify-icon>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white">{course.name}</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">{course.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                     <div className="text-right">
                       <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase mb-1">Status</p>
                       <p className="text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg">TUNTAS</p>
                     </div>
                     <div className="text-right">
                       <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase mb-1">Nilai Akhir</p>
                       <p className="text-xl font-semibold text-slate-800 dark:text-white">{courseAvg}</p>
                     </div>
                  </div>
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
};

export default Progress;
