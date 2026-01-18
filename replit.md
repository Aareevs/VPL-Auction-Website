# VPL Auction Dashboard

## Overview
A React-based auction dashboard for VPL (Virtual Premier League) 2026. This application allows users to participate in player auctions with authentication via Supabase.

## Tech Stack
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (via CDN)
- **Authentication & Database**: Supabase
- **Icons**: Lucide React

## Project Structure
```
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React context providers (Auth, Auction)
│   ├── lib/            # Supabase client configuration
│   ├── views/          # Page components (Home, Dashboard, Teams, Admin, Onboarding)
│   ├── App.tsx         # Main app with routing
│   └── index.tsx       # Entry point
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── constants.ts        # App constants
└── types.ts            # TypeScript type definitions
```

## Environment Variables
The app requires the following environment variables for full functionality:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Development
- **Port**: 5000
- **Command**: `npm run dev`

## Deployment
- **Type**: Static
- **Build**: `npm run build`
- **Public Directory**: `dist`
