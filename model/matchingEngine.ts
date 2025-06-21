import fs from 'fs';
import path from 'path';

// Types and Interfaces
export interface Order {
  id: string;
  userId: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  rate: number;
  minRate?: number;
  maxRate?: number;
  timestamp: number;
  status: 'open' | 'matched' | 'cancelled' | 'completed';
  balanceLocked: boolean;
}

export interface Match {
  path: Order[];
  totalRate: number;
  liquidity: number;
  score: number;
  estimatedTime: number;
}

export interface OrderBook {
  orders: Order[];
  lastUpdate: number;
}

export interface UserBalance {
  userId: string;
  currency: string;
  available: number;
  locked: number;
}

const ORDER_BOOK_PATH = path.join(process.cwd(), 'data', 'orderBook.json');

// Sample User Balances
const sampleBalances: UserBalance[] = [
  { userId: "user_b", currency: "KRW", available: 500000, locked: 0 },
  { userId: "user_c", currency: "KRW", available: 200000, locked: 0 },
  { userId: "user_d", currency: "MYR", available: 2000, locked: 0 },
  { userId: "user_e", currency: "MYR", available: 3000, locked: 0 },
  { userId: "user_f", currency: "USD", available: 500, locked: 0 },
  { userId: "user_g", currency: "MYR", available: 1500, locked: 0 },
  { userId: "user_h", currency: "AUD", available: 400, locked: 0 }
];

// Matching Engine Class
export class MatchingEngine {
  private orderBook: Order[] = [];
  private userBalances: Map<string, Map<string, UserBalance>> = new Map();
  
  constructor() {
    this.loadOrderBookFromFile();
    this.loadSampleBalances();
  }
  
  private loadOrderBookFromFile() {
    try {
      if (fs.existsSync(ORDER_BOOK_PATH)) {
        const data = fs.readFileSync(ORDER_BOOK_PATH, 'utf-8');
        this.orderBook = JSON.parse(data);
      } else {
        this.orderBook = [];
      }
    } catch (err) {
      console.error('Failed to load order book:', err);
      this.orderBook = [];
    }
  }
  
