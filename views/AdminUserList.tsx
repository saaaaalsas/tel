
import React from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';

const AdminUserList: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-slide pb-10 md:pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {MOCK_USERS.map((user) => (
          <div key={user.id} className="bg-white dark:bg-slate-800 p-5 md:p-6 rounded-3xl md:rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <img src={user.avatar} alt={user.name} className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl border-2 border-white dark:border-slate-600 shadow-md group-hover:scale-105 transition-transform" />
              <div>
                <h3 className="font-semibold text-base md:text-lg text-slate-900 dark:text-white leading-tight">{user.name}</h3>
                <p className="text-[10px] md:text-xs font-semibold text-teladan-blue uppercase tracking-widest mt-1">{user.role}</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-700">
              <div className="flex items-center justify-between text-[10px] md:text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-widest">Email</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate ml-4">{user.email}</span>
              </div>
              {user.role === UserRole.STUDENT && (
                <div className="flex items-center justify-between text-[10px] md:text-xs">
                  <span className="text-slate-400 font-semibold uppercase tracking-widest">Kelas</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{(user as any).class}</span>
                </div>
              )}
              {(user as any).nisn && (
                <div className="flex items-center justify-between text-[10px] md:text-xs">
                  <span className="text-slate-400 font-semibold uppercase tracking-widest">
                    {user.role === UserRole.STUDENT ? 'NISN' : 'NIP'}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{(user as any).nisn}</span>
                </div>
              )}
            </div>

            <button className="w-full mt-6 py-2.5 md:py-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-semibold text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-teladan-blue hover:text-white transition-all">
              Detail Pengguna
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUserList;
