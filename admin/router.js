/**
 * Created by chenqi1 on 2016/12/26.
 */
app
    .run(['$rootScope',  '$location' ,  '$state',   '$stateParams' , 'dataAccess',
    function ($rootScope,  $location ,  $state,   $stateParams , dataAccess) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
            $rootScope.previousState = from;
            $rootScope.previousStateParams = fromParams;

            var str = $location.path()
            var index = $location.path().lastIndexOf('\/')
            var newStr = str.substr(0,index);

            if(str == '/app/order/addAdOrder1' || str == '/app/order/addAdOrder2' || str == '/app/order/addAdOrder3'){
                return
            }else {
                dataAccess.sessionRemove('allObj')
            }

            $rootScope.navRoute = newStr

        });
    }]
)
    .config(['$stateProvider','$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
        $urlRouterProvider
            //.otherwise('/auth/login')
            //.otherwise('/app/media/mediaList')
            //.otherwise('/app/program/programList')
        .otherwise('/app/device/deviceList')

        $stateProvider
            .state('app', {
                abstract: true,
                url: '/app',
                templateUrl: 'admin/app.html',
            })
            .state('app.dashboard', {
                //url: '/dashboard',
                //templateUrl: 'admin/dashboard.html',
                //ncyBreadcrumb: {
                //    label: '<i class="fa fa-home"></i> 首页'
                //}
            })


        //登录页面路由
            .state('auth',{
                abstract: true,
                url:'/auth',
                template: '<div ui-view class="fade-in"></div>'
            })
            .state('auth.login',{
                url:'/login',
                templateUrl:'admin/auth/login.html',
            })


            //素材管理路由
            .state('app.media', {
                abstract: true,
                url: '/media',
                template: '<div ui-view class="fade-in"></div>',

            })
            .state('app.media.mediaList' , {
                url:'/mediaList?reload',
                templateUrl : 'admin/media/mediaList.html',
                cache : false
            })
                //素材审核
            .state('app.media.checkMedia' , {
                url:'/checkMedia?reload',
                templateUrl : 'admin/media/checkMedia.html',
                cache : false
            })

            //节目管理路由
            .state('app.program', {
                abstract: true,
                url: '/program',
                template: '<div ui-view class="fade-in"></div>',

            })
            //节目列表
            .state('app.program.programList' , {
                url:'/programList?reload',
                //templateUrl : 'admin/program/addProgram.html',
                templateUrl : 'admin/program/programList.html',
                cache : false
            })
            //创建节目
            .state('app.program.addProgram' , {
                url:'/addProgram',
                params:{"id":null,"name":null,"bool":null},
                templateUrl : 'admin/program/addProgram.html',
                cache : false
            })


            //成员管理路由
            .state('app.member', {
                abstract: true,
                url: '/member',
                template: '<div ui-view class="fade-in"></div>',
                //resolve: {
                //    deps: ['$ocLazyLoad',
                //        function( $ocLazyLoad ){
                //            return $ocLazyLoad.load('admin/js/controller/mediaCtrl.js');
                //        }]
                //}
            })
            .state('app.member.memberList' , {
                url: '/memberList',
                templateUrl : 'admin/member/memberList.html',
                cache : false
            })

            //系统权限管理路由
            .state('app.role',{
                abstract: true,
                url: '/role',
                template: '<div ui-view class="fade-in"></div>',
            })
            .state('app.role.roleList' , {
                url:'/roleList?reload',
                templateUrl : 'admin/role/roleList.html',
                cache : false
            })
            //添加权限组路由
            .state('app.role.addRole', {
                url: '/role/addRole',
                templateUrl: 'admin/role/addRole.html'
                //ncyBreadcrumb: {
                //    parent:'app.permission.permissionList',
                //    label: '添加权限组'
                //}
            })
            //编辑权限路由
            .state('app.role.editRole', {
                url: '/editRole',
                params:{"id":null},
                templateUrl: 'admin/role/addRole.html'
                //ncyBreadcrumb: {
                //    parent:'app.permission.permissionList',
                //    label: '编辑权限组',
                //}
            })
            //添加成员
            .state('app.role.addRoleMember', {
                url: '/addRoleMember',
                params:{"id":null,"name":null},
                templateUrl: 'admin/role/roleAddMember.html'
                //ncyBreadcrumb: {
                //    parent:'app.permission.permissionList',
                //    label: '添加权限组'
                //}
            })
            //设备路由
            .state('app.device',{
                abstract: true,
                url: '/device',
                template: '<div ui-view class="fade-in"></div>',
            })
            //设备列表
            .state('app.device.deviceList', {
                url: '/deviceList',
                //params:{"id":null,"name":null},
                templateUrl: 'admin/device/deviceList.html'
            })
            //添加设备
            .state('app.device.addDevice', {
                url: '/addDevice',
                //params:{"id":null,"name":null},
                templateUrl: 'admin/device/addDevice.html'
            })

            //发送管理路由
            .state('app.send', {
                abstract: true,
                url: '/send',
                template: '<div ui-view class="fade-in"></div>',
                //resolve: {
                //    deps: ['$ocLazyLoad',
                //        function( $ocLazyLoad ){
                //            return $ocLazyLoad.load('admin/js/controller/mediaCtrl.js');
                //        }]
                //}
            })
            .state('app.send.sendList' , {
                url: '/sendList',
                templateUrl : 'admin/send/sendList.html',
                cache : false
            })
            //添加发送任务
            .state('app.send.addSendTask' , {
                url: '/addSendTask',
                templateUrl : 'admin/send/addSendTask.html',
                cache : false
            })
            //编辑发送任务
            .state('app.send.editSendTask', {
                url: '/editSendTask',
                params:{"id":null},
                templateUrl: 'admin/send/addSendTask.html'
                //ncyBreadcrumb: {
                //    parent:'app.permission.permissionList',
                //    label: '添加权限组'
                //}
            })

            //点位管理
            .state('app.PT', {
                abstract: true,
                url: '/PT',
                template: '<div ui-view class="fade-in"></div>',
            })
            //点位列表
            .state('app.PT.PTlist' , {
                url: '/PTlist?reload',
                templateUrl : 'admin/point/PTlist.html',
                cache : false
            })
            //添加点位
            .state('app.PT.addPTlist' ,{
                url:'/addPTlist',
                templateUrl:'admin/point/addPTlist.html',
                cache : false
            })
            //点位下终端
            .state('app.PT.addPTterminal' ,{
                url:'/addPTterminal',
                params:{"id":null},
                templateUrl:'admin/point/addPTterminal.html',
                cache : false
            })
            //点位播放列表
            .state('app.PT.playList' ,{
                url:'/playList',
                params:{"id":null,"name":null},
                templateUrl:'admin/point/playList.html',
                cache : false
            })
            //点位播放日历
            .state('app.PT.pointDate' ,{
                url:'/pointDate',
                params:{"id":null,"pointName":null,'pointType':null},
                templateUrl:'admin/point/pointDate.html',
                cache : false
            })
            //wifi探针人流量
            .state('app.PT.wifiProbeList' ,{
                url:'/wifiProbeList',
                params:{"id":null,"name":null},
                templateUrl:'admin/point/wifiProbeList.html',
                cache : false
            })

            //订单管理
            .state('app.order', {
                abstract: true,
                url: '/order',
                template: '<div ui-view class="fade-in"></div>',
            })
            //项目列表
            .state('app.order.orderList' , {
                url: '/orderList',
                templateUrl : 'admin/order/orderList.html',
                cache : false
            })

            //广告单审核列表
            .state('app.order.checkSheetList' , {
                url: '/checkSheetList',
                templateUrl : 'admin/order/checkSheetList.html',
                cache : false
            })

            ////广告投放
            //.state('app.advertisement', {
            //    abstract: true,
            //    url: '/advertisement',
            //    template: '<div ui-view class="fade-in"></div>',
            //})
            //广告投放详情(正常跳转)
            .state('app.order.desc' , {
                url: '/advertisementDesc',
                params:{'projectId':null,"id":null,"bool":null},
                templateUrl : 'admin/order/advertisementDesc.html',
                cache : false
            })
            //广告投放详情(审核跳转)
            .state('app.order.examineDesc' , {
                url: '/examineDesc',
                params:{"id":null},
                templateUrl : 'admin/order/examineDesc.html',
                cache : false
            })
            //广告单列表
            .state('app.order.adOrderList' , {
                url: '/adOrderList',
                params:{"deviceId":null,'projectName':null,"projectNum":null},
                templateUrl : 'admin/order/adOrderList.html',
                cache : false
            })
            //广告单投放站点
            .state('app.order.adPointList' , {
                url: '/adPointList',
                params:{"projectId":null,"billId":null,"bool":null,"xiaKangBool":null},
                templateUrl : 'admin/order/adPointList.html',
                cache : false
            })

            //添加广告单第一步选择点位
            .state('app.order.addAdOrder1' , {
                url: '/addAdOrder1',
                params:{"projectId":null,"billId":null,"addFlag":null},
                templateUrl : 'admin/order/addAdOrder1.html',
                cache : false
            })
            //添加广告单第二步选择素材
            .state('app.order.addAdOrder2' , {
                url: '/addAdOrder2',
                params:{"projectId":null,"addFlag":null},
                templateUrl : 'admin/order/addAdOrder2.html',
                cache : false
            })
            //添加广告单第三步设置播放方式
            .state('app.order.addAdOrder3' , {
                url: '/addAdOrder3',
                params:{"projectId":null,"addFlag":null},
                templateUrl : 'admin/order/addAdOrder3.html',
                cache : false
            })
            //广告投放排期表
            .state('app.order.playList' , {
                url: '/advertisementPlayList',
                params:{"id":null,"name":null},
                templateUrl : 'admin/order/adPlayList.html',
                cache : false
            })
            //广告播放统计
            .state('app.order.adProjectCount' , {
                url: '/adProjectCount',
                params:{"projectName":null,"projectNum":null,"id":null,"billId":null,'isAdInto':null},
                templateUrl : 'admin/order/adProjectCount.html',
                cache : false
            })
            //广告播放统计详情
            .state('app.order.adProjectCountDetail' , {
                url: '/adProjectCountDetail',
                params:{"projectName":null,"projectNum":null,"id":null,'date':null,'isAdInto':null,'billId':null},
                templateUrl : 'admin/order/adProjectCountDetail.html',
                cache : false
            })
             //默认播放素材页面
            .state('app.defaultPlayList', {
                abstract: true,
                url: '/defaultPlayList',
                template: '<div ui-view class="fade-in"></div>',
            })
            .state('app.defaultPlayList.playList' , {
                url: '/defaultPlayList',
                params:{"id":null,"name":null},
                templateUrl : 'admin/defaultPlayList/defaultPlayList.html',
                cache : false
            })
    }]
);