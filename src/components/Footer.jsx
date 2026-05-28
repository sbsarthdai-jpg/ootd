import Box from '@mui/material/Box';

// Heart shape — 7 cols × 6 rows, 24 dots
// Fill order: tip → outward
const HEART = [
  [0,1],[0,5],
  [1,0],[1,1],[1,2],[1,4],[1,5],[1,6],
  [2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],
  [3,1],[3,2],[3,3],[3,4],[3,5],
  [4,2],[4,3],[4,4],
  [5,3],
];
const FILL_ORDER = [
  [5,3],[4,3],[4,2],[4,4],
  [3,3],[3,2],[3,4],[3,1],[3,5],
  [2,3],[2,2],[2,4],[2,1],[2,5],[2,0],[2,6],
  [1,2],[1,4],[1,1],[1,5],[1,0],[1,6],
  [0,1],[0,5],
];
const TOTAL = HEART.length;

const isHeart = (r, c) => HEART.some(([hr, hc]) => hr === r && hc === c);
const fillIndex = (r, c) => FILL_ORDER.findIndex(([fr, fc]) => fr === r && fc === c);

export default function Footer({ viewCount }) {
  const filled = Math.min(viewCount, TOTAL);

  return (
    <Box component="footer" sx={{ bgcolor: '#0A0A0A' }}>

      {/* Main footer content */}
      <Box sx={{ px: { xs: 3, md: '5vw' }, pt: { xs: 10, md: 14 }, pb: { xs: 8, md: 10 } }}>

        {/* Section label */}
        <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', mb: 3 }}>
          Your Progress
        </Box>

        {/* Heading */}
        <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 800, fontSize: { xs: '2.5rem', md: '4.5rem' }, letterSpacing: '-0.04em', lineHeight: 0.95, color: '#fff', mb: 1.5 }}>
          Styles Explored
          <Box component="span" sx={{ fontWeight: 300, color: 'rgba(255,255,255,0.25)', ml: { xs: 2, md: 3 }, fontSize: { xs: '1.8rem', md: '3rem' } }}>
            {filled} / {TOTAL}
          </Box>
        </Box>
        <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 300, fontSize: '0.85rem', color: 'rgba(255,255,255,0.38)', mb: 8, letterSpacing: '0.02em' }}>
          Each outfit you explore fills one dot — complete the heart.
        </Box>

        {/* Heart dots */}
        <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 10 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gridTemplateRows: 'repeat(6,1fr)', gap: { xs: '10px', md: '14px' } }}>
            {Array.from({ length: 6 }, (_, r) =>
              Array.from({ length: 7 }, (_, c) => {
                const inH = isHeart(r, c);
                const fi = fillIndex(r, c);
                const isFilled = inH && fi < filled;
                return (
                  <Box key={`${r}-${c}`} sx={{
                    width: { xs: 12, md: 15 }, height: { xs: 12, md: 15 },
                    borderRadius: '50%',
                    bgcolor: inH ? (isFilled ? '#FF5D26' : 'rgba(255,255,255,0.1)') : 'transparent',
                    border: inH && !isFilled ? '1px solid rgba(255,255,255,0.15)' : 'none',
                    transform: isFilled ? 'scale(1)' : inH ? 'scale(0.75)' : 'scale(0)',
                    transition: `all 0.35s cubic-bezier(0.34,1.56,0.64,1) ${fi >= 0 ? fi * 0.04 : 0}s`,
                    boxShadow: isFilled ? '0 0 10px rgba(255,93,38,0.45)' : 'none',
                  }} />
                );
              })
            )}
          </Box>
        </Box>

        {/* Bottom bar */}
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.07)', pt: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 28, height: 28, bgcolor: '#FF5D26', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 800, fontSize: '0.6rem', color: '#fff' }}>OD</Box>
            </Box>
            <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 800, fontSize: '1rem', color: '#fff', letterSpacing: '-0.02em' }}>OOTD</Box>
          </Box>

          {/* Tagline */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 0.6 }}>
            <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 500, fontSize: '0.6rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
              Restraint · Flexibility · High-Sensing
            </Box>
            <Box sx={{ fontFamily: '"Montserrat",sans-serif', fontWeight: 300, fontSize: '0.58rem', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.2)' }}>
              © 2025 OOTD · Personal Style Curation
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
