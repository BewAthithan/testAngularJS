(function () {
    'use strict';
    app.factory("assignTaskFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getData1 ;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "AssignTask",
                setParam: function (model){
                    getData1 = model;
                },
                getParam: function (){
                    return getData1;
                },
                dropdownUserGroup: function (model) {
                    var urlRequest = this.url + "/dropdownUserGroup";
                    return clientService.post(urlRequest, model);
                },
                dropdownDocumentType: function (model) {
                    var urlRequest = this.url + "/dropdownDocumentType";
                    return clientService.post(urlRequest, model);
                },
                dropdownRoute: function (model) {
                    var urlRequest = this.url + "/dropdownRoute";
                    return clientService.post(urlRequest, model);
                },
                dropdownRound: function (model) {
                    var urlRequest = this.url + "/dropdownRound";
                    return clientService.post(urlRequest, model);
                },
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
                },
                updateUserAssign: function (model) {
                    var urlRequest = this.url + "/updateUserAssign";
                    return clientService.post(urlRequest, model);
                },
                getUserGroup: function (model) {
                    var urlRequest = this.url + "/getUserGroup/"+model;
                    return clientService.get(urlRequest);
                },
                daleteUserAssign: function (model) {
                    var urlRequest = this.url + "/daleteUserAssign/"+model;
                    return clientService.get(urlRequest);
                },
                CheckTask: function (model) {
                    var urlRequest = this.url + "/CheckTask/"+model;
                    return clientService.get(urlRequest);
                },
            }
        });
})();