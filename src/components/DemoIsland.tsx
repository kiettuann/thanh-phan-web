import { useEffect, useRef } from 'preact/hooks';
import { ensureDemoRuntime } from '../lib/demo-runtime';

/**
 * DemoIsland — one Preact island per card (`client:visible`).
 *
 * It renders the card's `.stage` (demo HTML, SSR'd verbatim from the JSON data)
 * and owns the card's visibility gating:
 * - On first mount it lazily triggers the shared demo runtime
 *   (`ensureDemoRuntime`, the ported source JS[1/2/3/5/6/7/8/10/12] demo wiring,
 *   which is id-scoped and attaches to the SSR'd stages already in the document).
 *   The runtime runs exactly once, no matter how many islands hydrate.
 * - An IntersectionObserver (same 350px rootMargin as the source's JS[9]
 *   lazy-render) toggles `.demo-live` on the card. That class is the source's
 *   own pause switch: global.css pauses ALL CSS animations inside an
 *   off-screen card's stage, JS[12]'s merged rAF loop + auto-scroll loops and
 *   JS[10]'s streaming interval all check it (via inView() / demo-live), and
 *   `body.fx-locked` pauses every background card while the popup is open.
 *
 * The effect deliberately never calls setState: the island never re-renders,
 * so the detail popup may physically move this `.stage` node into the overlay
 * (as the source does) without Preact ever touching it again. Preact also does
 * not re-set `dangerouslySetInnerHTML` while hydrating, so the runtime's
 * listeners (attached in this same effect, after hydration) survive.
 */
export default function DemoIsland({ demoHtml }: { demoHtml: string }) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    ensureDemoRuntime();
    const card = stage.closest('.card');
    if (!card) return;
    if (!('IntersectionObserver' in window)) {
      card.classList.add('demo-live');
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          card.classList.toggle('demo-live', en.isIntersecting);
        }
      },
      { rootMargin: '350px 0px 350px 0px', threshold: 0 },
    );
    obs.observe(card);
    return () => obs.disconnect();
  }, []);

  return <div class="stage" ref={stageRef} dangerouslySetInnerHTML={{ __html: demoHtml }} />;
}
