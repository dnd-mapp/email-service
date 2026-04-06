import { parseInteger } from './parse-integer';

describe('parseInteger', () => {
    it('should parse an integer', () => {
        expect(parseInteger(200, '400')).toEqual(400);
    });

    it('should use fallback when no value is provided', () => {
        expect(parseInteger(200, undefined)).toEqual(200);
    });

    it('should use fallback when invalid string value is provided', () => {
        expect(parseInteger(200, 'random string')).toEqual(200);
    });
});
