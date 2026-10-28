import { useLayoutEffect } from "react";

/**
 * Moves a glass "pill" behind the active tab inside `ref`.
 * The container draws the pill with ::before using --ind-x / --ind-w / --ind-h / --ind-y.
 */
export default function useSlidingIndicator(ref, deps = [], selector = ".active") {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    function update() {
      const active = el.querySelector(selector);
      if (!active) {
        el.style.setProperty("--ind-o", "0");
        return;
      }
      el.style.setProperty("--ind-x", `${active.offsetLeft}px`);
      el.style.setProperty("--ind-y", `${active.offsetTop}px`);
      el.style.setProperty("--ind-w", `${active.offsetWidth}px`);
      el.style.setProperty("--ind-h", `${active.offsetHeight}px`);
      el.style.setProperty("--ind-o", "1");
      if (el.scrollWidth > el.clientWidth) {
        active.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
      }
    }

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
