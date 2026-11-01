'use client';

import { useStaffSession } from '@/lib/staff/session';
import { LIVE_RESOURCES, type LiveResource } from '@/lib/staff/backend-resources';
import { Button } from '@/components/forms/Button';
import { Alert } from '@/components/feedback/Alert';
import { Loading, Panel, RequestError, useStaffData } from './Shared';
import { LiveRecordList } from './LiveRecordList';
import { LiveRecordEditor } from './LiveRecordEditor';
import { LiveRecordDetail } from './LiveRecordDetail';
export function LiveRecordScreen({
  resource,
  segments,
  saved,
}: {
  resource: LiveResource;
  segments: string[];
  saved: boolean;
}) {
  const { user } = useStaffSession();
  if (resource === 'users' && user?.role !== 'Admin')
    return (
      <Alert tone="warning" title="Access restricted">
        Only administrators can manage accounts.
      </Alert>
    );
  if (!segments.length) return <LiveRecordList resource={resource} />;
  const def = LIVE_RESOURCES[resource];
  if ((segments[0] === 'new' && !def.create) || (segments[1] === 'edit' && !def.edit))
    return (
      <Panel>
        <p>This operation is not available for {def.title.toLowerCase()}.</p>
        <Button className="mt-4" as="a" href={`/staff/${resource}`}>
          Back to {def.title.toLowerCase()}
        </Button>
      </Panel>
    );
  return (
    <LiveRecord
      key={`${resource}/${segments.join('/')}`}
      resource={resource}
      segments={segments}
      saved={saved}
    />
  );
}
function LiveRecord({
  resource,
  segments,
  saved,
}: {
  resource: LiveResource;
  segments: string[];
  saved: boolean;
}) {
  const { backend } = useStaffSession();
  const id = segments[0]!;
  const creating = id === 'new';
  const result = useStaffData(
    async (signal) => ({ record: creating ? undefined : await backend.get(resource, id, signal) }),
    [resource, id],
  );
  if (result.error) return <RequestError error={result.error} retry={result.refresh} />;
  if (!result.data) return <Loading />;
  return creating || segments[1] === 'edit' ? (
    <LiveRecordEditor resource={resource} record={result.data.record} />
  ) : (
    <LiveRecordDetail
      resource={resource}
      record={result.data.record!}
      saved={saved}
      refresh={result.refresh}
    />
  );
}
