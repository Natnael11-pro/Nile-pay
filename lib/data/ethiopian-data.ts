import { 
  ethiopianBanks, 
  generateEthiopianAccountNumber, 
  generateTransactionReference, 
  generateEthiopianName,
  getRandomEthiopianRegion 
} from '../utils';

// Ethiopian transaction categories
export const ethiopianTransactionCategories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Entertainment',
  'Travel',
  'Business',
  'Family Support',
  'Savings',
  'Investment',
  'Mobile Money',
  'Salary',
  'Freelance',
];

// Ethiopian business names for realistic transactions
export const ethiopianBusinesses = [
  'Addis Mercato',
  'Blue Nile Restaurant',
  'Ethiopian Airlines',
  'Ethio Telecom',
  'Dashen Brewery',
  'Habesha Mart',
  'Sheger Cafe',
  'Bole Medhanialem',
  'Merkato Shopping',
  'Addis Pharmacy',
  'Lucy Hotel',
  'Rift Valley University',
  'Awash Bank ATM',
  'Sheraton Addis',
  'Edna Mall',
  'Friendship Business Center',
  'Bole International Airport',
  'St. George Brewery',
  'Addis Ababa University',
  'Black Lion Hospital',
];

// Generate realistic Ethiopian transaction data
export const generateEthiopianTransaction = (
  userId: string,
  accountId: string,
  type: 'credit' | 'debit' = 'debit'
) => {
  const amount = type === 'credit' 
    ? Math.floor(Math.random() * 10000) + 500  // Credits: 500-10,500 ETB
    : Math.floor(Math.random() * 2000) + 50;   // Debits: 50-2,050 ETB

  const category = ethiopianTransactionCategories[
    Math.floor(Math.random() * ethiopianTransactionCategories.length)
  ];

  const business = ethiopianBusinesses[
    Math.floor(Math.random() * ethiopianBusinesses.length)
  ];

  const descriptions = {
    credit: [
      `Salary deposit`,
      `Freelance payment`,
      `Money transfer received`,
      `Investment return`,
      `Business income`,
      `Family support received`,
    ],
    debit: [
      `Payment to ${business}`,
      `${business} purchase`,
      `${category} expense`,
      `Bill payment - ${business}`,
      `Transfer to family`,
      `Mobile money transfer`,
    ]
  };

  const description = descriptions[type][
    Math.floor(Math.random() * descriptions[type].length)
  ];

  // Generate random date within last 30 days
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);

  return {
    user_id: userId,
    account_id: accountId,
    type,
    amount,
    currency: 'ETB',
    description,
    category,
    status: Math.random() > 0.1 ? 'completed' : 'pending', // 90% completed
    recipient_name: type === 'debit' ? business : null,
    recipient_account: type === 'debit' ? generateEthiopianAccountNumber('CBE') : null,
    recipient_bank: type === 'debit' ? 'Commercial Bank of Ethiopia' : null,
    reference_number: generateTransactionReference(),
    created_at: pastDate.toISOString(),
    updated_at: pastDate.toISOString(),
  };
};

// Generate multiple transactions for an account
export const generateAccountTransactions = (
  userId: string,
  accountId: string,
  count: number = 20
) => {
  const transactions = [];
  
  for (let i = 0; i < count; i++) {
    // 70% debit, 30% credit transactions
    const type = Math.random() > 0.7 ? 'credit' : 'debit';
    transactions.push(generateEthiopianTransaction(userId, accountId, type));
  }

  return transactions;
};

// Generate demo Ethiopian bank account
export const generateEthiopianBankAccount = (userId: string) => {
  const bank = ethiopianBanks[Math.floor(Math.random() * ethiopianBanks.length)];
  const accountTypes = ['savings', 'checking', 'business'];
  const accountType = accountTypes[Math.floor(Math.random() * accountTypes.length)];
  
  // Generate realistic balance based on account type
  let balance;
  switch (accountType) {
    case 'business':
      balance = Math.floor(Math.random() * 100000) + 10000; // 10K-110K ETB
      break;
    case 'savings':
      balance = Math.floor(Math.random() * 50000) + 5000;   // 5K-55K ETB
      break;
    default:
      balance = Math.floor(Math.random() * 20000) + 1000;   // 1K-21K ETB
  }

  return {
    user_id: userId,
    account_number: generateEthiopianAccountNumber(bank.code),
    account_type: accountType,
    balance,
    available_balance: balance - Math.floor(Math.random() * 1000), // Slightly less available
    currency: 'ETB',
    is_active: true,
    bank_name: bank.name,
    bank_code: bank.code,
    bank_color: bank.color,
  };
};

// Generate demo Ethiopian user
export const generateEthiopianUser = () => {
  const { firstName, lastName } = generateEthiopianName();
  const region = getRandomEthiopianRegion();
  
  // Generate Ethiopian phone number
  const phoneNumbers = ['+251911', '+251912', '+251913', '+251914', '+251921', '+251922'];
  const phonePrefix = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
  const phoneSuffix = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  const phone = phonePrefix + phoneSuffix;

  return {
    first_name: firstName,
    last_name: lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@nilepay.et`,
    phone,
    region,
    preferred_language: 'en',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

// Ethiopian payment categories with icons
export const ethiopianPaymentCategories = [
  { name: 'Food & Dining', icon: '🍽️', color: '#FF6B35' },
  { name: 'Transportation', icon: '🚗', color: '#1565C0' },
  { name: 'Shopping', icon: '🛍️', color: '#8E24AA' },
  { name: 'Bills & Utilities', icon: '⚡', color: '#F57C00' },
  { name: 'Healthcare', icon: '🏥', color: '#D32F2F' },
  { name: 'Education', icon: '📚', color: '#388E3C' },
  { name: 'Entertainment', icon: '🎬', color: '#795548' },
  { name: 'Travel', icon: '✈️', color: '#303F9F' },
  { name: 'Business', icon: '💼', color: '#1B5E20' },
  { name: 'Family Support', icon: '👨‍👩‍👧‍👦', color: '#E91E63' },
  { name: 'Mobile Money', icon: '📱', color: '#00BCD4' },
  { name: 'Salary', icon: '💰', color: '#4CAF50' },
];

// Ethiopian regions with their major cities
export const ethiopianRegionsWithCities = {
  'Addis Ababa': ['Addis Ababa'],
  'Oromia': ['Adama', 'Jimma', 'Nekemte', 'Ambo', 'Asella'],
  'Amhara': ['Bahir Dar', 'Gondar', 'Dessie', 'Debre Birhan'],
  'Tigray': ['Mekelle', 'Axum', 'Adigrat', 'Shire'],
  'SNNP': ['Hawassa', 'Arba Minch', 'Wolaita Sodo', 'Dilla'],
  'Somali': ['Jijiga', 'Dire Dawa', 'Gode', 'Kebri Dehar'],
  'Afar': ['Semera', 'Asaita', 'Awash'],
  'Benishangul-Gumuz': ['Asosa', 'Metekel'],
  'Gambela': ['Gambela'],
  'Harari': ['Harar'],
  'Dire Dawa': ['Dire Dawa'],
  'Sidama': ['Hawassa', 'Yirgalem', 'Aleta Wondo'],
};

// Get random city from a region
export const getRandomCityFromRegion = (region: string): string => {
  const cities = ethiopianRegionsWithCities[region as keyof typeof ethiopianRegionsWithCities];
  if (!cities || cities.length === 0) return region;
  return cities[Math.floor(Math.random() * cities.length)];
};
