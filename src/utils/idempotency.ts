import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique idempotency key for API requests
 * Used to prevent duplicate order submissions
 */
export const generateIdempotencyKey = (): string => {
  return uuidv4();
};
