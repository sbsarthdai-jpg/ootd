import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const BASE = import.meta.env.BASE_URL;

const PREVIEW_IMAGES = [
  `${BASE}images/1-1.png`,
  `${BASE}images/2-1.png`,
  `${BASE}images/3-1.png`,
];

const LETTERS = ['O', 'O', 'T', 'D'];

export default function LoadingScreen({ onDone }) {
  const [phase, setPhase] = useState('in'); // 'in' | 'out'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('out'), 2400);
    const t2 = setTimeout(() => onDone(), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        bgcolor: '#0D0D0D',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: phase === 'out' ? 0 : 1,
        transition: 'opacity 0.6s ease',
        pointerEvents: phase === 'out' ? 'none' : 'auto',
        overflow: 'hidden',
      }}
    >
      {/* 배경 이미지 콜라주 */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          opacity: 0.18,
          filter: 'grayscale(60%)',
        }}
      >
        {PREVIEW_IMAGES.map((src, i) => (
          <Box
            key={i}
            component="img"
            src={src}
            alt=""
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              animation: `fadeIn 0.8s ease ${i * 0.2}s both`,
              '@keyframes fadeIn': {
                from: { opacity: 0 },
                to: { opacity: 1 },
              },
            }}
          />
        ))}
      </Box>

      {/* OOTD 로고 텍스트 */}
      <Box sx={{ position: 'relative', display: 'flex', gap: { xs: '0.3rem', md: '0.6rem' } }}>
        {LETTERS.map((letter, i) => (
          <Typography
            key={i}
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: { xs: '5rem', md: '9rem' },
              fontWeight: 300,
              color: '#FAFAF8',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              animation: `letterIn 0.7s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.12}s both`,
              '@keyframes letterIn': {
                from: { opacity: 0, transform: 'translateY(40px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            {letter}
          </Typography>
        ))}
      </Box>

      {/* 서브 텍스트 */}
      <Typography
        sx={{
          position: 'relative',
          mt: 2,
          color: 'rgba(255,255,255,0.45)',
          fontSize: '0.65rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          fontFamily: '"Inter", sans-serif',
          fontWeight: 300,
          animation: 'fadeIn 0.8s ease 0.6s both',
          '@keyframes fadeIn': {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
        }}
      >
        나만의 코디 큐레이션
      </Typography>

      {/* 로딩 바 */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '2px',
          bgcolor: '#FAFAF8',
          animation: 'loadBar 2.4s cubic-bezier(0.4,0,0.2,1) 0.3s both',
          '@keyframes loadBar': {
            from: { width: '0%' },
            to: { width: '100%' },
          },
        }}
      />
    </Box>
  );
}
