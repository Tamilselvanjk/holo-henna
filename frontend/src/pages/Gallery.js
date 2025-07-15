import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Home/Header/Header'
import Gallery from '../components/GallryPage/Gallery/Gallery'
import PaymentTable from '../components/GallryPage/PaymentTable/PaymentTable'
import GalleryHero from '../components/GallryPage/GalleryHero/GalleryHero'
import Footer from '../components/Home/Footer/Footer'

const GalleryPage = () => {
  const location = useLocation()
  const paymentTableRef = useRef(null)

  useEffect(() => {
    if (location.state?.scrollTo === 'payment-table' && paymentTableRef.current) {
      setTimeout(() => {
        paymentTableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    }
  }, [location])

  return (
    <div>
      <GalleryHero />
      <Gallery />
      <div ref={paymentTableRef}>
        <PaymentTable />
      </div>
      <Footer />
    </div>
  )
}

export default GalleryPage
