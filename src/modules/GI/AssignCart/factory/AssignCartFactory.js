(function () {
    'use strict';
    app.factory("assignCartFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getData1 ;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "AssignCart",
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
                getUserGroup: function (model) {
                    var urlRequest = this.url + "/getUserGroup/"+model;
                    return clientService.get(urlRequest);
                },
                CheckEquipment: function (model,username) {
                    var urlRequest = this.url + "/CheckEquipment/"+model+"/"+username;
                    return clientService.get(urlRequest);
                },
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
                },
                filterCart: function (model) {
                    var urlRequest = this.url + "/filterCart";
                    return clientService.post(urlRequest, model);
                },
                daleteUserAssign: function (model) {
                    var urlRequest = this.url + "/daleteUserAssign/"+model;
                    return clientService.get(urlRequest);
                },
                CheckTask: function (equipmentitem,equipment,task_Index) {
                    var urlRequest = this.url + "/CheckTask/"+equipmentitem+"/"+equipment+"/"+task_Index;
                    return clientService.get(urlRequest);
                },
                AssignTask: function (model) {
                    var urlRequest = this.url + "/AssignTask";
                    return clientService.post(urlRequest,model);
                },
            }
        });
})();