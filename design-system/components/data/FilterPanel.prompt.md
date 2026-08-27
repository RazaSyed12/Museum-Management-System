Faceted filtering — a left sidebar on desktop, inside a bottom `Drawer` on mobile.

```jsx
<FilterPanel groups={[{title:'Category',options:categories},{title:'Period',options:periods}]}
  selected={sel} onToggle={toggle} activeCount={3} onClear={clear}
  sortOptions={['Most popular','Recently added','A–Z']} />
```
