import { notFound } from 'next/navigation';
import { RecordScreen } from '@/components/staff/RecordScreen';
import { RECORDS } from '@/components/staff/records';
import type { Resource } from '@/lib/staff/types';
import { staffUsesBackend } from '@/lib/staff/config';
import { isLiveResource } from '@/lib/staff/backend-resources';
import { LiveRecordScreen } from '@/components/staff/LiveRecordScreen';

export default async function StaffRecordsPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string; record?: string[] }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { section, record = [] } = await params;
  const query = await searchParams;
  if (
    !(staffUsesBackend() ? isLiveResource(section) : Object.hasOwn(RECORDS, section)) ||
    record.length > 2 ||
    (record.length === 2 && record[1] !== 'edit') ||
    (record[0] === 'new' && record.length > 1)
  )
    notFound();
  if (staffUsesBackend() && isLiveResource(section))
    return (
      <LiveRecordScreen
        key={`${section}/${record.join('/')}`}
        resource={section}
        segments={record}
        saved={query.saved === '1'}
      />
    );
  return (
    <RecordScreen
      key={`${section}/${record.join('/')}`}
      resource={section as Resource}
      segments={record}
      saved={query.saved === '1'}
    />
  );
}
