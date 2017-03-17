(function ($) {
    var APP = window.APP || {};

    /**
     * Variables.
     */
    var gh_login_url = 'https://github.com/login/oauth/authorize?',
        params = $.param({
            client_id: APP.settings.client_id,
            state: Math.random().toString(36).substring(7),
            scope: APP.settings.scope,
            allow_signup: false
        }),
        login_link = $('<a>').attr('href', gh_login_url + decodeURIComponent(params)).attr('target', '_blank').html('Log-in'),
        logout_link = $('<a>').attr('href', '#').attr('id', 'logout-link').html('Logout'),
        login_container = $('#login'),
        logout_container = $('#logout'),
        token_container = $('#token'),
        email_container = $('#email'),
        identity_container = $('#identity');

    // Try to get the access token.
    chrome.storage.local.get('access_token', function (items) {
        if (items.access_token) {
            // Access token is set.
            var token = items.access_token;

            // TODO: here just for debug.
            token_container.html(token);
            logout_container.append(logout_link);

            // Get the loggin-in user email.
            $.ajax({
                url: 'https://api.github.com/user/emails',
                method: 'GET',
                data: {
                    access_token: token
                },
                success: function (data, status) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].primary) {
                            // Show only the primary e-mail.
                            identity_container.show();
                            email_container.html(data[i].email);
                        }
                    }
                }
            });
        } else {
            // No auth token is set, show the login link.
            login_container.append(login_link);
        }
    });

    /**
     * Handle logout link.
     */
    $('body').on('click', '#logout-link', function (ev) {
        ev.preventDefault();

        chrome.storage.local.remove('access_token', function () {
            login_container.append(login_link);
            logout_container.empty();
            identity_container.hide();
            email_container.empty();
            token_container.empty();
        })
    });

    window.APP = APP;
}(jQuery));
