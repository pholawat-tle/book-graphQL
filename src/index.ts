import * as dotenv from 'dotenv';

dotenv.config();

(async function appInitializer () {
  await import('./app');
})();

