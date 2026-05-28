import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { supabase } from '../lib/supabase.js';

const BASE = import.meta.env.BASE_URL;

const FIXED_OUTFITS = [
  {
    id: 'outfit-1',
    mainImg: `${BASE}images/1.jpg`,
    shots: [
      `${BASE}images/1-1.png`,
      `${BASE}images/1-2.png`,
      `${BASE}images/1-3.png`,
      `${BASE}images/1-4.png`,
    ],
    label: 'No.01',
    title: '스트라이프 후드 베스트',
    tag: 'Casual',
  },
  {
    id: 'outfit-2',
    mainImg: `${BASE}images/2.webp`,
    shots: [
      `${BASE}images/2-1.png`,
      `${BASE}images/2-2.png`,
      `${BASE}images/2-3.png`,
      `${BASE}images/2-4.png`,
    ],
    label: 'No.02',
    title: '세컨드 룩',
    tag: 'Daily',
  },
  {
    id: 'outfit-3',
    mainImg: `${BASE}images/3.jpg`,
    shots: [
      `${BASE}images/3-1.png`,
      `${BASE}images/3-2.png`,
      `${BASE}images/3-3.png`,
      `${BASE}images/3-4.png`,
    ],
    label: 'No.03',
    title: '서드 룩',
    tag: 'Street',
  },
];

function OutfitCard({ outfit, onClick, index }) {
  const [hovered, setHovered] = useState(false);
  const [shotIdx, setShotIdx] = useState(0);

  useEffect(() => {
    if (!hovered) { setShotIdx(0); return; }
    const t = setInterval(() => setShotIdx((i) => (i + 1) % outfit.shots.length), 600);
    return () => clearInterval(t);
  }, [hovered, outfit.shots.length]);

  return (
    <Box
      onClick={() => onClick(outfit)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#F2F0EC',
        aspectRatio: { xs: '3/4', md: 'unset' },
        animation: `fadeUp 0.6s ease ${index * 0.12}s both`,
        '@keyframes fadeUp': {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        '&:hover .overlay': { opacity: 1 },
        '&:hover img.main': { transform: 'scale(1.04)' },
      }}
    >
      {/* 메인 이미지 */}
      <Box
        component="img"
        src={hovered ? outfit.shots[shotIdx] : outfit.mainImg}
        alt={outfit.title}
        className="main"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.5s ease',
          display: 'block',
          minHeight: { xs: 280, md: 380 },
        }}
      />

      {/* 호버 오버레이 */}
      <Box
        className="overlay"
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(13,13,13,0.85) 0%, transparent 55%)',
          opacity: 0,
          transition: 'opacity 0.35s ease',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          p: 2.5,
        }}
      >
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            fontFamily: '"Inter", sans-serif',
            mb: 0.5,
          }}
        >
          {outfit.tag}
        </Typography>
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            color: '#FAFAF8',
            fontSize: '1.15rem',
            fontWeight: 400,
            lineHeight: 1.2,
          }}
        >
          {outfit.title}
        </Typography>
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            mt: 0.5,
            fontFamily: '"Inter", sans-serif',
          }}
        >
          착장샷 보기 →
        </Typography>
      </Box>

      {/* 라벨 */}
      <Box sx={{ position: 'absolute', top: 14, left: 14 }}>
        <Typography
          sx={{
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            color: '#6B6B6B',
            fontFamily: '"Inter", sans-serif',
            bgcolor: 'rgba(255,255,255,0.85)',
            px: 1,
            py: 0.3,
          }}
        >
          {outfit.label}
        </Typography>
      </Box>
    </Box>
  );
}

function UploadedCard({ imageUrl, index, onClick }) {
  return (
    <Box
      onClick={() =>
        onClick({
          id: `upload-${index}`,
          mainImg: imageUrl,
          shots: [imageUrl],
          label: `Upload`,
          title: '업로드한 코디',
          tag: 'My OOTD',
        })
      }
      sx={{
        cursor: 'pointer',
        overflow: 'hidden',
        bgcolor: '#F2F0EC',
        position: 'relative',
        '&:hover img': { transform: 'scale(1.04)' },
      }}
    >
      <Box
        component="img"
        src={imageUrl}
        alt={`uploaded ${index}`}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          minHeight: 280,
          transition: 'transform 0.5s ease',
          display: 'block',
        }}
      />
      <Box sx={{ position: 'absolute', top: 14, left: 14 }}>
        <Typography
          sx={{
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            color: '#6B6B6B',
            fontFamily: '"Inter", sans-serif',
            bgcolor: 'rgba(255,255,255,0.85)',
            px: 1,
            py: 0.3,
          }}
        >
          My Upload
        </Typography>
      </Box>
    </Box>
  );
}

export default function OOTDGrid({ onSelectOutfit }) {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('ootd_uploads').select('image_url');
      if (data) setUploads(data.map((r) => r.image_url).filter(Boolean));
    })();
  }, []);

  return (
    <Box component="section" sx={{ bgcolor: '#FAFAF8', pt: 10, pb: 12 }}>
      {/* 섹션 헤더 */}
      <Box sx={{ px: { xs: 3, md: 6 }, mb: 6 }}>
        <Typography
          sx={{
            fontSize: '0.65rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#6B6B6B',
            fontFamily: '"Inter", sans-serif',
            mb: 1.5,
          }}
        >
          Curated Looks
        </Typography>
        <Typography
          variant="h1"
          sx={{ fontSize: { xs: '2.5rem', md: '4.5rem' }, maxWidth: 600 }}
        >
          나의 옷장에서
          <br />
          <Box component="em" sx={{ fontStyle: 'italic', fontWeight: 300, color: '#6B6B6B' }}>
            오늘의 스타일
          </Box>
        </Typography>
      </Box>

      {/* 상단 3분할 그리드 + 사이드 텍스트 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
          gap: '1px',
          bgcolor: '#E8E4DF',
          px: { xs: 0, md: 0 },
        }}
      >
        {FIXED_OUTFITS.map((outfit, i) => (
          <OutfitCard key={outfit.id} outfit={outfit} onClick={onSelectOutfit} index={i} />
        ))}
      </Box>

      {/* 업로드된 이미지 섹션 */}
      {uploads.length > 0 && (
        <>
          <Box sx={{ px: { xs: 3, md: 6 }, mt: 10, mb: 4 }}>
            <Typography
              sx={{
                fontSize: '0.65rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#6B6B6B',
                fontFamily: '"Inter", sans-serif',
                mb: 1,
              }}
            >
              My Uploads
            </Typography>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: '1.8rem', md: '3rem' } }}
            >
              내가 추가한 코디
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: '1px',
              bgcolor: '#E8E4DF',
            }}
          >
            {uploads.map((url, i) => (
              <UploadedCard key={url} imageUrl={url} index={i} onClick={onSelectOutfit} />
            ))}
          </Box>
        </>
      )}

      {/* 하단 카피 */}
      <Box sx={{ px: { xs: 3, md: 6 }, mt: 8 }}>
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: { xs: '1.2rem', md: '1.8rem' },
            fontWeight: 300,
            color: '#6B6B6B',
            fontStyle: 'italic',
            maxWidth: 480,
          }}
        >
          "옷을 입는 것은 자신을 표현하는 가장 간단한 방법이다."
        </Typography>
      </Box>
    </Box>
  );
}
