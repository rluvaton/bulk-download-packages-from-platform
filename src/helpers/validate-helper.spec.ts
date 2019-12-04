import {isNil} from './validate-helper';

describe('Validate Helper Tests', () => {
  describe('isNil Tests', () => {
    it('should have the function isNil', () => {
      expect(isNil).toBeDefined();
      expect(typeof isNil).toBe('function');
    });

    it('should return true for null argument', () => {
      expect(isNil(null)).toBe(true);
    });

    it('should return true for undefined argument', () => {
      expect(isNil(undefined)).toBe(true);
    });

    it('should return false for false argument (falsy argument)', () => {
      expect(isNil(false)).toBe(false);
    });

    it('should return false for 0 argument (falsy argument)', () => {
      expect(isNil(0)).toBe(false);
    });

    it('should return false for \'0\' argument (falsy argument)', () => {
      expect(isNil('0')).toBe(false);
    });

    it('should return false for NaN argument (falsy argument)', () => {
      expect(isNil(NaN)).toBe(false);
    });

    describe('should return false for empty string argument (falsy argument)', () => {
      it('should return false for \'\' argument (falsy argument)', () => {
        expect(isNil('')).toBe(false);
      });

      it('should return false for `` argument (falsy argument)', () => {
        expect(isNil(``)).toBe(false);
      });

      it('should return false for "" argument (falsy argument)', () => {
        // tslint:disable-next-line:quotemark
        expect(isNil('')).toBe(false);
      });
    });

    it('should return false for true argument (truthy argument)', () => {
      expect(isNil(true)).toBe(false);
    });

    it('should return false for \' \' argument (truthy argument)', () => {
      expect(isNil(' ')).toBe(false);
    });

    it('should return false for empty object argument (truthy argument)', () => {
      expect(isNil({})).toBe(false);
    });

    it('should return false for object argument (truthy argument)', () => {
      expect(isNil({a: ''})).toBe(false);
    });

    it('should return false for empty array argument (truthy argument)', () => {
      expect(isNil([])).toBe(false);
    });

    it('should return false for array argument (truthy argument)', () => {
      expect(isNil([null])).toBe(false);
    });

    it('should return false for number argument (truthy argument)', () => {
      expect(isNil(3)).toBe(false);
    });

    it('should return false for function argument (truthy argument)', () => {
      expect(isNil(() => {})).toBe(false);
    });
  });
});
