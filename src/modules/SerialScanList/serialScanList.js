(function () {
    'use strict'

    app.component('serialScanList', {
        controllerAs: '$vm',
        templateUrl: "modules/SerialScanList/serialScanList.html",
        bindings: {
            onCloseModal: '&?'
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, serialScanFactory) {
            var $vm = this;
            var defer = {};
            var viewModel = serialScanFactory;
            var ownerIndex ; 
            var orderIndex ; 
            var taskItemIndex ;
            var QtyScan = 0 ;


            this.$onInit = function () {
                
            };

            $scope.$on("initChildModal",function(){
                init();
            });

            $scope.selectedList = {};

            $scope.doDeleteSerial = function () {

                ownerIndex = $window.localStorage['OwnerIndex']; 
                orderIndex = $window.localStorage['OrderIndex']; 
                taskItemIndex = $window.localStorage['TaskItemIndex']; 
                $vm.QtyScan = $window.localStorage['QtyScan'];

                $scope.DeleteSerialModal = {
                    OwnerIndex: ownerIndex,
                    OrderIndex: orderIndex,
                    TaskItemIndex: taskItemIndex,
                    //UserID: $scope.userName,
                    UserID: localStorageService.get('userTokenStorage'),
                };
                angular.forEach($scope.selectedList, function (selected, serialno) {
                    $scope.DeleteSerialModal.SerialNo = serialno;
                    viewModel.DeleteSerial($scope.DeleteSerialModal).then(function success(res) {
                        //console.log(res.data);
                        if(res.data.StatusCode == '200'){
                            console.log(res.data.Result);
                            $scope.selectedList = {}; // reset data
                            $route.reload();
                        }
                    }, function error(res) {
                        console.log(res);
                    });
                });
            };

            $scope.doDeleteAllSerial = function () {
                ownerIndex = $window.localStorage['OwnerIndex']; 
                orderIndex = $window.localStorage['OrderIndex']; 
                taskItemIndex = $window.localStorage['TaskItemIndex']; 
                $vm.QtyScan = $window.localStorage['QtyScan'];

                $scope.DeleteSerialModal = {
                    OwnerIndex: ownerIndex,
                    OrderIndex: orderIndex,
                    TaskItemIndex: taskItemIndex,
                    //UserID: $scope.userName,
                    UserID: localStorageService.get('userTokenStorage'),
                };
                viewModel.DeleteAllSerial($scope.DeleteSerialModal).then(function success(res) {
                    //console.log(res.data);
                    if(res.data.StatusCode == '200'){
                        
                        console.log(res.data.Result);
                        $route.reload();
                    }
                }, function error(res) {
                    console.log(res);
                });
            };


            $vm.close = function close () {
                $vm.onCloseModal && $vm.onCloseModal();
            };
            $scope.buttons = {
                back: true
            };

            var CheckCompleteSerial = function() {
                $vm.QtyScan = $window.localStorage['QtyScan'];
                if(parseInt($vm.orderModel.Attribute.Serial.length) >= parseInt($vm.QtyScan))
                {
                $window.localStorage['CompleteSerial'] = "Y";

                }else
                {
                    $window.localStorage['CompleteSerial'] = "N";

                }

                
            }

            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                ownerIndex = $window.localStorage['OwnerIndex']; 
                orderIndex = $window.localStorage['OrderIndex']; 
                taskItemIndex = $window.localStorage['TaskItemIndex']; 
                $vm.QtyScan = parseInt($window.localStorage['QtyScan']);
                $scope.OrderDetailModal = {
                    OwnerIndex: ownerIndex,
                    OrderIndex: orderIndex,
                    TaskItemIndex: taskItemIndex,
                };
                console.log('init()');
                viewModel.GetOrderDetails($scope.OrderDetailModal).then(function success(res) {
                    //console.log(res.data);
                    if(res.data.statusCode == '200'){
                        console.log(res.data.Result);
                        $vm.orderModel = res.data.result;

                        CheckCompleteSerial();
                    }
                }, function error(res) {
                    console.log(res);
                });
            };

        }
    })
})();