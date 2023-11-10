import * as path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,

    coverage: {
      provider: 'istanbul',
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
      include: ['src/main'],
    },
    globalSetup: 'globalSetup.ts',
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src/main') }],
  },
});
