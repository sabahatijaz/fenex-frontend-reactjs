// src/data/dummyData.js

// Sites with extended address fields
const dummySites = [
  {
    site_id: "001",
    name: "Greenfield Residential Complex",
    address: {
      street: "123 Main St",
      city: "Springfield",
      state: "IL",
      country: "USA",
      postal_code: "62701",
    },
    site_type: "Residential",
    total_quotations: 1,
    risks: ["Fire", "Flood"],
  },
  {
    site_id: "002",
    name: "Shelby Industrial Park",
    address: {
      street: "456 Elm St",
      city: "Shelbyville",
      state: "IL",
      country: "USA",
      postal_code: "62565",
    },
    site_type: "Industrial",
    total_quotations: 1,
    risks: ["Chemical Spill"],
  },
  {
    site_id: "003",
    name: "Maple Heights",
    address: {
      street: "789 Maple Ave",
      city: "Capital City",
      state: "IL",
      country: "USA",
      postal_code: "62703",
    },
    site_type: "Residential",
    total_quotations: 1,
    risks: ["Earthquake"],
  },
];

// Quotes with the required fields: quotation_id, site_id, product_name, height, width, quantity
const dummyQuotes = [
  {
    quotation_id: "1",
    site_id: "001",
    product_name: "Window",
    height: 68, // in cm
    width: 72, // in cm
    quantity: 10,
  },
  {
    quotation_id: "2",
    site_id: "001",
    product_name: "Door",
    height: 200, // in cm
    width: 80, // in cm
    quantity: 5,
  },
  {
    quotation_id: "3",
    site_id: "002",
    product_name: "Skylight",
    height: 150, // in cm
    width: 150, // in cm
    quantity: 2,
  },
];

export { dummySites, dummyQuotes };
