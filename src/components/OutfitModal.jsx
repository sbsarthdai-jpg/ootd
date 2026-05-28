import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';

const Close = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>;
const Prev = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg>;
const Next = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>;

export default function OutfitModal({ outfit, onClose }) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') setActive(i => (i + 1) % outfit.shots.length);
      if (e.key === 'ArrowLeft') setActive(i => (i - 1 + outfit.shots.length) % outfit.shots.length);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { clearTimeout(t); window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [outfit.shots.length]);

  const close = () => { setVisible(false); setTimeout(onClose, 360); };

  return (
    <Box onClick={close} sx={{
      position: 'fixed', inset: 0, zIndex: 1300,
      bgcolor: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      p: { xs: 2, md: 4 },
      opacity: visible ? 1 : 0, transition: 'opacity 0.35s ease',
    }}>
      <Box onClick={e => e.stopPropagation()} sx={{
        bgcolor: '#fff', maxWidth: 1080, width: '100%', maxHeight: '92svh',
        overflowY: 'auto', position: 'relative',
        display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
        transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
      }}>

        {/* Close */}
        <Box onClick={close} sx={{
          position: 'absolute', top: 16, right: 16, zIndex: 10, cursor: 'pointer',
          width: 36, height: 36, bgcolor: '#0A0A0A', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'bgcolor 0.2s', '&:hover': { bgcolor: '#FF5D26' },
        }}><Close /></Box>

        {/* Left — Product */}
        <Box sx={{ bgcolor: '#F5F5F3', display: 'flex', flexDirection: 'column' }}>
          <Box component="img" src={outfit.mainImg} alt={outfit.title}
            sx={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }} />
          <Box sx={{ p: 3 }}>
            <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 500, fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#6B6B6B', mb: 0.8 }}>
              {outfit.tag} · {outfit.label}
            </Box>
            <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.02em', color: '#0A0A0A' }}>
              {outfit.title}
            </Box>
          </Box>
        </Box>

        {/* Right — Outfit shots */}
        <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 600, fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#6B6B6B', mb: 2.5 }}>
            Outfit Shots
          </Box>

          {/* Main shot */}
          <Box sx={{ position: 'relative', mb: 1.5 }}>
            <Box component="img" src={outfit.shots[active]} alt=""
              sx={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }} />
            {outfit.shots.length > 1 && (<>
              <Box onClick={() => setActive(i => (i - 1 + outfit.shots.length) % outfit.shots.length)}
                sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { bgcolor: '#fff' } }}>
                <Prev />
              </Box>
              <Box onClick={() => setActive(i => (i + 1) % outfit.shots.length)}
                sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { bgcolor: '#fff' } }}>
                <Next />
              </Box>
            </>)}
          </Box>

          {/* Thumbnails */}
          {outfit.shots.length > 1 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(outfit.shots.length, 4)}, 1fr)`, gap: '4px', mb: 2 }}>
              {outfit.shots.map((s, i) => (
                <Box key={i} component="img" src={s} alt="" onClick={() => setActive(i)}
                  sx={{
                    width: '100%', aspectRatio: '1', objectFit: 'cover', cursor: 'pointer',
                    opacity: i === active ? 1 : 0.42,
                    outline: i === active ? '2px solid #0A0A0A' : 'none', outlineOffset: '-2px',
                    transition: 'opacity 0.2s',
                  }} />
              ))}
            </Box>
          )}

          <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 400, fontSize: '0.6rem', color: '#BCBCBC', letterSpacing: '0.05em' }}>
            ← → to navigate · ESC to close
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
