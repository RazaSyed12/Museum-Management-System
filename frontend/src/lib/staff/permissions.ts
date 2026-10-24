import type { StaffRole } from './types';

export type StaffAction =
  'operate' | 'archive' | 'refund' | 'export' | 'users' | 'settings' | 'contacts';

export const ROLE_ACCESS: Record<StaffAction, readonly StaffRole[]> = {
  operate: ['Admin', 'Manager', 'Staff'],
  archive: ['Admin', 'Manager'],
  refund: ['Admin', 'Manager'],
  export: ['Admin', 'Manager'],
  users: ['Admin'],
  settings: ['Admin'],
  contacts: ['Admin', 'Manager'],
};

export function can(role: StaffRole | undefined, action: StaffAction): boolean {
  return role !== undefined && ROLE_ACCESS[action].includes(role);
}
