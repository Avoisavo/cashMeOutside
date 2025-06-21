import { NextApiRequest, NextApiResponse } from 'next';
import { findBestMatch, loadOrderBook, Order, Match, matchingEngine } from '../../model/matchingEngine';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const inputOrder: Order = req.body;
      
      // Validate input order
      if (!inputOrder || !inputOrder.fromCurrency || !inputOrder.toCurrency || !inputOrder.amount || !inputOrder.rate) {
        return res.status(400).json({
          error: 'Invalid order data',
          required: ['fromCurrency', 'toCurrency', 'amount', 'rate', 'userId']
        });
      }
      
      // Add timestamp if not provided
      if (!inputOrder.timestamp) {
        inputOrder.timestamp = Date.now();
      }
      
      // Add status if not provided
      if (!inputOrder.status) {
        inputOrder.status = 'open';
      }
      
      // Find matches
      const matches = findBestMatch(inputOrder);
      
      // Return results
      res.status(200).json({
        success: true,
        inputOrder,
        matches,
        totalMatches: matches.length,
        bestMatch: matches.length > 0 ? matches[0] : null
      });
      
    } catch (error) {
      console.error('Error in match API:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === 'GET') {
    // Return current order book
    try {
      const orderBook = loadOrderBook();
      res.status(200).json({
        success: true,
        orderBook,
        totalOrders: orderBook.length
      });
    } catch (error) {
      console.error('Error loading order book:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 