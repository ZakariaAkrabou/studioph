import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLock,
  FiUnlock,
  FiKey,
  FiEye,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiHeart,
  FiStar,
  FiCalendar,
  FiUser,
  FiImage,
} from "react-icons/fi";

const BG = "#0D0D0D";
const TEXT = "#FFFFFF";
const MUTED = "#B3B3B3";
const CARD = "#1A1A1A";
const ACCENT = "#C5A46D";
const HOVER = "#FFD369";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: "easeOut",
      staggerChildren: 0.1
    } 
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const SpaceClient = () => {
  const { key } = useParams();
  const navigate = useNavigate();
  const [accessKey, setAccessKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [clientSpace, setClientSpace] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [showKeyModal, setShowKeyModal] = useState(false);

  const mockClientGalleries = [
    {
      id: "space_001",
      title: "Sarah & Michael's Wedding",
      description: "Beautiful moments from your special day captured with love and artistry.",
      coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
      photographer: "Elena Foster",
      eventDate: "December 15, 2024",
      totalImages: 127,
      accessKey: "sarah2024",
      category: "Wedding"
    },
    {
      id: "space_002",
      title: "Emma's Portrait Session",
      description: "Professional headshots and lifestyle portraits showcasing natural beauty.",
      coverImage: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1600&auto=format&fit=crop",
      photographer: "Elena Foster",
      eventDate: "November 28, 2024",
      totalImages: 45,
      accessKey: "emma2024",
      category: "Portrait"
    },
    {
      id: "space_003",
      title: "Johnson Family Reunion",
      description: "Capturing precious family moments and connections across generations.",
      coverImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop",
      photographer: "Elena Foster",
      eventDate: "October 10, 2024",
      totalImages: 89,
      accessKey: "johnson2024",
      category: "Family"
    },
    {
      id: "space_004",
      title: "Corporate Event - Tech Summit",
      description: "Professional event photography capturing key moments and networking.",
      coverImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop",
      photographer: "Elena Foster",
      eventDate: "September 22, 2024",
      totalImages: 156,
      accessKey: "techsummit2024",
      category: "Event"
    }
  ];

  const mockGalleryImages = {
    sarah2024: {
      id: "space_001",
      title: "Sarah & Michael's Wedding",
      description: "Beautiful moments from your special day captured with love and artistry.",
      coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
      photographer: "Elena Foster",
      eventDate: "December 15, 2024",
      totalImages: 127,
      images: [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
          thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop",
          title: "First Dance",
          favorite: true
        },
        {
          id: 2,
          url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
          thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400&auto=format&fit=crop",
          title: "Ceremony Kiss",
          favorite: false
        },
        {
          id: 3,
          url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
          thumbnail: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=400&auto=format&fit=crop",
          title: "Reception Joy",
          favorite: true
        },
        {
          id: 4,
          url: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop",
          thumbnail: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=400&auto=format&fit=crop",
          title: "Portrait Session",
          favorite: false
        },
        {
          id: 5,
          url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
          thumbnail: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=400&auto=format&fit=crop",
          title: "Bridal Details",
          favorite: false
        },
        {
          id: 6,
          url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
          thumbnail: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=400&auto=format&fit=crop",
          title: "Family Moments",
          favorite: true
        }
      ]
    },
    demo123: {
      id: "space_demo",
      title: "Demo Gallery",
      description: "Sample gallery for demonstration purposes.",
      coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
      photographer: "Elena Foster",
      eventDate: "Demo Date",
      totalImages: 6,
      images: [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
          thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop",
          title: "Demo Image 1",
          favorite: true
        },
        {
          id: 2,
          url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
          thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400&auto=format&fit=crop",
          title: "Demo Image 2",
          favorite: false
        }
      ]
    }
  };

  useEffect(() => {
    if (key) {
      setAccessKey(key);
      handleAuthentication(key);
    }
  }, [key]);

  const handleAuthentication = async (keyToVerify) => {
    setIsLoading(true);
    setError("");
    
    setTimeout(() => {
      const galleryData = mockGalleryImages[keyToVerify];
      if (galleryData) {
        setIsAuthenticated(true);
        setClientSpace(galleryData);
      } else {
        setError("Invalid access key. Please check your key and try again.");
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleKeySubmit = (e) => {
    e.preventDefault();
    if (accessKey.trim()) {
      navigate(`/client/${accessKey}`);
      handleAuthentication(accessKey);
    }
  };

  const handleGalleryAccess = (gallery) => {
    setSelectedGallery(gallery);
    setShowKeyModal(true);
    setAccessKey("");
    setError("");
  };

  const handleModalKeySubmit = (e) => {
    e.preventDefault();
    if (accessKey.trim()) {
      setShowKeyModal(false);
      navigate(`/client/${accessKey}`);
      handleAuthentication(accessKey);
    }
  };

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % clientSpace.images.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(clientSpace.images[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentImageIndex - 1 + clientSpace.images.length) % clientSpace.images.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(clientSpace.images[prevIndex]);
  };

  if (!key || (!isAuthenticated && !isLoading)) {
    return (
      <motion.div 
        className="min-h-screen"
        style={{ backgroundColor: BG, color: TEXT }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero Section */}
        <motion.section 
          className="py-16 sm:py-20"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: CARD, border: "2px solid rgba(197,164,109,0.3)" }}>
                <FiGrid className="w-8 h-8" style={{ color: ACCENT }} />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Client Galleries</h1>
              <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto" style={{ color: MUTED }}>
                Browse our client galleries. Each gallery is private and requires an access key provided by your photographer.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Gallery Grid */}
        <motion.section 
          className="py-8 sm:py-12"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              variants={containerVariants}
            >
              {mockClientGalleries.map((gallery) => (
                <motion.div
                  key={gallery.id}
                  className="group cursor-pointer"
                  variants={fadeInUp}
                  whileHover={{ y: -6 }}
                  onClick={() => handleGalleryAccess(gallery)}
                >
                  <div className="relative rounded-2xl overflow-hidden" style={{ backgroundColor: CARD, border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="relative h-64 sm:h-72 overflow-hidden">
                      <img 
                        src={gallery.coverImage} 
                        alt={gallery.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Lock indicator */}
                      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <FiLock className="w-5 h-5" style={{ color: ACCENT }} />
                      </div>
                      
                      {/* Category badge */}
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm" style={{ backgroundColor: `${ACCENT}CC`, color: "#0D0D0D" }}>
                        {gallery.category}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-opacity-80 transition-colors">{gallery.title}</h3>
                      <p className="text-sm mb-4 line-clamp-2" style={{ color: MUTED }}>
                        {gallery.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm" style={{ color: MUTED }}>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <FiUser className="w-4 h-4" />
                            <span>{gallery.photographer}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiImage className="w-4 h-4" />
                            <span>{gallery.totalImages}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiCalendar className="w-4 h-4" />
                          <span>{new Date(gallery.eventDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-center gap-2 text-sm font-medium" style={{ color: ACCENT }}>
                          <FiKey className="w-4 h-4" />
                          <span>Access Key Required</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Key Modal */}
        <AnimatePresence>
          {showKeyModal && selectedGallery && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowKeyModal(false)}
            >
              <motion.div
                className="max-w-md w-full rounded-2xl p-6"
                style={{ backgroundColor: CARD, border: "1px solid rgba(255,255,255,0.1)" }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: "rgba(197,164,109,0.1)", border: "2px solid rgba(197,164,109,0.3)" }}>
                    <FiLock className="w-6 h-6" style={{ color: ACCENT }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Access Required</h3>
                  <p className="text-sm" style={{ color: MUTED }}>
                    Enter your access key to view <strong>{selectedGallery.title}</strong>
                  </p>
                </div>

                <form onSubmit={handleModalKeySubmit} className="space-y-4">
                  <div>
                    <div className="relative">
                      <FiKey className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: MUTED }} />
                      <input
                        type="text"
                        value={accessKey}
                        onChange={(e) => setAccessKey(e.target.value)}
                        placeholder="Enter access key"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:border-opacity-80"
                        style={{ 
                          backgroundColor: BG, 
                          borderColor: error ? "#ef4444" : "rgba(255,255,255,0.1)",
                          color: TEXT
                        }}
                      />
                    </div>
                    {error && (
                      <motion.p 
                        className="text-red-400 text-sm mt-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {error}
                      </motion.p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowKeyModal(false)}
                      className="flex-1 py-3 px-4 rounded-xl font-medium border-2 transition-all duration-300"
                      style={{ borderColor: "rgba(255,255,255,0.2)", color: MUTED }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!accessKey.trim()}
                      className="flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
                      style={{ backgroundColor: ACCENT, color: "#0D0D0D" }}
                    >
                      Access Gallery
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: BG, color: TEXT }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-current border-t-transparent rounded-full animate-spin mb-4 mx-auto" style={{ color: ACCENT }} />
          <p className="text-lg">Verifying access key...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen"
      style={{ backgroundColor: BG, color: TEXT }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <motion.section 
        className="relative py-16 sm:py-20 overflow-hidden"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0">
          <img 
            src={clientSpace.coverImage} 
            alt={clientSpace.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={fadeInUp}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {clientSpace.title}
            </h1>
            <p className="text-lg sm:text-xl mb-6 max-w-3xl mx-auto" style={{ color: MUTED }}>
              {clientSpace.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <FiStar className="w-4 h-4" style={{ color: ACCENT }} />
                <span>Photographer: {clientSpace.photographer}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiGrid className="w-4 h-4" style={{ color: ACCENT }} />
                <span>{clientSpace.totalImages} Photos</span>
              </div>
              <div className="flex items-center gap-2">
                <FiHeart className="w-4 h-4" style={{ color: ACCENT }} />
                <span>{clientSpace.eventDate}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Gallery Grid */}
      <motion.section 
        className="py-12 sm:py-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex items-center justify-between mb-8"
            variants={fadeInUp}
          >
            <h2 className="text-2xl sm:text-3xl font-bold">Your Photo Collection</h2>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
            variants={containerVariants}
          >
            {clientSpace.images.map((image, index) => (
              <motion.div
                key={image.id}
                className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                onClick={() => openLightbox(image, index)}
              >
                <img 
                  src={image.thumbnail} 
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                
                {/* Favorite indicator */}
                {image.favorite && (
                  <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <FiHeart className="w-4 h-4 fill-current" style={{ color: ACCENT }} />
                  </div>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <FiEye className="w-6 h-6" style={{ color: TEXT }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.95)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="relative max-w-6xl max-h-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-black/70"
              >
                <FiX className="w-6 h-6" style={{ color: TEXT }} />
              </button>
              
              {/* Navigation */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-black/70"
              >
                <FiChevronLeft className="w-6 h-6" style={{ color: TEXT }} />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-black/70"
              >
                <FiChevronRight className="w-6 h-6" style={{ color: TEXT }} />
              </button>
              
              {/* Image info */}
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <h3 className="text-lg font-semibold mb-1">{selectedImage.title}</h3>
                <p className="text-sm" style={{ color: MUTED }}>
                  {currentImageIndex + 1} of {clientSpace.images.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SpaceClient;
