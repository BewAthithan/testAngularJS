app.factory("goodsReceiveItemFactory", function (webServiceAPI, clientService) {
    return {
        get: clientService.get,
        post: clientService.post,
        url: webServiceAPI.GR + "GoodsReceiveItem",

        getByGoodReceiveId: function (id) {
            var urlRequest = this.url + "/GetByGoodReceiveId/" +id;
            return clientService.get(urlRequest);
        },
        getPlanGoodReceivePopup: function (id) {
            var urlRequest = this.url + "/GetPlanGoodReceivePopup/" +id;
            return clientService.get(urlRequest);
        }
    }
});    