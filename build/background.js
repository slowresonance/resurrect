chrome.browserAction.onClicked.addListener(onClick);

function onClick(tab) {
  chrome.tabs.create({
    url: "index.html",
  });
}
