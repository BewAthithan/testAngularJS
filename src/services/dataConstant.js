(function () {
    app.constant('msgSettings', {
        msgDelConfirm: "ยืนยันการลบข้อมูล",
        msgDelSucc: "ลบข้อมูลสำเร็จ",
        msgDelFail: "ลบข้อมูลไม่สำเร็จ",
    });

    var api = {
        GR: 'http://10.0.177.30/SIT_TOPSCLUB_GRAPI/api/',
        GI: 'http://10.0.177.30/SIT_TOPSCLUB_GIAPI/api/',
        Transfer: 'http://10.0.177.30/SIT_TOPSCLUB_TransferAPI/api/',
        NewTransfer: 'http://10.0.177.30/SIT_TOPSCLUB_NewFW_TransferAPI/api/',
        Master: 'http://10.0.177.30/SIT_TOPSCLUB_MasterAPI/api/',
        NewMaster : 'http://10.0.177.30/SIT_TOPSCLUB_NewFW_MasterDataAPI/api/',
        Report: 'http://10.0.177.30/SIT_TOPSCLUB_ReportAPI/api/',
        NewReport: 'http://10.0.177.30/SIT_TOPSCLUB_NewFW_Report/api/',
        Provider: 'http://10.0.177.30/SIT_TOPSCLUB_InterfaceWMSAPI/api/',
        Dashboard: 'http://10.0.177.30/SIT_TOPSCLUB_DashboardAPI/api/',
        AutoPOS: 'http://10.0.177.30/SIT_TOPSCLUB_GIAPI/api/',
        Substitute: 'http://10.0.177.30/SIT_TOPSCLUB_Substitute/api/',
        NewInterface: 'http://10.0.177.30/SIT_TOPSCLUB_NewFW_Interface/api/',
        NewFW: 'http://10.0.177.30/SIT_TOPSCLUB_NewFW_GIAPI/api/',
        NewFWGR: 'http://10.0.177.30/SIT_TOPSCLUB_NewFW_GRAPI/api/',
        NewFWProvider: 'http://10.0.177.30/SIT_TOPSCLUB_NewFW_Provider/api/',
        NewRunwave: 'http://10.0.177.30/SIT_TOPSCLUB_NewFW_Runwave/api/',
        NewGI: 'http://10.0.177.30/SIT_TOPSCLUB_NewFW_GIAPI/api/',
        NewPacking: 'http://10.0.177.30/SIT_TOPSCLUB_NewFW_Pack/api/',
        NewOutbound: 'http://10.0.177.30/SIT_TOPSCLUB_NewFW_Outbound/api/',
    }

    var global = {
        validateBarcodeDigit: 0
    }
	
    var _url = api;
    var globalVariable = global;
	
    app.constant('webServiceAPI', _url);
	app.constant('globalVariable', globalVariable);
    app.constant('authenConstant', {
        url: 'api/User/addUser',
    });

    app.constant('ngAuthSettings', {
        WebService: _url,
        rootUrl: '',
        WebClient: '',
        ClientDirective: '',
        clientId: 'id',
        directory: {
            directive: '',
            modules: '',
            assets: '',
            widgets: ''
        }
    });

    app.constant('ngLangauge', [
        { id: 1, lang: "en", name: "EN" },
        { id: 2, lang: "th", name: "TH" }
    ]);
}());