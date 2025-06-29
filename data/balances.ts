// Shared mock balances and currencies for the app

export const currencies = [
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "https://flagcdn.com/w40/my.png" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "https://flagcdn.com/w40/kr.png" },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "https://flagcdn.com/w40/us.png" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "https://flagcdn.com/w40/au.png" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "https://flagcdn.com/w40/gb.png" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "https://flagcdn.com/w40/jp.png" }
];

export const mockBalances: Record<string, number> = {
  "MYR": 5000,
  "KRW": 5000000,
  "USD": 1200,
  "AUD": 800,
  "GBP": 400,
  "JPY": 100000
}; 