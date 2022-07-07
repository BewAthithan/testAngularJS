app.factory('customHttpInterceptor', function ($location, pageLoading, authenConstant, localStorageService) {
    let deley = 1000;
    let requestCount = 0;

    var module = {};

    module.request = function (config) {
        if (config.url.indexOf(authenConstant.url) !== -1 || config.url.indexOf('/api/') == -1) {
            pageLoading.show();
            requestCount++;

            return config;
        }
        else {
            var userToken = localStorageService.get('userTokenStorage');;
            if (userToken) {
                pageLoading.show();
                requestCount++;

                return config;
            }
            else {
                return null;
            }
        }
    }

    module.response = function (response) {
        requestCount--;

        if (requestCount == 0) {
            pageLoading.hide(deley);
        }

        var userToken = localStorageService.get('userTokenStorage');;
        if (!userToken) {
            $location.path('/login');
        }

        return response;
    }

    module.responseError = function (error) {
        requestCount = 0;

        pageLoading.hide(deley);
        return error;
    }

    return module;
});