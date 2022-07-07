app.run(['$rootScope', '$state', '$stateParams',
    function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $state.go('login');
    }
]);

app.config(['$stateProvider', '$urlRouterProvider', 'ngAuthSettings',
    function($stateProvider, $urlRouterProvider, $ngAuthSettings) {

        // login router
        $stateProvider.state('login', {
            url: "/login",
            templateUrl: $ngAuthSettings.ClientDirective + "views/state/login.html",
            controller: 'loginController',
        });


        // admin router
        $stateProvider.state('home', {
            url: "/home",
            templateUrl: $ngAuthSettings.ClientDirective + "views/state/home.html",
            controller: "homeController",
        });


        $stateProvider.state('nolayout', {
            url: "/nolayout",
            templateUrl: $ngAuthSettings.ClientDirective + "views/state/no-layout.html",
            controller: "noHeaderConntroller"
        });



        $stateProvider.state('tops', {
            url: "/tops",
            templateUrl: $ngAuthSettings.ClientDirective + "views/state/home.html",
            controller: "homeController"
        });
        // use controller
        $stateProvider.state('tops.index', {
            url: "/index",
            templateUrl: $ngAuthSettings.ClientDirective + "views/partials/home/index.html",
            controller: 'indexController',
        });
        $stateProvider.state('tops.index1', {
            url: "/Username/:Username",
            controller: function($stateParams) {
                $stateParams.Username //*** Watch Out! DOESN'T EXIST!! ***//

            },
            templateUrl: $ngAuthSettings.ClientDirective + "views/partials/home/index.html",
        });
        //GR
        $stateProvider.state('tops.plan_summary', {
            url: '/plan-summary',
            template: '<plan-summary></plan-summary>'
        });
        $stateProvider.state('tops.gr_summary', {
            url: '/gr-summary',
            template: '<gr-summary></gr-summary>'
        });
        $stateProvider.state('tops.lpn_management', {
            url: '/lpn-management',
            template: '<lpn-management></lpn-management>'
        });
        $stateProvider.state('tops.putaway_by_lpn', {
            url: '/putaway-by-lpn',
            template: '<putaway-by-lpn></putaway-by-lpn>'
        });
        $stateProvider.state('tops.putaway_by_sku', {
            url: '/putaway-by-sku',
            template: '<putaway-by-sku></putaway-by-sku>'
        });
        $stateProvider.state('tops.scan_receive', {
            url: '/scan-receive',
            template: '<scan-receive></scan-receive>'
        });

        // GI
        $stateProvider.state('tops.plan_gi_summary', {
            url: '/plan-gi-summary',
            template: '<plan-gi-summary></plan-gi-summary>'
        });
        $stateProvider.state('tops.import_store_to_store_summary', {
            url: '/import-store-to-store-summary',
            template: '<import-store-to-store-summary></import-store-to-store-summary>'
        });
        $stateProvider.state('tops.packing_summary', {
            url: '/packing-summary',
            template: '<packing-summary></packing-summary>'
        });
        $stateProvider.state('tops.packing_info', {
            url: '/packing-info',
            template: '<packing-info></packing-info>'
        });
        $stateProvider.state('tops.close_pack_station_summary', {
            url: '/close-pack-station-summary',
            template: '<close-pack-station-summary></close-pack-station-summary>'
        });
        $stateProvider.state('tops.gi_summary', {
            url: '/gi-summary',
            template: '<gi-summary></gi-summary>'
        });
        $stateProvider.state('tops.run_wave_summary', {
            url: '/run-wave-summary',
            template: '<run-wave-summary></run-wave-summary>'
        });
        $stateProvider.state('tops.print_carton_summary', {
            url: '/print-carton-summary',
            template: '<print-carton-summary></print-carton-summary>'
        });
        // $stateProvider.state('tops.cart_assign_summary', {
        //     url: '/cart-assign-summary',
        //     template: '<cart-assign-summary></cart-assign-summary>'
        // });
        $stateProvider.state('tops.cart_assign_summary', {
            url: '/cart-assign-summary',
            template: '<cart-assign-summary-v2></cart-assign-summary-v2>'
        });
        // $stateProvider.state('tops.cart_assign_picking', {
        //     url: '/cart-assign-picking',
        //     template: '<cart-assign-picking></cart-assign-picking>'
        // });
        $stateProvider.state('tops.cart_assign_picking', {
            url: '/cart-assign-picking',
            template: '<cart-assign-picking-v2></cart-assign-picking-v2>'
        });
        $stateProvider.state('tops.task_list', {
            url: '/task-list',
            template: '<task-list></task-list>'
        });
        // $stateProvider.state('tops.put_to_staging', {
        //     url: '/put-to-staging',
        //     template: '<put-to-staging></put-to-staging>'
        // });
        $stateProvider.state('tops.put_to_staging', {
            url: '/put-to-staging',
            template: '<put-to-staging-v2></put-to-staging-v2>'
        });

        $stateProvider.state('tops.pos', {
            url: '/pos',
            template: '<pos></pos>'
        });
        $stateProvider.state('tops.load_to_truck', {
            url: '/load-to-truck',
            template: '<load-to-truck></load-to-truck>'
        });
        $stateProvider.state('tops.scan_load_to_truck', {
            url: '/scan-load-to-truck',
            template: '<scan-load-to-truck></scan-load-to-truck>'
        });
        $stateProvider.state('tops.scan_qa', {
            url: '/scan-qa',
            template: '<scan-qa></scan-qa>'
        });
        $stateProvider.state('tops.call_center', {
            url: '/call-center',
            template: '<call-center></call-center>'
        });
        $stateProvider.state('tops.call_center_real_time', {
            url: '/call-center-real-time',
            template: '<call-center-real-time></call-centerreal-time>'
        });
        $stateProvider.state('tops.overall_performance_dashboard', {
            url: '/overall-performance-dashboard',
            template: '<overall-performance-dashboard></overall-performance-dashboard>'
        });
        $stateProvider.state('tops.picking_order_performance', {
            url: '/picking-order-performance',
            template: '<picking-order-performance></picking-order-performance>'
        });
        $stateProvider.state('tops.picking_order_performance_express', {
            url: '/picking-order-performance-express',
            template: '<picking-order-performance-express></picking-order-performance-express>'
        });
        $stateProvider.state('tops.picking_order_performance_backlog', {
            url: '/picking_order_performance_backlog',
            template: '<picking_order_performance_backlog></picking_order_performance_backlog>'
        });
        $stateProvider.state('tops.expected', {
            url: '/expected',
            template: '<expected></expected>'
        });
        $stateProvider.state('tops.load_to_truck_list', {
            url: '/load-to-truck-list',
            template: '<load-to-truck-list></load-to-truck-list>'
        });

        // $stateProvider.state('tops.cart_number_summary', {
        //     url: '/cart-number-summary',
        //     template: '<cart-number-summary></cart-number-summary>'
        // });

        $stateProvider.state('tops.cart_number_summary', {
            url: '/cart-number-summary',
            template: '<cart-number-summary-v2></cart-number-summary-v2>'
        });

        $stateProvider.state('tops.marshal_release_summary', {
            url: '/marshal-release-summary',
            template: '<marshal-release-summary></marshal-release-summary>'
        });

        $stateProvider.state('tops.scan_picking_tools_summary', {
            url: '/scan-picking-tools-summary',
            template: '<scan-picking-tools-summary></scan-picking-tools-summary>'
        });

        $stateProvider.state('tops.picking_tools_list', {
            url: '/picking-tools-list',
            template: '<picking-tools-list></picking-tools-list>'
        });
        $stateProvider.state('tops.picking_tools_summary', {
            url: '/picking-tools-summary',
            template: '<picking-tools-summary></picking-tools-summary>'
        });

        $stateProvider.state('tops.marshal_confirm_transfer_summary', {
            url: '/marshal-confirm-transfer-summary',
            template: '<marshal-confirm-transfer-summary></marshal-confirm-transfer-summary>'
        });

        $stateProvider.state('tops.scan_put_to_carton_summary', {
            url: '/scan-put-to-carton-summary',
            template: '<scan-put-to-carton-summary></scan-put-to-carton-summary>'
        });



        //Master Data

        $stateProvider.state('tops.equipment', {
            url: '/equipment',
            template: '<master-equipment></master-equipment>'
        });

        $stateProvider.state('tops.equipment_type', {
            url: '/equipment-type',
            template: '<master-equipment-type></master-equipment-type>'
        });

        $stateProvider.state('tops.equipment_subtype', {
            url: '/equipment-subtype',
            template: '<master-equipment-subtype></master-equipment-subtype>'
        });

        $stateProvider.state('tops.vendor', {
            url: '/vendor',
            template: '<master-vendor></master-vendor>'
        });

        $stateProvider.state('tops.vendor_type', {
            url: '/vendor-type',
            template: '<master-vendor-type></master-vendor-type>'
        });

        $stateProvider.state('tops.owner', {
            url: '/owner',
            template: '<master-owner></master-owner>'
        });

        $stateProvider.state('tops.owner_vendor', {
            url: '/owner-vendor',
            template: '<master-owner-vendor></master-owner-vendor>'
        });

        $stateProvider.state('tops.owner_type', {
            url: '/owner-type',
            template: '<master-owner-type></master-owner-type>'
        });

        $stateProvider.state('tops.owner_soldto', {
            url: '/owner-soldto',
            template: '<master-owner-soldto></master-owner-soldto>'
        });

        $stateProvider.state('tops.sold_to', {
            url: '/sold-to',
            template: '<master-sold-to></master-sold-to>'
        });

        $stateProvider.state('tops.sold_to_type', {
            url: '/sold-to-type',
            template: '<master-sold-to-type></master-sold-to-type>'
        });

        $stateProvider.state('tops.ship_to', {
            url: '/ship-to',
            template: '<master-ship-to></master-ship-to>'
        });

        $stateProvider.state('tops.ship_to_type', {
            url: '/ship-to-type',
            template: '<master-ship-to-type></master-ship-to-type>'
        });

        $stateProvider.state('tops.sold_to_ship_to', {
            url: '/sold-to-ship-to',
            template: '<master-sold-to-ship-to></master-sold-to-ship-to>'
        });

        $stateProvider.state('tops.product', {
            url: '/product',
            template: '<master-product></master-product>'
        });

        $stateProvider.state('tops.product_category', {
            url: '/product-category',
            template: '<master-product-category></master-product-category>'
        });

        $stateProvider.state('tops.product_type', {
            url: '/product-type',
            template: '<master-product-type></master-product-type>'
        });

        $stateProvider.state('tops.product_sub_type', {
            url: '/product-sub-type',
            template: '<master-product-sub-type></master-product-sub-type>'
        });
        $stateProvider.state('tops.document_type', {
            url: '/document-type',
            template: '<master-document-type></master-document-type>'
        });

        $stateProvider.state('tops.product_owner', {
            url: '/product-owner',
            template: '<master-product-owner></master-product-owner>'
        });

        $stateProvider.state('tops.product_conversion', {
            url: '/product-conversion/',
            template: '<master-product-conversion></master-product-conversion>',
        });

        $stateProvider.state('tops.product_conversion_barcode', {
            url: '/product-conversion-barcode',
            template: '<master-product-conversion-barcode></master-product-conversion-barcode>'
        });

        $stateProvider.state('tops.ware_house', {
            url: '/ware-house',
            template: '<master-ware-house></master-ware-house>'
        });

        $stateProvider.state('tops.work_area', {
            url: '/work-area',
            template: '<master-work-area></master-work-area>'
        });

        $stateProvider.state('tops.room', {
            url: '/room',
            template: '<master-room></master-room>'
        });

        $stateProvider.state('tops.zone', {
            url: '/zone',
            template: '<master-zone></master-zone>'
        });

        $stateProvider.state('tops.zone_location', {
            url: '/zone-location',
            template: '<master-zone-location></master-zone-location>'
        });

        $stateProvider.state('tops.zone_put_away', {
            url: '/zone-put-away',
            template: '<master-zone-put-away></master-zone-put-away>'
        });

        $stateProvider.state('tops.zone_put_away_location', {
            url: '/zone-put-away-location',
            template: '<master-zone-put-away-location></master-zone-put-away-location>'
        });

        $stateProvider.state('tops.location', {
            url: '/location',
            template: '<master-location></master-location>'
        });

        $stateProvider.state('tops.location_equipment', {
            url: '/location-equipment',
            template: '<master-location-equipment></master-location-equipment>'
        });

        $stateProvider.state('tops.location_lock', {
            url: '/location-lock',
            template: '<master-location-lock></master-location-lock>'
        });

        $stateProvider.state('tops.location_type', {
            url: '/location-type',
            template: '<master-location-type></master-location>'
        });

        $stateProvider.state('tops.grade', {
            url: '/grade',
            template: '<master-grade></master-grade>'
        });


        $stateProvider.state('tops.location_work_area', {
            url: '/location-work-area',
            template: '<master-location-work-area></master-location-work-area>'
        });

        $stateProvider.state('tops.user', {
            url: '/user',
            template: '<master-user></master-user>'
        });
        $stateProvider.state('tops.user_group', {
            url: '/user-group',
            template: '<master-user-group></master-user-group>'
        });
        $stateProvider.state('tops.user_group_menu', {
            url: '/user-group-menu',
            template: '<master-user-group-menu></master-user-group-menu>'
        });
        $stateProvider.state('tops.user_group_zone', {
            url: '/user-group-zone',
            template: '<master-user-group-zone></master-user-group-zone>'
        });

        $stateProvider.state('tops.task_group', {
            url: '/task-group',
            template: '<master-task-group></master-task-group>'
        });

        $stateProvider.state('tops.task_group_equipment', {
            url: '/task-group-equipment',
            template: '<master-task-group-equipment></master-task-group-equipment>'
        });

        $stateProvider.state('tops.task_group_user', {
            url: '/task-group-user',
            template: '<master-task-group-user></master-task-group-user>'
        });

        $stateProvider.state('tops.task_group_work_area', {
            url: '/task-group-work-area',
            template: '<master-task-group-work-area></master-task-group-work-area>'
        });

        $stateProvider.state('tops.master_task_group', {
            url: '/master-task-group',
            template: '<master-task-group></master-task-group>'
        });
        $stateProvider.state('tops.master_location_work_area', {
            url: '/master-location-work-area',
            template: '<master-location-work-area></master-location-work-area>'
        });
        $stateProvider.state('tops.master_work_area', {
            url: '/master-work-area',
            template: '<master-work-area></master-work-area>'
        });
        $stateProvider.state('tops.master_task_group_work_area', {
            url: '/master-task-group-work-area',
            template: '<master-task-group-work-area></master-task-group-work-area>'
        });

        $stateProvider.state('tops.master_task_group_equipment', {
            url: '/master-task-group-equipment',
            template: '<master-task-group-equipment></master-task-group-equipment>'
        });


        $stateProvider.state('tops.master_task_group_user', {
            url: '/master-task-group-user',
            template: '<master-task-group-user></master-task-group-user>'
        });

        // Tramsfer
        $stateProvider.state('tops.tranfer_summary', {
            url: '/tranfer-summary',
            template: '<tranfer-summary></tranfer-summary>'
        });

        $stateProvider.state('tops.transfer_item_active_summary', {
            url: '/transfer-item-active-summary',
            template: '<transfer-item-active-summary></transfer-item-active-summary>'
        });

        $stateProvider.state('tops.transfer_item_relocation_active_summary', {
            url: '/transfer-item-relocation-active-summary',
            template: '<transfer-item-relocation-active-summary></transfer-item-relocation-active-summary>'
        });

        $stateProvider.state('tops.transfer_item_relocation_reserve_summary', {
            url: '/transfer-item-relocation-reserve-summary',
            template: '<transfer-item-relocation-reserve-summary></transfer-item-relocation-reserve-summary>'
        });

        $stateProvider.state('tops.transfer_item_reserve_summary', {
            url: '/transfer-item-reserve-summary',
            template: '<transfer-item-reserve-summary></transfer-item-reserve-summary>'
        });

        $stateProvider.state('tops.carton_item_summary', {
            url: '/carton-item-summary',
            template: '<carton-item-summary></carton-item-summary>'
        });

        $stateProvider.state('tops.status_grade_summary', {
            url: '/status-grade-summary',
            template: '<status-grade-summary></status-grade-summary>'
        });

        $stateProvider.state('tops.transfer_pallet_summary', {
            url: '/transfer-pallet-summary',
            template: '<transfer-pallet-summary></transfer-pallet-summary>'
        });

        $stateProvider.state('tops.transfer_carton_summary', {
            url: '/transfer-carton-summary',
            template: '<transfer-carton-summary></transfer-carton-summary>'
        });

        $stateProvider.state('tops.print_carton', {
            url: '/print-carton',
            template: '<print-carton></print-carton>'
        });

        // $stateProvider.state('tops.picking_tools', {
        //     url: '/picking-tools',
        //     template: '<picking-tools></picking-tools>'
        // });

        $stateProvider.state('tops.report', {
            url: '/report-summary',
            template: '<report-summary></report-summary>'
        });

        $stateProvider.state('tops.pick_manual', {
            url: '/pick-manual',
            template: '<pick-manual-summary></pick-manual-summary>'
        });
        $stateProvider.state('tops.pick_short', {
            url: '/short-summary',
            template: '<short-summary></short-summary>'
        });


        //inquiry

        $stateProvider.state('tops.sku', {
            url: '/sku-summary',
            template: '<sku-summary></sku-summary>'
        });

        $stateProvider.state('tops.inq_location', {
            url: '/inq-location',
            template: '<inq-location></inq-location>'
        });

        $stateProvider.state('tops.inq_order', {
            url: '/inq-order',
            template: '<inq-order></inq-order>'
        });

        $stateProvider.state('tops.stock', {
            url: '/stock-summary',
            template: '<stock-summary></stock-summary>'
        });

        $stateProvider.state('tops.task', {
            url: '/task-summary',
            template: '<task-summary></task-summary>'
        });

        $stateProvider.state('tops.auto_task', {
            url: '/auto-task',
            template: '<auto-task></auto-task>'
        });

        $stateProvider.state('tops.assign_task', {
            url: '/assign-task',
            template: '<assign-task></assign-task>'
        });

        $stateProvider.state('tops.scan_task', {
            url: '/scan-task',
            template: '<scan-task-summary></scan-task-summary>'
        });

        $stateProvider.state('tops.scan_task_drop', {
            url: '/scan-task-drop',
            template: '<scan-task-drop></scan-task-drop>'
        });

        $stateProvider.state('tops.scan_task_confrim_carton', {
            url: '/scan-task-confrim-carton',
            template: '<scan-task-confrim-carton></scan-task-confrim-carton>'
        });

        $stateProvider.state('tops.assign_cart', {
            url: '/assign-cart',
            template: '<assign-cart></assign-cart>'
        });

        // cyclecountSummary
        $stateProvider.state('tops.cyclecount_summary', {
            url: '/cyclecount-summary',
            template: '<cyclecount-summary></cyclecount-summary>'
        });

        // TaskCyclecountSummary
        $stateProvider.state('tops.taskcyclecount_summary', {
            url: '/taskcyclecount-summary',
            template: '<taskcyclecount-summary></taskcyclecount-summary>'
        });

        // CountManual
        $stateProvider.state('tops.count_manual', {
            url: '/count-manual',
            template: '<count-manual></count-manual>'
        });

        // AutoPOS
        $stateProvider.state('tops.auto_pos', {
            url: '/auto-pos',
            template: '<auto-pos></auto-pos>'
        });

        // PackConfirmPWB
        $stateProvider.state('tops.pack_confirm_p_w_b', {
            url: '/pack-confirm-pwb',
            template: '<pack-confirm-p-w-b></pack-confirm-p-w-b>'
        });

        //ConfigUserGroupMenu
        $stateProvider.state('tops.config_user_group_menu', {
            url: '/config-user-group-menu',
            template: '<config-user-group-menu></config-user-group-menu>'
        });

        $stateProvider.state('tops.print_carton_summary_two', {
            url: '/print-carton-summary-two',
            template: '<print-carton-summary-two></print-carton-summary-two>'
        });
        $stateProvider.state('tops.picking_performance_click', {
            url: '/picking-performance-click',
            template: '<picking-performance-click></picking-performance-click>'
        });

        // DEMO

        $stateProvider.state('tops.serial_scan', {
            url: "/serial-scan",
            template: '<serial-scan></serial-scan>'
        });
        $stateProvider.state('tops.serial_scan_list', {
            url: "/serial-scan-list",
            template: '<serial-scan-list></serial-scan-list>'
        });

        // Carton
        $stateProvider.state('tops.carton_summary', {
            url: "/carton-summary",
            template: '<carton-summary></carton-summary>'
        });

    }

]);