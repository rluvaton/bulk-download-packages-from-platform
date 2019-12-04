import {isNil, isNumber} from './validate-helper';

describe('Validate Helper Tests', () => {
  describe('#isNil Tests', () => {
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
      expect(isNil(() => {
      })).toBe(false);
    });
  });

  describe('#isNumber Tests', () => {

    it('should have the function isNumber', () => {
      expect(isNumber).toBeDefined();
      expect(typeof isNumber).toBe('function');
    });

    describe('should return true for number argument', () => {
      it('includeNaN is false', () => {
        expect(isNumber(5, false)).toBe(true);
      });

      it('includeNaN is true', () => {
        expect(isNumber(5, true)).toBe(true);
      });
    });

    it('should be called with includeNaN as false when providing only 1 argument', () => {
      const isNumberMock = jest.fn(isNumber);
      isNumberMock('arg');
      expect(isNumberMock).toHaveBeenCalledWith('arg');
      expect(isNumberMock).toHaveReturnedTimes(1);
      expect(isNumberMock).toHaveBeenCalledTimes(1);
    });

    it('should return false for NaN without providing 2nd argument (includeNaN should be false)', () => {
      expect(isNumber(NaN)).toBe(false);
    });

    it('should return false for no arguments', () => {
      // @ts-ignore
      expect(isNumber()).toBe(false);
    });

    it('should return false for NaN argument and includeNaN is false', () => {
      expect(isNumber(NaN, false)).toBe(false);
    });

    it('should return true for NaN argument and includeNaN is true', () => {
      expect(isNumber(NaN, true)).toBe(true);
    });

    describe('should return false for null argument', () => {
      it('includeNaN is false', () => {
        expect(isNumber(null, false)).toBe(false);
      });

      it('includeNaN is true', () => {
        expect(isNumber(null, true)).toBe(false);
      });
    });

    describe('should return false for undefined argument', () => {
      it('includeNaN is false', () => {
        expect(isNumber(undefined, false)).toBe(false);
      });
      it('includeNaN is true', () => {
        expect(isNumber(undefined, true)).toBe(false);
      });
    });

    describe('should return false for empty string argument', () => {
      it('includeNaN is false', () => {
        expect(isNumber('', false)).toBe(false);
      });
      it('includeNaN is true', () => {
        expect(isNumber('', true)).toBe(false);
      });
    });

    describe('should return false for Number instance', () => {
      it('includeNaN is false', () => {
        // tslint:disable-next-line:no-construct
        expect(isNumber(new Number(3), false)).toBe(false);
      });

      it('includeNaN is true', () => {
        // tslint:disable-next-line:no-construct
        expect(isNumber(new Number(3), true)).toBe(false);
      });
    });

    describe('should return false for empty object argument', () => {
      it('includeNaN is false', () => {
        expect(isNumber({}, false)).toBe(false);
      });
      it('includeNaN is true', () => {
        expect(isNumber({}, true)).toBe(false);
      });
    });

    describe('should return false for object argument', () => {
      it('includeNaN is false', () => {
        expect(isNumber({a: 1}, false)).toBe(false);
      });
      it('includeNaN is true', () => {
        expect(isNumber({a: 1}, true)).toBe(false);
      });
    });

    describe('should return false for empty array argument', () => {
      it('includeNaN is false', () => {
        expect(isNumber([], false)).toBe(false);
      });
      it('includeNaN is true', () => {
        expect(isNumber([], true)).toBe(false);
      });
    });

    describe('should return false for array argument', () => {
      it('includeNaN is false', () => {
        expect(isNumber([1], false)).toBe(false);
      });
      it('includeNaN is true', () => {
        expect(isNumber([1], true)).toBe(false);
      });
    });

  });
});
