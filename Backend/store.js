// store.js
// Simple in-memory store for the exam. Structure:
// { shortcode: { url, createdAt: Date, expiry: Date, clicks: 0, clickLogs: [] } }

const store = {};

// helper to access
export const getStore = () => store;

// helper to reset (for tests)
export const resetStore = () => {
  for (const k of Object.keys(store)) delete store[k];
};
