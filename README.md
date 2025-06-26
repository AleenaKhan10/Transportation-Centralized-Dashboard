# Agy Logistics Dashboard

A modern, scalable React + TypeScript dashboard for transportation business management, inspired by Agy Logistics with professional design and comprehensive user role authentication.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based auth with role-based permissions
- 🎨 **Beautiful UI** - Agy Logistics inspired design with smooth animations
- 📱 **Responsive Design** - Works perfectly on all devices
- 🚀 **High Performance** - Optimized with Vite and modern React patterns
- 🔧 **Scalable Architecture** - Component-based structure for easy maintenance
- 🌊 **Smooth Animations** - Framer Motion powered interactions
- 📊 **Data Visualization** - Interactive charts with Recharts
- 🎯 **TypeScript** - Full type safety throughout the application
- 🔄 **State Management** - Zustand for efficient state handling
- 🎨 **Tailwind CSS** - Utility-first styling with custom design system

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd age-logistics-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

### Demo Credentials

```
Email: admin@agelogistics.com
Password: admin123
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, etc.)
│   ├── auth/           # Authentication related components
│   ├── layout/         # Layout components (Sidebar, Header)
│   └── dashboard/      # Dashboard specific components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── store/              # Zustand stores
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── constants/          # App constants
└── assets/             # Static assets
```

## 🔧 Tech Stack

### Core
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

### State & Data
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **Recharts** - Charts and data visualization

### UI & Animation
- **Framer Motion** - Animations and gestures
- **Lucide React** - Icon library
- **Headless UI** - Unstyled, accessible UI components
- **React Hot Toast** - Notifications

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🎨 Design System

### Color Palette
- **Primary**: Blue (`#0ea5e9`) - Agy Logistics brand color
- **Secondary**: Teal (`#2dd4bf`) - Accent color
- **Dark**: Slate grays for dark theme
- **Accent**: Green, Red, Yellow for status indicators

### Typography
- **Headings**: Poppins (bold, modern)
- **Body**: Inter (clean, readable)

### Components
All components follow a consistent design pattern with:
- Hover animations
- Focus states
- Loading states
- Error handling
- Responsive behavior

## 🔐 Authentication & Permissions

### User Roles
- **Super Admin** - Full system access
- **Admin** - Most administrative functions
- **Manager** - Department management
- **Dispatcher** - Shipment coordination
- **Driver** - Route and delivery management
- **Viewer** - Read-only access

### Permission System
Fine-grained permissions for:
- Shipment management
- Fleet operations
- Driver management
- Analytics access
- System settings

### Security Features
- JWT token authentication
- Automatic token refresh
- Secure cookie storage
- Role-based route protection
- Permission-based UI rendering

## 📱 Responsive Design

The dashboard is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

Key responsive features:
- Collapsible sidebar on mobile
- Adaptive navigation
- Flexible grid layouts
- Touch-friendly interactions

## 🚀 Performance Optimizations

- **Code Splitting** - Dynamic imports for routes
- **Lazy Loading** - Components loaded on demand
- **Memoization** - React.memo and useMemo where appropriate
- **Bundle Optimization** - Vite's built-in optimizations
- **Image Optimization** - WebP support and lazy loading

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
```

### Adding New Features

1. **Create types** in `src/types/`
2. **Add services** in `src/services/`
3. **Create components** in appropriate folder
4. **Add routes** if needed
5. **Update permissions** if required

### Component Development

Follow these patterns:
```tsx
// Component with proper typing
interface ComponentProps {
  title: string;
  optional?: boolean;
}

const Component: React.FC<ComponentProps> = ({ title, optional = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card"
    >
      {/* Component content */}
    </motion.div>
  )
}

export default Component
```

## 📦 Build & Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Create `.env` file with:
```env
VITE_API_BASE_URL=https://your-api-url.com/api
VITE_NODE_ENV=production
```

### Deployment Options
- **Vercel** - Recommended for easy deployment
- **Netlify** - Alternative static hosting
- **Docker** - For containerized deployment
- **Traditional Web Server** - Serve the `dist` folder

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] Real-time tracking integration
- [ ] Advanced analytics dashboard  
- [ ] Mobile app companion
- [ ] API integration with FastAPI backend
- [ ] Document management system
- [ ] Customer portal

### Phase 3 Features
- [ ] AI-powered route optimization
- [ ] Predictive maintenance alerts
- [ ] Advanced reporting engine
- [ ] Multi-language support
- [ ] White-label solutions

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Agy Logistics** - Design inspiration
- **React Team** - Amazing framework
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Smooth animations
- **Lucide** - Beautiful icons

---

Built with ❤️ for modern transportation businesses 