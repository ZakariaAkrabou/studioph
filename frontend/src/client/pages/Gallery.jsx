import { useMemo, useState, useEffect, Suspense, lazy, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight, FiSearch, FiLoader } from "react-icons/fi";
import { useGetPortfoliosQuery } from "../../store/services/portfolioApi";
import { useGetCategoriesQuery } from "../../store/services/categoryApi";

// Lazy load heavy components
const Lightbox = lazy(() => import('./Lightbox'));

// Constants
const BG = "#0D0D0D";
const TEXT = "#FFFFFF";
const MUTED = "#B3B3B3";
const ACCENT = "#C5A46D";
const ITEMS_PER_PAGE = 12;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Skeleton loader component
const SkeletonLoader = () => (
  <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
      {[...Array(12)].map((_, i) => (
        <div key={i} className={`bg-gray-800 rounded-2xl animate-pulse break-inside-avoid ${
          i % 3 === 0 ? 'h-80' : i % 3 === 1 ? 'h-96' : 'h-72'
        }`} />
      ))}
    </div>
  </div>
);

// Optimized image component with Cloudinary transformations
const OptimizedImage = ({ src, alt, className = "", size = "medium" }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback(() => setError(true), []);

  // Optimize Cloudinary URLs with proper transformations
  const getOptimizedUrl = useCallback((url, targetSize) => {
    if (!url || !url.includes('cloudinary')) return url;
    
    const transformations = {
      thumbnail: 'w_400,h_500,c_fill,f_auto,q_auto:eco',
      medium: 'w_600,h_750,c_fill,f_auto,q_auto:good',
      large: 'w_800,h_1000,c_fill,f_auto,q_auto:good',
      preview: 'w_80,h_80,c_fill,f_auto,q_auto:eco'
    };

    const transformation = transformations[targetSize] || transformations.medium;
    
    // Insert transformation into Cloudinary URL
    if (url.includes('/upload/')) {
      return url.replace('/upload/', `/upload/${transformation}/`);
    }
    return url;
  }, []);

  const optimizedSrc = getOptimizedUrl(src, size);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-700 animate-pulse rounded-2xl flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin"></div>
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 bg-gray-800 rounded-2xl flex items-center justify-center">
          <span className="text-gray-400 text-sm">Failed to load</span>
        </div>
      ) : (
        <img
          src={optimizedSrc}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover rounded-2xl transition-all duration-500 ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />
      )}
    </div>
  );
};

// Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-16">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === 1 
            ? 'text-gray-600 cursor-not-allowed' 
            : 'text-white hover:bg-white/10'
        }`}
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>

      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            page === currentPage
              ? 'text-black font-semibold shadow-lg scale-105'
              : page === '...'
              ? 'text-gray-500 cursor-default'
              : 'text-white hover:bg-white/10 hover:scale-105'
          }`}
          style={{
            background: page === currentPage 
              ? `linear-gradient(135deg, ${ACCENT} 0%, #FFD369 100%)` 
              : 'transparent'
          }}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === totalPages 
            ? 'text-gray-600 cursor-not-allowed' 
            : 'text-white hover:bg-white/10'
        }`}
      >
        <FiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

const Gallery = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState("all");
  const location = useLocation();
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // API queries
  const { data: portfolios = [], isLoading: portfoliosLoading, error: portfoliosError } = useGetPortfoliosQuery();
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery();

  // Transform portfolio data for display
  const transformedPortfolios = useMemo(() => {
    return portfolios.map(portfolio => ({
      id: portfolio._id,
      url: portfolio.imageUrl,
      title: portfolio.title,
      description: portfolio.description,
      category: portfolio.category?.name?.toLowerCase() || 'uncategorized',
      photographer: 'StudioPH'
    }));
  }, [portfolios]);

  // Transform categories for filter
  const slugify = useCallback((name) =>
    (name || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-"), []);

  const categoriesList = useMemo(() => {
    const allCategories = [{ key: "all", label: t('gallery.all') }];
    
    categories.forEach(cat => {
      allCategories.push({
        key: slugify(cat.name),
        label: cat.name
      });
    });
    
    return allCategories;
  }, [categories, slugify]);

  // Filter photos based on active category
  const filtered = useMemo(() => {
    if (active === "all") {
      return transformedPortfolios;
    }
    return transformedPortfolios.filter((p) => slugify(p.category) === active);
  }, [active, transformedPortfolios, slugify]);

  // Read category from query string and set active on mount/change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    if (cat) setActive(cat);
  }, [location.search]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedPhotos = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  // Reset pagination when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [active]);

  // Handle slideshow
  useEffect(() => {
    if (!isSlideshow || lightboxIndex < 0) return;
    
    const timer = setTimeout(() => {
      setLightboxIndex((prev) => (prev + 1) % paginatedPhotos.length);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isSlideshow, lightboxIndex, paginatedPhotos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex < 0) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          setLightboxIndex(-1);
          break;
        case 'ArrowRight':
          setLightboxIndex((i) => (i + 1) % paginatedPhotos.length);
          break;
        case 'ArrowLeft':
          setLightboxIndex((i) => (i - 1 + paginatedPhotos.length) % paginatedPhotos.length);
          break;
        case ' ':
          e.preventDefault();
          setIsSlideshow(!isSlideshow);
          break;
        case '+':
        case '=':
          setZoom((z) => Math.min(3, +(z + 0.2).toFixed(2)));
          break;
        case '-':
        case '_':
          setZoom((z) => Math.max(1, +(z - 0.2).toFixed(2)));
          break;
        case '0':
          setZoom(1);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, paginatedPhotos.length, isSlideshow]);

  // Loading state
  if (portfoliosLoading || categoriesLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: BG, color: TEXT }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FiLoader className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: ACCENT }} />
            <p className="text-lg" style={{ color: MUTED }}>{t('gallery.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (portfoliosError || categoriesError) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: BG, color: TEXT }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-xl mb-4">{t('gallery.failedTitle')}</p>
            <p className="text-sm" style={{ color: MUTED }}>{t('gallery.failedHint')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG, color: TEXT }}>
      {/* Header Section */}
      <motion.header 
        className="relative py-16 md:py-24 overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {t('gallery.title')}
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: MUTED }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {t('gallery.subtitle')}
          </motion.p>
        </div>
      </motion.header>

      {/* Category Filter */}
      <motion.section 
        className="py-12 md:py-16 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categoriesList.map((category) => (
              <motion.button
                key={category.key}
                onClick={() => setActive(category.key)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  active === category.key 
                    ? 'text-black shadow-lg scale-105' 
                    : 'text-white hover:scale-105 hover:shadow-md'
                }`}
                style={{
                  background: active === category.key 
                    ? `linear-gradient(135deg, ${ACCENT} 0%, #FFD369 100%)` 
                    : 'rgba(26,26,26,0.8)',
                  border: active === category.key 
                    ? `2px solid ${ACCENT}` 
                    : '2px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.label}
              </motion.button>
            ))}
          </div>
          
          <motion.div 
            className="mt-8 text-center text-sm"
            style={{ color: MUTED }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {t('gallery.showing')} <span className="font-semibold" style={{ color: ACCENT }}>{paginatedPhotos.length}</span> {t('gallery.of')} <span className="font-semibold" style={{ color: ACCENT }}>{filtered.length}</span> {filtered.length === 1 ? t('gallery.photo') : t('gallery.photos')}
          </motion.div>
        </div>
      </motion.section>

      {/* Photo Grid */}
      <section className="pb-24">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-32">
              <FiSearch className="w-20 h-20 mx-auto mb-8" style={{ color: MUTED }} />
              <h3 className="text-3xl font-semibold mb-4">{t('gallery.noPhotos')}</h3>
              <p className="text-xl" style={{ color: MUTED }}>{t('gallery.tryDifferent')}</p>
            </div>
          ) : (
            <Suspense fallback={<SkeletonLoader />}>
              <motion.div 
                className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={currentPage} // Re-animate on page change
              >
                {paginatedPhotos.map((photo, index) => {
                  // Vary heights for masonry effect
                  const heights = ['h-64', 'h-80', 'h-96', 'h-72', 'h-88'];
                  const randomHeight = heights[index % heights.length];
                  
                  return (
                    <motion.div
                      key={photo.id}
                      className={`group relative cursor-pointer break-inside-avoid ${randomHeight}`}
                      variants={itemVariants}
                      onClick={() => setLightboxIndex(index)}
                      whileHover={{ scale: 1.02, y: -4 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <div className="relative w-full h-full overflow-hidden rounded-2xl bg-gray-900 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                        <OptimizedImage 
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-full"
                          size="medium"
                        />
                        
                        {/* Elegant Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl">
                          <div className="absolute bottom-0 left-0 right-0 p-5">
                            <motion.h3 
                              className="text-white font-semibold text-lg mb-1 truncate"
                              initial={{ y: 20, opacity: 0 }}
                              whileInView={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.1 }}
                            >
                              {photo.title}
                            </motion.h3>
                            <motion.p 
                              className="text-gray-300 text-sm truncate"
                              initial={{ y: 20, opacity: 0 }}
                              whileInView={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              {photo.photographer}
                            </motion.p>
                          </div>
                        </div>

                        {/* Subtle border glow */}
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-white/30 transition-all duration-500" />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Pagination */}
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </Suspense>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex >= 0 && (
          <Suspense fallback={null}>
            <Lightbox
              photos={paginatedPhotos}
              currentIndex={lightboxIndex}
              onClose={() => setLightboxIndex(-1)}
              onNext={() => setLightboxIndex((i) => (i + 1) % paginatedPhotos.length)}
              onPrev={() => setLightboxIndex((i) => (i - 1 + paginatedPhotos.length) % paginatedPhotos.length)}
              isSlideshow={isSlideshow}
              onToggleSlideshow={() => setIsSlideshow(!isSlideshow)}
              zoom={zoom}
              onZoom={setZoom}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
