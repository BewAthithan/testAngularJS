(function () {
    'use strict';
    app.factory("documentTypeFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "DocumentType",
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest);
                },
                filterGR: function (model) {
                    var urlRequest = this.url + "/filterGR" +"/"+ model;
                    return clientService.get(urlRequest);
                },
                filterPlanGR: function (model) {
                    var urlRequest = this.url + "/filterPlanGR";
                    return clientService.get(urlRequest);
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
                popupPlanGRSearch: function (model) {
                    var urlRequest = this.url+ "/popupPlanGRSearch";
                    return clientService.post(urlRequest, model);
                },
                popupGRSearch: function (model) {
                    var urlRequest = this.url+ "/popupGRSearch";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();