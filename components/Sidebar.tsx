
import React from 'react';
import { User, UserRole } from '../types';
import { NAV_ITEMS } from '../constants';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
  onLogout: () => void;
  lang: 'id' | 'en';
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, onLogout, lang }) => {
  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (user.role === UserRole.ADMIN) {
      return item.id === 'dashboard' || item.id === 'calendar' || item.id === 'booking';
    }
    if (user.role === UserRole.GURU_ADMIN) {
      return true;
    }
    if (user.role === UserRole.TEACHER || user.role === UserRole.STUDENT) {
      return item.id === 'dashboard' || item.id === 'classroom' || item.id === 'calendar' || item.id === 'booking';
    }
    return true;
  });

  return (
    <aside className="fixed bottom-0 left-0 right-0 h-20 md:h-full w-full md:w-72 bg-white/80 dark:bg-teladan-navy/80 backdrop-blur-xl md:bg-white md:dark:bg-teladan-navy border-t md:border-t-0 md:border-r border-slate-200 dark:border-slate-800 flex md:flex-col transition-all duration-300 z-50 md:relative">
      <div className="hidden md:flex p-8 items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center sonar-effect flex-shrink-0">
          <img 
            src="https://lh3.googleusercontent.com/d/1OjBe_s-XJKZ-44j1mk3FLocHg5JjzdMd" 
            alt="Tel-Finder Logo" 
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </div>
        <div className="hidden md:flex flex-col">
          <span className="font-semibold text-xl tracking-tight text-teladan-navy dark:text-white font-heading leading-none">
            Tel
          </span>
          <span className="font-medium text-xs tracking-widest text-teladan-blue font-heading uppercase mt-0.5">
            Finder
          </span>
        </div>
      </div>

      <nav className="flex-1 flex md:flex-col items-center md:items-stretch justify-around md:justify-start px-2 md:px-4 md:mt-6 space-y-0 md:space-y-1">
        {filteredNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-4 px-3 md:px-5 py-2 md:py-4 rounded-xl md:rounded-[1.25rem] transition-all duration-300 relative ${
              activeTab === item.id 
                ? 'bg-teladan-blue text-white shadow-lg md:shadow-xl shadow-blue-100 dark:shadow-none md:translate-x-1' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-teladan-blue'
            }`}
          >
            <iconify-icon icon={item.icon} width="24" className="md:hidden"></iconify-icon>
            <iconify-icon icon={item.icon} width="24" className="hidden md:block"></iconify-icon>
            <span className="text-[10px] md:text-[0.95rem] font-semibold md:font-semibold">
              <span className="md:hidden">
                {item.id === 'booking' ? (lang === 'id' ? 'Sarpras' : 'Facil') : (lang === 'id' ? item.label_id : item.label_en)}
              </span>
              <span className="hidden md:block">
                {item.id === 'booking' 
                  ? (lang === 'id' 
                      ? (user.role === UserRole.ADMIN || user.role === UserRole.GURU_ADMIN ? 'Kelola Sarpras' : 'Sarpras') 
                      : (user.role === UserRole.ADMIN || user.role === UserRole.GURU_ADMIN ? 'Manage Facilities' : 'Facilities'))
                  : (lang === 'id' ? item.label_id : item.label_en)}
              </span>
            </span>
          </button>
        ))}
        <button 
          onClick={() => setActiveTab('settings')}
          className={`md:hidden flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${
            activeTab === 'settings' 
              ? 'bg-teladan-red text-white shadow-lg' 
              : 'text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-slate-800'
          }`}
        >
          <iconify-icon icon="solar:settings-bold-duotone" width="24"></iconify-icon>
          <span className="text-[10px] font-semibold">{lang === 'id' ? 'Set' : 'Set'}</span>
        </button>
      </nav>

      <div className="hidden md:block p-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 ${
            activeTab === 'settings' 
              ? 'bg-teladan-red text-white shadow-xl' 
              : 'text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-slate-800'
          }`}
        >
          <iconify-icon icon="solar:settings-bold-duotone" width="24"></iconify-icon>
          <span className="hidden md:block font-semibold text-[0.95rem]">{lang === 'id' ? 'Pengaturan' : 'Settings'}</span>
        </button>

        <div className="hidden md:flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 shadow-sm" />
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold truncate text-slate-900 dark:text-white leading-tight">{user.name}</p>
            <p className="text-[10px] text-teladan-blue mt-0.5 font-bold uppercase tracking-wider">{user.role}</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2.5 px-5 py-4 rounded-2xl text-teladan-red hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-semibold text-sm hover:scale-95"
        >
          <iconify-icon icon="solar:logout-bold-duotone" width="22"></iconify-icon>
          <span className="hidden md:block">{lang === 'id' ? 'Log Keluar' : 'Log Out'}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
