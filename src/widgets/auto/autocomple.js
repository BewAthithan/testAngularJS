app.directive('autoComple', function () {
    return {
        restrict: 'E',
        scope: {
            acModel: '=ngModel',
            sourceurl: '=?',
            value: '=?',
            selected: '=?',
            isDisabled: '=?',
            api: '=?',
            code: '=?',
            id: '=?',
            index:'=?',
            name:'=?',
            key2:'=?',
            key3:'=?',
            key4:'=?',
            key5:'=?',
        },
        controller: function ($scope, $http, webServiceAPI, $timeout) {
            $scope.data = {};
            // fetch data to autocomplete txt
            $scope.loadMatchList = function (val) {
                var requestUrl = $scope.sourceurl;
                var apiUrl = $scope.api;
                var data = { key: val };

                $scope.data.chk = $scope.code;
                $scope.data.key = val;
                $scope.data.key2 = $scope.key2;
                $scope.data.key3 = $scope.key3;
                $scope.data.key4 = $scope.key4;
                $scope.data.key5 = $scope.key5;
                $scope.data.index = $scope.index;
                return $http.post(apiUrl + requestUrl, $scope.data).then(function (response) {
                    return response.data;
                });
            }

            $scope.onSelect = function ($item, $model, $label) {
                $scope.acModel = angular.copy($item.index);
                $scope.id = angular.copy($item.id);
                $scope.name = angular.copy($item.name);
                $scope.key = angular.copy($item.key);
                if ($scope.selected) {
                    $scope.selected($item);
                }

            }

            $scope.onChange = function () {
                // $scope.acModel = null;
                $scope.acModel = $scope.value;
            }
        },
        link: function (scope, attrt, element) {
        },
        templateUrl: 'widgets/auto/autocomple.html'
    }
});