  private saveOrderBookToFile() {
    try {
      fs.writeFileSync(ORDER_BOOK_PATH, JSON.stringify(this.orderBook, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save order book:', err);
    }
  }
  
  private loadSampleBalances() {
    sampleBalances.forEach(balance => {
      if (!this.userBalances.has(balance.userId)) {
        this.userBalances.set(balance.userId, new Map());
      }
      this.userBalances.get(balance.userId)!.set(balance.currency, balance);
    });
  }
  
  // Find best matches for a new order
  public findBestMatches(newOrder: Order): Match[] {
    const matches: Match[] = [];
    
    // 1. Find direct matches
    const directMatches = this.findDirectMatches(newOrder);
    matches.push(...directMatches);
    
    // 2. Find multi-hop paths (up to 2 hops)
    const multiHopMatches = this.findMultiHopMatches(newOrder);
    matches.push(...multiHopMatches);
    
    // 3. Sort by score (rate, liquidity, time)
    return matches.sort((a, b) => b.score - a.score);
  }
  
  // Find direct currency pair matches
  private findDirectMatches(newOrder: Order): Match[] {
    const matches: Match[] = [];
    
    for (const order of this.orderBook) {
      if (order.status !== 'open' || order.userId === newOrder.userId) continue;
      
      // Check if orders are complementary (MYR→KRW vs KRW→MYR)
      if (order.fromCurrency === newOrder.toCurrency && 
          order.toCurrency === newOrder.fromCurrency) {
        
        // For direct matches, we need to check if the rates are compatible
        // New order wants MYR→KRW @ 300, existing order wants KRW→MYR @ 310
        // This means: 1 MYR = 300 KRW (new order rate)
        // And: 1 KRW = 1/310 MYR (existing order rate)
        // So: 1 MYR = 310 KRW (existing order rate)
        // These rates are compatible if they're within tolerance
        
        const newOrderRate = newOrder.rate; // MYR→KRW rate
        const existingOrderRate = 1 / order.rate; // Convert KRW→MYR to MYR→KRW
        
        // Check if rates are compatible (within 5% tolerance)
        const tolerance = 0.05;
        const rateDifference = Math.abs(newOrderRate - existingOrderRate) / Math.max(newOrderRate, existingOrderRate);
        
        if (rateDifference <= tolerance) {
          // Calculate liquidity based on equivalent amounts
          const orderAmountInNewOrderCurrency = order.amount * order.rate; // e.g., KRW amount * (MYR/KRW rate) = MYR amount
          const liquidity = Math.min(newOrder.amount, orderAmountInNewOrderCurrency);
          
          // Calculate the cost for the counter-party in their currency
          const counterPartyCost = liquidity / order.rate; // e.g., MYR liquidity / (MYR/KRW rate) = KRW cost

          // Check if users have sufficient balance
          if (this.hasSufficientBalance(newOrder.userId, newOrder.fromCurrency, liquidity) &&
              this.hasSufficientBalance(order.userId, order.fromCurrency, counterPartyCost)) {
            
            // Use the better rate for the match (for the user)
            const matchRate = Math.max(newOrderRate, existingOrderRate);
            
            const match: Match = {
              path: [newOrder, order],
              totalRate: matchRate,
              liquidity: liquidity,
              score: this.calculateScore(matchRate, liquidity, order.timestamp),
              estimatedTime: 1 // Direct match is fastest
            };
            
            matches.push(match);
          }
        }
      }
    }
    
    return matches;
  }
  
  // Find multi-hop paths (e.g., MYR → USD → KRW)
  private findMultiHopMatches(newOrder: Order): Match[] {
    const matches: Match[] = [];
    const maxHops = 2;
    
    // Build currency graph for pathfinding
    const graph = this.buildCurrencyGraph();
    
    // Find all possible paths
    const paths = this.findAllPaths(graph, newOrder.fromCurrency, newOrder.toCurrency, maxHops);
    
    for (const path of paths) {
      const pathMatches = this.findPathMatches(newOrder, path);
      matches.push(...pathMatches);
    }
    
    return matches;
  }
  
  // Build currency exchange graph from order book
  private buildCurrencyGraph(): Map<string, Set<string>> {
    const graph = new Map<string, Set<string>>();
    
    for (const order of this.orderBook) {
      if (order.status !== 'open') continue;
      
      if (!graph.has(order.fromCurrency)) {
        graph.set(order.fromCurrency, new Set());
      }
      if (!graph.has(order.toCurrency)) {
        graph.set(order.toCurrency, new Set());
      }
      
      graph.get(order.fromCurrency)!.add(order.toCurrency);
    }
    
    return graph;
  }
  
  // Find all possible paths between currencies using BFS
  private findAllPaths(graph: Map<string, Set<string>>, from: string, to: string, maxHops: number): string[][] {
    const paths: string[][] = [];
    const queue: { path: string[], hops: number }[] = [{ path: [from], hops: 0 }];
    
    while (queue.length > 0) {
      const { path, hops } = queue.shift()!;
      const current = path[path.length - 1];
      
      if (current === to && path.length > 1) {
        paths.push([...path]);
      }
      
      if (hops < maxHops) {
        const neighbors = graph.get(current) || new Set();
        for (const neighbor of neighbors) {
          if (!path.includes(neighbor)) {
            queue.push({ path: [...path, neighbor], hops: hops + 1 });
          }
        }
      }
    }
    
    return paths;
  }
  
  // Find matches for a specific path
  private findPathMatches(newOrder: Order, path: string[]): Match[] {
    const matches: Match[] = [];
    
    // Find orders that can fulfill this path
    const pathOrders: Order[][] = [];
    
    // For each hop in the path, find compatible orders (including reverse orders)
    for (let i = 0; i < path.length - 1; i++) {
      const fromCurrency = path[i];
      const toCurrency = path[i + 1];
      
      // Find orders that go in the right direction
      const forwardOrders = this.orderBook.filter(order => 
        order.status === 'open' &&
        order.fromCurrency === fromCurrency &&
        order.toCurrency === toCurrency &&
        order.userId !== newOrder.userId
      );
      
      // Find orders that go in the reverse direction (we'll use them in reverse)
      const reverseOrders = this.orderBook.filter(order => 
        order.status === 'open' &&
        order.fromCurrency === toCurrency &&
        order.toCurrency === fromCurrency &&
        order.userId !== newOrder.userId
      );
      
      // Combine both types of orders
      const hopOrders = [...forwardOrders, ...reverseOrders];
      
      if (hopOrders.length === 0) return []; // No orders for this hop
      pathOrders.push(hopOrders);
    }
    
    // Generate all combinations of orders for the path
    const combinations = this.generateOrderCombinations(pathOrders);
    
    for (const combination of combinations) {
      const match = this.evaluatePathMatch(newOrder, path, combination);
      if (match) {
        matches.push(match);
      }
    }
    
    return matches;
  }
  
  // Generate all possible combinations of orders for a path
  private generateOrderCombinations(pathOrders: Order[][]): Order[][] {
    if (pathOrders.length === 0) return [];
    if (pathOrders.length === 1) return pathOrders[0].map(order => [order]);
    
    const combinations: Order[][] = [];
    const firstHopOrders = pathOrders[0];
    const remainingCombinations = this.generateOrderCombinations(pathOrders.slice(1));
    
    for (const firstOrder of firstHopOrders) {
      for (const remaining of remainingCombinations) {
        combinations.push([firstOrder, ...remaining]);
      }
    }
    
    return combinations;
  }
  
  // Evaluate if a path combination creates a valid match
  private evaluatePathMatch(newOrder: Order, path: string[], orders: Order[]): Match | null {
    // Calculate effective rate through the path
    let effectiveRate = 1; // Start with 1
    let liquidity = newOrder.amount;
    
    // Check each hop
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const hopRate = order.rate;
      const fromCurrency = path[i];
      const toCurrency = path[i + 1];
      
      // Check if this order goes in the right direction or needs to be reversed
      let actualRate = hopRate;
      if (order.fromCurrency !== fromCurrency || order.toCurrency !== toCurrency) {
        // This is a reverse order, so we need to invert the rate
        actualRate = 1 / hopRate;
      }
      
      // Update effective rate
      effectiveRate = effectiveRate * actualRate;
      
      // Update liquidity (minimum of all orders in the path)
      liquidity = Math.min(liquidity, order.amount);
      
      // Check if user has sufficient balance
      if (!this.hasSufficientBalance(order.userId, order.fromCurrency, liquidity)) {
        return null;
      }
    }
    
    // Check if final rate meets minimum requirement
    if (newOrder.minRate && effectiveRate < newOrder.minRate) {
      return null;
    }
    
    // Calculate score
    const score = this.calculateScore(effectiveRate, liquidity, orders[0].timestamp);
    
    return {
      path: [newOrder, ...orders],
      totalRate: effectiveRate,
      liquidity: liquidity,
      score: score,
      estimatedTime: orders.length + 1 // More hops = more time
    };
  }
  
  // Check if user has sufficient balance
  private hasSufficientBalance(userId: string, currency: string, amount: number): boolean {
    const userBalance = this.userBalances.get(userId)?.get(currency);
    if (!userBalance) return false;
    
    return userBalance.available - userBalance.locked >= amount;
  }
  
  // Calculate match score (higher is better)
  private calculateScore(rate: number, liquidity: number, timestamp: number): number {
    const timeScore = Math.max(0, 1 - (Date.now() - timestamp) / (24 * 60 * 60 * 1000)); // Decay over 24h
    const liquidityScore = Math.min(1, liquidity / 10000); // Normalize to 10k max
    const rateScore = rate / 1000; // Normalize rate
    
    return (rateScore * 0.4) + (liquidityScore * 0.4) + (timeScore * 0.2);
  }
  
  // Lock balances for a match
  public lockBalances(match: Match): boolean {
    try {
      for (const order of match.path) {
        if (order.userId === match.path[0].userId) continue; // Skip the new order
        
        const userBalance = this.userBalances.get(order.userId)?.get(order.fromCurrency);
        if (!userBalance || userBalance.available - userBalance.locked < match.liquidity) {
          return false;
        }
        
        userBalance.locked += match.liquidity;
      }
      return true;
    } catch (error) {
      console.error('Error locking balances:', error);
      return false;
    }
  }
  
  // Get current order book
  public getOrderBook(): Order[] {
    return this.orderBook.filter(order => order.status === 'open');
  }
  
  // Add new order to order book
  public addOrder(order: Order): void {
    this.orderBook.push(order);
    this.saveOrderBookToFile();
  }
  
  // Update order status
  public updateOrderStatus(orderId: string, status: Order['status']): void {
    const order = this.orderBook.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      this.saveOrderBookToFile();
    }
  }
}

// Export singleton instance
export const matchingEngine = new MatchingEngine();

// Helper functions for API
export function findBestMatch(inputOrder: Order, orderBook?: Order[]): Match[] {
  if (orderBook) {
    // Use provided order book (for testing)
    const tempEngine = new MatchingEngine();
    tempEngine['orderBook'] = orderBook;
    return tempEngine.findBestMatches(inputOrder);
  }
  
  return matchingEngine.findBestMatches(inputOrder);
}

export function loadOrderBook(): Order[] {
  return matchingEngine.getOrderBook();
} 