(function ($) {
    var APP = window.APP || {};

    var issue_appended = false,
        issue_path_regex = /^\/\w*\/\w*\/issues\/\d*/,
        issue_append_interval_timeout = 500,
        issue_url_interval_timeout = 100,
        path = location.pathname,
        branch_name = '';

    /**
     * Builds a branch name using issue ID and title.
     *
     * @param issue_id
     * @param issue_title
     * @returns {string}
     */
    APP.buildBranchName = function (issue_id, issue_title) {
        branch_name = issue_id + '-' + issue_title;

        return branch_name;
    };

    APP.getUsername = function () {
        return location.pathname.split('/')[1];
    };

    APP.getRepo = function () {
        return location.pathname.split('/')[2];
    };

    /**
     * Appends the "Create branch" button.
     */
    APP.appendCreateBranchButton = function () {
        if (issue_appended || !location.pathname.match(issue_path_regex)) {
            return;
        }

        var issue_id_container = $('.gh-header-number'),
            issue_title_container = $('.js-issue-title'),
            header_container = $('.gh-header-show ');

        if (issue_id_container.length && issue_title_container.length) {
            var issue_id = issue_id_container.html().substr(1);
            var issue_title = APP.slugify(issue_title_container.html().trim());

            header_container.append($('<p>').html('add branch: ' + APP.buildBranchName(issue_id, issue_title)));
            issue_appended = true;
        }
    };

    /**
     * Check on Github if a branch exists.
     *
     * @param branch_name
     * @param branch_exists_callback
     * @param branch_misses_callback
     */
    APP.checkBranchExistence = function (branch_name, branch_exists_callback, branch_misses_callback) {
        $.ajax({
            url: 'https://api.github.com/repos/' + APP.getUsername() + '/' + APP.getRepo() + '/git/refs/heads/' + branch_name,
            method: 'GET',
            data: {
                access_token: APP.settings.access_token
            },
            success: function (data, status) {
                branch_exists_callback();
            },
            statusCode: {
                404: function () {
                    branch_misses_callback();
                }
            }
        })
    };

    // Append on page load.
    APP.appendCreateBranchButton();

    // Polling on issues pages to append button.
    var issue_url_interval = setInterval(function () {
        if (path !== location.pathname) {
            if (location.pathname.match(issue_path_regex)) {
                issue_appended = false;

                var issue_appended_interval = setInterval(function () {
                    if (issue_appended) {
                        clearInterval(issue_appended_interval);
                    } else {
                        APP.appendCreateBranchButton();
                    }
                }, issue_append_interval_timeout);
            }

            path = location.pathname;
        }
    }, issue_url_interval_timeout);

    window.APP = APP;
}(jQuery));
