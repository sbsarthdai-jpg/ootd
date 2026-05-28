import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';

const BASE = import.meta.env.BASE_URL;

const PREVIEW = [
  `${BASE}images/1-1.png`,
  `${BASE}images/3-1.png`,
  `${BASE}images/2-1.png`,
];

export default function LoadingScreen({ onDone }) {
  const [phase, setPhase] = useState('in');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('out'), 2600);
    const t2 = setTimeout(onDone, 3100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <Box sx={{
      position: 'fixed', inset: 0, zIndex: 9999,
      bgcolor: '#0A0A0A', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      opacity: phase === 'out' ? 0 : 1,
      transition: 'opacity 0.5s ease',
      pointerEvents: phase === 'out' ? 'none' : 'auto',
    }}>
      {/* Background image collage */}
      <Box sx={{
        position: 'absolute', inset: 0,
        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
        opacity: 0.12, filter: 'grayscale(80%)',
      }}>
        {PREVIEW.map((src, i) => (
          <Box key={i} component="img" src={src} alt="" sx={{
            width: '100%', height: '100%', objectFit: 'cover',
            animation: `fadeIn 0.8s ease ${i * 0.15}s both`,
          }} />
        ))}
      </Box>

      {/* Logo mark */}
      <Box sx={{ position: 'relative', mb: 2 }}>
        <Box sx={{
          width: 48, height: 48,
          border: '2px solid rgba(255,255,255,0.9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.5s ease 0.1s both',
        }}>
          <Box sx={{
            fontFamily: '"Montserrat",sans-serif', fontWeight: 800,
            fontSize: '1rem', color: '#fff', letterSpacing: '0.05em',
          }}>OD</Box>
        </Box>
      </Box>

      {/* OOTD letters */}
      <Box sx={{ position: 'relative', display: 'flex', gap: { xs: '4px', md: '8px' } }}>
        {['O','O','T','D'].map((l, i) => (
          <Box key={i} sx={{
            fontFamily: '"Montserrat",sans-serif',
            fontSize: { xs: '4.5rem', md: '8rem' },
            fontWeight: 800, color: '#fff',
            letterSpacing: '-0.04em', lineHeight: 1,
            animation: `fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.1}s both`,
          }}>{l}</Box>
        ))}
      </Box>

      <Box sx={{
        position: 'relative', mt: 2,
        fontFamily: '"Montserrat",sans-serif',
        color: 'rgba(255,255,255,0.4)', fontSize: '0.62rem',
        letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 500,
        animation: 'fadeIn 0.8s ease 0.6s both',
      }}>
        Your Style, Curated.
      </Box>

      {/* Progress bar */}
      <Box sx={{
        position: 'absolute', bottom: 0, left: 0, height: '2px', bgcolor: '#FF5D26',
        animation: 'slideRight 2.6s cubic-bezier(0.4,0,0.2,1) 0.2s both',
      }} />
    </Box>
  );
}
