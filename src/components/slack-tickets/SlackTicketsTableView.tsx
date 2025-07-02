import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { SlackTicket } from '../../types';

interface SlackTicketsTableViewProps {
  tickets: SlackTicket[];
  loading: boolean;
  onRefresh: () => void;
}

const SlackTicketsTableView: React.FC<SlackTicketsTableViewProps> = ({
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
    if (score >= 0.8) return 'text-green-400 bg-green-400/10';
    if (score >= 0.6) return 'text-yellow-400 bg-yellow-400/10';
    return 'text-red-400 bg-red-400/10';
  };

  const truncateText = (text: string | null | undefined, maxLength: number = 60) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="p-3">
        <div className="animate-pulse space-y-2">
          <div className="h-8 bg-dark-600 rounded"></div>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-10 bg-dark-600 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-primary-500/30 bg-gradient-to-r from-dark-800/50 to-dark-700/30">
              <th className="text-left py-3 px-3 text-dark-200 font-semibold text-xs uppercase tracking-wide">ID</th>
              <th className="text-left py-3 px-3 text-dark-200 font-semibold text-xs uppercase tracking-wide">User Message</th>
              <th className="text-left py-3 px-3 text-dark-200 font-semibold text-xs uppercase tracking-wide">AI Response</th>
              <th className="text-left py-3 px-3 text-dark-200 font-semibold text-xs uppercase tracking-wide">Confidence</th>
              <th className="text-left py-3 px-3 text-dark-200 font-semibold text-xs uppercase tracking-wide">Type</th>
              <th className="text-left py-3 px-3 text-dark-200 font-semibold text-xs uppercase tracking-wide">Created</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <motion.tr
                key={ticket.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-dark-700/50 hover:bg-gradient-to-r hover:from-dark-700/40 hover:to-dark-800/30 transition-all duration-200"
              >
                <td className="py-3 px-3 text-white font-mono text-xs bg-dark-800/20 rounded-sm">#{ticket.id}</td>
                <td 
                  className="py-3 px-3 max-w-xs text-dark-200 text-xs cursor-help"
                  title={ticket.user_message || ''}
                >
                  {truncateText(ticket.user_message)}
                </td>
                <td 
                  className="py-3 px-3 max-w-xs text-dark-200 text-xs cursor-help"
                  title={ticket.ai_response || ''}
                >
                  {truncateText(ticket.ai_response)}
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(ticket.confidence_score)}`}>
                    {Math.round(ticket.confidence_score * 100)}%
                  </span>
                </td>
                <td className="py-3 px-3">
                  {ticket.is_mention ? (
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-400/30 px-2 py-1 rounded-full w-fit">
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
                      <span className="text-amber-300 text-xs font-medium">Mention</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500/15 to-indigo-500/15 border border-blue-400/30 px-2 py-1 rounded-full w-fit">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span className="text-blue-300 text-xs font-medium">Message</span>
                    </div>
                  )}
                </td>
                <td className="py-3 px-3 text-dark-300 text-xs font-medium">
                  {formatDate(ticket.created_at)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
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

export default SlackTicketsTableView; 