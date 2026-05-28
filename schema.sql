-- ============================================================
-- OOTD 프로젝트 전용 DB 스키마 (ootd_ 접두어로 타 프로젝트와 구별)
-- Supabase 대시보드 > SQL Editor 에서 실행하세요
-- ============================================================

-- 1. ootd_uploads: 배너에서 업로드한 이미지 URL 저장
create table if not exists public.ootd_uploads (
  id          uuid primary key default gen_random_uuid(),
  image_url   text not null,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.ootd_uploads enable row level security;

-- 기존 정책 삭제 (재실행 시 중복 오류 방지)
drop policy if exists "ootd: public read uploads"  on public.ootd_uploads;
drop policy if exists "ootd: public insert uploads" on public.ootd_uploads;
drop policy if exists "ootd: public upload images"  on storage.objects;
drop policy if exists "ootd: public read images"    on storage.objects;

-- ootd_uploads: 누구나 읽기·쓰기 가능 (로그인 없음)
create policy "ootd: public read uploads" on public.ootd_uploads
  for select using (true);

create policy "ootd: public insert uploads" on public.ootd_uploads
  for insert with check (true);

-- ============================================================
-- Storage Bucket 생성 (ootd 이미지용)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('ootd-images', 'ootd-images', true)
on conflict (id) do nothing;

-- storage: 누구나 업로드·조회 가능
create policy "ootd: public upload images" on storage.objects
  for insert with check (bucket_id = 'ootd-images');

create policy "ootd: public read images" on storage.objects
  for select using (bucket_id = 'ootd-images');
