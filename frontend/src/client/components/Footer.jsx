import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiInstagram,
  FiTwitter,
  FiFacebook,
  FiCamera,
} from "react-icons/fi";

const BG = "#0D0D0D";
const TEXT = "#FFFFFF";
const MUTED = "#B3B3B3";
const ACCENT = "#C5A46D";

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
      duration: 0.5,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export default function Footer() {
  return (
    <motion.footer 
      className="border-t border-white/10 mt-8" 
      style={{ backgroundColor: BG, color: TEXT }}
      variants={sectionVariants} 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8"
          variants={containerVariants}
        >
          <motion.div variants={fadeInUp}>
            <div className="flex items-center gap-2 mb-4">
              <FiCamera className="w-6 h-6" style={{ color: ACCENT }} />
              <span className="text-lg font-bold">StudioPH</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
              Professional photography studio capturing life's most precious moments with artistry and passion. Creating timeless memories that last forever.
            </p>
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link to="/" className="transition-colors hover:opacity-80" style={{ color: MUTED }}>Home</Link>
              <Link to="/gallery" className="transition-colors hover:opacity-80" style={{ color: MUTED }}>Gallery</Link>
              <Link to="/about" className="transition-colors hover:opacity-80" style={{ color: MUTED }}>About</Link>
              <Link to="/contact" className="transition-colors hover:opacity-80" style={{ color: MUTED }}>Contact</Link>
            </nav>
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex items-center gap-4 mb-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:scale-110" style={{ color: MUTED }}>
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:scale-110" style={{ color: MUTED }}>
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:scale-110" style={{ color: MUTED }}>
                <FiFacebook className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm" style={{ color: MUTED }}>
              Stay updated with our latest work and behind-the-scenes moments.
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4"
          variants={fadeInUp}
        >
          <div className="text-xs sm:text-sm" style={{ color: "#777" }}>
            © {new Date().getFullYear()} StudioPH. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs sm:text-sm" style={{ color: "#777" }}>
            <a href="#" className="hover:opacity-80 transition-opacity">Privacy Policy</a>
            <a href="#" className="hover:opacity-80 transition-opacity">Terms of Service</a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}