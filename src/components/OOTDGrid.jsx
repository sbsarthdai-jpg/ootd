import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { supabase } from '../lib/supabase.js';

const BASE = import.meta.env.BASE_URL;

const OUTFITS = [
  {
    id: 'outfit-1',
    mainImg: `${BASE}images/1.jpg`,
    shots: [`${BASE}images/1-1.png`, `${BASE}images/1-2.png`, `${BASE}images/1-3.png`, `${BASE}images/1-4.png`],
    label: 'No.01', title: 'Stripe Hoodie Vest', tag: 'Casual',
    size: 'large', // spans 2 rows
  },
  {
    id: 'outfit-2',
    mainImg: `${BASE}images/2.webp`,
    shots: [`${BASE}images/2-1.png`, `${BASE}images/2-2.png`, `${BASE}images/2-3.png`, `${BASE}images/2-4.png`],
    label: 'No.02', title: 'Wide Denim Pants', tag: 'Street',
    size: 'small',
  },
  {
    id: 'outfit-3',
    mainImg: `${BASE}images/3.jpg`,
    shots: [`${BASE}images/3-1.png`, `${BASE}images/3-2.png`, `${BASE}images/3-3.png`, `${BASE}images/3-4.png`],
    label: 'No.03', title: 'Stripe Cami Top', tag: 'Daily',
    size: 'small',
  },
];

function OutfitCard({ outfit, onClick, index }) {
  const [hovered, setHovered] = useState(false);
  const [shotIdx, setShotIdx] = useState(0);
  const isLarge = outfit.size === 'large';

  useEffect(() => {
    if (!hovered) { setShotIdx(0); return; }
    const t = setInterval(() => setShotIdx(i => (i + 1) % outfit.shots.length), 700);
    return () => clearInterval(t);
  }, [hovered, outfit.shots.length]);

  return (
    <Box onClick={() => onClick(outfit)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
        gridRow: isLarge ? 'span 2' : 'span 1',
        bgcolor: '#F2F0ED',
        minHeight: isLarge ? { xs: 340, md: 520 } : { xs: 240, md: 258 },
        animation: `fadeUp 0.6s ease ${index * 0.1}s both`,
        '&:hover .card-overlay': { opacity: 1 },
        '&:hover img': { transform: 'scale(1.04)' },
      }}>
      <Box component="img"
        src={hovered ? outfit.shots[shotIdx] : outfit.mainImg}
        alt={outfit.title}
        sx={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          minHeight: 'inherit', transition: 'transform 0.6s ease',
        }}
      />

      {/* Hover overlay */}
      <Box className="card-overlay" sx={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(10,10,10,0.88) 0%, transparent 50%)',
        opacity: 0, transition: 'opacity 0.3s ease',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        p: 2.5,
      }}>
        <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 500, fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', mb: 0.6 }}>
          {outfit.tag}
        </Box>
        <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fff', letterSpacing: '-0.02em', mb: 0.8 }}>
          {outfit.title}
        </Box>
        <Box sx={{
          display: 'inline-flex', alignItems: 'center', gap: 0.8,
          fontFamily: '"Montserrat",sans-serif', fontWeight: 600, fontSize: '0.62rem',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: '#FF5D26',
        }}>
          View Outfit Shots <Box component="span" sx={{ fontSize: '0.9rem' }}>→</Box>
        </Box>
      </Box>

      {/* Label badge */}
      <Box sx={{
        position: 'absolute', top: 14, left: 14,
        bgcolor: 'rgba(255,255,255,0.9)', px: 1.2, py: 0.4,
        fontFamily: '"Montserrat",sans-serif', fontWeight: 700,
        fontSize: '0.58rem', letterSpacing: '0.12em', color: '#0A0A0A',
      }}>
        {outfit.label}
      </Box>
    </Box>
  );
}

