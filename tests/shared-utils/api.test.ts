/**
 * API Utilities Tests
 *
 * Tests for API helper functions (buildQueryString, ApiRequestError).
 * Run with: npx vitest run tests/shared-utils/api.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildQueryString, ApiRequestError, api } from '@manuraj/shared-utils';

describe('API Utilities', () => {
  describe('buildQueryString', () => {
    it('should build query string from params', () => {
      const result = buildQueryString({ page: 1, limit: 20 });
      expect(result).toBe('?page=1&limit=20');
    });

    it('should handle string values', () => {
      const result = buildQueryString({ status: 'open', type: 'corrective' });
      expect(result).toBe('?status=open&type=corrective');
    });

    it('should handle boolean values', () => {
      const result = buildQueryString({ active: true });
      expect(result).toBe('?active=true');
    });

    it('should skip undefined values', () => {
      const result = buildQueryString({ page: 1, status: undefined, limit: 20 });
      expect(result).toBe('?page=1&limit=20');
    });

    it('should skip empty string values', () => {
      const result = buildQueryString({ page: 1, search: '' });
      expect(result).toBe('?page=1');
    });

    it('should return empty string when no valid params', () => {
      const result = buildQueryString({ a: undefined, b: undefined });
      expect(result).toBe('');
    });

    it('should return empty string for empty object', () => {
      const result = buildQueryString({});
      expect(result).toBe('');
    });

    it('should handle mixed types', () => {
      const result = buildQueryString({ page: 1, active: true, status: 'open', search: undefined });
      expect(result).toContain('page=1');
      expect(result).toContain('active=true');
      expect(result).toContain('status=open');
      expect(result).not.toContain('search');
    });
  });

  describe('ApiRequestError', () => {
    it('should create error with correct properties', () => {
      const error = new ApiRequestError('Not found', 404, 'NOT_FOUND');

      expect(error.message).toBe('Not found');
      expect(error.statusCode).toBe(404);
      expect(error.errorCode).toBe('NOT_FOUND');
      expect(error.name).toBe('ApiRequestError');
    });

    it('should be an instance of Error', () => {
      const error = new ApiRequestError('Bad request', 400, 'VALIDATION_ERROR');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApiRequestError);
    });

    it('should work with different status codes', () => {
      const errors = [
        new ApiRequestError('Bad Request', 400, 'BAD_REQUEST'),
        new ApiRequestError('Unauthorized', 401, 'UNAUTHORIZED'),
        new ApiRequestError('Forbidden', 403, 'FORBIDDEN'),
        new ApiRequestError('Server Error', 500, 'INTERNAL_ERROR'),
      ];

      expect(errors[0].statusCode).toBe(400);
      expect(errors[1].statusCode).toBe(401);
      expect(errors[2].statusCode).toBe(403);
      expect(errors[3].statusCode).toBe(500);
    });

    it('should have a stack trace', () => {
      const error = new ApiRequestError('Test', 500, 'TEST');
      expect(error.stack).toBeDefined();
    });
  });

  describe('api methods', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('api.get should call fetch with GET method', async () => {
      const mockData = { data: [{ id: '1', name: 'Test' }] };
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response);

      const result = await api.get('/api/machines');
      expect(result).toEqual(mockData.data);
      expect(fetch).toHaveBeenCalledWith('/api/machines', expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }));
    });

    it('api.post should call fetch with POST method and body', async () => {
      const mockData = { data: { id: '1', name: 'New Machine' } };
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response);

      const body = { name: 'Torno CNC', code: 'TRN-001' };
      const result = await api.post('/api/machines', body);

      expect(result).toEqual(mockData.data);
      expect(fetch).toHaveBeenCalledWith('/api/machines', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(body),
      }));
    });

    it('api.put should call fetch with PUT method and body', async () => {
      const mockData = { data: { id: '1', name: 'Updated' } };
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response);

      const body = { name: 'Updated Machine' };
      const result = await api.put('/api/machines/1', body);

      expect(result).toEqual(mockData.data);
      expect(fetch).toHaveBeenCalledWith('/api/machines/1', expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(body),
      }));
    });

    it('api.delete should call fetch with DELETE method', async () => {
      const mockData = { data: { success: true } };
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      } as Response);

      const result = await api.delete('/api/machines/1');
      expect(result).toEqual(mockData.data);
      expect(fetch).toHaveBeenCalledWith('/api/machines/1', expect.objectContaining({
        method: 'DELETE',
      }));
    });

    it('should throw ApiRequestError on non-ok response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({
          message: 'Not found',
          statusCode: 404,
          error: 'NOT_FOUND',
        }),
      } as Response);

      await expect(api.get('/api/machines/999')).rejects.toThrow(ApiRequestError);
      await expect(api.get('/api/machines/999')).rejects.toThrow('Not found');
    });
  });
});
