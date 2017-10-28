/**
 * Parses a value and returns float number from it
 * Will throw if the val is illegal
 */
export default (val) => {
    let res;

    try {
        res = parseFloat(val);
    } catch (e) {
        throw `input value is not a number ${val}`;
    }

    return res;
}
