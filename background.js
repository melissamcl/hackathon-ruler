// chrome.action.onClicked.addListener((tab) => {

const tab = async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

chrome.scripting.executeScript({
  target: { tabId: tab.id },
  files: ['main.js']
});
// });