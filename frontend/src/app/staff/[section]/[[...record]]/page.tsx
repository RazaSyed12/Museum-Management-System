import { notFound } from 'next/navigation';
import { RecordScreen } from '@/components/staff/RecordScreen';
import { RECORDS } from '@/components/staff/records';
import type { Resource } from '@/lib/staff/types';

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
    !Object.hasOwn(RECORDS, section) ||
    record.length > 2 ||
    (record.length === 2 && record[1] !== 'edit') ||
    (record[0] === 'new' && record.length > 1)
  )
    notFound();
  return (
    <RecordScreen
      key={`${section}/${record.join('/')}`}
      resource={section as Resource}
      segments={record}
      saved={query.saved === '1'}
    />
  );
}
