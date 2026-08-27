const { Button, Field, Input, Checkbox, Alert, Icon, StatusBadge, Logo, Tabs, DataTable, RecommendationCard, EmptyState, Card } = window.HeritageMuseumDesignSystem_5a5154;

function AuthLayout({ mode, title, intro, children, footer }) {
  const narrow = mode !== 'desktop';
  return (
    <div style={{ display:'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1fr', minHeight:'100%', background:'var(--surface-page)' }}>
      {!narrow && (
        <div style={{ position:'relative', background:'var(--green-900)', display:'grid', alignContent:'end', padding:'var(--space-16)', gap:'var(--space-4)' }}>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,#2A5033 0%,#14231A 100%)' }} />
          <div style={{ position:'relative', display:'grid', gap:'var(--space-6)' }}>
            <img src="../../assets/logo-mark.png" alt="" style={{ height:72, width:'auto' }} />
            <h2 style={{ font:'var(--weight-regular) var(--text-4xl)/1.1 var(--font-display)', color:'var(--paper-50)', maxWidth:420 }}>Heritage lives here.</h2>
            <p style={{ font:'var(--type-body)', color:'rgba(245,243,233,.78)', maxWidth:400 }}>An account keeps your tickets in one place and shapes what we suggest you see next. Membership is separate — and optional.</p>
          </div>
        </div>
      )}
      <div style={{ display:'grid', placeItems:'center', padding: narrow ? 'var(--space-8) var(--container-pad-mobile)' : 'var(--space-16)' }}>
        <div style={{ width:'100%', maxWidth:420, display:'grid', gap:'var(--space-6)' }}>
          <Logo variant="horizontal" height={40} />
          <div style={{ display:'grid', gap:'var(--space-2)' }}>
            <h1 style={{ font:'var(--type-h1)', fontSize:36 }}>{title}</h1>
            {intro && <p style={{ font:'var(--type-body)', color:'var(--text-muted)' }}>{intro}</p>}
          </div>
          {children}
          {footer}
        </div>
      </div>
    </div>
  );
}

function SignInScreen({ mode, nav }) {
  const [err, setErr] = React.useState(false);
  return (
    <AuthLayout mode={mode} title="Sign in" intro="Your tickets, saved objects and recommendations."
      footer={<p style={{ font:'var(--type-body-sm)', color:'var(--text-muted)', textAlign:'center' }}>
        New here? <a href="#" onClick={e=>{e.preventDefault();nav.go('Register');}}>Create an account</a></p>}>
      {err && <Alert tone="danger" title="We couldn't sign you in">Check your email and password, or reset it below.</Alert>}
      <form style={{ display:'grid', gap:'var(--space-5)' }} onSubmit={e=>{e.preventDefault();nav.signIn();}}>
        <Field label="Email address" htmlFor="si-e" required><Input id="si-e" type="email" defaultValue="amara@example.com" /></Field>
        <Field label="Password" htmlFor="si-p" required><Input id="si-p" type="password" defaultValue="••••••••" invalid={err} /></Field>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'var(--space-4)', flexWrap:'wrap' }}>
          <Checkbox id="si-r" label="Remember me" checked onChange={()=>{}} />
          <a href="#" onClick={e=>e.preventDefault()} style={{ font:'var(--type-body-sm)' }}>Forgot your password?</a>
        </div>
        <Button type="submit" size="lg" fullWidth>Sign in</Button>
        <Button type="button" variant="ghost" size="sm" onClick={()=>setErr(!err)}>Preview the error state</Button>
      </form>
    </AuthLayout>
  );
}

function RegisterScreen({ mode, nav }) {
  return (
    <AuthLayout mode={mode} title="Create an account" intro="It takes a minute and keeps every booking in one place."
      footer={<p style={{ font:'var(--type-body-sm)', color:'var(--text-muted)', textAlign:'center' }}>
        Already have one? <a href="#" onClick={e=>{e.preventDefault();nav.go('SignIn');}}>Sign in</a></p>}>
      <Alert tone="info" title="An account is not a membership">Accounts are free. Membership is a paid supporter scheme with discounts and reserved tickets — you can add it later.</Alert>
      <form style={{ display:'grid', gap:'var(--space-5)' }} onSubmit={e=>{e.preventDefault();nav.go('Interests');}}>
        <Field label="Full name" htmlFor="r-n" required><Input id="r-n" placeholder="Amara Okafor" /></Field>
        <Field label="Email address" htmlFor="r-e" required><Input id="r-e" type="email" placeholder="you@example.com" /></Field>
        <Field label="Password" htmlFor="r-p" required hint="At least 10 characters."><Input id="r-p" type="password" /></Field>
        <Field label="Confirm password" htmlFor="r-p2" required><Input id="r-p2" type="password" /></Field>
        <Checkbox id="r-nl" label="Email me what's on" description="Monthly exhibition news. Unsubscribe any time." checked onChange={()=>{}} />
        <Button type="submit" size="lg" fullWidth>Create account</Button>
      </form>
    </AuthLayout>
  );
}

