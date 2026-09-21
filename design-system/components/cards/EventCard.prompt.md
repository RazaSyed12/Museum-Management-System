Event / exhibition card with availability state baked into the CTA.

```jsx
<EventCard title="Twilight at the Museum" date="14 Sep 2026" time="18:30–21:00"
  location="Great Hall" price="£14 · £10 members" availability="limited" />
```

Never pass `availability="cancelled"` with a bookable CTA — the component disables it for you.
