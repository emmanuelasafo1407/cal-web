import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data blocks...');
  await prisma.product.deleteMany({});
  await prisma.service.deleteMany({});

  console.log('Seeding physical store products catalog...');
  await prisma.product.createMany({
    data: [
      {
        title: 'Premium LED Bulb Array (4-Pack)',
        description: 'High-lumen energy efficient lighting units.',
        category: 'hardware',
        price: 45.00,
        stockQuantity: 50,
        imageUrls: JSON.stringify(['WhatsApp Image 2026-06-30 at 12.47.23 AM.jpeg']),
        isCustomizable: false,
      },
      {
        title: 'Customized Ghana National Jersey',
        description: 'Premium print customization. Tailor your selection with a custom name and number.',
        category: 'apparel',
        price: 120.00,
        stockQuantity: 100,
        imageUrls: JSON.stringify(['WhatsApp Image 2026-06-30 at 12.47.26 AM.jpeg']),
        isCustomizable: true,
      },
      {
        title: 'Studio Audio Over-Ear Headphones',
        description: 'Bass-heavy isolation acoustics built for everyday work environments.',
        category: 'hardware',
        price: 85.00,
        stockQuantity: 15,
        imageUrls: JSON.stringify(['WhatsApp Image 2026-06-30 at 12.47.23 AM.jpeg']),
        isCustomizable: false,
      }
    ]
  });

  console.log('Seeding virtual store transaction services...');
  await prisma.service.createMany({
    data: [
      {
        serviceName: 'Fidelity Bank Account Opening',
        category: 'banking',
        basePrice: 0.00,
        isAvailable: true,
        instructions: 'Please enter your Full Name, Valid GhanaCard ID number, and active Mobile Number.',
      },
      {
        serviceName: 'WAEC Result Checker Scratch Card',
        category: 'education',
        basePrice: 25.00,
        isAvailable: true,
        instructions: 'Provide the candidates Index Number and Exam Year for direct pin allocation.',
      },
      {
        serviceName: 'Premium Visual Graphics Custom Layout',
        category: 'graphics',
        basePrice: 50.00,
        isAvailable: true,
        instructions: 'Describe your promotional flyer requirements, color targets, and copy details.',
      }
    ]
  });

  console.log('Database initialization successful.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });