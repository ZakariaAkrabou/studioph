import { useState, useEffect, useMemo } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLock,
  FiUnlock,
  FiKey,
  FiEye,
  FiEyeOff,
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

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const SpaceClient = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [accessKey, setAccessKey] = useState("");
  const [error, setError] = useState("");
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const { data: spaces = [], isLoading: spacesLoading } = useGetPublicSpacesQuery();
  const [accessSpace, { isLoading: accessLoading }] = useAccessSpaceMutation();
  const publicGalleries = useMemo(() => {
    return (spaces || []).map((s) => ({
      id: s._id,
      title: s.name,
      description: t('client.privateGalleryDesc'),
      coverImage: s.cover || s.images?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
      photographer: s.admin?.email || "StudioPH",
      eventDate: new Intl.DateTimeFormat(i18n.language).format(new Date(s.createdAt || Date.now())),
      totalImages: s.images?.length || 0,
      category: "Gallery"
    }));
  }, [spaces, i18n.language]);

  const totalPages = Math.max(1, Math.ceil((publicGalleries?.length || 0) / pageSize));
  const currentGalleries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return publicGalleries.slice(start, start + pageSize);
  }, [publicGalleries, currentPage]);

  useEffect(() => {
    // Reset to first page when data set changes
    setCurrentPage(1);
  }, [publicGalleries.length]);

  // no detail selection logic here

  // authentication is handled in detail page

  const handleKeySubmit = async (e) => {
    e.preventDefault();
    if (!accessKey.trim() || !selectedGallery) return;
    setError("");
    setIsSubmitting(true);
    const slug = slugify(selectedGallery.title);
    navigate(`/client/${slug}`, { state: { spaceId: selectedGallery.id } });
    setShowKeyModal(false);
  };

  const handleGalleryAccess = (gallery) => {
    setSelectedGallery(gallery);
    setAccessKey("");
    setError("");
    setShowKeyModal(true);
  };

  const handleModalKeySubmit = async (e) => {
    e.preventDefault();
    if (!accessKey.trim() || !selectedGallery) return;
    setError("");
    setIsSubmitting(true);
    try {
      // Pass the key to the detail page to verify there, keeping UX localized
      setShowKeyModal(false);
      const slug = slugify(selectedGallery.title);
      navigate(`/client/${slug}`, { state: { spaceId: selectedGallery.id, key: accessKey } });
    } catch (err) {
      // Handle error - keep modal open and show error
      setError(err?.data?.message || "Invalid access key. Please try again.");
      setIsSubmitting(false);
    }
  };

  // no lightbox in list page

  if (spacesLoading && !showKeyModal) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center relative z-10"
        style={{ backgroundColor: BG, color: TEXT }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-current border-t-transparent rounded-full animate-spin mb-4 mx-auto" style={{ color: ACCENT }} />
          <p className="text-lg">{t('client.loading')}</p>
        </div>
      </motion.div>
    );
  }
  // no authenticated content in list page

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
          animate="visible"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              variants={containerVariants}
            >
            {currentGalleries.map((gallery) => (
                <motion.div
                  key={gallery.id}
                  className="group cursor-pointer"
                  variants={fadeInUp}
                  whileHover={{ y: -4, scale: 1.01 }}
                  onClick={() => handleGalleryAccess(gallery)}
                >
                  <div className="relative overflow-hidden rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.25)] ring-1 ring-white/10" style={{ backgroundColor: CARD }}>
                    <div className="relative aspect-[4/3]">
                      <img
                        src={gallery.coverImage}
                        alt={gallery.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                      {/* Top row badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <div className="px-2.5 py-1 rounded-md text-[10px] font-semibold" style={{ backgroundColor: `${ACCENT}E6`, color: "#0D0D0D" }}>
                          {gallery.category}
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/50 text-[10px] text-white/90 backdrop-blur-sm">
                          <FiLock className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                          <span>{t('client.accessKeyRequired')}</span>
                        </div>
                      </div>
                      {/* Title at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-bold tracking-tight">{gallery.title}</h3>
                        <div className="mt-2 flex items-center gap-4 text-xs" style={{ color: MUTED }}>
                          <span className="inline-flex items-center gap-1"><FiUser className="w-4 h-4" />{gallery.photographer}</span>
                          <span className="inline-flex items-center gap-1"><FiImage className="w-4 h-4" />{gallery.totalImages}</span>
                          <span className="inline-flex items-center gap-1"><FiCalendar className="w-4 h-4" />{new Date(gallery.eventDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    {/* Subtle footer hover effect */}
                    <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${ACCENT}, transparent)` }} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
            {/* Pagination */}
            {publicGalleries.length > pageSize && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-md border disabled:opacity-50"
                  style={{ borderColor: "rgba(255,255,255,0.2)", color: TEXT, backgroundColor: CARD }}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={`px-3 py-2 rounded-md border ${p === currentPage ? 'font-semibold' : ''}`}
                    style={{ 
                      borderColor: p === currentPage ? ACCENT : "rgba(255,255,255,0.2)", 
                      color: p === currentPage ? "#0D0D0D" : TEXT,
                      backgroundColor: p === currentPage ? ACCENT : CARD 
                    }}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-md border disabled:opacity-50"
                  style={{ borderColor: "rgba(255,255,255,0.2)", color: TEXT, backgroundColor: CARD }}
                >
                  Next
                </button>
              </div>
            )}
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
                        type={showKey ? "text" : "password"}
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
                      <button
                        type="button"
                        onClick={() => setShowKey((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-sm opacity-75 hover:opacity-100"
                        aria-label={showKey ? "Hide key" : "Show key"}
                        style={{ color: MUTED }}
                      >
                        {showKey ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
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
                      disabled={!accessKey.trim() || isSubmitting}
                      className="flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
                      style={{ backgroundColor: ACCENT, color: "#0D0D0D" }}
                    >
                      {isSubmitting ? t('client.verifying') : t('client.accessGallery')}
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
