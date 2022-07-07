(function () {
    'use strict'

    app.component('overallPerformanceDashboard', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/OverallPerformanceDashboard/overallPerformanceDashboard.html",
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, overallFactory) {

            var service = overallFactory;

            $scope.model = {};

            $scope.search = function () {
                // pageLoading.show();

                $scope.Total_Order = 0;
                $scope.New_Order = 0;
                $scope.Preparing = 0;
                $scope.PickingMarshal = 0;
                $scope.POS = 0;
                $scope.Customer_Service = 0;
                $scope.Done = 0;
                $scope.Canceled = 0;
                $scope.Ex_Total_Order = 0;
                $scope.Ex_Done = 0;
                $scope.Ex_Canceled = 0;


                $scope.OrderByRoute_route = [];
                $scope.OrderByRoute_order = [];
                $scope.PickingByRound_round = [];
                $scope.PickingByRound_pickQty = [];
                $scope.PickingByZone_zone = [];
                $scope.PickingByZone_pickQty = [];
                
                service.overallPerformanceSearch($scope.filterModel).then(function (res) {
                    $scope.model = res.data;

                    $scope.model.overallStatusViewModel.filter(c => c.statusName == 'Total_Order').forEach(function (item, key) {
                        $scope.Total_Order = item.qty;
                    });
                    $scope.model.overallStatusViewModel.filter(c => c.statusName == 'New_Order').forEach(function (item, key) {
                        $scope.New_Order = item.qty;
                    });
                    $scope.model.overallStatusViewModel.filter(c => c.statusName == 'Preparing').forEach(function (item, key) {
                        $scope.Preparing = item.qty;
                    });
                    $scope.model.overallStatusViewModel.filter(c => c.statusName == 'Picking-Marshal').forEach(function (item, key) {
                        $scope.PickingMarshal = item.qty;
                    });
                    $scope.model.overallStatusViewModel.filter(c => c.statusName == 'POS').forEach(function (item, key) {
                        $scope.POS = item.qty;
                    });
                    $scope.model.overallStatusViewModel.filter(c => c.statusName == 'Customer_Service').forEach(function (item, key) {
                        $scope.Customer_Service = item.qty;
                    });
                    $scope.model.overallStatusViewModel.filter(c => c.statusName == 'Done').forEach(function (item, key) {
                        $scope.Done = item.qty;
                    });
                    $scope.model.overallStatusViewModel.filter(c => c.statusName == 'Canceled').forEach(function (item, key) {
                        $scope.Canceled = item.qty;
                    });
                    $scope.model.overallStatusViewModel.filter(c => c.statusName == 'Ex_Total_Order').forEach(function (item, key) {
                        $scope.Ex_Total_Order = item.qty;
                    });
                    $scope.model.overallStatusViewModel.filter(c => c.statusName == 'Ex_Done').forEach(function (item, key) {
                        $scope.Ex_Done = item.qty;
                    });
                    $scope.model.overallStatusViewModel.filter(c => c.statusName == 'Ex_Canceled').forEach(function (item, key) {
                        $scope.Ex_Canceled = item.qty;
                    });

                    $scope.model.orderByRouteViewModel.forEach(function(item, key) {
                        $scope.OrderByRoute_route.push(item.route);
                        $scope.OrderByRoute_order.push(item.order);
                    });

                    $scope.model.pickingByRoundViewModel.forEach(function(item, key) {
                        $scope.PickingByRound_round.push(item.round);
                        $scope.PickingByRound_pickQty.push(parseFloat(item.pickQty).toFixed(2));
                    });

                    $scope.model.pickingByZoneViewModel.forEach(function(item, key) {
                        $scope.PickingByZone_zone.push(item.zone);
                        $scope.PickingByZone_pickQty.push(parseFloat(item.pickQty).toFixed(2));
                    });

                    //Pie Chart
                    var ctxD = document.getElementById("orderByRoundChart").getContext('2d');
                    var myLineChart = new Chart(ctxD, {
                        type: 'doughnut',
                        data: {
                            labels: $scope.OrderByRoute_route,
                            datasets: [{
                                data: $scope.OrderByRoute_order,
                                backgroundColor: ["#FF6666", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360","#66CC33"],
                                hoverBackgroundColor: ["#FF3366", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774","#669933"]
                            }],
                        },
                        options: {
                            responsive: true,
                            title: {
                                display: true,
                                text: 'Order Performance By Route',
                                fontSize: 16
                            },
                            legend: {
                                display: true,
                                labels: { fontColor: 'black' },
                                position: 'bottom'
                            },
                            showAllTooltips: false,
                        }, 
                    });
                    
                    var ctxD2 = document.getElementById("pickingByRoundChart").getContext('2d');
                    var myLineChart2 = new Chart(ctxD2, {
                        type: 'doughnut',
                        data: {
                            labels: $scope.PickingByRound_round,
                            datasets: [{
                                data: $scope.PickingByRound_pickQty,
                                backgroundColor: ["#FF6666", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360","#66CC33"],
                                hoverBackgroundColor: ["#FF3366", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774","#669933"]
                            }]
                        },
                        options: {
                            responsive: true,
                            title: {
                                display: true,
                                text: 'Order Performance By Round',
                                fontSize: 16
                            },
                            legend: {
                                display: true,
                                labels: { fontColor: 'black' },
                                position: 'bottom'
                            },
                            showAllTooltips: false,
                        }
                    });

                    var ctxD3 = document.getElementById("pickingByZoneChart").getContext('2d');
                    var myLineChart3 = new Chart(ctxD3, {
                        type: 'doughnut',
                        data: {
                            labels: $scope.PickingByZone_zone,
                            datasets: [{
                                data: $scope.PickingByZone_pickQty,
                                backgroundColor: ["#46BFBD", "#FDB45C", "#949FB1", "#4D5360","#66CC33"],
                                hoverBackgroundColor: ["#5AD3D1", "#FFC870", "#A8B3C5", "#616774","#669933"]
                            }]
                        },
                        options: {
                            responsive: true,
                            title: {
                                display: true,
                                text: 'Picking Performance By Zone',
                                fontSize: 16
                            },
                            legend: {
                                display: true,
                                labels: { fontColor: 'black' },
                                position: 'bottom'
                            },
                            showAllTooltips: false,
                        }
                    });
                    //End Pie Chart

                    // pageLoading.hide();
                }).catch(function () {
                    // pageLoading.hide();

                    dpMessageBox.alert({
                        ok: 'OK',
                        titile: 'Error',
                        message: "Page load failed."
                    });
                });
            }

            $scope.TotalOrderByRound_Order = function () {
                var total = 0.00;
                if ($scope.model.orderByRoundViewModel) {
                    $scope.model.orderByRoundViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.order);
                    });
                }
                return total.toFixed(2);
            }
            $scope.TotalOrderByRound_Done = function () {
                var total = 0.00;
                if ($scope.model.orderByRoundViewModel) {
                    $scope.model.orderByRoundViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.done);
                    });
                }
                return total.toFixed(2);
            }
            $scope.TotalOrderByRound_Canceled = function () {
                var total = 0.00;
                if ($scope.model.orderByRoundViewModel) {
                    $scope.model.orderByRoundViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.canceled);
                    });
                }
                return total.toFixed(2);
            }
            $scope.TotalOrderByRound_Remain = function () {
                var total = 0.00;
                if ($scope.model.orderByRoundViewModel) {
                    $scope.model.orderByRoundViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.remain);
                    });
                }
                return total.toFixed(2);
            }

            $scope.TotalPickingByRound_PickQty = function () {
                var total = 0.00;

                if ($scope.model.pickingByRoundViewModel) {
                    $scope.model.pickingByRoundViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.pickQty);
                    });
                }
                return total.toFixed(2);
            }
            $scope.TotalPickingByRound_Fulfilled = function () {
                var total = 0.00;
                if ($scope.model.pickingByRoundViewModel) {
                    $scope.model.pickingByRoundViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.fulfilled);
                    });
                }
                return total.toFixed(2);
            }
            $scope.TotalPickingByRound_UnFulfilled = function () {
                var total = 0.00;
                if ($scope.model.pickingByRoundViewModel) {
                    $scope.model.pickingByRoundViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.unFulfilled);
                    });
                }
                return total.toFixed(2);
            }
            $scope.TotalPickingByRound_Remain = function () {
                var total = 0.00;
                if ($scope.model.pickingByRoundViewModel) {
                    $scope.model.pickingByRoundViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.remain);
                    });
                }
                return total.toFixed(2);
            }

            $scope.TotalPickingByZone_PickQty = function () {
                var total = 0.00;
                if ($scope.model.pickingByZoneViewModel) {
                    $scope.model.pickingByZoneViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.pickQty);
                    });
                }
                return total.toFixed(2);
            }
            $scope.TotalPickingByZone_Fulfilled = function () {
                var total = 0.00;
                if ($scope.model.pickingByZoneViewModel) {
                    $scope.model.pickingByZoneViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.fulfilled);
                    });
                }
                return total.toFixed(2);
            }
            $scope.TotalPickingByZone_UnFulfilled = function () {
                var total = 0.00;
                if ($scope.model.pickingByZoneViewModel) {
                    $scope.model.pickingByZoneViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.unFulfilled);
                    });
                }
                return total.toFixed(2);
            }
            $scope.TotalPickingByZone_Remain = function () {
                var total = 0.00;
                if ($scope.model.pickingByZoneViewModel) {
                    $scope.model.pickingByZoneViewModel.forEach(function (item, key) {
                        total = parseFloat(total) + parseFloat(item.remain);
                    });
                }
                return total.toFixed(2);
            }

            $scope.$watch('filterModel.OverallDate', function (value) {
                $scope.search();
            });

            //Chart function
            Chart.pluginService.register({
                beforeRender: function (chart) {
                    if (chart.config.options.showAllTooltips) {
                        // create an array of tooltips
                        // we can't use the chart tooltip because there is only one tooltip per chart
                        chart.pluginTooltips = [];
                        chart.config.data.datasets.forEach(function (dataset, i) {
                            chart.getDatasetMeta(i).data.forEach(function (sector, j) {
                                chart.pluginTooltips.push(new Chart.Tooltip({
                                    _chart: chart.chart,
                                    _chartInstance: chart,
                                    _data: chart.data,
                                    _options: chart.options.tooltips,
                                    _active: [sector]
                                }, chart));
                            });
                        });
    
                        // turn off normal tooltips
                        chart.options.tooltips.enabled = false;
                    }
                },
                afterDraw: function (chart, easing) {
                    if (chart.config.options.showAllTooltips) {
                        // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
                        if (!chart.allTooltipsOnce) {
                            if (easing !== 1)
                                return;
                            chart.allTooltipsOnce = true;
                        }
    
                        // turn on tooltips
                        chart.options.tooltips.enabled = true;
                        Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
                            tooltip.initialize();
                            tooltip.update();
                            // we don't actually need this since we are not animating tooltips
                            tooltip.pivot();
                            tooltip.transition(easing).draw();
                        });
                        chart.options.tooltips.enabled = false;
                    }
                }
            });
            //

            function init() {
                $scope.filterModel = {
                    OverallDate: $filter('date')(new Date(),'yyyyMMdd')
                };
            }
            init();
        }
    })
})();