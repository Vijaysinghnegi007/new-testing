const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

// Create admin user (with secure password)
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@travelweb.com' },
    update: {
      role: 'ADMIN',
      isEmailVerified: true,
      password: adminPasswordHash,
    },
    create: {
      email: 'admin@travelweb.com',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isEmailVerified: true,
      password: adminPasswordHash,
    },
  });

  console.log('✅ Admin user created');

  // Create vendor users
  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendor@travelweb.com' },
    update: {},
    create: {
      email: 'vendor@travelweb.com',
      username: 'travelvendor',
      firstName: 'Travel',
      lastName: 'Vendor',
      role: 'VENDOR',
      isEmailVerified: true,
    },
  });

  // Create vendor profile
  const vendorProfile = await prisma.vendorProfile.upsert({
    where: { userId: vendorUser.id },
    update: {},
    create: {
      userId: vendorUser.id,
      companyName: 'Adventure Travel Co.',
      description: 'Specialized in adventure and cultural tours worldwide',
      website: 'https://adventuretravel.com',
      isVerified: true,
      rating: 4.8,
      totalReviews: 125,
    },
  });

  console.log('✅ Vendor user and profile created');

  // Create sample destinations
  const destinations = [
    {
      name: 'Paris, France',
      slug: 'paris-france',
      description: 'The City of Light offers romantic ambiance, world-class museums, and iconic landmarks.',
      country: 'France',
      city: 'Paris',
      latitude: 48.8566,
      longitude: 2.3522,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1471623432079-b009d30b6729?w=600&h=400&fit=crop'
      ]),
      featured: true,
    },
    {
      name: 'Tokyo, Japan',
      slug: 'tokyo-japan',
      description: 'A fascinating blend of ancient traditions and cutting-edge technology.',
      country: 'Japan',
      city: 'Tokyo',
      latitude: 35.6762,
      longitude: 139.6503,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop'
      ]),
      featured: true,
    },
    {
      name: 'Bali, Indonesia',
      slug: 'bali-indonesia',
      description: 'Tropical paradise with stunning beaches, rich culture, and spiritual experiences.',
      country: 'Indonesia',
      city: 'Denpasar',
      latitude: -8.4095,
      longitude: 115.1889,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&h=400&fit=crop'
      ]),
      featured: true,
    },
    {
      name: 'Swiss Alps, Switzerland',
      slug: 'swiss-alps-switzerland',
      description: 'Breathtaking mountain scenery, pristine lakes, and charming alpine villages.',
      country: 'Switzerland',
      city: 'Interlaken',
      latitude: 46.6863,
      longitude: 7.8632,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=600&h=400&fit=crop'
      ]),
      featured: true,
    },
    {
      name: 'Maldives',
      slug: 'maldives',
      description: 'Luxury overwater villas, crystal-clear waters, and world-class diving.',
      country: 'Maldives',
      city: 'Malé',
      latitude: 3.2028,
      longitude: 73.2207,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop'
      ]),
      featured: true,
    },
  ];

  const createdDestinations = [];
  for (const dest of destinations) {
    const destination = await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: dest,
      create: dest,
    });
    createdDestinations.push(destination);
  }

  console.log('✅ Destinations created');

  // Create sample tours
  const tours = [
    {
      title: 'Bali Cultural Adventure',
      slug: 'bali-cultural-adventure',
      description: 'Immerse yourself in the rich culture of Bali with temple visits, traditional dance performances, and authentic local experiences. This 7-day journey takes you through the spiritual heart of Indonesia.',
      shortDescription: 'Experience authentic Balinese culture with temple visits and traditional experiences.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&h=400&fit=crop'
      ]),
      category: 'CULTURAL',
      duration: 7,
      maxGroupSize: 12,
      minAge: 16,
      difficulty: 'Easy',
      basePrice: 1299,
      discountPrice: 999,
      included: JSON.stringify([
        'Airport transfers',
        'Accommodation (4-star hotels)',
        'Daily breakfast',
        'Professional guide',
        'Temple entrance fees',
        'Cultural performances',
        'Traditional cooking class'
      ]),
      excluded: JSON.stringify([
        'International flights',
        'Lunch and dinner',
        'Personal expenses',
        'Travel insurance',
        'Tips for guide and driver'
      ]),
      highlights: JSON.stringify([
        'Visit ancient temples including Tanah Lot',
        'Traditional Kecak fire dance performance',
        'Rice terrace trek in Jatiluwih',
        'Balinese cooking class',
        'Local market visit',
        'Art village tour in Ubud'
      ]),
      itinerary: JSON.stringify([
        { day: 1, title: 'Arrival in Bali', description: 'Airport pickup and hotel check-in. Evening welcome dinner.' },
        { day: 2, title: 'Ubud Cultural Tour', description: 'Visit art villages, monkey forest, and traditional markets.' },
        { day: 3, title: 'Temple Hopping', description: 'Explore Besakih Temple and Tirta Empul holy spring.' },
        { day: 4, title: 'Rice Terraces & Villages', description: 'Trek through Jatiluwih rice terraces and visit local villages.' },
        { day: 5, title: 'Traditional Arts', description: 'Batik making workshop and traditional dance performance.' },
        { day: 6, title: 'Cooking Class & Relaxation', description: 'Balinese cooking class and spa treatment.' },
        { day: 7, title: 'Departure', description: 'Transfer to airport for departure.' }
      ]),
      status: 'PUBLISHED',
      featured: true,
      rating: 4.8,
      totalReviews: 245,
      totalBookings: 89,
      vendorId: vendorUser.id,
      destinationId: createdDestinations.find(d => d.slug === 'bali-indonesia').id,
    },
    {
      title: 'Swiss Alps Hiking Experience',
      slug: 'swiss-alps-hiking-experience',
      description: 'Discover the breathtaking beauty of the Swiss Alps on this 10-day hiking adventure. Experience stunning mountain vistas, pristine lakes, and charming alpine villages.',
      shortDescription: 'Epic hiking adventure through the stunning Swiss Alps with mountain views.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=600&h=400&fit=crop'
      ]),
      category: 'ADVENTURE',
      duration: 10,
      maxGroupSize: 8,
      minAge: 18,
      difficulty: 'Challenging',
      basePrice: 2499,
      discountPrice: 2199,
      included: JSON.stringify([
        'Airport transfers',
        'Mountain lodge accommodation',
        'All meals',
        'Professional mountain guide',
        'Hiking equipment',
        'Cable car tickets',
        'First aid kit'
      ]),
      excluded: JSON.stringify([
        'International flights',
        'Travel insurance',
        'Personal hiking gear',
        'Alcoholic beverages',
        'Laundry services'
      ]),
      highlights: JSON.stringify([
        'Matterhorn base camp trek',
        'Jungfraujoch - Top of Europe',
        'Lake Geneva scenic views',
        'Traditional Swiss village stays',
        'Alpine wildlife spotting',
        'Mountain photography workshop'
      ]),
      itinerary: JSON.stringify([
        { day: 1, title: 'Arrival in Zurich', description: 'Airport pickup and transfer to mountain lodge.' },
        { day: 2, title: 'Zermatt & Matterhorn', description: 'Trek to Matterhorn base camp with stunning views.' },
        { day: 3, title: 'Gornergrat Railway', description: 'Scenic railway journey and high altitude hiking.' },
        { day: 4, title: 'Interlaken Adventure', description: 'Lake Thun and Lake Brienz exploration.' },
        { day: 5, title: 'Jungfraujoch Expedition', description: 'Journey to the Top of Europe by train.' },
        { day: 6, title: 'Grindelwald Trek', description: 'Hiking through alpine meadows and glacial valleys.' },
        { day: 7, title: 'Lauterbrunnen Valley', description: 'Waterfall hikes and valley exploration.' },
        { day: 8, title: 'Lake Geneva', description: 'Scenic lakeside walks and vineyard visits.' },
        { day: 9, title: 'Lucerne & Mt. Pilatus', description: 'Cable car ascent and panoramic views.' },
        { day: 10, title: 'Departure', description: 'Return to Zurich for departure.' }
      ]),
      status: 'PUBLISHED',
      featured: true,
      rating: 4.9,
      totalReviews: 189,
      totalBookings: 67,
      vendorId: vendorUser.id,
      destinationId: createdDestinations.find(d => d.slug === 'swiss-alps-switzerland').id,
    },
    {
      title: 'Maldives Luxury Retreat',
      slug: 'maldives-luxury-retreat',
      description: 'Indulge in the ultimate luxury experience in the Maldives with overwater villas, private beaches, and world-class spa treatments in this tropical paradise.',
      shortDescription: 'Ultimate luxury experience with overwater villas and pristine beaches.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop'
      ]),
      category: 'LUXURY',
      duration: 5,
      maxGroupSize: 4,
      minAge: 21,
      difficulty: 'Easy',
      basePrice: 3999,
      discountPrice: 3499,
      included: JSON.stringify([
        'Seaplane transfers',
        'Overwater villa accommodation',
        'All meals and beverages',
        'Private butler service',
        'Spa treatments',
        'Water sports equipment',
        'Sunset cruise'
      ]),
      excluded: JSON.stringify([
        'International flights',
        'Alcoholic premium brands',
        'Personal shopping',
        'Diving certification courses',
        'Excursions to other islands'
      ]),
      highlights: JSON.stringify([
        'Private overwater villa',
        'Unlimited spa treatments',
        'Private beach access',
        'Sunset dolphin cruise',
        'Underwater restaurant dining',
        'Professional diving excursions'
      ]),
      itinerary: JSON.stringify([
        { day: 1, title: 'Arrival in Paradise', description: 'Seaplane transfer to resort and villa check-in.' },
        { day: 2, title: 'Ocean Adventures', description: 'Snorkeling, diving, and water sports activities.' },
        { day: 3, title: 'Spa & Wellness', description: 'Full day spa treatments and relaxation.' },
        { day: 4, title: 'Island Exploration', description: 'Sunset cruise and underwater restaurant dining.' },
        { day: 5, title: 'Farewell', description: 'Final breakfast and seaplane transfer to airport.' }
      ]),
      status: 'PUBLISHED',
      featured: true,
      rating: 5.0,
      totalReviews: 156,
      totalBookings: 34,
      vendorId: vendorUser.id,
      destinationId: createdDestinations.find(d => d.slug === 'maldives').id,
    },
  ];

  const createdTours = [];
  for (const tour of tours) {
    const createdTour = await prisma.tour.upsert({
      where: { slug: tour.slug },
      update: tour,
      create: tour,
    });
    createdTours.push(createdTour);
  }

  console.log('✅ Tours created');

  // Create tour availability for each tour
  const now = new Date();
  for (const tour of createdTours) {
    for (let i = 1; i <= 6; i++) {
      const startDate = new Date(now);
      startDate.setDate(now.getDate() + (i * 14)); // Every 2 weeks
      
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + tour.duration);

      await prisma.tourAvailability.create({
        data: {
          tourId: tour.id,
          startDate,
          endDate,
          availableSpots: tour.maxGroupSize,
          bookedSpots: Math.floor(Math.random() * (tour.maxGroupSize / 2)),
          price: tour.discountPrice || tour.basePrice,
        },
      });
    }
  }

  console.log('✅ Tour availability created');

  // Create some sample users
  const sampleUsers = [
    {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
      isEmailVerified: true,
    },
    {
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'PREMIUM',
      isEmailVerified: true,
      loyaltyPoints: 1250,
    },
  ];

  const createdUsers = [];
  for (const user of sampleUsers) {
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
    createdUsers.push(createdUser);
  }

  console.log('✅ Sample users created');

  // Create sample reviews
  const reviews = [
    {
      userId: createdUsers[0].id,
      tourId: createdTours[0].id, // Bali Cultural Adventure
      rating: 5,
      title: 'Amazing Cultural Experience',
      comment: 'This tour exceeded all my expectations! The guides were knowledgeable, the temples were breathtaking, and the cooking class was so much fun. Highly recommend!',
      isVerified: true,
      helpfulVotes: 15,
    },
    {
      userId: createdUsers[1].id,
      tourId: createdTours[1].id, // Swiss Alps Hiking
      rating: 5,
      title: 'Challenging but Rewarding',
      comment: 'The Swiss Alps tour was physically demanding but absolutely worth it. The views were incredible and our guide was very professional. Perfect for adventure seekers!',
      isVerified: true,
      helpfulVotes: 12,
    },
  ];

  for (const review of reviews) {
    await prisma.review.upsert({
      where: {
        userId_tourId: {
          userId: review.userId,
          tourId: review.tourId,
        },
      },
      update: review,
      create: review,
    });
  }

  console.log('✅ Sample reviews created');

  // Create blog posts
  const blogPosts = [
    {
      title: 'Top 10 Hidden Gems in Southeast Asia',
      slug: 'top-10-hidden-gems-southeast-asia',
      content: 'Discover the lesser-known treasures of Southeast Asia that will take your breath away...',
      excerpt: 'Explore amazing hidden destinations across Southeast Asia that most travelers never see.',
      featuredImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop',
      tags: JSON.stringify(['Travel Tips', 'Southeast Asia', 'Hidden Gems']),
      published: true,
      views: 1250,
    },
    {
      title: 'Travel Photography Tips for Beginners',
      slug: 'travel-photography-tips-beginners',
      content: 'Learn how to capture stunning travel photos with these essential tips and techniques...',
      excerpt: 'Master the art of travel photography with these beginner-friendly tips and tricks.',
      featuredImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop',
      tags: JSON.stringify(['Photography', 'Travel Tips', 'Beginners']),
      published: true,
      views: 890,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  console.log('✅ Blog posts created');

  // Create system settings
  const settings = [
    { key: 'site_name', value: 'TravelWeb' },
    { key: 'site_description', value: 'Your gateway to extraordinary travel experiences' },
    { key: 'contact_email', value: 'contact@travelweb.com' },
    { key: 'support_email', value: 'support@travelweb.com' },
    { key: 'default_currency', value: 'USD' },
    { key: 'commission_rate', value: '10.0' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log('✅ System settings created');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
