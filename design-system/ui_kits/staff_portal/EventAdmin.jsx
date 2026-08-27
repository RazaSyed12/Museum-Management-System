const { Button, DataTable, SearchField, Select, Field, Input, Textarea, ImageUpload, DateTimeField, RadioGroup, Modal, Checkbox, Alert, Icon, StatusBadge } = window.HeritageMuseumDesignSystem_5a5154;

function EventsAdminScreen({ mode, nav }) {
  const [cancel, setCancel] = React.useState(null);
  return (
    <StaffPage mode={mode} nav={nav} title="Events" subtitle="12 published · 3 drafts · 1 cancelled"
      actions={<Button size="sm" iconLeft="plus" onClick={()=>nav.go('EventForm')}>Create event</Button>}>
      <Panel>
        <Toolbar style={{ marginBottom:'var(--space-4)' }}>
          <SearchField id="e-q" size="sm" placeholder="Search events" style={{ flex:'1 1 240px', maxWidth:320 }} />
          <Select size="sm" placeholder="All statuses" options={['Draft','Published','Cancelled','Completed']} style={{ width:160 }} />
          <Select size="sm" placeholder="All locations" options={['Great Hall','Exhibition Wing','Lecture Theatre','Learning Studio']} style={{ width:180 }} />
        </Toolbar>
        <DataTable sortKey="start" sortDir="asc"
          columns={[
            { key:'name', header:'Event', sortable:true, render:r=>(
              <span style={{ display:'grid', gap:2 }}>
                <strong style={{ font:'var(--type-label)', color:'var(--text-heading)' }}>{r.name}</strong>
                <span style={{ color:'var(--text-muted)' }}>{r.location}</span>
              </span>) },
            { key:'start', header:'Starts', sortable:true },
            { key:'end', header:'Ends' },
            { key:'price', header:'Price', align:'right' },
            { key:'sold', header:'Booked', align:'right', render:r=>(
              <span style={{ display:'grid', gap:4, justifyItems:'end' }}>
                <span>{r.sold} / {r.capacity}</span>
                <span style={{ width:70, height:4, borderRadius:2, background:'var(--paper-200)', overflow:'hidden', display:'block' }}>
                  <span style={{ display:'block', width: Math.round(r.sold/r.capacity*100)+'%', height:'100%', background: r.sold>=r.capacity ? 'var(--danger-600)' : 'var(--olive-500)' }} />
                </span>
              </span>) },
            { key:'status', header:'Status', render:r=><Status value={r.status} /> },
            { key:'a', header:'', align:'right', render:r=>(
              <div style={{ display:'flex', gap:2, justifyContent:'flex-end' }}>
                <Button size="sm" variant="ghost" iconLeft="pencil" onClick={()=>nav.go('EventForm')}>Edit</Button>
                <Button size="sm" variant="ghost" iconLeft="ban" disabled={r.status==='Cancelled'} onClick={()=>setCancel(r)}>Cancel</Button>
              </div>) },
          ]}
          rows={window.HMS.events} />
      </Panel>
      <Modal open={!!cancel} onClose={()=>setCancel(null)} title="Cancel this event?" description={cancel ? cancel.name : ''} width={480}
        footer={<><Button variant="ghost" onClick={()=>setCancel(null)}>Keep event</Button><Button variant="danger" onClick={()=>setCancel(null)}>Cancel event</Button></>}>
        <div style={{ display:'grid', gap:'var(--space-4)', paddingBottom:'var(--space-4)' }}>
          <Alert tone="warning" title={cancel ? `${cancel.sold} tickets have been sold` : ''}>
            Everyone who booked is emailed and refunded automatically. The public page keeps the event visible, clearly marked as cancelled.
          </Alert>
          <Field label="Reason shown to ticket holders" htmlFor="cx-r" required><Textarea id="cx-r" rows={3} placeholder="The artist is unwell and we have been unable to rearrange." /></Field>
        </div>
      </Modal>
    </StaffPage>
  );
}

