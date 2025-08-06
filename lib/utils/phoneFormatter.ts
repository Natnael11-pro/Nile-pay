/**
 * Formats Ethiopian phone numbers to international format (+251XXXXXXXXX)
 * Accepts formats: 0912345678 or +251912345678
 * Returns: +251912345678
 */
export const formatEthiopianPhoneNumber = (phoneNumber: string): string => {
  // Remove all spaces, dashes, and other non-digit characters except +
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // If it starts with +251, return as is (already in correct format)
  if (cleaned.startsWith('+251')) {
    return cleaned;
  }
  
  // If it starts with 251, add the + prefix
  if (cleaned.startsWith('251')) {
    return `+${cleaned}`;
  }
  
  // If it starts with 0, replace with +251
  if (cleaned.startsWith('0')) {
    return `+251${cleaned.substring(1)}`;
  }
  
  // If it's just 9 digits (without leading 0), add +251
  if (cleaned.length === 9 && /^[1-9]/.test(cleaned)) {
    return `+251${cleaned}`;
  }
  
  // Return the original if it doesn't match expected patterns
  return phoneNumber;
};

/**
 * Validates if a phone number is a valid Ethiopian phone number
 */
export const isValidEthiopianPhoneNumber = (phoneNumber: string): boolean => {
  const formatted = formatEthiopianPhoneNumber(phoneNumber);
  
  // Ethiopian phone numbers should be +251 followed by 9 digits
  const ethiopianPhoneRegex = /^\+251[1-9]\d{8}$/;
  
  return ethiopianPhoneRegex.test(formatted);
};

/**
 * Formats phone number for display (removes +251 and adds 0 prefix)
 */
export const formatPhoneForDisplay = (phoneNumber: string): string => {
  const formatted = formatEthiopianPhoneNumber(phoneNumber);
  
  if (formatted.startsWith('+251')) {
    return `0${formatted.substring(4)}`;
  }
  
  return phoneNumber;
};
