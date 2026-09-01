import { extractorRegistry } from './extractors/extractorRegistry';

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'EXTRACT_JOB') {
    extractorRegistry
      .extractCurrentPage()
      .then((data) => {
        sendResponse({ success: true, data });
      })
      .catch((err: Error) => {
        sendResponse({ success: false, error: err.message });
      });
    return true;
  }
});
