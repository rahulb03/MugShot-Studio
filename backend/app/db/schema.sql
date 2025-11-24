-- Users table (handled by Supabase Auth usually, but we might need a public profile)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  name text,
  role text default 'user',
  plan text default 'starter',
  credits int default 50,
  brand_colors jsonb,
  default_style jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Assets (Selfies, References, etc.)
create table public.assets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  type text check (type in ('selfie', 'ref', 'copy_target', 'render')),
  path text not null,
  width int,
  height int,
  md5 text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Projects
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  mode text check (mode in ('design', 'copy')),
  platform text,
  width int,
  height int,
  status text check (status in ('draft', 'queued', 'done', 'failed')) default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Prompts
create table public.prompts (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) not null,
  raw jsonb,
  normalized jsonb,
  seed int,
  model_pref text
);

-- Jobs
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) not null,
  model text,
  quality text check (quality in ('draft', 'std', '4k')),
  status text check (status in ('queued', 'running', 'succeeded', 'failed')) default 'queued',
  cost_credits int,
  provider jsonb,
  started_at timestamp with time zone,
  finished_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Renders (Outputs)
create table public.renders (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.jobs(id) not null,
  asset_id uuid references public.assets(id), -- Link to asset if stored there
  variant int,
  meta jsonb,
  thumbnail_path text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Audit Log
create table public.audit (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  action text,
  delta_credits int,
  meta jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
