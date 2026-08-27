Dark-green primary navigation for the staff portal, grouped by workflow.

```jsx
<StaffSidebar active="Events" onNavigate={go} />
<StaffSidebar collapsed />              {/* tablet */}
<Drawer side="left"><StaffSidebar /></Drawer>  {/* mobile */}
```
