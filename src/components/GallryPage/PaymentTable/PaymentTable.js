import React, { useEffect, useState } from 'react'
import './PaymentTable.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowRight,
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'

// Add icons to library
library.add(faArrowRight, faCheck, faXmark)

const packageData = [
  { label: 'Price', property: 'price' },
  { label: 'Number of Artists', property: 'artists' },
  { label: 'Hand Length', property: 'handLength' },
  { label: 'Leg Length', property: 'legLength' },
  { label: 'Number of Symbols', property: 'symbols' },
  { label: 'Duration', property: 'duration' },
  { label: 'Trial Session', property: 'trial' },
  { label: 'Customized Design', property: 'customized' },
  { label: 'Digital Invitation', property: 'invitation' },
  { label: 'Photography', property: 'photography' },
  { label: 'Background Songs', property: 'songs' },
  { label: 'Decoration', property: 'decoration' },
  { label: 'Welcome Board', property: 'welcomeBoard' }
]

const packages = [
  {
    id: 'basic',
    name: 'Basic',
    price: '₹ 6000',
    artists: 1,
    handLength: 'Bangle',
    legLength: 'Ankle',
    symbols: 2,
    duration: '5 hrs',
    trial: false,
    customized: false,
    invitation: false,
    photography: false,
    songs: false,
    decoration: false,
    welcomeBoard: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹ 10000',
    artists: 2,
    handLength: 'Elbow',
    legLength: 'Above Ankle',
    symbols: 4,
    duration: '4 hrs',
    trial: false,
    customized: false,
    invitation: false,
    photography: false,
    songs: false,
    decoration: false,
    welcomeBoard: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹ 18000',
    artists: 3,
    handLength: 'Above Elbow',
    legLength: 'Mid Knee Length',
    symbols: 8,
    duration: '5 hrs',
    trial: true,
    customized: true,
    invitation: true,
    photography: false,
    songs: false,
    decoration: false,
    welcomeBoard: false,
  },
  {
    id: 'elite',
    name: 'Elite',
    price: '₹ 25000',
    artists: 4,
    handLength: 'Above Elbow',
    legLength: 'Knee Length',
    symbols: '8+',
    duration: '5+ hrs',
    trial: true,
    customized: true,
    invitation: true,
    photography: true,
    songs: true,
    decoration: true,
    welcomeBoard: true,
  },
]

const PackageTable = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className={`paymentContainer ${isVisible ? 'animateFadeIn' : ''}`}>
      <div className="sectionTitle">
        <h2>Compare Our Bridal Packages</h2>
        <p>Select the perfect package for your special occasion</p>
      </div>

      <div className="tableContainer">
        <table className="table">
          <thead className="tableHeader">
            <tr>
              {['Package Inclusions', ...packages.map((pkg) => pkg.name)].map(
                (header, index) => (
                  <th
                    key={index}
                    className={`animateSlideIn ${
                      header === 'Elite' ? 'highlighted' : ''
                    }`}
                    style={{
                      animationDelay: `${0.2 * index}s`,
                      opacity: isVisible ? 1 : 0,
                    }}
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="tableBody">
            {packageData.map((row, index) => (
              <tr
                key={index}
                className="animateFadeIn"
                style={{
                  animationDelay: `${0.4 + index * 0.1}s`,
                  opacity: isVisible ? 1 : 0,
                }}
              >
                <td data-label="Package Inclusions">{row.label}</td>
                {packages.map((pkg, pkgIndex) => (
                  <td key={pkgIndex} data-label={pkg.name}>
                    {typeof pkg[row.property] === 'string' ||
                    typeof pkg[row.property] === 'number' ? (
                      <span className={`priceTag ${pkg.name === 'Elite' ? 'elitePrice' : ''}`}>
                        {pkg[row.property]}
                      </span>
                    ) : (
                      <span
                        className={pkg[row.property] ? 'checkIcon' : 'xIcon'}
                        title={pkg[row.property] ? 'Included' : 'Not Included'}
                      >
                        <FontAwesomeIcon
                          icon={pkg[row.property] ? faCheck : faXmark}
                          className="icon-animation"
                        />
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="bookBtnContainer animateFadeIn"
        style={{
          animationDelay: '1.5s',
          opacity: isVisible ? 1 : 0,
        }}
      >
        <button className="btnBook">
          Book Your Package Now
          <FontAwesomeIcon icon={faArrowRight} className="animate-bounce" />
        </button>
      </div>
    </div>
  )
}

export default PackageTable