function InterestsScreen({ mode, nav }) {
  const [picked, setPicked] = React.useState(['Prehistory','Archaeology']);
  const toggle = i => setPicked(p => p.includes(i) ? p.filter(x=>x!==i) : [...p,i]);
  const ICONS = { Dinosaurs:'bone', Prehistory:'mountain', 'Ancient History':'landmark', Archaeology:'shovel', Medieval:'castle', Renaissance:'palette', Art:'frame', 'Natural History':'leaf' };
  return (
    <AuthLayout mode={mode} title="What are you interested in?" intro="Pick a few and we'll start you off with collections and events that match. You can change these any time.">
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-3)' }}>
        {window.HM.interests.map(i => {
          const on = picked.includes(i);
          return (
            <button key={i} type="button" onClick={()=>toggle(i)} aria-pressed={on}
              style={{ display:'flex', gap:'var(--space-3)', alignItems:'center', minHeight:56, padding:'0 var(--space-4)', cursor:'pointer',
                borderRadius:'var(--radius-md)', textAlign:'left',
                border:'1px solid ' + (on ? 'var(--olive-500)' : 'var(--border-default)'),
                background: on ? 'var(--olive-50)' : 'var(--surface-card)',
                color: on ? 'var(--olive-700)' : 'var(--text-heading)',
                font:'var(--weight-' + (on ? 'semibold' : 'regular') + ') var(--text-sm)/1.2 var(--font-body)',
                boxShadow: on ? 'var(--ring-focus)' : 'none', transition:'var(--transition-control)' }}>
              <Icon name={ICONS[i]} size={18} color={on ? 'var(--olive-600)' : 'var(--text-muted)'} />
              <span style={{ flex:1 }}>{i}</span>
              {on && <Icon name="check" size={16} />}
            </button>
          );
        })}
      </div>
      <div style={{ display:'grid', gap:'var(--space-3)' }}>
        <Button size="lg" fullWidth disabled={!picked.length} onClick={()=>nav.signIn()}>Save {picked.length} interests</Button>
        <Button variant="ghost" fullWidth onClick={()=>nav.signIn()}>Skip for now</Button>
      </div>
    </AuthLayout>
  );
}

