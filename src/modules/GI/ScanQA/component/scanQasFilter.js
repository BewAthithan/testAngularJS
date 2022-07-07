(function () {
    'use strict';
    app.component('scanQaFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/ScanQA/component/scanQaFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            filterSearch: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService, scanQaFactory,dpMessageBox) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var viewModel = scanQaFactory;
            $scope.isFilter = true;
            $scope.filterModel = {};

            $vm.triggerSearch = function (confirm) {
                $scope.isconfirm = confirm;
                $scope.ScanPickTicket();
            };

            $scope.ScanPickTicket = function () {
                $scope.filterModel = $scope.filterModel || {};
                let models = {};
                models.tagOutPickNo =  $scope.filterModel.tagOutPickNo;                
                if(!(models.tagOutPickNo == "" || models.tagOutPickNo == null || models.tagOutPickNo == undefined))
                {
                viewModel.ScanPickTicket(models).then(function success(res) {
                    if (res.data.length > 0) {
                        let data = res.data;
                        for (var i = 0; i <= data.length - 1; i++) {
                            if(data[i].documentStatus == 2){
                                $vm.searchResultModel = data
                                for (var i = 0; i <= $vm.searchResultModel.length - 1; i++) {
                                    if($vm.searchResultModel[i].tagOutStatus == 0){
                                        $vm.searchResultModel[i].qtyBackOrder = "-";
                                    }
                                }
                                $scope.filterModel.tagOutPickIndex = data[0].tagOutPickIndex;
                                $scope.filterModel.tagOutPickNo = data[0].tagOutPickNo;
                                $scope.filterModel.groupZone = data[0].zoneName;
                                $scope.filterModel.qtyBackOrder = data[0].qtyBackOrder;
                                $scope.filterModel.tagOutStatus = data[0].tagOutStatus;
                                $scope.filterModel.productName = data[0].productName;
                                $scope.filterModel.tagOutPickStatus = data[0].tagOutPickStatus;
                                $scope.filterModel.soNo = data[0].goodsIssueNo;
                                $scope.filterModel.planGoodsIssueItemIndex = data[0].planGoodsIssueItemIndex;                        
                                $scope.filterModel.pickedBy = data[0].pickedBy;
                            }
                            else {
                                $scope.filterModel = {};
                                $vm.searchResultModel = {};
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: " Pick Ticket ยังไม่ได้ทำการ Put To Staging !!"
                                })
                            }
                        }
                    }
                    else {
                        if($scope.isconfirm)
                        {
                            $vm.searchResultModel = {};
                            $scope.isconfirm = false;
                        }
                        else{
                        $scope.filterModel = {};
                        $vm.searchResultModel = {};
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: " ไม่พบข้อมูลหรือถูกสแกนแล้ว !!"
                        })
                    }
                    }

                    // setTimeout(() => {
                    //     var focusElem = jQuery('input[ng-model="$scope.filterModel.Route"]');
                    //     focusElem[0].focus();

                    // }, 200);
                },
                function error(res) {

                    });
            }
            }

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });

            var init = function () {

            }
            init();
        }
    });

})();