'use client';

import { Alert } from '@/components/feedback/Alert';
import { staffApi } from '@/lib/api/staff';
import { useStaffSession } from '@/lib/staff/session';
import type { Resource } from '@/lib/staff/types';
import { Loading, RequestError, useStaffData } from './Shared';
import { RecordList } from './RecordList';
import { RecordEditor } from './RecordEditor';
import { RecordDetail } from './RecordDetail';

export function RecordScreen({
  resource,
  segments,
  saved,
}: {
  resource: Resource;
  segments: string[];
  saved: boolean;
}) {
  const { user } = useStaffSession();
  const recordId = segments[0];
  const creating = recordId === 'new';
  const editing = creating || segments[1] === 'edit';
  const denied = resource === 'users' && user?.role !== 'Admin';
  const result = useStaffData(
    async (signal) => {
      if (!recordId || denied) return null;
      const [references, record] = await Promise.all([
        staffApi.references(),
        creating ? Promise.resolve(undefined) : staffApi.get(resource, recordId, signal),
      ]);
      return { references, record };
    },
    [resource, recordId, denied, creating, segments[1]],
  );
  if (denied)
    return (
      <Alert tone="warning" title="Access restricted">
        Only administrators can manage staff accounts.
      </Alert>
    );
  if (!recordId) return <RecordList key={resource} resource={resource} />;
  if (result.error) return <RequestError error={result.error} retry={result.refresh} />;
  if (!result.data) return <Loading />;
  if (editing)
    return (
      <RecordEditor
        key={`${resource}-${recordId}`}
        resource={resource}
        references={result.data.references}
        record={result.data.record}
      />
    );
  if (!result.data.record) return null;
  return (
    <RecordDetail
      resource={resource}
      references={result.data.references}
      record={result.data.record}
      saved={saved}
      refresh={result.refresh}
    />
  );
}
