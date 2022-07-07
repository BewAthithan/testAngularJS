'use strict'
app.component('packingTableList', {
    controllerAs: '$vm',
    templateUrl: function($element, $attrs, $window, commonService) {
        return "modules/GI/Packing/component/PackingTableList.html";
    },
    bindings: {
        isLoading: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        searchResultModel: '=?',
    },
    controller: function($scope, $filter, $q, $compile, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, packingFactory) {
        var $vm = this;
        $scope.items = $scope.items || [];
        // setting column
        $scope.showColumnSetting = false;

        var viewModel = packingFactory;

        $vm.$onInit = function() {
            $scope.pagging = {
                totalRow: 0,
                currentPage: 1,
                numPerPage: 1,
                num: 10,
                maxSize: 10,
                perPage: 30,
                change: function() {
                    $vm.filterModel.currentPage = this.currentPage - 1;
                    if ($vm.triggerSearch) {
                        $vm.triggerSearch();
                    }
                },
                changeSize: function() {
                    $vm.filterModel.numPerPage = $scope.pagging.perPage
                    $vm.triggerSearch();
                }
            }
            $scope.userName = localStorageService.get('userTokenStorage');
            $scope.getBoxMaster();
            $vm.customBox = false;
            $scope.filterModel = {};
        }

        $vm.filterModel.unBindingAddress = function() {
            $scope.getAddressMaster();
            $vm.filterModel.province = null;
            $vm.filterModel.district = null;
            $vm.filterModel.subDistrict = null;
            $vm.filterModel.postcode = null;
        }

        $vm.filterModel.bindingAddress = function() {
            // binding address
            viewModel.getAddress(0).then(function success(res) {
                $scope.addressMaster = res.data.data;
                for(var i = 0; i < $scope.addressMaster.length; i++) {
                    if($scope.addressMaster[i].id == $vm.filterModel.addressTemp.province) {
                        $vm.filterModel.province = $scope.addressMaster[i];
                    }
                }
            }, function error(err) {});
            viewModel.getAddress($vm.filterModel.addressTemp.province).then(function success(res) {
                $scope.districtMaster = res.data.data;
                for(var i = 0; i < $scope.districtMaster.length; i++) {
                    if($scope.districtMaster[i].id == $vm.filterModel.addressTemp.district) {
                        $vm.filterModel.district = $scope.districtMaster[i];
                    }
                }
            }, function error(err) {});
            viewModel.getAddress($vm.filterModel.addressTemp.district).then(function success(res) {
                $scope.subDistrictMaster = res.data.data;
                for(var i = 0; i < $scope.subDistrictMaster.length; i++) {
                    if($scope.subDistrictMaster[i].id == $vm.filterModel.addressTemp.subDistrict) {
                        $vm.filterModel.subDistrict = $scope.subDistrictMaster[i];
                    }
                }
            }, function error(err) {});
            viewModel.getAddress($vm.filterModel.addressTemp.subDistrict).then(function success(res) {
                $scope.postcodeMaster = res.data.data;
                for(var i = 0; i < $scope.postcodeMaster.length; i++) {
                    if($scope.postcodeMaster[i].id == $vm.filterModel.addressTemp.postcode) {
                        $vm.filterModel.postcode = $scope.postcodeMaster[i];
                    }
                }
            }, function error(err) {});
        }

        $scope.getBoxMaster = function(){
            viewModel.getBoxMaster().then(function success(res) {
                $scope.boxSizes = res.data;
                $vm.box = res.data[0];
            }, function error(err) {});
        }

        $scope.getBoxSize = function(){
            var box = $vm.box;
            if($vm.box == "0") {
                $vm.customBox = true;
            } else {
                $vm.customBox = false;
            }
            for(var i = 0; i < $scope.boxSizes.length; i++) {
                if($scope.boxSizes[i].boxId == $vm.box) {
                    $vm.box = $scope.boxSizes[i];
                    break;
                }
            }
            $scope.filterModel.packL = $vm.box.length;
            $scope.filterModel.packW = $vm.box.width;
            $scope.filterModel.packH = $vm.box.height;
            $scope.filterModel.packWeight = $vm.box.weight;
            if($vm.packingItemTable) {
                if($vm.packingItemTable.packingItem.length > 0 && box == "0") {
                    $scope.filterModel.packL = $scope.boxSizes[0].length;
                    $scope.filterModel.packW = $scope.boxSizes[0].width;
                    $scope.filterModel.packH = $scope.boxSizes[0].height;
                    $scope.filterModel.packWeight = $scope.boxSizes[0].weight;
                }
            }            
        }

        $vm.triggerCreate = function() {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow().then(function(result) {
                    $vm.isFilter = true;
                }).catch(function(error) {
                    defer.reject({ 'Message': error });
                });
            }
        };

        $scope.show = {
            pagination: true,
            checkBox: false
        }

        $scope.model = {
            currentPage: 1,
            numPerPage: 30,
            totalRow: 0,
            advanceSearch: false
        };
        // coload toggle
        $scope.showCoload = false;

        $scope.changeTableSize = function() {
            var p = {
                currentPage: 0, //$scope.pagging.num,
                perPage: $vm.filterModel.perPage
            };
            $vm.filterModel.perPage = $vm.filterModel.perPage;
            $scope.changePage();
        };

        $scope.changePage = function() {
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

        $scope.serchPage = function(param) {
            viewModel.planGIsearch(param).then(function success(res) {
                $vm.filterModel.totalRow = res.data.pagination.totalRow;
                $vm.filterModel.currentPage = res.data.pagination.currentPage;
                $vm.filterModel.perPage = res.data.pagination.perPage;
                $vm.filterModel.numPerPage = res.data.pagination.perPage;

            }, function error(res) {});
        }

        $scope.updateItem = function(ownerId, planGoodsIssueNo, tagOutNo) {
            $scope.filterModel.productBarcode = null;
            viewModel.getPackingItem(ownerId, planGoodsIssueNo, tagOutNo).then(function success(res) {
                if (res.data.statusCode == 200) {
                    $vm.packingItemTable = res.data.result;
                    $vm.box = res.data.result.boxId;
                    $scope.getBoxSize();
                    $scope.filterModel.packL = res.data.result.packLength;
                    $scope.filterModel.packW = res.data.result.packWidth;
                    $scope.filterModel.packH = res.data.result.packHeight;
                    $scope.filterModel.packWeight = res.data.result.packWeight;
                    document.getElementById("updateBoxBtn").click();
                    setTimeout(function(){document.getElementById("productBarcodeTable").focus();}, 500);
                } else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ข้อมูลไม่ครบ',
                        message: res.data.statusDesc
                    })
                }
            }, function error(err) {});
        }

        $scope.inputProductBarcode = function() {
            if($scope.filterModel.productBarcode && $scope.filterModel.packH && $scope.filterModel.packL &&
            $scope.filterModel.packWeight && $scope.filterModel.packW) {
                let body = {
                    PlanGoodsIssueNo: $vm.packingItemTable.planGoodsIssueNo,
                    TagOutNo: $vm.packingItemTable.tagOutNo,
                    Productbarcode: $scope.filterModel.productBarcode,
                    BoxId: $vm.box.boxId,
                    PackHeight: parseFloat($scope.filterModel.packH),
                    PackLength: parseFloat($scope.filterModel.packL),
                    PackWeight: parseFloat($scope.filterModel.packWeight),
                    PackWidth: parseFloat($scope.filterModel.packW),
                    Qty: 1,
                    User: localStorageService.get('userTokenStorage')
                }
                viewModel.savePackingItem(body).then(function success(res) {
                    if (res.data.statusCode != 200) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'ข้อมูลไม่ถูกต้อง',
                            message: res.data.statusDesc
                        })
                        setTimeout(function(){
                            $scope.filterModel.productBarcode = null;
                            document.getElementById("productBarcodeTable").focus();
                        }, 500);
                        document.getElementById("updateBoxModal").style.overflowX = "hidden";
                        document.getElementById("updateBoxModal").style.overflowY = "auto";
                    } else {
                        viewModel.getPackingItem(
                            $vm.filterModel.ownerId,
                            $vm.packingItemTable.planGoodsIssueNo,
                            $vm.packingItemTable.tagOutNo
                        ).then(function success(res) {
                            if (res.data.statusCode == 200) {
                                $vm.packingItemTable = res.data.result;
                                document.getElementById("productBarcodeTable").focus();
                                document.getElementById("productBarcodeTable").select();
                            } else {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'ข้อมูลไม่ถูกต้อง',
                                    message: res.data.statusDesc
                                })
                            }
                        }, function error(err) {});
                    }
                }, function error(err) {});
            } else {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'ข้อมูลไม่ครบ',
                    message: "กรุณากรอก Product Barcode, ความยาว, ความกว้าง, ความสูง, น้ำหนัก"
                })
            }
        }

        $scope.newBox = function() {
            $vm.packingItemTable = null;
            $scope.filterModel.productBarcode = null;
            setTimeout(function(){document.getElementById("productBarcodeTable").focus();}, 500);
            $vm.box = $scope.boxSizes[0];
            $vm.customBox = true;
            $scope.filterModel.packL = $vm.box.length;
            $scope.filterModel.packW = $vm.box.width;
            $scope.filterModel.packH = $vm.box.height;
            $scope.filterModel.packWeight = $vm.box.weight;
            let body = {
                OrderNo: $vm.filterModel.saleOrderNo,
                PackStationId: $vm.filterModel.packstation,
                PackingOption: "1",
                BoxId: $vm.box.boxId,
                BoxQty: 1,
                user: $scope.userName
            }
            viewModel.createNewCarton(body).then(function success(res) {
                if (res.data.statusCode >= 400 && res.data.statusCode < 500) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ข้อมูลไม่ถูกต้อง',
                        message: res.data.statusDesc
                    })
                } else {
                    $vm.packingItemTable = res.data.result[0];
                    viewModel.getCartonList(
                        $vm.filterModel.ownerId,
                        $vm.filterModel.saleOrderNo
                    ).then(function success(res) {
                        $vm.searchResultModel = res.data;
                    },
                    function error(err) {});
                }
            },
            function error(err) {});
        }

        $scope.deleteItem = function(tagOutNo, ownerId, packStationId) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'Confirmation',
                message: 'Do you to delete this item ?'
            }).then(function success() {
                let body = {
                    packStationId: packStationId,
                    cartonNo: tagOutNo
                }
                viewModel.deleteCarton(body).then(function success(res) {
                    if(res.data.statusCode != 200) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Error.',
                            message: res.data.statusDesc
                        });
                    } else {
                        viewModel.getCartonList(ownerId, $vm.filterModel.saleOrderNo).then(function success(res) {
                            $vm.searchResultModel = res.data;
                        }, function error(err) {});
                    }                    
                }, function error(err) {});
            });
        }        

        $scope.getAddressMaster = function(){
            var id = 0;
            viewModel.getAddress(id).then(function success(res) {
                $scope.addressMaster = res.data.data;
            }, function error(err) {});
        }

        $scope.getProvince = function(){             
           for(var i = 0; i < $scope.addressMaster.length; i++) {                    
                if($scope.addressMaster[i].id == $vm.filterModel.province) {
                    $vm.filterModel.province = $scope.addressMaster[i];
                    $vm.filterModel.provinceName = $scope.addressMaster[i].displayName;
                    $vm.filterModel.district = "";
                    $vm.filterModel.subDistrict = "";
                    $vm.filterModel.postcode = "";
                    viewModel.getAddress($vm.filterModel.province.id).then(function success(res) {
                        $scope.districtMaster = res.data.data;
                    }, function error(err) {});
                    break;                       
                }
            }             
        }
        
        $scope.getDistrict = function(){ 
            for(var i = 0; i < $scope.districtMaster.length; i++) {
                if($scope.districtMaster[i].id == $vm.filterModel.district){
                    $vm.filterModel.district = $scope.districtMaster[i];
                    $vm.filterModel.subDistrict = "";
                    $vm.filterModel.postcode = ""; 
                    viewModel.getAddress($vm.filterModel.district.id).then(function success(res) {
                        $scope.subDistrictMaster = res.data.data; 
                    }, function error(err) {});
                    break;
                }
            }
        }

        $scope.getSubDistrict = function(){  
            for(var i = 0; i < $scope.subDistrictMaster.length; i++) {   
                if($scope.subDistrictMaster[i].id == $vm.filterModel.subDistrict){
                    $vm.filterModel.subDistrict = $scope.subDistrictMaster[i];
                    viewModel.getAddress($vm.filterModel.subDistrict.id).then(function success(res) {
                        $scope.postcodeMaster = res.data.data;                
                    }, function error(err) {});
                    break;
                }
            }   
        }

        $scope.getPostcode = function(){     
            for(var i = 0; i < $scope.postcodeMaster.length; i++) {  
                if($scope.postcodeMaster[i].id == $vm.filterModel.postcode){
                    $vm.filterModel.postcode = $scope.postcodeMaster[i];
                    break;
                } 
            }   
        }

        $scope.confirmPack = function() {
            // check confirm pack
            if($vm.filterModel.packStatus) { // confirmed
                viewModel.printConfirmPackOrder({
                    orderNo: $vm.filterModel.saleOrderNo
                }).then(function success(res) {
                    $vm.filterModel.saleOrderNo = null;
                    $vm.filterModel.boxQty = 1;
                    $vm.filterModel.packStatus = null;
                    $vm.searchResultModel = null;
                    document.getElementById("saleOrderNoInput").focus();
                }, function error(err) {});
            } else {
                // carton empty
                if($vm.searchResultModel.length > 0) {
                    // check empty address
                    if(
                        (!$vm.filterModel.province || !$vm.filterModel.district || !$vm.filterModel.subDistrict || !$vm.filterModel.postcode)
                        && $vm.filterModel.chkAddress == 1
                    ) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'ข้อมูลไม่ครบ',
                            message: "กรุณากรอก จังหวัด, เขต/อำเภอ, แขวง/ตำบล และ รหัสไปรษณีย์ ให้ครบถ้วน"
                        })
                    } else {
                        // ask yes, no
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'Confirmation',
                            message: 'Do you to confirm pack ?'
                        }).then(function success() {
                            if($vm.filterModel.chkAddress == 0) {
                                let bodyValidate = {
                                    PlanGoodsIssueNo: $vm.filterModel.saleOrderNo,
                                    PackingOption: $vm.filterModel.packOption
                                }
                                $scope.confirmPackOrder(bodyValidate);
                            } else {
                                let body = {
                                    PlanGoodsIssueNo: $vm.filterModel.saleOrderNo,
                                    address: $vm.filterModel.addressInput,
                                    province: $vm.filterModel.province.displayName,
                                    district: $vm.filterModel.district.displayName,
                                    subdistrict: $vm.filterModel.subDistrict.displayName,
                                    postcode: $vm.filterModel.postcode.displayName,
                                    userID: localStorageService.get('userTokenStorage')
                                }
                                viewModel.updateAddress(body).then(function success(res) {
                                    if(res.data.statusCode == 200){
                                        // update address success and continue confirm
                                        if (!$vm.filterModel.ownerId || !$vm.filterModel.saleOrderNo ||
                                            !$vm.filterModel.packstation || !$vm.searchResultModel) {
                                            dpMessageBox.alert({
                                                ok: 'Close',
                                                title: 'ข้อมูลไม่ครบ',
                                                message: "กรุณากรอก Owner, Pack Station, Sale Order Number และ Carton List"
                                            });
                                        } else { // not confirm
                                            let bodyValidate = {
                                                PlanGoodsIssueNo: $vm.filterModel.saleOrderNo,
                                                PackingOption: $vm.filterModel.packOption
                                            }
                                            $scope.confirmPackOrder(bodyValidate);
                                        }
                                    } else {
                                        dpMessageBox.alert({
                                            ok: 'Close',
                                            title: 'Error',
                                            message: res.data.statusDesc
                                        });
                                    }
                                }, function error(err) {});
                            }
                        });
                    }
                } else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Error',
                        message: 'Please insert carton before confirm pack'
                    });
                }
            }
        }

        $scope.confirmPackOrder = function(bodyValidate) {
            viewModel.validateBoxQty(bodyValidate).then(function success(res) {
                if (res.data.statusCode == 200) {
                    let bodyConfirm = {
                        orderNo: $vm.filterModel.saleOrderNo,
                        packStationId: $vm.filterModel.packstation,
                        username: $scope.userName,
                        packingOption: $vm.filterModel.packOption
                    }
                    viewModel.confirmPackOrder(bodyConfirm).then(function success(res) {
                        if(res.data.statusCode == 200) {
                            viewModel.printConfirmPackOrder({
                                orderNo: $vm.filterModel.saleOrderNo
                            }).then(function success(res) {
                                $scope.filterModel.ownerId = localStorageService.get("ownerVariableId");
                                $scope.filterModel.ownerIndex = localStorageService.get("ownerVariableIndex");
                                $scope.filterModel.ownerName = localStorageService.get("ownerVariableName");
                                $scope.filterModel.ownerNameTemp = $scope.filterModel.ownerName;
                                $vm.filterModel.saleOrderNo = null;
                                $vm.filterModel.saleOrderType = null;
                                $vm.filterModel.saleOrderTable = null;
                                $vm.filterModel.boxQty = 1;
                                $vm.filterModel.packStatus = null;
                                $vm.searchResultModel = null;
                                $vm.filterModel.addressInput = null;
                                $vm.filterModel.province = null;
                                $vm.filterModel.district = null;
                                $vm.filterModel.subDistrict = null;
                                $vm.filterModel.postcode = null;
                                document.getElementById("saleOrderNoInput").focus();
                            }, function error(err) {});
                            let bodyConfirmByOrder = {
                                plangoodIssueNo: $vm.filterModel.saleOrderNo
                            }
                            viewModel.packconfirmByOrder(bodyConfirmByOrder).then(function success(res) {
                                if (res.data.statusCode != 200) {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'ไม่สำเร็จ',
                                        message: 'Confirm Pack Completed, But Interface Not Complete'
                                    })
                                } else {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'สำเร็จ',
                                        message: "Confirm Pack Completed"
                                    })
                                }
                            }, function error(err) {});
                            $scope.filterModel = {};
                        } else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Error',
                                message: res.data.statusDesc
                            })
                        }
                    } , function error(err) {});
                } else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ข้อมูลไม่ถูกต้อง',
                        message: res.data.statusDesc
                    })
                }
            }, function error(err) {});
        }

        var init = function() {};
        init();

    }
});