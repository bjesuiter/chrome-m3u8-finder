console.log("[background] Service worker loaded");

chrome.runtime.onInstalled.addListener(() => {
  console.log("[background] extension installed");
});

let m3u8Links: string[] = [];

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = details.url;
    if (url.includes("master.m3u8")) {
      console.log(`Found a master.m3u8 link: ${url}`);
      m3u8Links.push(url);

      chrome.runtime.sendMessage({
        action: "updatedM3u8Links",
        m3u8Links,
      });
    }
  },
  { urls: ["*://*.s.to/*", "*://*.orbitcache.com/*"] },
);

// service-worker.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "readM3u8Links") {
    console.log("[background] Received action 'readM3u8Links'", message);
    sendResponse({ m3u8Links });
    return false; // Indicate that you will be sending a response synchronously
  }

  if (message.action === "clearM3u8Links") {
    console.log("[background] Received action 'clearM3u8Links'", message);
    m3u8Links = [];
    sendResponse({ m3u8Links });
    return false; // Indicate that you will be sending a response synchronously
  }
});
