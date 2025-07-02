import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Clock } from 'lucide-react';
import { SlackTicket } from '../../types';

interface SlackTicketsChatViewProps {
  tickets: SlackTicket[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

const SlackTicketsChatView: React.FC<SlackTicketsChatViewProps> = ({
  tickets,
  loading
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'border-l-green-400';
    if (score >= 0.6) return 'border-l-yellow-400';
    return 'border-l-red-400';
  };



  const truncateText = (text: string | null | undefined, maxLength: number = 200) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="p-3 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex gap-2 mb-2">
              <div className="w-6 h-6 bg-dark-600 rounded-full"></div>
              <div className="h-4 bg-dark-600 rounded w-1/4"></div>
            </div>
            <div className="h-12 bg-dark-600 rounded ml-8"></div>
          </div>
        ))}
      </div>
    );
  }

  // Group tickets by date
  const groupedTickets = tickets.reduce((groups, ticket) => {
    const date = formatDate(ticket.created_at);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(ticket);
    return groups;
  }, {} as Record<string, SlackTicket[]>);

  return (
    <div className="p-3">
      <div className="space-y-3">
        {Object.entries(groupedTickets).map(([date, dateTickets]) => (
          <div key={date} className="space-y-4">
            {/* Date Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-dark-500 to-transparent"></div>
              <div className="px-4 py-2 bg-gradient-to-br from-dark-700 to-dark-800 rounded-full text-sm text-dark-200 font-semibold border border-dark-600/50 shadow-sm">
                {date}
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-dark-500 to-transparent"></div>
            </div>

            {/* Messages for this date */}
            {dateTickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border-l-4 ${getConfidenceColor(ticket.confidence_score)} bg-gradient-to-br from-dark-700/40 to-dark-800/30 rounded-r-xl p-4 hover:bg-dark-700/50 transition-all duration-200 backdrop-blur-sm`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-dark-800/50 px-2 py-1 rounded font-mono text-xs text-dark-400">#{ticket.id}</span>
                    {ticket.is_mention && (
                      <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 px-2 py-0.5 rounded-full">
                        <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse"></div>
                        <span className="text-amber-300 text-xs font-medium">@</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-dark-400 text-xs">
                    <Clock className="w-3 h-3" />
                    <span className="font-medium">{formatTime(ticket.created_at)}</span>
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-3">
                  {/* User Message */}
                  <div className="flex gap-3">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-gradient-to-br from-dark-800/80 to-dark-900/60 rounded-xl p-3 max-w-[80%] border border-dark-700/50 shadow-sm">
                      <p 
                        className="text-dark-200 text-sm leading-relaxed cursor-help"
                        title={ticket.user_message || ''}
                      >
                        {truncateText(ticket.user_message)}
                      </p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex gap-3 justify-start">
                    <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-gradient-to-br from-dark-800/80 to-dark-900/60 rounded-xl p-3 max-w-[80%] border border-green-500/20 shadow-sm">
                      <p 
                        className="text-dark-200 text-sm leading-relaxed cursor-help"
                        title={ticket.ai_response || ''}
                      >
                        {truncateText(ticket.ai_response)}
                      </p>
                      
                      {/* Confidence Score */}
                      <div className="mt-2 pt-2 border-t border-dark-600/50">
                        <span className="text-dark-400 text-xs font-medium">
                          Confidence: {Math.round(ticket.confidence_score * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thread indicator if part of a thread */}
                {ticket.thread_ts && (
                  <div className="ml-11 text-xs text-dark-500 flex items-center gap-1">
                    <div className="w-4 h-px bg-dark-600"></div>
                    Thread: {ticket.thread_ts}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {tickets.length === 0 && (
        <div className="text-center py-12">
          <Bot className="w-12 h-12 mx-auto mb-3 text-dark-400" />
          <h3 className="text-md font-medium text-white mb-1">No conversations found</h3>
          <p className="text-dark-400 text-sm">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

export default SlackTicketsChatView; 