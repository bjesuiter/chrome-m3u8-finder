import logoDataUrl from "@src/assets/img/logo.svg";
import "@src/styles/tailwind.css";
import DeviconLinux from "~icons/devicon/linux";

export function OptionsPage() {
  return (
    <div class="fixed inset-0 bg-[#282c34] text-white">
      <h1 class="text-xl font-bold">Options Page Template</h1>
      <section class="top-24 mx-auto w-fit p-5">
        {/* get urls for imported assets: chrome.runtime.getURL(), but NOT for images, images are inlined as data urls from vite 5 on! */}
        <div class="flex flex-row items-center gap-4">
          {/* how to use imported images: */}
          <img
            src={logoDataUrl}
            class="motion-preset-spin motion-duration-2000 pointer-events-none max-w-80"
            alt="logo"
          />
          {/* how to use icons: */}
          <DeviconLinux class="motion-preset-spin motion-duration-2000 pointer-events-none max-w-80 text-[150pt]" />
        </div>

        <p class="flex flex-wrap pt-10 text-base font-bold">
          Edit &nbsp; <code>src/pages/options/Options.tsx</code> &nbsp; and save
          to reload.
        </p>
      </section>
    </div>
  );
}
