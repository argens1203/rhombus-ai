import Complex from 'complex.js';
import { DateTime } from 'luxon';

export function parseValue(type: string, value: any) {
    switch (type) {
        case 'Datetime':
            return DateTime.fromISO(value);
        case 'Str':
            return value;
        case 'Complex':
            if (!value) return value;
            if (value.match(/.*nan.*/)) return Number.NaN;
            const s = value.replace('j', 'i').replace('(', '').replace(')', '');
            return new Complex(s);
        default:
            return value;
    }
}
