// Simulated agent shift enforcement (demo prototype — no real backend/auth).
// The logged-in demo agent (James Bond) is assigned the Morning shift.
// Use the clock toggle in the top navbar to simulate the current time of day
// and preview how the agent portal locks actions outside that shift window.
(function () {
    const AGENT_SHIFT = 'morning';

    const SHIFT_LABELS = {
        morning: 'Morning &middot; 8:00 AM &ndash; 8:00 PM',
        night: 'Night &middot; 8:00 PM &ndash; 8:00 AM'
    };

    function getSimShift() {
        return localStorage.getItem('cn-sim-shift') || 'morning';
    }

    function setSimShift(val) {
        localStorage.setItem('cn-sim-shift', val);
    }

    function isInShift() {
        return getSimShift() === AGENT_SHIFT;
    }

    function updateToggleUI() {
        const sim = getSimShift();
        const $btn = $('.shift-sim-btn');
        $btn.find('.shift-sim-label').text(sim === 'morning' ? 'Morning Shift' : 'Night Shift');
        $btn.find('i.fa-sun, i.fa-moon').remove();
        $btn.prepend('<i class="fas ' + (sim === 'morning' ? 'fa-sun' : 'fa-moon') + ' me-1"></i>');
        $btn.toggleClass('border-success text-success', isInShift());
        $btn.toggleClass('border-danger text-danger', !isInShift());
        $('.shift-sim-option').removeClass('active').filter('[data-shift="' + sim + '"]').addClass('active');
    }

    function injectToggle($container) {
        if ($container.find('.shift-sim-btn').length) return;
        const html = '' +
            '<div class="dropdown">' +
            '<button type="button" class="btn btn-sm rounded-pill px-3 border shift-sim-btn" data-bs-toggle="dropdown" aria-expanded="false">' +
            '<span class="shift-sim-label"></span></button>' +
            '<ul class="dropdown-menu dropdown-menu-end shadow border-0 p-2">' +
            '<li><p class="small text-muted px-2 mb-2">Simulate current time (demo)</p></li>' +
            '<li><a class="dropdown-item rounded-3 shift-sim-option" href="#" data-shift="morning"><i class="fas fa-sun me-2 text-warning"></i>Morning &middot; 8AM&ndash;8PM</a></li>' +
            '<li><a class="dropdown-item rounded-3 shift-sim-option" href="#" data-shift="night"><i class="fas fa-moon me-2 text-info"></i>Night &middot; 8PM&ndash;8AM</a></li>' +
            '</ul></div>';
        $container.prepend(html);
        updateToggleUI();
    }

    function applyLock() {
        const locked = !isInShift();

        $('#shiftLockBanner').remove();
        if (locked) {
            const bannerHtml = '' +
                '<div id="shiftLockBanner" class="alert alert-warning d-flex align-items-center gap-3 mb-4 border-0 shadow-sm">' +
                '<i class="fas fa-lock fs-5"></i><div>' +
                '<strong>You are outside your shift window.</strong>' +
                '<div class="small">Your assigned shift is ' + SHIFT_LABELS[AGENT_SHIFT] + '. Approvals and rejections are disabled until your shift begins. (Use the clock icon above to simulate a different time for this demo.)</div>' +
                '</div></div>';
            $('.top-navbar').first().after(bannerHtml);
        }

        $('#modApproveBtn, #modRejectBtn').each(function () {
            $(this).prop('disabled', locked);
            $(this).toggleClass('disabled', locked);
        });

        $('#modUploadArea').css({ 'pointer-events': locked ? 'none' : '', opacity: locked ? 0.5 : '' });
        $('#modFileInput').prop('disabled', locked);
    }

    $(document).ready(function () {
        const $navActions = $('.top-navbar .d-flex.align-items-center.gap-3').first();
        if ($navActions.length) {
            injectToggle($navActions);
        }

        $(document).on('click', '.shift-sim-option', function (e) {
            e.preventDefault();
            setSimShift($(this).data('shift'));
            updateToggleUI();
            applyLock();
        });

        $(document).on('shown.bs.modal', function () {
            applyLock();
        });

        applyLock();
    });

    window.CN_SHIFT = { isInShift: isInShift, getSimShift: getSimShift, setSimShift: setSimShift, AGENT_SHIFT: AGENT_SHIFT };
})();
