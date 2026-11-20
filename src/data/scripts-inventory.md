# Scripts inventory — Thành Phần Web Thường Gặp (source: thanh-phan-web-thuong-gap.html)

Source file has **15 `<script>` tags**: 2 × `type="application/ld+json"` (SEO, already extracted verbatim into `seo.json` as `jsonLd`) and **13 inline JavaScript blocks** inventoried below, in document order (JS[0] = 3rd script tag, JS[12] = 15th). No external JS files are loaded. Total inline JS: **225,722 bytes**.

Byte sizes are UTF-8 bytes of the script text content. `setInterval` / `rAF` / `addEventListener` counts are literal occurrences in that block. ID lists are every id the block references via `getElementById(...)`, `querySelector(All)("#...")`, or the local `$(...)` helper — i.e. the DOM ids the block wires up. IDs are element ids *inside* demo `.stage` markup (or shell ids), NOT card ids: the card `<article id>` itself is rarely referenced; demos are wired by their inner element ids.

## The 13 inline JS blocks

### JS[0] — Pause timers when tab hidden

- **Size:** 466 bytes | **setInterval:** 2 | **requestAnimationFrame:** 0 | **addEventListener:** 0 | **IntersectionObserver:** 0
- Wraps window.setInterval so every demo interval is paused while the tab is hidden (battery/CPU saving) and resumed on visibilitychange. No DOM ids; affects all setInterval-based demos globally.
- **IDs wired:** none (global behaviour only).

### JS[1] — Shell + first-batch component demos (~60 wirings)

- **Size:** 53,023 bytes | **setInterval:** 33 | **requestAnimationFrame:** 0 | **addEventListener:** 88 | **IntersectionObserver:** 0
- Shell: accent-free search/filter across both tabs (normalises Vietnamese diacritics + đ→d), tab switching Thành phần / Hiệu ứng / Đổi Màu, group counts, no-result states. Demos: self-running + clickable wiring for the first ~60 component demos (Toggle, Checkbox, Text Input/Search typing, Dropdown, Stepper, star rating, Hamburger, Tabs, Pagination auto-advance, Accordion, Badge counter, Back-to-top, Button/Toggle/Segmented groups, Multi-select + Tags removal, OTP auto-fill, Password show/hide, Steps auto-run, Menubar, Bottom Nav, Tree View, QR grid drawing, Context Menu, Gallery, Speed Dial, Rich Text Editor, Statistic count-up, Video Player, Theme Toggle, Transfer List, Editable, Captcha refresh, Scrollspy, User Menu, Circular Progress, Gauge + Sparkline (MUI X), Tour, Audio Player, Icon Button, Split Button, Number Input, Range Slider, Input-with-Error, Banner, Avatar Group, Table sort, Countdown, Notification Center, Kanban drag-and-drop, and đợt 5–6: Close Button, Anchor, Collapsible, Color Swatch, Popconfirm, Copy Button (real clipboard), Questionnaire, Action Bar). 33 setInterval calls — the most timer-heavy block.
- **IDs wired (139):** `accDemo`, `audioBtn`, `audioDemo`, `avaGroup`, `avaGroupLabel`, `badgeNum`, `bannerBar`, `bannerClose`, `bannerFrame`, `bannerShow`, `bnavDemo`, `btnGroup`, `bttBtn`, `burgerBtn`, `capCode`, `capRef`, `cdTime`, `chkAuto`, `circFg`, `circNum`, `countLabel`, `ctxDemo`, `ctxMenu`, `ddDemo`, `ddLabel`, `editBtn`, `editTxt`, `errInput`, `errMsg`, `eyeOff`, `eyeOpen`, `galMain`, `galThumbs`, `ggArc`, `ggNum`, `ggRange`, `ggStatus`, `icbLabel`, `icbRow`, `kbDemo`, `mbBtn`, `mbMenu`, `n5AnchorNav`, `n5AnchorTrack`, `n5CloseBtn`, `n5CloseShow`, `n5CloseWrap`, `n5Coll`, `n5CollBtn`, `n5PopBtn`, `n5PopBubble`, `n5PopMsg`, `n5PopNo`, `n5PopYes`, `n5SwLabel`, `n5Swatches`, `n6Abar`, `n6AbarCnt`, `n6AbarList`, `n6AbarMsg`, `n6CopyBtn`, `n6QuizAgain`, `n6QuizBack`, `n6QuizBar`, `n6QuizDone`, `n6QuizMain`, `n6QuizNext`, `n6QuizOpts`, `n6QuizQ`, `n6QuizSkip`, `n6QuizStep`, `ncBadge`, `noresult`, `noresultFx`, `notifCenter`, `numDown`, `numInput`, `numUp`, `otpDemo`, `pager`, `panel-color`, `panel-components`, `panel-effects`, `pwdBtn`, `pwdTxt`, `qrGrid`, `rngFill`, `rngHi`, `rngHiVal`, `rngLo`, `rngLoVal`, `rngTrack`, `rteBody`, `rteDemo`, `sdialDemo`, `search`, `segDemo`, `spRead`, `spRows`, `splitChev`, `splitDemo`, `splitMain`, `splitMsg`, `spyDemo`, `spyTrack`, `stars`, `statNum`, `stepMinus`, `stepNum`, `stepPlus`, `stepsDemo`, `tabColor`, `tabComp`, `tabCompCount`, `tabFx`, `tabsBody`, `tabsHead`, `tblBody`, `tblPriceHead`, `tblSortIc`, `tglDemo`, `tglGroup`, `tglState`, `themeBtn`, `themeDemo`, `totalCount`, `tourDemo`, `tourText`, `tourTitle`, `treeDemo`, `umenuBtn`, `umenuList`, `vidBtn`, `vidDemo`, `xfLeft`, `xfLeftBtn`, `xfRight`, `xfRightCol`, `xferDemo`

