'use strict'
app.component('scanTaskConfrimCarton', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GI/ScanTaskConfrimCarton/ScanTaskConfrimCarton.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        itemList: '=?'

    },
    controller: function ($scope, $filter, $q, $compile, $http, $state, pageLoading, commonService, localStorageService, $timeout, dpMessageBox, scanTaskDropFactory, scanTaskFactory) {
        var $vm = this;
        $scope.items = $scope.items || [];
        // setting column       
        $scope.filterModel = {};
        var viewModel = scanTaskDropFactory;
        var _viewModel = scanTaskFactory;

        $scope.searchData = function () {
            $scope.filterModel = $scope.filterModel || {};
            pageLoading.show();

            viewModel.PrintCartonRF($scope.filterModel).then(function success(res) {
                pageLoading.hide();
                if (res.data.length > 0) {

                    $vm.itemList = res.data;
                    let dataList = $vm.itemList;
                    for (var i = 0; i <= dataList.length - 1; i++) {

                        if (dataList[i].confirmTagOutQty == null || dataList[i].confirmTagOutQty == 0) {
                            dataList[i].confirmTagOutQty = 1;
                        }

                        if (dataList[i].suggestLocationName != undefined) {
                            $scope.filterModel.locationName = dataList[i].suggestLocationName;
                        }
                        else {
                            $scope.filterModel.locationName = res.data[0].suggestLocationName;
                        }
                        if (dataList[i].printCarton == null || dataList[i].printCarton == 0) {
                            dataList[i].printCarton = null;

                            dataList[i].updateBy = $scope.userName;
                        }
                        //dataList[i].confirmTagOutQty = 1;
                        //dataList[i].printCarton = 0;
                        dataList[i].updateBy = $scope.userName;
                        dataList[i].confirmOld = dataList[i].confirmTagOutQty;


                    }

                    $scope.filterModel.equipmentItemName = res.data[0].equipmentItemName;
                    $scope.filterModel.planGoodsIssueNo = res.data[0].PlanGoodsIssueNo;
                    $scope.filterModel.equipmentName = res.data[0].equipmentName;


                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: " Data Error !!"
                    })
                }
            },
                function error(res) {

                });
        }

        $scope.Confirm = function () {
            var defer = $q.defer();
            let models = {
                list: $vm.itemList
            };
            //models.list.push($vm.itemList);
            // dpMessageBox.confirm({
            //     ok: 'Yes',
            //     cancel: 'No',
            //     title: 'Confirm ?',
            //     message: 'Do you want to Confirm ?'
            // }).then(function () {

            // });
            pageLoading.show();

            models.list.map(function (element) {
                if (element.printCarton == null) {
                    element.printCarton = 0
                }
                return element;
            });
            confirmToPrintCarton(models).then(function success(res) {
                pageLoading.hide();
                // dpMessageBox.alert({
                //     ok: 'Close',
                //     title: 'Information.',
                //     message: "Print Carton Complete"
                // })     
                if (res.data == true) {
                    // _viewModel.checkResultCart($scope.filterModel).then(function (res) {
                    $scope.datadrop.map(c => c.userName = localStorageService.get('userTokenStorage'))
                    let objitem = {};
                    objitem.item = $scope.datadrop;
                    _viewModel.cartPutToStaging(objitem).then(function success(res) {
                        if (res.data.msgResult == "Drop") {
                            var dataItem = res.data.itemResult;
                            if (dataItem != undefined) {
                                // dpMessageBox.confirm({
                                //     ok: 'Yes',
                                //     cancel: 'No',
                                //     title: 'Confirm',
                                //     message: "Print Carton Complete !!"
                                // }).then(function success() {         
                                //     _viewModel.setParam(dataItem);
                                //     $state.go('tops.put_to_staging', {
                                //     })
                                // })
                                $scope.filterModel = {};
                                _viewModel.setParam(dataItem);
                                $state.go('tops.scan_task_drop', {
                                })
                            }
                            else {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: " Confirm Print Carton Not Complete !!"
                                })
                            }
                        }
                        else {
                            if (!$scope.filterModel.equipmentName) {
                                $scope.filterModel = {};
                                $state.go('tops.assign_task', {
                                })
                            }
                            else{
                                $scope.filterModel = {};
                                $state.go('tops.assign_cart', {
                                })
                            }
                         
                        }
                    })

                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "Print Carton Error !!"
                    })
                }
            }, function error(param) {

            });

            defer.resolve();
        }

        $scope.filterModel = {
            locationName: "",
            equipmentItemName: "",
            tagOutPickNo: ""
        };

        $scope.ScanLocation = function () {
            let deferred = $q.defer();
            $scope.filterModel.tagOutPickNo = "";
            viewModel.filterPickTicket($scope.filterModel).then(function success(res) {
                if (res.data.length > 0) {
                    $vm.itemList = res.data;
                    $scope.filterModel.locationName = res.data[0].suggestLocationName;
                    //$scope.filterModel.equipmentItemName = res.data[0].equipmentItemName;
                    if ($scope.filterModel.equipmentItemName != "") {
                        $scope.filterModel.equipmentItemName;
                    }
                    else {
                        $scope.filterModel.equipmentItemName = "";
                    }

                    $scope.filterModel.equipmentName = res.data[0].equipmentName;
                    //$scope.filterModel.tagOutPickNo = res.data[0].tagOutPickNo;
                    let dataList = $vm.itemList;
                    for (var i = 0; i <= dataList.length - 1; i++) {
                        if (dataList[i].confirmTagOutQty == null || dataList[i].confirmTagOutQty == 0) {
                            dataList[i].confirmTagOutQty = 1;
                            dataList[i].updateBy = $scope.userName;
                        }
                        if (dataList[i].printCarton == null || dataList[i].printCarton == 0) {
                            dataList[i].printCarton = null;
                            dataList[i].updateBy = $scope.userName;
                        }
                        //dataList[i].confirmTagOutQty = 1;
                        //dataList[i].printCarton = 0;
                        dataList[i].confirmOld = dataList[i].confirmTagOutQty;
                    }
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: " Location Not Found !!!"
                    })
                }
            },
                function error(response) {
                    deferred.reject(response);
                }
            );
        }
        $scope.ScanTicket = function () {
            let deferred = $q.defer();
            $scope.filterModel = $scope.filterModel;
            viewModel.filterPickTicket($scope.filterModel).then(function success(res) {

                if (res.data.length > 0) {
                    $vm.itemList = res.data;
                    $scope.filterModel.locationName = res.data[0].suggestLocationName;
                    //$scope.filterModel.equipmentItemName = res.data[0].equipmentItemName;
                    if ($scope.filterModel.equipmentItemName != "") {
                        $scope.filterModel.equipmentItemName;
                    }
                    else {
                        $scope.filterModel.equipmentItemName = "";
                    }
                    $scope.filterModel.equipmentName = res.data[0].equipmentName;
                    $scope.filterModel.tagOutPickNo = "";
                    let dataList = $vm.itemList;
                    for (var i = 0; i <= dataList.length - 1; i++) {
                        if (dataList[i].confirmTagOutQty == null || dataList[i].confirmTagOutQty == 0) {
                            dataList[i].confirmTagOutQty = 1;
                            dataList[i].updateBy = $scope.userName;
                        }
                        if (dataList[i].printCarton == null || dataList[i].printCarton == 0) {
                            dataList[i].printCarton = null;
                            dataList[i].updateBy = $scope.userName;
                        }
                        // dataList[i].confirmTagOutQty = 1;
                        //dataList[i].printCarton = 0;

                        dataList[i].confirmOld = dataList[i].confirmTagOutQty;

                    }

                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: " Pick Ticket Not Found !!!"
                    })
                    $vm.itemList = res.data;
                }
            },
                function error(response) {
                    deferred.reject(response);
                }
            );
        }
        function confirmToPrintCarton(item) {
            let deferred = $q.defer();
            viewModel.confirmPrintCarton(item).then(
                function success(results) {
                    deferred.resolve(results);
                },
                function error(response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;
        }

        $scope.clearSearch = function () {
            $scope.filterModel = {};
            $state.reload();
            // var _viewModel = cartNumberFactory;
            // let item = "";
            // _viewModel.setParam(item);
            // pageLoading.show();
            // $state.go('tops.put_to_staging', {
            // })
        }

        $scope.selectedTab = function (tab) {
            if (tab == 1) {
                $scope.colortab1 = "#FDFEFE";
                $scope.colortab2 = "#D3D3D3";
            }
            else if (tab == 2) {
                $scope.colortab1 = "#D3D3D3";
                $scope.colortab2 = "#FDFEFE";
            }
            $scope.selected = tab;
        }

        $scope.sum = function (data) {
            if (data.printCarton == "") {
                data.confirmTagOutQty = data.confirmOld;
            }
            else {
                data.confirmTagOutQty = parseInt(data.confirmOld) + parseInt(data.printCarton);
            }
        }

        $scope.RePrint = function () {
            var defer = $q.defer();

            pageLoading.show();

            if (!$vm.itemList) {
                return dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Information.',
                    message: " Please enter Pick Ticket"
                })
            }
            else if ($vm.itemList.length == 0) {
                return dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Information.',
                    message: " Please enter Pick Ticket"
                })
            }

            if ($vm.itemList[0].tagOutPick_No) {
                return dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Information.',
                    message: " Please enter Pick Ticket"
                })
            }

            viewModel.rePrint($vm.itemList[0]).then(
                function success(results) {

                    pageLoading.hide();
                    if (res.data == true) {
                        // _viewModel.checkResultCart($scope.filterModel).then(function (res) {
                        $scope.datadrop.map(c => c.userName = localStorageService.get('userTokenStorage'))
                        let objitem = {};
                        objitem.item = $scope.datadrop;
                        _viewModel.cartPutToStaging(objitem).then(function success(res) {
                            if (res.data.msgResult == "Drop") {
                                var dataItem = res.data.itemResult;
                                if (dataItem != undefined) {
                                    $scope.filterModel = {};
                                    _viewModel.setParam(dataItem);
                                    $state.go('tops.scan_task_drop', {
                                    })
                                }
                                else {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        message: " Confirm Print Carton Not Complete !!"
                                    })
                                }
                            }
                            else {
                                if (!$scope.filterModel.equipmentName) {
                                    $scope.filterModel = {};
                                    $state.go('tops.assign_task', {})
                                }
                                else {
                                    $scope.filterModel = {};
                                    $state.go('tops.assign_cart', {})
                                }
                            }
                        })

                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Print Carton Error !!"
                        })
                    }
                }, function error(param) {

                });

            defer.resolve();
        }


        var init = function () {
            $scope.selected = 1;

            $scope.userName = localStorageService.get('userTokenStorage');
            let item = viewModel.getParam();
            if (item != undefined) {
                $scope.datadrop = item;
                if (item[0].task_Index != null) {
                    $scope.filterModel.taskIndex = item[0].task_Index;
                    $scope.filterModel.equipmentName = item[0].equipment_Name;
                    $scope.filterModel.tagOutPickNo = item[0].tagOutPick_No;
                }
                else {
                    // $scope.filterModel.equipmentItemName = item.equipmentItemName;
                    $scope.filterModel.taskIndex = item.task_Index;
                    $scope.filterModel.locationName = item.stagingLocation;
                }

                $scope.searchData();
            }
            else {
                pageLoading.hide();
            }
        };
        init();

    }
});