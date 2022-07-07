(function () {
  "use strict";

  app.component("loadToTruckForm", {
    controllerAs: "$vm",
    templateUrl: "modules/GI/LoadToTruck/component/loadToTruckForm.html",
    bindings: {
      onShow: "=?",
      searchResultModel: "=?",
      filterModel: "=?",
      triggerSearch: "=?",
      triggerCreate: "=?",
      isFilter: "=?",
      soList: "=?",
    },
    controller: function (
      $scope,
      $q,
      pageLoading,
      dpMessageBox,
      loadTruckFactory,
      loadTruckItemFactory,
      localStorageService,
      $state
    ) {
      var $vm = this;

      var defer = {};
      var viewModel = loadTruckFactory;

      $vm.isFilterTable = true;
      $scope.onShow = false;
      $scope.listTruckRound = ["1", "2", "3"];
      //Component life cycle

      $scope.selectedTab = function (tab) {
        $scope.selected = tab;
      };

      $scope.clickTab = function (tab) {
        $scope.click = tab;
      };

      $vm.onShow = function (param) {
        defer = $q.defer();
        if ($scope.filterModel != null) {
        }
        $scope.onShow = true;
        if (param != undefined) {
          viewModel.getId(param.truckLoadIndex).then(function (res) {
            $vm.isFilterTable = true;
            $scope.filterModel = res.data;
            // $scope.buttons.add = false;
            // $scope.buttons.update = true;

            if (res.data.documentStatus != 0) $scope.Formdisabled = true;
            else $scope.Formdisabled = false;

            loadTruckItemFactory
              .getByTruckLoadId(param.truckLoadIndex)
              .then(function (res) {
                $scope.filterModel.listLoadToTruckItemViewModel = res.data;
              });
            $scope.filterModel.listLoadToTruckItemViewModel = res.data;
            var documentStatus =
              res.data.documentStatus == 1
                ? "ยืนยัน"
                : res.data.documentStatus == 2
                ? "เสร็จสิ้น"
                : res.data.documentStatus == -1
                ? "ยกเลิก"
                : "รอการยืนยัน";
            $scope.filterModel.loadingStatus = documentStatus;
          });
        } else {
          // $scope.buttons.add = true;
          // $scope.buttons.update = false;
        }
        return defer.promise;
      };

      $vm.addItem = function (param, index, owner) {
        var owner = $scope.filterModel.ownerIndex;
        if ($scope.isLoading) {
          $vm.isFilterTable = false;
          $scope
            .isLoading(param, index, owner)
            .then(function (result) {
              $vm.isFilterTable = true;
              $scope.filterModel.listLoadToTruckItemViewModel =
                $scope.filterModel.listLoadToTruckItemViewModel || [];
              if (result != "-99") {
                $scope.filterModel.listLoadToTruckItemViewModel.push(
                  angular.copy(result)
                );
              }
            })
            .catch(function (error) {
              defer.reject({ Message: error });
            });
        }
      };

      $vm.chksoList = function (param, index) {
        var truckLoadNo = $scope.filterModel.truckLoadNo;
        var documentStatus = $scope.filterModel.documentStatus;
        if ($scope.soList) {
          $vm.isFilterTable = false;
          //$scope.isLoading = false;
          $scope
            .soList(param, index, truckLoadNo, documentStatus)
            .then(function (result) {
              if (result != "" || result != undefined) {
                $vm.isFilterTable = true;
                var soNo = param[index].refDocumentNo;
                var model = $scope.filterModel;
                //$vm.onShow(param[index]);

                if ($scope.filterModel != null) {
                }
                $scope.onShow = true;
                if (model != undefined) {
                  viewModel.getId(model.truckLoadIndex).then(function (res) {
                    $vm.isFilterTable = true;
                    $scope.filterModel = res.data;
                    // $scope.buttons.add = false;
                    // $scope.buttons.update = true;

                    if (res.data.documentStatus != 0)
                      $scope.Formdisabled = true;
                    else $scope.Formdisabled = false;

                    loadTruckItemFactory
                      .getByTruckLoadId(model.truckLoadIndex)
                      .then(function (res) {
                        $scope.filterModel.listLoadToTruckItemViewModel =
                          res.data;
                      });
                    $scope.filterModel.listLoadToTruckItemViewModel = res.data;
                    var documentStatus =
                      res.data.documentStatus == 1
                        ? "ยืนยัน"
                        : res.data.documentStatus == 2
                        ? "เสร็จสิ้น"
                        : res.data.documentStatus == -1
                        ? "ยกเลิก"
                        : "รอการยืนยัน";
                    $scope.filterModel.loadingStatus = documentStatus;
                  });
                } else {
                  // $scope.buttons.add = true;
                  // $scope.buttons.update = false;
                }

                // $vm.isFilter = true;
              }
            })
            .catch(function (error) {
              defer.reject({ Message: error });
            });
        }
      };

      $scope.popupPlanGi = {
        onShow: false,
        delegates: {},
        onClick: function (param, index) {
          $scope.popupPlanGi.onShow = !$scope.popupPlanGi.onShow;
          $scope.popupPlanGi.delegates.planGoodsIssuePopup(param, index);
        },
        config: {
          title: "PlanGI",
        },
        invokes: {
          add: function (param) {},
          edit: function (param) {},
          selected: function (param) {
            $scope.filterModel.planGoodsIssueNo = angular.copy(
              param.planGoodsIssueNo
            );

            $scope.filterModel.listLoadToTruckItemViewModel =
              $scope.filterModel.listLoadToTruckItemViewModel || [];

            viewModel
              .getPlanGoodsIssuePickTickket(param.planGoodsIssueIndex)
              .then(function (res) {
                if (res.data.length > 0) {
                  //var Activity = [];
                  var countListTruckLoadItem =
                    $scope.filterModel.listLoadToTruckItemViewModel.length;
                  var countResponseItem = res.data.length;
                  if (countListTruckLoadItem > 0) {
                    for (var i = 0; i <= res.data.length - 1; i++) {
                      res.data[i].IsAdd = 1;
                      for (var j = 0; j <= countListTruckLoadItem - 1; j++) {
                        if (
                          res.data[i].tagOutPickNo ==
                            $scope.filterModel.listLoadToTruckItemViewModel[j]
                              .tagOutPickNo &&
                          res.data[i].IsAdd == 1
                        ) {
                          res.data[i].IsAdd = 0;
                          break;
                        }
                      }
                    }

                    for (var i = 0; i <= res.data.length - 1; i++) {
                      if (res.data[i].IsAdd == 1) {
                        $scope.filterModel.listLoadToTruckItemViewModel.push(
                          angular.copy(res.data[i])
                        );
                      }
                    }
                  } else {
                    for (var i = 0; i <= res.data.length - 1; i++) {
                      $scope.filterModel.listLoadToTruckItemViewModel.push(
                        angular.copy(res.data[i])
                      );
                    }
                  }
                }
              });
          },
        },
      };

      $scope.add = function () {
        var model = $scope.filterModel;
        dpMessageBox
          .confirm({
            ok: "Yes",
            cancel: "No",
            title: "Confirm ?",
            message: "Do you want to save !",
          })
          .then(
            function () {
              Add(model).then(
                function success(res) {
                  $vm.filterModel = res.config.data;
                  $vm.searchResultModel = res.config.data;
                  //$state.reload($state.current.name);
                  defer.resolve("-99");
                },
                function error(param) {
                  dpMessageBox.alert(param).then(
                    function (param) {},
                    function (param) {}
                  );
                }
              );
              defer.resolve();
              $scope.filterModel = {};
              $scope.filterModel.truckLoadDate = getToday();
              $scope.filterModel.deliveryDate = getToday();
            },
            function error(param) {}
          );
      };

      $scope.back = function () {
        // location.reload();

        $scope.filterModel = {};
        $scope.Formdisabled = false;

        // $vm.isFilterTable = false
        // $vm.isFilter = true;
        //$state.reload();
        defer.resolve("-99");
      };

      function Add(param) {
        // if (param.dockDoorIndex == undefined || param.dockDoorName == undefined) {
        //     dpMessageBox.alert({
        //         ok: 'Close',
        //         title: 'Error.',
        //         message: "Please Check Data"
        //     })
        // }
        // else
        // {

        if (
          param.dockDoorIndex == undefined ||
          param.dockDoorName == undefined
        ) {
          dpMessageBox.alert({
            ok: "Close",
            title: "Error.",
            message: "Please Check Data",
          });
        } else {
          let deferred = $q.defer();
          let item = $scope.filterModels();
          //param.create_By = localStorageService.get('userTokenStorage');
          item = param;
          item.createBy = localStorageService.get("userTokenStorage");
          viewModel.add(item).then(
            function success(results) {
              //$state.reload();
              defer.resolve("-99");
              //deferred.resolve(results);
              $vm.onShow(param);
              dpMessageBox.alert({
                ok: "Close",
                title: "Information.",
                message: "Success !!",
              });
            },
            function error(response) {
              dpMessageBox.alert({
                ok: "Close",
                title: "Information.",
                message: "Not success !!",
              });
              deferred.reject(response);
            }
          );
          // }
          //return deferred.promise;
        }
      }

      $scope.edit = function () {
        ``;
        var model = $scope.filterModel;
        dpMessageBox
          .confirm({
            ok: "Yes",
            cancel: "No",
            title: "Confirm ?",
            message: "Do you want to save !",
          })
          .then(function () {
            Edit(model).then(
              function success(res) {
                $vm.filterModel = res.config.data;
                $vm.searchResultModel = res.config.data;
              },
              function error(param) {
                dpMessageBox.alert(param).then(
                  function (param) {},
                  function (param) {}
                );
              }
            );
          });
        //$state.reload();
        defer.resolve("-99");
        //defer.resolve();
      };

      $scope.deleteItem = function (param, index) {
        param.splice(index, 1);
      };
      $scope.editItem = function (param, index) {
        var truckLoadItem = param.truckLoadItemIndex;
        var truckLoadNo = $scope.filterModel.truckLoadNo;
        if ($scope.isLoading) {
          $vm.isFilterTable = false;
          $scope
            .isLoading(param, index, truckLoadItem, truckLoadNo)
            .then(function (result) {
              $vm.isFilterTable = true;
              $scope.filterModel.listLoadToTruckItemViewModel[
                result.index
              ] = result;
            })
            .catch(function (error) {
              defer.reject({ Message: error });
            });
        }
      };

      function validate(param) {
        var msg = "";

        return msg;
      }

      $scope.show = {
        main: true,
        transport: false,
        warehouse: false,
      };

      // $scope.buttons = {
      //     add: true,
      //     update: false,
      //     back: true
      // };

      $scope.filterModels = function () {
        $scope.filterModel.isActive = 1;
        $scope.filterModel.isDelete = 0;
        $scope.filterModel.isSystem = 0;
        $scope.filterModel.StatusId = 0;
      };

      $vm.triggerCreate = function () {
        $vm.isFilter = true;
        $vm.filterModel = $vm.filterModel || {};
        console.log($vm.filterModel);
        viewModel.filter($vm.filterModel).then(function (res) {
          viewModel.filter($vm.filterModel).then(function (res) {
            $vm.filterModel = res.data;
            $vm.searchResultModel = res.data;
            //location.reload();
          });
        });
      };

      function Edit(param) {
        var deferred = $q.defer();
        viewModel.edit(param).then(
          function success(results) {
            deferred.resolve(results);
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

      $scope.popupOwner = {
        onShow: false,
        delegates: {},
        onClick: function (param, index) {
          $scope.popupOwner.onShow = !$scope.popupOwner.onShow;
          $scope.popupOwner.delegates.ownerPopup(param, index);
        },
        config: {
          title: "owner",
        },
        invokes: {
          add: function (param) {},
          edit: function (param) {},
          selected: function (param) {
            $scope.filterModel.ownerIndex = angular.copy(param.ownerIndex);
            $scope.filterModel.ownerId = angular.copy(param.ownerId);
            $scope.filterModel.ownerName = angular.copy(param.ownerName);

            localStorageService.set('ownerVariableId', angular.copy(param.ownerId));
            localStorageService.set('ownerVariableIndex', angular.copy(param.ownerIndex));
            localStorageService.set('ownerVariableName', angular.copy(param.ownerName));
          },
        },
      };

      $scope.popupSoldTo = {
        onShow: false,
        delegates: {},
        onClick: function (index) {
          if ($scope.filterModel.ownerIndex != null) {
            index = $scope.filterModel.ownerIndex;
          }
          $scope.popupSoldTo.onShow = !$scope.popupSoldTo.onShow;
          $scope.popupSoldTo.delegates.soldToPopup(index);
        },
        config: {
          title: "SoldTo",
        },
        invokes: {
          add: function (param) {},
          edit: function (param) {},
          selected: function (param) {
            $scope.filterModel.soldToIndex = angular.copy(param.soldToIndex);
            $scope.filterModel.soldToId = angular.copy(param.soldToId);
            $scope.filterModel.soldToName = angular.copy(param.soldToName);
          },
        },
      };

      $scope.popupShipTo = {
        onShow: false,
        delegates: {},
        onClick: function (index) {
          if ($scope.filterModel.soldToIndex != null) {
            index = $scope.filterModel.soldToIndex;
          }

          $scope.popupShipTo.onShow = !$scope.popupShipTo.onShow;
          $scope.popupShipTo.delegates.shipToPopup(index);
        },
        config: {
          title: "shipTo",
        },
        invokes: {
          add: function (param) {},
          edit: function (param) {},
          selected: function (param) {
            $scope.filterModel.shipToIndex = angular.copy(param.shipToIndex);
            $scope.filterModel.shipToId = angular.copy(param.shipToId);
            $scope.filterModel.shipToName = angular.copy(param.shipToName);
          },
        },
      };

      $scope.popupRound = {
        onShow: false,
        delegates: {},
        onClick: function (param, index) {
          $scope.popupRound.onShow = !$scope.popupRound.onShow;
          $scope.popupRound.delegates.roundPopup(param, index);
        },
        config: {
          title: "Round",
        },
        invokes: {
          add: function (param) {},
          edit: function (param) {},
          selected: function (param) {
            $scope.filterModel.roundIndex = angular.copy(param.roundIndex);
            $scope.filterModel.roundId = angular.copy(param.roundId);
            $scope.filterModel.roundName = angular.copy(param.roundName);
          },
        },
      };

      $scope.popupRoute = {
        onShow: false,
        delegates: {},
        onClick: function (param, index) {
          $scope.popupRoute.onShow = !$scope.popupRoute.onShow;
          $scope.popupRoute.delegates.routePopup(param, index);
        },
        config: {
          title: "Route",
        },
        invokes: {
          add: function (param) {},
          edit: function (param) {},
          selected: function (param) {
            $scope.filterModel.routeIndex = angular.copy(param.routeIndex);
            $scope.filterModel.routeId = angular.copy(param.routeId);
            $scope.filterModel.routeName = angular.copy(param.routeName);
          },
        },
      };

      $scope.popupDockDoor = {
        onShow: false,
        delegates: {},
        onClick: function (param, index) {
          $scope.popupDockDoor.onShow = !$scope.popupDockDoor.onShow;
          $scope.popupDockDoor.delegates.dockDoorPopup(param, index);
        },
        config: {
          title: "DockDoor",
        },
        invokes: {
          add: function (param) {},
          edit: function (param) {},
          selected: function (param) {
            $scope.filterModel.dockDoorIndex = angular.copy(
              param.dockDoorIndex
            );
            $scope.filterModel.dockDoorId = angular.copy(param.dockDoorName);
            $scope.filterModel.dockDoorName = angular.copy(param.dockDoorName);
          },
        },
      };

      $scope.popupVehicleType = {
        onShow: false,
        delegates: {},
        onClick: function (param, index) {
          $scope.popupVehicleType.onShow = !$scope.popupVehicleType.onShow;
          $scope.popupVehicleType.delegates.vehicleTypePopup(param, index);
        },
        config: {
          title: "VehicleType",
        },
        invokes: {
          add: function (param) {},
          edit: function (param) {},
          selected: function (param) {
            $scope.filterModel.vehicleTypeIndex = angular.copy(
              param.vehicleTypeIndex
            );
            $scope.filterModel.vehicleTypeId = angular.copy(
              param.vehicleTypeId
            );
            $scope.filterModel.vehicleTypeName = angular.copy(
              param.vehicleTypeName
            );
          },
        },
      };

      $scope.popupContainerType = {
        onShow: false,
        delegates: {},
        onClick: function (param, index) {
          $scope.popupContainerType.onShow = !$scope.popupContainerType.onShow;
          $scope.popupContainerType.delegates.containerTypePopup(param, index);
        },
        config: {
          title: "ContainerType",
        },
        invokes: {
          add: function (param) {},
          edit: function (param) {},
          selected: function (param) {
            $scope.filterModel.containerTypeIndex = angular.copy(
              param.containerTypeIndex
            );
            $scope.filterModel.containerTypeId = angular.copy(
              param.containerTypeId
            );
            $scope.filterModel.containerTypeName = angular.copy(
              param.containerTypeName
            );
          },
        },
      };

      $scope.popupCarton = {
        onShow: false,
        delegates: {},
        onClick: function (param, index) {
          console.log("$scope.popupCarton====", $scope.popupCarton);
          $scope.popupCarton.onShow = !$scope.popupCarton.onShow;
          $scope.popupCarton.delegates.cartonPopup(param, index);
        },
        config: {
          title: "carton",
        },
        invokes: {
          add: function (param) {},
          edit: function (param) {},
          selected: function (param) {
            $scope.filterModel.containerTypeIndex = angular.copy(
              param.containerTypeIndex
            );
            $scope.filterModel.containerTypeId = angular.copy(
              param.containerTypeId
            );
            $scope.filterModel.containerTypeName = angular.copy(
              param.containerTypeName
            );
          },
        },
      };

      $scope.popupt3pl = {
        onShow: false,
        delegates: {},
        onClick: function (param, index) {
          $scope.popupt3pl.onShow = !$scope.popupt3pl.onShow;
          $scope.popupt3pl.delegates.t3plPopup(param, index);
        },
        config: {
          title: "3PL",
        },
        invokes: {
          add: function (param) {},
          edit: function (param) {},
          selected: function (param) {
            $scope.filterModel.c3PLIndex = angular.copy(param.c3PLIndex);
            $scope.filterModel.c3PLId = angular.copy(param.c3PLId);
            $scope.filterModel.c3PLName = angular.copy(param.c3PLName);
          },
        },
      };

      function getToday() {
        var today = new Date();

        var mm = today.getMonth() + 1;
        var yyyy = today.getUTCFullYear();
        var dd = today.getDate();

        if (dd < 10) dd = "0" + dd;
        if (mm < 10) mm = "0" + mm;
        return yyyy.toString() + mm.toString() + dd.toString();
      }

      var init = function () {
        console.log(getToday());
        $scope.filterModel = {};
        $scope.filterModel.goodsReceiveDate = getToday();
        $scope.userName = localStorageService.get("userTokenStorage");
      };

      init();

      $vm.$onInit = function () {
        $scope.filterModel = {};
        $scope.filterModel.goodsReceiveDate = getToday();
        $scope.selected = 1;
        $scope.click = 1;
        $scope.filterModel.truckLoadRound = "1";
        $scope.filterModel.c3PLId = "MDS01";
        $scope.filterModel.c3PLName = "MDS01 - MDS";
        $scope.filterModel.c3PLIndex = "99FEE526-20EE-4620-9AD2-05FBBCC9F2E8";
        $scope.userName = localStorageService.get("userTokenStorage");
        $scope.filterModel.truckLoadDate = getToday();
        $scope.filterModel.deliveryDate = getToday();

        $scope.filterModel.ownerId = localStorageService.get('ownerVariableId');
        $scope.filterModel.ownerIndex = localStorageService.get('ownerVariableIndex');
        $scope.filterModel.ownerName = localStorageService.get('ownerVariableName');
        $scope.filterModel.ownerNameTemp = localStorageService.get('ownerVariableName');
        
        $scope.filterModel.warehouseId = localStorageService.get('warehouseVariableId');
        $scope.filterModel.warehouseIndex = localStorageService.get('warehouseVariableIndex');
        $scope.filterModel.warehouseName = localStorageService.get('warehouseVariableName');
        $scope.filterModel.warehouseNameTemp = localStorageService.get('warehouseVariableName');
      };
    },
  });
})();
