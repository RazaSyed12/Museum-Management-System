const { Button, DataTable, SearchField, Select, Field, Input, Textarea, ImageUpload, RadioGroup, Modal, StatusBadge, Pagination, EmptyState, Icon, Checkbox } = window.HeritageMuseumDesignSystem_5a5154;

function CollectionsAdminScreen({ mode, nav }) {
  const S = window.HMS;
  const [q, setQ] = React.useState('');
  const rows = S.collections.filter(c => !q || c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <StaffPage mode={mode} nav={nav} title="Collections" subtitle="11 collections · 3 drafts"
      actions={<Button size="sm" iconLeft="plus" onClick={()=>nav.go('CollectionForm')}>Create collection</Button>}>
      <Panel>
        <Toolbar style={{ marginBottom:'var(--space-4)' }}>
          <SearchField id="c-q" size="sm" value={q} onChange={e=>setQ(e.target.value)} onClear={()=>setQ('')} placeholder="Search collections" style={{ flex:'1 1 240px', maxWidth:320 }} />
          <Select size="sm" placeholder="All categories" options={S.categories.map(c=>c.name)} style={{ width:170 }} />
          <Select size="sm" placeholder="All statuses" options={['Draft','Published','Archived']} style={{ width:150 }} />
          <Button size="sm" variant="ghost" iconLeft="download" style={{ marginLeft:'auto' }}>Export CSV</Button>
        </Toolbar>
        {rows.length ? (
          <DataTable sortKey="updated" sortDir="desc"
            columns={[
              { key:'name', header:'Collection', sortable:true, render:r=>(
                <span style={{ display:'grid', gap:2 }}>
                  <strong style={{ font:'var(--type-label)', color:'var(--text-heading)' }}>{r.name}</strong>
                  <span style={{ color:'var(--text-muted)' }}>{r.location}</span>
                </span>) },
              { key:'category', header:'Category', render:r=><StatusBadge size="sm" tone="olive">{r.category}</StatusBadge> },
              { key:'items', header:'Items', align:'right', sortable:true },
              { key:'status', header:'Status', render:r=><Status value={r.status} /> },
              { key:'updated', header:'Last updated', sortable:true },
              { key:'a', header:'', align:'right', render:()=><RowActions onEdit={()=>nav.go('CollectionForm')} /> },
            ]}
            rows={rows} />
        ) : <EmptyState title="No collections match" description="Try a different search term." compact />}
        <Pagination page={1} pages={3} style={{ marginTop:'var(--space-5)', justifyContent:'flex-end' }} />
      </Panel>
    </StaffPage>
  );
}

