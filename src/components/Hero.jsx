import { useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { supabase } from '../lib/supabase.js';

const BASE = import.meta.env.BASE_URL;

// Circle collage — positions match fourmula.ai asymmetric layout
const CIRCLES = [
  { src: '3-1.png', size: 200, top:  60, left: 110, z: 3, delay: 0.1 },
  { src: '1-1.png', size: 148, top:  10, left:  10, z: 2, delay: 0.2 },
  { src: '2-1.png', size: 128, top:   0, left: 230, z: 2, delay: 0.3 },
  { src: '1-2.png', size: 100, top: 220, left:   0, z: 2, delay: 0.4 },
  { src: '3-2.png', size: 118, top: 240, left: 270, z: 2, delay: 0.35 },
  { src: '2-2.png', size:  78, top: 340, left: 130, z: 2, delay: 0.45 },
  { src: '1-3.png', size:  70, top: 155, left: 318, z: 1, delay: 0.5  },
];

const UploadIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
);

export default function Hero({ onUploadDone }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = [false, () => {}];

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `banner/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('ootd-images').upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from('ootd-images').getPublicUrl(path);
      await supabase.from('ootd_uploads').insert({ image_url: data.publicUrl });
      onUploadDone?.(data.publicUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <Box component="section" sx={{
      minHeight: '100svh', display: 'flex', alignItems: 'center',
      bgcolor: '#fff', pt: 10, pb: 6,
      px: { xs: 3, md: '5vw' },
      overflow: 'hidden',
    }}>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: { xs: 6, md: 0 },
        alignItems: 'center',
        maxWidth: 1280, mx: 'auto', width: '100%',
      }}>

        {/* LEFT — Text */}
        <Box sx={{ pr: { md: 4 } }}>
          {/* Tag */}
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1,
            mb: 4,
            animation: 'fadeUp 0.6s ease 0.1s both',
          }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#FF5D26' }} />
            <Typography sx={{
              fontFamily: '"Montserrat",sans-serif', fontWeight: 600,
              fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#6B6B6B',
            }}>
              Personal Style Curation
            </Typography>
          </Box>

          {/* Heading */}
          <Box sx={{ mb: 3, animation: 'fadeUp 0.7s ease 0.2s both' }}>
            <Typography sx={{
              fontFamily: '"Montserrat",sans-serif', fontWeight: 800,
              fontSize: { xs: '3.2rem', md: '5vw', lg: '4.2rem' },
              letterSpacing: '-0.04em', lineHeight: 0.95, color: '#0A0A0A',
              display: 'block',
            }}>Your closet.</Typography>
            <Typography sx={{
              fontFamily: '"Montserrat",sans-serif', fontWeight: 800,
              fontSize: { xs: '3.2rem', md: '5vw', lg: '4.2rem' },
              letterSpacing: '-0.04em', lineHeight: 0.95,
              color: '#0A0A0A', fontStyle: 'italic',
              display: 'block', mt: 0.5,
            }}>Instantly styled.</Typography>
          </Box>

          {/* Description */}
          <Typography sx={{
            fontFamily: '"Montserrat",sans-serif', fontWeight: 300,
            fontSize: '0.92rem', color: '#6B6B6B', lineHeight: 1.7,
            maxWidth: 380, mb: 4,
            animation: 'fadeUp 0.7s ease 0.35s both',
          }}>
            Upload your favorite pieces and see how they look on — AI-powered outfit shots, instantly.
          </Typography>

          {/* CTAs */}
          <Box sx={{
            display: 'flex', gap: 2, flexWrap: 'wrap',
            animation: 'fadeUp 0.7s ease 0.45s both',
          }}>
            <Box
              onClick={() => fileRef.current?.click()}
              sx={{
                px: 3.5, py: 1.5,
                bgcolor: '#0A0A0A', color: '#fff',
                fontFamily: '"Montserrat",sans-serif',
                fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.06em',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1.2,
                transition: 'bgcolor 0.2s',
                '&:hover': { bgcolor: '#FF5D26' },
              }}
            >
              <UploadIcon /> Upload a Look
            </Box>
            <Box sx={{
              px: 3.5, py: 1.5,
              border: '1.5px solid #0A0A0A', color: '#0A0A0A',
              fontFamily: '"Montserrat",sans-serif',
              fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.06em',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': { bgcolor: '#0A0A0A', color: '#fff' },
            }}>
              Explore Styles
            </Box>
          </Box>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
        </Box>

        {/* RIGHT — Circle collage */}
        <Box sx={{
          position: 'relative',
          height: { xs: 380, md: 480 },
          display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-end' },
        }}>
          <Box sx={{ position: 'relative', width: 420, height: 440 }}>
            {CIRCLES.map((c, i) => (
              <Box key={i} sx={{
                position: 'absolute',
                top: c.top, left: c.left,
                width: c.size, height: c.size,
                borderRadius: '50%', overflow: 'hidden',
                zIndex: c.z, boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                animation: `scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1) ${c.delay}s both`,
              }}>
                <Box component="img"
                  src={`${BASE}images/${c.src}`}
                  alt=""
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </Box>
            ))}

            {/* Upload circle overlay */}
            <Box sx={{
              position: 'absolute', top: 160, left: 170,
              width: 72, height: 72, borderRadius: '50%',
              bgcolor: '#FF5D26', color: '#fff', zIndex: 10,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 8px 32px rgba(255,93,38,0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'scale(1.1)', boxShadow: '0 12px 40px rgba(255,93,38,0.5)' },
              animation: 'scaleIn 0.5s ease 0.6s both',
            }} onClick={() => fileRef.current?.click()}>
              <UploadIcon />
              <Box sx={{ fontSize: '0.45rem', fontWeight: 700, letterSpacing: '0.1em', mt: 0.4 }}>ADD</Box>
            </Box>
          </Box>
        </Box>

      </Box>

      {/* Scroll indicator */}
      <Box sx={{
        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.8,
        opacity: 0.4, animation: 'fadeIn 1s ease 1.2s both',
      }}>
        <Box sx={{
          fontFamily: '"Montserrat",sans-serif', fontWeight: 500,
          fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase',
        }}>Scroll</Box>
        <Box sx={{ width: 1, height: 40, bgcolor: '#0A0A0A' }} />
      </Box>
    </Box>
  );
}
