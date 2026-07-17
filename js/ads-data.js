// Ads / Promotions storage for the Admin portal and the customer dashboard banner.
// Static site, no backend — persisted client-side in localStorage (same convention
// as cn-theme in theme.js and cn-sim-shift in shift.js).
(function (global) {
    const STORAGE_KEY = 'cn-ads';
    const SEED_VERSION_KEY = 'cn-ads-seed-version';
    // Bump this whenever seedAds() changes shape so browsers that already seeded
    // an older version (e.g. the original single "CheapNaria Promo" placeholder ad)
    // pick up the refreshed seed set instead of being stuck with stale demo data.
    const SEED_VERSION = '2';

    function placeholderImg(bgHex, label) {
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="240">' +
            '<rect width="600" height="240" fill="' + bgHex + '"/>' +
            '<text x="50%" y="50%" font-family="Arial" font-size="26" fill="white" text-anchor="middle" dominant-baseline="middle">' + label + '</text>' +
            '</svg>'
        );
    }

    const PLACEHOLDER_IMG = placeholderImg('#10b981', 'CheapNaria Promo');

    function todayIso() {
        return new Date().toISOString().slice(0, 10);
    }

    function addDaysIso(days) {
        const d = new Date();
        d.setDate(d.getDate() + days);
        return d.toISOString().slice(0, 10);
    }

    function seedAds() {
        return [
            {
                id: 'ad-seed-1',
                title: 'Fund your Deriv account in minutes',
                imageDataUrl: placeholderImg('#10b981', 'Deriv Funding'),
                linkUrl: 'deriv-deposit.html',
                startDate: addDaysIso(-3),
                endDate: addDaysIso(27),
                active: true
            },
            {
                id: 'ad-seed-2',
                title: 'Send money abroad in minutes',
                imageDataUrl: placeholderImg('#1d4ed8', 'Send Abroad'),
                linkUrl: 'send-abroad.html',
                startDate: addDaysIso(-10),
                endDate: addDaysIso(20),
                active: true
            },
            {
                id: 'ad-seed-3',
                title: 'Toyota Corolla 2020 — Now Available',
                imageDataUrl: placeholderImg('#c2410c', 'Toyota Corolla 2020'),
                linkUrl: '#',
                startDate: addDaysIso(-1),
                endDate: addDaysIso(14),
                active: true
            },
            {
                id: 'ad-seed-4',
                title: 'Black Friday: Zero fees on Pay Supplier',
                imageDataUrl: placeholderImg('#6d28d9', 'Zero Fees — Coming Soon'),
                linkUrl: 'pay-supplier.html',
                startDate: addDaysIso(10),
                endDate: addDaysIso(17),
                active: true
            },
            {
                id: 'ad-seed-5',
                title: 'KYC Verification Drive',
                imageDataUrl: placeholderImg('#64748b', 'KYC Verification Drive'),
                linkUrl: 'kyc.html',
                startDate: addDaysIso(-40),
                endDate: addDaysIso(-5),
                active: true
            }
        ];
    }

    function readAll() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const seedVersion = localStorage.getItem(SEED_VERSION_KEY);
            if (!raw || seedVersion !== SEED_VERSION) {
                const seeded = seedAds();
                localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
                localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
                return seeded;
            }
            return JSON.parse(raw);
        } catch (e) {
            return [];
        }
    }

    function writeAll(ads) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
    }

    function statusFor(ad) {
        if (!ad.active) return 'rejected'; // reuse badge-status red for "Inactive"
        const today = todayIso();
        if (today < ad.startDate) return 'pending'; // amber for "Scheduled"
        if (today > ad.endDate) return 'rejected';  // red for "Expired"
        return 'approved'; // green for "Active"
    }

    function statusLabel(ad) {
        if (!ad.active) return 'Inactive';
        const today = todayIso();
        if (today < ad.startDate) return 'Scheduled';
        if (today > ad.endDate) return 'Expired';
        return 'Active';
    }

    function isCurrentlyActive(ad) {
        return ad.active && statusLabel(ad) === 'Active';
    }

    function list() {
        return readAll();
    }

    function listActive() {
        return readAll().filter(isCurrentlyActive);
    }

    function save(ad) {
        const ads = readAll();
        if (ad.id) {
            const idx = ads.findIndex(function (a) { return a.id === ad.id; });
            if (idx > -1) { ads[idx] = ad; writeAll(ads); return ad; }
        }
        ad.id = 'ad-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        ads.unshift(ad);
        writeAll(ads);
        return ad;
    }

    function remove(id) {
        writeAll(readAll().filter(function (a) { return a.id !== id; }));
    }

    function toggleActive(id) {
        const ads = readAll();
        const ad = ads.find(function (a) { return a.id === id; });
        if (ad) { ad.active = !ad.active; writeAll(ads); }
        return ad;
    }

    global.CN_ADS = {
        list: list,
        listActive: listActive,
        save: save,
        remove: remove,
        toggleActive: toggleActive,
        statusFor: statusFor,
        statusLabel: statusLabel,
        PLACEHOLDER_IMG: PLACEHOLDER_IMG
    };
})(window);
