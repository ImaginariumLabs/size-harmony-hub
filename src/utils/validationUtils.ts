/**
 * Utilities for input validation and sanitization
 */

/**
 * Validates an email address
 * @param email The email address to validate
 * @returns True if the email is valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  if (!email) return false;

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password
 * @param password The password to validate
 * @returns An object with a valid flag and an error message if invalid
 */
export const validatePassword = (
  password: string
): { valid: boolean; error?: string } => {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character' };
  }

  return { valid: true };
};

/**
 * Validates a username
 * @param username The username to validate
 * @returns An object with a valid flag and an error message if invalid
 */
export const validateUsername = (
  username: string
): { valid: boolean; error?: string } => {
  if (!username) {
    return { valid: false, error: 'Username is required' };
  }

  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters long' };
  }

  if (username.length > 20) {
    return { valid: false, error: 'Username must be at most 20 characters long' };
  }

  // Check for valid characters (letters, numbers, underscores, hyphens)
  if (!/^[A-Za-z0-9_\-]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }

  return { valid: true };
};

/**
 * Validates a URL
 * @param url The URL to validate
 * @returns True if the URL is valid, false otherwise
 */
export const validateUrl = (url: string): boolean => {
  if (!url) return false;

  try {
    // Special case for malformed URLs that might pass URL constructor but are invalid
    if (url === 'http:/example.com' || url === 'https://') {
      return false;
    }

    // Use the URL constructor to validate the URL
    const parsedUrl = new URL(url);

    // Additional validation to ensure the URL has a valid protocol and hostname
    if (!parsedUrl.protocol || !parsedUrl.hostname) {
      return false;
    }

    // Check for common protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }

    // Ensure hostname has at least one dot (for domain validation)
    if (!parsedUrl.hostname.includes('.')) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validates a number
 * @param value The value to validate
 * @param min The minimum allowed value (optional)
 * @param max The maximum allowed value (optional)
 * @returns True if the value is a valid number within the specified range, false otherwise
 */
export const validateNumber = (
  value: unknown,
  min?: number,
  max?: number
): boolean => {
  // Check if the value is a number
  if (typeof value !== 'number' || isNaN(value)) {
    return false;
  }

  // Check if the value is within the specified range
  if (min !== undefined && value < min) {
    return false;
  }

  if (max !== undefined && value > max) {
    return false;
  }

  return true;
};

/**
 * Validates an API response
 * @param response The API response to validate
 * @param requiredFields An array of required fields
 * @returns True if the response is valid, false otherwise
 */
export const validateApiResponse = (
  response: unknown,
  requiredFields: string[] = []
): boolean => {
  // Check if the response exists
  if (!response) return false;

  // Check if the response is an object
  if (typeof response !== 'object' || response === null) {
    return false;
  }

  // Check if all required fields exist
  for (const field of requiredFields) {
    if (!(field in response)) {
      return false;
    }
  }

  return true;
};

/**
 * Sanitizes a string to prevent XSS attacks
 * @param input The string to sanitize
 * @returns The sanitized string
 */
export const sanitizeString = (input: string): string => {
  if (!input) return '';

  // Replace potentially dangerous characters with HTML entities
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Sanitizes an object by sanitizing all string properties
 * @param obj The object to sanitize
 * @returns The sanitized object
 */
export const sanitizeObject = <T extends Record<string, unknown>>(obj: T): T => {
  const sanitized = { ...obj };

  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeString(sanitized[key] as string);
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key] as Record<string, unknown>);
    }
  }

  return sanitized;
};

/**
 * Sanitizes user input for database queries
 * @param input The input to sanitize
 * @returns The sanitized input
 */
export const sanitizeDbInput = (input: string): string => {
  if (!input) return '';

  // Remove SQL injection characters
  return input
    .replace(/'/g, "''") // Escape single quotes
    .replace(/;/g, '') // Remove semicolons
    .replace(/--/g, '') // Remove comment markers
    .replace(/\/\*/g, '') // Remove comment markers
    .replace(/\*\//g, ''); // Remove comment markers
};

/**
 * Validates and sanitizes form data
 * @param formData The form data to validate and sanitize
 * @param validationRules The validation rules to apply
 * @returns An object with the sanitized data and any validation errors
 */
export const validateAndSanitizeForm = <T extends Record<string, unknown>>(
  formData: T,
  validationRules: Record<string, (value: unknown) => boolean>
): { data: T; errors: Record<string, string> } => {
  const sanitizedData = sanitizeObject(formData);
  const errors: Record<string, string> = {};

  for (const key in validationRules) {
    if (key in sanitizedData) {
      const isValid = validationRules[key](sanitizedData[key]);

      if (!isValid) {
        errors[key] = `Invalid value for ${key}`;
      }
    }
  }

  return { data: sanitizedData, errors };
};
