// Dashboard light/dark theme toggle.
// The initial theme is applied inline in <head> (before this file loads) to avoid a flash.
$(document).ready(function () {
    function currentTheme() {
        return document.documentElement.getAttribute('data-bs-theme') || 'light';
    }

    function applyIcon() {
        const isDark = currentTheme() === 'dark';
        $('.theme-toggle-btn i')
            .toggleClass('fa-moon', !isDark)
            .toggleClass('fa-sun', isDark);
    }

    applyIcon();

    $('.theme-toggle-btn').on('click', function () {
        const next = currentTheme() === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-bs-theme', next);
        localStorage.setItem('cn-theme', next);
        applyIcon();
    });
});
