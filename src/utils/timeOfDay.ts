/**
 * @function determineTimeTimeOfDay
 * This function helps to determine the time of the day based on the client's time zone.
 * It returns 'morning', 'afternoon', or 'evening' depending on the current hour in the specified time zone.
 *
 * Author: Ricardo Medina
 * Date: 20 de febrero de 2025
 *
 * @param {string} timeZone - The time zone of the client.
 * @returns {string} - The time of the day ('morning', 'afternoon', or 'evening').
 */
import moment from "moment-timezone";

const determineTimeTimeOfDay = (timeZone: string): string => {
    const currentHour: number = moment.tz(timeZone).hour(); // returns the client's current Hour...

    // determine if is morning, afternoon or evening

    if(currentHour >= 6 && currentHour <12){
        return 'morning';
    } else if(currentHour >= 12 && currentHour < 18){
        return 'afternoom';
    } else{
        return 'evening';
    }
}

export { determineTimeTimeOfDay };