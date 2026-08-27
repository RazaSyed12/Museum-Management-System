const { SiteHeader, SiteFooter, Drawer, Button, Icon, SearchField } = window.HeritageMuseumDesignSystem_5a5154;

const PAD = { desktop:'var(--container-pad-desktop)', tablet:'var(--container-pad-tablet)', mobile:'var(--container-pad-mobile)' };

function Container({ mode, children, style }) {
  return <div style={{ maxWidth:'var(--container-max)', margin:'0 auto', padding:`0 ${PAD[mode]}`, ...style }}>{children}</div>;
}

function Section({ mode, title, eyebrow, action, children, tone, style }) {
  return (
    <section style={{ background: tone === 'muted' ? 'var(--surface-sunken)' : tone === 'accent' ? 'var(--surface-accent)' : 'transparent',
      padding: `${mode === 'mobile' ? 'var(--space-10)' : 'var(--space-16)'} 0`, ...style }}>
      <Container mode={mode}>
        {(title || action) && (
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:'var(--space-4)', marginBottom:'var(--space-6)', flexWrap:'wrap' }}>
            <div style={{ display:'grid', gap:6 }}>
              {eyebrow && <span style={{ font:'var(--type-eyebrow)', letterSpacing:'var(--tracking-wider)', textTransform:'uppercase', color:'var(--olive-600)' }}>{eyebrow}</span>}
              {title && <h2 style={{ font: mode === 'mobile' ? 'var(--weight-regular) var(--text-2xl)/1.2 var(--font-display)' : 'var(--type-h2)' }}>{title}</h2>}
            </div>
            {action}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}

function Grid({ mode, desktop = 3, tablet = 2, mobile = 1, children, style }) {
  const cols = mode === 'mobile' ? mobile : mode === 'tablet' ? tablet : desktop;
  return <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols}, minmax(0,1fr))`, gap:'var(--space-5)', ...style }}>{children}</div>;
}

function MobileNav({ open, onClose, onNavigate, user, isMember }) {
  const items = ['Home','Collections','Events','Visit','Tickets','Membership'];
  return (
    <Drawer open={open} side="left" title="Menu" onClose={onClose} size={300}
      footer={user ? <Button fullWidth variant="secondary" onClick={()=>{onNavigate('Profile');onClose();}}>Your account</Button>
                   : <Button fullWidth onClick={()=>{onNavigate('SignIn');onClose();}}>Sign in</Button>}>
      <div style={{ display:'grid', gap:'var(--space-2)' }}>
        <SearchField id="m-search" size="sm" placeholder="Search the museum" style={{ marginBottom:'var(--space-3)' }} />
        {items.map(i => (
          <button key={i} type="button" onClick={()=>{onNavigate(i);onClose();}}
            style={{ display:'flex', alignItems:'center', justifyContent:'space-between', minHeight:52, padding:'0 var(--space-3)',
              border:0, borderRadius:'var(--radius-md)', background:'transparent', cursor:'pointer',
              font:'var(--weight-medium) var(--text-md)/1 var(--font-body)', color:'var(--text-heading)' }}>
            {i}<Icon name="chevron-right" size={16} color="var(--text-muted)" />
          </button>
        ))}
        {isMember && (
          <div style={{ marginTop:'var(--space-4)', padding:'var(--space-3)', background:'var(--surface-accent)', borderRadius:'var(--radius-md)', display:'flex', gap:8, alignItems:'center' }}>
            <Icon name="award" size={18} color="var(--gold-700)" />
            <span style={{ font:'var(--type-body-sm)', color:'var(--text-heading)' }}>Member since 2024</span>
          </div>
        )}
      </div>
    </Drawer>
  );
}

function Page({ mode, nav, children }) {
  const [menu, setMenu] = React.useState(false);
  return (
    <div style={{ position:'relative', background:'var(--surface-page)', minHeight:'100%' }}>
      <SiteHeader mode={mode} active={nav.active} user={nav.user} isMember={nav.isMember}
        onNavigate={nav.go} onSignIn={()=>nav.go('SignIn')} onMenu={()=>setMenu(true)} onSearch={()=>nav.go('Collections')} />
      <main>{children}</main>
      <SiteFooter />
      <MobileNav open={menu} onClose={()=>setMenu(false)} onNavigate={nav.go} user={nav.user} isMember={nav.isMember} />
    </div>
  );
}

Object.assign(window, { Container, Section, Grid, Page, MobileNav, PAD });
