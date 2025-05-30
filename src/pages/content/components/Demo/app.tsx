import logoDataUrl from "@src/assets/img/logo.svg";
import "@src/styles/tailwind.css";

export function App() {
  return (
    <div class="fixed top-5 left-5 z-[2000] w-80 rounded-xl bg-[#282c34] text-white">
      <img
        src={logoDataUrl}
        class="motion-preset-spin motion-duration-[2s] pointer-events-none"
        alt="logo"
      />
      <p class="flex flex-wrap font-bold">
        Edit <code>src/pages/content/index.tsx</code> and save to reload.
      </p>
    </div>
  );
}
