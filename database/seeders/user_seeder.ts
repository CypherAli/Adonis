import { User } from '#models/user'

export default class UserSeeder {
  async run() {
    // Check if users already exist
    const existingUsers = await User.countDocuments()
    if (existingUsers > 0) {
      console.log('Users already exist, skipping seed...')
      return
    }

    console.log('Seeding default users...')

    // Admin account
    await User.create({
      username: 'admin',
      email: 'admin@laptopstore.com',
      password: 'Admin@123', // Will be hashed by pre-save hook
      role: 'admin',
      isActive: true,
      isApproved: true,
    })

    // Partner account (Seller)
    await User.create({
      username: 'partner1',
      email: 'partner@laptopstore.com',
      password: 'Partner@123',
      role: 'partner',
      shopName: 'Premium Laptop Store',
      shopAddress: '123 Tech Street, Ho Chi Minh City',
      shopDescription: 'Official laptop distributor',
      isActive: true,
      isApproved: true,
    })

    // Customer account
    await User.create({
      username: 'customer',
      email: 'customer@example.com',
      password: 'Customer@123',
      role: 'client',
      fullName: 'Test Customer',
      phone: '0123456789',
      isActive: true,
    })

    console.log('✅ Seeded 3 default users:')
    console.log('1. Admin: admin@laptopstore.com / Admin@123')
    console.log('2. Partner: partner@laptopstore.com / Partner@123')
    console.log('3. Customer: customer@example.com / Customer@123')
  }
}