function ProfileScreen({ mode, nav }) {
  const [tab, setTab] = React.useState('bookings');
  const user = nav.user || { name:'Amara Okafor', initials:'AO' };
  return (
    <Page mode={mode} nav={{ ...nav, active:'Profile' }}>
      <div style={{ background:'var(--surface-sunken)', borderBottom:'1px solid var(--border-subtle)' }}>
        <Container mode={mode} style={{ padding: mode==='mobile' ? 'var(--space-8) var(--container-pad-mobile)' : 'var(--space-12) var(--container-pad-desktop)' }}>
          <div style={{ display:'flex', gap:'var(--space-5)', alignItems:'center', flexWrap:'wrap' }}>
            <span style={{ display:'grid', placeItems:'center', width:72, height:72, borderRadius:'50%', background:'var(--green-900)', color:'var(--sand-300)', font:'400 28px/1 var(--font-display)' }}>{user.initials}</span>
            <div style={{ display:'grid', gap:6 }}>
              <h1 style={{ font:'var(--type-h1)', fontSize:36 }}>{user.name}</h1>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {nav.isMember
                  ? <StatusBadge tone="member">Member · renews 4 Mar 2027</StatusBadge>
                  : <StatusBadge tone="neutral" icon="user">Registered visitor</StatusBadge>}
                <StatusBadge tone="neutral" icon="mail">amara@example.com</StatusBadge>
              </div>
            </div>
            <div style={{ marginLeft:'auto', display:'flex', gap:'var(--space-3)' }}>
              {!nav.isMember && <Button variant="accent" onClick={()=>nav.go('Membership')}>Become a member</Button>}
              <Button variant="secondary" onClick={()=>nav.signOut()}>Sign out</Button>
            </div>
          </div>
          <Tabs value={tab} onChange={setTab} style={{ marginTop:'var(--space-8)' }}
            items={[{value:'bookings',label:'Bookings',count:3},{value:'saved',label:'Saved',count:0},{value:'interests',label:'Interests'},{value:'settings',label:'Settings'}]} />
        </Container>
      </div>
      <Container mode={mode} style={{ padding: mode==='mobile' ? 'var(--space-8) var(--container-pad-mobile)' : 'var(--space-12) var(--container-pad-desktop)' }}>
        {tab === 'bookings' && (
          <div style={{ display:'grid', gap:'var(--space-6)' }}>
            <DataTable caption="Your bookings"
              columns={[{key:'ref',header:'Reference'},{key:'event',header:'Event'},{key:'date',header:'Date'},{key:'qty',header:'Tickets',align:'right'},{key:'total',header:'Total',align:'right'},
                {key:'status',header:'Status',render:r=><StatusBadge size="sm" tone={r.status==='Confirmed'?'success':'danger'}>{r.status}</StatusBadge>},
                {key:'a',header:'',align:'right',render:()=><Button size="sm" variant="ghost" iconLeft="qr-code">Ticket</Button>}]}
              rows={window.HM.bookings} />
          </div>
        )}
        {tab === 'saved' && <EmptyState icon="bookmark" title="Nothing saved yet" description="Save an object or an exhibition and it will wait for you here." action={<Button variant="secondary" onClick={()=>nav.go('Collections')}>Browse collections</Button>} />}
        {tab === 'interests' && (
          <div style={{ display:'grid', gap:'var(--space-8)' }}>
            <div style={{ display:'grid', gap:'var(--space-4)' }}>
              <h2 style={{ font:'var(--type-h2)' }}>Your interests</h2>
              <div style={{ display:'flex', gap:'var(--space-2)', flexWrap:'wrap' }}>
                {['Prehistory','Archaeology','Medieval'].map(i => <StatusBadge key={i} tone="olive">{i}</StatusBadge>)}
                <Button size="sm" variant="ghost" iconLeft="pencil" onClick={()=>nav.go('Interests')}>Edit</Button>
              </div>
            </div>
            <div style={{ display:'grid', gap:'var(--space-4)' }}>
              <h2 style={{ font:'var(--type-h2)' }}>Because of what you've explored</h2>
              <Grid mode={mode} desktop={2} tablet={2} mobile={1}>
                <RecommendationCard kind="Collection" title="Ice Age Britain" reason="Because you explored Prehistory" />
                <RecommendationCard kind="Event" title="Curator talk: Reading the Lanthorn Hoard" reason="Archaeology, this month" tone="stone" />
              </Grid>
            </div>
          </div>
        )}
        {tab === 'settings' && (
          <div style={{ display:'grid', gap:'var(--space-5)', maxWidth:520 }}>
            <Field label="Full name" htmlFor="s-n"><Input id="s-n" defaultValue={user.name} /></Field>
            <Field label="Email address" htmlFor="s-e"><Input id="s-e" defaultValue="amara@example.com" /></Field>
            <Checkbox id="s-nl" checked onChange={()=>{}} label="Email me what's on" description="Monthly exhibition news." />
            <Checkbox id="s-rec" checked onChange={()=>{}} label="Use my activity for recommendations" description="Turn this off and we'll show popular content instead." />
            <div style={{ display:'flex', gap:'var(--space-3)' }}><Button>Save changes</Button><Button variant="ghost">Cancel</Button></div>
          </div>
        )}
      </Container>
    </Page>
  );
}

