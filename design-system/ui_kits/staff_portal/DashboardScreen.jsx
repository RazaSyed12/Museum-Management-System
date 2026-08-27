const { StatCard, Button, DataTable, Icon, EmptyState, Alert } = window.HeritageMuseumDesignSystem_5a5154;

function QuickActions({ mode, nav }) {
  const actions = [
    { label:'Create collection', icon:'library-big', to:'CollectionForm' },
    { label:'Create event', icon:'calendar-plus', to:'EventForm' },
    { label:'Add item', icon:'gem', to:'Items' },
    { label:'Manage tickets', icon:'ticket', to:'Tickets' },
  ];
  return (
    <Panel title="Quick actions">
      <div style={{ display:'grid', gridTemplateColumns: mode==='mobile' ? '1fr 1fr' : 'repeat(4,1fr)', gap:'var(--space-3)' }}>
        {actions.map(a => (
          <button key={a.label} type="button" onClick={()=>nav.go(a.to)}
            style={{ display:'grid', gap:'var(--space-3)', justifyItems:'center', textAlign:'center', minHeight:96, padding:'var(--space-4)',
              borderRadius:'var(--radius-md)', border:'1px solid var(--border-subtle)', background:'var(--surface-sunken)', cursor:'pointer',
              font:'var(--weight-semibold) var(--text-sm)/1.3 var(--font-body)', color:'var(--text-heading)' }}>
            <Icon name={a.icon} size={22} color="var(--olive-600)" />{a.label}
          </button>
        ))}
      </div>
    </Panel>
  );
}

function DashboardScreen({ mode, nav }) {
  const S = window.HMS;
  return (
    <StaffPage mode={mode} nav={nav} title="Dashboard" subtitle="Wednesday 26 August · everything is up to date"
      actions={<Button size="sm" iconLeft="plus" onClick={()=>nav.go('EventForm')}>Create event</Button>}>
      <Alert tone="warning" title="One event needs attention" action={<Button size="sm" variant="secondary" onClick={()=>nav.go('Events')}>Review events</Button>}>
        Family fossil workshop is sold out and has 6 people on the waiting list.
      </Alert>
      <div style={{ display:'grid', gridTemplateColumns: mode==='mobile' ? '1fr 1fr' : mode==='tablet' ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap:'var(--space-4)' }}>
        <StatCard label="Active collections" value="11" delta="+1 this month" deltaTone="up" icon="library-big" />
        <StatCard label="Upcoming events" value="12" footnote="3 in the next week" icon="calendar-days" />
        <StatCard label="Tickets booked" value="1,284" delta="+12% this week" deltaTone="up" icon="ticket" />
        <StatCard label="Tickets remaining" value="416" delta="−8% this week" deltaTone="down" icon="ticket-x" />
      </div>
      <div style={{ display:'grid', gridTemplateColumns: mode==='desktop' ? '1.5fr 1fr' : '1fr', gap:'var(--space-6)', alignItems:'start' }}>
        <Panel title="Upcoming events" description="Next four in the programme"
          actions={<Button size="sm" variant="ghost" iconRight="arrow-right" onClick={()=>nav.go('Events')}>All events</Button>} style={{ overflow:'hidden' }}>
          <DataTable dense
            columns={[
              { key:'name', header:'Event' },
              { key:'start', header:'Starts' },
              { key:'sold', header:'Booked', align:'right', render:r=>`${r.sold} / ${r.capacity}` },
              { key:'status', header:'Status', render:r=><Status value={r.status} /> },
            ]}
            rows={S.events.slice(0,4)} style={{ border:0 }} />
        </Panel>
        <Panel title="Recent activity">
          <ol style={{ listStyle:'none', margin:0, padding:0, display:'grid', gap:'var(--space-4)' }}>
            {S.activity.map((a,i) => (
              <li key={i} style={{ display:'flex', gap:'var(--space-3)' }}>
                <span style={{ display:'grid', placeItems:'center', width:32, height:32, flex:'0 0 auto', borderRadius:'50%', background:'var(--olive-50)' }}>
                  <Icon name={a.icon} size={15} color="var(--olive-600)" />
                </span>
                <span style={{ display:'grid', gap:2 }}>
                  <span style={{ font:'var(--type-body-sm)', color:'var(--text-body)' }}>
                    <strong style={{ color:'var(--text-heading)' }}>{a.who}</strong> {a.what} <strong style={{ color:'var(--text-heading)' }}>{a.target}</strong>
                  </span>
                  <span style={{ font:'var(--type-body-sm)', color:'var(--text-muted)' }}>{a.when}</span>
                </span>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
      <QuickActions mode={mode} nav={nav} />
    </StaffPage>
  );
}

Object.assign(window, { DashboardScreen, QuickActions });
