// Shared Vouchery reference data — used by Admin and Agent so buy/sell
// transaction logs never drift between portals.
(function (global) {
    const NAMES = [
        'John Doe', 'Sarah Adams', 'Michael Kelvin', 'Blessing O.', 'Tunde A.',
        'Amaka Chi', 'David Mensah', 'Grace Okoro', 'Ibrahim Musa', 'Chidinma Eze'
    ];

    const BUY_RATE = 1400;  // ₦ per $1 when a user buys Vouchery
    const SELL_RATE = 1370; // ₦ per $1 when a user sells Vouchery

    const REF_DATE = new Date(2024, 10, 5); // fixed reference date, matches mock-data.js

    function daysAgoToDate(daysAgo) {
        const d = new Date(REF_DATE);
        d.setDate(d.getDate() - daysAgo);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    function shortDate(daysAgo) {
        const d = daysAgoToDate(daysAgo);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    }

    const VOUCHERY_RECORDS = [];
    for (let i = 0; i < 14; i++) {
        const name = NAMES[i % NAMES.length];
        const type = (i % 2 === 0) ? 'buy' : 'sell';
        const rate = type === 'buy' ? BUY_RATE : SELL_RATE;
        const amountUsd = 20 + (i * 15);
        const daysAgo = i * 2;
        VOUCHERY_RECORDS.push({
            ref: 'VCH-' + (52000 + i * 17),
            user: { name: name, email: name.toLowerCase().replace(/[^a-z\s]/g, '').trim().split(/\s+/).join('.') + i + '@example.com' },
            type: type,
            amountUsd: amountUsd,
            rate: rate,
            amountNgn: amountUsd * rate,
            daysAgo: daysAgo,
            date: shortDate(daysAgo)
        });
    }

    global.CN_VOUCHERY = {
        BUY_RATE: BUY_RATE,
        SELL_RATE: SELL_RATE,
        VOUCHERY_RECORDS: VOUCHERY_RECORDS,
        daysAgoToDate: daysAgoToDate
    };
})(window);
