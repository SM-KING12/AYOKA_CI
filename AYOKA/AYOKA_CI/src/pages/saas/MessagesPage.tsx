import { useState } from 'react';
import { MessageSquare, Search, CheckCheck } from 'lucide-react';
import { usePartner } from '../../contexts/PartnerContext';
import { PageTransition, StaggerContainer, StaggerItem, EmptyState } from '../../components/UI';

export default function MessagesPage() {
  const { messages, markMessageRead, markAllMessagesRead, unreadMessageCount } = usePartner();
  const [search, setSearch] = useState('');

  const filtered = messages.filter((m) =>
    m.content.toLowerCase().includes(search.toLowerCase()) ||
    m.sender.toLowerCase().includes(search.toLowerCase())
  );

  const conversations = filtered.reduce<Record<string, typeof messages>>((acc, msg) => {
    const key = msg.conversationId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(msg);
    return acc;
  }, {});

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-navy-800">Messages</h1>
          <p className="text-gray-500 font-body text-sm mt-0.5">
            {unreadMessageCount} non lu{unreadMessageCount !== 1 ? 's' : ''}
          </p>
        </div>
        {unreadMessageCount > 0 && (
          <button
            onClick={markAllMessagesRead}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white shadow-soft text-ai-400 text-xs font-heading font-medium hover:shadow-card transition-all"
          >
            <CheckCheck className="w-4 h-4" /> Tout marquer lu
          </button>
        )}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher dans les messages..."
          className="input-field pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Aucun message"
          description="Vos conversations apparaîtront ici"
        />
      ) : (
        <StaggerContainer className="space-y-3">
          {Object.entries(conversations).map(([convId, msgs]) => {
            const latest = msgs[msgs.length - 1];
            const unread = msgs.filter((m) => !m.read).length;

            return (
              <StaggerItem key={convId}>
                <div
                  className={`bg-white rounded-card-lg p-5 shadow-soft hover:shadow-card transition-all duration-300 cursor-pointer ${
                    unread > 0 ? 'border-l-4 border-ai-400' : ''
                  }`}
                  onClick={() => msgs.forEach((m) => !m.read && markMessageRead(m.id))}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-800 to-ai-400 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-heading font-bold text-sm">{latest.senderAvatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-heading font-bold text-sm text-navy-800">{latest.sender}</span>
                        <span className="text-gray-400 text-xs font-body">{latest.timestamp}</span>
                      </div>
                      <p className="text-gray-500 text-sm font-body truncate mt-0.5">{latest.content}</p>
                    </div>
                    {unread > 0 && (
                      <div className="w-6 h-6 rounded-full bg-ai-400 text-white text-[10px] font-heading font-bold flex items-center justify-center flex-shrink-0">
                        {unread}
                      </div>
                    )}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}
    </PageTransition>
  );
}
