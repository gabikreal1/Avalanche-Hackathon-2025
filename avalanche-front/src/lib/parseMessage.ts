function flattenObject(input: Record<string, any>): Record<string, string> {
  const result: Record<string, string> = {};
  
  function flatten(obj: any) {
    for (const keyA in obj) {
      const key = keyA.split('.').pop()!; // Replace dots with underscores for keys
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          flatten(value);
        } else {
          result[key] = String(value);
        }
      }
    }
  }
  
  flatten(input);
  return result;
}

export function parseMessage(input: Record<string, any>) {
  const flattenedUpdates = flattenObject(input);
  
  return flattenedUpdates;
}

export default parseMessage;
