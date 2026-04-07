import { db } from '@/lib/firebase/config';
import { collection, addDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore';

export const seedDatabase = async (userEmail: string, userId: string) => {
  console.log('🌱 Starting database seeding...');

  try {
    // 1️⃣ CREATE PRODUCTS
    console.log('📦 Creating products...');
    
    const products = [
      {
        title: 'Classic White Shirt',
        description: 'Premium cotton white shirt perfect for any occasion',
        price: 899,
        originalPrice: 1499,
        discount: 40,
        category: 'shirts',
        priceRange: 'under-1000',
        platform: 'amazon',
        affiliateLink: 'https://www.amazon.in/s?k=white+shirt+men',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
            publicId: 'shirt-white-1',
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
        category: 'jeans',
        priceRange: 'under-1500',
        platform: 'myntra',
        affiliateLink: 'https://www.myntra.com/jeans',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
            publicId: 'jeans-blue-1',
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
        category: 'hoodies',
        priceRange: 'under-1500',
        platform: 'flipkart',
        affiliateLink: 'https://www.flipkart.com/search?q=black+hoodie',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
            publicId: 'hoodie-black-1',
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
        title: 'Casual Trousers Beige',
        description: 'Comfortable casual trousers for daily wear',
        price: 799,
        originalPrice: 1299,
        discount: 38,
        category: 'trousers',
        priceRange: 'under-1000',
        platform: 'ajio',
        affiliateLink: 'https://www.ajio.com/search/?text=trousers',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800',
            publicId: 'trousers-beige-1',
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
        title: 'Oversized T-Shirt White',
        description: 'Trendy oversized t-shirt',
        price: 599,
        originalPrice: 999,
        discount: 40,
        category: 'oversized-tshirts',
        priceRange: 'under-1000',
        platform: 'amazon',
        affiliateLink: 'https://www.amazon.in/s?k=oversized+tshirt',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
            publicId: 'tshirt-oversized-1',
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
        title: 'Slim Fit Pants Navy',
        description: 'Modern slim fit pants for office wear',
        price: 1199,
        originalPrice: 1899,
        discount: 37,
        category: 'pants',
        priceRange: 'under-1500',
        platform: 'myntra',
        affiliateLink: 'https://www.myntra.com/pants',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800',
            publicId: 'pants-navy-1',
          },
        ],
        rating: 4.4,
        reviews: 91,
        sizes: ['30', '32', '34', '36'],
        colors: ['Black', 'Navy'],
        inStock: true,
        featured: false,
      },
    ];

    const productIds = [];
    for (const product of products) {
      const docRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      productIds.push(docRef.id);
      console.log(`✅ Added product: ${product.title} (${docRef.id})`);
    }

    // 2️⃣ CREATE COMBOS
    console.log('📦 Creating combos...');
    
    const combos = [
      {
        name: 'Smart Casual Combo',
        description: 'Perfect outfit for casual office days',
        items: [
          {
            productId: productIds[0],
            type: 'shirt',
            name: 'White Shirt',
            price: 899,
          },
          {
            productId: productIds[5],
            type: 'pant',
            name: 'Navy Pants',
            price: 1199,
          },
        ],
        totalPrice: 2098,
        originalPrice: 3398,
        discount: 38,
        priceRange: 'under-2000',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800',
            publicId: 'combo-smart-casual',
          },
        ],
        platforms: [
          { platform: 'amazon', link: 'https://amazon.in' },
          { platform: 'myntra', link: 'https://myntra.com' },
        ],
        featured: true,
      },
      {
        name: 'Weekend Comfort Set',
        description: 'Relaxed weekend outfit',
        items: [
          {
            productId: productIds[2],
            type: 'hoodie',
            name: 'Black Hoodie',
            price: 1499,
          },
          {
            productId: productIds[1],
            type: 'jeans',
            name: 'Blue Jeans',
            price: 1299,
          },
        ],
        totalPrice: 2798,
        originalPrice: 4498,
        discount: 38,
        priceRange: 'under-2000',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
            publicId: 'combo-weekend',
          },
        ],
        platforms: [
          { platform: 'flipkart', link: 'https://flipkart.com' },
          { platform: 'myntra', link: 'https://myntra.com' },
        ],
        featured: true,
      },
    ];

    for (const combo of combos) {
      const docRef = await addDoc(collection(db, 'combos'), {
        ...combo,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`✅ Added combo: ${combo.name} (${docRef.id})`);
    }

    // 3️⃣ CREATE ADMIN USER
    console.log('👤 Creating admin user...');
    
    await setDoc(doc(db, 'admins', userId), {
      email: userEmail,
      role: 'admin',
      permissions: ['manage_products', 'manage_combos', 'view_analytics', 'manage_users'],
      createdAt: serverTimestamp(),
    });
    console.log(`✅ Added admin: ${userEmail}`);

    // 4️⃣ CREATE SAMPLE ANALYTICS
    console.log('📊 Creating sample analytics...');
    
    const analytics = [
      {
        productId: productIds[0],
        productTitle: 'Classic White Shirt',
        platform: 'amazon',
        userId: userId,
        timestamp: serverTimestamp(),
      },
      {
        productId: productIds[1],
        productTitle: 'Denim Jeans Blue',
        platform: 'myntra',
        userId: null,
        timestamp: serverTimestamp(),
      },
    ];

    for (const analytic of analytics) {
      await addDoc(collection(db, 'analytics'), analytic);
    }
    console.log('✅ Added sample analytics');

    console.log('🎉 Database seeding complete!');
    return { success: true, productCount: products.length, comboCount: combos.length };

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    return { success: false, error };
  }
};
