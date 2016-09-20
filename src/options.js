import $ from 'jquery';
import { ga } from './lib';

ga();

$(() => {

  chrome.storage.sync.get('token', ({ token }) => {
    $("#token")
      .val(token)
      .on('change', function () {
        var newToken = $.trim($(this).val());
        chrome.storage.sync.set({
          token: newToken
        }, function () {
          chrome.runtime.sendMessage('fetch');
        });
      });
  });

});
