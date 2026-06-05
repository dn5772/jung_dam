// Single source of truth for the restaurant's contact / business details.
// These are referenced across the public page (header, hero, about, contact,
// footer) and the structured-data / metadata in the layout, so they only need
// to be edited in one place.

export const siteConfig = {
  name: 'Jung Dam',
  tagline: 'Korean Restaurant in Auckland',
  description: 'Jung Dam Korean Restaurant in Auckland',

  phone: '+64 9 441 7080',
  phoneHref: 'tel:+6494417080',
  email: 'jungdam534@gmail.com',

  address: {
    street: '20a Link Drive',
    region: 'Wairau Valley, Auckland 0627',
    full: '20a Link Drive, Wairau Valley, Auckland 0627',
  },

  geo: { latitude: -36.765696, longitude: 174.7255296 },

  // Human-readable opening hours (shown in the footer / contact section).
  hours: [
    { label: 'Mon-Sat', value: '11:30 AM - 9 PM' },
    { label: 'Break Time', value: '3 PM - 5 PM' },
    { label: 'Sunday', value: 'Closed' },
  ],

  // Machine-readable hours for schema.org (24h, break split into two ranges).
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '11:30', closes: '15:00' },
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '17:00', closes: '21:00' },
  ],

  mapEmbedSrc:
    'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d25569.624427299554!2d174.7255296!3d-36.765696!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d399a1e237b75%3A0xbc883ebee83bbb6b!2z7KCV64u0IEp1bmcgRGFtIGtvcmVhbiByZXN0YXVyYW50!5e0!3m2!1sen!2snz!4v1768595330134!5m2!1sen!2snz',

  social: {
    twitter: '',
    facebook: '',
    instagram: '',
    linkedin: '',
  },
};

// schema.org "Restaurant" structured data for SEO (rich results / Maps).
export const restaurantJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: siteConfig.name,
  description: siteConfig.description,
  servesCuisine: 'Korean',
  priceRange: '$$',
  telephone: siteConfig.phone,
  email: siteConfig.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: siteConfig.address.street,
    addressLocality: 'Auckland',
    addressRegion: 'Auckland',
    postalCode: '0627',
    addressCountry: 'NZ',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: siteConfig.geo.latitude,
    longitude: siteConfig.geo.longitude,
  },
  openingHoursSpecification: siteConfig.openingHours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  })),
};
