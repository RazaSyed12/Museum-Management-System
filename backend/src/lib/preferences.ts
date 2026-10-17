import { SupabaseClient } from '@supabase/supabase-js';
import { Role } from '../middleware/auth';

/**
 * A user's interest picks from the onboarding page, joined to the
 * category itself. `categories!inner(...)` makes it an inner join, so
 * combined with the `categories.active = true` filter below, a pick
 * whose category staff have since deactivated simply drops out — it
 * is neither shown to the user nor counted towards onboarding.
 */
const PICK_SELECT = 'category_id, categories!inner(category_id, name, description, parent_category_id, active)';

export interface PickedCategory {
  category_id: string;
  name: string;
  description: string | null;
  parent_category_id: string | null;
}

/** The user's active picks, sorted by name. Throws on a database error. */
export async function loadPreferences(db: SupabaseClient, userId: string): Promise<PickedCategory[]> {
  const { data, error } = await db
    .from('user_preferences')
    .select(PICK_SELECT)
    .eq('user_id', userId)
    .eq('categories.active', true);
  if (error) throw error;

  return (data ?? [])
    .map((row: any) => {
      const { active, ...category } = row.categories;
      return category as PickedCategory;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Onboarding can't be skipped, so "finished onboarding" is the same as
 * "has at least one active pick" — no separate flag column is needed.
 * Staff never go through onboarding. If every category a user picked
 * is later deactivated, this turns false again and the frontend sends
 * them back to the preferences page instead of leaving them with no
 * recommendations. Throws on a database error.
 */
export async function isOnboardingCompleted(db: SupabaseClient, userId: string, role: Role): Promise<boolean> {
  if (role === 'staff') return true;

  const { count, error } = await db
    .from('user_preferences')
    .select('category_id, categories!inner(active)', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('categories.active', true);
  if (error) throw error;

  return (count ?? 0) > 0;
}
