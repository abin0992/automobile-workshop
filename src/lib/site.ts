/**
 * Single source of truth for the workshop's contact details and identity.
 *
 * These strings appear in the header, footer, contact page, structured data
 * and several call-to-action blocks; keeping them here means a change of
 * phone number is a one-line edit rather than a site-wide search.
 */
export const CONTACT = {
  name: "Marton Road MOT Centre",
  legalName: "Marton Road MOT Centre Ltd",
  tagline: "MOT · Servicing · Tyres",

  addressLine1: "416 Marton Road",
  town: "Middlesbrough",
  postcode: "TS4 2PT",
  country: "United Kingdom",

  /** Landline shown on the workshop fascia. */
  phoneDisplay: "01642 509 529",
  phoneHref: "tel:+441642509529",

  /** Mobile used for tyre and parts enquiries. */
  mobileDisplay: "07454 293416",
  mobileHref: "tel:+447454293416",

  bookingsEmail: "bookings@martonroadmot.co.uk",
  generalEmail: "hello@martonroadmot.co.uk",

  hoursShort: "Mon–Fri 08:00–18:00 · Sat 08:00–14:00",

  hours: [
    ["Monday", "08:00 – 18:00"],
    ["Tuesday", "08:00 – 18:00"],
    ["Wednesday", "08:00 – 18:00"],
    ["Thursday", "08:00 – 18:00"],
    ["Friday", "08:00 – 18:00"],
    ["Saturday", "08:00 – 14:00"],
    ["Sunday", "Closed"],
  ] as const satisfies ReadonlyArray<readonly [string, string]>,

  /** DVSA vehicle testing station number. */
  motSiteNumber: "S005239",

  mapsUrl: "https://maps.app.goo.gl/PcDKuRFMjA5Tqr2V8",
  /** Embeddable map centred on the workshop. */
  mapsEmbedUrl:
    "https://www.google.com/maps?q=416+Marton+Road,+Middlesbrough+TS4+2PT&output=embed",
  latitude: 54.557444,
  longitude: -1.222504,
} as const;

export const FULL_ADDRESS = `${CONTACT.addressLine1}, ${CONTACT.town} ${CONTACT.postcode}`;
