import { camelToSnake, snakeToCamel } from "./string";
const createDeepObjectTransformer = (transform) => {
  const deepTransform = (obj) => {
    if (!obj) {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map((el) => {
        if (typeof el === "object" || Array.isArray(el)) {
          return deepTransform(el);
        }
        return el;
      });
    }
    const copy = { ...obj };
    const keys = Object.keys(copy);
    for (const oldName of keys) {
      const newName = transform(oldName.toString());
      if (newName !== oldName) {
        copy[newName] = copy[oldName];
        delete copy[oldName];
      }
      if (typeof copy[newName] === "object") {
        copy[newName] = deepTransform(copy[newName]);
      }
    }
    return copy;
  };
  return deepTransform;
};
const deepCamelToSnake = createDeepObjectTransformer(camelToSnake);
const deepSnakeToCamel = createDeepObjectTransformer(snakeToCamel);
export {
  deepCamelToSnake,
  deepSnakeToCamel
};
//# sourceMappingURL=object.js.map