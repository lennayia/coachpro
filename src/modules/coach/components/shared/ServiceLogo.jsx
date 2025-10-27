import YouTubeLogo from '../../../../assets/service-logos/YouTube';
import SpotifyLogo from '../../../../assets/service-logos/Spotify';
import VimeoLogo from '../../../../assets/service-logos/Vimeo';
import SoundCloudLogo from '../../../../assets/service-logos/SoundCloud';
import InstagramLogo from '../../../../assets/service-logos/Instagram';
import GoogleDriveLogo from '../../../../assets/service-logos/GoogleDrive';
import iCloudLogo from '../../../../assets/service-logos/iCloud';
import DropboxLogo from '../../../../assets/service-logos/Dropbox';
import OneDriveLogo from '../../../../assets/service-logos/OneDrive';
import CanvaLogo from '../../../../assets/service-logos/Canva';
import NotionLogo from '../../../../assets/service-logos/Notion';

/**
 * ServiceLogo - Zobrazí reálné vícebarevné SVG logo služby
 */
const ServiceLogo = ({ linkType, size = 24 }) => {
  switch (linkType) {
    case 'youtube':
      return <YouTubeLogo size={size} />;
    case 'spotify':
      return <SpotifyLogo size={size} />;
    case 'vimeo':
      return <VimeoLogo size={size} />;
    case 'soundcloud':
      return <SoundCloudLogo size={size} />;
    case 'instagram':
      return <InstagramLogo size={size} />;
    case 'google-drive':
      return <GoogleDriveLogo size={size} />;
    case 'icloud':
      return <iCloudLogo size={size} />;
    case 'dropbox':
      return <DropboxLogo size={size} />;
    case 'onedrive':
      return <OneDriveLogo size={size} />;
    case 'canva':
      return <CanvaLogo size={size} />;
    case 'notion':
      return <NotionLogo size={size} />;
    default:
      return null;
  }
};

export default ServiceLogo;
