const { Button, IconButton, CollectionCard, ItemCard, RecommendationCard, EventCard, FilterPanel, SearchField, Select, Pagination, Breadcrumbs, Drawer, Media, StatusBadge, Icon, EmptyState } = window.HeritageMuseumDesignSystem_5a5154;

function useFilters() {
  const [selected, setSelected] = React.useState({ Category:['Prehistory'] });
  const toggle = (g,v) => setSelected(s => {
    const cur = s[g] || [];
    return { ...s, [g]: cur.includes(v) ? cur.filter(x=>x!==v) : [...cur, v] };
  });
  const count = Object.values(selected).reduce((n,a)=>n+a.length,0);
  return { selected, toggle, count, clear: () => setSelected({}) };
}

function CollectionsScreen({ mode, nav }) {
  const { collections, categories, periods } = window.HM;
  const fx = useFilters();
  const [q, setQ] = React.useState('');
  const [drawer, setDrawer] = React.useState(false);
  const groups = [
    { title:'Category', options: categories.map(c => ({ value:c, label:c, count: 4 + c.length })) },
    { title:'Period', options: periods.map(p => ({ value:p, label:p })) },
  ];
  const results = collections.filter(c => !q || c.name.toLowerCase().includes(q.toLowerCase()));
  const filters = <FilterPanel groups={groups} selected={fx.selected} onToggle={fx.toggle} activeCount={fx.count} onClear={fx.clear}
    sortOptions={['Most popular','Recently added','A–Z','Oldest first']} sort="Most popular" />;
  return (
    <Page mode={mode} nav={{ ...nav, active:'Collections' }}>
      <div style={{ background:'var(--surface-sunken)', borderBottom:'1px solid var(--border-subtle)' }}>
        <Container mode={mode} style={{ padding: mode==='mobile' ? 'var(--space-6) var(--container-pad-mobile)' : 'var(--space-10) var(--container-pad-desktop)' }}>
          <Breadcrumbs items={['Home','Collections']} style={{ marginBottom:'var(--space-4)' }} />
          <h1 style={{ font: mode==='mobile' ? 'var(--weight-regular) var(--text-3xl)/1.1 var(--font-display)' : 'var(--type-h1)', marginBottom:'var(--space-3)' }}>Collections</h1>
          <p style={{ font:'var(--type-body)', maxWidth:560, marginBottom:'var(--space-6)' }}>Eleven permanent collections, from the Pleistocene to the nineteenth century. Filter by category or period to narrow things down.</p>
          <div style={{ display:'flex', gap:'var(--space-3)', flexWrap:'wrap', alignItems:'center' }}>
            <SearchField id="col-search" value={q} onChange={e=>setQ(e.target.value)} onClear={()=>setQ('')}
              placeholder="Search collections" style={{ flex:'1 1 280px', maxWidth:420 }} />
            {mode !== 'desktop' && (
              <Button variant="secondary" iconLeft="sliders-horizontal" onClick={()=>setDrawer(true)}>
                Filters{fx.count ? ` (${fx.count})` : ''}
              </Button>
            )}
            {mode === 'desktop' && <Select options={['Most popular','Recently added','A–Z']} style={{ width:200 }} />}
          </div>
        </Container>
      </div>
      <Container mode={mode} style={{ padding: mode==='mobile' ? 'var(--space-8) var(--container-pad-mobile)' : 'var(--space-12) var(--container-pad-desktop)' }}>
        <div style={{ display:'grid', gridTemplateColumns: mode==='desktop' ? '248px 1fr' : '1fr', gap:'var(--space-10)', alignItems:'start' }}>
          {mode === 'desktop' && <div style={{ position:'sticky', top:100 }}>{filters}</div>}
          <div style={{ display:'grid', gap:'var(--space-8)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'var(--space-4)', flexWrap:'wrap' }}>
              <span style={{ font:'var(--type-body-sm)', color:'var(--text-muted)' }}>Showing {results.length} of 11 collections</span>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {(fx.selected.Category||[]).map(c => (
                  <button key={c} type="button" onClick={()=>fx.toggle('Category',c)}
                    style={{ display:'inline-flex', gap:6, alignItems:'center', minHeight:32, padding:'0 10px', borderRadius:'var(--radius-pill)',
                      border:'1px solid var(--olive-300)', background:'var(--olive-50)', color:'var(--olive-700)', cursor:'pointer',
                      font:'var(--weight-semibold) var(--text-xs)/1 var(--font-body)' }}>
                    {c}<Icon name="x" size={12} />
                  </button>
                ))}
              </div>
            </div>
            {results.length ? (
              <Grid mode={mode} desktop={3} tablet={2} mobile={1}>
                {results.map(c => (
                  <CollectionCard key={c.id} name={c.name} category={c.category} period={c.period}
                    description={c.description} itemCount={c.items} tone={c.tone} onClick={()=>nav.go('Collection')} />
                ))}
              </Grid>
            ) : (
              <EmptyState title="No collections match your search" description="Try a different word, or clear your filters."
                action={<Button variant="secondary" onClick={()=>{setQ('');fx.clear();}}>Clear everything</Button>} />
            )}
            {mode === 'desktop'
              ? <Pagination page={1} pages={4} style={{ justifyContent:'center' }} />
              : <Pagination showLoadMore resultLabel={`Showing ${results.length} of 11 collections`} />}
          </div>
        </div>
      </Container>
      <Drawer open={drawer} side="bottom" title="Filter collections" onClose={()=>setDrawer(false)}
        footer={<><Button variant="ghost" fullWidth onClick={fx.clear}>Clear all</Button><Button fullWidth onClick={()=>setDrawer(false)}>Show {results.length} results</Button></>}>
        {filters}
      </Drawer>
    </Page>
  );
}

function DetailHero({ mode, title, eyebrow, meta, description, actions, crumbs }) {
  return (
    <div style={{ position:'relative', background:'var(--green-900)' }}>
      <Media tone="green" radius="0" caption="Collection photography" style={{ position:'absolute', inset:0, height:'100%', aspectRatio:'auto' }} />
      <div style={{ position:'absolute', inset:0, background:'var(--scrim-hero)' }} />
      <Container mode={mode} style={{ position:'relative', padding: mode==='mobile' ? 'var(--space-6) var(--container-pad-mobile) var(--space-10)' : 'var(--space-8) var(--container-pad-desktop) var(--space-16)' }}>
        <div style={{ marginBottom:'var(--space-6)', filter:'invert(1) grayscale(1) brightness(2)' }}><Breadcrumbs items={crumbs} /></div>
        <div style={{ display:'grid', gap:'var(--space-4)', maxWidth:620 }}>
          {eyebrow}
          <h1 style={{ font: mode==='mobile' ? 'var(--weight-regular) var(--text-3xl)/1.1 var(--font-display)' : 'var(--weight-regular) var(--text-5xl)/1.05 var(--font-display)', color:'var(--paper-50)' }}>{title}</h1>
          <p style={{ font:'var(--type-body)', color:'rgba(245,243,233,.86)' }}>{description}</p>
          <div style={{ display:'flex', gap:'var(--space-5)', flexWrap:'wrap', font:'var(--type-body-sm)', color:'var(--sand-300)' }}>{meta}</div>
          {actions && <div style={{ display:'flex', gap:'var(--space-3)', flexWrap:'wrap', marginTop:'var(--space-2)' }}>{actions}</div>}
        </div>
      </Container>
    </div>
  );
}

function MetaItem({ icon, children }) {
  return <span style={{ display:'inline-flex', gap:6, alignItems:'center' }}><Icon name={icon} size={16} />{children}</span>;
}

function CollectionDetailScreen({ mode, nav }) {
  const c = window.HM.collections[2];
  const items = window.HM.items;
  return (
    <Page mode={mode} nav={{ ...nav, active:'Collections' }}>
      <DetailHero mode={mode} crumbs={['Home','Collections',c.name]} title={c.name}
        eyebrow={<div style={{ display:'flex', gap:8 }}><StatusBadge tone="olive" size="sm">{c.category}</StatusBadge><StatusBadge tone="neutral" size="sm" icon="hourglass">{c.period}</StatusBadge></div>}
        description="Ninety-two objects buried together in the third century BCE and found by a farmer in 1974. Together they form the most complete Iron Age deposit in the region."
        meta={<><MetaItem icon="map-pin">{c.location}</MetaItem><MetaItem icon="gem">{c.items} objects</MetaItem><MetaItem icon="clock-4">Allow 45 minutes</MetaItem></>}
        actions={<><Button variant="accent" onClick={()=>nav.go('Item')}>Start with the highlights</Button><Button variant="secondary" style={{ color:'var(--paper-50)', borderColor:'rgba(242,226,166,.5)' }} onClick={()=>nav.go('Tickets')}>Plan your visit</Button></>} />
      <Section mode={mode} title="Objects in this collection" action={<Button variant="ghost" iconRight="arrow-right">All {c.items} objects</Button>}>
        <Grid mode={mode} desktop={4} tablet={3} mobile={2}>
          {items.map(i => <ItemCard key={i.id} name={i.name} period={i.period} date={i.date} description={i.description} onClick={()=>nav.go('Item')} />)}
        </Grid>
      </Section>
      <Section mode={mode} tone="muted" title="Events about this collection">
        <Grid mode={mode} desktop={2} tablet={1} mobile={1}>
          {window.HM.events.slice(1,3).map(e => (
            <EventCard key={e.id} layout={mode==='desktop'?'horizontal':'vertical'} title={e.title} description={e.description}
              date={e.date} time={e.time} location={e.location} price={e.price} free={e.free} availability={e.availability} onBook={()=>nav.go('Tickets')} />
          ))}
        </Grid>
      </Section>
      <Section mode={mode} title="Related collections">
        <Grid mode={mode} desktop={3} tablet={2} mobile={1}>
          {window.HM.collections.slice(3,6).map(x => (
            <CollectionCard key={x.id} name={x.name} category={x.category} period={x.period} description={x.description} itemCount={x.items} tone={x.tone} />
          ))}
        </Grid>
      </Section>
    </Page>
  );
}

function ItemDetailScreen({ mode, nav }) {
  const it = window.HM.items[0];
  const [shot, setShot] = React.useState(0);
  const facts = [
    ['Historical period', it.period], ['Approximate date', it.date], ['Origin', it.origin],
    ['Category', 'Archaeology'], ['Collection', it.collection], ['On display', it.location],
    ['Materials', 'Cast bronze with iron rivets'], ['Accession number', 'HM.1974.0041'],
  ];
  return (
    <Page mode={mode} nav={{ ...nav, active:'Collections' }}>
      <Container mode={mode} style={{ padding: mode==='mobile' ? 'var(--space-5) var(--container-pad-mobile) var(--space-10)' : 'var(--space-8) var(--container-pad-desktop) var(--space-16)' }}>
        <Breadcrumbs items={['Home','Collections',it.collection,it.name]} style={{ marginBottom:'var(--space-6)' }} />
        <div style={{ display:'grid', gridTemplateColumns: mode==='desktop' ? '1.1fr 1fr' : '1fr', gap:'var(--space-10)', alignItems:'start' }}>
          <div style={{ display:'grid', gap:'var(--space-3)' }}>
            <Media ratio="4 / 3" tone={['stone','olive','green','sand'][shot]} caption={`${it.name} — view ${shot+1}`} />
            <div style={{ display:'flex', gap:'var(--space-3)' }}>
              {[0,1,2,3].map(i => (
                <button key={i} type="button" onClick={()=>setShot(i)} aria-label={`View ${i+1}`}
                  style={{ flex:1, padding:0, border: '2px solid ' + (i===shot ? 'var(--olive-500)' : 'transparent'), borderRadius:'var(--radius-md)', background:'transparent', cursor:'pointer', overflow:'hidden' }}>
                  <Media ratio="1 / 1" tone={['stone','olive','green','sand'][i]} caption="" radius="var(--radius-sm)" />
                </button>
              ))}
            </div>
          </div>
          <div style={{ display:'grid', gap:'var(--space-5)' }}>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <StatusBadge tone="olive" size="sm">Archaeology</StatusBadge>
              <StatusBadge tone="neutral" size="sm" icon="hourglass">{it.period}</StatusBadge>
              <StatusBadge tone="success" size="sm" icon="eye">On display</StatusBadge>
            </div>
            <h1 style={{ font: mode==='mobile' ? 'var(--weight-regular) var(--text-3xl)/1.1 var(--font-display)' : 'var(--type-h1)' }}>{it.name}</h1>
            <p style={{ font:'var(--type-body)' }}>Cast in a single piece and never worn in battle, this helmet was placed at the centre of the hoard, upturned and filled with river silt. The crest was hammered separately and riveted on — the join is still visible under raking light.</p>
            <dl style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:'var(--space-3) var(--space-6)', margin:0, padding:'var(--space-5) 0', borderTop:'1px solid var(--border-subtle)', borderBottom:'1px solid var(--border-subtle)' }}>
              {facts.map(([k,v]) => (
                <React.Fragment key={k}>
                  <dt style={{ font:'var(--weight-semibold) var(--text-xs)/1.4 var(--font-body)', letterSpacing:'var(--tracking-wide)', textTransform:'uppercase', color:'var(--text-muted)' }}>{k}</dt>
                  <dd style={{ margin:0, font:'var(--type-body-sm)', color:'var(--text-heading)' }}>{v}</dd>
                </React.Fragment>
              ))}
            </dl>
            <div style={{ display:'flex', gap:'var(--space-3)', flexWrap:'wrap' }}>
              <Button iconLeft="map" onClick={()=>nav.go('Collection')}>Find it in the gallery</Button>
              <Button variant="secondary" iconLeft="bookmark">Save to your list</Button>
            </div>
          </div>
        </div>
      </Container>
      <Section mode={mode} tone="muted" title="Related objects">
        <Grid mode={mode} desktop={4} tablet={3} mobile={2}>
          {window.HM.items.slice(1,5).map(i => <ItemCard key={i.id} name={i.name} period={i.period} date={i.date} description={i.description} />)}
        </Grid>
      </Section>
      <Section mode={mode} title="You may also like">
        <Grid mode={mode} desktop={2} tablet={2} mobile={1}>
          <RecommendationCard kind="Collection" title="Coin & Currency" reason="Often viewed with The Lanthorn Hoard" tone="sand" />
          <RecommendationCard kind="Event" title="Curator talk: Reading the Lanthorn Hoard" reason="Archaeology, this month" tone="stone" />
        </Grid>
      </Section>
    </Page>
  );
}

Object.assign(window, { CollectionsScreen, CollectionDetailScreen, ItemDetailScreen, DetailHero, MetaItem });
