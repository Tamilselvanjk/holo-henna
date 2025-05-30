const Product = require('../models/productModel')
const connectDatabase = require('../config/connectDatabase')
require('dotenv').config()

const products = [
  {
    name: 'Traditional Henna Cone',
    price: 12.99,
    stock: 10,
    description: 'High-quality handmade henna cone for traditional designs',
    images: [{ image: '/webimg/product1.jpg' }],
    category: 'Traditional',
    ratings: 4.5,
    numOfReviews: 128,
    reviews: [],
    seller: 'Elegant Mehandi Store',
  },
  {
    name: 'Bridal Henna Kit',
    price: 49.99,
    stock: 10,
    description: 'Complete bridal henna kit with premium cones and accessories',
    images: [{ image: '/webimg/product2.webp' }],
    category: 'Bridal',
    ratings: 5,
    numOfReviews: 89,
    reviews: [],
    seller: 'Henna Bridal Artisans',
  },
  {
    name: 'Natural Black Henna',
    price: 15.99,
    stock: 10,
    description: 'Pure natural black henna powder for deep, rich color',
    images: [{ image: '/webimg/product3.png' }],
    category: 'Traditional',
    ratings: 4.2,
    numOfReviews: 56,
    reviews: [],
    seller: "Nature's Touch",
  },
  {
    id: 4,
    name: 'Premium Design Stencils',
    price: 24.99,
    image: '/webimg/product4.webp',
    category: 'Modern',
    rating: 4.7,
    reviews: 42,
    description: 'Set of modern design stencils for quick and elegant patterns',
  },
  {
    id: 5,
    name: 'Organic Henna Powder',
    price: 19.99,
    image: '/webimg/product5.jpg',
    category: 'Traditional',
    rating: 4.8,
    reviews: 95,
    description: 'Pure organic henna powder for natural and safe application',
  },
  {
    id: 6,
    name: 'Arabic Design Kit',
    price: 34.99,
    image: '/webimg/product6.jpg',
    category: 'Arabic',
    rating: 4.6,
    reviews: 73,
    description: 'Complete kit for creating intricate Arabic henna designs',
  },
  {
    id: 7,
    name: 'Floral Pattern Book',
    price: 29.99,
    image: '/webimg/floral1.jpeg',
    category: 'Floral',
    rating: 4.4,
    reviews: 38,
    description: 'Collection of beautiful floral henna patterns and designs',
  },
  {
    id: 8,
    name: 'Custom Design Service',
    price: 79.99,
    image: '/webimg/custom1.jpeg',
    category: 'Custom Designs',
    rating: 4.9,
    reviews: 25,
    description: 'Personalized henna design consultation and service',
  },
]

const seedProducts = async () => {
  try {
    await connectDatabase()
    await Product.deleteMany()
    console.log('Products deleted')

    await Product.insertMany(products)
    console.log('Products seeded successfully')

    process.exit()
  } catch (error) {
    console.error('Error seeding products:', error)
    process.exit(1)
  }
}

seedProducts()
