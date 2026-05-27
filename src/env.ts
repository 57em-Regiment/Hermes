import { createEnv } from '@t3-oss/env-core';
import 'dotenv/config';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
  },
  clientPrefix: 'VITE_',
  client: {
    // VITE_API_URL: z.url(),
  },
  runtimeEnv: import.meta.env || process.env,
  emptyStringAsUndefined: true,
});
