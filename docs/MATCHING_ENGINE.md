# P2P Currency Exchange Matching Engine

## Overview

This matching engine implements a pathfinding algorithm for peer-to-peer currency exchange, allowing users to exchange currencies directly through internal wallet balances without external APIs.

## Core Features

- **Direct Matching**: Find immediate currency pair matches (MYR ↔ KRW)
- **Multi-hop Pathfinding**: Route through intermediate currencies (MYR → USD → KRW)
- **Rate Compatibility**: Ensure exchange rates are mutually acceptable
- **Liquidity Checking**: Verify sufficient user balances
- **Balance Locking**: Secure funds in escrow during exchange
- **Scoring System**: Rank matches by rate, liquidity, and time

## Architecture

### Data Structures

#### Order
```typescript
interface Order {
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
```

#### Match
```typescript
interface Match {
  path: Order[];
  totalRate: number;
  liquidity: number;
  score: number;
  estimatedTime: number;
}
```

#### UserBalance
```typescript
interface UserBalance {
  userId: string;
  currency: string;
  available: number;
  locked: number;
}
```

## Algorithm Details

### 1. Direct Matching Algorithm

**Purpose**: Find immediate currency pair matches

**Process**:
1. Search order book for complementary orders
2. Check rate compatibility (within 5% tolerance)
3. Calculate liquidity (minimum of both amounts)
4. Verify sufficient user balances
5. Score matches based on rate, liquidity, and time

**Example**:
```
New Order: User A wants MYR → KRW, 1000 MYR @ 300
Existing Order: User B wants KRW → MYR, 300,000 KRW @ 310
Result: Direct match with 1000 MYR liquidity
```

### 2. Multi-hop Pathfinding Algorithm

**Purpose**: Find routes through intermediate currencies

**Process**:
1. Build currency exchange graph from order book
2. Use BFS to find all possible paths (max 2 hops)
3. For each path, find compatible orders
4. Generate all order combinations
5. Evaluate effective rates and liquidity
6. Filter by minimum rate requirements

**Example**:
```
Path: MYR → USD → KRW
Orders: 
  - User E: MYR → USD @ 0.21
  - User F: USD → KRW @ 1350
Effective Rate: 0.21 × 1350 = 283.5 KRW per MYR
```

### 3. Scoring Algorithm

**Formula**:
```
Score = (RateScore × 0.4) + (LiquidityScore × 0.4) + (TimeScore × 0.2)

Where:
- RateScore = rate / 1000 (normalized)
- LiquidityScore = min(1, liquidity / 10000) (normalized to 10k max)
- TimeScore = max(0, 1 - age_in_hours / 24) (decay over 24h)
```

## Sample Order Book

```typescript
const sampleOrderBook = [
  // Direct MYR ↔ KRW orders
  {
    id: "order_001",
    userId: "user_b",
    fromCurrency: "KRW",
    toCurrency: "MYR",
    amount: 300000,
    rate: 310,
    timestamp: Date.now() - 300000,
    status: "open"
  },
  {
    id: "order_002", 
    userId: "user_c",
    fromCurrency: "KRW",
    toCurrency: "MYR", 
    amount: 150000,
    rate: 305,
    timestamp: Date.now() - 180000,
    status: "open"
  },
  
  // USD bridge orders
  {
    id: "order_004",
    userId: "user_e",
    fromCurrency: "MYR",
    toCurrency: "USD",
    amount: 1000,
    rate: 0.21,
    timestamp: Date.now() - 90000,
    status: "open"
  },
  {
    id: "order_005",
    userId: "user_f", 
    fromCurrency: "USD",
    toCurrency: "KRW",
    amount: 200,
    rate: 1350,
    timestamp: Date.now() - 60000,
    status: "open"
  }
];
```

## API Usage

### Find Matches

**Endpoint**: `POST /api/match`

**Request**:
```json
{
  "userId": "user_a",
  "fromCurrency": "MYR",
  "toCurrency": "KRW", 
  "amount": 1000,
  "rate": 300,
  "minRate": 295
}
```

**Response**:
```json
{
  "success": true,
  "inputOrder": { ... },
  "matches": [
    {
      "path": [order1, order2],
      "totalRate": 310,
      "liquidity": 1000,
      "score": 0.85,
      "estimatedTime": 1
    }
  ],
  "totalMatches": 2,
  "bestMatch": { ... }
}
```

### Get Order Book

**Endpoint**: `GET /api/match`

**Response**:
```json
{
  "success": true,
  "orderBook": [...],
  "totalOrders": 7
}
```

## Test Scenarios

### Scenario 1: Direct MYR → KRW Match
- **Input**: User wants 1000 MYR → KRW @ 300
- **Expected**: 2 direct matches found
- **Best Rate**: 310 KRW per MYR

### Scenario 2: Multi-hop MYR → USD → KRW
- **Input**: User wants 500 MYR → KRW @ 280
- **Expected**: 4 matches (direct + multi-hop)
- **Best Rate**: 283.5 KRW per MYR (via USD)

### Scenario 3: KRW → MYR with High Rate
- **Input**: User wants 200,000 KRW → MYR @ 320
- **Expected**: 1 direct match
- **Best Rate**: 320 MYR per KRW

## Running Tests

```bash
# Run all test scenarios
npm run test:matching

# Test specific scenario
node -e "require('./utils/testMatching').testScenario(0)"
```

## Key Constraints

1. **Internal Balances Only**: No external API calls for rates or balances
2. **User-Submitted Rates**: All exchange rates are provided by users
3. **Escrow Protection**: Balances are locked during exchange process
4. **Rate Tolerance**: 5% tolerance for rate compatibility
5. **Max Hops**: Limited to 2 hops for performance

## Performance Considerations

- **Time Complexity**: O(n²) for direct matches, O(n³) for multi-hop
- **Memory Usage**: Linear with order book size
- **Scalability**: Can handle thousands of concurrent orders
- **Caching**: Order book cached in memory for fast access

## Security Features

- **Balance Validation**: Verify sufficient funds before matching
- **Rate Validation**: Prevent manipulation through rate checks
- **User Isolation**: Users cannot match with themselves
- **Status Tracking**: Prevent double-matching of orders
- **Escrow Locking**: Secure funds during exchange process

## Future Enhancements

1. **Order Book Persistence**: Database storage for orders
2. **Real-time Updates**: WebSocket for live order book updates
3. **Advanced Routing**: Support for more complex multi-hop paths
4. **Rate Prediction**: ML-based rate forecasting
5. **Liquidity Pools**: Automated market making
6. **Risk Management**: Fraud detection and prevention 