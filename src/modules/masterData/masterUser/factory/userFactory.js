(function () {
    'use strict';
    app.factory("userFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getUser;
            return {
                storageName: "userTokenStorage",
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "User",
                urlNewGI: webServiceAPI.NewGI + "GI",
                filter: function (model) {
                    var urlRequest = this.url;
                    return clientService.get(urlRequest, model);
                },
                getId: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.get(urlRequest);
                },
                getDelete: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.delete(urlRequest);
                },
                add: function (model) {
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },
                edit: function (model) {
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },
                search: function (model) {
                    var urlRequest = this.url+ "/search";
                    return clientService.post(urlRequest, model);
                },
                addUser: function (model) {
                    var urlRequest = this.url+ "/addUser";
                    return clientService.post(urlRequest, model);
                },
                setParam: function (model){
                    localStorageService.set(this.storageName, model);
                },
                getParam: function (){
                    return localStorageService.get(this.storageName);
                },
                reset: function(){
                    localStorageService.remove(this.storageName);
                },
                getDefaultUser: function () {
                    var urlRequest = this.urlNewGI+ "/GetUserDefault";
                    return clientService.post(urlRequest, {userID: localStorageService.get('userTokenStorage')});
                },
            }
        });

})();