const { Button, QuantityStepper, StatusBadge, Icon, Field, Input, Select, Checkbox, Alert, RadioGroup, Media } = window.HeritageMuseumDesignSystem_5a5154;

const money = n => '£' + n.toFixed(2);

function Steps({ step, mode }) {
  const labels = ['Tickets','Checkout','Payment','Confirmation'];
  return (
    <ol style={{ display:'flex', gap: mode==='mobile'?'var(--space-3)':'var(--space-6)', listStyle:'none', margin:0, padding:0, flexWrap:'wrap' }}>
      {labels.map((l,i) => {
        const done = i < step, on = i === step;
        return (
          <li key={l} style={{ display:'flex', gap:8, alignItems:'center' }}>
            <span style={{ display:'grid', placeItems:'center', width:26, height:26, borderRadius:'50%',
              background: done ? 'var(--olive-500)' : on ? 'var(--green-900)' : 'var(--paper-200)',
              color: done||on ? 'var(--paper-50)' : 'var(--text-muted)', font:'var(--weight-semibold) var(--text-xs)/1 var(--font-body)' }}>
              {done ? <Icon name="check" size={13} /> : i+1}
            </span>
            {(mode !== 'mobile' || on) && (
              <span style={{ font:'var(--weight-semibold) var(--text-sm)/1 var(--font-body)', color: on ? 'var(--text-heading)' : 'var(--text-muted)' }}>{l}</span>
            )}
            {i < labels.length-1 && mode !== 'mobile' && <Icon name="chevron-right" size={14} color="var(--neutral-400)" />}
          </li>
        );
      })}
    </ol>
  );
}

function FlowFrame({ mode, step, title, children, aside, nav }) {
  return (
    <Page mode={mode} nav={{ ...nav, active:'Tickets' }}>
      <div style={{ borderBottom:'1px solid var(--border-subtle)', background:'var(--surface-card)' }}>
        <Container mode={mode} style={{ padding:'var(--space-5) var(--container-pad-desktop)' }}><Steps step={step} mode={mode} /></Container>
      </div>
      <Container mode={mode} style={{ padding: mode==='mobile' ? 'var(--space-8) var(--container-pad-mobile)' : 'var(--space-12) var(--container-pad-desktop)' }}>
        <h1 style={{ font: mode==='mobile' ? 'var(--weight-regular) var(--text-3xl)/1.1 var(--font-display)' : 'var(--type-h1)', marginBottom:'var(--space-8)' }}>{title}</h1>
        <div style={{ display:'grid', gridTemplateColumns: mode==='desktop' ? '1fr 360px' : '1fr', gap:'var(--space-10)', alignItems:'start' }}>
          <div style={{ display:'grid', gap:'var(--space-6)' }}>{children}</div>
          {aside}
        </div>
      </Container>
    </Page>
  );
}

