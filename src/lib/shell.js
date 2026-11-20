/* Shell interactions — ported verbatim from the source single-file site.
   JS[1] search/tabs, JS[3] scroll-reveal + detail popup, JS[9] toolbar/copy/deep-links/
   groupbar scrollspy (WITHOUT its lazy-render block — DemoIsland owns .demo-live),
   JS[10] pin/export, JS[11] pin-badge sync + EN-name auto-fit. Runs once from index.astro. */
let __tpwShellDone = false;

export function initShell() {
  if (__tpwShellDone) return;
  __tpwShellDone = true;

  /* ----- JS[1] search + tabs ----- */
  (function () {

          var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

          /* ---------- Tìm kiếm / lọc ---------- */
          var rows = Array.prototype.slice.call(document.querySelectorAll(".card.comp"));
          var groups = Array.prototype.slice.call(document.querySelectorAll("#panel-components .grpsec"));
          var fxRows = Array.prototype.slice.call(document.querySelectorAll(".card.fxcomp"));
          var fxGroups = Array.prototype.slice.call(document.querySelectorAll("#panel-effects .grpsec"));
          var noresultFx = document.getElementById("noresultFx");
          var search = document.getElementById("search");
          var countLabel = document.getElementById("countLabel");
          var noresult = document.getElementById("noresult");
          var totalEl = document.getElementById("totalCount");
          if (totalEl) totalEl.textContent = rows.length + " thành phần";

          function norm(s) {
            return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");
          }
          function hayOf(r) {
            var c = r.cloneNode(true);
            var acts = c.querySelector(".row-actions");
            if (acts) acts.parentNode.removeChild(acts);
            var pb = c.querySelector(".pin-badge");
            if (pb) pb.parentNode.removeChild(pb);
            var ci = c.querySelector(".copy-name-icon");
            if (ci) ci.parentNode.removeChild(ci);
            var storeEl = document.querySelector('[data-desc-for="' + r.id + '"]');
            return norm(c.textContent + " " + (storeEl ? storeEl.textContent : "") + " " + (r.getAttribute("data-search") || ""));
          }
          rows.forEach(function (r) { r._hay = hayOf(r); });
          fxRows.forEach(function (r) { r._hay = hayOf(r); });
          var tabCompCount = document.getElementById("tabCompCount");
          if (tabCompCount) tabCompCount.textContent = rows.length;
          var activeTab = "comp";
          function filterSet(list, grpList, grpCls, rowCls, nrEl, unit) {
            var q = norm(search.value.trim());
            var visible = 0;
            list.forEach(function (r) {
              var show = !q || r._hay.indexOf(q) !== -1;
              r.style.display = show ? "" : "none";
              if (show) visible++;
            });
            grpList.forEach(function (g) {
              var els = g.querySelectorAll("." + rowCls), any = false;
              for (var i = 0; i < els.length; i++) {
                if (els[i].style.display !== "none") { any = true; break; }
              }
              g.style.display = any ? "" : "none";
            });
            countLabel.innerHTML = q ? "Thấy <b>" + visible + "</b> / " + list.length + " " + unit : list.length + " " + unit;
            if (nrEl) nrEl.classList.toggle("show", visible === 0);
          }
          function applyFilter() {
            if (activeTab === "color") return;
            if (activeTab === "fx") filterSet(fxRows, fxGroups, "fxgroup", "fxcomp", noresultFx, "hiệu ứng");
            else filterSet(rows, groups, "group", "comp", noresult, "thành phần");
          }
          search.addEventListener("input", applyFilter);

          /* ---------- Chuyển tab Thành phần / Hiệu ứng / Đổi Màu ---------- */
          var tabComp = document.getElementById("tabComp");
          var tabFx = document.getElementById("tabFx");
          var tabColor = document.getElementById("tabColor");
          var panelComp = document.getElementById("panel-components");
          var panelFx = document.getElementById("panel-effects");
          var panelColor = document.getElementById("panel-color");
          var searchbarEl = document.querySelector(".toprow .searchbar");
          function setMainTab(which) {
            activeTab = which;
            var fx = which === "fx";
            var color = which === "color";
            tabComp.setAttribute("aria-selected", which === "comp" ? "true" : "false");
            tabFx.setAttribute("aria-selected", fx ? "true" : "false");
            tabColor.setAttribute("aria-selected", color ? "true" : "false");
            panelComp.hidden = which !== "comp";
            panelFx.hidden = !fx;
            panelColor.hidden = !color;
            if (searchbarEl) searchbarEl.style.display = color ? "none" : "";
            if (!color) {
              search.placeholder = fx ? "Tìm hiệu ứng…" : "Tìm thành phần…";
              search.setAttribute("aria-label", fx ? "Tìm hiệu ứng chuyển động" : "Tìm thành phần");
              applyFilter();
            }
          }
          tabComp.addEventListener("click", function () { setMainTab("comp"); });
          tabFx.addEventListener("click", function () { setMainTab("fx"); });
          tabColor.addEventListener("click", function () { setMainTab("color"); });
          applyFilter();
  })();

  /* ----- JS[3] scroll reveal + popup ----- */
  (function () {

        var rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        /* ---------- Scroll Reveal / Fade-up cho thẻ + section tham khảo ---------- */
        var revealCards = Array.prototype.slice.call(document.querySelectorAll(".card.citem"));
        var revealRefs = Array.prototype.slice.call(document.querySelectorAll("section.refs"));
        revealRefs.forEach(function (el, i) { el.classList.add("reveal"); el.style.animationDelay = ((i % 3) * 55) + "ms"; });
        if (rm || !("IntersectionObserver" in window)) {
          revealRefs.forEach(function (el) { el.classList.add("in"); el.style.animationDelay = ""; });
        } else {
          var refsObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) {
                e.target.classList.add("in");
                refsObs.unobserve(e.target);
                (function (t) { setTimeout(function () { t.style.animationDelay = ""; }, 900); })(e.target);
              }
            });
          }, { threshold: 0.06, rootMargin: "0px 0px -28px 0px" });
          revealRefs.forEach(function (el) { refsObs.observe(el); });

          /* Thẻ: mờ dần + trỗi lên 14px trong 0.45s ease-out, trễ so le theo cột tối đa 120ms.
             Thẻ đã nằm trong khung nhìn lúc tải trang được observer kích hoạt ngay, không chờ cuộn. */
          var cardObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
              if (!e.isIntersecting) return;
              var card = e.target;
              var col = 0, sib = card.previousElementSibling, top = card.offsetTop;
              while (sib) { if (sib.offsetTop === top && sib.style.display !== "none") col++; sib = sib.previousElementSibling; }
              card.style.animationDelay = Math.min(col * 30, 120) + "ms";
              card.classList.add("in");
              cardObs.unobserve(card);
              setTimeout(function () { card.style.animationDelay = ""; }, 900);
            });
          }, { threshold: 0.04, rootMargin: "0px 0px -16px 0px" });
          revealCards.forEach(function (el) { cardObs.observe(el); });
        }

        /* ---------- Popup chi tiết thẻ (thành phần + hiệu ứng) + icon copy trên thẻ ---------- */
        var overlay = document.getElementById("fxOverlay");
        var overlayStage = document.getElementById("fxOverlayStage");
        var overlayTitle = document.getElementById("fxOverlayTitle");
        var overlaySub = document.getElementById("fxOverlaySub");
        var overlayClose = document.getElementById("fxOverlayClose");
        var popDesc = document.getElementById("popDesc");
        var popDiff = document.getElementById("popDiff");
        var popCopyName = document.getElementById("popCopyName");
        var popCopyPrompt = document.getElementById("popCopyPrompt");
        var popPin = document.getElementById("popPin");
        var popCopyIcon = document.getElementById("popCopyIcon");
        var overlayBox = overlay ? overlay.querySelector(".fx-overlay-box") : null;
        var movedStage = null, movedHome = null, movedNext = null, lastFocus = null, currentCard = null;

        function cardData(card) {
          var nameEl = card.querySelector(".name");
          var viEl = card.querySelector(".vi-name");
          var btns = card.querySelectorAll(".row-actions .copy-btn");
          return {
            en: nameEl ? nameEl.textContent.trim() : "",
            vi: viEl ? viEl.textContent.trim() : "",
            nameText: btns.length ? (btns[0].getAttribute("data-copy") || "") : "",
            promptText: btns.length > 1 ? (btns[1].getAttribute("data-copy") || "") : ""
          };
        }
        function syncPopPin() {
          if (!currentCard || !popPin) return;
          var pb = currentCard.querySelector(".pin-btn");
          var on = !!(pb && pb.classList.contains("pinned"));
          popPin.classList.toggle("pinned", on);
          popPin.setAttribute("aria-pressed", on ? "true" : "false");
          popPin.textContent = on ? "Đã ghim ✓" : "Ghim mẫu";
        }
        function openCard(card, triggerEl) {
          var stage = card.querySelector(".stage");
          if (!stage || !overlay) return;
          var d = cardData(card);
          currentCard = card;
          if (overlayBox) overlayBox.classList.toggle("pop-fx", card.classList.contains("fxcomp"));
          if (popCopyIcon) popCopyIcon.setAttribute("aria-label", "Copy tên tiếng Anh: " + (d.en || ""));
          overlayTitle.textContent = d.en || "Chi tiết";
          overlaySub.textContent = d.vi || "";
          if (popDesc) {
            popDesc.innerHTML = "";
            var srcEl = document.querySelector('[data-desc-for="' + card.id + '"]');
            if (srcEl) {
              var clone = srcEl.cloneNode(true);
              var diff = clone.querySelector(".diff-line");
              if (diff && popDiff) {
                popDiff.innerHTML = diff.innerHTML;
                popDiff.hidden = false;
                diff.parentNode.removeChild(diff);
              } else if (popDiff) { popDiff.innerHTML = ""; popDiff.hidden = true; }
              while (clone.firstChild) popDesc.appendChild(clone.firstChild);
            }
          }
          movedStage = stage; movedHome = stage.parentNode; movedNext = stage.nextSibling; lastFocus = triggerEl || card;
          overlayStage.appendChild(stage);
          overlay.hidden = false;
          document.body.classList.add("fx-locked");
          stage.querySelectorAll(".fx-scroll").forEach(function (f) { f.scrollTop = 0; });
          var replay = stage.querySelector("#fxHeroReplay, #fxSplitReplay, #fxCountReplay");
          if (replay) setTimeout(function () { replay.click(); }, 180);
          syncPopPin();
          overlayClose.focus();
        }
        function closeFx() {
          if (!overlay || overlay.hidden) return;
          if (movedStage && movedHome) {
            if (movedNext && movedNext.parentNode === movedHome) movedHome.insertBefore(movedStage, movedNext);
            else movedHome.appendChild(movedStage);
          }
          movedStage = null; movedHome = null; movedNext = null; currentCard = null;
          overlay.hidden = true;
          document.body.classList.remove("fx-locked");
          if (lastFocus) lastFocus.focus();
        }
        function popCopy(btn, text) {
          if (!text || !btn) return;
          function done() {
            if (btn._busy) return;
            btn._busy = true;
            var old = btn.textContent;
            btn.textContent = "Đã copy ✓";
            btn.classList.add("copied");
            setTimeout(function () { btn.textContent = old; btn.classList.remove("copied"); btn._busy = false; }, 1400);
          }
          function fallback() {
            var ta = document.createElement("textarea");
            ta.value = text;
            ta.setAttribute("readonly", "");
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand("copy"); } catch (err) {}
            document.body.removeChild(ta);
            done();
          }
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
          else fallback();
        }
        if (popCopyName) popCopyName.addEventListener("click", function () { if (currentCard) popCopy(popCopyName, cardData(currentCard).nameText); });
        if (popCopyPrompt) popCopyPrompt.addEventListener("click", function () { if (currentCard) popCopy(popCopyPrompt, cardData(currentCard).promptText); });
        if (popPin) popPin.addEventListener("click", function () {
          if (!currentCard) return;
          var pb = currentCard.querySelector(".pin-btn");
          if (pb) { pb.click(); syncPopPin(); }
        });
        document.querySelectorAll(".card.citem").forEach(function (card) {
          if (card.classList.contains("fxcomp")) {
            /* Thẻ hiệu ứng: CHỈ nút phóng to (góc dưới phải) mới mở popup — bấm vào
               vùng demo là tương tác trực tiếp với hiệu ứng, không mở popup. */
            card.removeAttribute("role");
            card.removeAttribute("aria-haspopup");
            card.setAttribute("tabindex", "-1");
            var exBtn = card.querySelector(".fx-card-expand");
            if (exBtn) exBtn.addEventListener("click", function (e) {
              e.stopPropagation();
              openCard(card, exBtn);
            });
            return;
          }
          card.addEventListener("click", function (e) {
            if (e.target.closest("button, a, input, select, textarea, label")) return;
            openCard(card, card);
          });
          card.addEventListener("keydown", function (e) {
            if ((e.key === "Enter" || e.key === " ") && e.target === card) { e.preventDefault(); openCard(card, card); }
          });
        });
        if (popCopyIcon) popCopyIcon.addEventListener("click", function (e) {
          e.stopPropagation();
          if (!currentCard) return;
          var text = cardData(currentCard).nameText || cardData(currentCard).en || "";
          if (!text) return;
          function showTip() {
            popCopyIcon.classList.add("copied");
            setTimeout(function () { popCopyIcon.classList.remove("copied"); }, 1400);
          }
          function fallback() {
            var ta = document.createElement("textarea");
            ta.value = text;
            ta.setAttribute("readonly", "");
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand("copy"); } catch (err) {}
            document.body.removeChild(ta);
            showTip();
          }
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(showTip, fallback);
          else fallback();
        });
        document.querySelectorAll(".copy-name-icon").forEach(function (btn) {
          btn.addEventListener("click", function (e) {
            e.stopPropagation();
            var text = btn.getAttribute("data-name") || "";
            function showTip() {
              btn.classList.add("copied");
              setTimeout(function () { btn.classList.remove("copied"); }, 1400);
            }
            function fallback() {
              var ta = document.createElement("textarea");
              ta.value = text;
              ta.setAttribute("readonly", "");
              ta.style.position = "fixed";
              ta.style.opacity = "0";
              document.body.appendChild(ta);
              ta.select();
              try { document.execCommand("copy"); } catch (err) {}
              document.body.removeChild(ta);
              showTip();
            }
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(showTip, fallback);
            else fallback();
          });
        });
        if (overlayClose) overlayClose.addEventListener("click", closeFx);
        var backdrop = document.getElementById("fxOverlayBackdrop");
        if (backdrop) backdrop.addEventListener("click", closeFx);
        document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeFx(); });
  })();

  /* ----- JS[9] toolbar/copy/deep-links/scrollspy ----- */
  (function () {

          "use strict";

          /* ---------- Thanh công cụ dính: đo chiều cao để thanh nhóm bám đúng vị trí ---------- */
          var toolbar = document.querySelector(".toolbar");
          function syncGbTop() {
            if (toolbar) document.documentElement.style.setProperty("--gb-top", (toolbar.offsetHeight + 2) + "px");
          }
          window.addEventListener("resize", syncGbTop);
          window.addEventListener("load", syncGbTop);
          syncGbTop();

          /* ---------- Nút Copy tên / Copy prompt ---------- */
          document.addEventListener("click", function (e) {
            var btn = e.target && e.target.closest ? e.target.closest(".copy-btn") : null;
            if (!btn) return;
            var text = btn.getAttribute("data-copy") || "";
            function done() {
              if (btn._busy) return;
              btn._busy = true;
              var old = btn.textContent;
              btn.textContent = "Đã copy";
              btn.classList.add("done");
              setTimeout(function () {
                btn.textContent = old;
                btn.classList.remove("done");
                btn._busy = false;
              }, 1400);
            }
            function fallback() {
              var ta = document.createElement("textarea");
              ta.value = text;
              ta.setAttribute("readonly", "");
              ta.style.position = "fixed";
              ta.style.opacity = "0";
              document.body.appendChild(ta);
              ta.select();
              try { document.execCommand("copy"); } catch (err) {}
              document.body.removeChild(ta);
              done();
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(text).then(done, fallback);
            } else fallback();
          });

          /* ---------- Cuộn tới một dòng, chừa chỗ cho thanh dính phía trên ---------- */
          function scrollToRow(row) {
            var off = (toolbar ? toolbar.offsetHeight : 0) + 70;
            var y = row.getBoundingClientRect().top + window.pageYOffset - off;
            window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
          }

          /* ---------- Link riêng từng mục (#id): tự mở đúng tab, cuộn tới và tô sáng ---------- */
          var searchInput = document.getElementById("search");
          function clearSearch() {
            if (searchInput && searchInput.value) {
              searchInput.value = "";
              searchInput.dispatchEvent(new Event("input", { bubbles: true }));
            }
          }
          function goToHash() {
            var id = (location.hash || "").replace(/^#/, "");
            if (!id) return;
            var row = document.getElementById(id);
            if (!row || !(row.classList.contains("comp") || row.classList.contains("fxcomp"))) return;
            var inFx = row.classList.contains("fxcomp");
            var panel = document.getElementById(inFx ? "panel-effects" : "panel-components");
            var tabBtn = document.getElementById(inFx ? "tabFx" : "tabComp");
            if (panel && panel.hidden && tabBtn) tabBtn.click();
            clearSearch();
            row.classList.add("in");
            row.classList.add("no-anim");
            setTimeout(function () {
              scrollToRow(row);
              row.classList.remove("row-flash");
              void row.offsetWidth;
              row.classList.add("row-flash");
              setTimeout(function () { row.classList.remove("row-flash"); row.classList.remove("no-anim"); }, 2100);
            }, 90);
          }
          window.addEventListener("hashchange", goToHash);
          if (location.hash) setTimeout(goToHash, 80);

          /* ---------- Thanh lọc nhóm: bấm chip là nhảy tới nhóm ---------- */
          function setActiveChip(chip) {
            var bar = chip.closest(".groupbar");
            if (!bar) return;
            bar.querySelectorAll(".gchip").forEach(function (c) { c.classList.toggle("on", c === chip); });
          }
          document.querySelectorAll(".gchip").forEach(function (chip) {
            chip.addEventListener("click", function () {
              var target = document.getElementById(chip.getAttribute("data-target"));
              if (!target) return;
              clearSearch();
              setActiveChip(chip);
              scrollToRow(target);
            });
          });
          if ("IntersectionObserver" in window) {
            var grpObs = new IntersectionObserver(function (entries) {
              entries.forEach(function (en) {
                if (!en.isIntersecting) return;
                var chip = document.querySelector('.gchip[data-target="' + en.target.id + '"]');
                if (chip) setActiveChip(chip);
              });
            }, { rootMargin: "-38% 0px -55% 0px", threshold: 0 });
            document.querySelectorAll(".grpsec").forEach(function (g) { grpObs.observe(g); });
          }
  })();

  /* ----- JS[10] pin / export ----- */
  (function () {

          "use strict";

          /* ================= Ghim mẫu / Xuất yêu cầu (lưu trong trình duyệt bằng localStorage) ================= */
          var PIN_KEY = "tpw-pins-v1";
          var pins = {};        /* id -> {kind, en, vi, prompt, btn} */
          var pinOrder = [];
          var includePalette = false;
          var rowBtns = {};     /* id -> nút ghim của dòng đó */

          function savePins() {
            try {
              var items = {};
              pinOrder.forEach(function (id) {
                var p = pins[id];
                if (p) items[id] = { kind: p.kind, en: p.en, vi: p.vi, prompt: p.prompt };
              });
              localStorage.setItem(PIN_KEY, JSON.stringify({ order: pinOrder.slice(), items: items, includePalette: includePalette }));
            } catch (e) {}
          }
          var pinbar = document.getElementById("pinbar");
          var pinCount = document.getElementById("pinCount");
          var pinPanel = document.getElementById("pinPanel");
          var pinList = document.getElementById("pinList");
          var pinOutput = document.getElementById("pinOutput");
          var pinPalBtn = document.getElementById("pinPalBtn");

          function buildOutput() {
            var lines = [];
            lines.push("YÊU CẦU LÀM WEB — CÁC MẪU ĐÃ GHIM");
            lines.push("(Chọn từ trang Thành Phần Web Thường Gặp)");
            lines.push("");
            var comps = pinOrder.filter(function (id) { return pins[id].kind === "comp"; });
            var fxs = pinOrder.filter(function (id) { return pins[id].kind === "fx"; });
            function dump(title, ids) {
              if (!ids.length) return;
              lines.push(title + " (" + ids.length + "):");
              ids.forEach(function (id, i) {
                var p = pins[id];
                lines.push((i + 1) + ". " + p.en + (p.vi ? " — " + p.vi : ""));
                if (p.prompt) lines.push("   Prompt: " + p.prompt);
              });
              lines.push("");
            }
            dump("THÀNH PHẦN WEB", comps);
            dump("HIỆU ỨNG CHUYỂN ĐỘNG", fxs);
            if (includePalette && typeof window.__tpwPalette === "function") {
              var pal = window.__tpwPalette();
              lines.push("BẢNG MÀU ĐANG DÙNG (tab Đổi Màu cho Web):");
              lines.push("- " + pal.name + ": " + pal.colors.join(", "));
              lines.push("");
            }
            lines.push("Hãy dùng đúng các thành phần và hiệu ứng trên cho trang web của tôi.");
            return lines.join("\n");
          }

          function renderPins() {
            var n = pinOrder.length;
            if (pinCount) pinCount.textContent = n;
            if (pinbar) pinbar.hidden = n === 0;
            if (n === 0 && pinPanel) pinPanel.hidden = true;
            if (!pinList) return;
            pinList.innerHTML = "";
            if (!n) {
              var empty = document.createElement("div");
              empty.className = "pin-empty";
              empty.textContent = "Chưa ghim mẫu nào. Bấm nút “Ghim mẫu” ở bất kỳ dòng thành phần hoặc hiệu ứng nào nhé.";
              pinList.appendChild(empty);
            }
            pinOrder.forEach(function (id) {
              var p = pins[id];
              var row = document.createElement("div");
              row.className = "pin-item";
              var kind = document.createElement("span");
              kind.className = "pin-kind";
              kind.textContent = p.kind === "fx" ? "Hiệu ứng" : "Thành phần";
              var nm = document.createElement("span");
              nm.className = "pin-name";
              nm.textContent = p.en;
              var vi = document.createElement("span");
              vi.className = "pin-vi";
              vi.textContent = p.vi;
              var x = document.createElement("button");
              x.type = "button";
              x.className = "pin-x";
              x.textContent = "Bỏ ghim";
              x.addEventListener("click", function () { unpin(id); });
              row.appendChild(kind); row.appendChild(nm); row.appendChild(vi); row.appendChild(x);
              pinList.appendChild(row);
            });
            if (pinOutput) pinOutput.value = n ? buildOutput() : "";
            savePins();
          }

          function unpin(id) {
            var p = pins[id];
            if (!p) return;
            delete pins[id];
            pinOrder = pinOrder.filter(function (x) { return x !== id; });
            if (p.btn) {
              p.btn.classList.remove("pinned");
              p.btn.textContent = "Ghim mẫu";
              p.btn.setAttribute("aria-pressed", "false");
            }
            renderPins();
          }

          document.querySelectorAll(".card.comp, .card.fxcomp").forEach(function (row) {
            var actions = row.querySelector(".row-actions");
            if (!actions) return;
            var nameEl = row.querySelector(".name");
            var viEl = row.querySelector(".vi-name");
            var copyBtns = actions.querySelectorAll(".copy-btn");
            var en = nameEl ? nameEl.textContent.trim() : row.id;
            var vi = viEl ? viEl.textContent.trim() : "";
            var prompt = copyBtns.length > 1 ? (copyBtns[1].getAttribute("data-copy") || "") : "";
            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "copy-btn pin-btn";
            btn.textContent = "Ghim mẫu";
            btn.setAttribute("aria-pressed", "false");
            btn.addEventListener("click", function () {
              if (pins[row.id]) { unpin(row.id); return; }
              pins[row.id] = { kind: row.classList.contains("fxcomp") ? "fx" : "comp", en: en, vi: vi, prompt: prompt, btn: btn };
              pinOrder.push(row.id);
              btn.classList.add("pinned");
              btn.textContent = "Đã ghim ✓";
              btn.setAttribute("aria-pressed", "true");
              renderPins();
            });
            rowBtns[row.id] = btn;
            actions.appendChild(btn);
          });

          var viewBtn = document.getElementById("pinViewBtn");
          if (viewBtn) viewBtn.addEventListener("click", function () {
            if (pinPanel) {
              pinPanel.hidden = !pinPanel.hidden;
              if (!pinPanel.hidden) pinPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
          });
          var closeBtn = document.getElementById("pinCloseBtn");
          if (closeBtn) closeBtn.addEventListener("click", function () { if (pinPanel) pinPanel.hidden = true; });
          var clearBtn = document.getElementById("pinClearBtn");
          if (clearBtn) clearBtn.addEventListener("click", function () {
            pinOrder.slice().forEach(unpin);
          });
          if (pinPalBtn) pinPalBtn.addEventListener("click", function () {
            includePalette = !includePalette;
            pinPalBtn.classList.toggle("on", includePalette);
            pinPalBtn.setAttribute("aria-pressed", includePalette ? "true" : "false");
            pinPalBtn.textContent = includePalette ? "Đã thêm bảng màu ✓" : "Thêm bảng màu đang dùng";
            renderPins();
          });
          var copyBtn = document.getElementById("pinCopyBtn");
          if (copyBtn) copyBtn.addEventListener("click", function () {
            var text = pinOutput ? pinOutput.value : "";
            if (!text) return;
            function done() {
              var old = copyBtn.textContent;
              copyBtn.textContent = "Đã copy ✓";
              setTimeout(function () { copyBtn.textContent = old; }, 1400);
            }
            function fallback() {
              pinOutput.removeAttribute("readonly");
              pinOutput.select();
              try { document.execCommand("copy"); } catch (e) {}
              pinOutput.setAttribute("readonly", "");
              done();
            }
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
            else fallback();
          });
          var dlBtn = document.getElementById("pinDownloadBtn");
          if (dlBtn) dlBtn.addEventListener("click", function () {
            var text = pinOutput ? pinOutput.value : "";
            if (!text) return;
            var blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
            var url = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = "yeu-cau-lam-web.md";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(function () { URL.revokeObjectURL(url); }, 800);
          });

          /* Khôi phục danh sách đã ghim từ lần xem trước (localStorage) */
          (function restorePins() {
            var saved = null;
            try { saved = JSON.parse(localStorage.getItem(PIN_KEY) || "null"); } catch (e) {}
            if (!saved || !saved.order || !saved.items) return;
            saved.order.forEach(function (id) {
              var it = saved.items[id];
              var btn = rowBtns[id];
              if (!it || !btn) return;
              pins[id] = { kind: it.kind, en: it.en, vi: it.vi, prompt: it.prompt || "", btn: btn };
              pinOrder.push(id);
              btn.classList.add("pinned");
              btn.textContent = "Đã ghim ✓";
              btn.setAttribute("aria-pressed", "true");
            });
            if (saved.includePalette) {
              includePalette = true;
              if (pinPalBtn) {
                pinPalBtn.classList.add("on");
                pinPalBtn.setAttribute("aria-pressed", "true");
                pinPalBtn.textContent = "Đã thêm bảng màu ✓";
              }
            }
          })();
          renderPins();
  })();

  /* ----- JS[11] pin-badge sync + name fit ----- */

        (function () {
          "use strict";

          /* ---------- Đồng bộ nhãn "Đã ghim" trên thẻ với trạng thái ghim (localStorage) ---------- */
          function syncBadge(card) {
            var pb = card.querySelector(".pin-btn");
            var badge = card.querySelector(".pin-badge");
            if (badge) badge.hidden = !(pb && pb.classList.contains("pinned"));
          }
          document.querySelectorAll(".card.citem").forEach(function (card) {
            syncBadge(card);
            var pb = card.querySelector(".pin-btn");
            if (pb && "MutationObserver" in window) {
              new MutationObserver(function () { syncBadge(card); }).observe(pb, { attributes: true, attributeFilter: ["class"] });
            }
          });

          /* ---------- Thu cỡ chữ tên tiếng Anh để vừa đúng 1 dòng ở mọi bề rộng ---------- */
          function fitNames() {
            document.querySelectorAll(".card.citem .name").forEach(function (h) {
              if (!h.clientWidth) return;
              h.style.fontSize = "";
              h.style.letterSpacing = "";
              var size = parseFloat(getComputedStyle(h).fontSize) || 16;
              var guard = 0;
              while (h.scrollWidth > h.clientWidth && size > 9.5 && guard < 20) {
                size -= 0.5;
                h.style.fontSize = size + "px";
                if (size <= 12) h.style.letterSpacing = "-0.02em";
                guard++;
              }
            });
          }
          var fitTimer = null;
          function scheduleFit() { clearTimeout(fitTimer); fitTimer = setTimeout(fitNames, 60); }
          window.addEventListener("resize", scheduleFit);
          window.addEventListener("load", fitNames);
          if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(fitNames, 30); });
          ["tabFx", "tabComp"].forEach(function (id) {
            var t = document.getElementById(id);
            if (t) t.addEventListener("click", function () { setTimeout(fitNames, 40); });
          });
          fitNames();
        })();

}
