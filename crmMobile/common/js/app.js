/**
 * Created by 玉良 on 2016/2/21.
 */
var app = angular.module("app", ['ionic','oc.lazyLoad','ngStorage','appFilters','appDirectives','ionic-datepicker', 'ionic-citypicker','ui.rCalendar','ui.bootstrap'])
    .run(
    ['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]
).config(
    [        '$controllerProvider', '$compileProvider', '$filterProvider', '$provide','$ionicConfigProvider',
        function ($controllerProvider,   $compileProvider,   $filterProvider,   $provide,   $ionicConfigProvider) {

            //懒加载的控制器，指令和服务
            app.controller = $controllerProvider.register;
            app.directive  = $compileProvider.directive;
            app.filter     = $filterProvider.register;
            app.factory    = $provide.factory;
            app.service    = $provide.service;
            app.constant   = $provide.constant;
            app.value      = $provide.value;

            $ionicConfigProvider.scrolling.jsScrolling(true);
        }
    ])
    .config(function (ionicDatePickerProvider) {
        var datePickerObj = {
            inputDate: new Date(),
            setLabel: '设定',
            todayLabel: '今天',
            closeLabel: '关闭',
            mondayFirst: false,
            weeksList: ["日", "一", "二", "三", "四", "五", "六"],
            monthsList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            templateType: 'modal',
            from: new Date(1950, 1, 1),
            to: new Date(2018, 1, 1),
            showTodayButton: true,
            dateFormat: 'yyyy-MM-dd',
            closeOnSelect: false,
            disableWeekdays:[]
        };
        ionicDatePickerProvider.configDatePicker(datePickerObj);
    })
    /*.config(function (ionicDatePickerProvider) {
        var datePickerObj = {
            inputDate: new Date(),
            setLabel: 'Set',
            todayLabel: 'Today',
            closeLabel: 'Close',
            mondayFirst: false,
            weeksList: ["S", "M", "T", "W", "T", "F", "S"],
            monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
            templateType: 'popup',
            from: new Date(2012, 8, 1),
            to: new Date(2018, 8, 1),
            showTodayButton: true,
            dateFormat: 'dd MMMM yyyy',
            closeOnSelect: false,
            disableWeekdays: [6],
        };
        ionicDatePickerProvider.configDatePicker(datePickerObj);
    })*/
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
            .otherwise('/login');
        $stateProvider
            .state('login', {
                cache: false,//禁用缓存
                url: '/login',
                templateUrl: 'system/html/login.html',
                controller:'loginCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['system/js/controller/login.js']);
                        }]
                }
            })
            .state('forgetPassword', {
                cache: false,//禁用缓存
                url: '/forgetPassword',
                templateUrl: 'system/html/forgetPassword.html',
                controller:'forgetPasswordCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                             return $ocLazyLoad.load(['system/js/controller/forgetPassword.js']);
                        }]
                }
            })
            .state('home', {
                cache: false,//禁用缓存
                url: '/home',
                templateUrl: 'system/html/home.html',
                controller:'homeCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['system/js/controller/home.js']);
                                });
                        }]
                }
            })



            //会员信息
            .state('membInfo', {
                cache: false,//禁用缓存
                url: '/membInfo',
                templateUrl: 'member/tpl/membInfo.html',
                controller:'membInfoCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        /*function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membInfo.js']);
                                });
                        }]*/
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['member/js/controller/membInfo.js']);
                        }]
                }
            })

            //会员信息-搜索
            .state('membSelect', {
                cache: false,//禁用缓存
                url: '/membSelect',
                templateUrl: 'member/tpl/membSelect.html',
                controller:'membSelectCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membSelect.js']);
                                });
                        }]
                }
            })

            //会员信息-会员详情页
            .state('membDetailInfo', {
                cache: false,//禁用缓存
                //url: '/membDetailInfo?memIndex',
                url: '/membDetailInfo?membNum',
                templateUrl: 'member/tpl/membDetailInfo.html',
                controller:'membDetailInfoCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membDetailInfo.js']);
                                });
                        }]
                }
            })
            //会员信息-会员详情页-查看回复记录
            .state('membRevisitRecView', {
                cache: false,//禁用缓存
                url: '/membRevisitRecView?membNum&memRevisIndex',
                templateUrl: 'member/tpl/membRevisitRecView.html',
                controller:'membRevisitRecViewCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membRevisitRecView.js']);
                                });
                        }]
                }
            })

            //详细购买明细
            .state('membBuyDetail', {
                cache: false,//禁用缓存
                url: '/membBuyDetail?membNum&memBuyIndex',
                templateUrl: 'member/tpl/membBuyDetail.html',
                controller:'membBuyDetailCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membBuyDetail.js']);
                                });
                        }]
                }
            })
            //会员详细资料
            .state('membDetailPersonalInfo', {
                cache: false,//禁用缓存
                url: '/membDetailPersonalInfo?membNum',
                templateUrl: 'member/tpl/membDetailPersonalInfo.html',
                controller:'membDetailPersonalInfoCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membDetailPersonalInfo.js']);
                                });
                        }]
                }
            })
            //会员详细资料-所在地区
            .state('membLocalAreaView', {
                cache: false,//禁用缓存
                url: '/membLocalAreaView?membNum',
                templateUrl: 'member/tpl/membLocalAreaView.html',
                controller:'membLocalAreaViewCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membLocalAreaView.js']);
                                });
                        }]
                }
            })
            //会员详细资料-肌肤现状

            .state('membSkinStatusView', {
                cache: false,//禁用缓存
                url: '/membSkinStatusView?membNum',
                templateUrl: 'member/tpl/membSkinStatusView.html',
                controller:'membSkinStatusViewCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membSkinStatusView.js']);
                                });
                        }]
                }
            })

            //会员详细资料-护肤品喜好
            .state('membSkincareProdPrefView', {
                cache: false,//禁用缓存
                url: '/membSkincareProdPrefView?membNum',
                templateUrl: 'member/tpl/membSkincareProdPrefView.html',
                controller:'membSkincareProdPrefViewCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membSkincareProdPrefView.js']);
                                });
                        }]
                }
            })
            //会员详细资料-肌肤护理
            .state('membSkincareDmndView', {
                cache: false,//禁用缓存
                url: '/membSkincareDmndView?membNum',
                templateUrl: 'member/tpl/membSkincareDmndView.html',
                controller:'membSkincareDmndViewCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membSkincareDmndView.js']);
                                });
                        }]
                }
            })

            //会员信息-会员资料编辑
            .state('membInfoUpdate', {
                cache: false,//禁用缓存
                url: '/membInfoUpdate?membNum',
                templateUrl: 'member/tpl/membInfoUpdate.html',
                controller:'membInfoUpdateCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membInfoUpdate.js']);
                                });
                        }]
                }
            })


            //会员信息-编辑-编辑来源渠道
            .state('membChnlUpdate', {
                cache: false,//禁用缓存
                url: '/membChnlUpdate?membNum',
                templateUrl: 'member/tpl/membChnlUpdate.html',
                controller:'membChnlUpdateCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membChnlUpdate.js']);
                                });
                        }]
                }
            })

            //会员信息-编辑-编辑性别
            .state('membSexUpdate', {
                cache: false,//禁用缓存
                url: '/membSexUpdate?membNum',
                templateUrl: 'member/tpl/membSexUpdate.html',
                controller:'membSexUpdateCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membSexUpdate.js']);
                                });
                        }]
                }
            })
            //会员信息-编辑-编辑所在地区
            .state('membLocalAreaUpdate', {
                cache: false,//禁用缓存
                url: '/membLocalAreaUpdate?membNum',
                templateUrl: 'member/tpl/membLocalAreaUpdate.html',
                controller:'membLocalAreaUpdateCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membLocalAreaUpdate.js']);
                                });
                        }]
                }
            })
            //会员信息-编辑-编辑肌肤类型
            .state('membSkinTypeUpdate', {
                cache: false,//禁用缓存
                url: '/membSkinTypeUpdate?membNum',
                templateUrl: 'member/tpl/membSkinTypeUpdate.html',
                controller:'membSkinTypeUpdateCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membSkinTypeUpdate.js']);
                                });
                        }]
                }
            })
            //会员信息-编辑-编辑肌肤现状
            .state('membSkinStatusUpdate', {
                cache: false,//禁用缓存
                url: '/membSkinStatusUpdate?membNum',
                templateUrl: 'member/tpl/membSkinStatusUpdate.html',
                controller:'membSkinStatusUpdateCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membSkinStatusUpdate.js']);
                                });
                        }]
                }
            })
            //会员信息-编辑-编辑护肤品喜好
            .state('membSkincareProdPrefUpdate', {
                cache: false,//禁用缓存
                url: '/membSkincareProdPrefUpdate?membNum',
                templateUrl: 'member/tpl/membSkincareProdPrefUpdate.html',
                controller:'membSkincareProdPrefUpdateCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membSkincareProdPrefUpdate.js']);
                                });
                        }]
                }
            })
            //会员信息-编辑-编辑护肤护理需求
            .state('membSkincareDmndUpdate', {
                cache: false,//禁用缓存
                url: '/membSkincareDmndUpdate?membNum',
                templateUrl: 'member/tpl/membSkincareDmndUpdate.html',
                controller:'membSkincareDmndUpdateCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membSkincareDmndUpdate.js']);
                                });
                        }]
                }
            })

            //会员操作
            .state('membOperateMenu', {
                cache: false,//禁用缓存
                url: '/membOperateMenu',
                templateUrl: 'member/tpl/membOperateMenu.html',
                controller:'membOperateMenuCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membOperateMenu.js']);
                                });
                        }]
                }
            })
            //会员操作-新增会员
            .state('membBasInsert', {
                cache: false,//禁用缓存
                url: '/membBasInsert',
                templateUrl: 'member/tpl/membBasInsert.html',
                controller:'membBasInsertCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membBasInsert.js']);
                                });
                        }]
                }
            })

            //会员操作-新增-新增来源渠道
            .state('membChnlInsert', {
                cache: false,//禁用缓存
                url: '/membChnlInsert',
                templateUrl: 'member/tpl/membChnlInsert.html',
                controller:'membChnlInsertCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membChnlInsert.js']);
                                });
                        }]
                }
            })

            //会员操作-新增-新增性别
            .state('membSexInsert', {
                cache: false,//禁用缓存
                url: '/membSexInsert',
                templateUrl: 'member/tpl/membSexInsert.html',
                controller:'membSexInsertCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membSexInsert.js']);
                                });
                        }]
                }
            })
            //会员操作-新增-新增所在地区
            .state('membLocalAreaInsert', {
                cache: false,//禁用缓存
                url: '/membLocalAreaInsert',
                templateUrl: 'member/tpl/membLocalAreaInsert.html',
                controller:'membLocalAreaInsertCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membLocalAreaInsert.js']);
                                });
                        }]
                }
            })
            //会员操作-新增-新增肌肤类型
            .state('membSkinTypeInsert', {
                cache: false,//禁用缓存
                url: '/membSkinTypeInsert',
                templateUrl: 'member/tpl/membSkinTypeInsert.html',
                controller:'membSkinTypeInsertCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membSkinTypeInsert.js']);
                                });
                        }]
                }
            })
            //会员操作-新增-新增肌肤现状
            .state('membSkinStatusInsert', {
                cache: false,//禁用缓存
                url: '/membSkinStatusInsert',
                templateUrl: 'member/tpl/membSkinStatusInsert.html',
                controller:'membSkinStatusInsertCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membSkinStatusInsert.js']);
                                });
                        }]
                }
            })
            //会员操作-新增-新增护肤品喜好
            .state('membSkincareProdPrefInsert', {
                cache: false,//禁用缓存
                url: '/membSkincareProdPrefInsert',
                templateUrl: 'member/tpl/membSkincareProdPrefInsert.html',
                controller:'membSkincareProdPrefInsertCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membSkincareProdPrefInsert.js']);
                                });
                        }]
                }
            })
            //会员操作-新增-新增护肤护理需求
            .state('membSkincareDmndInsert', {
                cache: false,//禁用缓存
                url: '/membSkincareDmndInsert',
                templateUrl: 'member/tpl/membSkincareDmndInsert.html',
                controller:'membSkincareDmndInsertCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membSkincareDmndInsert.js']);
                                });
                        }]
                }
            })


            //BA回访
            .state('membRevisitMenu', {
                cache: false,//禁用缓存
                url: '/membRevisitMenu',
                templateUrl: 'member/tpl/membRevisitMenu.html',
                controller:'membRevisitMenuCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membRevisitMenu.js']);
                                });
                        }]
                }
            })
            //BA回访-ba回访任务
            .state('membRevisitTsk', {
                cache: false,//禁用缓存
                url: '/membRevisitTsk',
                templateUrl: 'member/tpl/membRevisitTsk.html',
                controller:'membRevisitTskCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membRevisitTsk.js']);
                                });
                        }]
                }
            })
            //BA回访-ba回访任务详情
            .state('membRevisitTskDetail', {
                cache: false,//禁用缓存
                url: '/membRevisitTskDetail?curMembIndex',
                templateUrl: 'member/tpl/membRevisitTskDetail.html',
                controller:'membRevisitTskDetailCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membRevisitTskDetail.js']);
                                });
                        }]
                }
            })
            //BA回访-ba回访任务详情-回访指导
            .state('membRevisitFbk', {
                cache: false,//禁用缓存
                url: '/membRevisitFbk?curMembIndex',
                templateUrl: 'member/tpl/membRevisitFbk.html',
                controller:'membRevisitFbkCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membRevisitFbk.js']);
                                });
                        }]
                }
            })
            //BA回访-ba回访任务详情-回访指导详情
            .state('membRevisitFbkDetail', {
                cache: false,//禁用缓存
                url: '/membRevisitFbkDetail?curMembIndex&curIndex',
                templateUrl: 'member/tpl/membRevisitFbkDetail.html',
                controller:'membRevisitFbkDetailCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membRevisitFbkDetail.js']);
                                });
                        }]
                }
            })
            //BA回访-ba回访任务详情-新增记录
            .state('membRevisitRecInsert', {
                cache: false,//禁用缓存
                url: '/membRevisitRecInsert?curMembIndex',
                templateUrl: 'member/tpl/membRevisitRecInsert.html',
                controller:'membRevisitRecInsertCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membRevisitRecInsert.js']);
                                });
                        }]
                }
            })
            //新增回访记录
            /*.state('membRevisitRecInsert2', {
                cache: false,//禁用缓存
                url: '/membRevisitRecInsert2',
                templateUrl: 'member/tpl/membRevisitRecInsert2.html',
                controller:'membRevisitRecInsert2Ctrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membRevisitRecInsert2.js']);
                                });
                        }]
                }
            })*/
            //BA回访-ba回访记录
            .state('membRevisitRec', {
                cache: false,//禁用缓存
                url: '/membRevisitRec',
                templateUrl: 'member/tpl/membRevisitRec.html',
                controller:'membRevisitRecCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membRevisitRec.js']);
                                });
                        }]
                }
            })

            //BA回访-ba回访记录-回访详细记录
            .state('membRevisitRecDetail', {
                cache: false,//禁用缓存
                url: '/membRevisitRecDetail?curMembOid',
                templateUrl: 'member/tpl/membRevisitRecDetail.html',
                controller:'membRevisitRecDetailCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membRevisitRecDetail.js']);
                                });
                        }]
                }
            })
            //首页-会员新增回访记录
            .state('membRevisitRecInsert2', {
                cache: false,//禁用缓存
                url: '/membRevisitRecInsert2',
                templateUrl: 'member/tpl/membRevisitRecInsert2.html',
                controller:'membRevisitRecInsert2Ctrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membRevisitRecInsert2.js']);
                                });
                        }]
                }
            })
            //首页-会员新增回访记录-会员选择
            .state('membSelect2', {
                cache: false,//禁用缓存
                url: '/membSelect2',
                templateUrl: 'member/tpl/membSelect2.html',
                controller:'membSelect2Ctrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['member/js/controller/membSelect2.js']);
                                });
                        }]
                }
            })
            
    
    .state('stfList', {
                cache: false,//禁用缓存
                url: '/stfList',
                templateUrl: 'staff/html/stfList.html',
                controller:'stfListCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                              return $ocLazyLoad.load(['staff/js/controller/stfList.js']);
                        }]
                }
            })
            /* 个人中心-个人详情*/
            .state('personalCenter', {
                cache: false,//禁用缓存
                url: '/personalCenter',
                templateUrl: 'person/html/personalCenter.html',
                controller:'personalCenterCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                              return $ocLazyLoad.load(['person/js/controller/personalCenter.js']);
                        }]
                }
            })
           /* 个人中心-个人信息*/
            .state('personalDetail', {
                cache: false,//禁用缓存
                url: '/personalDetail',
                params:{"stfNum":null},
                templateUrl: 'person/html/personalDetail.html',
                controller:'personalDetailCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                    	    return $ocLazyLoad.load(['person/js/controller/personalDetail.js']);
                        }]
                }
            })
            /*个人中心-工资卡*/
            .state('moneyCard', {
                cache: false,//禁用缓存
                url: '/moneyCard',
                templateUrl: 'person/html/moneyCard.html',
                controller:'moneyCardCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['person/js/controller/moneyCard.js']);
                                });
                        }]
                }
            })
            /* 个人中心-工资卡-修改密码*/
            .state('modPwd', {
              cache: false,//禁用缓存
              url: '/modPwd',
              templateUrl: 'person/html/modPwd.html',
              controller:'modPwdCtrl',
              resolve: {
                  deps: ['$ocLazyLoad',
                      function ($ocLazyLoad) {
                          return $ocLazyLoad.load(['ngTable']).then(
                              function () {
                                  return $ocLazyLoad.load(['person/js/controller/modPwd.js']);
                              });
                      }]
              }
          })
          /* 个人中心-工资卡-设置新密码*/
            .state('modPwdNextStep', {
              cache: false,//禁用缓存
              url: '/modPwdNextStep',
              templateUrl: 'person/html/modPwdNextStep.html',
              controller:'modPwdNxtStpCtrl',
              resolve: {
                  deps: ['$ocLazyLoad',
                      function ($ocLazyLoad) {
                          return $ocLazyLoad.load(['ngTable']).then(
                              function () {
                                  return $ocLazyLoad.load(['person/js/controller/modPwdNextStep.js']);
                              });
                      }]
                }
            })
                /* 个人中心-意见反馈*/
              .state('feedback', {
                cache: false,//禁用缓存
                url: '/feedback',
                templateUrl: 'person/html/feedback.html',
                controller:'feedbackCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['person/js/controller/feedback.js']);
                                });
                        }]
                }
            })
            /* 设置*/
              .state('setup', {
                cache: false,//禁用缓存
                url: '/setup',
                templateUrl: 'person/html/setup.html',
                controller:'setupCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['person/js/controller/setup.js']);
                                });
                        }]
                }
            })
           .state('stfInfo', {
                cache: false,//禁用缓存
                url: '/stfInfo',
                params:{"stfNum":null},
                templateUrl: 'staff/html/stfInfo.html',
                controller:'stfInfoCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                    	    return $ocLazyLoad.load(['staff/js/controller/stfInfo.js']);
                        }]
                }
            })
            //消息列表
           .state('msgList', {
                cache: false,//禁用缓存
                url: '/msgList',
                templateUrl: 'system/html/msgList.html',
                controller:'msgListCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                    	    return $ocLazyLoad.load(['system/js/controller/msgList.js']);
                        }]
                }
            })
            // 人员变动首页
            .state('stfChangeIndex', {
                cache: false,//禁用缓存
                url: '/stfChangeIndex',
                templateUrl: 'staff/html/stfChangeIndex.html',
                controller:'stfChangeIndexCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/stfChangeIndex.js']);
                        }]
                }
            })
            // BA借调记录
            .state('stfTempTransSelect', {
                cache: false,//禁用缓存
                url: '/stfTempTransSelect',
                templateUrl: 'staff/html/stfTempTransSelect.html',
                controller:'stfTempTransSelectController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/stfTempTransSelectController.js']);
                        }]
                }
            })
            // BA借调记录详情
            .state('stfTempTransDetails', {
                cache: false,//禁用缓存
                url: '/stfTempTransDetails',
                params:{"applNum":null},
                templateUrl: 'staff/html/stfTempTransDetails.html',
                controller:'stfTempTransDetailsController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/stfTempTransDetailsController.js']);
                        }]
                }
            })
            // BA借调记录新增
            .state('stfTempTransInsert', {
                cache: false,//禁用缓存
                url: '/stfTempTransInsert',
                templateUrl: 'staff/html/stfTempTransInsert.html',
                controller:'stfTempTransInsertController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/stfTempTransInsertController.js']);
                        }]
                }
            })
            // BA借调记录修改
            .state('stfTempTransUpdate', {
                cache: false,//禁用缓存
                url: '/stfTempTransUpdate',
                templateUrl: 'staff/html/stfTempTransUpdate.html',
                params:{"applNum":null},
                controller:'stfTempTransUpdateController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/stfTempTransUpdateController.js']);
                        }]
                }
            })
            // 人员管理-考勤管理-审批考勤报表
            .state('appAttendReport', {
                cache: false,//禁用缓存
                url: '/appAttendReport',
                templateUrl: 'staff/html/appAttendReport.html',
                controller:'appAttendReportController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/appAttendReport.js']);
                        }]
                }
            })
            // 人员管理-考勤管理-审批考勤报表-详细查看页面
            .state('appAttendReportInfo', {
                cache: false,//禁用缓存
                url: '/appAttendReportInfo/:oid/:updtTm/:flag',
                //params:{oid:null,updtTm:null},
                templateUrl: 'staff/html/appAttendReportInfo.html',
                controller:'appAttendReportInfoController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/appAttendReportInfo.js']);
                        }]
                }
            })
            // 人员管理-考勤管理-审批考勤报表历史
            .state('appAttendReportHistory', {
                cache: false,//禁用缓存
                url: '/appAttendReportHistory',
                templateUrl: 'staff/html/appAttendReportHistory.html',
                controller:'appAttendReportHistoryController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/appAttendReportHistory.js']);
                        }]
                }
            })
            // 人员管理-考勤管理-审批考勤报表历史-详细查看页面
            .state('appAttendReportInfoHistory', {
                cache: false,//禁用缓存
                url: '/appAttendReportInfoHistory/:oid/:updtTm',
                //params:{oid:null,updtTm:null},
                templateUrl: 'staff/html/appAttendReportInfoHistory.html',
                controller:'appAttendReportInfoHistoryController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/appAttendReportInfoHistory.js']);
                        }]
                }
            })
            // 人员管理-考勤管理-审批考勤报表-详细查看页面-编辑
            .state('appAttendReportInfoUpdate', {
                cache: false,//禁用缓存
                url: '/appAttendReportInfoUpdate/:oid/:updtTm',
                //params:{oid:null,updtTm:null},
                templateUrl: 'staff/html/appAttendReportInfoUpdate.html',
                controller:'appAttendReportInfoUpdateController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/appAttendReportInfoUpdate.js']);
                        }]
                }
            })
            // 人员管理-考勤管理-审批考勤报表-批量审核
            .state('appAttendReportAppList', {
                cache: false,//禁用缓存
                url: '/appAttendReportAppList',
                //params:{oid:null,updtTm:null},
                templateUrl: 'staff/html/appAttendReportAppList.html',
                controller:'appAttendReportAppListController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/appAttendReportAppList.js']);
                        }]
                }
            })
            // 请假管理
            .state('leaveApplManager', {
                cache: false,//禁用缓存
                url: '/leaveApplManager',
                templateUrl: 'staff/html/leaveApplManager.html',
                controller:'leaveApplManagerController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/leaveApplManagerController.js']);
                        }]
                }
            })
            // 请假管理详情
            .state('leaveApplInfo', {
                cache: false,//禁用缓存
                url: '/leaveApplInfo',
                params:{"applNum":null},
                templateUrl: 'staff/html/leaveApplInfo.html',
                controller:'leaveApplInfoController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/leaveApplInfoController.js']);
                        }]
                }
            })
            // 请假新增
            .state('leaveApplInsert', {
                cache: false,//禁用缓存
                url: '/leaveApplInsert',
                templateUrl: 'staff/html/leaveApplInsert.html',
                controller:'leaveApplInsertController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/leaveApplInsertController.js']);
                        }]
                }
            })
            // 编辑请假
            .state('leaveApplUpdate', {
                cache: false,//禁用缓存
                url: '/leaveApplUpdate',
                params:{"leaveNm":null},
                templateUrl: 'staff/html/leaveApplUpdate.html',
                controller:'leaveApplUpdateController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/leaveApplUpdateController.js']);
                        }]
                }
            })
            // ba晋升督导流程
            .state('persActSelect', {
                cache: false,//禁用缓存
                url: '/persActSelect',
                templateUrl: 'staff/html/persActSelect.html',
                controller:'persActSelectController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/persActSelectController.js']);
                        }]
                }
            })
            // 晋升详情
            .state('persActInfo', {
                cache: false,//禁用缓存
                url: '/persActInfo',
                params:{"applNum":null},
                templateUrl: 'staff/html/persActInfo.html',
                controller:'persActInfoController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/persActInfoController.js']);
                        }]
                }
            })
            // 晋升申请
            .state('persActInsert', {
                cache: false,//禁用缓存
                url: '/persActInsert',
                templateUrl: 'staff/html/persActInsert.html',
                controller:'persActInsertController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/persActInsertController.js']);
                        }]
                }
            })
            // 晋升编辑
            .state('persActUpdate', {
                cache: false,//禁用缓存
                url: '/persActUpdate',
                params:{"applNum":null},
                templateUrl: 'staff/html/persActUpdate.html',
                controller:'persActUpdateController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/persActUpdateController.js']);
                        }]
                }
            })
            // 入职流程列表
            .state('entryAppl', {
                cache: false,//禁用缓存
                url: '/entryAppl',
                templateUrl: 'staff/html/entryAppl.html',
                controller:'entryApplCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/entryAppl.js']);
                        }]
                }
            })
            // 入职流程详情
            .state('entryApplInfo', {
                cache: false,//禁用缓存
                url: '/entryApplInfo',
                templateUrl: 'staff/html/entryApplInfo.html',
                params:{applNum:null,frontPage:null},
                controller:'entryApplInfoCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/entryApplInfo.js']);
                        }]
                }
            })
            // 新增入职流程
            .state('entryApplInsert', {
                cache: false,//禁用缓存
                url: '/entryApplInsert',
                templateUrl: 'staff/html/entryApplInsert.html',
                controller:'entryApplInsertCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/entryApplInsert.js']);
                        }]
                }
            })
            // 编辑入职流程
            .state('entryApplUpdate', {
                cache: false,//禁用缓存
                url: '/entryApplUpdate',
                templateUrl: 'staff/html/entryApplUpdate.html',
                params:{entApplNum:null,updtTm:null},
                controller:'entryApplUpdateCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/entryApplUpdate.js']);
                        }]
                }
            })
            // 入职流程批量审批列表
            .state('entryApplApprList', {
                cache: false,//禁用缓存
                url: '/entryApplApprList',
                templateUrl: 'staff/html/entryApplApprList.html',
                controller:'entryApplApprListCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/entryApplApprList.js']);
                        }]
                }
            })
            // 离职流程列表
            .state('dimiAppl', {
                cache: false,//禁用缓存
                url: '/dimiAppl',
                templateUrl: 'staff/html/dimiAppl.html',
                controller:'dimiApplCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/dimiAppl.js']);
                        }]
                }
            })
            // 离职流程详情
            .state('dimiApplInfo', {
                cache: false,//禁用缓存
                url: '/dimiApplInfo',
                templateUrl: 'staff/html/dimiApplInfo.html',
                params:{applNum:null,frontPage:null},
                controller:'dimiApplInfoCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/dimiApplInfo.js']);
                        }]
                }
            })
            // 新增离职流程
            .state('dimiApplInsert', {
                cache: false,//禁用缓存
                url: '/dimiApplInsert',
                templateUrl: 'staff/html/dimiApplInsert.html',
                controller:'dimiApplInsertCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/dimiApplInsert.js']);
                        }]
                }
            })
            // 编辑离职流程
            .state('dimiApplUpdate', {
                cache: false,//禁用缓存
                url: '/dimiApplUpdate',
                templateUrl: 'staff/html/dimiApplUpdate.html',
                params:{dimiApplNum:null,updtTm:null},
                controller:'dimiApplUpdateCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/dimiApplUpdate.js']);
                        }]
                }
            })
            // 离职流程批量审批列表
            .state('dimiApplApprList', {
                cache: false,//禁用缓存
                url: '/dimiApplApprList',
                templateUrl: 'staff/html/dimiApplApprList.html',
                controller:'dimiApplApprListCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/dimiApplApprList.js']);
                        }]
                }
            })
            .state('xiaoxi', {
                cache: false,//禁用缓存
                url: '/xiaoxi',
                templateUrl: 'system/html/xiaoxi.html'
            })
            .state('xiaoxivo', {
                cache: false,//禁用缓存
                url: '/xiaoxivo',
                templateUrl: 'system/html/xiaoxivo.html'
            })
            // 销售概况
            .state('saleSummary', {
                cache: false,//禁用缓存
                url: '/saleSummary',
                templateUrl: 'report/html/saleSummary.html',
                controller:'saleSummaryController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['report/js/controller/saleSummaryController.js']);
                        }]
                }
            })
            // 销售数据
            .state('saleData', {
                cache: false,//禁用缓存
                url: '/saleData',
                templateUrl: 'report/html/saleData.html',
                controller:'saleDataCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['report/js/controller/saleData.js']);
                        }]
                }
            })
            // 提交报表列表
            .state('baReportList', {
                cache: false,//禁用缓存
                url: '/baReportList',
                templateUrl: 'report/html/baReportList.html',
                controller:'baReportListController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['report/js/controller/baReportListController.js']);
                                });
                        }]
                }
            })
            // 提交报表详情
            .state('baReportDetail', {
                cache: false,//禁用缓存
                url: '/baReportDetail',
                params:{"stfNum":null, "saleDate":null, "strNum":null, "pageFlg":null, "prePageFlg":null},
                templateUrl: 'report/html/baReportDetail.html',
                controller:'baReportDetailController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['report/js/controller/baReportDetailController.js']);
                        }]
                }
            })
            // 商品购买者
            .state('gdsBuyerView', {
                cache: false,//禁用缓存
                url: '/gdsBuyerView',
                params:{"stfNum":null, "saleDate":null, "strNum":null, "gdsSpecDtlNum":null, "pageFlg":null, "prePageFlg":null},
                templateUrl: 'report/html/gdsBuyerView.html',
                controller:'gdsBuyerViewController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['report/js/controller/gdsBuyerViewController.js']);
                        }]
                }
            })
            // 提交报表画面
            .state('baReportSubmit', {
                cache: false,//禁用缓存
                url: '/baReportSubmit',
                templateUrl: 'report/html/baReportSubmit.html',
                controller:'baReportSubmitController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['report/js/controller/baReportSubmitController.js']);
                        }]
                }
            })
            // 编辑报表画面
            .state('baReportEdit', {
                cache: false,//禁用缓存
                url: '/baReportEdit',
                params:{"stfNum":null, "saleDate":null, "strNum":null},
                templateUrl: 'report/html/baReportEdit.html',
                controller:'baReportEditController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['report/js/controller/baReportEditController.js']);
                        }]
                }
            })
            // 人员销售业绩汇总画面
            .state('saleAmountSum', {
                cache: false,//禁用缓存
                url: '/saleAmountSum',
                templateUrl: 'report/html/saleAmountSum.html',
                controller:'saleAmountSumController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['report/js/controller/saleAmountSumController.js']);
                        }]
                }
            })
            // 人员销售业绩汇总详情画面
            .state('saleAmountSumDetail', {
                cache: false,//禁用缓存
                url: '/saleAmountSumDetail',
                templateUrl: 'report/html/saleAmountSumDetail.html',
                controller:'saleAmountSumDetailController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['report/js/controller/saleAmountSumDetailController.js']);
                        }]
                }
            })
            // 日常销售报表明细
            .state('dailyReportList', {
                cache: false,//禁用缓存
                url: '/dailyReportList',
                params:{"saleStartDate":null, "saleEndDate":null, "prePageFlg":null},
                templateUrl: 'report/html/dailyReportList.html',
                controller:'dailyReportListController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['report/js/controller/dailyReportListController.js']);
                                });
                        }]
                }
            })
            //考勤管理——移动端
            .state('attendanceAdmin', {
                cache: false,//禁用缓存
                url: '/attendanceAdmin',
                templateUrl: 'staff/html/attendanceAdmin.html',
                controller:'attendanceAdminCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/attendanceAdmin.js']);
                        }]
                }
            })
            //考勤管理——查看门店排班移动端
            .state('baShiftMng', {
                cache: false,//禁用缓存
                url: '/baShiftMng',
                templateUrl: 'staff/html/baShiftMng.html',
                controller:'baShiftMngController',
                params:{"phaNum":null},
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['staff/js/controller/baShiftMngController.js']);
                                });
                        }]
                }
            })
            //考勤管理——查看门店排班详情移动端
           .state('baShiftMngDetails', {
                cache: false,//禁用缓存
                url: '/baShiftMngDetails',
                templateUrl: 'staff/html/baShiftMngDetails.html',
                controller:'baShiftMngDetailsController',
                params:{"phaNum":null,"strNum":null},
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngTable']).then(
                                function () {
                                    return $ocLazyLoad.load(['staff/js/controller/baShiftMngDetailsController.js']);
                                });
                        }]
                }
            })
             //考勤管理——审批排班申请移动端
            .state('schedulingForApproval', {
                cache: false,//禁用缓存
                url: '/schedulingForApproval',
                templateUrl: 'staff/html/schedulingForApproval.html',
                controller:'schedulingForApproval',
                resolve: {
                         deps: ['$ocLazyLoad',
                             function ($ocLazyLoad) {
                                 return $ocLazyLoad.load(['ngTable']).then(
                                     function () {
                                         return $ocLazyLoad.load(['staff/js/controller/schedulingForApproval.js']);
                                     });
                             }]
                     }
            })
            //考勤管理--审批排班详情
            .state('baShiftMngApplInfo', {
                cache: false,//禁用缓存
                url: '/baShiftMngApplInfo',
                params:{"applNum":null,"flag":true},
                templateUrl: 'staff/html/baShiftMngApplInfo.html',
                controller:'baShiftMngApplInfoController',
                resolve: {
                         deps: ['$ocLazyLoad',
                             function ($ocLazyLoad) {
                                 return $ocLazyLoad.load(['ngTable']).then(
                                     function () {
                                         return $ocLazyLoad.load(['staff/js/controller/baShiftMngApplInfoController.js']);
                                     });
                             }]
                     }
            })
            //考勤管理--批量审批排班
            .state('baShiftMngAppList', {
                cache: false,//禁用缓存
                url: '/baShiftMngAppList',
                templateUrl: 'staff/html/baShiftMngAppList.html',
                controller:'baShiftMngAppListController',
                resolve: {
                         deps: ['$ocLazyLoad',
                             function ($ocLazyLoad) {
                                 return $ocLazyLoad.load(['ngTable']).then(
                                     function () {
                                         return $ocLazyLoad.load(['staff/js/controller/baShiftMngAppListController.js']);
                                     });
                             }]
                     }
            })
            // 新增排班
            .state('insertSchedule', {
                cache: false,//禁用缓存
                url: '/insertSchedule',
                templateUrl: 'staff/html/insertSchedule.html',
                controller:'insertSchedule',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/insertSchedule.js']);
                        }]
                }
            })     
            // 编辑排班
            .state('updateSchedule', {
              cache: false,//禁用缓存
              url: '/updateSchedule',
              templateUrl: 'staff/html/updateSchedule.html',
              params:{schNum:null},
              controller:'updateSchedule',
              resolve: {
                  deps: ['$ocLazyLoad',
                      function ($ocLazyLoad) {
                          return $ocLazyLoad.load(['staff/js/controller/updateSchedule.js']);
                      }]
              }
          })
            //工资报表一览页面——移动端
            .state('salaryReport', {
                cache: false,//禁用缓存
                url: '/salaryReport',
                templateUrl: 'staff/html/salaryReport.html',
                controller:'salaryReportCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/salaryReport.js']);
                        }]
                }
            })
            //查看工资历史记录——移动端
            .state('viewingHistorical', {
                cache: false,//禁用缓存
                url: '/viewingHistorical',
                templateUrl: 'staff/html/viewingHistorical.html',
                controller:'viewingHistoricalCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/viewingHistorical.js']);
                        }]
                }
            })
            //查看工资历史记录详情——移动端
            .state('historyDetails', {
              cache: false,//禁用缓存
              url: '/historyDetails',
              params:{"applNum":null},
              templateUrl: 'staff/html/historyDetails.html',
              controller:'historyDetailsCtrl',
              resolve: {
                deps: ['$ocLazyLoad',function ($ocLazyLoad) {
                      return $ocLazyLoad.load(['staff/js/controller/historyDetails.js']);
                }]
              }
            })
            //查看工资历史记录详情考勤工资——移动端
            .state('attendanceSalary', {
              cache: false,//禁用缓存
              url: '/attendanceSalary',
              params:{"applNum":null},
              templateUrl: 'staff/html/attendanceSalary.html',
              controller:'attendanceSalaryCtrl',
              resolve: {
                deps: ['$ocLazyLoad',function ($ocLazyLoad) {
                  return $ocLazyLoad.load(['staff/js/controller/attendanceSalary.js']);
                }]
              }
            })
            //查看工资历史记录详情应加合计——移动端
            .state('shouldBeAddedTogether', {
              cache: false,//禁用缓存
              url: '/shouldBeAddedTogether',
              params:{"applNum":null},
              templateUrl: 'staff/html/shouldBeAddedTogether.html',
              controller:'shouldBeAddedTogetherCtrl',
              resolve: {
                deps: ['$ocLazyLoad',function ($ocLazyLoad) {
                  return $ocLazyLoad.load(['staff/js/controller/shouldBeAddedTogether.js']);
                }]
              }
            })
            //查看工资历史记录详情应扣合计——移动端
            .state('totalDeduction', {
              cache: false,//禁用缓存
              url: '/totalDeduction',
              params:{"applNum":null},
              templateUrl: 'staff/html/totalDeduction.html',
              controller:'totalDeductionCtrl',
              resolve: {
                deps: ['$ocLazyLoad',function ($ocLazyLoad) {
                  return $ocLazyLoad.load(['staff/js/controller/totalDeduction.js']);
                }]
              }
            })
            //审批工资报表——移动端
            .state('approvalList', {
                cache: false,//禁用缓存
                url: '/approvalList',
                templateUrl: 'staff/html/approvalList.html',
                controller:'approvalListCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['staff/js/controller/approvalList.js']);
                        }]
                }
            })
            //审批查看工资详情详情——移动端
            .state('approvalDetails', {
              cache: false,//禁用缓存
              url: '/approvalDetails',
              params:{"applNum":null},
              templateUrl: 'staff/html/approvalDetails.html',
              controller:'approvalDetailsCtrl',
              resolve: {
                deps: ['$ocLazyLoad',function ($ocLazyLoad) {
                  return $ocLazyLoad.load(['staff/js/controller/approvalDetails.js']);
                }]
              }
            })
            //查看审批详情考勤工资——移动端
            .state('attendanceSalaryShenpi', {
              cache: false,//禁用缓存
              url: '/attendanceSalaryShenpi',
              params:{"applNum":null},
              templateUrl: 'staff/html/attendanceSalaryShenpi.html',
              controller:'attendanceSalaryCtrl',
              resolve: {
                deps: ['$ocLazyLoad',function ($ocLazyLoad) {
                  return $ocLazyLoad.load(['staff/js/controller/attendanceSalary.js']);
                }]
              }
            })
            //查看审批详情应加合计——移动端
            .state('shouldBeAddedTogetherShenpi', {
              cache: false,//禁用缓存
              url: '/shouldBeAddedTogetherShenpi',
              params:{"applNum":null},
              templateUrl: 'staff/html/shouldBeAddedTogetherShenpi.html',
              controller:'shouldBeAddedTogetherCtrl',
              resolve: {
                deps: ['$ocLazyLoad',function ($ocLazyLoad) {
                  return $ocLazyLoad.load(['staff/js/controller/shouldBeAddedTogether.js']);
                }]
              }
            })
            //查看审批详情应扣合计——移动端
            .state('totalDeductionShenpi', {
              cache: false,//禁用缓存
              url: '/totalDeductionShenpi',
              params:{"applNum":null},
              templateUrl: 'staff/html/totalDeductionShenpi.html',
              controller:'totalDeductionCtrl',
              resolve: {
                deps: ['$ocLazyLoad',function ($ocLazyLoad) {
                  return $ocLazyLoad.load(['staff/js/controller/totalDeduction.js']);
                }]
              }
            })
            //审批——移动端
            .state('approval', {
              cache: false,//禁用缓存
              url: '/approval',
              params:{"applNum":null,"oid":null,"updtTm":null},
              templateUrl: 'staff/html/approval.html',
              controller:'approvalCtrl',
              resolve: {
                deps: ['$ocLazyLoad',function ($ocLazyLoad) {
                  return $ocLazyLoad.load(['staff/js/controller/approval.js']);
                }]
              }
            })
            //报表审批——移动端
            .state('reportApproval', {
              cache: false,//禁用缓存
              url: '/reportApproval',
              params:{"flag":null,"keys":null},
              templateUrl: 'report/html/reportApproval.html',
              controller:'reportApprovalCtrl',
              resolve: {
                deps: ['$ocLazyLoad',function ($ocLazyLoad) {
                  return $ocLazyLoad.load(['report/js/controller/reportApproval.js']);
                }]
              }
            })
            //报表审批详情——移动端
            .state('reportApprovalDetails', {
              cache: false,//禁用缓存
              url: '/reportApprovalDetails',
              params:{"applNum":null,"flag":null,"keys":null},
              templateUrl: 'report/html/reportApprovalDetails.html',
              controller:'reportApprovalDetailsCtrl',
              resolve: {
                deps: ['$ocLazyLoad',function ($ocLazyLoad) {
                  return $ocLazyLoad.load(['report/js/controller/reportApprovalDetails.js']);
                }]
              }
            })
            //本店业绩详情——移动端
            .state('storePerformance', {
              cache: false,//禁用缓存
              url: '/storePerformance',
              params:{"stfNm":null,"apprStfNum":null,"strNum":null,"repApplNum":null,"repApprStartDt":null,"repApprEndDt":null},
              templateUrl: 'report/html/storePerformance.html',
              controller:'storePerformanceCtrl',
              resolve: {
                deps: ['$ocLazyLoad',function ($ocLazyLoad) {
                  return $ocLazyLoad.load(['report/js/controller/storePerformance.js']);
                }]
              }
            })
            //编辑报表——移动端
            .state('reportApprovalModification', {
              cache: false,//禁用缓存
              url: '/reportApprovalModification',
              params:{"repApplNum":null},
              templateUrl: 'report/html/reportApprovalModification.html',
              controller:'reportApprovalModificationCtrl',
              resolve: {
                deps: ['$ocLazyLoad',function ($ocLazyLoad) {
                  return $ocLazyLoad.load(['report/js/controller/reportApprovalModification.js']);
                }]
              }
            })
            //销售报表审批
            .state('approvalSalesReport', {
              cache: false,//禁用缓存
              url: '/approvalSalesReport',
              params:{"repApplNum":null,"updtTm":null},
              templateUrl: 'report/html/approvalSalesReport.html',
              controller:'approvalSalesReportCtrl',
              resolve: {
                deps: ['$ocLazyLoad',function ($ocLazyLoad) {
                  return $ocLazyLoad.load(['report/js/controller/approvalSalesReport.js']);
                }]
              }
            })
            // 推送信息控制
            .state('pushManagementPage', {
              cache: false,//禁用缓存
              url: '/pushManagementPage',
              params:{"url":null,"applNum":null},
              resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load(['system/js/controller/pushManagementPage.js']);
                }]
              }
            })
    })
    .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
        // We configure ocLazyLoad to use the lib script.js as the async loader
        $ocLazyLoadProvider.config({
            debug:  false, //是否开始DEBUG模式
            events: true,
            modules: [
                {
                    name: 'ngTable',  //对应插件的注入名称
                    files: [
                        'common/lib/js/ng/ng-table.js', //插件文件位置.
                        'common/lib/js/ng/ng-table.css'
                    ]
                }
            ]
        });
    }]);
