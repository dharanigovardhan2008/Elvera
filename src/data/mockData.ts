export const PLATFORMS = {
  AMAZON: 'Amazon',
  FLIPKART: 'Flipkart',
  MYNTRA: 'Myntra',
  AJIO: 'Ajio'
};

export const CATEGORIES = [
  'Shirts', 'Pants', 'Jeans', 'Trousers', 
  'Hoodies', 'Oversized T-Shirts', 'Shoes'
];

export const PRODUCTS = [
  {
    id: 'p1',
    title: 'Minimalist Oxford Shirt',
    description: 'Crisp white organic cotton button-up with capsule cut collar. Perfect for formal or smart casual wear.',
    category: 'Shirts',
    price: 999,
    platform: PLATFORMS.MYNTRA,
    affiliateLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: 'p2',
    title: 'Relaxed Fit Linen Trousers',
    description: 'Lightweight linen blend trousers with an elasticated waist. Breathable and effortlessly stylish.',
    category: 'Trousers',
    price: 1450,
    platform: PLATFORMS.AJIO,
    affiliateLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800',
    rating: 4.5,
    reviewCount: 89,
  },
  {
    id: 'p3',
    title: 'Chunky Leather Loafers',
    description: 'Premium calf leather loafers with an elevated platform sole. A modern take on a classic silhouette.',
    category: 'Shoes',
    price: 2999,
    platform: PLATFORMS.AMAZON,
    affiliateLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewCount: 205,
  },
  {
    id: 'p4',
    title: 'Heavyweight Boxy Hoodie',
    description: '450gsm pure cotton hoodie in washed grey. Drop shoulders and an ultra-relaxed fit.',
    category: 'Hoodies',
    price: 1899,
    platform: PLATFORMS.FLIPKART,
    affiliateLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviewCount: 340,
  },
  {
    id: 'p5',
    title: 'Washed Straight Denim',
    description: 'Vintage-wash straight leg jeans crafted from non-stretch denim for an authentic look.',
    category: 'Jeans',
    price: 2199,
    platform: PLATFORMS.MYNTRA,
    affiliateLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    reviewCount: 178,
  },
  {
    id: 'p6',
    title: 'Essential Oversized Tee',
    description: 'Thick, structured cotton t-shirt. Features a wide neck rib and a boxy, modern silhouette.',
    category: 'Oversized T-Shirts',
    price: 799,
    platform: PLATFORMS.AJIO,
    affiliateLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviewCount: 512,
  },
  {
    id: 'p7',
    title: 'Classic Wool Overcoat',
    description: 'Tailored wool blend overcoat with peak lapels. The ultimate layering piece for colder seasons.',
    category: 'Jackets',
    price: 4999,
    platform: PLATFORMS.AMAZON,
    affiliateLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1520975954732-57dd22299614?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewCount: 94,
  },
  {
    id: 'p8',
    title: 'Minimalist White Sneakers',
    description: 'Italian leather low-top sneakers. Clean, unbranded design that pairs with absolutely anything.',
    category: 'Shoes',
    price: 3499,
    platform: PLATFORMS.MYNTRA,
    affiliateLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    reviewCount: 420,
  }
];

export const COMBOS = [
  {
    id: 'c1',
    name: 'The Modern Minimalist',
    type: 'Smart Casual',
    styleTag: 'Minimal',
    items: [PRODUCTS[0], PRODUCTS[1], PRODUCTS[7]],
    totalPrice: 5948,
    imageUrl: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=1200',
    clicks: 1205
  },
  {
    id: 'c2',
    name: 'Urban Street Layer',
    type: 'Street Look',
    styleTag: 'Streetwear',
    items: [PRODUCTS[5], PRODUCTS[3], PRODUCTS[4]],
    totalPrice: 4897,
    imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=1200',
    clicks: 856
  },
  {
    id: 'c3',
    name: 'Autumn Editorial',
    type: 'Formal Look',
    styleTag: 'Elevated',
    items: [PRODUCTS[0], PRODUCTS[6], PRODUCTS[2]],
    totalPrice: 8997,
    imageUrl: 'https://images.unsplash.com/photo-1488161628813-04466f872507?auto=format&fit=crop&q=80&w=1200',
    clicks: 1432
  }
];
