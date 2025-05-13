export const categoryMetadata = {
  'All Products': {
    id: 'all',
    icon: '🎨',
    description: 'Browse our complete collection',
    displayOrder: 0
  },
  'Bridal Henna': {
    id: 'bridal',
    icon: '👰',
    description: 'Traditional bridal designs',
    displayOrder: 1
  },
  'Traditional': {
    id: 'traditional',
    icon: '🏺',
    description: 'Classic henna patterns',
    displayOrder: 2
  },
  'Arabic': {
    id: 'arabic',
    icon: '☪️',
    description: 'Arabian style designs',
    displayOrder: 3
  },
  'Modern': {
    id: 'modern',
    icon: '✨',
    description: 'Contemporary patterns',
    displayOrder: 4
  },
  'Floral': {
    id: 'floral',
    icon: '🌸',
    description: 'Flower-based designs',
    displayOrder: 5
  },
  'Custom Designs': {
    id: 'custom',
    icon: '🎨',
    description: 'Personalized patterns',
    displayOrder: 6
  }
};

export const filterProductsByCategory = (products, category) => {
  if (category === 'All Products') return products;
  return products.filter(product => product.category === category);
};

export const getCategoryCount = (products) => {
  const counts = { 'All Products': products.length };
  products.forEach(product => {
    counts[product.category] = (counts[product.category] || 0) + 1;
  });
  return counts;
};
