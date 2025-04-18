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

      //   if (!navigator.clipboard) {
      //     console.error("Clipboard object not available");
      //     return;
      //   }

      //   navigator.clipboard
      //     .writeText(url)
      //     .then(() => {
      //       console.log("Text copied to clipboard");
      //       // Optionally provide user feedback (e.g., an alert)
      //     })
      //     .catch((err) => {
      //       console.error("Failed to copy text: ", err);
      //       // Handle the error appropriately (e.g., display an error message)
      //     });
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
});
