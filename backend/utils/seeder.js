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
  {
    email: 'photographer@studioph.com',
    password: 'Photo123!',
    isVerified: true
  },
  {
    email: 'studio@studioph.com',
    password: 'Studio123!',
    isVerified: true
  }
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
    name: 'Events',
    description: 'Corporate events, parties, and special occasions',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Fashion',
    description: 'Fashion photography and editorial shoots',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Nature',
    description: 'Landscape and nature photography',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Street',
    description: 'Urban street photography and city life',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Commercial',
    description: 'Product and commercial photography',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Lifestyle',
    description: 'Lifestyle and documentary photography',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop'
  }
];

const portfolioData = [
  {
    title: 'Eternal Love - Wedding Ceremony',
    description: 'A beautiful outdoor wedding ceremony captured in golden hour light',
    imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1600&auto=format&fit=crop',
    category: null,
    photographer: null 
  },
  {
    title: 'Professional Headshot',
    description: 'Corporate headshot with modern lighting and professional backdrop',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600&auto=format&fit=crop',
    category: null,
    photographer: null
  },
  {
    title: 'Concert Energy',
    description: 'Dynamic concert photography capturing the energy of live music',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop',
    category: null,
    photographer: null
  },
  {
    title: 'Fashion Editorial',
    description: 'High-end fashion photography with dramatic lighting',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop',
    category: null,
    photographer: null
  },
  {
    title: 'Mountain Majesty',
    description: 'Breathtaking landscape photography of mountain ranges',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop',
    category: null,
    photographer: null
  },
  {
    title: 'Urban Shadows',
    description: 'Street photography exploring urban architecture and shadows',
    imageUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=1600&auto=format&fit=crop',
    category: null,
    photographer: null
  },
  {
    title: 'Product Showcase',
    description: 'Professional product photography with clean backgrounds',
    imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop',
    category: null,
    photographer: null
  },
  {
    title: 'Lifestyle Moment',
    description: 'Candid lifestyle photography capturing authentic moments',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
    category: null,
    photographer: null
  },
  {
    title: 'Wedding Reception',
    description: 'Intimate wedding reception with romantic lighting',
    imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1600&auto=format&fit=crop',
    category: null,
    photographer: null
  },
  {
    title: 'Corporate Event',
    description: 'Professional corporate event photography',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
    category: null,
    photographer: null
  },
  {
    title: 'Desert Dunes',
    description: 'Stunning desert landscape photography',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
    category: null,
    photographer: null
  },
  {
    title: 'Runway Fashion',
    description: 'High-energy runway fashion photography',
    imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1600&auto=format&fit=crop',
    category: null,
    photographer: null
  }
];

const clientSpaceData = [
  {
    name: 'Sarah & John Wedding',
    key: 'sarah-john-2024',
    images: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop'
    ],
    admin: null
  },
  {
    name: 'Corporate Conference 2024',
    key: 'corp-conf-2024',
    images: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop'
    ],
    admin: null
  },
  {
    name: 'Fashion Portfolio',
    key: 'fashion-portfolio-2024',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop'
    ],
    admin: null
  },
  {
    name: 'Nature Collection',
    key: 'nature-collection-2024',
    images: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=1200&auto=format&fit=crop'
    ],
    admin: null
  }
];


const seedAdmins = async () => {
  try {
    console.log('Seeding admins...');
    const admins = [];
    
    for (const admin of adminData) {
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      const newAdmin = new Admin({
        email: admin.email,
        password: hashedPassword,
        isVerified: admin.isVerified
      });
      admins.push(await newAdmin.save());
    }
    
    console.log(` ${admins.length} admins created successfully`);
    return admins;
  } catch (error) {
    console.error('Error seeding admins:', error);
    throw error;
  }
};

const seedCategories = async () => {
  try {
    console.log('Seeding categories...');
    const categories = [];
    
    for (const category of categoryData) {
      const newCategory = new Category(category);
      categories.push(await newCategory.save());
    }
    
    console.log(` ${categories.length} categories created successfully`);
    return categories;
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
};

const seedPortfolios = async (admins, categories) => {
  try {
    console.log('Seeding portfolios...');
    const portfolios = [];
    
    for (let i = 0; i < portfolioData.length; i++) {
      const portfolio = portfolioData[i];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomAdmin = admins[Math.floor(Math.random() * admins.length)];
      
      const newPortfolio = new Portfolio({
        title: portfolio.title,
        description: portfolio.description,
        imageUrl: portfolio.imageUrl,
        category: randomCategory._id,
        photographer: randomAdmin._id
      });
      
      portfolios.push(await newPortfolio.save());
    }
    
    console.log(`✅ ${portfolios.length} portfolios created successfully`);
    return portfolios;
  } catch (error) {
    console.error('Error seeding portfolios:', error);
    throw error;
  }
};

const seedClientSpaces = async (admins) => {
  try {
    console.log('Seeding client spaces...');
    const clientSpaces = [];
    
    for (let i = 0; i < clientSpaceData.length; i++) {
      const clientSpace = clientSpaceData[i];
      const randomAdmin = admins[Math.floor(Math.random() * admins.length)];
      
      const newClientSpace = new ClientSpace({
        name: clientSpace.name,
        key: clientSpace.key,
        images: clientSpace.images,
        admin: randomAdmin._id
      });
      
      clientSpaces.push(await newClientSpace.save());
    }
    
    console.log(`✅ ${clientSpaces.length} client spaces created successfully`);
    return clientSpaces;
  } catch (error) {
    console.error('❌ Error seeding client spaces:', error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('  Clearing existing data...');
    await Admin.deleteMany({});
    await Category.deleteMany({});
    await Portfolio.deleteMany({});
    await ClientSpace.deleteMany({});
    console.log(' Database cleared');
    
    // Seed data in order
    const admins = await seedAdmins();
    const categories = await seedCategories();
    const portfolios = await seedPortfolios(admins, categories);
    const clientSpaces = await seedClientSpaces(admins);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Admins: ${admins.length}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Portfolios: ${portfolios.length}`);
    console.log(`   - Client Spaces: ${clientSpaces.length}`);
    
    console.log('\n🔑 Admin credentials:');
    admins.forEach(admin => {
      console.log(`   Email: ${admin.email} | Password: ${adminData.find(a => a.email === admin.email).password}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};


if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
