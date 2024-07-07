chrome.runtime.onInstalled.addListener(function () {});

chrome.action.onClicked.addListener((e) => {
  var newURL = chrome.runtime.getURL('index.html');
  chrome.tabs.create({ url: newURL });
});
