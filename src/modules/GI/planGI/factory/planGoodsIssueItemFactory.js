app.factory("planGoodsIssueItemFactory", function (webServiceAPI, clientService) {
    return {
        get: clientService.get,
        post: clientService.post,
        url: webServiceAPI.GI + "PlanGoodsIssueItem",
        getByPlanGoodIssueId: function (id) {
            var urlRequest = this.url + "/GetByPlanGoodIssueId/" +id;
            return clientService.get(urlRequest);
        },
        getByPlanGoodIssueItem: function (model) {
            var urlRequest = this.url + "/GetByPlanGoodIssueItem";
            return clientService.post(urlRequest, model);
        },
        getDelete: function (model) {
            var urlRequest = this.url + "/" + model;
            return clientService.delete(urlRequest);
        },
        getId: function (model) {
            var urlRequest = this.url + "/" + model;
            return clientService.get(urlRequest);
        },
        getGoodsIssueItem: function (model) {
            var urlRequest = this.url + "/GetGoodsIssueItem/" + model;
            return clientService.get(urlRequest);
        },
        getRemainQty: function (model) {
            var urlRequest = this.url + "/GetRemainQty/" + model;
            return clientService.get(urlRequest);
        },
        GetPlanGoodsIssueItemPopup: function (model) {
            var urlRequest = this.url + "/GetPlanGoodsIssueItemPopup";
            return clientService.post(urlRequest, model);
        },
    }
});