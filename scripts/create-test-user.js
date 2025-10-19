const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestUser() {
  const email = 'test@example.com'
  const password = 'test123456'
  
  try {
    console.log('👤 Creating test user...\n')
    
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    })
    
    if (existing) {
      console.log('⚠️  User already exists!')
      console.log()
      console.log('Updating password to default...')
      
      const hashedPassword = await bcrypt.hash(password, 10)
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      })
      
      console.log('✅ Password updated')
    } else {
      const hashedPassword = await bcrypt.hash(password, 10)
      
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: 'Test User',
        },
      })
      
      console.log('✅ Test user created!')
    }
    
    console.log()
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📝 Test User Credentials:')
    console.log('   Email:', email)
    console.log('   Password:', password)
    console.log('   Name: Test User')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log()
    console.log('🌐 Login at: http://localhost:3000/login')
    console.log()
    console.log('💡 Use these credentials to test login functionality')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
