import Link from 'next/link';
import { EmptyState } from '@/components/feedback/EmptyState';
import { PageHeading, Panel } from './Shared';

export function StaffUnavailable({ title }: { title: string }) {
  return (
    <>
      <PageHeading title={title} description="Museum staff services" />
      <Panel>
        <EmptyState
          icon="clock"
          title="Not available yet"
          description={`${title} will be available when the museum’s management services are ready.`}
          action={<Link href="/staff/collections">Manage collections</Link>}
        />
      </Panel>
    </>
  );
}
