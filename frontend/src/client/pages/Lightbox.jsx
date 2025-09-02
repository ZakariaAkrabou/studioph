import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiPlay, FiPause } from 'react-icons/fi';

const Lightbox = ({
  photos,
  currentIndex,
  onClose,
  onNext,
  onPrev,
  isSlideshow,
  onToggleSlideshow,
  zoom,
  onZoom
}) => {
  const currentPhoto = photos[currentIndex];
  
  if (!currentPhoto) return null;

  const getOptimizedUrl = (url, size = 'medium') => {
    if (!url || !url.includes('cloudinary')) return url;
    
    const transformations = {
      thumbnail: 'w_80,h_80,c_fill,f_auto,q_auto:eco',
      medium: 'w_800,h_600,c_fill,f_auto,q_auto:good',
      large: 'w_1200,h_900,c_fill,f_auto,q_auto:good',
      fullscreen: 'w_1920,h_1080,c_limit,f_auto,q_auto:good'
    };

    const transformation = transformations[size] || transformations.medium;
    
    if (url.includes('/upload/')) {
      return url.replace('/upload/', `/upload/${transformation}/`);
    }
    return url;
  };

  const getVisibleThumbnails = () => {
    const totalVisible = 5;
    const halfVisible = Math.floor(totalVisible / 2);
    
    let start = Math.max(0, currentIndex - halfVisible);
    let end = Math.min(photos.length, start + totalVisible);
    
    if (end - start < totalVisible) {
      start = Math.max(0, end - totalVisible);
    }
    
    return photos.slice(start, end).map((photo, index) => ({
      ...photo,
      actualIndex: start + index
    }));
  };

  const visibleThumbnails = getVisibleThumbnails();

  const handleThumbnailClick = (targetIndex) => {
    const diff = targetIndex - currentIndex;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        onNext();
      }
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) {
        onPrev();
      }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Header */}
      <motion.div 
        className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-4">
          <h3 className="text-white font-semibold text-lg">{currentPhoto.title}</h3>
          <span className="text-sm text-gray-300">by {currentPhoto.photographer}</span>
          <span className="text-sm text-gray-400">
            {currentIndex + 1} of {photos.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close lightbox"
        >
          <FiX className="w-6 h-6 text-white" />
        </button>
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center p-4 pt-20 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhoto.id}
            className="relative max-w-full max-h-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative overflow-hidden rounded-lg" style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center',
              maxWidth: '90vw',
              maxHeight: '70vh'
            }}>
              <img
                src={getOptimizedUrl(currentPhoto.url, 'fullscreen')}
                alt={currentPhoto.title}
                className="w-full h-full object-contain"
                draggable={false}
                onDoubleClick={() => onZoom(zoom > 1 ? 1 : 1.8)}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        aria-label="Previous image"
      >
        <FiChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        aria-label="Next image"
      >
        <FiChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Footer Controls */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/80 to-transparent"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleSlideshow}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                isSlideshow ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              } text-white transition-colors`}
            >
              {isSlideshow ? (
                <>
                  <FiPause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <FiPlay className="w-4 h-4" />
                  <span>Play Slideshow</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 bg-black/50 rounded-lg p-1">
              <button
                onClick={() => onZoom(Math.max(1, +(zoom - 0.2).toFixed(2)))}
                className="px-3 py-1 text-white hover:bg-white/10 rounded transition-colors"
                disabled={zoom <= 1}
              >
                -
              </button>
              <span className="px-2 text-sm text-white">{zoom.toFixed(1)}x</span>
              <button
                onClick={() => onZoom(Math.min(3, +(zoom + 0.2).toFixed(2)))}
                className="px-3 py-1 text-white hover:bg-white/10 rounded transition-colors"
                disabled={zoom >= 3}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 max-w-full">
            {currentIndex > 2 && (
              <button
                onClick={() => handleThumbnailClick(Math.max(0, currentIndex - 5))}
                className="p-1 text-white/60 hover:text-white transition-colors"
                aria-label="Previous thumbnails"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
            )}
            
            <div className="flex gap-2">
              {visibleThumbnails.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => handleThumbnailClick(photo.actualIndex)}
                  className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded overflow-hidden border-2 transition-all ${
                    photo.actualIndex === currentIndex
                      ? 'border-white scale-110 shadow-lg'
                      : 'border-transparent hover:border-white/50 hover:scale-105'
                  }`}
                >
                  <img
                    src={getOptimizedUrl(photo.url, 'thumbnail')}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>

            {currentIndex < photos.length - 3 && (
              <button
                onClick={() => handleThumbnailClick(Math.min(photos.length - 1, currentIndex + 5))}
                className="p-1 text-white/60 hover:text-white transition-colors"
                aria-label="Next thumbnails"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Lightbox;