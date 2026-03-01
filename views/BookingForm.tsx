import React, { useState } from 'react';
import { User, RoomBooking, Room, UserRole } from '../types';
import { ROOMS, EQUIPMENT } from '../constants';

interface BookingFormProps {
  user: User;
  bookings: RoomBooking[];
  setBookings: React.Dispatch<React.SetStateAction<RoomBooking[]>>;
}

const BookingForm: React.FC<BookingFormProps> = ({ user, bookings, setBookings }) => {
  const [view, setView] = useState<'status' | 'add'>('status');
  const [resourceType, setResourceType] = useState<'room' | 'item' | null>(null);
  const [formData, setFormData] = useState({
    resourceId: '',
    purpose: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '10:00',
    level: 'X' as 'X' | 'XI' | 'XII',
    quantity: 1
  });

  const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.GURU_ADMIN;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resourceId || !formData.purpose) return;

    const resource = resourceType === 'room' 
      ? ROOMS.find(r => r.id === formData.resourceId)
      : EQUIPMENT.find(e => e.id === formData.resourceId);

    const newBooking: RoomBooking = {
      id: Math.random().toString(36).substr(2, 9),
      resourceId: formData.resourceId,
      resourceName: resource?.name || 'Unknown',
      resourceType: resourceType as 'room' | 'item',
      studentName: 'Admin Input',
      studentClass: 'SARPRAS',
      purpose: formData.purpose,
      startTime: `${formData.date}T${formData.startTime}:00`,
      endTime: `${formData.date}T${formData.endTime}:00`,
      level: formData.level,
      quantity: resourceType === 'item' ? formData.quantity : 1
    };

    setBookings([...bookings, newBooking]);
    setView('status');
    setFormData({
      resourceId: '',
      purpose: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '10:00',
      level: 'X',
      quantity: 1
    });
  };

  const getStatus = (resourceId: string) => {
    const now = new Date();
    const activeBookings = bookings.filter(b => {
      const start = new Date(b.startTime);
      const end = new Date(b.endTime);
      return b.resourceId === resourceId && now >= start && now <= end;
    });
    return activeBookings;
  };

  if (view === 'add') {
    return (
      <div className="max-w-4xl mx-auto animate-fade-slide pb-10 md:pb-20">
        <button 
          onClick={() => setView('status')}
          className="mb-6 md:mb-8 flex items-center gap-2 text-slate-500 font-semibold hover:text-sky-500 transition-colors text-sm md:text-base"
        >
          <iconify-icon icon="solar:alt-arrow-left-bold-duotone" width="20" className="md:hidden"></iconify-icon>
          <iconify-icon icon="solar:alt-arrow-left-bold-duotone" width="24" className="hidden md:block"></iconify-icon>
          Kembali ke Status
        </button>

        <div className="bg-white dark:bg-slate-800 p-6 md:p-12 rounded-3xl md:rounded-[3rem] border border-neutral-200 dark:border-slate-700 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-teladan-blue flex items-center justify-center text-white shadow-2xl dark:shadow-none sonar-effect flex-shrink-0">
              <iconify-icon icon="solar:calendar-add-bold-duotone" width="28" className="md:hidden"></iconify-icon>
              <iconify-icon icon="solar:calendar-add-bold-duotone" width="40" className="hidden md:block"></iconify-icon>
            </div>
            <div>
              <h2 className="text-xl md:text-3xl font-semibold">Input Peminjaman Manual</h2>
              <p className="text-xs md:text-base text-slate-500 font-medium">Catat peminjaman yang dilakukan via Sarpras.</p>
            </div>
          </div>

          <form onSubmit={handleBooking} className="space-y-6 md:space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-2 md:space-y-3">
                <label className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">Tipe Fasilitas</label>
                <div className="flex gap-3 md:gap-4">
                  <button 
                    type="button"
                    onClick={() => setResourceType('room')}
                    className={`flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold transition-all border text-sm md:text-base ${resourceType === 'room' ? 'bg-sky-500 text-white border-sky-500' : 'bg-slate-50 dark:bg-slate-700 text-slate-400 border-transparent'}`}
                  >
                    Ruangan
                  </button>
                  <button 
                    type="button"
                    onClick={() => setResourceType('item')}
                    className={`flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold transition-all border text-sm md:text-base ${resourceType === 'item' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-slate-50 dark:bg-slate-700 text-slate-400 border-transparent'}`}
                  >
                    Barang
                  </button>
                </div>
              </div>
              <div className="space-y-2 md:space-y-3">
                <label className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">Pilih Fasilitas</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:ring-2 ring-sky-500 font-semibold transition-all text-sm md:text-base"
                  value={formData.resourceId}
                  onChange={(e) => setFormData({...formData, resourceId: e.target.value})}
                  disabled={!resourceType}
                >
                  <option value="">-- Pilih --</option>
                  {resourceType === 'room' ? (
                    ROOMS.map(room => (
                      <option key={room.id} value={room.id}>{room.name}</option>
                    ))
                  ) : (
                    EQUIPMENT.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="space-y-2 md:space-y-3">
                <label className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">Keperluan</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:ring-2 ring-sky-500 font-medium text-sm md:text-base"
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                  placeholder="Misal: Latihan Basket"
                />
              </div>
              <div className="space-y-2 md:space-y-3">
                <label className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">Tingkat Kelas</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:ring-2 ring-sky-500 font-semibold text-sm md:text-base"
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value as any})}
                >
                  <option value="X">Kelas X</option>
                  <option value="XI">Kelas XI</option>
                  <option value="XII">Kelas XII</option>
                </select>
              </div>
              {resourceType === 'item' && (
                <div className="space-y-2 md:space-y-3">
                  <label className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">Kuantitas</label>
                  <input 
                    type="number" 
                    min="1"
                    className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:ring-2 ring-sky-500 font-semibold text-sm md:text-base"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-2 md:space-y-3">
                <label className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">Tanggal</label>
                <input 
                  type="date" 
                  className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:ring-2 ring-sky-500 font-semibold text-sm md:text-base"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:space-y-3">
                <label className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">Mulai</label>
                <input 
                  type="time" 
                  className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:ring-2 ring-sky-500 font-semibold text-sm md:text-base"
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:space-y-3">
                <label className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">Selesai</label>
                <input 
                  type="time" 
                  className="w-full bg-slate-50 dark:bg-slate-700 border-none rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:ring-2 ring-sky-500 font-semibold text-sm md:text-base"
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-4 md:py-6 rounded-2xl md:rounded-[2rem] bg-teladan-blue text-white font-semibold text-lg md:text-xl shadow-2xl dark:shadow-none hover:opacity-90 transition-all flex items-center justify-center gap-3 md:gap-4"
            >
              <iconify-icon icon="solar:check-circle-bold-duotone" width="24" className="md:hidden"></iconify-icon>
              <iconify-icon icon="solar:check-circle-bold-duotone" width="32" className="hidden md:block"></iconify-icon>
              Simpan Peminjaman
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10 animate-fade-slide pb-10 md:pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-teladan-red rounded-xl md:rounded-2xl flex items-center justify-center text-white flex-shrink-0">
            <iconify-icon icon="solar:buildings-bold-duotone" width="24" className="md:hidden"></iconify-icon>
            <iconify-icon icon="solar:buildings-bold-duotone" width="28" className="hidden md:block"></iconify-icon>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-semibold">Status Fasilitas Real-time</h3>
            <p className="text-slate-500 font-medium text-xs md:text-sm">Monitor ketersediaan sarana dan prasarana sekolah saat ini.</p>
          </div>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setView('add')}
            className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 bg-teladan-blue text-white rounded-xl md:rounded-2xl font-semibold flex items-center justify-center gap-2 md:gap-3 shadow-lg shadow-blue-100 dark:shadow-none hover:scale-105 transition-all text-sm md:text-base"
          >
            <iconify-icon icon="solar:add-circle-bold-duotone" width="20" className="md:hidden"></iconify-icon>
            <iconify-icon icon="solar:add-circle-bold-duotone" width="24" className="hidden md:block"></iconify-icon>
            Input Manual
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Rooms Section */}
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 md:gap-3 px-2 md:px-4">
            <iconify-icon icon="solar:home-bold-duotone" width="20" className="text-sky-500 md:hidden"></iconify-icon>
            <iconify-icon icon="solar:home-bold-duotone" width="24" className="hidden md:block text-sky-500"></iconify-icon>
            <h4 className="font-semibold text-slate-400 uppercase tracking-widest text-[10px] md:text-xs">Daftar Ruangan</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {ROOMS.map(room => {
              const activeBookings = getStatus(room.id);
              const activeBooking = activeBookings[0];
              return (
                <div key={room.id} className={`p-5 md:p-6 rounded-3xl md:rounded-[2rem] border shadow-sm group transition-all ${activeBooking ? 'bg-red-500 text-white border-red-600' : 'bg-white dark:bg-slate-800 border-neutral-200 dark:border-slate-700 hover:border-sky-200'}`}>
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center ${activeBooking ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-500'}`}>
                      <iconify-icon icon={activeBooking ? 'solar:lock-bold-duotone' : 'solar:key-bold-duotone'} width="20" className="md:hidden"></iconify-icon>
                      <iconify-icon icon={activeBooking ? 'solar:lock-bold-duotone' : 'solar:key-bold-duotone'} width="24" className="hidden md:block"></iconify-icon>
                    </div>
                    <div className={`px-2 md:px-3 py-1 rounded-lg text-[9px] md:text-[10px] font-semibold uppercase tracking-wider ${activeBooking ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
                      {activeBooking ? 'Terpakai' : 'Tersedia'}
                    </div>
                  </div>
                  <h5 className={`font-semibold mb-1 text-sm md:text-base ${activeBooking ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{room.name}</h5>
                  <p className={`text-[10px] md:text-xs font-medium mb-3 md:mb-4 ${activeBooking ? 'text-white/80' : 'text-slate-400'}`}>Fasilitas Sekolah</p>
                  
                  {activeBooking && (
                    <div className="pt-3 md:pt-4 border-t border-white/20 space-y-2">
                      <div className="flex items-center justify-between gap-2 text-[9px] md:text-[10px] font-semibold text-white/90 uppercase tracking-widest">
                        <div className="flex items-center gap-2 truncate">
                          <iconify-icon icon="solar:user-bold-duotone" width="12" className="md:hidden"></iconify-icon>
                          <iconify-icon icon="solar:user-bold-duotone" width="14" className="hidden md:block"></iconify-icon>
                          {activeBooking.studentName} ({activeBooking.studentClass})
                        </div>
                        {isAdmin && (
                          <button 
                            onClick={() => {
                              if(confirm('Hapus peminjaman ini?')) {
                                setBookings(prev => prev.filter(b => b.id !== activeBooking.id));
                              }
                            }}
                            className="text-white hover:text-white/70 transition-colors flex-shrink-0"
                            title="Buang Peminjaman"
                          >
                            <iconify-icon icon="solar:trash-bin-trash-bold-duotone" width="14" className="md:hidden"></iconify-icon>
                            <iconify-icon icon="solar:trash-bin-trash-bold-duotone" width="16" className="hidden md:block"></iconify-icon>
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-semibold text-white/70 uppercase tracking-widest">
                        <iconify-icon icon="solar:clock-circle-bold-duotone" width="12" className="md:hidden"></iconify-icon>
                        <iconify-icon icon="solar:clock-circle-bold-duotone" width="14" className="hidden md:block"></iconify-icon>
                        Sampai {new Date(activeBooking.endTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Equipment Section */}
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 md:gap-3 px-2 md:px-4">
            <iconify-icon icon="solar:box-bold-duotone" width="20" className="text-indigo-500 md:hidden"></iconify-icon>
            <iconify-icon icon="solar:box-bold-duotone" width="24" className="hidden md:block text-indigo-500"></iconify-icon>
            <h4 className="font-semibold text-slate-400 uppercase tracking-widest text-[10px] md:text-xs">Daftar Inventaris</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {EQUIPMENT.map(item => {
              const activeBookings = getStatus(item.id);
              const totalBorrowed = activeBookings.reduce((sum, b) => sum + (b.quantity || 0), 0);
              const availableQty = (item.quantity || 0) - totalBorrowed;
              const isFullyBooked = availableQty <= 0;
              const isPartiallyBooked = totalBorrowed > 0 && !isFullyBooked;

              return (
                <div key={item.id} className={`p-5 md:p-6 rounded-3xl md:rounded-[2rem] border shadow-sm group transition-all ${
                  isFullyBooked 
                    ? 'bg-red-500 text-white border-red-600' 
                    : isPartiallyBooked 
                      ? 'bg-indigo-500 text-white border-indigo-600' 
                      : 'bg-white dark:bg-slate-800 border-neutral-200 dark:border-slate-700 hover:border-indigo-200'
                }`}>
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center ${isFullyBooked || isPartiallyBooked ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-500'}`}>
                      <iconify-icon icon={isFullyBooked ? 'solar:lock-bold-duotone' : 'solar:key-bold-duotone'} width="20" className="md:hidden"></iconify-icon>
                      <iconify-icon icon={isFullyBooked ? 'solar:lock-bold-duotone' : 'solar:key-bold-duotone'} width="24" className="hidden md:block"></iconify-icon>
                    </div>
                    <div className={`px-2 md:px-3 py-1 rounded-lg text-[9px] md:text-[10px] font-semibold uppercase tracking-wider ${isFullyBooked || isPartiallyBooked ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
                      {isFullyBooked ? 'Habis' : isPartiallyBooked ? 'Terpakai Sebagian' : 'Tersedia'}
                    </div>
                  </div>
                  <h5 className={`font-semibold mb-1 text-sm md:text-base ${isFullyBooked || isPartiallyBooked ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{item.name}</h5>
                  <p className={`text-[10px] md:text-xs font-medium mb-3 md:mb-4 ${isFullyBooked || isPartiallyBooked ? 'text-white/80' : 'text-slate-400'}`}>Tersedia: {availableQty} / {item.quantity}</p>
                  
                  {activeBookings.length > 0 && (
                    <div className="pt-3 md:pt-4 border-t border-white/20 space-y-3">
                      {activeBookings.map(booking => (
                        <div key={booking.id} className="space-y-1">
                          <div className="flex items-center justify-between gap-2 text-[9px] md:text-[10px] font-semibold text-white/90 uppercase tracking-widest">
                            <div className="flex items-center gap-2 truncate">
                              <iconify-icon icon="solar:user-bold-duotone" width="12" className="md:hidden"></iconify-icon>
                              <iconify-icon icon="solar:user-bold-duotone" width="14" className="hidden md:block"></iconify-icon>
                              {booking.studentName} ({booking.studentClass}) - {booking.quantity} unit
                            </div>
                            {isAdmin && (
                              <button 
                                onClick={() => {
                                  if(confirm('Hapus peminjaman ini?')) {
                                    setBookings(prev => prev.filter(b => b.id !== booking.id));
                                  }
                                }}
                                className="text-white hover:text-white/70 transition-colors flex-shrink-0"
                                title="Buang Peminjaman"
                              >
                                <iconify-icon icon="solar:trash-bin-trash-bold-duotone" width="14" className="md:hidden"></iconify-icon>
                                <iconify-icon icon="solar:trash-bin-trash-bold-duotone" width="16" className="hidden md:block"></iconify-icon>
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-semibold text-white/70 uppercase tracking-widest">
                            <iconify-icon icon="solar:clock-circle-bold-duotone" width="12" className="md:hidden"></iconify-icon>
                            <iconify-icon icon="solar:clock-circle-bold-duotone" width="14" className="hidden md:block"></iconify-icon>
                            Sampai {new Date(booking.endTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
