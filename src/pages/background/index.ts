import { M3u8Link, M3u8LinkIncomplete } from "./m3u8Link.type";

console.log("[background] Service worker loaded");

let currentM3u8Link: M3u8LinkIncomplete | undefined;
let m3u8Links: M3u8Link[] = [];

chrome.runtime.onInstalled.addListener(() => {
  console.log("[background] extension installed");
  chrome.storage.local.get("m3u8Links", (result) => {
    m3u8Links = result.m3u8Links || [];
  });
});

function checkAndFinalizeCurrentM3u8Link() {
  if (!currentM3u8Link) {
    return; // no current m3u8 link
  }
  if (
    !currentM3u8Link.title ||
    !currentM3u8Link.url ||
    !currentM3u8Link.metadata
  ) {
    return; // m3u8 link not complete
  }

  // m3u8 link is complete
  console.debug("[background] adding m3u8 link to storage", currentM3u8Link);
  m3u8Links.push({
    url: currentM3u8Link.url,
    title: currentM3u8Link.title,
    metadata: currentM3u8Link.metadata,
  });
  currentM3u8Link = undefined;
  chrome.storage.local.set({ m3u8Links });

  chrome.runtime.sendMessage({
    action: "updatedM3u8Links",
    m3u8Links,
  });

  // temporary disabled
  // sendToJD(url)
  //   .then(() => {
  //     console.log(`Sent ${url} to JDownloader`);
  //   })
  //   .catch((error) => {
  //     console.error(`Error sending ${url} to JDownloader`, error);
  //   });
}

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = details.url;
    if (url.includes("master.m3u8")) {
      console.log(`Found a master.m3u8 link: ${url}`);

      // add url to current m3u8 link
      if (currentM3u8Link) {
        currentM3u8Link.url = url;
      } else {
        currentM3u8Link = { url };
      }

      // finalize current m3u8 link
      checkAndFinalizeCurrentM3u8Link();
    }
  },
  { urls: ["*://*.s.to/*", "*://*.orbitcache.com/*"] },
);

// service-worker.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "readM3u8Links") {
    console.log("[background] Received action 'readM3u8Links'", message);
    chrome.storage.local.get("m3u8Links", (result) => {
      sendResponse({ m3u8Links: result.m3u8Links || [] });
    });
    return true; // Indicate that you will be sending a response asynchronously
  }

  if (message.action === "clearM3u8Links") {
    console.log("[background] Received action 'clearM3u8Links'", message);
    m3u8Links = [];
    chrome.storage.local.set({ m3u8Links });
    sendResponse({ m3u8Links });
    return false; // Indicate that you will be sending a response synchronously
  }

  if (message.action === "contentMetadata") {
    console.log("[background] Received action 'metadata'", message);
    const { germanTitle, englishTitle, selectedLanguage, seasonNr, episodeNr } =
      message.contentMetadata;

    const mainTitle =
      selectedLanguage === "Deutsch" ? germanTitle : englishTitle;

    const title = `${mainTitle} S${seasonNr}F${episodeNr} ${selectedLanguage === "Deutsch" ? "DE" : "EN"}`;

    if (currentM3u8Link) {
      currentM3u8Link.title = title;
      currentM3u8Link.metadata = message.contentMetadata;
    } else {
      currentM3u8Link = {
        title,
        metadata: message.contentMetadata,
      };
    }

    checkAndFinalizeCurrentM3u8Link();
  }
});
