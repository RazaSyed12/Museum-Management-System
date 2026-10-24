import { StaffAuth } from '@/components/staff/StaffAuth';
export default async function StaffResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  return <StaffAuth mode="reset" token={(await searchParams).token} />;
}
