# 🎬 Streaming Landscape Explorer

An interactive web application that tells the story of how movies and shows vary by genre, country, language, runtime, and ratings. Built with a Netflix-inspired dark UI.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748)
![Neon](https://img.shields.io/badge/Neon-Postgres-00E5A0)

## ✨ Features

- **Global Content Timeline**: Visualize how the catalog has evolved over time with interactive stacked area charts
- **Genre & Quality Explorer**: Explore relationships between genres, ratings, and popularity through scatter plots
- **Country Choropleth Map**: Discover geographic diversity with an interactive world map
- **Dynamic Insights**: Real-time insight cards that update based on your filters
- **Netflix-Inspired UI**: Dark theme with vibrant accent colors

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Neon Postgres (via Prisma ORM)
- **Visualizations**: Nivo + React Simple Maps
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Neon Postgres database (or Vercel Postgres)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DakshK26/Streaming-Landscape-Explorer.git
   cd Streaming-Landscape-Explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your Neon/Postgres connection strings.

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Download and seed the Netflix dataset**
   - Download the [Netflix Movies and TV Shows dataset](https://www.kaggle.com/datasets/shivamb/netflix-shows) from Kaggle
   - Place `netflix_titles.csv` in the `/data` folder
   - Run the seed script:
     ```bash
     npm run db:seed
     ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## 📊 Data Source

This project uses the [Netflix Movies and TV Shows](https://www.kaggle.com/datasets/shivamb/netflix-shows) dataset from Kaggle, which includes:

- ~8,800 titles (movies and TV shows)
- Release years from 1925 to 2021
- 42 unique genres
- 123 countries represented

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📁 Project Structure

```
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Data seeding script
├── src/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── page.tsx      # Main dashboard
│   │   └── layout.tsx    # Root layout
│   ├── components/       # React components
│   │   ├── charts/       # Visualization components
│   │   ├── filters/      # Filter components
│   │   └── insights/     # Insight card components
│   └── lib/              # Utility functions
├── data/                 # Netflix CSV (not committed)
└── public/               # Static assets
```

## 🚢 Deployment

This project is optimized for Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `DATABASE_URL` - Your Neon pooled connection string
   - `DIRECT_URL` - Your Neon direct connection string
3. Deploy!

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.
