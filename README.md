# StudyHub 📚
...

> **Study Together, Achieve More**

StudyHub is a modern collaborative learning platform that enables students to create synchronized study sessions, share notes, and stay motivated through real-time collaboration. Built with Next.js 15, TypeScript, and modern web technologies.

## ✨ Features

### 🏠 **Study Rooms**

- Create public or private study rooms with customizable settings
- Role-based permissions (Owner, Moderator, Member)
- Real-time member management and activity tracking
- Password protection for private rooms
- Room capacity limits and member status tracking

### ⏱️ **Synchronized Timers**

- Pomodoro timers that sync across all room members
- Customizable focus and break durations
- Real-time timer synchronization for group study sessions
- Audio notifications and visual indicators

### 📝 **Collaborative Notes**

- Rich text editor with formatting tools (bold, italic, headings, lists)
- Personal notes within study rooms
- Export notes as Markdown or PDF
- Search and organize notes efficiently

### 💬 **Real-time Chat**

- Instant messaging within study rooms
- System notifications for member activities
- File sharing and resource exchange

### 👥 **User Management**

- Secure authentication with Google and GitHub OAuth
- User profiles with customizable settings
- Role-based access control (User, Moderator, Admin)
- Activity tracking and session history

### 🌐 **Internationalization**

- Full support for English and Spanish
- Localized UI components
- Easy language switching
- RTL support ready

### 📊 **Analytics & Moderation**

- Comprehensive admin dashboard
- User activity analytics
- Session tracking
- Content moderation tools
- Real-time platform statistics

## 🚀 Tech Stack

### **Frontend**

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations
- **React Query** - Server state management
- **Redux Toolkit** - Client state management

### **Backend**

- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js** - Authentication solution
- **Prisma** - Database ORM
- **MongoDB** - NoSQL database
- **Pusher** - Real-time WebSocket connections

### **Additional Tools**

- **Cloudinary** - Image and file management
- **Resend** - Email service
- **Slate.js** - Rich text editor
- **Recharts** - Data visualization
- **Jest** - Testing framework
- **Storybook** - Component development
- **ESLint & Prettier** - Code quality tools

## 📦 Installation

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- MongoDB database
- Cloudinary account (for file uploads)
- Pusher account (for real-time features)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/studyhub.git
cd studyhub
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment setup

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
# Database
DATABASE_URL="your-mongodb-connection-string"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# Pusher
PUSHER_APP_ID="your_pusher_id"
PUSHER_SECRET="your_pusher_secret"
NEXT_PUBLIC_PUSHER_KEY="your_pusher_key"
NEXT_PUBLIC_PUSHER_CLUSTER="your_pusher_cluster"
```

### 4. Database setup

```bash
# Generate Prisma client
pnpm db:generate

# Push database schema
pnpm db:push

# Open Prisma Studio (optional)
pnpm db:studio
```

### 5. Start development server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting

# Testing
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:studio        # Open Prisma Studio

# Storybook
pnpm storybook        # Start Storybook dev server
pnpm build-storybook  # Build Storybook
```

### Project Structure

```
studyhub/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   ├── api/               # API routes
│   └── auth/              # Authentication pages
├── components/            # Shared UI components
├── features/              # Feature-based modules
│   ├── auth/             # Authentication
│   ├── rooms/            # Study rooms
│   ├── notes/            # Collaborative notes
│   ├── chat/             # Real-time chat
│   ├── timer/            # Pomodoro timers
│   ├── dashboard/        # User dashboard
│   ├── moderator/        # Moderation tools
│   └── profile/          # User profiles
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── messages/             # Internationalization files
├── prisma/               # Database schema
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

### Feature Architecture

Each feature follows a consistent structure:

```
features/[feature-name]/
├── components/           # React components
├── hooks/               # Custom hooks
├── services/            # API services
├── types/               # TypeScript types
└── utils/               # Utility functions
```

## 🌍 Internationalization

StudyHub supports multiple languages with full localization:

- **English** (default)
- **Spanish** (Español)

### Adding New Languages

1. Create new message files in `messages/[locale].json`
2. Add the locale to `i18n/config.ts`
3. Update the language selector component

### Translation Structure

```json
{
  "common": {
    /* Shared translations */
  },
  "auth": {
    /* Authentication */
  },
  "rooms": {
    /* Study rooms */
  },
  "notes": {
    /* Notes feature */
  },
  "moderator": {
    /* Moderation */
  }
}
```

## 🔐 Authentication

StudyHub uses NextAuth.js with multiple providers:

- **Email/Password** - Traditional authentication
- **Google OAuth** - Sign in with Google
- **GitHub OAuth** - Sign in with GitHub

### User Roles

- **User** - Basic access to study rooms and notes
- **Moderator** - Additional moderation capabilities
- **Admin** - Full platform administration

## 📱 Responsive Design

StudyHub is fully responsive and works seamlessly across:

- **Desktop** - Full-featured experience
- **Tablet** - Optimized touch interface
- **Mobile** - Mobile-first responsive design

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Test Structure

- **Unit Tests** - Component and utility testing
- **Integration Tests** - Feature workflow testing
- **API Tests** - Backend endpoint testing

## 📚 Storybook

Develop and test components in isolation:

```bash
pnpm storybook
```

Visit [http://localhost:6006](http://localhost:6006) to view the component library.

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Environment Variables

Ensure all production environment variables are configured:

- Database connection
- OAuth credentials
- Third-party service keys
- Security secrets

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

### Code Standards

- **TypeScript** - Strict type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Conventional Commits** - Commit message format

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [Prisma](https://www.prisma.io/) - Database toolkit
- [NextAuth.js](https://next-auth.js.org/) - Authentication

## 📞 Support

- **Issues** - [GitHub Issues](https://github.com/monir178/studyhub/issues)

- **Email** - monir.mzs17@gmail.com

---

<div align="center">
  <p>Made with ❤️ by Md Moniruzzaman Monir</p>
  <p>
    <a href="https://www.monir178.live">Developer Portfolio</a>
    <a href="https://github.com/monir178">GitHub</a>
  </p>
</div>
