Centred dialog for confirmations and short forms (cancel an event, create a category).

```jsx
<Modal title="Cancel this event?" onClose={close}
  footer={<><Button variant="ghost">Keep event</Button><Button variant="danger">Cancel event</Button></>}>
  Ticket holders will be notified and refunded.
</Modal>
```

Positioned absolutely — give the containing screen `position: relative`.
