$(document).ready(function () {
    // Sidebar Toggle for Mobile
    $('#sidebarToggle').on('click', function () {
        $('#adminSidebar').toggleClass('show');
    });

    // Close sidebar when clicking outside on mobile
    $(document).on('click', function (e) {
        if ($(window).width() < 992) {
            if (!$(e.target).closest('#adminSidebar').length && !$(e.target).closest('#sidebarToggle').length) {
                $('#adminSidebar').removeClass('show');
            }
        }
    });

    // Tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // DataTable Settings (Global Default)
    if ($.fn.dataTable) {
        $.extend(true, $.fn.dataTable.defaults, {
            responsive: true,
            language: {
                search: "_INPUT_",
                searchPlaceholder: "Search...",
                lengthMenu: "Show _MENU_",
            }
        });
    }
});
