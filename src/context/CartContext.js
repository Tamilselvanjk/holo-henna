import { createContext, useContext, useState } from 'react'
import { toast } from 'react-toastify'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    toast.success('Added to cart')
  }

  const updateQuantity = (productId, quantity) => {
    setCartItems(prev => 
      quantity === 0
        ? prev.filter(item => item.id !== productId)
        : prev.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const value = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    clearCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
