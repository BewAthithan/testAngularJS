app.factory("callCenterItemFactory", function (webServiceAPI, clientService) {
    return {
        get: clientService.get,
        post: clientService.post,
        url: webServiceAPI.GI + "CallCenterItem",
        getByCallCenterId: function (id) {
            var urlRequest = this.url + "/GetByCallCenterId/" +id;
            return clientService.get(urlRequest);
        },
        getDelete: function (model) {
            var urlRequest = this.url + "/" + model;
            return clientService.delete(urlRequest);
        },
        getId: function (model) {
            var urlRequest = this.url + "/" + model;
            return clientService.get(urlRequest);
        },
    }
});