function EventFormScreen({ mode, nav }) {
  const [status, setStatus] = React.useState('Published');
  const [capacity, setCapacity] = React.useState(200);
  const [member, setMember] = React.useState(20);
  return (
    <StaffPage mode={mode} nav={{ ...nav, active:'Events' }} title="Edit event" subtitle="Twilight at the Museum · 162 of 200 booked"
      actions={<><Button size="sm" variant="ghost" onClick={()=>nav.go('Events')}>Cancel</Button><Button size="sm" variant="secondary">Save draft</Button><Button size="sm" iconLeft="upload">Publish changes</Button></>}>
      <div style={{ display:'grid', gridTemplateColumns: mode==='desktop' ? '1fr 320px' : '1fr', gap:'var(--space-6)', alignItems:'start' }}>
        <div style={{ display:'grid', gap:'var(--space-6)' }}>
          <Panel title="Event details">
            <div style={{ display:'grid', gap:'var(--space-5)' }}>
              <Field label="Event name" htmlFor="ev-n" required><Input id="ev-n" defaultValue="Twilight at the Museum" /></Field>
              <Field label="Description" htmlFor="ev-d" required><Textarea id="ev-d" rows={4} defaultValue="After-hours access to the Great Hall with curator talks, live music and a late bar." /></Field>
              <div style={{ display:'grid', gridTemplateColumns: mode==='mobile' ? '1fr' : '1fr 1fr', gap:'var(--space-4)' }}>
                <Field label="Start date" htmlFor="ev-sd" required><DateTimeField id="ev-sd" type="date" defaultValue="2026-09-14" /></Field>
                <Field label="End date" htmlFor="ev-ed" required><DateTimeField id="ev-ed" type="date" defaultValue="2026-09-14" /></Field>
                <Field label="Start time" htmlFor="ev-st" required><DateTimeField id="ev-st" type="time" defaultValue="18:30" /></Field>
                <Field label="End time" htmlFor="ev-et" required><DateTimeField id="ev-et" type="time" defaultValue="21:00" /></Field>
              </div>
              <Field label="Location" htmlFor="ev-l" required><Select id="ev-l" options={['Great Hall','Exhibition Wing','Lecture Theatre','Learning Studio','Gallery 9']} defaultValue="Great Hall" /></Field>
              <Field label="Associated collections" htmlFor="ev-c" hint="Shown on the public event page and used for recommendations.">
                <div style={{ display:'grid', gap:'var(--space-1)' }}>
                  {window.HMS.collections.slice(0,4).map((c,i) => <Checkbox key={c.id} id={'ev-c'+c.id} label={c.name} checked={i<2} onChange={()=>{}} />)}
                </div>
              </Field>
            </div>
          </Panel>
          <Panel title="Tickets and capacity">
            <div style={{ display:'grid', gap:'var(--space-5)' }}>
              <div style={{ display:'grid', gridTemplateColumns: mode==='mobile' ? '1fr' : 'repeat(3,1fr)', gap:'var(--space-4)' }}>
                <Field label="Standard price" htmlFor="ev-p" required><Input id="ev-p" defaultValue="14.00" iconLeft="pound-sterling" /></Field>
                <Field label="Member price" htmlFor="ev-mp"><Input id="ev-mp" defaultValue="10.00" iconLeft="pound-sterling" /></Field>
                <Field label="Total capacity" htmlFor="ev-cap" required><Input id="ev-cap" type="number" value={capacity} onChange={e=>setCapacity(+e.target.value||0)} /></Field>
              </div>
              <Field label="Member allocation" htmlFor="ev-ma" hint={`${capacity-member} tickets stay on general sale. Member tickets are released to everyone 48 hours before.`}>
                <Input id="ev-ma" type="number" value={member} onChange={e=>setMember(+e.target.value||0)} />
              </Field>
              <div style={{ display:'flex', height:12, borderRadius:'var(--radius-pill)', overflow:'hidden', background:'var(--paper-200)' }}>
                <span style={{ width: ((capacity-member)/capacity*100)+'%', background:'var(--olive-500)' }} />
                <span style={{ width: (member/capacity*100)+'%', background:'var(--sand-400)' }} />
              </div>
              <div style={{ display:'flex', gap:'var(--space-5)', font:'var(--type-body-sm)', color:'var(--text-muted)' }}>
                <span style={{ display:'flex', gap:6, alignItems:'center' }}><span style={{ width:10, height:10, borderRadius:2, background:'var(--olive-500)' }} />General {capacity-member}</span>
                <span style={{ display:'flex', gap:6, alignItems:'center' }}><span style={{ width:10, height:10, borderRadius:2, background:'var(--sand-400)' }} />Members {member}</span>
              </div>
            </div>
          </Panel>
        </div>
        <div style={{ display:'grid', gap:'var(--space-6)' }}>
          <Panel title="Publishing">
            <RadioGroup name="ev-st" legend="Status" value={status} onChange={setStatus} options={['Draft','Published','Cancelled','Completed']} />
          </Panel>
          <Panel title="Event image"><ImageUpload fileName="twilight-great-hall.jpg" /></Panel>
        </div>
      </div>
    </StaffPage>
  );
}

