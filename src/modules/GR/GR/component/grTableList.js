'use strict'
app.component('grTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GR/GR/component/grTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, goodsReceiveFactory, goodsReceiveItemFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = goodsReceiveFactory;
        // setting column
        $scope.showColumnSetting = false;
        $scope.goodReceiveDisable = false;

        $vm.$onInit = function () {

        }

        $vm.triggerCreate = function () {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow().then(function (result) {
                    $vm.isFilter = true;

                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        };

        $scope.editItem = function (param) {
            viewModel.getId(param.goodsReceiveIndex).then(function (res) {

                if (res.data.userAssign == "" || res.data.userAssign == undefined
                    || res.data.userAssign == null || res.data.userAssign == $scope.userName) {
                    param.UserAssign = $scope.userName;
                    viewModel.updateUserAssign(param).then(function (res) {
                        if ($scope.onShow) {
                            $vm.isFilter = false;
                            $scope.onShow(param).then(function (result) {
                                $vm.isFilter = true;
                            }).catch(function (error) {
                                defer.reject({ 'Message': error });
                            });
                        }
                    });
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'InformaTion',
                        message: 'มี User อื่นทำอยู่ จะ ทำแทน หรือไม่ ?'
                    }).then(function success() {
                        param.UserAssign = $scope.userName;
                        viewModel.updateUserAssign(param).then(function (res) {
                            if ($scope.onShow) {
                                $vm.isFilter = false;
                                $scope.onShow(param).then(function (result) {
                                    $vm.isFilter = true;
                                }).catch(function (error) {
                                    defer.reject({ 'Message': error });
                                });
                            }
                        }, function error(res) { });
                    });
                }
            });
        }

        $scope.getColour = function (param) {
            if (param == '1' || param == '-1')
                return '#C6C0C0';
        }


        var MessageBox = dpMessageBox;
        $scope.dragHead = '';
        $scope.dragImageId = "dragtable";
        $scope.revisionList = {};
        $scope.handleDrop = function (draggedData, targetElem) {

            var swapArrayElements = function (array_object, index_a, index_b) {
                var temp = array_object[index_a];
                array_object[index_a] = array_object[index_b];
                array_object[index_b] = temp;
            };
            var srcInd = $scope.tblHeader.findIndex(x => x.name === draggedData);
            var destInd = $scope.tblHeader.findIndex(x => x.name === targetElem.textContent);
            swapArrayElements($scope.tblHeader, srcInd, destInd);
        };
        $scope.handleDrag = function (columnName) {
            $scope.dragHead = columnName.replace(/["']/g, "");
        };

        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }
        $scope.pageMode = 'Master';

        var init = function () {
            if ($scope.config.pageMode == "Search") {
                $scope.pageMode = "Search";
            }
        }


        $scope.toggleSetting = function () {
            $scope.showColumnSetting = $scope.showColumnSetting === false ? true : false;
        };




        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }


        $scope.model = {
            currentPage: $vm.filterModel.currentPage + 1,
            perPage: $vm.filterModel.perPage,
            totalRow: 0,
            advanceSearch: false
        };

        $scope.calColor = function (value) {
            // if (isNumber(value)) {
            //     if (value > 10) return '#C1FDC2';
            //     else if (value > 0) return '#FBFDC0';
            //     else return '#FF7777';
            // }
            if (value) {
                if (value > 10) return '#C1FDC2';
                else if (value > 0) return '#FBFDC0';
                else return '#FF7777';
            }

            return '';
        };

        // coload toggle
        $scope.showCoload = false;


        $scope.delete = function (param) {
            if (param.documentStatus != 1) {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'InformaTion',
                    message: 'Do you want to Cancel ?'
                }).then(function success() {

                    param.cancel_By = localStorageService.get('userTokenStorage');
                    viewModel.getDelete(param).then(function success(res) {
                        $vm.triggerSearch();
                    }, function error(res) { });
                });
            }
            else {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Alert',
                    message: 'ไม่สามารถลบออเดอร์ที่ยืนยันแล้วได้'
                })
            }
        };

        $scope.GoodsReceiveConfirm = function (param, index) {           
            viewModel.checkUserAssign(param).then(function (data) {
                if (data.data == "" || data.data == $scope.userName) {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'InformaTion',
                        message: 'Do you want to Confirm ?'
                    }).then(function success() {
                        param.isConfirmPartialReceive = null;
                        param.create_By = localStorageService.get('userTokenStorage');
                        viewModel.GoodsReceiveConfirm(param).then(function success(res) {
                            if(res.data.statusCode == "210")
                            {
                                document.getElementById('confirm_receiving_btn').click();
                                $scope.confirmReceiving = function(isPartial) {
                                   document.getElementById('close_confirm_receiving').click();
                                   param.isConfirmPartialReceive = isPartial;
                                   viewModel.GoodsReceiveConfirm(param).then(function success(res) {
                                       if(res.data.statusCode == "200")
                                       {
                                           dpMessageBox.alert({
                                               ok: 'Yes',
                                               title: 'Confirm Receive',
                                               message: 'Confirm Receiving Success !'
                                           });     
                                           $vm.searchResultModel[index].documentStatus = -1;
                                       }
                                       else if(res.data.statusCode == "410")
                                       {
                                           dpMessageBox.alert({
                                               ok: 'Yes',
                                               title: 'Confirm Receive',
                                               message: 'ไม่สามารถ Confirm Receiving ได้!'
                                           });
                                       }
                                   });
                                }
                            }
                            else if(res.data.statusCode == "200")
                            {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Confirm Receive',
                                    message: 'Confirm Receiving Success !'
                                });    
                                $vm.searchResultModel[index].documentStatus = -1;
                            }
                            else if(res.data.statusCode == "410")
                            {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Confirm Receive',
                                    message: 'ไม่สามารถ Confirm Receiving ได้!'
                                });
                            }
                            else
                            {
                                dpMessageBox.confirm({
                                    ok: 'Yes',
                                    title: 'ต้องการรับสินค้าหรือไม่',
                                    messageNewLine: contentArr
                                }).then(function success() {
                                    $scope.popupReason.onClick(param);
                                });                   
                            }
                        }, function error(res) { });
                    });
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'InformaTion',
                        message: 'มี User อื่นทำการ Scan Receive อยู่ ต้องการ Confirm Receive หรือไม่'
                    }).then(function success() {
                        param.isConfirmPartialReceive = null;
                        param.create_By = localStorageService.get('userTokenStorage');
                        viewModel.GoodsReceiveConfirm(param).then(function success(res) {
                            if(res.data.statusCode == "210")
                            {
                                document.getElementById('confirm_receiving_btn').click();
                                $scope.confirmReceiving = function(isPartial) {
                                   document.getElementById('close_confirm_receiving').click();
                                   param.isConfirmPartialReceive = isPartial;
                                   viewModel.GoodsReceiveConfirm(param).then(function success(res) {
                                    if(res.data.statusCode == "200")
                                    {
                                        dpMessageBox.alert({
                                            ok: 'Yes',
                                            title: 'Confirm Receive',
                                            message: 'Confirm Receiving Success !'
                                        });      
                                        $vm.searchResultModel[index].documentStatus = -1;
                                    }
                                    else if(res.data.statusCode == "410")
                                    {
                                        dpMessageBox.alert({
                                            ok: 'Yes',
                                            title: 'Confirm Receive',
                                            message: 'ไม่สามารถ Confirm Receiving ได้!'
                                        });
                                    }
                                   });
                                }
                            }
                            else if(res.data.statusCode == "200")
                            {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Confirm Receive',
                                    message: 'Confirm Receiving Success !'
                                });    
                                $vm.searchResultModel[index].documentStatus = -1;  
                            }
                            else if(res.data.statusCode == "410")
                            {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Confirm Receive',
                                    message: 'ไม่สามารถ Confirm Receiving ได้!'
                                });
                            }
                            else
                            {
                                dpMessageBox.confirm({
                                    ok: 'Yes',
                                    title: 'ต้องการรับสินค้าหรือไม่',
                                    messageNewLine: contentArr
                                }).then(function success() {
                                    $scope.popupReason.onClick(param);
                                });                   
                            }
                        }, function error(res) { });
                    });
                }
            });
        };

        $scope.AutoScanReceive = function (model) {
            $scope.model.GoodsReceiveIndex = model.goodsReceiveIndex;
            $scope.model.MFGDate = "19000101";
            $scope.model.EXPDate = "19000101";

            var param = $scope.model;
            if (model.documentStatus == "1") {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Auto Receive',
                    message: 'Do you want to Auto ScanReceive ?'
                }).then(function success() {

                    param.createBy = localStorageService.get('userTokenStorage');
                    param.updateBy = localStorageService.get('userTokenStorage');
                    viewModel.AutoScanReceive(param).then(function success(res) {

                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Auto Receive',
                            message: res.data
                        }); 
                        $vm.triggerSearch($vm.filterModel);

                    }, function error(res) { });
                });
            }
            else {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Confirm Status',
                    message: 'กรุณาทำการ Confirm Document !'
                })
            }
        };

        $scope.comfirmStatus = function (param) {
            if (param.documentStatus == 0)
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm Status',
                    message: 'Do you want to Confirm ?'
                }).then(function success() {

                    param.update_By = localStorageService.get('userTokenStorage');
                    viewModel.confirmStatus(param).then(function success(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Confirm Document',
                            message: 'Confirm Document Success !'
                        });
                        $vm.triggerSearch();

                    }, function error(res) { });
                });
            else
                dpMessageBox.alert({
                    ok: 'Yes',
                    title: 'Confirm Status',
                    message: 'Status has been Confirmed !!!'
                })
        };


        $scope.popupReport = {
            onShow: false,
            delegates: {},
            onClick: function (param) {
                $scope.popupReport.onShow = !$scope.popupReport.onShow;
                $scope.popupReport.delegates.reportPopup(param.goodsReceiveNo, "goodsreceiveNote");
            },
            config: {
                title: "ReportView"
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (param) {
                }
            }
        };

        $scope.changeTableSize = function () {
            var p = {
                currentPage: 0, //$scope.pagging.num,
                perPage: $vm.filterModel.perPage
            };
            $vm.filterModel.perPage = $vm.filterModel.perPage;
            $scope.changePage();
        };

        $vm.filterModel = {
            num: 1,
            totalRow: 0,
            currentPage: 1,
            maxSize: 10,
            perPage: $vm.filterModel.perPage,
        };

        $scope.changePage = function () {
            $vm.filterModel.productIndex = ($vm.filterModel.productName === undefined || $vm.filterModel.productName == "") ? $vm.filterModel.productIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.productIndex;
            $vm.filterModel.documentTypeIndex = ($vm.filterModel.documentTypeName === undefined || $vm.filterModel.documentTypeName == "") ? $vm.filterModel.documentTypeIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.documentTypeIndex;
            $vm.filterModel.ownerIndex = ($vm.filterModel.ownerName === undefined || $vm.filterModel.ownerName == "") ? $vm.filterModel.ownerIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.ownerIndex;
            $vm.filterModel.processStatusIndex = ($vm.filterModel.processStatusName === undefined || $vm.filterModel.processStatusName == "") ? $vm.filterModel.processStatusIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.processStatusIndex;
            $vm.filterModel.warehouseIndex = ($vm.filterModel.warehouseName === undefined || $vm.filterModel.warehouseName == "") ? $vm.filterModel.warehouseIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.warehouseIndex;
            $vm.filterModel.warehouseIndexTo = ($vm.filterModel.warehouseNameTo === undefined || $vm.filterModel.warehouseNameTo == "") ? $vm.filterModel.warehouseIndexTo = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.warehouseIndexTo;
            $vm.filterModel.documentStatus = ($vm.filterModel.processStatusName === undefined || $vm.filterModel.processStatusName == "") ? $vm.filterModel.documentStatus = null : $vm.filterModel.documentStatus;
            $vm.filterModel.RefDocumentindex = ($vm.filterModel.RefDocumentNo === undefined || $vm.filterModel.RefDocumentNo == "") ? $vm.filterModel.RefDocumentindex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.RefDocumentindex;
            $vm.filterModel.planGoodsReceiveIndex = ($vm.filterModel.planGoodsReceiveNo === undefined || $vm.filterModel.planGoodsReceiveNo == "") ? $vm.filterModel.planGoodsReceiveIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.planGoodsReceiveIndex;
            $vm.filterModel.dockDoorIndex = ($vm.filterModel.dockDoorName === undefined || $vm.filterModel.dockDoorName == "") ? $vm.filterModel.dockDoorIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.dockDoorIndex;
            $vm.filterModel.vehicleTypeIndex = ($vm.filterModel.vehicleTypeName === undefined || $vm.filterModel.vehicleTypeName == "") ? $vm.filterModel.vehicleTypeIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.vehicleTypeIndex;
            $vm.filterModel.containerTypeIndex = ($vm.filterModel.containerTypeName === undefined || $vm.filterModel.containerTypeName == "") ? $vm.filterModel.containerTypeIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.containerTypeIndex;
            // $vm.filterModel.goodsReceiveDate = ($scope.filterModel.goodsReceiveDate === undefined || $scope.filterModel.goodsReceiveDate == null) ? $scope.filterModel.goodsReceiveDate : getToday();
            var page = $vm.filterModel;
            
            var all = {
                currentPage: 0,
                perPage: 0
            };
            if ($vm.filterModel.currentPage != 0) {
                page.currentPage = page.currentPage;
            }
            serchPage(page);
        }
        function serchPage(data) {       
                 
            if (data != null) {
                
                pageLoading.show();
                viewModel.grSearch(data).then(function (res) {
                    pageLoading.hide();
                    
                    if (res.data.length != 0 && res.data.length != undefined) {
                        $vm.filterModel.totalRow = res.data[0].count;
                        $vm.searchResultModel = res.data;

                    }
                    else {
                        if (res.data.pagination != null) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.currentPage = res.data.pagination.currentPage;
                            $vm.searchResultModel = res.data.itemsGR;

                        }
                    }
                })
            }
        }

        $scope.popupReason = {
            onShow: false,
            delegates: {},
            onClick: function (param) {
                $scope.popupReason.onShow = !$scope.popupReason.onShow;
                $scope.popupReason.delegates.popupReason(param);
            },
            config: {
                title: "ReportView"
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (item, param) {
                    let data = angular.copy(item);
                    data.ReasonCodeIndex = param.reasonCodeIndex
                    data.ReasonCodeId = param.reasonCodeId;
                    data.ReasonCodeName = param.reasonCodeName;
                    data.create_By = localStorageService.get('userTokenStorage');
                    viewModel.GoodsReceiveConfirm(data).then(function success(res) {
                        if(res.data == "false")
                        {
                            dpMessageBox.alert({
                                ok: 'Yes',
                                title: 'Confirm Receive',
                                message: 'ไม่สามารถ Confirm Receiving ได้!'
                            });
                            $vm.triggerSearch($vm.filterModel);
                        }
                        else if(res.data == "true")
                        {
                            dpMessageBox.alert({
                                ok: 'Yes',
                                title: 'Confirm Receive',
                                message: 'Confirm Receiving Success !'
                            });                               
                            $vm.triggerSearch($vm.filterModel);
                        }
                        else
                        {
                            dpMessageBox.confirm({
                                ok: 'Yes',
                                title: 'ต้องการรับสินค้าหรือไม่',
                                messageNewLine: res.data.split(',')
                            }).then(function success() {
                                $scope.popupReason.onClick(param);
                            });                               
                        }
                        
                    }, function error(res) { });
                }
            }
        };

        $scope.pageOption = [
            { value: 30 },
            { value: 50 },
            { value: 100 },
            { value: 500 }
        ];

        function getToday() {
            var today = new Date();

            var mm = today.getMonth() + 1;
            var yyyy = today.getUTCFullYear();
            var dd = today.getDate();


            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;

            return yyyy.toString() + mm.toString() + dd.toString();
        }


        function validate(param) {
            var msg = "";
            return msg;
        }
        var initForm = function () {
        };

        
        var init = function () {
            $scope.userName = localStorageService.get('userTokenStorage');
            //initForm();
            //loadConfig();
            //$scope.listviewFunc.filter();
            // example data
        };
        init();

    }
});