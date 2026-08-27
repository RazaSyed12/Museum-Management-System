const { Icon } = window.HeritageMuseumDesignSystem_5a5154;

const SCREENS = [
  { key:'Home', label:'Home', group:'Public' },
  { key:'Collections', label:'Collections browse', group:'Public' },
  { key:'Collection', label:'Collection detail', group:'Public' },
  { key:'Item', label:'Artefact detail', group:'Public' },
  { key:'Events', label:"What's on", group:'Public' },
  { key:'Event', label:'Event detail', group:'Public' },
  { key:'Tickets', label:'Ticket selection', group:'Ticketing' },
  { key:'Checkout', label:'Checkout', group:'Ticketing' },
  { key:'Payment', label:'Payment', group:'Ticketing' },
  { key:'Confirmation', label:'Confirmation', group:'Ticketing' },
  { key:'SignIn', label:'Sign in', group:'Account' },
  { key:'Register', label:'Register', group:'Account' },
  { key:'Interests', label:'Interests onboarding', group:'Account' },
  { key:'Profile', label:'Profile', group:'Account' },
  { key:'Membership', label:'Membership', group:'Account' },
];

const WIDTHS = { desktop:1440, tablet:768, mobile:390 };

function Toolbar({ screen, setScreen, mode, setMode, who, setWho }) {
  const seg = (opts, value, onChange) => (
    <div style={{ display:'flex', gap:2, padding:3, background:'var(--paper-200)', borderRadius:'var(--radius-pill)' }}>
      {opts.map(o => (
        <button key={o.value} type="button" onClick={()=>onChange(o.value)}
          style={{ display:'flex', gap:6, alignItems:'center', minHeight:32, padding:'0 12px', borderRadius:'var(--radius-pill)', border:0, cursor:'pointer',
            background: value===o.value ? 'var(--surface-card)' : 'transparent',
            boxShadow: value===o.value ? 'var(--shadow-xs)' : 'none',
            color: value===o.value ? 'var(--text-heading)' : 'var(--text-muted)',
            font:'var(--weight-semibold) var(--text-xs)/1 var(--font-body)' }}>
          {o.icon && <Icon name={o.icon} size={14} />}{o.label}
        </button>
      ))}
    </div>
  );
  return (
    <div style={{ position:'sticky', top:0, zIndex:100, display:'flex', gap:'var(--space-4)', alignItems:'center', flexWrap:'wrap',
      padding:'var(--space-3) var(--space-5)', background:'var(--paper-100)', borderBottom:'1px solid var(--border-default)' }}>
      <span style={{ font:'var(--weight-semibold) var(--text-xs)/1 var(--font-body)', letterSpacing:'var(--tracking-wider)', textTransform:'uppercase', color:'var(--text-muted)' }}>Visitor website</span>
      <select value={screen} onChange={e=>setScreen(e.target.value)} aria-label="Screen"
        style={{ minHeight:34, padding:'0 10px', borderRadius:'var(--radius-md)', border:'1px solid var(--border-default)', background:'var(--surface-card)', font:'var(--type-body-sm)', color:'var(--text-heading)' }}>
        {['Public','Ticketing','Account'].map(g => (
          <optgroup key={g} label={g}>
            {SCREENS.filter(s=>s.group===g).map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </optgroup>
        ))}
      </select>
      {seg([{value:'desktop',label:'1440',icon:'monitor'},{value:'tablet',label:'768',icon:'tablet'},{value:'mobile',label:'390',icon:'smartphone'}], mode, setMode)}
      {seg([{value:'anon',label:'Anonymous'},{value:'user',label:'Registered'},{value:'member',label:'Member'}], who, setWho)}
    </div>
  );
}

function Frame({ mode, children }) {
  const w = WIDTHS[mode];
  const box = React.useRef(null);
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const fit = () => { if (box.current) setScale(Math.min(1, (box.current.clientWidth - 32) / w)); };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [w]);
  return (
    <div ref={box} style={{ padding:'var(--space-5)', background:'var(--paper-200)', minHeight:'100%', display:'grid', justifyItems:'center' }}>
      <div style={{ width: w * scale, height: 'auto' }}>
        <div style={{ width:w, transform:`scale(${scale})`, transformOrigin:'top left',
          background:'var(--surface-page)', borderRadius: mode==='mobile' ? 24 : 8, overflow:'hidden', boxShadow:'var(--shadow-lg)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [screen, setScreen] = React.useState('Home');
  const [mode, setMode] = React.useState('desktop');
  const [who, setWho] = React.useState('anon');
  const order = useOrder(who === 'member');
  const user = who === 'anon' ? undefined : { name:'Amara Okafor', initials:'AO' };
  const nav = {
    user, isMember: who === 'member', go: setScreen,
    signIn: () => { setWho('user'); setScreen('Home'); },
    signOut: () => { setWho('anon'); setScreen('Home'); },
    setMember: (v) => setWho(v ? 'member' : 'user'),
  };
  const props = { mode, nav, order };
  const map = {
    Home: HomeScreen, Collections: CollectionsScreen, Collection: CollectionDetailScreen, Item: ItemDetailScreen,
    Events: EventsScreen, Event: EventDetailScreen, Tickets: TicketSelectScreen, Checkout: CheckoutScreen,
    Payment: PaymentScreen, Confirmation: ConfirmationScreen, SignIn: SignInScreen, Register: RegisterScreen,
    Interests: InterestsScreen, Profile: ProfileScreen, Membership: MembershipScreen,
  };
  const Screen = map[screen] || HomeScreen;
  return (
    <div style={{ minHeight:'100vh', background:'var(--paper-200)' }}>
      <Toolbar screen={screen} setScreen={setScreen} mode={mode} setMode={setMode} who={who} setWho={setWho} />
      <Frame mode={mode} key={mode}><Screen {...props} /></Frame>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
