import { Dimensions } from 'react-native';
import Moment from 'moment';

const screen_width = Dimensions.get("window").width;
const screen_height = Dimensions.get("window").height;

const EMAIL_VALIDATE = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

export const screen = {
    width: screen_width,
    height: screen_height
}

export const isValidEmail = (email) => {
    return EMAIL_VALIDATE.test(String(email).toLowerCase());
}

export const DATE2STR = (date) => {
    if (!date) return '';
    return Moment(date).format('D MMM HH:mm');
}

export const relativeTime = (date) => {
    if (!date) return '';
    const now = Moment();
    const expiration = Moment(date).add(-50, 'seconds');
    const diff = now.diff(expiration);
    const diffDuration = Moment.duration(diff);
    const days = diffDuration.days();
    const hours = diffDuration.hours();
    const mins = diffDuration.minutes();
    const secs = diffDuration.seconds();
    if (days <= 0) {
        if (hours <= 0) {
            if (mins <= 0) return `${secs} second${secs > 1 ? 's ago' : ' ago'}`;
            else return `${mins} minute${mins > 1 ? 's ago' : ' ago'}`;
        } else {
            return `${hours} hour${hours > 1 ? 's ago' : ' ago'}`;
        }
    } else if (days < 3) {
        return `${days} day${days > 1 ? 's ago' : ' ago'}`;
    }
    return DATE2STR(date);
}