app.component("putawayReceiveProduct", {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GR/putAway/putAwayBySKU/putAwayReceiveProduct/putAwayReceiveProduct.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        config: '=',
        isItem: "=?",
    },    
    controller: function($scope, $q, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading,localStorageService,  $timeout, $translate, dpMessageBox, putAwayFactory) {
        var $vm = this;
        var viewModel = putAwayFactory;


        $scope.delete = function (param) {            
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'Cancel',
                message: 'Do you want to Cancel ?'
            }).then(function success() {                
                param.cancelBy = localStorageService.get('userTokenStorage');
                viewModel.DeleteTagItem(param).then(function success(res) {   
                    $state.reload();                                                
                    // if (res.data == false) {
                    //     dpMessageBox.alert({
                    //         ok: 'OK',
                    //         title: 'InformaTion',
                    //         message: 'ไม่สามารถลบข้อมูลได้',
                    //     })
                    // }
                }, function error(res) { });
            });
        };

        

        this.$onInit = function() {            
            //$scope.filter()
            $scope.userName = localStorageService.get('userTokenStorage');
        }

        this.$onDestroy = function() {

        }
    }
});