function MembershipScreen({ mode, nav }) {
  const benefits = [
    { icon:'percent', title:'Reduced ticket prices', body:'Roughly a third off every ticketed event, applied automatically at checkout.' },
    { icon:'bookmark-check', title:'Reserved allocation', body:'A block of tickets is held for members on every event until 48 hours before.' },
    { icon:'clock-4', title:'Early access', body:'Book new exhibitions a week before general release.' },
    { icon:'users', title:'Bring a guest', body:'One guest at the member price on every visit.' },
    { icon:'coffee', title:'Ten percent off the café and shop', body:'Including the second-hand book room.' },
    { icon:'mail', title:'Members’ letter', body:'A quarterly letter from the curators, printed and posted.' },
  ];
  return (
    <Page mode={mode} nav={{ ...nav, active:'Membership' }}>
      <div style={{ background:'var(--surface-accent)' }}>
        <Container mode={mode} style={{ padding: mode==='mobile' ? 'var(--space-10) var(--container-pad-mobile)' : 'var(--space-16) var(--container-pad-desktop)' }}>
          <div style={{ display:'grid', gap:'var(--space-4)', maxWidth:600 }}>
            <span style={{ font:'var(--type-eyebrow)', letterSpacing:'var(--tracking-wider)', textTransform:'uppercase', color:'var(--gold-700)' }}>Membership</span>
            <h1 style={{ font: mode==='mobile' ? 'var(--weight-regular) var(--text-4xl)/1.05 var(--font-display)' : 'var(--weight-regular) var(--text-5xl)/1.05 var(--font-display)' }}>Support the museum, see more of it</h1>
            <p style={{ font:'var(--type-body)', fontSize:18 }}>Membership keeps the galleries free to enter and the conservation studio working. It also makes your own visits cheaper.</p>
            {nav.isMember ? (
              <div style={{ display:'flex', gap:'var(--space-3)', alignItems:'center', flexWrap:'wrap', marginTop:'var(--space-2)' }}>
                <StatusBadge tone="member">Active member since March 2024</StatusBadge>
                <Button variant="secondary" iconLeft="settings">Manage membership</Button>
              </div>
            ) : (
              <div style={{ display:'flex', gap:'var(--space-3)', flexWrap:'wrap', marginTop:'var(--space-2)' }}>
                <Button size="lg" onClick={()=>nav.setMember(true)}>Become a member</Button>
                <Button size="lg" variant="ghost" onClick={()=>nav.go('Tickets')}>Just book a ticket</Button>
              </div>
            )}
          </div>
        </Container>
      </div>
      <Section mode={mode} title="What membership includes">
        <Grid mode={mode} desktop={3} tablet={2} mobile={1}>
          {benefits.map(b => (
            <Card key={b.title} style={{ display:'grid', gap:'var(--space-3)', alignContent:'start' }}>
              <span style={{ display:'grid', placeItems:'center', width:42, height:42, borderRadius:'var(--radius-md)', background:'var(--olive-50)' }}>
                <Icon name={b.icon} size={20} color="var(--olive-600)" />
              </span>
              <h3 style={{ font:'var(--type-h3)', fontSize:20 }}>{b.title}</h3>
              <p style={{ font:'var(--type-body-sm)', color:'var(--text-muted)' }}>{b.body}</p>
            </Card>
          ))}
        </Grid>
      </Section>
      <Section mode={mode} tone="muted" title="Choose a membership">
        <Grid mode={mode} desktop={3} tablet={3} mobile={1}>
          {[['Individual','£00','One named member'],['Joint','£00','Two named members at one address'],['Family','£00','Two adults and up to four children']].map(([n,p,d],i) => (
            <Card key={n} interactive style={{ display:'grid', gap:'var(--space-4)', border: i===1 ? '2px solid var(--olive-500)' : undefined }}>
              {i===1 && <StatusBadge tone="olive" size="sm" icon="star">Most chosen</StatusBadge>}
              <h3 style={{ font:'var(--type-h3)' }}>{n}</h3>
              <span style={{ font:'var(--weight-regular) var(--text-3xl)/1 var(--font-display)', color:'var(--text-heading)' }}>{p}<span style={{ font:'var(--type-body-sm)', color:'var(--text-muted)' }}> / year</span></span>
              <p style={{ font:'var(--type-body-sm)', color:'var(--text-muted)' }}>{d}</p>
              <Button variant={i===1?'primary':'secondary'} fullWidth disabled={nav.isMember} onClick={()=>nav.setMember(true)}>
                {nav.isMember ? 'You are a member' : 'Choose ' + n}
              </Button>
            </Card>
          ))}
        </Grid>
        <p style={{ marginTop:'var(--space-5)', font:'var(--type-body-sm)', color:'var(--text-muted)' }}>Prices are placeholders pending the museum's 2027 rates.</p>
      </Section>
    </Page>
  );
}

Object.assign(window, { SignInScreen, RegisterScreen, InterestsScreen, ProfileScreen, MembershipScreen, AuthLayout });
