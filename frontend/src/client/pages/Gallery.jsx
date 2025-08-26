import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiX, FiChevronLeft, FiChevronRight, FiHeart, FiMapPin, FiSearch,
  FiPlay, FiPause
} from "react-icons/fi";

const BG = "#0D0D0D"; 
const TEXT = "#FFFFFF"; 
const MUTED = "#B3B3B3"; 
const CARD = "#1A1A1A"; 
const ACCENT = "#C5A46D"; 
const HOVER = "#FFD369";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
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

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: "easeOut",
      type: "spring",
      stiffness: 100
    } 
  },
  hover: { 
    scale: 1.03, 
    y: -5,
    transition: { duration: 0.3, ease: "easeOut" } 
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.05,
      delayChildren: 0.2
    }
  }
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

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

const mockPhotos = [
  { id: "p1", url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop", w: 1600, h: 1066, title: "Wedding Vows", location: "NYC", category: "wedding", likes: 234, photographer: "Elena Foster" },
  { id: "p2", url: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop", w: 1200, h: 800, title: "Studio Portrait", location: "LA", category: "portraits", likes: 189, photographer: "David Chen" },
  { id: "p3", url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop", w: 1200, h: 800, title: "Concert Lights", location: "Berlin", category: "events", likes: 156, photographer: "Maya Singh" },
  { id: "p4", url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1400&auto=format&fit=crop", w: 1400, h: 933, title: "Fashion Street", location: "Paris", category: "fashion", likes: 298, photographer: "Omar Riad" },
  { id: "p5", url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop", w: 1400, h: 934, title: "Misty Peaks", location: "Alps", category: "nature", likes: 412, photographer: "Sara Müller" },
  { id: "p6", url: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=1400&auto=format&fit=crop", w: 1400, h: 939, title: "Alley Shadows", location: "Tokyo", category: "street", likes: 221, photographer: "Leo Martin" },
  { id: "p7", url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1400&auto=format&fit=crop", w: 1400, h: 933, title: "Product Set", location: "Studio", category: "commercial", likes: 143, photographer: "Ava Thompson" },
  { id: "p8", url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop", w: 1400, h: 934, title: "Lifestyle Laugh", location: "Lisbon", category: "portraits", likes: 205, photographer: "Noah Carter" },
  { id: "p9", url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1400&auto=format&fit=crop", w: 1400, h: 933, title: "First Dance", location: "Rome", category: "wedding", likes: 352, photographer: "Isabella Rossi" },
  { id: "p10", url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1400&auto=format&fit=crop", w: 1400, h: 933, title: "Conference", location: "Dubai", category: "events", likes: 97, photographer: "Elena Foster" },
  { id: "p11", url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1400&auto=format&fit=crop", w: 1400, h: 934, title: "Golden Dunes", location: "Sahara", category: "nature", likes: 267, photographer: "David Chen" },
  { id: "p12", url: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1400&auto=format&fit=crop", w: 1400, h: 933, title: "Runway Pose", location: "Milan", category: "fashion", likes: 176, photographer: "Maya Singh" },
];

const categories = [
  { key: "all", label: "All" },
  { key: "wedding", label: "Wedding" },
  { key: "portraits", label: "Portraits" },
  { key: "events", label: "Events" },
  { key: "fashion", label: "Fashion" },
  { key: "nature", label: "Nature" },
  { key: "street", label: "Street" },
  { key: "commercial", label: "Commercial" },
];

const Gallery = () => {
  const [active, setActive] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [zoom, setZoom] = useState(1);

  const filtered = useMemo(() => {
    let result = active === "all" ? mockPhotos : mockPhotos.filter((p) => p.category === active);
    
    return result;
  }, [active]);

  useEffect(() => {
    if (isSlideshow && lightboxIndex >= 0) {
      const timer = setInterval(() => {
        setLightboxIndex((i) => (i + 1) % filtered.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [isSlideshow, lightboxIndex, filtered.length]);

  useEffect(() => {
    setZoom(1);
  }, [lightboxIndex]);

  useEffect(() => {
    const onKey = (e) => {
      if (lightboxIndex < 0) return;
      if (e.key === "Escape") setLightboxIndex(-1);
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i + 1) % filtered.length);
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i - 1 + filtered.length) % filtered.length);
      if (e.key === " ") {
        e.preventDefault();
        setIsSlideshow(!isSlideshow);
      }
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(2, +(z + 0.2).toFixed(2)));
      if (e.key === "-" || e.key === "_") setZoom((z) => Math.max(1, +(z - 0.2).toFixed(2)));
      if (e.key === "0") setZoom(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, filtered.length, isSlideshow]);

  return (
    <motion.div 
      className="min-h-screen" 
      style={{ backgroundColor: BG, color: TEXT }} 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.header 
        className="relative py-8 sm:py-12 md:py-16 overflow-hidden" 
        variants={sectionVariants} 
        initial="hidden" 
        animate="visible"
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60" 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <motion.div 
          className="absolute inset-0" 
          style={{ background: "radial-gradient(60% 50% at 50% 60%, rgba(197,164,109,0.08) 0%, rgba(0,0,0,0) 100%)" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-3 sm:mb-4"
            variants={slideInLeft}
            initial="hidden"
            animate="visible"
          >
            Gallery
          </motion.h1>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4"
            style={{ color: MUTED }}
            variants={slideInRight}
            initial="hidden"
            animate="visible"
          >
            Discover stunning moments captured through our lens
          </motion.p>
        </div>
      </motion.header>

      <motion.section className="py-6 sm:py-8 md:py-12 relative" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h3 
              className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8" 
              style={{ color: TEXT }}
              variants={slideInLeft}
            >
              Explore by <span style={{ color: ACCENT }}>Category</span>
            </motion.h3>
            
            <motion.div 
              className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center max-w-5xl mx-auto px-2"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {categories.map((c, index) => (
                <motion.button
                  key={c.key}
                  onClick={() => setActive(c.key)}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative px-3 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base rounded-xl sm:rounded-2xl font-medium transition-all duration-300 ${
                    active === c.key 
                      ? "text-black shadow-lg transform scale-105" 
                      : "hover:shadow-md"
                  }`}
                  style={{ 
                    background: active === c.key 
                      ? `linear-gradient(135deg, ${ACCENT} 0%, ${HOVER} 100%)` 
                      : "rgba(26,26,26,0.6)",
                    border: active === c.key 
                      ? `2px solid ${ACCENT}` 
                      : "2px solid rgba(255,255,255,0.1)",
                    color: active === c.key ? "#000" : TEXT,
                    backdropFilter: "blur(10px)"
                  }}
                >
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity ${active === c.key ? 'hidden' : ''}`}
                       style={{ background: `linear-gradient(135deg, rgba(197,164,109,0.2) 0%, rgba(255,211,105,0.2) 100%)` }} />
                  
                  <span className="relative z-10">{c.label}</span>
                  
                  {active === c.key && (
                    <motion.div 
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                      style={{ backgroundColor: "#000" }}
                      layoutId="activeCategory"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
            
            <motion.div 
              className="mt-6 sm:mt-8 text-xs sm:text-sm"
              style={{ color: MUTED }}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.8 }}
            >
              Showing <span className="font-semibold" style={{ color: ACCENT }}>{filtered.length}</span> {filtered.length === 1 ? 'photo' : 'photos'}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section className="py-6 sm:py-8 md:py-12" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <FiSearch className="w-16 h-16 mx-auto mb-6" style={{ color: MUTED }} />
              <h3 className="text-2xl font-semibold mb-3">No photos found</h3>
              <p className="text-lg" style={{ color: MUTED }}>Try a different search term or category</p>
            </div>
          ) : (
            <motion.div 
              className="columns-1 sm:columns-2 lg:columns-3 [column-fill:_balance]
                              gap-3 sm:gap-4 md:gap-6 lg:gap-7 xl:gap-8
                              [--g:12px] sm:[--g:16px] md:[--g:20px] lg:[--g:24px] xl:[--g:32px]
                              [&>*:not(:first-child)]:mt-[var(--g)]"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {filtered.map((p, idx) => (
                <motion.figure
                  key={p.id}
                  variants={imageVariants}
                  whileHover="hover"
                  className="break-inside-avoid group relative cursor-pointer overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl transform-gpu will-change-transform transition-all duration-300 ease-out hover:ring-1 sm:hover:ring-2 hover:ring-[rgba(197,164,109,0.8)] hover:shadow-[0_10px_30px_rgba(197,164,109,0.3)] sm:hover:shadow-[0_20px_60px_rgba(197,164,109,0.4),0_0_40px_rgba(197,164,109,0.3)] hover:backdrop-blur-sm"
                  style={{ backgroundColor: CARD, border: "1px solid rgba(255,255,255,0.08)" }}
                  onClick={() => setLightboxIndex(idx)}
                  layout
                >
                  <motion.div 
                    className="relative overflow-hidden"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: idx * 0.05,
                      ease: "easeOut",
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-[rgba(197,164,109,0.2)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
                    <motion.img
                      src={p.url}
                      alt={p.title}
                      className="w-full h-auto object-cover transform-gpu will-change-transform transition-all duration-300 ease-out group-hover:scale-[1.03] group-hover:brightness-110 group-hover:contrast-105"
                      initial={{ scale: 1.1, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </motion.div>
                </motion.figure>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      <AnimatePresence>
        {lightboxIndex >= 0 && (
          <motion.div
            className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-black to-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onClick={(e) => e.target === e.currentTarget && setLightboxIndex(-1)}
          >
            <motion.div 
              className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-6"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between">
                <motion.div 
                  className="flex items-center space-x-6"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <h3 className="text-xl font-semibold text-white">{filtered[lightboxIndex]?.title}</h3>
                  <span className="text-sm text-gray-300">by {filtered[lightboxIndex]?.photographer}</span>
                  <span className="text-sm text-gray-400">
                    {lightboxIndex + 1} of {filtered.length}
                  </span>
                </motion.div>
                <motion.button
                  onClick={() => setLightboxIndex(-1)}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX className="w-6 h-6 text-white" />
                </motion.button>
              </div>
            </motion.div>

            <div className="absolute inset-0 pt-16 sm:pt-20 pb-20 sm:pb-24 px-3 sm:px-6">
              <div className="h-full flex items-center justify-center">
                <motion.div
                  key={lightboxIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative max-w-xs sm:max-w-2xl md:max-w-4xl max-h-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div 
                    className="relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
                    style={{ boxShadow: `0 25px 50px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)` }}
                    onDoubleClick={() => setZoom((z) => (z > 1 ? 1 : 1.8))}
                  >
                    <img
                      src={filtered[lightboxIndex]?.url}
                      alt={filtered[lightboxIndex]?.title}
                      className="w-full h-auto object-cover select-none transition-transform duration-300"
                      style={{ transform: `scale(${zoom})`, maxHeight: '60vh', maxWidth: '90vw' }}
                      draggable={false}
                    />
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <FiMapPin className="w-4 h-4" style={{ color: ACCENT }} />
                            <span>{filtered[lightboxIndex]?.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiHeart className="w-4 h-4" style={{ color: HOVER }} />
                            <span>{filtered[lightboxIndex]?.likes}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(1, +(z - 0.2).toFixed(2))); }}
                            className="px-2 sm:px-3 py-1 rounded-md bg-black/50 hover:bg-black/70 text-xs sm:text-sm transition-colors"
                          >
                            -
                          </button>
                          <span className="px-2 sm:px-3 py-1 bg-black/30 rounded-md text-xs min-w-[35px] sm:min-w-[45px] text-center">
                            {zoom.toFixed(1)}x
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(2.5, +(z + 0.2).toFixed(2))); }}
                            className="px-2 sm:px-3 py-1 rounded-md bg-black/50 hover:bg-black/70 text-xs sm:text-sm transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.button
              onClick={() => setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length)}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-4 rounded-full bg-black/50 hover:bg-black/70 transition-all"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </motion.button>
            <motion.button
              onClick={() => setLightboxIndex((lightboxIndex + 1) % filtered.length)}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-4 rounded-full bg-black/50 hover:bg-black/70 transition-all"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </motion.button>

            <motion.div 
              className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <motion.button
                  onClick={(e) => { e.stopPropagation(); setIsSlideshow((s) => !s); }}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all text-sm ${isSlideshow ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSlideshow ? (
                    <><FiPause className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />Stop</>
                  ) : (
                    <><FiPlay className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />Play</>
                  )}
                </motion.button>
                
                <motion.div 
                  className="flex items-center gap-2 sm:gap-3 overflow-x-auto max-w-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  {filtered.slice(Math.max(0, lightboxIndex - 2), lightboxIndex + 3).map((p, idx) => {
                    const actualIdx = Math.max(0, lightboxIndex - 2) + idx;
                    return (
                      <motion.button
                        key={p.id}
                        onClick={(e) => { e.stopPropagation(); setLightboxIndex(actualIdx); }}
                        className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden border-2 transition-all ${
                          actualIdx === lightboxIndex 
                            ? 'border-white scale-125' 
                            : 'border-white/40 hover:border-white/70 hover:scale-110'
                        }`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 * idx, duration: 0.3 }}
                        whileHover={{ scale: actualIdx === lightboxIndex ? 1.25 : 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>
            </motion.div>

            <div 
              className="absolute inset-0 z-10"
              onClick={() => setLightboxIndex(-1)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Gallery;
