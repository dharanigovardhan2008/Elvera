import { productsService } from '@/lib/firebase/products';

export const seedProducts = async () => {
  const mockProducts = [
    {
      title: 'Classic White Shirt',
      description: 'Premium cotton white shirt perfect for any occasion',
      price: 899,
      originalPrice: 1499,
      discount: 40,
      category: 'shirts' as const,
      priceRange: 'under-1000' as const,
      platform: 'amazon' as const,
      affiliateLink: 'https://amazon.in',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
          publicId: 'p1-img1',
        },
      ],
      rating: 4.5,
      reviews: 120,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['White'],
      inStock: true,
      featured: true,
    },
    {
      title: 'Denim Jeans Blue',
      description: 'Comfortable slim fit denim jeans',
      price: 1299,
      originalPrice: 1999,
      discount: 35,
      category: 'jeans' as const,
      priceRange: 'under-1500' as const,
      platform: 'myntra' as const,
      affiliateLink: 'https://myntra.com',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
          publicId: 'p2-img1',
        },
      ],
      rating: 4.3,
      reviews: 89,
      sizes: ['30', '32', '34', '36'],
      colors: ['Blue'],
      inStock: true,
      featured: true,
    },
    {
      title: 'Black Hoodie',
      description: 'Cozy black hoodie with premium fabric',
      price: 1499,
      originalPrice: 2499,
      discount: 40,
      category: 'hoodies' as const,
      priceRange: 'under-1500' as const,
      platform: 'flipkart' as const,
      affiliateLink: 'https://flipkart.com',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
          publicId: 'p3-img1',
        },
      ],
      rating: 4.7,
      reviews: 156,
      sizes: ['M', 'L', 'XL', 'XXL'],
      colors: ['Black'],
      inStock: true,
      featured: true,
    },
    {
      title: 'Casual Trousers',
      description: 'Comfortable casual trousers for daily wear',
      price: 799,
      originalPrice: 1299,
      discount: 38,
      category: 'trousers' as const,
      priceRange: 'under-1000' as const,
      platform: 'ajio' as const,
      affiliateLink: 'https://ajio.com',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800',
          publicId: 'p4-img1',
        },
      ],
      rating: 4.2,
      reviews: 67,
      sizes: ['30', '32', '34', '36'],
      colors: ['Beige', 'Navy'],
      inStock: true,
      featured: false,
    },
    {
      title: 'Oversized T-Shirt',
      description: 'Trendy oversized t-shirt',
      price: 599,
      originalPrice: 999,
      discount: 40,
      category: 'oversized-tshirts' as const,
      priceRange: 'under-1000' as const,
      platform: 'amazon' as const,
      affiliateLink: 'https://amazon.in',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
          publicId: 'p5-img1',
        },
      ],
      rating: 4.6,
      reviews: 234,
      sizes: ['M', 'L', 'XL'],
      colors: ['Black', 'White', 'Grey'],
      inStock: true,
      featured: true,
    },
    {
      title: 'Slim Fit Pants',
      description: 'Modern slim fit pants',
      price: 1199,
      originalPrice: 1899,
      discount: 37,
      category: 'pants' as const,
      priceRange: 'under-1500' as const,
      platform: 'myntra' as const,
      affiliateLink: 'https://myntra.com',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800',
          publicId: 'p6-img1',
        },
      ],
      rating: 4.4,
      reviews: 91,
      sizes: ['30', '32', '34', '36'],
      colors: ['Black', 'Navy'],
      inStock: true,
      featured: false,
    },
    {
      title: 'Formal Shirt Blue',
      description: 'Professional formal shirt',
      price: 999,
      originalPrice: 1699,
      discount: 41,
      category: 'shirts' as const,
      priceRange: 'under-1000' as const,
      platform: 'flipkart' as const,
      affiliateLink: 'https://flipkart.com',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
          publicId: 'p8-img1',
        },
      ],
      rating: 4.5,
      reviews: 143,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Blue'],
      inStock: true,
      featured: true,
    },
  ];

  console.log('🌱 Starting to seed products...');

  for (const product of mockProducts) {
    try {
      const productId = await productsService.addProduct(product);
      console.log(`✅ Added product: ${product.title} (ID: ${productId})`);
    } catch (error) {
      console.error(`❌ Failed to add ${product.title}:`, error);
    }
  }

  console.log('🎉 Seeding complete!');
};
