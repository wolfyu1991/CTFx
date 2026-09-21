/**
 * 替代 snackbarjs 的最小原生实现。
 * DOM 结构与原库一致: #snackbar-container 容器内 .snackbar > .snackbar-content,
 * 定位与状态样式由既有 CSS(vendored bmd / 自有样式)提供, 视觉不变。
 */

let container = null;

function ensureContainer() {
    if (!container || !container.isConnected) {
        container = document.createElement("div");
        container.id = "snackbar-container";
        document.body.appendChild(container);
    }
    return container;
}

export function snackbar({content, timeout = 3000, htmlAllowed = false, onClose}) {
    const snackbar = document.createElement("div");
    snackbar.className = "snackbar";
    snackbar.dataset.timeout = String(timeout);

    const body = document.createElement("span");
    body.className = "snackbar-content";
    if (htmlAllowed) {
        body.innerHTML = content;
    } else {
        body.textContent = content;
    }
    snackbar.appendChild(body);

    const close = () => {
        if (!snackbar.isConnected) return;
        snackbar.classList.remove("snackbar-opened");
        onClose?.();
        setTimeout(() => snackbar.remove(), 300);
        snackbar.removeEventListener("click", close);
    };

    // 点击即关闭(与原库 data-api 行为一致)
    snackbar.addEventListener("click", close);
    ensureContainer().appendChild(snackbar);
    requestAnimationFrame(() => snackbar.classList.add("snackbar-opened"));
    if (timeout > 0) setTimeout(close, timeout);

    return {
        el: snackbar,
        remove: () => snackbar.remove()
    };
}
