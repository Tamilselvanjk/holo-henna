import { useState, useEffect } from 'react'

export const useShoppingCart = () => {
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState({ title: '', message: '' })

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }

    showToastMessage(
      'Added to cart',
      `${product.name} has been added to your cart.`
    )
  }

  const updateQuantity = (productId, change) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
        }
        return item
      })
      .filter(Boolean)

    setCart(updatedCart)
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId))
  }

  const showToastMessage = (title, message) => {
    setToastMessage({ title, message })
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const toggleCart = () => {
    setShowCart(!showCart)
    document.body.style.overflow = showCart ? 'auto' : 'hidden'
  }

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return {
    cart,
    showCart,
    showToast,
    toastMessage,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    toggleCart,
  }
}
