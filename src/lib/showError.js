// 出错 badge 颜色
const errorColor = "#FF0000";
/**
 * 显示错误
 * @param text {string}
 */
function showError(text) {
  chrome.browserAction.setBadgeText({ text: text });
  chrome.browserAction.setBadgeBackgroundColor({ color: errorColor });
}

export default showError;
