"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.testScenarios = void 0;
exports.startInteractiveExchange = startInteractiveExchange;
exports.runAllTests = runAllTests;
exports.testScenario = testScenario;
exports.showOrderBook = showOrderBook;
const matchingEngine_1 = require("../model/matchingEngine");
const readline = __importStar(require("readline"));
// Test scenarios
exports.testScenarios = [
    {
        name: "Direct MYR → KRW Match",
        description: "User wants to exchange MYR to KRW, finds direct match with KRW → MYR order",
        inputOrder: {
            id: "test_001",
            userId: "user_a",
            fromCurrency: "MYR",
            toCurrency: "KRW",
            amount: 1000,
            rate: 300,
            minRate: 295,
            timestamp: Date.now(),
            status: "open",
            balanceLocked: false
        },
        expectedMatches: 2, // Should find 2 direct matches
        expectedBestRate: 310
    },
    {
        name: "Multi-hop MYR → USD → KRW",
        description: "User wants MYR to KRW, finds path through USD",
        inputOrder: {
            id: "test_002",
            userId: "user_a",
            fromCurrency: "MYR",
            toCurrency: "KRW",
            amount: 500,
            rate: 280,
            minRate: 270,
            timestamp: Date.now(),
            status: "open",
            balanceLocked: false
        },
        expectedMatches: 4, // Direct + multi-hop matches
        expectedBestRate: 283.5 // 0.21 * 1350
    },
    {
        name: "KRW → MYR with High Rate",
        description: "User wants KRW to MYR with competitive rate",
        inputOrder: {
            id: "test_003",
            userId: "user_i",
            fromCurrency: "KRW",
            toCurrency: "MYR",
            amount: 200000,
            rate: 320,
            minRate: 315,
            timestamp: Date.now(),
            status: "open",
            balanceLocked: false
        },
        expectedMatches: 1, // Should find 1 direct match
        expectedBestRate: 320
    }
];
// Available currencies
const availableCurrencies = [
    { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾" },
    { code: "KRW", name: "South Korean Won", flag: "🇰🇷" },
    { code: "USD", name: "US Dollar", flag: "🇺🇸" },
    { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
    { code: "GBP", name: "British Pound", flag: "🇬🇧" },
    { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
    { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" }
];
// Interactive P2P Exchange Interface
async function startInteractiveExchange() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    console.log("\n🚀 P2P Currency Exchange Interface");
    console.log("=".repeat(50));
    try {
        // Show available currencies
        console.log("\n📋 Available Currencies:");
        availableCurrencies.forEach((currency, index) => {
            console.log(`   ${index + 1}. ${currency.flag} ${currency.code} - ${currency.name}`);
        });
        // Get user input
        const fromCurrency = await askQuestion(rl, "\n💱 What currency do you want to exchange FROM? (Enter code, e.g., MYR): ");
        const toCurrency = await askQuestion(rl, "💱 What currency do you want to exchange TO? (Enter code, e.g., KRW): ");
        const amountStr = await askQuestion(rl, "💰 How much do you want to exchange? (Enter amount): ");
        const rateStr = await askQuestion(rl, "📈 What exchange rate do you want? (Enter rate, e.g., 0.7 for 1 CNY = 0.7 MYR): ");
        const minRateStr = await askQuestion(rl, "📉 Minimum acceptable rate? (Enter rate or press Enter for no minimum): ");
        const userId = await askQuestion(rl, "👤 Enter your user ID: ");
        // Validate inputs
        const amount = parseFloat(amountStr);
        const rate = parseFloat(rateStr);
        const minRate = minRateStr ? parseFloat(minRateStr) : undefined;
        if (isNaN(amount) || isNaN(rate) || amount <= 0 || rate <= 0) {
            console.log("❌ Invalid amount or rate. Please enter valid numbers.");
            return;
        }
        if (fromCurrency === toCurrency) {
            console.log("❌ Cannot exchange the same currency.");
            return;
        }
        // Create order
        const order = {
            id: `order_${Date.now()}`,
            userId: userId,
            fromCurrency: fromCurrency.toUpperCase(),
            toCurrency: toCurrency.toUpperCase(),
            amount: amount,
            rate: rate,
            minRate: minRate,
            timestamp: Date.now(),
            status: "open",
            balanceLocked: false
        };
        // Show order summary
        console.log("\n📋 Your Exchange Order:");
        console.log(`   From: ${amount.toLocaleString()} ${fromCurrency.toUpperCase()}`);
        console.log(`   To: ${toCurrency.toUpperCase()}`);
        console.log(`   Rate: 1 ${fromCurrency.toUpperCase()} = ${rate} ${toCurrency.toUpperCase()}`);
        if (minRate) {
            console.log(`   Min Rate: ${minRate} ${toCurrency.toUpperCase()}`);
        }
        // Find matches
        console.log("\n🔍 Searching for P2P matches...");
        const matches = (0, matchingEngine_1.findBestMatch)(order);
        // Display results
        displayExchangeResults(matches, order);
        // Ask if user wants to proceed with exchange
        if (matches.length > 0) {
            const proceed = await askQuestion(rl, "\n🤝 Do you want to proceed with the best match? (y/n): ");
            if (proceed.toLowerCase() === 'y' || proceed.toLowerCase() === 'yes') {
                await processExchange(matches[0], order, rl);
            }
        }
        else {
            console.log("\n💡 No matches found. You can:");
            console.log("   1. Try a different rate");
            console.log("   2. Try a different amount");
            console.log("   3. Create your own order in the order book");
            console.log("   4. Make an offer to existing users");
            const choice = await askQuestion(rl, "\nWhat would you like to do? (1-4): ");
            switch (choice) {
                case "1":
                    console.log("🔄 Please restart and try a different rate.");
                    break;
                case "2":
                    console.log("🔄 Please restart and try a different amount.");
                    break;
                case "3":
                    await createOrderInBook(order, rl);
                    break;
                case "4":
                    await makeOfferToExistingUsers(order, rl);
                    break;
                default:
                    console.log("❌ Invalid choice.");
            }
        }
    }
    catch (error) {
        console.error("❌ Error during exchange:", error);
    }
    finally {
        rl.close();
    }
}
// Helper function to ask questions
function askQuestion(rl, question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}
// Display exchange results
function displayExchangeResults(matches, order) {
    console.log(`\n📊 Found ${matches.length} P2P match(es):`);
    if (matches.length === 0) {
        console.log("   ❌ No matches found for your requirements.");
        // Debug: Show what we're looking for
        console.log("\n🔍 Debug Info:");
        console.log(`   Looking for: ${order.fromCurrency} → ${order.toCurrency}`);
        console.log(`   Your rate: ${order.rate}`);
        console.log(`   Your amount: ${order.amount}`);
        // Debug: Show available orders for this pair
        const orderBook = (0, matchingEngine_1.loadOrderBook)();
        const relevantOrders = orderBook.filter((o) => (o.fromCurrency === order.fromCurrency && o.toCurrency === order.toCurrency) ||
            (o.fromCurrency === order.toCurrency && o.toCurrency === order.fromCurrency));
        console.log(`   Relevant orders in book: ${relevantOrders.length}`);
        relevantOrders.forEach((o, i) => {
            console.log(`     ${i + 1}. ${o.userId}: ${o.amount} ${o.fromCurrency} → ${o.toCurrency} @ ${o.rate} (${o.status})`);
        });
        return;
    }
    matches.forEach((match, index) => {
        console.log(`\n   ${index + 1}. Match #${index + 1}:`);
        console.log(`      💰 Exchange Amount: ${match.liquidity.toLocaleString()} ${order.fromCurrency}`);
        console.log(`      📈 Rate: ${match.totalRate.toFixed(2)} ${order.toCurrency} per ${order.fromCurrency}`);
        console.log(`      💵 You'll Receive: ${(match.liquidity * match.totalRate).toLocaleString()} ${order.toCurrency}`);
        console.log(`      ⭐ Score: ${match.score.toFixed(3)}`);
        console.log(`      ⏱️  Estimated Time: ${match.estimatedTime} step(s)`);
        // Show detailed breakdown
        console.log(`      📊 Exchange Breakdown:`);
        match.path.forEach((pathOrder, pathIndex) => {
            if (pathIndex === 0) {
                console.log(`         ${pathIndex + 1}. [YOUR ORDER] ${pathOrder.userId}: ${pathOrder.amount} ${pathOrder.fromCurrency} → ${pathOrder.toCurrency} @ ${pathOrder.rate}`);
            }
            else {
                const isDirectMatch = pathOrder.fromCurrency === order.fromCurrency && pathOrder.toCurrency === order.toCurrency;
                const isReverseMatch = pathOrder.fromCurrency === order.toCurrency && pathOrder.toCurrency === order.fromCurrency;
                if (isDirectMatch) {
                    console.log(`         ${pathIndex + 1}. [DIRECT MATCH] ${pathOrder.userId}: ${pathOrder.amount} ${pathOrder.fromCurrency} → ${pathOrder.toCurrency} @ ${pathOrder.rate}`);
                }
                else if (isReverseMatch) {
                    console.log(`         ${pathIndex + 1}. [REVERSE MATCH] ${pathOrder.userId}: ${pathOrder.amount} ${pathOrder.fromCurrency} → ${pathOrder.toCurrency} @ ${pathOrder.rate}`);
                }
                else {
                    console.log(`         ${pathIndex + 1}. [BRIDGE] ${pathOrder.userId}: ${pathOrder.amount} ${pathOrder.fromCurrency} → ${pathOrder.toCurrency} @ ${pathOrder.rate}`);
                }
            }
        });
        // Show savings vs traditional exchange
        const traditionalRate = 0.65; // Example traditional rate for CNY→MYR
        const traditionalAmount = match.liquidity * traditionalRate;
        const p2pAmount = match.liquidity * match.totalRate;
        const savings = p2pAmount - traditionalAmount;
        if (savings > 0) {
            console.log(`      💰 Savings vs Traditional Exchange: +${savings.toFixed(2)} ${order.toCurrency}`);
            console.log(`      📈 Better Rate: ${((match.totalRate / traditionalRate - 1) * 100).toFixed(1)}% improvement`);
        }
        // Show what each party receives
        console.log(`      🤝 What Each Party Receives:`);
        console.log(`         You: ${match.liquidity.toLocaleString()} ${order.fromCurrency} → ${(match.liquidity * match.totalRate).toLocaleString()} ${order.toCurrency}`);
        match.path.forEach((pathOrder, pathIndex) => {
            if (pathIndex > 0) {
                const isDirectMatch = pathOrder.fromCurrency === order.fromCurrency && pathOrder.toCurrency === order.toCurrency;
                if (isDirectMatch) {
                    console.log(`         ${pathOrder.userId}: ${match.liquidity.toLocaleString()} ${order.fromCurrency} → ${(match.liquidity * match.totalRate).toLocaleString()} ${order.toCurrency}`);
                }
                else {
                    console.log(`         ${pathOrder.userId}: ${pathOrder.amount} ${pathOrder.fromCurrency} → ${(pathOrder.amount * pathOrder.rate).toLocaleString()} ${pathOrder.toCurrency}`);
                }
            }
        });
    });
}
// Process the exchange
async function processExchange(bestMatch, order, rl) {
    console.log("\n🔄 Processing P2P Exchange...");
    try {
        // Lock balances (escrow)
        const balanceLocked = matchingEngine_1.matchingEngine.lockBalances(bestMatch);
        if (!balanceLocked) {
            console.log("❌ Failed to lock balances. Exchange cancelled.");
            return;
        }
        console.log("✅ Balances locked in escrow");
        // Update order statuses
        bestMatch.path.forEach((pathOrder) => {
            if (pathOrder.id !== order.id) {
                matchingEngine_1.matchingEngine.updateOrderStatus(pathOrder.id, 'matched');
            }
        });
        // Add user's order to order book if not fully matched
        if (bestMatch.liquidity < order.amount) {
            const remainingOrder = {
                ...order,
                id: `order_${Date.now()}_remaining`,
                amount: order.amount - bestMatch.liquidity
            };
            matchingEngine_1.matchingEngine.addOrder(remainingOrder);
            console.log(`📝 Remaining ${remainingOrder.amount} ${order.fromCurrency} added to order book`);
        }
        console.log("\n🎉 Exchange Completed Successfully!");
        console.log(`   💰 Exchanged: ${bestMatch.liquidity.toLocaleString()} ${order.fromCurrency}`);
        console.log(`   💵 Received: ${(bestMatch.liquidity * bestMatch.totalRate).toLocaleString()} ${order.toCurrency}`);
        console.log(`   📈 Rate: ${bestMatch.totalRate.toFixed(2)} ${order.toCurrency} per ${order.fromCurrency}`);
        // Show updated order book
        const confirm = await askQuestion(rl, "\n📚 Show updated order book? (y/n): ");
        if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
            showOrderBook();
        }
    }
    catch (error) {
        console.error("❌ Error processing exchange:", error);
    }
}
// Create order in the order book
async function createOrderInBook(order, rl) {
    console.log("\n📝 Creating your order in the order book...");
    try {
        matchingEngine_1.matchingEngine.addOrder(order);
        console.log("✅ Your order has been added to the order book!");
        console.log(`   📋 Order ID: ${order.id}`);
        console.log(`   💰 Amount: ${order.amount.toLocaleString()} ${order.fromCurrency}`);
        console.log(`   📈 Rate: ${order.rate} ${order.toCurrency} per ${order.fromCurrency}`);
        console.log(`   👤 User: ${order.userId}`);
        const showBook = await askQuestion(rl, "\n📚 Show updated order book? (y/n): ");
        if (showBook.toLowerCase() === 'y' || showBook.toLowerCase() === 'yes') {
            showOrderBook();
        }
    }
    catch (error) {
        console.error("❌ Error creating order:", error);
    }
}
// Make offer to existing users
async function makeOfferToExistingUsers(order, rl) {
    console.log("\n🤝 Making offers to existing users...");
    const orderBook = (0, matchingEngine_1.loadOrderBook)();
    const relevantOrders = orderBook.filter((o) => (o.fromCurrency === order.fromCurrency && o.toCurrency === order.toCurrency) ||
        (o.fromCurrency === order.toCurrency && o.toCurrency === order.fromCurrency));
    if (relevantOrders.length === 0) {
        console.log("❌ No relevant orders found to make offers to.");
        return;
    }
    console.log("\n📋 Available users to make offers to:");
    relevantOrders.forEach((o, i) => {
        const isDirectMatch = o.fromCurrency === order.fromCurrency && o.toCurrency === order.toCurrency;
        const isReverseMatch = o.fromCurrency === order.toCurrency && o.toCurrency === order.fromCurrency;
        if (isDirectMatch) {
            console.log(`   ${i + 1}. ${o.userId}: ${o.amount} ${o.fromCurrency} → ${o.toCurrency} @ ${o.rate} (Direct match)`);
        }
        else if (isReverseMatch) {
            console.log(`   ${i + 1}. ${o.userId}: ${o.amount} ${o.fromCurrency} → ${o.toCurrency} @ ${o.rate} (Reverse match)`);
        }
    });
    const choice = await askQuestion(rl, "\nSelect user to make offer to (1-" + relevantOrders.length + "): ");
    const selectedIndex = parseInt(choice) - 1;
    if (selectedIndex < 0 || selectedIndex >= relevantOrders.length) {
        console.log("❌ Invalid selection.");
        return;
    }
    const selectedOrder = relevantOrders[selectedIndex];
    const isDirectMatch = selectedOrder.fromCurrency === order.fromCurrency && selectedOrder.toCurrency === order.toCurrency;
    const isReverseMatch = selectedOrder.fromCurrency === order.toCurrency && selectedOrder.toCurrency === order.fromCurrency;
    console.log(`\n📝 Making offer to ${selectedOrder.userId}:`);
    console.log(`   Their order: ${selectedOrder.amount} ${selectedOrder.fromCurrency} → ${selectedOrder.toCurrency} @ ${selectedOrder.rate}`);
    console.log(`   Your offer: ${order.amount} ${order.fromCurrency} → ${order.toCurrency} @ ${order.rate}`);
    // Calculate exchange details
    if (isDirectMatch) {
        // Direct match: both want same direction
        const liquidity = Math.min(order.amount, selectedOrder.amount);
        const yourRate = order.rate;
        const theirRate = selectedOrder.rate;
        const betterRate = Math.max(yourRate, theirRate);
        console.log(`\n💰 Exchange Details (Direct Match):`);
        console.log(`   💱 Exchange Amount: ${liquidity.toLocaleString()} ${order.fromCurrency}`);
        console.log(`   📈 Agreed Rate: ${betterRate} ${order.toCurrency} per ${order.fromCurrency}`);
        console.log(`   💵 You'll Receive: ${(liquidity * betterRate).toLocaleString()} ${order.toCurrency}`);
        console.log(`   💵 They'll Receive: ${liquidity.toLocaleString()} ${order.fromCurrency}`);
        // Show benefits
        if (yourRate > theirRate) {
            console.log(`   🎉 You get a better rate! (Your rate: ${yourRate} vs Their rate: ${theirRate})`);
        }
        else if (theirRate > yourRate) {
            console.log(`   🎉 They get a better rate! (Your rate: ${yourRate} vs Their rate: ${theirRate})`);
        }
        else {
            console.log(`   ✅ Equal rates - fair exchange!`);
        }
    }
    else if (isReverseMatch) {
        // Reverse match: complementary directions
        const liquidity = Math.min(order.amount, selectedOrder.amount);
        const yourReceive = liquidity * order.rate;
        const theirReceive = liquidity * selectedOrder.rate;
        console.log(`\n💰 Exchange Details (Reverse Match):`);
        console.log(`   💱 Exchange Amount: ${liquidity.toLocaleString()} ${order.fromCurrency}`);
        console.log(`   💵 You'll Receive: ${yourReceive.toLocaleString()} ${order.toCurrency}`);
        console.log(`   💵 They'll Receive: ${theirReceive.toLocaleString()} ${selectedOrder.toCurrency}`);
        console.log(`   ✅ Both parties get what they want!`);
    }
    // Show savings vs traditional exchange
    const traditionalRate = 0.65; // Example traditional rate
    const traditionalAmount = order.amount * traditionalRate;
    const p2pAmount = order.amount * order.rate;
    const savings = p2pAmount - traditionalAmount;
    if (savings > 0) {
        console.log(`   💰 Savings vs Traditional Exchange: +${savings.toFixed(2)} ${order.toCurrency}`);
    }
    const confirm = await askQuestion(rl, "\n🤝 Send this offer? (y/n): ");
    if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
        console.log("📤 Offer sent! The user will be notified.");
        console.log("💡 Note: This is a demo - in a real system, the user would receive a notification.");
        // Show what happens next
        console.log("\n📋 What happens next:");
        console.log("   1. User receives your offer notification");
        console.log("   2. They can accept, reject, or counter-offer");
        console.log("   3. If accepted, funds are locked in escrow");
        console.log("   4. Exchange is processed automatically");
        console.log("   5. Both parties receive their currencies");
    }
    else {
        console.log("❌ Offer cancelled.");
    }
}
// Run all test scenarios
function runAllTests() {
    console.log("🧪 Running Matching Engine Tests\n");
    exports.testScenarios.forEach((scenario, index) => {
        console.log(`\n${index + 1}. ${scenario.name}`);
        console.log(`   ${scenario.description}`);
        const matches = (0, matchingEngine_1.findBestMatch)(scenario.inputOrder);
        console.log(`   📊 Results:`);
        console.log(`      - Found ${matches.length} matches (expected: ${scenario.expectedMatches})`);
        if (matches.length > 0) {
            const bestMatch = matches[0];
            console.log(`      - Best rate: ${bestMatch.totalRate.toFixed(2)} (expected: ~${scenario.expectedBestRate})`);
            console.log(`      - Liquidity: ${bestMatch.liquidity.toLocaleString()}`);
            console.log(`      - Score: ${bestMatch.score.toFixed(3)}`);
            console.log(`      - Path: ${bestMatch.path.map(order => `${order.fromCurrency}→${order.toCurrency}`).join(' → ')}`);
            console.log(`      - Estimated time: ${bestMatch.estimatedTime} steps`);
        }
        else {
            console.log(`      - ❌ No matches found`);
        }
        // Validation
        const rateMatch = matches.length > 0 &&
            Math.abs(matches[0].totalRate - scenario.expectedBestRate) < 5;
        const countMatch = matches.length === scenario.expectedMatches;
        console.log(`   ${rateMatch && countMatch ? '✅ PASS' : '❌ FAIL'}`);
    });
}
// Test specific scenario
function testScenario(scenarioIndex) {
    if (scenarioIndex >= exports.testScenarios.length) {
        console.log("❌ Invalid scenario index");
        return;
    }
    const scenario = exports.testScenarios[scenarioIndex];
    console.log(`\n🧪 Testing: ${scenario.name}`);
    console.log(`   ${scenario.description}\n`);
    const matches = (0, matchingEngine_1.findBestMatch)(scenario.inputOrder);
    console.log("📋 Input Order:");
    console.log(`   ${scenario.inputOrder.fromCurrency} → ${scenario.inputOrder.toCurrency}`);
    console.log(`   Amount: ${scenario.inputOrder.amount.toLocaleString()}`);
    console.log(`   Rate: ${scenario.inputOrder.rate}`);
    console.log(`   Min Rate: ${scenario.inputOrder.minRate}\n`);
    console.log("📊 Matches Found:");
    matches.forEach((match, index) => {
        console.log(`\n   ${index + 1}. Match #${index + 1}:`);
        console.log(`      Rate: ${match.totalRate.toFixed(2)}`);
        console.log(`      Liquidity: ${match.liquidity.toLocaleString()}`);
        console.log(`      Score: ${match.score.toFixed(3)}`);
        console.log(`      Path: ${match.path.map(order => `${order.fromCurrency}→${order.toCurrency}`).join(' → ')}`);
        console.log(`      Steps: ${match.estimatedTime}`);
        console.log(`      Orders in path:`);
        match.path.forEach((order, orderIndex) => {
            if (orderIndex === 0) {
                console.log(`         ${orderIndex + 1}. [NEW] ${order.userId}: ${order.amount} ${order.fromCurrency} → ${order.toCurrency} @ ${order.rate}`);
            }
            else {
                console.log(`         ${orderIndex + 1}. [EXISTING] ${order.userId}: ${order.amount} ${order.fromCurrency} → ${order.toCurrency} @ ${order.rate}`);
            }
        });
    });
    if (matches.length === 0) {
        console.log("   ❌ No matches found");
    }
}
// Show current order book
function showOrderBook() {
    console.log("\n📚 Current Order Book:");
    const orderBook = (0, matchingEngine_1.loadOrderBook)();
    if (orderBook.length === 0) {
        console.log("   No open orders");
        return;
    }
    orderBook.forEach((order, index) => {
        console.log(`   ${index + 1}. ${order.userId}: ${order.amount.toLocaleString()} ${order.fromCurrency} → ${order.toCurrency} @ ${order.rate} (${order.status})`);
    });
}
// Example usage
if (typeof window === 'undefined') {
    // Only run in Node.js environment
    console.log("🚀 P2P Currency Exchange Matching Engine Demo\n");
    // Check command line arguments
    const args = process.argv.slice(2);
    if (args.includes('--interactive') || args.includes('-i')) {
        // Start interactive exchange
        startInteractiveExchange();
    }
    else if (args.includes('--test') || args.includes('-t')) {
        // Run automated tests
        showOrderBook();
        runAllTests();
        console.log("\n" + "=".repeat(60));
        console.log("📝 Detailed Test Results:");
        testScenario(0); // Test direct match
    }
    else {
        // Default: show menu
        console.log("Choose an option:");
        console.log("1. Run automated tests (--test or -t)");
        console.log("2. Start interactive P2P exchange (--interactive or -i)");
        console.log("\nExample: node dist/utils/testMatching.js --interactive");
    }
}
