import React from 'react'
import Header from '../components/Home/Header/Header'
import Gallery from '../components/GallryPage/Gallery/Gallery'
import PaymentTable from '../components/GallryPage/PaymentTable/PaymentTable'
import GalleryHero from '../components/GallryPage/GalleryHero/GalleryHero'
import Footer from '../components/Home/Footer/Footer'

const GalleryPage = () => {
  return (
    <div>
     
      <GalleryHero />
      <Gallery />
      <PaymentTable />
      <Footer />
    </div>
  )
}

export default GalleryPage
