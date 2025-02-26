export function getFirstAlphabet(str) {
  for (var i = 0; i < str.length; i++) {
    if (/[a-zA-Z]/.test(str[i])) {
      return str[i].toUpperCase();
    }
  }
  return "";
}

export const getFromName = (name) => {
  name = name && name.length ? name : "A";
  let newName = name.indexOf("<");
  newName = name.substring(0, newName);
  return newName || name;
};
