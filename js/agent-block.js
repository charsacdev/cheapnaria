// Client-side persistence for user blocks. Agents only get a "block" action
// exposed in their UI (no unblock button) — Admin's UI exposes both.
// An explicit unblock override is tracked separately so it can win over a
// user's base mock `status: 'blocked'` as well as an agent-added block.
(function (global) {
    const BLOCK_KEY = 'cn-blocked-users';
    const UNBLOCK_KEY = 'cn-unblocked-users';

    function getSet(key) {
        try {
            return new Set(JSON.parse(localStorage.getItem(key) || '[]'));
        } catch (e) {
            return new Set();
        }
    }

    function saveSet(key, set) {
        localStorage.setItem(key, JSON.stringify(Array.from(set)));
    }

    function isBlocked(user) {
        if (getSet(UNBLOCK_KEY).has(user.id)) return false;
        return user.status === 'blocked' || getSet(BLOCK_KEY).has(user.id);
    }

    function blockUser(id) {
        const blocked = getSet(BLOCK_KEY);
        blocked.add(id);
        saveSet(BLOCK_KEY, blocked);

        const unblocked = getSet(UNBLOCK_KEY);
        unblocked.delete(id);
        saveSet(UNBLOCK_KEY, unblocked);
    }

    function unblockUser(id) {
        const unblocked = getSet(UNBLOCK_KEY);
        unblocked.add(id);
        saveSet(UNBLOCK_KEY, unblocked);

        const blocked = getSet(BLOCK_KEY);
        blocked.delete(id);
        saveSet(BLOCK_KEY, blocked);
    }

    global.CN_BLOCK = {
        isBlocked: isBlocked,
        blockUser: blockUser,
        unblockUser: unblockUser
    };
})(window);
