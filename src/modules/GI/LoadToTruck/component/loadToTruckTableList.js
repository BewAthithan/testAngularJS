'use strict'
app.component('loadToTruckTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GI/LoadToTruck/component/loadToTruckTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, loadTruckFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = loadTruckFactory;
        // setting column
        $scope.showColumnSetting = false;

        $vm.$onInit = function () {

        }

        $vm.triggerCreate = function () {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow().then(function (result) {
                    $vm.isFilter = true;
                    $vm.triggerSearch();
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        };

        $scope.editItem = function (param) {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow(param).then(function (result) {

                    $vm.isFilter = true;
                    $vm.triggerSearch();
                    
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        }

        $scope.comfirmItem = function (param) {
            let defer = $q.defer();

            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'Confirm ?',
                message: 'Do you want to Confirm Document Status !'
            }).then(function () {
                pageLoading.show();

                var _itemList = [];

                var isValidateMsg = '';
                if (param.dockDoorIndex == null || param.dockDoorName == '') {
                    isValidateMsg = 'กรุณาใส่ Dock door ก่อนยืนยัน';
                }

                param.documentStatus = 1;
                _itemList.push(param);

                let dataList = {
                    listTruckLoadViewModel: _itemList
                }

                if (isValidateMsg.length > 0) {
                    param.documentStatus = 0;
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: isValidateMsg
                    });
                    return;
                }
                else {
                    //param.documentStatus = 1;
                    viewModel.UpdateStatus(dataList).then(
                        function success(results) {

                            param.documentStatus = 0;
                            if(results.data.length > 0)
                            {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Validate',
                                    message: "ไม่สามารถยืนยันเอกสารได้เนื่องจากมีรายการ Carton confirm มีค่าเท่ากับ 0"
                                });
                            } else if(results.data.length == 0)
                            {
                                param.documentStatus = 1;
                            }
                            defer.resolve(results);
                        },
                        function error(response) {
                            defer.reject(response);
                        }
                    );
                }

            });

            defer.resolve();
        }

        $scope.delete = function (param) {   
            // if (param.documentStatus == 1 && param.isLoadCarton > 0) {
            //     dpMessageBox.alert({
            //         ok: 'Close',
            //         title: 'Validate',
            //         message: "เอกสารกำลังดำเนินการ  ไม่สามารถลบได้ !!"
            //     });
            //     return;
            // }

            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'InformaTion',
                message: 'Do you want to Cancel ?'
            }).then(function success() {
                viewModel.getDelete(param.truckLoadIndex).then(function success(res) {
                    if(res.data == 'E')
                    {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: "เอกสารกำลังดำเนินการ  ไม่สามารถลบได้ !!"
                        });
                        return;
                    }
                    $vm.triggerSearch();
                }, function error(res) { });
            });
        };


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



        $scope.showColumnSetting = false;
        var _header = [
            { name: "Owner Type Status", show: true },
            { name: "Owner Name", show: true },



        ];

        $scope.toggleSetting = function () {
            $scope.showColumnSetting = $scope.showColumnSetting === false ? true : false;
        };


        const _storageName = 'domestic-plantselected-tbl';
        $scope.column = {
            toggleSetting: function () {
                $scope.showColumnSetting = $scope.showColumnSetting === false ? true : false;
                // if( $scope.showReset = $scope.showReset === false ? true : false){

                //     $scope.column.reset();
                // }
            },
            update: function () {
                let obj = $scope.tblHeader;
                localStorageService.set(_storageName, obj);
            },
            reset: function () {

                $scope.column.getConfig();
            },
            getConfig: function () {

                let config = localStorageService.get(_storageName);

                $scope.tblHeader = angular.copy(_header);
            }
        };
        $scope.$watch('tblHeader', function (n, o) {
            if (n) {
                localStorageService.set(_storageName, n);
            }
        }, true);

        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }


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


        $scope.confirm_Status = function () {
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

            let defer = $q.defer();
            let models = $vm.searchResultModel;

            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'Confirm ?',
                message: 'Do you want to Confirm load !'
            }).then(function () {
                pageLoading.show();
                ConfirmStatus(models).then(function success(res) {
                    var msgAlert = '';
                    console.log("load to truck - res", res);
                    if(res.data.statusCode == 200 || res.data.statusCode == "200") {
                        console.log("200");
                        msgAlert += res.data.statusDesc;
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information',
                            message: msgAlert
                        });
                    } else if(res.data.statusCode == 410 || res.data.statusCode == "410") {
                        console.log("410");
                        msgAlert += res.data.statusDesc + " ";
                        msgAlert += res.data.result[0].truckLoadNo + " ";
                        msgAlert += res.data.result[0].planGoodsIssueNo + " ";
                        msgAlert += res.data.result[0].tagOutPickNo + " ";
                        msgAlert += "ยังคงเหลือ carton จำนวน " + res.data.result[0].isCartonLoadQty + " ที่ยังไม่ถูก Scan";
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information',
                            message: msgAlert
                        });
                    } else if(res.data.statusCode == 415 || res.data.statusCode == "415") {
                        console.log("415");
                        msgAlert += res.data.statusDesc;
                        msgAlert += " order: " + res.data.result[0].orderNo;
                        msgAlert += " product id: " + res.data.result[0].productId;
                        msgAlert += " จำนวน cancel: " + res.data.result[0].cancelledQty;
                        msgAlert += " จำนวนที่เคลียร์: " + res.data.result[0].clearQty + " ";
                        msgAlert += res.data.result[0].uomCancelled;
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information',
                            message: msgAlert
                        });
                    } else if(res.data.statusCode == 409 || res.data.statusCode == "409"){
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information',
                            message: res.data.statusDesc
                        });
                    }
                    pageLoading.hide();
                }, function error(param) {
                    dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                });
            });

            defer.resolve();
        }

        function ConfirmStatus(item) {
            let deferred = $q.defer();
            let userName = $scope.$parent.$parent.component.userName;
            let param = "";
            if (item.length > 0) {
                var Activity = [];
                for (var i = 0; i <= item.length - 1; i++) {
                    let newItem = {};
                    if (item[i].selected == true) {

                        if(item[i].documentStatus == 0)
                        {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Validate',
                                message: "กรุณา Confirm Plan Load ก่อน Confirm Load"
                            });
                            return;
                        }

                        newItem.createBy = userName;
                        newItem.documentStatus = 2;
                        newItem.truckLoadIndex = item[i].truckLoadIndex;
                        newItem.truckLoadNo = item[i].truckLoadNo;
                        newItem.updateBy = userName;
                    }
                    else {
                        newItem.emtry = 1;
                    }
                    if (newItem.emtry != 1) {
                        Activity.push(newItem);
                    }
                }
            }
            if (Activity) {
                param = Activity;
            }
            let dataList = {
                listTruckLoadViewModel: param
            }

            viewModel.UpdateStatus(dataList).then(
                function success(results) {
                    deferred.resolve(results);
                },
                function error(response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;
        }

        function validate(param) {
            var msg = "";
            return msg;
        }

        function validate(param) {
            var msg = "";
            return msg;
        }

        $scope.changeTableSize = function () {
            var p = {
                currentPage: 0, //$scope.pagging.num,
                perPage: $vm.filterModel.perPage
            };
            $vm.filterModel.perPage = $vm.filterModel.perPage;
            $scope.changePage();
        };


        $scope.changePage = function () {
            var page = $vm.filterModel;

            var all = {
                currentPage: 0,
                perPage: 0
            };
            if ($vm.filterModel.currentPage != 0) {
                page.currentPage = page.currentPage;
            }
            $scope.serchPage(page);
        }

        $scope.pageOption = [
            { value: 30 },
            { value: 50 },
            { value: 100 },
            { value: 500 }
        ];

        $scope.serchPage = function (param) {
            viewModel.search(param).then(function success(res) {
                $vm.filterModel.totalRow = res.data.pagination.totalRow;
                $vm.filterModel.currentPage = res.data.pagination.currentPage;
                $vm.filterModel.perPage = res.data.pagination.perPage;
                $vm.filterModel.numPerPage = res.data.pagination.perPage;
                $vm.searchResultModel = res.data.items;
            }, function error(res) { });
        }

        $scope.autoComplete = {
            material: 'domesticDeliveryPlan/MaterialCode/',
            suggestionTrucktype: 'domesticPlantSelected/SuggestTrucktype/',
        }

        $scope.popupReport = {
            onShow: false,
            delegates: {},
            onClick: function (param) {
                $scope.popupReport.onShow = !$scope.popupReport.onShow;
                $scope.popupReport.delegates.reportPopup(param.truckLoadNo, "loadmanifest");
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

        $scope.popupReportCheck = {
            onShow: false,
            delegates: {},
            onClick: function (param) {
                console.log(param);
                $scope.popupReport.onShow = !$scope.popupReport.onShow;
                $scope.popupReport.delegates.reportPopup(param.truckLoadNo, "reportcheck100");
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

        $scope.autoLoad = function (params,index) {
            
            let body = { TruckLoadIndex: params.truckLoadIndex, UserId: localStorageService.get('userTokenStorage') }
            console.log(body);
            viewModel.loadTruckLoadCarton(body).then(function success(res) {
                if(res.data == "S"){
                    $vm.searchResultModel[index].isLoadCarton = 1;
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Infomation',
                        message: 'Success !'
                    })
                }else{
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Infomation',
                        message: 'Error !'
                    })
                }
            });
        }

        var initForm = function () {
        };
        var init = function () {
            $scope.column.getConfig();
            //initForm();
            //loadConfig();
            //$scope.listviewFunc.filter();
            // example data
        };
        init();

    }
});