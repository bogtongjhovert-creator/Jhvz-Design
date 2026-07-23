import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { MessageSquare, Mail, Trash2, CheckCircle2, Sparkles } from 'lucide-react';

export const MessagesManager: React.FC = () => {
  const { messages, updateMessageStatus, deleteMessage } = usePortfolio();

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Messages Inbox</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Website Inquiries & Messages
        </h2>
        <p className="text-xs text-zinc-400">
          Direct messages sent by visitors through the public contact form.
        </p>
      </div>

      <div className="space-y-3">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 rounded-2xl border transition-all ${
                msg.status === 'unread' ? 'bg-zinc-900 border-cyan-500/50 shadow-md' : 'bg-zinc-900/60 border-zinc-800 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <div>
                    <h3 className="font-bold text-white text-sm">{msg.name}</h3>
                    <a href={`mailto:${msg.email}`} className="text-xs text-zinc-400 hover:text-cyan-400">
                      {msg.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateMessageStatus(msg.id, msg.status === 'unread' ? 'read' : 'unread')}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
                  >
                    {msg.status === 'unread' ? 'Mark Read' : 'Mark Unread'}
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Delete message?')) deleteMessage(msg.id);
                    }}
                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="pt-3 space-y-1">
                <h4 className="text-xs font-bold text-cyan-300">{msg.subject}</h4>
                <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">{msg.content}</p>
                <span className="text-[10px] text-zinc-500 block pt-1">{msg.date}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-zinc-500 text-xs bg-zinc-900 rounded-2xl border border-zinc-800">
            Inbox is currently empty.
          </div>
        )}
      </div>
    </div>
  );
};
