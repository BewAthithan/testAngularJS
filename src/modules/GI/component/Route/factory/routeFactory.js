(function () {
    'use strict';
    app.factory("routeFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "Route",
                urlMaster: webServiceAPI.NewMaster + "Route",
                filter: function (model) {
                    var urlRequest = this.url + "/filterRoute";
                    return clientService.get(urlRequest, model);
                },  
                search: function (model) {
                    var urlRequest = this.url+ "/search";
                    return clientService.post(urlRequest, model);
                },
                searchNewMaster: function (model) {
                    console.log(model);
                    var urlRequest = this.urlMaster+ "/?OwnerIndex=" + localStorageService.get("ownerVariableIndex") +
                    "&OwnerId=" + localStorageService.get("ownerVariableId") +
                    "&OwnerName=" + localStorageService.get("ownerVariableName") +
                    (model.routeId ? "&RouteId=" + model.routeId : "") +
                    (model.routeName ? "&RouteName=" + model.routeName : "");
                    return clientService.get(urlRequest);
                },
            }
        });

})();