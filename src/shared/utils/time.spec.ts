import { convertTime, TimeUnits } from './time';

describe('time', () => {
    describe('convertTime', () => {
        it('should throw an error when converting to a higher unit value', () => {
            expect(() => convertTime(1, TimeUnits.DAYS, TimeUnits.WEEKS)).toThrow();
        });

        it('should return the value unconverted if target and source are equal', () => {
            // Default for source and target are milliseconds.
            expect(convertTime(1)).toEqual(1);

            expect(convertTime(1, TimeUnits.WEEKS, TimeUnits.WEEKS)).toEqual(1);
            expect(convertTime(1, TimeUnits.DAYS, TimeUnits.DAYS)).toEqual(1);
            expect(convertTime(1, TimeUnits.HOURS, TimeUnits.HOURS)).toEqual(1);
            expect(convertTime(1, TimeUnits.MINUTES, TimeUnits.MINUTES)).toEqual(1);
            expect(convertTime(1, TimeUnits.SECONDS, TimeUnits.SECONDS)).toEqual(1);
        });

        it('should convert from weeks to milliseconds', () => {
            expect(convertTime(1, TimeUnits.WEEKS)).toEqual(604_800_000);
        });
    });
});
