import { SupabaseClient } from '@supabase/supabase-js';

/** Public stock never includes expired holds and never exposes booking identities. */
export async function eventAvailability(db: SupabaseClient, rows: any[]): Promise<any[] | null> {
  if (!rows.length) return [];
  const { data, error } = await db.rpc('event_allocations', { p_event_ids: rows.map((row) => row.event_id) });
  if (error) return null;
  return rows.map((row) => {
    const allocations = (data ?? []).filter((a: any) => a.event_id === row.event_id);
    const remaining = allocations.reduce((sum: number, a: any) => sum + a.available, 0);
    const availability = row.status === 'cancelled' ? 'cancelled'
      : row.status !== 'scheduled' || new Date(row.start_at) <= new Date() ? 'completed'
      : !allocations.length ? 'notonsale' : remaining <= 0 ? 'soldout'
      : remaining <= 10 ? 'limited' : 'available';
    return { ...row, remaining, availability };
  });
}
