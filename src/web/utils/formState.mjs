/**
 * 替代已移除的 bootstrap-material-design。
 *
 * 本项目的样式表依赖 bmd 运行时附加的状态类:
 *   - 每个 .form-group 被附加 .bmd-form-group
 *   - 控件聚焦时该组加 .is-focused, 失焦移除
 *   - 组内任一控件有值时加 .is-filled
 * bmd 的按钮涟漪效果在本项目中从未被样式引用, 不予实现。
 */

const GROUP = ".form-group";

const markGroups = root => {
    root.querySelectorAll?.(`${GROUP}:not(.bmd-form-group)`)
        .forEach(el => el.classList.add("bmd-form-group"));
};

const updateFilled = control => {
    const group = control.closest?.(GROUP);
    if (!group) return;
    const controls = group.querySelectorAll("input, textarea, select");
    const filled = Array.from(controls)
        .some(c => c.type === "checkbox" ? c.checked : c.value !== "");
    group.classList.toggle("is-filled", filled);
};

export default function initFormState() {
    markGroups(document);
    document.addEventListener("focusin", e => {
        markGroups(document);
        e.target.closest?.(GROUP)?.classList.add("is-focused");
    });
    document.addEventListener("focusout", e => {
        e.target.closest?.(GROUP)?.classList.remove("is-focused");
    });
    const handler = e => updateFilled(e.target);
    document.addEventListener("input", handler);
    document.addEventListener("change", handler);
    // 初始状态(浏览器自动填充、会话恢复等场景)
    document.querySelectorAll("input, textarea, select").forEach(updateFilled);
}
