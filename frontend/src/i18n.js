import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const storedLang = typeof window !== 'undefined' ? (localStorage.getItem('lang') || 'en') : 'en';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        gallery: 'Gallery',
        client: 'Client Area',
        about: 'About',
        contact: 'Contact',
        language: 'Language',
        english: 'English',
        french: 'Français'
      },
      aboutPage: {
        heroTag: 'About StudioPH',
        heroTitle: 'Crafting Timeless Photography',
        heroSubtitle: 'We capture stories with an elegant, modern aesthetic. From weddings to portraits, our work blends artistry and precision.',
        exploreWork: 'Explore Our Work',
        ourStory: 'Our Story',
        storyP1: 'For over a decade, our team has been dedicated to telling authentic stories through powerful imagery. Every frame is thoughtfully composed to honor your moments.',
        storyP2: 'We combine technical excellence with a refined visual style to deliver photographs that feel both intimate and iconic.',
        feature1Title: 'Editorial-grade quality',
        feature1Desc: 'Clean, modern aesthetics with meticulous color and light.',
        feature2Title: 'Client-first collaboration',
        feature2Desc: 'Guided sessions tailored to your story and comfort.',
        feature3Title: 'Archival delivery',
        feature3Desc: 'High‑resolution, color‑managed files ready for print and web.',
        valuesTitle: 'What Guides Us',
        valuesSubtitle: 'Four pillars behind everything we create',
        pillarPassion: 'Passion',
        pillarPassionDesc: 'Real emotion, genuine storytelling, and a love for the craft.',
        pillarConnection: 'Connection',
        pillarConnectionDesc: 'We listen first to understand your story and vision.',
        pillarExcellence: 'Excellence',
        pillarExcellenceDesc: 'Quality that holds up today, tomorrow, and years from now.',
        pillarCraft: 'Craft',
        pillarCraftDesc: 'Thoughtful composition, lighting, and post-production.',
        ctaTitle: 'Ready to work together?',
        ctaSubtitle: 'Let’s bring your vision to life with a session tailored to you.',
        ctaButton: 'Book Your Session'
      },
      // Services under About page (EN)
      // Note: some projects have duplicate aboutPage blocks; ensure both include services keys
      aboutPageServices: {
        title: 'Our Photography Services',
        subtitle: 'Tailored experiences to capture every story beautifully',
        items: {
          weddingTitle: 'Weddings & Engagements',
          weddingDesc: 'Elegant storytelling from the "yes" to the "I do".',
          portraitsTitle: 'Portraits & Headshots',
          portraitsDesc: 'Clean, confident portraits for personal or professional use.',
          eventsTitle: 'Events & Celebrations',
          eventsDesc: 'From intimate gatherings to grand openings, we’ve got you covered.',
          fashionTitle: 'Fashion & Editorial',
          fashionDesc: 'Bold, creative visuals for brands and designers.',
          lifestyleTitle: 'Lifestyle & Family',
          lifestyleDesc: 'Natural moments captured with warmth and style.',
          productTitle: 'Product & Brand',
          productDesc: 'Crisp visuals that make your products shine.'
        },
        learnMore: 'Learn more'
      },
      home: {
        hero: {
          title1: "Capture Life's",
          title2: 'Beautiful Moments',
          subtitle: 'Professional photography services that tell your unique story through stunning visuals. From weddings to portraits, we create timeless memories that last forever.',
          explore: 'Explore Gallery',
          book: 'Book Session'
        },
        categories: {
          title: 'Discover by Category',
          browseAll: 'Browse all →',
          explore: 'Explore {{name}}',
          viewCollection: 'View Collection',
          loading: 'Loading categories...',
          failed: 'Failed to load categories. Please try again later.'
        },
        featured: {
          title: 'Featured Galleries',
          viewAll: 'View all →',
          loading: 'Loading featured galleries...',
          failed: 'Failed to load featured galleries. Please try again later.',
          empty: 'No featured galleries available at the moment.',
          viewGallery: 'View Gallery'
        },
        cta: {
          ready: 'Ready to get started?',
          letsCreate: "Let's Create Something",
          beautifulTogether: 'Beautiful Together',
          description: "Whether you're planning your dream wedding, need professional portraits, or want to capture special moments, we're here to bring your vision to life.",
          bookSession: 'Book Your Session',
          viewWork: 'View Our Work'
        }
      },
      gallery: {
        title: 'Gallery',
        subtitle: 'Discover stunning moments captured through our lens',
        all: 'All',
        loading: 'Loading gallery...',
        failedTitle: 'Failed to load gallery',
        failedHint: 'Please try refreshing the page',
        showing: 'Showing',
        of: 'of',
        photo: 'photo',
        photos: 'photos',
        noPhotos: 'No photos found',
        tryDifferent: 'Try selecting a different category'
      },
      client: {
        title: 'Client {{highlight}}',
        highlight: 'Galleries',
        description: 'Browse our client galleries. Each gallery is private and requires an access key provided by your photographer.',
        privateGalleryDesc: 'Private gallery. Enter your access key to view.',
        accessRequired: 'Access Required',
        enterKey: 'Enter access key',
        cancel: 'Cancel',
        accessGallery: 'Access Gallery',
        verifying: 'Verifying access key...',
        loading: 'Loading galleries...',
        yourCollection: 'Your Photo Collection',
        accessKeyRequired: 'Access Key Required'
      },
      contactPage: {
        heroTag: 'Let’s make something beautiful',
        title: 'Contact StudioPH',
        subtitleHero: 'Tell us about your session. We’ll reply within 24 hours and guide you from first idea to final delivery.',
        emailCta: 'Email the Photographer',
        callNow: 'Call Now',
        startInquiry: 'Start your inquiry',
        shareDetails: 'Share a few details and we’ll respond within 24 hours.',
        sentTitle: 'Message Sent!',
        sentThanks: 'Thanks for reaching out. We’ll get back to you soon.',
        nameLabel: 'Name *',
        emailLabel: 'Email *',
        serviceLabel: 'Service',
        dateLabel: 'Preferred date',
        messageLabel: 'Message *',
        namePlaceholder: 'Your name',
        emailPlaceholder: 'your@email.com',
        messagePlaceholder: 'Tell us about your session, location, and timing...',
        selectService: 'Select service',
        service: {
          wedding: 'Wedding',
          portrait: 'Portrait',
          event: 'Event',
          fashion: 'Fashion',
          other: 'Other'
        },
        sendMessage: 'Send Message',
        sending: 'Sending...',
        reachPhotographer: 'Reach the photographer',
        email: 'Email',
        phone: 'Phone',
        location: 'Location',
        follow: 'Follow StudioPH',
        quickNote: 'Prefer email or phone? Use quick actions above — we usually reply within 24 hours.'
      }
    }
  },
  fr: {
    translation: {
      nav: {
        home: 'Accueil',
        gallery: 'Galerie',
        client: 'Espace Client',
        about: 'À propos',
        contact: 'Contact',
        language: 'Langue',
        english: 'Anglais',
        french: 'Français'
      },
      home: {
        hero: {
          title1: 'Immortalisez',
          title2: 'Vos Plus Beaux Moments',
          subtitle: 'Des services photographiques professionnels qui racontent votre histoire à travers des visuels saisissants. Mariages, portraits, nous créons des souvenirs intemporels.',
          explore: 'Découvrir la Galerie',
          book: 'Réserver une séance'
        },
        categories: {
          title: 'Découvrir par catégorie',
          browseAll: 'Voir tout →',
          explore: 'Explorer {{name}}',
          viewCollection: 'Voir la collection',
          loading: 'Chargement des catégories...',
          failed: 'Échec du chargement des catégories. Veuillez réessayer plus tard.'
        },
        featured: {
          title: 'Galeries à la une',
          viewAll: 'Tout voir →',
          loading: 'Chargement des galeries...',
          failed: "Échec du chargement des galeries. Veuillez réessayer plus tard.",
          empty: 'Aucune galerie disponible pour le moment.',
          viewGallery: 'Voir la Galerie'
        },
        cta: {
          ready: 'Prêt à commencer ?',
          letsCreate: 'Créons',
          beautifulTogether: 'Quelque Chose de Beau',
          description: "Que vous planifiez votre mariage, souhaitiez des portraits professionnels ou capturiez des moments uniques, nous donnons vie à votre vision.",
          bookSession: 'Réserver une séance',
          viewWork: 'Voir nos réalisations'
        }
      },
      gallery: {
        title: 'Galerie',
        subtitle: 'Découvrez des moments capturés par notre objectif',
        all: 'Tout',
        loading: 'Chargement de la galerie...',
        failedTitle: 'Impossible de charger la galerie',
        failedHint: 'Veuillez rafraîchir la page',
        showing: 'Affichage',
        of: 'sur',
        photo: 'photo',
        photos: 'photos',
        noPhotos: 'Aucune photo trouvée',
        tryDifferent: 'Essayez une autre catégorie'
      },
      client: {
        title: 'Galeries {{highlight}}',
        highlight: 'Clients',
        description: 'Parcourez nos galeries clients. Chaque galerie est privée et nécessite une clé d’accès fournie par votre photographe.',
        privateGalleryDesc: 'Galerie privée. Entrez votre clé d’accès pour voir.',
        accessRequired: 'Accès requis',
        enterKey: 'Entrer la clé d’accès',
        cancel: 'Annuler',
        accessGallery: 'Accéder à la galerie',
        verifying: 'Vérification de la clé...',
        loading: 'Chargement des galeries...',
        yourCollection: 'Votre collection de photos',
        accessKeyRequired: 'Clé d’accès requise'
      },
      aboutPage: {
        heroTag: 'À propos de StudioPH',
        heroTitle: 'Créer une Photographie Intemporelle',
        heroSubtitle: 'Nous capturons des histoires avec une esthétique élégante et moderne. Des mariages aux portraits, notre travail allie art et précision.',
        exploreWork: 'Découvrir Notre Travail',
        ourStory: 'Notre Histoire',
        storyP1: "Depuis plus d'une décennie, notre équipe se consacre à raconter des histoires authentiques à travers des images puissantes. Chaque cadre est soigneusement composé pour honorer vos moments.",
        storyP2: "Nous combinons l'excellence technique avec un style visuel raffiné pour livrer des photographies qui se sentent à la fois intimes et iconiques.",
        feature1Title: 'Qualité éditoriale',
        feature1Desc: 'Esthétique moderne et épurée avec couleurs et lumière méticuleuses.',
        feature2Title: 'Collaboration centrée client',
        feature2Desc: 'Séances guidées adaptées à votre histoire et votre confort.',
        feature3Title: "Livraison d'archives",
        feature3Desc: "Fichiers haute résolution, gestion des couleurs prêts pour l'impression et le web.",
        valuesTitle: 'Ce qui nous guide',
        valuesSubtitle: 'Quatre piliers derrière tout ce que nous créons',
        pillarPassion: 'Passion',
        pillarPassionDesc: 'Émotion réelle, narration authentique et amour du métier.',
        pillarConnection: 'Connexion',
        pillarConnectionDesc: "Nous écoutons d'abord pour comprendre votre histoire et votre vision.",
        pillarExcellence: 'Excellence',
        pillarExcellenceDesc: "Qualité qui tient aujourd'hui, demain et dans les années à venir.",
        pillarCraft: 'Artisanat',
        pillarCraftDesc: 'Composition réfléchie, éclairage et post-production.',
        ctaTitle: 'Prêt à travailler ensemble ?',
        ctaSubtitle: 'Donnons vie à votre vision avec une séance adaptée à vous.',
        ctaButton: 'Réserver Votre Séance'
      },
      aboutPageServices: {
        title: 'Nos Services Photographiques',
        subtitle: 'Expériences sur mesure pour capturer chaque histoire magnifiquement',
        items: {
          weddingTitle: 'Mariages & Fiançailles',
          weddingDesc: 'Narration élégante du "oui" au "je le veux".',
          portraitsTitle: 'Portraits & Photos de Profil',
          portraitsDesc: 'Portraits nets et confiants pour usage personnel ou professionnel.',
          eventsTitle: 'Événements & Célébrations',
          eventsDesc: 'Des rassemblements intimes aux grandes ouvertures, nous vous couvrons.',
          fashionTitle: 'Mode & Éditorial',
          fashionDesc: 'Visuels audacieux et créatifs pour marques et créateurs.',
          lifestyleTitle: 'Style de Vie & Famille',
          lifestyleDesc: 'Moments naturels capturés avec chaleur et style.',
          productTitle: 'Produit & Marque',
          productDesc: 'Visuels nets qui font briller vos produits.'
        },
        learnMore: 'En savoir plus'
      },
      contactPage: {
        heroTag: 'Créons quelque chose de beau',
        title: 'Contact StudioPH',
        subtitleHero: 'Parlez-nous de votre séance. Nous répondrons sous 24h et vous guiderons de la première idée à la livraison finale.',
        emailCta: 'Envoyer un email au photographe',
        callNow: 'Appeler maintenant',
        startInquiry: 'Commencer votre demande',
        shareDetails: 'Partagez quelques détails et nous répondrons sous 24h.',
        sentTitle: 'Message envoyé !',
        sentThanks: 'Merci pour votre message. Nous revenons vers vous très vite.',
        nameLabel: 'Nom *',
        emailLabel: 'Email *',
        serviceLabel: 'Service',
        dateLabel: 'Date souhaitée',
        messageLabel: 'Message *',
        namePlaceholder: 'Votre nom',
        emailPlaceholder: 'votre@email.com',
        messagePlaceholder: 'Parlez-nous de votre séance, lieu et timing...',
        selectService: 'Sélectionner un service',
        service: {
          wedding: 'Mariage',
          portrait: 'Portrait',
          event: 'Événement',
          fashion: 'Mode',
          other: 'Autre'
        },
        sendMessage: 'Envoyer le message',
        sending: 'Envoi...',
        reachPhotographer: 'Contacter le photographe',
        email: 'Email',
        phone: 'Téléphone',
        location: 'Localisation',
        follow: 'Suivre StudioPH',
        quickNote: "Vous préférez l'email ou le téléphone ? Utilisez les actions rapides ci-dessus — nous répondons généralement sous 24h."
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: storedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  });

export default i18n;


