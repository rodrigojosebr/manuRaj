/**
 * Input Sanitization Tests
 *
 * Tests for sanitize() and stripTags() utilities.
 * Run with: npx vitest run tests/domain/sanitize.test.ts
 */

import { describe, it, expect } from 'vitest';
import { sanitize, stripTags } from '@manuraj/domain';

describe('sanitize()', () => {
  it('preserves plain text', () => {
    expect(sanitize('Hello world')).toBe('Hello world');
  });

  it('preserves text with special characters', () => {
    expect(sanitize('Peça #42 — "rolamento" (50mm)')).toBe('Peça #42 — "rolamento" (50mm)');
  });

  it('removes <script> tags', () => {
    expect(sanitize('Hello <script>alert("xss")</script> world')).toBe('Hello alert("xss") world');
  });

  it('removes <iframe> tags', () => {
    expect(sanitize('Text <iframe src="evil.com"></iframe> more')).toBe('Text  more');
  });

  it('removes <object> and <embed> tags', () => {
    expect(sanitize('A <object data="x"> B <embed src="y"> C')).toBe('A  B  C');
  });

  it('removes <style> tags', () => {
    expect(sanitize('Text <style>body{display:none}</style> more')).toBe('Text body{display:none} more');
  });

  it('removes <form> tags', () => {
    expect(sanitize('A <form action="/steal"> B </form> C')).toBe('A  B  C');
  });

  it('removes event handlers', () => {
    expect(sanitize('<div onmouseover="steal()">text</div>')).toBe('<div>text</div>');
  });

  it('removes onclick attributes', () => {
    expect(sanitize('<a onclick="evil()">link</a>')).toBe('<a>link</a>');
  });

  it('removes onerror attributes', () => {
    expect(sanitize('<img onerror="alert(1)" src="x">')).toBe('<img src="x">');
  });

  it('removes javascript: URIs', () => {
    expect(sanitize('click javascript:alert(1) here')).toBe('click alert(1) here');
  });

  it('removes data: URIs', () => {
    expect(sanitize('see data:text/html,<script>alert(1)</script>')).toBe('see text/html,alert(1)');
  });

  it('handles case-insensitive tags', () => {
    expect(sanitize('<SCRIPT>evil()</SCRIPT>')).toBe('evil()');
    expect(sanitize('<Script>evil()</Script>')).toBe('evil()');
  });

  it('handles empty string', () => {
    expect(sanitize('')).toBe('');
  });

  it('trims whitespace', () => {
    expect(sanitize('  hello  ')).toBe('hello');
  });

  it('preserves safe HTML tags like <b>, <p>, <br>', () => {
    expect(sanitize('<b>bold</b> and <p>paragraph</p>')).toBe('<b>bold</b> and <p>paragraph</p>');
  });
});

describe('stripTags()', () => {
  it('preserves plain text', () => {
    expect(stripTags('Hello world')).toBe('Hello world');
  });

  it('removes ALL HTML tags', () => {
    expect(stripTags('<b>bold</b> and <i>italic</i>')).toBe('bold and italic');
  });

  it('removes nested tags', () => {
    expect(stripTags('<div><span>text</span></div>')).toBe('text');
  });

  it('removes self-closing tags', () => {
    expect(stripTags('line1<br/>line2')).toBe('line1line2');
  });

  it('removes tags with attributes', () => {
    expect(stripTags('<a href="url">link</a>')).toBe('link');
  });

  it('handles empty string', () => {
    expect(stripTags('')).toBe('');
  });

  it('trims whitespace', () => {
    expect(stripTags('  hello  ')).toBe('hello');
  });

  it('handles script tags', () => {
    expect(stripTags('<script>alert(1)</script>')).toBe('alert(1)');
  });
});
