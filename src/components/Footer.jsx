import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// 하트 모양 도트 패턴 (7열 × 6행 그리드, 24개 도트)
// 각 셀: [행, 열]
const HEART_CELLS = [
  // 행0
  [0, 1], [0, 5],
  // 행1
  [1, 0], [1, 1], [1, 2], [1, 4], [1, 5], [1, 6],
  // 행2
  [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6],
  // 행3
  [3, 1], [3, 2], [3, 3], [3, 4], [3, 5],
  // 행4
  [4, 2], [4, 3], [4, 4],
  // 행5
  [5, 3],
];

// 채우기 순서 (아래 tip에서 위로)
const FILL_ORDER = [
  [5, 3],
  [4, 3], [4, 2], [4, 4],
  [3, 3], [3, 2], [3, 4], [3, 1], [3, 5],
  [2, 3], [2, 2], [2, 4], [2, 1], [2, 5], [2, 0], [2, 6],
  [1, 2], [1, 4], [1, 1], [1, 5], [1, 0], [1, 6],
  [0, 1], [0, 5],
];

const TOTAL = HEART_CELLS.length; // 24

function isHeartCell(row, col) {
  return HEART_CELLS.some(([r, c]) => r === row && c === col);
}

function getFillIndex(row, col) {
  return FILL_ORDER.findIndex(([r, c]) => r === row && c === col);
}

export default function Footer({ viewCount }) {
  const filled = Math.min(viewCount, TOTAL);

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#0D0D0D',
        pt: 12,
        pb: 8,
        px: { xs: 3, md: 6 },
      }}
    >
      {/* 섹션 헤더 */}
      <Box sx={{ mb: 8 }}>
        <Typography
          sx={{
            fontSize: '0.65rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            fontFamily: '"Inter", sans-serif',
            mb: 1.5,
          }}
        >
          Progress
        </Typography>
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: { xs: '2.5rem', md: '4rem' },
            fontWeight: 300,
            color: '#FAFAF8',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          입어본 코디
          <Box
            component="span"
            sx={{ color: 'rgba(255,255,255,0.35)', ml: { xs: 1, md: 2 } }}
          >
            {filled} / {TOTAL}
          </Box>
        </Typography>
        <Typography
          sx={{
            mt: 1.5,
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.8rem',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 300,
            letterSpacing: '0.03em',
          }}
        >
          옷을 클릭할 때마다 하트가 채워집니다
        </Typography>
      </Box>

      {/* 하트 도트 그리드 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', md: 'flex-start' },
          mb: 10,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gridTemplateRows: 'repeat(6, 1fr)',
            gap: { xs: '10px', md: '14px' },
          }}
        >
          {Array.from({ length: 6 }, (_, row) =>
            Array.from({ length: 7 }, (_, col) => {
              const inHeart = isHeartCell(row, col);
              const fillIdx = getFillIndex(row, col);
              const isFilled = inHeart && fillIdx < filled;
              const delay = fillIdx >= 0 ? fillIdx * 0.04 : 0;

              return (
                <Box
                  key={`${row}-${col}`}
                  sx={{
                    width: { xs: 12, md: 16 },
                    height: { xs: 12, md: 16 },
                    borderRadius: '50%',
                    bgcolor: inHeart
                      ? isFilled
                        ? '#E8B4B8'
                        : 'rgba(255,255,255,0.12)'
                      : 'transparent',
                    border: inHeart && !isFilled ? '1px solid rgba(255,255,255,0.18)' : 'none',
                    transform: isFilled ? 'scale(1)' : 'scale(0.7)',
                    transition: `all 0.35s cubic-bezier(0.34,1.56,0.64,1) ${delay}s`,
                    boxShadow: isFilled ? '0 0 8px rgba(232,180,184,0.4)' : 'none',
                  }}
                />
              );
            })
          )}
        </Box>
      </Box>

      {/* 하단 구분선 + 저작권 */}
      <Box
        sx={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          pt: 4,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '1.5rem',
            fontWeight: 300,
            color: '#FAFAF8',
            letterSpacing: '0.1em',
          }}
        >
          OOTD
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 0.5 }}>
          <Typography
            sx={{
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.35)',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            절제 · 유연함 · 고감도
          </Typography>
          <Typography
            sx={{
              fontSize: '0.6rem',
              letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.2)',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            © 2025 OOTD · Personal Style Curation
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
