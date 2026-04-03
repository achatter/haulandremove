# Hauling & Removal Services Directory

A nationwide directory website that connects consumers with local hauling and removal service providers. Search by city, state, or zip code to find trusted professionals for estate cleanout services and junk removal.

## 🤖 Built with Claude Code
This project was built using Claude Code as the primary development agent. Claude Code handled the majority of scaffolding, component generation, database schema design, and PR workflows — with my direction on architecture decisions, product requirements, and code review. The goal was to validate what a solo practitioner can ship with agentic AI tooling and a real production stack. Claude Code + Supabase + GitHub PR workflows made a full-featured directory product achievable without a team.

## 🌟 Features

- **Nationwide Coverage**: Search for services by city, state, or zip code
- **Service Categories**: 
  - Estate Cleanout Services
  - Junk Removal
- **Business Listings**: Detailed provider profiles with contact information and services
- **Customer Reviews**: Read and leave reviews for service providers
- **Responsive Design**: Clean, smooth UX/UI across all devices
- **Advanced Search**: Filter results by location and service type

## 🛠 Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) with React 19
- **Database**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) with [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)
- **TypeScript**: Full type safety

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

Built with ❤️ using Next.js and Supabase
