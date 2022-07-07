(function () {
    'use strict'
    app.component('loadToTruckSoList', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/LoadToTruck/component/loadToTruckSoList.html";
        },
        bindings: {
            isLoading: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: "=?",
            triggerCreate: '=?',
            isFilter: '=?',
            soList: '=?',
           

        },
        controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox,loadTruckItemFactory) {
            var $vm = this;
            var defer = {};
            var XFindItem = $filter('findItemList');
            var Progressbar = pageLoading;
            $scope.items = $scope.items || [];
            var item = $vm.searchResultModel;
            // setting column       
            $scope.soList = false;
            

            var model = $scope.filterModel;

            $vm.soList = function (param, index, truckLoadNo, documentStatus) {
                $scope.filterModel = param;
                $scope.filterModel.truckLoadNo = truckLoadNo;
                $scope.filterModel.soNo = param[index].refDocumentNo;
                $scope.filterModel.documentStatus = documentStatus;

                defer = $q.defer();
                $scope.soList = true;
                $scope.isLoading = false;
                if (param != undefined) {
                    if(truckLoadNo != undefined && param[index].refDocumentNo != undefined)
                    {
                        var model = $scope.filterModel;
                        loadTruckItemFactory.getTruckLoadCarton(param[index]).then(function (res) {
                            $vm.filterModel = res.data;
                            $vm.searchResultModel = res.data;
                        });
                        // loadTruckItemFactory.getByTruckLoadId(param.truckLoadIndex).then(function (res) {
                        //     $scope.filterModel.listLoadToTruckItemViewModel = res.data;
                            

                        // });
                    }



                    // if (!param.flagUpdate) {
                    //     if (param.goodsReceiveIndex != undefined) {
                    //         goodsReceiveItemFactory.getByGoodReceiveId(param.goodsReceiveIndex).then(function (res) {
                    //             _tempData = res.data[index];
                    //             _GR = res.data[index];
                    //             _index = index;
                    //             $scope.filterModel = res.data[index];
                    //             $scope.buttons.add = false;
                    //             $scope.buttons.update = true;
                    //         });
                    //     }
                    //     else if (param.planGoodsReceiveIndex != undefined) {
                    //         planGoodsReceiveItemFactory.getByPlanGoodReceiveId(param.planGoodsReceiveIndex).then(function (res) {
                    //             _tempData = res.data[index];
                    //             _GR = res.data[index];
                    //             _index = index;
                    //             $scope.filterModel = res.data[index];
                    //             $scope.filterModel.refDocumentNo = angular.copy(param.refDocumentNo);
                    //             $scope.filterModel.ownerIndex = angular.copy(owner);
                    //             $scope.buttons.add = false;
                    //             $scope.buttons.update = true;
                                
                    //         });
                    //     }
                    // }
                    // else {

                    //     _tempData = param;
                    //     _GR = param;
                    //     _index = index;

                    //     $scope.filterModel = param;
                    //     $scope.buttons.add = false;
                    //     $scope.buttons.update = true;
                    // }
                }
                else {
                    $scope.buttons.add = true;
                    $scope.buttons.update = false;
                }

                return defer.promise;
            };

            $scope.back = function (SoNo) {
                
                $scope.soList = false;
                //$scope.filterModel = {};
                defer.resolve(SoNo);
            }

            $scope.detectCheckAll = function () {
                if ($scope.checkAll === true) {
                    angular.forEach($vm.searchResultModel, function (v, k) {
                        $vm.searchResultModel[k].selected = true;
                    });
                } else {
                    angular.forEach($vm.searchResultModel, function (v, k) {
                        $vm.searchResultModel[k].selected = false;
                    });
                }
            }
    
            $scope.DeleteCarton = function (param) {

                var _chk = 0;
                var _itemList = $vm.searchResultModel.filter(c => c.selected);
                _itemList.forEach(function (item, key) {
                    _chk = _chk + 1;
                });
                if (_chk == 0) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: "กรุณาเลือกข้อมูล !!"
                    });
                    return;
                }

                MessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm.',
                    message: 'Do You Want to Delete Carton ?'
                }).then(function success() {
                    
                    var item = angular.copy($vm.searchResultModel);
                    var models = [];
                    angular.forEach(item, function(v,k) {
                        if(v.selected){
                            v.UserName = $scope.userName;
                            models.push(v);
                        }
                    });
                    goToDeleteCarton(models);
                });
            }
    
            
    
            function goToDeleteCarton(param) {
                var deferred = $q.defer();
                var item = { ListCartonViewModel: [] };
    
                for (let index = 0; index < param.length; index++) {
                    item.ListCartonViewModel.push(param[index]);
                }
                Progressbar.show();
                var msg = validate();
                if (msg != '') {
                    deferred.reject(msg);
                } else {
    
                    loadTruckItemFactory.deleteCarton(item).then(
                        function success(results) {
                            MessageBox.alert({
                                ok:'Close',
                                title: 'Information.',
                                message: "Delete Carton Success"
                            })
                            Progressbar.hide();
                            deferred.resolve(results);
                        },
                        function error(response) {
                            Progressbar.hide();
                            MessageBox.alert({
                                ok:'Close',
                                title: 'Information.',
                                message: "ERROR"
                            })
                            deferred.reject(response);
                        }
                    );
                    $scope.back();
                }
                return deferred.promise;
            }
    



            var MessageBox = dpMessageBox;

            function validate(param) {
                var msg = "";
                return msg;
            }


            var initForm = function () {
            };
            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
            };
            init();

        }
    })
})();