export const FALLBACK_AFFILIATE_LINK = 'https://amazon.com/?tag=YOUR_MARKER_HERE';

export const DEFAULT_CARD_IMAGES = {
  gpu: 'https://images.unsplash.com/photo-1591489378430-ef2f4c626b35?auto=format&fit=crop&w=1200&q=80',
  cpu: 'https://images.unsplash.com/photo-1591799265444-d66432b91588?auto=format&fit=crop&w=1200&q=80',
  monitor: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80',
  mouse: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80',
  keyboard: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80',
  headset: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
};

export const withDefaultImage = (item) => {
  const typeKey = String(item?.type || '').toLowerCase();
  if (item?.image && String(item.image).trim().length > 0) {
    return item;
  }
  return {
    ...item,
    image: DEFAULT_CARD_IMAGES[typeKey] || '',
  };
};

export const hydrateGearImages = (items) =>
  Array.isArray(items) ? items.map(withDefaultImage) : [];

export const initialGearData = [
  { id: 1, type: 'GPU', name: 'GPU', specs: 'RTX 4090 · 24GB GDDR6X', price: '?1,89,999', link: '', image: DEFAULT_CARD_IMAGES.gpu },
  { id: 2, type: 'CPU', name: 'CPU', specs: 'i9-14900K · 24-Core', price: '?54,999', link: '', image: DEFAULT_CARD_IMAGES.cpu },
  { id: 3, type: 'Monitor', name: 'Monitor', specs: '27" 4K 144Hz IPS', price: '?72,000', link: '', image: DEFAULT_CARD_IMAGES.monitor },
  { id: 4, type: 'Mouse', name: 'Mouse', specs: 'Logitech G Pro X2 · 25.6K DPI', price: '?12,499', link: 'https://amazon.com/dp/B08EXAMPLE', image: DEFAULT_CARD_IMAGES.mouse },
  { id: 5, type: 'Keyboard', name: 'Keyboard', specs: 'Wooting 60HE · Analog', price: '?18,999', link: '', image: DEFAULT_CARD_IMAGES.keyboard },
  { id: 6, type: 'Headset', name: 'Headset', specs: 'Sony WH-1000XM5 · ANC', price: '?29,990', link: '', image: DEFAULT_CARD_IMAGES.headset },
];

