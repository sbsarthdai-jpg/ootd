import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Banner from './components/Banner.jsx';
import OOTDGrid from './components/OOTDGrid.jsx';
import OutfitModal from './components/OutfitModal.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [viewCount, setViewCount] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    const saved = parseInt(localStorage.getItem('ootd_view_count') || '0', 10);
    setViewCount(saved);
  }, []);

  const handleSelectOutfit = (outfit) => {
    setSelectedOutfit(outfit);
    const next = viewCount + 1;
    setViewCount(next);
    localStorage.setItem('ootd_view_count', String(next));
  };

  const handleUploadDone = (url) => {
    setUploadedImages(prev => [...prev, url]);
  };

  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}

      <div style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease', pointerEvents: loading ? 'none' : 'auto' }}>
        <Nav />
        <Hero onUploadDone={handleUploadDone} />
        <Banner uploadedImages={uploadedImages} />
        <OOTDGrid onSelectOutfit={handleSelectOutfit} />
        <Footer viewCount={viewCount} />
      </div>

      {selectedOutfit && (
        <OutfitModal outfit={selectedOutfit} onClose={() => setSelectedOutfit(null)} />
      )}
    </>
  );
}
