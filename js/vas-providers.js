// Shared Utility & Betting reference data — used by Dashboard, Admin, and Agent
// so provider/plan lists never drift between portals.
(function (global) {
    const BETTING_PROVIDERS = [
        'Bet9ja', 'SportyBet', '1xBet', 'BetKing', 'NairaBet', 'BangBet', 'MerryBet'
    ];

    const NETWORKS = ['MTN', 'Airtel', 'Glo', '9mobile'];

    const DATA_PLANS = {
        MTN: [
            { label: '1GB - 1 Day', price: 350 },
            { label: '2GB - 30 Days', price: 1200 },
            { label: '5GB - 30 Days', price: 2500 },
            { label: '10GB - 30 Days', price: 4500 }
        ],
        Airtel: [
            { label: '1GB - 1 Day', price: 300 },
            { label: '2GB - 30 Days', price: 1100 },
            { label: '5GB - 30 Days', price: 2400 },
            { label: '10GB - 30 Days', price: 4300 }
        ],
        Glo: [
            { label: '1.2GB - 1 Day', price: 300 },
            { label: '2.9GB - 30 Days', price: 1000 },
            { label: '5.8GB - 30 Days', price: 2000 },
            { label: '11.5GB - 30 Days', price: 4000 }
        ],
        '9mobile': [
            { label: '1GB - 30 Days', price: 500 },
            { label: '2GB - 30 Days', price: 1200 },
            { label: '4.5GB - 30 Days', price: 2500 },
            { label: '11GB - 30 Days', price: 4500 }
        ]
    };

    const DISCOS = [
        'Ikeja Electric', 'Eko Electricity (EKEDC)', 'Abuja Electricity (AEDC)',
        'Kano Electricity (KEDCO)', 'Port Harcourt Electricity (PHED)',
        'Ibadan Electricity (IBEDC)', 'Enugu Electricity (EEDC)', 'Jos Electricity (JED)'
    ];

    // --- Deterministic log records for Admin/Agent visibility (instant, no approval needed) ---
    const NAMES = [
        'John Doe', 'Sarah Adams', 'Michael Kelvin', 'Blessing O.', 'Tunde A.',
        'Amaka Chi', 'David Mensah', 'Grace Okoro', 'Ibrahim Musa', 'Chidinma Eze'
    ];

    function shortDate(daysAgo) {
        const d = new Date(2024, 10, 5); // fixed reference date, matches mock-data.js
        d.setDate(d.getDate() - daysAgo);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    }

    function buildRecords(prefix, count, providers, detailPrefix, baseAmount, amountStep) {
        const records = [];
        for (let i = 0; i < count; i++) {
            const name = NAMES[i % NAMES.length];
            records.push({
                ref: prefix + '-' + (40000 + i * 13),
                user: { name: name, email: name.toLowerCase().replace(/[^a-z\s]/g, '').trim().split(/\s+/).join('.') + i + '@example.com' },
                provider: providers[i % providers.length],
                detail: detailPrefix + (700000000 + i * 91),
                amountNgn: baseAmount + (i * amountStep),
                date: shortDate(i * 3),
                status: (i % 9 === 8) ? 'failed' : 'success'
            });
        }
        return records;
    }

    const VAS_RECORDS = {
        betting: buildRecords('BET', 10, BETTING_PROVIDERS, 'ID ', 1500, 850),
        airtime: buildRecords('AIR', 10, NETWORKS, '080', 200, 180),
        data: buildRecords('DAT', 10, NETWORKS, '081', 1000, 350),
        electricity: buildRecords('ELE', 10, DISCOS, 'Meter 0', 5000, 1400)
    };

    global.CN_VAS = {
        BETTING_PROVIDERS: BETTING_PROVIDERS,
        NETWORKS: NETWORKS,
        DATA_PLANS: DATA_PLANS,
        DISCOS: DISCOS,
        VAS_RECORDS: VAS_RECORDS
    };
})(window);
