const { StaffSidebar, StaffTopBar, Drawer, Button, Icon, StatusBadge, Breadcrumbs } = window.HeritageMuseumDesignSystem_5a5154;

const STATUS_TONE = { Published:'success', Confirmed:'success', Active:'success', Paid:'success',
  Draft:'warning', Pending:'warning', Invited:'warning', Limited:'warning',
  Cancelled:'danger', Refunded:'danger', Archived:'neutral', 'N/A':'neutral', Completed:'info' };

function Status({ value }) { return <StatusBadge size="sm" tone={STATUS_TONE[value] || 'neutral'}>{value}</StatusBadge>; }

function StaffPage({ mode, nav, title, subtitle, actions, children }) {
  const [drawer, setDrawer] = React.useState(false);
  const desktop = mode === 'desktop';
  const tablet = mode === 'tablet';
  return (
    <div style={{ position:'relative', display:'flex', height:'100%', minHeight:760, background:'var(--surface-staff)' }}>
      {mode !== 'mobile' && <StaffSidebar active={nav.active} collapsed={tablet} onNavigate={nav.go} />}
      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
        <StaffTopBar title={title} subtitle={subtitle} actions={actions} showMenu={mode==='mobile'} showSearch={desktop} onMenu={()=>setDrawer(true)} />
        <div style={{ flex:1, overflow:'auto', padding: mode==='mobile' ? 'var(--space-5)' : 'var(--space-8)' }}>
          <div style={{ display:'grid', gap:'var(--space-6)', maxWidth:1240, margin:'0 auto' }}>{children}</div>
        </div>
      </div>
      <Drawer open={drawer} side="left" title="Staff portal" onClose={()=>setDrawer(false)} size={280} style={{ padding:0 }}>
        <div style={{ margin:'calc(var(--space-5) * -1)' }}><StaffSidebar active={nav.active} onNavigate={(l)=>{nav.go(l);setDrawer(false);}} style={{ width:'100%' }} /></div>
      </Drawer>
    </div>
  );
}

function Panel({ title, description, actions, children, style }) {
  return (
    <section style={{ background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-xs)', ...style }}>
      {(title || actions) && (
        <header style={{ display:'flex', gap:'var(--space-4)', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', padding:'var(--space-5) var(--space-5) var(--space-4)', borderBottom:'1px solid var(--border-subtle)' }}>
          <div style={{ display:'grid', gap:2 }}>
            <h2 style={{ font:'var(--weight-medium) var(--text-lg)/1.2 var(--font-display)', color:'var(--text-heading)' }}>{title}</h2>
            {description && <span style={{ font:'var(--type-body-sm)', color:'var(--text-muted)' }}>{description}</span>}
          </div>
          {actions}
        </header>
      )}
      <div style={{ padding:'var(--space-5)' }}>{children}</div>
    </section>
  );
}

function Toolbar({ children, style }) {
  return <div style={{ display:'flex', gap:'var(--space-3)', alignItems:'center', flexWrap:'wrap', ...style }}>{children}</div>;
}

function RowActions({ onEdit, onArchive, destructive = 'Archive' }) {
  return (
    <div style={{ display:'flex', gap:'var(--space-1)', justifyContent:'flex-end' }}>
      <Button size="sm" variant="ghost" iconLeft="pencil" onClick={onEdit}>Edit</Button>
      <Button size="sm" variant="ghost" iconLeft="archive" onClick={onArchive}>{destructive}</Button>
    </div>
  );
}

Object.assign(window, { StaffPage, Panel, Toolbar, RowActions, Status, STATUS_TONE });
