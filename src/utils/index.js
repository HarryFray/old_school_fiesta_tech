const firebaseObjectToArray = (object) => {
  return Object.keys(object).map((key) => {
    return object[key];
  });
};

export { firebaseObjectToArray };
