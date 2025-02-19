/**
 * Here we load all the enviroment variables that we have,
 * and we do some required configurations...
 */
import dotenv from 'dotenv';

dotenv.config();

export const DEVELOPMENT = process.env.NODE_ENV === 'development';
export const TEST = process.env.NODE_ENV === 'test';
export const PRODUCTION = process.env.NODE_ENV === 'production';

export const SERVER = {
    // NOTE: con el tiempo iremos acomodando estos valores... verificar si no chocan con nest...
};