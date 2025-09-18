const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedChatRooms() {
  try {
    console.log('🌱 Seeding chat rooms...');

    // Create default chat rooms
    const rooms = [
      {
        name: 'general',
        description: 'General discussion for all users'
      },
      {
        name: 'support',
        description: 'Customer support and help'
      },
      {
        name: 'vip',
        description: 'VIP members exclusive chat'
      }
    ];

    for (const room of rooms) {
      await prisma.chatRoom.upsert({
        where: { name: room.name },
        update: {},
        create: room
      });
    }

    console.log('✅ Chat rooms seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding chat rooms:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedChatRooms();
}

module.exports = { seedChatRooms };
