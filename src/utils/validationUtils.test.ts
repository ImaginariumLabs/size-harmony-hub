import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateUrl,
  validateNumber,
  validateApiResponse,
  sanitizeString,
  sanitizeObject,
  sanitizeDbInput,
  validateAndSanitizeForm
} from './validationUtils';

describe('validationUtils', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    });
    
    it('should return false for invalid email addresses', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('test')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('test@example')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });
  
  describe('validatePassword', () => {
    it('should return valid for strong passwords', () => {
      expect(validatePassword('StrongP@ss1')).toEqual({ valid: true });
      expect(validatePassword('AnotherStr0ng!Password')).toEqual({ valid: true });
    });
    
    it('should return invalid for weak passwords', () => {
      expect(validatePassword('')).toEqual({ valid: false, error: 'Password is required' });
      expect(validatePassword('short')).toEqual({ valid: false, error: 'Password must be at least 8 characters long' });
      expect(validatePassword('lowercase123!')).toEqual({ valid: false, error: 'Password must contain at least one uppercase letter' });
      expect(validatePassword('UPPERCASE123!')).toEqual({ valid: false, error: 'Password must contain at least one lowercase letter' });
      expect(validatePassword('NoNumbers!')).toEqual({ valid: false, error: 'Password must contain at least one number' });
      expect(validatePassword('NoSpecial123')).toEqual({ valid: false, error: 'Password must contain at least one special character' });
    });
  });
  
  describe('validateUsername', () => {
    it('should return valid for valid usernames', () => {
      expect(validateUsername('user123')).toEqual({ valid: true });
      expect(validateUsername('user_name')).toEqual({ valid: true });
      expect(validateUsername('user-name')).toEqual({ valid: true });
    });
    
    it('should return invalid for invalid usernames', () => {
      expect(validateUsername('')).toEqual({ valid: false, error: 'Username is required' });
      expect(validateUsername('ab')).toEqual({ valid: false, error: 'Username must be at least 3 characters long' });
      expect(validateUsername('a'.repeat(21))).toEqual({ valid: false, error: 'Username must be at most 20 characters long' });
      expect(validateUsername('user name')).toEqual({ valid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' });
      expect(validateUsername('user@name')).toEqual({ valid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' });
    });
  });
  
  describe('validateUrl', () => {
    it('should return true for valid URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://example.com/path?query=value')).toBe(true);
      expect(validateUrl('https://sub.domain.example.co.uk/path')).toBe(true);
    });
    
    it('should return false for invalid URLs', () => {
      expect(validateUrl('')).toBe(false);
      expect(validateUrl('example.com')).toBe(false);
      expect(validateUrl('http:/example.com')).toBe(false);
      expect(validateUrl('https://')).toBe(false);
    });
  });
  
  describe('validateNumber', () => {
    it('should return true for valid numbers', () => {
      expect(validateNumber(42)).toBe(true);
      expect(validateNumber(0)).toBe(true);
      expect(validateNumber(-10)).toBe(true);
      expect(validateNumber(3.14)).toBe(true);
    });
    
    it('should return false for invalid numbers', () => {
      expect(validateNumber('42')).toBe(false);
      expect(validateNumber(NaN)).toBe(false);
      expect(validateNumber(null)).toBe(false);
      expect(validateNumber(undefined)).toBe(false);
      expect(validateNumber({})).toBe(false);
    });
    
    it('should validate numbers within a range', () => {
      expect(validateNumber(5, 0, 10)).toBe(true);
      expect(validateNumber(0, 0, 10)).toBe(true);
      expect(validateNumber(10, 0, 10)).toBe(true);
      expect(validateNumber(-1, 0, 10)).toBe(false);
      expect(validateNumber(11, 0, 10)).toBe(false);
    });
  });
  
  describe('validateApiResponse', () => {
    it('should return true for valid API responses', () => {
      expect(validateApiResponse({ data: 'value' })).toBe(true);
      expect(validateApiResponse({ data: 'value', status: 200 }, ['data', 'status'])).toBe(true);
    });
    
    it('should return false for invalid API responses', () => {
      expect(validateApiResponse(null)).toBe(false);
      expect(validateApiResponse('not an object')).toBe(false);
      expect(validateApiResponse({ data: 'value' }, ['data', 'status'])).toBe(false);
      expect(validateApiResponse({ status: 200 }, ['data'])).toBe(false);
    });
  });
  
  describe('sanitizeString', () => {
    it('should sanitize strings to prevent XSS', () => {
      expect(sanitizeString('<script>alert("XSS")</script>')).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
      expect(sanitizeString("text with 'quotes'")).toBe('text with &#039;quotes&#039;');
      expect(sanitizeString('text with "quotes"')).toBe('text with &quot;quotes&quot;');
      expect(sanitizeString('text with & ampersand')).toBe('text with &amp; ampersand');
    });
    
    it('should handle empty or undefined input', () => {
      expect(sanitizeString('')).toBe('');
      expect(sanitizeString(undefined as unknown as string)).toBe('');
    });
  });
  
  describe('sanitizeObject', () => {
    it('should sanitize all string properties in an object', () => {
      const input = {
        name: '<script>alert("XSS")</script>',
        description: 'text with "quotes"',
        count: 42,
        nested: {
          html: '<b>Bold</b>'
        }
      };
      
      const expected = {
        name: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;',
        description: 'text with &quot;quotes&quot;',
        count: 42,
        nested: {
          html: '&lt;b&gt;Bold&lt;/b&gt;'
        }
      };
      
      expect(sanitizeObject(input)).toEqual(expected);
    });
  });
  
  describe('sanitizeDbInput', () => {
    it('should sanitize input for database queries', () => {
      expect(sanitizeDbInput("O'Reilly")).toBe("O''Reilly");
      expect(sanitizeDbInput('DROP TABLE users;')).toBe('DROP TABLE users');
      expect(sanitizeDbInput('-- Comment')).toBe(' Comment');
      expect(sanitizeDbInput('/* Comment */')).toBe(' Comment ');
    });
  });
  
  describe('validateAndSanitizeForm', () => {
    it('should validate and sanitize form data', () => {
      const formData = {
        email: 'test@example.com',
        username: 'user123',
        description: '<script>alert("XSS")</script>'
      };
      
      const validationRules = {
        email: validateEmail,
        username: (value: unknown) => typeof value === 'string' && validateUsername(value as string).valid
      };
      
      const result = validateAndSanitizeForm(formData, validationRules);
      
      expect(result.data.email).toBe('test@example.com');
      expect(result.data.username).toBe('user123');
      expect(result.data.description).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
      expect(result.errors).toEqual({});
    });
    
    it('should return validation errors', () => {
      const formData = {
        email: 'invalid-email',
        username: 'us',
        description: 'Valid description'
      };
      
      const validationRules = {
        email: validateEmail,
        username: (value: unknown) => typeof value === 'string' && validateUsername(value as string).valid
      };
      
      const result = validateAndSanitizeForm(formData, validationRules);
      
      expect(result.data).toEqual({
        email: 'invalid-email',
        username: 'us',
        description: 'Valid description'
      });
      
      expect(result.errors).toEqual({
        email: 'Invalid value for email',
        username: 'Invalid value for username'
      });
    });
  });
});
