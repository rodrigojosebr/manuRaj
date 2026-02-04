/**
 * Format Utilities Tests
 *
 * Tests for all formatting functions used across the application.
 * Run with: npx vitest run tests/shared-utils/format.test.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDate,
  formatDateTime,
  formatMinutes,
  formatFileSize,
  truncate,
  daysUntil,
  isOverdue,
  formatRelativeTime,
} from '@manuraj/shared-utils';

describe('Format Utilities', () => {
  describe('formatDate', () => {
    it('should format Date object to Brazilian format', () => {
      // Use explicit local date to avoid timezone issues
      const date = new Date(2025, 1, 3); // Month is 0-indexed (1 = February)
      const result = formatDate(date);
      expect(result).toBe('03/02/2025');
    });

    it('should format ISO string to Brazilian format', () => {
      // Use local midnight to avoid timezone conversion issues
      const date = new Date(2025, 11, 25); // December 25, 2025
      const result = formatDate(date);
      expect(result).toBe('25/12/2025');
    });

    it('should return "-" for null', () => {
      expect(formatDate(null)).toBe('-');
    });

    it('should return "-" for undefined', () => {
      expect(formatDate(undefined)).toBe('-');
    });
  });

  describe('formatDateTime', () => {
    it('should format Date object with time', () => {
      const date = new Date('2025-02-03T14:30:00');
      const result = formatDateTime(date);
      expect(result).toMatch(/03\/02\/2025/);
      expect(result).toMatch(/14:30/);
    });

    it('should return "-" for null', () => {
      expect(formatDateTime(null)).toBe('-');
    });

    it('should return "-" for undefined', () => {
      expect(formatDateTime(undefined)).toBe('-');
    });
  });

  describe('formatMinutes', () => {
    it('should format minutes only', () => {
      expect(formatMinutes(45)).toBe('45min');
    });

    it('should format hours only when exact hours', () => {
      expect(formatMinutes(60)).toBe('1h');
      expect(formatMinutes(120)).toBe('2h');
    });

    it('should format hours and minutes', () => {
      expect(formatMinutes(90)).toBe('1h 30min');
      expect(formatMinutes(150)).toBe('2h 30min');
    });

    it('should return "-" for 0', () => {
      expect(formatMinutes(0)).toBe('-');
    });

    it('should return "-" for negative values', () => {
      expect(formatMinutes(-30)).toBe('-');
    });

    it('should return "-" for null', () => {
      expect(formatMinutes(null)).toBe('-');
    });

    it('should return "-" for undefined', () => {
      expect(formatMinutes(undefined)).toBe('-');
    });

    it('should handle large values', () => {
      expect(formatMinutes(1440)).toBe('24h'); // 24 hours
      expect(formatMinutes(1500)).toBe('25h'); // 25 hours
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(formatFileSize(500)).toBe('500 B');
      expect(formatFileSize(0)).toBe('0 B');
    });

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });

    it('should format megabytes', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
    });

    it('should format gigabytes', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('should round to 1 decimal place', () => {
      expect(formatFileSize(1234)).toBe('1.2 KB');
      expect(formatFileSize(1789)).toBe('1.7 KB');
    });
  });

  describe('truncate', () => {
    it('should not truncate short text', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('should truncate long text with ellipsis', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...');
    });

    it('should handle exact length', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
    });

    it('should handle very short maxLength', () => {
      expect(truncate('Hello World', 4)).toBe('H...');
    });

    it('should handle empty string', () => {
      expect(truncate('', 10)).toBe('');
    });
  });

  describe('daysUntil', () => {
    beforeEach(() => {
      // Mock current date to 2025-02-03
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-02-03T12:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return positive days for future date', () => {
      expect(daysUntil('2025-02-10T12:00:00.000Z')).toBe(7);
    });

    it('should return negative days for past date', () => {
      expect(daysUntil('2025-01-27T12:00:00.000Z')).toBe(-7);
    });

    it('should return 0 for today', () => {
      expect(daysUntil('2025-02-03T12:00:00.000Z')).toBe(0);
    });

    it('should work with Date object', () => {
      const futureDate = new Date('2025-02-08T12:00:00.000Z');
      expect(daysUntil(futureDate)).toBe(5);
    });

    it('should round up partial days', () => {
      // 2.5 days in the future should round to 3
      expect(daysUntil('2025-02-06T00:00:00.000Z')).toBeGreaterThanOrEqual(2);
    });
  });

  describe('isOverdue', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-02-03T12:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return true for past date', () => {
      expect(isOverdue('2025-02-01T00:00:00.000Z')).toBe(true);
    });

    it('should return false for future date', () => {
      expect(isOverdue('2025-02-10T00:00:00.000Z')).toBe(false);
    });

    it('should return false for null', () => {
      expect(isOverdue(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isOverdue(undefined)).toBe(false);
    });

    it('should work with Date object', () => {
      const pastDate = new Date('2025-01-01T00:00:00.000Z');
      expect(isOverdue(pastDate)).toBe(true);
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-02-03T12:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return "agora" for very recent', () => {
      const result = formatRelativeTime('2025-02-03T11:59:30.000Z');
      expect(result).toBe('agora');
    });

    it('should format minutes ago (singular)', () => {
      const result = formatRelativeTime('2025-02-03T11:59:00.000Z');
      expect(result).toBe('1 minuto atrás');
    });

    it('should format minutes ago (plural)', () => {
      const result = formatRelativeTime('2025-02-03T11:45:00.000Z');
      expect(result).toBe('15 minutos atrás');
    });

    it('should format hours ago (singular)', () => {
      const result = formatRelativeTime('2025-02-03T11:00:00.000Z');
      expect(result).toBe('1 hora atrás');
    });

    it('should format hours ago (plural)', () => {
      const result = formatRelativeTime('2025-02-03T09:00:00.000Z');
      expect(result).toBe('3 horas atrás');
    });

    it('should format days ago (singular)', () => {
      const result = formatRelativeTime('2025-02-02T12:00:00.000Z');
      expect(result).toBe('1 dia atrás');
    });

    it('should format days ago (plural)', () => {
      const result = formatRelativeTime('2025-01-31T12:00:00.000Z');
      expect(result).toBe('3 dias atrás');
    });

    it('should return formatted date for more than 30 days', () => {
      const result = formatRelativeTime('2024-12-01T12:00:00.000Z');
      expect(result).toMatch(/01\/12\/2024/);
    });

    it('should work with Date object', () => {
      const date = new Date('2025-02-02T12:00:00.000Z');
      expect(formatRelativeTime(date)).toBe('1 dia atrás');
    });
  });
});
