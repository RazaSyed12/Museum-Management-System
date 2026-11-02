import { notFound } from 'next/navigation';
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
    !isLiveResource(section) ||
    record.length > 2 ||
    (record.length === 2 && record[1] !== 'edit') ||
    (record[0] === 'new' && record.length > 1)
  )
    notFound();
  return (
    <LiveRecordScreen
      key={`${section}/${record.join('/')}`}
      resource={section}
      segments={record}
      saved={query.saved === '1'}
    />
  );
}
