const { Button, EventCard, Tabs, FilterPanel, SearchField, Drawer, Breadcrumbs, StatusBadge, Icon, Media, Alert, CollectionCard, Pagination } = window.HeritageMuseumDesignSystem_5a5154;

function EventsScreen({ mode, nav }) {
  const [tab, setTab] = React.useState('now');
  const [drawer, setDrawer] = React.useState(false);
  const events = window.HM.events;
  const groups = [
    { title:'When', options:['This week','This month','Next three months'] },
    { title:'Type', options:['Exhibition','Talk','Workshop','Family','Late opening'] },
    { title:'Price', options:['Free','Paid','Member price'] },
    { title:'Availability', options:['Tickets available','Limited','Include sold out'] },
  ];
  const filters = <FilterPanel groups={groups} selected={{ Price:['Free'] }} activeCount={1} onClear={()=>{}}
    sortOptions={['Soonest first','Recently added','Price: low to high']} sort="Soonest first" />;
  return (
    <Page mode={mode} nav={{ ...nav, active:'Events' }}>
      <div style={{ background:'var(--surface-sunken)', borderBottom:'1px solid var(--border-subtle)' }}>
        <Container mode={mode} style={{ padding: mode==='mobile' ? 'var(--space-6) var(--container-pad-mobile)' : 'var(--space-10) var(--container-pad-desktop)' }}>
          <Breadcrumbs items={['Home',"What's on"]} style={{ marginBottom:'var(--space-4)' }} />
          <h1 style={{ font: mode==='mobile' ? 'var(--weight-regular) var(--text-3xl)/1.1 var(--font-display)' : 'var(--type-h1)', marginBottom:'var(--space-3)' }}>What's on</h1>
          <p style={{ font:'var(--type-body)', maxWidth:560, marginBottom:'var(--space-6)' }}>Exhibitions, talks, workshops and late openings. Members book from a reserved allocation.</p>
          <div style={{ display:'flex', gap:'var(--space-3)', flexWrap:'wrap', alignItems:'center' }}>
            <Tabs variant="pill" value={tab} onChange={setTab}
              items={[{value:'now',label:'On now',count:4},{value:'soon',label:'Upcoming',count:12},{value:'exh',label:'Exhibitions',count:3},{value:'free',label:'Free',count:6}]} />
            {mode !== 'desktop' && <Button variant="secondary" iconLeft="sliders-horizontal" onClick={()=>setDrawer(true)}>Filters (1)</Button>}
          </div>
        </Container>
      </div>
      <Container mode={mode} style={{ padding: mode==='mobile' ? 'var(--space-8) var(--container-pad-mobile)' : 'var(--space-12) var(--container-pad-desktop)' }}>
        <div style={{ display:'grid', gridTemplateColumns: mode==='desktop' ? '248px 1fr' : '1fr', gap:'var(--space-10)', alignItems:'start' }}>
          {mode === 'desktop' && <div style={{ position:'sticky', top:100 }}>{filters}</div>}
          <div style={{ display:'grid', gap:'var(--space-5)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'var(--space-4)', flexWrap:'wrap' }}>
              <span style={{ font:'var(--type-body-sm)', color:'var(--text-muted)' }}>{events.length} events</span>
              {nav.isMember && <StatusBadge tone="member">Member allocation available on 3 events</StatusBadge>}
            </div>
            {events.map(e => (
              <EventCard key={e.id} layout={mode==='mobile'?'vertical':'horizontal'} title={e.title} description={e.description}
                date={e.date} time={e.time} location={e.location} price={e.price} free={e.free}
                availability={e.availability} onBook={()=>nav.go('Event')} />
            ))}
            <Pagination showLoadMore resultLabel="Showing 5 of 19 events" style={{ marginTop:'var(--space-4)' }} />
          </div>
        </div>
      </Container>
      <Drawer open={drawer} side="bottom" title="Filter events" onClose={()=>setDrawer(false)}
        footer={<><Button variant="ghost" fullWidth>Clear all</Button><Button fullWidth onClick={()=>setDrawer(false)}>Show 5 events</Button></>}>
        {filters}
      </Drawer>
    </Page>
  );
}

function EventDetailScreen({ mode, nav }) {
  const [which, setWhich] = React.useState('twilight');
  const e = window.HM.events.find(x => x.id === which) || window.HM.events[0];
  const cancelled = e.availability === 'cancelled';
  const soldout = e.availability === 'soldout';
  const badge = { available:['success','Tickets available'], limited:['warning',`Limited — ${e.remaining} left`], soldout:['danger','Sold out'], cancelled:['danger','Cancelled'] }[e.availability];
  return (
    <Page mode={mode} nav={{ ...nav, active:'Events' }}>
      <DetailHero mode={mode} crumbs={['Home',"What's on",e.title]} title={e.title}
        eyebrow={<div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <StatusBadge tone={badge[0]} size="sm">{badge[1]}</StatusBadge>
          {e.free && <StatusBadge tone="info" size="sm" icon="gift">Free</StatusBadge>}
          {nav.isMember && !cancelled && <StatusBadge tone="member" size="sm">Member price {e.memberPrice ? '£'+e.memberPrice : 'free'}</StatusBadge>}
        </div>}
        description={e.description}
        meta={<><MetaItem icon="calendar-days">{e.date}</MetaItem><MetaItem icon="clock">{e.time}</MetaItem><MetaItem icon="map-pin">{e.location}</MetaItem><MetaItem icon="banknote">{e.price}</MetaItem></>} />
      <Container mode={mode} style={{ padding: mode==='mobile' ? 'var(--space-8) var(--container-pad-mobile)' : 'var(--space-12) var(--container-pad-desktop)' }}>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:'var(--space-8)' }}>
          <span style={{ font:'var(--type-body-sm)', color:'var(--text-muted)', alignSelf:'center', marginRight:8 }}>Preview state:</span>
          {window.HM.events.map(x => (
            <button key={x.id} type="button" onClick={()=>setWhich(x.id)}
              style={{ minHeight:32, padding:'0 12px', borderRadius:'var(--radius-pill)', cursor:'pointer',
                border:'1px solid ' + (x.id===which?'var(--olive-500)':'var(--border-default)'),
                background: x.id===which?'var(--olive-50)':'var(--surface-card)', color: x.id===which?'var(--olive-700)':'var(--text-muted)',
                font:'var(--weight-semibold) var(--text-xs)/1 var(--font-body)' }}>{x.availability}</button>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns: mode==='desktop' ? '1fr 360px' : '1fr', gap:'var(--space-10)', alignItems:'start' }}>
          <div style={{ display:'grid', gap:'var(--space-6)' }}>
            {cancelled && <Alert tone="danger" title="This event has been cancelled">Everyone who booked has been refunded in full and emailed. Nothing further is needed from you.</Alert>}
            {soldout && <Alert tone="warning" title="This event is sold out">Join the waiting list and we will email you if a place is returned.</Alert>}
            <div style={{ display:'grid', gap:'var(--space-4)' }}>
              <h2 style={{ font:'var(--type-h2)' }}>About this event</h2>
              <p style={{ font:'var(--type-body)' }}>{e.description}</p>
              <p style={{ font:'var(--type-body)' }}>Doors open thirty minutes before the start. The bar in the Great Hall stays open until close, and the exhibition galleries remain accessible throughout.</p>
            </div>
            <div style={{ display:'grid', gap:'var(--space-4)' }}>
              <h3 style={{ font:'var(--type-h3)' }}>Collections featured</h3>
              <Grid mode={mode} desktop={2} tablet={2} mobile={1}>
                {window.HM.collections.slice(2,4).map(c2 => (
                  <CollectionCard key={c2.id} name={c2.name} category={c2.category} period={c2.period} description={c2.description} itemCount={c2.items} tone={c2.tone} />
                ))}
              </Grid>
            </div>
          </div>
          <aside style={{ position: mode==='desktop' ? 'sticky' : 'static', top:100, display:'grid', gap:'var(--space-4)',
            padding:'var(--space-6)', background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-sm)' }}>
            <span style={{ font:'var(--type-eyebrow)', letterSpacing:'var(--tracking-wider)', textTransform:'uppercase', color:'var(--text-muted)' }}>Tickets</span>
            <span style={{ font:'var(--weight-regular) var(--text-3xl)/1 var(--font-display)', color:'var(--text-heading)' }}>{e.free ? 'Free' : '£'+e.priceValue}</span>
            {!e.free && <span style={{ font:'var(--type-body-sm)', color:'var(--gold-700)' }}>Members £{e.memberPrice}</span>}
            <div style={{ display:'grid', gap:'var(--space-2)', padding:'var(--space-4) 0', borderTop:'1px solid var(--border-subtle)', borderBottom:'1px solid var(--border-subtle)' }}>
              <MetaItem icon="calendar-days">{e.date}</MetaItem>
              <MetaItem icon="clock">{e.time}</MetaItem>
              <MetaItem icon="map-pin">{e.location}</MetaItem>
              <MetaItem icon="users">{e.remaining} of {e.capacity} places left</MetaItem>
            </div>
            {cancelled ? <Button disabled fullWidth>Event cancelled</Button>
              : soldout ? <><Button variant="secondary" fullWidth>Join the waiting list</Button><span style={{ font:'var(--type-body-sm)', color:'var(--text-muted)' }}>We release returns 48 hours before.</span></>
              : <><Button fullWidth size="lg" onClick={()=>nav.go('Tickets')}>{e.free ? 'Reserve a place' : 'Book tickets'}</Button>
                  {nav.isMember && <span style={{ display:'flex', gap:6, alignItems:'center', font:'var(--type-body-sm)', color:'var(--gold-700)' }}><Icon name="award" size={15} />Your member price is applied at checkout</span>}</>}
          </aside>
        </div>
      </Container>
    </Page>
  );
}

Object.assign(window, { EventsScreen, EventDetailScreen });
