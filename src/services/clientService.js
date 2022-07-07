app.factory("clientService", ["$q", "$http", "localStorageService", "webServiceAPI", function($q, $http, localStorageService, webServiceAPI) {

    var modules = {};


    modules.get = function(url) {
        var defer = $q.defer();
        $http.get(url).then(function(result) {
            if (result.status === 200) {
                defer.resolve(result);
            } else {
                defer.reject({ 'Message': result.Message });
            }
        }).catch(function(error) {
            defer.reject({ 'Message': error });
        });
        return defer.promise;
    }

    modules.post = function (url, data) {
        var defer = $q.defer();

        if(url == webServiceAPI.Master + 'Owner/popupSearch' && data.advanceSearch == true) {
            data.ownerId = data.ownerId;
            data.ownerIndex = "";
            data.ownerName = data.ownerName;
        } else if(url == webServiceAPI.Master + 'Warehouse/popupSearch' && data.advanceSearch == true) {
            data.warehouseId = data.warehouseId;
            data.warehouseIndex = "";
            data.warehouseName = data.warehouseName;
        } else {
            data.ownerId = localStorageService.get('ownerVariableId');
            data.ownerIndex = localStorageService.get('ownerVariableIndex');
            data.ownerName = localStorageService.get('ownerVariableName');
            data.warehouseId = localStorageService.get('warehouseVariableId');
            data.warehouseIndex = localStorageService.get('warehouseVariableIndex');
            data.warehouseName = localStorageService.get('warehouseVariableName');
        }

        $http.post(url, data).then(function (result) {

            if (result.status === 200) {
                defer.resolve(result);
            } else {
                defer.reject({ 'Message': result.Message });
            }
        }).catch(function(error) {
            defer.reject({ 'Message': error });
        });

        return defer.promise;
    }

    modules.downloadExcel = function(url, data) {
        var defer = $q.defer();

        data.ownerId = localStorageService.get('ownerVariableId');
        data.ownerIndex = localStorageService.get('ownerVariableIndex');
        data.ownerName = localStorageService.get('ownerVariableName');
        data.warehouseId = localStorageService.get('warehouseVariableId');
        data.warehouseIndex = localStorageService.get('warehouseVariableIndex');
        data.warehouseName = localStorageService.get('warehouseVariableName');

        $http.post(url, data, { responseType: 'arraybuffer' }).then(function(result) {
            if (result.status === 200) {
                var blob = new Blob([result.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                var objectUrl = URL.createObjectURL(blob);
                window.open(objectUrl);

                var name = Math.round(new Date() / 1000);
                let a = $("<a />", { href: objectUrl, download: name }).appendTo("body").get(0).click();
                defer.resolve(result);
            } else {
                defer.reject({ 'Message': result.Message });
            }
        }).catch(function(error) {
            defer.reject({ 'Message': error });
        });

        return defer.promise;
    }
    
    modules.downloadExcelInquiry = function(url, data) {

        var defer = $q.defer();

        data.ownerId = localStorageService.get('ownerVariableId');
        data.ownerIndex = localStorageService.get('ownerVariableIndex');
        data.ownerName = localStorageService.get('ownerVariableName');
        data.warehouseId = localStorageService.get('warehouseVariableId');
        data.warehouseIndex = localStorageService.get('warehouseVariableIndex');
        data.warehouseName = localStorageService.get('warehouseVariableName');

        $http.post(url, data, { responseType: 'arraybuffer' }).then(function(result) {
            if (result.status === 200) {
                debugger
                var blob = new Blob([result.data], { type: "octet/stream" });
                var objectUrl = URL.createObjectURL(blob);
                //window.open(objectUrl);

                //var name = Math.round(new Date() / 1000);

                var dt = new Date();

                var dtString = `${
                        dt.getFullYear().toString().padStart(4, '0')}${
                        (dt.getMonth()+1).toString().padStart(2, '0')}${
                        dt.getDate().toString().padStart(2, '0')}_${
                        dt.getHours().toString().padStart(2, '0')}${
                        dt.getMinutes().toString().padStart(2, '0')
                }`

                var name;                
               
                if(result.config.data.excelName == 'LocationDetails')
                {
                    name = result.config.data.excelName + '_' + dtString;
                }
                if(result.config.data.excelName == 'PutawaySuggestionLocation')
                {
                    name = result.config.data.excelName + '_' + dtString;
                }
                if(result.config.data.excelName == 'StockMovement')
                {
                    name = result.config.data.excelName + '_' + dtString;
                }
                
                let a = $("<a />", { href: objectUrl, download: name + '.xlsx' }).appendTo("body").get(0).click();
                defer.resolve(result);
            } else {
                defer.reject({ 'Message': result.Message });
            }
        }).catch(function(error) {
            defer.reject({ 'Message': error });
        });

        return defer.promise;
    }

    modules.downloadInquiry = function(url, data) {

        var defer = $q.defer();

        data.ownerId = localStorageService.get('ownerVariableId');
        data.ownerIndex = localStorageService.get('ownerVariableIndex');
        data.ownerName = localStorageService.get('ownerVariableName');
        data.warehouseId = localStorageService.get('warehouseVariableId');
        data.warehouseIndex = localStorageService.get('warehouseVariableIndex');
        data.warehouseName = localStorageService.get('warehouseVariableName');
        
        $http.post(url, data, { responseType: 'arraybuffer' }).then(function(result) {

            if (result.status === 200) {
                debugger
                var blob = new Blob([result.data], { type: "octet/stream" });
                var objectUrl = URL.createObjectURL(blob);
                //window.open(objectUrl);

                //var name = Math.round(new Date() / 1000);

                var dt = new Date();

                var dtString = `${
                        dt.getFullYear().toString().padStart(4, '0')}${
                        (dt.getMonth()+1).toString().padStart(2, '0')}${
                        dt.getDate().toString().padStart(2, '0')}_${
                        dt.getHours().toString().padStart(2, '0')}${
                        dt.getMinutes().toString().padStart(2, '0')
                }`

                var name;                
               
                if(result.config.data.excelName == 'LocationDetails')
                {
                    name = result.config.data.excelName + '_' + dtString + '.' + result.config.data.reportType;
                }
                if(result.config.data.excelName == 'PutawaySuggestionLocation')
                {
                    name = result.config.data.excelName + '_' + dtString + '.' + result.config.data.reportType;
                }
                if(result.config.data.excelName == 'StockMovement')
                {
                    name = result.config.data.excelName + '_' + dtString + '.' + result.config.data.reportType;
                }
                
                let a = $("<a />", { href: objectUrl, download: name }).appendTo("body").get(0).click();
                defer.resolve(result);
            } else {
                defer.reject({ 'Message': result.Message });
            }
        }).catch(function(error) {
            defer.reject({ 'Message': error });
        });

        return defer.promise;
    }


    modules.put = function(url, data) {
        var defer = $q.defer();

        data.ownerId = localStorageService.get('ownerVariableId');
        data.ownerIndex = localStorageService.get('ownerVariableIndex');
        data.ownerName = localStorageService.get('ownerVariableName');
        data.warehouseId = localStorageService.get('warehouseVariableId');
        data.warehouseIndex = localStorageService.get('warehouseVariableIndex');
        data.warehouseName = localStorageService.get('warehouseVariableName');

        $http.put(url, data).then(function(result) {

            if (result.status === 200) {
                defer.resolve(result);
            } else {
                defer.reject({ 'Message': result.Message });
            }
        }).catch(function(error) {
            defer.reject({ 'Message': error });
        });

        return defer.promise;
    }

    modules.delete = function(url) {
        var defer = $q.defer();

        $http.delete(url).then(function(result) {

            if (result.status === 200) {
                defer.resolve(result);
            } else {
                defer.reject({ 'Message': result.Message });
            }
        }).catch(function(error) {
            defer.reject({ 'Message': error });
        });

        return defer.promise;
    }

    return modules;

}]);

