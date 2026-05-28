import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const ArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
  </svg>
);

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
  </svg>
);

export default function OutfitModal({ outfit, onClose }) {
  const [activeShot, setActiveShot] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    const handleKey = (e) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') setActiveShot((i) => (i + 1) % outfit.shots.length);
      if (e.key === 'ArrowLeft')
        setActiveShot((i) => (i - 1 + outfit.shots.length) % outfit.shots.length);
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [outfit.shots.length]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 360);
  };

  return (
    <Box
      onClick={handleClose}
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1300,
        bgcolor: 'rgba(13,13,13,0.88)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.36s ease',
        backdropFilter: 'blur(6px)',
        p: { xs: 2, md: 4 },
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          bgcolor: '#FAFAF8',
          maxWidth: 1100,
          width: '100%',
          maxHeight: '92svh',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
          transition: 'transform 0.36s cubic-bezier(0.16,1,0.3,1)',
          position: 'relative',
        }}
      >
        {/* 닫기 */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 14,
            right: 14,
            zIndex: 10,
            color: '#0D0D0D',
            bgcolor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(4px)',
            '&:hover': { bgcolor: '#0D0D0D', color: '#FAFAF8' },
            transition: 'all 0.2s ease',
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* 왼쪽: 제품 이미지 */}
        <Box sx={{ bgcolor: '#F2F0EC', display: 'flex', flexDirection: 'column' }}>
          <Box
            component="img"
            src={outfit.mainImg}
            alt={outfit.title}
            sx={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover' }}
          />
          <Box sx={{ p: 3 }}>
            <Typography
              sx={{
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#6B6B6B',
                fontFamily: '"Inter", sans-serif',
                mb: 0.5,
              }}
            >
              {outfit.tag} · {outfit.label}
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '1.6rem',
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              {outfit.title}
            </Typography>
          </Box>
        </Box>

        {/* 오른쪽: 착장샷 */}
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Typography
            sx={{
              fontSize: '0.6rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#6B6B6B',
              fontFamily: '"Inter", sans-serif',
              mb: 2,
            }}
          >
            착장샷 — Outfit Shots
          </Typography>

          <Box sx={{ position: 'relative', mb: 2 }}>
            <Box
              component="img"
              src={outfit.shots[activeShot]}
              alt={`shot ${activeShot + 1}`}
              sx={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }}
            />
            {outfit.shots.length > 1 && (
              <>
                <IconButton
                  onClick={() =>
                    setActiveShot((i) => (i - 1 + outfit.shots.length) % outfit.shots.length)
                  }
                  size="small"
                  sx={{
                    position: 'absolute',
                    left: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.85)',
                    '&:hover': { bgcolor: '#fff' },
                  }}
                >
                  <ArrowLeft />
                </IconButton>
                <IconButton
                  onClick={() => setActiveShot((i) => (i + 1) % outfit.shots.length)}
                  size="small"
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.85)',
                    '&:hover': { bgcolor: '#fff' },
                  }}
                >
                  <ArrowRight />
                </IconButton>
              </>
            )}
          </Box>

          {outfit.shots.length > 1 && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.min(outfit.shots.length, 4)}, 1fr)`,
                gap: '4px',
              }}
            >
              {outfit.shots.map((shot, i) => (
                <Box
                  key={i}
                  component="img"
                  src={shot}
                  alt={`thumb ${i}`}
                  onClick={() => setActiveShot(i)}
                  sx={{
                    width: '100%',
                    aspectRatio: '1',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    opacity: i === activeShot ? 1 : 0.45,
                    outline: i === activeShot ? '2px solid #0D0D0D' : 'none',
                    outlineOffset: '-2px',
                    transition: 'opacity 0.2s ease',
                    '&:hover': { opacity: 0.85 },
                  }}
                />
              ))}
            </Box>
          )}

          <Typography
            sx={{
              mt: 2.5,
              fontSize: '0.6rem',
              color: '#BCBCBC',
              fontFamily: '"Inter", sans-serif',
              letterSpacing: '0.04em',
            }}
          >
            ← → 키로 이동 · ESC로 닫기
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
