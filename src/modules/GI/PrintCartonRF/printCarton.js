'use strict'
app.component('printCarton', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GI/PrintCartonRF/printCarton.html";
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
    controller: function ($scope, $filter, $q, $compile, $http, $state, pageLoading, commonService, localStorageService, $timeout, dpMessageBox, taskListFactory, cartNumberFactory) {
        var $vm = this;
        $scope.items = $scope.items || [];
        // setting column       
        $scope.filterModel = {};
        var viewModel = taskListFactory;
        var _viewModel = cartNumberFactory;
        // console.log($scope.filterModel)
        // console.log($scope.items)
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
                            dataList[i].printCarton = 0;
                            
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
                if (!element.printCarton ) {
                    element.printCarton = 0
                }
               
                return element;
                
            });

           
            confirmToPrintCarton(models).then(function success(res) {
                pageLoading.hide();
               // console.log(res)
                if(parseInt(res.data.statusCode) >= 4000 && parseInt(res.data.statusCode) <= 5999) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: res.data.statusDesc
                    });
                } else if (res.data.statusCode = 200 ) {
                    // _viewModel.checkResultCart($scope.filterModel).then(function (res) {
                          
                    $scope.datadrop.map(c => c.userName = localStorageService.get('userTokenStorage'))
                    $scope.userName = localStorageService.get('userTokenStorage');                   

                    let objitem = {};
                    objitem.item = $scope.datadrop;
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: res.data.statusDesc
                    })
                   // console.log(objitem)
                    _viewModel.cartPutToStagingV2(objitem).then(function success(res) {
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
                                $state.go('tops.put_to_staging', {
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
                            $scope.filterModel = {};
                                $state.go('tops.cart_assign_summary', {
                            })
                        }
                    })

                } else {
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
                            dataList[i].printCarton = 0
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
           // console.log($scope.filterModel)
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
                            dataList[i].printCarton = 0
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

        $scope.sum = function (data)
        {
            if(!data.printCarton )
            {
                data.confirmTagOutQty = data.confirmOld;
               
            }
            else
            {
                data.confirmTagOutQty = parseInt(data.confirmOld) + parseInt(data.printCarton);
            }
        }



        var init = function () {
            $scope.selected = 1;

            $scope.userName = localStorageService.get('userTokenStorage');
           // console.log(viewModel.getParam());
            let item = viewModel.getParam();
           // console.log(item)
            if (item != undefined) {
                $scope.datadrop = item;
                if (item[0].equipmentItem_Name != null || item[0].equipmentItem_Name != undefined) {
                    $scope.filterModel.equipmentItemName = item[0].equipmentItem_Name;
                    $scope.filterModel.equipmentName = item[0].equipment_Name;
                    $scope.filterModel.tagOutPickNo = item[0].tagOutPick_No;
                }
                else {
                    $scope.filterModel.equipmentItemName = item.equipmentItemName;
                    $scope.filterModel.equipmentName = item.equipmentName;
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