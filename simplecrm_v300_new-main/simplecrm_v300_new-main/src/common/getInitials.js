export default (name = '') =>{  let newName= (name && name.length>0) ?name: "AB";
  return newName
    .replace(/\s+/, ' ')
    .split(' ')
    .slice(0, 1)
    .map(v => v && v[0].toUpperCase())
    .join('');
}