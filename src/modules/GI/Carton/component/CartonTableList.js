'use strict'
app.component('cartonTableList', {
    controllerAs: '$vm',
    templateUrl: function($element, $attrs, $window, commonService) {
        return "modules/GI/Carton/component/CartonTableList.html";
    },
    bindings: {
        isLoading: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        searchResultModel: '=?',
    },
    controller: function() {

    }
});