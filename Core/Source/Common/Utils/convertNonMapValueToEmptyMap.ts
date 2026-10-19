export default function convertNonMapValueToEmptyMap<MapKey, MapValue>(targetValue: unknown): Map<MapKey, MapValue> {
  return targetValue instanceof Map ? targetValue : new Map();
}
