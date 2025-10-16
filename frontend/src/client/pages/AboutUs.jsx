import { motion, useScroll, useTransform } from "framer-motion";
import { FiCamera, FiHeart, FiUsers, FiAward, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { useRef, useMemo } from "react";
import { useTranslation } from 'react-i18next';

const BG = "#0D0D0D";
const TEXT = "#FFFFFF";
const MUTED = "#B3B3B3";
const CARD = "#1A1A1A";
const ACCENT = "#C5A46D";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function AboutUs() {
  const { t } = useTranslation();
    const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
    return (
    <div ref={containerRef} className="min-h-screen" style={{ backgroundColor: BG, color: TEXT }}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" style={{ opacity: overlayOpacity }} />
            </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ y: heroY }}>
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-white/10 bg-black/30 backdrop-blur-sm mb-4" style={{ color: MUTED }}>
              <FiCamera className="w-4 h-4" style={{ color: ACCENT }} /> {t('aboutPage.heroTag')}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              {t('aboutPage.heroTitle')}
                        </h1>
            <p className="mt-4 text-base sm:text-lg max-w-2xl mx-auto" style={{ color: MUTED }}>
              {t('aboutPage.heroSubtitle')}
            </p>
            <a
              href="/gallery"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: ACCENT }}
            >
              {t('aboutPage.exploreWork')} <FiArrowRight className="w-4 h-4" />
            </a>
                    </motion.div>
                </div>
      </section>

      {/* Our Story */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">{t('aboutPage.ourStory')}</h2>
              <p style={{ color: MUTED }} className="text-base sm:text-lg leading-relaxed">
                {t('aboutPage.storyP1')}
              </p>
              <p style={{ color: MUTED }} className="text-base sm:text-lg leading-relaxed">
                {t('aboutPage.storyP2')}
              </p>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              <div className="rounded-2xl p-6 md:p-8 border" style={{ backgroundColor: CARD, borderColor: `${ACCENT}30` }}>
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${ACCENT}20` }}>
                      <FiCheckCircle className="w-4 h-4" style={{ color: ACCENT }} />
                    </div>
                    <div>
                      <div className="font-semibold">{t('aboutPage.feature1Title')}</div>
                      <p className="text-sm" style={{ color: MUTED }}>{t('aboutPage.feature1Desc')}</p>
                    </div>
                            </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${ACCENT}20` }}>
                      <FiCheckCircle className="w-4 h-4" style={{ color: ACCENT }} />
                                </div>
                    <div>
                      <div className="font-semibold">{t('aboutPage.feature2Title')}</div>
                      <p className="text-sm" style={{ color: MUTED }}>{t('aboutPage.feature2Desc')}</p>
                                </div>
                                </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${ACCENT}20` }}>
                      <FiCheckCircle className="w-4 h-4" style={{ color: ACCENT }} />
                                </div>
                    <div>
                      <div className="font-semibold">{t('aboutPage.feature3Title')}</div>
                      <p className="text-sm" style={{ color: MUTED }}>{t('aboutPage.feature3Desc')}</p>
                    </div>
                </div>
                </div>
                                    </div>
                            </motion.div>
                    </div>
                </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">{t('aboutPage.valuesTitle')}</h2>
            <p className="mt-3 text-base sm:text-lg" style={{ color: MUTED }}>{t('aboutPage.valuesSubtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: FiHeart, title: t('aboutPage.pillarPassion'), desc: t('aboutPage.pillarPassionDesc') },
              { icon: FiUsers, title: t('aboutPage.pillarConnection'), desc: t('aboutPage.pillarConnectionDesc') },
              { icon: FiAward, title: t('aboutPage.pillarExcellence'), desc: t('aboutPage.pillarExcellenceDesc') },
              { icon: FiCamera, title: t('aboutPage.pillarCraft'), desc: t('aboutPage.pillarCraftDesc') }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                className="rounded-2xl p-5 md:p-6 border h-full shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
                style={{ background: "linear-gradient(180deg, #1A1A1A 0%, #151515 100%)", borderColor: `${ACCENT}25` }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${ACCENT}20` }}>
                  <item.icon className="w-6 h-6" style={{ color: ACCENT }} />
                                    </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm" style={{ color: MUTED }}>{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
      </section>

      {/* Services */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">{t('aboutPageServices.title')}</h2>
            <p className="mt-3 text-base sm:text-lg" style={{ color: MUTED }}>{t('aboutPageServices.subtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              { title: t('aboutPageServices.items.weddingTitle'), desc: t('aboutPageServices.items.weddingDesc'), icon: FiHeart },
              { title: t('aboutPageServices.items.portraitsTitle'), desc: t('aboutPageServices.items.portraitsDesc'), icon: FiUsers },
              { title: t('aboutPageServices.items.eventsTitle'), desc: t('aboutPageServices.items.eventsDesc'), icon: FiAward },
              { title: t('aboutPageServices.items.fashionTitle'), desc: t('aboutPageServices.items.fashionDesc'), icon: FiCamera },
              { title: t('aboutPageServices.items.lifestyleTitle'), desc: t('aboutPageServices.items.lifestyleDesc'), icon: FiCamera },
              { title: t('aboutPageServices.items.productTitle'), desc: t('aboutPageServices.items.productDesc'), icon: FiAward },
            ].map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="relative rounded-2xl border overflow-hidden group"
                style={{ backgroundColor: CARD, borderColor: `${ACCENT}25` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `radial-gradient(800px circle at 0% 0%, ${ACCENT}14, transparent 40%)` }} />
                <div className="p-6 md:p-7 relative">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${ACCENT}1A`, border: `1px solid ${ACCENT}33` }}>
                    <s.icon className="w-5 h-5" style={{ color: ACCENT }} />
                  </div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="text-sm mt-1.5" style={{ color: MUTED }}>{s.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium" style={{ color: ACCENT }}>
                    <span>{t('aboutPageServices.learnMore')}</span>
                    <FiArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl p-8 md:p-10 text-center border" style={{ background: "linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%)", borderColor: `${ACCENT}30` }}>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
              {t('aboutPage.ctaTitle')}
            </h3>
            <p className="mt-3 text-base sm:text-lg max-w-2xl mx-auto" style={{ color: MUTED }}>
              {t('aboutPage.ctaSubtitle')}
            </p>
            <a
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: ACCENT }}
            >
              {t('aboutPage.ctaButton')} <FiArrowRight className="w-4 h-4" />
                                            </a>
                                        </div>
                                        </div>
      </section>
        </div>
    );
}
