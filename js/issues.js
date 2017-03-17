(function ($) {
    var APP = window.APP || {};

    var issue_id = $('.gh-header-number').html().substr(1);
    var issue_title = APP.slugify($('.js-issue-title').html().trim());

    $('.gh-header-show ').append($('<p>').html('add branch: ' + issue_id + '-' + issue_title));

    $(window).on('unload', function () {
        console.log('xx');
    });

    window.APP = APP;
}(jQuery));
