/**
 * 验证 token 有效性
 *
 * @param string {string}
 * @returns {boolean}
 */
const isValidToken = string => string && /^[\w]{32}$/.test(string);
export default isValidToken;
