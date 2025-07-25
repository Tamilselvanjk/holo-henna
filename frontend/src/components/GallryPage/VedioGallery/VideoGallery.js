import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ReactComponent as PlayIcon } from './play-icon.svg';
import { ReactComponent as PauseIcon } from './pause-icon.svg';
import './VideoGallery.css';

const VideoGallery = () => {
  const galleryRef = useRef(null);
  const videoRefs = useRef([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const scrollRequestRef = useRef();

  // Video data
  const videos = [
    { id: 1, src: './mehandiIMG/C1926.MP4' },
    { id: 2, src: './mehandiIMG/C1927.MP4' },
    { id: 3, src: './mehandiIMG/C1930.MP4' },
    { id: 4, src: './mehandiIMG/C1933.MP4' },
    { id: 5, src: './mehandiIMG/Div.mp4' },
    { id: 6, src: './mehandiIMG/20250527_202154.mp4' },
    
  ];

  // Auto-scroll effect
  const autoScroll = () => {
    if (!galleryRef.current || isPlaying) return;

    const { scrollLeft, scrollWidth, clientWidth } = galleryRef.current;
    const scrollThreshold = scrollWidth / 2;

    if (scrollLeft >= scrollThreshold) {
      galleryRef.current.scrollTo({ left: scrollLeft - scrollThreshold, behavior: 'instant' });
    } else {
      galleryRef.current.scrollBy({ left: 0.5, behavior: 'smooth' });
    }

    scrollRequestRef.current = requestAnimationFrame(autoScroll);
  };

  useEffect(() => {
    scrollRequestRef.current = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(scrollRequestRef.current);
  }, [isPlaying]);

  const handlePlay = async (index) => {
    try {
      // Pause any currently playing video
      if (activeVideo !== null) {
        videoRefs.current[activeVideo].pause();
      }

      await videoRefs.current[index].play();
      setActiveVideo(index);
      setIsPlaying(true);
    } catch (err) {
      console.error("Error playing video:", err);
    }
  };

  const handlePause = (index) => {
    if (activeVideo === index) {
      setIsPlaying(false);
      videoRefs.current[index].pause();
    }
  };

  const handleEnded = (index) => {
    if (activeVideo === index) {
      setIsPlaying(false);
      setActiveVideo(null);
    }
  };

  const togglePlayPause = (index) => {
    if (activeVideo === index && isPlaying) {
      handlePause(index);
    } else {
      handlePlay(index);
    }
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.03,
      boxShadow: '0 10px 25px rgba(139, 90, 43, 0.2)'
    }
  };

  return (
    <div className="video-gallery-container">
      <div className="gallery-header">
        <motion.div 
          className="gallery-title-container"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          <h2 className="gallery-title">Henna Art <span className="title-accent">Gallery</span></h2>
          <div className="title-decoration"></div>
        </motion.div>
         <motion.p
          className="gallery-intro-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.3,
            duration: 0.8,
            ease: "easeOut"
          }}
        >
         Discover stunning henna designs, each with its own story in every elegant, intricate stroke.
        </motion.p>
        
      </div>

      <div 
        className="gallery-scroll-container"
        ref={galleryRef}
        onMouseEnter={() => cancelAnimationFrame(scrollRequestRef.current)}
        onMouseLeave={() => !isPlaying && autoScroll()}
      >
        <div className="gallery-scroll-track">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              className={`video-card ${activeVideo === index ? 'active' : ''}`}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              onClick={() => togglePlayPause(index)}
            >
              <div className="video-wrapper">
                <video
                  ref={el => videoRefs.current[index] = el}
                  playsInline
                  loop={false}
                  onEnded={() => handleEnded(index)}
                >
                  <source src={video.src} type="video/mp4" />
                </video>

                <motion.div
                  className="video-overlay"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: activeVideo === index && isPlaying ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="play-button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {activeVideo === index && isPlaying ? (
                      <PauseIcon className="control-icon" />
                    ) : (
                      <PlayIcon className="control-icon" />
                    )}
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoGallery;