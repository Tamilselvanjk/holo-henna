import React, { useRef, useState } from 'react'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { useGalleryNavigation } from '../../hooks/useGalleryNavigation'
import './Gallery.css'

// Data structure for the gallery sections and designs
const galleryData = [
  {
    id: 'illustration-infusion',
    title: 'Illustration Infusion',
    subtitle: 'Creative Mehndi Fantasies',
    designs: [
      {
        src: './webimg/creative1.jpeg',
        alt: 'Creative Mehndi Design',
        content: 'Manga Marvel',
      },
      {
        src: './webimg/creative2.jpeg',
        alt: 'Creative Mehndi Design',
        content: 'Hema Cherub',
      },
      {
        src: './webimg/creative3.jpeg',
        alt: 'Creative Mehndi Design',
        content: 'Cultural Devotion',
      },
    ],
  },
  {
    id: 'bridal-blooms',
    title: 'Bridal Blooms',
    subtitle: 'Floral Mehndi Creations',
    designs: [
      {
        src: './webimg/floral1.jpeg',
        alt: 'Floral Mehndi Design',
        content: 'Jhumkha',
      },
      {
        src: './webimg/floral2.jpeg',
        alt: 'Floral Mehndi Design',
        content: 'Floral',
      },
      {
        src: './webimg/floral3.jpeg',
        alt: 'Floral Mehndi Design',
        content: 'Blossomine',
      },
    ],
  },
  {
    id: 'bridal-bliss',
    title: 'Bridal Bliss',
    subtitle: 'Custom Mehndi Designs',
    designs: [
      {
        src: './webimg/custom1.jpeg',
        alt: 'Bridal Mehndi Design',
        content: 'Elegant Floral Creations',
      },
      {
        src: './webimg/custom2.jpg',
        alt: 'Royal Mehndi Design',
        content: 'Majestic King & Queen',
      },
      {
        src: './webimg/custom3.jpg',
        alt: 'Portrait Mehndi Design',
        content: 'True Faces of Love',
      },
    ],
  },
  {
    id: 'featured-collections',
    title: 'Featured Collections',
    subtitle: 'Our Finest Artistry',
    designs: [
      {
        src: './webimg/feature7.jpg',
        alt: 'Featured Mehndi Design',
        content: 'Custom Portraits',
      },
      {
        src: './webimg/feature4.jpeg',
        alt: 'Featured Mehndi Design',
         },
      {
        src: './webimg/feature5.jpeg',
        alt: 'Featured Mehndi Design',
        content: "The Bride's Canvas",
      },
    ],
  },
]

// Component for the Image Modal
const ImageModal = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modal" style={{ display: 'block' }}>
      {' '}
      {/* Added style to make it visible when open */}
      <span className="close-modal" onClick={onClose}>
        &times;
      </span>
      <img
        className="modal-content"
        id="modalImage"
        src={imageUrl}
        alt="Enlarged Mehndi Design"
      />
    </div>
  )
}

const DesignCard = ({ design, onClick, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div
      className={`design-card ${imageLoaded ? 'loaded' : ''}`}
      onClick={() => onClick(design.src)}
      style={{ '--index': index }}
    >
      <img
        src={process.env.PUBLIC_URL + design.src}
        alt={design.alt}
        className="card-image"
        onLoad={() => setImageLoaded(true)}
      />
      <div className={`card-content ${imageLoaded ? 'visible' : ''}`}>
        {design.content}
      </div>
    </div>
  )
}

const GallerySection = ({ section, onImageClick }) => {
  const sectionRef = useRef(null)
  const isVisible = useIntersectionObserver(sectionRef)

  return (
    <section
      ref={sectionRef}
      className={`gallery-section ${isVisible ? 'visible' : ''}`}
      id={section.id}
    >
      <div className="section-header">
        <div className="section-decoration top-left"></div>
        <div className="section-decoration bottom-right"></div>
        <h2 className="section-title">{section.title}</h2>
        <p className="section-subtitle">{section.subtitle}</p>
      </div>
      <div className="gallery-grid">
        {section.designs.map((design, index) => (
          <DesignCard
            key={index}
            design={design}
            onClick={onImageClick}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}

const Gallery = () => {
  const { activeSection } = useGalleryNavigation()
  const [modalOpen, setModalOpen] = useState(false)
  const [currentImageUrl, setCurrentImageUrl] = useState('')

  const openModal = (imageUrl) => {
    setCurrentImageUrl(imageUrl)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setCurrentImageUrl('')
  }

  return (
    <div className="container" id="gallery">
      {galleryData.map((section) => (
        <GallerySection
          key={section.id}
          section={section}
          onImageClick={openModal}
          isActive={section.id === activeSection}
        />
      ))}
    </div>
  )
}

export default Gallery
