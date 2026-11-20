import { useEffect } from 'preact/hooks';
import { initColorTool } from '../lib/color-tool';
import panelHtml from '../data/color-panel.html?raw';

/**
 * ColorTool — the "Đổi Màu cho Web" tab as a Preact island (`client:visible`).
 * The panel markup (3 preview frames, palette controls, font controls, …) is
 * rendered verbatim from the source file; the behaviour is the ported source
 * JS[4] (whole colour tool) + the cpGrad/cpPat tail of JS[6], run once in this
 * effect after hydration. Because the island sits inside the `hidden` colour
 * panel, it only hydrates once the tab is opened and the panel becomes visible.
 * It also exposes `window.__tpwPalette()` for the pin/export "add palette" flow.
 */
export default function ColorTool() {
  useEffect(() => {
    initColorTool();
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: panelHtml }} />;
}
