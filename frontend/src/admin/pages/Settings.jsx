import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSave, 
  FiUpload, 
  FiEye, 
  FiEyeOff, 
  FiInstagram, 
  FiFacebook, 
  FiTwitter, 
  FiLinkedin,
  FiGlobe,
  FiMail,
  FiPhone,
  FiMapPin,
  FiImage,
  FiSettings as FiSettingsIcon
} from 'react-icons/fi';
import toast from 'react-hot-toast';

// Using dashboard color scheme
const BG = "#F9FAFB"; // Light gray background
const TEXT = "#111827"; // Dark gray text
const MUTED = "#6B7280"; // Muted gray
const CARD = "#FFFFFF"; // White cards
const BORDER = "#E5E7EB"; // Light border
const ACCENT = "#3B82F6"; // Blue accent
const HOVER = "#2563EB"; // Darker blue on hover

const Settings = () => {
  const [activeTab, setActiveTab] = useState('business');
  const [loading, setLoading] = useState(false);
  
  // Business Profile State
  const [businessInfo, setBusinessInfo] = useState({
    studioName: 'StudioPH',
    tagline: 'Capturing Life\'s Beautiful Moments',
    description: 'Professional photography services for weddings, portraits, and events.',
    email: 'hello@studioph.com',
    phone: '+212-66666666',
    address: 'Rabat, MA',
    website: 'https://studioph.com'
  });

  // Social Media State
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    website: ''
  });

  // Watermark Settings State
  const [watermarkSettings, setWatermarkSettings] = useState({
    enabled: false,
    portfolioOnly: true, // Only apply to portfolio, not client spaces
    opacity: 0.3,
    position: 'bottom-right',
    size: 'medium',
    watermarkImage: null,
    watermarkText: 'StudioPH'
  });

  const tabs = [
    { id: 'business', label: 'Business Profile', icon: FiSettingsIcon },
    { id: 'social', label: 'Social Media', icon: FiInstagram },
    { id: 'watermark', label: 'Watermark', icon: FiImage }
  ];

  const handleBusinessInfoChange = (field, value) => {
    setBusinessInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialLinksChange = (platform, value) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }));
  };

  const handleWatermarkChange = (field, value) => {
    setWatermarkSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleWatermarkUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setWatermarkSettings(prev => ({ 
          ...prev, 
          watermarkImage: e.target.result 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSettings = async (section) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would make actual API calls to save settings
      // await api.updateBusinessInfo(businessInfo);
      // await api.updateSocialLinks(socialLinks);
      // await api.updateWatermarkSettings(watermarkSettings);
      
      toast.success(`${section} settings saved successfully!`);
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: BG, color: TEXT }} className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your studio settings and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Business Profile Tab */}
          {activeTab === 'business' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div 
                className="rounded-xl p-6 border"
                style={{ backgroundColor: CARD, borderColor: `${ACCENT}30` }}
              >
                <h3 className="text-xl font-semibold mb-6">Studio Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Studio Name</label>
                    <input
                      type="text"
                      value={businessInfo.studioName}
                      onChange={(e) => handleBusinessInfoChange('studioName', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border bg-transparent text-black focus:outline-none focus:border-opacity-80 transition-colors"
                      style={{ borderColor: `${ACCENT}40` }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tagline</label>
                    <input
                      type="text"
                      value={businessInfo.tagline}
                      onChange={(e) => handleBusinessInfoChange('tagline', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border bg-transparent text-black focus:outline-none focus:border-opacity-80 transition-colors"
                      style={{ borderColor: `${ACCENT}40` }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={businessInfo.description}
                      onChange={(e) => handleBusinessInfoChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border bg-transparent text-black focus:outline-none focus:border-opacity-80 transition-colors resize-none"
                      style={{ borderColor: `${ACCENT}40` }}
                    />
                  </div>
                </div>
              </div>

              <div 
                className="rounded-xl p-6 border"
                style={{ backgroundColor: CARD, borderColor: `${ACCENT}30` }}
              >
                <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <FiMail className="inline mr-2" size={16} />
                      Email
                    </label>
                    <input
                      type="email"
                      value={businessInfo.email}
                      onChange={(e) => handleBusinessInfoChange('email', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border bg-transparent text-black focus:outline-none focus:border-opacity-80 transition-colors"
                      style={{ borderColor: `${ACCENT}40` }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <FiPhone className="inline mr-2" size={16} />
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={businessInfo.phone}
                      onChange={(e) => handleBusinessInfoChange('phone', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border bg-transparent text-black focus:outline-none focus:border-opacity-80 transition-colors"
                      style={{ borderColor: `${ACCENT}40` }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <FiMapPin className="inline mr-2" size={16} />
                      Address
                    </label>
                    <input
                      type="text"
                      value={businessInfo.address}
                      onChange={(e) => handleBusinessInfoChange('address', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border bg-transparent text-black focus:outline-none focus:border-opacity-80 transition-colors"
                      style={{ borderColor: `${ACCENT}40` }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <FiGlobe className="inline mr-2" size={16} />
                      Website
                    </label>
                    <input
                      type="url"
                      value={businessInfo.website}
                      onChange={(e) => handleBusinessInfoChange('website', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border bg-transparent text-black focus:outline-none focus:border-opacity-80 transition-colors"
                      style={{ borderColor: `${ACCENT}40` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => saveSettings('Business Profile')}
                  disabled={loading}
                  className="w-full mt-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  style={{ backgroundColor: ACCENT, color: BG }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = HOVER}
                  onMouseLeave={(e) => e.target.style.backgroundColor = ACCENT}
                >
                  <FiSave size={16} />
                  {loading ? 'Saving...' : 'Save Business Info'}
                </button>
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="max-w-2xl">
              <div 
                className="rounded-xl p-6 border"
                style={{ backgroundColor: CARD, borderColor: `${ACCENT}30` }}
              >
                <h3 className="text-xl font-semibold mb-2">Social Media Links</h3>
                <p className="text-sm mb-6" style={{ color: MUTED }}>
                  These links will be displayed in your contact page and footer
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <FiInstagram className="inline mr-2" size={16} style={{ color: ACCENT }} />
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={socialLinks.instagram}
                      onChange={(e) => handleSocialLinksChange('instagram', e.target.value)}
                      placeholder="https://instagram.com/yourstudio"
                      className="w-full px-4 py-3 rounded-lg border bg-transparent text-black placeholder-gray-400 focus:outline-none focus:border-opacity-80 transition-colors"
                      style={{ borderColor: `${ACCENT}40` }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <FiFacebook className="inline mr-2" size={16} style={{ color: ACCENT }} />
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={socialLinks.facebook}
                      onChange={(e) => handleSocialLinksChange('facebook', e.target.value)}
                      placeholder="https://facebook.com/yourstudio"
                      className="w-full px-4 py-3 rounded-lg border bg-transparent text-black placeholder-gray-400 focus:outline-none focus:border-opacity-80 transition-colors"
                      style={{ borderColor: `${ACCENT}40` }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <FiTwitter className="inline mr-2" size={16} style={{ color: ACCENT }} />
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={socialLinks.twitter}
                      onChange={(e) => handleSocialLinksChange('twitter', e.target.value)}
                      placeholder="https://twitter.com/yourstudio"
                      className="w-full px-4 py-3 rounded-lg border bg-transparent text-black placeholder-gray-400 focus:outline-none focus:border-opacity-80 transition-colors"
                      style={{ borderColor: `${ACCENT}40` }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <FiLinkedin className="inline mr-2" size={16} style={{ color: ACCENT }} />
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={socialLinks.linkedin}
                      onChange={(e) => handleSocialLinksChange('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/company/yourstudio"
                      className="w-full px-4 py-3 rounded-lg border bg-transparent text-black placeholder-gray-400 focus:outline-none focus:border-opacity-80 transition-colors"
                      style={{ borderColor: `${ACCENT}40` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => saveSettings('Social Media')}
                  disabled={loading}
                  className="w-full mt-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  style={{ backgroundColor: ACCENT, color: BG }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = HOVER}
                  onMouseLeave={(e) => e.target.style.backgroundColor = ACCENT}
                >
                  <FiSave size={16} />
                  {loading ? 'Saving...' : 'Save Social Links'}
                </button>
              </div>
            </div>
          )}

          {/* Watermark Tab */}
          {activeTab === 'watermark' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div 
                className="rounded-xl p-6 border"
                style={{ backgroundColor: CARD, borderColor: `${ACCENT}30` }}
              >
                <h3 className="text-xl font-semibold mb-2">Watermark Settings</h3>
                <p className="text-sm mb-6" style={{ color: MUTED }}>
                  Apply watermarks to portfolio images only (not client spaces)
                </p>
                
                <div className="space-y-6">
                  {/* Enable Watermark */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Enable Watermark</label>
                      <p className="text-xs mt-1" style={{ color: MUTED }}>
                        Add watermark to portfolio images
                      </p>
                    </div>
                    <button
                      onClick={() => handleWatermarkChange('enabled', !watermarkSettings.enabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        watermarkSettings.enabled ? 'bg-green-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          watermarkSettings.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Portfolio Only */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Portfolio Images Only</label>
                      <p className="text-xs mt-1" style={{ color: MUTED }}>
                        Don't apply to client space images
                      </p>
                    </div>
                    <button
                      onClick={() => handleWatermarkChange('portfolioOnly', !watermarkSettings.portfolioOnly)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        watermarkSettings.portfolioOnly ? 'bg-green-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          watermarkSettings.portfolioOnly ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {watermarkSettings.enabled && (
                    <>
                      {/* Watermark Text */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Watermark Text</label>
                        <input
                          type="text"
                          value={watermarkSettings.watermarkText}
                          onChange={(e) => handleWatermarkChange('watermarkText', e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border bg-transparent text-black focus:outline-none focus:border-opacity-80 transition-colors"
                          style={{ borderColor: `${ACCENT}40` }}
                        />
                      </div>

                      {/* Upload Watermark Image */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Watermark Image</label>
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleWatermarkUpload}
                            className="hidden"
                            id="watermark-upload"
                          />
                          <label
                            htmlFor="watermark-upload"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer hover:bg-opacity-10 transition-colors"
                            style={{ borderColor: `${ACCENT}40` }}
                          >
                            <FiUpload size={16} />
                            Upload Image
                          </label>
                          {watermarkSettings.watermarkImage && (
                            <img
                              src={watermarkSettings.watermarkImage}
                              alt="Watermark preview"
                              className="w-12 h-12 object-contain rounded border"
                              style={{ borderColor: `${ACCENT}40` }}
                            />
                          )}
                        </div>
                      </div>

                      {/* Position */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Position</label>
                        <select
                          value={watermarkSettings.position}
                          onChange={(e) => handleWatermarkChange('position', e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border bg-transparent text-black focus:outline-none focus:border-opacity-80 transition-colors"
                          style={{ borderColor: `${ACCENT}40`, backgroundColor: CARD }}
                        >
                          <option value="top-left" style={{ backgroundColor: CARD }}>Top Left</option>
                          <option value="top-right" style={{ backgroundColor: CARD }}>Top Right</option>
                          <option value="bottom-left" style={{ backgroundColor: CARD }}>Bottom Left</option>
                          <option value="bottom-right" style={{ backgroundColor: CARD }}>Bottom Right</option>
                          <option value="center" style={{ backgroundColor: CARD }}>Center</option>
                        </select>
                      </div>

                      {/* Opacity */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Opacity ({Math.round(watermarkSettings.opacity * 100)}%)
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.1"
                          value={watermarkSettings.opacity}
                          onChange={(e) => handleWatermarkChange('opacity', parseFloat(e.target.value))}
                          className="w-full"
                          style={{ accentColor: ACCENT }}
                        />
                      </div>

                      {/* Size */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Size</label>
                        <select
                          value={watermarkSettings.size}
                          onChange={(e) => handleWatermarkChange('size', e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border bg-transparent text-white focus:outline-none focus:border-opacity-80 transition-colors"
                          style={{ borderColor: `${ACCENT}40`, backgroundColor: CARD }}
                        >
                          <option value="small" style={{ backgroundColor: CARD }}>Small</option>
                          <option value="medium" style={{ backgroundColor: CARD }}>Medium</option>
                          <option value="large" style={{ backgroundColor: CARD }}>Large</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={() => saveSettings('Watermark')}
                  disabled={loading}
                  className="w-full mt-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  style={{ backgroundColor: ACCENT, color: BG }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = HOVER}
                  onMouseLeave={(e) => e.target.style.backgroundColor = ACCENT}
                >
                  <FiSave size={16} />
                  {loading ? 'Saving...' : 'Save Watermark Settings'}
                </button>
              </div>

              {/* Preview */}
              <div 
                className="rounded-xl p-6 border"
                style={{ backgroundColor: CARD, borderColor: `${ACCENT}30` }}
              >
                <h3 className="text-xl font-semibold mb-4">Preview</h3>
                <div className="relative bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
                  <span className="text-gray-400">Sample Image</span>
                  {watermarkSettings.enabled && (
                    <div
                      className={`absolute text-white font-semibold ${
                        watermarkSettings.position === 'top-left' ? 'top-4 left-4' :
                        watermarkSettings.position === 'top-right' ? 'top-4 right-4' :
                        watermarkSettings.position === 'bottom-left' ? 'bottom-4 left-4' :
                        watermarkSettings.position === 'bottom-right' ? 'bottom-4 right-4' :
                        'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                      } ${
                        watermarkSettings.size === 'small' ? 'text-xs' :
                        watermarkSettings.size === 'medium' ? 'text-sm' :
                        'text-base'
                      }`}
                      style={{ opacity: watermarkSettings.opacity }}
                    >
                      {watermarkSettings.watermarkImage ? (
                        <img
                          src={watermarkSettings.watermarkImage}
                          alt="Watermark"
                          className={`${
                            watermarkSettings.size === 'small' ? 'w-8 h-8' :
                            watermarkSettings.size === 'medium' ? 'w-12 h-12' :
                            'w-16 h-16'
                          } object-contain`}
                        />
                      ) : (
                        watermarkSettings.watermarkText
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: `${ACCENT}10` }}>
                  <p className="text-sm font-medium mb-2" style={{ color: ACCENT }}>
                    Watermark Application:
                  </p>
                  <ul className="text-sm space-y-1" style={{ color: MUTED }}>
                    <li>✓ Portfolio images (public gallery)</li>
                    <li>✗ Client space images (private)</li>
                    <li>✓ Protects your work from unauthorized use</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
