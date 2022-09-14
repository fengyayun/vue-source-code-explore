export function forEachValue(obj, cb) {
  if (!obj) return;
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      cb(key, obj[key]);
    }
  }
}
