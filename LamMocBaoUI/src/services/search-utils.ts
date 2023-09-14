export function extractFilterObjectToQueryString(filterObject: any, useNullValue: boolean = false): string {
  function hasValue(d: { Key: string, Value: any }): boolean{
    return typeof (d.Value) !== 'undefined' && d.Value !== null
  }
  if (!filterObject) {
    return "";
  }

  var keys = Object.keys(filterObject);
  if (!keys.length) {
    return "";
  }
  var mapValue = keys.map(key => {
    return {
      Key: key,
      Value: filterObject[key]
    }
  });
  if (!useNullValue) {
    mapValue = mapValue.filter(hasValue);
  }
  var result = mapValue.map(s => {
    if (typeof (s.Value) === 'object') {
      var keys = Object.keys(s.Value);
      return keys.map(key => {
        return {
          Key: `${s.Key}.${key}`,
          Value: s.Value[key]
        }
      }).filter(hasValue)
        .map(s => `${s.Key}=${s.Value}`)
        .join('&');
    }
    return `${s.Key}=${s.Value}`;
  }).join('&');
  return `?${result}`;
}