function Summary({ lines, total, mode, footer, note }) {
  return (
    <aside style={{ position: mode==='desktop' ? 'sticky':'static', top:100, display:'grid', gap:'var(--space-4)',
      padding:'var(--space-6)', background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-sm)' }}>
      <h2 style={{ font:'var(--type-h3)' }}>Order summary</h2>
      <div style={{ display:'grid', gap:'var(--space-3)' }}>
        {lines.map(l => (
          <div key={l.label} style={{ display:'flex', justifyContent:'space-between', gap:'var(--space-4)', font:'var(--type-body-sm)', color: l.muted ? 'var(--text-muted)' : 'var(--text-body)' }}>
            <span style={{ display:'flex', gap:6, alignItems:'center' }}>{l.icon && <Icon name={l.icon} size={14} color="var(--gold-700)" />}{l.label}</span>
            <span style={{ color: l.tone === 'discount' ? 'var(--success-600)' : undefined, fontWeight: l.strong ? 'var(--weight-semibold)' : undefined }}>{l.value}</span>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', paddingTop:'var(--space-4)', borderTop:'1px solid var(--border-default)' }}>
        <span style={{ font:'var(--type-label)', color:'var(--text-heading)' }}>Total to pay</span>
        <span style={{ font:'var(--weight-regular) var(--text-2xl)/1 var(--font-display)', color:'var(--text-heading)' }}>{total}</span>
      </div>
      {note && <p style={{ font:'var(--type-body-sm)', color:'var(--text-muted)' }}>{note}</p>}
      {footer}
    </aside>
  );
}

function useOrder(isMember) {
  const [qty, setQty] = React.useState({ general:2, member:0, child:0 });
  const prices = { general:14, member:10, child:7 };
  const sub = qty.general*prices.general + qty.member*prices.member + qty.child*prices.child;
  const fee = sub ? 1.5 : 0;
  const vat = +(sub * 0.05).toFixed(2);
  const discount = isMember && qty.general ? +(qty.general * 2).toFixed(2) : 0;
  const total = +(sub + fee + vat - discount).toFixed(2);
  const count = qty.general + qty.member + qty.child;
  return { qty, setQty, prices, sub, fee, vat, discount, total, count };
}

function TicketSelectScreen({ mode, nav, order }) {
  const e = window.HM.events[0];
  const types = [
    { key:'general', name:'General admission', desc:'Adult, 18 and over', price:14, remaining:38 },
    { key:'member', name:'Member admission', desc:'Requires an active membership', price:10, remaining:20, member:true },
    { key:'child', name:'Child or student', desc:'Under 18, or with a valid student card', price:7, remaining:38 },
  ];
  return (
    <FlowFrame mode={mode} nav={nav} step={0} title="Choose your tickets"
      aside={<Summary mode={mode}
        lines={[
          { label:`General admission × ${order.qty.general}`, value: money(order.qty.general*14) },
          { label:`Member admission × ${order.qty.member}`, value: money(order.qty.member*10), muted: !order.qty.member },
          { label:`Child or student × ${order.qty.child}`, value: money(order.qty.child*7), muted: !order.qty.child },
        ]}
        total={money(order.sub)} note="Fees and any member discount are shown at checkout."
        footer={<Button fullWidth size="lg" disabled={!order.count} onClick={()=>nav.go('Checkout')}>Continue to checkout</Button>} />}>
      <div style={{ display:'flex', gap:'var(--space-4)', padding:'var(--space-4)', background:'var(--surface-sunken)', borderRadius:'var(--radius-lg)', alignItems:'center' }}>
        <div style={{ width:110, flex:'0 0 auto' }}><Media ratio="4 / 3" tone="green" caption="" /></div>
        <div style={{ display:'grid', gap:4 }}>
          <h2 style={{ font:'var(--type-h3)' }}>{e.title}</h2>
          <span style={{ font:'var(--type-body-sm)', color:'var(--text-body)' }}>{e.date} · {e.time} · {e.location}</span>
          <div style={{ display:'flex', gap:8, marginTop:4 }}>
            <StatusBadge tone="warning" size="sm">{e.remaining} places left</StatusBadge>
            {nav.isMember && <StatusBadge tone="member" size="sm">20 held for members</StatusBadge>}
          </div>
        </div>
      </div>
      {!nav.isMember && (
        <Alert tone="info" title="Members pay £10" action={<Button variant="secondary" size="sm" onClick={()=>nav.go('Membership')}>See membership</Button>}>
          Membership pays for itself in four visits, and member tickets are held until 48 hours before.
        </Alert>
      )}
      <div style={{ display:'grid', gap:'var(--space-3)' }}>
        {types.map(t => {
          const locked = t.member && !nav.isMember;
          return (
            <div key={t.key} style={{ display:'flex', flexWrap:'wrap', gap:'var(--space-4)', alignItems:'center', justifyContent:'space-between',
              padding:'var(--space-5)', background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)', opacity: locked ? .6 : 1 }}>
              <div style={{ display:'grid', gap:4, minWidth:200 }}>
                <span style={{ display:'flex', gap:8, alignItems:'center', font:'var(--type-label)', color:'var(--text-heading)' }}>
                  {t.name}{t.member && <StatusBadge tone="member" size="sm">Members only</StatusBadge>}
                </span>
                <span style={{ font:'var(--type-body-sm)', color:'var(--text-muted)' }}>{locked ? 'Sign in with a membership to unlock this price' : t.desc}</span>
              </div>
              <div style={{ display:'flex', gap:'var(--space-6)', alignItems:'center' }}>
                <span style={{ font:'var(--weight-semibold) var(--text-md)/1 var(--font-body)', color:'var(--text-heading)' }}>{money(t.price)}</span>
                <QuantityStepper label={t.name} value={order.qty[t.key]} max={Math.min(6,t.remaining)} disabled={locked}
                  onChange={v=>order.setQty(q=>({ ...q, [t.key]:v }))} />
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ font:'var(--type-body-sm)', color:'var(--text-muted)' }}>Free events are reserved the same way — you will not be asked for payment details.</p>
    </FlowFrame>
  );
}

function CheckoutScreen({ mode, nav, order }) {
  return (
    <FlowFrame mode={mode} nav={nav} step={1} title="Check your order"
      aside={<Summary mode={mode}
        lines={[
          { label:`General admission × ${order.qty.general}`, value: money(order.qty.general*14) },
          { label:`Child or student × ${order.qty.child}`, value: money(order.qty.child*7), muted: !order.qty.child },
          { label:'Subtotal', value: money(order.sub), strong:true },
          { label:'Service charge', value: money(order.fee) },
          { label:'VAT (5%)', value: money(order.vat) },
          ...(order.discount ? [{ label:'Member discount', value:'−'+money(order.discount), tone:'discount', icon:'award' }] : []),
        ]}
        total={money(order.total)}
        footer={<Button fullWidth size="lg" onClick={()=>nav.go('Payment')}>Continue to payment</Button>}
        note="You will not be charged until the next step." />}>
      <div style={{ display:'grid', gap:'var(--space-5)', padding:'var(--space-6)', background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)' }}>
        <h2 style={{ font:'var(--type-h3)' }}>Your details</h2>
        <div style={{ display:'grid', gridTemplateColumns: mode==='mobile' ? '1fr' : '1fr 1fr', gap:'var(--space-4)' }}>
          <Field label="Full name" htmlFor="cn" required><Input id="cn" defaultValue={nav.user ? nav.user.name : ''} placeholder="Amara Okafor" /></Field>
          <Field label="Email address" htmlFor="ce" required hint="Your tickets are sent here."><Input id="ce" type="email" defaultValue={nav.user ? 'amara@example.com' : ''} /></Field>
          <Field label="Phone" htmlFor="cp" optional><Input id="cp" type="tel" /></Field>
          <Field label="How did you hear about us?" htmlFor="ch" optional><Select id="ch" placeholder="Select an option" options={['Friend or family','Social media','Newsletter','Walked past']} /></Field>
        </div>
        <Checkbox id="nl" label="Email me what's on" description="Monthly, and never shared." />
      </div>
      <div style={{ display:'grid', gap:'var(--space-4)', padding:'var(--space-6)', background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)' }}>
        <h2 style={{ font:'var(--type-h3)' }}>Access requirements</h2>
        <RadioGroup name="acc" value="none" options={[{value:'none',label:'No requirements'},{value:'wheel',label:'Wheelchair space needed'},{value:'bsl',label:'BSL interpretation'}]} />
      </div>
      {nav.isMember && <Alert tone="success" title="Member discount applied">£{order.discount.toFixed(2)} has been taken off this order.</Alert>}
    </FlowFrame>
  );
}

function PaymentScreen({ mode, nav, order }) {
  const [state, setState] = React.useState('idle');
  const free = order.total === 0;
  return (
    <FlowFrame mode={mode} nav={nav} step={2} title={free ? 'Confirm your free tickets' : 'Payment'}
      aside={<Summary mode={mode}
        lines={[{ label:`${order.count} tickets`, value: money(order.sub) },{ label:'Service charge', value: money(order.fee) },{ label:'VAT (5%)', value: money(order.vat) },
          ...(order.discount ? [{ label:'Member discount', value:'−'+money(order.discount), tone:'discount', icon:'award' }] : [])]}
        total={money(order.total)}
        footer={<Button fullWidth size="lg" loading={state==='loading'} onClick={()=>{ setState('loading'); setTimeout(()=>nav.go('Confirmation'), 700); }}>
          {free ? 'Confirm reservation' : 'Pay ' + money(order.total)}</Button>} />}>
      <Alert tone="info" title="Prototype payment screen">No card is charged. Use the buttons below to preview the success and failure states.</Alert>
      {state === 'failed' && <Alert tone="danger" title="Payment declined" onDismiss={()=>setState('idle')}>Your card was not charged. Check the number and expiry date, or try another card.</Alert>}
      {free ? (
        <div style={{ display:'grid', gap:'var(--space-3)', padding:'var(--space-6)', background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)' }}>
          <h2 style={{ font:'var(--type-h3)' }}>No payment needed</h2>
          <p style={{ font:'var(--type-body)' }}>This event is free. We only need your email so we can send the tickets and let you know if anything changes.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gap:'var(--space-5)', padding:'var(--space-6)', background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <h2 style={{ font:'var(--type-h3)' }}>Card details</h2>
            <span style={{ display:'flex', gap:6, alignItems:'center', font:'var(--type-body-sm)', color:'var(--text-muted)' }}><Icon name="lock" size={14} />Secure form</span>
          </div>
          <Field label="Cardholder name" htmlFor="p1" required><Input id="p1" placeholder="As printed on the card" /></Field>
          <Field label="Card number" htmlFor="p2" required error={state==='failed' ? 'This card was declined' : undefined}>
            <Input id="p2" inputMode="numeric" placeholder="4242 4242 4242 4242" invalid={state==='failed'} iconLeft="credit-card" />
          </Field>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-4)' }}>
            <Field label="Expiry" htmlFor="p3" required><Input id="p3" placeholder="MM / YY" /></Field>
            <Field label="Security code" htmlFor="p4" required hint="Three digits on the back"><Input id="p4" placeholder="123" /></Field>
          </div>
          <Field label="Billing postcode" htmlFor="p5" required><Input id="p5" placeholder="SE1 4XN" /></Field>
          <div style={{ display:'flex', gap:'var(--space-3)', flexWrap:'wrap', paddingTop:'var(--space-2)', borderTop:'1px dashed var(--border-default)' }}>
            <Button variant="secondary" size="sm" onClick={()=>nav.go('Confirmation')}>Preview successful payment</Button>
            <Button variant="ghost" size="sm" onClick={()=>setState('failed')}>Preview failed payment</Button>
          </div>
        </div>
      )}
    </FlowFrame>
  );
}

function ConfirmationScreen({ mode, nav, order }) {
  const e = window.HM.events[0];
  return (
    <FlowFrame mode={mode} nav={nav} step={3} title="You're going"
      aside={<Summary mode={mode}
        lines={[{ label:`${order.count} tickets`, value: money(order.sub) },{ label:'Service charge', value: money(order.fee) },{ label:'VAT (5%)', value: money(order.vat) },
          ...(order.discount ? [{ label:'Member discount', value:'−'+money(order.discount), tone:'discount', icon:'award' }] : [])]}
        total={money(order.total)} note="A receipt has been emailed to you."
        footer={<div style={{ display:'grid', gap:'var(--space-3)' }}>
          <Button fullWidth onClick={()=>nav.go('Profile')}>View my tickets</Button>
          <Button fullWidth variant="secondary" onClick={()=>nav.go('Events')}>Back to events</Button>
        </div>} />}>
      <div style={{ display:'flex', gap:'var(--space-4)', alignItems:'flex-start', padding:'var(--space-6)', background:'var(--success-100)', border:'1px solid #A8CDB4', borderRadius:'var(--radius-lg)' }}>
        <Icon name="check-circle-2" size={28} color="#2C5C39" />
        <div style={{ display:'grid', gap:6 }}>
          <h2 style={{ font:'var(--type-h3)', color:'#2C5C39' }}>Booking confirmed</h2>
          <p style={{ font:'var(--type-body)', color:'var(--text-body)' }}>We have emailed your tickets to amara@example.com. Show the QR code on your phone at the entrance.</p>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns: mode==='mobile' ? '1fr' : '1fr 180px', gap:'var(--space-6)', alignItems:'center',
        padding:'var(--space-6)', background:'var(--surface-card)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)' }}>
        <div style={{ display:'grid', gap:'var(--space-3)' }}>
          <span style={{ font:'var(--type-eyebrow)', letterSpacing:'var(--tracking-wider)', textTransform:'uppercase', color:'var(--text-muted)' }}>Booking reference</span>
          <span style={{ font:'var(--weight-regular) var(--text-2xl)/1 var(--font-display)', color:'var(--text-heading)', letterSpacing:'.04em' }}>HM-2026-04821</span>
          <dl style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:'var(--space-2) var(--space-5)', margin:0, font:'var(--type-body-sm)' }}>
            {[['Event',e.title],['Date',e.date+' · '+e.time],['Location',e.location],['Tickets',`${order.count} × general admission`],['Total paid',money(order.total)],['Booked by', nav.user ? nav.user.name : 'Amara Okafor']].map(([k,v])=>(
              <React.Fragment key={k}>
                <dt style={{ color:'var(--text-muted)' }}>{k}</dt><dd style={{ margin:0, color:'var(--text-heading)' }}>{v}</dd>
              </React.Fragment>
            ))}
          </dl>
        </div>
        <div style={{ display:'grid', gap:8, justifyItems:'center' }}>
          <div style={{ width:140, height:140, borderRadius:'var(--radius-md)', border:'1px solid var(--border-default)', display:'grid', placeItems:'center', background:'var(--surface-sunken)' }}>
            <Icon name="qr-code" size={92} color="var(--green-900)" />
          </div>
          <span style={{ font:'var(--type-body-sm)', color:'var(--text-muted)' }}>Placeholder QR</span>
        </div>
      </div>
    </FlowFrame>
  );
}

Object.assign(window, { TicketSelectScreen, CheckoutScreen, PaymentScreen, ConfirmationScreen, useOrder, Steps, Summary, money });
