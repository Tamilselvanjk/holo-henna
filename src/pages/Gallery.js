import React, { Suspense } from 'react'

import Gallery from '../components/GallryPage/Gallery/Gallery'
import PaymentTable from '../components/GallryPage/PaymentTable/PaymentTable'
import GalleryHero from '../components/GallryPage/GalleryHero/GalleryHero'
import Footer from '../components/Home/Footer/Footer'

const GalleryPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="gallery-page">
      
        <GalleryHero />
        <Gallery />
        <PaymentTable />
        <Footer />
      </div>
    </Suspense>
  )
}

export default GalleryPage
