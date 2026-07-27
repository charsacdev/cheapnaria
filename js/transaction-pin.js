// 4-digit transaction PIN, used to confirm withdrawals and other debit
// transactions in this static demo (stands in for a real OTP, which would
// need SMS/email delivery infrastructure we don't have here).
(function (global) {
    const PIN_KEY = 'cn-txn-pin';
    const SET_AT_KEY = 'cn-txn-pin-set-at';

    function isSet() {
        return !!localStorage.getItem(PIN_KEY);
    }

    function verify(pin) {
        return isSet() && localStorage.getItem(PIN_KEY) === pin;
    }

    function setPin(pin) {
        localStorage.setItem(PIN_KEY, pin);
        localStorage.setItem(SET_AT_KEY, new Date().toLocaleDateString());
    }

    function setAt() {
        return localStorage.getItem(SET_AT_KEY) || '';
    }

    global.CN_PIN = {
        isSet: isSet,
        verify: verify,
        setPin: setPin,
        setAt: setAt
    };
})(window);
