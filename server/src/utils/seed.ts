import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User';
import Lead from '../models/Lead';
import { UserRole, LeadStatus, LeadSource } from '../types';

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/smart-leads-dashboard';

const seedUsers = [
  { name: 'Admin User', email: 'admin@demo.com', password: 'admin123', role: UserRole.ADMIN },
  { name: 'Sales User', email: 'sales@demo.com', password: 'sales123', role: UserRole.SALES },
];

const leadNames = [
  'Rahul Sharma', 'Priya Patel', 'Arjun Mehta', 'Sneha Gupta', 'Vikram Singh',
  'Ananya Joshi', 'Rohan Verma', 'Deepika Nair', 'Amit Kumar', 'Kavya Reddy',
  'Siddharth Iyer', 'Meera Agarwal', 'Aditya Bose', 'Pooja Mishra', 'Karan Chaudhary',
  'Divya Sharma', 'Ravi Tiwari', 'Simran Kaur', 'Manish Jain', 'Tanvi Shah',
  'Neha Kapoor', 'Rajesh Rao', 'Sunita Pillai', 'Gaurav Malhotra', 'Poonam Saxena',
];

const statuses = Object.values(LeadStatus);
const sources = Object.values(LeadSource);

async function seed() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected');

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = await User.create(seedUsers);
    console.log(`👤 Created ${createdUsers.length} users`);

    const adminUser = createdUsers.find(u => u.role === UserRole.ADMIN)!;

    // Create leads
    const leads = leadNames.map((name, i) => ({
      name,
      email: name.toLowerCase().replace(' ', '.') + ['@gmail.com', '@company.in', '@outlook.com', '@yahoo.in'][i % 4],
      status: statuses[i % statuses.length],
      source: sources[i % sources.length],
      notes: i % 3 === 0 ? `Interested in enterprise plan. Follow up by ${new Date(Date.now() + (i + 1) * 86400000).toLocaleDateString()}` : undefined,
      createdBy: adminUser._id,
      createdAt: new Date(Date.now() - i * 3.5 * 24 * 3600000),
    }));

    await Lead.create(leads);
    console.log(`📋 Created ${leads.length} leads`);

    console.log('\n✅ Seed complete!\n');
    console.log('Demo credentials:');
    console.log('  Admin → admin@demo.com / admin123');
    console.log('  Sales → sales@demo.com / sales123\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
