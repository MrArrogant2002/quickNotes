const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function resetPassword(email, newPassword) {
  try {
    console.log('🔄 Resetting password...\n')
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true },
    })
    
    if (!user) {
      console.log('❌ User not found with email:', email)
      console.log('\n💡 Available options:')
      console.log('   1. Register at: http://localhost:3000/register')
      console.log('   2. Check if email is spelled correctly')
      return
    }
    
    console.log('✅ User found:')
    console.log('   Name:', user.name || 'N/A')
    console.log('   Email:', user.email)
    console.log()
    
    // Hash the new password
    console.log('🔐 Hashing password...')
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    console.log('✅ Password hashed')
    console.log()
    
    // Update in database
    console.log('💾 Updating database...')
    await prisma.user.update({
      where: { email },
      data: { 
        password: hashedPassword,
        // Clear any existing reset tokens
        resetToken: null,
        resetTokenExpiry: null,
      },
    })
    
    console.log('✅ Password reset successfully!')
    console.log()
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📝 New Login Credentials:')
    console.log('   Email:', email)
    console.log('   Password:', newPassword)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log()
    console.log('🌐 Login at: http://localhost:3000/login')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

// Get credentials from command line
const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.log('❌ Missing arguments')
  console.log('\nUsage:')
  console.log('  node scripts/reset-user-password.js <email> <new-password>')
  console.log('\nExample:')
  console.log('  node scripts/reset-user-password.js user@example.com newpassword123')
  process.exit(1)
}

if (password.length < 6) {
  console.log('❌ Password must be at least 6 characters')
  process.exit(1)
}

resetPassword(email, password)
