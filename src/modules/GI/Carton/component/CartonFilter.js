(function () {
  "use strict";
  app.component("cartonFilter", {
    controllerAs: "$vm",
    templateUrl: function (
      $element,
      $attrs,
      /*ngAuthSettings,*/ $window,
      commonService
    ) {
      return "modules/GI/Carton/component/CartonFilter.html";
    },
    bindings: {
      filterModel: "=?",
      triggerSearch: "=?",
      triggerCreate: "=?",
      searchResultModel: "=?",
      saleOrderTable: "=?",
      saleOrderTableRender: "=?",
    },
    controller: function (
      $scope,
      $q,
      cartonFactory,
      localStorageService,
      planGoodsIssueFactory,
      pageLoading,
      dpMessageBox
    ) {
      var $vm = this;

      $scope.truckRouteSelected = [];
      $scope.storeSelected = [];
      $scope.truckRouteData = [];
      $scope.storeData = [];
      $scope.truckIdList = [];
      $scope.truckGroupIds = [];


      $scope.storeSetting = {
        enableSearch: true,
        showCheckAll: false,
        showUncheckAll: false,
        checkBoxes: true,
        displayProp: "displayStore",
        idProp: "storeNo",
      };

      $scope.isFilter = true;
      $scope.storeList = [];

      $scope.filterModel = {
        currentPage: 1,
        perPage: null,
        totalRow: 0,
        key: "",
        advanceSearch: false,
        showError: false,
        type: 1,
        chkinitpage: false,
        maxSize: 10,
        num: 1,
      };

      $scope.pageOption = [{ value: 15 }, { value: 30 }, { value: "All" }];

      $scope.changePage = function () {
        var page = $vm.filterModel;

        var all = {
          currentPage: 0,
          perPage: 0,
        };
        if ($vm.filterModel.currentPage != 0) {
          page.currentPage = page.currentPage;
        }

        $scope.filterSearch();
      };

      $scope.changeTableSize = function () {
        var p = {
          currentPage: 0, //$scope.pagging.num,
          perPage: $vm.filterModel.perPage,
        };
        $vm.filterModel.perPage = $vm.filterModel.perPage;
        $scope.filterSearch();
      };

      $scope.searchFilter = function (param) {
        const req = {
          columnName: param.columnName,
          currentPage: param.currentPage,
          numPerPage: param.numPerPage,
          orderBy: param.orderBy,
          perPage: param.perPage,
          planGoodsIssueDueDate: param.planGoodsIssueDueDate,
          planGoodsIssueDueDateTo: param.planGoodsIssueDueDateTo,
          totalRow: param.totalRow,
        };
        var deferred = $q.defer();
        planGoodsIssueFactory.planGIsearch(req).then(
          function success(res) {
            deferred.resolve(res);
          },
          function error(response) {
            deferred.reject(response);
          }
        );
        return deferred.promise;
      };

      $scope.serchPage = function () {
        runWaveFactory.runWavesearch(param).then(
          function success(res) {
            $vm.filterModel.totalRow = res.data.pagination.totalRow;
            $vm.filterModel.currentPage = res.data.pagination.currentPage;
            $vm.filterModel.perPage = res.data.pagination.perPage;
            $vm.filterModel.numPerPage = res.data.pagination.perPage;
            $vm.searchResultModel = res.data.items;
          },
          function error(res) {}
        );
      };

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
            $scope.filterModel.ownerNameTemp = angular.copy(
              param.ownerNameTemp
            );
            // $scope.filterModel.ownerNameTemp = localStorageService.get('ownerVariableName');
            document.getElementById("owner_id_input_show").focus();

            localStorageService.set('ownerVariableId', angular.copy(param.ownerId));
            localStorageService.set('ownerVariableIndex', angular.copy(param.ownerIndex));
            localStorageService.set('ownerVariableName', angular.copy(param.ownerName));
          },
        },
      };

      $scope.loadDefaultOwner = function () {
        cartonFactory
          .getDefaultOwner(localStorageService.get("userTokenStorage"))
          .then(
            function success(res) {
              $scope.filterModel.ownerId = res.data.result[0].ownerID;
              $scope.filterModel.ownerIndex = res.data.result[0].ownerIndex;
              $scope.filterModel.ownerName = res.data.result[0].ownerName;
              $scope.filterModel.ownerNameTemp = res.data.result[0].ownerName;
            },
            function error(err) {
              $scope.filterModel.ownerId = "";
              $scope.filterModel.ownerIndex = "";
              $scope.filterModel.ownerName = "";
              $scope.filterModel.ownerNameTemp = "";
            }
          );
        pageLoading.hide();
      };

      $scope.loadTruckRoute = function () {
        let body = { userId: localStorageService.get("userTokenStorage") };
        cartonFactory.getTruckRoute(body).then(
          function success(res) {
            if (res.data.statusCode == 200) {
              $scope.truckRouteData = res.data.truckRoutes;
              for (var i = 0; i < res.data.truckRouteGroups.length; i++) {
                 $scope.truckGroupIds.push(res.data.truckRouteGroups[i].truckRouteGroupId)
              }
            }
          },
          function error(err) {
            console.log("err", err);
          }
        );
        pageLoading.hide();
      };

      $scope.truckRouteSetting = {
        enableSearch: true,
        checkBoxes: true,
        displayProp: "truckRoundName",
        idProp: "truckRoundId",
        selectByGroups: $scope.truckGroupIds,
        groupBy: "truckRouteGroupId",
      };

      $scope.changeTruckRoute = {
        onSelectionChanged: function () {
          // filter store
          if ($scope.truckRouteSelected.length == 0) {
            $scope.storeData = [];
            $scope.storeSelected = [];
          } else {
            $scope.truckIdList = [];
            $scope.truckRouteSelected.forEach((value, index) => {
              $scope.truckIdList.push(value.truckRoundId);
            });

            $scope.loadStore();
            pageLoading.hide();
          }
        },
      };

      $scope.changeStoreRoute = {
        onSelectionChanged: function () {
          // filter store
          if ($scope.storeSelected.length == 0) {
            $scope.storeSelected = [];
          } else {
            $scope.storeList = [];
            $scope.storeSelected.forEach((value, index) => {
              $scope.storeList.push(value.storeNo);
            });
            pageLoading.hide();
          }
        },
      };

      $scope.loadStore = function () {
        let body = {
          TruckRouteIds: $scope.truckIdList,
          UserId: localStorageService.get("userTokenStorage"),
        };
        cartonFactory.getStoreByRoute(body).then(
          function success(res) {
            if (res.data.statusCode === "200") {
              $scope.storeData = res.data.result;
              $scope.selectDefaultAllStore();
            }

            pageLoading.hide();
          },
          function error(err) {}
        );
      };

      $scope.selectDefaultAllStore = function () {
        $scope.storeSelected = [];
        $scope.storeList = [];
        $scope.storeData.forEach((value) => {
          $scope.storeSelected.push(value);
        });
        $scope.storeSelected.forEach((value, index) => {
          $scope.storeList.push(value.storeNo);
        });
      };

      $scope.loadStatusCarton = function () {
        let body = {
          TruckRouteIds: $scope.truckRouteIds,
          StoreNos: $scope.storeList,
          UserId: localStorageService.get("userTokenStorage"),
        };
        cartonFactory.getCartonStatus(body).then(
          function success(res) {
            if (res.data.statusCode == "200") {
              $scope.filterModel.cartonStatusName =
                res.data.result[0].statusName;
              $scope.filterModel.cartonStatus = res.data.result[0].statusId;
            }
            pageLoading.hide();
          },
          function error(err) {}
        );
      };

      $scope.filterSearch = function () {
        console.log($scope.storeList.length);

        let body = {
          Size:
            $scope.filterModel.perPage == "All"
              ? null
              : $scope.filterModel.perPage,
          Page: $scope.filterModel.currentPage,
          RequestBody: {
            CartonStatusId: $scope.filterModel.cartonStatus, //number
            StoreNos: $scope.storeList,
            UserId: localStorageService.get("userTokenStorage"),
          },
        };

        console.log(body);

        cartonFactory.getCartonStore(body).then(function success(param) {
          if (param.data.statusCode == "200") {
            $vm.searchResultModel = param.data.result;
            $vm.filterModel.totalRows = param.data.totalRows;
            $vm.filterModel.currentPage = $scope.filterModel.currentPage;
            $vm.filterModel = $scope.filterModel;
            $vm.filterModel.perPage = $scope.filterModel.perPage ?? "All";
            $vm.filterModel.numPerPage = $scope.filterModel.perPage;

            pageLoading.hide();
          }อ
        });
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
      };

      $scope.clear = function () {
        $scope.loadDefaultOwner();
        $scope.loadStatusCarton();
        $scope.filterModel = {};
        $scope.truckRouteSelected = [];
        $scope.storeSelected = [];
        $scope.storeData = [];
        $vm.searchResultModel = [];
      };

      $scope.confirmCloseCarton = function () {
        let cartonStatusUpdate = 40;
        let cartonNos = $vm.searchResultModel
          .filter((it) => it.selected == true)
          .map((i) => i.cartonNo);
        let body = {
          userId: localStorageService.get("userTokenStorage"),
          cartonStatusId: cartonStatusUpdate,
          cartonNos: cartonNos,
        };

        cartonFactory.updateCartonStatus(body).then(function success(res) {
          pageLoading.hide();
          if (res.data.statusCode == "200") {
            $scope.clear();
            dpMessageBox.alert({
              ok: "Yes",
              title: "Success",
              message: res.data.statusDesc,
            });
          } else {
            dpMessageBox.alert({
              ok: "Yes",
              title: "Error",
              message: res.data.statusDesc,
            });
          }
          pageLoading.hide();
        });
      };

      this.$onInit = function () {
        // $scope.filterModel = {};
        $scope.filterModel.ownerId = "";
        $scope.filterModel.ownerIndex = "";
        $scope.filterModel.ownerName = "";
        $scope.filterModel.ownerNameTemp = "";

        $scope.loadDefaultOwner();
        $scope.loadStatusCarton();
        $scope.loadTruckRoute();

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
