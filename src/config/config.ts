/**
 * @module Config
 * This module loads all the environment variables and performs some required configurations.
 * It exports constants for different environments (development, test, production) and server configurations.
 *
 * Author: Ricardo Medina
 * Date: 20 de febrero de 2025
 */
import dotenv from 'dotenv';

dotenv.config();

export const DEVELOPMENT = process.env.NODE_ENV === 'development';
export const TEST = process.env.NODE_ENV === 'test';
export const PRODUCTION = process.env.NODE_ENV === 'production';

export const SERVER = {
    EHOST: process.env.EHOST || '',
    EPORT: parseInt(process.env.EPORT as string) || 0,
    EUSER: process.env.EUSER || '',
    EPASS: process.env.EPASS || '',
    EMAIL: process.env.EMAIL || '',
    EMAILW: process.env.EMAILW || '',
    WEB: process.env.WEB || ''
};