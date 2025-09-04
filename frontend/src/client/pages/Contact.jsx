import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiFacebook, FiLinkedin, FiSend, FiArrowRight } from "react-icons/fi";

const BG = "#0D0D0D";
const TEXT = "#FFFFFF";
const MUTED = "#B3B3B3";
const CARD = "#1A1A1A";
const ACCENT = "#C5A46D";
const HOVER = "#FFD369";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", service: "", date: "", message: "" });
    }, 1600);
  };

  return (
    <div style={{ backgroundColor: BG, color: TEXT }} className="min-h-screen">
      {/* Hero */}
      <motion.section initial="hidden" animate="visible" variants={fadeIn} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-white/10 bg-black/30 backdrop-blur-sm mb-4" style={{ color: MUTED }}>
            {t('contactPage.heroTag')}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            {t('contactPage.title').split(' ')[0]} <span style={{ color: ACCENT }}>{t('contactPage.title').split(' ')[1]}</span>
          </h1>
          <p className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: MUTED }}>
            {t('contactPage.subtitleHero')}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="mailto:hello@studioph.com" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-lg" style={{ backgroundColor: ACCENT }}>
              {t('contactPage.emailCta')} <FiArrowRight className="w-4 h-4" />
            </a>
            <a href="tel:+212-66666666" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 transition-all duration-300 hover:bg-white/10" style={{ borderColor: "rgba(255,255,255,0.3)", color: TEXT }}>
              {t('contactPage.callNow')} <FiPhone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </motion.section>

      {/* Main */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={fadeIn} className="lg:col-span-2">
              <div className="rounded-xl p-6 sm:p-8 border" style={{ backgroundColor: CARD, borderColor: `${ACCENT}30` }}>
                <h2 className="text-2xl font-bold mb-2">{t('contactPage.startInquiry')}</h2>
                <p className="mb-6 text-sm" style={{ color: MUTED }}>{t('contactPage.shareDetails')}</p>

                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${ACCENT}20` }}>
                      <FiSend size={24} style={{ color: ACCENT }} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: ACCENT }}>{t('contactPage.sentTitle')}</h3>
                    <p style={{ color: MUTED }}>{t('contactPage.sentThanks')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">{t('contactPage.nameLabel')}</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-opacity-80 transition-colors" style={{ borderColor: `${ACCENT}40` }} placeholder={t('contactPage.namePlaceholder')} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">{t('contactPage.emailLabel')}</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-opacity-80 transition-colors" style={{ borderColor: `${ACCENT}40` }} placeholder={t('contactPage.emailPlaceholder')} />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">{t('contactPage.serviceLabel')}</label>
                        <select name="service" value={formData.service} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border bg-transparent text-white focus:outline-none focus:border-opacity-80 transition-colors" style={{ borderColor: `${ACCENT}40`, backgroundColor: CARD }}>
                          <option value="" style={{ backgroundColor: CARD }}>{t('contactPage.selectService')}</option>
                          <option value="wedding" style={{ backgroundColor: CARD }}>{t('contactPage.service.wedding')}</option>
                          <option value="portrait" style={{ backgroundColor: CARD }}>{t('contactPage.service.portrait')}</option>
                          <option value="event" style={{ backgroundColor: CARD }}>{t('contactPage.service.event')}</option>
                          <option value="fashion" style={{ backgroundColor: CARD }}>{t('contactPage.service.fashion')}</option>
                          <option value="other" style={{ backgroundColor: CARD }}>{t('contactPage.service.other')}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">{t('contactPage.dateLabel')}</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border bg-transparent text-white focus:outline-none focus:border-opacity-80 transition-colors" style={{ borderColor: `${ACCENT}40` }} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t('contactPage.messageLabel')}</label>
                      <textarea name="message" value={formData.message} onChange={handleChange} required rows={4} className="w-full px-4 py-3 rounded-lg border bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-opacity-80 transition-colors resize-none" style={{ borderColor: `${ACCENT}40` }} placeholder={t('contactPage.messagePlaceholder')} />
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" style={{ backgroundColor: ACCENT, color: BG }} onMouseEnter={(e) => (e.target.style.backgroundColor = HOVER)} onMouseLeave={(e) => (e.target.style.backgroundColor = ACCENT)}>
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          {t('contactPage.sending')}
                        </>
                      ) : (
                        <>
                          {t('contactPage.sendMessage')}
                          <FiSend size={16} />
                        </>
                      )}
                    </button>

                    <div className="text-xs text-center" style={{ color: MUTED }}>
                      {t('contactPage.quickNote')}
                    </div>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Info */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={fadeIn} className="space-y-6">
              <div className="rounded-xl p-6 border" style={{ backgroundColor: CARD, borderColor: `${ACCENT}30` }}>
                <h3 className="text-xl font-semibold mb-4">{t('contactPage.reachPhotographer')}</h3>
                <div className="space-y-4">
                  <a href="mailto:hello@studioph.com" className="flex items-center gap-3 p-3 rounded-lg transition-colors" style={{ backgroundColor: `${ACCENT}10` }} onMouseEnter={(e) => (e.target.style.backgroundColor = `${ACCENT}20`)} onMouseLeave={(e) => (e.target.style.backgroundColor = `${ACCENT}10`)}>
                    <FiMail size={18} style={{ color: ACCENT }} />
                    <div>
                      <div className="font-medium">{t('contactPage.email')}</div>
                      <div className="text-sm" style={{ color: MUTED }}>hello@studioph.com</div>
                    </div>
                  </a>
                  <a href="tel:+212-66666666" className="flex items-center gap-3 p-3 rounded-lg transition-colors" style={{ backgroundColor: `${ACCENT}10` }} onMouseEnter={(e) => (e.target.style.backgroundColor = `${ACCENT}20`)} onMouseLeave={(e) => (e.target.style.backgroundColor = `${ACCENT}10`)}>
                    <FiPhone size={18} style={{ color: ACCENT }} />
                    <div>
                      <div className="font-medium">{t('contactPage.phone')}</div>
                      <div className="text-sm" style={{ color: MUTED }}>+212-66666666</div>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 p-3">
                    <FiMapPin size={18} style={{ color: ACCENT }} />
                    <div>
                      <div className="font-medium">{t('contactPage.location')}</div>
                      <div className="text-sm" style={{ color: MUTED }}>Rabat, MA</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-6 border" style={{ backgroundColor: CARD, borderColor: `${ACCENT}30` }}>
                <h3 className="text-xl font-semibold mb-4">{t('contactPage.follow')}</h3>
                <div className="flex gap-3">
                  {[
                    { icon: FiInstagram, href: "#" },
                    { icon: FiFacebook, href: "#" },
                    { icon: FiTwitter, href: "#" },
                    { icon: FiLinkedin, href: "#" }
                  ].map((social, i) => (
                    <a key={i} href={social.href} className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors" style={{ backgroundColor: `${ACCENT}20` }} onMouseEnter={(e) => (e.target.style.backgroundColor = `${ACCENT}40`)} onMouseLeave={(e) => (e.target.style.backgroundColor = `${ACCENT}20`)}>
                      <social.icon size={18} style={{ color: ACCENT }} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

