export const FALLBACK_AFFILIATE_LINK = 'https://amazon.com/?tag=YOUR_MARKER_HERE';

export const DEFAULT_CARD_IMAGES = {
  gpu: '',
  cpu: '',
  monitor: '',
  mouse: '',
  keyboard: '',
  headset: '',
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
  { id: 1, type: 'GPU', name: 'GPU', specs: 'RTX 4090 · 24GB GDDR6X', price: '189999', link: '', image: DEFAULT_CARD_IMAGES.gpu },
  { id: 2, type: 'CPU', name: 'CPU', specs: 'i9-14900K · 24-Core', price: '54999', link: '', image: DEFAULT_CARD_IMAGES.cpu },
  { id: 3, type: 'Monitor', name: 'Monitor', specs: '27" 4K 144Hz IPS', price: '72000', link: '', image: DEFAULT_CARD_IMAGES.monitor },
  { id: 4, type: 'Mouse', name: 'Mouse', specs: 'Logitech G Pro X2 · 25.6K DPI', price: '12499', link: 'https://amazon.com/dp/B08EXAMPLE', image: DEFAULT_CARD_IMAGES.mouse },
  { id: 5, type: 'Keyboard', name: 'Keyboard', specs: 'Wooting 60HE · Analog', price: '18999', link: '', image: DEFAULT_CARD_IMAGES.keyboard },
  { id: 6, type: 'Headset', name: 'Headset', specs: 'Sony WH-1000XM5 · ANC', price: '29990', link: '', image: DEFAULT_CARD_IMAGES.headset },
];
