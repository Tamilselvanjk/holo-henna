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
  const res = await loadRazorpayScript()

  if (!res) {
    throw new Error('Razorpay SDK failed to load')
  }

  return new Promise((resolve, reject) => {
    const razorpayOptions = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: orderAmount * 100,
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
      prefill: options.prefill || {},
      notes: options.notes || {},
      theme: {
        color: '#4285f4',
      },
      modal: {
        ondismiss: function () {
          reject(new Error('Payment cancelled'))
        },
      },
    }

    const paymentObject = new window.Razorpay(razorpayOptions)
    paymentObject.on('payment.failed', function (response) {
      reject(new Error(response.error.description))
    })

    paymentObject.open()
  })
}
