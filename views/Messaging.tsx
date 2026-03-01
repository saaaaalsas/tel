
import React, { useState } from 'react';
import { User, Message, UserRole } from '../types';
import { MOCK_TEACHER, MOCK_STUDENT } from '../constants';

interface MessagingProps {
  user: User;
  messages: Message[];
  onSendMessage: (content: string, receiverId: string) => void;
}

const Messaging: React.FC<MessagingProps> = ({ user, messages, onSendMessage }) => {
  const [selectedContact, setSelectedContact] = useState<User>(user.role === UserRole.STUDENT ? MOCK_TEACHER : MOCK_STUDENT);
  const [inputText, setInputText] = useState('');

  const chatMessages = messages.filter(m => 
    (m.senderId === user.id && m.receiverId === selectedContact.id) ||
    (m.senderId === selectedContact.id && m.receiverId === user.id)
  );

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText, selectedContact.id);
    setInputText('');
  };

  return (
    <div className="h-[calc(100vh-200px)] flex gap-6 animate-fade-slide">
      {/* Contact List */}
      <div className="w-80 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-neutral-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-neutral-100 dark:border-slate-700">
           <h3 className="text-xl font-semibold">Kontak</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
           <button 
             onClick={() => setSelectedContact(user.role === UserRole.STUDENT ? MOCK_TEACHER : MOCK_STUDENT)}
             className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
               selectedContact.id === (user.role === UserRole.STUDENT ? MOCK_TEACHER.id : MOCK_STUDENT.id)
                 ? 'bg-sky-50 dark:bg-sky-900/20 ring-1 ring-sky-500' 
                 : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
             }`}
           >
              <img src={user.role === UserRole.STUDENT ? MOCK_TEACHER.avatar : MOCK_STUDENT.avatar} className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-600" />
              <div className="text-left flex-1 overflow-hidden">
                <p className="font-semibold text-slate-800 dark:text-white truncate">{user.role === UserRole.STUDENT ? MOCK_TEACHER.name : MOCK_STUDENT.name}</p>
                <p className="text-xs text-slate-400 truncate">Online</p>
              </div>
           </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-neutral-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden relative">
        {/* Chat Header */}
        <div className="p-6 border-b border-neutral-100 dark:border-slate-700 flex items-center gap-4">
           <img src={selectedContact.avatar} className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-600" />
           <div>
              <p className="font-semibold text-lg">{selectedContact.name}</p>
              <p className="text-xs text-emerald-500 font-semibold uppercase tracking-widest">Sedang Aktif</p>
           </div>
           <div className="ml-auto flex gap-2">
              <button className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-sky-500 transition-colors">
                <iconify-icon icon="solar:phone-bold-duotone" width="20"></iconify-icon>
              </button>
              <button className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-sky-500 transition-colors">
                <iconify-icon icon="solar:videocamera-bold-duotone" width="20"></iconify-icon>
              </button>
           </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 dark:bg-slate-900/10">
           {chatMessages.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <iconify-icon icon="solar:chat-round-line-bold-duotone" width="64" className="mb-4"></iconify-icon>
                <p className="font-bold">Mulai percakapan akademik Anda sekarang.</p>
                <p className="text-sm">Pertanyaan seputar materi atau jadwal sangat dianjurkan.</p>
             </div>
           ) : (
             chatMessages.map(msg => (
               <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-4 rounded-3xl ${
                    msg.senderId === user.id 
                      ? 'bg-sky-500 text-white rounded-tr-none shadow-md shadow-sky-100 dark:shadow-none' 
                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-tl-none border border-neutral-100 dark:border-slate-600'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p className={`text-[10px] mt-2 font-semibold opacity-60 ${msg.senderId === user.id ? 'text-right' : 'text-left'}`}>
                       {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
               </div>
             ))
           )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white dark:bg-slate-800 border-t border-neutral-100 dark:border-slate-700">
           <div className="flex gap-4 items-center bg-slate-50 dark:bg-slate-700 p-2 pl-4 rounded-[2rem]">
              <button className="text-slate-400 hover:text-sky-500 transition-colors">
                <iconify-icon icon="solar:paperclip-bold-duotone" width="24"></iconify-icon>
              </button>
              <input 
                type="text" 
                placeholder="Tulis pesan akademik..." 
                className="flex-1 bg-transparent border-none outline-none py-2 text-sm font-medium"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-sky-100 dark:shadow-none hover:scale-110 transition-transform"
              >
                <iconify-icon icon="solar:plain-bold-duotone" width="24"></iconify-icon>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;
