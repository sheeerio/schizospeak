import moment from "moment-timezone";
import ct from "countries-and-timezones";

const getUserCountry = () => {
    return ct.getCountryForTimezone(moment.tz.guess());
};

export default getUserCountry;
