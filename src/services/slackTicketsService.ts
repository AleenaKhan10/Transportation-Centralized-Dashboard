import axios from 'axios';
import { SlackTicket, SlackTicketsResponse, SlackTicketsFilter } from '../types';

// For production, use /api which will be redirected to Netlify functions
// For development, use localhost backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:3002/api');

export class SlackTicketsService {
  /**
   * Fetch slack tickets with optional filtering and pagination
   */
  static async getSlackTickets(
    filter: SlackTicketsFilter = {},
    page: number = 1,
    limit: number = 50
  ): Promise<SlackTicketsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(filter).filter(([_, value]) => value !== undefined && value !== '')
      )
    });

    const url = `${API_BASE_URL}/slack-tickets?${params}`;
    
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching slack tickets:', error);
      throw new Error('Failed to fetch slack tickets from database. Please check your database connection.');
    }
  }

  /**
   * Get a single slack ticket by ID
   */
  static async getSlackTicketById(id: number): Promise<SlackTicket> {
    try {
      const response = await axios.get(`${API_BASE_URL}/slack-tickets/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching slack ticket:', error);
      throw new Error('Failed to fetch slack ticket from database.');
    }
  }

  /**
   * Get slack tickets by thread timestamp
   */
  static async getSlackTicketsByThread(threadTs: string): Promise<SlackTicket[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/slack-tickets/thread/${threadTs}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching thread tickets:', error);
      throw new Error('Failed to fetch thread tickets from database.');
    }
  }

  /**
   * Get unique channel names for filtering
   */
  static async getChannelNames(): Promise<string[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/slack-tickets/channels`);
      return response.data;
    } catch (error) {
      console.error('Error fetching channel names:', error);
      throw new Error('Failed to fetch channel names from database.');
    }
  }

  /**
   * Get analytics data for slack tickets
   */
  static async getAnalytics(): Promise<{
    totalTickets: number;
    avgConfidenceScore: number;
    mentionsCount: number;
    channelStats: Array<{ channel_name: string; count: number }>;
    dailyStats: Array<{ date: string; count: number }>;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/slack-tickets/analytics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw new Error('Failed to fetch analytics from database.');
    }
  }

  /**
   * Create a new slack ticket
   */
  static async createSlackTicket(
    ticketData: Omit<SlackTicket, 'id' | 'created_at' | 'updated_at'>
  ): Promise<SlackTicket> {
    try {
      const response = await axios.post(`${API_BASE_URL}/slack-tickets`, ticketData);
      return response.data;
    } catch (error) {
      console.error('Error creating slack ticket:', error);
      throw new Error('Failed to create slack ticket');
    }
  }

  /**
   * Update a slack ticket
   */
  static async updateSlackTicket(
    id: number,
    updates: Partial<SlackTicket>
  ): Promise<SlackTicket> {
    try {
      const response = await axios.put(`${API_BASE_URL}/slack-tickets/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating slack ticket:', error);
      throw new Error('Failed to update slack ticket');
    }
  }

  /**
   * Delete a slack ticket
   */
  static async deleteSlackTicket(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/slack-tickets/${id}`);
    } catch (error) {
      console.error('Error deleting slack ticket:', error);
      throw new Error('Failed to delete slack ticket');
    }
  }

  /**
   * Export slack tickets to CSV
   */
  static async exportToCSV(filter: SlackTicketsFilter = {}): Promise<Blob> {
    try {
      const params = new URLSearchParams(
        Object.fromEntries(
          Object.entries(filter).filter(([_, value]) => value !== undefined && value !== '')
        )
      );

      const response = await axios.get(`${API_BASE_URL}/slack-tickets/export?${params}`, {
        responseType: 'blob'
      });
      
      return response.data;
    } catch (error) {
      console.error('Error exporting slack tickets:', error);
      throw new Error('Failed to export slack tickets');
    }
  }

  /**
   * Search slack tickets by text
   */
  static async searchTickets(
    query: string,
    page: number = 1,
    limit: number = 50
  ): Promise<SlackTicketsResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/slack-tickets/search`, {
        params: { q: query, page, limit }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error searching slack tickets:', error);
      throw new Error('Failed to search slack tickets');
    }
  }
}

// For backward compatibility and easier imports
export const {
  getSlackTickets,
  getSlackTicketById,
  getSlackTicketsByThread,
  getChannelNames,
  getAnalytics,
  createSlackTicket,
  updateSlackTicket,
  deleteSlackTicket,
  exportToCSV,
  searchTickets,
} = SlackTicketsService;

export default SlackTicketsService; 