### JS[2] — Effects batch 1 (fx- prefix, $ helper)

- **Size:** 11,554 bytes | **setInterval:** 0 | **requestAnimationFrame:** 2 | **addEventListener:** 23 | **IntersectionObserver:** 4
- Wiring for the first effects demos via a local $() id helper: Scroll Reveal (IntersectionObserver, .fxRevealFrame), Hero, Split, Count-up, Accordion, Confetti, Glow, Magnetic, Page transition, Parallax, Ripple, Skeleton, Smooth Scroll (fxSmoothFrame), Tilt, Toast, Typewriter, Dropdown-2, Modal, Shake/Glow helpers. 2 requestAnimationFrame loops; 4 IntersectionObserver uses.
- **IDs wired (41):** `fxAcc`, `fxConfBtn`, `fxConfZone`, `fxCountNum`, `fxCountReplay`, `fxDBack`, `fxDFrame`, `fxDOpen`, `fxGlow`, `fxGlowLink`, `fxGlowZone`, `fxHFrame`, `fxHTrack`, `fxHero`, `fxHeroReplay`, `fxMClose`, `fxMOpen`, `fxMWrap`, `fxMagBtn`, `fxMagZone`, `fxPageA`, `fxPageB`, `fxPageBtn`, `fxPxBg`, `fxPxFrame`, `fxRevealFrame`, `fxRippleBtn`, `fxShFrame`, `fxShHead`, `fxSkel`, `fxSkelBtn`, `fxSkelReal`, `fxSmoothFrame`, `fxSmoothGo`, `fxSmoothToggle`, `fxSplit`, `fxSplitReplay`, `fxTiltCard`, `fxToast`, `fxToastBtn`, `fxTypeTxt`

### JS[3] — Popup + Scroll Reveal + effects batches 2–3

