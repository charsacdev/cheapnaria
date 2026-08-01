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

    const NG_STATES = ['Lagos', 'Abuja (FCT)', 'Rivers', 'Kano', 'Oyo', 'Enugu', 'Kaduna'];
    const GENDERS = ['Male', 'Female'];

    // --- USERS (25) ---
    // First two users are seeded as having registered "today" (relative to the
    // fixed REPORT_REF_DATE below) so the admin dashboard's "New Users Today"
    // card has something non-zero to show in the demo.
    const USERS = NAMES.map(function (name, i) {
        const joinedDaysAgo = i < 2 ? 0 : 200 + i * 7;
        return {
            id: 'CN-' + (10000 + i),
            name: name,
            email: slugEmail(name, i),
            country: COUNTRIES[i % COUNTRIES.length],
            state: NG_STATES[i % NG_STATES.length],
            age: 21 + (i * 3) % 40,
            gender: GENDERS[i % 2],
            tier: i % 4,
            kyc: (i % 4 === 3) ? 'unverified' : 'verified',
            status: (i % 9 === 8) ? 'blocked' : 'active',
            joined: shortDate(joinedDaysAgo),
            joinedDaysAgo: joinedDaysAgo,
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

    // --- CROSS BORDER (25, Send Abroad wallet-level activity for dashboard/recent-tx feeds) ---
    const CROSS_BORDER_RECORDS = [];
    for (let i = 0; i < 25; i++) {
        const u = userByIndex(i + 20);
        const amountNgn = 15000 + i * 9200;
        CROSS_BORDER_RECORDS.push({
            ref: 'ABR-' + (52000 + i * 8),
            user: u,
            destCountry: COUNTRIES[(i + 2) % COUNTRIES.length],
            amountNgn: amountNgn,
            date: dateBack(i, 8 + (i % 10), (i * 5) % 60),
            daysAgo: i,
            status: statusForIndex(i, 6, 19)
        });
    }

    function countBy(records, status) {
        return records.filter(function (r) { return r.status === status; }).length;
    }

    // First N pending KYC applicants, most-recent-first (KYC_RECORDS is already ordered that way)
    function pendingKyc(n) {
        return KYC_RECORDS.filter(function (r) { return r.status === 'pending'; }).slice(0, n || 5);
    }

    // --- SUPPORT CONVERSATIONS (8, for the Agent Dashboard "Customer Support" panel) ---
    const SUPPORT_MESSAGES = [
        { text: "Hello, I'm having issues funding my Deriv account.", unread: 2, status: 'inbox' },
        { text: 'Please I need help with my withdrawal.', unread: 1, status: 'inbox' },
        { text: 'What is the current rate for USD to NGN?', unread: 0, status: 'inbox' },
        { text: 'My KYC is still pending, kindly check.', unread: 0, status: 'inbox' },
        { text: 'Can I send money to Kenya via MoMo?', unread: 0, status: 'unassigned' },
        { text: 'Payment not received yet.', unread: 0, status: 'inbox' },
        { text: 'How long does Deriv funding take?', unread: 0, status: 'resolved' },
        { text: 'I was charged twice for one transaction.', unread: 0, status: 'unassigned' }
    ];
    const SUPPORT_TIMES = ['10:42 AM', '10:30 AM', '10:15 AM', '09:55 AM', '09:40 AM', '09:25 AM', '09:10 AM', '08:50 AM'];

    // Agents who can be assigned a support conversation (for the Admin "Support" oversight page).
    const AGENT_NAMES = ['James Bond', 'Amara Obi', 'Tunde Fashola', 'Grace Adeyemi'];

    // Deterministic follow-up replies, alternating agent/customer, appended after the
    // opening customer message — gives the Admin Support page a real-looking thread
    // instead of a single line.
    const SUPPORT_FOLLOWUPS = [
        [{ from: 'agent', text: "Hi, thanks for reaching out — let me pull up your account now." }, { from: 'customer', text: 'Sure, thank you for the quick response.' }],
        [{ from: 'agent', text: "I've escalated this to our payments team, you'll hear back within the hour." }],
        [{ from: 'agent', text: 'The current rate is shown live on your dashboard under Rates — it updates every few minutes.' }, { from: 'customer', text: 'Got it, thanks!' }],
        [{ from: 'agent', text: 'Checking now — can you confirm the last 4 digits of the ID you uploaded?' }],
        [],
        [{ from: 'agent', text: 'Can you share the transaction reference so I can trace it?' }, { from: 'customer', text: 'Sure, one moment.' }],
        [{ from: 'agent', text: 'Usually within 5-10 minutes once your transfer is confirmed on our end.' }, { from: 'customer', text: 'Perfect, thank you.' }],
        [{ from: 'agent', text: "You've been refunded the duplicate charge — apologies for the inconvenience." }]
    ];

    const SUPPORT_CONVERSATIONS = SUPPORT_MESSAGES.map(function (m, i) {
        const u = userByIndex(i);
        const thread = [{ from: 'customer', text: m.text }].concat(SUPPORT_FOLLOWUPS[i] || []);
        return {
            id: i + 1,
            user: u,
            agent: AGENT_NAMES[i % AGENT_NAMES.length],
            message: m.text,
            time: SUPPORT_TIMES[i],
            unread: m.unread,
            status: m.status,
            thread: thread
        };
    });

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
    const REPORT_UTILITY = buildReportSeries('RPU', 45, 8000, 4200, 180);
    const REPORT_VOUCHERY = buildReportSeries('RPV', 45, 15000, 6500, 180);

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
        china: { label: 'Pay Supplier (China)', records: REPORT_CHINA, feeKey: null, defaultFeePct: 1.8 },
        utility: { label: 'Utilities & Betting', records: REPORT_UTILITY, feeKey: null, defaultFeePct: 1.0 },
        vouchery: { label: 'Vouchery', records: REPORT_VOUCHERY, feeKey: null, defaultFeePct: 2.1 }
    };

    // Vouchery's margin is the spread between its admin-configured buy/sell rate,
    // rather than a flat fee percentage like the other types.
    function voucheryMarginPct() {
        const buy = parseFloat(localStorage.getItem('cn-vouchery-buy-rate'));
        const sell = parseFloat(localStorage.getItem('cn-vouchery-sell-rate'));
        const buyRate = !isNaN(buy) ? buy : 1400;
        const sellRate = !isNaN(sell) ? sell : 1370;
        return buyRate > 0 ? ((buyRate - sellRate) / buyRate) * 100 : 0;
    }

    function feePctFor(typeKey) {
        if (typeKey === 'vouchery') return voucheryMarginPct();
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

    // Unified "last N transactions" feed across all 5 categories, most recent first
    function recentTransactions(n) {
        const tagged = []
            .concat(DEPOSIT_RECORDS.map(function (r) { return Object.assign({ category: 'Deposit', icon: 'fa-arrow-down', iconClass: 'tx-in', sign: '+', currency: '₦', amount: r.amountNgn }, r); }))
            .concat(WITHDRAWAL_RECORDS.map(function (r) { return Object.assign({ category: 'Withdrawal', icon: 'fa-arrow-up', iconClass: 'tx-out', sign: '-', currency: '₦', amount: r.amountNgn }, r); }))
            .concat(DERIV_FUNDING_RECORDS.map(function (r) { return Object.assign({ category: 'Deriv Funding', icon: 'fa-arrow-down', iconClass: 'tx-deriv', sign: '+', currency: '$', amount: r.amountUsd }, r); }))
            .concat(DERIV_WITHDRAWAL_RECORDS.map(function (r) { return Object.assign({ category: 'Deriv Withdrawal', icon: 'fa-arrow-up', iconClass: 'tx-deriv', sign: '-', currency: '$', amount: r.amountUsd }, r); }))
            .concat(CROSS_BORDER_RECORDS.map(function (r) { return Object.assign({ category: 'Cross Border', icon: 'fa-earth-africa', iconClass: 'tx-border', sign: '+', currency: '₦', amount: r.amountNgn }, r); }));

        tagged.sort(function (a, b) { return a.daysAgo - b.daysAgo; });
        return tagged.slice(0, n || 10);
    }

    // --- DASHBOARD ANALYTICS HELPERS (admin/dashboard.html) ---
    // All "this week" aggregates use daysAgo 0-6 against the same fixed reference date
    // as dateBack()/shortDate() (Nov 5, 2024), so figures stay stable across reloads.
    const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Records are generated with amount increasing alongside daysAgo (see DEPOSIT_RECORDS
    // etc above), so bucketing strictly by daysAgo===N would make "today" always the
    // smallest and "6 days ago" always the largest — a guaranteed decline every reload.
    // Grouping by (daysAgo % 7) instead spreads that gradient evenly across weekdays.
    function dailyActivitySeries() {
        const days = [6, 5, 4, 3, 2, 1, 0];
        const labels = days.map(function (daysAgo) { return WEEKDAY_LABELS[daysAgoToDate(daysAgo).getDay()]; });
        function bucketSum(records, amountFn) {
            return days.map(function (daysAgo) {
                return records.filter(function (r) { return r.daysAgo % 7 === daysAgo; })
                    .reduce(function (sum, r) { return sum + amountFn(r); }, 0);
            });
        }
        return {
            labels: labels,
            deposits: bucketSum(DEPOSIT_RECORDS, function (r) { return r.amountNgn; }),
            withdrawals: bucketSum(WITHDRAWAL_RECORDS, function (r) { return r.amountNgn; }),
            derivFunding: bucketSum(DERIV_FUNDING_RECORDS, function (r) { return r.amountUsd * 1535; }),
            crossBorder: bucketSum(CROSS_BORDER_RECORDS, function (r) { return r.amountNgn; })
        };
    }

    function typeBreakdown() {
        const days = function (arr) { return arr.filter(function (r) { return r.daysAgo <= 6; }).length; };
        const counts = {
            'Deriv Funding': days(DERIV_FUNDING_RECORDS),
            'Deposits': days(DEPOSIT_RECORDS),
            'Withdrawals': days(WITHDRAWAL_RECORDS),
            'Cross Border': days(CROSS_BORDER_RECORDS)
        };
        const total = Object.keys(counts).reduce(function (s, k) { return s + counts[k]; }, 0);
        const items = Object.keys(counts).map(function (label) {
            const count = counts[label];
            return { label: label, count: count, pct: total ? Math.round((count / total) * 1000) / 10 : 0 };
        });
        return { total: total, items: items };
    }

    // Bank Transfer / Crypto / Card / Other split. Card & Other are deterministic
    // synthetic slices (index-based, no Math.random) since no card-payment dataset
    // exists yet — mirrors how isCrypto already splits DEPOSIT/WITHDRAWAL records.
    function channelBreakdown() {
        const all = DEPOSIT_RECORDS.concat(WITHDRAWAL_RECORDS);
        let bank = 0, crypto = 0, card = 0, other = 0;
        all.forEach(function (r, i) {
            if (i % 9 === 0) card++;
            else if (i % 13 === 0) other++;
            else if (r.isCrypto) crypto++;
            else bank++;
        });
        const total = bank + crypto + card + other;
        function pct(n) { return total ? Math.round((n / total) * 1000) / 10 : 0; }
        return {
            total: total,
            items: [
                { label: 'Bank Transfer', count: bank, pct: pct(bank) },
                { label: 'Crypto (USDT)', count: crypto, pct: pct(crypto) },
                { label: 'Card Payment', count: card, pct: pct(card) },
                { label: 'Other', count: other, pct: pct(other) }
            ]
        };
    }

    function topCountriesByVolume() {
        const totals = {};
        COUNTRIES.forEach(function (c) { totals[c] = 0; });
        DEPOSIT_RECORDS.concat(WITHDRAWAL_RECORDS).forEach(function (r) { totals[r.user.country] += r.amountNgn; });
        CROSS_BORDER_RECORDS.forEach(function (r) { totals[r.user.country] += r.amountNgn; });
        const grand = Object.keys(totals).reduce(function (s, c) { return s + totals[c]; }, 0);
        return Object.keys(totals)
            .map(function (c) { return { country: c, volume: totals[c], pct: grand ? Math.round((totals[c] / grand) * 1000) / 10 : 0 }; })
            .sort(function (a, b) { return b.volume - a.volume; });
    }

    // Long-range (180-day) volume per REPORT_TYPES category, for apples-to-apples
    // comparison — mixing these with the short-range wallet-level datasets above
    // would skew the totals since those only span ~25 days.
    function topServicesByVolume() {
        const from = daysAgoToDate(180);
        const to = daysAgoToDate(0);
        const summary = reportSummary('all', from, to);
        return Object.keys(summary.byType)
            .map(function (k) { return { key: k, label: summary.byType[k].label, volume: summary.byType[k].volume }; })
            .sort(function (a, b) { return b.volume - a.volume; });
    }

    function successRate(daysBack) {
        const cutoff = daysBack == null ? 6 : daysBack;
        const all = DEPOSIT_RECORDS.concat(WITHDRAWAL_RECORDS, DERIV_FUNDING_RECORDS, DERIV_WITHDRAWAL_RECORDS, CROSS_BORDER_RECORDS)
            .filter(function (r) { return r.daysAgo <= cutoff; });
        const approved = all.filter(function (r) { return r.status === 'approved'; }).length;
        return all.length ? Math.round((approved / all.length) * 1000) / 10 : 0;
    }

    // Day-over-day (today vs yesterday) deltas for the dashboard stat cards,
    // derived from dailyActivitySeries() rather than hardcoded.
    function dashboardStats() {
        const series = dailyActivitySeries();
        const todayIdx = series.labels.length - 1;
        const yestIdx = todayIdx - 1;
        function pctChange(today, yest) {
            if (!yest) return today > 0 ? 100 : 0;
            return Math.round(((today - yest) / yest) * 1000) / 10;
        }
        const dailyTotal = function (idx) {
            return series.deposits[idx] + series.withdrawals[idx] + series.derivFunding[idx] + series.crossBorder[idx];
        };
        const todayVolume = dailyTotal(todayIdx), yestVolume = dailyTotal(yestIdx);

        // Same modulo grouping as dailyActivitySeries (drawn from the full record set,
        // not just the last-7-days window), so "today" vs "yesterday" counts are
        // comparable rather than a single raw (and possibly empty) day.
        const allRecs = DEPOSIT_RECORDS.concat(WITHDRAWAL_RECORDS, DERIV_FUNDING_RECORDS, DERIV_WITHDRAWAL_RECORDS, CROSS_BORDER_RECORDS);
        const todayRecs = allRecs.filter(function (r) { return r.daysAgo % 7 === 0; });
        const yestRecs = allRecs.filter(function (r) { return r.daysAgo % 7 === 1; });
        const blendedFeePct = 1.5;
        const todayProfit = Math.round(todayVolume * (blendedFeePct / 100));
        const yestProfit = Math.round(yestVolume * (blendedFeePct / 100));

        const activeUsers = USERS.filter(function (u) { return u.status === 'active'; }).length;
        const verifiedPct = Math.round((USERS.filter(function (u) { return u.kyc === 'verified'; }).length / USERS.length) * 1000) / 10;
        const newUsersToday = USERS.filter(function (u) { return u.joinedDaysAgo === 0; }).length;

        // Same combined-pool computation the From/To date-range picker uses (for
        // fromDate = 6 days ago, toDate = today), so the default "this week" cards
        // and re-requesting that identical range never show two different numbers.
        const weekAgo = new Date(REPORT_REF_DATE); weekAgo.setDate(weekAgo.getDate() - 6);
        const rangeStats = statsForDateRange(weekAgo, REPORT_REF_DATE);

        return {
            totalVolume: rangeStats.totalVolume,
            totalProfit: rangeStats.totalProfit,
            totalTransactions: rangeStats.totalTransactions,
            successRatePct: rangeStats.successRatePct,
            activeUsers: activeUsers,
            verifiedPct: verifiedPct,
            newUsersToday: newUsersToday,
            liquidityAvailable: rangeStats.liquidityAvailable,
            volumeDeltaPct: pctChange(todayVolume, yestVolume),
            profitDeltaPct: pctChange(todayProfit, yestProfit),
            transactionsDeltaPct: pctChange(todayRecs.length, yestRecs.length),
            // This-week vs prior-week windowed comparison — a literal single-day
            // sample (today vs yesterday) is too small to be a meaningful rate.
            successRateDeltaPct: Math.round((successRateForRange(allRecs, 0, 6) - successRateForRange(allRecs, 7, 13)) * 10) / 10
        };
    }

    function successRateForRange(records, fromDaysAgo, toDaysAgo) {
        const recs = records.filter(function (r) { return r.daysAgo >= fromDaysAgo && r.daysAgo <= toDaysAgo; });
        const approved = recs.filter(function (r) { return r.status === 'approved'; }).length;
        return recs.length ? Math.round((approved / recs.length) * 1000) / 10 : 0;
    }

    // Every transaction-bearing dataset in one NGN-normalized pool, each tagged with
    // the fee % of whichever REPORT_TYPES category it's closest to. This is the single
    // source of truth behind both dashboardStats() (fixed "this week" cards) and
    // statsForDateRange() (the admin-picked From/To range) — using two different
    // record pools for the same headline figures would make picking the *same* week
    // via the date picker show different numbers than the default view.
    function combinedRecordPool() {
        return []
            .concat(DEPOSIT_RECORDS.map(function (r) { return { amountNgn: r.amountNgn, daysAgo: r.daysAgo, status: r.status, feePct: feePctFor('crypto') }; }))
            .concat(WITHDRAWAL_RECORDS.map(function (r) { return { amountNgn: r.amountNgn, daysAgo: r.daysAgo, status: r.status, feePct: feePctFor('crypto') }; }))
            .concat(DERIV_FUNDING_RECORDS.map(function (r) { return { amountNgn: r.amountUsd * 1535, daysAgo: r.daysAgo, status: r.status, feePct: feePctFor('deriv') }; }))
            .concat(DERIV_WITHDRAWAL_RECORDS.map(function (r) { return { amountNgn: r.amountUsd * 1490, daysAgo: r.daysAgo, status: r.status, feePct: feePctFor('deriv') }; }))
            .concat(CROSS_BORDER_RECORDS.map(function (r) { return { amountNgn: r.amountNgn, daysAgo: r.daysAgo, status: r.status, feePct: feePctFor('abroad') }; }))
            .concat(Object.keys(REPORT_TYPES).reduce(function (acc, k) {
                return acc.concat(REPORT_TYPES[k].records.map(function (r) { return { amountNgn: r.amountNgn, daysAgo: r.daysAgo, status: r.status, feePct: feePctFor(k) }; }));
            }, []));
    }

    // Success rate for an arbitrary calendar-date window (used by the Dashboard's
    // From/To date-range picker). Unlike the volume/profit total below, this counts
    // rejected records too (they're part of "how many attempts succeeded").
    function successRateForDateRange(fromDate, toDate) {
        const from = new Date(fromDate); from.setHours(0, 0, 0, 0);
        const to = new Date(toDate); to.setHours(23, 59, 59, 999);
        const inRange = combinedRecordPool().filter(function (r) {
            const d = daysAgoToDate(r.daysAgo);
            return d >= from && d <= to;
        });
        const approved = inRange.filter(function (r) { return r.status === 'approved'; }).length;
        return inRange.length ? Math.round((approved / inRange.length) * 1000) / 10 : 0;
    }

    // Headline dashboard figures for an arbitrary admin-picked date range.
    function statsForDateRange(fromDate, toDate) {
        const from = new Date(fromDate); from.setHours(0, 0, 0, 0);
        const to = new Date(toDate); to.setHours(23, 59, 59, 999);
        const inRange = combinedRecordPool().filter(function (r) {
            const d = daysAgoToDate(r.daysAgo);
            return d >= from && d <= to && r.status !== 'rejected';
        });
        const totalVolume = inRange.reduce(function (s, r) { return s + r.amountNgn; }, 0);
        const totalProfit = inRange.reduce(function (s, r) { return s + Math.round(r.amountNgn * (r.feePct / 100)); }, 0);
        return {
            totalVolume: totalVolume,
            totalProfit: totalProfit,
            totalTransactions: inRange.length,
            successRatePct: successRateForDateRange(fromDate, toDate),
            liquidityAvailable: Math.round(totalVolume * 0.35 / 1000) * 1000
        };
    }

    global.CN_DATA = {
        USERS: USERS,
        KYC_RECORDS: KYC_RECORDS,
        DEPOSIT_RECORDS: DEPOSIT_RECORDS,
        WITHDRAWAL_RECORDS: WITHDRAWAL_RECORDS,
        DERIV_FUNDING_RECORDS: DERIV_FUNDING_RECORDS,
        DERIV_WITHDRAWAL_RECORDS: DERIV_WITHDRAWAL_RECORDS,
        CROSS_BORDER_RECORDS: CROSS_BORDER_RECORDS,
        SUPPORT_CONVERSATIONS: SUPPORT_CONVERSATIONS,
        AGENT_NAMES: AGENT_NAMES,
        countBy: countBy,
        pendingKyc: pendingKyc,
        statsForUser: statsForUser,
        userByIndex: userByIndex,
        recentTransactions: recentTransactions,
        REPORT_TYPES: REPORT_TYPES,
        REPORT_REF_DATE: REPORT_REF_DATE,
        reportSummary: reportSummary,
        dailyActivitySeries: dailyActivitySeries,
        typeBreakdown: typeBreakdown,
        channelBreakdown: channelBreakdown,
        topCountriesByVolume: topCountriesByVolume,
        topServicesByVolume: topServicesByVolume,
        successRate: successRate,
        dashboardStats: dashboardStats,
        statsForDateRange: statsForDateRange,
        daysAgoToDate: daysAgoToDate
    };
})(window);
