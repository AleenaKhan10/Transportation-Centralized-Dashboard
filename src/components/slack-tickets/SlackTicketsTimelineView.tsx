import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Clock } from 'lucide-react';
import { SlackTicket } from '../../types';

interface SlackTicketsTimelineViewProps {
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

const SlackTicketsTimelineView: React.FC<SlackTicketsTimelineViewProps> = ({
  tickets,
  loading
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  };

  const getConfidenceDot = (score: number) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const truncateText = (text: string | null | undefined, maxLength: number = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="p-3 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex gap-3">
            <div className="w-8 flex flex-col items-center">
              <div className="w-2 h-2 bg-dark-600 rounded-full"></div>
              <div className="w-px h-12 bg-dark-600"></div>
            </div>
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-dark-600 rounded w-1/4"></div>
              <div className="h-12 bg-dark-600 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500/30 via-primary-400/50 to-primary-500/30"></div>

        <div className="space-y-6">
          {tickets.map((ticket, index) => {
            const { time, date } = formatTime(ticket.created_at);
            
            return (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative flex gap-6"
              >
                <div className="relative z-10 flex flex-col items-center w-16">
                  <div className={`w-3 h-3 rounded-full ${getConfidenceDot(ticket.confidence_score)} ring-4 ring-dark-800 shadow-lg`}></div>
                  <div className="mt-2 text-xs text-dark-400 text-center leading-tight">
                    <div className="font-medium">{time}</div>
                    <div className="text-dark-500">{date}</div>
                  </div>
                </div>

                <div className="flex-1 pb-6">
                  <div className="bg-gradient-to-br from-dark-700/80 to-dark-800/60 rounded-xl border border-dark-600/50 p-4 shadow-lg backdrop-blur-sm hover:border-dark-500/60 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-dark-400 text-xs font-mono bg-dark-800/50 px-2 py-1 rounded-md">#{ticket.id}</span>
                        {ticket.is_mention && (
                          <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-400/30 px-3 py-1 rounded-full">
                            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
                            <span className="text-amber-300 text-xs font-medium">Direct Mention</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getConfidenceDot(ticket.confidence_score)}`}></div>
                        <span className="text-xs text-dark-400 font-medium">{Math.round(ticket.confidence_score * 100)}%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div 
                          className="bg-dark-800/70 rounded-lg p-3 text-dark-200 text-sm cursor-help leading-relaxed flex-1 border border-dark-700/50"
                          title={ticket.user_message || ''}
                        >
                          {truncateText(ticket.user_message, 120)}
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div 
                          className="bg-gradient-to-br from-dark-800/70 to-dark-900/50 rounded-lg p-3 text-dark-200 text-sm cursor-help leading-relaxed flex-1 border border-green-500/20"
                          title={ticket.ai_response || ''}
                        >
                          {truncateText(ticket.ai_response, 140)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {tickets.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 mx-auto mb-3 text-dark-400" />
            <h3 className="text-md font-medium text-white mb-1">No activity found</h3>
            <p className="text-dark-400 text-sm">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlackTicketsTimelineView; 