function CollectionFormScreen({ mode, nav }) {
  const S = window.HMS;
  const [newCat, setNewCat] = React.useState(false);
  const [status, setStatus] = React.useState('Draft');
  return (
    <StaffPage mode={mode} nav={{ ...nav, active:'Collections' }} title="Edit collection" subtitle="The Lanthorn Hoard · last saved 4 days ago"
      actions={<><Button size="sm" variant="ghost" onClick={()=>nav.go('Collections')}>Cancel</Button><Button size="sm" variant="secondary">Save draft</Button><Button size="sm" iconLeft="upload">Publish</Button></>}>
      <div style={{ display:'grid', gridTemplateColumns: mode==='desktop' ? '1fr 320px' : '1fr', gap:'var(--space-6)', alignItems:'start' }}>
        <div style={{ display:'grid', gap:'var(--space-6)' }}>
          <Panel title="Details">
            <div style={{ display:'grid', gap:'var(--space-5)' }}>
              <Field label="Collection name" htmlFor="f-n" required><Input id="f-n" defaultValue="The Lanthorn Hoard" /></Field>
              <Field label="Description" htmlFor="f-d" required hint="Shown on the public collection page.">
                <Textarea id="f-d" rows={5} defaultValue="Ninety-two objects buried together in the third century BCE and found by a farmer in 1974." />
              </Field>
              <div style={{ display:'grid', gridTemplateColumns: mode==='mobile' ? '1fr' : '1fr 1fr', gap:'var(--space-4)' }}>
                <Field label="Category" htmlFor="f-c" required hint={newCat ? undefined : 'Categories are managed in Category management.'}>
                  {newCat
                    ? <div style={{ display:'flex', gap:8 }}><Input id="f-c" placeholder="New category name" autoFocus /><Button size="sm" variant="secondary" onClick={()=>setNewCat(false)}>Add</Button></div>
                    : <Select id="f-c" options={S.categories.map(c=>c.name)} defaultValue="Archaeology" />}
                </Field>
                <Field label="Historical period" htmlFor="f-p"><Select id="f-p" options={['Prehistoric','Ancient','Medieval','Early modern','Modern']} defaultValue="Ancient" /></Field>
              </div>
              {!newCat && <Button size="sm" variant="ghost" iconLeft="plus" onClick={()=>setNewCat(true)}>Create a new category</Button>}
              <div style={{ display:'grid', gridTemplateColumns: mode==='mobile' ? '1fr' : '1fr 1fr', gap:'var(--space-4)' }}>
                <Field label="Gallery location" htmlFor="f-l"><Input id="f-l" defaultValue="Gallery 4 · First floor" /></Field>
                <Field label="Entry price" htmlFor="f-pr" optional hint="Leave empty for free entry."><Input id="f-pr" placeholder="£0.00" /></Field>
              </div>
            </div>
          </Panel>
          <Panel title="Cover image" description="Used on cards, the collection page and search results">
            <ImageUpload fileName="lanthorn-hoard-hero.jpg" />
          </Panel>
        </div>
        <div style={{ display:'grid', gap:'var(--space-6)' }}>
          <Panel title="Publishing">
            <div style={{ display:'grid', gap:'var(--space-4)' }}>
              <RadioGroup name="st" legend="Status" value={status} onChange={setStatus} options={['Draft','Published','Archived']} />
              <Checkbox id="feat" label="Feature on the home page" description="Shows in Featured collections." />
              <div style={{ display:'grid', gap:8, paddingTop:'var(--space-3)', borderTop:'1px solid var(--border-subtle)', font:'var(--type-body-sm)', color:'var(--text-muted)' }}>
                <span>Created 3 Feb 2024 by Naomi Vale</span>
                <span>Last published 22 Aug 2026</span>
              </div>
            </div>
          </Panel>
          <Panel title="Items" description="92 objects in this collection"
            actions={<Button size="sm" variant="ghost" iconRight="arrow-right" onClick={()=>nav.go('Items')}>Manage</Button>}>
            <div style={{ display:'grid', gap:'var(--space-3)' }}>
              {window.HMS.items.slice(0,3).map(i => (
                <div key={i.id} style={{ display:'flex', gap:'var(--space-3)', alignItems:'center' }}>
                  <span style={{ width:38, height:38, borderRadius:'var(--radius-sm)', background:'linear-gradient(135deg,#B4AF9E,#4A473D)', flex:'0 0 auto' }} />
                  <span style={{ display:'grid', gap:1, minWidth:0 }}>
                    <span style={{ font:'var(--type-body-sm)', color:'var(--text-heading)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{i.name}</span>
                    <span style={{ font:'var(--type-body-sm)', color:'var(--text-muted)' }}>{i.date}</span>
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </StaffPage>
  );
}

function ItemsAdminScreen({ mode, nav }) {
  const [open, setOpen] = React.useState(false);
  return (
    <StaffPage mode={mode} nav={nav} title="Collection items" subtitle="The Lanthorn Hoard · 92 objects"
      actions={<Button size="sm" iconLeft="plus" onClick={()=>setOpen(true)}>Add item</Button>}>
      <Panel>
        <Toolbar style={{ marginBottom:'var(--space-4)' }}>
          <SearchField id="i-q" size="sm" placeholder="Search items" style={{ flex:'1 1 240px', maxWidth:320 }} />
          <Select size="sm" placeholder="All collections" options={window.HMS.collections.map(c=>c.name)} style={{ width:200 }} />
          <Select size="sm" placeholder="All periods" options={['Prehistoric','Ancient','Medieval']} style={{ width:150 }} />
        </Toolbar>
        <DataTable
          columns={[
            { key:'name', header:'Item', sortable:true, render:r=>(
              <span style={{ display:'flex', gap:'var(--space-3)', alignItems:'center' }}>
                <span style={{ width:34, height:34, borderRadius:'var(--radius-sm)', background:'linear-gradient(135deg,#B4AF9E,#4A473D)', flex:'0 0 auto' }} />
                <strong style={{ font:'var(--type-label)', color:'var(--text-heading)' }}>{r.name}</strong>
              </span>) },
            { key:'period', header:'Period' },
            { key:'date', header:'Date' },
            { key:'location', header:'Location' },
            { key:'status', header:'Status', render:r=><Status value={r.status} /> },
            { key:'a', header:'', align:'right', render:()=><RowActions onEdit={()=>setOpen(true)} destructive="Remove" /> },
          ]}
          rows={window.HMS.items} />
      </Panel>
      <Modal open={open} onClose={()=>setOpen(false)} title="Add an item" description="Items belong to one collection and inherit its category unless you change it." width={620}
        footer={<><Button variant="ghost" onClick={()=>setOpen(false)}>Cancel</Button><Button onClick={()=>setOpen(false)}>Save item</Button></>}>
        <div style={{ display:'grid', gap:'var(--space-4)', paddingBottom:'var(--space-4)' }}>
          <Field label="Item name" htmlFor="m-n" required><Input id="m-n" placeholder="Bronze ceremonial helmet" /></Field>
          <Field label="Description" htmlFor="m-d"><Textarea id="m-d" rows={3} /></Field>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-4)' }}>
            <Field label="Related collection" htmlFor="m-c" required><Select id="m-c" options={window.HMS.collections.map(c=>c.name)} /></Field>
            <Field label="Category" htmlFor="m-cat"><Select id="m-cat" options={window.HMS.categories.map(c=>c.name)} /></Field>
            <Field label="Historical period" htmlFor="m-p"><Select id="m-p" options={['Prehistoric','Ancient','Medieval']} /></Field>
            <Field label="Approximate date" htmlFor="m-dt"><Input id="m-dt" placeholder="c. 300 BCE" /></Field>
            <Field label="Origin" htmlFor="m-o"><Input id="m-o" placeholder="Lanthorn Fields, Kent" /></Field>
            <Field label="Display location" htmlFor="m-l"><Input id="m-l" placeholder="Case 4A" /></Field>
          </div>
          <Field label="Image" htmlFor="m-i"><ImageUpload /></Field>
        </div>
      </Modal>
    </StaffPage>
  );
}

function CategoriesScreen({ mode, nav }) {
  const [open, setOpen] = React.useState(false);
  return (
    <StaffPage mode={mode} nav={nav} title="Categories" subtitle="Categories drive public filtering — add them here, never in code"
      actions={<Button size="sm" iconLeft="plus" onClick={()=>setOpen(true)}>Create category</Button>}>
      <Panel>
        <DataTable
          columns={[
            { key:'name', header:'Category', sortable:true, render:r=><strong style={{ font:'var(--type-label)', color:'var(--text-heading)' }}>{r.name}</strong> },
            { key:'collections', header:'Collections', align:'right' },
            { key:'items', header:'Items', align:'right' },
            { key:'status', header:'Status', render:r=><Status value={r.status} /> },
            { key:'a', header:'', align:'right', render:()=><RowActions onEdit={()=>setOpen(true)} /> },
          ]}
          rows={window.HMS.categories} />
      </Panel>
      <Modal open={open} onClose={()=>setOpen(false)} title="Create a category" width={460}
        footer={<><Button variant="ghost" onClick={()=>setOpen(false)}>Cancel</Button><Button onClick={()=>setOpen(false)}>Create category</Button></>}>
        <div style={{ display:'grid', gap:'var(--space-4)', paddingBottom:'var(--space-4)' }}>
          <Field label="Category name" htmlFor="cat-n" required hint="Appears in public filters straight away."><Input id="cat-n" placeholder="Natural History" /></Field>
          <Field label="Short description" htmlFor="cat-d" optional><Textarea id="cat-d" rows={2} /></Field>
        </div>
      </Modal>
    </StaffPage>
  );
}

Object.assign(window, { CollectionsAdminScreen, CollectionFormScreen, ItemsAdminScreen, CategoriesScreen });
