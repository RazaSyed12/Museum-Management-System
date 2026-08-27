const { Button, CollectionCard, EventCard, RecommendationCard, Icon, StatusBadge, Media } = window.HeritageMuseumDesignSystem_5a5154;

function Hero({ mode, go }) {
  const e = window.HM.events.find(x => x.id === 'beneath');
  const small = mode === 'mobile';
  return (
    <section style={{ position:'relative', background:'var(--green-900)', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0 }}>
        <Media tone="green" ratio="auto" radius="0" caption="Exhibition photography — Great Hall" style={{ height:'100%', aspectRatio:'auto' }} />
        <div style={{ position:'absolute', inset:0, background: small ? 'var(--scrim-image)' : 'var(--scrim-hero)' }} />
      </div>
      <Container mode={mode} style={{ position:'relative' }}>
        <div style={{ maxWidth: small ? '100%' : 560, padding: small ? 'var(--space-16) 0 var(--space-10)' : 'var(--space-24) 0', display:'grid', gap:'var(--space-5)' }}>
          <span style={{ font:'var(--type-eyebrow)', letterSpacing:'var(--tracking-wider)', textTransform:'uppercase', color:'var(--sand-300)' }}>Current exhibition</span>
          <h1 style={{ font: small ? 'var(--weight-regular) var(--text-4xl)/1.05 var(--font-display)' : 'var(--weight-regular) var(--text-6xl)/1.05 var(--font-display)', color:'var(--paper-50)' }}>{e.title}</h1>
          <p style={{ font:'var(--type-body)', fontSize: small ? 16 : 18, color:'rgba(245,243,233,.86)', maxWidth:480 }}>{e.description}</p>
          <div style={{ display:'flex', gap:'var(--space-4)', alignItems:'center', font:'var(--type-body-sm)', color:'var(--sand-300)', flexWrap:'wrap' }}>
            <span style={{ display:'inline-flex', gap:6, alignItems:'center' }}><Icon name="calendar-days" size={16} />3 Jul 2026 – 3 Jan 2027</span>
            <span style={{ display:'inline-flex', gap:6, alignItems:'center' }}><Icon name="map-pin" size={16} />Exhibition Wing</span>
          </div>
          <div style={{ display:'flex', gap:'var(--space-3)', flexWrap:'wrap', marginTop:'var(--space-2)' }}>
            <Button variant="accent" size={small?'md':'lg'} onClick={()=>go('Collection')}>Explore exhibition</Button>
            <Button variant="secondary" size={small?'md':'lg'} onClick={()=>go('Tickets')}
              style={{ color:'var(--paper-50)', borderColor:'rgba(242,226,166,.5)' }}>Book tickets</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

function VisitStrip({ mode }) {
  const cells = [
    { icon:'clock', title:'Open today', body:'10:00 – 17:30 · last entry 16:45' },
    { icon:'ticket', title:'General admission', body:'Free · exhibitions ticketed separately' },
    { icon:'map-pin', title:'18 Lanthorn Street', body:'Six minutes from Lanthorn Bridge station' },
    { icon:'accessibility', title:'Step-free throughout', body:'BSL tours on the first Saturday' },
  ];
  return (
    <div style={{ background:'var(--surface-inverse)', borderTop:'1px solid rgba(242,226,166,.18)' }}>
      <Container mode={mode}>
        <div style={{ display:'grid', gridTemplateColumns: mode==='mobile' ? '1fr' : mode==='tablet' ? '1fr 1fr' : 'repeat(4,1fr)', gap:'var(--space-6)', padding:'var(--space-6) 0' }}>
          {cells.map(c => (
            <div key={c.title} style={{ display:'flex', gap:'var(--space-3)', alignItems:'flex-start' }}>
              <Icon name={c.icon} size={20} color="var(--sand-300)" />
              <span style={{ display:'grid', gap:2 }}>
                <span style={{ font:'var(--type-label)', color:'var(--paper-50)' }}>{c.title}</span>
                <span style={{ font:'var(--type-body-sm)', color:'rgba(245,243,233,.66)' }}>{c.body}</span>
              </span>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

function MembershipPromo({ mode, isMember, go }) {
  return (
    <Section mode={mode} tone="accent">
      <div style={{ display:'grid', gridTemplateColumns: mode==='desktop' ? '1.3fr 1fr' : '1fr', gap:'var(--space-10)', alignItems:'center' }}>
        <div style={{ display:'grid', gap:'var(--space-4)' }}>
          <span style={{ font:'var(--type-eyebrow)', letterSpacing:'var(--tracking-wider)', textTransform:'uppercase', color:'var(--gold-700)' }}>
            {isMember ? 'Your membership' : 'Membership'}
          </span>
          <h2 style={{ font:'var(--type-h2)' }}>{isMember ? 'Thank you for supporting the museum' : 'See more, pay less, come back often'}</h2>
          <p style={{ font:'var(--type-body)', maxWidth:520 }}>
            {isMember
              ? 'Your member price is applied automatically at checkout, and member tickets are held for you until 48 hours before each event.'
              : 'Members pay a reduced price on every ticketed event, book from a reserved allocation, and see new exhibitions a week early.'}
          </p>
          <div style={{ display:'flex', gap:'var(--space-3)', flexWrap:'wrap' }}>
            {isMember
              ? <><StatusBadge tone="member">Active member</StatusBadge><Button variant="secondary" onClick={()=>go('Membership')}>View your benefits</Button></>
              : <><Button onClick={()=>go('Membership')}>Become a member</Button><Button variant="ghost" onClick={()=>go('Membership')}>Compare benefits</Button></>}
          </div>
        </div>
        {mode === 'desktop' && <Media ratio="4 / 3" tone="sand" caption="Members' evening, Great Hall" />}
      </div>
    </Section>
  );
}

function HomeScreen({ mode, nav }) {
  const { collections, events } = window.HM;
  const signedIn = !!nav.user;
  const recs = [
    { title:'Ice Age Britain', kind:'Collection', reason:'Because you explored Prehistory', tone:'olive' },
    { title:'Age of Dinosaurs', kind:'Collection', reason:'Similar to the fossils you viewed', tone:'green' },
    { title:'Curator talk: Reading the Lanthorn Hoard', kind:'Event', reason:'Archaeology, near you this month', tone:'stone' },
    { title:'Coin & Currency', kind:'Collection', reason:'Often viewed with The Lanthorn Hoard', tone:'sand' },
  ];
  const popular = [
    { title:'The Lanthorn Hoard', kind:'Collection', reason:'Most visited this month', tone:'stone' },
    { title:'Age of Dinosaurs', kind:'Collection', reason:'Popular with families', tone:'green' },
    { title:'Twilight at the Museum', kind:'Event', reason:'Selling quickly', tone:'olive' },
    { title:'Medieval Armoury', kind:'Collection', reason:'Trending this week', tone:'sand' },
  ];
  const rail = signedIn ? recs : popular;
  return (
    <Page mode={mode} nav={{ ...nav, active:'Home' }}>
      <Hero mode={mode} go={nav.go} />
      <VisitStrip mode={mode} />
      <Section mode={mode} eyebrow="Collections" title="Featured collections"
        action={<Button variant="ghost" iconRight="arrow-right" onClick={()=>nav.go('Collections')}>All collections</Button>}>
        <Grid mode={mode} desktop={3} tablet={2} mobile={1}>
          {collections.slice(0,3).map(c => (
            <CollectionCard key={c.id} name={c.name} category={c.category} period={c.period}
              description={c.description} itemCount={c.items} tone={c.tone} onClick={()=>nav.go('Collection')} />
          ))}
        </Grid>
      </Section>
      <Section mode={mode} tone="muted" eyebrow="What's on" title="Events and exhibitions"
        action={<Button variant="ghost" iconRight="arrow-right" onClick={()=>nav.go('Events')}>See what's on</Button>}>
        <Grid mode={mode} desktop={3} tablet={2} mobile={1}>
          {events.slice(0,3).map(e => (
            <EventCard key={e.id} title={e.title} description={e.description} date={e.date} time={e.time}
              location={e.location} price={e.price} free={e.free} availability={e.availability} onBook={()=>nav.go('Tickets')} />
          ))}
        </Grid>
      </Section>
      <Section mode={mode}
        eyebrow={signedIn ? 'For you' : 'Popular right now'}
        title={signedIn ? `Recommended for ${nav.user.name.split(' ')[0]}` : 'What other visitors are exploring'}>
        <Grid mode={mode} desktop={2} tablet={2} mobile={1}>
          {rail.map(r => <RecommendationCard key={r.title} {...r} reason={signedIn ? r.reason : undefined} />)}
        </Grid>
        {!signedIn && (
          <p style={{ marginTop:'var(--space-6)', font:'var(--type-body-sm)', color:'var(--text-muted)' }}>
            <a href="#" onClick={e=>{e.preventDefault();nav.go('SignIn');}}>Sign in</a> to see recommendations based on what you have explored.
          </p>
        )}
      </Section>
      <MembershipPromo mode={mode} isMember={nav.isMember} go={nav.go} />
    </Page>
  );
}

Object.assign(window, { HomeScreen, Hero, VisitStrip, MembershipPromo });
