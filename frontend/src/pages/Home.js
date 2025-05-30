import React from 'react'
import Header from '../components/Home/Header/Header'
import Hero from '../components/Home/Hero/Hero'
import WhyChooseUs from '../components/Home/WhyChooseUs/WhyChooseUs'
import ShopSection from '../components/Home/ShopSection/ShopSection'
import PricingSection from '../components/Home/PricingSection/PricingSection'
import Testimonials from '../components/Home/Testimonials/Testimonials'
import FeaturedProducts from '../components/Home/FeaturedProducts/FeaturedProducts'
import StreamlinedProcess from '../components/Home/StreamlinedProcess/StreamlinedProcess'
import Experience from '../components/Home/Experience/Experience'
import Booking from '../components/Home/Booking/Booking'
import Footer from '../components/Home/Footer/Footer'

const Home = () => {
  return (
    <div>
      <Hero />
      <WhyChooseUs />
      <ShopSection />
      <PricingSection />
      <Testimonials />
      <FeaturedProducts />
      <StreamlinedProcess />
      <Experience />
      <Booking />
      <Footer />
    </div>
  )
}

export default Home
