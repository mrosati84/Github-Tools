(function ($) {
    var APP = window.APP || {};

    $.ajax({
        type: 'POST',
        data: {
            client_id: APP.settings.client_id,
            client_secret: APP.settings.client_secret,
            code: APP.QueryString.code,
            state: APP.QueryString.state
        },
        url: 'https://github.com/login/oauth/access_token',
        success: function (data, status) {
            var response = JSON.parse('{"' + decodeURI(data).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
            var access_token = response.access_token;

            chrome.storage.local.set({access_token: access_token}, function () {
                // Access token set.
            });
        }
    });

    window.APP = APP;
}(jQuery));
