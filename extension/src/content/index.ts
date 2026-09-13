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

// Bi-directional auth sync between web dashboard and extension
const isJobTrackHost = typeof window !== 'undefined' && (
  (window.location.hostname === 'localhost' && window.location.port === '5173') ||
  window.location.hostname === 'jobtrack.antideploy.com' ||
  window.location.hostname === 'jobtrack-ai.antideploy.com'
);

if (isJobTrackHost) {
  const syncFromWebToExtension = () => {
    try {
      const webToken = localStorage.getItem('jobtrack_access_token');
      if (webToken) {
        chrome.storage?.local?.get('jobtrack_auth_token', (res) => {
          if (res && res['jobtrack_auth_token'] !== webToken) {
            chrome.storage.local.set({ jobtrack_auth_token: webToken });
          }
        });
      }
    } catch {
      // Ignore if localStorage unavailable
    }
  };

  syncFromWebToExtension();
  window.addEventListener('storage', (e) => {
    if (e.key === 'jobtrack_access_token') {
      if (e.newValue) {
        chrome.storage?.local?.set({ jobtrack_auth_token: e.newValue });
      } else {
        chrome.storage?.local?.remove('jobtrack_auth_token');
      }
    }
  });
}

