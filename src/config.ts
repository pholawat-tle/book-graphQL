import * as invariant from 'invariant';

invariant(process.env.NODE_ENV, 'NODE_ENV is required in .env');

if (
  process.env.NODE_ENV !== 'development' &&
  process.env.NODE_ENV !== 'staging' &&
  process.env.NODE_ENV !== 'production' &&
  process.env.NODE_ENV !== 'test'
) {
  invariant(false, `NODE_ENV=${process.env.NODE_ENV} is invalid. Must be either development, staging, production, or test`);
}
