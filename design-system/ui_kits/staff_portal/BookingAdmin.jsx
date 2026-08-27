const { Button, DataTable, SearchField, Select, Tabs, Modal, Field, Input, Icon, StatusBadge, Checkbox, EmptyState } = window.HeritageMuseumDesignSystem_5a5154;

function BookingsScreen({ mode, nav }) {
  const [tab, setTab] = React.useState('all');
  const rows = window.HMS.bookings.filter(b => tab==='all' || b.status.toLowerCase()===tab);
  return (
    <StaffPage mode={mode} nav={nav} title="Bookings" subtitle="1,284 bookings · £18,420 taken this month"
      actions={<Button size="sm" variant="secondary" iconLeft="download">Export</Button>}>
      <Panel>
        <Toolbar style={{ marginBottom:'var(--space-4)' }}>
          <Tabs variant="pill" value={tab} onChange={setTab}
            items={[{value:'all',label:'All',count:5},{value:'confirmed',label:'Confirmed',count:3},{value:'pending',label:'Pending',count:1},{value:'cancelled',label:'Cancelled',count:1}]} />
          <SearchField id="b-q" size="sm" placeholder="Search by reference or name" style={{ flex:'1 1 220px', maxWidth:300, marginLeft:'auto' }} />
        </Toolbar>
        {rows.length ? (
          <DataTable sortKey="date" sortDir="desc"
            columns={[
              { key:'id', header:'Booking', render:r=><code style={{ font:'400 12px var(--font-mono)', color:'var(--text-heading)' }}>{r.id}</code> },
              { key:'customer', header:'Customer', sortable:true },
              { key:'event', header:'Event' },
              { key:'qty', header:'Tickets', align:'right' },
              { key:'date', header:'Booked', sortable:true },
              { key:'total', header:'Total', align:'right' },
              { key:'payment', header:'Payment', render:r=><Status value={r.payment} /> },
              { key:'status', header:'Status', render:r=><Status value={r.status} /> },
            ]}
            rows={rows} />
        ) : <EmptyState compact title="No bookings in this state" description="Try another tab." />}
      </Panel>
    </StaffPage>
  );
}

function StaffRolesScreen({ mode, nav }) {
  const [role, setRole] = React.useState(null);
  const S = window.HMS;
  return (
    <StaffPage mode={mode} nav={nav} title="Staff & roles" subtitle="Four staff accounts · four roles"
      actions={<Button size="sm" iconLeft="user-plus">Invite staff</Button>}>
      <div style={{ display:'grid', gridTemplateColumns: mode==='desktop' ? '1.4fr 1fr' : '1fr', gap:'var(--space-6)', alignItems:'start' }}>
        <Panel title="Staff accounts">
          <DataTable
            columns={[
              { key:'name', header:'Person', render:r=>(
                <span style={{ display:'flex', gap:'var(--space-3)', alignItems:'center' }}>
                  <span style={{ display:'grid', placeItems:'center', width:32, height:32, borderRadius:'50%', background:'var(--olive-100)', color:'var(--olive-700)', font:'var(--weight-semibold) var(--text-xs)/1 var(--font-body)' }}>
                    {r.name.split(' ').map(w=>w[0]).join('')}
                  </span>
                  <span style={{ display:'grid', gap:1 }}>
                    <strong style={{ font:'var(--type-label)', color:'var(--text-heading)' }}>{r.name}</strong>
                    <span style={{ color:'var(--text-muted)' }}>{r.email}</span>
                  </span>
                </span>) },
              { key:'role', header:'Role', render:r=>(
                <button type="button" onClick={()=>setRole(S.roles.find(x=>x.name===r.role))}
                  style={{ border:0, background:'transparent', cursor:'pointer', padding:0, font:'inherit' }}>
                  <StatusBadge size="sm" tone="olive" icon="shield-check">{r.role}</StatusBadge>
                </button>) },
              { key:'status', header:'Status', render:r=><Status value={r.status} /> },
              { key:'last', header:'Last active' },
              { key:'a', header:'', align:'right', render:()=><Button size="sm" variant="ghost" iconLeft="pencil">Change role</Button> },
            ]}
            rows={S.staff} />
        </Panel>
        <Panel title="Roles" description="Permissions are attached to roles, not people">
          <div style={{ display:'grid', gap:'var(--space-3)' }}>
            {S.roles.map(r => (
              <button key={r.name} type="button" onClick={()=>setRole(r)}
                style={{ display:'grid', gap:'var(--space-2)', textAlign:'left', padding:'var(--space-4)', cursor:'pointer',
                  border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', background:'var(--surface-sunken)' }}>
                <span style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'var(--space-3)' }}>
                  <strong style={{ font:'var(--type-label)', color:'var(--text-heading)' }}>{r.name}</strong>
                  <span style={{ font:'var(--type-body-sm)', color:'var(--text-muted)' }}>{r.people} person</span>
                </span>
                <span style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  {r.permissions.slice(0,3).map(p => (
                    <code key={p} style={{ font:'400 11px/1.6 var(--font-mono)', padding:'2px 6px', borderRadius:'var(--radius-sm)', background:'var(--olive-50)', color:'var(--olive-700)' }}>{p}</code>
                  ))}
                  {r.permissions.length>3 && <span style={{ font:'var(--type-body-sm)', color:'var(--text-muted)' }}>+{r.permissions.length-3} more</span>}
                </span>
              </button>
            ))}
          </div>
        </Panel>
      </div>
      <Modal open={!!role} onClose={()=>setRole(null)} title={role ? role.name : ''} description="Everyone with this role can do the following." width={480}
        footer={<><Button variant="ghost" onClick={()=>setRole(null)}>Close</Button><Button onClick={()=>setRole(null)}>Save permissions</Button></>}>
        <div style={{ display:'grid', gap:'var(--space-2)', paddingBottom:'var(--space-4)' }}>
          {role && ['collection.create','collection.edit','item.manage','category.manage','event.create','event.edit','event.cancel','ticket.manage','booking.view','staff.manage'].map(p => (
            <Checkbox key={p} id={'perm-'+p} checked={role.permissions.some(x => x===p || (x.endsWith('.*') && p.startsWith(x.slice(0,-2))))} onChange={()=>{}}
              label={<code style={{ font:'400 12px var(--font-mono)' }}>{p}</code>} />
          ))}
        </div>
      </Modal>
    </StaffPage>
  );
}

Object.assign(window, { BookingsScreen, StaffRolesScreen });
