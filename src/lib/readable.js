/**
 * badge 最大长度是 4 个字符
 *
 * @param val {Number}
 * @returns {string}
 */
var readable = function (val) {
  if (val === null) {
    return 'N/A'
  }
  if (Math.abs(val) < 10) {
    return "" + val.toFixed(2);
  } else if (Math.abs(val) < 100) {
    return "" + val.toFixed(1);
  } else if (Math.abs(val) < 10000) {
    return "" + Math.round(val);
  } else {
    return "" + val.toExponential(0);
  }
}

export default readable;
