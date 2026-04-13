const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function setHint(message) {
  const hint = $("#hint");
  if (!hint) return;
  hint.textContent = message;
  if (message) {
    window.clearTimeout(setHint._t);
    setHint._t = window.setTimeout(() => {
      hint.textContent = "";
    }, 1800);
  }
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function normalizeForCopy(value) {
  return String(value).trim();
}

function initCopyButtons() {
  $$(".copy[data-copy-btn]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy-btn");
      if (!value) return;
      const ok = await copyText(normalizeForCopy(value));
      setHint(ok ? `복사 완료: ${value}` : "복사에 실패했어요. 브라우저 권한을 확인해 주세요.");
    });
  });

  $$(".value[data-copy]").forEach((el) => {
    el.addEventListener("click", async (e) => {
      const isOfficeLink = el.getAttribute("href") === "https://naver.me/xmxIspvi";
      if (isOfficeLink) {
        // 사무실 위치 링크는 기본 동작(새 탭 열기)을 유지하고, 복사는 버튼으로만 처리
        return;
      }
      if (e.metaKey || e.ctrlKey) return; // keep open-in-new-tab behavior
      e.preventDefault();
      const value = el.getAttribute("data-copy");
      if (!value) return;
      const ok = await copyText(normalizeForCopy(value));
      setHint(ok ? `복사 완료: ${value}` : "복사에 실패했어요.");
    });
  });

  const copyAll = $("#copyAll");
  copyAll?.addEventListener("click", async () => {
    const email = $('[data-copy="ooooo@ooooo.com"]')?.getAttribute("data-copy") ?? "ooooo@ooooo.com";
    const phone = $('[data-copy="010-0000-0000"]')?.getAttribute("data-copy") ?? "010-0000-0000";
    const office = $('[data-copy="https://naver.me/xmxIspvi"]')?.getAttribute("data-copy") ?? "https://naver.me/xmxIspvi";
    const text = `양진환 | 초보 개발자\nEmail: ${email}\nPhone: ${phone}\nOffice: ${office}`;
    const ok = await copyText(text);
    setHint(ok ? "연락처를 한 번에 복사했어요." : "복사에 실패했어요.");
  });
}

function initStatusToggle() {
  const badge = $("#badge");
  const toggle = $("#toggleStatus");
  if (!badge || !toggle) return;

  const apply = (status) => {
    if (status === "busy") {
      badge.textContent = "Busy";
      badge.setAttribute("data-status", "busy");
      setHint("현재 상태: Busy");
      return;
    }
    badge.textContent = "Available";
    badge.removeAttribute("data-status");
    setHint("현재 상태: Available");
  };

  let status = "available";
  apply(status);

  toggle.addEventListener("click", () => {
    status = status === "available" ? "busy" : "available";
    apply(status);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initCopyButtons();
  initStatusToggle();
});
