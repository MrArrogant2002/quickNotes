const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function getResetToken(email) {
  try {
    console.log('🔍 Looking up reset token...\n')
    
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        email: true,
        name: true,
        resetToken: true,
        resetTokenExpiry: true,
      },
    })
    
    if (!user) {
      console.log('❌ User not found with email:', email)
      console.log('\n💡 Make sure the email exists in the database.')
      return
    }
    
    console.log('✅ User found:')
    console.log('   Name:', user.name || 'N/A')
    console.log('   Email:', user.email)
    console.log()
    
    if (!user.resetToken) {
      console.log('⚠️  No reset token found!')
      console.log('\n💡 Steps to generate a token:')
      console.log('   1. Go to: http://localhost:3000/forgot-password')
      console.log('   2. Enter email:', email)
      console.log('   3. Click "Send Reset Link"')
      console.log('   4. Run this script again')
      return
    }
    
    const now = new Date()
    const isExpired = user.resetTokenExpiry && new Date(user.resetTokenExpiry) < now
    
    console.log('🔑 Reset Token:', user.resetToken)
    console.log()
    console.log('⏰ Expires:', user.resetTokenExpiry?.toLocaleString() || 'N/A')
    
    if (isExpired) {
      console.log('❌ Status: EXPIRED')
      console.log('\n💡 This token has expired. Request a new password reset.')
    } else {
      console.log('✅ Status: VALID')
      console.log()
      console.log('📋 Copy this URL and paste in your browser:')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log(`http://localhost:3000/reset-password?token=${user.resetToken}`)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

// Get email from command line argument or use default
const email = process.argv[2]

if (!email) {
  console.log('❌ Please provide an email address')
  console.log('\nUsage:')
  console.log('  node scripts/get-reset-token.js your.email@example.com')
  process.exit(1)
}

getResetToken(email)
