// 默认 badge 颜色
var defaultColor = "#0000FF";
// 出错 badge 颜色
var errorColor = "#FF0000";
// 每 10 分钟更新一次
var updateInterval = 600 * 1000;
// 最近 1 小时
var duration = 3600;

/**
 * 显示 badge
 * @param text {string}
 */
function showBadge(text) {
  chrome.browserAction.setBadgeText({ text: text });
  chrome.browserAction.setBadgeBackgroundColor({ color: defaultColor });
}

/**
 * 显示错误
 * @param text {string}
 */
function showError(text) {
  chrome.browserAction.setBadgeText({ text: text });
  chrome.browserAction.setBadgeBackgroundColor({ color: errorColor });
}

/**
 * badge 最大长度是 4 个字符
 *
 * @param val {Number}
 * @returns {string}
 */
var readable = function (val) {
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

/**
 * 加载指定的 token
 */
function loadChart(token) {
  $.getJSON('https://cloud.oneapm.com/share/chart.json', {
    token: token
  }).then(function (res) {
    var result = res.result;
    if (result && result.metrics.length) {
      var m = result.metrics[0];

      var aggregator = m.aggregator || 'avg';
      var tags = m.tags || [];
      var metric = m.metric;


      tags = tags.filter(function (t) {
        return t.indexOf('=') !== -1;
      });

      return $.getJSON('https://cloud.oneapm.com/query.json', {
        token: token,
        q: aggregator + ':' + metric + '{' + tags.join(",") + '}',
        begin: duration * 1000,
        interval: duration + 1
      });
    } else {
      throw new Error('Invalid result');
    }
  }).then(function (data) {
    if (data.result && data.result[0]) {
      var pointlist = data.result[0].pointlist;
      var timeStamps = Object.keys(pointlist);
      if (pointlist[timeStamps[0]]) {
        showBadge(readable(pointlist[timeStamps[0]]));
      }
    }
  }).catch(function () {
    console.log(arguments)
    showError("!");
  })
}

showBadge('...');

loadChart(localStorage["token"]);
setInterval(function () {
  loadChart(localStorage["token"]);
}, updateInterval);

chrome.runtime.onMessage.addListener(function (evt) {
  if (evt === 'fetch') {
    loadChart(localStorage["token"]);
  }
});