export const sortByProperties = (array, properties) => {
  const arrayCopy = Array.from(array);
  return arrayCopy.sort((a, b) => {
    properties.forEach((property) => {
      if (a[property] < b[property]) {
        return -1;
      }
      if (a[property] > b[property]) {
        return 1;
      }
    });
    return 0;
  });
};
