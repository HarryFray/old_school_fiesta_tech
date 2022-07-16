const firebaseObjectToArray = (object) => {
  if (!object) return;

  return Object.keys(object).map((key) => {
    return object[key];
  });
};

export { firebaseObjectToArray };
