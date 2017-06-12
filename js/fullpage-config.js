'use strict';

//var colors = ['#20ca8c', '#6d4c41', '#fd9444', '#ffb300', '#13aad1', '#b0bec5'];
var colors = ['#20ca8c', '#6d4c41', '#fd9444', '#b0bec5', '#13aad1'];
$(document).ready(function() {
    // initialise slider
    var mySwiper = new Swiper ('#info', {
        direction: 'vertical',
        effect: 'cube',
        speed: 600,
        pagination: '.swiper-pagination',
        paginationHide: false,
        paginationClickable: true,
        onSlideChangeStart: function (mySwiper) {
            $('#fullpage').fullpage.moveTo(mySwiper.activeIndex + info_begin);
        }
    });

    mySwiper.disableMousewheelControl();
    mySwiper.disableKeyboardControl();
    mySwiper.disableTouchControl();

    document.getElementById("background").style.backgroundColor = colors[0];

    // move footer to the end of the slider
    $('*[data-footer="here"]').replaceWith($('.footer'));

    // move `info` from body to the first showcase slide
    var info = $('#info');
    $('#info').remove();
    $('*[data-info="begin"]').append(info);
    var info_begin = $('.section').index($('*[data-info="begin"]')) + 1; //the beginning of the showcase
    var info_end = $('.section').index($('*[data-info="end"]')) + 1; //the end

    var header = $('.header');
    $('.header').remove();
    $('*[data-header="begin"]').append(header);
    var header_begin = $('.section').index($('*[data-header="begin"]')) + 1;
    var header_end = $('.section').index($('*[data-header="end"]')) + 1;

    $('#fullpage').fullpage({
        dragAndMove: true,
        scrollOverflow: false,
        onLeave: function (index, nextIndex, direction) {
            document.getElementById("background").style.backgroundColor = colors[nextIndex - 2];

            // scroll `info` according to the showcase slide where we are going
            if (nextIndex >= info_begin && nextIndex <= info_end) {
                mySwiper.slideTo(nextIndex - info_begin);
            }

            // move `info` to the first or to the last showcase slide,
            // so it could be scrolled as it needed
            if (nextIndex < info_begin) {
                $('#info').remove();
                $('*[data-info="begin"]').append(info);
            } else if (nextIndex > info_end) {
                $('#info').remove();
                $('*[data-info="end"]').append(info);
            }

            if (nextIndex < header_begin) {
                $('.header').remove();
                $('*[data-header="begin"]').append(header);
            } else if (nextIndex > header_end) {
                $('.header').remove();
                $('*[data-header="end"]').append(header);
            }

        },
        afterLoad: function (anchorLink, index) {
            // fix the `info` position when it's need to stay at it's place
            if (index >= info_begin && index <= info_end) {
                $('#info').remove();
                $('main').append(info);
            }

            if (index >= header_begin && index <= header_end) {
                $('.header').remove();
                $('main').append(header);
            }

            // play video on page
            setTimeout(function () {
                $('video').each(function (index, element) {
                    element.play();
                });
            }, 200);
        }
    });
});
