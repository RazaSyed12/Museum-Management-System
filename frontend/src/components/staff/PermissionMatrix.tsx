import { DataTable } from '@/components/data/DataTable';
import { Panel } from './Shared';

const rows = [
  {
    id: 'operations',
    feature: 'View, create and edit operational records',
    admin: 'Yes',
    manager: 'Yes',
    staff: 'Yes',
  },
  {
    id: 'archive',
    feature: 'Archive records and cancel events',
    admin: 'Yes',
    manager: 'Yes',
    staff: 'No',
  },
  {
    id: 'booking',
    feature: 'Create/cancel bookings and record visits',
    admin: 'Yes',
    manager: 'Yes',
    staff: 'Yes',
  },
  {
    id: 'refund',
    feature: 'Record prototype refunds',
    admin: 'Yes',
    manager: 'Yes',
    staff: 'No',
  },
  {
    id: 'report',
    feature: 'View reports',
    admin: 'Yes',
    manager: 'Yes',
    staff: 'Yes',
  },
  {
    id: 'export',
    feature: 'Export reports',
    admin: 'Yes',
    manager: 'Yes',
    staff: 'No',
  },
  {
    id: 'contact',
    feature: 'Museum details and notification preferences',
    admin: 'Edit',
    manager: 'Edit',
    staff: 'View',
  },
  {
    id: 'settings',
    feature: 'Prices, plans and booking rules',
    admin: 'Edit',
    manager: 'View',
    staff: 'No',
  },
  {
    id: 'users',
    feature: 'Staff accounts and system settings',
    admin: 'Yes',
    manager: 'No',
    staff: 'No',
  },
];

export function PermissionMatrix() {
  return (
    <Panel title="Three roles, clear responsibilities">
      <p className="mb-5 text-sm text-muted">
        Access follows this fixed matrix. Assign a role on the staff account; permissions are
        enforced by the backend.
      </p>
      <DataTable
        rows={rows}
        columns={[
          { key: 'feature', header: 'Feature' },
          { key: 'admin', header: 'Admin' },
          { key: 'manager', header: 'Manager' },
          { key: 'staff', header: 'Staff' },
        ]}
      />
    </Panel>
  );
}
