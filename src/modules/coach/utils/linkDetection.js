/**
 * Link Detection Utilities
 * Detekce typu služby podle URL a generování embed URL
 */

/**
 * Detekuje typ služby podle URL
 * @param {string} url - URL adresa
 * @returns {Object} - Objekt s informacemi o typu služby
 */
export const detectLinkType = (url) => {
  if (!url) return null;

  const lowerUrl = url.toLowerCase();

  // Google Drive
  if (lowerUrl.includes('drive.google.com') || lowerUrl.includes('docs.google.com')) {
    return {
      type: 'google-drive',
      icon: '📁',
      label: 'Google Drive',
      color: '#4285f4',
      embedSupport: true
    };
  }

  // iCloud
  if (lowerUrl.includes('icloud.com')) {
    return {
      type: 'icloud',
      icon: '☁️',
      label: 'iCloud',
      color: '#000000',
      embedSupport: false
    };
  }

  // YouTube
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    return {
      type: 'youtube',
      icon: '▶️',
      label: 'YouTube',
      color: '#ff0000',
      embedSupport: true
    };
  }

  // Vimeo
  if (lowerUrl.includes('vimeo.com')) {
    return {
      type: 'vimeo',
      icon: '🎬',
      label: 'Vimeo',
      color: '#1ab7ea',
      embedSupport: true
    };
  }

  // Dropbox
  if (lowerUrl.includes('dropbox.com')) {
    return {
      type: 'dropbox',
      icon: '📦',
      label: 'Dropbox',
      color: '#0061ff',
      embedSupport: false
    };
  }

  // OneDrive
  if (lowerUrl.includes('onedrive.live.com') || lowerUrl.includes('1drv.ms')) {
    return {
      type: 'onedrive',
      icon: '☁️',
      label: 'OneDrive',
      color: '#0078d4',
      embedSupport: false
    };
  }

  // Spotify
  if (lowerUrl.includes('spotify.com') || lowerUrl.includes('open.spotify.com')) {
    return {
      type: 'spotify',
      icon: '🎵',
      label: 'Spotify',
      color: '#1db954',
      embedSupport: true
    };
  }

  // SoundCloud
  if (lowerUrl.includes('soundcloud.com')) {
    return {
      type: 'soundcloud',
      icon: '🔊',
      label: 'SoundCloud',
      color: '#ff5500',
      embedSupport: true
    };
  }

  // Canva
  if (lowerUrl.includes('canva.com')) {
    return {
      type: 'canva',
      icon: '🎨',
      label: 'Canva',
      color: '#00c4cc',
      embedSupport: false
    };
  }

  // Notion
  if (lowerUrl.includes('notion.so') || lowerUrl.includes('notion.site')) {
    return {
      type: 'notion',
      icon: '📝',
      label: 'Notion',
      color: '#000000',
      embedSupport: false
    };
  }

  // Instagram
  if (lowerUrl.includes('instagram.com')) {
    return {
      type: 'instagram',
      icon: '📷',
      label: 'Instagram',
      color: '#e4405f',
      embedSupport: true
    };
  }

  // Generic fallback
  return {
    type: 'generic',
    icon: '🔗',
    label: 'Webový odkaz',
    color: '#757575',
    embedSupport: false
  };
};

/**
 * Vygeneruje embed URL pro podporované služby
 * @param {string} url - Původní URL
 * @param {string} linkType - Typ služby (youtube, vimeo, spotify...)
 * @returns {string|null} - Embed URL nebo null
 */
