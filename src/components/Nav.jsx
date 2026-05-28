import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <Box component="nav" sx={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      px: { xs: 3, md: 5 }, py: 2.5,
      bgcolor: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
      transition: 'all 0.35s ease',
    }}>
      {/* Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
          width: 32, height: 32,
          bgcolor: '#0A0A0A',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Box sx={{
            fontFamily: '"Montserrat",sans-serif',
            fontWeight: 800, fontSize: '0.7rem', color: '#fff',
            letterSpacing: '0.03em',
          }}>OD</Box>
        </Box>
        <Box sx={{
          fontFamily: '"Montserrat",sans-serif',
          fontWeight: 800, fontSize: '1.05rem', color: '#0A0A0A',
          letterSpacing: '-0.02em',
        }}>OOTD</Box>
      </Box>

      {/* Nav links */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, alignItems: 'center' }}>
        {['Wardrobe', 'Lookbook', 'Upload', 'About'].map(link => (
          <Box key={link} sx={{
            fontFamily: '"Montserrat",sans-serif',
            fontWeight: 500, fontSize: '0.78rem',
            color: '#0A0A0A', letterSpacing: '0.02em',
            cursor: 'pointer', opacity: 0.65,
            transition: 'opacity 0.2s',
            '&:hover': { opacity: 1 },
          }}>{link}</Box>
        ))}
        <Box sx={{
          px: 2.5, py: 1,
          bgcolor: '#0A0A0A', color: '#fff',
          fontFamily: '"Montserrat",sans-serif',
          fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.06em',
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': { bgcolor: '#FF5D26' },
        }}>
          Get Started
        </Box>
      </Box>
    </Box>
  );
}
