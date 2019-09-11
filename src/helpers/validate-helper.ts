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
 * return if variable is number or not
 * @param num any variable to check
 * @return true if the variable is a number
 */
export function isNumber(num: any): boolean {
  return typeof num === 'number';
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
