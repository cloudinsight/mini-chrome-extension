const Raven = require('raven-js');
const $ = require('jquery');
import {
  isValidToken,
  readable,
  showBadge,
  showError,
  ga
} from './lib';

Raven.config('https://cb8930fd4c7e4e879b8d6513dbfd6ea1@sentry.cloudinsight.cc/4', {
  release: chrome.app.getDetails().version,
  environment: chrome.app.getIsInstalled() ? 'Production' : 'Development'
}).install();

ga();

chrome.runtime.onStartup.addListener(ga.bind(null, {
  ec: 'runtime',
  ea: 'startup'
}));

chrome.runtime.onInstalled.addListener(details => ga.bind(null, {
  ec: 'runtime',
  ea: details.reason
}));

// 每 10 分钟更新一次
const periodInMinutes = 10;
// 最近 1 小时
const duration = 3600;

// warningFlag
let invalidTokenMessageSent = false;

/**
 * 加载指定的 token
 */
function loadChart(token) {
  if (!isValidToken(token)) {
    if (!invalidTokenMessageSent) {
      Raven.captureMessage('Token not set by user.', {
        level: 'warning'
      });
      invalidTokenMessageSent = true;
    }
    return true;
  }

  $.getJSON('https://cloud.oneapm.com/v1/share/chart.json', {
    token: token
  }).then(function (res) {
    const result = res.result;
    if (result && result.metrics.length) {
      const m = result.metrics[0];

      const aggregator = m.aggregator || 'avg';
      let tags = m.tags || [];
      const metric = m.metric;


      tags = tags.filter(function (t) {
        return t.indexOf('=') !== -1;
      });

      return $.getJSON('https://cloud.oneapm.com/v1/query.json', {
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
      const pointlist = data.result[0].pointlist;
      const timeStamps = Object.keys(pointlist);
      // 取最后一个值
      if (timeStamps.length) {
        showBadge(readable(pointlist[timeStamps[timeStamps.length - 1]]));
      }
    }
  }).catch(function (e) {
    if (e.status) {
      // e 是 XHR 的情况
      Raven.captureException(e.statusText, {
        extra: {
          responseText: e.responseText,
          status: e.status
        }
      });
    } else {
      Raven.captureException(e);
    }
    showError("!");
  })
}

/**
 * 刷新 Badge
 */
function updateBadge() {
  chrome.storage.sync.get('token', function (item) {
    var savedToken = item.token;
    loadChart(savedToken);
  });
}

// 显示三个点，表示正在加载
showBadge('...');
updateBadge();

chrome.runtime.onMessage.addListener(function (evt) {
  if (evt === 'fetch') {
    updateBadge();
  }
});

// 注册定时刷新
chrome.alarms.create('fetch_timer', {
  periodInMinutes: periodInMinutes
});

// 处理刷新的 alarm
chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === 'fetch_timer') {
    updateBadge();
  }
});
