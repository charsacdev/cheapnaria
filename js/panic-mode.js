// Platform-wide withdrawal freeze. Either an Agent or Admin can activate it
// from their Settings page; the User Dashboard's withdraw flow checks this
// flag and blocks new withdrawals while it's on. Static site — persisted to
// localStorage so it's visible across tabs/pages within the same browser.
(function (global) {
    const KEY = 'cn-panic-mode';
    const BY_KEY = 'cn-panic-mode-by';
    const AT_KEY = 'cn-panic-mode-at';

    function isActive() {
        return localStorage.getItem(KEY) === '1';
    }

    function setActive(active, actor) {
        localStorage.setItem(KEY, active ? '1' : '0');
        if (active) {
            localStorage.setItem(BY_KEY, actor || 'Unknown');
            localStorage.setItem(AT_KEY, new Date().toLocaleString());
        }
    }

    function activatedBy() {
        return localStorage.getItem(BY_KEY) || '';
    }

    function activatedAt() {
        return localStorage.getItem(AT_KEY) || '';
    }

    global.CN_PANIC = {
        isActive: isActive,
        setActive: setActive,
        activatedBy: activatedBy,
        activatedAt: activatedAt
    };
})(window);
