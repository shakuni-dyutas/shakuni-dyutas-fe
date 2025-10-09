function decodeIteratively(value: string) {
  let current = value;

  while (true) {
    try {
      const decoded = decodeURIComponent(current);

      if (decoded === current) {
        return decoded;
      }

      current = decoded;
    } catch {
      return current;
    }
  }
}

function normalizePath(value: string) {
  const segments = value.split('/');
  const stack: string[] = [];

  for (const segment of segments) {
    if (segment === '' || segment === '.') {
      continue;
    }

    if (segment === '..') {
      if (stack.length === 0) {
        return undefined;
      }

      stack.pop();
      continue;
    }

    stack.push(segment);
  }

  return `/${stack.join('/')}`;
}

function sanitizeRedirectPath(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const decodedPath = decodeIteratively(value);
  const lowerCased = decodedPath.toLowerCase();

  if (!decodedPath.startsWith('/')) {
    return undefined;
  }

  if (decodedPath.includes('//') || lowerCased.includes('%2f%2f')) {
    return undefined;
  }

  if (decodedPath.includes('\\')) {
    return undefined;
  }

  const firstSlashIndex = decodedPath.indexOf('/');
  const colonIndex = decodedPath.indexOf(':');

  if (colonIndex !== -1 && (firstSlashIndex === -1 || colonIndex < firstSlashIndex)) {
    return undefined;
  }

  const normalizedPath = normalizePath(decodedPath);

  if (!normalizedPath || !normalizedPath.startsWith('/')) {
    return undefined;
  }

  return normalizedPath;
}

export { sanitizeRedirectPath };
