/**
 * Deep clones an object to enforce immutability
 */
export default (obj) => {
    return JSON.parse(JSON.stringify(obj));
}
