
(function () {
    'use strict'
    app.directive('reasonCodePopupTable', function () {
        return {
            restrict: 'E',
            controllerAs: '$ctrl',
            templateUrl: "modules/GI/component/ReasonCode/ReasonCodePopupTable/ReasonCodePopupTable.html",
            scope: {
                delegates: '=',
                invokes: '=',
                config: '=',
                paginations: '=?'
            },
            controller: ['$scope', 'commonService', '$filter', 'dpMessageBox', function ($scope, commonService, $filter, dpMessageBox) {
                $scope.invokes = $scope.invokes || {};
                $scope.config = $scope.config || {};
                $scope.config.paginations = $scope.config.paginations || {};
                $scope.items = [];
                $scope.items = $scope.items || [];
                var xObj = commonService.objects;
                var eFindItem = $filter('findItem');
                $scope.model = {
                    currentPage: $scope.config.currentPage + 1,
                    numPerPage: $scope.config.numPerPage,
                    totalRow: 0
                };
                $scope.show = {
                    action: true,
                    pagination: true,
                    checkBox: false
                }
                $scope.pageMode = 'Implement your config !';
                $scope.delegate = {
                    set: function (model, type, paginations) {
                        $scope.type = type;
                        if($scope.type == "form") {
                            $scope.callcenter = true;
                        } else {
                            $scope.callcenter = false;
                        }
                        $scope.items = model;
                    },
                    filter: function (model) {
                        $scope.items = model.dataModel;
                    },
                    delete: function (index) { },
                    selected: function (index) { },
                    edit: function (index) { },
                    add: function (model) {
                        var a = eFindItem({ items: $scope.items, filed: 'id', value: model.id });
                        if (!xObj.IsArray($scope.items)) {
                            $scope.items = [];
                        }
                        if (a == null)
                            $scope.items.push(model);
                    }
                };

                $scope.delegates = $scope.delegate;

                $scope.checkReason = function (param) {

                    for (let index = 0; index < $scope.items.length; index++) {
                        if (index != param) {
                            $scope.items[index].check = false;
                        }

                    }

                }

                $scope.selected = function (param, model) {
                    const result = param.filter((param) => {
                        return param.check == true
                    })

                    console.log(param, model, $scope.IsAccept, $scope.IsDissmiss);

                    if($scope.type == "form") {
                        model = {};
                        model.IsDissmiss = true;
                        $scope.invokes.selected(result, model);
                    } else {
                        if (!$scope.IsAccept && !$scope.IsDissmiss) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "กรุณาใส่ข้อมูลให้ครบ"
                            })
                            $scope.onShow = true;
                        } else if ($scope.IsAccept && result[0].reasonCodeId == 'RJ11') {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "กรุณาเลือกเหตุผลให้ถูกต้อง"
                            })
                            $scope.onShow = true;
                        }
                        else if ($scope.IsDissmiss && result[0].reasonCodeId != 'RJ11') {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "กรุณาเลือกเหตุผลให้ถูกต้อง"
                            })
                            $scope.onShow = true;
                        }
                        else {
                            model = $scope;
                            if ($scope.invokes.selected) {
                                $scope.invokes.selected(result, model);
                                $scope.IsAccept = false;
                                $scope.IsDissmiss = false;
                                $scope.disable1 = false;
                                $scope.disable2 = false;
                                $('#table_setting_1').prop('checked', false);
                                $('#table_setting_2').prop('checked', false);
                                $('input#table_setting_1.ng-valid.ng-not-empty.ng-dirty.ng-valid-parse.ng-touched').prop('checked', false);
                                $('input#table_setting_2.ng-valid.ng-not-empty.ng-dirty.ng-valid-parse.ng-touched').prop('checked', false);
                            }                                
                        }
                    }
                    
                }

                $scope.detectcheck = function (item) {
                    if (item == 1) {
                        $scope.IsAccept = !$scope.IsAccept;
                        $scope.IsDissmiss = false;
                        $scope.disable1 = false;
                        $scope.disable2 = true;
                    } else if (item == 2) {
                        $scope.IsAccept = false;
                        $scope.IsDissmiss = !$scope.IsDissmiss;
                        $scope.disable1 = true;
                        $scope.disable2 = false;
                    }
                    if(
                        (!$scope.IsAccept && !$scope.IsDissmiss) ||
                        (!$scope.IsAccept && $scope.disable2) ||
                        (!$scope.IsDissmiss && $scope.disable1)
                    ) {
                        $scope.disable1 = false;
                        $scope.disable2 = false;
                    }
                    console.log($scope.IsAccept, $scope.IsDissmiss);
                }

                var init = function () {
                    if ($scope.config.pageMode == "Search") {
                        $scope.pageMode = "Search";
                    }
                }
                $scope.changeTableSize = function () {
                    if ($scope.invokes.page) {
                        var p = {
                            currentPage: $scope.pagging.num,
                            numPerPage: $scope.model.numPerPage
                        };
                        $scope.invokes.page(p);
                    }
                }
                $scope.pagging = {
                    num: 1,
                    totalRow: 0,
                    currentPage: 1,
                    maxSize: 10,
                    perPage: $scope.config.numPerPage,
                    change: function () {
                        if ($scope.invokes.page) {
                            var p = {
                                currentPage: $scope.pagging.currentPage - 1,
                                numPerPage: $scope.pagging.perPage
                            };
                            var all = {
                                currentPage: 0,
                                numPerPage: 0
                            };
                            $scope.invokes.page(p);
                        }
                    }
                };
                $scope.pageOption = [
                    { 'value': 10 },
                    { 'value': 30 },
                    { 'value': 50 },
                    { 'value': 100 },
                    { 'value': 500 },
                ];
                init();

            }],
            link: function ($scope, $element, $attributes) { }
        }
    });
}());
