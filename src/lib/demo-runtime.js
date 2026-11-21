/* Demo runtime — ported verbatim from the source single-file site (scripts-inventory.md).
   Each block keeps its original IIFE + ids; order matches the source (JS[0] first so its
   setInterval wrapper is installed before any demo creates a timer). JS[12] gates its
   single merged rAF loop + auto-scroll loops on inView() (card .demo-live / popup open).
   Runs once, eagerly, from the index.astro script (ensureDemoRuntime); the
   stages are plain SSR HTML, so no per-card island hydration is needed. */
let __tpwDemoRuntimeDone = false;

export function ensureDemoRuntime() {
  if (__tpwDemoRuntimeDone) return;
  __tpwDemoRuntimeDone = true;

  /* ----- JS[0] tab-hidden interval wrapper ----- */

        /* Tiết kiệm pin/CPU: tạm dừng các interval của demo khi tab bị ẩn */
        (function () {
          var rawSI = window.setInterval;
          window.setInterval = function (fn, delay) {
            if (typeof fn !== "function") return rawSI.apply(window, arguments);
            var args = Array.prototype.slice.call(arguments, 2);
            return rawSI(function () { if (!document.hidden) fn.apply(null, args); }, delay);
          };
        })();


        /* Kiểm tra "đang nhìn thấy" — cùng logic với inView() của JS[12]:
           thẻ chứa el phải có .demo-live; demo đã dời vào popup thì chạy
           khi popup mở, demo phía sau popup thì dừng. el không có thẻ tổ
           tiên (hoặc không tìm được) thì cứ chạy như cũ. */
        window.__tpwInView = function (el) {
          if (!el || !el.closest) return true;
          if (document.hidden) return false;
          var ov = document.getElementById("fxOverlay");
          var popOpen = !!(ov && !ov.hidden);
          if (el.closest("#fxOverlay")) return popOpen;
          if (popOpen) return false;
          var card = el.closest(".card");
          if (card) return card.classList.contains("demo-live");
          return true;
        };
        /* Bọc callback của interval: chỉ chạy khi demo chứa el đang hiển thị. */
        window.__tpwLiveGuard = function (el, fn) {
          return function () {
            if (window.__tpwInView(el)) fn.apply(null, arguments);
          };
        };


  /* ----- JS[1] demos ----- */
  (function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* ---------- Toggle tự lật + bấm được ---------- */
          var tgl = document.getElementById("tglDemo");
          var tglState = document.getElementById("tglState");
          function syncTgl() { tglState.textContent = tgl.checked ? "Bật" : "Tắt"; }
          tgl.addEventListener("change", syncTgl); syncTgl();
          if (!reduceMotion) {
            var tglTimer = setInterval(__tpwLiveGuard(tgl, function () { tgl.checked = !tgl.checked; syncTgl(); }), 1800);
            tgl.addEventListener("pointerdown", function () { clearInterval(tglTimer); });
          }

          /* ---------- Checkbox tự tick 1 lần lặp ---------- */
          var chk = document.getElementById("chkAuto");
          if (!reduceMotion) {
            var chkTimer = setInterval(__tpwLiveGuard(chk, function () { chk.checked = !chk.checked; }), 2200);
            chk.addEventListener("pointerdown", function () { clearInterval(chkTimer); });
          }

          /* ---------- Máy gõ chữ (Text Input + Search) ---------- */
          var typers = document.querySelectorAll(".type-target");
          if (!reduceMotion) {
            typers.forEach(function (el) {
              var text = el.getAttribute("data-text");
              var i = 0, del = false;
              setInterval(__tpwLiveGuard(el, function () {
                if (!del) { i++; if (i >= text.length) { del = true; setTimeout(function(){}, 0); i = text.length; } }
                else { i--; if (i <= 0) { del = false; i = 0; } }
                el.textContent = text.slice(0, i);
              }), 170);
            });
          } else {
            typers.forEach(function (el) { el.textContent = el.getAttribute("data-text"); });
          }

          /* ---------- Dropdown ---------- */
          var dd = document.getElementById("ddDemo");
          var ddLabel = document.getElementById("ddLabel");
          dd.querySelector(".dd-head").addEventListener("click", function () { dd.classList.toggle("open"); });
          dd.querySelectorAll(".dd-menu div").forEach(function (item) {
            item.addEventListener("click", function () { ddLabel.textContent = item.textContent; dd.classList.remove("open"); });
          });
          document.addEventListener("click", function (e) { if (!dd.contains(e.target)) dd.classList.remove("open"); });
          if (!reduceMotion) {
            var ddTimer = setInterval(__tpwLiveGuard(dd, function () { dd.classList.toggle("open"); }), 2600);
            dd.addEventListener("pointerdown", function () { clearInterval(ddTimer); }, { once: true });
          }

          /* ---------- Stepper ---------- */
          var num = 1, numEl = document.getElementById("stepNum");
          document.getElementById("stepPlus").addEventListener("click", function () { num = Math.min(99, num + 1); numEl.textContent = num; });
          document.getElementById("stepMinus").addEventListener("click", function () { num = Math.max(0, num - 1); numEl.textContent = num; });

          /* ---------- Đánh giá sao ---------- */
          var starBtns = Array.prototype.slice.call(document.querySelectorAll("#stars button"));
          var rating = 4;
          function paintStars() { starBtns.forEach(function (b, i) { b.classList.toggle("on", i < rating); }); }
          starBtns.forEach(function (b, i) { b.addEventListener("click", function () { rating = i + 1; paintStars(); }); });
          paintStars();

          /* ---------- Hamburger ---------- */
          var burger = document.getElementById("burgerBtn");
          burger.addEventListener("click", function () { burger.classList.toggle("x"); });
          if (!reduceMotion) {
            var bgTimer = setInterval(__tpwLiveGuard(burger, function () { burger.classList.toggle("x"); }), 2000);
            burger.addEventListener("pointerdown", function () { clearInterval(bgTimer); }, { once: true });
          }

          /* ---------- Tabs ---------- */
          var tabBtns = Array.prototype.slice.call(document.querySelectorAll("#tabsHead button"));
          var tabBody = document.getElementById("tabsBody");
          var tabTexts = ["Thông tin mô tả sản phẩm…", "Giá bán: 199.000đ — còn hàng", "★ 4.8 · 126 lượt đánh giá"];
          var tabIdx = 0;
          function setDemoTab(i) {
            tabIdx = i;
            tabBtns.forEach(function (b, j) { b.classList.toggle("act", j === i); });
            tabBody.textContent = tabTexts[i];
          }
          tabBtns.forEach(function (b, i) { b.addEventListener("click", function () { setDemoTab(i); stopTabAuto(); }); });
          var tabTimer = null;
          function stopTabAuto() { if (tabTimer) clearInterval(tabTimer); }
          if (!reduceMotion) tabTimer = setInterval(__tpwLiveGuard(tabBody, function () { setDemoTab((tabIdx + 1) % 3); }), 2400);

          /* ---------- Pagination tự nhảy trang ---------- */
          var pageBtns = Array.prototype.slice.call(document.querySelectorAll("#pager button"));
          var numBtns = pageBtns.slice(1, 4);
          var pageIdx = 0;
          function setPage(i) { pageIdx = i; numBtns.forEach(function (b, j) { b.classList.toggle("act", j === i); }); }
          numBtns.forEach(function (b, i) { b.addEventListener("click", function () { setPage(i); stopPageAuto(); }); });
          pageBtns[0].addEventListener("click", function () { setPage((pageIdx + 2) % 3); stopPageAuto(); });
          pageBtns[4].addEventListener("click", function () { setPage((pageIdx + 1) % 3); stopPageAuto(); });
          var pageTimer = null;
          function stopPageAuto() { if (pageTimer) clearInterval(pageTimer); }
          if (!reduceMotion) pageTimer = setInterval(__tpwLiveGuard(pageBtns[0], function () { setPage((pageIdx + 1) % 3); }), 2300);

          /* ---------- Accordion ---------- */
          var accItems = Array.prototype.slice.call(document.querySelectorAll("#accDemo .acc-item"));
          accItems.forEach(function (item) {
            item.querySelector(".acc-head").addEventListener("click", function () {
              var wasOpen = item.classList.contains("open");
              accItems.forEach(function (it) { it.classList.remove("open"); });
              if (!wasOpen) item.classList.add("open");
            });
          });

          /* ---------- Badge tự tăng số ---------- */
          var badge = document.getElementById("badgeNum");
          var badgeN = 3;
          if (!reduceMotion) setInterval(__tpwLiveGuard(badge, function () { badgeN = badgeN >= 9 ? 1 : badgeN + 1; badge.textContent = badgeN; }), 2600);

          /* ---------- Back to top thật ---------- */
          document.getElementById("bttBtn").addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
          });

          /* ---------- Button Group ---------- */
          var bgBtns = Array.prototype.slice.call(document.querySelectorAll("#btnGroup button"));
          bgBtns.forEach(function (b) {
            b.addEventListener("click", function () {
              bgBtns.forEach(function (x) { x.classList.remove("act"); });
              b.classList.add("act");
            });
          });

          /* ---------- Toggle Group ---------- */
          document.querySelectorAll("#tglGroup button").forEach(function (b) {
            b.addEventListener("click", function () { b.classList.toggle("on"); });
          });

          /* ---------- Segmented tự trượt + bấm được ---------- */
          var seg = document.getElementById("segDemo");
          var segBtns = Array.prototype.slice.call(seg.querySelectorAll("button"));
          var segIdx = 0, segTimer = null;
          function setSeg(i) {
            segIdx = i;
            segBtns.forEach(function (b, j) { b.classList.toggle("act", j === i); });
            seg.classList.toggle("right", i === 1);
          }
          function stopSeg() { if (segTimer) clearInterval(segTimer); }
          segBtns.forEach(function (b, i) { b.addEventListener("click", function () { setSeg(i); stopSeg(); }); });
          if (!reduceMotion) segTimer = setInterval(__tpwLiveGuard(seg, function () { setSeg((segIdx + 1) % 2); }), 2500);

          /* ---------- Multi-select + Tags Input: bấm ✕ để gỡ thẻ ---------- */
          document.querySelectorAll(".mchip button").forEach(function (b) {
            b.addEventListener("click", function () { b.parentElement.style.display = "none"; });
          });

          /* ---------- OTP tự điền số ---------- */
          var otpSpans = Array.prototype.slice.call(document.querySelectorAll("#otpDemo span"));
          var otpDigits = ["4", "8", "2", "6"];
          function otpPaint(step) {
            otpSpans.forEach(function (s, i) {
              s.textContent = i < step ? otpDigits[i] : "";
              s.classList.toggle("cur", i === step && step < 4);
            });
          }
          if (reduceMotion) { otpPaint(4); }
          else {
            var otpStep = 0;
            otpPaint(0);
            setInterval(__tpwLiveGuard(otpSpans[0], function () { otpStep = (otpStep + 1) % 6; otpPaint(Math.min(otpStep, 4)); }), 650);
          }

          /* ---------- Password hiện/ẩn ---------- */
          var pwdTxt = document.getElementById("pwdTxt");
          var pwdShown = false;
          document.getElementById("pwdBtn").addEventListener("click", function () {
            pwdShown = !pwdShown;
            pwdTxt.textContent = pwdShown ? "matkha123" : "•••••••••";
            document.getElementById("eyeOpen").style.display = pwdShown ? "none" : "";
            document.getElementById("eyeOff").style.display = pwdShown ? "" : "none";
          });

          /* ---------- Steps tự chạy ---------- */
          var stepEls = Array.prototype.slice.call(document.querySelectorAll("#stepsDemo .step"));
          var stepIdx = 0;
          function paintSteps() {
            stepEls.forEach(function (el, j) {
              el.classList.toggle("done", j < stepIdx);
              el.classList.toggle("act", j === stepIdx);
              el.querySelector(".dot").textContent = j < stepIdx ? "✓" : (j + 1);
            });
          }
          paintSteps();
          if (!reduceMotion) setInterval(__tpwLiveGuard(stepEls[0], function () { stepIdx = (stepIdx + 1) % 4; paintSteps(); }), 1700);

          /* ---------- Menubar ---------- */
          var mbBtn = document.getElementById("mbBtn");
          var mbMenu = document.getElementById("mbMenu");
          mbBtn.addEventListener("click", function () {
            mbMenu.classList.toggle("show");
            mbBtn.classList.toggle("open");
          });

          /* ---------- Bottom Navigation tự chuyển + bấm được ---------- */
          var bnBtns = Array.prototype.slice.call(document.querySelectorAll("#bnavDemo button"));
          var bnIdx = 0, bnTimer = null;
          function setBn(i) { bnIdx = i; bnBtns.forEach(function (b, j) { b.classList.toggle("act", j === i); }); }
          bnBtns.forEach(function (b, i) { b.addEventListener("click", function () { setBn(i); if (bnTimer) clearInterval(bnTimer); }); });
          if (!reduceMotion) bnTimer = setInterval(__tpwLiveGuard(bnBtns[0], function () { setBn((bnIdx + 1) % bnBtns.length); }), 2200);

          /* ---------- Tree View mở/đóng nhánh ---------- */
          var tree = document.getElementById("treeDemo");
          tree.querySelector(".tchev").addEventListener("click", function () { tree.classList.toggle("closed"); });

          /* ---------- QR: vẽ lưới ô vuông minh họa ---------- */
          var qrGrid = document.getElementById("qrGrid");
          var qrRows = ["111010111", "101101101", "111001111", "001011010", "110100101", "010011010", "111101001", "101010110", "111001011"];
          qrRows.forEach(function (row) {
            row.split("").forEach(function (c) {
              var cell = document.createElement("i");
              if (c === "1") cell.className = "b";
              qrGrid.appendChild(cell);
            });
          });

          /* ---------- Context Menu: chuột phải chạy lại hiệu ứng ---------- */
          var ctxWrap = document.getElementById("ctxDemo");
          var ctxMenu = document.getElementById("ctxMenu");
          ctxWrap.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            ctxMenu.style.animation = "none";
            void ctxMenu.offsetWidth;
            ctxMenu.style.animation = "";
          });

          /* ---------- Gallery: bấm ảnh nhỏ đổi ảnh lớn + tự chuyển ---------- */
          var galMain = document.getElementById("galMain");
          var galThumbs = Array.prototype.slice.call(document.querySelectorAll("#galThumbs button"));
          var galData = [["Ảnh 1", "#0a4177"], ["Ảnh 2", "#fc7a01"], ["Ảnh 3", "#1d9e6c"]];
          var galIdx = 0, galTimer = null;
          function setGal(i) {
            galIdx = i;
            galMain.textContent = galData[i][0];
            galMain.style.background = galData[i][1];
            galThumbs.forEach(function (b, j) { b.classList.toggle("act", j === i); });
          }
          galThumbs.forEach(function (b, i) { b.addEventListener("click", function () { setGal(i); if (galTimer) clearInterval(galTimer); }); });
          if (!reduceMotion) galTimer = setInterval(__tpwLiveGuard(galMain, function () { setGal((galIdx + 1) % 3); }), 2400);
          setGal(0);

          /* ---------- Speed Dial: tự xòe + bấm được ---------- */
          var sdial = document.getElementById("sdialDemo");
          var sdTimer = null;
          sdial.querySelector(".sd-main").addEventListener("click", function () {
            sdial.classList.toggle("open");
            if (sdTimer) clearInterval(sdTimer);
          });
          if (!reduceMotion) {
            sdial.classList.add("open");
            sdTimer = setInterval(__tpwLiveGuard(sdial, function () { sdial.classList.toggle("open"); }), 2100);
          } else {
            sdial.classList.add("open");
          }

          /* ---------- Rich Text Editor: nút định dạng ---------- */
          var rteBody = document.getElementById("rteBody");
          document.querySelectorAll("#rteDemo .rte-bar button").forEach(function (b) {
            b.addEventListener("click", function () {
              var fmt = b.getAttribute("data-fmt");
              b.classList.toggle("on");
              var on = b.classList.contains("on");
              if (fmt === "b") rteBody.style.fontWeight = on ? "800" : "";
              if (fmt === "i") rteBody.style.fontStyle = on ? "italic" : "";
              if (fmt === "u") rteBody.style.textDecoration = on ? "underline" : "";
            });
          });

          /* ---------- Statistic: số đếm tăng dần, lặp lại ---------- */
          var statNum = document.getElementById("statNum");
          var statTarget = 1248;
          function statRun() {
            if (reduceMotion) { statNum.textContent = statTarget.toLocaleString("vi-VN"); return; }
            var v = 0, step = Math.ceil(statTarget / 42);
            var t = setInterval(__tpwLiveGuard(statNum, function () {
              v += step;
              if (v >= statTarget) { v = statTarget; clearInterval(t); setTimeout(statRun, 2600); }
              statNum.textContent = v.toLocaleString("vi-VN");
            }), 40);
          }
          statRun();

          /* ---------- Video Player: phát / dừng ---------- */
          var vid = document.getElementById("vidDemo");
          var vidBtn = document.getElementById("vidBtn");
          vidBtn.addEventListener("click", function () {
            var playing = vid.classList.toggle("playing");
            vidBtn.textContent = playing ? "❚❚" : "▶";
          });

          /* ---------- Theme Toggle: tự đổi + bấm được ---------- */
          var themeDemo = document.getElementById("themeDemo");
          var themeBtn = document.getElementById("themeBtn");
          function themePaint() {
            var dark = themeDemo.classList.contains("dark");
            themeDemo.querySelector(".ic-sun").style.display = dark ? "none" : "";
            themeDemo.querySelector(".ic-moon").style.display = dark ? "" : "none";
          }
          var themeTimer = null;
          themeBtn.addEventListener("click", function () {
            themeDemo.classList.toggle("dark"); themePaint();
            if (themeTimer) clearInterval(themeTimer);
          });
          if (!reduceMotion) themeTimer = setInterval(__tpwLiveGuard(themeDemo, function () { themeDemo.classList.toggle("dark"); themePaint(); }), 2600);

          /* ---------- Transfer List: chọn mục rồi chuyển cột ---------- */
          var xfL = document.getElementById("xfLeft");
          var xfR = document.getElementById("xfRightCol");
          document.querySelectorAll("#xferDemo .xf-item").forEach(function (it) {
            it.addEventListener("click", function () { it.classList.toggle("sel"); });
          });
          function xfMove(from, to) {
            var sel = Array.prototype.slice.call(from.querySelectorAll(".xf-item.sel"));
            if (!sel.length) { var first = from.querySelector(".xf-item"); if (first) sel = [first]; }
            sel.forEach(function (it) { it.classList.remove("sel"); to.appendChild(it); });
          }
          document.getElementById("xfRight").addEventListener("click", function () { xfMove(xfL, xfR); });
          document.getElementById("xfLeftBtn").addEventListener("click", function () { xfMove(xfR, xfL); });

          /* ---------- Editable: bấm bút chì để sửa chữ ---------- */
          var editTxt = document.getElementById("editTxt");
          var editBtn = document.getElementById("editBtn");
          editBtn.addEventListener("click", function () {
            var editing = editTxt.classList.toggle("editing");
            editTxt.contentEditable = editing ? "true" : "false";
            editBtn.textContent = editing ? "✓" : "✎";
            if (editing) editTxt.focus();
          });

          /* ---------- Captcha: làm mới mã ---------- */
          var capCode = document.getElementById("capCode");
          var capChars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
          document.getElementById("capRef").addEventListener("click", function () {
            var s = "";
            for (var i = 0; i < 4; i++) s += capChars[Math.floor(Math.random() * capChars.length)];
            capCode.textContent = s;
          });

          /* ---------- Scrollspy: tự chạy theo cuộn ---------- */
          var spyNav = Array.prototype.slice.call(document.querySelectorAll("#spyDemo .spy-nav span"));
          var spyTrack = document.getElementById("spyTrack");
          var spyIdx = 0;
          function setSpy(i) {
            spyIdx = i;
            spyNav.forEach(function (s, j) { s.classList.toggle("act", j === i); });
            spyTrack.style.transform = "translateY(" + (-i * 23) + "px)";
          }
          if (!reduceMotion) setInterval(__tpwLiveGuard(spyTrack, function () { setSpy((spyIdx + 1) % 3); }), 2100);

          /* ---------- User Menu: tự xổ + bấm được ---------- */
          var umenuBtn = document.getElementById("umenuBtn");
          var umenuList = document.getElementById("umenuList");
          var umenuTimer = null;
          umenuBtn.addEventListener("click", function () {
            umenuList.classList.toggle("show");
            if (umenuTimer) clearInterval(umenuTimer);
          });
          if (!reduceMotion) umenuTimer = setInterval(__tpwLiveGuard(umenuList, function () { umenuList.classList.toggle("show"); }), 2800);

          /* ---------- Circular Progress: vòng chạy % lặp lại ---------- */
          var circFg = document.getElementById("circFg");
          var circNum = document.getElementById("circNum");
          var circC = 163.4, circTarget = 75;
          function circRun() {
            if (reduceMotion) {
              circNum.textContent = circTarget + "%";
              circFg.style.strokeDashoffset = circC * (1 - circTarget / 100);
              return;
            }
            var v = 0;
            var t = setInterval(__tpwLiveGuard(circNum, function () {
              v += 3;
              if (v >= circTarget) { v = circTarget; clearInterval(t); setTimeout(circRun, 2400); }
              circNum.textContent = v + "%";
              circFg.style.strokeDashoffset = circC * (1 - v / 100);
            }), 45);
          }
          circRun();

          /* ---------- Gauge (MUI X): kéo thanh trượt đổi giá trị, cung + số ở giữa đổi theo ---------- */
          var ggRange = document.getElementById("ggRange");
          var ggArc = document.getElementById("ggArc");
          var ggNum = document.getElementById("ggNum");
          var ggStatus = document.getElementById("ggStatus");
          if (ggRange && ggArc && ggNum && ggStatus) {
            var ggC = 207.35;
            var ggUpdate = function () {
              var v = parseInt(ggRange.value, 10) || 0;
              var txt = v <= 0 ? "Hết hàng — cần nhập ngay" : v < 25 ? "Sắp hết — nên nhập thêm" : v < 70 ? "Mức tồn kho ổn định" : "Tồn kho dồi dào";
              ggNum.textContent = v;
              ggArc.style.strokeDashoffset = ggC * (1 - v / 100);
              ggStatus.innerHTML = "Trạng thái: <b>" + txt + "</b>";
            };
            ggRange.addEventListener("input", ggUpdate);
            ggUpdate();
          }

          /* ---------- Sparkline (MUI X): biểu đồ mini trong bảng, di chuột xem số từng ngày, đổi Đường/Cột ---------- */
          var spRows = document.getElementById("spRows");
          var spRead = document.getElementById("spRead");
          if (spRows && spRead) {
            var spDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
            var spData = [
              { name: "Áo thun trắng", vals: [12, 18, 15, 22, 19, 26, 24] },
              { name: "Quần jeans", vals: [8, 11, 10, 14, 13, 17, 16] },
              { name: "Váy hoa nhí", vals: [20, 16, 18, 12, 15, 10, 13] },
              { name: "Áo khoác denim", vals: [5, 7, 9, 8, 12, 14, 18] }
            ];
            var spMode = "line";
            var spSvg = function (item) {
              var max = Math.max.apply(null, item.vals), s = "", i, v;
              if (spMode === "line") {
                var pts = item.vals.map(function (val, j) {
                  return [3 + j * 10, 21 - (val / max) * 18];
                });
                var line = pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ");
                s += '<polygon class="sp-area" points="3,21 ' + line + ' 63,21" />';
                s += '<polyline class="sp-line" points="' + line + '" />';
                pts.forEach(function (p, j) {
                  if (j === pts.length - 1) s += '<circle class="sp-last" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="2.6" />';
                  else s += '<circle class="sp-dot" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="1.8" />';
                  s += '<circle class="sp-hit" data-sp="1" data-name="' + item.name + '" data-day="' + spDays[j] + '" data-val="' + item.vals[j] + '" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="5.5" />';
                });
              } else {
                s += '<line x1="0" y1="23.4" x2="66" y2="23.4" style="stroke:var(--border)" stroke-width="1" />';
                for (i = 0; i < item.vals.length; i++) {
                  v = item.vals[i];
                  var hgt = 3 + (v / max) * 17;
                  s += '<rect class="sp-bar" data-sp="1" data-name="' + item.name + '" data-day="' + spDays[i] + '" data-val="' + v + '" x="' + (i * 10) + '" y="' + (23 - hgt).toFixed(1) + '" width="6" height="' + hgt.toFixed(1) + '" rx="1.5" />';
                }
              }
              return '<svg width="66" height="24" viewBox="0 0 66 24" aria-hidden="true">' + s + '</svg>';
            };
            var spRender = function () {
              spRows.innerHTML = spData.map(function (item) {
                var total = item.vals.reduce(function (a, b) { return a + b; }, 0);
                return '<div class="sp-row"><div class="sp-name">' + item.name + '<small>Tổng 7 ngày: ' + total + ' chiếc</small></div>' + spSvg(item) + '</div>';
              }).join("");
            };
            var spShow = function (el) {
              spRead.innerHTML = "<b>" + el.getAttribute("data-name") + "</b>&nbsp;· " + el.getAttribute("data-day") + ": " + el.getAttribute("data-val") + " chiếc";
            };
            spRows.addEventListener("mouseover", function (e) { var t = e.target.closest ? e.target.closest("[data-sp]") : null; if (t) spShow(t); });
            spRows.addEventListener("click", function (e) { var t = e.target.closest ? e.target.closest("[data-sp]") : null; if (t) spShow(t); });
            document.querySelectorAll("[data-spmode]").forEach(function (btn) {
              btn.addEventListener("click", function () {
                spMode = btn.getAttribute("data-spmode");
                document.querySelectorAll("[data-spmode]").forEach(function (b) { b.classList.toggle("on", b === btn); });
                spRead.textContent = "Di chuột hoặc chạm vào từng điểm để xem số bán theo ngày";
                spRender();
              });
            });
            spRender();
          }

          /* ---------- Tour: bong bóng chuyển bước ---------- */
          var tourFrame = document.getElementById("tourDemo");
          var tourTitle = document.getElementById("tourTitle");
          var tourText = document.getElementById("tourText");
          var tourSteps = [
            ["Bước 1 / 2", "Bấm nút này để tạo đơn hàng mới."],
            ["Bước 2 / 2", "Thông báo mới sẽ hiện ở đây."]
          ];
          var tourIdx = 0;
          if (!reduceMotion) setInterval(__tpwLiveGuard(tourFrame, function () {
            tourIdx = (tourIdx + 1) % 2;
            tourFrame.classList.toggle("s1", tourIdx === 0);
            tourFrame.classList.toggle("s2", tourIdx === 1);
            tourTitle.textContent = tourSteps[tourIdx][0];
            tourText.textContent = tourSteps[tourIdx][1];
          }), 2600);

          /* ---------- Audio Player: phát / dừng ---------- */
          var audioDemo = document.getElementById("audioDemo");
          var audioBtn = document.getElementById("audioBtn");
          audioBtn.addEventListener("click", function () {
            var playing = audioDemo.classList.toggle("playing");
            audioBtn.textContent = playing ? "❚❚" : "▶";
          });

          /* ---------- Icon Button: tự chuyển + bấm được ---------- */
          var icbBtns = Array.prototype.slice.call(document.querySelectorAll("#icbRow .icb"));
          var icbLabel = document.getElementById("icbLabel");
          var icbIdx = 0, icbTimer = null;
          function setIcb(i) {
            icbIdx = i;
            icbBtns.forEach(function (b, j) { b.classList.toggle("act", j === i); });
            icbLabel.textContent = icbBtns[i].getAttribute("data-label");
          }
          icbBtns.forEach(function (b, i) {
            b.addEventListener("click", function () { setIcb(i); if (icbTimer) clearInterval(icbTimer); });
          });
          if (!reduceMotion) icbTimer = setInterval(__tpwLiveGuard(icbBtns[0], function () { setIcb((icbIdx + 1) % icbBtns.length); }), 2200);

          /* ---------- Split Button: nút chính chạy ngay, mũi tên xổ lựa chọn ---------- */
          var splitDemo = document.getElementById("splitDemo");
          var splitMsg = document.getElementById("splitMsg");
          var splitTimer = null;
          function stopSplitAuto() { if (splitTimer) clearInterval(splitTimer); }
          document.getElementById("splitMain").addEventListener("click", function () {
            splitDemo.classList.remove("open");
            splitMsg.textContent = "Đã lưu đơn hàng ✓";
            stopSplitAuto();
          });
          document.getElementById("splitChev").addEventListener("click", function () {
            splitDemo.classList.toggle("open");
            stopSplitAuto();
          });
          splitDemo.querySelectorAll(".split-menu div").forEach(function (item) {
            item.addEventListener("click", function () {
              splitMsg.textContent = "Đã chọn: " + item.textContent;
              splitDemo.classList.remove("open");
            });
          });
          document.addEventListener("click", function (e) { if (!splitDemo.contains(e.target)) splitDemo.classList.remove("open"); });
          splitDemo.addEventListener("pointerdown", stopSplitAuto);
          if (!reduceMotion) splitTimer = setInterval(__tpwLiveGuard(splitDemo, function () { splitDemo.classList.toggle("open"); }), 3000);

          /* ---------- Number Input: gõ số + nút tăng/giảm cạnh bên ---------- */
          var numInput = document.getElementById("numInput");
          function numStep(d) {
            var v = parseInt(numInput.value, 10);
            if (isNaN(v)) v = 0;
            v = Math.max(0, Math.min(999, v + d));
            numInput.value = v;
          }
          document.getElementById("numUp").addEventListener("click", function () { numStep(1); });
          document.getElementById("numDown").addEventListener("click", function () { numStep(-1); });
          numInput.addEventListener("change", function () { numStep(0); });

          /* ---------- Range Slider: kéo 2 đầu chọn khoảng giá ---------- */
          var rngTrack = document.getElementById("rngTrack");
          var rngFill = document.getElementById("rngFill");
          var rngLo = document.getElementById("rngLo");
          var rngHi = document.getElementById("rngHi");
          var rngLoVal = document.getElementById("rngLoVal");
          var rngHiVal = document.getElementById("rngHiVal");
          var rngMin = 0, rngMax = 1000, rngGap = 50;
          var rngVals = [100, 500];
          var rngPresets = [[100, 500], [200, 750]];
          var rngPresetIdx = 0, rngTimer = null;
          function rngFmt(v) { return (v * 1000).toLocaleString("vi-VN") + "đ"; }
          function rngPaint() {
            var lp = (rngVals[0] - rngMin) / (rngMax - rngMin) * 100;
            var hp = (rngVals[1] - rngMin) / (rngMax - rngMin) * 100;
            rngLo.style.left = lp + "%";
            rngHi.style.left = hp + "%";
            rngFill.style.left = lp + "%";
            rngFill.style.width = (hp - lp) + "%";
            rngLoVal.textContent = rngFmt(rngVals[0]);
            rngHiVal.textContent = rngFmt(rngVals[1]);
          }
          function rngStopAuto() { if (rngTimer) clearInterval(rngTimer); }
          function rngDrag(thumb, idx) {
            thumb.addEventListener("pointerdown", function (e) {
              e.preventDefault();
              rngStopAuto();
              thumb.setPointerCapture(e.pointerId);
              function move(ev) {
                var r = rngTrack.getBoundingClientRect();
                var v = rngMin + (ev.clientX - r.left) / r.width * (rngMax - rngMin);
                v = Math.round(v / 10) * 10;
                if (idx === 0) v = Math.max(rngMin, Math.min(v, rngVals[1] - rngGap));
                else v = Math.min(rngMax, Math.max(v, rngVals[0] + rngGap));
                rngVals[idx] = v;
                rngPaint();
              }
              function up() {
                thumb.removeEventListener("pointermove", move);
                thumb.removeEventListener("pointerup", up);
                thumb.removeEventListener("pointercancel", up);
              }
              thumb.addEventListener("pointermove", move);
              thumb.addEventListener("pointerup", up);
              thumb.addEventListener("pointercancel", up);
            });
          }
          rngDrag(rngLo, 0);
          rngDrag(rngHi, 1);
          rngPaint();
          if (!reduceMotion) rngTimer = setInterval(__tpwLiveGuard(rngTrack, function () {
            rngPresetIdx = (rngPresetIdx + 1) % rngPresets.length;
            rngVals = rngPresets[rngPresetIdx].slice();
            rngPaint();
          }), 2600);

          /* ---------- Input with Error: kiểm tra email trực tiếp ---------- */
          var errInput = document.getElementById("errInput");
          var errMsg = document.getElementById("errMsg");
          function errCheck() {
            var v = errInput.value.trim();
            var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            errInput.classList.toggle("bad", !ok);
            errInput.classList.toggle("good", ok);
            errMsg.classList.toggle("ok", ok);
            if (ok) errMsg.textContent = "✓ Email hợp lệ — tiếp tục được rồi.";
            else if (!v) errMsg.textContent = "Chưa nhập email — ô này không được để trống.";
            else if (v.indexOf("@") === -1) errMsg.textContent = "Email thiếu ký tự @ — hãy kiểm tra lại.";
            else errMsg.textContent = "Email chưa đúng định dạng — ví dụ: ten@gmail.com.";
            return ok;
          }
          errInput.addEventListener("input", function () { errCheck(); errStopAuto(); });
          var errTimer = null;
          function errStopAuto() { if (errTimer) clearInterval(errTimer); }
          errInput.addEventListener("pointerdown", errStopAuto);
          errCheck();
          if (!reduceMotion) {
            var errAlt = false;
            errTimer = setInterval(__tpwLiveGuard(errInput, function () {
              errAlt = !errAlt;
              errInput.value = errAlt ? "khachhang@gmail.com" : "khachhang.gmail.com";
              errCheck();
            }), 3000);
          }

          /* ---------- Banner: đóng / hiện lại + tự chạy ---------- */
          var bannerFrame = document.getElementById("bannerFrame");
          var bannerBar = document.getElementById("bannerBar");
          var bannerTimer = null;
          function bannerSet(closed) {
            bannerBar.classList.toggle("hide", closed);
            bannerFrame.classList.toggle("closed", closed);
          }
          function bannerStopAuto() { if (bannerTimer) clearInterval(bannerTimer); }
          document.getElementById("bannerClose").addEventListener("click", function () { bannerSet(true); bannerStopAuto(); });
          document.getElementById("bannerShow").addEventListener("click", function () { bannerSet(false); bannerStopAuto(); });
          if (!reduceMotion) {
            var bannerClosed = false;
            bannerTimer = setInterval(__tpwLiveGuard(bannerFrame, function () { bannerClosed = !bannerClosed; bannerSet(bannerClosed); }), 3400);
          }

          /* ---------- Avatar Group: bấm từng ảnh xem tên ---------- */
          var avaBtns = Array.prototype.slice.call(document.querySelectorAll("#avaGroup .ava"));
          var avaLabel = document.getElementById("avaGroupLabel");
          var avaDefault = avaLabel.textContent;
          var avaIdx = -1, avaTimer = null;
          function setAva(i) {
            avaIdx = i;
            avaBtns.forEach(function (b, j) { b.classList.toggle("pick", j === i); });
            avaLabel.textContent = i < 0 ? avaDefault : avaBtns[i].getAttribute("data-name");
          }
          avaBtns.forEach(function (b, i) {
            b.addEventListener("click", function () { setAva(i); if (avaTimer) clearInterval(avaTimer); });
          });
          if (!reduceMotion) avaTimer = setInterval(__tpwLiveGuard(avaBtns[0], function () {
            var next = avaIdx + 1;
            if (next >= avaBtns.length) next = -1;
            setAva(next);
          }), 2000);

          /* ---------- Table: bấm đầu cột Giá để sắp xếp ---------- */
          var tblBody = document.getElementById("tblBody");
          var tblSortIc = document.getElementById("tblSortIc");
          var tblAsc = null;
          document.getElementById("tblPriceHead").addEventListener("click", function () {
            tblAsc = tblAsc === null ? true : !tblAsc;
            var trs = Array.prototype.slice.call(tblBody.querySelectorAll("tr"));
            trs.sort(function (a, b) {
              var d = parseInt(a.getAttribute("data-price"), 10) - parseInt(b.getAttribute("data-price"), 10);
              return tblAsc ? d : -d;
            });
            trs.forEach(function (tr) { tblBody.appendChild(tr); });
            tblSortIc.textContent = tblAsc ? "↑" : "↓";
          });

          /* ---------- Countdown Timer: đếm ngược thật từng giây ---------- */
          var cdTime = document.getElementById("cdTime");
          var cdTotal = 2 * 3600 + 59 * 60 + 59;
          var cdLeft = cdTotal;
          function cdPad(n) { return (n < 10 ? "0" : "") + n; }
          function cdPaint() {
            var h = Math.floor(cdLeft / 3600);
            var m = Math.floor((cdLeft % 3600) / 60);
            var s = cdLeft % 60;
            cdTime.textContent = cdPad(h) + ":" + cdPad(m) + ":" + cdPad(s);
          }
          cdPaint();
          setInterval(__tpwLiveGuard(cdTime, function () {
            cdLeft--;
            if (cdLeft < 0) cdLeft = cdTotal;
            cdPaint();
          }), 1000);

          /* ---------- Notification Center: bấm dòng = mở + đánh dấu đã đọc ---------- */
          var ncRows = Array.prototype.slice.call(document.querySelectorAll("#notifCenter .nc-row"));
          var ncBadge = document.getElementById("ncBadge");
          var ncIdx = 0, ncTimer = null;
          function ncUnread() { return ncRows.filter(function (r) { return !r.classList.contains("read"); }).length; }
          function ncPaintBadge() {
            var n = ncUnread();
            ncBadge.textContent = n;
            ncBadge.style.display = n ? "" : "none";
          }
          function ncSelect(i, markRead) {
            ncIdx = i;
            ncRows.forEach(function (r, j) { r.classList.toggle("sel", j === i); });
            if (markRead) { ncRows[i].classList.add("read"); ncPaintBadge(); }
          }
          ncRows.forEach(function (r, i) {
            r.addEventListener("click", function () { ncSelect(i, true); if (ncTimer) clearInterval(ncTimer); });
          });
          ncSelect(0, false);
          if (!reduceMotion) ncTimer = setInterval(__tpwLiveGuard(ncRows[0], function () { ncSelect((ncIdx + 1) % ncRows.length, false); }), 2600);

          /* ---------- Kanban Board: kéo thả thật + bấm thẻ để chuyển cột ---------- */
          var kbCols = Array.prototype.slice.call(document.querySelectorAll("#kbDemo .kb-col"));
          var kbDragCard = null, kbSuppressClick = false;
          document.querySelectorAll("#kbDemo .kb-card").forEach(function (card) {
            card.addEventListener("dragstart", function () {
              kbDragCard = card;
              card.classList.add("dragging");
            });
            card.addEventListener("dragend", function () {
              card.classList.remove("dragging");
              kbDragCard = null;
              kbSuppressClick = true;
              setTimeout(function () { kbSuppressClick = false; }, 80);
            });
            card.addEventListener("click", function () {
              if (kbSuppressClick) return;
              var col = card.parentElement;
              var i = kbCols.indexOf(col);
              kbCols[(i + 1) % kbCols.length].appendChild(card);
            });
          });
          kbCols.forEach(function (col) {
            col.addEventListener("dragover", function (e) {
              e.preventDefault();
              col.classList.add("over");
            });
            col.addEventListener("dragleave", function () { col.classList.remove("over"); });
            col.addEventListener("drop", function (e) {
              e.preventDefault();
              col.classList.remove("over");
              if (kbDragCard) { col.appendChild(kbDragCard); kbSuppressClick = true; }
            });
          });

          /* ---------- Đợt 5: Close Button đóng / hiện lại ---------- */
          var n5CloseWrap = document.getElementById("n5CloseWrap");
          var n5CloseTimer = null;
          function n5CloseSet(closed) { n5CloseWrap.classList.toggle("closed", closed); }
          function n5CloseStop() { if (n5CloseTimer) clearInterval(n5CloseTimer); }
          document.getElementById("n5CloseBtn").addEventListener("click", function () { n5CloseSet(true); n5CloseStop(); });
          document.getElementById("n5CloseShow").addEventListener("click", function () { n5CloseSet(false); n5CloseStop(); });
          if (!reduceMotion) {
            var n5CloseClosed = false;
            n5CloseTimer = setInterval(__tpwLiveGuard(n5CloseWrap, function () { n5CloseClosed = !n5CloseClosed; n5CloseSet(n5CloseClosed); }), 3400);
          }

          /* ---------- Đợt 5: Anchor tự tô sáng mục đang xem ---------- */
          var n5AnchorNav = Array.prototype.slice.call(document.querySelectorAll("#n5AnchorNav span"));
          var n5AnchorTrack = document.getElementById("n5AnchorTrack");
          var n5AnchorIdx = 0;
          function n5SetAnchor(i) {
            n5AnchorIdx = i;
            n5AnchorNav.forEach(function (s, j) { s.classList.toggle("act", j === i); });
            n5AnchorTrack.style.transform = "translateY(" + (-i * 25) + "px)";
          }
          if (!reduceMotion) setInterval(__tpwLiveGuard(n5AnchorTrack, function () { n5SetAnchor((n5AnchorIdx + 1) % 3); }), 2100);

          /* ---------- Đợt 5: Collapsible tự mở/đóng + bấm được ---------- */
          var n5Coll = document.getElementById("n5Coll");
          var n5CollTimer = null;
          document.getElementById("n5CollBtn").addEventListener("click", function () {
            n5Coll.classList.toggle("open");
            if (n5CollTimer) clearInterval(n5CollTimer);
          });
          if (!reduceMotion) {
            n5Coll.classList.add("open");
            n5CollTimer = setInterval(__tpwLiveGuard(n5Coll, function () { n5Coll.classList.toggle("open"); }), 2800);
          } else {
            n5Coll.classList.add("open");
          }

          /* ---------- Đợt 5: Color Swatch bấm chọn mẫu màu ---------- */
          var n5SwBtns = Array.prototype.slice.call(document.querySelectorAll("#n5Swatches .n5-sw"));
          var n5SwLabel = document.getElementById("n5SwLabel");
          var n5SwIdx = 0, n5SwTimer = null;
          function n5SetSw(i) {
            n5SwIdx = i;
            n5SwBtns.forEach(function (b, j) { b.classList.toggle("pick", j === i); });
            n5SwLabel.textContent = n5SwBtns[i].getAttribute("data-label");
          }
          n5SwBtns.forEach(function (b, i) {
            b.addEventListener("click", function () { n5SetSw(i); if (n5SwTimer) clearInterval(n5SwTimer); });
          });
          if (!reduceMotion) n5SwTimer = setInterval(__tpwLiveGuard(n5SwBtns[0], function () { n5SetSw((n5SwIdx + 1) % n5SwBtns.length); }), 2200);

          /* ---------- Đợt 5: Popconfirm bấm Xoá -> bong bóng xác nhận ---------- */
          var n5PopBubble = document.getElementById("n5PopBubble");
          var n5PopBtn = document.getElementById("n5PopBtn");
          var n5PopMsg = document.getElementById("n5PopMsg");
          var n5PopTimer = null;
          function n5PopShow() {
            n5PopMsg.style.display = "none";
            n5PopBtn.style.display = "";
            n5PopBubble.classList.add("show");
          }
          function n5PopHide() { n5PopBubble.classList.remove("show"); }
          function n5PopStop() { if (n5PopTimer) clearInterval(n5PopTimer); }
          n5PopBtn.addEventListener("click", function () {
            n5PopBubble.classList.contains("show") ? n5PopHide() : n5PopShow();
            n5PopStop();
          });
          document.getElementById("n5PopNo").addEventListener("click", function () { n5PopHide(); n5PopStop(); });
          document.getElementById("n5PopYes").addEventListener("click", function () {
            n5PopHide();
            n5PopBtn.style.display = "none";
            n5PopMsg.style.display = "block";
            n5PopStop();
          });
          if (!reduceMotion) n5PopTimer = setInterval(__tpwLiveGuard(n5PopBubble, function () {
            n5PopBubble.classList.contains("show") ? n5PopHide() : n5PopShow();
          }), 3000);

          /* ---------- Đợt 6: Copy Button — sao chép thật vào clipboard ---------- */
          var n6CopyBtn = document.getElementById("n6CopyBtn");
          var n6CopyTimer = null;
          function n6FallbackCopy(text) {
            var ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand("copy"); } catch (e) {}
            document.body.removeChild(ta);
          }
          n6CopyBtn.addEventListener("click", function () {
            var text = "https://vi-du.vn/moi-ban";
            function n6Copied() {
              n6CopyBtn.textContent = "Đã sao chép ✓";
              n6CopyBtn.classList.add("done");
              if (n6CopyTimer) clearTimeout(n6CopyTimer);
              n6CopyTimer = setTimeout(function () {
                n6CopyBtn.textContent = "Sao chép";
                n6CopyBtn.classList.remove("done");
              }, 2000);
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(text).then(n6Copied, function () { n6FallbackCopy(text); n6Copied(); });
            } else { n6FallbackCopy(text); n6Copied(); }
          });

          /* ---------- Đợt 6: Questionnaire — bộ câu hỏi hiện từng câu ---------- */
          var n6QuizData = [
            { q: "Bạn thường dùng web để làm gì?", opts: ["Mua sắm", "Đọc tin tức", "Học tập"] },
            { q: "Bạn lên mạng bằng thiết bị nào nhiều nhất?", opts: ["Điện thoại", "Máy tính", "Máy tính bảng"] },
            { q: "Bạn có muốn nhận tin mới qua email không?", opts: ["Có, gửi cho tôi", "Không, cảm ơn"] }
          ];
          var n6QuizIdx = 0;
          var n6QuizAns = [null, null, null];
          var n6QuizBar = document.getElementById("n6QuizBar");
          var n6QuizStep = document.getElementById("n6QuizStep");
          var n6QuizQ = document.getElementById("n6QuizQ");
          var n6QuizOpts = document.getElementById("n6QuizOpts");
          var n6QuizMain = document.getElementById("n6QuizMain");
          var n6QuizDone = document.getElementById("n6QuizDone");
          var n6QuizBack = document.getElementById("n6QuizBack");
          var n6QuizNext = document.getElementById("n6QuizNext");
          function n6QuizPaint() {
            var d = n6QuizData[n6QuizIdx];
            n6QuizBar.style.width = Math.round(((n6QuizIdx + 1) / n6QuizData.length) * 100) + "%";
            n6QuizStep.textContent = "Câu " + (n6QuizIdx + 1) + " / " + n6QuizData.length;
            n6QuizQ.textContent = d.q;
            n6QuizOpts.innerHTML = "";
            d.opts.forEach(function (opt, oi) {
              var b = document.createElement("button");
              b.type = "button";
              b.className = "n6-quiz-opt" + (n6QuizAns[n6QuizIdx] === oi ? " sel" : "");
              b.textContent = opt;
              b.addEventListener("click", function () {
                n6QuizAns[n6QuizIdx] = oi;
                Array.prototype.forEach.call(n6QuizOpts.children, function (c, ci) { c.classList.toggle("sel", ci === oi); });
              });
              n6QuizOpts.appendChild(b);
            });
            n6QuizBack.style.visibility = n6QuizIdx === 0 ? "hidden" : "";
            n6QuizNext.textContent = n6QuizIdx === n6QuizData.length - 1 ? "Gửi" : "Tiếp theo";
          }
          function n6QuizGo(dir) {
            if (dir > 0 && n6QuizIdx === n6QuizData.length - 1) {
              n6QuizMain.style.display = "none";
              n6QuizDone.style.display = "";
              n6QuizBar.style.width = "100%";
              n6QuizStep.textContent = "Hoàn thành ✓";
              return;
            }
            n6QuizIdx = Math.max(0, Math.min(n6QuizData.length - 1, n6QuizIdx + dir));
            n6QuizPaint();
          }
          n6QuizNext.addEventListener("click", function () { n6QuizGo(1); });
          document.getElementById("n6QuizSkip").addEventListener("click", function () { n6QuizGo(1); });
          n6QuizBack.addEventListener("click", function () { n6QuizGo(-1); });
          document.getElementById("n6QuizAgain").addEventListener("click", function () {
            n6QuizIdx = 0;
            n6QuizAns = [null, null, null];
            n6QuizDone.style.display = "none";
            n6QuizMain.style.display = "";
            n6QuizPaint();
          });
          n6QuizPaint();

          /* ---------- Đợt 6: Action Bar — thanh hành động khi tick chọn mục ---------- */
          var n6Abar = document.getElementById("n6Abar");
          var n6AbarCnt = document.getElementById("n6AbarCnt");
          var n6AbarMsg = document.getElementById("n6AbarMsg");
          var n6AbarBoxes = Array.prototype.slice.call(document.querySelectorAll("#n6AbarList input[type='checkbox']"));
          var n6AbarMsgTimer = null;
          function n6AbarPaint() {
            var n = 0;
            n6AbarBoxes.forEach(function (b) {
              if (b.checked) n++;
              b.parentElement.classList.toggle("sel", b.checked);
            });
            n6AbarCnt.textContent = "Đã chọn " + n + " mục";
            n6Abar.classList.toggle("show", n > 0);
          }
          n6AbarBoxes.forEach(function (b) { b.addEventListener("change", n6AbarPaint); });
          Array.prototype.forEach.call(n6Abar.querySelectorAll("button"), function (btn) {
            btn.addEventListener("click", function () {
              n6AbarMsg.textContent = btn.getAttribute("data-act");
              n6AbarMsg.classList.add("show");
              if (n6AbarMsgTimer) clearTimeout(n6AbarMsgTimer);
              n6AbarMsgTimer = setTimeout(function () { n6AbarMsg.classList.remove("show"); }, 1600);
            });
          });
          n6AbarPaint();
  })();

  /* ----- JS[2] effects batch 1 ----- */

  (function () {
          var rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          function $(id) { return document.getElementById(id); }
          function onScroll(el, fn) { if (el) el.addEventListener("scroll", fn, { passive: true }); }

          /* 1 — Scroll Reveal: thẻ hiện khi cuộn vào khung mini */
          var rvFrame = $("fxRevealFrame");
          if (rvFrame) {
            var rvCards = rvFrame.querySelectorAll(".fx-rv-card");
            if ("IntersectionObserver" in window && !rm) {
              var rvObs = new IntersectionObserver(function (entries) {
                entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); rvObs.unobserve(e.target); } });
              }, { root: rvFrame, threshold: 0.4 });
              rvCards.forEach(function (c) { rvObs.observe(c); });
            } else {
              rvCards.forEach(function (c) { c.classList.add("in"); });
            }
          }

          /* 2 — Parallax: nền trôi chậm hơn khi cuộn khung */
          var pxFrame = $("fxPxFrame"), pxBg = $("fxPxBg");
          onScroll(pxFrame, function () { if (!rm) pxBg.style.transform = "translateY(" + (pxFrame.scrollTop * 0.35) + "px)"; });

          /* 3 — Smooth Scroll: bật/tắt cuộn mượt + nút đi tới cuối/đầu */
          var smFrame = $("fxSmoothFrame"), smToggle = $("fxSmoothToggle"), smGo = $("fxSmoothGo");
          if (smFrame && smToggle && smGo) {
            var smOn = true, smDown = true;
            function smApply() { smFrame.style.scrollBehavior = smOn && !rm ? "smooth" : "auto"; smToggle.textContent = "Cuộn mượt: " + (smOn ? "Bật" : "Tắt"); }
            smApply();
            smToggle.addEventListener("click", function () { smOn = !smOn; smApply(); });
            smGo.addEventListener("click", function () {
              smFrame.scrollTop = smDown ? smFrame.scrollHeight : 0;
              smDown = !smDown;
              smGo.textContent = smDown ? "Xuống cuối ↓" : "Lên đầu ↑";
            });
          }

          /* 4 — Sticky Header Shrink */
          var shFrame = $("fxShFrame"), shHead = $("fxShHead");
          onScroll(shFrame, function () { shHead.classList.toggle("shrunk", shFrame.scrollTop > 12); });

          /* 5 — Horizontal Scroll: cuộn dọc -> dải trượt ngang */
          var hFrame = $("fxHFrame"), hTrack = $("fxHTrack");
          onScroll(hFrame, function () {
            if (rm) return;
            var max = hFrame.scrollHeight - hFrame.clientHeight;
            var p = max > 0 ? hFrame.scrollTop / max : 0;
            hTrack.style.transform = "translateX(" + (-p * 118) + "px)";
          });

          /* 6 — Magnetic Button */
          var magZone = $("fxMagZone"), magBtn = $("fxMagBtn");
          if (magZone && magBtn && !rm) {
            magZone.addEventListener("mousemove", function (e) {
              var r = magBtn.getBoundingClientRect();
              var dx = e.clientX - (r.left + r.width / 2);
              var dy = e.clientY - (r.top + r.height / 2);
              magBtn.style.transform = "translate(" + Math.max(-8, Math.min(8, dx * 0.25)) + "px," + Math.max(-8, Math.min(8, dy * 0.25)) + "px)";
            });
            magZone.addEventListener("mouseleave", function () { magBtn.style.transform = ""; });
          }

          /* 7 — Tilt Card */
          var tilt = $("fxTiltCard");
          if (tilt && !rm) {
            tilt.addEventListener("mousemove", function (e) {
              var r = tilt.getBoundingClientRect();
              var rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
              var ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
              tilt.style.transform = "translateY(-4px) rotateX(" + rx.toFixed(1) + "deg) rotateY(" + ry.toFixed(1) + "deg)";
            });
            tilt.addEventListener("mouseleave", function () { tilt.style.transform = ""; });
          }

          /* 9 — Ripple */
          var ripBtn = $("fxRippleBtn");
          if (ripBtn) ripBtn.addEventListener("click", function (e) {
            var r = ripBtn.getBoundingClientRect();
            var d = Math.max(r.width, r.height);
            var s = document.createElement("span");
            s.className = "fx-ripple";
            s.style.width = s.style.height = d + "px";
            s.style.left = (e.clientX - r.left - d / 2) + "px";
            s.style.top = (e.clientY - r.top - d / 2) + "px";
            ripBtn.appendChild(s);
            setTimeout(function () { s.remove(); }, 700);
          });

          /* 10 — Cursor Glow */
          var glowZone = $("fxGlowZone"), glow = $("fxGlow"), glowLink = $("fxGlowLink");
          if (glowZone && glow && !rm) {
            glowZone.addEventListener("mousemove", function (e) {
              var r = glowZone.getBoundingClientRect();
              glow.style.transform = "translate(" + (e.clientX - r.left - r.width / 2).toFixed(1) + "px," + (e.clientY - r.top - r.height / 2).toFixed(1) + "px) translate(-50%,-50%)";
            });
            if (glowLink) {
              glowLink.addEventListener("mouseenter", function () { glow.classList.add("big"); });
              glowLink.addEventListener("mouseleave", function () { glow.classList.remove("big"); });
            }
          }

          /* 11 — Hero Entrance: phát lại */
          var hero = $("fxHero"), heroBtn = $("fxHeroReplay");
          function heroPlay() {
            if (!hero) return;
            hero.classList.remove("play");
            void hero.offsetWidth;
            hero.classList.add("play");
          }
          if (heroBtn) heroBtn.addEventListener("click", heroPlay);
          heroPlay();

          /* 12 — Page Transition */
          var pgA = $("fxPageA"), pgB = $("fxPageB"), pgBtn = $("fxPageBtn"), pgOnA = true;
          if (pgBtn) pgBtn.addEventListener("click", function () {
            pgOnA = !pgOnA;
            pgA.classList.toggle("on", pgOnA);
            pgB.classList.toggle("on", !pgOnA);
            pgBtn.textContent = pgOnA ? "Chuyển trang →" : "← Quay lại";
          });

          /* 13 — Modal FX */
          var mWrap = $("fxMWrap");
          if (mWrap) {
            $("fxMOpen").addEventListener("click", function () { mWrap.classList.add("open"); });
            $("fxMClose").addEventListener("click", function () { mWrap.classList.remove("open"); });
          }

          /* 14 — Drawer FX */
          var dFrame = $("fxDFrame");
          if (dFrame) {
            $("fxDOpen").addEventListener("click", function () { dFrame.classList.add("open"); });
            $("fxDBack").addEventListener("click", function () { dFrame.classList.remove("open"); });
          }

          /* 15 — Toast FX */
          var toastBtn = $("fxToastBtn"), toast = $("fxToast"), toastTimer = null;
          if (toastBtn) toastBtn.addEventListener("click", function () {
            toast.classList.add("show");
            if (toastTimer) clearTimeout(toastTimer);
            toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 3000);
          });

          /* 16 — Accordion FX */
          var fxAcc = $("fxAcc");
          if (fxAcc) fxAcc.querySelectorAll(".fx-acc-item").forEach(function (item) {
            item.querySelector(".fx-acc-head").addEventListener("click", function () {
              var wasOpen = item.classList.contains("open");
              fxAcc.querySelectorAll(".fx-acc-item").forEach(function (i) { i.classList.remove("open"); });
              if (!wasOpen) item.classList.add("open");
            });
          });

          /* 17 — Split Text + Typewriter */
          var split = $("fxSplit");
          if (split) {
            var splitText = split.textContent;
            split.textContent = "";
            splitText.split("").forEach(function (ch, i) {
              var s = document.createElement("span");
              s.className = "fx-ch";
              s.style.animationDelay = (i * 45) + "ms";
              s.textContent = ch === " " ? " " : ch;
              split.appendChild(s);
            });
            function splitPlay() {
              split.classList.remove("play");
              void split.offsetWidth;
              split.classList.add("play");
            }
            $("fxSplitReplay").addEventListener("click", splitPlay);
            splitPlay();
          }
          var typeTxt = $("fxTypeTxt");
          if (typeTxt) {
            var phrase = "…hoặc gõ từng ký tự như máy đánh chữ";
            if (rm) { typeTxt.textContent = phrase; }
            else {
              var ti = 0, tDel = false;
              (function typeLoop() {
                /* Chỉ gõ khi thẻ đang gần khung hình (lớp .demo-live); trong popup
                   thẻ không còn là tổ tiên nên closest(".card") rỗng -> vẫn gõ. */
                var twCard = typeTxt.closest ? typeTxt.closest(".card") : null;
                if (twCard && !twCard.classList.contains("demo-live")) { setTimeout(typeLoop, 480); return; }
                ti += tDel ? -1 : 1;
                typeTxt.textContent = phrase.slice(0, ti);
                var wait = tDel ? 28 : 62;
                if (!tDel && ti === phrase.length) { wait = 1500; tDel = true; }
                else if (tDel && ti === 0) { wait = 450; tDel = false; }
                setTimeout(typeLoop, wait);
              })();
            }
          }

          /* 21 — Confetti */
          var confBtn = $("fxConfBtn"), confZone = $("fxConfZone");
          if (confBtn && confZone) confBtn.addEventListener("click", function () {
            if (rm) return;
            var colors = ["#fc7a01", "#052e57", "#1d9e6c", "#d6336c", "#f5c04e"];
            for (var i = 0; i < 26; i++) {
              var p = document.createElement("span");
              p.className = "fx-confetti";
              p.style.background = colors[i % colors.length];
              p.style.setProperty("--dx", (Math.random() * 150 - 75).toFixed(0) + "px");
              p.style.setProperty("--dy", (Math.random() * 90 - 45).toFixed(0) + "px");
              p.style.setProperty("--rot", (Math.random() * 540 - 270).toFixed(0) + "deg");
              confZone.appendChild(p);
              (function (el) { setTimeout(function () { el.remove(); }, 1000); })(p);
            }
          });

          /* 22 — Skeleton toggle */
          var skel = $("fxSkel"), skelReal = $("fxSkelReal"), skelBtn = $("fxSkelBtn"), skelDone = false;
          if (skelBtn) skelBtn.addEventListener("click", function () {
            skelDone = !skelDone;
            skel.style.display = skelDone ? "none" : "";
            skelReal.hidden = !skelDone;
            skelBtn.textContent = skelDone ? "Tải lại" : "Tải xong";
          });

          /* 24 — Count-up */
          var countEl = $("fxCountNum");
          function fmt(n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
          function countUp() {
            if (!countEl) return;
            if (rm) { countEl.textContent = "2.400+"; return; }
            var target = 2400, dur = 1200, t0 = null;
            function step(ts) {
              if (!t0) t0 = ts;
              var p = Math.min(1, (ts - t0) / dur);
              countEl.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3)))) + (p === 1 ? "+" : "");
              if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
          }
          if (countEl) {
            if ("IntersectionObserver" in window) {
              var cObs = new IntersectionObserver(function (entries) {
                entries.forEach(function (e) { if (e.isIntersecting) { countUp(); cObs.disconnect(); } });
              }, { threshold: 0.4 });
              cObs.observe(countEl);
            } else countUp();
            $("fxCountReplay").addEventListener("click", countUp);
          }
        })();



  /* ----- JS[3] demos (dot 2-3 effects) ----- */
  (function () {
  var rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* ---------- Đợt 2: Scroll Progress Indicator ---------- */
        var progFrame = document.getElementById("fxProgFrame");
        var progBar = document.getElementById("fxProgBar");
        var progPct = document.getElementById("fxProgPct");
        if (progFrame && progBar) {
          var updProg = function () {
            var max = progFrame.scrollHeight - progFrame.clientHeight;
            var p = max > 0 ? Math.min(1, progFrame.scrollTop / max) : 0;
            progBar.style.transform = "scaleX(" + p + ")";
            if (progPct) progPct.textContent = Math.round(p * 100) + "%";
          };
          progFrame.addEventListener("scroll", updProg, { passive: true });
          updProg();
        }

        /* ---------- Đợt 2: Flip Card 3D (bấm / phím để lật trên cảm ứng) ---------- */
        var flip = document.getElementById("fxFlip");
        if (flip) {
          flip.addEventListener("click", function () { flip.classList.toggle("flipped"); });
          flip.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip.classList.toggle("flipped"); }
          });
        }

        /* ---------- Đợt 2: Shake / Wiggle ---------- */
        var shakeWrap = document.getElementById("fxShakeWrap");
        var shakeBtn = document.getElementById("fxShakeBtn");
        var shakeInput = document.getElementById("fxShakeInput");
        if (shakeWrap && shakeBtn && shakeInput) {
          shakeBtn.addEventListener("click", function () {
            if (shakeInput.value.trim() === "") {
              shakeWrap.classList.add("err");
              shakeWrap.classList.remove("shaking");
              void shakeWrap.offsetWidth;
              shakeWrap.classList.add("shaking");
              setTimeout(function () { shakeWrap.classList.remove("shaking"); }, 500);
            } else {
              shakeWrap.classList.remove("err");
            }
          });
          shakeInput.addEventListener("input", function () { shakeWrap.classList.remove("err"); });
        }

        /* ---------- Đợt 2: Button Loading to Success Morph ---------- */
        var morph = document.getElementById("fxMorph");
        var morphLbl = document.getElementById("fxMorphLbl");
        if (morph && morphLbl) {
          var morphBusy = false;
          morph.addEventListener("click", function () {
            if (morphBusy) return;
            morphBusy = true;
            morph.classList.remove("success");
            morph.classList.add("loading");
            morph.setAttribute("aria-busy", "true");
            setTimeout(function () {
              morph.classList.remove("loading");
              morph.classList.add("success");
              morphLbl.textContent = "Đã gửi!";
              morph.removeAttribute("aria-busy");
              setTimeout(function () {
                morph.classList.remove("success");
                morphLbl.textContent = "Gửi tin nhắn";
                morphBusy = false;
              }, 2000);
            }, rm ? 400 : 1100);
          });
        }

        /* ---------- Đợt 2: Notification Badge Pop ---------- */
        var bellBtn = document.getElementById("fxBellBtn");
        var bellBadge = document.getElementById("fxBellBadge");
        if (bellBtn && bellBadge) {
          var bellN = 3;
          bellBtn.addEventListener("click", function () {
            bellN++;
            bellBadge.textContent = bellN;
            bellBadge.classList.remove("pop");
            void bellBadge.offsetWidth;
            bellBadge.classList.add("pop");
          });
        }

        /* ---------- Đợt 2: Carousel Autoplay ---------- */
        var car2 = document.getElementById("fxCar2");
        var car2Track = document.getElementById("fxCar2Track");
        var car2Play = document.getElementById("fxCar2Play");
        if (car2 && car2Track) {
          var car2Dots = Array.prototype.slice.call(car2.querySelectorAll(".dot"));
          var car2Idx = 0, car2Timer = null, car2Playing = !rm;
          function car2Go(i) {
            car2Idx = (i + 3) % 3;
            car2Track.style.transform = "translateX(-" + car2Idx * 100 + "%)";
            car2Dots.forEach(function (d, j) { d.classList.toggle("act", j === car2Idx); });
          }
          function car2Start() { if (!car2Timer && car2Playing) car2Timer = setInterval(function () { var cc = car2.closest(".card"); if (cc && !cc.classList.contains("demo-live")) return; car2Go(car2Idx + 1); }, 3000); }
          function car2Stop() { if (car2Timer) { clearInterval(car2Timer); car2Timer = null; } }
          car2Dots.forEach(function (d, i) { d.addEventListener("click", function () { car2Go(i); car2Stop(); car2Start(); }); });
          car2.addEventListener("pointerenter", car2Stop);
          car2.addEventListener("pointerleave", car2Start);
          car2.addEventListener("focusin", car2Stop);
          car2.addEventListener("focusout", car2Start);
          if (car2Play) {
            car2Play.textContent = car2Playing ? "Tạm dừng" : "Phát";
            car2Play.addEventListener("click", function () {
              car2Playing = !car2Playing;
              car2Play.textContent = car2Playing ? "Tạm dừng" : "Phát";
              if (car2Playing) car2Start(); else car2Stop();
            });
          }
          car2Go(0); car2Start();
        }

        /* ---------- Đợt 2: Dropdown Slide-down ---------- */
        var dd2 = document.getElementById("fxDd2");
        var dd2Btn = document.getElementById("fxDd2Btn");
        if (dd2 && dd2Btn) {
          dd2Btn.addEventListener("click", function (e) { e.stopPropagation(); dd2.classList.toggle("open"); });
          document.addEventListener("click", function (e) { if (!dd2.contains(e.target)) dd2.classList.remove("open"); });
          dd2.querySelectorAll(".fx-dd2-menu div").forEach(function (item) {
            item.addEventListener("click", function () { dd2.classList.remove("open"); });
          });
        }

        /* ---------- Đợt 2: Search Expand ---------- */
        var searchx = document.getElementById("fxSearchx");
        var searchxBtn = document.getElementById("fxSearchxBtn");
        var searchxInput = document.getElementById("fxSearchxInput");
        if (searchx && searchxBtn && searchxInput) {
          searchxBtn.addEventListener("click", function () {
            var open = searchx.classList.toggle("open");
            if (open) searchxInput.focus();
            else if (searchxInput.value.trim() === "") searchxInput.blur();
          });
          searchxInput.addEventListener("blur", function () {
            if (searchxInput.value.trim() === "") searchx.classList.remove("open");
          });
        }

        /* ---------- Đợt 2: Tabs Indicator Slide ---------- */
        var tabs2 = document.getElementById("fxTabs2");
        var tabs2Ind = document.getElementById("fxTabs2Ind");
        var tabs2Body = document.getElementById("fxTabs2Body");
        if (tabs2 && tabs2Ind && tabs2Body) {
          var tabs2Btns = Array.prototype.slice.call(tabs2.querySelectorAll(".fx-tabs2-head button"));
          var tabs2Texts = ["Số liệu chính của trang…", "Hoạt động gần đây của người dùng…", "Tuỳ chọn hiển thị và tài khoản…"];
          var moveInd = function (btn) {
            tabs2Ind.style.left = btn.offsetLeft + "px";
            tabs2Ind.style.width = btn.offsetWidth + "px";
          };
          tabs2Btns.forEach(function (b, i) {
            b.addEventListener("click", function () {
              tabs2Btns.forEach(function (x) { x.classList.remove("act"); });
              b.classList.add("act");
              tabs2Body.textContent = tabs2Texts[i];
              moveInd(b);
            });
          });
          moveInd(tabs2Btns[0]);
          window.addEventListener("resize", function () {
            var act = tabs2.querySelector(".fx-tabs2-head button.act");
            if (act) moveInd(act);
          });
        }

        /* ---------- Đợt 2: Chart Animate on Load ---------- */
        var chart = document.getElementById("fxChart");
        var chartBtn = document.getElementById("fxChartBtn");
        if (chart) {
          var playChart = function () { chart.classList.add("play"); };
          if ("IntersectionObserver" in window && !rm) {
            var chObs = new IntersectionObserver(function (entries) {
              entries.forEach(function (e) { if (e.isIntersecting) { playChart(); chObs.disconnect(); } });
            }, { threshold: 0.4 });
            chObs.observe(chart);
          } else playChart();
          if (chartBtn) chartBtn.addEventListener("click", function () {
            chart.classList.remove("play");
            void chart.offsetWidth;
            setTimeout(playChart, 60);
          });
        }

        /* ---------- Đợt 2: Image Parallax on Hover ---------- */
        var pxh = document.getElementById("fxPxh");
        if (pxh && !rm && window.matchMedia("(hover: hover)").matches) {
          var pxhLayers = Array.prototype.slice.call(pxh.querySelectorAll("[data-depth]"));
          pxh.addEventListener("mousemove", function (e) {
            var r = pxh.getBoundingClientRect();
            var dx = (e.clientX - r.left) / r.width - 0.5;
            var dy = (e.clientY - r.top) / r.height - 0.5;
            pxhLayers.forEach(function (l) {
              var d = parseFloat(l.getAttribute("data-depth")) || 8;
              l.style.transform = "translate(" + (dx * d).toFixed(1) + "px," + (dy * d).toFixed(1) + "px)";
            });
          });
          pxh.addEventListener("mouseleave", function () {
            pxhLayers.forEach(function (l) { l.style.transform = ""; });
          });
        }

        /* ---------- Đợt 3: Image Reveal / Clip-path Reveal ---------- */
        var clipFrame = document.getElementById("fxClipFrame");
        var clipImg = document.getElementById("fxClipImg");
        if (clipFrame && clipImg) {
          var updClip = function () {
            var max = clipFrame.scrollHeight - clipFrame.clientHeight;
            var p = max > 0 ? Math.min(1, clipFrame.scrollTop / max) : 0;
            if (rm) p = 1;
            clipImg.style.clipPath = "circle(" + (14 + p * 72) + "% at 50% 50%)";
            clipImg.style.transform = "scale(" + (1.18 - p * 0.18).toFixed(3) + ")";
          };
          clipFrame.addEventListener("scroll", updClip, { passive: true });
          updClip();
        }

        /* ---------- Đợt 3: Rating Stars Fill ---------- */
        var starsBox = document.getElementById("fxStars");
        if (starsBox) {
          var starBtns = Array.prototype.slice.call(starsBox.querySelectorAll(".fx-star"));
          var starLbl = document.getElementById("fxStarsLbl");
          var starVal = 0;
          var paintStars = function (n, hovIdx) {
            starBtns.forEach(function (b, i) {
              b.classList.toggle("on", i < n);
              b.classList.toggle("hov", i === hovIdx);
            });
          };
          starBtns.forEach(function (b, i) {
            b.addEventListener("mouseenter", function () { paintStars(i + 1, i); });
            b.addEventListener("focus", function () { paintStars(i + 1, i); });
            b.addEventListener("click", function () {
              starVal = i + 1;
              paintStars(starVal, -1);
              if (starLbl) starLbl.textContent = "Bạn chọn " + starVal + "/5 sao";
            });
          });
          starsBox.addEventListener("mouseleave", function () { paintStars(starVal, -1); });
          var starClear = document.getElementById("fxStarsClear");
          if (starClear) starClear.addEventListener("click", function () {
            starVal = 0;
            paintStars(0, -1);
            if (starLbl) starLbl.textContent = "Rê chuột / chạm để chọn";
          });
        }

        /* ---------- Đợt 3: Slider Thumb Grow ---------- */
        var sld = document.getElementById("fxSld");
        var sldVal = document.getElementById("fxSldVal");
        if (sld) {
          var updSld = function () {
            var v = parseInt(sld.value, 10) || 0;
            sld.style.background = "linear-gradient(90deg, var(--accent) " + v + "%, var(--border) " + v + "%)";
            if (sldVal) sldVal.textContent = v;
          };
          sld.addEventListener("input", updSld);
          updSld();
        }

        /* ---------- Đợt 3: Staggered List Entrance ---------- */
        var stag = document.getElementById("fxStag");
        if (stag) {
          var playStag = function () { stag.classList.add("play"); };
          if ("IntersectionObserver" in window && !rm) {
            var stObs = new IntersectionObserver(function (entries) {
              entries.forEach(function (e) { if (e.isIntersecting) { playStag(); stObs.disconnect(); } });
            }, { threshold: 0.3 });
            stObs.observe(stag);
          } else playStag();
          var stagBtn = document.getElementById("fxStagBtn");
          if (stagBtn) stagBtn.addEventListener("click", function () {
            stag.classList.remove("play");
            void stag.offsetWidth;
            setTimeout(playStag, 60);
          });
        }

        /* ---------- Đợt 3: Popover Scale-in ---------- */
        var popWrap = document.getElementById("fxPopWrap");
        var popBtn = document.getElementById("fxPopBtn");
        if (popWrap && popBtn) {
          popBtn.addEventListener("click", function (e) { e.stopPropagation(); popWrap.classList.toggle("open"); });
          document.addEventListener("click", function (e) { if (!popWrap.contains(e.target)) popWrap.classList.remove("open"); });
        }

        /* ---------- Đợt 3: Toast Stack ---------- */
        var tsBtn = document.getElementById("fxTstackBtn");
        var tsBox = document.getElementById("fxTstack");
        if (tsBtn && tsBox) {
          var tsTimer = null;
          tsBtn.addEventListener("click", function () {
            tsBox.classList.add("show");
            if (tsTimer) clearTimeout(tsTimer);
            tsTimer = setTimeout(function () { tsBox.classList.remove("show"); tsBox.classList.remove("exp"); }, 6000);
          });
          tsBox.addEventListener("click", function () { tsBox.classList.toggle("exp"); });
        }

        /* ---------- Đợt 3: Skeleton to Content Morph ---------- */
        var swapList = document.getElementById("fxSwapList");
        if (swapList) {
          var swapCards = Array.prototype.slice.call(swapList.querySelectorAll(".fx-mcard"));
          var swapRun = function () {
            swapCards.forEach(function (c) { c.classList.remove("done"); });
            swapCards.forEach(function (c, i) {
              setTimeout(function () { c.classList.add("done"); }, rm ? 60 : 1000 + i * 140);
            });
          };
          if ("IntersectionObserver" in window && !rm) {
            var swObs = new IntersectionObserver(function (entries) {
              entries.forEach(function (e) { if (e.isIntersecting) { swapRun(); swObs.disconnect(); } });
            }, { threshold: 0.3 });
            swObs.observe(swapList);
          } else swapCards.forEach(function (c) { c.classList.add("done"); });
          var swapBtn = document.getElementById("fxSwapBtn");
          if (swapBtn) swapBtn.addEventListener("click", swapRun);
        }

        /* ---------- Đợt 3: Progress Ring Animate ---------- */
        var ringRange = document.getElementById("fxRingRange");
        var ringValEl = document.getElementById("fxRingVal");
        var ringPct = document.getElementById("fxRingPct");
        if (ringRange && ringValEl) {
          var CIRC = 188.5;
          var updRing = function () {
            var v = parseInt(ringRange.value, 10) || 0;
            ringValEl.style.strokeDashoffset = (CIRC * (1 - v / 100)).toFixed(1);
            if (ringPct) ringPct.textContent = v + "%";
          };
          ringRange.addEventListener("input", updRing);
          updRing();
        }

        /* ---------- Đợt 3: Stepper Progress Animate ---------- */
        var stepper = document.getElementById("fxStepper");
        if (stepper) {
          var stSteps = Array.prototype.slice.call(stepper.querySelectorAll(".fx-step"));
          var stFill = document.getElementById("fxStepsFill");
          var stBody = document.getElementById("fxStepBody");
          var stTexts = ["Bước 1/4 — Tạo tài khoản", "Bước 2/4 — Chọn sản phẩm", "Bước 3/4 — Chọn size & màu", "Bước 4/4 — Xem lại & gửi"];
          var stIdx = 0;
          var stRender = function () {
            stSteps.forEach(function (s, i) {
              s.classList.toggle("done", i < stIdx);
              s.classList.toggle("act", i === stIdx);
              s.querySelector(".cir").textContent = i < stIdx ? "✓" : (i + 1);
            });
            if (stFill) stFill.style.transform = "scaleX(" + (stIdx / (stSteps.length - 1)) + ")";
            if (stBody) stBody.textContent = stTexts[stIdx];
          };
          var stPrev = document.getElementById("fxStepPrev");
          var stNext = document.getElementById("fxStepNext");
          if (stPrev) stPrev.addEventListener("click", function () { if (stIdx > 0) { stIdx--; stRender(); } });
          if (stNext) stNext.addEventListener("click", function () { if (stIdx < stSteps.length - 1) { stIdx++; stRender(); } });
          stRender();
        }

        /* ---------- Đợt 3: Map Pin Drop ---------- */
        var mapBox = document.getElementById("fxMap");
        var mapBtn = document.getElementById("fxMapBtn");
        if (mapBox && mapBtn) mapBtn.addEventListener("click", function () {
          mapBox.classList.remove("drop");
          void mapBox.offsetWidth;
          mapBox.classList.add("drop");
        });
  })();

  /* ----- JS[5] AI-era demos ----- */

        (function () {
          "use strict";
          function $(id) { return document.getElementById(id); }
          function scrollEnd(el) { if (el) el.scrollTop = el.scrollHeight; }
          function addMsg(box, text, cls) {
            var d = document.createElement("div");
            d.className = "n7-msg " + cls;
            d.textContent = text;
            box.appendChild(d);
            scrollEnd(box);
            return d;
          }

          /* ---------- Checkbox Card ---------- */
          var cbc = $("n7Cbc"), cbcOut = $("n7CbcCount");
          if (cbc) {
            var syncCbc = function () {
              var n = cbc.querySelectorAll(".n7-card.on").length;
              cbcOut.innerHTML = "Đã chọn: <b>" + n + " thẻ</b>";
            };
            cbc.querySelectorAll(".n7-card").forEach(function (card) {
              card.addEventListener("click", function () {
                var on = card.classList.toggle("on");
                card.setAttribute("aria-pressed", on ? "true" : "false");
                card.querySelector(".box").textContent = on ? "✓" : "";
                syncCbc();
              });
            });
            syncCbc();
          }

          /* ---------- Radio Card ---------- */
          var rdc = $("n7Rdc"), rdcOut = $("n7RdcCount");
          if (rdc) {
            rdc.querySelectorAll(".n7-card").forEach(function (card) {
              card.addEventListener("click", function () {
                rdc.querySelectorAll(".n7-card").forEach(function (c) {
                  c.classList.remove("on");
                  c.setAttribute("aria-pressed", "false");
                });
                card.classList.add("on");
                card.setAttribute("aria-pressed", "true");
                rdcOut.innerHTML = "Đã chọn: <b>" + card.querySelector("b").textContent + "</b>";
              });
            });
          }

          /* ---------- Date Input ---------- */
          var dd = $("n7Dd"), mm = $("n7Mm"), yy = $("n7Yy"), dateOut = $("n7DateOut");
          function syncDate() {
            if (!dateOut) return;
            if (dd.value && mm.value && yy.value.length === 4) {
              var d = parseInt(dd.value, 10), m = parseInt(mm.value, 10);
              if (d >= 1 && d <= 31 && m >= 1 && m <= 12) {
                dateOut.innerHTML = "Ngày đã chọn: <b>" + dd.value.padStart(2, "0") + "/" + mm.value.padStart(2, "0") + "/" + yy.value + "</b>";
                return;
              }
              dateOut.textContent = "Ngày chưa hợp lệ, kiểm tra lại nhé";
              return;
            }
            dateOut.textContent = "Gõ ngày, tháng rồi năm…";
          }
          [[dd, mm], [mm, yy]].forEach(function (pair) {
            if (!pair[0]) return;
            pair[0].addEventListener("input", function () {
              pair[0].value = pair[0].value.replace(/\D/g, "");
              if (pair[0].value.length === 2) pair[1].focus();
              syncDate();
            });
          });
          if (yy) yy.addEventListener("input", function () { yy.value = yy.value.replace(/\D/g, ""); syncDate(); });
          var todayBtn = $("n7Today");
          if (todayBtn) todayBtn.addEventListener("click", function () {
            var t = new Date();
            dd.value = String(t.getDate()).padStart(2, "0");
            mm.value = String(t.getMonth() + 1).padStart(2, "0");
            yy.value = String(t.getFullYear());
            syncDate();
          });

          /* ---------- Prompt Input ---------- */
          var pBox = $("n7PromptMsgs"), pText = $("n7PromptText");
          function growPrompt() {
            if (!pText) return;
            pText.style.height = "auto";
            pText.style.height = Math.min(pText.scrollHeight, 74) + "px";
          }
          function sendPrompt() {
            var v = pText.value.trim();
            if (!v) return;
            addMsg(pBox, v, "me");
            pText.value = "";
            growPrompt();
            var typing = addMsg(pBox, "AI đang trả lời…", "ai typing");
            setTimeout(function () {
              typing.classList.remove("typing");
              typing.textContent = "Đã nhận được! Đây là câu trả lời mẫu cho: “" + (v.length > 42 ? v.slice(0, 42) + "…”" : v + "”");
              scrollEnd(pBox);
            }, 650);
          }
          if (pText) {
            pText.addEventListener("input", growPrompt);
            pText.addEventListener("keydown", function (e) {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendPrompt(); }
            });
          }
          var pSend = $("n7PromptSend");
          if (pSend) pSend.addEventListener("click", sendPrompt);
          var attach = $("n7Attach");
          if (attach) attach.addEventListener("click", function () {
            addMsg(pBox, "📎 Bạn vừa bấm đính kèm — trên web thật nút này mở hộp chọn tệp.", "ai");
          });

          /* ---------- Suggestion ---------- */
          var sBox = $("n7SugMsgs"), sInput = $("n7SugInput");
          function sugAsk(q, a) {
            addMsg(sBox, q, "me");
            var typing = addMsg(sBox, "AI đang trả lời…", "ai typing");
            setTimeout(function () {
              typing.classList.remove("typing");
              typing.textContent = a;
              scrollEnd(sBox);
            }, 550);
          }
          var sugChips = $("n7SugChips");
          if (sugChips) sugChips.querySelectorAll(".n7-chip").forEach(function (chip) {
            chip.addEventListener("click", function () {
              if (sInput) sInput.value = chip.textContent.trim();
              sugAsk(chip.textContent.trim(), chip.getAttribute("data-a"));
            });
          });
          function sugSend() {
            var v = sInput.value.trim();
            if (!v) return;
            sInput.value = "";
            sugAsk(v, "Đây là câu trả lời mẫu — trên web thật AI sẽ trả lời đúng câu hỏi của bạn.");
          }
          var sSend = $("n7SugSend");
          if (sSend) sSend.addEventListener("click", sugSend);
          if (sInput) sInput.addEventListener("keydown", function (e) { if (e.key === "Enter") sugSend(); });

          /* ---------- Model Selector ---------- */
          var mSel = $("n7ModelSel"), lSel = $("n7LevelSel"), mOut = $("n7ModelOut");
          function syncModel(note) {
            if (!mSel || !lSel) return;
            if (mSel.value === "Gemini" && lSel.value === "Cao") {
              lSel.value = "Vừa";
              note = "Gemini chưa hỗ trợ mức Cao nên đã chuyển về Vừa.";
            }
            mOut.innerHTML = "Đang dùng: <b>" + mSel.value + " · Suy luận " + lSel.value + "</b>" + (note ? "<br/>" + note : "");
          }
          if (mSel) mSel.addEventListener("change", function () { syncModel(); });
          if (lSel) lSel.addEventListener("change", function () { syncModel(); });

          /* ---------- Menu ---------- */
          var menuBtn = $("n7MenuBtn"), menuList = $("n7MenuList"), menuOut = $("n7MenuOut");
          function closeMenu() {
            if (!menuList) return;
            menuList.classList.remove("show");
            if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
          }
          if (menuBtn) menuBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            var open = menuList.classList.toggle("show");
            menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
          });
          if (menuList) {
            menuList.addEventListener("click", function (e) { e.stopPropagation(); });
            menuList.querySelectorAll("button[data-act]").forEach(function (b) {
              b.addEventListener("click", function () {
                menuOut.innerHTML = "Đã chọn: <b>" + b.getAttribute("data-act") + "</b>";
                closeMenu();
              });
            });
          }
          var subBtn = $("n7SubBtn"), sub = $("n7Sub");
          if (subBtn) subBtn.addEventListener("click", function () {
            var open = sub.classList.toggle("show");
            subBtn.setAttribute("aria-expanded", open ? "true" : "false");
            subBtn.querySelector(".arr").textContent = open ? "▾" : "▸";
          });
          document.addEventListener("click", function (e) {
            if (menuList && menuList.classList.contains("show") && !$("n7Menu").contains(e.target)) closeMenu();
          });

          /* ---------- Icon ---------- */
          var iconSearch = $("n7IconSearch"), iconGrid = $("n7IconGrid"), iconOut = $("n7IconOut");
          if (iconSearch && iconGrid) iconSearch.addEventListener("input", function () {
            var q = iconSearch.value.trim().toLowerCase();
            var any = false;
            iconGrid.querySelectorAll("button").forEach(function (b) {
              var show = !q || b.getAttribute("data-name").indexOf(q) !== -1;
              b.style.display = show ? "" : "none";
              if (show) any = true;
            });
            iconOut.textContent = any ? "Bấm một biểu tượng để sao chép tên" : "Không có biểu tượng nào khớp";
          });
          if (iconGrid) iconGrid.querySelectorAll("button").forEach(function (b) {
            b.addEventListener("click", function () {
              iconGrid.querySelectorAll("button").forEach(function (x) { x.classList.remove("pick"); });
              b.classList.add("pick");
              var name = b.getAttribute("data-name");
              function done(ok) {
                iconOut.innerHTML = ok ? "Đã sao chép tên: <b>" + name + "</b>" : "Tên biểu tượng: <b>" + name + "</b>";
              }
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(name).then(function () { done(true); }, function () { done(false); });
              } else done(false);
            });
          });

          /* ---------- Reasoning ---------- */
          var rBtn = $("n7ReasonBtn"), think = $("n7Think"), thinkHead = $("n7ThinkHead"),
              thinkLabel = $("n7ThinkLabel"), thinkLines = $("n7ThinkLines");
          var rSteps = [
            "Đang đọc và phân tích câu hỏi…",
            "Đang tra cứu các nguồn liên quan…",
            "Đang sắp xếp ý và soạn câu trả lời…"
          ];
          var rBusy = false;
          if (thinkHead) thinkHead.addEventListener("click", function () {
            if (!rBusy) think.classList.toggle("open");
          });
          if (rBtn) rBtn.addEventListener("click", function () {
            if (rBusy) return;
            rBusy = true;
            rBtn.disabled = true;
            rBtn.textContent = "Đang hỏi…";
            think.hidden = false;
            think.classList.add("open");
            thinkLines.innerHTML = "";
            thinkLabel.innerHTML = "Đang suy nghĩ <span class=\"n7-dots\"><i></i><i></i><i></i></span>";
            rSteps.forEach(function (s, i) {
              setTimeout(function () {
                var p = document.createElement("p");
                p.textContent = s;
                thinkLines.appendChild(p);
              }, 500 + i * 650);
            });
            setTimeout(function () {
              var secs = Math.round((500 + rSteps.length * 650 + 350) / 1000);
              thinkLabel.textContent = "Đã suy nghĩ trong " + secs + " giây";
              think.classList.remove("open");
              rBusy = false;
              rBtn.disabled = false;
              rBtn.textContent = "Hỏi lại";
            }, 500 + rSteps.length * 650 + 350);
          });

          /* ---------- Inline Citation ---------- */
          var citeCard = $("n7CiteCard");
          document.querySelectorAll(".n7-cite").forEach(function (c) {
            function showCite() {
              document.querySelectorAll(".n7-cite").forEach(function (x) { x.classList.remove("on"); });
              c.classList.add("on");
              $("n7CiteT").textContent = c.getAttribute("data-t");
              $("n7CiteS").textContent = c.getAttribute("data-s");
              var u = $("n7CiteU");
              u.textContent = c.getAttribute("data-u") + " ↗";
              citeCard.style.animation = "none";
              void citeCard.offsetWidth;
              citeCard.style.animation = "";
            }
            c.addEventListener("mouseenter", showCite);
            c.addEventListener("click", showCite);
          });

          /* ---------- Chain of Thought ---------- */
          var cot = $("n7Cot"), cotHead = $("n7CotHead");
          if (cotHead) cotHead.addEventListener("click", function () { cot.classList.toggle("open"); });

          /* ---------- Tool ---------- */
          document.querySelectorAll("[data-tool]").forEach(function (t) {
            t.querySelector(".n7-tool-head").addEventListener("click", function () {
              t.classList.toggle("open");
            });
          });

          /* ---------- Checkpoint ---------- */
          var restoreBtn = $("n7Restore"), ckptOut = $("n7CkptOut"), ckpt = $("n7Ckpt");
          if (restoreBtn) restoreBtn.addEventListener("click", function () {
            var afters = ckpt.querySelectorAll("[data-after]");
            if (!afters.length || afters[0].style.display === "none") return;
            afters.forEach(function (a) { a.style.display = "none"; });
            restoreBtn.disabled = true;
            restoreBtn.textContent = "Đã khôi phục ✓";
            ckptOut.innerHTML = "Đã quay lại lượt 2, các tin sau mốc đã bị xoá. <button type=\"button\" class=\"n7-reset\" id=\"n7CkptReset\">Chạy lại demo</button>";
            $("n7CkptReset").addEventListener("click", function () {
              afters.forEach(function (a) { a.style.display = ""; });
              restoreBtn.disabled = false;
              restoreBtn.textContent = "Khôi phục";
              ckptOut.textContent = "";
            });
          });

          /* ---------- Floating Panel ---------- */
          var fp = $("n7Fp"), fpFrame = $("n7FpFrame"), fpHead = $("n7FpHead"),
              fpMin = $("n7FpMin"), fpMax = $("n7FpMax"), fpResize = $("n7FpResize");
          if (fp && fpFrame) {
            var saved = null;
            function clampPos() {
              var maxL = Math.max(0, fpFrame.clientWidth - fp.offsetWidth);
              var maxT = Math.max(0, fpFrame.clientHeight - fp.offsetHeight);
              fp.style.left = Math.min(Math.max(0, fp.offsetLeft), maxL) + "px";
              fp.style.top = Math.min(Math.max(0, fp.offsetTop), maxT) + "px";
            }
            fpHead.addEventListener("pointerdown", function (e) {
              if (e.target.closest("button") || fp.classList.contains("max")) return;
              e.preventDefault();
              var sx = e.clientX, sy = e.clientY, sl = fp.offsetLeft, st = fp.offsetTop;
              function move(ev) {
                fp.style.left = (sl + ev.clientX - sx) + "px";
                fp.style.top = (st + ev.clientY - sy) + "px";
                clampPos();
              }
              function up() {
                document.removeEventListener("pointermove", move);
                document.removeEventListener("pointerup", up);
              }
              document.addEventListener("pointermove", move);
              document.addEventListener("pointerup", up);
            });
            fpResize.addEventListener("pointerdown", function (e) {
              e.preventDefault();
              e.stopPropagation();
              var sx = e.clientX, sy = e.clientY, sw = fp.offsetWidth, sh = fp.offsetHeight;
              function move(ev) {
                fp.style.width = Math.min(fpFrame.clientWidth - fp.offsetLeft, Math.max(96, sw + ev.clientX - sx)) + "px";
                fp.style.height = Math.min(fpFrame.clientHeight - fp.offsetTop, Math.max(64, sh + ev.clientY - sy)) + "px";
              }
              function up() {
                document.removeEventListener("pointermove", move);
                document.removeEventListener("pointerup", up);
              }
              document.addEventListener("pointermove", move);
              document.addEventListener("pointerup", up);
            });
            fpMin.addEventListener("click", function () {
              var min = fp.classList.toggle("min");
              fpMin.textContent = min ? "+" : "−";
              fpMin.setAttribute("aria-label", min ? "Mở lại bảng" : "Thu nhỏ bảng");
              clampPos();
            });
            fpMax.addEventListener("click", function () {
              if (fp.classList.contains("max")) {
                fp.classList.remove("max");
                if (saved) {
                  fp.style.left = saved.l; fp.style.top = saved.t;
                  fp.style.width = saved.w; fp.style.height = saved.h;
                }
                fpMax.textContent = "⤢";
              } else {
                saved = { l: fp.style.left, t: fp.style.top, w: fp.style.width, h: fp.style.height };
                fp.classList.remove("min");
                fpMin.textContent = "−";
                fp.classList.add("max");
                fpMax.textContent = "⤡";
              }
            });
          }

          /* ---------- Chat ---------- */
          var chatBox = $("n7ChatMsgs"), chatInput = $("n7ChatInput");
          function chatSend() {
            var v = chatInput.value.trim();
            if (!v) return;
            addMsg(chatBox, v, "me");
            chatInput.value = "";
            var typing = addMsg(chatBox, "AI đang gõ…", "ai typing");
            setTimeout(function () {
              typing.classList.remove("typing");
              typing.textContent = "Mình đã nhận được tin nhắn. Đây là câu trả lời mẫu của trợ lý AI — cứ hỏi tiếp nhé!";
              scrollEnd(chatBox);
            }, 700);
          }
          var chatSendBtn = $("n7ChatSend");
          if (chatSendBtn) chatSendBtn.addEventListener("click", chatSend);
          if (chatInput) chatInput.addEventListener("keydown", function (e) { if (e.key === "Enter") chatSend(); });
        })();


  /* ----- JS[6] Figma demos ----- */
  (function () {

          "use strict";
          function $(id) { return document.getElementById(id); }
          var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

          /* Variants & Slots */
          var varCard = $("fgVarCard");
          if (varCard) {
            var varBtns = document.querySelectorAll(".fg-var-btn");
            varBtns.forEach(function (b) {
              b.addEventListener("click", function () {
                varBtns.forEach(function (x) { x.classList.remove("on"); });
                b.classList.add("on");
                varCard.classList.remove("hot", "soft");
                if (b.getAttribute("data-v") === "hot") varCard.classList.add("hot");
                if (b.getAttribute("data-v") === "soft") varCard.classList.add("soft");
              });
            });
            var slotTexts = ["Nội dung khe cắm: mô tả ngắn…", "Nội dung khe cắm: giá 499k · còn 3 suất", "Nội dung khe cắm: nút “Đăng ký” + đánh giá 4.8★"];
            var slotIdx = 0;
            $("fgVarSwap").addEventListener("click", function () {
              slotIdx = (slotIdx + 1) % slotTexts.length;
              $("fgVarSlot").textContent = slotTexts[slotIdx];
            });
          }

          /* FigJam board: vote + timer */
          document.querySelectorAll("[data-vote]").forEach(function (btn) {
            btn.addEventListener("click", function () {
              var n = btn.querySelector("span");
              n.textContent = String(parseInt(n.textContent, 10) + 1);
            });
          });
          var jamBtn = $("fgJamBtn"), jamTime = $("fgJamTime"), jamTimer = null, jamLeft = 300;
          function jamRender() {
            var m = Math.floor(jamLeft / 60), sec = jamLeft % 60;
            jamTime.textContent = (m < 10 ? "0" : "") + m + ":" + (sec < 10 ? "0" : "") + sec;
          }
          if (jamBtn) jamBtn.addEventListener("click", function () {
            if (jamTimer) { clearInterval(jamTimer); jamTimer = null; jamBtn.textContent = "Bắt đầu"; return; }
            if (jamLeft <= 0) jamLeft = 300;
            jamBtn.textContent = "Dừng";
            jamTimer = setInterval(__tpwLiveGuard(jamTime, function () {
              jamLeft--; jamRender();
              if (jamLeft <= 0) { clearInterval(jamTimer); jamTimer = null; jamBtn.textContent = "Chạy lại"; }
            }), 1000);
          });

          /* Bulk create */
          var bulkBtn = $("fgBulkBtn"), bulkGrid = $("fgBulkGrid");
          if (bulkBtn) bulkBtn.addEventListener("click", function () {
            if (bulkGrid.querySelector("[data-extra]")) { bulkBtn.textContent = "Đã tạo đủ 3 thẻ"; return; }
            var d = document.createElement("div");
            d.className = "fg-bulk-card"; d.setAttribute("data-extra", "1");
            d.innerHTML = "Mũ lưỡi trai<b>99k</b>";
            bulkGrid.appendChild(d);
            bulkBtn.textContent = "Đã tạo đủ 3 thẻ";
          });

          /* Breakpoint preview */
          var bpFrame = $("fgBpFrame");
          if (bpFrame) {
            var bpBtns = document.querySelectorAll(".fg-bp-btn");
            bpBtns.forEach(function (b) {
              b.addEventListener("click", function () {
                bpBtns.forEach(function (x) { x.classList.remove("on"); });
                b.classList.add("on");
                bpFrame.classList.remove("tablet", "phone");
                var v = b.getAttribute("data-bp");
                if (v) bpFrame.classList.add(v);
              });
            });
          }

          /* Auto Layout hug/fill */
          var fgAuto = $("fgAuto");
          if (fgAuto) {
            var aBtns = document.querySelectorAll(".fg-auto-btn2");
            aBtns.forEach(function (b) {
              b.addEventListener("click", function () {
                aBtns.forEach(function (x) { x.classList.remove("on"); });
                b.classList.add("on");
                fgAuto.classList.toggle("fill", b.getAttribute("data-m") === "fill");
              });
            });
            var long = false;
            $("fgAutoText").addEventListener("click", function () {
              long = !long;
              $("fgAutoBtn").textContent = long ? "Nút bấm có chữ dài hơn hẳn" : "Nút bấm";
              this.textContent = long ? "Đổi chữ ngắn lại" : "Đổi chữ dài hơn";
            });
          }

          /* Mouse parallax */
          var mpar = $("fgMpar");
          if (mpar && !reduceMotion) {
            var l1 = mpar.querySelector(".l1"), l2 = mpar.querySelector(".l2"), l3 = mpar.querySelector(".l3");
            mpar.addEventListener("pointermove", function (e) {
              var r = mpar.getBoundingClientRect();
              var dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5;
              l1.style.transform = "translate(" + (dx * 16) + "px," + (dy * 12) + "px)";
              l2.style.transform = "translate(" + (dx * -22) + "px," + (dy * -14) + "px)";
              l3.style.transform = "translate(" + (dx * 7) + "px,0)";
            });
            mpar.addEventListener("pointerleave", function () { l1.style.transform = l2.style.transform = l3.style.transform = ""; });
          }

          /* 3D transform */
          var c3d = $("fg3dCard");
          if (c3d) {
            var upd3d = function () {
              c3d.style.transform = "rotateY(" + $("fg3dY").value + "deg) rotateX(" + (-$("fg3dX").value) + "deg)";
            };
            $("fg3dY").addEventListener("input", upd3d);
            $("fg3dX").addEventListener("input", upd3d);
            upd3d();
          }

          /* Draggable */
          var dragFrame = $("fgDrag"), chip = $("fgDragChip");
          if (dragFrame && chip) {
            var dragging = false, offX = 0, offY = 0;
            chip.addEventListener("pointerdown", function (e) {
              dragging = true;
              var r = chip.getBoundingClientRect(), fr = dragFrame.getBoundingClientRect();
              offX = e.clientX - r.left; offY = e.clientY - r.top;
              chip.setPointerCapture(e.pointerId);
              e.preventDefault();
            });
            chip.addEventListener("pointermove", function (e) {
              if (!dragging) return;
              var fr = dragFrame.getBoundingClientRect();
              var x = e.clientX - fr.left - offX, y = e.clientY - fr.top - offY;
              x = Math.max(0, Math.min(x, fr.width - chip.offsetWidth));
              y = Math.max(0, Math.min(y, fr.height - chip.offsetHeight));
              chip.style.left = x + "px"; chip.style.top = y + "px";
            });
            ["pointerup", "pointercancel"].forEach(function (ev) { chip.addEventListener(ev, function () { dragging = false; }); });
          }

          /* Smart animate */
          var smart = $("fgSmart");
          if (smart) $("fgSmartBtn").addEventListener("click", function () { smart.classList.toggle("open"); });

          /* Motion timeline */
          var tlBall = $("fgTlBall"), tlRange = $("fgTlRange"), tlAnim = null;
          function tlRender(v) {
            var p = v / 100;
            var x = 8 + p * 128;
            var scale = p < 0.5 ? 1 + p * 0.9 : 1.45 - (p - 0.5) * 0.5;
            var rot = p * 180;
            tlBall.style.left = x + "px";
            tlBall.style.transform = "rotate(" + rot + "deg) scale(" + scale.toFixed(2) + ")";
            tlBall.style.background = p < 0.5 ? "#FC7A01" : "#052E57";
          }
          if (tlBall) {
            tlRange.addEventListener("input", function () { tlRender(parseInt(tlRange.value, 10)); });
            tlRender(0);
            $("fgTlPlay").addEventListener("click", function () {
              if (tlAnim) { cancelAnimationFrame(tlAnim); tlAnim = null; this.textContent = "Phát"; return; }
              if (reduceMotion) { tlRange.value = 100; tlRender(100); return; }
              var btn = this, start = null;
              btn.textContent = "Dừng";
              var step = function (ts) {
                if (!start) start = ts;
                var p = Math.min((ts - start) / 1600, 1);
                tlRange.value = Math.round(p * 100); tlRender(p * 100);
                if (p < 1) tlAnim = requestAnimationFrame(step);
                else { tlAnim = null; btn.textContent = "Phát lại"; }
              };
              tlAnim = requestAnimationFrame(step);
            });
          }

          /* Scramble text */
          var scrTxt = $("fgScrTxt"), scrTimer = null;
          function scramble() {
            if (!scrTxt) return;
            var target = "THIẾT KẾ", chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&", frame = 0;
            if (reduceMotion) { scrTxt.textContent = target; return; }
            clearInterval(scrTimer);
            scrTimer = setInterval(__tpwLiveGuard(scrTxt, function () {
              frame++;
              var done = Math.floor(frame / 2);
              var out = target.slice(0, done);
              for (var i = done; i < target.length; i++) out += target[i] === " " ? " " : chars[Math.floor(Math.random() * chars.length)];
              scrTxt.textContent = out;
              if (done >= target.length) { clearInterval(scrTimer); scrTxt.textContent = target; }
            }), 45);
          }
          if (scrTxt) { $("fgScrBtn").addEventListener("click", scramble); scramble(); }

          /* Dynamic strokes replay */
          var strokeBox = $("fgStroke");
          if (strokeBox) {
            var replay = function () {
              strokeBox.classList.remove("play");
              void strokeBox.offsetWidth;
              strokeBox.classList.add("play");
            };
            $("fgStrokeBtn").addEventListener("click", replay);
            replay();
          }

          /* Progressive blur */
          var pbRange = $("fgPblurRange");
          if (pbRange) pbRange.addEventListener("input", function () {
            $("fgPblur").style.setProperty("--fg-blur", this.value + "px");
          });

          /* Noise density */
          var nzRange = $("fgNoiseRange");
          if (nzRange) nzRange.addEventListener("input", function () {
            $("fgNoiseSvg").style.opacity = (this.value / 100).toFixed(2);
          });
  })();

  /* ----- JS[7] supplement batch 2 ----- */

        /* ===== Đợt bổ sung 2: wiring cho Form kiểm tra dữ liệu, Nút đang tải, Hệ lưới bố cục (tiền tố n8-) ===== */
        (function () {
          "use strict";
          function $(id) { return document.getElementById(id); }

          /* Form có kiểm tra dữ liệu */
          var fForm = $("n8Form");
          if (fForm) {
            var fName = $("n8Name"), fEmail = $("n8Email"),
                fNameErr = $("n8NameErr"), fEmailErr = $("n8EmailErr"), fOk = $("n8FormOk");
            function checkField(inp, err, valid) {
              inp.classList.toggle("bad", !valid);
              err.classList.toggle("show", !valid);
              return valid;
            }
            fForm.addEventListener("submit", function (e) {
              e.preventDefault();
              var okName = checkField(fName, fNameErr, fName.value.trim().length > 0);
              var okEmail = checkField(fEmail, fEmailErr, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fEmail.value.trim()));
              fOk.classList.toggle("show", okName && okEmail);
            });
            [[fName, fNameErr], [fEmail, fEmailErr]].forEach(function (pair) {
              pair[0].addEventListener("input", function () {
                pair[0].classList.remove("bad");
                pair[1].classList.remove("show");
              });
            });
          }

          /* Nút đang tải */
          var loadBtn = $("n8LoadBtn");
          if (loadBtn) {
            var loadTxt = loadBtn.querySelector(".n8-load-txt");
            loadBtn.addEventListener("click", function () {
              if (loadBtn.disabled) return;
              loadBtn.disabled = true;
              loadBtn.classList.add("loading");
              loadBtn.classList.remove("done");
              loadTxt.textContent = "Đang xử lý…";
              setTimeout(function () {
                loadBtn.classList.remove("loading");
                loadBtn.classList.add("done");
                loadTxt.textContent = "Đã lưu!";
                setTimeout(function () {
                  loadBtn.classList.remove("done");
                  loadBtn.disabled = false;
                  loadTxt.textContent = "Lưu thay đổi";
                }, 1600);
              }, 2000);
            });
          }

          /* Hệ lưới bố cục */
          var gridDemo = $("n8Grid"), gridBtns = document.querySelectorAll(".n8-dev button");
          if (gridDemo && gridBtns.length) {
            gridBtns.forEach(function (b) {
              b.addEventListener("click", function () {
                gridBtns.forEach(function (x) { x.classList.remove("act"); });
                b.classList.add("act");
                gridDemo.classList.remove("phone", "tablet");
                var m = b.getAttribute("data-m");
                if (m === "phone") gridDemo.classList.add("phone");
                if (m === "tablet") gridDemo.classList.add("tablet");
              });
            });
          }
        })();


  /* ----- JS[8] Astryx batch ----- */

        /* ===== Đợt Astryx (Meta): wiring cho các demo mới (tiền tố ax-) ===== */
        (function () {
          "use strict";
          function $(id) { return document.getElementById(id); }

          /* PowerSearch: thêm / gỡ token, đếm điều kiện */
          var psBar = $("axPsBar"), psCount = $("axPsCount"), psHint = $("axPsHint");
          function psUpdate() {
            if (!psBar || !psCount) return;
            var n = psBar.querySelectorAll(".ax-token").length;
            psCount.textContent = n ? ("Đang lọc theo " + n + " điều kiện") : "Chưa có điều kiện lọc nào — bấm + để thêm";
            if (psHint) psHint.style.display = n >= 3 ? "none" : "";
          }
          if (psBar) {
            psBar.addEventListener("click", function (e) {
              var x = e.target.closest("[data-axtok]");
              if (!x) return;
              var tok = x.closest(".ax-token");
              if (tok) tok.remove();
              psUpdate();
            });
            document.querySelectorAll("[data-axadd]").forEach(function (b) {
              b.addEventListener("click", function () {
                var label = b.getAttribute("data-axadd");
                var field = label.split(":")[0];
                var exists = Array.prototype.some.call(psBar.querySelectorAll(".ax-token b"), function (el) { return el.textContent === field + ":"; });
                if (exists) return;
                var span = document.createElement("span");
                span.className = "ax-token";
                span.innerHTML = "<b>" + field + ":</b> " + label.split(": ")[1] + ' <button type="button" data-axtok aria-label="Xoá điều kiện ' + field + '">×</button>';
                psBar.insertBefore(span, psHint);
                psUpdate();
              });
            });
            psUpdate();
          }

          /* Chat Tool Calls: mở rộng từng dòng */
          document.querySelectorAll("[data-axtc]").forEach(function (btn) {
            btn.addEventListener("click", function () { btn.closest(".ax-tc-row").classList.toggle("open"); });
          });

          /* Overflow List: kéo thu hẹp khung, đếm mục bị ẩn */
          var ofRow = $("axOfRow"), ofBadge = $("axOfBadge"), ofRange = $("axOfRange");
          function ofUpdate() {
            if (!ofRow || !ofRange) return;
            var limit = parseInt(ofRange.value, 10);
            var tags = ofRow.querySelectorAll(".ax-of-tag");
            var used = 0, hidden = 0;
            tags.forEach(function (t) { t.style.display = ""; });
            tags.forEach(function (t) {
              var w = t.offsetWidth + 5;
              if (used + w <= limit - 40) { used += w; }
              else { t.style.display = "none"; hidden++; }
            });
            if (ofBadge) {
              ofBadge.style.display = hidden ? "" : "none";
              ofBadge.textContent = "+" + hidden;
            }
          }
          if (ofRange) { ofRange.addEventListener("input", ofUpdate); ofUpdate(); }

          /* Timestamp: tương đối / đầy đủ / trực tiếp */
          function fmtFull(d) {
            function p(n) { return (n < 10 ? "0" : "") + n; }
            return p(d.getDate()) + "/" + p(d.getMonth() + 1) + "/" + d.getFullYear() + " · " + p(d.getHours()) + ":" + p(d.getMinutes());
          }
          var liveSec = 8;
          document.querySelectorAll("[data-axts]").forEach(function (el) {
            var v = el.getAttribute("data-axts");
            if (v === "live") {
              el.setAttribute("data-live", "1");
              el.textContent = "Vừa xong";
              el.title = fmtFull(new Date());
            } else {
              var mins = parseInt(v, 10);
              var d = new Date(Date.now() - mins * 60000);
              el.title = fmtFull(d);
              if (mins < 60) el.textContent = mins + " phút trước";
              else if (mins < 1440) el.textContent = Math.round(mins / 60) + " giờ trước";
              else el.textContent = fmtFull(d).split(" · ")[0];
            }
          });
          setInterval(function () {
            var el = document.querySelector("[data-axts='live']");
            if (!el || !window.__tpwInView(el)) return;
            liveSec += 5;
            el.textContent = liveSec < 60 ? (liveSec + " giây trước") : Math.floor(liveSec / 60) + " phút trước";
          }, 5000);

          /* Tokenizer: tách danh sách dán vào thành thẻ */
          var tkField = $("axTkField"), tkInput = $("axTkInput"), tkAdd = $("axTkAdd");
          function tkChip(text) {
            var s = document.createElement("span");
            s.className = "ax-chip";
            s.innerHTML = "";
            s.appendChild(document.createTextNode(text));
            var x = document.createElement("button");
            x.type = "button"; x.textContent = "×";
            x.setAttribute("aria-label", "Xoá thẻ " + text);
            x.setAttribute("data-axtk", "");
            s.appendChild(x);
            return s;
          }
          function tkSplit() {
            if (!tkInput || !tkField) return;
            var parts = tkInput.value.split(/[,\n;]+/).map(function (s) { return s.trim(); }).filter(Boolean);
            parts.forEach(function (p) { tkField.appendChild(tkChip(p)); });
            if (parts.length) tkInput.value = "";
          }
          if (tkAdd) tkAdd.addEventListener("click", tkSplit);
          if (tkInput) tkInput.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); tkSplit(); } });
          if (tkField) tkField.addEventListener("click", function (e) {
            var x = e.target.closest("[data-axtk]");
            if (!x) return;
            var chip = x.closest(".ax-chip");
            if (chip) chip.remove();
          });

          /* Plugin Table: bật/tắt tính năng */
          var ptTable = $("axPtTable");
          function ptSync() {
            if (!ptTable) return;
            ptTable.classList.toggle("show-sort", $("axPtSort") && $("axPtSort").checked);
            ptTable.classList.toggle("show-sel", $("axPtSel") && $("axPtSel").checked);
            ptTable.classList.toggle("show-st", $("axPtSt") && $("axPtSt").checked);
          }
          ["axPtSort", "axPtSel", "axPtSt"].forEach(function (id) {
            var el = $(id);
            if (el) el.addEventListener("change", ptSync);
          });
          ptSync();

          /* Bottom Sheet: nấc dừng + xếp chồng */
          var sheet = $("axSheet"), sheet2 = $("axSheet2"), stackBtn = $("axSheetStack");
          document.querySelectorAll("[data-axdet]").forEach(function (b) {
            b.addEventListener("click", function () {
              document.querySelectorAll("[data-axdet]").forEach(function (x) { x.classList.remove("on"); });
              b.classList.add("on");
              if (sheet) sheet.style.height = b.getAttribute("data-axdet") + "%";
            });
          });
          if (stackBtn && sheet2) stackBtn.addEventListener("click", function () {
            var on = sheet2.classList.toggle("on");
            stackBtn.textContent = on ? "Đóng tấm 2" : "Mở tấm 2";
          });

          /* Adaptive Presentation: popover <-> tấm trượt */
          var adFrame = $("axAdFrame");
          document.querySelectorAll("[data-axad]").forEach(function (b) {
            b.addEventListener("click", function () {
              document.querySelectorAll("[data-axad]").forEach(function (x) { x.classList.remove("on"); });
              b.classList.add("on");
              if (adFrame) {
                adFrame.classList.toggle("pop", b.getAttribute("data-axad") === "pop");
                adFrame.classList.toggle("sheet", b.getAttribute("data-axad") === "sheet");
              }
            });
          });

          /* FX Tempo & Character */
          var mtBox = $("axMtBox"), mtTempo = $("axMtTempo"), mtChar = $("axMtChar"),
              mtTempoVal = $("axMtTempoVal"), mtDur = $("axMtDur"), mtRun = $("axMtRun"), mtOn = false;
          var EASE = { crisp: "cubic-bezier(0.24, 1, 0.4, 1)", standard: "cubic-bezier(0.24, 1, 0.4, 1)", expressive: "cubic-bezier(0.34, 1.45, 0.64, 1)" };
          function mtInfo() {
            var tempo = parseFloat(mtTempo.value);
            var dur = Math.round(900 / tempo);
            if (mtTempoVal) mtTempoVal.textContent = tempo.toFixed(2).replace(".", ",") + "×";
            if (mtDur) mtDur.textContent = "Thời lượng: " + dur + "ms";
            return dur;
          }
          if (mtTempo) mtTempo.addEventListener("input", mtInfo);
          if (mtRun && mtBox) {
            mtInfo();
            mtRun.addEventListener("click", function () {
              var dur = mtInfo();
              mtBox.style.transition = "none";
              mtBox.style.transform = mtOn ? "" : "translateX(150px)";
              void mtBox.offsetWidth;
              mtOn = !mtOn;
              mtBox.style.transition = "transform " + dur + "ms " + (EASE[mtChar.value] || EASE.standard);
              mtBox.style.transform = mtOn ? "translateX(150px)" : "";
            });
          }

          /* FX Popover nở từ nút bấm */
          var gpWrap = $("axGpWrap"), gpBtn = $("axGpBtn");
          if (gpBtn && gpWrap) gpBtn.addEventListener("click", function () {
            var open = gpWrap.classList.toggle("open");
            gpBtn.textContent = open ? "Đóng popover" : "Mở popover";
          });

          /* FX Giảm chuyển động: trượt <-> mờ dần */
          var rmPanel = $("axRmPanel"), rmRun = $("axRmRun"), rmToggle = $("axRmToggle"), rmNote = $("axRmNote"), rmOn = false;
          function rmSync() {
            if (rmToggle) {
              rmToggle.textContent = "Giảm chuyển động: " + (rmOn ? "Bật" : "Tắt");
              rmToggle.setAttribute("aria-pressed", rmOn ? "true" : "false");
              rmToggle.classList.toggle("on", rmOn);
            }
            if (rmNote) rmNote.textContent = rmOn ? "Đang bật: chỉ mờ dần, tối đa 200ms, không trượt" : "Đang tắt: bảng trượt vào trong 450ms";
          }
          if (rmToggle) rmToggle.addEventListener("click", function () { rmOn = !rmOn; rmSync(); });
          if (rmRun && rmPanel) rmRun.addEventListener("click", function () {
            rmPanel.classList.remove("go-slide", "go-fade");
            void rmPanel.offsetWidth;
            rmPanel.classList.add(rmOn ? "go-fade" : "go-slide");
          });
          rmSync();
        })();


  /* ----- JS[10] 4 newest demos ----- */
  (function () {
  /* ================= Demo mới 1: Streaming Text ================= */
          var stRow = document.getElementById("streaming-text");
          if (stRow) {
            var stText = document.getElementById("n8stText");
            var stWords = "Dạ, mẫu bán chạy nhất hiện là váy hoa mùa hè và áo sơ mi lụa — cả hai đang giảm 15% hôm nay ạ.".split(" ");
            var stI = 0, stHold = 0;
            setInterval(function () {
              if (!stRow.classList.contains("demo-live") || !stText) return;
              if (stI <= stWords.length) {
                stText.textContent = stWords.slice(0, stI).join(" ");
                stI++;
              } else if (stHold < 22) {
                stHold++;
              } else {
                stI = 0; stHold = 0; stText.textContent = "";
              }
            }, 120);
            var stBtn = document.getElementById("n8stBtn");
            if (stBtn) stBtn.addEventListener("click", function () { stI = 0; stHold = 0; if (stText) stText.textContent = ""; });
          }

          /* ================= Demo mới 2: Before/After Image Slider ================= */
          var baRange = document.getElementById("n8baRange");
          var baBefore = document.getElementById("n8baBefore");
          var baHandle = document.getElementById("n8baHandle");
          function baSet(v) {
            v = Math.max(0, Math.min(100, +v));
            if (baBefore) baBefore.style.clipPath = "inset(0 " + (100 - v) + "% 0 0)";
            if (baHandle) baHandle.style.left = v + "%";
          }
          if (baRange) {
            baRange.addEventListener("input", function () { baSet(baRange.value); });
            baSet(baRange.value);
          }

          /* ================= Demo mới 3: Pricing Table Toggle ================= */
          var ptRow = document.getElementById("pricing-toggle");
          if (ptRow) {
            var ptM = document.getElementById("n8ptM");
            var ptY = document.getElementById("n8ptY");
            var ptNote = document.getElementById("n8ptNote");
            var ptPrices = ptRow.querySelectorAll(".n8pt-price");
            function ptSet(yearly) {
              ptPrices.forEach(function (p) { p.textContent = yearly ? p.getAttribute("data-y") : p.getAttribute("data-m"); });
              if (ptM) ptM.classList.toggle("on", !yearly);
              if (ptY) ptY.classList.toggle("on", yearly);
              if (ptNote) ptNote.textContent = yearly ? "Giá mỗi tháng khi trả theo năm — tiết kiệm 20%" : "Thanh toán theo tháng, huỷ bất cứ lúc nào";
            }
            if (ptM) ptM.addEventListener("click", function () { ptSet(false); });
            if (ptY) ptY.addEventListener("click", function () { ptSet(true); });
          }

          /* ================= Demo mới 4: Sticky Add-to-Cart Bar ================= */
          var sacAdd = document.getElementById("n8sacAdd");
          var sacCount = document.getElementById("n8sacCount");
          var sacN = 0, sacBusy = false;
          if (sacAdd) sacAdd.addEventListener("click", function () {
            if (sacBusy) return;
            sacBusy = true;
            sacN++;
            if (sacCount) { sacCount.hidden = false; sacCount.textContent = sacN; }
            var old = sacAdd.firstChild ? sacAdd.firstChild.textContent : "";
            if (sacAdd.firstChild) sacAdd.firstChild.textContent = "Đã thêm ✓ ";
            setTimeout(function () {
              if (sacAdd.firstChild) sacAdd.firstChild.textContent = old;
              sacBusy = false;
            }, 1100);
          });
  })();

  /* ----- JS[12] auto-loop replay ----- */

        /* ---------- Đợt áp demo 21:30: mọi hiệu ứng TỰ CHẠY LIÊN TỤC theo vòng lặp ----------
           Nguyên tắc: hiệu ứng chạy 1 lần rồi dừng được phát lại theo chu kỳ; hiệu ứng vốn
           theo chuột/cuộn thì tự trôi nhẹ khi không ai tương tác; hiệu ứng bấm mới chạy thì
           tự bấm theo chu kỳ. Mọi vòng tự chạy chỉ chạy khi demo đang trong khung hình
           (kể cả khi demo đã dời vào popup — khung popup nằm trong khung hình nên vẫn chạy
           trong lúc người dùng đọc mô tả bên dưới), tạm nhường khi người dùng vừa thao tác
           (bấm / cuộn / chạm / phím) và tôn trọng prefers-reduced-motion. */
        (function () {
          "use strict";
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          function $(id) { return document.getElementById(id); }
          var lastInteract = 0;
          ["pointerdown", "wheel", "touchstart", "keydown"].forEach(function (ev) {
            document.addEventListener(ev, function () { lastInteract = Date.now(); }, { passive: true, capture: true });
          });
          function idle(ms) { return Date.now() - lastInteract > ms; }
          /* Kiểm tra "đang nhìn thấy" bằng lớp .demo-live do IntersectionObserver
             chung gắn cho từng thẻ (không đo getBoundingClientRect ở mỗi nhịp nữa
             — đo liên tục ép trình duyệt tính lại layout là nguồn khựng chính).
             Demo đã dời vào popup thì không còn thẻ tổ tiên -> luôn coi là đang xem. */
          function inView(el) {
            if (!el || document.hidden) return false;
            var ov = document.getElementById("fxOverlay");
            var popOpen = !!(ov && !ov.hidden);
            if (el.closest && el.closest("#fxOverlay")) return popOpen;
            if (popOpen) return false; /* popup đang mở: dừng mọi demo phía sau */
            var card = el.closest ? el.closest(".card") : null;
            if (card) return card.classList.contains("demo-live");
            return false;
          }
          function every(ms, fn) { setInterval(function () { fn(); }, ms); }
          /* Một vòng requestAnimationFrame DUY NHẤT cho mọi hiệu ứng trôi theo
             thời gian; mỗi nhịp chỉ gọi callback của demo đang nhìn thấy. */
          var rafSubs = [], rafRunning = false;
          function rafLoop(fn, el) {
            rafSubs.push({ fn: fn, el: el });
            if (!rafRunning) { rafRunning = true; requestAnimationFrame(rafTick); }
          }
          function rafTick() {
            if (!document.hidden) {
              for (var i = 0; i < rafSubs.length; i++) {
                if (inView(rafSubs[i].el)) rafSubs[i].fn();
              }
            }
            requestAnimationFrame(rafTick);
          }
          function clickCycle(id, ms, idleMs) {
            var btn = $(id);
            if (!btn) return;
            every(ms, function () { if (inView(btn) && idle(idleMs || 4500)) btn.click(); });
          }

          /* --- Nhóm cuộn: khung tự cuộn lên/xuống vòng tròn, nhường khi người dùng cuộn --- */
          function autoScroll(frame, opts) {
            if (!frame) return;
            opts = opts || {};
            var dir = 1, holdUntil = 0;
            every(opts.stepMs || 110, function () {
              if (!inView(frame) || !idle(2500) || Date.now() < holdUntil) return;
              var max = frame.scrollHeight - frame.clientHeight;
              if (max <= 0) return;
              var nt = frame.scrollTop + dir * (opts.step || 5);
              if (nt >= max) { nt = max; dir = -1; holdUntil = Date.now() + (opts.holdMs || 1500); }
              if (nt <= 0) { nt = 0; dir = 1; holdUntil = Date.now() + (opts.holdMs || 1500); if (opts.onTop) opts.onTop(); }
              frame.scrollTop = nt;
              if (opts.onTick) opts.onTick();
            });
          }
          autoScroll($("fxPxFrame"));
          autoScroll($("fxClipFrame"));
          autoScroll($("fxShFrame"));
          autoScroll($("fxHFrame"));
          autoScroll($("fxProgFrame"));
          autoScroll($("fxSmoothFrame"), { stepMs: 280, step: 34, holdMs: 1200 });
          var rvF = $("fxRevealFrame");
          if (rvF) {
            var rvCards = rvF.querySelectorAll(".fx-rv-card");
            /* Vị trí các thẻ con đo 1 lần (offsetTop/offsetHeight), chỉ đo lại khi
               khung đổi kích thước (vd mở popup) — không đo rect ở mỗi nhịp cuộn. */
            var rvCache = null, rvCacheH = -1, rvCacheW = -1;
            function rvMeasure() {
              rvCache = [];
              rvCards.forEach(function (c) { rvCache.push({ c: c, top: c.offsetTop, h: c.offsetHeight }); });
              rvCacheH = rvF.clientHeight; rvCacheW = rvF.clientWidth;
            }
            autoScroll(rvF, {
              holdMs: 1500,
              onTop: function () { rvCards.forEach(function (c) { c.classList.remove("in"); }); },
              onTick: function () {
                if (!rvCache || rvF.clientHeight !== rvCacheH || rvF.clientWidth !== rvCacheW) rvMeasure();
                var st = rvF.scrollTop, vh = rvF.clientHeight;
                rvCache.forEach(function (it) {
                  var rel = it.top - st;
                  if (rel < vh - 6 && rel + it.h > 0) it.c.classList.add("in");
                });
              }
            });
          }

          /* --- Phát lại theo chu kỳ các hiệu ứng vốn chạy 1 lần --- */
          clickCycle("fxHeroReplay", 4200);
          clickCycle("fxSplitReplay", 4600);
          clickCycle("fxCountReplay", 4000);
          clickCycle("fgScrBtn", 3600);
          clickCycle("fgStrokeBtn", 3400);
          clickCycle("fxConfBtn", 4200);
          clickCycle("fxSwapBtn", 5200);
          clickCycle("fxChartBtn", 4600);
          clickCycle("fxStagBtn", 5200);
          clickCycle("fxSkelBtn", 4600);
          clickCycle("fxMapBtn", 3800);
          clickCycle("fxMorph", 4800);

          /* --- Tự bấm theo chu kỳ các hiệu ứng vốn chờ bấm --- */
          clickCycle("fxToastBtn", 4600);
          clickCycle("fxTstackBtn", 6800);
          clickCycle("fxPageBtn", 3200);
          clickCycle("fgSmartBtn", 3000);
          clickCycle("axMtRun", 2800);
          clickCycle("axRmRun", 3200);
          clickCycle("fxDd2Btn", 3200);
          clickCycle("fxPopBtn", 3400);
          clickCycle("axGpBtn", 3600);

          var mWrap = $("fxMWrap");
          if (mWrap) every(3400, function () {
            if (!inView(mWrap) || !idle(4500)) return;
            var b = $(mWrap.classList.contains("open") ? "fxMClose" : "fxMOpen");
            if (b) b.click();
          });
          var dFrame = $("fxDFrame");
          if (dFrame) every(3600, function () {
            if (!inView(dFrame) || !idle(4500)) return;
            if (dFrame.classList.contains("open")) dFrame.classList.remove("open");
            else { var b = $("fxDOpen"); if (b) b.click(); }
          });
          var searchx = $("fxSearchx"), searchxInput = $("fxSearchxInput");
          if (searchx) every(3400, function () {
            if (!inView(searchx) || !idle(4500)) return;
            if (searchxInput && searchxInput.value.trim() !== "") return;
            searchx.classList.toggle("open");
          });
          var tmInput = $("fxTmInput");
          if (tmInput) every(2400, function () {
            if (inView(tmInput) && idle(2500)) tmInput.checked = !tmInput.checked;
          });
          var fxAcc = $("fxAcc");
          if (fxAcc) {
            var accHeads = fxAcc.querySelectorAll(".fx-acc-head"), accIdx = 0;
            every(3000, function () {
              if (!inView(fxAcc) || !idle(4500) || !accHeads.length) return;
              accHeads[accIdx % accHeads.length].click();
              accIdx++;
            });
          }
          var tabs2 = $("fxTabs2");
          if (tabs2) {
            var tabBtns = tabs2.querySelectorAll(".fx-tabs2-head button"), tabIdx = 0;
            every(3000, function () {
              if (!inView(tabs2) || !idle(4500) || !tabBtns.length) return;
              tabIdx = (tabIdx + 1) % tabBtns.length;
              tabBtns[tabIdx].click();
            });
          }
          var stNext = $("fxStepNext"), stPrev = $("fxStepPrev");
          if (stNext && stPrev) {
            var stCount = 0;
            every(2600, function () {
              if (!inView(stNext) || !idle(4500)) return;
              ((stCount % 6) < 3 ? stNext : stPrev).click();
              stCount++;
            });
          }
          var flip = $("fxFlip"), flipHover = false;
          if (flip) {
            flip.addEventListener("mouseenter", function () { flipHover = true; });
            flip.addEventListener("mouseleave", function () { flipHover = false; });
            every(3400, function () {
              if (inView(flip) && idle(4500) && !flipHover) flip.classList.toggle("flipped");
            });
          }
          var starsBox = $("fxStars");
          if (starsBox) {
            var starBtns = starsBox.querySelectorAll(".fx-star"), starIdx = 0, starClear = $("fxStarsClear");
            every(1700, function () {
              if (!inView(starsBox) || !idle(6000) || !starBtns.length) return;
              if (starIdx < starBtns.length) { starBtns[starIdx].click(); starIdx++; }
              else { if (starClear) starClear.click(); starIdx = 0; }
            });
          }
          var shakeBtn = $("fxShakeBtn"), shakeInput = $("fxShakeInput");
          if (shakeBtn) every(4400, function () {
            if (inView(shakeBtn) && idle(4500) && shakeInput && shakeInput.value.trim() === "") shakeBtn.click();
          });
          var bellBadge = $("fxBellBadge");
          if (bellBadge) every(3800, function () {
            if (!inView(bellBadge) || !idle(3000)) return;
            bellBadge.classList.remove("pop");
            void bellBadge.offsetWidth;
            bellBadge.classList.add("pop");
          });
          var tlPlay = $("fgTlPlay");
          if (tlPlay) every(3400, function () {
            if (!inView(tlPlay) || !idle(4500)) return;
            var tx = tlPlay.textContent.trim();
            if (tx === "Phát" || tx === "Phát lại") tlPlay.click();
          });
          var avstack = document.querySelector(".fx-avstack");
          if (avstack) every(3000, function () {
            if (inView(avstack) && idle(3000)) avstack.classList.toggle("auto-spread");
          });
          var tipBtns = document.querySelectorAll(".fx-tip-btn");
          if (tipBtns.length) {
            var tipIdx = 0;
            every(2600, function () {
              if (!inView(tipBtns[0]) || !idle(3000)) return;
              tipBtns.forEach(function (b) { b.classList.remove("tip-show"); });
              tipBtns[tipIdx % tipBtns.length].classList.add("tip-show");
              tipIdx++;
            });
          }

          /* --- Thanh trượt tự dao động nhẹ khi không ai kéo --- */
          function oscillate(input, lo, hi) {
            if (!input) return;
            var dir = 1;
            every(2600, function () {
              if (!inView(input) || !idle(6000) || document.activeElement === input) return;
              var v = parseFloat(input.value) + dir * (hi - lo) * 0.45;
              if (v >= hi) { v = hi; dir = -1; }
              if (v <= lo) { v = lo; dir = 1; }
              input.value = v;
              input.dispatchEvent(new Event("input", { bubbles: true }));
            });
          }
          oscillate($("fxSld"), 10, 95);
          oscillate($("fxRingRange"), 10, 95);
          oscillate($("fgPblurRange"), 1, 13);
          oscillate($("fgNoiseRange"), 25, 75);

          /* --- Tự trôi nhẹ cho hiệu ứng theo chuột khi không có chuột --- */
          var mp = $("fgMpar");
          if (mp) {
            var mpL1 = mp.querySelector(".l1"), mpL2 = mp.querySelector(".l2"), mpL3 = mp.querySelector(".l3"), mpLast = 0;
            mp.addEventListener("pointermove", function () { mpLast = Date.now(); });
            mp.addEventListener("pointerleave", function () { mpLast = 0; });
            rafLoop(function () {
              if (Date.now() - mpLast < 1400) return;
              var t = Date.now() / 1000, dx = Math.sin(t * 0.6) * 0.32, dy = Math.cos(t * 0.8) * 0.26;
              if (mpL1) mpL1.style.transform = "translate(" + (dx * 16).toFixed(1) + "px," + (dy * 12).toFixed(1) + "px)";
              if (mpL2) mpL2.style.transform = "translate(" + (dx * -22).toFixed(1) + "px," + (dy * -14).toFixed(1) + "px)";
              if (mpL3) mpL3.style.transform = "translate(" + (dx * 7).toFixed(1) + "px,0)";
            }, mp);
          }
          var pxh = $("fxPxh");
          if (pxh) {
            var pxhLayers = pxh.querySelectorAll("[data-depth]"), pxhLast = 0;
            pxh.addEventListener("mousemove", function () { pxhLast = Date.now(); });
            pxh.addEventListener("mouseleave", function () { pxhLast = 0; });
            rafLoop(function () {
              if (Date.now() - pxhLast < 1400) return;
              var t = Date.now() / 1000, dx = Math.sin(t * 0.55) * 0.5, dy = Math.cos(t * 0.75) * 0.4;
              pxhLayers.forEach(function (l) {
                var d = parseFloat(l.getAttribute("data-depth")) || 8;
                l.style.transform = "translate(" + (dx * d).toFixed(1) + "px," + (dy * d).toFixed(1) + "px)";
              });
            }, pxh);
          }
          var magZone = $("fxMagZone"), magBtn = $("fxMagBtn");
          if (magZone && magBtn) {
            var magIn = false, magLast = 0;
            magZone.addEventListener("mouseenter", function () { magIn = true; });
            magZone.addEventListener("mousemove", function () { magLast = Date.now(); });
            magZone.addEventListener("mouseleave", function () { magIn = false; magLast = 0; });
            rafLoop(function () {
              if (magIn || Date.now() - magLast < 1400) return;
              var t = Date.now() / 1000;
              magBtn.style.transform = "translate(" + (Math.sin(t * 0.9) * 6).toFixed(1) + "px," + (Math.cos(t * 1.1) * 5).toFixed(1) + "px)";
            }, magBtn);
          }
          var tilt = $("fxTiltCard");
          if (tilt) {
            var tiltIn = false, tiltLast = 0;
            tilt.addEventListener("mouseenter", function () { tiltIn = true; });
            tilt.addEventListener("mousemove", function () { tiltLast = Date.now(); });
            tilt.addEventListener("mouseleave", function () { tiltIn = false; tiltLast = 0; });
            rafLoop(function () {
              if (tiltIn || Date.now() - tiltLast < 1200) return;
              var t = Date.now() / 1000;
              tilt.style.transform = "translateY(-3px) rotateX(" + (Math.sin(t * 0.7) * 4).toFixed(1) + "deg) rotateY(" + (Math.cos(t * 0.9) * 5).toFixed(1) + "deg)";
            }, tilt);
          }
          var glowZone = $("fxGlowZone"), glowEl = $("fxGlow");
          if (glowZone && glowEl) {
            var glowLast = 0;
            glowZone.addEventListener("mousemove", function () { glowLast = Date.now(); });
            glowZone.addEventListener("mouseleave", function () { glowLast = 0; });
            rafLoop(function () {
              if (Date.now() - glowLast < 1300) return;
              var t = Date.now() / 1000;
              var dx = Math.sin(t * 0.5) * 0.32 * glowZone.clientWidth;
              var dy = Math.cos(t * 0.7) * 0.3 * glowZone.clientHeight;
              glowEl.style.transform = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px) translate(-50%,-50%)";
            }, glowZone);
          }
          var zoomBox = document.querySelector(".fx-zoom");
          if (zoomBox) {
            var zoomImg = zoomBox.querySelector(".fx-zoom-img"), zoomIn = false, zoomOn = false;
            zoomBox.addEventListener("mouseenter", function () { zoomIn = true; });
            zoomBox.addEventListener("mouseleave", function () { zoomIn = false; });
            every(2800, function () {
              if (!zoomImg || !inView(zoomBox) || zoomIn || !idle(3000)) return;
              zoomOn = !zoomOn;
              zoomImg.style.transform = zoomOn ? "scale(1.12)" : "scale(1)";
            });
          }
          var ripBtn = $("fxRippleBtn");
          if (ripBtn) every(3000, function () {
            if (!inView(ripBtn) || !idle(3500)) return;
            var r = ripBtn.getBoundingClientRect(), d = Math.max(r.width, r.height);
            var s = document.createElement("span");
            s.className = "fx-ripple";
            s.style.width = s.style.height = d + "px";
            s.style.left = (r.width / 2 - d / 2) + "px";
            s.style.top = (r.height / 2 - d / 2) + "px";
            ripBtn.appendChild(s);
            setTimeout(function () { s.remove(); }, 700);
          });

          /* --- 3D Transform tự xoay khi không kéo thanh trượt; Draggable tự dạo khi không kéo --- */
          var c3d = $("fg3dCard");
          if (c3d) {
            var c3dTimer = null;
            var armSway = function () {
              clearTimeout(c3dTimer);
              c3dTimer = setTimeout(function () { c3d.classList.add("auto-sway"); }, 2600);
            };
            ["fg3dY", "fg3dX"].forEach(function (id) {
              var rg = $(id);
              if (rg) rg.addEventListener("input", function () { c3d.classList.remove("auto-sway"); armSway(); });
            });
            armSway();
          }
          var dragFrame = $("fgDrag"), dragChip = $("fgDragChip");
          if (dragFrame && dragChip) {
            var dragging = false, nudgeIdx = 0;
            var spots = [[0.06, 0.12], [0.55, 0.15], [0.5, 0.58], [0.08, 0.52]];
            dragChip.addEventListener("pointerdown", function () { dragging = true; dragChip.classList.remove("nudging"); });
            ["pointerup", "pointercancel"].forEach(function (ev) { dragChip.addEventListener(ev, function () { dragging = false; }); });
            every(3200, function () {
              if (!inView(dragFrame) || dragging || !idle(5000)) return;
              var fr = dragFrame.getBoundingClientRect();
              var sp = spots[nudgeIdx % spots.length];
              nudgeIdx++;
              dragChip.classList.add("nudging");
              dragChip.style.left = Math.max(0, (fr.width - dragChip.offsetWidth) * sp[0]) + "px";
              dragChip.style.top = Math.max(0, (fr.height - dragChip.offsetHeight) * sp[1]) + "px";
            });
          }
        })();

}
