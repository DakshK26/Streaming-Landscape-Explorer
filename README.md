<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Nivo-0.99-FF6B6B?style=for-the-badge" alt="Nivo" />
  <img src="https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
</p>

# 🎬 Streaming Landscape Explorer

> An interactive data visualization dashboard that transforms 8,800+ Netflix titles into compelling visual stories, enabling intuitive exploration of content trends across time, genres, and global regions.

<p align="center">
  <a href="https://streaming-landscape-explorer.vercel.app">🌐 Live Demo</a>
</p>

---

## 📖 Overview

This project demonstrates expertise in **data storytelling through interactive visualization**—transforming a complex dataset into an intuitive, visually appealing experience that reveals insights about streaming content evolution.

The dashboard answers questions like:
- 📈 How has content production evolved over the decades?
- 🌍 Which countries produce the most content?
- 🎭 What genres dominate the catalog, and how have they trended?
- 🔍 What specific titles match my interests?

---

## ✨ Key Features

### 🎯 Interactive Visualizations
| Visualization | Description | Library |
|--------------|-------------|---------|
| **Content Timeline** | Stacked area chart showing Movies vs TV Shows over time | Nivo Line |
| **Genre Distribution** | Horizontal bar chart with click-to-filter interaction | Nivo Bar |
| **Genre Trends** | Multi-series line chart tracking genre growth since 2000 | Nivo Line |
| **Global Map** | Choropleth visualization of content by country | react-simple-maps |

### 🔮 Animated Insights Ticker
A polished, auto-rotating insights display featuring:
- Smooth crossfade transitions between data points
- Dynamic gradient backgrounds matching insight categories
- Progress indicator with manual navigation dots
- Key metrics: Top Genre, Peak Year, Top Producer, Movie/TV Ratio, and more

### 🔍 Smart Search
Full-text search with:
- Debounced autocomplete (300ms)
- Beautiful result cards with type badges
- Detailed modal with gradient headers, genres, cast, and descriptions
- Keyboard navigation support (Escape to close)

### 🎛️ Advanced Filtering
- **Genre Filter**: Multi-select with visual chips and genre consolidation
- **Type Filter**: Toggle between Movies, TV Shows, or both
- **Year Range Slider**: Dynamic range based on actual data bounds
- **Country Mode**: Switch between all countries or primary producer only

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Frontend (Next.js 16)                      │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Charts    │  │   Filters   │  │   Search    │  │  Insights   │ │
│  │  (Nivo)     │  │  (Context)  │  │  (Modal)    │  │  (Ticker)   │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘ │
│         │                │                │                │        │
│         └────────────────┴────────────────┴────────────────┘        │
│                                   │                                  │
│                          Filter Context API                          │
│                                   │                                  │
├─────────────────────────────────────────────────────────────────────┤
│                         API Layer (REST)                             │
│  /api/summary  /api/timeline  /api/genres  /api/countries  /api/... │
├─────────────────────────────────────────────────────────────────────┤
│                      Data Layer (Prisma ORM)                         │
│                                   │                                  │
│                          PostgreSQL Database                         │
└─────────────────────────────────────────────────────────────────────┘
```

### Frontend Stack
- **Framework**: Next.js 16 with App Router & Turbopack
- **UI**: React 19 with TypeScript for type safety
- **Styling**: Tailwind CSS 4 with custom design system
- **State**: React Context for cross-component filter synchronization
- **Data Fetching**: Custom `useFetch` hook with loading states

### Visualization Layer
- **Nivo Charts**: Declarative, responsive chart components
  - `ResponsiveLine` for timeline and trend charts
  - `ResponsiveBar` for genre distribution
  - Custom theming matching the dark UI
- **react-simple-maps**: Choropleth map with TopoJSON
  - 50+ country ISO code mappings
  - Interactive hover and click states

### Backend & Data
- **API Routes**: 8 RESTful endpoints with query parameter filtering
- **ORM**: Prisma with PostgreSQL for type-safe database access
- **Schema**: Normalized with Title, Genre, Country junction tables
- **Seeding**: CSV parsing with PapaParse for initial data load

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # REST API endpoints
│   │   ├── countries/          # Country statistics
│   │   ├── genres/             # Genre aggregations
│   │   ├── insights/           # Dynamic insight generation
│   │   ├── scatter/            # Scatter plot data
│   │   ├── search/             # Full-text title search
│   │   ├── summary/            # Dashboard summary stats
│   │   ├── timeline/           # Year-over-year data
│   │   └── titles/             # Paginated title listing
│   ├── globals.css             # Tailwind + custom animations
│   ├── layout.tsx              # Root layout with fonts
│   └── page.tsx                # Entry point
│
├── components/
│   ├── charts/
│   │   ├── ChoroplethMap.tsx   # World map visualization
│   │   ├── GenreBarChart.tsx   # Horizontal bar chart
│   │   ├── GenreTrendChart.tsx # Multi-line trend chart
│   │   └── TimelineChart.tsx   # Stacked area chart
│   ├── filters/
│   │   ├── GenreFilter.tsx     # Multi-select genre picker
│   │   ├── TypeFilter.tsx      # Movie/TV toggle
│   │   ├── YearRangeSlider.tsx # Dual-handle range slider
│   │   └── CountryModeToggle.tsx
│   ├── insights/
│   │   └── InsightCards.tsx    # Dynamic insight display
│   ├── layout/
│   │   └── Header.tsx          # App header with gradient logo
│   ├── AnimatedInsightsTicker.tsx  # Auto-rotating insights
│   ├── Dashboard.tsx           # Main dashboard orchestrator
│   └── MovieSearch.tsx         # Search with modal details
│
├── context/
│   └── FilterContext.tsx       # Global filter state management
│
├── hooks/
│   └── useFetch.ts             # Generic data fetching hook
│
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   └── genreConsolidation.ts   # Genre normalization logic
│
└── types/
    └── index.ts                # Shared TypeScript interfaces
```

