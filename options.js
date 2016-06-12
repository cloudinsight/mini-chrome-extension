$(function () {
  $("#token")
    .val(localStorage["token"])
    .on('change', function () {
      localStorage["token"] = $.trim($(this).val());
      chrome.runtime.sendMessage('token_updated');
    });
});
