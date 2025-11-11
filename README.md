# Food Wagen

A modern food ordering application built with Next.js, React, and TypeScript. This application allows users to browse meals, search for food items, and manage meal data.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js** (version 18.x or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** or **pnpm**
- **Git** - [Download Git](https://git-scm.com/)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd food_wagen
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

Or using pnpm:

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory of the project:

```bash
# Create the environment file
touch .env.local
```

Add the following environment variable to `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=your_api_base_url_here
```

**Note:** Replace `your_api_base_url_here` with your actual API base URL. For example:

- `NEXT_PUBLIC_API_BASE_URL=https://api.example.com`
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api`

If you don't have an API backend yet, you can leave it empty or use a mock API service.

### 4. Run the Development Server

Start the development server:

```bash
npm run dev
```

Or using yarn:

```bash
yarn dev
```

Or using pnpm:

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

Open your browser and navigate to the URL to see the application.

### 5. Build for Production

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:fast` - Run tests without coverage

## Technologies Used

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query (TanStack Query)** - Data fetching and caching
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Jest** - Testing framework
- **Testing Library** - Component testing utilities

## Features

- Browse and search meals
- Add new meals
- Edit existing meals
- Delete meals
- Search functionality
- Responsive design
- Form validation
- Modern UI with animations

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

View coverage reports in the `coverage/` directory after running the coverage command.

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, Next.js will automatically use the next available port (3001, 3002, etc.).

### Environment Variables Not Loading

- Ensure your `.env.local` file is in the root directory
- Restart the development server after adding environment variables
- Make sure variable names start with `NEXT_PUBLIC_` for client-side access

### Dependencies Installation Issues

If you encounter issues installing dependencies:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

### API Connection Issues

- Verify your `NEXT_PUBLIC_API_BASE_URL` is correct
- Check if your API server is running
- Ensure CORS is properly configured on your API server
