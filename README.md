# Hauling & Removal Services Directory

A nationwide directory website that connects consumers with local hauling and removal service providers. Search by city, state, or zip code to find trusted professionals for estate cleanout services and junk removal.

## 📦 Version History

### v2.0.0 — Lead Generation Pipeline (2026-04-05)
- Added `junk_hauling_launcher.py` — a nationwide lead generation pipeline built on the Apify Google Maps Scraper (`compass/crawler-google-places`)
- Parameterized search term via `--search` flag — run any service category (junk hauling, estate cleanout, furniture removal, etc.) against the same 260-city national footprint
- 260-city coverage across all 50 states organized into three tiers (Tier 1: CA/TX/FL/NY, Tier 2: 18 mid-size states, Tier 3: 28 smaller states)
- Batched execution engine — submits runs in groups of 7 at 4,096 MB memory each, staying within Apify Starter plan's 32,768 MB combined memory ceiling
- Per-batch polling at 50-second intervals with `while` loop — continues until all runs in a batch reach terminal state regardless of duration
- Separate tracking file and CSV output per search term — multiple searches run independently without overwriting each other
- `kill` command — immediately aborts all active Apify runs to stop costs, requires typing `KILL` to confirm
- `diagnose` command — full per-city breakdown of status and item counts before committing to retry or harvest
- Fixed item count reading — `compass/crawler-google-places` uses pay-per-event pricing where `stats.itemCount` always returns 0; item counts now read directly from the dataset API
- `harvest` now filters on `status == SUCCEEDED` rather than cached item count, and writes real counts back to tracking after fetch

### v1.0.0 — Initial Release
- Directory website with nationwide coverage
- Next.js 16 + Supabase + Tailwind CSS 4
- Business listings, reviews, and search functionality

## 🤖 Built with Claude Code
This project was built using Claude Code as the primary development agent, authored by **achatter** and **Claude**. Claude Code handled the majority of scaffolding, component generation, database schema design, PR workflows, and the entire lead generation pipeline — with achatter's direction on architecture decisions, product requirements, and code review. The goal was to validate what a solo practitioner can ship with agentic AI tooling and a real production stack. Claude Code + Supabase + GitHub PR workflows made a full-featured directory product achievable without a team.

## 🌟 Features

- **Nationwide Coverage**: Search for services by city, state, or zip code
- **Service Categories**:
  - Estate Cleanout Services
  - Junk Removal
- **Business Listings**: Detailed provider profiles with contact information and services
- **Customer Reviews**: Read and leave reviews for service providers
- **Responsive Design**: Clean, smooth UX/UI across all devices
- **Advanced Search**: Filter results by location and service type
- **Lead Generation Pipeline**: Automated nationwide scraping of Google Maps listings across 260 cities and all 50 states

## 🗺 Lead Generation Pipeline

The pipeline (`junk_hauling_launcher.py`) scrapes Google Maps for any service category across a fixed 260-city national footprint and produces a deduplicated CSV with contact details, social profiles, ratings, and GPS coordinates.

### City Coverage

| Tier | States | Cities per State | Total Cities |
|---|---|---|---|
| Tier 1 | CA, TX, FL, NY | 10 | 40 |
| Tier 2 | PA, IL, OH, GA, NC, WA, AZ, MI, NJ, CO, VA, TN, IN, MA, MO, MD, WI, MN | 6 | 108 |
| Tier 3 | AK, AL, AR, CT, DE, HI, IA, ID, KS, KY, LA, ME, MS, MT, ND, NE, NH, NM, NV, OK, OR, RI, SC, SD, UT, VT, WV, WY | 4 | 112 |

### Output Fields

Each record includes: state, state code, scraped city, business name, category, address, city, postal code, phone, email, all emails, website, rating, review count, latitude, longitude, Facebook, Instagram, LinkedIn, YouTube, TikTok, Twitter, Google Maps URL.

### Commands

```bash
# Install dependency
pip install requests

# Set your Apify API token
export APIFY_TOKEN=apify_api_xxxxxxxxxxxxxxxxxxxx

# Launch — all 260 cities or by tier
python junk_hauling_launcher.py launch --search "junk hauling"
python junk_hauling_launcher.py launch --search "estate cleanout" tier1
python junk_hauling_launcher.py launch --search "estate cleanout" tier2
python junk_hauling_launcher.py launch --search "estate cleanout" tier3

# Check progress
python junk_hauling_launcher.py status   --search "junk hauling"
python junk_hauling_launcher.py diagnose --search "junk hauling"

# Re-submit any failed or 0-item runs
python junk_hauling_launcher.py retry   --search "junk hauling"

# Stop all active runs immediately (requires typing KILL)
python junk_hauling_launcher.py kill    --search "junk hauling"

# Export results to CSV
python junk_hauling_launcher.py harvest --search "junk hauling"

# Start fresh (requires typing YES)
python junk_hauling_launcher.py reset   --search "junk hauling"
```

### Requirements

- Python 3.8+
- `pip install requests`
- Apify account with Starter plan or above
- Apify billing limit set above $135 (subscription + scraping costs)

## 🛠 Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) with React 19
- **Database**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) with [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)
- **TypeScript**: Full type safety
- **Lead Generation**: [Apify](https://apify.com/) — `compass/crawler-google-places`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase account (for database)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/achatter/haulandremove.git
cd haulandremove
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Add your Supabase credentials to `.env.local`

4. Set up the database:
```bash
npm run seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run end-to-end tests
- `npm run seed` - Seed database with sample data

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── api/             # API routes
│   ├── categories/      # Service category pages
│   ├── listings/        # Business listing pages
│   └── search/          # Search functionality
├── components/          # React components
│   ├── home/           # Homepage components
│   ├── layout/         # Layout components
│   ├── listings/       # Business listing components
│   ├── reviews/        # Review system components
│   ├── search/         # Search components
│   └── ui/             # Reusable UI components
├── lib/                # Utilities and configuration
│   ├── db/             # Database operations
│   ├── seed/           # Database seeding
│   └── supabase/       # Supabase configuration
└── types/              # TypeScript type definitions

junk_hauling_launcher.py  # Nationwide lead generation pipeline
```

## 🗄 Database Schema

The application uses Supabase with the following main tables:
- `businesses` - Service provider information
- `reviews` - Customer reviews and ratings
- `business_images` - Business photo galleries

See `supabase/schema.sql` for the complete database schema.

## 🧪 Testing

- **Unit Tests**: Components and utilities tested with Vitest
- **E2E Tests**: Critical user flows tested with Playwright
- **Test Coverage**: Run `npm test` for unit tests, `npm run test:e2e` for end-to-end tests

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)

## 🌐 Deployment

The application is optimized for deployment on [Vercel](https://vercel.com):

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

Built with ❤️ by [achatter](https://github.com/achatter) and [Claude](https://claude.ai) using Next.js, Supabase, and Apify
