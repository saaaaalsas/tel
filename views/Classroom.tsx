
import React, { useState } from 'react';
import { User, UserRole, Course, Assignment, Submission } from '../types';

interface ClassroomProps {
  user: User;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  selectedCourse: Course | null;
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>;
  showJoinModal: boolean;
  setShowJoinModal: React.Dispatch<React.SetStateAction<boolean>>;
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  submissions: Submission[];
  setSubmissions: React.Dispatch<React.SetStateAction<Submission[]>>;
}

const Classroom: React.FC<ClassroomProps> = ({ 
  user, 
  courses, 
  setCourses, 
  selectedCourse,
  setSelectedCourse,
  showJoinModal,
  setShowJoinModal,
  assignments, 
  setAssignments, 
  submissions, 
  setSubmissions 
}) => {
  const [showAddClass, setShowAddClass] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSubmissionsList, setShowSubmissionsList] = useState(false);
  const [viewingAssignmentId, setViewingAssignmentId] = useState<string | null>(null);
  const [classCodeInput, setClassCodeInput] = useState('');
  
  const isTeacher = user.role === UserRole.TEACHER || user.role === UserRole.GURU_ADMIN;
  const [newClassName, setNewClassName] = useState('');

  const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleCreateClass = () => {
    if (!newClassName) return;
    const newCourse: Course = {
      id: Date.now().toString(),
      name: newClassName,
      code: generateCode(),
      teacherId: user.id,
      teacherName: user.name,
      description: 'Kelas Baru',
      color: 'bg-teladan-blue'
    };
    setCourses([...courses, newCourse]);
    setNewClassName('');
    setShowAddClass(false);
  };

  const handleJoinClass = () => {
    const code = classCodeInput.toUpperCase();
    const courseToJoin = courses.find(c => c.code === code);

    if (courseToJoin) {
      if (courseToJoin.enrolledStudentIds?.includes(user.id)) {
        alert('Anda sudah bergabung di kelas ini.');
      } else {
        setCourses(prev => prev.map(c => 
          c.id === courseToJoin.id 
            ? { ...c, enrolledStudentIds: [...(c.enrolledStudentIds || []), user.id] }
            : c
        ));
      }
    } else {
      alert(`Kode kelas "${code}" tidak ditemukan.`);
    }
    setShowJoinModal(false);
    setClassCodeInput('');
  };

  const handleLeaveCourse = (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin keluar dari kelas ini?')) {
      setCourses(prev => prev.map(c => 
        c.id === courseId 
          ? { ...c, enrolledStudentIds: c.enrolledStudentIds?.filter(id => id !== user.id) }
          : c
      ));
      if (selectedCourse?.id === courseId) {
        setSelectedCourse(null);
      }
    }
  };

  const handleDeleteCourse = (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus kelas ini? Semua data tugas akan ikut terhapus.')) {
      setCourses(prev => prev.filter(c => c.id !== courseId));
      setAssignments(prev => prev.filter(a => a.courseId !== courseId));
      if (selectedCourse?.id === courseId) {
        setSelectedCourse(null);
      }
    }
  };

  const handleAddAssignment = (courseId: string) => {
    const title = prompt("Judul Tugas:");
    if (!title) return;
    const hasFile = confirm("Apakah ingin melampirkan file tugas?");
    const newAssignment: Assignment = {
      id: Date.now().toString(),
      courseId,
      title,
      description: hasFile ? 'Tugas dengan lampiran file. Silakan unduh materi di kelas.' : 'Silakan kerjakan instruksi yang diberikan di kelas.',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      totalPoints: 100
    };
    setAssignments([...assignments, newAssignment]);
  };

  const handleSubmitTask = (assignmentId: string) => {
    setActiveAssignmentId(assignmentId);
    setShowSubmissionModal(true);
  };

  const handleConfirmSubmission = async () => {
    if (!activeAssignmentId) return;
    
    let fileData = '';
    let fileName = '';
    
    if (selectedFile) {
      fileName = selectedFile.name;
      fileData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedFile);
      });
    }

    const newSubmission: Submission = {
      id: Date.now().toString(),
      assignmentId: activeAssignmentId,
      studentId: user.id,
      studentName: user.name,
      content: submissionText,
      fileName,
      fileData,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      grade: Math.floor(Math.random() * 21) + 80
    };

    setSubmissions([...submissions, newSubmission]);
    setShowSubmissionModal(false);
    setSubmissionText('');
    setSelectedFile(null);
    setActiveAssignmentId(null);
    alert("Tugas berhasil dikirim!");
  };

  const handleViewSubmissions = (assignmentId: string) => {
    setViewingAssignmentId(assignmentId);
    setShowSubmissionsList(true);
  };

  const handleDownloadFile = (fileName: string, fileData: string) => {
    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const userCourses = courses.filter(c => {
    if (user.role === UserRole.TEACHER) return c.teacherId === user.id;
    if (user.role === UserRole.STUDENT) return c.enrolledStudentIds?.includes(user.id);
    return true;
  });

  if (selectedCourse) {
    const courseAssignments = assignments.filter(a => a.courseId === selectedCourse.id);
    return (
      <div className="space-y-6 animate-fade-slide pb-10 md:pb-20">
        <button 
          onClick={() => setSelectedCourse(null)}
          className="flex items-center gap-2 text-slate-500 font-semibold hover:text-teladan-blue transition-colors text-sm md:text-base"
        >
          <iconify-icon icon="solar:alt-arrow-left-bold-duotone" width="20" className="md:hidden"></iconify-icon>
          <iconify-icon icon="solar:alt-arrow-left-bold-duotone" width="24" className="hidden md:block"></iconify-icon>
          Kembali ke Daftar Kelas
        </button>

        <div className={`p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] ${selectedCourse.color} text-white shadow-xl flex flex-col md:flex-row md:items-end justify-between gap-6 relative`}>
           {isTeacher ? (
             <button 
               onClick={(e) => handleDeleteCourse(selectedCourse.id, e)}
               className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-red-500 transition-colors border border-white/20"
               title="Hapus Kelas"
             >
               <iconify-icon icon="solar:trash-bin-trash-bold-duotone" width="20"></iconify-icon>
             </button>
           ) : (
             <button 
               onClick={(e) => handleLeaveCourse(selectedCourse.id, e)}
               className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-red-500 transition-colors border border-white/20"
               title="Buang Kelas"
             >
               <iconify-icon icon="solar:exit-bold-duotone" width="20"></iconify-icon>
             </button>
           )}
           <div>
             <h2 className="text-2xl md:text-4xl font-semibold mb-2">{selectedCourse.name}</h2>
             <p className="opacity-90 flex items-center gap-2 font-medium text-sm md:text-base">
               <iconify-icon icon="solar:user-bold-duotone"></iconify-icon>
               {selectedCourse.teacherName}
             </p>
           </div>
           <div className="bg-white/20 backdrop-blur-md p-3 md:p-4 rounded-2xl md:rounded-3xl border border-white/20 w-fit">
             <p className="text-[10px] uppercase font-semibold tracking-widest opacity-80 mb-1">Kode Kelas</p>
             <p className="text-xl md:text-2xl font-mono font-semibold">{selectedCourse.code}</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl md:text-2xl font-semibold">Daftar Tugas</h3>
              {isTeacher && (
                <button 
                  onClick={() => handleAddAssignment(selectedCourse.id)}
                  className="bg-teladan-blue text-white px-4 md:px-6 py-2 rounded-xl md:rounded-2xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-100 dark:shadow-none hover:scale-105 transition-transform text-sm md:text-base"
                >
                  <iconify-icon icon="solar:add-circle-bold-duotone" width="20"></iconify-icon>
                  Buat Tugas
                </button>
              )}
            </div>
            
            {courseAssignments.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl md:rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700 text-center">
                <iconify-icon icon="solar:document-add-bold-duotone" width="48" className="md:hidden text-slate-300 mb-4"></iconify-icon>
                <iconify-icon icon="solar:document-add-bold-duotone" width="64" className="hidden md:block text-slate-300 mb-4"></iconify-icon>
                <p className="text-slate-400 font-semibold text-sm md:text-base">Belum ada tugas yang dibagikan.</p>
              </div>
            ) : (
              courseAssignments.map(task => {
                const isSubmitted = submissions.some(s => s.assignmentId === task.id && s.studentId === user.id);
                const taskSubmissions = submissions.filter(s => s.assignmentId === task.id);

                return (
                  <div key={task.id} className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-3xl md:rounded-[2rem] border border-neutral-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 md:gap-6 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-blue-50 dark:bg-slate-700 flex items-center justify-center text-teladan-blue flex-shrink-0">
                      <iconify-icon icon="solar:clipboard-text-bold-duotone" width="24" className="md:hidden"></iconify-icon>
                      <iconify-icon icon="solar:clipboard-text-bold-duotone" width="32" className="hidden md:block"></iconify-icon>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg md:text-xl font-semibold mb-1">{task.title}</h4>
                      <p className="text-slate-500 text-xs md:text-sm mb-4">{task.description}</p>
                      <div className="flex flex-wrap gap-2 md:gap-4 items-center">
                        <span className="flex items-center gap-1 text-[9px] md:text-xs font-semibold text-slate-400 uppercase bg-slate-50 dark:bg-slate-700 px-2 md:px-3 py-1 rounded-full">
                          <iconify-icon icon="solar:calendar-date-bold-duotone"></iconify-icon>
                          Batas: {task.dueDate}
                        </span>
                        <span className="flex items-center gap-1 text-[9px] md:text-xs font-semibold text-slate-400 uppercase bg-slate-50 dark:bg-slate-700 px-2 md:px-3 py-1 rounded-full">
                          <iconify-icon icon="solar:star-bold-duotone"></iconify-icon>
                          {task.totalPoints} Poin
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {user.role === UserRole.STUDENT ? (
                        isSubmitted ? (
                          <div className="w-full md:w-auto bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 px-6 py-2 rounded-xl md:rounded-2xl font-semibold flex items-center justify-center gap-2 text-sm md:text-base">
                            <iconify-icon icon="solar:check-circle-bold-duotone" width="20"></iconify-icon>
                            Selesai
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleSubmitTask(task.id)}
                            className="w-full md:w-auto bg-teladan-blue text-white px-6 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl font-semibold shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-600 transition-colors text-sm md:text-base"
                          >
                            Kirim Tugas
                          </button>
                        )
                      ) : (
                        <button 
                          onClick={() => handleViewSubmissions(task.id)}
                          className="w-full md:w-auto bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 px-6 py-2 rounded-xl md:rounded-2xl font-semibold hover:bg-slate-200 transition-colors text-sm md:text-base"
                        >
                          Lihat {taskSubmissions.length} Pengumpulan
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-neutral-200 dark:border-slate-700 shadow-sm">
               <h3 className="text-lg md:text-xl font-semibold mb-6">Informasi Kelas</h3>
               <div className="space-y-4">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                     <iconify-icon icon="solar:notebook-bold-duotone" width="20"></iconify-icon>
                   </div>
                   <div>
                     <p className="text-[10px] text-slate-400 font-semibold uppercase">Tugas Aktif</p>
                     <p className="font-semibold text-sm md:text-base">{courseAssignments.length} Tugas</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-slide pb-10 md:pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-semibold">Kelas yang Diikuti</h2>
        <div className="flex items-center gap-3">
          {isTeacher ? (
            <button 
              onClick={() => setShowAddClass(true)}
              className="w-full md:w-auto bg-teladan-blue text-white px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 dark:shadow-none hover:scale-105 transition-all text-sm md:text-base"
            >
              <iconify-icon icon="solar:add-circle-bold-duotone" width="20" className="md:hidden"></iconify-icon>
              <iconify-icon icon="solar:add-circle-bold-duotone" width="24" className="hidden md:block"></iconify-icon>
              Buat Kelas
            </button>
          ) : (
            <button 
              onClick={() => setShowJoinModal(true)}
              className="w-full md:w-auto bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-neutral-200 dark:border-slate-700 px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all text-sm md:text-base"
            >
              <iconify-icon icon="solar:key-minimalistic-bold-duotone" width="20" className="md:hidden text-teladan-blue"></iconify-icon>
              <iconify-icon icon="solar:key-minimalistic-bold-duotone" width="24" className="hidden md:block text-teladan-blue"></iconify-icon>
              Gabung Kelas
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {userCourses.length === 0 ? (
          <div className="col-span-full py-12 md:py-20 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-800 rounded-3xl md:rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700 p-6">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-300 mb-4 md:mb-6">
              <iconify-icon icon="solar:folder-open-bold-duotone" width="32" className="md:hidden"></iconify-icon>
              <iconify-icon icon="solar:folder-open-bold-duotone" width="48" className="hidden md:block"></iconify-icon>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-white mb-2">Belum Ada Kelas</h3>
            <p className="text-slate-500 text-sm md:text-base max-w-xs">
              {isTeacher 
                ? 'Klik tombol "Buat Kelas" untuk memulai pengajaran Anda.' 
                : 'Klik tombol "Gabung Kelas" dan masukkan kode dari gurumu.'}
            </p>
          </div>
        ) : userCourses.map(course => (
          <div 
            key={course.id} 
            onClick={() => setSelectedCourse(course)}
            className="group relative bg-white dark:bg-slate-800 rounded-3xl md:rounded-[2rem] border border-neutral-200 dark:border-slate-700 overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`h-20 md:h-24 ${course.color} relative overflow-hidden`}>
              <div className="absolute top-[-20%] right-[-10%] opacity-20">
                <iconify-icon icon="solar:folder-bold-duotone" width="100" className="md:hidden"></iconify-icon>
                <iconify-icon icon="solar:folder-bold-duotone" width="120" className="hidden md:block"></iconify-icon>
              </div>
            </div>
            <div className="p-5 md:p-6">
                <div className="flex items-start justify-between mb-4">
                 <div className="flex-1 truncate">
                   <h3 className="text-lg md:text-xl font-semibold group-hover:text-teladan-blue transition-colors truncate">{course.name}</h3>
                   <p className="text-slate-500 text-xs md:text-sm font-semibold truncate">{course.teacherName}</p>
                 </div>
                 <div className="flex gap-2 flex-shrink-0">
                    {isTeacher ? (
                      <button 
                        onClick={(e) => handleDeleteCourse(course.id, e)}
                        className="bg-slate-50 dark:bg-slate-700 p-2 rounded-xl text-slate-400 hover:text-red-500 transition-colors"
                        title="Hapus Kelas"
                      >
                        <iconify-icon icon="solar:trash-bin-trash-bold-duotone" width="18" className="md:hidden"></iconify-icon>
                        <iconify-icon icon="solar:trash-bin-trash-bold-duotone" width="20" className="hidden md:block"></iconify-icon>
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => handleLeaveCourse(course.id, e)}
                        className="bg-slate-50 dark:bg-slate-700 p-2 rounded-xl text-slate-400 hover:text-red-500 transition-colors"
                        title="Buang Kelas"
                      >
                        <iconify-icon icon="solar:exit-bold-duotone" width="18" className="md:hidden"></iconify-icon>
                        <iconify-icon icon="solar:exit-bold-duotone" width="20" className="hidden md:block"></iconify-icon>
                      </button>
                    )}
                 </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-slate-400">Kode: {course.code}</span>
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <img key={i} src={`https://picsum.photos/seed/${course.id+i}/100`} className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white dark:border-slate-800" />
                  ))}
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[8px] md:text-[10px] font-semibold">+21</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddClass(false)}></div>
           <div className="relative bg-white dark:bg-slate-800 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl animate-fade-slide">
              <h3 className="text-2xl font-semibold mb-6">Buat Kelas Baru</h3>
              <input 
                type="text" 
                placeholder="Nama Mata Pelajaran" 
                className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-2xl p-4 mb-4 outline-none focus:ring-2 ring-teladan-blue"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
              />
              <div className="flex gap-4">
                <button onClick={() => setShowAddClass(false)} className="flex-1 py-4 rounded-2xl font-semibold text-slate-500">Batal</button>
                <button onClick={handleCreateClass} className="flex-1 py-4 bg-teladan-blue text-white rounded-2xl font-semibold shadow-lg shadow-blue-100">Simpan</button>
              </div>
           </div>
        </div>
      )}

      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowJoinModal(false)}></div>
           <div className="relative bg-white dark:bg-slate-800 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl animate-fade-slide">
              <h3 className="text-2xl font-semibold mb-2">Gabung Kelas</h3>
              <p className="text-slate-500 text-sm mb-6">Masukkan kode kelas yang dibagikan oleh gurumu.</p>
              <input 
                type="text" 
                placeholder="X6A7B2" 
                className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-2xl p-4 mb-4 text-center text-3xl font-mono uppercase font-semibold tracking-widest outline-none focus:ring-2 ring-teladan-blue"
                value={classCodeInput}
                onChange={(e) => setClassCodeInput(e.target.value)}
              />
              <div className="flex gap-4">
                <button onClick={() => setShowJoinModal(false)} className="flex-1 py-4 rounded-2xl font-semibold text-slate-500">Batal</button>
                <button onClick={handleJoinClass} className="flex-1 py-4 bg-teladan-blue text-white rounded-2xl font-semibold shadow-lg shadow-blue-100">Gabung</button>
              </div>
           </div>
        </div>
      )}

      {showSubmissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSubmissionModal(false)}></div>
           <div className="relative bg-white dark:bg-slate-800 w-full max-w-lg p-8 rounded-[2.5rem] shadow-2xl animate-fade-slide">
              <h3 className="text-2xl font-semibold mb-2">Kirim Tugas</h3>
              <p className="text-slate-500 text-sm mb-6">Lengkapi detail tugas Anda sebelum mengirim.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">Deskripsi / Link</label>
                  <textarea 
                    placeholder="Tuliskan link Google Drive atau deskripsi singkat tugas Anda..." 
                    className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-2xl p-4 mt-2 outline-none focus:ring-2 ring-teladan-blue min-h-[100px]"
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">Lampiran File</label>
                  <div className="mt-2 flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <iconify-icon icon="solar:upload-bold-duotone" width="32" className="text-slate-300 mb-2"></iconify-icon>
                        <span className="text-sm font-semibold text-slate-500">
                          {selectedFile ? selectedFile.name : 'Pilih file (PDF, DOC, JPG, dll)'}
                        </span>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      />
                    </label>
                    {selectedFile && (
                      <button 
                        onClick={() => setSelectedFile(null)}
                        className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center"
                      >
                        <iconify-icon icon="solar:trash-bin-minimalistic-bold-duotone" width="24"></iconify-icon>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setShowSubmissionModal(false)} className="flex-1 py-4 rounded-2xl font-semibold text-slate-500">Batal</button>
                  <button 
                    onClick={handleConfirmSubmission} 
                    className="flex-1 py-4 bg-teladan-blue text-white rounded-2xl font-semibold shadow-lg shadow-blue-100 dark:shadow-none"
                  >
                    Kirim Sekarang
                  </button>
                </div>
              </div>
           </div>
        </div>
      )}

      {showSubmissionsList && viewingAssignmentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSubmissionsList(false)}></div>
           <div className="relative bg-white dark:bg-slate-800 w-full max-w-2xl p-8 rounded-[2.5rem] shadow-2xl animate-fade-slide max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">Daftar Pengumpulan</h3>
                <button onClick={() => setShowSubmissionsList(false)} className="text-slate-400 hover:text-slate-600">
                  <iconify-icon icon="solar:close-circle-bold-duotone" width="32"></iconify-icon>
                </button>
              </div>
              
              <div className="space-y-4">
                {submissions.filter(s => s.assignmentId === viewingAssignmentId).length === 0 ? (
                  <p className="text-center py-8 text-slate-400 font-medium">Belum ada siswa yang mengumpulkan.</p>
                ) : (
                  submissions.filter(s => s.assignmentId === viewingAssignmentId).map(sub => (
                    <div key={sub.id} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{sub.studentName}</p>
                          <p className="text-xs text-slate-400 font-medium">{new Date(sub.submittedAt).toLocaleString('id-ID')}</p>
                        </div>
                        <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider">
                          Nilai: {sub.grade}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{sub.content}</p>
                      {sub.fileName && sub.fileData && (
                        <button 
                          onClick={() => handleDownloadFile(sub.fileName!, sub.fileData!)}
                          className="flex items-center gap-2 text-teladan-blue font-semibold text-sm hover:underline"
                        >
                          <iconify-icon icon="solar:file-download-bold-duotone" width="20"></iconify-icon>
                          {sub.fileName}
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Classroom;
