const OneDriveLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="oneDriveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0364B8"/>
        <stop offset="100%" stopColor="#0078D4"/>
      </linearGradient>
      <linearGradient id="oneDriveGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0078D4"/>
        <stop offset="100%" stopColor="#1490DF"/>
      </linearGradient>
    </defs>
    <path d="M9.066 5.562c-.585.042-1.14.15-1.663.312l7.293 5.124 5.345-3.757c-1.044-1.644-2.88-2.74-4.978-2.74-1.53 0-2.91.588-3.948 1.545a6.554 6.554 0 0 0-2.049-.484z" fill="url(#oneDriveGradient1)"/>
    <path d="M14.893 8.241L7.403 5.874A6.625 6.625 0 0 0 2.5 12c0 .72.115 1.413.327 2.062l9.066 1.296 8.148-5.726a6.585 6.585 0 0 0-5.148-1.391z" fill="url(#oneDriveGradient2)"/>
    <path d="M11.893 15.358L2.827 14.062A6.558 6.558 0 0 0 9 19.5c1.623 0 3.113-.59 4.263-1.566l6.778-4.762-8.148 2.186z" fill="#28A8EA"/>
    <path d="M20.041 13.172l-6.778 4.762A6.542 6.542 0 0 0 15.5 13c0-.718-.116-1.41-.327-2.059l-3.28-.583 8.148 2.814z" fill="#0078D4"/>
    <path d="M14.893 10.358l-3.28-.583-9.066-1.296A6.558 6.558 0 0 0 2.5 12c0 .72.115 1.413.327 2.062l9.066 1.296 3.28-.583c-.211-.649-.327-1.341-.327-2.059 0-.718.116-1.41.327-2.059l-.28-.299z" opacity=".5" fill="#0364B8"/>
    <path d="M20.041 9.515l-5.345 3.757.197.086c.211.649.327 1.341.327 2.059s-.116 1.41-.327 2.059l-.197.086 6.778-4.762a6.59 6.59 0 0 0-1.433-3.285z" fill="#0078D4" opacity=".8"/>
  </svg>
);

export default OneDriveLogo;
