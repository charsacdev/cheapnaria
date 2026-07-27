// Simulated tier/KYC verification state for the static demo. No real NIN/BVN,
// document, or bank lookups happen here — everything is generated locally so
// the onboarding flow feels alive without a backend. Persisted to localStorage
// so it's visible across the onboarding pages, dashboard, agent and admin.
(function (global) {
    const TIER_KEY = 'cn-tier';
    const IDENTITY_KEY = 'cn-verify-identity';
    const DOCUMENT_KEY = 'cn-verify-document';
    const ADDRESS_KEY = 'cn-verify-address';
    const BANK_KEY = 'cn-bank-account';

    const FIRST_NAMES = ['John', 'Sarah', 'Michael', 'Blessing', 'Tunde', 'Amaka', 'Ibrahim', 'Chidinma', 'Peter', 'Ngozi'];
    const LAST_NAMES = ['Doe', 'Adams', 'Kelvin', 'Okafor', 'Bello', 'Chi', 'Musa', 'Eze', 'Obi-Anya', 'Umeh'];
    const STATES = {
        Lagos: ['Ikeja', 'Eti-Osa', 'Alimosho', 'Surulere'],
        Abuja: ['Garki', 'Wuse', 'Gwarinpa', 'Kubwa'],
        Rivers: ['Port Harcourt', 'Obio-Akpor', 'Eleme'],
        Kano: ['Nassarawa', 'Fagge', 'Dala'],
        Oyo: ['Ibadan North', 'Ibadan South-West', 'Ogbomosho North']
    };
    const BANKS = ['Access Bank', 'GTBank', 'Zenith Bank', 'UBA', 'First Bank', 'Wema Bank', 'Kuda MFB', 'Opay', 'Moniepoint MFB'];

    // Deterministic-feeling pseudo-random pick, seeded off the entered ID/account
    // number so the same input always simulates the same "record".
    function seededIndex(seed, mod) {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
        return hash % mod;
    }

    function simulateIdentityLookup(idNumber) {
        const stateNames = Object.keys(STATES);
        const first = FIRST_NAMES[seededIndex(idNumber + 'f', FIRST_NAMES.length)];
        const last = LAST_NAMES[seededIndex(idNumber + 'l', LAST_NAMES.length)];
        const state = stateNames[seededIndex(idNumber + 's', stateNames.length)];
        const lgas = STATES[state];
        const lga = lgas[seededIndex(idNumber + 'g', lgas.length)];
        const age = 21 + seededIndex(idNumber + 'a', 40);
        const gender = seededIndex(idNumber + 'x', 2) === 0 ? 'Male' : 'Female';
        return {
            name: first + ' ' + last,
            age: age,
            gender: gender,
            state: state,
            lga: lga,
            address: (10 + seededIndex(idNumber + 'h', 90)) + ' ' + lga + ' Road, ' + state
        };
    }

    function simulateBankLookup(accountNumber, bankName) {
        const first = FIRST_NAMES[seededIndex(accountNumber + bankName + 'f', FIRST_NAMES.length)];
        const last = LAST_NAMES[seededIndex(accountNumber + bankName + 'l', LAST_NAMES.length)];
        return (first + ' ' + last).toUpperCase();
    }

    function getTier() {
        return parseInt(localStorage.getItem(TIER_KEY) || '0', 10);
    }

    function setTier(tier) {
        const current = getTier();
        if (tier > current) localStorage.setItem(TIER_KEY, String(tier));
    }

    function getIdentity() {
        try { return JSON.parse(localStorage.getItem(IDENTITY_KEY)); } catch (e) { return null; }
    }

    function saveIdentity(idType, idNumber, profile) {
        localStorage.setItem(IDENTITY_KEY, JSON.stringify({ idType: idType, idNumber: idNumber, profile: profile }));
        setTier(1);
    }

    function isDocumentVerified() {
        return localStorage.getItem(DOCUMENT_KEY) === '1';
    }

    function saveDocument(fileName) {
        localStorage.setItem(DOCUMENT_KEY, '1');
        localStorage.setItem(DOCUMENT_KEY + '-file', fileName || 'document.jpg');
        setTier(2);
    }

    function isAddressVerified() {
        return localStorage.getItem(ADDRESS_KEY) === '1';
    }

    function saveAddress(fileName, selfieName) {
        localStorage.setItem(ADDRESS_KEY, '1');
        localStorage.setItem(ADDRESS_KEY + '-file', fileName || 'address-proof.jpg');
        localStorage.setItem(ADDRESS_KEY + '-selfie', selfieName || 'selfie.jpg');
        // Tier 3 requires Tier 2 (document) to already be complete.
        if (isDocumentVerified()) setTier(3);
    }

    function getBankAccount() {
        try { return JSON.parse(localStorage.getItem(BANK_KEY)); } catch (e) { return null; }
    }

    function saveBankAccount(bank, accountNumber, accountName) {
        localStorage.setItem(BANK_KEY, JSON.stringify({ bank: bank, accountNumber: accountNumber, accountName: accountName }));
    }

    const TIER_LABELS = { 0: 'Unverified', 1: 'Tier 1', 2: 'Tier 2', 3: 'Tier 3' };

    global.CN_VERIFY = {
        BANKS: BANKS,
        simulateIdentityLookup: simulateIdentityLookup,
        simulateBankLookup: simulateBankLookup,
        getTier: getTier,
        setTier: setTier,
        getIdentity: getIdentity,
        saveIdentity: saveIdentity,
        isDocumentVerified: isDocumentVerified,
        saveDocument: saveDocument,
        isAddressVerified: isAddressVerified,
        saveAddress: saveAddress,
        getBankAccount: getBankAccount,
        saveBankAccount: saveBankAccount,
        TIER_LABELS: TIER_LABELS
    };
})(window);