function TicketsAdminScreen({ mode, nav }) {
  const [edit, setEdit] = React.useState(null);
  return (
    <StaffPage mode={mode} nav={nav} title="Ticket management" subtitle="Allocation and pricing across the programme">
      <Panel description="Member allocation is held until 48 hours before each event, then released to general sale.">
        <DataTable
          columns={[
            { key:'event', header:'Event', render:r=><strong style={{ font:'var(--type-label)', color:'var(--text-heading)' }}>{r.event}</strong> },
            { key:'capacity', header:'Capacity', align:'right' },
            { key:'general', header:'General', align:'right' },
            { key:'member', header:'Member', align:'right' },
            { key:'booked', header:'Booked', align:'right' },
            { key:'left', header:'Remaining', align:'right', render:r=>(
              <StatusBadge size="sm" tone={r.capacity-r.booked===0?'danger':r.capacity-r.booked<30?'warning':'success'}>{r.capacity-r.booked} left</StatusBadge>) },
            { key:'price', header:'Price' },
            { key:'a', header:'', align:'right', render:r=><Button size="sm" variant="ghost" iconLeft="pencil" onClick={()=>setEdit(r)}>Edit</Button> },
          ]}
          rows={window.HMS.tickets} />
      </Panel>
      <Modal open={!!edit} onClose={()=>setEdit(null)} title="Edit ticket settings" description={edit ? edit.event : ''} width={520}
        footer={<><Button variant="ghost" onClick={()=>setEdit(null)}>Cancel</Button><Button onClick={()=>setEdit(null)}>Save changes</Button></>}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-4)', paddingBottom:'var(--space-4)' }}>
          <Field label="Standard price" htmlFor="t-p"><Input id="t-p" defaultValue="14.00" iconLeft="pound-sterling" /></Field>
          <Field label="Member price" htmlFor="t-mp"><Input id="t-mp" defaultValue="10.00" iconLeft="pound-sterling" /></Field>
          <Field label="Total capacity" htmlFor="t-c"><Input id="t-c" type="number" defaultValue={edit ? edit.capacity : 0} /></Field>
          <Field label="Member allocation" htmlFor="t-m"><Input id="t-m" type="number" defaultValue={edit ? edit.member : 0} /></Field>
          <Field label="Availability" htmlFor="t-a" style={{ gridColumn:'1 / -1' }}>
            <Select id="t-a" options={['On sale','Paused','Closed']} />
          </Field>
        </div>
      </Modal>
    </StaffPage>
  );
}

Object.assign(window, { EventsAdminScreen, EventFormScreen, TicketsAdminScreen });
