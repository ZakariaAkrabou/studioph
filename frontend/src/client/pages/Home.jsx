import { useState, useMemo, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiInstagram,
  FiTwitter,
  FiFacebook,
  FiCamera,
  FiEye,
} from "react-icons/fi";
import { useGetCategoriesQuery } from "../../store/services/categoryApi";
import { useGetPortfoliosQuery } from "../../store/services/portfolioApi";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export default function HomePage() {
  const slugify = (name) =>
    (name || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const { t, i18n } = useTranslation();
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesQuery();
  const { data: portfolios = [], isLoading: portfoliosLoading, error: portfoliosError } = useGetPortfoliosQuery();

  const heroSlides = useMemo(
    () => [
      {
        id: 1,
        image:
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop",
        alt: "Wedding Embrace",
      },
      {
        id: 2,
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
        alt: "Lifestyle Portrait",
      },
      {
        id: 3,
        image:
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop",
        alt: "Event Lights",
      },
    ],
    []
  );

  const featuredGalleries = useMemo(() => {
    if (!portfolios || portfolios.length === 0) return [];
    
    return portfolios
      .slice(0, 6)
      .map((portfolio, index) => ({
        id: portfolio._id,
        title: portfolio.title,
        description: portfolio.description || "Beautiful photography capturing special moments.",
        image: portfolio.imageUrl,
        category: portfolio.categoryLabel || "Photography",
        date: new Date(portfolio.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        photographer: "Studio Photographer",
        photos: Math.floor(Math.random() * 30) + 10, 
      }));
  }, [portfolios]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <motion.div className="min-h-screen" style={{ backgroundColor: BG, color: TEXT }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <section className="relative overflow-hidden" style={{ minHeight: "calc(100vh - 4rem)" }}>
        <div className="absolute inset-0">
          <AnimatePresence initial={false} mode="wait">
            <motion.img
              key={heroSlides[activeIndex].id}
              src={heroSlides[activeIndex].image}
              alt={heroSlides[activeIndex].alt}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-[#0D0D0D]/90" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 50% 60%, rgba(197,164,109,0.12) 0%, rgba(0,0,0,0) 100%)" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center gap-4 sm:gap-6" style={{ minHeight: "calc(100vh - 4rem)" }}>
          
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {t('home.hero.title1')}
            <span className="block" style={{ color: ACCENT }}>{t('home.hero.title2')}</span>
          </motion.h1>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed px-4"
            style={{ color: MUTED }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            {t('home.hero.subtitle')}
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: ACCENT }}
            >
              {t('home.hero.explore')}
              <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 transition-all duration-300 hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.3)', color: TEXT }}
            >
              {t('home.hero.book')}
              <FiCamera className="w-4 h-4" />
            </Link>
          </motion.div>
          
        </div>

        <motion.button 
          onClick={prevSlide} 
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:scale-110" 
          style={{ backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
        <motion.button 
          onClick={nextSlide} 
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:scale-110" 
          style={{ backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>

        <motion.div 
          className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {heroSlides.map((s, i) => (
            <motion.button
              key={s.id}
              onClick={() => setActiveIndex(i)}
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: i === activeIndex ? 32 : 8, 
                backgroundColor: i === activeIndex ? ACCENT : "rgba(255,255,255,0.4)" 
              }}
              whileHover={{ scale: 1.2 }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </motion.div>
      </section>

      <motion.section className="py-8 sm:py-12 md:py-16" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-2"
            variants={fadeInUp}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{t('home.categories.title')}</h2>
            <Link to="/gallery" className="text-sm sm:text-base transition-colors hover:opacity-80" style={{ color: MUTED }}>
              {t('home.categories.browseAll')}
            </Link>
          </motion.div>

          {categoriesLoading ? (
            <motion.div 
              className="flex justify-center items-center py-12"
              variants={fadeInUp}
            >
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: ACCENT }}></div>
                <p style={{ color: MUTED }}>{t('home.categories.loading')}</p>
              </div>
            </motion.div>
          ) : categoriesError ? (
            <motion.div 
              className="text-center py-12"
              variants={fadeInUp}
            >
              <p style={{ color: "#ff6b6b" }}>{t('home.categories.failed')}</p>
            </motion.div>
          ) : (
            <motion.div 
              className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
              variants={containerVariants}
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {categories.map((cat) => (
                <motion.div
                  key={cat._id}
                  className="min-w-[180px] sm:min-w-[220px] snap-start rounded-xl overflow-hidden group cursor-pointer"
                  style={{ backgroundColor: CARD, border: "1px solid rgba(255,255,255,0.1)" }}
                  variants={fadeInUp}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-32 sm:h-40 overflow-hidden">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-sm sm:text-base mb-1">{cat.name}</h3>
                    <p className="text-xs sm:text-sm mb-3" style={{ color: MUTED }}>
                      {t('home.categories.explore', { name: cat.name.toLowerCase() })}
                    </p>
                    <Link
                      to={`/gallery?category=${slugify(cat.name)}`}
                      className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium transition-colors duration-300 group-hover:translate-x-1"
                      style={{ color: HOVER }}
                    >
                      {t('home.categories.viewCollection')}
                      <FiArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      <motion.section className="py-8 sm:py-12 md:py-16" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-2"
            variants={fadeInUp}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{t('home.featured.title')}</h2>
            <Link to="/gallery" className="text-sm sm:text-base transition-colors hover:opacity-80" style={{ color: MUTED }}>
              {t('home.featured.viewAll')}
            </Link>
          </motion.div>

          {portfoliosLoading ? (
            <motion.div 
              className="flex justify-center items-center py-12"
              variants={fadeInUp}
            >
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: ACCENT }}></div>
                <p style={{ color: MUTED }}>{t('home.featured.loading')}</p>
              </div>
            </motion.div>
          ) : portfoliosError ? (
            <motion.div 
              className="text-center py-12"
              variants={fadeInUp}
            >
              <p style={{ color: "#ff6b6b" }}>{t('home.featured.failed')}</p>
            </motion.div>
          ) : featuredGalleries.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              variants={fadeInUp}
            >
              <p style={{ color: MUTED }}>{t('home.featured.empty')}</p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              variants={containerVariants}
            >
              {featuredGalleries.map((g) => (
                <motion.div
                  key={g.id}
                  className="rounded-xl overflow-hidden group cursor-pointer"
                  style={{ backgroundColor: CARD, border: "1px solid rgba(255,255,255,0.1)" }}
                  variants={fadeInUp}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img src={g.image} alt={g.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm" style={{ backgroundColor: `${ACCENT}CC`, color: "#0D0D0D" }}>
                      {g.category}
                    </div>
                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FiArrowRight className="w-4 h-4" style={{ color: ACCENT }} />
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="font-semibold text-base sm:text-lg mb-2 group-hover:text-opacity-80 transition-colors">{g.title}</h3>
                    <p className="text-sm mb-4 line-clamp-2" style={{ color: MUTED }}>
                      {g.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: MUTED }}>
                        {g.date}
                      </span>
                      <Link
                        to={`/gallery?category=${g.category.toLowerCase()}`}
                        className="inline-flex items-center gap-1 text-sm font-medium transition-all duration-300 group-hover:translate-x-1"
                        style={{ color: HOVER }}
                      >
                        {t('home.featured.viewGallery')}
                        <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.section>

      <motion.section className="py-8 sm:py-12 md:py-16" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="rounded-2xl p-6 sm:p-8 md:p-10 text-center"
            style={{ 
              background: "linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%)", 
              border: "1px solid rgba(197,164,109,0.2)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
            }}
            variants={fadeInUp}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <FiCamera className="w-4 h-4" style={{ color: ACCENT }} />
              <span className="text-sm font-medium">{t('home.cta.ready')}</span>
            </motion.div>
            
            <motion.h3 
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {t('home.cta.letsCreate')}
              <span className="block" style={{ color: ACCENT }}>{t('home.cta.beautifulTogether')}</span>
            </motion.h3>
            
            <motion.p 
              className="text-base sm:text-lg max-w-2xl mx-auto mb-8"
              style={{ color: MUTED }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {t('home.cta.description')}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link 
                to="/contact" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: ACCENT }}
              >
                {t('home.cta.bookSession')}
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/gallery" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 transition-all duration-300 hover:bg-white/10"
                style={{ borderColor: 'rgba(255,255,255,0.3)', color: TEXT }}
              >
                {t('home.cta.viewWork')}
                <FiEye className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

    </motion.div>
  );
}