export default function OOTDGrid({ onSelectOutfit }) {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    supabase.from('ootd_uploads').select('image_url').then(({ data }) => {
      if (data) setUploads(data.map(r => r.image_url).filter(Boolean));
    });
  }, []);

  return (
    <Box component="section">

      {/* Statement header — dark, like fourmula.ai */}
      <Box sx={{ bgcolor: '#0A0A0A', px: { xs: 3, md: '5vw' }, py: { xs: 8, md: 12 } }}>
        <Box sx={{
          display: 'flex', flexDirection: { xs: 'column', md: 'row' },
          alignItems: { md: 'flex-end' }, justifyContent: 'space-between', gap: 3,
        }}>
          <Box>
            <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 500, fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', mb: 2 }}>
              Curated Collection
            </Box>
            <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 800, fontSize: { xs: '2.8rem', md: '5rem' }, letterSpacing: '-0.04em', lineHeight: 0.95, color: '#fff' }}>
              Studio-quality.<br />
              <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 300, color: 'rgba(255,255,255,0.55)' }}>
                Without the studio.
              </Box>
            </Box>
          </Box>
          <Box sx={{
            flexShrink: 0,
            width: { xs: 80, md: 100 }, height: { xs: 80, md: 100 },
            borderRadius: '50%', bgcolor: '#FF5D26',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 800, fontSize: { xs: '1.4rem', md: '1.8rem' }, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
              {3 + uploads.length}
            </Box>
            <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 600, fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', mt: 0.3 }}>
              Looks
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Mosaic grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
        gridAutoRows: { md: '260px' },
        gap: '2px', bgcolor: '#E8E5E0',
      }}>
        {OUTFITS.map((outfit, i) => (
          <OutfitCard key={outfit.id} outfit={outfit} onClick={onSelectOutfit} index={i} />
        ))}
        {uploads.map((url, i) => (
          <Box key={url}
            onClick={() => onSelectOutfit({ id: `up-${i}`, mainImg: url, shots: [url], label: 'Upload', title: 'My Look', tag: 'OOTD' })}
            sx={{
              position: 'relative', overflow: 'hidden', cursor: 'pointer', bgcolor: '#F2F0ED',
              minHeight: { xs: 240, md: 260 },
              '&:hover img': { transform: 'scale(1.04)' },
            }}>
            <Box component="img" src={url} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 'inherit', transition: 'transform 0.5s ease' }} />
            <Box sx={{ position: 'absolute', top: 14, left: 14, bgcolor: 'rgba(255,255,255,0.9)', px: 1.2, py: 0.4, fontFamily: '"Montserrat",sans-serif', fontWeight: 700, fontSize: '0.58rem', letterSpacing: '0.12em', color: '#FF5D26' }}>
              My Upload
            </Box>
          </Box>
        ))}
      </Box>

      {/* Two-feature section — like fourmula.ai bottom features */}
      <Box sx={{
        display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: '2px', bgcolor: '#E8E5E0',
      }}>
        <Box sx={{ bgcolor: '#fff', p: { xs: 5, md: 8 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 260 }}>
          <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 500, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6B6B6B', mb: 3 }}>
            01 — Choose
          </Box>
          <Box>
            <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.2rem' }, letterSpacing: '-0.03em', lineHeight: 1.05, color: '#0A0A0A', mb: 2 }}>
              Choose your item.<br />See it styled.
            </Box>
            <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 300, fontSize: '0.85rem', color: '#6B6B6B', lineHeight: 1.7, maxWidth: 360 }}>
              Pick any piece from your wardrobe and instantly see real outfit shots — styled, shot, and ready to wear.
            </Box>
          </Box>
        </Box>
        <Box sx={{ bgcolor: '#0A0A0A', p: { xs: 5, md: 8 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 260 }}>
          <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 500, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', mb: 3 }}>
            02 — Upload
          </Box>
          <Box>
            <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.2rem' }, letterSpacing: '-0.03em', lineHeight: 1.05, color: '#fff', mb: 2 }}>
              Upload looks.<br />Build your lookbook.
            </Box>
            <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 300, fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 360 }}>
              Add your own photos to the gallery and keep a curated, personal style archive — all in one place.
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
