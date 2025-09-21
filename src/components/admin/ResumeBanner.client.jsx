'use client';

import dynamic from 'next/dynamic';

const ResumeBanner = dynamic(() => import('./ResumeBanner.jsx'), { 
  ssr: false,
  loading: () => null 
});

export default ResumeBanner;
