import { useState, useEffect, useMemo } from "react";
import { useTranslation } from 'react-i18next';
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
import { useGetPublicSpacesQuery, useAccessSpaceMutation } from "../../store/services/clientSpaceApi";

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
  const { t } = useTranslation();
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
  const [initialLoad, setInitialLoad] = useState(true);

  const { data: spaces = [], isLoading: spacesLoading } = useGetPublicSpacesQuery();
  const [accessSpace, { isLoading: accessLoading }] = useAccessSpaceMutation();
  const publicGalleries = useMemo(() => {
    return (spaces || []).map((s) => ({
      id: s._id,
      title: s.name,
      description: "Private gallery. Enter your access key to view.",
      coverImage: s.cover || s.images?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
      photographer: s.admin?.email || "StudioPH",
      eventDate: new Date(s.createdAt || Date.now()).toLocaleDateString(),
      totalImages: s.images?.length || 0,
      category: "Gallery"
    }));
  }, [spaces]);

  useEffect(() => {
    if (key && spaces.length > 0) {
      setAccessKey(key);
      const matchingSpace = spaces.find(space => space.accessKey === key);
      if (matchingSpace) {
        setSelectedGallery({
          id: matchingSpace._id,
          title: matchingSpace.name,
          description: "Private gallery. Enter your access key to view.",
          coverImage: matchingSpace.cover || matchingSpace.images?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
          photographer: matchingSpace.admin?.email || "StudioPH",
          eventDate: new Date(matchingSpace.createdAt || Date.now()).toLocaleDateString(),
          totalImages: matchingSpace.images?.length || 0,
          category: "Gallery"
        });
      }
      handleAuthentication(key);
    } else {
      setInitialLoad(false);
    }
  }, [key, spaces]);

  const handleAuthentication = async (keyToVerify) => {
    setIsLoading(true);
    setError("");
    try {
      let matchingSpace = selectedGallery;
      if (!matchingSpace && spaces.length > 0) {
        const space = spaces.find(s => s.accessKey === keyToVerify);
        if (space) {
          matchingSpace = {
            id: space._id,
            title: space.name,
            description: "Private gallery. Enter your access key to view.",
            coverImage: space.cover || space.images?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
            photographer: space.admin?.email || "StudioPH",
            eventDate: new Date(space.createdAt || Date.now()).toLocaleDateString(),
            totalImages: space.images?.length || 0,
            category: "Gallery"
          };
          setSelectedGallery(matchingSpace);
        }
      }

      if (matchingSpace?.id) {
        const res = await accessSpace({ id: matchingSpace.id, key: keyToVerify }).unwrap();
        const normalized = {
          id: matchingSpace.id,
          title: res.name || matchingSpace.title,
          description: matchingSpace.description,
          coverImage: matchingSpace.coverImage,
          photographer: matchingSpace.photographer,
          eventDate: matchingSpace.eventDate,
          totalImages: res.images?.length || 0,
          images: (res.images || []).map((url, idx) => ({
            id: idx + 1,
            url,
            thumbnail: url,
            title: `Image ${idx + 1}`,
            favorite: false,
          }))
        };
        setIsAuthenticated(true);
        setClientSpace(normalized);
      } else {
        setError("Please select a gallery first.");
      }
    } catch (err) {
      setError(err?.data?.message || "Invalid access key. Please try again.");
    } finally {
      setIsLoading(false);
      setInitialLoad(false);
    }
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

  if (initialLoad || spacesLoading || (key && isLoading)) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center relative z-10"
        style={{ backgroundColor: BG, color: TEXT }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-current border-t-transparent rounded-full animate-spin mb-4 mx-auto" style={{ color: ACCENT }} />
          <p className="text-lg">
            {key ? t('client.verifying') : t('client.loading')}
          </p>
        </div>
      </motion.div>
    );
  }

  // Show authenticated content if user has valid access
  if (isAuthenticated && clientSpace) {
    return (
      <motion.div 
        className="min-h-screen relative z-10"
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
          
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
          className="py-12 sm:py-16 relative z-10"
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
              <h2 className="text-2xl sm:text-3xl font-bold">{t('client.yourCollection')}</h2>
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
  }

  // Show gallery selection page
    return (
      <motion.div 
      className="min-h-screen relative z-10"
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
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                {t('client.title', { highlight: t('client.highlight') })}
              </h1>
              <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto" style={{ color: MUTED }}>
                {t('client.description')}
              </p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section 
        className="py-8 sm:py-12 relative z-10"
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
            {publicGalleries.map((gallery) => (
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
                          <span>{t('client.accessKeyRequired')}</span>
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
                  <h3 className="text-xl font-bold mb-2">{t('client.accessRequired')}</h3>
                  <p className="text-sm" style={{ color: MUTED }}>
                    {t('client.enterKey')} <strong>{selectedGallery.title}</strong>
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
                        placeholder={t('client.enterKey')}
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
                      {t('client.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={!accessKey.trim()}
                      className="flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
                      style={{ backgroundColor: ACCENT, color: "#0D0D0D" }}
                    >
                      {t('client.accessGallery')}
                    </button>
                  </div>
                </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SpaceClient;
