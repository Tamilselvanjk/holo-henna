import { useState, useEffect } from 'react'

const PRODUCTS = [
  {
    id: '1',
    name: 'Premium Bridal Mehandi Cone',
    category: 'Bridal Mehandi Cones',
    price: 24.99,
    image: '/webimg/product4.webp',
    description: 'High-quality henna cone for intricate bridal designs',
    rating: 5,
    reviewCount: 42,
  },
  // ... other products
]

export const useProducts = () => {
  const [products, setProducts] = useState(PRODUCTS)
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [currentCategory, setCurrentCategory] = useState('all')

  useEffect(() => {
    let result = [...products]

    // Filter by category
    if (currentCategory !== 'all') {
      result = result.filter((product) => product.category === currentCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      )
    }

    // Sort products
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'rating':
          return b.rating - a.rating
        default:
          return 0
      }
    })

    setFilteredProducts(result)
  }, [products, searchQuery, sortBy, currentCategory])

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleSort = (sortOption) => {
    setSortBy(sortOption)
  }

  const handleCategoryChange = (category) => {
    setCurrentCategory(category)
  }

  return {
    products,
    filteredProducts,
    searchQuery,
    sortBy,
    currentCategory,
    handleSearch,
    handleSort,
    handleCategoryChange,
  }
}
