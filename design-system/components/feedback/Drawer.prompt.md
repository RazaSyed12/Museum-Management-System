Edge-anchored panel: mobile nav (left), mobile filters (bottom), staff detail (right).

```jsx
<Drawer side="bottom" title="Filters" onClose={close}
  footer={<><Button variant="ghost" fullWidth>Clear</Button><Button fullWidth>Show 24 results</Button></>}>
  <FilterPanel {...props} />
</Drawer>
```
