import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { FiCamera, FiHeart, FiUsers, FiAward, FiEye, FiStar, FiTrendingUp, FiZap, FiMail, FiArrowRight, FiPlay } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

const BG = "#0D0D0D";
const TEXT = "#FFFFFF";
const MUTED = "#B3B3B3";
const CARD = "#1A1A1A";
const ACCENT = "#C5A46D";
const HOVER = "#FFD369";
const GRADIENT_START = "#C5A46D";
const GRADIENT_END = "#FFD369";

// Professional animation variants
const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const titleVariants = {
  hidden: { 
    opacity: 0, 
    y: 100,
    rotateX: -90
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 1,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const slideInVariants = {
  hidden: { 
    opacity: 0, 
    x: -100,
    filter: "blur(10px)"
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.8,
    rotateY: -15
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [-2, 2, -2],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const AboutUs = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <div ref={containerRef} style={{ backgroundColor: BG, color: TEXT }} className="min-h-screen overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <motion.div
                    variants={pulseVariants}
                    animate="animate"
                    className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-5"
                    style={{ 
                        background: `radial-gradient(circle, ${GRADIENT_START}, transparent 70%)`
                    }}
                />
                <motion.div
                    variants={floatingVariants}
                    animate="animate"
                    className="absolute bottom-20 left-20 w-64 h-64 rounded-full opacity-5"
                    style={{ 
                        background: `radial-gradient(circle, ${GRADIENT_END}, transparent 70%)`
                    }}
                />
            </div>

            {/* Hero Section */}
            <motion.section 
                initial="hidden"
                animate="visible"
                variants={heroVariants}
                className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
            >
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <motion.div
                        variants={titleVariants}
                        className="mb-8"
                    >
                        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-4">
                            <span style={{ color: TEXT }}>Studio</span>
                            <span 
                                className="relative inline-block ml-4"
                                style={{ 
                                    background: `linear-gradient(135deg, ${GRADIENT_START}, ${GRADIENT_END})`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}
                            >
                                PH
                                <motion.div 
                                    className="absolute -inset-2 rounded-2xl opacity-20 blur-xl"
                                    style={{ 
                                        background: `linear-gradient(135deg, ${GRADIENT_START}, ${GRADIENT_END})`
                                    }}
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        opacity: [0.2, 0.4, 0.2]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </span>
                        </h1>
                        <motion.div
                            className="h-1 mx-auto rounded-full"
                            style={{ 
                                background: `linear-gradient(90deg, transparent, ${ACCENT}, ${HOVER}, ${ACCENT}, transparent)`,
                                width: '200px'
                            }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 1.2, duration: 1 }}
                        />
                    </motion.div>

                    <motion.p 
                        variants={slideInVariants}
                        className="text-xl sm:text-2xl lg:text-3xl leading-relaxed max-w-4xl mx-auto mb-12 font-light"
                        style={{ color: MUTED }}
                    >
                        Where <span style={{ color: ACCENT }} className="font-semibold">artistry</span> meets 
                        <span style={{ color: ACCENT }} className="font-semibold"> precision</span>, 
                        transforming fleeting moments into 
                        <span style={{ color: HOVER }} className="font-semibold"> eternal masterpieces</span>
                    </motion.p>

                    <motion.div
                        variants={slideInVariants}
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                    >
                        <motion.button
                            whileHover={{ 
                                scale: 1.05,
                                boxShadow: `0 20px 40px rgba(197, 164, 109, 0.3)`
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-8 py-4 rounded-full text-lg font-semibold overflow-hidden"
                            style={{ 
                                background: `linear-gradient(135deg, ${GRADIENT_START}, ${GRADIENT_END})`,
                                color: BG
                            }}
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Explore Our Work
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            <motion.div
                                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                                transition={{ duration: 0.3 }}
                            />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group flex items-center gap-3 px-8 py-4 rounded-full text-lg font-semibold border-2 transition-all duration-300"
                            style={{ 
                                borderColor: ACCENT,
                                color: ACCENT
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = ACCENT;
                                e.target.style.color = BG;
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = ACCENT;
                            }}
                        >
                            <FiPlay />
                            Watch Our Story
                        </motion.button>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-6 h-10 border-2 rounded-full flex justify-center" style={{ borderColor: ACCENT }}>
                        <motion.div
                            className="w-1 h-3 rounded-full mt-2"
                            style={{ backgroundColor: ACCENT }}
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                </motion.div>
            </motion.section>

            {/* Story Section */}
            <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="py-32 px-4 sm:px-6 lg:px-8 relative"
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6" style={{ color: TEXT }}>
                            Our <span style={{ color: ACCENT }}>Legacy</span>
                        </h2>
                        <div className="w-24 h-1 mx-auto rounded-full" style={{ background: `linear-gradient(90deg, ${GRADIENT_START}, ${GRADIENT_END})` }} />
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -100, rotateY: -15 }}
                            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="space-y-8"
                        >
                            <div className="space-y-6 text-lg leading-relaxed" style={{ color: MUTED }}>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.8 }}
                                >
                                    For over a <span style={{ color: ACCENT }} className="font-semibold">decade</span>, 
                                    StudioPH has been at the forefront of visual storytelling, crafting narratives 
                                    that transcend the ordinary and capture the essence of human emotion.
                                </motion.p>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.8 }}
                                >
                                    Our philosophy is simple yet profound: every frame should tell a story, 
                                    every moment should resonate with authenticity, and every image should 
                                    stand as a testament to the beauty of life itself.
                                </motion.p>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.8 }}
                                >
                                    We don't just capture photographs – we preserve <span style={{ color: HOVER }} className="font-semibold">legacies</span>, 
                                    create <span style={{ color: HOVER }} className="font-semibold">heirlooms</span>, 
                                    and transform fleeting seconds into eternal treasures.
                                </motion.p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                                className="flex items-center gap-8 pt-6"
                            >
                                <div className="text-center">
                                    <div className="text-4xl font-black" style={{ color: ACCENT }}>1000+</div>
                                    <div className="text-sm font-medium" style={{ color: MUTED }}>Projects Completed</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-black" style={{ color: ACCENT }}>50+</div>
                                    <div className="text-sm font-medium" style={{ color: MUTED }}>Awards Won</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-black" style={{ color: ACCENT }}>10+</div>
                                    <div className="text-sm font-medium" style={{ color: MUTED }}>Years Experience</div>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 100, rotateY: 15 }}
                            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="relative"
                        >
                            <motion.div 
                                className="relative rounded-3xl p-12 shadow-2xl backdrop-blur-sm border border-opacity-10 overflow-hidden"
                                style={{ 
                                    backgroundColor: `${CARD}CC`,
                                    borderColor: ACCENT
                                }}
                                whileHover={{ 
                                    scale: 1.02,
                                    rotateY: -5,
                                    transition: { duration: 0.3 }
                                }}
                            >
                                <motion.div
                                    className="absolute inset-0 opacity-10"
                                    style={{ 
                                        background: `linear-gradient(135deg, ${GRADIENT_START}, ${GRADIENT_END})`
                                    }}
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        opacity: [0.1, 0.2, 0.1]
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                                
                                <div className="text-center relative z-10">
                                    <motion.div
                                        animate={{ 
                                            rotate: [0, 360],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{ 
                                            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                                        }}
                                        className="mb-8"
                                    >
                                        <FiCamera size={80} style={{ color: ACCENT }} className="mx-auto" />
                                    </motion.div>
                                    
                                    <h3 className="text-3xl font-bold mb-6" style={{ color: TEXT }}>
                                        Crafting Visual Excellence
                                    </h3>
                                    
                                    <p style={{ color: MUTED }} className="text-lg leading-relaxed mb-8">
                                        With cutting-edge technology and an unwavering commitment to artistic vision, 
                                        we transform ordinary moments into extraordinary works of art.
                                    </p>

                                    <motion.div
                                        className="flex justify-center gap-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1, duration: 0.6 }}
                                    >
                                        {[FiEye, FiStar, FiZap].map((Icon, index) => (
                                            <motion.div
                                                key={index}
                                                className="w-12 h-12 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: `${ACCENT}20` }}
                                                whileHover={{ 
                                                    scale: 1.2,
                                                    backgroundColor: `${ACCENT}40`
                                                }}
                                                animate={{
                                                    y: [0, -5, 0]
                                                }}
                                                transition={{
                                                    y: {
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        delay: index * 0.3,
                                                        ease: "easeInOut"
                                                    }
                                                }}
                                            >
                                                <Icon size={24} style={{ color: ACCENT }} />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Values Section */}
            <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, ${ACCENT} 2px, transparent 2px), radial-gradient(circle at 75% 75%, ${HOVER} 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }} />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6" style={{ color: TEXT }}>
                            Our <span style={{ color: ACCENT }}>Philosophy</span>
                        </h2>
                        <div className="w-24 h-1 mx-auto rounded-full" style={{ background: `linear-gradient(90deg, ${GRADIENT_START}, ${GRADIENT_END})` }} />
                        <p className="text-xl max-w-3xl mx-auto mt-8" style={{ color: MUTED }}>
                            Four pillars that define our approach to visual storytelling and client relationships
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: FiHeart,
                                title: "Passion",
                                description: "Every frame is infused with genuine emotion and artistic vision that transcends the ordinary.",
                                gradient: "from-red-500/20 to-pink-500/20"
                            },
                            {
                                icon: FiUsers,
                                title: "Connection",
                                description: "Building deep relationships to understand and capture your unique story authentically.",
                                gradient: "from-blue-500/20 to-cyan-500/20"
                            },
                            {
                                icon: FiAward,
                                title: "Excellence",
                                description: "Uncompromising commitment to quality in every aspect of our craft and service.",
                                gradient: "from-yellow-500/20 to-orange-500/20"
                            },
                            {
                                icon: FiTrendingUp,
                                title: "Innovation",
                                description: "Pushing creative boundaries with cutting-edge techniques and artistic vision.",
                                gradient: "from-green-500/20 to-emerald-500/20"
                            }
                        ].map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                                transition={{ 
                                    delay: index * 0.15, 
                                    duration: 0.8,
                                    ease: [0.25, 0.46, 0.45, 0.94]
                                }}
                                whileHover={{ 
                                    y: -10,
                                    rotateY: 5,
                                    scale: 1.02,
                                    transition: { duration: 0.3 }
                                }}
                                className="group relative"
                            >
                                <motion.div
                                    className="relative rounded-3xl p-8 backdrop-blur-sm border border-opacity-10 overflow-hidden h-full"
                                    style={{ 
                                        backgroundColor: `${CARD}CC`,
                                        borderColor: ACCENT
                                    }}
                                >
                                    {/* Animated Background Gradient */}
                                    <motion.div
                                        className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-100`}
                                        transition={{ duration: 0.5 }}
                                    />
                                    
                                    {/* Floating Icon */}
                                    <motion.div
                                        className="relative z-10 text-center mb-6"
                                        animate={{
                                            y: [0, -5, 0]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            delay: index * 0.5,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <motion.div
                                            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4"
                                            style={{ backgroundColor: `${ACCENT}20` }}
                                            whileHover={{ 
                                                scale: 1.1,
                                                backgroundColor: `${ACCENT}30`,
                                                rotate: 5
                                            }}
                                        >
                                            <value.icon size={40} style={{ color: ACCENT }} />
                                        </motion.div>
                                    </motion.div>
                                    
                                    <div className="relative z-10 text-center">
                                        <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors" style={{ color: TEXT }}>
                                            {value.title}
                                        </h3>
                                        <p className="leading-relaxed group-hover:text-gray-200 transition-colors" style={{ color: MUTED }}>
                                            {value.description}
                                        </p>
                                    </div>

                                    {/* Hover Effect Lines */}
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl"
                                        style={{ background: `linear-gradient(90deg, ${GRADIENT_START}, ${GRADIENT_END})` }}
                                        initial={{ scaleX: 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Services Showcase */}
            <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="py-32 px-4 sm:px-6 lg:px-8 relative"
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6" style={{ color: TEXT }}>
                            Our <span style={{ color: ACCENT }}>Mastery</span>
                        </h2>
                        <div className="w-24 h-1 mx-auto rounded-full" style={{ background: `linear-gradient(90deg, ${GRADIENT_START}, ${GRADIENT_END})` }} />
                        <p className="text-xl max-w-3xl mx-auto mt-8" style={{ color: MUTED }}>
                            Specialized expertise across diverse photography disciplines
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Wedding Photography",
                                description: "Capturing the magic, emotion, and beauty of your special day with cinematic elegance.",
                                icon: FiHeart,
                                color: "from-pink-500 to-rose-500"
                            },
                            {
                                title: "Portrait Sessions",
                                description: "Professional portraits that reveal personality and character through expert lighting.",
                                icon: FiUsers,
                                color: "from-blue-500 to-indigo-500"
                            },
                            {
                                title: "Event Coverage",
                                description: "Comprehensive documentation of corporate events and special celebrations.",
                                icon: FiCamera,
                                color: "from-purple-500 to-violet-500"
                            },
                            {
                                title: "Fashion Photography",
                                description: "Creative fashion shoots showcasing style, personality, and artistic vision.",
                                icon: FiStar,
                                color: "from-yellow-500 to-orange-500"
                            },
                            {
                                title: "Nature & Landscape",
                                description: "Breathtaking captures of natural beauty and stunning landscapes.",
                                icon: FiEye,
                                color: "from-green-500 to-emerald-500"
                            },
                            {
                                title: "Street Photography",
                                description: "Authentic urban moments captured with artistic perspective and storytelling.",
                                icon: FiZap,
                                color: "from-red-500 to-pink-500"
                            }
                        ].map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ 
                                    delay: index * 0.1, 
                                    duration: 0.8,
                                    ease: [0.25, 0.46, 0.45, 0.94]
                                }}
                                whileHover={{ 
                                    y: -15,
                                    scale: 1.03,
                                    rotateY: 5,
                                    transition: { duration: 0.4 }
                                }}
                                className="group relative"
                            >
                                <motion.div
                                    className="relative rounded-3xl p-8 backdrop-blur-sm border border-opacity-10 overflow-hidden h-full"
                                    style={{ 
                                        backgroundColor: `${CARD}DD`,
                                        borderColor: ACCENT
                                    }}
                                >
                                    {/* Animated Background */}
                                    <motion.div
                                        className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10`}
                                        transition={{ duration: 0.5 }}
                                    />
                                    
                                    {/* Glowing Border Effect */}
                                    <motion.div
                                        className="absolute inset-0 rounded-3xl"
                                        style={{ 
                                            background: `linear-gradient(135deg, ${GRADIENT_START}, ${GRADIENT_END})`,
                                            padding: '2px'
                                        }}
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 0.3 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div 
                                            className="w-full h-full rounded-3xl"
                                            style={{ backgroundColor: CARD }}
                                        />
                                    </motion.div>
                                    
                                    <div className="relative z-10">
                                        {/* Floating Icon */}
                                        <motion.div
                                            className="mb-6"
                                            animate={{
                                                y: [0, -8, 0],
                                                rotate: [0, 5, 0]
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Infinity,
                                                delay: index * 0.3,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <motion.div
                                                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                                style={{ backgroundColor: `${ACCENT}20` }}
                                                whileHover={{ 
                                                    scale: 1.2,
                                                    backgroundColor: `${ACCENT}30`,
                                                    rotate: 10
                                                }}
                                            >
                                                <service.icon size={32} style={{ color: ACCENT }} />
                                            </motion.div>
                                        </motion.div>
                                        
                                        <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors" style={{ color: ACCENT }}>
                                            {service.title}
                                        </h3>
                                        <p className="leading-relaxed group-hover:text-gray-200 transition-colors" style={{ color: MUTED }}>
                                            {service.description}
                                        </p>
                                    </div>

                                    {/* Particle Effect */}
                                    <motion.div
                                        className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-0 group-hover:opacity-60"
                                        style={{ backgroundColor: ACCENT }}
                                        animate={{
                                            scale: [0, 1, 0],
                                            opacity: [0, 0.6, 0]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: index * 0.2
                                        }}
                                    />
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Contact CTA */}
            <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
            >
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <motion.div
                        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
                        style={{ background: `radial-gradient(circle, ${GRADIENT_START}, transparent)` }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.2, 0.1]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
                        style={{ background: `radial-gradient(circle, ${GRADIENT_END}, transparent)` }}
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.2, 0.1, 0.2]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8" style={{ color: TEXT }}>
                            Let's Create <span style={{ color: ACCENT }}>Magic</span>
                        </h2>
                        <p className="text-xl sm:text-2xl mb-12 max-w-3xl mx-auto font-light" style={{ color: MUTED }}>
                            Transform your vision into stunning visual narratives. 
                            Every masterpiece begins with a single conversation.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                    >
                        <motion.a
                            href="/contact"
                            whileHover={{ 
                                scale: 1.05,
                                boxShadow: `0 25px 50px rgba(197, 164, 109, 0.4)`
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-10 py-5 rounded-full text-xl font-bold overflow-hidden"
                            style={{ 
                                background: `linear-gradient(135deg, ${GRADIENT_START}, ${GRADIENT_END})`,
                                color: BG
                            }}
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Start Your Journey
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <FiArrowRight size={24} />
                                </motion.div>
                            </span>
                            <motion.div
                                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                                transition={{ duration: 0.3 }}
                            />
                        </motion.a>

                        <motion.a
                            href="mailto:hello@studioph.com"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group flex items-center gap-3 px-10 py-5 rounded-full text-xl font-bold border-2 transition-all duration-300"
                            style={{ 
                                borderColor: ACCENT,
                                color: ACCENT
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = ACCENT;
                                e.target.style.color = BG;
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = ACCENT;
                            }}
                        >
                            <FiMail size={24} />
                            Get In Touch
                        </motion.a>
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
}

export default AboutUs;
