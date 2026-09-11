import { randomUUID } from 'node:crypto';
import profile from './users.json';
export function createUser() {
  return { ...profile, email: `qa.${Date.now()}.${randomUUID()}@example.com`, password: `Qa!${randomUUID()}7` };
}
export type SyntheticUser = ReturnType<typeof createUser>;
