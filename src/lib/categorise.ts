// Rules-only categorisation. Order matters: first match wins.
// User-saved rules are checked before these defaults, so anything here can be overridden.
// Personal rules (your own name for transfers between your accounts, etc.) are stored
// per user in the database, never in this file — the repo is public.

export const CATEGORIES = [
  'Rent',
  'Bills & Utilities',
  'Groceries',
  'Eating Out',
  'Fuel',
  'Travel & Transport',
  'Subscriptions',
  'Shopping',
  'Health & Fitness',
  'Entertainment',
  'Personal Care',
  'Charity',
  'Gifts',
  'Holidays',
  'Cash',
  'Loans & Finance',
  'Credit Card Payments',
  'Investments & Savings',
  'Business',
  'Income',
  'Transfers',
  'Miscellaneous',
] as const;

export type Category = (typeof CATEGORIES)[number];

// Money moving between your own pots — excluded from spending totals.
export const NON_SPENDING: Category[] = ['Credit Card Payments', 'Investments & Savings', 'Business', 'Transfers', 'Income'];

export interface Rule {
  pattern: string; // case-insensitive regex tested against "description details"
  category: Category;
  direction?: 'in' | 'out';
  minAmount?: number; // absolute £, inclusive
  maxAmount?: number; // absolute £, exclusive
  // Not sure: use `category` as the best guess but ask the user to confirm,
  // offering these options.
  confirm?: Category[];
}

export interface CategorisedTransaction {
  category: Category; // best guess, always set
  needsReview: boolean; // true = shown in the "Confirm" list until the user picks
  suggestions: Category[];
  matchedRule: string | null;
}

// Below this, an unrecognised payment isn't worth asking about.
export const SMALL_PAYMENT = 5;

