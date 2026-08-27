Mutually exclusive choice — payment method, ticket delivery, event status.

```jsx
<RadioGroup name="status" legend="Status" value={s} onChange={setS}
  options={['Draft','Published','Archived']} direction="row" />
```
