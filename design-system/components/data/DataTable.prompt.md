Every staff list — collections, items, events, tickets, bookings, staff users.

```jsx
<DataTable sortKey="updated" sortDir="desc" onSort={setSort}
  columns={[{key:'name',header:'Collection',sortable:true},
            {key:'status',header:'Status',render:r=><StatusBadge tone={r.tone}>{r.status}</StatusBadge>}]}
  rows={rows} empty={<EmptyState title="No collections yet" />} />
```

On mobile the table scrolls horizontally; for primary mobile staff views prefer stacked Cards.
