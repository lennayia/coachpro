const InstagramLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="instagramGradient" cx="35%" cy="100%" r="100%">
        <stop offset="0%" stopColor="#FFD521"/>
        <stop offset="5%" stopColor="#FFD521"/>
        <stop offset="50%" stopColor="#F50000"/>
        <stop offset="95%" stopColor="#B900B4"/>
      </radialGradient>
    </defs>
    <rect width="24" height="24" rx="5.4" fill="url(#instagramGradient)"/>
    <path d="M12 7.8c-2.3 0-4.2 1.9-4.2 4.2s1.9 4.2 4.2 4.2 4.2-1.9 4.2-4.2-1.9-4.2-4.2-4.2zm0 6.9c-1.5 0-2.7-1.2-2.7-2.7s1.2-2.7 2.7-2.7 2.7 1.2 2.7 2.7-1.2 2.7-2.7 2.7z" fill="white"/>
    <circle cx="16.4" cy="7.6" r="1" fill="white"/>
    <path d="M16.9 3.3h-9.8C4.8 3.3 3 5.1 3 7.4v9.2c0 2.3 1.8 4.1 4.1 4.1h9.8c2.3 0 4.1-1.8 4.1-4.1V7.4c0-2.3-1.8-4.1-4.1-4.1zm2.6 13.3c0 1.4-1.2 2.6-2.6 2.6h-9.8c-1.4 0-2.6-1.2-2.6-2.6V7.4c0-1.4 1.2-2.6 2.6-2.6h9.8c1.4 0 2.6 1.2 2.6 2.6v9.2z" fill="white"/>
  </svg>
);

export default InstagramLogo;
