// ✏️  EDIT EVERYTHING HERE — dates, names, venue, timings. No other file needs changes.
export const wedding = {
  initials: "C&S",
  bride: "Catherine",
  groom: "Seán",
  hostLine: "Mr. & Mrs. Elizabeth Slattery",
  inviteLine: "request the pleasure of your presence at the wedding of their daughter",

  // Main date/time (ISO format: YYYY-MM-DDTHH:MM:SS). Countdown + displayed date use this.
  dateISO: "2027-03-20T17:00:00",

  venue: "Dromoland Castle",
  address: "Newmarket-on-Fergus, Co. Clare, Ireland",
  venueNote:
    "Set amid centuries-old woodland, the castle will host our ceremony, dinner and dancing. Parking is available on site.",
  mapUrl: "https://maps.google.com/?q=Dromoland+Castle",

  // The Day — change times/labels freely, add or remove rows
  timeline: [
    { time: "4:30 PM", title: "Welcome", note: "Guests arrive & are seated" },
    { time: "5:00 PM", title: "Ceremony", note: "The Great Hall" },
    { time: "6:00 PM", title: "Cocktail Hour", note: "Drinks on the terrace" },
    { time: "7:30 PM", title: "Dinner", note: "Banquet in the ballroom" },
    { time: "9:30 PM", title: "Dancing", note: "Dance the night away" },
  ],

  dressCode: {
    title: "Black Tie",
    note: "Ladies in floor-length gowns, gentlemen in tuxedos. Jewel tones & emerald are welcome.",
  },

  rsvp: {
    by: "1st February 2027",
    contact: "Jane Ferris · +353 00 000 0000",
    whatsapp: "353000000000", // country code + number, no + or spaces
  },
};
