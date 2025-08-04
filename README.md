# StudyHub - Collaborative Learning Platform

A modern, full-featured collaborative learning platform built with Next.js 15, featuring real-time collaboration, Pomodoro timers, and comprehensive study tools.

## 🚀 Features

- **Real-time Pomodoro Timers** - Synchronized across all study room members
- **Notes** - Taking notes for individual study rooms. And share all public study room notes.
- **Group Chat** - Instant messaging within study rooms
- **Study Rooms** - Create or join public/private rooms with role-based permissions
- **User Authentication** - NextAuth.js with email/password and OAuth providers
- **Internationalization** - Multi-language support (English & Spanish)
- **Dark/Light Mode** - Theme switching with system preference detection
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Real-time Sync** - Socket.IO powered real-time features
- **Media Uploads** - Cloudinary integration for profile images and attachments

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Prisma ORM
- **State Management**: Redux Toolkit
- **Real-time**: Socket.IO
- **Internationalization**: next-intl
- **Testing**: Jest + React Testing Library
- **Storybook**: Component documentation
- **Package Manager**: pnpm

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── features/             # Feature-based modules
│   ├── auth/             # Authentication feature
│   ├── chat/             # Chat feature
│   ├── notes/            # Notes feature
│   ├── rooms/            # Study rooms feature
│   └── timer/            # Timer feature
├── lib/                  # Utility libraries
├── messages/             # Internationalization messages
├── prisma/               # Database schema
├── stories/              # Storybook stories
└── types/                # TypeScript type definitions
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- MongoDB database

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd studyhub
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

- Database connection string
- NextAuth configuration
- OAuth provider credentials
- Cloudinary credentials

4. Set up the database:

```bash
pnpm db:generate
pnpm db:push
```

5. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📝 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests
- `pnpm storybook` - Start Storybook
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database
- `pnpm db:studio` - Open Prisma Studio

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

Generate coverage report:

```bash
pnpm test:coverage
```

## 📚 Storybook

View component documentation:

```bash
pnpm storybook
```

Build Storybook:

```bash
pnpm build-storybook
```

## 🌍 Internationalization

The app supports multiple languages using next-intl:

- English (default)
- Spanish

Add new languages by:

1. Creating message files in `/messages/`
2. Updating the locale configuration in `i18n.ts`

## 🎨 Theming

The app supports light/dark mode with system preference detection. Themes are configured using CSS custom properties in `globals.css`.

## 🚀 Deployment

The app is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Prisma](https://www.prisma.io/) - Next-generation ORM
