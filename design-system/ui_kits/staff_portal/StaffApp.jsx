const { Icon } = window.HeritageMuseumDesignSystem_5a5154;

const SCREENS = [
  { key:'Dashboard', label:'Dashboard', nav:'Dashboard' },
  { key:'Collections', label:'Collection management', nav:'Collections' },
  { key:'CollectionForm', label:'Create / edit collection', nav:'Collections' },
  { key:'Items', label:'Item management', nav:'Items' },
  { key:'Categories', label:'Category management', nav:'Categories' },
  { key:'Events', label:'Event management', nav:'Events' },
  { key:'EventForm', label:'Create / edit event', nav:'Events' },
  { key:'Tickets', label:'Ticket management', nav:'Tickets' },
  { key:'Bookings', label:'Booking management', nav:'Bookings' },
  { key:'Staff', label:'Staff & roles', nav:'Staff & roles' },
];

const NAV_TO_SCREEN = { Dashboard:'Dashboard', Collections:'Collections', Items:'Items', Categories:'Categories',
  Events:'Events', Tickets:'Tickets', Bookings:'Bookings', 'Staff & roles':'Staff' };

const WIDTHS = { desktop:1440, tablet:768, mobile:390 };

function StaffToolbar({ screen, setScreen, mode, setMode }) {
  return (
    <div style={{ position:'sticky', top:0, zIndex:100, display:'flex', gap:'var(--space-4)', alignItems:'center', flexWrap:'wrap',
      padding:'var(--space-3) var(--space-5)', background:'var(--paper-100)', borderBottom:'1px solid var(--border-default)' }}>
      <span style={{ font:'var(--weight-semibold) var(--text-xs)/1 var(--font-body)', letterSpacing:'var(--tracking-wider)', textTransform:'uppercase', color:'var(--text-muted)' }}>Staff portal</span>
      <select value={screen} onChange={e=>setScreen(e.target.value)} aria-label="Screen"
        style={{ minHeight:34, padding:'0 10px', borderRadius:'var(--radius-md)', border:'1px solid var(--border-default)', background:'var(--surface-card)', font:'var(--type-body-sm)', color:'var(--text-heading)' }}>
        {SCREENS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
      </select>
      <div style={{ display:'flex', gap:2, padding:3, background:'var(--paper-200)', borderRadius:'var(--radius-pill)' }}>
        {[{v:'desktop',l:'1440',i:'monitor'},{v:'tablet',l:'768',i:'tablet'},{v:'mobile',l:'390',i:'smartphone'}].map(o => (
          <button key={o.v} type="button" onClick={()=>setMode(o.v)}
            style={{ display:'flex', gap:6, alignItems:'center', minHeight:32, padding:'0 12px', borderRadius:'var(--radius-pill)', border:0, cursor:'pointer',
              background: mode===o.v ? 'var(--surface-card)' : 'transparent', boxShadow: mode===o.v ? 'var(--shadow-xs)' : 'none',
              color: mode===o.v ? 'var(--text-heading)' : 'var(--text-muted)', font:'var(--weight-semibold) var(--text-xs)/1 var(--font-body)' }}>
            <Icon name={o.i} size={14} />{o.l}
          </button>
        ))}
      </div>
    </div>
  );
}

function StaffFrame({ mode, children }) {
  const w = WIDTHS[mode];
  const box = React.useRef(null);
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const fit = () => { if (box.current) setScale(Math.min(1, (box.current.clientWidth - 32) / w)); };
    fit(); window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [w]);
  const h = mode === 'mobile' ? 820 : 900;
  return (
    <div ref={box} style={{ padding:'var(--space-5)', background:'var(--paper-200)', minHeight:'100%', display:'grid', justifyItems:'center' }}>
      <div style={{ width:w*scale, height:h*scale }}>
        <div style={{ width:w, height:h, transform:`scale(${scale})`, transformOrigin:'top left',
          borderRadius: mode==='mobile' ? 24 : 8, overflow:'hidden', boxShadow:'var(--shadow-lg)', background:'var(--surface-staff)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function StaffApp() {
  const [screen, setScreen] = React.useState('Dashboard');
  const [mode, setMode] = React.useState('desktop');
  const current = SCREENS.find(s => s.key === screen) || SCREENS[0];
  const nav = { active: current.nav, go: (target) => setScreen(NAV_TO_SCREEN[target] || target) };
  const map = {
    Dashboard: DashboardScreen, Collections: CollectionsAdminScreen, CollectionForm: CollectionFormScreen,
    Items: ItemsAdminScreen, Categories: CategoriesScreen, Events: EventsAdminScreen, EventForm: EventFormScreen,
    Tickets: TicketsAdminScreen, Bookings: BookingsScreen, Staff: StaffRolesScreen,
  };
  const Screen = map[screen] || DashboardScreen;
  return (
    <div style={{ minHeight:'100vh', background:'var(--paper-200)' }}>
      <StaffToolbar screen={screen} setScreen={setScreen} mode={mode} setMode={setMode} />
      <StaffFrame mode={mode} key={mode}><Screen mode={mode} nav={nav} /></StaffFrame>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<StaffApp />);
