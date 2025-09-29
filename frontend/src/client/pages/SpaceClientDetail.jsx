import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiX, FiChevronLeft, FiChevronRight, FiEye, FiHeart, FiGrid, FiStar } from "react-icons/fi";
import { useGetPublicSpacesQuery, useAccessSpaceMutation } from "../../store/services/clientSpaceApi";

const BG = "#0D0D0D";
const TEXT = "#FFFFFF";
const MUTED = "#B3B3B3";
const ACCENT = "#C5A46D";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.1 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

// Build a smaller Cloudinary thumbnail from a full image URL when possible
const buildCloudinaryThumbnail = (url, width = 480) => {
  try {
    if (typeof url !== 'string') return url;
    if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
    // Insert transformation right after '/upload/'
    return url.replace('/upload/', `/upload/c_fill,q_auto,f_auto,w_${width}/`);
  } catch {
    return url;
  }
};

export default function SpaceClientDetail() {
  const { name } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { data: spaces = [], isLoading: spacesLoading } = useGetPublicSpacesQuery();
  const [accessSpace, { isLoading: accessLoading }] = useAccessSpaceMutation();

  const [selected, setSelected] = useState(null);
  const [clientSpace, setClientSpace] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [authInProgress, setAuthInProgress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const authAttemptedRef = useRef(false);

  useEffect(() => {
    if (spaces.length > 0) {
      let chosen = null;
      if (name) {
        chosen = spaces.find((s) => slugify(s.name) === name) || null;
      }
      if (!chosen && location.state?.spaceId) {
        chosen = spaces.find((s) => s._id === location.state.spaceId) || null;
      }
      if (chosen) {
        const gallery = {
          id: chosen._id,
          title: chosen.name,
          description: t('client.privateGalleryDesc'),
          coverImage: chosen.cover || chosen.images?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
          photographer: chosen.admin?.email || "StudioPH",
          eventDate: new Intl.DateTimeFormat(i18n.language).format(new Date(chosen.createdAt || Date.now())),
          totalImages: chosen.images?.length || 0,
        };
        setSelected(gallery);
        // If a key was provided via navigation state, attempt auth immediately
        if (location.state?.key && !authAttemptedRef.current) {
          authAttemptedRef.current = true;
          setAuthInProgress(true);
          handleAuthentication(gallery, location.state.key).finally(() => setAuthInProgress(false));
        }
      }
      setInitialLoad(false);
    }
  }, [name, spaces, location.state]);

  const handleAuthentication = async (gallery, keyToVerify) => {
    setError("");
    setIsSubmitting(true);
    try {
      const res = await accessSpace({ id: gallery.id, key: keyToVerify }).unwrap();
      const normalized = {
        id: gallery.id,
        title: res.name || gallery.title,
        description: gallery.description,
        coverImage: (res.images && res.images[0]) || gallery.coverImage,
        photographer: gallery.photographer,
        eventDate: gallery.eventDate,
        totalImages: res.images?.length || 0,
        images: (res.images || []).map((url, idx) => ({ id: idx + 1, url, thumbnail: buildCloudinaryThumbnail(url, 600), title: `Image ${idx + 1}`, favorite: false }))
      };
      setIsAuthenticated(true);
      setClientSpace(normalized);
      setIsSubmitting(false);
      return true;
    } catch (err) {
      setError(err?.data?.message || "Invalid access key. Please try again.");
      setIsSubmitting(false);
      return false;
    }
  };

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const closeLightbox = () => setSelectedImage(null);
  const nextImage = () => setCurrentImageIndex((i) => (i + 1) % clientSpace.images.length);
  const prevImage = () => setCurrentImageIndex((i) => (i - 1 + clientSpace.images.length) % clientSpace.images.length);

  if ((initialLoad || spacesLoading || authInProgress) && (!selected || !isAuthenticated)) {
    return (
      <motion.div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BG, color: TEXT }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-current border-t-transparent rounded-full animate-spin mb-4 mx-auto" style={{ color: ACCENT }} />
          <p className="text-lg">{authInProgress ? t('client.verifying') : t('client.loading')}</p>
        </div>
      </motion.div>
    );
  }

  if (!isAuthenticated) {
    return (
      <motion.div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: BG, color: TEXT }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="max-w-md w-full bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
          <h1 className="text-2xl font-bold mb-2 text-center">{selected?.title}</h1>
          <p className="text-sm mb-6 text-center" style={{ color: MUTED }}>{t('client.accessRequired')}</p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!selected || !accessKey.trim()) return;
              if (authAttemptedRef.current) return;
              authAttemptedRef.current = true;
              const ok = await handleAuthentication(selected, accessKey);
              if (!ok) {
                authAttemptedRef.current = false;
                return;
              }
            }}
            className="space-y-4"
          >
            <div>
              <input
                type={showKey ? "text" : "password"}
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder={t('client.enterKey')}
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none"
                style={{ backgroundColor: BG, borderColor: error ? "#ef4444" : "rgba(255,255,255,0.1)", color: TEXT }}
              />
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => navigate('/client')} className="flex-1 py-3 px-4 rounded-xl font-medium border-2" style={{ borderColor: "rgba(255,255,255,0.2)", color: MUTED }}>
                {t('client.cancel')}
              </button>
              <button type="submit" disabled={!accessKey.trim() || isSubmitting} className="flex-1 py-3 px-4 rounded-xl font-semibold disabled:opacity-50" style={{ backgroundColor: ACCENT, color: "#0D0D0D" }}>
                {isSubmitting ? t('client.verifying') : t('client.accessGallery')}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="min-h-screen" style={{ backgroundColor: BG, color: TEXT }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.section className="relative py-16 sm:py-20 overflow-hidden" variants={sectionVariants} initial="hidden" animate="visible">
        <div className="absolute inset-0">
          <img src={clientSpace.coverImage} alt={clientSpace.title} className="w-full h-full object-cover" loading="eager" decoding="async" fetchpriority="high" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={fadeInUp}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{clientSpace.title}</h1>
            <p className="text-lg sm:text-xl mb-6 max-w-3xl mx-auto" style={{ color: MUTED }}>{clientSpace.description}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <FiStar className="w-4 h-4" style={{ color: ACCENT }} />
                <span>{t('client.photographerLabel')}: {clientSpace.photographer}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiGrid className="w-4 h-4" style={{ color: ACCENT }} />
                <span>{t('client.photosCount', { count: clientSpace.totalImages })}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiHeart className="w-4 h-4" style={{ color: ACCENT }} />
                <span>{clientSpace.eventDate}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section className="py-12 sm:py-16" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6" variants={containerVariants}>
            {clientSpace.images.map((image, index) => (
              <motion.div key={image.id} className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer" variants={fadeInUp} whileHover={{ scale: 1.02 }} onClick={() => openLightbox(image, index)}>
                <img src={image.thumbnail} alt={image.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                {image.favorite && (
                  <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <FiHeart className="w-4 h-4 fill-current" style={{ color: ACCENT }} />
                  </div>
                )}
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

      <AnimatePresence>
        {selectedImage && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.95)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeLightbox}>
            <motion.div className="relative max-w-6xl max-h-full" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <img src={selectedImage.url} alt={selectedImage.title} className="max-w-full max-h-[80vh] object-contain rounded-lg" />
              <button onClick={closeLightbox} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-black/70">
                <FiX className="w-6 h-6" style={{ color: TEXT }} />
              </button>
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-black/70">
                <FiChevronLeft className="w-6 h-6" style={{ color: TEXT }} />
              </button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-black/70">
                <FiChevronRight className="w-6 h-6" style={{ color: TEXT }} />
              </button>
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <h3 className="text-lg font-semibold mb-1">{selectedImage.title}</h3>
                <p className="text-sm" style={{ color: MUTED }}>{currentImageIndex + 1} of {clientSpace.images.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


