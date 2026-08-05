$(document).ready(function() {
    // Navbar Scroll Effect
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('#navbar').addClass('scrolled');
        } else {
            $('#navbar').removeClass('scrolled');
        }
    });

    // Mobile Menu Toggle
    $('.mobile-toggle').click(function() {
        // Simple alert for now, in a real app this would open a mobile drawer
        alert('Mobile menu clicked! In a full implementation, this opens a premium side-drawer.');
    });

    // Carousel Logic
    let currentSlide = 0;
    const slides = $('.slide');
    const slideCount = slides.length;

    function nextSlide() {
        slides.eq(currentSlide).removeClass('active');
        currentSlide = (currentSlide + 1) % slideCount;
        slides.eq(currentSlide).addClass('active');
    }

    // Auto-advance slides every 5 seconds
    const slideInterval = setInterval(nextSlide, 5000);

    // Initial check for scroll position on page load
    if ($(window).scrollTop() > 50) {
        $('#navbar').addClass('scrolled');
    }

    // Smooth Scroll for Navigation Links
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 800);
        }
    });

    // Add Animation to features on scroll
    $(window).scroll(function() {
        $('.feature-card').each(function() {
            var bottom_of_object = $(this).offset().top + $(this).outerHeight() / 4;
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            
            if (bottom_of_window > bottom_of_object) {
                $(this).css({
                    'opacity': '1',
                    'transform': 'translateY(0)'
                });
            }
        });
    });

    // Set initial opacity for feature cards to animate them in
    $('.feature-card').css({
        'opacity': '0',
        'transform': 'translateY(20px)',
        'transition': 'all 0.6s ease-out'
    });
});
