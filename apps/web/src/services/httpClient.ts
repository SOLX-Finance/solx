import axios from 'axios';

import { env } from '../config/env';

export const httpClient = axios.create({
  baseURL: env.api.url,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
