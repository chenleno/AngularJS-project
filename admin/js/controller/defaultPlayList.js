/**
 * Created by Administrator on 2018\1\15 0015.
 */
//默认播放列表
app.controller('defaultPlayListCtrl', ['$scope', '$state', 'staticData', '$resource', 'commonService', 'checkBtnService', '$rootScope' , function ($scope, $state, staticData, $resource, commonService, checkBtnService , $rootScope) {
    ////分页每页条目数
    //$scope.pageSize = staticData.pageSize;
    ////分页索引显示数
    //
    //$scope.maxSize = staticData.pageMaxSize;

    //点位分类
    $scope.pointType = 1

    //查询播放列表
    $scope.queryList = function (pointType) {
        $scope.pointType = pointType;
        var $com = $resource($scope.app.host + '/api/mps-adschedule/defaultRes/list?pointType=:pointType',{pointType : '@pointType'});
        $com.get({pointType:pointType} , function (res) {
            if (res.success) {
                $scope.datas = res.data;
            }
        });
    };
    $scope.queryList($scope.pointType);

    //上移
    $scope.up = function(defaultId , pointType){
        var $com = $resource($scope.app.host + '/api/mps-adschedule/defaultRes/up')
        $com.save({},{defaultId : defaultId , pointType : pointType},function(res){
            if(res.success){
                commonService.ctrlSuccess('上移');
                $scope.queryList($scope.pointType);
            }else{
                commonService.ctrlError('上移', res.message);
            }
        })
    }
    //下移
    $scope.down = function(defaultId , pointType){
        //console.log(defaultId)
        var $com = $resource($scope.app.host + '/api/mps-adschedule/defaultRes/down')
        $com.save({},{defaultId : defaultId , pointType : pointType},function(res){
            if(res.success){
                commonService.ctrlSuccess('下移');
                $scope.queryList($scope.pointType);
            }else{
                commonService.ctrlError('下移', res.message);
            }
        })
    }
    //删除和更改
    $scope.opt = function( defaultId , optType ){
        if(optType == 0){
            commonService.ctrlModal("deleteAd").result.then(function () {

                var $com = $resource($scope.app.host + "/api/mps-adschedule/defaultRes/opt");
                $com.save({}, { defaultId : defaultId , optType : optType} , function (res) {
                     if(res.success){
                         commonService.ctrlSuccess('删除');
                         $scope.queryList($scope.pointType);

                     }else{
                         commonService.ctrlError('删除', res.message);
                     }
                });

            });
        }else{
            var $com = $resource($scope.app.host + "/api/mps-adschedule/defaultRes/opt");
            $com.save({}, { defaultId : defaultId , optType : optType} , function (res) {
                if(res.success){
                    commonService.ctrlSuccess('设置');
                    $scope.queryList($scope.pointType);

                }else{
                    commonService.ctrlError('设置', res.message);
                }
            });
        }

    }
    //新建素材列表
    $scope.creat = function(pointType , defaultId){
        if( $scope.pointType != 5){
            commonService.defaultPlayList(pointType , defaultId).result.then(function () {
                $scope.queryList($scope.pointType);
            });
        }else{
            commonService.defaultPlayListNew(pointType , defaultId).result.then(function () {
                $scope.queryList($scope.pointType);
            });
        }

    }

    $rootScope.$on('defaultPlayList', function (event, args) {
        if(args.bool){
            $scope.queryList($scope.pointType);
        }
    });
















////查询待审核数目
//    $scope.queryTipNum = function () {
//        var $com = $resource($scope.app.host + '/api/cinema-adLaunch/adBill?pageNo=&pageSize=&billName=&billType=&pointType=&billStatus=1&projectId=');
//        $com.get(function (res) {
//            if (res.success == false) {
//                $scope.tipNum = 0;
//            } else {
//                $scope.tipNum = res.total;
//            }
//        });
//    };
//    $scope.queryTipNum();


    ////获取广告播放统计
    //$scope.getCount = function (projectName, projectNum, projectId) {
    //    $state.go('app.order.adProjectCount', {
    //        projectName: projectName,
    //        projectNum: projectNum,
    //        id: projectId,
    //        isAdInto: false
    //    });
    //};
    //
    ////新建项目
    //$scope.addProject = function () {
    //    checkBtnService.check("/api/cinema-adLaunch/adProject", 'post').then(function () {
    //
    //        commonService.add_project().result.then(function () {
    //            $scope.query();
    //        });
    //    });
    //};
    //
    ////编辑项目
    //$scope.editProject = function (projectId) {
    //
    //    checkBtnService.check("/api/cinema-adLaunch/adProject", 'put').then(function () {
    //        commonService.add_project(projectId).result.then(function () {
    //            $scope.query();
    //        });
    //    });
    //};
    //
    ////查列表
    //$scope.query = function (projectSource, customerCategory, keyword, pageNo, pageSize) {
    //    var $com = $resource($scope.app.host + '/api/cinema-adLaunch/adProject?pageNo=:pageNo&pageSize=:pageSize&keyword=:keyword&projectSource=:projectSource&customerCategory=:customerCategory', { projectSource: '@projectSource', customerCategory: '@customerCategory', keyword: '@keyword', pageNo: '@pageNo', pageSize: '@pageSize' });
    //    $com.get({ projectSource: projectSource, customerCategory: customerCategory, keyword: keyword, pageNo: pageNo, pageSize: pageSize }, function (res) {
    //        $scope.datas = res.dataList;
    //
    //        $scope.totalItems = res.total;
    //        $scope.numPages = res.pages;
    //        $scope.currentPage = res.pageNo;
    //    });
    //};
    //$scope.query('', '', '', 1, $scope.pageSize);
    //
    //$scope.search = function (projectSource, customerCategory, keyword, pageNo, pageSize, e) {
    //    if (keyword) {
    //        keyword = keyword.replace(/&/g, '%26');
    //    }
    //    if (e) {
    //        var keycode = window.event ? e.keyCode : e.which;
    //        if (keycode == 13) {
    //            $scope.query(projectSource, customerCategory, keyword, pageNo, pageSize);
    //        }
    //    } else {
    //        $scope.query(projectSource, customerCategory, keyword, pageNo, pageSize);
    //    }
    //};
    //
    //$scope.show_project_detail = function (projectId) {
    //    commonService.show_project_detail(projectId);
    //};

    //$scope.showAdList = function (deviceId, projectName, projectNum) {
    //    checkBtnService.check("/api/cinema-adLaunch/adBill?", 'get').then(function () {
    //        $state.go('app.order.adOrderList', { deviceId: deviceId, projectName: projectName, projectNum: projectNum });
    //    });
    //};
}]);
