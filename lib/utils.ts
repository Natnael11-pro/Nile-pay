/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// FORMAT DATE TIME
export const formatDateTime = (dateInput: Date | string) => {
  // Handle both Date objects and string inputs
  let date: Date;

  if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else {
    date = dateInput;
  }

  // Check if date is valid
  if (isNaN(date.getTime())) {
    // Return fallback values for invalid dates
    return {
      dateTime: 'Invalid Date',
      dateDay: 'Invalid Date',
      dateOnly: 'Invalid Date',
      timeOnly: 'Invalid Date',
    };
  }

  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = date.toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDateDay: string = date.toLocaleString(
    "en-US",
    dateDayOptions
  );

  const formattedDate: string = date.toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime: string = date.toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function formatAmount(amount: number): string {
  const formatter = new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const removeSpecialCharacters = (value: string | undefined | null) => {
  if (!value) return '';
  return value.replace(/[^\w\s]/gi, "");
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function getAccountTypeColors(type: AccountTypes) {
  switch (type) {
    case "depository":
      return {
        bg: "bg-blue-25",
        lightBg: "bg-blue-100",
        title: "text-blue-900",
        subText: "text-blue-700",
      };

    case "credit":
      return {
        bg: "bg-success-25",
        lightBg: "bg-success-100",
        title: "text-success-900",
        subText: "text-success-700",
      };

    default:
      return {
        bg: "bg-green-25",
        lightBg: "bg-green-100",
        title: "text-green-900",
        subText: "text-green-700",
      };
  }
}

export function countTransactionCategories(
  transactions: Transaction[]
): CategoryCount[] {
  const categoryCounts: { [category: string]: number } = {};
  let totalCount = 0;

  // Iterate over each transaction
  transactions &&
    transactions.forEach((transaction) => {
      // Extract the category from the transaction
      const category = transaction.category;

      // If the category exists in the categoryCounts object, increment its count
      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        // Otherwise, initialize the count to 1
        categoryCounts[category] = 1;
      }

      // Increment total count
      totalCount++;
    });

  // Convert the categoryCounts object to an array of objects
  const aggregatedCategories: CategoryCount[] = Object.keys(categoryCounts).map(
    (category) => ({
      name: category,
      count: categoryCounts[category],
      totalCount,
    })
  );

  // Sort the aggregatedCategories array by count in descending order
  aggregatedCategories.sort((a, b) => b.count - a.count);

  return aggregatedCategories;
}

export function extractCustomerIdFromUrl(url: string) {
  // Split the URL string by '/'
  const parts = url.split("/");

  // Extract the last part, which represents the customer ID
  const customerId = parts[parts.length - 1];

  return customerId;
}

export function encryptId(id: string) {
  return btoa(id);
}

export function decryptId(id: string) {
  return atob(id);
}

export const getTransactionStatus = (date: Date) => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  return date > twoDaysAgo ? "Processing" : "Success";
};

export const authFormSchema = (type: string) => z.object({
  // sign up - Ethiopian specific fields
  firstName: type === 'sign-in' ? z.string().optional() : z.string().min(2, "First name must be at least 2 characters").max(50, "First name is too long"),
  lastName: type === 'sign-in' ? z.string().optional() : z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name is too long"),
  phone: type === 'sign-in' ? z.string().optional() : z.string().regex(/^(\+251|0)?[79]\d{8}$/, "Please enter a valid Ethiopian phone number (e.g., +251911234567)"),
  city: type === 'sign-in' ? z.string().optional() : z.string().min(1, "Please enter your city").max(100, "City name is too long"),
  dateOfBirth: type === 'sign-in' ? z.string().optional() : z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter date in YYYY-MM-DD format"),
  nationalId: type === 'sign-in' ? z.string().optional() : z.string().min(10, "Please enter a valid Ethiopian National ID").max(20, "National ID is too long"),
  // both
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  password: type === 'sign-in'
    ? z.string().min(1, "Password is required")
    : z.string().min(8, "Password must be at least 8 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
})

export const paymentTransferSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(4, "Transfer note must be at least 4 characters"),
  amount: z.string().min(1, "Please enter transfer amount in Ethiopian Birr"),
  senderBankId: z.string().min(4, "Please select your Ethiopian bank account"),
  sharableId: z.string().min(8, "Please enter a valid Nile Pay account ID"),
})

// Ethiopian-specific utilities
export const ethiopianBanks = [
  { name: "Commercial Bank of Ethiopia", code: "CBE", color: "#1B5E20", flag: "🇪🇹" },
  { name: "Dashen Bank", code: "DB", color: "#FF6B35", flag: "🇪🇹" },
  { name: "Bank of Abyssinia", code: "BOA", color: "#2E7D32", flag: "🇪🇹" },
  { name: "Wegagen Bank", code: "WB", color: "#1565C0", flag: "🇪🇹" },
  { name: "United Bank", code: "UB", color: "#8E24AA", flag: "🇪🇹" },
  { name: "Nib International Bank", code: "NIB", color: "#D32F2F", flag: "🇪🇹" },
  { name: "Cooperative Bank of Oromia", code: "CBO", color: "#F57C00", flag: "🇪🇹" },
  { name: "Lion International Bank", code: "LIB", color: "#795548", flag: "🇪🇹" },
  { name: "Oromia International Bank", code: "OIB", color: "#388E3C", flag: "🇪🇹" },
  { name: "Zemen Bank", code: "ZB", color: "#303F9F", flag: "🇪🇹" }
];

export const generateEthiopianAccountNumber = (bankCode: string): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${bankCode}${timestamp}${random}`;
};

export const generateTransactionReference = (): string => {
  const prefix = "NP"; // Nile Pay prefix
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${timestamp}${random}`;
};

export const generateTransactionId = (): string => {
  const prefix = "NP"; // Nile Pay prefix
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `${prefix}${timestamp}${random}`;
};

// Ethiopian currency formatting
export const formatEthiopianBirr = (amount: number): string => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Ethiopian phone number validation
export const validateEthiopianPhone = (phone: string): boolean => {
  const ethiopianPhoneRegex = /^(\+251|0)?[79]\d{8}$/;
  return ethiopianPhoneRegex.test(phone);
};

// Generate Ethiopian names for demo data
export const ethiopianNames = {
  male: ["Abebe", "Bekele", "Dawit", "Ephrem", "Girma", "Haile", "Kebede", "Lemma", "Mekonnen", "Negash"],
  female: ["Almaz", "Birtukan", "Chaltu", "Desta", "Eyerusalem", "Fantu", "Genet", "Hanan", "Iman", "Kidist"],
  surnames: ["Abera", "Bekele", "Chala", "Desta", "Eshetu", "Fanta", "Girma", "Hailu", "Kebede", "Lemma"]
};

export const generateEthiopianName = (): { firstName: string; lastName: string } => {
  const isMale = Math.random() > 0.5;
  const firstNames = isMale ? ethiopianNames.male : ethiopianNames.female;
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = ethiopianNames.surnames[Math.floor(Math.random() * ethiopianNames.surnames.length)];

  return { firstName, lastName };
};

// Ethiopian regions
export const ethiopianRegions = [
  "Addis Ababa", "Afar", "Amhara", "Benishangul-Gumuz", "Dire Dawa",
  "Gambela", "Harari", "Oromia", "Sidama", "SNNP", "Somali", "Tigray"
];

export const getRandomEthiopianRegion = (): string => {
  return ethiopianRegions[Math.floor(Math.random() * ethiopianRegions.length)];
};