const CanvaLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="canvaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00C4CC"/>
        <stop offset="100%" stopColor="#7D2AE8"/>
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="11" fill="url(#canvaGradient)"/>
    <path d="M15.5 9.5c-.8-.8-2-.8-2.8 0L11 11.2l-.7-.7c.4-.7.3-1.6-.3-2.2-.8-.8-2-.8-2.8 0-.8.8-.8 2 0 2.8.6.6 1.5.7 2.2.3l.7.7-1.7 1.7c-.8.8-.8 2 0 2.8.8.8 2 .8 2.8 0l4.3-4.3c.8-.8.8-2 0-2.8zm-8.3-.3c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4-.4.4-1 .4-1.4 0zm1.4 7c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l1.7-1.7 1.4 1.4-1.7 1.7zm7-4.2l-4.3 4.3c-.4.4-1 .4-1.4 0l2.1-2.1 3.6-3.6c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4z" fill="white"/>
  </svg>
);

export default CanvaLogo;
