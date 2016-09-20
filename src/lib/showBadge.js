// 默认 badge 颜色
const defaultColor = "#0000FF";

/**
 * 显示 badge
 * @param text {string}
 */
function showBadge(text) {
  chrome.browserAction.setBadgeText({ text: text });
  chrome.browserAction.setBadgeBackgroundColor({ color: defaultColor });
}

export default showBadge;
