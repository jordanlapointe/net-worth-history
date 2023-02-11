export const sortByProperties = (array, properties) => {
  const arrayCopy = Array.from(array);
  return arrayCopy.sort((a, b) => {
    for (let i = 0; i < properties.length; i += 1) {
      const property = properties[i];
      if (a[property] < b[property]) {
        return -1;
      }
      if (a[property] > b[property]) {
        return 1;
      }
    }
    return 0;
  });
};
