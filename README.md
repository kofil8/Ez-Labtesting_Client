# EZ Lab Testing - Frontend Application

A modern, full-featured lab testing platform built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Complete Test Ordering Flow**: Browse tests, add to cart, and checkout with secure payment
- **User Authentication**: Login, signup, and MFA verification
- **Results Dashboard**: View and download lab test results
- **Admin Panel**: Manage tests, view orders, and track analytics
- **Location-Based Lab Routing**: Optimize lab selection based on user location
- **Featured Test Bundles**: Pre-configured test panels with savings
- **Responsive Design**: Mobile-first approach with full tablet and desktop support
- **HIPAA-Compliant UI**: Secure, privacy-focused interface
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Form Validation**: React Hook Form + Zod
- **Icons**: Lucide React

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🗂 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (shop)/            # Shopping pages (tests, cart, checkout)
│   ├── results/           # Results and order history
│   ├── admin/             # Admin dashboard
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── shared/           # Shared components (Header, Footer)
│   ├── auth/             # Authentication forms
│   ├── tests/            # Test browsing components
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout flow
│   ├── results/          # Results display
│   ├── admin/            # Admin components
│   └── home/             # Home page components
├── lib/                   # Utilities and helpers
│   ├── schemas/          # Zod validation schemas
│   ├── store/            # Zustand stores
│   ├── auth-context.tsx  # Authentication context
│   ├── api.ts            # API functions (mock)
│   └── utils.ts          # Utility functions
├── types/                 # TypeScript type definitions
├── data/                  # Mock data (JSON)
└── public/               # Static assets
```

## 🎯 Key Pages

- **`/`** - Home page with featured bundles
- **`/tests`** - Test catalog with search and filters
- **`/tests/[testId]`** - Individual test details
- **`/cart`** - Shopping cart
- **`/checkout`** - Checkout form
- **`/login`** - User login
- **`/signup`** - User registration
- **`/mfa`** - Two-factor authentication
- **`/results`** - Order history
- **`/results/[orderId]`** - Individual test results
- **`/admin`** - Admin dashboard
- **`/admin/tests`** - Test management

## 🔐 Authentication

The application uses mock authentication stored in localStorage for development. Key features:

- Email/password login
- MFA support (mock 6-digit code)
- Session persistence
- Role-based access (customer/admin)

### Demo Credentials

- **Customer**: Any email without "admin"
- **Admin**: Email containing "admin"
- **MFA**: Email containing "mfa"
- **Password**: Any 8+ character password

## 🛒 Shopping Flow

1. Browse tests or bundles
2. Add items to cart
3. Review cart and apply promo codes (SAVE10, WELCOME20, HEALTH25)
4. Complete checkout form with customer information
5. Accept HIPAA consent and terms
6. Place order

## 📊 Mock Data

The application uses JSON files for mock data:

- **`data/tests.json`** - 22 lab tests with full details
- **`data/orders.json`** - Sample orders
- **`data/results.json`** - Sample test results
- **`data/panels.json`** - Featured test bundles

## 🎨 UI/UX Features

- **Animations**: Smooth transitions using Framer Motion
- **Loading States**: Skeleton loaders and spinners
- **Toast Notifications**: User feedback for actions
- **Form Validation**: Real-time validation with helpful error messages
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Accessibility**: ARIA labels, keyboard navigation, focus management

## 🔧 Configuration

### Tailwind Theme

Custom color palette optimized for medical/health applications with trust-building blues.

### shadcn/ui

Pre-configured with "New York" style. Components can be customized in `components/ui/`.

## 🚀 Deployment

```bash
# Build the project
npm run build

# The build output will be in .next/
# Deploy to Vercel, Netlify, or any Node.js hosting platform
```

## 📝 Environment Variables

Create a `.env.local` file for future API integration:

```env
NEXT_PUBLIC_API_URL=your_api_url_here
```

## 🧪 Testing

The application is ready for end-to-end testing with:

- Playwright
- Cypress
- Jest + React Testing Library

## 🔒 Security Considerations

- All user inputs are sanitized
- Form validation prevents malicious input
- HIPAA consent required before checkout
- No PHI stored in localStorage (only order IDs)
- XSS protection via React's built-in escaping

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## 🤝 Contributing

This is a demo project. For production use:

1. Replace mock API calls with real backend integration
2. Implement actual payment processing
3. Add server-side authentication
4. Connect to real laboratory systems
5. Implement proper error tracking
6. Add comprehensive testing

## 📄 License

This project is for demonstration purposes.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
