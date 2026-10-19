/** @description
 * Created for the micro optimization purposes. Not for the wide-scale reusage outside of this package. */
export default function convertNonArrayValueToEmptyArray<ArrayElement>(targetValue: unknown): Array<ArrayElement> {
  return Array.isArray(targetValue) ? targetValue : [];
}
