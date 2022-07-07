'use strict'
app.component('scanTaskDrop', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, $window, commonService) {
        return "modules/GI/ScanTaskDrop/ScanTaskDrop.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        pickingToolsList: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, dpMessageBox, scanTaskDropFactory, scanTaskFactory, locationFactory, cartAssignFactory, $interval) {
        var $vm = this;
        $scope.items = $scope.items || [];
        var viewModel = scanTaskDropFactory;
        var _viewModel = locationFactory;
        var viewModelScanTaskFactory = scanTaskFactory;
        // setting column
        $scope.pickingToolsList = false;
        $scope.filterModel = {};
        $scope.dataListFromService = {};
        var defer = {};

        $scope.CheckLocation = function () {
            let defer = $q.defer();
            let models = $scope.filterModel;
            if ($scope.filterModel.locationName == $scope.filterModel.stagingLocation) {
                $scope.CheckScanLocation(models);
                setTimeout(() => {
                    var focusElem = jQuery('input[ng-model="filterModel.tagOutNo"]');
                    focusElem[0].focus();
                }, 200);
            }
            else {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Information.',
                    message: " Location ที่ยืนยันต้องเป็น Location เดียวกันเท่านั้น ! "
                })
                $scope.filterModel.locationName = "";
            }

            defer.resolve();
        }

        $scope.CheckScanCarton = function (param) {
            if ($scope.filterModel.locationName != undefined) {
                if (param.tagOutNo != "" && param.tagOutNo != undefined && param.isTagOutNo != 1 && param.isSave != 1) {
                    viewModel.checkCarton(param).then(function success(res) {
                        if (res.data.itemsForCheck.length > 0) {
                            let CheckData = $scope.APIreceieve;
                            let count = 0;
                            for (var i = 0; i <= CheckData.length - 1; i++) {
                                if (CheckData[i].tagOutNo == $scope.filterModel.tagOutNo && CheckData[i].taskItem_Index == $scope.filterModel.taskItem_Index) {
                                    //if (CheckData[i].tagOutNo == param.tagOutNo) {
                                    count = count + 1;

                                }
                            }
                            if (count == 0) {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Information.',
                                    message: " Carton No: " + param.tagOutNo + " ไม่ได้อยู่ใน Cart :" + "  " + param.equipmentItemDesc
                                })
                                $scope.filterModel.tagOutNo = "";
                                $scope.filterModel.isTagOutNo = 1;
                            }
                            $scope.dataListFromService.tagOutNo = res.data.itemsForCheck[0].tagOutNo;
                            $scope.dataListFromService.goodsIssueIndex = res.data.itemsForCheck[0].goodsIssueIndex;
                            $scope.dataListFromService.tagOutStatus = res.data.itemsForCheck[0].tagOutStatus;
                            $scope.dataListFromService.goodsIssueItemLocationIndex = res.data.itemsForCheck[0].goodsIssueItemLocationIndex;
                            // if (res.data.itemsUse.length > 0) {

                            // }

                        }
                        else {
                            if (res.data.itemsUse.length > 0) {
                                if (res.data.itemsUse[0].tagOutStatus == 1) {
                                    dpMessageBox.alert({
                                        ok: 'Yes',
                                        title: 'Information.',
                                        message: " Carton No: " + param.tagOutNo + " เคยถูก Confirm แล้ว "
                                    })
                                    // $scope.filterModel.locationName = "";
                                    $scope.filterModel.tagOutNo = "";
                                    $scope.filterModel.isTagOutNo = 1;
                                }
                                else {
                                    dpMessageBox.alert({
                                        ok: 'Yes',
                                        title: 'Information.',
                                        message: " Carton No: " + param.tagOutNo + " นี้ไม่ตรงกับเลข PickTickket ที่สแกน กรุณาใช้ให้ถูกต้อง ! "
                                    })
                                }
                                $scope.filterModel.isTagOutNo = 1;
                                $scope.filterModel.tagOutNo = "";
                            }
                            else {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Information.',
                                    message: " Carton No: " + param.tagOutNo + " Not Found "
                                })
                            }
                            $scope.filterModel.isTagOutNo = 1;
                            $scope.filterModel.tagOutNo = "";
                        }
                    })
                }

            }
            else {
                dpMessageBox.alert({
                    ok: 'Yes',
                    title: 'Information.',
                    message: " คุณยังไม่ได้ Confirm Location "
                })
                param.isTagOutNo = 0;
                $scope.filterModel.tagOutNo = "";
            }

            param.isTagOutNo = 0;
        }
        $scope.CheckScanLocation = function (param) {
            if (param.locationName != undefined) {
                if (param.locationName != "" && param.tagOutNo == "" || param.tagOutNo == undefined) {
                    if ($scope.filterModel.locationName == $scope.filterModel.stagingLocation) {
                        _viewModel.CheckLocation(param).then(function success(res) {
                            if (res.data.length > 0) {
                                $scope.filterModel.locationIndex = res.data[0].locationIndex;
                                $scope.filterModel.locationId = res.data[0].locationId;
                                $scope.filterModel.locationName = res.data[0].locationName;
                            }
                            else {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: "ไม่พบ Location Staging ที่ยืนยัน !"
                                })
                                $scope.filterModel.locationName = "";

                            }
                        })
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: " Location ที่ยืนยันต้องเป็น Location เดียวกันเท่านั้น ! "
                        })
                        $scope.filterModel.locationName = "";
                    }
                }
                else {
                    //$scope.filterModel.stagingLocation = "";
                }
            }
        }
        $scope.ConfirmCarton = function () {
            let defer = $q.defer();
            let models = $scope.filterModel;
            $scope.validateMsg = "";
            validate(models).then(function (result) {
                if (result) {
                    $scope.validateMsg = result;
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: result
                        }
                    )
                }
                else {
                    pageLoading.show();
                    models.userName = localStorageService.get('userTokenStorage')
                    viewModelScanTaskFactory.cartConfirmDrop(models).then(function success(res) {
                        if(!res.data.itemResult)
                        {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Validate',
                                    message: res.data.msgResult
                                }
                            )
                        }else
                        {
                            viewModel.setParam($scope.datadrop);
                            $state.go('tops.scan_task_confrim_carton', {
                            })
                            // init()
                        }
                        pageLoading.hide();
                    }, 
                    function error(res) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: res.data.msgResult
                            }
                        )
                    })
                    defer.resolve();
                }
            });
        }

        $scope.back = function () {
            var viewModelCartAssign = cartAssignFactory;
            viewModelCartAssign.setParam("");
            $state.go('tops.cart_assign_picking', {
            })
        }

        function validate(param) {
            let defer = $q.defer();
            let msg = "";
            // if (param.equipmentItemName == undefined || param.equipmentItemName == "") {
            //     msg = ' Cart Location ต้องไม่เป็นค่าว่าง !'
            //     defer.resolve(msg);
            // }
            if (param.stagingLocation == undefined || param.stagingLocation == "") {
                msg = ' Location ต้องไม่เป็นค่าว่าง !'
                defer.resolve(msg);
            }
            else if (param.stagingLocation == undefined || param.stagingLocation == "") {
                msg = ' Location ต้องไม่เป็นค่าว่าง !'
                defer.resolve(msg);
            }
            else if (param.locationName == undefined || param.locationName == "") {
                msg = ' Confirm Location ต้องไม่เป็นค่าว่าง !'
                defer.resolve(msg);
            }
            else if (param.tagOutNo == undefined || param.tagOutNo == "") {
                msg = ' Carton No ต้องไม่เป็นค่าว่าง !'
                defer.resolve(msg);
            }
            defer.resolve(msg);

            return defer.promise;
        }

        $scope.ConfirmToPrint = function () {
            let models = $scope.filterModel;
            $scope.validateMsg = "";
            validate(models).then(function (result) {
                if (result) {
                    $scope.validateMsg = result;
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: result
                        }
                    )
                }
                else {
                    if ($scope.filterModel.isCheckValidate == 1) {
                        pageLoading.show();
                        $scope.fight(1);
                        viewModel.receivePutToStaging($scope.filterModel).then(function success(res) {
                            $scope.stopFight(1);
                            pageLoading.hide();
                            //-------------------------- check data มีการ assign ครบแล้ว --------------------------//
                            if (res.data.itemsForCheck.length > 0) {
                                // dpMessageBox.alert({
                                //     ok: 'Yes',
                                //     title: 'Information',
                                //     message: 'Confirm Completed !!'
                                // }).then(function success() {
                                //     viewModel.setParam($scope.filterModel);
                                //     $state.go('tops.print_carton', {
                                //     })
                                // })

                                let modelList = $scope.receieveSaveData;
                                //-------------------------- Binding Uername --------------------------//

                                let dataList = modelList.listSaveCallCenterViewModel;
                                for (var i = 0; i <= dataList.length - 1; i++) {
                                    modelList.listSaveCallCenterViewModel[i].createBy = $scope.userName;
                                }
                                // let models1 = {
                                //     newArray: modelList
                                // }
                                // ------------------------------------------------------------------- //
                                // let data = {
                                //     listSaveCallCenterViewModel: modelList
                                // }
                                if (modelList.listSaveCallCenterViewModel.length > 0) {
                                    $scope.fight(2);
                                    viewModel.SaveToCallCenter(modelList).then(function success(res) {
                                        $scope.stopFight(2);
                                        pageLoading.hide();
                                        if (res.data != "") {
                                            // dpMessageBox.alert({
                                            //     ok: 'Yes',
                                            //     title: 'Information',
                                            //     message: 'Confirm Completed !!'
                                            // }).then(function success() {
                                            //     viewModel.setParam($scope.filterModel);
                                            //     $state.go('tops.print_carton', {
                                            //     })
                                            // })


                                            if (res.data == "POS") {
                                                
                                                var md = {};
                                                md.PlanGoodsIssue_Index = modelList.listSaveCallCenterViewModel[0].planGoodsIssueIndex;
                                                viewModel.postPickConfirm(md).then(function (res) {
                                                    
                                                }, function error(res) {

                                                })
                                            }

                                            viewModel.setParam($scope.filterModel);
                                            $state.go('tops.scan_task_confrim_carton', {
                                            })



                                        }
                                        else {

                                            let item = $scope.filterModel;
                                            viewModel.setParam(item);
                                            $state.go('tops.scan_task_confrim_carton', {
                                            })
                                        }
                                    })
                                }
                            }
                            else {
                                if (res.data.itemsUse.length > 0) {
                                    //let modelList = res.data.itemsUse;
                                    let modelList = $scope.receieveSaveData;
                                    //-------------------------- Binding Uername --------------------------//                                                          
                                    // for (var i = 0; i <= modelList.length - 1; i++) {
                                    //     modelList[i].createBy = $scope.userName;
                                    // }
                                    // let models1 = {
                                    //     newArray: modelList
                                    // }
                                    // ------------------------------------------------------------------- //
                                    // let data = {
                                    //     listSaveCallCenterViewModel: modelList
                                    // }

                                    
                                    let dataList = modelList.listSaveCallCenterViewModel;
                                    for (var i = 0; i <= dataList.length - 1; i++) {
                                        modelList.listSaveCallCenterViewModel[i].createBy = $scope.userName;
                                    }
                                    if (modelList.listSaveCallCenterViewModel.length > 0) {
                                        $scope.fight(2);
                                        viewModel.SaveToCallCenter(modelList).then(function success(res) {
                                            $scope.stopFight(2);
                                            pageLoading.hide();
                                            if (res.data == true) {
                                                viewModel.setParam($scope.filterModel);
                                                $state.go('tops.scan_task_confrim_carton', {
                                                })
                                                // dpMessageBox.alert({
                                                //     ok: 'Yes',
                                                //     title: 'Information',
                                                //     message: 'Confirm Completed !!'
                                                // }).then(function success() {
                                                //     viewModel.setParam($scope.filterModel);
                                                //     $state.go('tops.print_carton', {
                                                //     })
                                                // })
                                            }
                                            else {

                                                let item = $scope.filterModel;
                                                viewModel.setParam(item);
                                                // viewModel.setTime({ t1: $scope.t1, t2: $scope.t2, t3: $scope.t3, t4: $scope.t4, t5: $scope.t5, t6: $scope.t6
                                                // });
                                                $state.go('tops.scan_task_confrim_carton', {
                                                })
                                            }
                                        })
                                    }
                                }
                                else {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        message: " คุณยังไม่ได้สแกนเลข Carton No กดสแกนใหม่อีกครั้ง !!"
                                    })
                                }

                            }
                        })
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Information.',
                            message: " Carton No: " + $scope.filterModel.tagOutNo + " ยังไม่ได้สแกน กรุณาสแกนก่อนกด Confirm "
                        })
                    }

                }
            })
        }

        function checkCartonForUpdate() {
            let models = $scope.dataListFromService;
            models.UpdateBy = $scope.userName;
            let CheckData = $scope.APIreceieve;
            var Activity = [];
            let param = "";
            //-------------------------- Binding PlanGoodsIssueIndex --------------------------//
            for (var i = 0; i <= CheckData.length - 1; i++) {
                let newItem = {};
                if (models.tagOutNo == CheckData[i].tagOutNo) {
                    models.planGoodsIssueIndex = CheckData[i].planGoodsIssueIndex;
                    $scope.filterModel.tagOutPickNo = "";
                    $scope.filterModel.tagOutPickNo = CheckData[i].tagOutPickNo;


                    newItem.planGoodsIssueIndex = CheckData[i].planGoodsIssueIndex;
                    newItem.goodsIssueIndex = models.goodsIssueIndex;
                    newItem.goodsIssueItemLocationIndex = models.goodsIssueItemLocationIndex;
                    newItem.locationId = models.locationId;
                    newItem.locationIndex = models.locationIndex;
                    newItem.locationName = models.locationName;
                    newItem.tagOutNo = models.tagOutNo;
                    newItem.tagOutPickNo = models.tagOutPickNo;
                    newItem.tagOutStatus = models.tagOutStatus;
                    newItem.ownerIndex = models.ownerIndex;
                    newItem.ownerId = models.ownerId;
                    newItem.ownerName = models.ownerName;
                    newItem.UpdateBy = $scope.userName;
                }
                else {
                    newItem.emtry = 1;
                }
                if (newItem.emtry != 1) {
                    Activity.push(newItem);
                }
            }
            if (Activity) {
                param = Activity;
            }
            let data = {
                listSaveCallCenterViewModel: param
            }

            $scope.receieveSaveData = data;
            //--------------------------  --------------------------//
            if (models.locationName != null && models.tagOutNo != null) {

                pageLoading.show();
                viewModel.updateData(models).then(function success(res) {
                    pageLoading.hide();
                    if (res.data == true) {
                        $scope.filterModel.isSave = 1;
                        // dpMessageBox.alert({
                        //     ok: 'Close',
                        //     title: 'Information.',
                        //     message: " Stagging Completed !!"
                        // })
                        // document.getElementById("myText").focus();
                        // document.getElementById("myText").select();

                        document.getElementById("myText").disabled = true;
                        document.getElementById("myText1").disabled = true;
                        $scope.filterModel.isTagOutNo = 1;
                        $scope.ConfirmToPrint();
                        //init();
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: " Update Error !!"
                        })
                    }

                },
                    function error(response) {
                    }
                );
            }
            else {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Information.',
                    message: " กรุณากดยืนยัน Location อีกครั้ง !!"
                })
            }

        }

        $scope.clearSearch = function () {
            $scope.filterModel.locationName = "";
            $scope.filterModel.tagOutNo = "";
            document.getElementById("myText").disabled = false;
            document.getElementById("myText1").disabled = false;

        }

        $vm.pickingTools = function (param, index, owner) {
            $scope.filterModel.ownerIndex = owner;
            defer = $q.defer();
            $scope.pickingTools = true;

            return defer.promise;
        };
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
        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }
        $scope.model = {
            currentPage: 1,
            numPerPage: 30,
            totalRow: 0,
            advanceSearch: false
        };

        var init = function () {
            $scope.Carton = $scope.filterModel.tagOutNo;
            $scope.userName = localStorageService.get('userTokenStorage');
            document.getElementById("myText1").focus();
            let item = viewModelScanTaskFactory.getParam();
            if (item != undefined) {
                item.map(c => c.userName = localStorageService.get('userTokenStorage'))
                var objitem = {};
                objitem.item = item;
                // $scope.filterModel.equipmentItemId = item.equipmentItem_Id;
                // $scope.filterModel.equipmentItemIndex = item.equipmentItem_Index;
                // $scope.filterModel.equipmentItemName = item.equipmentItem_Name;
                // $scope.filterModel.equipmentId = item.equipment_Id;
                // $scope.filterModel.equipmentIndex = !item.equipment_Index ? item: item.equipment_Index;
                // $scope.filterModel.equipmentName = item.equipment_Name;
                // $scope.filterModel.giL_DocumentStatus = item.giL_DocumentStatus;
                // $scope.filterModel.pickingStatus = item.picking_Status;
                // $scope.filterModel.planGoodsIssueItemIndex = item.planGoodsIssueItem_Index;
                // $scope.filterModel.planGoodsIssueIndex = item.planGoodsIssue_Index;
                // $scope.filterModel.planGoodsIssueNo = item.planGoodsIssue_No;
                // $scope.filterModel.tagOutPickIndex = item.tagOutPick_Index;
                // $scope.filterModel.tagOutPickNo = item.tagOutPick_No;
                // $scope.filterModel.tagOutPickStatus = item.tagOutPick_Status;
                // $scope.filterModel.userAssign = item.userAssign;
                // $scope.filterModel.userName = localStorageService.get('userTokenStorage');
                pageLoading.show();
                viewModelScanTaskFactory.cartPutToStaging(objitem).then(function success(res) {
                    pageLoading.hide();
                    if (res.data.msgResult == "Drop") {
                        $scope.datadrop = res.data.itemResult;
                        $scope.filterModel.tagOutNo = "";
                        $scope.filterModel.locationName = "";
                        $scope.filterModel.row_Index = res.data.itemResult[0].row_Index;
                        $scope.filterModel.equipmentItemId = res.data.itemResult[0].equipmentItem_Id;
                        $scope.filterModel.equipmentItemIndex = res.data.itemResult[0].equipmentItem_Index;
                        $scope.filterModel.equipmentItemName = res.data.itemResult[0].equipmentItem_Name;
                        $scope.filterModel.equipmentId = res.data.itemResult[0].equipment_Id;
                        $scope.filterModel.equipmentIndex = res.data.itemResult[0].equipment_Index;
                        $scope.filterModel.equipmentName = res.data.itemResult[0].equipment_Name;
                        $scope.filterModel.giL_DocumentStatus = res.data.itemResult[0].giL_DocumentStatus;
                        $scope.filterModel.pickingStatus = res.data.itemResult[0].picking_Status;
                        $scope.filterModel.planGoodsIssueItemIndex = res.data.itemResult[0].planGoodsIssueItem_Index;
                        $scope.filterModel.planGoodsIssueIndex = res.data.itemResult[0].planGoodsIssue_Index;
                        $scope.filterModel.planGoodsIssueNo = res.data.itemResult[0].planGoodsIssue_No;
                        $scope.filterModel.tagOutPickIndex = res.data.itemResult[0].tagOutPick_Index;
                        $scope.filterModel.tagOutPickNo = res.data.itemResult[0].tagOutPick_No;
                        $scope.filterModel.tagOutPickStatus = res.data.itemResult[0].tagOutPick_Status;
                        $scope.filterModel.userAssign = res.data.itemResult[0].userAssign;
                        $scope.filterModel.stagingLocation = res.data.itemResult[0].suggestLocation_Name;
                        $scope.filterModel.ownerIndex = res.data.itemResult[0].owner_Index;
                        $scope.filterModel.ownerId = res.data.itemResult[0].owner_Id;
                        $scope.filterModel.ownerName = res.data.itemResult[0].owner_Name;
                        $scope.filterModel.taskIndex = res.data.itemResult[0].task_Index;
                        $scope.filterModel.taskNo = res.data.itemResult[0].task_No;
                    }
                    else if(res.data.msgResult == "PrintRF")
                    {
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'Information.',
                            message: " Carton No " + $scope.filterModel.task_No + " Completed. "
                        }).then(function success() {
                            viewModel.setParam($scope.filterModel);
                            $state.go('tops.scan_task_confrim_carton', {
                            })
                        });
                    }
                    else
                    {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: " Carton No " + $scope.filterModel.task_No + " Completed. "
                       })
                    }
                },
                function error(response) {
                    }
                );
            }

        };


        $scope.t1 = 0;
        $scope.t2 = 0;
        $scope.t3 = 0;
        $scope.t4 = 0;
        $scope.t5 = 0;
        $scope.t6 = 0;

        var stop1;
        var stop2;
        var stop3;
        var stop4;
        var stop5;
        var stop6;
        $scope.fight = function (param) {
            // Don't start a new fight if we are already fighting
            // if (angular.isDefined(stop)) return;

            if (param == 1)
                stop1 = $interval(function () {
                    $scope.t1 = $scope.t1 + 0.1;
                }, 100);

            if (param == 2)
                stop2 = $interval(function () {
                    $scope.t2 = $scope.t2 + 0.1;
                }, 100);

            if (param == 3)
                stop3 = $interval(function () {
                    $scope.t3 = $scope.t3 + 0.1;
                }, 100);

            if (param == 4)
                stop4 = $interval(function () {
                    $scope.t4 = $scope.t4 + 0.1;
                }, 100);

            if (param == 5)
                stop5 = $interval(function () {
                    $scope.t5 = $scope.t5 + 0.1;
                }, 100);

            if (param == 6)
                stop6 = $interval(function () {
                    $scope.t6 = $scope.t6 + 0.1;
                }, 100);


        };

        $scope.stopFight = function (param) {

            if (param == 1) {
                if (angular.isDefined(stop1)) {
                    $interval.cancel(stop1);
                    stop1 = undefined;
                }
            }

            if (param == 2) {
                if (angular.isDefined(stop2)) {
                    $interval.cancel(stop2);
                    stop2 = undefined;
                }
            }

            if (param == 3) {
                if (angular.isDefined(stop3)) {
                    $interval.cancel(stop3);
                    stop3 = undefined;
                }
            }

            if (param == 4) {
                if (angular.isDefined(stop4)) {
                    $interval.cancel(stop4);
                    stop4 = undefined;
                }
            }

            if (param == 5) {
                if (angular.isDefined(stop5)) {
                    $interval.cancel(stop5);
                    stop5 = undefined;
                }
            }

            if (param == 6) {
                if (angular.isDefined(stop6)) {
                    $interval.cancel(stop6);
                    stop6 = undefined;
                }
            }

        };

        $("#myText").bind("focus", function () {
            setTimeout(() => {
                $("#myText").removeAttr("readonly");
            }, 200);
        }).bind("blur", function () {
            $("#myText").attr("readonly", "readonly");
        });

        $("#myText1").bind("focus", function () {
            setTimeout(() => {
                $("#myText1").removeAttr("readonly");
            }, 200);
        }).bind("blur", function () {
            $("#myText1").attr("readonly", "readonly");
        });

        init();

    }
});