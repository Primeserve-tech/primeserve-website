# PrimeServe CMS/Admin Dashboard Setup

This project now includes a working React CMS dashboard at:

```text
/admin
```

Demo admin accounts:

```text
primeserve45@gmail.com / Password@#321
hr@primeserve.in / Password@#321
content@primeserve.in / Password@#321
```

The current implementation stores data in browser `localStorage` so the dashboard works immediately inside the existing Vite React website without breaking the current design. For production, connect the same modules to a backend API and PostgreSQL or MongoDB.

## Included CMS Modules

- Admin authentication with roles: Super Admin, HR Admin, Content Admin
- Dashboard summary cards
- Careers and job applications
- Blogs
- News and updates
- API/product release updates
- Client logos
- Testimonials
- Contact and demo enquiries
- Website settings
- SEO settings

## Public CMS Pages

```text
/careers
/blog
/blog/:slug
/news
/updates
/company/our-clients
```

The homepage also shows latest blogs, news and API updates from CMS data.

## Recommended Production Backend

Use either:

```text
Node.js + Express + PostgreSQL
```

or:

```text
Next.js API routes + PostgreSQL
```

Recommended packages:

```text
express
cors
helmet
bcryptjs
jsonwebtoken
multer
pg
zod
dotenv
```

## Environment Variables

```text
DATABASE_URL=postgresql://user:password@host:5432/primeserve
JWT_SECRET=change-this-secret
UPLOAD_DIR=uploads
PUBLIC_STORAGE_URL=https://cdn.primeserve.in/uploads
ADMIN_ALLOWED_ORIGIN=https://www.primeserve.in
```

## PostgreSQL Schema

```sql
create table admin_users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  role text not null check (role in ('Super Admin', 'HR Admin', 'Content Admin')),
  created_at timestamptz default now()
);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department text,
  experience text,
  location text,
  employment_type text,
  salary_range text,
  description text,
  responsibilities text,
  skills text,
  status text not null default 'Inactive',
  publish_date date,
  created_at timestamptz default now()
);

create table job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id),
  full_name text not null,
  email text not null,
  mobile text,
  position text,
  experience text,
  current_ctc text,
  expected_ctc text,
  notice_period text,
  resume_url text,
  message text,
  status text default 'New',
  created_at timestamptz default now()
);

create table blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text,
  short_description text,
  cover_image_url text,
  content text,
  author text,
  tags text,
  seo_title text,
  seo_description text,
  status text default 'Draft',
  publish_date date,
  created_at timestamptz default now()
);

create table news_updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  short_description text,
  full_description text,
  image_url text,
  date date,
  status text default 'Draft',
  created_at timestamptz default now()
);

create table api_release_notes (
  id uuid primary key default gen_random_uuid(),
  product_name text not null,
  update_type text not null,
  description text,
  release_date date,
  status text default 'Draft',
  created_at timestamptz default now()
);

create table client_logos (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  logo_url text,
  industry text,
  status text default 'Active',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text,
  company_name text,
  designation text,
  testimonial text,
  rating int,
  status text default 'Active',
  created_at timestamptz default now()
);

create table enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text,
  mobile text,
  service_interested text,
  message text,
  type text,
  status text default 'New',
  created_at timestamptz default now()
);

create table website_settings (
  id uuid primary key default gen_random_uuid(),
  company_name text,
  website text,
  sales_email text,
  info_email text,
  phone text,
  address text,
  social_links jsonb,
  footer_content text,
  privacy_policy_url text,
  terms_url text,
  updated_at timestamptz default now()
);

create table seo_settings (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  title text,
  meta_description text,
  meta_keywords text,
  og_image_url text,
  updated_at timestamptz default now()
);
```

## Deployment Notes

1. Keep the public website deployed as a static Vite build or move it to Next.js.
2. Deploy the backend API separately on a Node-capable host.
3. Store uploaded resumes, blog images and client logos in object storage or a CDN-backed uploads folder.
4. Protect admin APIs with JWT and role checks.
5. Hash admin passwords using bcrypt.
6. Use HTTPS only.
7. Add daily database backup.
8. Restrict file upload types and scan uploads before serving publicly.

## Current Local Build

Run:

```text
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173/admin
```