---

## 🎨 Design Decisions

### Color System
Built a cohesive dark theme optimized for data visualization:
- **Background**: Zinc-950 with subtle grid pattern
- **Primary Accent**: Violet-500 → Fuchsia-400 gradients
- **Secondary**: Cyan-400 for contrast and TV Show indicators
- **Data Colors**: Carefully chosen for accessibility and distinction

### Typography & Hierarchy
- Clear visual hierarchy with uppercase labels and bold values
- Truncation with tooltips for long text in constrained spaces
- Responsive scaling from mobile to desktop

### Animation Philosophy
- **Purposeful motion**: Animations guide attention, not distract
- **Smooth transitions**: 300-500ms easing for state changes
- **Performance**: CSS transitions over JavaScript where possible

### Data Normalization
- **Genre Consolidation**: Merged variants like "TV Dramas" + "Dramas" → "Drama"
- **Country Mapping**: Mapped dataset country names to ISO codes for map accuracy
- **Null Handling**: Graceful fallbacks for missing data fields

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or use Vercel Postgres)

### Installation

```bash
# Clone the repository
git clone https://github.com/DakshK26/Streaming-Landscape-Explorer.git
cd Streaming-Landscape-Explorer

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# Push schema to database
npm run db:push

# Seed the database with Netflix data
npm run db:seed

# Start development server
npm run dev
```

### Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Production build with Prisma generation |
| `npm run test` | Run Jest test suite |
| `npm run db:studio` | Open Prisma Studio for data browsing |

---

## 📊 Data Source

This project uses the [Netflix Movies and TV Shows](https://www.kaggle.com/datasets/shivamb/netflix-shows) dataset from Kaggle, containing:
- **8,807 titles** (Movies & TV Shows)
- **42 unique genres** (consolidated from 513 combinations)
- **123 countries** of production
- **Content from 1925 to 2021**

---

## 🧪 Testing

```bash
npm run test
```

Unit tests cover:
- API endpoint responses
- Data transformation utilities
- Component rendering

---

## 🌐 Deployment

Deployed on **Vercel** with:
- Automatic builds on push to `main`
- Vercel Postgres for database
- Edge-optimized API routes

---

## 🎯 Skills Demonstrated

This project showcases competencies aligned with **data visualization engineering**:

| Skill Area | Implementation |
|------------|----------------|
| **Web Development** | Next.js 16, React 19, TypeScript, REST APIs |
| **Visualization Design** | Chart selection, color theory, responsive layouts |
| **Data Preparation** | ETL pipeline, genre normalization, country mapping |
| **User Experience** | Intuitive filtering, smooth animations, accessibility |
| **Application Design** | Component architecture, state management, code organization |

---

## 📬 Contact

**Daksh Khanna**  
[LinkedIn](https://linkedin.com/in/daksh-khanna) • [GitHub](https://github.com/DakshK26)

---

<p align="center">
  <i>Built with ☕ and a passion for turning data into stories</i>
</p>
