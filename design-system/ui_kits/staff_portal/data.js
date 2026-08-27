window.HMS = {
  collections: [
    { id:1, name:'Ice Age Britain', category:'Prehistory', location:'Gallery 1', status:'Published', items:128, updated:'2 days ago' },
    { id:2, name:'The Lanthorn Hoard', category:'Archaeology', location:'Gallery 4', status:'Published', items:92, updated:'4 days ago' },
    { id:3, name:'Renaissance Portraits', category:'Renaissance', location:'Gallery 9', status:'Draft', items:64, updated:'6 days ago' },
    { id:4, name:'Medieval Armoury', category:'Medieval', location:'Gallery 7', status:'Published', items:41, updated:'2 weeks ago' },
    { id:5, name:'Victorian Toys', category:'Art', location:'Store', status:'Archived', items:18, updated:'3 months ago' }
  ],
  items: [
    { id:1, name:'Bronze ceremonial helmet', collection:'The Lanthorn Hoard', period:'Iron Age', date:'c. 300 BCE', status:'Published', location:'Case 4A' },
    { id:2, name:'Gold neck torc', collection:'The Lanthorn Hoard', period:'Iron Age', date:'c. 280 BCE', status:'Published', location:'Case 4A' },
    { id:3, name:'Ritual bowl with boar frieze', collection:'The Lanthorn Hoard', period:'Iron Age', date:'c. 300 BCE', status:'Draft', location:'Conservation' },
    { id:4, name:'Iron sword with wooden grip', collection:'The Lanthorn Hoard', period:'Iron Age', date:'c. 320 BCE', status:'Published', location:'Case 4D' },
    { id:5, name:'Enamelled disc brooch', collection:'The Lanthorn Hoard', period:'Iron Age', date:'c. 250 BCE', status:'Archived', location:'Store 2' }
  ],
  categories: [
    { id:1, name:'Prehistory', collections:3, items:214, status:'Active' },
    { id:2, name:'Dinosaurs', collections:2, items:96, status:'Active' },
    { id:3, name:'Archaeology', collections:4, items:572, status:'Active' },
    { id:4, name:'Ancient History', collections:2, items:210, status:'Active' },
    { id:5, name:'Medieval', collections:1, items:41, status:'Active' },
    { id:6, name:'Renaissance', collections:1, items:64, status:'Active' },
    { id:7, name:'Art', collections:2, items:55, status:'Active' },
    { id:8, name:'Industry', collections:0, items:0, status:'Archived' }
  ],
  events: [
    { id:1, name:'Beneath the Lanthorn Fields', status:'Published', start:'3 Jul 2026', end:'3 Jan 2027', location:'Exhibition Wing', price:'£16', capacity:1200, sold:560 },
    { id:2, name:'Twilight at the Museum', status:'Published', start:'14 Sep 2026', end:'14 Sep 2026', location:'Great Hall', price:'£14', capacity:200, sold:162 },
    { id:3, name:'Curator talk: Reading the Lanthorn Hoard', status:'Published', start:'21 Sep 2026', end:'21 Sep 2026', location:'Lecture Theatre', price:'Free', capacity:120, sold:38 },
    { id:4, name:'Family fossil workshop', status:'Published', start:'27 Sep 2026', end:'27 Sep 2026', location:'Learning Studio', price:'£8', capacity:40, sold:40 },
    { id:5, name:'Late-night life drawing', status:'Cancelled', start:'2 Oct 2026', end:'2 Oct 2026', location:'Gallery 9', price:'£18', capacity:30, sold:0 },
    { id:6, name:'Winter conservation open day', status:'Draft', start:'14 Nov 2026', end:'14 Nov 2026', location:'Conservation Studio', price:'Free', capacity:60, sold:0 }
  ],
  tickets: [
    { id:1, event:'Twilight at the Museum', capacity:200, general:180, member:20, booked:162, price:'£14 · £10 member' },
    { id:2, event:'Beneath the Lanthorn Fields', capacity:1200, general:1050, member:150, booked:560, price:'£16 · £12 member' },
    { id:3, event:'Curator talk: Reading the Lanthorn Hoard', capacity:120, general:100, member:20, booked:38, price:'Free' },
    { id:4, event:'Family fossil workshop', capacity:40, general:32, member:8, booked:40, price:'£8 · £5 member' }
  ],
  bookings: [
    { id:'HM-2026-04821', customer:'Amara Okafor', event:'Beneath the Lanthorn Fields', qty:2, date:'12 Aug 2026', total:'£33.60', payment:'Paid', status:'Confirmed' },
    { id:'HM-2026-04820', customer:'Tom Brady-Hall', event:'Twilight at the Museum', qty:4, date:'12 Aug 2026', total:'£58.10', payment:'Paid', status:'Confirmed' },
    { id:'HM-2026-04819', customer:'Priya Raman', event:'Curator talk: Reading the Lanthorn Hoard', qty:1, date:'11 Aug 2026', total:'Free', payment:'N/A', status:'Confirmed' },
    { id:'HM-2026-04818', customer:'Jonah Weiss', event:'Family fossil workshop', qty:3, date:'11 Aug 2026', total:'£24.00', payment:'Pending', status:'Pending' },
    { id:'HM-2026-04817', customer:'Elena Rossi', event:'Twilight at the Museum', qty:2, date:'10 Aug 2026', total:'£29.05', payment:'Refunded', status:'Cancelled' }
  ],
  staff: [
    { id:1, name:'Raza Syed', email:'r.syed@heritagemuseum.org', role:'Administrator', status:'Active', last:'Today, 09:12' },
    { id:2, name:'Naomi Vale', email:'n.vale@heritagemuseum.org', role:'Collection Manager', status:'Active', last:'Today, 08:40' },
    { id:3, name:'Dan Oyelaran', email:'d.oyelaran@heritagemuseum.org', role:'Event Manager', status:'Active', last:'Yesterday, 17:03' },
    { id:4, name:'Sara Whitlock', email:'s.whitlock@heritagemuseum.org', role:'Front of House', status:'Invited', last:'—' }
  ],
  roles: [
    { name:'Administrator', people:1, permissions:['collection.*','event.*','ticket.manage','booking.manage','staff.manage','category.manage'] },
    { name:'Collection Manager', people:1, permissions:['collection.create','collection.edit','item.manage','category.manage'] },
    { name:'Event Manager', people:1, permissions:['event.create','event.edit','event.cancel','ticket.manage'] },
    { name:'Front of House', people:1, permissions:['booking.view','booking.checkin'] }
  ],
  activity: [
    { who:'Naomi Vale', what:'published the collection', target:'The Lanthorn Hoard', when:'12 minutes ago', icon:'library-big' },
    { who:'Dan Oyelaran', what:'cancelled the event', target:'Late-night life drawing', when:'1 hour ago', icon:'calendar-x' },
    { who:'Raza Syed', what:'changed the member allocation for', target:'Twilight at the Museum', when:'3 hours ago', icon:'ticket' },
    { who:'Naomi Vale', what:'added 12 items to', target:'Ice Age Britain', when:'Yesterday', icon:'gem' },
    { who:'Sara Whitlock', what:'was invited as', target:'Front of House', when:'Yesterday', icon:'user-plus' }
  ]
};
