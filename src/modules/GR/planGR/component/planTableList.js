"use strict";
app.component("planTableList", {
  controllerAs: "$vm",
  templateUrl: function (
    $element,
    $attrs,
    /*ngAuthSettings,*/ $window,
    commonService
  ) {
    return "modules/GR/planGR/component/planTableList.html";
  },
  bindings: {
    isLoading: "=?",
    searchResultModel: "=?",
    filterModel: "=?",
    triggerSearch: "=?",
    triggerCreate: "=?",
    isFilter: "=?",
  },
  controller: function (
    $scope,
    $filter,
    $q,
    $compile,
    $http,
    /*ngAuthSettings,*/ $state,
    /*authService,*/ pageLoading,
    $window,
    commonService,
    localStorageService,
    $timeout,
    $translate,
    dpMessageBox,
    planGoodsReceiveFactory
  ) {
    var $vm = this;
    var XFindItem = $filter("findItemList");
    var Progressbar = pageLoading;
    $scope.items = $scope.items || [];
    var viewModel = planGoodsReceiveFactory;
    var item = $vm.searchResultModel;
    // setting column
    $scope.showColumnSetting = false;

    // var validateMsg = "";
    var validatestatus1 = "";
    var validatestatus3 = [];
    var validateChk = [];
    var validateDelete = [];
    var validateMsg = [];

    $vm.$onInit = function () {};

    $vm.triggerCreate = function () {
      if ($scope.onShow) {
        $vm.isFilter = false;
        $scope
          .onShow()
          .then(function (result) {
            $vm.isFilter = true;
          })
          .catch(function (error) {
            defer.reject({ Message: error });
          });
      }
    };

    $scope.editItem = function (param) {
      viewModel.getId(param.planGoodsReceiveIndex).then(function (res) {
        if (
          res.data.userAssign == "" ||
          res.data.userAssign == undefined ||
          res.data.userAssign == null ||
          res.data.userAssign == $scope.userName
        ) {
          param.UserAssign = $scope.userName;
          viewModel.updateUserAssign(param).then(function (res) {
            if ($scope.onShow) {
              $vm.isFilter = false;
              $scope
                .onShow(param)
                .then(function (result) {
                  $vm.isFilter = true;
                })
                .catch(function (error) {
                  defer.reject({ Message: error });
                });
            }
          });
        } else {
          dpMessageBox
            .confirm({
              ok: "Yes",
              cancel: "No",
              title: "InformaTion",
              message: "มี User อื่นทำอยู่ จะ ทำแทน หรือไม่ ?",
            })
            .then(function success() {
              param.UserAssign = $scope.userName;
              viewModel.updateUserAssign(param).then(
                function (res) {
                  if ($scope.onShow) {
                    $vm.isFilter = false;
                    $scope
                      .onShow(param)
                      .then(function (result) {
                        $vm.isFilter = true;
                      })
                      .catch(function (error) {
                        defer.reject({ Message: error });
                      });
                  }
                },
                function error(res) {}
              );
            });
        }
      });
    };

    $scope.delete = function (param) {
      if (param.documentStatus == 1) {
        dpMessageBox.alert({
          ok: "Close",
          title: "Cancel",
          message: "ไม่สามารถลบข้อมูลที่ Confirm แล้วได้",
        });
      } else {
        dpMessageBox
          .confirm({
            ok: "Yes",
            cancel: "No",
            title: "Cancel",
            message: "Do you want to Cancel ?",
          })
          .then(function success() {
            param.cancel_By = localStorageService.get("userTokenStorage");
            viewModel.getDelete(param).then(
              function success(res) {
                $vm.triggerSearch();
                if (res.data == false) {
                  dpMessageBox.alert({
                    ok: "OK",
                    title: "InformaTion",
                    message:
                      "ไม่สามารถลบข้อมูลได้ เนื่องจากมีการผูกเอกสารแล้ว ?",
                  });
                }
              },
              function error(res) {}
            );
          });
      }
    };

    $scope.comfirmStatus = function (param) {
      if (param.documentStatus == 0)
        dpMessageBox
          .confirm({
            ok: "Yes",
            cancel: "No",
            title: "Confirm Status",
            message: "Do you want to Confirm ?",
          })
          .then(function success() {
            param.update_By = localStorageService.get("userTokenStorage");
            viewModel.confirmStatus(param).then(
              function success(res) {
                $vm.triggerSearch();
              },
              function error(res) {}
            );
          });
      else
        dpMessageBox.alert({
          ok: "Yes",
          title: "Confirm Status",
          message: "Status has been Confirmed !!!",
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

    $scope.closeDocument = function () {
      console.log("get in close document");
      validatestatus1 = "";
      validatestatus3 = [];
      validateChk = [];
      validateDelete = [];
      validateMsg = [];

      var validateChk = "";
      for (let index = 0; index < $vm.searchResultModel.length; index++) {
        if ($vm.searchResultModel[index].selected) {
          if ($vm.searchResultModel[index].documentStatus != "-2")
            validateChk =
              validateChk +
              " " +
              $vm.searchResultModel[index].planGoodsReceiveNo;
        }
      }
      if (validateChk == "") {
        MessageBox.alert({
          ok: "Close",
          title: "Close Document",
          message: "กรุณาเลือกข้อมูล !!",
        });
        return;
      }

      var m = {};
      m.GoodsReceiveNoList = [];
      for (let index = 0; index < $vm.searchResultModel.length; index++) {
        if ($vm.searchResultModel[index].selected)
          m.GoodsReceiveNoList.push(
            "'" + $vm.searchResultModel[index].planGoodsReceiveNo + "'"
          );
      }

      // for (let index = 0; index < $vm.searchResultModel.length; index++) {
      // if ($vm.searchResultModel[index].selected) {

      viewModel.CheckDocumentStatus(m).then(function success(results) {
        if (results.data.length > 0) {
          dpMessageBox.alert({
            ok: "Close",
            title: "Information.",
            messageNewLine: results.data,
          });
        } else {
          dpMessageBox
            .confirm({
              ok: "Yes",
              cancel: "No",
              title: "Confirm.",
              message: "ต้องการปิดเอกสารหรือไม่",
            })
            .then(function success() {
              var item = angular.copy($vm.searchResultModel);
              var models = {};
              var idx = [];
              var ide = [
                "'" + localStorageService.get("userTokenStorage") + "'",
              ];
              angular.forEach(item, function (v, k) {
                if (v.selected) {
                  // idx.push("'" + v.planGoodsReceiveIndex + "'")
                  idx.push(v.planGoodsReceiveNo);
                }
              });

              // models = { 'id': idx, 'username': ide };
              models = {
                GoodsReceiveNoList: idx,
                UserID: localStorageService.get("userTokenStorage"),
              };

              // if (models.length < 1) {
              //     MessageBox.alert({
              //         title: 'Information.',
              //         message: 'Please Selected Item To Close Document .'
              //     });
              // } else {
              closeDocument(models);
              // }
            });
        }
      });
    };

    function closeDocument(param) {
      console.log("get in close document");

      var deferred = $q.defer();
      var item = param;
      Progressbar.show();
      var msg = validate();
      if (msg != "") {
        deferred.reject(msg);
      } else {
        console.log(item);
        viewModel.closePO(item).then(
          function success(res) {
            console.log(res);
            if (res.data.statusCode == "200") {
              dpMessageBox.alert({
                ok: "Close",
                title: "Close Document",
                message: "Close Document Success !!",
              });
              $vm.triggerSearch();
            } else {
              var desc = res.data.statusDesc.replaceAll(",", "\n");
              console.log(desc);
              dpMessageBox.alert({
                ok: "Close",
                title: "Close Document",
                message: desc,
              });
            }
            Progressbar.hide();
            deferred.resolve(res);
          },
          function error(response) {
            Progressbar.hide();
            MessageBox.alert({
              ok: "Close",
              title: "Information.",
              message: "กรุณาเลือกข้อมูล !!",
            });
            deferred.reject(response);
          }
        );
        // viewModel.closeDocument(item).then(
        //     function success(results) {
        //         if (results.data == true) {
        //             MessageBox.alert({
        //                 ok: 'Close',
        //                 title: 'Close Document',
        //                 message: 'Close Document Success !!'
        //             })
        //             $vm.triggerSearch();
        //         }
        //         else {
        //             MessageBox.alert({
        //                 ok: 'Close',
        //                 title: 'Close Document',
        //                 message: 'มีการผูกเอกสารไปแล้ว และยังทำการรับสินค้าไม่เสร็จสิ้น'
        //             })
        //         }

        //         Progressbar.hide();
        //         deferred.resolve(results);
        //     },
        //     function error(response) {
        //         Progressbar.hide();
        //         MessageBox.alert({
        //             ok: 'Close',
        //             title: 'Information.',
        //             message: 'กรุณาเลือกข้อมูล !!'
        //         })
        //         deferred.reject(response);

        //     }
        // );
      }
      return deferred.promise;
    }

    function validate(param) {
      var msg = "";
      return msg;
    }

    var MessageBox = dpMessageBox;

    $scope.pageMode = "Master";

    $scope.$watch(
      "tblHeader",
      function (n, o) {
        if (n) {
          localStorageService.set(_storageName, n);
        }
      },
      true
    );

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
        if (value > 10) return "#C1FDC2";
        else if (value > 0) return "#FBFDC0";
        else return "#FF7777";
      }

      return "";
    };

    $scope.show = {
      action: true,
      pagination: true,
      checkBox: false,
    };
    $scope.model = {
      currentPage: $vm.filterModel.currentPage + 1,
      numPerPage: $vm.filterModel.numPerPage,
      totalRow: 0,
    };

    // coload toggle
    $scope.showCoload = false;
    $scope.pageOption = [
      {
        value: 30,
      },
      {
        value: 50,
      },
      {
        value: 100,
      },
      {
        value: 500,
      },
    ];

    $scope.changePage = function () {
      $vm.filterModel.vendorIndex =
        $vm.filterModel.vendorName === undefined ||
        $vm.filterModel.vendorName == ""
          ? ($vm.filterModel.vendorIndex = "")
          : $vm.filterModel.vendorIndex;
      $vm.filterModel.documentTypeIndex =
        $vm.filterModel.documentTypeName === undefined ||
        $vm.filterModel.documentTypeName == ""
          ? ($vm.filterModel.documentTypeIndex = "")
          : $vm.filterModel.documentTypeIndex;
      $vm.filterModel.ownerIndex =
        $vm.filterModel.ownerName === undefined ||
        $vm.filterModel.ownerName == ""
          ? ($vm.filterModel.ownerIndex = "")
          : $vm.filterModel.ownerIndex;
      $vm.filterModel.processStatusIndex =
        $vm.filterModel.processStatusName === undefined ||
        $vm.filterModel.processStatusName == ""
          ? ($vm.filterModel.processStatusIndex = "")
          : $vm.filterModel.processStatusIndex;
      $vm.filterModel.warehouseIndex =
        $vm.filterModel.warehouseName === undefined ||
        $vm.filterModel.warehouseName == ""
          ? ($vm.filterModel.warehouseIndex = "")
          : $vm.filterModel.warehouseIndex;
      $vm.filterModel.warehouseIndexTo =
        $vm.filterModel.warehouseNameTo === undefined ||
        $vm.filterModel.warehouseNameTo == ""
          ? ($vm.filterModel.warehouseIndexTo = "")
          : $vm.filterModel.warehouseIndexTo;
      $vm.filterModel.documentStatus =
        $vm.filterModel.processStatusName === undefined ||
        $vm.filterModel.processStatusName == ""
          ? ($vm.filterModel.documentStatus = "")
          : $vm.filterModel.documentStatus;
      var page = $vm.filterModel;
      var all = {
        currentPage: 0,
        numPerPage: 0,
      };
      if ($vm.filterModel.currentPage != 0) {
        page.currentPage = page.currentPage;
      }
      serchPage(page);
    };

    $scope.changeTableSize = function () {
      let ChangeTable = 1;
      if ($scope.model.numPerPage == undefined) {
        $scope.model.numPerPage = $vm.filterModel.perPage;
      }
      // var p = {
      //     currentPage: ChangeTable,
      //     numPerPage: $vm.filterModel.perPage
      // };

      var p = $vm.filterModel;

      serchPage(p);
    };

    $vm.filterModel = {
      num: 1,
      maxSize: 5,
      currentPage: $vm.filterModel.perPage,
      columnName: $vm.filterModel.columnName,
      orderBy: $vm.filterModel.orderBy,
    };
    function serchPage(data) {
      if (data != null) {
        pageLoading.show();
        viewModel.planGrsearch(data).then(function (res) {
          pageLoading.hide();
          if (res.data.length != 0 && res.data.length != undefined) {
            $vm.filterModel.totalRow = res.data[0].count;
            $vm.searchResultModel = res.data;
          } else {
            if (res.data.pagination != null) {
              $vm.filterModel.totalRow = res.data.pagination.totalRow;
              $vm.filterModel.currentPage = res.data.pagination.currentPage;
              $vm.searchResultModel = res.data.itemsPlanGR;
            }
          }
        });
      }
    }

    function validate(param) {
      var msg = "";
      return msg;
    }

    var initForm = function () {};
    var init = function () {
      $scope.userName = localStorageService.get("userTokenStorage");
    };
    init();
  },
});
