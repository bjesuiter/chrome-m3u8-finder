// import { render } from "solid-js/web";
// import { App } from "./components/Demo/app";

// const root = document.createElement("div");
// root.id = "my-extension-root";
// document.body.append(root);

// render(App, root);

const germanTitle = document.querySelector(".episodeGermanTitle")?.textContent;
const englishTitle = document.querySelector(
  ".episodeEnglishTitle",
)?.textContent;

const selectedLanguage = document
  .querySelector(".selectedLanguage")
  ?.getAttribute("title"); // can be "Deutsch" (not "German" because current lang is deutsch) or "English" (because current lang is english)

// extract season and episode from url
// Example: https://s.to/serie/stream/designated-survivor/staffel-1/episode-4
const url = window.location.href.split("/");
const season = url.at(-2);
const episode = url.at(-1);
const seasonNr = season.split("-").at(1);
const episodeNr = episode.split("-").at(1);

const contentMetadata = {
  germanTitle,
  englishTitle,
  selectedLanguage,
  seasonNr,
  episodeNr,
};

console.debug(`[M3u8 Finder]: found infos`, contentMetadata);

chrome.runtime.sendMessage({
  action: "contentMetadata",
  contentMetadata,
});
