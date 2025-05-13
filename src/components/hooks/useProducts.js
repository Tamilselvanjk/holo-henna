import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

export const useProducts = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [currentCategory, setCurrentCategory] = useState('all')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/data/products.json')
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        toast.error('Failed to load products')
      }
    }
    fetchProducts()
  }, [])

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
