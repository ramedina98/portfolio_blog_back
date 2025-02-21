/**
 * @function generateRandomNumber
 * This function generates a random number between the specified minimum and maximum values (inclusive).
 *
 * Author: Ricardo Medina
 * Date: 20 de febrero de 2025
 *
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} - A random number between min and max (inclusive).
 */

const generateRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { generateRandomNumber };