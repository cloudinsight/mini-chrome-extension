$(function () {
  var token = localStorage["token"];
  var width = localStorage["width"] || 600;
  var height = localStorage["height"] || 300;
  var invalidToken = "无效的 token";

  /**
   * 验证 token 有效性
   * @param string
   * @returns {*|boolean}
   */
  function isValidToken(string) {
    return string && /^[\w]{32}$/.test(string);
  }

  if (isValidToken(token)) {
    $("<iframe>").attr({
      src: "http://cloud.oneapm.com/share/chart?token=" + token + "&spanTime=3600000&width=" + width + "&height=" + height,
      width: width,
      height: height,
      frameborder: 0
    }).appendTo("body");
    $("body").css({
      width: width,
      height: height
    });
    chrome.runtime.sendMessage('fetch');
  } else {
    chrome.runtime.openOptionsPage();
    $("body")
      .text(invalidToken)
      .css({
        width: '8em'
      });
  }
})
