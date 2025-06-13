const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export const initializeRazorpay = async (orderAmount, options = {}) => {
  try {
    const scriptLoaded = await loadRazorpayScript()

    if (!scriptLoaded) {
      throw new Error('Razorpay SDK failed to load')
    }

    return new Promise((resolve, reject) => {
      const razorpayOptions = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: Math.round(orderAmount * 100), // Convert to paise
        currency: 'INR',
        name: 'Holo Henna',
        description: 'Mehndi Service Payment',
        image: '/webimg/logo.png',
        handler: function (response) {
          resolve({
            success: true,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
          })
        },
        prefill: {
          name: options.prefill?.name || '',
          email: options.prefill?.email || '',
          contact: options.prefill?.contact || '',
        },
        notes: options.notes || {},
        theme: {
          color: '#4285f4',
        },
        modal: {
          ondismiss: () => reject(new Error('Payment cancelled by user')),
        },
      }

      const paymentObject = new window.Razorpay(razorpayOptions)

      paymentObject.on('payment.failed', (response) => {
        reject(new Error(response.error.description || 'Payment failed'))
      })

      paymentObject.open()
    })
  } catch (error) {
    console.error('Razorpay initialization error:', error)
    throw error
  }
}
