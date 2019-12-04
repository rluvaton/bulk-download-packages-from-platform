/**
 * Check if value is either `null` or `undefined` (Nil)
 * @param value Value to check
 * @return The result if the value is nil
 */
import {EnumValues} from 'enum-values';

export function isNil(value: any): boolean {
  // from SO answer - https://stackoverflow.com/a/5515385/5923666
  return value == null;
}

/**
 * Return if variable is number or not
 * @param num any variable to check
 * @param includeNaN To include NaN in the validation
 * @return true if the variable is a number
 *
 * @summary
 * Why does typeof NaN return “number”?
 * typeof NaN; // "number"
 * The ECMAScript standard states that Numbers should be IEEE-754 floating point data. This includes Infinity, -Infinity, and also NaN.
 * By definition, NaN is the return value from operations which have an undefined numerical result.
 * Hence why, in JavaScript, aside from being part of the global object, it is also part of the Number object: Number.NaN.
 * ***It is still a numeric data type, but it is undefined as a real number.***
 * NaN also represents any number outside of the ECMAScript domain of definition.
 */
export function isNumber(num: any, includeNaN: boolean = false): boolean {
  return typeof num === 'number' && (includeNaN || !isNaN(num));
}

/**
 * Check if value exist in enum
 * @param e Enum
 * @param val Value to check
 * @return If the value exist or not
 */
export function isValueExistInEnum(e: any, val: string | number): boolean {
  return !isNil(EnumValues.getNameFromValue(e, val));
}
