/* Doi Mau tab — ported verbatim from the source: JS[4] (whole colour tool) +
   the cpGrad/cpPat tail of JS[6] (gradient + pattern from current palette).
   Runs once per panel mount from the ColorTool island effect. */
let __tpwColorDone = false;

export function initColorTool() {
  if (__tpwColorDone) return;
  __tpwColorDone = true;

  /* ----- JS[4] Doi Mau tab ----- */

        /* ---------- Tab Đổi Màu cho Web (gộp từ "Trình Xem Bảng Màu 3 Khung") ---------- */
        (function () {
          var cpRoot = document.getElementById("cpApp");
          if (!cpRoot) return;
          var colorCount = 5;

          function hexToRgb(hex) {
            var h = hex.replace("#", "");
            return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)];
          }
          function roleLabel(i, n) {
            if (i === 0) return "Nền trang";
            if (i === 1) return "Màu chính";
            if (i === 2) return n === 3 ? "Màu nhấn" : "Màu phụ";
            if (i === 3) return "Màu nhấn";
            if (i === 4) return "Màu tối / chữ";
            return "Màu thêm " + (i - 4);
          }
          function mixHex(a, b, t) {
            var ca = hexToRgb(a), cb = hexToRgb(b);
            var to = function (x) { return Math.round(x).toString(16).padStart(2, "0"); };
            return ("#" + to(ca[0] + (cb[0] - ca[0]) * t) + to(ca[1] + (cb[1] - ca[1]) * t) + to(ca[2] + (cb[2] - ca[2]) * t)).toUpperCase();
          }
          function hexToHsl(hex) {
            var c = hexToRgb(hex);
            var r = c[0] / 255, g = c[1] / 255, b = c[2] / 255;
            var max = Math.max(r, g, b), min = Math.min(r, g, b);
            var h = 0, s = 0, l = (max + min) / 2;
            if (max !== min) {
              var d = max - min;
              s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
              if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
              else if (max === g) h = (b - r) / d + 2;
              else h = (r - g) / d + 4;
              h *= 60;
            }
            return [h, s * 100, l * 100];
          }
          function hslToHex(h, s, l) {
            s /= 100; l /= 100;
            var k = function (n) { return (n + h / 30) % 12; };
            var a = s * Math.min(l, 1 - l);
            var f = function (n) { return l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); };
            var to = function (x) { return Math.round(x * 255).toString(16).padStart(2, "0"); };
            return ("#" + to(f(0)) + to(f(8)) + to(f(4))).toUpperCase();
          }
          function hueShift(hex, deg) {
            var hsl = hexToHsl(hex);
            return hslToHex((hsl[0] + deg) % 360, Math.max(30, Math.min(85, hsl[1])), Math.max(32, Math.min(68, hsl[2])));
          }
          function genExtra(colors, idx) {
            var srcs = [colors[1], colors[3] || colors[1], colors[2] || colors[1]];
            return hueShift(srcs[(idx - 5) % 3], 55 + ((idx - 5) % 3) * 45);
          }
          function fitCount(colors, n) {
            var out = colors.slice(0, n);
            while (out.length < n) out.push(genExtra(out, out.length));
            return out;
          }
          function effectiveRoles(colors) {
            var secondary, accent, dark;
            if (colors.length === 3) {
              accent = colors[2];
              secondary = mixHex(colors[1], accent, 0.45);
              dark = mixHex(colors[1], "#0B1220", 0.78);
            } else if (colors.length === 4) {
              secondary = colors[2]; accent = colors[3];
              dark = mixHex(colors[1], "#0B1220", 0.78);
            } else {
              secondary = colors[2]; accent = colors[3]; dark = colors[4];
            }
            return { bg: colors[0], primary: colors[1], secondary: secondary, accent: accent, dark: dark };
          }
          function readableOn(hex) {
            var c = hexToRgb(hex);
            var lum = (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255;
            return lum > 0.62 ? "#22303F" : "#FFFFFF";
          }

          var PALETTES = [
            { name: "Đại Dương",    colors: ["#E9F3FB", "#5B9BD5", "#63B3A6", "#F08A3C", "#173A5E"] },
            { name: "Kẹo Ngọt",     colors: ["#FDF6EC", "#7FB3E8", "#7ED491", "#EE6C4A", "#4A3226"] },
            { name: "Hoàng Hôn",    colors: ["#FDF0E2", "#E4572E", "#F2A03D", "#C73E6D", "#3A2230"] },
            { name: "Rừng Xanh",    colors: ["#EFF6EA", "#4E9B47", "#93C572", "#E9B44C", "#22331C"] },
            { name: "Đêm Sao",      colors: ["#EDF0F7", "#3D405B", "#81B29A", "#F2CC8F", "#232333"] },
            { name: "Dâu Tây",      colors: ["#FBF1EC", "#C97B84", "#E3A857", "#B03060", "#33272A"] },
            { name: "Oải Hương",    colors: ["#F4F1FA", "#8B7FD4", "#A9CCE8", "#F09BB5", "#2E2A5C"] },
            { name: "Cà Phê Sữa",   colors: ["#F7F1E5", "#B08968", "#DDB892", "#7F5539", "#2B1D16"] },
            { name: "San Hô",       colors: ["#EAF7F4", "#2BB3A3", "#7FD1C0", "#FF7B6B", "#123B3C"] },
            { name: "Hồng Đào",     colors: ["#FDF2F4", "#E5638C", "#F2A0B5", "#F6C453", "#3D2430"] },
            { name: "Navy Cam",     colors: ["#EEF3F9", "#052E57", "#2E6DA8", "#FC7A01", "#0B1F33"] },
            { name: "Chanh Bạc Hà", colors: ["#F4F9EC", "#8CC084", "#B7D957", "#F5C044", "#2C4423"] }
          ];

          var current = PALETTES[0].colors.slice();
          var activeIndex = 0;

          window.__tpwPalette = function () {
            var base = (activeIndex >= 0 && PALETTES[activeIndex]) ? PALETTES[activeIndex] : null;
            var nm = base ? base.name : "Bảng tự chỉnh";
            if (base && base.colors.join(",") !== current.join(",")) nm += " (đã chỉnh)";
            return { name: nm, colors: current.slice() };
          };

          function applyColors(colors) {
            current = colors.slice();
            var r = displayRoles(colors);
            var st = cpRoot.style;
            st.setProperty("--p-bg", r.bg);
            st.setProperty("--p-primary", r.primary);
            st.setProperty("--p-secondary", r.secondary);
            st.setProperty("--p-accent", r.accent);
            st.setProperty("--p-dark", r.dark);
            st.setProperty("--on-primary", readableOn(r.primary));
            st.setProperty("--on-accent", readableOn(r.accent));
            for (var k = 1; k <= 3; k++) {
              if (colors[4 + k]) st.setProperty("--p-x" + k, colors[4 + k]);
              else st.removeProperty("--p-x" + k);
            }
            if (darkPreview) st.setProperty("--p-card", mixHex(r.bg, "#FFFFFF", 0.09));
            else st.removeProperty("--p-card");
            renderRoles();
            renderContrast();
            refreshCompare();
          }

          function renderPalettes() {
            var wrap = document.getElementById("cpPalList");
            wrap.innerHTML = "";
            PALETTES.forEach(function (pal, i) {
              var btn = document.createElement("button");
              btn.type = "button";
              btn.className = "cp-pal-btn" + (i === activeIndex ? " cp-active" : "");
              btn.setAttribute("aria-pressed", i === activeIndex ? "true" : "false");
              var dots = fitCount(pal.colors, colorCount).map(function (c) { return '<i style="background:' + c + '"></i>'; }).join("");
              btn.innerHTML = '<span class="cp-pal-name">' + pal.name +
                '<svg class="cp-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>' +
                '<span class="cp-dots">' + dots + "</span>";
              btn.addEventListener("click", function () {
                activeIndex = i;
                applyColors(fitCount(pal.colors, colorCount));
                renderPalettes();
                pushHistory(current, pal.name);
              });
              wrap.appendChild(btn);
            });
          }

          function renderRoles() {
            var wrap = document.getElementById("cpRoleList");
            wrap.innerHTML = "";
            current.forEach(function (color, i) {
              var label = roleLabel(i, current.length);
              var row = document.createElement("div");
              row.className = "cp-role-row";
              row.innerHTML =
                '<input type="color" class="cp-color-input" value="' + color + '" aria-label="Chỉnh màu ' + label + '" title="Chỉnh màu ' + label + '">' +
                '<div><div class="cp-role-name">' + label + '</div><div class="cp-hex">' + color.toUpperCase() + "</div></div>" +
                '<button class="cp-copy-btn" type="button" aria-label="Chép mã màu ' + color.toUpperCase() + '">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>';
              var input = row.querySelector('input[type="color"]');
              input.addEventListener("input", function () {
                activeIndex = -1;
                var next = current.slice();
                next[i] = input.value;
                applyColors(next);
                renderPalettes();
              });
              row.querySelector(".cp-copy-btn").addEventListener("click", function () {
                copyHex(current[i]);
              });
              wrap.appendChild(row);
            });
          }

          var toastTimer = null;
          function showToast(msg) {
            var t = document.getElementById("cpToast");
            t.textContent = msg;
            t.classList.add("cp-show");
            clearTimeout(toastTimer);
            toastTimer = setTimeout(function () { t.classList.remove("cp-show"); }, 1800);
          }
          function copyHex(hex) {
            var done = function () { showToast("Đã chép mã màu " + hex.toUpperCase()); };
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(hex.toUpperCase()).then(done, function () { fallbackCopy(hex); done(); });
            } else { fallbackCopy(hex); done(); }
          }
          function fallbackCopy(text) {
            var ta = document.createElement("textarea");
            ta.value = text.toUpperCase();
            ta.style.position = "fixed"; ta.style.opacity = "0";
            document.body.appendChild(ta); ta.select();
            try { document.execCommand("copy"); } catch (e) {}
            document.body.removeChild(ta);
          }

          document.getElementById("cpBtnRandom").addEventListener("click", function () {
            var h = Math.floor(Math.random() * 360);
            var scheme = [
              hslToHex(h, 55, 96),
              hslToHex(h, 62, 52),
              hslToHex((h + 40) % 360, 45, 58),
              hslToHex((h + 180) % 360, 78, 55),
              hslToHex(h, 45, 16)
            ];
            var seed = colorCount === 3 ? [scheme[0], scheme[1], scheme[3]] : scheme.slice(0, Math.min(colorCount, 5));
            activeIndex = -1;
            applyColors(fitCount(seed, colorCount));
            renderPalettes();
            pushHistory(current, "Bảng ngẫu nhiên");
            showToast("Đã tạo bảng màu ngẫu nhiên");
          });

          /* ---------- Số lượng màu 3–8 ---------- */
          var cntVal = document.getElementById("cpCntVal");
          var cntMinus = document.getElementById("cpCntMinus");
          var cntPlus = document.getElementById("cpCntPlus");
          function refreshStepper() {
            cntVal.textContent = colorCount;
            cntMinus.disabled = colorCount <= 3;
            cntPlus.disabled = colorCount >= 8;
          }
          function setCount(n) {
            colorCount = Math.max(3, Math.min(8, n));
            refreshStepper();
            applyColors(fitCount(current, colorCount));
            renderPalettes();
          }
          cntMinus.addEventListener("click", function () { setCount(colorCount - 1); });
          cntPlus.addEventListener("click", function () { setCount(colorCount + 1); });

          /* ---------- Font chữ (27 font hỗ trợ tiếng Việt + tải lên) ---------- */
          var FONT_GROUPS = [
            { label: "Sans — hiện đại, dễ đọc", fonts: ["Be Vietnam Pro", "Inter", "Roboto", "Open Sans", "Montserrat", "Nunito", "Quicksand", "Lexend", "Manrope", "Mulish", "Work Sans", "Archivo", "Kanit", "Josefin Sans", "Comfortaa", "Space Grotesk"] },
            { label: "Đậm — hợp làm tiêu đề", fonts: ["Oswald", "Roboto Condensed", "Anton", "Baloo 2"] },
            { label: "Serif — sang trọng", fonts: ["Playfair Display"] },
            { label: "Viết tay — trang trí", fonts: ["Dancing Script", "Caveat", "Pacifico", "Lobster", "Great Vibes", "Itim"] }
          ];
          var uploadedFonts = [];
          var fontHeadSel = document.getElementById("cpFontHead");
          var fontBodySel = document.getElementById("cpFontBody");

          function fillFontSelect(sel, selected) {
            sel.innerHTML = "";
            FONT_GROUPS.forEach(function (g) {
              var og = document.createElement("optgroup");
              og.label = g.label;
              g.fonts.forEach(function (f) {
                var o = document.createElement("option");
                o.value = f;
                o.textContent = f;
                og.appendChild(o);
              });
              sel.appendChild(og);
            });
            if (uploadedFonts.length) {
              var og2 = document.createElement("optgroup");
              og2.label = "Font bạn tải lên";
              uploadedFonts.forEach(function (f) {
                var o = document.createElement("option");
                o.value = f.family;
                o.textContent = f.name;
                og2.appendChild(o);
              });
              sel.appendChild(og2);
            }
            sel.value = selected;
          }
          function applyFonts() {
            var hf = fontHeadSel.value, bf = fontBodySel.value;
            cpRoot.style.setProperty("--f-head", '"' + hf + '", system-ui, sans-serif');
            cpRoot.style.setProperty("--f-body", '"' + bf + '", system-ui, sans-serif');
            fontHeadSel.style.fontFamily = '"' + hf + '", sans-serif';
            fontBodySel.style.fontFamily = '"' + bf + '", sans-serif';
          }
          fontHeadSel.addEventListener("change", applyFonts);
          fontBodySel.addEventListener("change", applyFonts);

          document.getElementById("cpBtnUploadFont").addEventListener("click", function () {
            document.getElementById("cpFontFile").click();
          });
          document.getElementById("cpFontFile").addEventListener("change", function () {
            var file = this.files && this.files[0];
            var prevBody = fontBodySel.value;
            this.value = "";
            if (!file) return;
            var nice = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "Font của bạn";
            var fam = "FontTaiLen" + (uploadedFonts.length + 1);
            file.arrayBuffer().then(function (buf) {
              var face = new FontFace(fam, buf);
              return face.load();
            }).then(function (loaded) {
              document.fonts.add(loaded);
              uploadedFonts.push({ name: nice, family: fam });
              fillFontSelect(fontHeadSel, fam);
              fillFontSelect(fontBodySel, prevBody);
              applyFonts();
              showToast("Đã thêm font “" + nice + "” làm font tiêu đề");
            }).catch(function () {
              showToast("Không đọc được file font này — thử .ttf, .otf hoặc .woff2");
            });
          });

          /* ================================================================
             10 TÍNH NĂNG MỚI: sinh bảng (màu chính / ảnh / ngành), lưu yêu
             thích, lịch sử, xuất file, chia sẻ bằng mã link, tương phản
             WCAG, xem trước chế độ tối, so sánh 2 bảng.
             ================================================================ */
          var darkPreview = false;

          var store = {
            get: function (k) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
            set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
          };

          /* ----- Chế độ tối cho khung mẫu ----- */
          function darkRoles(r) {
            function lift(hex, dl) {
              var hsl = hexToHsl(hex);
              return hslToHex(hsl[0], Math.max(25, Math.min(85, hsl[1])), Math.max(32, Math.min(74, hsl[2] + dl)));
            }
            return {
              bg: mixHex(r.dark, "#05080D", 0.35),
              primary: lift(r.primary, 14),
              secondary: lift(r.secondary, 14),
              accent: lift(r.accent, 10),
              dark: mixHex(r.bg, "#FFFFFF", 0.55)
            };
          }
          function displayRoles(colors) {
            var r = effectiveRoles(colors);
            return darkPreview ? darkRoles(r) : r;
          }
          var darkToggle = document.getElementById("cpDarkToggle");
          darkToggle.addEventListener("click", function () {
            darkPreview = !darkPreview;
            darkToggle.classList.toggle("cp-on", darkPreview);
            darkToggle.setAttribute("aria-pressed", darkPreview ? "true" : "false");
            applyColors(current);
            showToast(darkPreview ? "Đang xem khung mẫu ở chế độ tối" : "Đã tắt xem trước chế độ tối");
          });

          /* ----- Tương phản WCAG ----- */
          function relLum(hex) {
            var c = hexToRgb(hex).map(function (v) {
              v = v / 255;
              return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
          }
          function contrastRatio(a, b) {
            var l1 = relLum(a), l2 = relLum(b);
            return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
          }
          function renderContrast() {
            var wrap = document.getElementById("cpContrastList");
            if (!wrap) return;
            var r = displayRoles(current);
            var pairs = [
              ["Chữ chính trên nền trang", r.dark, r.bg],
              ["Chữ trên nút màu chính", readableOn(r.primary), r.primary],
              ["Chữ trên nút màu nhấn", readableOn(r.accent), r.accent],
              ["Chữ trắng trên màu chính", "#FFFFFF", r.primary],
              ["Chữ trắng trên màu tối", "#FFFFFF", r.dark]
            ];
            wrap.innerHTML = "";
            pairs.forEach(function (p) {
              var ratio = contrastRatio(p[1], p[2]);
              var badge, cls;
              if (ratio >= 7) { badge = "AAA"; cls = "cp-b-aaa"; }
              else if (ratio >= 4.5) { badge = "AA"; cls = "cp-b-aa"; }
              else if (ratio >= 3) { badge = "AA chữ lớn"; cls = "cp-b-lg"; }
              else { badge = "Chưa đạt"; cls = "cp-b-bad"; }
              var row = document.createElement("div");
              row.className = "cp-contrast-row";
              row.innerHTML = '<span class="cp-cr-name"><i style="background:' + p[2] + '"></i>' + p[0] + '</span>' +
                '<span class="cp-cr-right"><span class="cp-cr-ratio">' + ratio.toFixed(2) + ':1</span><span class="cp-badge ' + cls + '">' + badge + "</span></span>";
              wrap.appendChild(row);
            });
          }

          /* ----- Dùng chung: áp dụng 1 bảng bất kỳ + lịch sử + yêu thích ----- */
          function palDots(colors) {
            return '<span class="cp-dots cp-dots-sm">' + colors.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join("") + "</span>";
          }
          function usePalette(colors, name) {
            activeIndex = -1;
            colorCount = Math.max(3, Math.min(8, colors.length));
            refreshStepper();
            applyColors(fitCount(colors.slice(), colorCount));
            renderPalettes();
            if (name) pushHistory(current, name);
          }
          var favs = store.get("cpFavPalettes") || [];
          var historyList = store.get("cpPalHistory") || [];
          function pushHistory(colors, name) {
            var key = colors.join(",");
            historyList = historyList.filter(function (h) { return h.colors.join(",") !== key; });
            historyList.unshift({ name: name || "Bảng tự chỉnh", colors: colors.slice() });
            historyList = historyList.slice(0, 8);
            store.set("cpPalHistory", historyList);
            renderHistory();
          }
          function savedRow(item, onDelete) {
            var row = document.createElement("div");
            row.className = "cp-saved-row";
            row.setAttribute("role", "button");
            row.setAttribute("tabindex", "0");
            row.innerHTML = palDots(item.colors) + '<span class="nm">' + item.name + "</span>" +
              (onDelete ? '<button type="button" class="cp-del-btn" aria-label="Xóa bảng đã lưu ' + item.name + '">×</button>' : "");
            row.addEventListener("click", function () { usePalette(item.colors, item.name); });
            row.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); usePalette(item.colors, item.name); } });
            if (onDelete) {
              row.querySelector(".cp-del-btn").addEventListener("click", function (e) { e.stopPropagation(); onDelete(); });
            }
            return row;
          }
          function renderFavs() {
            var wrap = document.getElementById("cpFavList");
            wrap.innerHTML = "";
            if (!favs.length) {
              wrap.innerHTML = '<p class="cp-empty">Chưa có bảng nào được lưu. Bấm “Lưu bảng đang dùng” để giữ lại bảng bạn thích — mở lại trang sau vẫn còn.</p>';
              return;
            }
            favs.forEach(function (f, idx) {
              wrap.appendChild(savedRow(f, function () {
                favs.splice(idx, 1);
                store.set("cpFavPalettes", favs);
                renderFavs();
                showToast("Đã xóa bảng đã lưu");
              }));
            });
          }
          function renderHistory() {
            var wrap = document.getElementById("cpHistList");
            if (!wrap) return;
            wrap.innerHTML = "";
            if (!historyList.length) {
              wrap.innerHTML = '<p class="cp-empty">Chưa có bảng nào trong lịch sử. Các bảng bạn chọn, sinh mới hoặc trích từ ảnh sẽ hiện ở đây.</p>';
              return;
            }
            historyList.forEach(function (h) { wrap.appendChild(savedRow(h, null)); });
          }
          document.getElementById("cpBtnSaveFav").addEventListener("click", function () {
            var key = current.join(",");
            if (favs.some(function (f) { return f.colors.join(",") === key; })) { showToast("Bảng này đã có trong mục đã lưu"); return; }
            var base = activeIndex >= 0 ? PALETTES[activeIndex].name : "Bảng tự chỉnh";
            favs.unshift({ name: base + " · " + current.length + " màu", colors: current.slice() });
            favs = favs.slice(0, 20);
            store.set("cpFavPalettes", favs);
            renderFavs();
            showToast("Đã lưu bảng màu vào mục yêu thích");
          });

          /* ----- 1. Sinh bảng từ 1 màu chính ----- */
          var seedColorIn = document.getElementById("cpSeedColor");
          var seedHexIn = document.getElementById("cpSeedHex");
          seedColorIn.addEventListener("input", function () { seedHexIn.value = seedColorIn.value.toUpperCase(); });
          seedHexIn.addEventListener("change", function () {
            var v = seedHexIn.value.trim();
            if (/^#?[0-9A-Fa-f]{6}$/.test(v)) {
              if (v.charAt(0) !== "#") v = "#" + v;
              seedColorIn.value = v;
              seedHexIn.value = v.toUpperCase();
            } else {
              seedHexIn.value = seedColorIn.value.toUpperCase();
            }
          });
          function paletteFromSeed(seedHex, scheme) {
            var hsl = hexToHsl(seedHex);
            var h = hsl[0];
            var s = Math.max(40, Math.min(82, hsl[1] < 12 ? 55 : hsl[1]));
            var baseL = (hsl[2] < 18 || hsl[2] > 82) ? 48 : hsl[2];
            var prim = hslToHex(h, s, Math.max(36, Math.min(58, baseL)));
            var sec, acc;
            if (scheme === "comp") { sec = hslToHex((h + 180) % 360, Math.max(30, s - 18), 56); acc = hslToHex((h + 180) % 360, s, 46); }
            else if (scheme === "triad") { sec = hslToHex((h + 120) % 360, Math.max(30, s - 8), 52); acc = hslToHex((h + 240) % 360, s, 50); }
            else if (scheme === "split") { sec = hslToHex((h + 150) % 360, Math.max(30, s - 8), 52); acc = hslToHex((h + 210) % 360, s, 50); }
            else if (scheme === "mono") { sec = hslToHex(h, Math.max(25, s - 22), 66); acc = hslToHex(h, Math.min(90, s + 12), 34); }
            else { sec = hslToHex((h + 32) % 360, Math.max(30, s - 6), 54); acc = hslToHex((h + 330) % 360, s, 52); }
            return [hslToHex(h, Math.min(38, s), 96), prim, sec, acc, hslToHex(h, Math.min(48, s + 4), 15)];
          }
          document.getElementById("cpBtnSeed").addEventListener("click", function () {
            var pal = paletteFromSeed(seedColorIn.value, document.getElementById("cpSchemeSel").value);
            usePalette(pal, "Từ màu " + seedColorIn.value.toUpperCase());
            showToast("Đã sinh bảng màu từ " + seedColorIn.value.toUpperCase());
          });

          /* ----- 2. Sinh bảng từ ảnh ----- */
          function rgbToHex(r, g, b) {
            var t = function (x) { return x.toString(16).padStart(2, "0"); };
            return ("#" + t(r) + t(g) + t(b)).toUpperCase();
          }
          function rgbDist(a, b) {
            var ca = hexToRgb(a), cb = hexToRgb(b);
            return Math.sqrt(Math.pow(ca[0] - cb[0], 2) + Math.pow(ca[1] - cb[1], 2) + Math.pow(ca[2] - cb[2], 2));
          }
          function paletteFromPicked(picked) {
            var byLight = picked.slice().sort(function (a, b) { return relLum(b.hex) - relLum(a.hex); });
            var lightest = byLight[0].hex, darkest = byLight[byLight.length - 1].hex;
            var rest = picked.filter(function (c) { return c.hex !== lightest && c.hex !== darkest; });
            var prim = rest.length ? rest[0].hex : picked[0].hex;
            var primHsl = hexToHsl(prim);
            var acc = null, best = -1;
            rest.forEach(function (c) {
              if (c.hex === prim) return;
              var d = Math.abs(hexToHsl(c.hex)[0] - primHsl[0]);
              d = Math.min(d, 360 - d);
              if (d > best) { best = d; acc = c.hex; }
            });
            if (!acc) acc = hueShift(prim, 160);
            var sec = null;
            rest.forEach(function (c) { if (!sec && c.hex !== prim && c.hex !== acc) sec = c.hex; });
            if (!sec) sec = hueShift(prim, 40);
            var bg = relLum(lightest) > 0.55 ? lightest : hslToHex(primHsl[0], Math.min(40, primHsl[1]), 95);
            var dark = relLum(darkest) < 0.12 ? darkest : hslToHex(primHsl[0], Math.min(48, primHsl[1] + 4), 15);
            return [bg, prim, sec, acc, dark];
          }
          document.getElementById("cpBtnImg").addEventListener("click", function () { document.getElementById("cpImgFile").click(); });
          document.getElementById("cpImgFile").addEventListener("change", function () {
            var file = this.files && this.files[0];
            this.value = "";
            if (!file) return;
            var url = URL.createObjectURL(file);
            var img = new Image();
            img.onload = function () {
              try {
                var S = 100;
                var cv = document.createElement("canvas");
                cv.width = S; cv.height = S;
                var ctx = cv.getContext("2d");
                var scale = Math.max(S / img.width, S / img.height);
                var w = img.width * scale, hh = img.height * scale;
                ctx.drawImage(img, (S - w) / 2, (S - hh) / 2, w, hh);
                var data = ctx.getImageData(0, 0, S, S).data;
                var buckets = {};
                for (var p = 0; p < data.length; p += 16) {
                  if (data[p + 3] < 200) continue;
                  var key = (data[p] >> 5) + "," + (data[p + 1] >> 5) + "," + (data[p + 2] >> 5);
                  var b = buckets[key] || (buckets[key] = { n: 0, r: 0, g: 0, bl: 0 });
                  b.n++; b.r += data[p]; b.g += data[p + 1]; b.bl += data[p + 2];
                }
                var list = Object.keys(buckets).map(function (k) {
                  var b = buckets[k];
                  return { n: b.n, hex: rgbToHex(Math.round(b.r / b.n), Math.round(b.g / b.n), Math.round(b.bl / b.n)) };
                }).sort(function (a, b2) { return b2.n - a.n; });
                var picked = [];
                list.forEach(function (c) {
                  if (picked.length >= 6) return;
                  var ok = picked.every(function (q) { return rgbDist(q.hex, c.hex) > 56; });
                  if (ok) picked.push(c);
                });
                if (!picked.length) { showToast("Không trích được màu từ ảnh này"); return; }
                usePalette(paletteFromPicked(picked), "Từ ảnh");
                showToast("Đã trích các màu chủ đạo từ ảnh");
              } catch (e) {
                showToast("Không đọc được ảnh này");
              }
              URL.revokeObjectURL(url);
            };
            img.onerror = function () { URL.revokeObjectURL(url); showToast("Không đọc được ảnh này"); };
            img.src = url;
          });

          /* ----- 3 + 4. Gợi ý theo chủ đề & phong cách (lọc kết hợp) ----- */
          var TOPICS = [
            { id: "all", name: "Tất cả chủ đề" },
            { id: "ban-hang", name: "Bán hàng" },
            { id: "dich-vu", name: "Dịch vụ" },
            { id: "ca-phe", name: "Quán cà phê" },
            { id: "nha-hang", name: "Nhà hàng" },
            { id: "thoi-trang", name: "Thời trang" },
            { id: "giao-duc", name: "Giáo dục" },
            { id: "bat-dong-san", name: "Bất động sản" },
            { id: "du-lich", name: "Du lịch" },
            { id: "spa", name: "Spa & làm đẹp" },
            { id: "cong-nghe", name: "Công nghệ" }
          ];
          var STYLES = [
            { id: "all", name: "Tất cả phong cách" },
            { id: "sang-trong", name: "Sang trọng" },
            { id: "co-dien", name: "Cổ điển" },
            { id: "hien-dai", name: "Hiện đại" },
            { id: "tre-con", name: "Trẻ con / vui nhộn" },
            { id: "toi-gian", name: "Tối giản" },
            { id: "vintage", name: "Vintage" },
            { id: "thien-nhien", name: "Thiên nhiên" },
            { id: "nu-tinh", name: "Nữ tính dịu dàng" },
            { id: "the-thao", name: "Mạnh mẽ thể thao" }
          ];
          var SUGGESTIONS = [
            { name: "Sale Rực Rỡ", topic: "ban-hang", style: "hien-dai", colors: ["#FFF4E8", "#E4572E", "#F2A03D", "#2A9D8F", "#33231A"] },
            { name: "Shop Sang Trọng", topic: "ban-hang", style: "sang-trong", colors: ["#F7F3EC", "#8C6D3F", "#C6A15B", "#5C1F24", "#221A12"] },
            { name: "Chợ Phiên Xưa", topic: "ban-hang", style: "vintage", colors: ["#F6EDDC", "#A26748", "#C98F4E", "#70815C", "#3A2C1E"] },
            { name: "Dịch Vụ Tin Cậy", topic: "dich-vu", style: "hien-dai", colors: ["#EEF4FA", "#1D6FB8", "#39A0C9", "#F5B841", "#17324F"] },
            { name: "Dịch Vụ Cổ Điển", topic: "dich-vu", style: "co-dien", colors: ["#F5EFE2", "#5B4636", "#8C6D4F", "#9C3D2E", "#2A211A"] },
            { name: "Dịch Vụ Tối Giản", topic: "dich-vu", style: "toi-gian", colors: ["#F7F7F5", "#3A3A38", "#8A8A84", "#C96F4A", "#1E1E1C"] },
            { name: "Cà Phê Sữa Đá", topic: "ca-phe", style: "vintage", colors: ["#F7F1E5", "#7F5539", "#B08968", "#DDA448", "#2B1D16"] },
            { name: "Cà Phê Phố Mới", topic: "ca-phe", style: "hien-dai", colors: ["#F4EFE9", "#3E2F25", "#A9713F", "#E4572E", "#1D140E"] },
            { name: "Cà Phê Vườn Xanh", topic: "ca-phe", style: "thien-nhien", colors: ["#EFF3E4", "#5F7161", "#93A267", "#D9A441", "#26301F"] },
            { name: "Bếp Sang Trọng", topic: "nha-hang", style: "sang-trong", colors: ["#FAF5EA", "#7A1F1F", "#C19A3D", "#33523F", "#211712"] },
            { name: "Quán Ăn Xưa", topic: "nha-hang", style: "co-dien", colors: ["#FBF3E4", "#B3402A", "#E08A3C", "#5F7161", "#2E2018"] },
            { name: "Nhà Hàng Biển", topic: "nha-hang", style: "thien-nhien", colors: ["#EDF6F4", "#14666B", "#3FA7A0", "#F08A3C", "#123332"] },
            { name: "Đen Trắng Tối Giản", topic: "thoi-trang", style: "toi-gian", colors: ["#F6F3EF", "#26221F", "#8C7B6C", "#B33951", "#14100E"] },
            { name: "Thời Trang Dịu Dàng", topic: "thoi-trang", style: "nu-tinh", colors: ["#FDF2F4", "#C4587E", "#E8A2BC", "#C99A5B", "#33222A"] },
            { name: "Street Năng Động", topic: "thoi-trang", style: "the-thao", colors: ["#F0F4F2", "#14342B", "#2FBF71", "#FFD02E", "#101613"] },
            { name: "Lớp Học Vui Nhộn", topic: "giao-duc", style: "tre-con", colors: ["#FFF7E0", "#FF8A3D", "#3FA7D6", "#7BC950", "#3A332A"] },
            { name: "Học Viện Hiện Đại", topic: "giao-duc", style: "hien-dai", colors: ["#EFF6FF", "#1D6FB8", "#39A0C9", "#F5B841", "#17324F"] },
            { name: "Trường Học Xanh", topic: "giao-duc", style: "thien-nhien", colors: ["#F1F7EA", "#4E9B47", "#93C572", "#F2B134", "#22331C"] },
            { name: "Địa Ốc Sang Trọng", topic: "bat-dong-san", style: "sang-trong", colors: ["#F4F4F0", "#33523F", "#7A8B6F", "#C6A15B", "#1C2420"] },
            { name: "Địa Ốc Cổ Điển", topic: "bat-dong-san", style: "co-dien", colors: ["#F3EEE3", "#4A3B2A", "#8C6D4F", "#7A2E2E", "#241C14"] },
            { name: "Địa Ốc Hiện Đại", topic: "bat-dong-san", style: "hien-dai", colors: ["#EDF1F5", "#274156", "#5B84AE", "#E4572E", "#12222E"] },
            { name: "Du Lịch Biển Xanh", topic: "du-lich", style: "thien-nhien", colors: ["#EAF7F4", "#2BB3A3", "#7FD1C0", "#FF7B6B", "#123B3C"] },
            { name: "Du Lịch Sang", topic: "du-lich", style: "sang-trong", colors: ["#F5F0E6", "#173A5E", "#2E6DA8", "#C6A15B", "#0B1F33"] },
            { name: "Du Lịch Trẻ Trung", topic: "du-lich", style: "tre-con", colors: ["#FFF3E2", "#F08A3C", "#2BB3A3", "#E4572E", "#33241A"] },
            { name: "Spa Dịu Dàng", topic: "spa", style: "nu-tinh", colors: ["#FDF3F0", "#E5638C", "#F2A0B5", "#C99A5B", "#3D2430"] },
            { name: "Spa Thảo Mộc", topic: "spa", style: "thien-nhien", colors: ["#F2F6EC", "#6B8F5E", "#A9BC8E", "#D9A05B", "#2C3624"] },
            { name: "Spa Sang Trọng", topic: "spa", style: "sang-trong", colors: ["#F7F1EA", "#6E4A2F", "#B08968", "#A67C37", "#241A12"] },
            { name: "Tech Hiện Đại", topic: "cong-nghe", style: "hien-dai", colors: ["#EDF6FB", "#0E7CC4", "#22B8CF", "#FFB020", "#0C2436"] },
            { name: "Tech Thể Thao", topic: "cong-nghe", style: "the-thao", colors: ["#EFF5F2", "#0F3D2E", "#2FBF71", "#FF6B35", "#0E1A14"] },
            { name: "Tech Tối Giản", topic: "cong-nghe", style: "toi-gian", colors: ["#F4F5F7", "#23272F", "#6B7280", "#3B82C4", "#101216"] }
          ];
          var topicName = {}, styleName = {};
          TOPICS.forEach(function (t) { topicName[t.id] = t.name; });
          STYLES.forEach(function (t) { styleName[t.id] = t.name; });
          var selTopic = "all", selStyle = "all";
          function renderChips(wrapId, items, current, onPick) {
            var wrap = document.getElementById(wrapId);
            wrap.innerHTML = "";
            items.forEach(function (it) {
              var b = document.createElement("button");
              b.type = "button";
              b.className = "cp-chip" + (it.id === current ? " cp-on" : "");
              b.textContent = it.name;
              b.setAttribute("aria-pressed", it.id === current ? "true" : "false");
              b.addEventListener("click", function () { onPick(it.id); });
              wrap.appendChild(b);
            });
          }
          function renderSuggestions() {
            renderChips("cpTopicChips", TOPICS, selTopic, function (id) { selTopic = id; renderSuggestions(); });
            renderChips("cpStyleChips", STYLES, selStyle, function (id) { selStyle = id; renderSuggestions(); });
            var list = SUGGESTIONS.filter(function (g) {
              return (selTopic === "all" || g.topic === selTopic) && (selStyle === "all" || g.style === selStyle);
            });
            var cnt = document.getElementById("cpSugCount");
            cnt.textContent = list.length ? ("Có " + list.length + " bảng gợi ý — chạm để áp dụng ngay:") : "";
            var wrap = document.getElementById("cpSuggestList");
            wrap.innerHTML = "";
            if (!list.length) {
              wrap.innerHTML = '<p class="cp-empty">Chưa có bảng nào khớp cả 2 lựa chọn này. Thử bỏ bớt một bên (chọn “Tất cả”) để xem thêm gợi ý.</p>';
              return;
            }
            list.forEach(function (g) {
              var b = document.createElement("button");
              b.type = "button";
              b.className = "cp-sug-row";
              b.innerHTML = '<span class="tx"><span class="nm">' + g.name + '</span><span class="meta">' +
                topicName[g.topic] + " · " + styleName[g.style] + "</span></span>" + palDots(g.colors);
              b.addEventListener("click", function () {
                usePalette(g.colors, g.name);
                showToast("Đã áp dụng bảng gợi ý: " + g.name);
              });
              wrap.appendChild(b);
            });
          }
          renderSuggestions();

          /* ----- Hình mẫu website: chuyển đổi giữa các mẫu ----- */
          (function () {
            var tabs = Array.prototype.slice.call(document.querySelectorAll(".cp-sample-tab"));
            var panes = Array.prototype.slice.call(document.querySelectorAll(".cp-sample-pane"));
            tabs.forEach(function (tab) {
              tab.addEventListener("click", function () {
                var key = tab.getAttribute("data-sample");
                tabs.forEach(function (t) {
                  var on = t === tab;
                  t.classList.toggle("cp-on", on);
                  t.setAttribute("aria-selected", on ? "true" : "false");
                });
                panes.forEach(function (pn) { pn.hidden = pn.getAttribute("data-pane") !== key; });
              });
            });
          })();

          /* ----- 5. Xuất bảng màu + 6. Chia sẻ bằng mã link ----- */
          function copyText(text, msg) {
            var done = function () { showToast(msg); };
            var fb = function () {
              var ta = document.createElement("textarea");
              ta.value = text;
              ta.style.position = "fixed"; ta.style.opacity = "0";
              document.body.appendChild(ta); ta.select();
              try { document.execCommand("copy"); } catch (e) {}
              document.body.removeChild(ta);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(text).then(done, function () { fb(); done(); });
            } else { fb(); done(); }
          }
          function downloadFile(name, content, type) {
            var blob = content instanceof Blob ? content : new Blob([content], { type: type || "text/plain;charset=utf-8" });
            var a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = name;
            document.body.appendChild(a);
            a.click();
            setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
          }
          function roleKey(i, n) {
            if (i === 0) return "nen";
            if (i === 1) return "chinh";
            if (i === 2) return n === 3 ? "nhan" : "phu";
            if (i === 3) return "nhan";
            if (i === 4) return "toi";
            return "them-" + (i - 4);
          }
          document.getElementById("cpExpCss").addEventListener("click", function () {
            var css = ":root {\n" + current.map(function (c, i) {
              return "  --mau-" + roleKey(i, current.length) + ": " + c.toUpperCase() + ";";
            }).join("\n") + "\n}\n";
            downloadFile("bang-mau.css", css, "text/css;charset=utf-8");
            showToast("Đã tải file CSS variables");
          });
          document.getElementById("cpExpTw").addEventListener("click", function () {
            var obj = {};
            current.forEach(function (c, i) { obj[roleKey(i, current.length)] = c.toUpperCase(); });
            var tw = "module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        bangMau: " +
              JSON.stringify(obj, null, 2).replace(/\n/g, "\n        ") +
              "\n      }\n    }\n  }\n};\n";
            downloadFile("tailwind.bang-mau.js", tw, "text/javascript;charset=utf-8");
            showToast("Đã tải file Tailwind config");
          });
          document.getElementById("cpExpJson").addEventListener("click", function () {
            var json = JSON.stringify({
              colors: current.map(function (c, i) {
                return { role: roleLabel(i, current.length), key: roleKey(i, current.length), hex: c.toUpperCase() };
              })
            }, null, 2);
            downloadFile("bang-mau.json", json, "application/json;charset=utf-8");
            showToast("Đã tải file JSON");
          });
          document.getElementById("cpExpPng").addEventListener("click", function () {
            var cv = document.createElement("canvas");
            cv.width = 1240; cv.height = 620;
            var ctx = cv.getContext("2d");
            var w = cv.width / current.length;
            current.forEach(function (c, i) {
              ctx.fillStyle = c;
              ctx.fillRect(Math.floor(i * w), 0, Math.ceil(w) + 1, cv.height);
              ctx.fillStyle = readableOn(c);
              ctx.textAlign = "center";
              ctx.font = "700 34px system-ui, sans-serif";
              ctx.fillText(c.toUpperCase(), i * w + w / 2, cv.height - 52);
              ctx.font = "600 23px system-ui, sans-serif";
              ctx.fillText(roleLabel(i, current.length), i * w + w / 2, cv.height - 100);
            });
            if (cv.toBlob) {
              cv.toBlob(function (blob) {
                if (blob) { downloadFile("bang-mau.png", blob); showToast("Đã tải ảnh PNG bảng màu"); }
              });
            } else {
              showToast("Trình duyệt này không xuất được PNG");
            }
          });
          function applyHashPalette() {
            var m = /mau=([0-9A-Fa-f-]+)/.exec(window.location.hash || "");
            if (!m) return;
            var cols = m[1].split("-").filter(function (x) { return /^[0-9A-Fa-f]{6}$/.test(x); })
              .map(function (x) { return ("#" + x).toUpperCase(); });
            if (cols.length < 3) return;
            usePalette(cols, "Từ link chia sẻ");
            showToast("Đã áp dụng bảng màu từ link chia sẻ");
          }

          /* ----- 10. So sánh 2 bảng màu ----- */
          var cmpSelA = document.getElementById("cpCmpSelA");
          var cmpSelB = document.getElementById("cpCmpSelB");
          function fillCmpSelect(sel, def) {
            sel.innerHTML = "";
            var o0 = document.createElement("option");
            o0.value = "cur";
            o0.textContent = "Bảng đang dùng";
            sel.appendChild(o0);
            PALETTES.forEach(function (p, i) {
              var o = document.createElement("option");
              o.value = String(i);
              o.textContent = p.name;
              sel.appendChild(o);
            });
            sel.value = def;
          }
          function setPaneVars(el, colors) {
            var r = effectiveRoles(colors);
            var st = el.style;
            st.setProperty("--p-bg", r.bg);
            st.setProperty("--p-primary", r.primary);
            st.setProperty("--p-secondary", r.secondary);
            st.setProperty("--p-accent", r.accent);
            st.setProperty("--p-dark", r.dark);
            st.setProperty("--on-primary", readableOn(r.primary));
            st.setProperty("--on-accent", readableOn(r.accent));
          }
          function paneColors(sel) {
            if (sel.value === "cur") return current.slice();
            var p = PALETTES[parseInt(sel.value, 10)];
            return p ? fitCount(p.colors, colorCount) : current.slice();
          }
          function refreshCompare() {
            if (!cmpSelA || !cmpSelB) return;
            setPaneVars(document.getElementById("cpCmpA"), paneColors(cmpSelA));
            setPaneVars(document.getElementById("cpCmpB"), paneColors(cmpSelB));
          }
          fillCmpSelect(cmpSelA, "cur");
          fillCmpSelect(cmpSelB, "10");
          cmpSelA.addEventListener("change", refreshCompare);
          cmpSelB.addEventListener("change", refreshCompare);
          renderFavs();
          renderHistory();

          fillFontSelect(fontHeadSel, "Be Vietnam Pro");
          fillFontSelect(fontBodySel, "Be Vietnam Pro");
          applyFonts();
          refreshStepper();
          applyColors(current);
          renderPalettes();
          /* ---------- Đợt Astryx: 21 sắc độ / thang màu biểu đồ / 7 theme mẫu ---------- */
          (function () {
            var seedColor = document.getElementById("axSeedColor");
            var seedHex = document.getElementById("axSeedHex");
            var shadesBox = document.getElementById("axShades");
            function shadeHex(seed, i) {
              var hsl = hexToHsl(seed);
              var t = i / 20;
              var l = 97 - t * 89;
              var s = Math.max(12, Math.min(96, hsl[1] * (0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, t * 1.15)))));
              return hslToHex(hsl[0], s, l);
            }
            function renderShades() {
              if (!shadesBox || !seedColor) return;
              shadesBox.innerHTML = "";
              for (var i = 0; i < 21; i++) {
                (function (i) {
                  var hex = shadeHex(seedColor.value, i);
                  var b = document.createElement("button");
                  b.type = "button";
                  b.className = "ax-shade";
                  b.style.background = hex;
                  b.setAttribute("aria-label", "Chép mã màu nấc " + (i * 5) + ": " + hex);
                  var hsl = hexToHsl(hex);
                  b.innerHTML = '<span style="color:' + (hsl[2] > 55 ? "#22303F" : "#FFFFFF") + '">' + (i * 5) + "</span>";
                  b.addEventListener("click", function () { copyHex(hex); });
                  shadesBox.appendChild(b);
                })(i);
              }
            }
            if (seedColor && seedHex) {
              seedColor.addEventListener("input", function () { seedHex.value = seedColor.value.toUpperCase(); renderShades(); });
              seedHex.addEventListener("change", function () {
                var v = seedHex.value.trim();
                if (/^#[0-9a-fA-F]{6}$/.test(v)) { seedColor.value = v; renderShades(); }
              });
            }
            renderShades();

            var CAT = [
              ["Xanh dương", "#0171E3"], ["Cam", "#F08A3C"], ["Tím", "#7C5CD6"], ["Xanh lá", "#2FA84F"],
              ["Hồng", "#E5638C"], ["Ngọc", "#12A5A5"], ["Đỏ", "#E03131"], ["Xanh mòng két", "#2E7D74"],
              ["Nâu", "#9A6B3F"], ["Chàm", "#4B5CC4"]
            ];
            var catRow = document.getElementById("axCatRow");
            if (catRow) {
              CAT.forEach(function (c) {
                var b = document.createElement("button");
                b.type = "button";
                b.className = "ax-cat";
                b.style.background = c[1];
                b.title = c[0] + " · " + c[1];
                b.setAttribute("aria-label", "Chép mã màu phân loại " + c[0] + " " + c[1]);
                b.addEventListener("click", function () { copyHex(c[1]); });
                catRow.appendChild(b);
              });
            }
            var rampsBox = document.getElementById("axRamps");
            function ramp5(hex) {
              var hsl = hexToHsl(hex);
              var out = [];
              [78, 62, 47, 33, 20].forEach(function (l) { out.push(hslToHex(hsl[0], Math.max(25, Math.min(90, hsl[1])), l)); });
              return out;
            }
            function renderRamps() {
              if (!rampsBox) return;
              var roles = effectiveRoles(current);
              var rows = [["Màu chính", roles.primary], ["Màu phụ", roles.secondary], ["Màu nhấn", roles.accent]];
              rampsBox.innerHTML = "";
              rows.forEach(function (r) {
                var div = document.createElement("div");
                div.className = "ax-ramp";
                var steps = ramp5(r[1]).map(function (h) { return '<i style="background:' + h + '" title="' + h + '"></i>'; }).join("");
                div.innerHTML = "<span>" + r[0] + '</span><span class="steps">' + steps + "</span>";
                rampsBox.appendChild(div);
              });
            }
            renderRamps();
            cpRoot.addEventListener("click", function () { setTimeout(renderRamps, 60); });
            cpRoot.addEventListener("input", function () { setTimeout(renderRamps, 60); });

            var THEMES = [
              { name: "Neutral", colors: ["#F4F4F2", "#5B6470", "#8A8D93", "#3E6AE1", "#1B1B1B"] },
              { name: "Butter", colors: ["#FFF7E0", "#D98E04", "#F2C94C", "#2E6DA8", "#3A2A12"] },
              { name: "Chocolate", colors: ["#F7EDE3", "#7A4A21", "#B07A45", "#D99A4E", "#2A1A10"] },
              { name: "Gothic (tối)", colors: ["#14181F", "#3E5C82", "#5B7CA6", "#9DB8D9", "#E8EEF6"] },
              { name: "Matcha", colors: ["#EFF4E4", "#4E6B3A", "#8FAE6B", "#C99A3C", "#22301A"] },
              { name: "Stone", colors: ["#F5F0E8", "#A08B6D", "#C4B096", "#C96F2E", "#33302A"] },
              { name: "Y2K", colors: ["#EEF0FF", "#7B7FE4", "#B18CFF", "#FF7AC1", "#232038"] }
            ];
            var themeBox = document.getElementById("axThemeChips");
            if (themeBox) {
              THEMES.forEach(function (t) {
                var b = document.createElement("button");
                b.type = "button";
                b.textContent = t.name;
                b.setAttribute("aria-label", "Áp giao diện mẫu " + t.name + " lên khung xem trước");
                b.addEventListener("click", function () {
                  themeBox.querySelectorAll("button").forEach(function (x) { x.classList.remove("cp-on"); });
                  b.classList.add("cp-on");
                  activeIndex = -1;
                  applyColors(fitCount(t.colors, colorCount));
                  renderPalettes();
                  pushHistory(current, "Theme " + t.name);
                  showToast("Đã áp giao diện mẫu " + t.name);
                });
                themeBox.appendChild(b);
              });
            }
          })();

          applyHashPalette();
        })();


  /* ----- JS[6] cpGrad/cpPat tail ----- */
  (function () {
  function $(id) { return document.getElementById(id); }
  /* Color tab: gradient from current palette */
          var cpApp = $("cpApp"), gradPrev = $("cpGradPreview"), gradAngle = $("cpGradAngle");
          function cpPalColors() {
            if (!cpApp) return ["#5B9BD5", "#63B3A6", "#F08A3C"];
            var cs = getComputedStyle(cpApp);
            function g(n, fb) { var v = cs.getPropertyValue(n).trim(); return v || fb; }
            return [g("--p-primary", "#5B9BD5"), g("--p-secondary", "#63B3A6"), g("--p-accent", "#F08A3C"), g("--p-dark", "#173A5E")];
          }
          function gradCss() {
            var c = cpPalColors(), a = gradAngle ? gradAngle.value : 135;
            return "linear-gradient(" + a + "deg, " + c[0] + ", " + c[1] + ", " + c[2] + ")";
          }
          function gradRender() { if (gradPrev) { gradPrev.style.background = gradCss(); var lbl = $("cpGradAngleVal"); if (lbl) lbl.textContent = gradAngle.value + "°"; } }
          if (gradPrev) {
            gradRender();
            gradAngle.addEventListener("input", gradRender);
            if (cpApp && window.MutationObserver) new MutationObserver(gradRender).observe(cpApp, { attributes: true, attributeFilter: ["style"] });
            $("cpGradCopy").addEventListener("click", function () {
              var btn = this, css = "background: " + gradCss() + ";";
              function done() { btn.textContent = "Đã chép mã CSS ✓"; setTimeout(function () { btn.textContent = "Chép mã CSS gradient"; }, 1800); }
              if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(css).then(done, done);
              else done();
            });
          }

          /* Color tab: pattern fills */
          var patPrev = $("cpPatPreview"), patChips = $("cpPatChips");
          if (patPrev && patChips) patChips.querySelectorAll("button").forEach(function (b) {
            b.addEventListener("click", function () {
              patChips.querySelectorAll("button").forEach(function (x) { x.classList.remove("cp-on"); });
              b.classList.add("cp-on");
              patPrev.className = "cp-pat-preview " + b.getAttribute("data-pat");
            });
          });
  })();
}
