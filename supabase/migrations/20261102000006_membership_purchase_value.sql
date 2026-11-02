-- Purchases through the payment layer must retain the amount used by reports,
-- just as memberships entered by staff do. Later plan edits must not rewrite it.
create or replace function public.capture_membership_purchase_price()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.purchase_price is null then
    select price into new.purchase_price from public.membership_plans where plan_id = new.plan_id;
  end if;
  return new;
end;
$$;
create trigger memberships_capture_purchase_price before insert on public.memberships
  for each row execute function public.capture_membership_purchase_price();
revoke all on function public.capture_membership_purchase_price() from public, anon, authenticated;

-- Recover historical missing values from recorded transactions, not today's price.
update public.memberships m set purchase_price = (
  select p.amount from public.payments p where p.membership_id = m.membership_id
    and p.payment_status in ('completed', 'refunded') order by p.created_at limit 1
) where m.purchase_price is null;
