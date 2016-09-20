import $ from 'jquery';
import {
  isValidToken,
  ga
} from './lib';

ga();

const INVALID_TOKEN_MESSAGE = "无效的 token";
chrome.storage.sync.get('token', ({ token }) => {
  $(function () {

    if (!isValidToken(token)) {

      // 如果是无效的 Token 就打开设置页面
      chrome.runtime.openOptionsPage();

      // Popup 显示一个错误，不过由于跳到了设置页面所以看不见
      $("body")
        .text(INVALID_TOKEN_MESSAGE)
        .css({
          width: '8em'
        });

      return;
    }

    const {
      width = 600,
      height = 300
    } = localStorage;

    $("<iframe>")
      .attr({
        src: `http://cloud.oneapm.com/share/chart?token=${token}&spanTime=3600000&width=${width}&height=${height}`,
        width: width,
        height: height,
        frameborder: 0
      })
      .appendTo("body");

    $("body").css({
      width: width,
      height: height
    });

    // 每打开一次 popup 就刷新一次
    chrome.runtime.sendMessage('fetch');

  });
})

