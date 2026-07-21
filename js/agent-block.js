// Client-side persistence for agent-initiated user blocks.
// Agents can block a user but never unblock (that's Admin-only) — enforced
// simply by never exposing an unblock action, not by any check in here.
(function (global) {
    const KEY = 'cn-blocked-users';

    function getBlockedSet() {
        try {
            return new Set(JSON.parse(localStorage.getItem(KEY) || '[]'));
        } catch (e) {
            return new Set();
        }
    }

    function isBlocked(user) {
        return user.status === 'blocked' || getBlockedSet().has(user.id);
    }

    function blockUser(id) {
        const set = getBlockedSet();
        set.add(id);
        localStorage.setItem(KEY, JSON.stringify(Array.from(set)));
    }

    global.CN_BLOCK = {
        isBlocked: isBlocked,
        blockUser: blockUser
    };
})(window);
