app.factory("planGoodsReceiveItemFactory", function (webServiceAPI, clientService) {
    return {
        get: clientService.get,
        post: clientService.post,
        url: webServiceAPI.GR + "PlanGoodsReceiveItem",
        getByPlanGoodReceiveId: function (id) {
            var urlRequest = this.url + "/GetByPlanGoodReceiveId/" +id;
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
        GetGoodsReceiveItem: function (model) {
            var urlRequest = this.url + "/GetGoodsReceiveItem/" + model;
            return clientService.get(urlRequest);
        },
        GetRemainQty: function (model) {
            var urlRequest = this.url + "/GetRemainQty/" + model;
            return clientService.get(urlRequest);
        },
    }
});