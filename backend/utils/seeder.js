const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Portfolio = require('../models/Portfolio');
const ClientSpace = require('../models/ClientSpace');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/studioph');
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const adminData = [
  {
    email: 'admin@studioph.com',
    password: 'Admin123!',
    isVerified: true
  },
];

const categoryData = [
  {
    name: 'Wedding',
    description: 'Beautiful wedding photography capturing special moments',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Portraits',
    description: 'Professional portrait photography for individuals and families',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Nature',
    description: 'Stunning nature and landscape photography',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Fashion',
    description: 'High-end fashion and editorial photography',
    image: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Events',
    description: 'Professional event coverage for all occasions',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop'
  }
];

let portfolioCounter = 0;

const getPortfolioData = (adminId, categoryId) => {
  portfolioCounter++;
  const timestamp = Date.now();
  return {
    title: `Sample Portfolio ${timestamp}-${portfolioCounter}`,
    description: 'This is a sample portfolio item with a beautiful image',
    imageUrl: `https://picsum.photos/seed/${Math.random()}/800/600`,
    category: categoryId,
    photographer: adminId
  };
};

const getClientSpaceData = (adminId, index) => ({
  name: `Client Project ${index + 1}`,
  // Note: this is the plaintext prior to hashing. Do NOT persist or log.
  key: `client${index + 1}key`,
  admin: adminId,
  images: [
    'https://picsum.photos/seed/1/800/600',
    'https://picsum.photos/seed/2/800/600',
    'https://picsum.photos/seed/3/800/600'
  ]
});

const seedAdmins = async () => {
  try {
    await Admin.deleteMany({});
    console.log('Cleared existing admin data');

    const createdAdmins = [];
    for (const adminInfo of adminData) {
      const admin = await Admin.create(adminInfo);
      createdAdmins.push(admin);
    }
    
    console.log(`Seeded ${createdAdmins.length} admins`);
    return createdAdmins;
  } catch (error) {
    console.error('Error seeding admins:', error);
    throw error;
  }
};

const seedCategories = async () => {
  try {
    await Category.deleteMany({});
    console.log('Cleared existing category data');

    const createdCategories = await Category.insertMany(categoryData);
    console.log(`Seeded ${createdCategories.length} categories`);
    return createdCategories;
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
};

const seedPortfolios = async (admins, categories) => {
  try {
    portfolioCounter = 0;
    
    await Portfolio.deleteMany({});
    console.log('Cleared existing portfolio data');

    const portfolios = [];
    
    for (const admin of admins) {
      for (const category of categories) {
        const count = Math.floor(Math.random() * 6) + 5; // 5-10 items
        for (let i = 0; i < count; i++) {
          portfolios.push(getPortfolioData(admin._id, category._id));
        }
      }
    }

    const createdPortfolios = [];
    for (const portfolio of portfolios) {
      try {
        const createdPortfolio = await Portfolio.create(portfolio);
        createdPortfolios.push(createdPortfolio);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Skipping duplicate portfolio: ${portfolio.title}`);
          continue;
        } else {
          throw error;
        }
      }
    }
    
    console.log(`Seeded ${createdPortfolios.length} portfolio items`);
    return createdPortfolios;
  } catch (error) {
    console.error('Error seeding portfolios:', error);
    throw error;
  }
};

const seedClientSpaces = async (admins) => {
  try {
    await ClientSpace.deleteMany({});
    console.log('Cleared existing client space data');

    const clientSpaces = [];
    
    for (const admin of admins) {
      const count = Math.floor(Math.random() * 3) + 2; 
      for (let i = 0; i < count; i++) {
        const spaceData = getClientSpaceData(admin._id, i);
        // Hash client space key before inserting
        const hashedKey = await bcrypt.hash(spaceData.key, 10);
        clientSpaces.push({ ...spaceData, key: hashedKey });
      }
    }

    const createdSpaces = await ClientSpace.insertMany(clientSpaces);
    console.log(`Seeded ${createdSpaces.length} client spaces`);
    // Intentionally do not log client space keys

    return createdSpaces;
  } catch (error) {
    console.error('Error seeding client spaces:', error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('\nStarting database seeding...');
    
    const admins = await seedAdmins();
    const categories = await seedCategories();
    await seedPortfolios(admins, categories);
    await seedClientSpaces(admins);
    
    console.log(' Database seeding completed successfully!');
    // Avoid logging admin passwords in any environment
    
    process.exit(0);
  } catch (error) {
    console.error(' Error seeding database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  const isProd = (process.env.NODE_ENV || '').toLowerCase() === 'production';
  const allowDevSeed = process.env.SEED === '1' || process.argv.includes('--seed');
  const forceProdSeed = process.env.SEED_FORCE === '1' || process.argv.includes('--force');

  if (isProd && !forceProdSeed) {
    console.error('[SEED BLOCKED] NODE_ENV=production. Set SEED_FORCE=1 or pass --force to run explicitly.');
    process.exit(1);
  }

  if (!allowDevSeed && !forceProdSeed) {
    console.error('[SEED BLOCKED] To run seeder, set SEED=1 or pass --seed.');
    process.exit(1);
  }

  seedDatabase();
}

module.exports = {
  seedDatabase,
  seedAdmins,
  seedCategories,
  seedPortfolios,
  seedClientSpaces
};
