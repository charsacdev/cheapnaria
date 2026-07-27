// Per-user profile edits (state, age, gender, tier, etc.) made by Agent or
// Admin. The base mock user records are regenerated fresh on every page
// load, so edits are stored separately, keyed by user ID, and merged on top
// whenever a user record is displayed.
(function (global) {
    const KEY = 'cn-user-overrides';

    function getAll() {
        try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
    }

    function get(userId) {
        return getAll()[userId] || {};
    }

    function save(userId, fields) {
        const all = getAll();
        all[userId] = Object.assign({}, all[userId], fields);
        localStorage.setItem(KEY, JSON.stringify(all));
    }

    // Returns the user record with any saved overrides applied on top.
    function apply(user) {
        const o = get(user.id);
        return Object.keys(o).length ? Object.assign({}, user, o) : user;
    }

    global.CN_OVERRIDES = { get: get, save: save, apply: apply };
})(window);
