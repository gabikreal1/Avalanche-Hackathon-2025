
function flattenObject(input: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};
  
  function flatten(obj: any) {
    for (const key in obj) {
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

export function parseMessage(input: Record<string, string>) {
  const flattenedUpdates = flattenObject(input);
  
  return flattenedUpdates
}

export default parseMessage;
