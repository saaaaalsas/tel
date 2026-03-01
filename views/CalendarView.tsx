
import React, { useState } from 'react';
import { RoomBooking, UserRole, AcademicEvent } from '../types';
import { ROOMS } from '../constants';

interface CalendarViewProps {
  bookings: RoomBooking[];
  userRole?: string;
  setBookings?: React.Dispatch<React.SetStateAction<RoomBooking[]>>;
  academicEvents: AcademicEvent[];
  setAcademicEvents: React.Dispatch<React.SetStateAction<AcademicEvent[]>>;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  bookings, 
  userRole, 
  setBookings, 
  academicEvents, 
  setAcademicEvents 
}) => {
  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const today = new Date();
  const [activeFilters, setActiveFilters] = useState<string[]>(['akademik', 'sarpras']);
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [activeFacilityType, setActiveFacilityType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(today.getDate());
  const [view, setView] = useState<'status' | 'add'>('status');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    level: 'SEMUA' as AcademicEvent['level']
  });

  const isAdmin = userRole === UserRole.ADMIN || userRole === UserRole.GURU_ADMIN;

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'X': return 'bg-emerald-500';
      case 'XI': return 'bg-amber-500';
      case 'XII': return 'bg-rose-500';
      default: return 'bg-sky-500';
    }
  };

  const getLevelBadge = (level: string) => {
    switch(level) {
      case 'X': return 'bg-emerald-100 text-emerald-600';
      case 'XI': return 'bg-amber-100 text-amber-600';
      case 'XII': return 'bg-rose-100 text-rose-600';
      default: return 'bg-sky-100 text-sky-600';
    }
  };

  const toggleFilter = (id: string) => {
    setActiveFilters(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleDeleteBooking = (id: string) => {
    if (confirm('Hapus peminjaman ini?')) {
      setBookings?.(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Hapus agenda akademik ini?')) {
      setAcademicEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    const newEvent: AcademicEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      date: formData.date,
      level: formData.level
    };

    setAcademicEvents(prev => [...prev, newEvent]);
    setView('status');
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      level: 'SEMUA'
    });
  };

  const levels = ['X', 'XI', 'XII'];

  const filteredBookings = bookings.filter(b => {
    if (!activeFilters.includes('sarpras')) return false;
    if (activeLevel && b.level !== activeLevel) return false;
    if (activeFacilityType) {
        const room = ROOMS.find(r => r.id === b.resourceId);
        if (room && room.type !== activeFacilityType) return false;
        if (b.resourceType === 'item') return false; 
    }
    return true;
  });

  const filteredEvents = academicEvents.filter(e => {
    if (!activeFilters.includes('akademik')) return false;
    return true;
  });

  const selectedDateBookings = selectedDate ? filteredBookings.filter(b => new Date(b.startTime).getDate() === selectedDate) : [];
  const selectedDateEvents = selectedDate ? filteredEvents.filter(e => new Date(e.date).getDate() === selectedDate) : [];

  if (view === 'add' && isAdmin) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-slide pb-20">
        <button 
          onClick={() => setView('status')}
          className="mb-8 flex items-center gap-2 text-slate-500 font-semibold hover:text-teladan-blue transition-colors"
        >
          <iconify-icon icon="solar:alt-arrow-left-bold-duotone" width="24"></iconify-icon>
          Kembali ke Kalender
        </button>

        <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[3rem] border border-neutral-200 dark:border-slate-700 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-20 h-20 rounded-[2rem] bg-teladan-blue flex items-center justify-center text-white shadow-2xl dark:shadow-none sonar-effect">
              <iconify-icon icon="solar:calendar-add-bold-duotone" width="40"></iconify-icon>
            </div>
            <div>
              <h2 className="text-3xl font-semibold">Input Agenda Akademik</h2>
              <p className="text-slate-500 font-medium">Tambahkan agenda atau hari penting sekolah.</p>
            </div>
          </div>

          <form onSubmit={handleAddEvent} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">Judul Agenda</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-2xl p-5 outline-none focus:ring-2 ring-teladan-blue font-medium"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Misal: Ujian Akhir Semester"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">Tingkat Kelas</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-2xl p-5 outline-none focus:ring-2 ring-teladan-blue font-semibold transition-all"
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value as any})}
                >
                  <option value="SEMUA">Semua Tingkat</option>
                  <option value="X">Kelas X</option>
                  <option value="XI">Kelas XI</option>
                  <option value="XII">Kelas XII</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">Deskripsi</label>
              <textarea 
                className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-2xl p-5 outline-none focus:ring-2 ring-teladan-blue font-medium min-h-[120px]"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Detail agenda..."
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">Tanggal</label>
              <input 
                type="date" 
                className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-2xl p-5 outline-none focus:ring-2 ring-teladan-blue font-semibold"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-6 rounded-[2rem] bg-teladan-blue text-white font-semibold text-xl shadow-2xl dark:shadow-none hover:opacity-90 transition-all flex items-center justify-center gap-4"
            >
              <iconify-icon icon="solar:check-circle-bold-duotone" width="32"></iconify-icon>
              Simpan Agenda
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 animate-fade-slide pb-10 md:pb-20">
      <div className="lg:col-span-2 space-y-6 md:space-y-8">
        {!isAdmin && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-5 md:p-6 rounded-3xl md:rounded-[2rem] flex items-start gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white shrink-0">
              <iconify-icon icon="solar:info-circle-bold-duotone" width="24" className="md:hidden"></iconify-icon>
              <iconify-icon icon="solar:info-circle-bold-duotone" width="28" className="hidden md:block"></iconify-icon>
            </div>
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-300 text-sm md:text-base">Informasi Peminjaman</h4>
              <p className="text-amber-700/80 dark:text-amber-400/80 text-xs md:text-sm font-medium">
                Peminjaman fasilitas sekolah tidak dapat dilakukan melalui aplikasi. Harap hubungi bagian <strong>Sarpras</strong> secara langsung untuk pengajuan. Aplikasi ini hanya menampilkan status ketersediaan.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-neutral-200 dark:border-slate-700 shadow-sm space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-semibold text-[10px] md:text-xs uppercase tracking-widest w-full md:w-auto">
                <iconify-icon icon="solar:globus-bold-duotone" width="18"></iconify-icon>
                Tipe Data:
              </div>
              <div className="flex gap-2 md:gap-3">
                <button 
                  onClick={() => toggleFilter('akademik')}
                  className={`px-4 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl font-semibold text-xs md:text-sm transition-all border ${
                    activeFilters.includes('akademik') 
                      ? 'bg-teladan-blue text-white border-teladan-blue shadow-lg shadow-blue-100 dark:shadow-none' 
                      : 'bg-transparent text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Akademik
                </button>
                <button 
                  onClick={() => toggleFilter('sarpras')}
                  className={`px-4 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl font-semibold text-xs md:text-sm transition-all border ${
                    activeFilters.includes('sarpras') 
                      ? 'bg-teladan-red text-white border-teladan-red shadow-lg shadow-red-100 dark:shadow-none' 
                      : 'bg-transparent text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Sarpras
                </button>
              </div>
            </div>
            {isAdmin && (
              <button 
                onClick={() => setView('add')}
                className="w-full md:w-auto px-6 py-2 md:py-3 bg-teladan-blue text-white rounded-xl md:rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 dark:shadow-none hover:scale-105 transition-all text-sm md:text-base"
              >
                <iconify-icon icon="solar:add-circle-bold-duotone" width="20"></iconify-icon>
                Input Agenda
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-4 border-t border-slate-50 dark:border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-semibold text-[10px] md:text-xs uppercase tracking-widest w-full md:w-auto">
              <iconify-icon icon="solar:ranking-bold-duotone" width="18"></iconify-icon>
              Tingkat Kelas:
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {levels.map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setActiveLevel(activeLevel === lvl ? null : lvl)}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-semibold text-xs md:text-sm transition-all ${
                    activeLevel === lvl 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100 dark:shadow-none' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  Kelas {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-neutral-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white">Oktober 2023</h2>
            <div className="flex items-center gap-4 md:gap-6">
              <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <span className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-teladan-blue"></span> Akademik
              </div>
              <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <span className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-teladan-red"></span> Sarpras
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 md:gap-4 overflow-x-auto">
            {days.map(day => (
              <div key={day} className="text-center font-semibold text-slate-400 text-[10px] md:text-xs py-2 uppercase tracking-widest">{day}</div>
            ))}
            {Array.from({length: 31}).map((_, i) => {
              const date = i + 1;
              const isToday = date === today.getDate();
              const isSelected = date === selectedDate;
              const dayBookings = filteredBookings.filter(b => new Date(b.startTime).getDate() === date);
              const dayEvents = filteredEvents.filter(e => new Date(e.date).getDate() === date);

              return (
                <div 
                  key={i} 
                  onClick={() => setSelectedDate(date)}
                  className={`min-h-[80px] md:min-h-[120px] p-2 md:p-3 rounded-xl md:rounded-[1.5rem] border transition-all cursor-pointer ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-900/30 border-teladan-blue ring-2 ring-teladan-blue/20' : 
                    isToday ? 'bg-slate-50 dark:bg-slate-700/50 border-teladan-blue/30' : 
                    'border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1 md:mb-2">
                    <span className={`text-xs md:text-sm font-semibold ${isToday ? 'text-teladan-blue' : 'text-slate-400 dark:text-slate-500'}`}>{date}</span>
                    {(dayBookings.length > 0 || dayEvents.length > 0) && (
                      <div className="flex gap-0.5 md:gap-1">
                        {dayEvents.map(e => (
                          <span key={e.id} className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full ${getLevelColor(e.level)}`}></span>
                        ))}
                        {dayBookings.length > 0 && <span className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-teladan-red"></span>}
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5 md:space-y-1">
                    {dayEvents.slice(0, 1).map(e => (
                      <div key={e.id} className={`w-full h-1 md:h-1.5 ${getLevelColor(e.level)} rounded-full opacity-50`}></div>
                    ))}
                    {dayBookings.slice(0, 1).map(b => (
                      <div key={b.id} className="w-full h-1 md:h-1.5 bg-teladan-red rounded-full opacity-50"></div>
                    ))}
                    {(dayBookings.length + dayEvents.length) > 2 && (
                      <div className="text-[7px] md:text-[8px] font-semibold text-slate-400">+{(dayBookings.length + dayEvents.length) - 2}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-6 md:space-y-8">
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-neutral-200 dark:border-slate-700 shadow-sm lg:sticky lg:top-8">
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-teladan-blue rounded-xl md:rounded-2xl flex items-center justify-center text-white">
              <iconify-icon icon="solar:info-square-bold-duotone" width="24" className="md:hidden"></iconify-icon>
              <iconify-icon icon="solar:info-square-bold-duotone" width="28" className="hidden md:block"></iconify-icon>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold">Detail Harian</h3>
              <p className="text-slate-500 text-xs md:text-sm font-medium">
                {selectedDate ? `${selectedDate} Oktober 2023` : 'Pilih tanggal di kalender'}
              </p>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            {!selectedDate ? (
              <div className="py-8 md:py-12 text-center">
                <iconify-icon icon="solar:calendar-search-bold-duotone" width="40" className="md:hidden text-slate-200 mb-4"></iconify-icon>
                <iconify-icon icon="solar:calendar-search-bold-duotone" width="48" className="hidden md:block text-slate-200 mb-4"></iconify-icon>
                <p className="text-slate-400 text-xs md:text-sm font-medium">Klik pada tanggal untuk melihat detail agenda.</p>
              </div>
            ) : (selectedDateBookings.length === 0 && selectedDateEvents.length === 0) ? (
              <div className="py-8 md:py-12 text-center">
                <iconify-icon icon="solar:ghost-bold-duotone" width="40" className="md:hidden text-slate-200 mb-4"></iconify-icon>
                <iconify-icon icon="solar:ghost-bold-duotone" width="48" className="hidden md:block text-slate-200 mb-4"></iconify-icon>
                <p className="text-slate-400 text-xs md:text-sm font-medium">Tidak ada agenda pada tanggal ini.</p>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {/* Academic Events */}
                {selectedDateEvents.map(event => (
                  <div key={event.id} className={`p-4 md:p-5 rounded-2xl md:rounded-3xl border group relative ${
                    event.level === 'X' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800' :
                    event.level === 'XI' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800' :
                    event.level === 'XII' ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800' :
                    'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800'
                  }`}>
                    <div className="flex justify-between items-start mb-2 md:mb-3">
                      <div className={`px-2 md:px-3 py-0.5 md:py-1 rounded-lg text-[9px] md:text-[10px] font-semibold uppercase tracking-wider ${getLevelBadge(event.level)}`}>
                        {event.level === 'SEMUA' ? 'Semua Tingkat' : `Kelas ${event.level}`}
                      </div>
                      {isAdmin && (
                        <button 
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <iconify-icon icon="solar:trash-bin-trash-bold-duotone" width="18" className="md:hidden"></iconify-icon>
                          <iconify-icon icon="solar:trash-bin-trash-bold-duotone" width="20" className="hidden md:block"></iconify-icon>
                        </button>
                      )}
                    </div>
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-1 text-sm md:text-base">{event.title}</h4>
                    <p className="text-[10px] md:text-xs text-slate-500 font-medium">{event.description}</p>
                  </div>
                ))}

                {/* Sarpras Bookings */}
                {selectedDateBookings.map(booking => (
                  <div key={booking.id} className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 group relative">
                    <div className="flex justify-between items-start mb-2 md:mb-3">
                      <div className={`px-2 md:px-3 py-0.5 md:py-1 rounded-lg text-[9px] md:text-[10px] font-semibold uppercase tracking-wider bg-rose-100 text-rose-600`}>
                        Sarpras: {booking.resourceType === 'room' ? 'Ruangan' : 'Barang'}
                      </div>
                      {isAdmin && (
                        <button 
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <iconify-icon icon="solar:trash-bin-trash-bold-duotone" width="18" className="md:hidden"></iconify-icon>
                          <iconify-icon icon="solar:trash-bin-trash-bold-duotone" width="20" className="hidden md:block"></iconify-icon>
                        </button>
                      )}
                    </div>
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-1 text-sm md:text-base">{booking.resourceName}</h4>
                    <p className="text-[10px] md:text-xs text-slate-500 font-medium mb-2 md:mb-3">{booking.purpose}</p>
                    <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                      <iconify-icon icon="solar:clock-circle-bold-duotone" width="14"></iconify-icon>
                      {new Date(booking.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(booking.endTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