export const DEFAULT_RULES: Rule[] = [
  // Bounced / returned payments and cash
  { pattern: '\\b(rejection|returned payment|payment may be automatically)', category: 'Transfers' },
  { pattern: '\\bcash machine withdrawal|\\batm\\b', category: 'Cash' },


  // Service stations: big spends are fuel, small ones are usually snacks — ask.
  { pattern: '\\b(service sta|sf co|pfs|filling sta)', category: 'Fuel', minAmount: 10 },
  { pattern: '\\b(service sta|sf co|pfs|filling sta)', category: 'Eating Out', confirm: ['Eating Out', 'Fuel'] },

  // Shops that sell both fuel and groceries: ask, then remember per store.
  { pattern: '\\b(tesco|sainsbury|asda|morrisons|costco)\\b.*\\b(pfs|petrol|fuel|filling)\\b', category: 'Fuel' },
  // Under £15 is never a fill-up.
  { pattern: '\\b(tesco stores|tesco express|tesco extra|sainsburys?|asda|morrisons|costco)\\b', category: 'Groceries', maxAmount: 15 },
  { pattern: '\\b(tesco stores|tesco express|tesco extra|sainsburys?|asda|morrisons|costco)\\b', category: 'Groceries', confirm: ['Groceries', 'Fuel'] },

  // Fuel
  { pattern: '\\b(shell|esso|bp |texaco|gulf|jet petrol|rontec|motor fuel group|mfg |euro garages|eg on the move|applegreen|murco|harvest energy|eni pv|distributore)', category: 'Fuel' },

  // Groceries
  { pattern: '\\b(lidl|aldi|co op group food|co-op|waitrose|iceland|m&s simply food|nyx\\*tesco|oncu food|food centre|superstore|convenie|food inn|int superstore|meatup|bricklane convenie|budgens|m&s|food ce|pembridge food|continente|conad|b&m|pkt )', category: 'Groceries' },

  // Eating out
  { pattern: '\\b(deliveroo|uber \\*?eats|just eat|chipotle|nando|mcdonald|kfc|burger|tim hortons|starbucks|costa|pret|greggs|pepes|piri|pizza|piz|slice|chicken|cafe|restaurant|kibele|berenjak|lebanese|ranoush|baklava|borek|roll boys|grubbox|bread 41|two pups|gaia|evolve cafe|foodies|mehmet efendi|layali|lounge|roast kitchen|little pudding|alley cats|tortilla|choux|patisserie|kebab|muncheez|ta.mini|blank street|kith treats|watchhouse|fresh bake|coffe|gelat|ristorante|bar |azan halal|tt spitafields|kawa)', category: 'Eating Out' },
  // Amazon LCY2 = food bought at work
  { pattern: '\\bamazon lcy2', category: 'Eating Out' },

  // Travel & transport
  { pattern: '\\b(tfl|trainline|uber(?! \\*?eats)|bolt|ryanair|easyjet|jet2|british airways|wizz|stansted|heathrow|gatwick|national rail|c2c|greater anglia|elizabeth line|justpark|ringgo|car park|stratford city car|city of westminste|boro of|borough of|parking|paybyphone|swrailway|airport|mobilita|tyre|kwik fit|mot )', category: 'Travel & Transport' },

  // Subscriptions
  { pattern: '\\b(claude\\.ai|anthropic|google g1ai|openai|chatgpt|apple\\.com/bill|netflix|spotify|disney|amazon prime|prime video|youtube|google \\*|microsoft|adobe|adcreative|now tv|dazn|icloud)', category: 'Subscriptions' },

  // Bills & utilities
  { pattern: '\\b(vodafone|ee limited|o2|three|giffgaff|bt group|virgin media|sky|octopus|british gas|edf|e\\.on|ovo|thames water|council tax|tv licen|post office)', category: 'Bills & Utilities' },

  // Health & fitness
  { pattern: '\\b(gym|fitness|muscleworks|ultraflex|puregym|the gym group|pharmacy|chemist|boots|superdrug|dentist|optician)', category: 'Health & Fitness' },

  // Entertainment
  { pattern: '\\b(cinema|cineworld|vue |odeon|bounce|battersea phase|steam|playstation|xbox|nintendo|ticketmaster|joy interactiv|k4g)', category: 'Entertainment' },

  // Personal care
  { pattern: '\\b(barber|salon|roja parfums|perfume|sparkles|hair)', category: 'Personal Care' },

  // Charity
  { pattern: '\\b(oxfam|islamic relief|matw|launchgood|charity|as-siraj|islamic c|mosque|najaminstitute|red cross|cancer research|unicef|ihsan welfare|hdfund|gofndme|gofundme)', category: 'Charity' },

  // Shopping
  { pattern: '\\b(amazon(?! uk services| lcy2)|amzn|ebay otp|tiktok shop|sportsdirect|westfield|techhouse|wh smith|argos|currys|primark|asos|ikea|pets at home|purvis news|selfridges|massimo dutti|zara|lancer products)', category: 'Shopping' },

  // Loans & finance
  { pattern: '\\b(barclays prtnr fin|klarna|clearpay|paypal credit|loan)', category: 'Loans & Finance' },
  { pattern: '\\bayan capital', category: 'Loans & Finance' }, // car finance

  // Credit cards (the spending itself lives on the card statement)
  { pattern: '\\b(american exp|amex|yonder|yond\\d)', category: 'Credit Card Payments', direction: 'out' },

  // Investing / trading
  { pattern: '\\b(trading 212|vanguard|freetrade|hargreaves|crypto\\.com|moonpay|coinbase|binance|apextraderfunding)', category: 'Investments & Savings' },

  // Business account — kept separate from personal spending
  { pattern: '\\btide platform', category: 'Business' },

  // Rent
  { pattern: '\\bref: rent\\b|\\brent\\b', category: 'Rent', direction: 'out' },

  // Income
  { pattern: '\\b(amazon uk services|salary|wages|payroll|hmrc)', category: 'Income', direction: 'in' },
  { pattern: '\\b(ebay commerce|airbnb|ref: bnb|vinted)', category: 'Income', direction: 'in' },
  { pattern: '\\b(refund|amex cbr|unpaid direct debit)', category: 'Income', direction: 'in' },

  // Barclays sometimes shows only a town name (often a petrol station) — ask.
  // Checked last, so only unrecognised one-word merchants land here.
  { pattern: '^card purchase [a-z]+ on \\d', category: 'Fuel', confirm: ['Fuel', 'Groceries', 'Shopping'], minAmount: 5 },

  // Small digital charges that aren't worth tracking separately
  { pattern: '\\ble ciel digital', category: 'Miscellaneous' },

  // Paying a person (not rent / own accounts / cards, handled above) — usually food or holidays.
  { pattern: '^bill payment to ', category: 'Eating Out', direction: 'out', confirm: ['Eating Out', 'Holidays', 'Gifts', 'Miscellaneous'] },

  // Anything else paid in euros while abroad
  { pattern: '\\b(italy|portugal|spain|france|greece|turkey) eur\\b|\\beur [\\d.]+ on\\b', category: 'Holidays', direction: 'out' },
];

export function categorise(
  t: { description: string; details: string; amount: number },
  userRules: Rule[] = [],
): CategorisedTransaction {
  const text = `${t.description} ${t.details}`.toLowerCase();
  const direction = t.amount < 0 ? 'out' : 'in';

  for (const rule of [...userRules, ...DEFAULT_RULES]) {
    if (rule.direction && rule.direction !== direction) continue;
    if (rule.minAmount !== undefined && Math.abs(t.amount) < rule.minAmount) continue;
    if (rule.maxAmount !== undefined && Math.abs(t.amount) >= rule.maxAmount) continue;
    if (!new RegExp(rule.pattern, 'i').test(text)) continue;
    return {
      category: rule.category,
      needsReview: !!rule.confirm,
      suggestions: rule.confirm ?? [],
      matchedRule: rule.pattern,
    };
  }

  // Unmatched money in from a person is usually a friend paying you back.
  if (direction === 'in') return { category: 'Transfers', needsReview: false, suggestions: [], matchedRule: null };
  // Tiny unknown payments aren't worth a question.
  if (Math.abs(t.amount) < SMALL_PAYMENT) return { category: 'Miscellaneous', needsReview: false, suggestions: [], matchedRule: null };
  return { category: 'Miscellaneous', needsReview: true, suggestions: [], matchedRule: null };
}