- **Size:** 28,422 bytes | **setInterval:** 1 | **requestAnimationFrame:** 0 | **addEventListener:** 51 | **IntersectionObserver:** 9
- Card Scroll Reveal / Fade-up via IntersectionObserver (adds .in to cards and reference sections); the detail popup (openCard: moves the card's .stage into the overlay, clones descStore entry, splits .diff-line into the popup diff area, Copy-name / Copy-prompt / Pin buttons, replay buttons for hero/split/count). Then đợt 2–3 effect wirings: Scroll Progress, Flip Card 3D, Shake/Wiggle, Button Loading→Success Morph, Notification Badge Pop, Carousel Autoplay, Dropdown Slide-down, Search Expand, Tabs Indicator Slide, Chart Animate, Image Parallax on Hover, Image Reveal / Clip-path, Bell badge, Morph, Overlay, Ring, Stars rating, Stepper, Swap, T-stack, and more. 9 IntersectionObserver uses; 1 setInterval.
- **IDs wired (63):** `fxBellBadge`, `fxBellBtn`, `fxCar2`, `fxCar2Play`, `fxCar2Track`, `fxChart`, `fxChartBtn`, `fxClipFrame`, `fxClipImg`, `fxDd2`, `fxDd2Btn`, `fxFlip`, `fxHeroReplay`, `fxMap`, `fxMapBtn`, `fxMorph`, `fxMorphLbl`, `fxOverlay`, `fxOverlayBackdrop`, `fxOverlayClose`, `fxOverlayStage`, `fxOverlaySub`, `fxOverlayTitle`, `fxPopBtn`, `fxPopWrap`, `fxProgBar`, `fxProgFrame`, `fxProgPct`, `fxPxh`, `fxRingPct`, `fxRingRange`, `fxRingVal`, `fxSearchx`, `fxSearchxBtn`, `fxSearchxInput`, `fxShakeBtn`, `fxShakeInput`, `fxShakeWrap`, `fxSld`, `fxSldVal`, `fxStag`, `fxStagBtn`, `fxStars`, `fxStarsClear`, `fxStarsLbl`, `fxStepBody`, `fxStepNext`, `fxStepPrev`, `fxStepper`, `fxStepsFill`, `fxSwapBtn`, `fxSwapList`, `fxTabs2`, `fxTabs2Body`, `fxTabs2Ind`, `fxTstack`, `fxTstackBtn`, `popCopyIcon`, `popCopyName`, `popCopyPrompt`, `popDesc`, `popDiff`, `popPin`

### JS[4] — Đổi Màu tab (colour tool, largest single block)

- **Size:** 50,382 bytes | **setInterval:** 0 | **requestAnimationFrame:** 0 | **addEventListener:** 36 | **IntersectionObserver:** 0
- The whole 'Đổi Màu cho Web' tab (merged from 'Trình Xem Bảng Màu 3 Khung'): 12 palettes + 3 preview frames, per-colour editing, HEX copy, random palette, 3–8 colours, 27 Vietnamese fonts + font upload, gradient from palette, pattern fill, 21-shade HSL-interpolation generator (simulating Astryx OKLCH), chart colours, 7 Astryx themes; the 10 newer features: generate palette from one colour / from an uploaded image / by industry+style, favourites, history, export CSS/Tailwind/JSON/PNG, share-by-code link, dark-mode preview, WCAG contrast check, compare two palettes. All ids are cp- / ax- prefixed and live OUTSIDE the card data (tab UI, not demos). No timers.
- **IDs wired (39):** `axCatRow`, `axRamps`, `axSeedColor`, `axSeedHex`, `axShades`, `axThemeChips`, `cpApp`, `cpBtnImg`, `cpBtnRandom`, `cpBtnSaveFav`, `cpBtnSeed`, `cpBtnUploadFont`, `cpCmpA`, `cpCmpB`, `cpCmpSelA`, `cpCmpSelB`, `cpCntMinus`, `cpCntPlus`, `cpCntVal`, `cpContrastList`, `cpDarkToggle`, `cpExpCss`, `cpExpJson`, `cpExpPng`, `cpExpTw`, `cpFavList`, `cpFontBody`, `cpFontFile`, `cpFontHead`, `cpHistList`, `cpImgFile`, `cpPalList`, `cpRoleList`, `cpSchemeSel`, `cpSeedColor`, `cpSeedHex`, `cpSugCount`, `cpSuggestList`, `cpToast`

### JS[5] — AI-era component demos (n7- prefix)

- **Size:** 17,673 bytes | **setInterval:** 0 | **requestAnimationFrame:** 0 | **addEventListener:** 39 | **IntersectionObserver:** 0
- Wiring for the n7- batch of newer components: Checkbox Card, Radio Card, Date Input, Prompt Input, Suggestion chips, Model Selector, Menu, Icon, Reasoning, Inline Citation, Chain of Thought, Tool calls, Checkpoint, Floating Panel, and one more (Floating Panel variants). No timers.
- **IDs wired (53):** `n7Attach`, `n7Cbc`, `n7CbcCount`, `n7ChatInput`, `n7ChatMsgs`, `n7ChatSend`, `n7CiteCard`, `n7CiteS`, `n7CiteT`, `n7CiteU`, `n7Ckpt`, `n7CkptOut`, `n7CkptReset`, `n7Cot`, `n7CotHead`, `n7DateOut`, `n7Dd`, `n7Fp`, `n7FpFrame`, `n7FpHead`, `n7FpMax`, `n7FpMin`, `n7FpResize`, `n7IconGrid`, `n7IconOut`, `n7IconSearch`, `n7LevelSel`, `n7Menu`, `n7MenuBtn`, `n7MenuList`, `n7MenuOut`, `n7Mm`, `n7ModelOut`, `n7ModelSel`, `n7PromptMsgs`, `n7PromptSend`, `n7PromptText`, `n7Rdc`, `n7RdcCount`, `n7ReasonBtn`, `n7Restore`, `n7Sub`, `n7SubBtn`, `n7SugChips`, `n7SugInput`, `n7SugMsgs`, `n7SugSend`, `n7Think`, `n7ThinkHead`, `n7ThinkLabel`, `n7ThinkLines`, `n7Today`, `n7Yy`

### JS[6] — Figma batch (fg- / cpGrad / cpPat prefixes)

- **Size:** 12,133 bytes | **setInterval:** 2 | **requestAnimationFrame:** 2 | **addEventListener:** 25 | **IntersectionObserver:** 0
- Wiring for the Figma batch: 3D Card, Auto Layout, Bulk Edit, Drag, Jam (timer), Motion/Parallax, Noise, Blur, Scroll, Smart Animate, Stroke, Timeline, Variants/Slots, plus cpGrad (gradient angle/preview/copy) and cpPat (pattern chips/preview). 2 setInterval + 2 requestAnimationFrame.
- **IDs wired (37):** `cpApp`, `cpGradAngle`, `cpGradAngleVal`, `cpGradCopy`, `cpGradPreview`, `cpPatChips`, `cpPatPreview`, `fg3dCard`, `fg3dX`, `fg3dY`, `fgAuto`, `fgAutoBtn`, `fgAutoText`, `fgBpFrame`, `fgBulkBtn`, `fgBulkGrid`, `fgDrag`, `fgDragChip`, `fgJamBtn`, `fgJamTime`, `fgMpar`, `fgNoiseRange`, `fgNoiseSvg`, `fgPblur`, `fgPblurRange`, `fgScrBtn`, `fgScrTxt`, `fgSmart`, `fgSmartBtn`, `fgStroke`, `fgStrokeBtn`, `fgTlBall`, `fgTlPlay`, `fgTlRange`, `fgVarCard`, `fgVarSlot`, `fgVarSwap`

### JS[7] — Supplement batch 2 (n8- prefix)

- **Size:** 2,887 bytes | **setInterval:** 0 | **requestAnimationFrame:** 0 | **addEventListener:** 4 | **IntersectionObserver:** 0
- Small wiring block: Form validation (n8Form/n8Name/n8Email + error spans), Loading Button (n8LoadBtn), Layout Grid (n8Grid). No timers.
- **IDs wired (8):** `n8Email`, `n8EmailErr`, `n8Form`, `n8FormOk`, `n8Grid`, `n8LoadBtn`, `n8Name`, `n8NameErr`

### JS[8] — Astryx batch (ax- prefix)

- **Size:** 10,204 bytes | **setInterval:** 1 | **requestAnimationFrame:** 0 | **addEventListener:** 16 | **IntersectionObserver:** 0
- Wiring for the Astryx (Meta) batch: Ad frame, Group-by, Metric, Overflow, PowerSearch, Pricing Table, Readme/Remove-note, Sheet stack, Tokenizer. 1 setInterval.
- **IDs wired (29):** `axAdFrame`, `axGpBtn`, `axGpWrap`, `axMtBox`, `axMtChar`, `axMtDur`, `axMtRun`, `axMtTempo`, `axMtTempoVal`, `axOfBadge`, `axOfRange`, `axOfRow`, `axPsBar`, `axPsCount`, `axPsHint`, `axPtSel`, `axPtSort`, `axPtSt`, `axPtTable`, `axRmNote`, `axRmPanel`, `axRmRun`, `axRmToggle`, `axSheet`, `axSheet2`, `axSheetStack`, `axTkAdd`, `axTkField`, `axTkInput`

### JS[9] — Sticky toolbar, copy buttons, deep links, lazy-render

- **Size:** 5,593 bytes | **setInterval:** 0 | **requestAnimationFrame:** 0 | **addEventListener:** 5 | **IntersectionObserver:** 4
- Shell utilities: measures sticky toolbar height so group headers stick at the right offset; Copy-name / Copy-prompt buttons on cards; 'scroll to a row' offset handling; per-item deep links (#id auto-opens the right tab, scrolls to and highlights the card); group-filter chips that jump to a group; LAZY-RENDER of demos — IntersectionObserver (.demo-live) only starts a demo's animation when its row is about to enter the viewport (part of the dc28030 lag fix). 4 IntersectionObserver uses.
- **IDs wired (1):** `search`

### JS[10] — Pin / Export + 4 newest demos (n8- batch)

- **Size:** 13,215 bytes | **setInterval:** 1 | **requestAnimationFrame:** 0 | **addEventListener:** 13 | **IntersectionObserver:** 0
- Pin-a-sample / Export-request feature (localStorage: pin bar, pin panel, copy full request list, download .md) plus wiring for the 4 newest demos: Streaming Text (streaming-text), Before/After Image Slider (n8ba*), Pricing Table Toggle (pricing-toggle), Sticky Add-to-Cart Bar (n8st*). 1 setInterval.
- **IDs wired (23):** `n8baBefore`, `n8baHandle`, `n8baRange`, `n8ptM`, `n8ptNote`, `n8ptY`, `n8sacAdd`, `n8sacCount`, `n8stBtn`, `n8stText`, `pinClearBtn`, `pinCloseBtn`, `pinCopyBtn`, `pinCount`, `pinDownloadBtn`, `pinList`, `pinOutput`, `pinPalBtn`, `pinPanel`, `pinViewBtn`, `pinbar`, `pricing-toggle`, `streaming-text`

### JS[11] — Pin-label sync + EN-name auto-fit

- **Size:** 2,064 bytes | **setInterval:** 0 | **requestAnimationFrame:** 0 | **addEventListener:** 3 | **IntersectionObserver:** 0
- Syncs the 'Đã ghim' badge/label on cards with the localStorage pin state, and auto-shrinks the English name font so it fits on one line at every width. No timers; no demo wiring.
- **IDs wired:** none (global behaviour only).

### JS[12] — Auto-loop replay of effects (21:30 batch)

- **Size:** 18,106 bytes | **setInterval:** 1 | **requestAnimationFrame:** 3 | **addEventListener:** 20 | **IntersectionObserver:** 1
- Makes every effect run in a continuous loop on its own: one-shot effects replay on a cycle, click-triggered effects self-click on a cycle, sliders drift gently when untouched, mouse-follow effects drift when there is no mouse, 3D Transform auto-rotates, Draggable strolls, scroll frames auto-scroll up/down in a circle and yield when the user scrolls. Touches many fx- ids (see list). 1 setInterval + 3 requestAnimationFrame; 1 IntersectionObserver.
- **IDs wired (40):** `fg3dCard`, `fgDrag`, `fgDragChip`, `fgMpar`, `fgNoiseRange`, `fgPblurRange`, `fgTlPlay`, `fxAcc`, `fxBellBadge`, `fxClipFrame`, `fxDFrame`, `fxDOpen`, `fxFlip`, `fxGlow`, `fxGlowZone`, `fxHFrame`, `fxMWrap`, `fxMagBtn`, `fxMagZone`, `fxOverlay`, `fxProgFrame`, `fxPxFrame`, `fxPxh`, `fxRevealFrame`, `fxRingRange`, `fxRippleBtn`, `fxSearchx`, `fxSearchxInput`, `fxShFrame`, `fxShakeBtn`, `fxShakeInput`, `fxSld`, `fxSmoothFrame`, `fxStars`, `fxStarsClear`, `fxStepNext`, `fxStepPrev`, `fxTabs2`, `fxTiltCard`, `fxTmInput`

## JS-driven vs pure-CSS demos

Classification rule: a card counts as **JS-driven** if its own `<article id>` or *any* `id="..."` inside its `.stage` demo HTML is referenced in any of the 13 JS blocks (by `getElementById`, `#selector`, `$(...)`, or as a string literal). Otherwise it is **pure-CSS** (animation/interaction comes from CSS only — `:hover`, keyframes, transitions).

- **JS-driven: 142 cards** (142 of 242).
- **Pure-CSS: 100 cards** (100 of 242): 86 components + 14 effects.

Pure-CSS card ids (no id reference in any JS block):

`button`, `radio-button`, `slider-range`, `floating-action-button`, `text-input`, `search-bar`, `textarea`, `date-picker`, `file-upload`, `color-picker`, `autocomplete-combobox`, `multi-select`, `time-picker`, `calendar`, `tags-input`, `cascader`, `tree-select`, `date-range-picker`, `drag-and-drop-upload`, `mentions`, `input-group`, `floating-label`, `navbar`, `breadcrumb`, `sidebar`, `navigation-menu`, `affix`, `text-on-a-path`, `card`, `modal-dialog`, `toast`, `tooltip`, `avatar`, `progress-bar`, `spinner-loading`, `skeleton`, `carousel`, `alert`, `chip-tag`, `empty-state`, `timeline`, `separator`, `kbd`, `list-group`, `marquee`, `notification-bell`, `descriptions`, `masonry`, `result`, `typography`, `link`, `inline-code`, `watermark`, `status`, `blockquote`, `tool`, `chat-tool-calls`, `timestamp`, `drawer-sheet`, `bottom-sheet`, `popover`, `command-palette`, `alert-dialog`, `hover-card`, `backdrop`, `data-grid`, `chart`, `code-block`, `scroll-area`, `map`, `resizable-panel`, `infinite-scroll`, `virtual-list`, `aspect-ratio`, `bento-grid`, `hero-section`, `pricing-table`, `testimonial`, `footer`, `login-form`, `newsletter-form`, `comment-section`, `chat-bubble`, `cookie-banner`, `filter-panel`, `feature-section`, `image-zoom-on-hover`, `avatar-stack-hover`, `tooltip-fade`, `marquee-infinite-scrolling-text`, `shimmer-text`, `text-gradient-flow`, `shader-effects-gradient-map`, `gradient-animation`, `glassmorphism-float`, `gradient-border`, `rotating-badge`, `loading-spinner-variations`, `pulse-breathing`, `bounce`

### Caveats for the build agent

- **Class-based wiring still applies to "pure-CSS" cards.** Three mechanisms do not use per-demo ids and therefore affect pure-CSS cards too: (1) JS[9] lazy-render — an IntersectionObserver on `.demo-live` only starts a demo's animation when its row nears the viewport (dc28030 lag fix); (2) JS[12] auto-scroll — `.fx-scroll` frames auto-scroll in a loop and yield to user scrolling; (3) JS[3] scroll-reveal — IntersectionObserver adds `.in` to cards/sections (pure CSS animation, JS only toggles the class). Do not drop these when porting; they are global, not per-demo.
- **15 ids inside stages are never referenced in JS** (dead ids or wired only via a parent/class): `axAdBtn`, `fgNoiseF`, `fgTopPath`, `fgVarTitle`, `fxCar2Dots`, `fxRotPath`, `multiDemo`, `n6FlMail`, `n6FlName`, `n6Quiz`, `n7Date`, `n8Dev`, `rngDemo`, `splitMenu`, `umenuDemo`. They were kept verbatim in `demoHtml` anyway.
- **363 distinct ids exist inside the 242 `.stage` demos; 348 of them are referenced in JS.** The remaining 15 are the list above.
- **41 setInterval calls total** across blocks (JS[0] wraps `window.setInterval` itself and pauses all of them when the tab is hidden). The dc28030 lag fix replaced per-demo always-on loops with the shared `.demo-live` IntersectionObserver in JS[9] plus a single merged rAF loop — but the per-demo intervals in JS[1]/JS[3]/JS[6]/JS[8]/JS[10]/JS[12] are still present in the source; port them as islands that only run when visible.
- **The colour tab (JS[4]) is not demo data.** Its `cp-`/`ax-` ids belong to the Đổi Màu tab UI, which is a separate tab, not part of `components.json` / `effects.json`. It needs its own Astro island.
- **Popup behaviour lives in JS[3]** (`openCard`/`cardData`): it physically moves the card's `.stage` node into the overlay and back on close, clones the `#descStore` entry, and splits `.diff-line` out. In Astro this must be re-implemented (the stage node is moved, not copied — demo JS keeps working because the node itself moves).
- **Pin/export (JS[10], JS[11]) is localStorage-based** and touches every card via the `.pin-btn` / `.pin-badge` elements inside each article — those elements are NOT part of `demoHtml` (they sit outside `.stage`) and were deliberately not extracted; the build agent must re-create them per card.