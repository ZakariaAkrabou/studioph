import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiFacebook, FiLinkedin, FiSend } from "react-icons/fi";
import { useState } from "react";

const BG = "#0D0D0D";
const TEXT = "#FFFFFF";
const MUTED = "#B3B3B3";
const CARD = "#1A1A1A";
const ACCENT = "#C5A46D";
const HOVER = "#FFD369";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        date: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                service: '',
                date: '',
                message: ''
            });
        }, 2000);
    };

    return (
        <div style={{ backgroundColor: BG, color: TEXT }} className="min-h-screen">
            {/* Hero Section */}
            <motion.section 
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="py-16 px-4 sm:px-6 lg:px-8"
            >
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        Contact <span style={{ color: ACCENT }}>Us</span>
                    </h1>
                    <p className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-8" style={{ color: MUTED }}>
                        Ready to capture your special moments? Let's discuss your photography needs and create something beautiful together.
                    </p>
                </div>
            </motion.section>

            {/* Main Content */}
            <section className="pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Contact Form */}
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            variants={fadeIn}
                            className="lg:col-span-2"
                        >
                            <div 
                                className="rounded-xl p-6 sm:p-8 border"
                                style={{ 
                                    backgroundColor: CARD,
                                    borderColor: `${ACCENT}30`
                                }}
                            >
                                <h2 className="text-2xl font-bold mb-6" style={{ color: TEXT }}>
                                    Send us a message
                                </h2>

                                {submitted ? (
                                    <div className="text-center py-8">
                                        <div 
                                            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: `${ACCENT}20` }}
                                        >
                                            <FiSend size={24} style={{ color: ACCENT }} />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2" style={{ color: ACCENT }}>
                                            Message Sent!
                                        </h3>
                                        <p style={{ color: MUTED }}>
                                            Thank you for reaching out. We'll get back to you within 24 hours.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2" style={{ color: TEXT }}>
                                                    Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 rounded-lg border bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-opacity-80 transition-colors"
                                                    style={{ borderColor: `${ACCENT}40` }}
                                                    placeholder="Your name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2" style={{ color: TEXT }}>
                                                    Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 rounded-lg border bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-opacity-80 transition-colors"
                                                    style={{ borderColor: `${ACCENT}40` }}
                                                    placeholder="your@email.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2" style={{ color: TEXT }}>
                                                    Phone
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-lg border bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-opacity-80 transition-colors"
                                                    style={{ borderColor: `${ACCENT}40` }}
                                                    placeholder="Your phone number"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2" style={{ color: TEXT }}>
                                                    Service
                                                </label>
                                                <select
                                                    name="service"
                                                    value={formData.service}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-lg border bg-transparent text-white focus:outline-none focus:border-opacity-80 transition-colors"
                                                    style={{ borderColor: `${ACCENT}40`, backgroundColor: CARD }}
                                                >
                                                    <option value="" style={{ backgroundColor: CARD }}>Select service</option>
                                                    <option value="wedding" style={{ backgroundColor: CARD }}>Wedding</option>
                                                    <option value="portrait" style={{ backgroundColor: CARD }}>Portrait</option>
                                                    <option value="event" style={{ backgroundColor: CARD }}>Event</option>
                                                    <option value="fashion" style={{ backgroundColor: CARD }}>Fashion</option>
                                                    <option value="other" style={{ backgroundColor: CARD }}>Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: TEXT }}>
                                                Preferred Date
                                            </label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border bg-transparent text-white focus:outline-none focus:border-opacity-80 transition-colors"
                                                style={{ borderColor: `${ACCENT}40` }}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: TEXT }}>
                                                Message *
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows={4}
                                                className="w-full px-4 py-3 rounded-lg border bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-opacity-80 transition-colors resize-none"
                                                style={{ borderColor: `${ACCENT}40` }}
                                                placeholder="Tell us about your photography needs..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            style={{ 
                                                backgroundColor: ACCENT,
                                                color: BG
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = HOVER}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = ACCENT}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send Message
                                                    <FiSend size={16} />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </motion.div>

                        {/* Contact Information */}
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            variants={fadeIn}
                            className="space-y-6"
                        >
                            {/* Contact Details */}
                            <div 
                                className="rounded-xl p-6 border"
                                style={{ 
                                    backgroundColor: CARD,
                                    borderColor: `${ACCENT}30`
                                }}
                            >
                                <h3 className="text-xl font-semibold mb-4" style={{ color: TEXT }}>
                                    Contact Info
                                </h3>
                                
                                <div className="space-y-4">
                                    <a 
                                        href="mailto:hello@studioph.com"
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-opacity-10 transition-colors"
                                        style={{ backgroundColor: 'transparent' }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = `${ACCENT}10`}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                    >
                                        <FiMail size={18} style={{ color: ACCENT }} />
                                        <div>
                                            <div className="font-medium" style={{ color: TEXT }}>Email</div>
                                            <div className="text-sm" style={{ color: MUTED }}>hello@studioph.com</div>
                                        </div>
                                    </a>

                                    <a 
                                        href="tel:+15551234567"
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-opacity-10 transition-colors"
                                        style={{ backgroundColor: 'transparent' }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = `${ACCENT}10`}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                    >
                                        <FiPhone size={18} style={{ color: ACCENT }} />
                                        <div>
                                            <div className="font-medium" style={{ color: TEXT }}>Phone</div>
                                            <div className="text-sm" style={{ color: MUTED }}>+212-66666666</div>
                                        </div>
                                    </a>

                                    <div className="flex items-center gap-3 p-3">
                                        <FiMapPin size={18} style={{ color: ACCENT }} />
                                        <div>
                                            <div className="font-medium" style={{ color: TEXT }}>Location</div>
                                            <div className="text-sm" style={{ color: MUTED }}>Rabat, MA</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div 
                                className="rounded-xl p-6 border"
                                style={{ 
                                    backgroundColor: CARD,
                                    borderColor: `${ACCENT}30`
                                }}
                            >
                                <h3 className="text-xl font-semibold mb-4" style={{ color: TEXT }}>
                                    Follow Us
                                </h3>
                                
                                <div className="flex gap-3">
                                    {[
                                        { icon: FiInstagram, href: "#" },
                                        { icon: FiFacebook, href: "#" },
                                        { icon: FiTwitter, href: "#" },
                                        { icon: FiLinkedin, href: "#" }
                                    ].map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.href}
                                            className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                                            style={{ backgroundColor: `${ACCENT}20` }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = `${ACCENT}40`}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = `${ACCENT}20`}
                                        >
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
}

export default Contact;
