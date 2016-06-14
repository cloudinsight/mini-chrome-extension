$(function () {
  chrome.storage.sync.get('token', function (item) {
    var savedToken = item.token;
    $("#token")
      .val(savedToken)
      .on('change', function () {
        var token = $.trim($(this).val());
        chrome.storage.sync.set({
          token: token
        }, function () {
          chrome.runtime.sendMessage('fetch');
        });
      });
  });
});
