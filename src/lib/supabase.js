// ============================================================
// Supabase REST API client — OOTD 프로젝트 전용 (ootd_ 접두어)
// Supabase 대시보드 > Settings > API 에서 값 확인
// ============================================================

const SUPABASE_URL = 'https://uprmcniecwjzxerwufzr.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwcm1jbmllY3dqenhlcnd1ZnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3ODQ2OTAsImV4cCI6MjA5NTM2MDY5MH0.Z2Y_ZzOTufCLoZOBWf5nmBTgzN99QaOXaYhUhvPmuXo';

const hdrs = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

export const supabase = {
  from(table) {
    const base = `${SUPABASE_URL}/rest/v1/${table}`;
    return {
      async select(cols = '*', opts = {}) {
        const p = new URLSearchParams({ select: cols, order: 'created_at.desc' });
        if (opts.limit) p.set('limit', opts.limit);
        const r = await fetch(`${base}?${p}`, { headers: hdrs });
        if (!r.ok) return { data: [], error: { status: r.status } };
        return { data: await r.json(), error: null };
      },
      async insert(data) {
        const body = Array.isArray(data) ? data : [data];
        const r = await fetch(base, {
          method: 'POST',
          headers: hdrs,
          body: JSON.stringify(body),
        });
        if (!r.ok) return { data: null, error: { status: r.status } };
        return { data: await r.json(), error: null };
      },
    };
  },

  storage: {
    from(bucket) {
      return {
        async upload(path, file) {
          const r = await fetch(
            `${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`,
            {
              method: 'POST',
              headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                'x-upsert': 'true',
              },
              body: file,
            }
          );
          const d = await r.json().catch(() => ({}));
          return r.ok ? { data: d, error: null } : { data: null, error: d };
        },
        getPublicUrl(path) {
          return {
            data: {
              publicUrl: `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`,
            },
          };
        },
      };
    },
  },
};
