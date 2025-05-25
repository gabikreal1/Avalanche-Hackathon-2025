function flattenObject(input: Record<string, any>, prefix: string = ''): Record<string, string> {
  const result: Record<string, string> = {};
  
  function flatten(obj: any, currentPrefix: string = '') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const newKey = currentPrefix ? `${currentPrefix}.${key}` : key;
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          flatten(value, newKey);
        } else {
          result[newKey] = String(value);
        }
      }
    }
  }
  
  flatten(input, prefix);
  return result;
}

export function parseMessage(input: Record<string, any>) {
  const flattenedUpdates = flattenObject(input);
  
  return flattenedUpdates;
}

export default parseMessage;
