(function () {
    'use strict'

    app.component('serialScan', {
        controllerAs: '$vm',
        bindings: {
            onClose: '&?'
        },
        templateUrl: "modules/SerialScan/serialScan.html",
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, serialScanFactory) {
            var $vm = this;
            var defer = {};
            var viewModel = serialScanFactory;
            var ownerIndex ; 
            var orderIndex ; 
            var taskItemIndex ;
            var QtyScan = 0 ;
            var completeSerial = false;
            var isSerialListHide = true;


            $scope.$on("initChild",function(){
                init();
            });

            this.$onInit = function () {
                //init();
                $vm.isSerialListHide = true;
            };

            $scope.doSerialNoSubmit = function () {
                console.log('change() =>', $scope.serialno);
                ownerIndex = $window.localStorage['OwnerIndex']; 
                orderIndex = $window.localStorage['OrderIndex']; 
                taskItemIndex = $window.localStorage['TaskItemIndex']; 
                $vm.QtyScan = $window.localStorage['QtyScan'];

                $scope.InsertSerialModal = {
                    OwnerIndex: ownerIndex,
                    OrderIndex: orderIndex,
                    TaskItemIndex: taskItemIndex,
                    SerialNo: $scope.serialno,
                    //UserID: $scope.userName,
                    UserID: localStorageService.get('userTokenStorage'),
                };
                viewModel.InsertSerial($scope.InsertSerialModal).then(function success(res) {
                    //console.log(res.data);
                    // 401: Server Error Other
                    // 402: Duplicate Serial
                    // 403: Invalid Serial
                    if(res.data.statusCode == '200'){
                        console.log(res.data.Result);
                        var countScan = res.data.result.SerialCount;
                        CheckCompleteSerial(countScan);
                    }else if(res.data.statusCode == '401'){
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information',
                            message: 'Server Error Other'
                        });
                    }else if(res.data.statusCode == '402'){
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information',
                            message: 'Duplicate Serial'
                        });
                    }else if(res.data.statusCode == '403'){
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information',
                            message: 'Invalid Serial'
                        });
                    }
                }, function error(res) {
                    console.log(res);
                });
            };


            $vm.close = function close () {
                $vm.onClose && $vm.onClose();
            };

            $scope.buttons = {
                back: true
            };
            
            $vm.GoToList = function () {
                $vm.isSerialListHide = false;
                $scope.$broadcast("initChildModal");

                
            }

            $vm.HideModal = function HideModal(){
            
                $vm.isSerialListHide = true;

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
            }

            var CheckCompleteSerial = function(QtyScan) {
                if(QtyScan != undefined)
                {
                    $vm.QtySerialScan = QtyScan;
                }else
                {
                    $vm.QtySerialScan = $vm.orderModel.Attribute.Serial.length;
                }
                $vm.QtyScan = $window.localStorage['QtyScan'];
                if(parseInt($vm.QtySerialScan) >= parseInt($vm.QtyScan))
                {
                $window.localStorage['CompleteSerial'] = "Y";
                completeSerial = true;
                }else   
                {
                $window.localStorage['CompleteSerial'] = "N";
                completeSerial = false;
                }
                
            }
            
            
            var init = function () {
                $vm.isSerialListHide = true;

                $scope.userName = localStorageService.get('userTokenStorage');
                $vm.ownerIndex = $window.localStorage['OwnerIndex']; 
                $vm.orderIndex = $window.localStorage['OrderIndex']; 
                $vm.taskItemIndex = $window.localStorage['TaskItemIndex']; 
                $vm.QtyScan = parseInt($window.localStorage['QtyScan'])
                $scope.OrderDetailModal = {
                    OwnerIndex: $vm.ownerIndex,
                    OrderIndex: $vm.orderIndex,
                    TaskItemIndex: $vm.taskItemIndex,
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