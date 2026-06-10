import { PrismaClient, Role, Gender, AgeGroup, ProductStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Tolumak database...');

  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const userPassword = await bcrypt.hash('User1234!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@tolumak.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@tolumak.com',
      password: adminPassword,
      role: 'ADMIN',
      isEmailVerified: true,
    },
  });
  console.log('Admin created:', admin.email);

  const user = await prisma.user.upsert({
    where: { email: 'user@tolumak.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'user@tolumak.com',
      password: userPassword,
      role: 'USER',
      isEmailVerified: true,
    },
  });
  console.log('User created:', user.email);

  const menCategory = await prisma.category.upsert({
    where: { slug: 'mens-clothing' },
    update: {},
    create: { name: "Men's Clothing", slug: 'mens-clothing', description: 'Clothing for men' },
  });

  const womenCategory = await prisma.category.upsert({
    where: { slug: 'womens-clothing' },
    update: {},
    create: { name: "Women's Clothing", slug: 'womens-clothing', description: 'Clothing for women' },
  });

  const kidsCategory = await prisma.category.upsert({
    where: { slug: 'kids-clothing' },
    update: {},
    create: { name: "Kids' Clothing", slug: 'kids-clothing', description: 'Clothing for kids' },
  });

  const shoesCategory = await prisma.category.upsert({
    where: { slug: 'shoes' },
    update: {},
    create: { name: 'Shoes', slug: 'shoes', description: 'Footwear for all' },
  });

  const bagsCategory = await prisma.category.upsert({
    where: { slug: 'bags' },
    update: {},
    create: { name: 'Bags', slug: 'bags', description: 'Bags and backpacks' },
  });

  const accessoriesCategory = await prisma.category.upsert({
    where: { slug: 'accessories' },
    update: {},
    create: { name: 'Accessories', slug: 'accessories', description: 'Fashion accessories' },
  });

  const subcategories = [
    { name: 'T-Shirts', slug: 't-shirts', parent: menCategory.id },
    { name: 'Shirts', slug: 'shirts', parent: menCategory.id },
    { name: 'Jeans', slug: 'jeans', parent: menCategory.id },
    { name: 'Suits & Blazers', slug: 'suits-blazers', parent: menCategory.id },
    { name: 'Dresses', slug: 'dresses', parent: womenCategory.id },
    { name: 'Tops', slug: 'tops', parent: womenCategory.id },
    { name: 'Skirts', slug: 'skirts', parent: womenCategory.id },
    { name: 'Activewear', slug: 'activewear', parent: womenCategory.id },
    { name: 'Tops & T-Shirts', slug: 'kids-tops', parent: kidsCategory.id },
    { name: 'Bottoms', slug: 'kids-bottoms', parent: kidsCategory.id },
    { name: 'Sneakers', slug: 'sneakers', parent: shoesCategory.id },
    { name: 'Sandals', slug: 'sandals', parent: shoesCategory.id },
    { name: 'Formal Shoes', slug: 'formal-shoes', parent: shoesCategory.id },
    { name: 'Handbags', slug: 'handbags', parent: bagsCategory.id },
    { name: 'Backpacks', slug: 'backpacks', parent: bagsCategory.id },
    { name: 'Jewelry', slug: 'jewelry', parent: accessoriesCategory.id },
    { name: 'Watches', slug: 'watches', parent: accessoriesCategory.id },
    { name: 'Hats & Caps', slug: 'hats-caps', parent: accessoriesCategory.id },
    { name: 'Sunglasses', slug: 'sunglasses', parent: accessoriesCategory.id },
  ];

  const createdSubcategories: any[] = [];
  for (const sub of subcategories) {
    const cat = await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {},
      create: { name: sub.name, slug: sub.slug, parentId: sub.parent },
    });
    createdSubcategories.push(cat);
  }
  console.log('Categories seeded');

  const brandData = [
    { name: 'Nike', slug: 'nike' },
    { name: 'Adidas', slug: 'adidas' },
    { name: 'Zara', slug: 'zara' },
    { name: 'H&M', slug: 'hm' },
    { name: 'Gucci', slug: 'gucci' },
    { name: 'Prada', slug: 'prada' },
    { name: "Levi's", slug: 'levis' },
    { name: 'Converse', slug: 'converse' },
    { name: 'Puma', slug: 'puma' },
    { name: 'Louis Vuitton', slug: 'louis-vuitton' },
  ];

  const brands: any[] = [];
  for (const b of brandData) {
    const brand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: { name: b.name, slug: b.slug },
    });
    brands.push(brand);
  }
  console.log('Brands seeded');

  const products = [
    {
      name: 'Classic Fit T-Shirt',
      slug: 'classic-fit-t-shirt',
      sku: 'TSH-001',
      description: 'Premium cotton classic fit t-shirt. Comfortable and breathable fabric perfect for everyday wear.',
      price: 15000,
      discountPrice: 12000,
      stockQuantity: 100,
      gender: 'MALE',
      brandId: brands[3].id,
      categorySlugs: ['t-shirts'],
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      material: '100% Cotton',
      weight: 0.2,
      careInstructions: 'Machine wash cold. Tumble dry low.',
    },
    {
      name: 'Slim Fit Jeans',
      slug: 'slim-fit-jeans',
      sku: 'JNS-001',
      description: 'Modern slim fit jeans with stretch denim for maximum comfort.',
      price: 35000,
      discountPrice: 28000,
      stockQuantity: 75,
      gender: 'MALE',
      brandId: brands[6].id,
      categorySlugs: ['jeans'],
      isFeatured: true,
      isBestSeller: true,
      material: '98% Cotton, 2% Elastane',
      weight: 0.6,
      careInstructions: 'Machine wash inside out. Do not bleach.',
    },
    {
      name: 'Oxford Button-Down Shirt',
      slug: 'oxford-button-down-shirt',
      sku: 'SHT-001',
      description: 'Classic oxford shirt perfect for both casual and formal occasions.',
      price: 25000,
      stockQuantity: 60,
      gender: 'MALE',
      brandId: brands[2].id,
      categorySlugs: ['shirts'],
      isFeatured: true,
      material: '100% Cotton Oxford',
      weight: 0.3,
      careInstructions: 'Machine wash warm. Iron on medium heat.',
    },
    {
      name: 'Wool Blend Blazer',
      slug: 'wool-blend-blazer',
      sku: 'BLZ-001',
      description: 'Elegant wool blend blazer for the modern professional.',
      price: 85000,
      discountPrice: 68000,
      stockQuantity: 30,
      gender: 'MALE',
      brandId: brands[4].id,
      categorySlugs: ['suits-blazers'],
      isSale: true,
      material: '60% Wool, 40% Polyester',
      weight: 0.8,
      careInstructions: 'Dry clean only.',
    },
    {
      name: 'Floral Midi Dress',
      slug: 'floral-midi-dress',
      sku: 'DRS-001',
      description: 'Beautiful floral print midi dress with flowy silhouette.',
      price: 45000,
      stockQuantity: 50,
      gender: 'FEMALE',
      brandId: brands[2].id,
      categorySlugs: ['dresses'],
      isFeatured: true,
      isNewArrival: true,
      material: '100% Polyester',
      weight: 0.3,
      careInstructions: 'Hand wash cold. Hang to dry.',
    },
    {
      name: 'Striped Cotton Top',
      slug: 'striped-cotton-top',
      sku: 'TOP-001',
      description: 'Casual striped cotton top with relaxed fit.',
      price: 18000,
      discountPrice: 15000,
      stockQuantity: 80,
      gender: 'FEMALE',
      brandId: brands[3].id,
      categorySlugs: ['tops'],
      isBestSeller: true,
      material: '100% Cotton',
      weight: 0.15,
      careInstructions: 'Machine wash cold. Tumble dry low.',
    },
    {
      name: 'Pleated Mini Skirt',
      slug: 'pleated-mini-skirt',
      sku: 'SKT-001',
      description: 'Chic pleated mini skirt with elastic waistband.',
      price: 22000,
      stockQuantity: 65,
      gender: 'FEMALE',
      brandId: brands[2].id,
      categorySlugs: ['skirts'],
      isNewArrival: true,
      material: '65% Polyester, 35% Cotton',
      weight: 0.2,
      careInstructions: 'Machine wash gentle cycle.',
    },
    {
      name: 'Performance Running Leggings',
      slug: 'performance-running-leggings',
      sku: 'ACT-001',
      description: 'High-performance leggings with moisture-wicking technology.',
      price: 30000,
      stockQuantity: 90,
      gender: 'FEMALE',
      brandId: brands[0].id,
      categorySlugs: ['activewear'],
      isBestSeller: true,
      material: '75% Nylon, 25% Spandex',
      weight: 0.2,
      careInstructions: 'Machine wash cold. Do not use fabric softener.',
    },
    {
      name: 'Air Max Running Shoes',
      slug: 'air-max-running-shoes',
      sku: 'SHO-001',
      description: 'Premium running shoes with Air Max cushioning technology.',
      price: 65000,
      discountPrice: 55000,
      stockQuantity: 40,
      gender: 'UNISEX',
      brandId: brands[0].id,
      categorySlugs: ['sneakers'],
      isFeatured: true,
      isBestSeller: true,
      isSale: true,
      material: 'Mesh upper, Rubber sole',
      weight: 0.8,
      careInstructions: 'Spot clean with damp cloth. Air dry.',
    },
    {
      name: 'Ultraboost Running Shoe',
      slug: 'ultraboost-running-shoe',
      sku: 'SHO-002',
      description: 'Ultra-responsive running shoes with Boost cushioning.',
      price: 70000,
      stockQuantity: 35,
      gender: 'UNISEX',
      brandId: brands[1].id,
      categorySlugs: ['sneakers'],
      isNewArrival: true,
      isFeatured: true,
      material: 'Primeknit upper, Rubber outsole',
      weight: 0.75,
      careInstructions: 'Spot clean. Air dry away from direct heat.',
    },
    {
      name: 'Classic Canvas Sneakers',
      slug: 'classic-canvas-sneakers',
      sku: 'SHO-003',
      description: 'Timeless canvas sneakers that go with everything.',
      price: 20000,
      stockQuantity: 120,
      gender: 'UNISEX',
      brandId: brands[7].id,
      categorySlugs: ['sneakers'],
      isBestSeller: true,
      material: 'Canvas upper, Rubber sole',
      weight: 0.5,
      careInstructions: 'Spot clean with mild soap. Air dry.',
    },
    {
      name: 'Leather Formal Oxfords',
      slug: 'leather-formal-oxfords',
      sku: 'SHO-004',
      description: 'Premium leather oxford shoes for formal occasions.',
      price: 55000,
      stockQuantity: 25,
      gender: 'MALE',
      brandId: brands[4].id,
      categorySlugs: ['formal-shoes'],
      material: '100% Leather',
      weight: 0.9,
      careInstructions: 'Polish regularly. Store with shoe trees.',
    },
    {
      name: 'Leather Crossbody Bag',
      slug: 'leather-crossbody-bag',
      sku: 'BAG-001',
      description: 'Elegant leather crossbody bag with adjustable strap.',
      price: 48000,
      stockQuantity: 45,
      gender: 'FEMALE',
      brandId: brands[5].id,
      categorySlugs: ['handbags'],
      isFeatured: true,
      material: '100% Genuine Leather',
      weight: 0.5,
      careInstructions: 'Wipe with damp cloth. Condition leather regularly.',
    },
    {
      name: 'Laptop Backpack',
      slug: 'laptop-backpack',
      sku: 'BAG-002',
      description: 'Spacious laptop backpack with padded compartment for 15.6" laptops.',
      price: 35000,
      discountPrice: 28000,
      stockQuantity: 55,
      gender: 'UNISEX',
      brandId: brands[0].id,
      categorySlugs: ['backpacks'],
      isSale: true,
      material: 'Polyester with water-resistant coating',
      weight: 0.6,
      careInstructions: 'Spot clean. Do not machine wash.',
    },
    {
      name: 'Classic Tote Bag',
      slug: 'classic-tote-bag',
      sku: 'BAG-003',
      description: 'Spacious tote bag perfect for everyday use.',
      price: 42000,
      stockQuantity: 40,
      gender: 'FEMALE',
      brandId: brands[9].id,
      categorySlugs: ['handbags'],
      isNewArrival: true,
      material: 'Canvas with leather handles',
      weight: 0.4,
      careInstructions: 'Spot clean with damp cloth.',
    },
    {
      name: 'Men\'s Graphic T-Shirt',
      slug: 'mens-graphic-t-shirt',
      sku: 'TSH-002',
      description: 'Bold graphic print t-shirt for a streetwear look.',
      price: 12000,
      stockQuantity: 150,
      gender: 'MALE',
      brandId: brands[1].id,
      categorySlugs: ['t-shirts'],
      isNewArrival: true,
      material: '100% Cotton Jersey',
      weight: 0.18,
      careInstructions: 'Machine wash inside out. Tumble dry low.',
    },
    {
      name: 'Women\'s Yoga Pants',
      slug: 'womens-yoga-pants',
      sku: 'ACT-002',
      description: 'Comfortable high-waist yoga pants with four-way stretch.',
      price: 25000,
      stockQuantity: 85,
      gender: 'FEMALE',
      brandId: brands[0].id,
      categorySlugs: ['activewear'],
      isBestSeller: true,
      material: '72% Polyester, 28% Spandex',
      weight: 0.22,
      careInstructions: 'Machine wash cold. Hang to dry.',
    },
    {
      name: 'Kids Colorblock Hoodie',
      slug: 'kids-colorblock-hoodie',
      sku: 'KID-001',
      description: 'Fun colorblock hoodie for kids with front pouch pocket.',
      price: 15000,
      discountPrice: 12000,
      stockQuantity: 70,
      gender: 'KIDS',
      ageGroup: 'CHILDREN',
      brandId: brands[8].id,
      categorySlugs: ['kids-tops'],
      isFeatured: true,
      isSale: true,
      material: '80% Cotton, 20% Polyester',
      weight: 0.35,
      careInstructions: 'Machine wash warm. Tumble dry medium.',
    },
    {
      name: 'Kids Denim Shorts',
      slug: 'kids-denim-shorts',
      sku: 'KID-002',
      description: 'Durable denim shorts for active kids.',
      price: 12000,
      stockQuantity: 90,
      gender: 'KIDS',
      ageGroup: 'CHILDREN',
      brandId: brands[6].id,
      categorySlugs: ['kids-bottoms'],
      material: '100% Cotton Denim',
      weight: 0.25,
      careInstructions: 'Machine wash inside out.',
    },
    {
      name: 'Gold Hoop Earrings',
      slug: 'gold-hoop-earrings',
      sku: 'ACC-001',
      description: 'Elegant gold-plated hoop earrings.',
      price: 8000,
      stockQuantity: 200,
      gender: 'FEMALE',
      brandId: brands[4].id,
      categorySlugs: ['jewelry'],
      weight: 0.02,
      careInstructions: 'Avoid contact with water and perfumes.',
    },
    {
      name: 'Classic Leather Watch',
      slug: 'classic-leather-watch',
      sku: 'ACC-002',
      description: 'Timeless analog watch with genuine leather strap.',
      price: 55000,
      discountPrice: 45000,
      stockQuantity: 30,
      gender: 'MALE',
      brandId: brands[4].id,
      categorySlugs: ['watches'],
      isSale: true,
      material: 'Stainless steel case, Leather strap',
      weight: 0.08,
      careInstructions: 'Keep away from water. Replace battery every 2 years.',
    },
    {
      name: 'Baseball Cap',
      slug: 'baseball-cap',
      sku: 'ACC-003',
      description: 'Classic baseball cap with adjustable strap.',
      price: 8000,
      stockQuantity: 180,
      gender: 'UNISEX',
      brandId: brands[0].id,
      categorySlugs: ['hats-caps'],
      material: '100% Cotton',
      weight: 0.1,
      careInstructions: 'Spot clean. Do not machine wash.',
    },
    {
      name: 'Aviator Sunglasses',
      slug: 'aviator-sunglasses',
      sku: 'ACC-004',
      description: 'Classic aviator sunglasses with UV400 protection.',
      price: 25000,
      stockQuantity: 60,
      gender: 'UNISEX',
      brandId: brands[4].id,
      categorySlugs: ['sunglasses'],
      isFeatured: true,
      material: 'Metal frame, Glass lenses',
      weight: 0.04,
      careInstructions: 'Clean with microfiber cloth. Store in case.',
    },
    {
      name: 'Running Shorts',
      slug: 'running-shorts',
      sku: 'ACT-003',
      description: 'Lightweight running shorts with built-in brief and zippered pocket.',
      price: 15000,
      stockQuantity: 100,
      gender: 'MALE',
      brandId: brands[0].id,
      categorySlugs: ['activewear'],
      isBestSeller: true,
      material: '100% Polyester',
      weight: 0.15,
      careInstructions: 'Machine wash cold. Do not iron.',
    },
  ];

  for (const p of products) {
    const { categorySlugs, ...productData } = p;

    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (!existing) {
      const categoryRecords = await prisma.category.findMany({
        where: { slug: { in: categorySlugs } },
      });

      const { categorySlugs: _catSlugs, gender: _gender, ageGroup: _ageGroup, ...restData } = p;
      await prisma.product.create({
        data: {
          ...restData,
          gender: _gender as Gender,
          ageGroup: _ageGroup as AgeGroup | undefined,
          price: restData.price,
          discountPrice: restData.discountPrice || null,
          weight: restData.weight || null,
          categories: {
            create: categoryRecords.map((cat) => ({ categoryId: cat.id })),
          },
          images: {
            create: [
              { url: `https://placehold.co/800x800/EEE/31343C?text=${encodeURIComponent(p.name)}`, order: 0, alt: p.name },
              { url: `https://placehold.co/800x800/DDD/31343C?text=${encodeURIComponent(p.name)}+2`, order: 1 },
              { url: `https://placehold.co/800x800/CCC/31343C?text=${encodeURIComponent(p.name)}+3`, order: 2 },
            ],
          },
          variants: {
            create: [
              { size: 'S', stock: Math.floor(p.stockQuantity * 0.2), price: p.price },
              { size: 'M', stock: Math.floor(p.stockQuantity * 0.3), price: p.price },
              { size: 'L', stock: Math.floor(p.stockQuantity * 0.3), price: p.price },
              { size: 'XL', stock: Math.floor(p.stockQuantity * 0.2), price: p.price },
            ],
          },
        },
      });
    }
  }
  console.log('Products seeded');

  const banners = [
    { title: 'Summer Sale', subtitle: 'Up to 50% off on selected items', image: 'https://placehold.co/1920x600/4f46e5/FFFFFF?text=Summer+Sale', link: '/products/sale', order: 1 },
    { title: 'New Arrivals', subtitle: 'Check out our latest collections', image: 'https://placehold.co/1920x600/7c3aed/FFFFFF?text=New+Arrivals', link: '/products/new-arrivals', order: 2 },
    { title: 'Free Shipping', subtitle: 'On orders above ₦50,000', image: 'https://placehold.co/1920x600/2563eb/FFFFFF?text=Free+Shipping', link: '/products', order: 3 },
  ];

  for (const banner of banners) {
    await prisma.banner.upsert({
      where: { id: banner.title },
      update: {},
      create: { ...banner, id: undefined },
    });
  }
  console.log('Banners seeded');

  const coupons = [
    { code: 'WELCOME10', discountType: 'PERCENTAGE', discountValue: 10, minOrderAmount: 10000, usageLimit: 100, isActive: true },
    { code: 'SAVE5000', discountType: 'FIXED', discountValue: 5000, minOrderAmount: 30000, usageLimit: 50, isActive: true },
    { code: 'FREESHIP', discountType: 'FIXED', discountValue: 2500, minOrderAmount: 50000, usageLimit: 200, isActive: true },
    { code: 'FLASH25', discountType: 'PERCENTAGE', discountValue: 25, minOrderAmount: 15000, usageLimit: 30, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), isActive: true },
    { code: 'VIP20', discountType: 'PERCENTAGE', discountValue: 20, minOrderAmount: 50000, usageLimit: 20, isActive: true },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: coupon,
    });
  }
  console.log('Coupons seeded');

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
