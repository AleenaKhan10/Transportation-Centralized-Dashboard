import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  User, 
  Settings, 
  Power,
  PowerOff,
  Edit,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  FileText,
  Bot
} from 'lucide-react';
import { CallAgent } from '../../types';
import { cn } from '../../utils/cn';

interface CallAgentsViewProps {
  agents: CallAgent[];
  onAgentStatusChange: () => void;
}

const CallAgentsView: React.FC<CallAgentsViewProps> = ({
  agents,
  onAgentStatusChange
}) => {
  const [selectedAgent, setSelectedAgent] = useState<CallAgent | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Partial<CallAgent>>({});

  const getStatusColor = (status: CallAgent['status']) => {
    switch (status) {
      case 'available': return 'text-green-400 bg-green-500/20';
      case 'busy': return 'text-amber-400 bg-amber-500/20';
      case 'offline': return 'text-red-400 bg-red-500/20';
      default: return 'text-dark-400 bg-dark-700';
    }
  };

  const getTypeColor = (type: CallAgent['type']) => {
    switch (type) {
      case 'primary': return 'text-primary-400 bg-primary-500/20';
      case 'breakdown': return 'text-orange-400 bg-orange-500/20';
      case 'job-application': return 'text-blue-400 bg-blue-500/20';
      case 'general': return 'text-secondary-400 bg-secondary-500/20';
      default: return 'text-dark-400 bg-dark-700';
    }
  };

  const getStatusIcon = (status: CallAgent['status']) => {
    switch (status) {
      case 'available': return CheckCircle;
      case 'busy': return Clock;
      case 'offline': return PowerOff;
      default: return AlertCircle;
    }
  };

  const handleEditAgent = (agent: CallAgent) => {
    setEditingAgent(agent);
    setShowEditModal(true);
  };

  const handleSaveAgent = () => {
    // In a real implementation, this would call an API
    console.log('Saving agent:', editingAgent);
    setShowEditModal(false);
    setEditingAgent({});
    onAgentStatusChange();
  };

  const handleStatusToggle = (agent: CallAgent) => {
    const newStatus = agent.status === 'available' ? 'offline' : 'available';
    // In a real implementation, this would call an API
    console.log('Toggling status for agent:', agent.id, 'to', newStatus);
    onAgentStatusChange();
  };

  const availableAgents = agents.filter(agent => agent.status === 'available');
  const busyAgents = agents.filter(agent => agent.status === 'busy');
  const offlineAgents = agents.filter(agent => agent.status === 'offline');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-heading font-bold text-white">
            Call Agents
          </h2>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-green-400">
              {availableAgents.length} Available
            </span>
            <span className="text-amber-400">
              {busyAgents.length} Busy
            </span>
            <span className="text-red-400">
              {offlineAgents.length} Offline
            </span>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowEditModal(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Agent</span>
        </motion.button>
      </div>

      {/* Agent Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{availableAgents.length}</h3>
              <p className="text-green-400">Available Agents</p>
            </div>
          </div>
        </div>
        
        <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{busyAgents.length}</h3>
              <p className="text-amber-400">Busy Agents</p>
            </div>
          </div>
        </div>
        
        <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <PowerOff className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{offlineAgents.length}</h3>
              <p className="text-red-400">Offline Agents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const StatusIcon = getStatusIcon(agent.status);
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "bg-dark-800 rounded-lg border border-dark-700 p-6 cursor-pointer transition-all duration-200",
                selectedAgent?.id === agent.id && "border-primary-500 bg-primary-500/10"
              )}
              onClick={() => setSelectedAgent(agent)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{agent.name}</h3>
                    <p className="text-sm text-dark-400">{agent.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAgent(agent);
                    }}
                    className="p-1 text-dark-400 hover:text-white transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusToggle(agent);
                    }}
                    className={cn(
                      "p-1 transition-colors",
                      agent.status === 'available' 
                        ? "text-green-400 hover:text-green-300" 
                        : "text-red-400 hover:text-red-300"
                    )}
                  >
                    {agent.status === 'available' ? (
                      <Power className="w-4 h-4" />
                    ) : (
                      <PowerOff className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    getTypeColor(agent.type)
                  )}>
                    {agent.type.replace('-', ' ')}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <StatusIcon className="w-4 h-4 text-dark-400" />
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getStatusColor(agent.status)
                    )}>
                      {agent.status}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-dark-300">
                  {agent.description}
                </p>
                
                <div className="flex items-center space-x-2 text-xs text-dark-400">
                  <FileText className="w-3 h-3" />
                  <span>{agent.scripted_flows.length} scripted flows</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Agent Details Panel */}
      {selectedAgent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-800 rounded-lg border border-dark-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Agent Details</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedAgent(null)}
              className="text-dark-400 hover:text-white transition-colors"
            >
              ×
            </motion.button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-dark-300">Name</label>
                <p className="text-white">{selectedAgent.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-dark-300">Type</label>
                <p className="text-white capitalize">{selectedAgent.type.replace('-', ' ')}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-dark-300">Status</label>
                <p className="text-white capitalize">{selectedAgent.status}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-dark-300">Created</label>
                <p className="text-white">
                  {new Date(selectedAgent.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-dark-300">Description</label>
                <p className="text-white">{selectedAgent.description}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-dark-300">Scripted Flows</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedAgent.scripted_flows.map((flow, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-dark-700 text-dark-300 rounded text-sm"
                    >
                      {flow}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Edit Agent Modal */}
      {showEditModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-dark-900/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-800 rounded-lg border border-dark-700 p-6 max-w-2xl w-full"
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingAgent.id ? 'Edit Agent' : 'Add New Agent'}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingAgent.name || ''}
                    onChange={(e) => setEditingAgent(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter agent name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1">
                    Type
                  </label>
                  <select
                    value={editingAgent.type || ''}
                    onChange={(e) => setEditingAgent(prev => ({ ...prev, type: e.target.value as CallAgent['type'] }))}
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    <option value="primary">Primary</option>
                    <option value="breakdown">Breakdown</option>
                    <option value="job-application">Job Application</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  Description
                </label>
                <textarea
                  value={editingAgent.description || ''}
                  onChange={(e) => setEditingAgent(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter agent description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">
                  Scripted Flows (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingAgent.scripted_flows?.join(', ') || ''}
                  onChange={(e) => setEditingAgent(prev => ({ 
                    ...prev, 
                    scripted_flows: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                  }))}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., caller-identification, intent-detection, routing"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveAgent}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {editingAgent.id ? 'Save Changes' : 'Create Agent'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingAgent({});
                  }}
                  className="flex-1 bg-dark-600 text-dark-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CallAgentsView; 