# Academic Content Management System

## Overview

This is a full-stack web application for managing academic content including semesters and units. The system allows administrators to create and manage educational content with features for organizing courses by academic parameters like year, semester, branch, and pattern. It's built with a React frontend and Express.js backend, using Drizzle ORM for database operations.

## Recent Changes (July 18, 2025)

✓ Updated dropdown options:
  - Patterns: Only 2019 and 2024 Pattern
  - Academic Years: FE, SE, TE, BE
  - Semesters: Only 1 and 2
  - Branches: Added Information Technology, AIDS, AIML
  - Universities: SPPU, Mumbai, Pune (dropdown selection)
✓ Made all form fields required (removed optional labels)
✓ Added Google Drive URL auto-conversion (view → preview)
✓ Updated validation schemas for all required fields
✓ Removed Analytics and Settings from navigation

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod schemas for API request validation
- **Session Management**: PostgreSQL-based session storage
- **Development**: Hot reload with tsx for server-side development

### Data Storage
- **Database**: PostgreSQL (configured via Drizzle)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Location**: Shared between client and server in `/shared/schema.ts`
- **Migrations**: Generated in `/migrations` directory

## Key Components

### Database Schema
- **Users Table**: Basic user authentication with username/password
- **Semesters Table**: Academic semester information including title, description, pattern, year, semester, branch, university, and syllabus array
- **Units Table**: Individual units within semesters including title, academic parameters, description, PDF URL, YouTube links array, and questions array

### API Routes
- **POST /api/semester**: Create new semester with enhanced validation
- **POST /api/unit**: Create new unit with enhanced validation (URL validation for PDF files and YouTube links)
- **GET /api/semesters**: Retrieve all semesters
- **GET /api/units**: Retrieve all units

### Frontend Pages
- **Admin Panel**: Main interface for creating semesters and units with tabbed navigation
- **404 Page**: Simple not found page with helpful messaging

### Validation System
- **Server-side**: Enhanced Zod schemas with specific validation rules
- **Client-side**: Form validation using react-hook-form with Zod resolvers
- **Shared Types**: Common validation schemas shared between client and server

## Data Flow

1. **User Input**: Forms in the admin panel collect semester/unit data
2. **Client Validation**: React Hook Form validates input using Zod schemas
3. **API Request**: TanStack Query sends validated data to Express endpoints
4. **Server Validation**: Express routes re-validate using enhanced Zod schemas
5. **Database Operation**: Drizzle ORM performs type-safe database operations
6. **Response**: Success/error responses sent back to client
7. **UI Update**: TanStack Query updates cache and triggers re-renders

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver optimized for serverless
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form state management and validation
- **@hookform/resolvers**: Zod integration for form validation

### UI Component Libraries
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **class-variance-authority**: Utility for component variant styling
- **clsx & tailwind-merge**: Conditional CSS class management
- **cmdk**: Command palette component
- **embla-carousel-react**: Carousel/slider functionality

### Development Tools
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit integration for development

## Deployment Strategy

### Development
- **Client**: Vite dev server with hot module replacement
- **Server**: tsx with file watching for automatic restarts
- **Database**: Environment-based PostgreSQL connection via DATABASE_URL
- **Integration**: Vite middleware integration for seamless full-stack development

### Production Build
- **Client**: Vite production build output to `/dist/public`
- **Server**: esbuild bundle to `/dist/index.js` with external package handling
- **Database**: Drizzle migrations applied via `npm run db:push`
- **Deployment**: Single Node.js process serving both API and static files

### Configuration
- **Environment Variables**: DATABASE_URL required for database connection
- **Build Process**: Parallel client and server builds with esbuild
- **Static Serving**: Express serves Vite-built client files in production
- **Error Handling**: Centralized error middleware with proper HTTP status codes