<div align="center">
  <img src="public/logo.png" alt="VPL Logo" width="200" height="200" style="margin-bottom: 20px;">
  <h1>VPL Auction Dashboard 2026</h1>
  <p>The Ultimate Real-Time Auction Management System for the Vedam Premier League</p>
</div>

---

## 🏏 Project Overview

The **VPL Auction Dashboard** is a high-performance, real-time web application designed to manage the intensity of the **Vedam Premier League (VPL)** cricket auction. It provides a seamless experience for auctioneers, admin, and team owners, handling everything from live bidding wars to player stats and team purse management.

This system replaces manual tracking with a digital, interactive command center that ensures transparency, speed, and a premium visual experience akin to professional leagues like the IPL.

## ✨ Key Features

- **Real-Time Bidding**: Live updates of bids and current high bidders using Supabase Realtime.
- **Dynamic "Sold" Animations**: immersive, TV-style animations when a player is sold, featuring team colors, logos, and hammer effects.
- **Team Management**: Track purses, squad composition (Overseas/Indian balance), and remaining budget instantly.
- **Player Profiles**: Detailed stats cards for Batters, Bowlers, and All-Rounders with rich visuals.
- **Admin Command Center**: specialized controls for the auctioneer to start bids, sell players, or pass them.
- **Interactive Landing Page**: A visually engaging login page with a "Slanted Grid" animation of cricket legends.
- **Secure Authentication**: Role-based access (Admin, Team Owner, Spectator) powered by Supabase Auth (Google & Email).

## 🛠️ Tech Stack

This project is built using modern web technologies to ensure performance and scalability:

- **Frontend Framework**: [React](https://react.dev/) (with TypeScript)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom Design System)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Real-Time Sync**: Supabase Realtime
- **Authentication**: Supabase Auth (OAuth + Magic Links)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: Vercel optimized

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/your-username/vpl-auction-dashboard.git
    cd vpl-auction-dashboard
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add your Supabase credentials:

    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the App**
    ```bash
    npm run dev
    ```

---

<div align="center">
  <p>Built with ❤️ for the Love of Cricket</p>
</div>
