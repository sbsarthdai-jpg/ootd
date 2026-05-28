import { useState, useEffect, useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import { supabase } from '../lib/supabase.js';

const BASE = import.meta.env.BASE_URL;

const BANNER_IMAGES = [
  `${BASE}images/베너1.avif`,
  `${BASE}images/베너2.jpg`,
  `${BASE}images/베너3.jpg`,
  `${BASE}images/베너4.jpg`,
  `${BASE}images/베너5.jpg`,
  `${BASE}images/베너6.jpg`,
  `${BASE}images/베너7.jpg`,
  `${BASE}images/베너8.jpg`,
  `${BASE}images/베너9.jpg`,
  `${BASE}images/베너10.jpg`,
  `${BASE}images/베너11.jpg`,
  `${BASE}images/베너12.jpg`,
];

const ArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
  </svg>
);

const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
  </svg>
);

const UploadIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
    <path d="M13 7h-2v2H9v2h2v2h2v-2h2V9h-2z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

export default function Banner() {
  const [current, setCurrent] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [slides, setSlides] = useState(BANNER_IMAGES);
  const dragStartX = useRef(0);
  const dragging = useRef(false);
  const fileRef = useRef(null);
  const timerRef = useRef(null);

  const startTimer = useCallback((len) => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % (len || slides.length));
    }, 4000);
  }, [slides.length]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('ootd_uploads').select('image_url');
      if (data && data.length > 0) {
        const urls = data.map((r) => r.image_url).filter(Boolean);
        setSlides([...BANNER_IMAGES, ...urls]);
      }
    })();
  }, []);

  const go = (dir) => {
    setCurrent((c) => (c + dir + slides.length) % slides.length);
    startTimer();
  };

  const handlePointerDown = (e) => {
    dragStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
    dragging.current = true;
  };

  const handlePointerUp = (e) => {
    if (!dragging.current) return;
    const endX = e.touches ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStartX.current - endX;
    if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
    dragging.current = false;
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `banner/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('ootd-images').upload(path, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('ootd-images').getPublicUrl(path);
      const publicUrl = urlData.publicUrl;
      await supabase.from('ootd_uploads').insert({ image_url: publicUrl });
      const next = [...slides, publicUrl];
      setSlides(next);
      setCurrent(next.length - 1);
      setUploadDone(true);
      setTimeout(() => setUploadDone(false), 2500);
    } catch (err) {
      console.error('업로드 실패:', err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        overflow: 'hidden',
        bgcolor: '#0D0D0D',
        userSelect: 'none',
      }}
      onMouseDown={handlePointerDown}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchEnd={handlePointerUp}
    >
      {slides.map((src, i) => (
        <Box
          key={src}
          component="img"
          src={src}
          alt={`banner ${i + 1}`}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: i === current ? 1 : 0,
            transition: 'opacity 1s ease',
            pointerEvents: 'none',
          }}
        />
      ))}

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* 상단 레이블 */}
      <Box sx={{ position: 'absolute', top: 28, left: 32 }}>
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.65rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            fontFamily: '"Inter", sans-serif',
          }}
        >
          My Wardrobe
        </Typography>
      </Box>

      <Box sx={{ position: 'absolute', top: 28, right: 32 }}>
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            fontFamily: '"Inter", sans-serif',
          }}
        >
          {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </Typography>
      </Box>

      {/* 하단 텍스트 */}
      <Box sx={{ position: 'absolute', bottom: 80, left: 32, right: 32 }}>
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: { xs: '2.8rem', md: '5rem' },
            fontWeight: 300,
            color: '#FAFAF8',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            maxWidth: 680,
          }}
        >
          나만의 스타일,
          <br />
          오늘의 코디.
        </Typography>
      </Box>

      {/* 업로드 버튼 (중앙) */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
        <Box
          onClick={() => !uploading && fileRef.current?.click()}
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.6)',
            backdropFilter: 'blur(8px)',
            bgcolor: 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.22)',
              transform: 'scale(1.08)',
            },
          }}
        >
          {uploading ? (
            <CircularProgress size={24} sx={{ color: '#fff' }} />
          ) : uploadDone ? (
            <CheckIcon />
          ) : (
            <UploadIcon />
          )}
        </Box>
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.6rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontFamily: '"Inter", sans-serif',
          }}
        >
          {uploadDone ? '업로드 완료' : '이미지 추가'}
        </Typography>
      </Box>

      {/* 화살표 */}
      <IconButton
        onClick={(e) => { e.stopPropagation(); go(-1); }}
        sx={{
          position: 'absolute',
          left: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'rgba(255,255,255,0.75)',
          '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.12)' },
        }}
      >
        <ArrowLeft />
      </IconButton>

      <IconButton
        onClick={(e) => { e.stopPropagation(); go(1); }}
        sx={{
          position: 'absolute',
          right: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'rgba(255,255,255,0.75)',
          '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.12)' },
        }}
      >
        <ArrowRight />
      </IconButton>

      {/* 도트 인디케이터 */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '6px',
        }}
      >
        {slides.map((_, i) => (
          <Box
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i); startTimer(); }}
            sx={{
              width: i === current ? 20 : 5,
              height: 5,
              borderRadius: '3px',
              bgcolor: i === current ? '#fff' : 'rgba(255,255,255,0.38)',
              transition: 'all 0.4s ease',
              cursor: 'pointer',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