export const getEmbedUrl = (url, linkType) => {
  if (!url) return null;

  switch (linkType) {
    case 'youtube': {
      // Podporuje youtube.com/watch?v=XXX, youtu.be/XXX, youtube.com/shorts/XXX
      const videoId = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\s?]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : null;
    }

    case 'vimeo': {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }

    case 'spotify': {
      // Podporuje track, playlist, album, episode, show
      const spotifyMatch = url.match(/spotify\.com\/(track|playlist|album|episode|show)\/([^?]+)/);
      if (spotifyMatch) {
        return `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}`;
      }
      return null;
    }

    case 'soundcloud': {
      // SoundCloud embed vyžaduje API - pro MVP použij přímý odkaz
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
    }

    case 'instagram': {
      // Instagram embed
      const postMatch = url.match(/instagram\.com\/(p|reel)\/([^/?]+)/);
      if (postMatch) {
        return `https://www.instagram.com/${postMatch[1]}/${postMatch[2]}/embed`;
      }
      return null;
    }

    case 'google-drive': {
      // Google Docs: https://docs.google.com/document/d/DOCUMENT_ID/edit → /preview
      const docMatch = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
      if (docMatch) {
        return `https://docs.google.com/document/d/${docMatch[1]}/preview`;
      }

      // Google Sheets: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit → /preview
      const sheetMatch = url.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
      if (sheetMatch) {
        return `https://docs.google.com/spreadsheets/d/${sheetMatch[1]}/preview`;
      }

      // Google Slides: https://docs.google.com/presentation/d/PRESENTATION_ID/edit → /preview
      const slideMatch = url.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/);
      if (slideMatch) {
        return `https://docs.google.com/presentation/d/${slideMatch[1]}/preview`;
      }

      // Google Drive files: https://drive.google.com/file/d/FILE_ID/view → /preview
      const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (driveMatch) {
        return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
      }

      return null;
    }

    default:
      return null;
  }
};

/**
 * Validace URL
 * @param {string} string - Řetězec k ověření
 * @returns {boolean} - True pokud je URL platná
 */
export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Získá náhledový obrázek (thumbnail) pro podporované služby
 * @param {string} url - URL adresa
 * @param {string} linkType - Typ služby
 * @returns {string|null} - URL náhledového obrázku nebo null
 */
export const getThumbnailUrl = (url, linkType) => {
  switch (linkType) {
    case 'youtube': {
      // Podporuje youtube.com/watch?v=XXX, youtu.be/XXX, youtube.com/shorts/XXX
      const videoId = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\s?]+)/)?.[1];
      return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
    }

    case 'vimeo': {
      // Vimeo vyžaduje API call - pro MVP vynecháme
      return null;
    }

    default:
      return null;
  }
};

/**
 * Parsuje ISO 8601 duration (PT1H2M10S) na sekundy
 */
const parseISO8601Duration = (duration) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;

  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);

  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Získá metadata pro YouTube video (délka, název)
 * Pokud je nastaven VITE_YOUTUBE_API_KEY, použije YouTube Data API v3
 * Jinak použije pouze oEmbed API (bez délky videa)
 * @param {string} url - YouTube URL
 * @returns {Promise<{duration: number|null, title: string|null}>}
 */
export const getYouTubeMetadata = async (url) => {
  try {
    // Extrahuj video ID
    const videoId = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\s?]+)/)?.[1];
    if (!videoId) {
      return { duration: null, title: null };
    }

    // Zkus YouTube Data API v3 pokud je API klíč
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    if (apiKey && apiKey !== 'your-youtube-api-key-here') {
      try {
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoId}&key=${apiKey}`;
        const apiResponse = await fetch(apiUrl);

        if (apiResponse.ok) {
          const apiData = await apiResponse.json();
          if (apiData.items && apiData.items.length > 0) {
            const video = apiData.items[0];
            const duration = parseISO8601Duration(video.contentDetails.duration);

            return {
              duration: duration,
              title: video.snippet.title || null
            };
          }
        }
      } catch (error) {
        console.warn('YouTube Data API failed, falling back to oEmbed:', error);
      }
    }

    // Fallback na oEmbed API (bez duration)
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const response = await fetch(oembedUrl);

    if (!response.ok) {
      return { duration: null, title: null };
    }

    const data = await response.json();

    return {
      duration: null, // oEmbed neobsahuje duration
      title: data.title || null
    };
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    return { duration: null, title: null };
  }
};
