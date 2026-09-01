// JobTrack Background Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener(() => {
  console.log('JobTrack Chrome Extension installed.');

  // Create context menu for quick capture
  if (chrome.contextMenus) {
    chrome.contextMenus.create({
      id: 'jobtrack-capture-selection',
      title: 'Save selected text to JobTrack notes',
      contexts: ['selection'],
    });
  }
});

// Handle context menu clicks
chrome.contextMenus?.onClicked.addListener((info, _tab) => {
  if (info.menuItemId === 'jobtrack-capture-selection' && info.selectionText) {
    console.log('Captured selection:', info.selectionText);
    // In future versions, this can pre-populate a quick note
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'PING') {
    sendResponse({ status: 'PONG', timestamp: Date.now() });
  }
  return true;
});
