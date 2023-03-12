chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
      text: "ON",
    });
});

function selectGetter(info,tab) {
  console.log(info.selectionText)
  console.log(tab.url)
  chrome.tabs.create({
    url: `http://www.google.com/search?="${info.selectionText}"`
  })
}

chrome.contextMenus.create({
  title: "make flashcard for '%s'",
  contexts: ['page','selection'],
  type: "normal",
  visible: true,
  enabled: true,
  id: "flashcardContextMenu"
})

chrome.contextMenus.onClicked.addListener(
  selectGetter
)

// I will use a background service worker here to 
// open the flashcard queue while navigating to a new tab and to throttle loading
