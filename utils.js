export function replaceEmptyValuesWithNull(obj) {
  const newObj = Object.assign({}, obj);
  for (const [key, val] of Object.entries(obj)) {
    newObj[key] = val || null;
  }
  return newObj;
}
