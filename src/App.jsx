import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen.jsx';
import Banner from './components/Banner.jsx';
import OOTDGrid from './components/OOTDGrid.jsx';
import OutfitModal from './components/OutfitModal.jsx';
import Footer from './components/Footer.jsx';

function App() {
  const [loading, setLoading] = useState(true);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    const saved = parseInt(localStorage.getItem('ootd_view_count') || '0', 10);
    setViewCount(saved);
  }, []);

  const handleDone = () => setLoading(false);

  const handleSelectOutfit = (outfit) => {
    setSelectedOutfit(outfit);
    const next = viewCount + 1;
    setViewCount(next);
    localStorage.setItem('ootd_view_count', String(next));
  };

  return (
    <>
      {loading && <LoadingScreen onDone={handleDone} />}

      <div
        style={{
          opacity: loading ? 0 : 1,
          pointerEvents: loading ? 'none' : 'auto',
          transition: 'opacity 0.6s ease',
        }}
      >
        <Banner />
        <OOTDGrid onSelectOutfit={handleSelectOutfit} />
        <Footer viewCount={viewCount} />
      </div>

      {selectedOutfit && (
        <OutfitModal outfit={selectedOutfit} onClose={() => setSelectedOutfit(null)} />
      )}
    </>
  );
}

export default App;
