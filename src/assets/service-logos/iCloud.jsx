const iCloudLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="iCloudGradient" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#35C1F1"/>
        <stop offset="50%" stopColor="#1E8BD8"/>
        <stop offset="100%" stopColor="#0E5A9E"/>
      </linearGradient>
    </defs>
    <path d="M19.4 9.7c-.3 0-.6 0-.9.1C17.8 6.5 15.1 4 11.8 4 8.2 4 5.2 6.7 4.7 10.2c-2 .5-3.5 2.3-3.5 4.5C1.2 17.5 3.4 20 6 20h13c2.8 0 5-2.2 5-5s-2.2-5-4.6-5.3zM19 18H6c-1.7 0-3-1.3-3-3s1.3-3 3-3c.2 0 .5 0 .7.1.5-3.1 3.2-5.4 6.4-5.4 3.6 0 6.5 2.9 6.5 6.5v.3c1.6.1 2.9 1.5 2.9 3.1.1 1.8-1.4 3.4-3.5 3.4z" fill="url(#iCloudGradient)"/>
  </svg>
);

export default iCloudLogo;
