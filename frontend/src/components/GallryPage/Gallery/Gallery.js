import React, { useRef, useState } from 'react'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { useGalleryNavigation } from '../../hooks/useGalleryNavigation'
import VideoGallery from '../VedioGallery/VideoGallery'
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
        type: 'image'
      },
      {
        src: './webimg/creative2.jpeg',
        alt: 'Creative Mehndi Design',
        content: 'Hema Cherub',
        type: 'image'
      },
      {
        src: './webimg/creative3.jpeg',
        alt: 'Creative Mehndi Design',
        content: 'Cultural Devotion',
        type: 'image'
      },
      {
        src: './webimg/creative4.jpg',
        alt: 'Creative Mehndi Design',
        content: 'Floral Fusion',
        type: 'image'
      },
      {
        src: './webimg/creative5.jpeg',
        alt: 'Creative Mehndi Design',
        content: 'Geometric Grace',
        type: 'image'
      },
      {
        src: './webimg/SAR04303.jpg',
        alt: 'Creative Mehndi Design',
        content: 'beautiful design',
        type: 'image'
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
        type: 'image'
      },
      {
        src: './webimg/floral2.jpeg',
        alt: 'Floral Mehndi Design',
        content: 'Floral',
        type: 'image'
      },
      {
        src: './webimg/floral3.jpeg',
        alt: 'Floral Mehndi Design',
        content: 'Blossomine',
        type: 'image'
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
        type: 'image'
      },
      {
        src: './webimg/custom2.jpg',
        alt: 'Royal Mehndi Design',
        content: 'Majestic King & Queen',
        type: 'image'
      },
      {
        src: './webimg/custom3.jpeg',
        alt: 'Portrait Mehndi Design',
        content: 'True Faces of Love',
        type: 'image'
      },
      {
        src: './webimg/bridalblis.jpg',
        alt: 'Portrait Mehndi Design',
        content: 'vintage elegance',
        type: 'image'
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
        type: 'image'
      },
      {
        src: './webimg/feature4.jpeg',
        alt: 'Featured Mehndi Design',
        content: "Floral Elegance",
        type: 'image'
      },
      {
        src: './webimg/feature5.jpeg',
        alt: 'Featured Mehndi Design',
        content: "The Bride's Canvas",
        type: 'image'
      },
    ],
  },
]



// Component for the Image/Video Modal
const MediaModal = ({ isOpen, mediaUrl, mediaType, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-modal" onClick={onClose}>
          &times;
        </span>
        {mediaType === 'image' ? (
          <img src={mediaUrl} alt="Enlarged Mehndi Design" />
        ) : (
          <video controls autoPlay>
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  )
}

const DesignCard = ({ design, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const videoRef = useRef(null)

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (design.type === 'video' && videoRef.current) {
      // Only play if not already playing
      if (videoRef.current.paused) {
        // Use requestAnimationFrame to avoid play/pause race
        window.requestAnimationFrame(() => {
          videoRef.current.play().catch(() => {})
        })
      }
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (design.type === 'video' && videoRef.current) {
      // Only pause if not already paused
      if (!videoRef.current.paused) {
        videoRef.current.pause()
      }
      videoRef.current.currentTime = 0
    }
  }

  return (
    <div
      className={`design-card ${imageLoaded ? 'loaded' : ''} ${isHovered ? 'hovered' : ''}`}
      onClick={() => onClick(design.src, design.type)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ '--index': index }}
    >
      {design.type === 'image' ? (
        <img
          src={process.env.PUBLIC_URL + design.src}
          alt={design.alt}
          className="card-media"
          onLoad={() => setImageLoaded(true)}
        />
      ) : (
        <video
          ref={videoRef}
          className="card-media"
          loop
          muted
          playsInline
          poster={process.env.PUBLIC_URL + design.poster}
        >
          <source src={process.env.PUBLIC_URL + design.src} type="video/mp4" />
        </video>
      )}
      <div className={`card-content ${imageLoaded ? 'visible' : ''}`}>
        {design.content}
       
      </div>
    </div>
  )
}

const GallerySection = ({ section, onMediaClick }) => {
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
            onClick={onMediaClick}
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
  const [currentMedia, setCurrentMedia] = useState({ url: '', type: 'image' })

  const openModal = (mediaUrl, mediaType) => {
    setCurrentMedia({ url: mediaUrl, type: mediaType })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setCurrentMedia({ url: '', type: 'image' })
  }

  return (
    <div className="gallery-container" id="gallery">
      {galleryData.map((section) => (
        <GallerySection
          key={section.id}
          section={section}
          onMediaClick={openModal}
          isActive={section.id === activeSection}
        />
      ))}
      
      {/* Add VideoGallery component */}
      <VideoGallery  />
      
      <MediaModal
        isOpen={modalOpen}
        mediaUrl={currentMedia.url}
        mediaType={currentMedia.type}
        onClose={closeModal}
      />
    </div>
  )
}

export default Gallery