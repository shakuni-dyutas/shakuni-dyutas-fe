import { describe, expect, test } from 'vitest';

import { sanitizeRedirectPath } from './sanitize-redirect-path';

describe('sanitizeRedirectPath', () => {
  test('허용되는 절대 경로는 반환한다', () => {
    expect(sanitizeRedirectPath('/profile')).toBe('/profile');
    expect(sanitizeRedirectPath('/foo/bar')).toBe('/foo/bar');
  });

  test('상대 경로는 undefined를 반환한다', () => {
    expect(sanitizeRedirectPath('profile')).toBeUndefined();
    expect(sanitizeRedirectPath('../profile')).toBeUndefined();
  });

  test('이중 슬래시가 포함되면 차단한다', () => {
    expect(sanitizeRedirectPath('//evil')).toBeUndefined();
    expect(sanitizeRedirectPath('%2F%2Fevil')).toBeUndefined();
  });

  test('백슬래시 포함 값은 차단한다', () => {
    expect(sanitizeRedirectPath('/\\windows')).toBeUndefined();
  });

  test('스킴이 포함된 값은 차단한다', () => {
    expect(sanitizeRedirectPath('http://evil.com')).toBeUndefined();
  });

  test('경로 정규화 결과가 루트를 벗어나면 차단한다', () => {
    expect(sanitizeRedirectPath('/../../etc/passwd')).toBeUndefined();
  });

  test('경로 정규화로 안전한 경로는 허용한다', () => {
    expect(sanitizeRedirectPath('/foo/../bar')).toBe('/bar');
  });
});
