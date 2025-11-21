# nTraining

Professional training platform powered by ness.

Plataforma de treinamento de Segurança da Informação.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Design System**: ness branding
- **Fonts**: Inter (primary), Montserrat (display)
- **Database**: Supabase (PostgreSQL)

## Design System

### Colors
- **Primary**: #00ade8 (ness blue)
- **Background**: Deep slate grays (slate-950 to slate-100)
- **Text**: Slate-300/400 for body, white for headings

### Typography
- **Primary Font**: Inter (body text)
- **Display Font**: Montserrat (headings, medium weight)
- **Line Height**: Tight (1.25) for titles, Relaxed (1.625) for body

### Principles
- Minimalismo funcional
- Tipografia como protagonista
- Movimento sutil
- Cor com propósito
- Informação organizada

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env.local
```

Add your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

### Required Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (server-side only)

### Vercel Deployment

Configure these variables in your Vercel project settings:
- Project: `ntraining-platform` (or your project name)
- Settings → Environment Variables

## Project Structure

```
nTraining/
├── app/              # Next.js App Router pages
├── components/       # React components
│   └── ui/          # shadcn/ui components
├── lib/             # Utility functions
└── public/          # Static assets
```

## License

Private project - ness.
