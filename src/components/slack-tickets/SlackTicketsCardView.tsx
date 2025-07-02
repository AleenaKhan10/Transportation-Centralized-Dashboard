import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Clock } from 'lucide-react';
import { SlackTicket } from '../../types';

interface SlackTicketsCardViewProps {
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

const SlackTicketsCardView: React.FC<SlackTicketsCardViewProps> = ({
  tickets,
  loading
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-400 bg-green-400/10 border-green-400/20';
    if (score >= 0.6) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    return 'text-red-400 bg-red-400/10 border-red-400/20';
  };

  const truncateText = (text: string | null | undefined, maxLength: number = 80) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-dark-600 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {tickets.map((ticket, index) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gradient-to-br from-dark-700/80 to-dark-800/60 rounded-xl border border-dark-600/50 p-4 hover:border-dark-500/60 hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-dark-400 text-xs font-mono bg-dark-800/50 px-2 py-1 rounded">#{ticket.id}</span>
              {ticket.is_mention && (
                <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-400/30 px-2 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
                  <span className="text-amber-300 text-xs font-medium">@</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 text-white" />
                </div>
                <p 
                  className="text-dark-200 text-sm leading-relaxed cursor-help"
                  title={ticket.user_message || ''}
                >
                  {truncateText(ticket.user_message)}
                </p>
              </div>
              
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <p 
                  className="text-dark-200 text-sm leading-relaxed cursor-help"
                  title={ticket.ai_response || ''}
                >
                  {truncateText(ticket.ai_response)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-dark-600/50">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(ticket.confidence_score)}`}>
                {Math.round(ticket.confidence_score * 100)}%
              </span>
              <div className="flex items-center gap-1 text-dark-400">
                <Clock className="w-3 h-3" />
                <span className="text-xs font-medium">{formatDate(ticket.created_at)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {tickets.length === 0 && (
        <div className="text-center py-12">
          <Bot className="w-12 h-12 mx-auto mb-3 text-dark-400" />
          <h3 className="text-md font-medium text-white mb-1">No tickets found</h3>
          <p className="text-dark-400 text-sm">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

export default SlackTicketsCardView; 