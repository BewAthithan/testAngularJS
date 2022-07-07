(function () {
    'use strict'

    app.component('grForm', {
        controllerAs: '$vm',
        templateUrl: "modules/GR/GR/component/grForm.html",
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
        },
        controller: function ($scope, $state, $q, pageLoading, dpMessageBox, goodsReceiveFactory, localStorageService, goodsReceiveItemFactory, planGoodsReceiveItemFactory, ownerFactory, $window) {
            var $vm = this;

            var defer = {};
            var viewModel = goodsReceiveFactory;
            var ownerModel = ownerFactory;
            $scope.filterModel = {};
            $scope.filterModel.listGoodsReceiveItemViewModels = [];

            $vm.isFilterTable = true;
            $scope.onShow = false;

            //Component life cycle


            $vm.onShow = function (param) {

                defer = $q.defer();
                if ($scope.filterModel != null) {
                    // $scope.filterModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    viewModel.getId(param.goodsReceiveIndex).then(function (res) {

                        $scope.filterModel = res.data;
                        $scope.buttons.add = false;
                        $scope.buttons.update = true;
                        $scope.filterModel.planGoodsReceiveNo = $scope.filterModel.refDocumentNo;


                        if ($scope.filterModel.documentStatus == 1 || $scope.filterModel.documentStatus == -1 || $scope.filterModel.documentStatus == 2 || $scope.filterModel.documentStatus == 3)
                            $scope.buttons.update = false;

                        goodsReceiveItemFactory.getByGoodReceiveId(param.goodsReceiveIndex).then(function (res) {
                            let CountTotalQty = 0
                            $scope.filterModel.listGoodsReceiveItemViewModels = res.data;

                            for (let index = 0; index < $scope.filterModel.listGoodsReceiveItemViewModels.length; index++) {
                                CountTotalQty += $scope.filterModel.listGoodsReceiveItemViewModels[index].qty;
                                $scope.filterModel.listGoodsReceiveItemViewModels[index].RefDocumentNo = $scope.filterModel.listGoodsReceiveItemViewModels[index].RefDocumentNo;
                            }
                            $scope.filterModel.CountTotalQty = CountTotalQty;
                        });
                    });
                }
                else {
                    $scope.buttons.add = true;
                    if ($scope.buttons.add) {
                        ownerModel.popupSearch({}).then(function (res) {
                            let owner = res.data.find(function (value) {
                                return value.ownerIndex.toUpperCase() == "8B8B6203-A634-4769-A247-C0346350A963";
                            })
                            $scope.filterModel.ownerId = localStorageService.get('ownerVariableId');
                            $scope.filterModel.ownerIndex = localStorageService.get('ownerVariableIndex');
                            $scope.filterModel.ownerName = localStorageService.get('ownerVariableName');
                            $scope.filterModel.ownerNameTemp = localStorageService.get('ownerVariableName');
                        })
                    }
                    $scope.buttons.update = false;
                }
                return defer.promise;
            };


            $vm.addItem = function (param, index, owner) {
                var owner = $scope.filterModel.ownerIndex;
                if ($scope.isLoading) {
                    $vm.isFilterTable = false;
                    $scope.isLoading(param, index, owner).then(function (result) {


                        $vm.isFilterTable = true;
                        $scope.filterModel.listGoodsReceiveItemViewModels = $scope.filterModel.listGoodsReceiveItemViewModels || []
                        if (result != '-99') {

                            if (result.goodsReceiveIndex == undefined)
                                result.flagUpdate = true;

                            $scope.filterModel.listGoodsReceiveItemViewModels.push(angular.copy(result));
                        }
                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
                }
            }

            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.filter().then(function (res) {
                    pageLoading.hide();
                    $vm.filterModel = res.data;
                    $vm.searchResultModel = res.data;
                });
            };

            // //Clear Index           
            // $scope.$watch('filterModel.warehouseName', function () {
            //     if($scope.filterModel.warehouseName != $scope.filterModel.warehouseNameTemp)
            //     {
            //         $scope.filterModel.warehouseIndex = "";
            //         $scope.filterModel.warehouseId = "";
            //     }
            // })
            // $scope.$watch('filterModel.warehouseNameTo', function () {
            //     if($scope.filterModel.warehouseNameTo != $scope.filterModel.warehouseNameToTemp)
            //     {
            //         $scope.filterModel.warehouseIndexTo = "";
            //         $scope.filterModel.warehouseIdTo = "";
            //     }
            // })            
            // $scope.$watch('filterModel.documentTypeName', function () {
            //     if($scope.filterModel.documentTypeName != $scope.filterModel.documentTypeNameTemp)
            //     {
            //         $scope.filterModel.documentTypeIndex = "";
            //         $scope.filterModel.documentTypeId = "";
            //     }
            // })
            // $scope.$watch('filterModel.productName', function () {
            //     if($scope.filterModel.productName != $scope.filterModel.productNameTemp)
            //     {
            //         $scope.filterModel.productIndex = "";
            //         $scope.filterModel.productName = "";
            //     }
            // })
            // $scope.$watch('filterModel.planGoodsReceiveNo', function () {
            //     if($scope.filterModel.planGoodsReceiveNo != $scope.filterModel.planGoodsReceiveNoTemp)
            //     {
            //         $scope.filterModel.planGoodsReceiveIndex = "";
            //     }
            // })
            // $scope.$watch('filterModel.dockDoorName', function () {
            //     if($scope.filterModel.dockDoorName != $scope.filterModel.dockDoorNameTemp)
            //     {
            //         $scope.filterModel.dockDoorIndex = "";
            //         $scope.filterModel.dockDoorId = "";
            //     }
            // })
            // $scope.$watch('filterModel.vehicleTypeName', function () {
            //     if($scope.filterModel.vehicleTypeName != $scope.filterModel.vehicleTypeNameTemp)
            //     {
            //         $scope.filterModel.vehicleTypeIndex = "";
            //         $scope.filterModel.vehicleTypeId = "";
            //     }
            // })
            // $scope.$watch('filterModel.containerTypeName', function () {
            //     if($scope.filterModel.containerTypeName != $scope.filterModel.containerTypeNameTemp)
            //     {
            //         $scope.filterModel.containerTypeIndex = "";
            //         $scope.filterModel.containerTypeId = "";
            //     }
            // })

            $scope.add = function () {
                var model = $scope.filterModel;
                var listmodel = $scope.filterModel.listGoodsReceiveItemViewModels;
                if (model.goodsReceiveDate == undefined || model.goodsReceiveDate == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please fill in the GR Date !!'
                        }
                    )
                    return "";
                }
                if (model.ownerName == undefined || model.ownerName == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose Owner !'
                        }
                    )
                    return "";
                }
                if (model.documentTypeName == undefined || model.documentTypeName == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose DocumentType !'
                        }
                    )
                    return "";
                }                
                if (model.planGoodsReceiveNoTemp == "" && listmodel.length != 0 && model.documentTypeIndex != '5949b181-db50-4c19-b984-6a8e643d3173') {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Error',
                            message: 'Please Choose PO/ASN '
                        }
                    )
                    return "";
                }
                if (listmodel == undefined || listmodel.length == 0) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Error',
                            message: 'Error: Add at least 1 Item'
                        }
                    )
                    return "";
                }
                var validateMsg = [];

                for (let index = 0; index < listmodel.length; index++) {
                    if (listmodel[index].qty > listmodel[index].totalQty) {
                        validateMsg.push('Product :  ' + listmodel[index].productName + ' นี้ไม่สามารถรับจำนวนได้เกิน ' + listmodel[index].totalQty + ' ');
                    }

                }

                if (validateMsg.length > 0) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        messageNewLine: validateMsg
                    });
                    return;
                }

                //POpOz
                model.userAssignKey = $window.localStorage['userGuidPlanReceive'];


                //console.log(model);
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'Do you want to save !'
                }).then(function () {
                    for (let index = 0; index < model.listGoodsReceiveItemViewModels.length; index++) {

                        model.listGoodsReceiveItemViewModels[index].RefDocumentNo = model.listGoodsReceiveItemViewModels[index].planGoodsReceiveNo;
                        model.listGoodsReceiveItemViewModels[index].RefDocumentIndex = model.listGoodsReceiveItemViewModels[index].planGoodsReceiveIndex;
                        model.listGoodsReceiveItemViewModels[index].RefDocumentItemIndex = model.listGoodsReceiveItemViewModels[index].planGoodsReceiveItemIndex;
                        model.listGoodsReceiveItemViewModels[index].goodsReceiveRemark = model.listGoodsReceiveItemViewModels[index].documentRemark;
                    }
                    Add(model).then(function success(res) {
                        $vm.filterModel = res.config.data;
                        $vm.searchResultModel = res.config.data;
                        $state.reload($state.current.name);
                    }, function error(param) {
                        dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                    });
                });
                // defer.resolve();
                // $scope.filterModel = {};
                // $scope.filterModel.goodsReceiveDate = getToday()
            }

            $scope.edit = function () {
                var model = $scope.filterModel;
                var listmodel = $scope.filterModel.listGoodsReceiveItemViewModels;
                if (model.goodsReceiveDate == undefined || model.goodsReceiveDate == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please fill in the GR Date !!'
                        }
                    )
                    return "";
                }
                if (model.ownerName == undefined || model.ownerName == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose Owner !'
                        }
                    )
                    return "";
                }
                if (model.documentTypeName == undefined || model.documentTypeName == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose DocumentType !'
                        }
                    )
                    return "";
                }
                if (listmodel == undefined || listmodel.length == 0) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Error',
                            message: 'Error: Add at least 1 Item'
                        }
                    )
                    return "";
                }

                // if ((model.planGoodsReceiveNo == undefined || model.planGoodsReceiveNo == "") && (model.refDocumentNo != undefined && model.refDocumentNo != "")) {
                //     dpMessageBox.alert(
                //         {
                //             ok: 'Close',
                //             title: 'Validate',
                //             message: 'Please Choose PO/ASN !'
                //         }
                //     )
                //     return "";
                // }

                var validateMsg = "";
                for (let index = 0; index < listmodel.length; index++) {
                    if (listmodel[index].qty > listmodel[index].totalQtyPlanGR) {
                        validateMsg = validateMsg + 'Product :  ' + listmodel[index].productName + ' นี้ไม่สามารถรับจำนวนได้เกิน ' + listmodel[index].totalQtyPlanGR + ' ,';
                    }
                }
                if (validateMsg != "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: validateMsg
                    });
                    return;
                }

                //POpOz
                model.userAssignKey = $window.localStorage['userGuidPlanReceive'];

                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'Do you want to Update !'
                }).then(function () {
                    viewModel.getId(model.goodsReceiveIndex).then(function (res) {
                        if (res.data.userAssign != $scope.userName) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "User ไม่ตรงกับ UserAssign"
                            })
                            $state.reload();
                        }
                        else {
                            for (let index = 0; index < model.listGoodsReceiveItemViewModels.length; index++) {
                                model.listGoodsReceiveItemViewModels[index].RefDocumentNo = model.listGoodsReceiveItemViewModels[index].planGoodsReceiveNo;
                                model.listGoodsReceiveItemViewModels[index].RefDocumentIndex = model.listGoodsReceiveItemViewModels[index].planGoodsReceiveIndex;
                                model.listGoodsReceiveItemViewModels[index].RefDocumentItemIndex = model.listGoodsReceiveItemViewModels[index].planGoodsReceiveItemIndex;
                                model.listGoodsReceiveItemViewModels[index].goodsReceiveRemark = model.listGoodsReceiveItemViewModels[index].documentRemark;
                            }
                            Edit(model).then(function success(res) {
                                $vm.filterModel = res.config.data;
                                $vm.searchResultModel = res.config.data;
                                $state.reload($state.current.name);
                            }, function error(param) {
                                dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                            });
                            defer.resolve();
                        }
                    });
                },
                    function error(param) {
                    });
            }

            $scope.deleteItem = function (param, index) {
                if(param[0].refDocumentIndex){
                $scope.filterModel.planGoodsReceiveIndex = angular.copy(param[0].refDocumentIndex);
                goodsReceiveFactory.updateUserAssignKey({ GoodsReceiveIndex: param[0].refDocumentIndex, UserAssign: $window.localStorage['userGuidPlanReceive'] }).then((response) => { }
                , (error) => { console.log(error); })
                }
                var indexof = param.indexOf(index)
                param.splice(indexof, 1);
            }
            $scope.editItem = function (param, index, owner) {
                var indexof = $scope.filterModel.listGoodsReceiveItemViewModels.indexOf(param)
                var owner = $scope.filterModel.ownerIndex;
                if ($scope.isLoading) {
                    $vm.isFilterTable = false;
                    $scope.isLoading(param, indexof, owner).then(function (result) {
                        $vm.isFilterTable = true;
                        $scope.filterModel.listGoodsReceiveItemViewModels[result.index] = result;

                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
                }
            }


            $scope.back = function () {

                $scope.filterModel.userAssignkey = $window.localStorage['userGuidPlanReceive'];
                $scope.filterModel.userAssign = $scope.userName
                viewModel.deleteUserAssign($scope.filterModel).then(
                    function success(results) {
                        $scope.filterModel = {};
                        $scope.userName = localStorageService.get('userTokenStorage');
                        $scope.filterModel.goodsReceiveDate = getToday()
                        defer.resolve('1');
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
            }
            function validate(param) {
                var msg = "";

                return msg;
            }

            $scope.show = {
                main: true,
                transport: false,
                warehouse: false
            };

            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };

            $scope.filterModels = function () {
                $scope.filterModel.isActive = 1;
                $scope.filterModel.isDelete = 0;
                $scope.filterModel.isSystem = 0;
                $scope.filterModel.StatusId = 0;
            };


            function Add(param) {
                let deferred = $q.defer();
                let item = $scope.filterModels();
                item = param;
                item.create_by = localStorageService.get('userTokenStorage');
                viewModel.add(item).then(
                    function success(results) {

                        if (results.data == "") {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Alert ?',
                                message: 'มี ยูสเซอร์ อื่น ทำงานอยู่'
                            })
                            deferred.reject(response);
                        }
                        else {
                            deferred.resolve(results);
                        }
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            function Edit(param) {
                var deferred = $q.defer();
                param.update_by = localStorageService.get('userTokenStorage');

                viewModel.edit(param).then(
                    function success(results) {
                        if (results.data == "") {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Alert ?',
                                message: 'ไม่สามารถเพิ่มเกินจำนวนได้'
                            })
                            deferred.reject(response);
                        }
                        else {
                            deferred.resolve(results);
                        }
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
            $scope.popupOwner = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupOwner.onShow = !$scope.popupOwner.onShow;
                    $scope.popupOwner.delegates.ownerPopup(param, $scope.filterModel.ownerName);
                },
                config: {
                    title: "owner"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.ownerIndex = angular.copy(param.ownerIndex);
                        $scope.filterModel.ownerId = angular.copy(param.ownerId);
                        $scope.filterModel.ownerName = angular.copy(param.ownerName);
                        $scope.filterModel.ownerNameTemp = localStorageService.get('ownerVariableName');

                        localStorageService.set('ownerVariableId', angular.copy(param.ownerId));
                        localStorageService.set('ownerVariableIndex', angular.copy(param.ownerIndex));
                        localStorageService.set('ownerVariableName', angular.copy(param.ownerName));
                        
                        if ($scope.filterModel.planGRownerName != undefined) {
                            if ($scope.filterModel.ownerName != $scope.filterModel.planGRownerName) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Alert',
                                    message: 'ข้อมูล Owner ไม่ตรงกับเอกสาร PO/ASN'
                                })
                                $scope.filterModel.ownerName = $scope.filterModel.planGRownerName;
                            }
                        }

                    }
                }
            };

            $scope.popupPlanGr = {
                onShow: false,
                delegates: {},
                onClick: function (param, index, documentTypeIndex, ownerIndex) {
                    if ($scope.filterModel.documentTypeIndex != null && ($scope.filterModel.documentTypeName != '' && $scope.filterModel.documentTypeName != null)) {
                        documentTypeIndex = $scope.filterModel.documentTypeIndex;
                    };
                    if ($scope.filterModel.ownerIndex != null && ($scope.filterModel.ownerIndex != '' && $scope.filterModel.ownerIndex != null)) {
                        ownerIndex = $scope.filterModel.ownerIndex;
                    };
                    index = "2";
                    $scope.popupPlanGr.onShow = !$scope.popupPlanGr.onShow;
                    $scope.popupPlanGr.delegates.planGrPopup($scope.filterModel.planGoodsReceiveNo, index, documentTypeIndex, ownerIndex, true);
                },
                config: {
                    title: "PlanGr"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        var planGoodsReceiveIndex = "";
                        if (!param.length) {
                            if (param.planGoodsReceiveIndex == "") {
                                $scope.filterModel.planGoodsReceiveIndex = angular.copy(param.planGoodsReceiveIndex);
                                $scope.filterModel.planGoodsReceiveNo = angular.copy(param.planGoodsReceiveNo);
                            }
                            else {
                                $scope.filterModel.planGoodsReceiveIndex = angular.copy(param.planGoodsReceiveIndex);
                                $scope.filterModel.planGoodsReceiveNo = angular.copy(param.planGoodsReceiveNo);
                                // $scope.filterModel.warehouseIndex = angular.copy(param.warehouseIndex);
                                // $scope.filterModel.warehouseId = angular.copy(param.warehouseId);
                                // $scope.filterModel.warehouseName = angular.copy(param.warehouseName);
                                // $scope.filterModel.warehouseIndexTo = angular.copy(param.warehouseIndexTo);
                                // $scope.filterModel.warehouseIdTo = angular.copy(param.warehouseIdTo);
                                // $scope.filterModel.warehouseNameTo = angular.copy(param.warehouseNameTo);
                                $scope.filterModel.documentRemark = angular.copy(param.documentRemark);
                                // $scope.filterModel.ownerIndex = angular.copy(param.ownerIndex);
                                // $scope.filterModel.ownerId = angular.copy(param.ownerId);
                                // $scope.filterModel.ownerName = angular.copy(param.ownerName);
                                $scope.filterModel.planGRownerName = angular.copy(param.ownerName);
                                // $scope.filterModel.documentTypeIndex = angular.copy(param.documentTypeIndex);
                                // $scope.filterModel.documentTypeId = angular.copy(param.documentTypeId);
                                // $scope.filterModel.documentTypeName = angular.copy(param.documentTypeName);
                                //$scope.filterModel.documentTypeIndex = angular.copy(param.documentTypeIndex);
                                $scope.filterModel.documentTypeIndex = angular.copy(param.grDocumentTypeIndex);
                                $scope.filterModel.documentTypeName = angular.copy(param.grDocumentTypeName);
                                $scope.filterModel.documentTypeId = angular.copy(param.grDocumentTypeId);
                                $scope.filterModel.planGoodsReceiveNoTemp = $scope.filterModel.planGoodsReceiveNo;
                                $scope.filterModel.planGoodsReceiveIndexTemp = $scope.filterModel.planGoodsReceiveIndex;
                            }
                            planGoodsReceiveIndex = $scope.filterModel.planGoodsReceiveIndex;
                        } else {
                            if (param[0].planGoodsReceiveIndex == "") {
                                $scope.filterModel.planGoodsReceiveIndex = angular.copy(param[0].planGoodsReceiveIndex);
                                $scope.filterModel.planGoodsReceiveNo = angular.copy(param[0].planGoodsReceiveNo);
                            }
                            else {
                                $scope.filterModel.planGoodsReceiveIndex = angular.copy(param[0].planGoodsReceiveIndex);
                                $scope.filterModel.planGoodsReceiveNo = angular.copy(param[0].planGoodsReceiveNo);
                                // $scope.filterModel.warehouseIndex = angular.copy(param[0].warehouseIndex);
                                // $scope.filterModel.warehouseId = angular.copy(param[0].warehouseId);
                                // $scope.filterModel.warehouseName = angular.copy(param[0].warehouseName);
                                // $scope.filterModel.warehouseIndexTo = angular.copy(param[0].warehouseIndexTo);
                                // $scope.filterModel.warehouseIdTo = angular.copy(param[0].warehouseIdTo);
                                // $scope.filterModel.warehouseNameTo = angular.copy(param[0].warehouseNameTo);
                                $scope.filterModel.documentRemark = angular.copy(param[0].documentRemark);
                                // $scope.filterModel.ownerIndex = angular.copy(param[0].ownerIndex);
                                // $scope.filterModel.ownerId = angular.copy(param[0].ownerId);
                                // $scope.filterModel.ownerName = angular.copy(param[0].ownerName);
                                $scope.filterModel.planGRownerName = angular.copy(param[0].ownerName);
                                // $scope.filterModel.documentTypeIndex = angular.copy(param.documentTypeIndex);
                                // $scope.filterModel.documentTypeId = angular.copy(param.documentTypeId);
                                // $scope.filterModel.documentTypeName = angular.copy(param.documentTypeName);
                                //$scope.filterModel.documentTypeIndex = angular.copy(param.documentTypeIndex);
                                $scope.filterModel.documentTypeIndex = angular.copy(param[0].grDocumentTypeIndex);
                                $scope.filterModel.documentTypeName = angular.copy(param[0].grDocumentTypeName);
                                $scope.filterModel.documentTypeId = angular.copy(param[0].grDocumentTypeId);
                                $scope.filterModel.planGoodsReceiveNoTemp = $scope.filterModel.planGoodsReceiveNo;
                                $scope.filterModel.planGoodsReceiveIndexTemp = $scope.filterModel.planGoodsReceiveIndex;

                            }
                            planGoodsReceiveIndex = param.map(c => c.planGoodsReceiveIndex);
                        }
                        
                        if ($scope.filterModel.listGoodsReceiveItemViewModels == undefined)
                            $scope.filterModel.listGoodsReceiveItemViewModels = [];
                            console.log(planGoodsReceiveIndex);
                        goodsReceiveItemFactory.getPlanGoodReceivePopup(planGoodsReceiveIndex).then((response) => {
                            let CountTotalQty = 0;
							console.log(response)
                            if (response.data) {
                                console.log(1)
                                var groups = $scope.filterModel.listGoodsReceiveItemViewModels.reduce(function (obj, item) {
                                    obj[item.planGoodsReceiveItemIndex] = obj[item.planGoodsReceiveItemIndex] || [];
                                    obj[item.planGoodsReceiveItemIndex].push(item.planGoodsReceiveItemIndex);
                                    return obj;
                                }, {});
                                var myArray = Object.keys(groups).map(function (key) {
                                    return { team: key };
                                });
                                if (myArray.length > 1) {
									console.log(2)
                                    angular.forEach(myArray, function (v, k) {
                                        
                                        var splice = response.data.filter(c => c.planGoodsReceiveItemIndex == v.team)
                                        angular.forEach(splice, function (vv, kk) {
                                            var indexof = response.data.indexOf(vv)
                                            response.data.splice(indexof, 1)
                                        });
                                    });
                                }
                                if (response.data.length > 0) {
									console.log(3)
                                    angular.forEach(response.data, function (vv, kk) {
                                        
                                        if (vv.qty != 0) {
                                            $scope.filterModel.listGoodsReceiveItemViewModels.push(angular.copy(vv));
                                        }
                                    });
                                }
                                for (let index = 0; index < $scope.filterModel.listGoodsReceiveItemViewModels.length; index++) {
                                    
                                    if ($scope.filterModel.listGoodsReceiveItemViewModels[index].refDocumentNo == undefined)
                                        $scope.filterModel.listGoodsReceiveItemViewModels[index].refDocumentNo = $scope.filterModel.listGoodsReceiveItemViewModels[index].planGoodsReceiveNo;
                                    $scope.filterModel.listGoodsReceiveItemViewModels[index].goodsReceiveRemark = $scope.filterModel.listGoodsReceiveItemViewModels[index].documentRemark;
                                    console.log(4)
								}
                            }
                        }, (error) => {
                            console.log(error);
                        })
                        if (!param.length) {
                            goodsReceiveFactory.updateUserAssignKey({ GoodsReceiveIndex: param.planGoodsReceiveIndex, UserAssign: $window.localStorage['userGuidPlanReceive'] }).then((response) => { }
                                , (error) => { console.log(error); })
                        } else {
                            goodsReceiveFactory.updateUserAssignKey({ GoodsReceiveIndex: param[0].planGoodsReceiveIndex, UserAssign: $window.localStorage['userGuidPlanReceive'] }).then((response) => { }
                                , (error) => { console.log(error); })
                        }
                    }
                }
            };
            $scope.popupDocumentType = {
                onShow: false,
                delegates: {},
                onClick: function (param, index, chk) {

                    $scope.filterModel;
                    if ($scope.filterModel.planGRdocumentType != null && ($scope.filterModel.planGoodsReceiveNo != '' && $scope.filterModel.planGoodsReceiveNo != null)) {
                        index = $scope.filterModel.planGRdocumentType;
                    };
                    chk = index != undefined ? 2 : 1;
                    $scope.popupDocumentType.onShow = !$scope.popupDocumentType.onShow;
                    $scope.popupDocumentType.delegates.documentTypeGRPopup($scope.filterModel.documentTypeName, index, chk);
                },
                config: {
                    title: "DocumentType"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.documentTypeIndex = angular.copy(param.documentTypeIndex);
                        $scope.filterModel.documentTypeId = angular.copy(param.documentTypeId);
                        $scope.filterModel.documentTypeName = angular.copy(param.documentTypeName);
                        $scope.filterModel.documentTypeNameTemp = $scope.filterModel.documentTypeName;

                    }
                }
            };

            $scope.popupDockDoor = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupDockDoor.onShow = !$scope.popupDockDoor.onShow;
                    $scope.popupDockDoor.delegates.dockDoorPopup(param, $scope.filterModel.dockDoorName);
                },
                config: {
                    title: "DockDoor"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.dockDoorIndex = angular.copy(param.dockDoorIndex);
                        $scope.filterModel.dockDoorId = angular.copy(param.dockDoorId);
                        $scope.filterModel.dockDoorName = angular.copy(param.dockDoorName);
                        $scope.filterModel.dockDoorNameTemp = $scope.filterModel.dockDoorName;
                    }
                }
            };

            $scope.popupVehicleType = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupVehicleType.onShow = !$scope.popupVehicleType.onShow;
                    $scope.popupVehicleType.delegates.vehicleTypePopup(param, $scope.filterModel.vehicleTypeName);
                },
                config: {
                    title: "VehicleType"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.vehicleTypeIndex = angular.copy(param.vehicleTypeIndex);
                        $scope.filterModel.vehicleTypeId = angular.copy(param.vehicleTypeId);
                        $scope.filterModel.vehicleTypeName = angular.copy(param.vehicleTypeName);
                        $scope.filterModel.vehicleTypeNameTemp = $scope.filterModel.vehicleTypeName;
                    }
                }
            };

            $scope.popupContainerType = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupContainerType.onShow = !$scope.popupContainerType.onShow;
                    $scope.popupContainerType.delegates.containerTypePopup(param, $scope.filterModel.containerTypeName);
                },
                config: {
                    title: "VehicleType"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.containerTypeIndex = angular.copy(param.containerTypeIndex);
                        $scope.filterModel.containerTypeId = angular.copy(param.containerTypeId);
                        $scope.filterModel.containerTypeName = angular.copy(param.containerTypeName);
                        $scope.filterModel.containerTypeNameTemp = $scope.filterModel.containerTypeName;
                    }
                }
            };

            $scope.popupWarehouse = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupWarehouse.onShow = !$scope.popupWarehouse.onShow;
                    $scope.popupWarehouse.delegates.warehousePopup(param, $scope.filterModel.warehouseName);
                },
                config: {
                    title: "Warehouse"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.warehouseIndex = angular.copy(param.warehouseIndex);
                        $scope.filterModel.warehouseId = angular.copy(param.warehouseId);
                        $scope.filterModel.warehouseName = angular.copy(param.warehouseName);
                        $scope.filterModel.warehouseNameTemp = localStorageService.get('warehouseVariableName');

                        localStorageService.set('warehouseVariableId', angular.copy(param.warehouseId));
                        localStorageService.set('warehouseVariableIndex', angular.copy(param.warehouseIndex));
                        localStorageService.set('warehouseVariableName', angular.copy(param.warehouseName));
                    }
                }
            };
            $scope.popupWarehouseTo = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupWarehouseTo.onShow = !$scope.popupWarehouseTo.onShow;
                    $scope.popupWarehouseTo.delegates.warehouseToPopup(param, $scope.filterModel.warehouseNameTo);
                },
                config: {
                    title: "WarehouseTo"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.warehouseIndexTo = angular.copy(param.warehouseIndex);
                        $scope.filterModel.warehouseIdTo = angular.copy(param.warehouseId);
                        $scope.filterModel.warehouseNameTo = angular.copy(param.warehouseName);
                        $scope.filterModel.warehouseNameToTemp = $scope.filterModel.warehouseName;
                    }
                }
            };

            function getToday() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            $scope.getTotal = function () {                
                var total = 0;            
                if($scope.filterModel.listGoodsReceiveItemViewModels != undefined){
                    if ($scope.filterModel.listGoodsReceiveItemViewModels.length > 0) {
                        for (var i = 0; i < $scope.filterModel.listGoodsReceiveItemViewModels.length; i++) {
                            var product = $scope.filterModel.listGoodsReceiveItemViewModels[i];
                            total += product.qty;
                        }
                    }
                    return total;
                }    
                
            }

            var init = function () {
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel.goodsReceiveDate = getToday();
                $scope.filterModel.CountTotalQty = 0

                $scope.filterModel.ownerId = localStorageService.get('ownerVariableId');
                $scope.filterModel.ownerIndex = localStorageService.get('ownerVariableIndex');
                $scope.filterModel.ownerName = localStorageService.get('ownerVariableName');
                $scope.filterModel.ownerNameTemp = localStorageService.get('ownerVariableName');
                
                $scope.filterModel.warehouseId = localStorageService.get('warehouseVariableId');
                $scope.filterModel.warehouseIndex = localStorageService.get('warehouseVariableIndex');
                $scope.filterModel.warehouseName = localStorageService.get('warehouseVariableName');
                $scope.filterModel.warehouseNameTemp = localStorageService.get('warehouseVariableName');
            };

            init();

        }
    })
})();