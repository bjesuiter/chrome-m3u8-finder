import "@src/styles/tailwind.css";
import { createResource } from "solid-js";
export function PopupPage() {
  const [m3u8Links, { mutate: mutateM3u8Links }] = createResource<string[]>(
    async () => {
      const result = await chrome.runtime.sendMessage({
        action: "readM3u8Links",
      });
      console.debug("[popup] readM3u8Links result", result);
      return result?.m3u8Links;
    },
  );

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "updatedM3u8Links") {
      mutateM3u8Links(message.m3u8Links);
    }
  });

  async function copyLinks() {
    const links = m3u8Links()
      ?.map((m3u8Link) => m3u8Link)
      .join("\n");
    if (!navigator?.clipboard) {
      console.error("[popup] navigator.clipboard not available");
      return;
    }
    if (links) {
      await navigator.clipboard.writeText(links);
    }
  }

  async function clearLinks() {
    const result = await chrome.runtime.sendMessage({
      action: "clearM3u8Links",
    });
    console.debug("[popup] clearM3u8Links result", result);
    mutateM3u8Links(result?.m3u8Links);
  }

  return (
    <div class="flex h-full w-[400px] flex-col gap-2 bg-[#282c34] p-4 text-white">
      <h1 class="text-xl font-bold">M3u8 Finder</h1>
      {/* Actions */}
      <div class="flex gap-2">
        <button
          class="rounded border-2 border-solid border-slate-400 bg-slate-500 p-2"
          onClick={copyLinks}
        >
          Copy
        </button>
        <button
          class="rounded border-2 border-solid border-slate-400 bg-slate-500 p-2"
          onClick={clearLinks}
        >
          Clear
        </button>
      </div>
      <pre class="m-x-2 w-full overflow-x-auto border-2 border-solid border-white p-2">
        {m3u8Links()
          ?.map((m3u8Link) => m3u8Link)
          .join("\n")}
      </pre>
    </div>
  );
}
