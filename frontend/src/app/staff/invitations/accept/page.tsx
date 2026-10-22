import { StaffAuth } from '@/components/staff/StaffAuth';
export default async function StaffInvitationPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  return <StaffAuth mode="invite" token={(await searchParams).token} />;
}
