import { convertTime, TimeUnits } from '@/shared-utils';

export const DEFAULT_SERVER_PORT = 4350;

export const PORT_RANGE_MIN = 1024;

export const PORT_RANGE_MAX = 65535;

export const DEFAULT_SERVER_HOST = '0.0.0.0';

export const DEFAULT_CORS_ORIGINS = ['https://localhost.www.dndmapp.dev:4200'];

export const CORS_MAX_AGE = convertTime(1, TimeUnits.HOURS, TimeUnits.SECONDS);

export const DEFAULT_DB_HOST = 'localhost';

export const DEFAULT_DB_PORT = 3306;

export const DEFAULT_DB_SCHEMA = 'my_db';

export const DEFAULT_DB_USER = 'root';
