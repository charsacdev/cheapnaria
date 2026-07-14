// Shared mock datasets for the Admin and Agent portals.
// Deterministic (no Math.random) so both portals always render the same "data".
(function (global) {
    const NAMES = [
        'John Doe', 'Sarah Adams', 'Michael Kelvin', 'Blessing O.', 'Tunde A.',
        'Amaka Chi', 'David Mensah', 'Grace Okoro', 'Ibrahim Musa', 'Chidinma Eze',
        'Peter Obi-Anya', 'Fatima Bello', 'Emeka Nwosu', 'Ruth Adebayo', 'Samuel Okon',
        'Ngozi Umeh', 'Kelvin Iheanacho', 'Aisha Yusuf', 'Victor Uche', 'Patience Effiong',
        'Daniel Osei', 'Comfort Etim', 'Yusuf Aliyu', 'Joy Nnamdi', 'Bright Amadi'
    ];
    const EMAIL_DOMAINS = ['gmail.com', 'yahoo.com', 'example.com', 'outlook.com'];
    const COUNTRIES = ['Nigeria', 'Ghana', 'Kenya', 'Tanzania', 'Uganda'];
    const BANKS = ['Access Bank', 'GTBank', 'Zenith Bank', 'UBA', 'Wema Bank', 'Kuda Microfinance Bank', 'First Bank'];
    const CRYPTO_ASSETS = ['USDT (TRC20)', 'USDT (BEP20)', 'USDC', 'BTC', 'ETH'];
    const NIN_TYPES = ['National ID (NIN)', 'International Passport', "Voter's Card", "Driver's License"];
    const STATUSES = ['pending', 'approved', 'rejected'];

    function slugEmail(name, i) {
        const base = name.toLowerCase().replace(/[^a-z\s]/g, '').trim().split(/\s+/).join('.');
        return base + i + '@' + EMAIL_DOMAINS[i % EMAIL_DOMAINS.length];
    }

    function dateBack(daysAgo, hh, mm) {
        const d = new Date(2024, 10, 5); // fixed reference date: Nov 5, 2024
        d.setDate(d.getDate() - daysAgo);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const time = (hh % 12 === 0 ? 12 : hh % 12) + ':' + String(mm).padStart(2, '0') + (hh < 12 ? ' AM' : ' PM');
        return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' - ' + time;
    }

    function shortDate(daysAgo) {
        const d = new Date(2024, 10, 5);
        d.setDate(d.getDate() - daysAgo);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    }

    function statusForIndex(i, pendingEvery, rejectEvery) {
        if (i % pendingEvery === 0) return 'pending';
        if (i % rejectEvery === 0) return 'rejected';
        return 'approved';
    }

    // --- USERS (25) ---
    const USERS = NAMES.map(function (name, i) {
        return {
            id: 'CN-' + (10000 + i),
            name: name,
            email: slugEmail(name, i),
            country: COUNTRIES[i % COUNTRIES.length],
            kyc: (i % 4 === 3) ? 'unverified' : 'verified',
            status: (i % 9 === 8) ? 'blocked' : 'active',
            joined: shortDate(200 + i * 7),
            avatarBg: ['10b981', '6366f1', 'f59e0b', 'ef4444', '0dcaf0'][i % 5]
        };
    });

    function userByIndex(i) {
        return USERS[i % USERS.length];
    }

    // --- KYC (50) ---
    const KYC_RECORDS = [];
    for (let i = 0; i < 50; i++) {
        const u = userByIndex(i);
        KYC_RECORDS.push({
            ref: '#' + (480000 + i * 13),
            name: u.name,
            country: u.country,
            state: ['Lagos', 'Abuja', 'Accra', 'Nairobi', 'Dar es Salaam'][i % 5],
            method: NIN_TYPES[i % NIN_TYPES.length],
            submitted: shortDate(i),
            status: statusForIndex(i, 4, 17)
        });
    }

    // --- DEPOSITS (25, wallet-level crypto/bank) ---
    const DEPOSIT_RECORDS = [];
    for (let i = 0; i < 25; i++) {
        const u = userByIndex(i);
        const isCrypto = i % 2 === 0;
        const amountNgn = 25000 + i * 15750;
        DEPOSIT_RECORDS.push({
            ref: 'DEP-' + (88000 + i * 7),
            user: u,
            method: isCrypto ? 'Crypto (' + CRYPTO_ASSETS[i % CRYPTO_ASSETS.length] + ')' : 'Bank Transfer',
            isCrypto: isCrypto,
            asset: isCrypto ? CRYPTO_ASSETS[i % CRYPTO_ASSETS.length] : null,
            txHash: isCrypto ? ('0x81da30' + (129000 + i) + 'f723ea101dc892...' + (3000 + i) + 'f99') : null,
            bankRef: !isCrypto ? ('PG-BANK-' + (7700 + i)) : null,
            amountNgn: amountNgn,
            usdEquiv: (amountNgn / 1535).toFixed(2),
            date: dateBack(i, 8 + (i % 12), (i * 7) % 60),
            daysAgo: i,
            status: statusForIndex(i, 7, 13)
        });
    }

    // --- WITHDRAWALS (25, wallet-level crypto/bank) ---
    const WITHDRAWAL_RECORDS = [];
    for (let i = 0; i < 25; i++) {
        const u = userByIndex(i + 5);
        const isCrypto = i % 2 === 1;
        const amountNgn = 18000 + i * 21400;
        WITHDRAWAL_RECORDS.push({
            ref: 'WTD-' + (77000 + i * 9),
            user: u,
            method: isCrypto ? 'Crypto (' + CRYPTO_ASSETS[i % CRYPTO_ASSETS.length] + ')' : 'Bank Transfer',
            isCrypto: isCrypto,
            asset: isCrypto ? CRYPTO_ASSETS[i % CRYPTO_ASSETS.length] : null,
            walletAddress: isCrypto ? ('TYo8Xq2F3v8BzP8k9A1z' + (1000 + i) + 'zLzL') : null,
            bankName: !isCrypto ? BANKS[i % BANKS.length] : null,
            accountNumber: !isCrypto ? ('0' + (120000000 + i * 37)) : null,
            amountNgn: amountNgn,
            usdEquiv: (amountNgn / 1490).toFixed(2),
            date: dateBack(i + 1, 9 + (i % 10), (i * 11) % 60),
            daysAgo: i + 1,
            status: statusForIndex(i, 8, 14)
        });
    }

    // --- DERIV FUNDING / DEPOSIT (25, CR-based) ---
    const DERIV_FUNDING_RECORDS = [];
    for (let i = 0; i < 25; i++) {
        const u = userByIndex(i + 10);
        const amountUsd = 50 + i * 37;
        DERIV_FUNDING_RECORDS.push({
            ref: 'DRV-' + (90200 + i * 11),
            user: u,
            cr: 'CR' + (1230000 + i * 17),
            method: (i % 2 === 0) ? 'Bank Transfer' : 'Crypto (' + CRYPTO_ASSETS[i % CRYPTO_ASSETS.length] + ')',
            payoutAccount: (i % 2 === 0)
                ? (BANKS[i % BANKS.length] + ' · 0' + (150000000 + i * 41))
                : (CRYPTO_ASSETS[i % CRYPTO_ASSETS.length] + ' · TQx' + (400000 + i) + 'zLzLzLzL'),
            amountUsd: amountUsd,
            amountNgn: (amountUsd * 1535).toLocaleString(),
            date: dateBack(i, 7 + (i % 13), (i * 9) % 60),
            daysAgo: i,
            status: statusForIndex(i, 9, 15)
        });
    }

    // --- DERIV WITHDRAWAL (25, CR-based) ---
    const DERIV_WITHDRAWAL_RECORDS = [];
    for (let i = 0; i < 25; i++) {
        const u = userByIndex(i + 15);
        const amountUsd = 40 + i * 29;
        DERIV_WITHDRAWAL_RECORDS.push({
            ref: 'DRW-' + (61100 + i * 13),
            user: u,
            cr: 'CR' + (1240000 + i * 19),
            method: (i % 2 === 1) ? 'Bank Payout' : 'Crypto Payout (' + CRYPTO_ASSETS[i % CRYPTO_ASSETS.length] + ')',
            payoutAccount: (i % 2 === 1)
                ? (BANKS[(i + 2) % BANKS.length] + ' · 0' + (160000000 + i * 43))
                : (CRYPTO_ASSETS[i % CRYPTO_ASSETS.length] + ' · TQx' + (500000 + i) + 'zLzLzLzL'),
            amountUsd: amountUsd,
            amountNgn: (amountUsd * 1490).toLocaleString(),
            date: dateBack(i + 1, 10 + (i % 11), (i * 13) % 60),
            daysAgo: i + 1,
            status: statusForIndex(i, 10, 16)
        });
    }

    function countBy(records, status) {
        return records.filter(function (r) { return r.status === status; }).length;
    }

    // --- REPORT DATASETS (wide historical spread for the Admin Reports page) ---
    // Reference "today" across the whole app is Nov 5, 2024 (see dateBack/shortDate above).
    function buildReportSeries(prefix, count, baseAmount, amountStep, spanDays) {
        const records = [];
        for (let i = 0; i < count; i++) {
            const daysAgo = Math.floor((i * spanDays) / count);
            const amountNgn = baseAmount + ((i * amountStep) % (baseAmount * 3));
            records.push({
                ref: prefix + '-' + (10000 + i * 7),
                amountNgn: amountNgn,
                daysAgo: daysAgo,
                date: shortDate(daysAgo),
                status: statusForIndex(i, 11, 23)
            });
        }
        return records;
    }

    const REPORT_CRYPTO = buildReportSeries('RPC', 60, 30000, 15500, 180);
    const REPORT_DERIV = buildReportSeries('RPD', 55, 45000, 21200, 180);
    const REPORT_ABROAD = buildReportSeries('RPA', 50, 22000, 9800, 180);
    const REPORT_CHINA = buildReportSeries('RPS', 40, 180000, 65000, 180);

    const REPORT_REF_DATE = new Date(2024, 10, 5); // fixed "today" — matches dateBack()/shortDate()

    function daysAgoToDate(daysAgo) {
        const d = new Date(REPORT_REF_DATE);
        d.setDate(d.getDate() - daysAgo);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    const REPORT_TYPES = {
        crypto: { label: 'Crypto', records: REPORT_CRYPTO, feeKey: 'cn-fee-crypto', defaultFeePct: 1.5 },
        deriv: { label: 'Deriv', records: REPORT_DERIV, feeKey: 'cn-fee-deriv', defaultFeePct: 1.2 },
        abroad: { label: 'Send Abroad', records: REPORT_ABROAD, feeKey: null, defaultFeePct: 2.0 },
        china: { label: 'Pay Supplier (China)', records: REPORT_CHINA, feeKey: null, defaultFeePct: 1.8 }
    };

    function feePctFor(typeKey) {
        const cfg = REPORT_TYPES[typeKey];
        if (cfg.feeKey) {
            const stored = localStorage.getItem(cfg.feeKey);
            const n = parseFloat(stored);
            if (!isNaN(n)) return n;
        }
        return cfg.defaultFeePct;
    }

    // Filters REPORT_* records between two Date objects (inclusive) for the given type
    // (or 'all'), returning per-type volume/profit/count plus grand totals.
    function reportSummary(typeKey, fromDate, toDate) {
        const keys = (typeKey === 'all') ? Object.keys(REPORT_TYPES) : [typeKey];
        const from = new Date(fromDate); from.setHours(0, 0, 0, 0);
        const to = new Date(toDate); to.setHours(23, 59, 59, 999);

        const byType = {};
        let totalVolume = 0, totalProfit = 0, totalCount = 0;

        keys.forEach(function (k) {
            const cfg = REPORT_TYPES[k];
            const feePct = feePctFor(k);
            const recs = cfg.records.filter(function (r) {
                const d = daysAgoToDate(r.daysAgo);
                return d >= from && d <= to && r.status !== 'rejected';
            });
            const volume = recs.reduce(function (sum, r) { return sum + r.amountNgn; }, 0);
            const profit = Math.round(volume * (feePct / 100));

            byType[k] = { label: cfg.label, volume: volume, profit: profit, count: recs.length, feePct: feePct };
            totalVolume += volume;
            totalProfit += profit;
            totalCount += recs.length;
        });

        return { byType: byType, totalVolume: totalVolume, totalProfit: totalProfit, totalCount: totalCount };
    }

    // Per-user aggregated activity (for Users -> View Profile pages)
    function statsForUser(userId) {
        function sumCount(arr) {
            return arr.filter(function (r) { return r.user && r.user.id === userId; }).length;
        }
        return {
            deposits: sumCount(DEPOSIT_RECORDS),
            withdrawals: sumCount(WITHDRAWAL_RECORDS),
            derivFunding: sumCount(DERIV_FUNDING_RECORDS),
            derivWithdrawal: sumCount(DERIV_WITHDRAWAL_RECORDS)
        };
    }

    // Unified "last N transactions" feed across all 4 categories, most recent first
    function recentTransactions(n) {
        const tagged = []
            .concat(DEPOSIT_RECORDS.map(function (r) { return Object.assign({ category: 'Deposit', icon: 'fa-arrow-down', iconClass: 'tx-in', sign: '+', currency: '₦', amount: r.amountNgn }, r); }))
            .concat(WITHDRAWAL_RECORDS.map(function (r) { return Object.assign({ category: 'Withdrawal', icon: 'fa-arrow-up', iconClass: 'tx-out', sign: '-', currency: '₦', amount: r.amountNgn }, r); }))
            .concat(DERIV_FUNDING_RECORDS.map(function (r) { return Object.assign({ category: 'Deriv Funding', icon: 'fa-arrow-down', iconClass: 'tx-deriv', sign: '+', currency: '$', amount: r.amountUsd }, r); }))
            .concat(DERIV_WITHDRAWAL_RECORDS.map(function (r) { return Object.assign({ category: 'Deriv Withdrawal', icon: 'fa-arrow-up', iconClass: 'tx-deriv', sign: '-', currency: '$', amount: r.amountUsd }, r); }));

        tagged.sort(function (a, b) { return a.daysAgo - b.daysAgo; });
        return tagged.slice(0, n || 10);
    }

    global.CN_DATA = {
        USERS: USERS,
        KYC_RECORDS: KYC_RECORDS,
        DEPOSIT_RECORDS: DEPOSIT_RECORDS,
        WITHDRAWAL_RECORDS: WITHDRAWAL_RECORDS,
        DERIV_FUNDING_RECORDS: DERIV_FUNDING_RECORDS,
        DERIV_WITHDRAWAL_RECORDS: DERIV_WITHDRAWAL_RECORDS,
        countBy: countBy,
        statsForUser: statsForUser,
        userByIndex: userByIndex,
        recentTransactions: recentTransactions,
        REPORT_TYPES: REPORT_TYPES,
        REPORT_REF_DATE: REPORT_REF_DATE,
        reportSummary: reportSummary
    };
})(window);
