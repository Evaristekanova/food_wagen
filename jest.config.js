// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
    "!src/**/__tests__/**",
    "!src/**/__mocks__/**",
    "!src/app/layout.tsx",
    "!src/app/page.tsx",
  ],
  // Performance optimizations
  maxWorkers: "50%",
  testTimeout: 10000,
  // Force Jest to exit after tests complete
  forceExit: true,
  // Only collect coverage from files that are actually tested
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/__tests__/",
    "/__mocks__/",
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
