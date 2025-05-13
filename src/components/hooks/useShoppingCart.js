import { useState, useCallback, useEffect } from 'react'

export const useShoppingCart = () => {
  const [carts, setCarts] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState({ message: '', title: '' })
  const [cartTotal, setCartTotal] = useState(0)

  const calculateTotal = useCallback(() => {
    const total = carts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    setCartTotal(total)
  }, [carts])

  useEffect(() => {
    calculateTotal() // Use it in an effect
  }, [carts, calculateTotal])

  const addToCart = useCallback((product) => {
    setCarts((prevCarts) => {
      const existingItem = prevCarts.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCarts.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCarts, { ...product, quantity: 1 }]
    })
    setToastMessage({ message: 'Item added to cart', title: 'Success' })
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }, [])

  const updateQuantity = useCallback((productId, newQuantity) => {
    setCarts((prevCarts) => {
      if (newQuantity <= 0) {
        return prevCarts.filter((item) => item.id !== productId)
      }
      return prevCarts.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    })
  }, [])

  const removeFromCart = useCallback((productId) => {
    setCarts((prevCarts) => prevCarts.filter((item) => item.id !== productId))
  }, [])

  const toggleCart = useCallback(() => {
    setShowCart((prev) => !prev)
  }, [])

  return {
    carts,
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
