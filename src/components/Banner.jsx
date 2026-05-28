import { useState, useEffect, useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { supabase } from '../lib/supabase.js';

const BASE = import.meta.env.BASE_URL;

const BANNER_IMAGES = Array.from({ length: 12 }, (_, i) =>
  `${BASE}images/${i === 0 ? '베너1.avif' : `베너${i + 1}.jpg`}`
);

const Prev = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg>;
const Next = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>;
const Plus = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
const Check = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>;

export default function Banner({ uploadedImages = [] }) {
  const [slides, setSlides] = useState(BANNER_IMAGES);
  const [cur, setCur] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef(null);
  const fileRef = useRef(null);
  const dragX = useRef(0);

  const reset = useCallback((len) => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setCur(c => (c + 1) % (len ?? slides.length)), 4500);
  }, [slides.length]);

  useEffect(() => { reset(); return () => clearInterval(timer.current); }, [reset]);

  useEffect(() => {
    if (uploadedImages.length) {
      setSlides([...BANNER_IMAGES, ...uploadedImages]);
    }
  }, [uploadedImages]);

  const go = (d) => { setCur(c => (c + d + slides.length) % slides.length); reset(); };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = `banner/${Date.now()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('ootd-images').upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from('ootd-images').getPublicUrl(path);
      await supabase.from('ootd_uploads').insert({ image_url: data.publicUrl });
      const next = [...slides, data.publicUrl];
      setSlides(next); setCur(next.length - 1); reset(next.length);
      setDone(true); setTimeout(() => setDone(false), 2500);
    } catch (err) { console.error(err); }
    finally { setUploading(false); e.target.value = ''; }
  };

  return (
    <Box component="section" sx={{
      position: 'relative', width: '100%', height: '100svh',
      overflow: 'hidden', bgcolor: '#0A0A0A', userSelect: 'none',
    }}
      onMouseDown={e => { dragX.current = e.clientX; }}
      onMouseUp={e => { const d = dragX.current - e.clientX; if (Math.abs(d) > 50) go(d > 0 ? 1 : -1); }}
      onTouchStart={e => { dragX.current = e.touches[0].clientX; }}
      onTouchEnd={e => { const d = dragX.current - e.changedTouches[0].clientX; if (Math.abs(d) > 50) go(d > 0 ? 1 : -1); }}
    >
      {/* Slides */}
      {slides.map((src, i) => (
        <Box key={src} component="img" src={src} alt="" sx={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', pointerEvents: 'none',
          opacity: i === cur ? 1 : 0, transition: 'opacity 1.2s ease',
        }} />
      ))}

      {/* Gradient overlay */}
      <Box sx={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 100%)',
      }} />

      {/* Top bar */}
      <Box sx={{ position: 'absolute', top: 28, left: 36, right: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 500, fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>
          My Wardrobe
        </Box>
        <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 500, fontSize: '0.6rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.5)' }}>
          {String(cur + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </Box>
      </Box>

      {/* Bottom headline */}
      <Box sx={{ position: 'absolute', bottom: 88, left: 36 }}>
        <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 800, fontSize: { xs: '2.5rem', md: '4.5rem' }, letterSpacing: '-0.04em', lineHeight: 0.95, color: '#fff', maxWidth: 680 }}>
          On-trend looks.<br />
          <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 300 }}>Made by you.</Box>
        </Box>
      </Box>

      {/* Upload button — center */}
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
        <Box onClick={() => !uploading && fileRef.current?.click()} sx={{
          width: 68, height: 68, borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.7)',
          bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', cursor: 'pointer',
          transition: 'all 0.25s', '&:hover': { bgcolor: '#FF5D26', borderColor: '#FF5D26', transform: 'scale(1.1)' },
        }}>
          {uploading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : done ? <Check /> : <Plus />}
        </Box>
        <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 600, fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>
          {done ? 'Uploaded' : 'Add Photo'}
        </Box>
      </Box>

      {/* Arrows */}
      {[[-1, 'left', 20], [1, 'right', 20]].map(([dir, side, pos]) => (
        <Box key={side} onClick={e => { e.stopPropagation(); go(dir); }}
          sx={{
            position: 'absolute', [side]: pos, top: '50%', transform: 'translateY(-50%)',
            color: 'rgba(255,255,255,0.7)', cursor: 'pointer', p: 1,
            '&:hover': { color: '#fff' }, transition: 'color 0.2s',
          }}>
          {dir === -1 ? <Prev /> : <Next />}
        </Box>
      ))}

      {/* Dots */}
      <Box sx={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
        {slides.map((_, i) => (
          <Box key={i} onClick={() => { setCur(i); reset(); }}
            sx={{
              height: 4, borderRadius: 2, cursor: 'pointer',
              width: i === cur ? 22 : 4,
              bgcolor: i === cur ? '#fff' : 'rgba(255,255,255,0.35)',
              transition: 'all 0.35s ease',
            }} />
        ))}
      </Box>
    </Box>
  );
}
