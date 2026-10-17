import { SupabaseClient, PostgrestError } from '@supabase/supabase-js';

/**
 * Makes a link table hold exactly `ids` for one owner — e.g. the
 * categories of one event. New links are added first (existing ones
 * are left alone), then links not in `ids` are removed, so a bad id
 * fails before anything the owner already had is lost. Two separate
 * calls, not one transaction: if only the removal fails, the owner
 * keeps a few extra old links rather than losing any.
 *
 * Example: replaceLinks(db, 'event_categories', 'event_id', id, 'category_id', ids)
 */
export async function replaceLinks(
  db: SupabaseClient,
  table: string,
  ownerColumn: string,
  ownerId: string,
  linkColumn: string,
  ids: string[],
): Promise<PostgrestError | null> {
  if (ids.length > 0) {
    const { error } = await db
      .from(table)
      .upsert(
        ids.map((id) => ({ [ownerColumn]: ownerId, [linkColumn]: id })),
        { onConflict: `${ownerColumn},${linkColumn}`, ignoreDuplicates: true },
      );
    if (error) return error;
  }

  let removal = db.from(table).delete().eq(ownerColumn, ownerId);
  if (ids.length > 0) removal = removal.not(linkColumn, 'in', `(${ids.join(',')})`);
  const { error } = await removal;
  return error;
}

/**
 * True when every id is an existing, *active* category. The foreign key
 * only rejects ids that don't exist at all, and staff can see inactive
 * categories through RLS, so the active check has to be explicit.
 * Returns null on a database error.
 */
export async function allCategoriesActive(db: SupabaseClient, ids: string[]): Promise<boolean | null> {
  if (ids.length === 0) return true;
  const { data, error } = await db
    .from('categories')
    .select('category_id')
    .in('category_id', ids)
    .eq('active', true);
  if (error) return null;
  return (data ?? []).length === ids.length;
}
