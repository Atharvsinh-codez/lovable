import { promises as fs } from 'fs';
import path from 'path';

export class PathValidationError extends Error {
  constructor(message: string, public paramName: string, public attemptedValue: string) {
    super(message);
    this.name = 'PathValidationError';
  }
}

export function sanitizePathSegment(segment: string | null | undefined, paramName: string): string {
  if (!segment || typeof segment !== 'string') {
    throw new PathValidationError(
      `${paramName} is required and must be a string`,
      paramName,
      String(segment)
    );
  }

  if (segment.length === 0) {
    throw new PathValidationError(
      `${paramName} cannot be empty`,
      paramName,
      segment
    );
  }

  if (segment.length > 255) {
    throw new PathValidationError(
      `${paramName} exceeds maximum length of 255 characters`,
      paramName,
      segment
    );
  }

  if (segment.includes('..')) {
    console.warn(`[SECURITY] Path traversal attempt detected in ${paramName}: "${segment}"`);
    throw new PathValidationError(
      `${paramName} contains forbidden parent directory reference (..)`,
      paramName,
      segment
    );
  }

  if (segment.includes('/') || segment.includes('\\')) {
    console.warn(`[SECURITY] Path separator detected in ${paramName}: "${segment}"`);
    throw new PathValidationError(
      `${paramName} contains forbidden path separators (/ or \\)`,
      paramName,
      segment
    );
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(segment)) {
    console.warn(`[SECURITY] Invalid characters detected in ${paramName}: "${segment}"`);
    throw new PathValidationError(
      `${paramName} contains invalid characters. Only alphanumeric, hyphens, and underscores are allowed`,
      paramName,
      segment
    );
  }

  if (segment.startsWith('.') || segment.endsWith('.')) {
    throw new PathValidationError(
      `${paramName} cannot start or end with a dot`,
      paramName,
      segment
    );
  }

  const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
  if (reservedNames.includes(segment.toUpperCase())) {
    throw new PathValidationError(
      `${paramName} uses a reserved system name`,
      paramName,
      segment
    );
  }

  return segment;
}

export async function verifyPathWithinBase(fullPath: string, basePath: string): Promise<void> {
  const resolvedPath = path.resolve(fullPath);
  const resolvedBase = path.resolve(basePath);

  if (!resolvedPath.startsWith(resolvedBase)) {
    console.error(`[SECURITY] Path traversal detected: "${resolvedPath}" is outside base "${resolvedBase}"`);
    throw new PathValidationError(
      'Access denied: path is outside allowed directory',
      'path',
      fullPath
    );
  }

  try {
    const stats = await fs.lstat(resolvedPath);
    if (stats.isSymbolicLink()) {
      const linkTarget = await fs.readlink(resolvedPath);
      const targetPath = path.resolve(path.dirname(resolvedPath), linkTarget);
      
      if (!targetPath.startsWith(resolvedBase)) {
        console.error(`[SECURITY] Symlink attack detected: "${resolvedPath}" -> "${targetPath}" is outside base "${resolvedBase}"`);
        throw new PathValidationError(
          'Access denied: symlink target is outside allowed directory',
          'path',
          fullPath
        );
      }
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
}

export function buildSafePath(basePath: string, ...segments: string[]): string {
  const joinedPath = path.join(basePath, ...segments);
  const resolvedPath = path.resolve(joinedPath);
  const resolvedBase = path.resolve(basePath);

  if (!resolvedPath.startsWith(resolvedBase)) {
    console.error(`[SECURITY] Path construction resulted in traversal: "${resolvedPath}" is outside base "${resolvedBase}"`);
    throw new PathValidationError(
      'Invalid path: constructed path is outside allowed directory',
      'path',
      joinedPath
    );
  }

  return resolvedPath;
}
