/* 语言下拉菜单容器 */
#langDropdownContainer {
    position: relative;
}

/* 下拉菜单面板 */
.lang-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: var(--bg-card);
    border: 1px solid var(--border-light);
    border-radius: 12px;
    box-shadow: var(--shadow-md);
    padding: 8px 0;
    min-width: 120px;
    z-index: 10002;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
    pointer-events: none;
}

.lang-dropdown.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: auto;
}

.lang-dropdown a {
    display: block;
    padding: 8px 16px;
    color: var(--text-title);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    white-space: nowrap;
}

.lang-dropdown a:hover {
    background: var(--bg-page);
    color: var(--primary-600);
}

/* 当前语言高亮 */
.lang-dropdown a.current-lang {
    font-weight: bold;
    color: var(--primary-600);
}