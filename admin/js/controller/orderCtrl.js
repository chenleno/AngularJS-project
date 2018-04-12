/**
 * Created by chenqi1 on 2017/10/9.
 */
/**
 * Created by chenqi1 on 2017/10/9.
 */
//项目列表控制器
app.controller('orderlistCtrl' , ['$scope' , '$state','staticData' ,'$resource', 'commonService','checkBtnService',
    function($scope ,$state, staticData , $resource , commonService,checkBtnService){
        //点位状态选项绑定
        $scope.orderSource = staticData.orderSource
        //点位类型绑定
        $scope.customerType = staticData.customerType

        //分页每页条目数
        $scope.pageSize = staticData.pageSize
        //分页索引显示数

        $scope.maxSize = staticData.pageMaxSize

        //查询待审核数目
        $scope.queryTipNum = function(){
            var $com = $resource($scope.app.host + '/api/cinema-adLaunch/adBill?pageNo=&pageSize=&billName=&billType=&pointType=&billStatus=1&projectId=')
            $com.get(function(res){
                if(res.success == false){
                    $scope.tipNum = 0
                }else {
                    $scope.tipNum = res.total
                }
            })
        }
        $scope.queryTipNum()

        //获取广告播放统计
        $scope.getCount = function (projectName,projectNum,projectId) {
            $state.go('app.order.adProjectCount',{
                projectName : projectName,
                projectNum : projectNum,
                id : projectId,
                isAdInto : false
            });
        }


        //新建项目
        $scope.addProject = function(){
            checkBtnService.check("/api/cinema-adLaunch/adProject",'post').then(function() {

                commonService.add_project().result.then(function () {
                    $scope.query()
                })
            })
        }

        //编辑项目
        $scope.editProject = function(projectId){

            checkBtnService.check("/api/cinema-adLaunch/adProject",'put').then(function() {
                commonService.add_project(projectId).result.then(function () {
                    $scope.query()
                })
            })
        }

        //查列表
        $scope.query = function(projectSource , customerCategory , keyword , pageNo , pageSize){
            var $com = $resource($scope.app.host +
                '/api/cinema-adLaunch/adProject?pageNo=:pageNo&pageSize=:pageSize&keyword=:keyword&projectSource=:projectSource&customerCategory=:customerCategory' ,
                {projectSource:'@projectSource' , customerCategory:'@customerCategory' , keyword:'@keyword' , pageNo:'@pageNo' , pageSize:'@pageSize'})
            $com.get({projectSource:projectSource , customerCategory:customerCategory , keyword:keyword , pageNo:pageNo , pageSize:pageSize},function(res){
                $scope.datas = res.dataList

                $scope.totalItems = res.total
                $scope.numPages = res.pages
                $scope.currentPage = res.pageNo
            })
        }
        $scope.query('','','',1,$scope.pageSize)

        $scope.search = function (projectSource , customerCategory , keyword , pageNo, pageSize, e  ) {
            if(keyword){
                keyword = keyword.replace(/&/g, '%26')
            }
            if(e){
                var keycode = window.event?e.keyCode:e.which;
                if(keycode==13){
                    $scope.query(projectSource , customerCategory , keyword , pageNo, pageSize)
                }
            }else {
                $scope.query(projectSource , customerCategory , keyword, pageNo, pageSize)
            }
        }

        $scope.show_project_detail = function(projectId){
            commonService.show_project_detail(projectId)
        }

        //删除项目
        $scope.delete = function (projectId) {

            //检测删除权限
            checkBtnService.check("/api/cinema-adLaunch/adProject/:projectId",'delete').then(function(){
            //获取删除项对象集合

            commonService.ctrlModal("projectType").result.then(function () {

                var $com = $resource($scope.app.host + "/api/cinema-adLaunch/adProject/:projectId",{projectId:'@projectId'});
                $com.delete({projectId:projectId} , function(res){
                    res.success ?
                        commonService.ctrlSuccess('删除') :
                        commonService.ctrlError('删除' , res.message)
                    $scope.query($scope.source , $scope.type , $scope.keyword )
                })
            })

            })
        }

        $scope.showAdList = function (deviceId,projectName,projectNum) {
            checkBtnService.check("/api/cinema-adLaunch/adBill?",'get').then(function() {
                $state.go('app.order.adOrderList', {deviceId: deviceId,projectName:projectName,projectNum:projectNum})
            })
        }



    }])
//广告单列表
app.controller('adOrderlistCtrl' , ['$scope' ,'$rootScope', '$state','staticData' ,'$resource', 'commonService','$stateParams','checkBtnService',
    function($scope ,$rootScope,$state, staticData , $resource , commonService,$stateParams,checkBtnService){

        $scope.adType = staticData.adType
        $scope.statusType = staticData.statusType
        $scope.tempType = staticData.PTtype

        $scope.projectName = $stateParams.projectName
        $scope.projectId = $stateParams.deviceId
        $scope.projectNum = $stateParams.projectNum

        //分页每页条目数
        $scope.pageSize = staticData.pageSize
        //分页索引显示数

        $scope.maxSize = staticData.pageMaxSize

        $scope.returnBack = function () {
            $state.go('app.order.orderList')
        }



        $scope.query = function(billType , billStatus , pointType , billName , pageNo , pageSize){
            var $com = $resource($scope.app.host +
                '/api/cinema-adLaunch/adBill?pageNo=:pageNo&pageSize=:pageSize&billName=:billName&billType=:billType&pointType=:pointType&billStatus=:billStatus&projectId=:projectId' ,
                {billType:'@billType' , pointType:'@pointType' , billName:'@billName' , billStatus:'@billStatus' , pageNo:'@pageNo' , pageSize:'@pageSize' , projectId:'@projectId'})
            $com.get({billType:billType , pointType:pointType , billName:billName ,billStatus:billStatus, pageNo:pageNo , pageSize:pageSize , projectId:$stateParams.deviceId},function(res){
                $scope.datas = res.dataList
                $scope.totalItems = res.total
                $scope.numPages = res.pages
                $scope.currentPage = res.pageNo
            })
        }
        $scope.query('','','','',1 , $scope.pageSize)

        //下刊广告单
        $scope.releaseAd = function (billId) {
            //checkBtnService.check("/api/cinema-adLaunch/adBill/:billId",'delete').then(function() {
                commonService.ctrlModal('releaseAd').result.then(function () {
                    var $com = $resource($scope.app.host + "/api/cinema-adLaunch/adBill/:billId", {
                        billId: '@billId'
                    });

                    $com.delete({billId: billId}, function (res) {
                        res.success ?
                            commonService.ctrlSuccess('下刊') :
                            commonService.ctrlError('下刊', res.message)
                        $scope.query($scope.billType, $scope.billStatus, $scope.pointType, $scope.billName);
                    })
                })
            //})
        }
        //复制
        $scope.copy = function(billId){
            commonService.ctrlModal('copyAd').result.then(function () {
                var $com = $resource($scope.app.host + "/api/cinema-adLaunch/copyBill/:billId", {
                    billId: '@billId'
                });

                $com.save({billId: billId}, function (res) {
                    res.success ?
                        commonService.ctrlSuccess('复制') :
                        commonService.ctrlError('复制', res.message)
                    $scope.query($scope.billType, $scope.billStatus, $scope.pointType, $scope.billName);
                })
            })
        }
        //编辑订单
        $scope.editAd = function (billId,billStatus) {
            checkBtnService.check("/api/cinema-adLaunch/adBill",'put').then(function() {
                $rootScope.addFlag = billStatus;
                $state.go('app.order.addAdOrder1', {projectId:$stateParams.deviceId,billId: billId,addFlag:billStatus})
            })
        } 

        $scope.deleteAd = function (billId) {
                commonService.ctrlModal('deleteAd').result.then(function () {
                    var $com = $resource($scope.app.host + "/api/cinema-adLaunch/adBill/:billId", {
                        billId: '@billId'
                    });

                    $com.delete({billId: billId}, function (res) {
                        res.success ?
                            commonService.ctrlSuccess('删除') :
                            commonService.ctrlError('删除', res.message)
                        $scope.query($scope.billType, $scope.billStatus, $scope.pointType, $scope.billName);
                    })
                })
        }

        $scope.search = function (billType , billStatus , pointType , billName, pageNo, pageSize  , e  ) {
            // if(keyword){
            //     keyword = keyword.replace(/&/g, '%26')
            // }
            if(e){
                var keycode = window.event?e.keyCode:e.which;
                if(keycode==13){
                    $scope.query(billType , billStatus , pointType , billName , pageNo, pageSize)
                }
            }else {
                $scope.query(billType , billStatus , pointType , billName , pageNo, pageSize)
            }
        }

        //showAdList(data.deviceId)
        //广告单详情
        $scope.adOrderDetail = function (billId,bool) {
            //console.log(billId);
            if(bool){
                $state.go('app.order.desc',{projectId:$stateParams.deviceId,id:billId,bool:true})
            }else{
                $state.go('app.order.desc',{projectId:$stateParams.deviceId,id:billId})
            }
            //$state.go('app.order.adPointList',{billId:billId})
        }

        //新建广告单
        $scope.addAdOrder = function () {
            checkBtnService.check("/api/cinema-adLaunch/adBill",'post').then(function() {
                $rootScope.addFlag = 'newAdd';
                $state.go('app.order.addAdOrder1',{projectId:$stateParams.deviceId,addFlag:'newAdd'})
            })
        }

        //获取广告播放统计
        $scope.getCount = function (billId) {
            $state.go('app.order.adProjectCount',{
                projectName : $scope.projectName,
                projectNum : $scope.projectNum,
                id : $scope.projectId,
                billId : billId,
                isAdInto : true
            });
        }

    }])


//广告单播放统计
app.controller('adProjectCountCtrl' , ['$scope' ,'$rootScope', '$state','staticData' ,'$resource', 'commonService','$stateParams','checkBtnService',
    function($scope ,$rootScope,$state, staticData , $resource , commonService,$stateParams,checkBtnService){

        $scope.projectId = $stateParams.id
        $scope.projectNum = $stateParams.projectNum
        $scope.projectName = $stateParams.projectName

        $scope.isAdInto = $stateParams.isAdInto == 'false' ? false : true;
        //$scope.adList = staticData.adType



        //分页每页条目数
        $scope.pageSize = staticData.pageSize
        //分页索引显示数

        $scope.maxSize = staticData.pageMaxSize

        $scope.returnBack = function () {
            history.back();
        }

        $scope.queryDetail = function(){
            var $com = $resource(staticData.hostUrl + '/api/cinema-adLaunch/adProject/:projectId' , {projectId:'@projectId'})
            $com.get({projectId: $scope.projectId} , function(res){
                if(res.success == false){
                    commonService.ctrlError('查询',res.message)
                }else {
                    $scope.projectName = res.projectName;
                    $scope.projectNum = res.cinemaAdbillSize;
                }
            })
        }
        $scope.queryDetail();

        $scope.adProjectCountDetail = function (id) {
            if($scope.adSelectBillId) {
                $state.go("app.order.adProjectCountDetail",{id:id,isAdInto:isAdInto,billId:$scope.adSelectBillId});
            } else {
                $state.go("app.order.adProjectCountDetail",{id:id,isAdInto:isAdInto});
            }
        }

        $scope.query = function(pageNo , pageSize , billId,date){
            var $com = $resource($scope.app.host +
                '/api/cinema-adLaunch/getPlayCount?pageNo=:pageNo&pageSize=:pageSize&projectId=:projectId&date=:date&billId=:billId' ,
                {pageNo:'@pageNo' , pageSize:'@pageSize' , projectId:'@projectId', date:'@date',billId:'@billId'})
            $com.get({pageNo:pageNo , pageSize:pageSize , projectId:$scope.projectId , date:date ,billId:billId},function(res){
                console.log(res);
                $scope.datas = res.dataList


                $scope.totalItems = res.total
                $scope.numPages = res.pages
                $scope.currentPage = res.pageNo
            })
        }
                //初始化billID
                if($stateParams.billId) {
                    $scope.adSelectBillId = $stateParams.billId
                    $scope.query(1 , $scope.pageSize,$scope.adSelectBillId)
                } else {
                    $scope.adSelectBillId = '';
                    $scope.query(1 , $scope.pageSize)
                }

        //查询广告单下拉列表
        $scope.queryAd = function(){
            var $com = $resource($scope.app.host + "/api/cinema-adLaunch/:projectId/getAllBill", {
                taskId: '@projectId'
            });
            $com.get({ projectId: $scope.projectId }, function (res) {
                console.log(res);
                $scope.adList = res.message
                

            });
        }

        $scope.queryAd();

        //导出数据
        $scope.exportData = function (projectId,date,billId,projectName,pointName,pointId) {
            var url = $scope.app.host + '/api/cinema-adLaunch/getPlayCount/export?projectId='+projectId+'&date='+date+'&billId='+billId+'&projectName='+projectName+'&pointName='+pointName+'&pointId='+pointId;
            console.log(url);
            document.location.href = url;
            
            // var $com = $resource($scope.app.host +
            // //api/cinema-adLaunch/getPlayCount/export?projectId=xxx&billId=xxx&date=xxx&pointId=xxx&projectName=xxx&pointName=xxx
            //     '/api/cinema-adLaunch/getPlayCount/export?projectId=:projectId&date=:date&billId=:billId&projectName=:projectName&pointName=:pointName&pointId=:pointId' ,
            //     {projectId:'@projectId', date:'@date',billId:'@billId',projectName:'projectName',pointName:'pointName'})
            // $com.get({projectId:$scope.projectId , date:date, billId:billId , projectName:projectName , pointName:pointName,pointId:pointId },function(res){
            //     console.log(res);

            // })
        }

    }])

//广告单播放统计详情
app.controller('adProjectCountDetailCtrl' , ['$scope' ,'$rootScope', '$state','staticData' ,'$resource', 'commonService','$stateParams','checkBtnService',
    function($scope ,$rootScope,$state, staticData , $resource , commonService,$stateParams,checkBtnService){

        $scope.projectId = $stateParams.id
        $scope.projectNum = $stateParams.projectNum
        $scope.projectName = $stateParams.projectName
        $scope.date = $stateParams.date

        $scope.isAdInto = $stateParams.isAdInto === 'false' ? false : true;

        $scope.adSelectBillId = $stateParams.billId;

        //$scope.adList = staticData.adType


        //分页每页条目数
        $scope.pageSize = staticData.pageSize
        //分页索引显示数

        $scope.maxSize = staticData.pageMaxSize

        $scope.returnBack = function () {
            history.back();
        }

        // $scope.adProjectCountDetail = function (id) {
        //     $state.go("app.order.adProjectCountDetail",{id:id});
        // }

        $scope.query = function(pageNo , pageSize , billId,date){
            console.log(date);
            var $com = $resource($scope.app.host +
                '/api/cinema-adLaunch/getPlayCount?pageNo=:pageNo&pageSize=:pageSize&projectId=:projectId&date=:date&billId=:billId' ,
                {pageNo:'@pageNo' , pageSize:'@pageSize' , projectId:'@projectId', date:'@date',billId:'@billId'})
            $com.get({pageNo:pageNo , pageSize:pageSize , projectId:$scope.projectId , date:date ,billId:billId},function(res){
                console.log(res);
                $scope.datas = res.dataList


                $scope.totalItems = res.total
                $scope.numPages = res.pages
                $scope.currentPage = res.pageNo
            })
        }

        //$scope.query(1 , $scope.pageSize,'',$scope.date)

        //初始化billID
        if($stateParams.billId) {
            $scope.adSelectBillId = $stateParams.billId
            $scope.query(1 , $scope.pageSize,$scope.adSelectBillId ,$scope.date)
        } else {
            $scope.adSelectBillId = '';
            $scope.query(1 , $scope.pageSize,'',$scope.date)
        }        

        //查询广告单下拉列表
        $scope.queryAd = function(){
            var $com = $resource($scope.app.host + "/api/cinema-adLaunch/:projectId/getAllBill", {
                taskId: '@projectId'
            });
            $com.get({ projectId: $scope.projectId }, function (res) {
                console.log(res);
                $scope.adList = res.message
                
            });
        }

        $scope.queryAd();

        //导出数据
        $scope.exportData = function (projectId,date,billId,projectName,pointName,pointId) {
            var url = $scope.app.host + '/api/cinema-adLaunch/getPlayCount/export?projectId='+projectId+'&date='+date+'&billId='+billId+'&projectName='+projectName+'&pointName='+pointName+'&pointId='+pointId;
            console.log(url);
            document.location.href = url;
            
            // var $com = $resource($scope.app.host +
            // //api/cinema-adLaunch/getPlayCount/export?projectId=xxx&billId=xxx&date=xxx&pointId=xxx&projectName=xxx&pointName=xxx
            //     '/api/cinema-adLaunch/getPlayCount/export?projectId=:projectId&date=:date&billId=:billId&projectName=:projectName&pointName=:pointName&pointId=:pointId' ,
            //     {projectId:'@projectId', date:'@date',billId:'@billId',projectName:'projectName',pointName:'pointName'})
            // $com.get({projectId:$scope.projectId , date:date, billId:billId , projectName:projectName , pointName:pointName,pointId:pointId },function(res){
            //     console.log(res);

            // })
        }

    }])

//广告单审核控制器
app.controller('checkSheetCtrl' , ['$scope' , 'staticData' , '$resource', 'commonService','$http',
    function($scope , staticData , $resource , commonService,$http){

        //终端类型
        $scope.PTtypes = staticData.PTtype
        //广告类型
        $scope.sheetTypes = staticData.sheetType
        //分页每页条目数
        $scope.pageSize = staticData.pageSize
        //分页索引显示数
        $scope.maxSize = staticData.pageMaxSize

        //查询待审核数目
        $scope.queryTipNum = function(){
            var $com = $resource($scope.app.host + '/api/cinema-adLaunch/adBill?pageNo=&pageSize=&billName=&billType=&pointType=&billStatus=1&projectId=')
            $com.get(function(res){
                if(res.success == false){
                    $scope.tipNum = 0
                }else {
                    $scope.tipNum = res.total
                }
            })
        }


        //查询待审核广告单列表
        $scope.queryList = function(billName , billType , pointType, pageNo, pageSize){
            var $com = $resource($scope.app.host + '/api/cinema-adLaunch/adBill?pageNo=:pageNo&pageSize=:pageSize&billName=:billName&billType=:billType&pointType=:pointType&billStatus=&projectId=',
                {billName:'@billName' , billType:'@billType' , pointType:'@pointType',pageNo:'@pageNo' , pageSize:'@pageSize'})
            $com.get({billName:billName , billType:billType , pointType:pointType,pageNo:pageNo,pageSize:pageSize},function(res){
                if(res.success == false){
                    commonService.ctrlError('查询' , res.message)
                    $scope.datas = data
                }else {
                    $scope.datas = res.dataList

                    $scope.totalItems = res.total
                    $scope.numPages = res.pages
                    $scope.currentPage = res.pageNo

                }
            })
        }

        $scope.search = function (billName , billType , pointType , pageNo, pageSize , e ) {
            if(billName){
                billName = billName.replace(/&/g, '%26')
            }
            if(e){
                var keycode = window.event?e.keyCode:e.which;
                if(keycode==13){
                    $scope.queryList(billName , billType , pointType, pageNo, pageSize)
                }
            }else {
                $scope.queryList(billName , billType , pointType, pageNo, pageSize)
            }
        }

        //查询审核权限
        $scope.checkExamine = function(){

            var promise = $http({method: 'put', url: $scope.app.host + '/api/cinema-adLaunch/checkAdBillPermmison'})
            promise.then(function(res){
                if(res.data.code == 'noPop' && res.data.access == "notpermission"){
                    //没审核权限，只显示状态
                    $scope.onlyShowState = true
                }else if(res.data.access == "havepermmison"){
                    //有审核权限，显示操作项
                    $scope.onlyShowState = false
                }
            })
        }

        //初始化查询
        $scope.queryTipNum()
        $scope.queryList('','','',1,$scope.pageSize)
        $scope.checkExamine()

}])


app.controller('adPointListCtrl' , ['$scope' , 'staticData' , '$resource', 'commonService','$stateParams','$state',
    function($scope , staticData , $resource , commonService ,$stateParams,$state){
        //点位状态选项绑定
        $scope.stateGroup = staticData.deviceState
        //点位类型绑定
        $scope.PTtype = staticData.PTtype

        $scope.cityList = []

        $scope.xiaKangBool = $stateParams.xiaKangBool

        console.log($stateParams);

        //查询点位城市数据
        $scope.queryCity = function(){
            var $com = $resource($scope.app.host + '/api/cinema-point/point/pointLocation?pointType=')
            $com.get(function(res){
                $scope.cityList = res.message
            })
        }

        // //查询待添加点位角标数值
        // $scope.queryTipNum = function(){
        //     var $com = $resource($scope.app.host + '/api/cinema-point/usefulPoint?province=&city=&district=&groupName=&groupType=&pageNo=&pageSize=')
        //     $com.get(function(res){
        //         $scope.tipNum = res.total
        //     })
        // }
        //跳转
        $scope.goDesc = function(){
            console.log($stateParams.bool);
            if($stateParams.bool == 'true'){
                if($stateParams.xiaKangBool == 'true') {
                    $state.go('app.order.desc',{projectId:$stateParams.projectId,id:$stateParams.billId,bool:true}) //详情带下刊
                } else {
                    $state.go('app.order.desc',{projectId:$stateParams.projectId,id:$stateParams.billId}) //详情
                }
            }else{
                $state.go('app.order.examineDesc',{id:$stateParams.billId})
            }
        }
        //返回上一页
        $scope.returnBack = function () {
            $state.go('app.order.adOrderList',{deviceId: $stateParams.projectId})
        }

        //查询列表
        $scope.query = function (province , city , district , pointName , pointType  , pageNo, pageSize) {
            ///api/cinema-adLaunch/adBill/getPoint?
            var $com = $resource($scope.app.host +
                "/api/cinema-adLaunch/adBill/getPoint?billId=:billId&pointProvince=:pointProvince&pointCity=:pointCity&pointDistrict=:pointDistrict&pointName=:pointName&pointType=:pointType&pageNo=:pageNo&pageSize=:pageSize", {
                billId:'@billId',
                pointProvince: '@province',
                pointCity: '@city',
                pointDistrict: '@district',
                pointName: '@pointName',
                pointType: '@pointType',
                //state: '@state',
                pageNo: '@pageNo',
                pageSize: '@pageSize'
            });

            $com.get({ billId:$stateParams.billId, pointProvince: province, pointCity: city , pointDistrict: district , pointName: pointName, pointType: pointType,pageNo: pageNo, pageSize: pageSize },
                function (res) {
                    // $scope.countMap = res.countMap
                    // $scope.datas = res.pointList.results
                    // $scope.deviceList = res.pointList.results
                    console.log(res);
                    $scope.adPointList = res.dataList
                })
        }

        $scope.search = function (selected,selected2,selected3,keyword,type , e , pageNo, pageSize ) {
            if(keyword){
                keyword = keyword.replace(/&/g, '%26')
            }
            if(e){
                var keycode = window.event?e.keyCode:e.which;
                if(keycode==13){
                    //$scope.query(selected,selected2,selected3,keyword,type)
                    $scope.query(selected.province,selected2.city,selected3,keyword,type)
                }
            }else {
                //$scope.query(selected,selected2,selected3,keyword,type)
                $scope.query(selected.province,selected2.city,selected3,keyword,type)
            }
        }

        //---初始查询----
        $scope.queryCity()

        $scope.query()

        //$scope.queryTipNum()


        // $scope.adPointList = [
        // {
            
        //     "sendStatus": 1, //发送状态 1代表已完成 2代表正在发送 
        //     "pointName": "测试点位",  //点位名称
        //     "adress": "北京北京昌平来广营诚盈中心" //点位位置
			
        // },        {
            
        //     "sendStatus": 2, //发送状态 1代表已完成 2代表正在发送 
        //     "pointName": "测试点位2",  //点位名称
        //     "adress": "北京北京昌平来广营诚盈中心22" //点位位置
			
        // }

        // ];

        // $scope.cityList = [
        //     {
        //         "province": "湖北省",
        //         "cityList":[
        //             {
        //                 "city":"武汉市",
        //                 "districtList":[
        //                     "武昌区","汉口区"
        //                 ],
        //                 "pointIdList":[
        //                     "111","222"
        //                 ]
        //             },
        //             {
        //                 "city":"孝感市",
        //                 "districtList":[
        //                     "孝南区"
        //                 ],
        //                 "pointIdList":[
        //                     "333","444"
        //                 ]
        //             }
        //         ]
        //     },
        //     {
        //         "province": "河南省",
        //         "cityList":[
        //             {
        //                 "city":"郑州市",
        //                 "districtList":[
        //                     "金水区"
        //                 ],
        //                 "pointIdList":[
        //                     "123","456"
        //                 ]
        //             },
        //             {
        //                 "city":"许昌市",
        //                 "districtList":[
        //                     "xx区"
        //                 ],
        //                 "pointIdList":[
        //                     "345","424"
        //                 ]
        //             }
        //         ]
        //     }
        // ]
        //---测试结束---

        $scope.c = function (selected,selected2,selected3,keyword,type,state) {
            $scope.selected2 = "";
            $scope.selected3 = "";
            //console.log(selected);
            if(selected) {
                $scope.query(selected.province,selected2,selected3,keyword,type,state)
            } else {
                $scope.query(selected,selected2,selected3,keyword,type,state)
            }
        };

        $scope.c2 = function (selected,selected2,selected3,keyword,type,state) {
            $scope.selected3 = "";
            
            $scope.query(selected.province,selected2.city,selected3,keyword,type,state)
        };

        $scope.c3 = function (selected,selected2,selected3,keyword,type,state) {
            $scope.query(selected.province,selected2.city,selected3,keyword,type,state)
        }

        //点位编辑&查看详情
        $scope.editPT = function(id){
            commonService.editPT(id)

        }

}])

//添加广告单第一步添加站点

app.controller('addAdOrder1Ctrl' , ['$rootScope','$scope','$state' , 'staticData' , '$resource', 'commonService','$stateParams','dataAccess',
    function($rootScope,$scope ,$state, staticData , $resource , commonService,$stateParams,dataAccess){

        $scope.projectName = $stateParams.projectName
        $scope.projectId = $stateParams.projectId
        $scope.projectNum = $stateParams.projectNum

        console.log($stateParams);
        $scope.citySite = []
        $scope.selectPoint = []
        $scope.data = {}
        $scope.data['type'] = '2'
        $scope.data['video'] = '1'
        $scope.data['site'] = '0'
        $scope.allPointIdList = {}

        var allObj = dataAccess.sessionGet('allObj');
        if(allObj) {
            //console.log(allObj);
            //console.log(22222);
                    //             "billName" : $scope.data.adName, //广告单名称
                    // "billType" : $scope.data.video,          //广告类型 1代表视频 2代表互动游戏
                    // "pointIds" :pointIds,//点位id数组
                    // "projectId":$stateParams.projectId,  //广告项目id
                    // "pointType" : $scope.data.type,   //点位类型 1:3*3,2:3*4,3:1*2,4:单屏
                    // "sendPoint" : $scope.data.site
            $scope.data.adName = allObj.step1.billName
            $scope.data.video = allObj.step1.billType
            $scope.data.type = allObj.step1.pointType
            $scope.data.site = allObj.step1.sendPoint
            $scope.data.projectId = allObj.step1.projectId
            $scope.data.billId = $stateParams.billId
            $scope.selectPoint  = allObj.step1.pointIds
            //if($scope.data.site == 1){
            //    $scope.cityNum = allObj.step1.cityList.length
            //}
            //


            $scope.citySite = allObj.step1.pointIds

        } else {
            var allObj = {};
        }

        //编辑时搜索广告单详情
        $scope.query = function () {
            var $com = $resource($scope.app.host +
                "/api/cinema-adLaunch/adBill/:billId",{billId:$stateParams.billId});

            $com.get({ billId:$stateParams.billId},
                function (res) {
                    //console.log(res);
                    $scope.data.adName = res.step1.billName
                    $scope.data.video = res.step1.billType
                    $scope.data.type = res.step1.pointType
                    $scope.data.site = res.step1.sendPoint

                    //$scope.data.billId = res.step1.billId
                    $scope.data.projectId = res.step1.projectId

                    allObj.step1 = res.step1
                    allObj.step2 = res.step2
                    allObj.step3 = res.step3

                    $scope.cityList = res.step1.cityList

                    $scope.selectPoint = allObj.step1.pointIds
                   // allObj.step1.projectId = res.step1.projectId
                    if($scope.data.site == 1){
                        $scope.cityNum = res.step1.cityList.length
                        $scope.citySite = res.step1.pointIds
                        $scope.selectPoint = []
                    } else if($scope.data.site == 2) {
                        $scope.cityNum = 0
                        $scope.citySite = []
                    } else if($scope.data.site == 0) {
                        $scope.getAllPoint('','','','',$scope.data.type,'','','');
                        $scope.cityNum = 0
                        $scope.citySite = []
                        $scope.selectPoint = []
                    }

                })
        }
        

        
        //if($stateParams.billId && !allObj.step1) {
        if($stateParams.billId) {
            console.log('编辑');
            $scope.data.billId = $stateParams.billId
            //console.log($scope.data.billId);
            $scope.query();


        } else if($stateParams.projectId){
            console.log("新增");
            $scope.data.billId = ''
            
            $scope.data.projectId = $stateParams.projectId
        }


        $scope.returnBack = function () {
            $state.go('app.order.adOrderList',{deviceId: $stateParams.projectId})
        }


        $scope.setPoint = function(){
           // if($scope.data.type)
           //console.log($scope.selectPoint);
                commonService.setPointModal($scope.data.type,$scope.selectPoint);
            //            commonService.addRoleMemberModal('b0b0ad174cfa4a449546c7ae599ab6da','%E6%B5%8B%E8%AF%95');


        }

        $scope.getAllPoint  = function (province, city, district , pointName, pointType,state,pageNo, pageSize) {
                        ///api/cinema-point/point?province=xxx&city=xxx&district=xxx&pointName=xxx&pointType=xxx&state=xxx&pageNo=xxx&pageSize=xxx
                        var $com = $resource($scope.app.host +
                            "/api/cinema-point/point?province=:province&city=:city&district=:district&pointName=:pointName&pointType=:pointType&state=:state&pageNo=:pageNo&pageSize=:pageSize", {
                            province: '@province',
                            city: '@city',
                            district: '@district',
                            pointName: '@pointName',
                            pointType: '@pointType',
                            state: '@state',
                            pageNo: '@pageNo',
                            pageSize: '@pageSize'
                        });

                        $com.get({ province: province, city: city , district: district , pointName: pointName, pointType: pointType,state:state,pageNo: pageNo, pageSize: pageSize },
                            function (res) {
                                //console.log(res);
                                $scope.allPointIdList = res.pointList.dataList
                                //console.log($scope.allPointIdList);
                                $scope.allPoints = []
                                for(var i = 0;i <= $scope.allPointIdList.length - 1;i++) {
                                    $scope.allPoints.push($scope.allPointIdList[i].pointId);
                                }
                                //console.log($scope.allPoints);
                            })
                    }

        $scope.getAllPoint('','','','',2,'','','');

        $scope.changeType = function (num) {
            $scope.data.site = 0;
            $scope.cityNum = 0;
            $scope.selectPoint = [];
            //当类型改变时所有选择得点位都为空
            $scope.citySite = [];
            $scope.allPoints = [];
            $scope.selectPoint = [];
            $scope.cityList = [];
            if(num == 5){
                $scope.data['video'] = '1'
                $scope.pointTypeBool = true
            }else{
                $scope.pointTypeBool = false
            }
            $scope.getAllPoint('','','','',num,'','','');
        }

        $scope.showCityList = function () {
            commonService.selectCitySite($scope.data.type,$scope.cityList,$scope.citySite);
        }
        //改变billType时候清除list
        $scope.changeBillType = function(){
            if(allObj){
                allObj.step2.fileInfo = []
            }
        }
        $rootScope.$on('selectCityList', function (event, args) {
            //console.log(args);
            $scope.cityNum = args.selectCityList.length
            //$scope.cityList = args.selectCityList
            


            $scope.citySite = [];
            $scope.cityList = [];
            for(var i = 0;i <= args.selectCityList.length-1; i++) {

               // for(var x = 0;x <= args.selectCityList[i].length - 1; x++) {
                    $scope.cityList.push(args.selectCityList[i].name);
               // }

                for(var j = 0;j <= args.selectCityList[i].pointIdList.length - 1 ;j++) {
                    $scope.citySite.push(args.selectCityList[i].pointIdList[j]);
                }
            }
            //console.log($scope.citySite);
        })


        $rootScope.$on('selectPoint', function (event, selectPoint) {
            //console.log(12323);
            //console.log(selectPoint);
            $scope.selectPoint = selectPoint.selectPoint;
        })
        

        $scope.nextStep = function () {
            //var getCitySite = dataAccess.sessionGet('selectSitesArr');
            //console.log(getCitySite);
            if(!$scope.data.adName) {
                commonService.ctrlError('操作','请输入广告单名称');
                return;
            }

            if($scope.data.adName.length > 30) {
                commonService.ctrlError('操作','广告单名称不能大于30');
                return;
            }

            var pointIds = [];
                //console.log($scope.data.site);
            switch(parseInt($scope.data.site)) {
                case 0 : pointIds = $scope.allPoints; break;
                case 1 : pointIds = $scope.citySite; break;
                case 2 : pointIds = $scope.selectPoint; break;
            }

            if(allObj.step1) {
                allObj.step1 = {
                    "billId" : $scope.data.billId,
                    "billName" : $scope.data.adName, //广告单名称
                    "billType" : $scope.data.video,          //广告类型 1代表视频 2代表互动游戏
                    "pointIds" :pointIds,//点位id数组
                    "projectId":$scope.data.projectId,  //广告项目id
                    "pointType" : $scope.data.type,   //点位类型 1:3*3,2:3*4,3:1*2,4:单屏
                    "sendPoint" : $scope.data.site                   
                }
            } else {
                allObj = {
                    'step1':{
                        "billId" : $scope.data.billId,
                        "billName" : $scope.data.adName, //广告单名称
                        "billType" : $scope.data.video,          //广告类型 1代表视频 2代表互动游戏
                        "pointIds" :pointIds,//点位id数组
                        "projectId":$scope.data.projectId,  //广告项目id
                        "pointType" : $scope.data.type,   //点位类型 1:3*3,2:3*4,3:1*2,4:单屏
                        "sendPoint" : $scope.data.site
                        //这是第一步的数据
                    },
                    'step2': {

                    },
                    'step3': {

                    }
                }
            }
            if($stateParams.addFlag == 0 || $stateParams.addFlag == "newAdd") {
                console.log('新增或者草稿状态需要请求服务器');
                if(allObj.step1.billId) {
                    console.log('存在billId就为编辑草稿状态');
                    $scope.addInfo(allObj,'draft',allObj.step1.billId);
                } else {
                    $scope.addInfo(allObj,'draft');
                }
            } else {
                $state.go('app.order.addAdOrder2',{projectId:$stateParams.projectId,addFlag:$stateParams.addFlag});
                dataAccess.sessionSave('allObj',allObj)
            }

        }

        $scope.addMedia = function () {
            commonService.fileManagerModal('选择');
        }
        
        $scope.addInfo = function (allObj , operate , draftId) {
                var $com = $resource(staticData.hostUrl + '/api/cinema-adLaunch/adBill?operate=:operate&draftId=:draftId',{
                    operate:'@operate',
                    draftId:'@draftId'
                })
                $com.save({operate:operate,draftId:draftId} , allObj , function(res){
                    //console.log(res);
                    if(res.success){
                        allObj.step1.billId = res.code;
                        //commonService.ctrlSuccess('添加');
                        $state.go('app.order.addAdOrder2',{projectId:$stateParams.projectId,addFlag:$stateParams.addFlag});
                        dataAccess.sessionSave('allObj',allObj)
                        
                        //$modalInstance.close()
                    }else{
                        commonService.ctrlError('添加', res.message)
                        //$scope.noRepeat = false
                    }
                })
        }
}])

//添加广告单第二步选择素材

app.controller('addAdOrder2Ctrl' , ['$scope' , 'staticData' , '$resource', 'commonService','dataAccess' , '$rootScope' , '$state','$stateParams',
    function($scope , staticData , $resource , commonService , dataAccess , $rootScope , $state ,$stateParams){

        $scope.projectName = $stateParams.projectName
        $scope.projectId = $stateParams.projectId
        $scope.projectNum = $stateParams.projectNum

           $scope.data =  {

            "fileInfo" : [
                {
                    "deviceType" : 1, //终端类型 1：主屏 2：副屏1 3：副屏2 4：副屏3
                    "fileId" : "", //素材的uid
                    "format":"video" //素材格式
                },
                {
                    "deviceType" : 2,
                    "fileId" : "",
                    "format":"picture"
                },
                {
                    "deviceType" : 3,
                    "fileId" : "",
                    "format":"picture"
                },
                {
                    "deviceType" : 4,
                    "fileId" : "",
                    "format":"picture"
                }
            ],
            "screenType" : 2 //副屏类型 1代表分屏 2代表全屏
            //这是第二步的数据
            }

        //$scope.data['type'] = '1'
        $scope.screenNum = 0 //用于判断是哪个屏幕
        //$scope.screen5 = true
        function isEmptyObject(e) {
            var t;
            for (t in e)
                return !1;
            return !0
        }

        var allObj = dataAccess.sessionGet('allObj')
        console.log(allObj)
        //判断是视频还是游戏
        var orderType = allObj.step1.billType == 1 ? true : false;

        $scope.deviceType = allObj.step1.pointType;

        $scope.gameOrVideo = orderType;

        $scope.allDel = function () {

            commonService.ctrlModal('deleteAd').result.then(function () {
                console.log('清除素材');
                // $scope.data.fileInfo[0].fileId = ''
                // $scope.data.fileInfo[1].fileId = ''
                // $scope.data.fileInfo[2].fileId = ''
                // $scope.data.fileInfo[3].fileId = ''
                // $scope.data.fileInfo[1].fileId = ''
                $scope.data.fileInfo = []
                $scope.screen1 = false
                $scope.screen2 = false
                $scope.screen3 = false
                $scope.screen4 = false
                $scope.screen5 = false
                $scope.gameType = false
                $('#order-video').fadeOut(20);
                if($scope.playBool){
                    playerPre.paused();
                }
            })

        }

        $scope.returnBack = function () {
            //history.back();
            $state.go('app.order.addAdOrder1', {projectId:$stateParams.projectId,billId: allObj.step1.billId, addFlag:$stateParams.addFlag})
        }
        $scope.selectMedia = function(number , format){
            $scope.screenNum = number
            var format = format
            // if(!orderType){
            //     format = 'other'
            // }
            //alert(0)
            commonService.fileManagerModal('选择' ,'' , format);
            //            commonService.addRoleMemberModal('b0b0ad174cfa4a449546c7ae599ab6da','%E6%B5%8B%E8%AF%95');


        }

        $rootScope.$on('selectFileObj',function(event,args){
            //console.log(args.selectFileObj.uid)
            //console.log(args)
            //$scope.gameName = args.selectFileObj.name;
            console.log(args.selectFileObj.uid);
            $scope.query($scope.screenNum,args.selectFileObj.uid)
        })

        $scope.addInfo = function (allObj , operate , draftId) {
                var $com = $resource(staticData.hostUrl + '/api/cinema-adLaunch/adBill?operate=:operate&draftId=:draftId',{
                    operate:'@operate',
                    draftId:'@draftId'
                })
                $com.save({operate:operate,draftId:draftId} , allObj , function(res){
                    console.log(res);
                    if(res.success){
                        //commonService.ctrlSuccess('添加');
                        $state.go('app.order.addAdOrder3',{projectId:$stateParams.projectId,addFlag:$stateParams.addFlag});
                        dataAccess.sessionSave('allObj',allObj)

                        //$modalInstance.close()
                    }else{
                        commonService.ctrlError('添加', res.message)
                        //$scope.noRepeat = false
                    }
                })
        }

        //下一步
        $scope.nextStep = function () {

            // if($scope.data.screenType == 2){
            //         if($scope.data.fileInfo[1].fileId) {
            //             $scope.data.fileInfo[2].delete
            //             $scope.data.fileInfo[3].delete
            //         } else {
            //             // commonService.ctrlError('操作','请先选择素材')
            //             // return;
            //         }
            //     }
            console.log($scope.data);

            if($scope.data.fileInfo.length) {
                    for(var i = $scope.data.fileInfo.length - 1;i >=0; i-- ) {
                        if($scope.data.fileInfo[i].fileId == "") {
                            $scope.data.fileInfo.splice(i, 1);
                        }
                    }
            }


            console.log($scope.data);

            if($stateParams.addFlag == 0 || $stateParams.addFlag == "newAdd") {
                console.log('新增或者草稿状态需要请求服务器');
                if(allObj.step1.billId) {
                    console.log('存在billId就为编辑草稿状态');
                    allObj.step2 = $scope.data
                    $scope.addInfo(allObj,'draft',allObj.step1.billId);
                } else {
                    allObj.step2 = $scope.data
                    $scope.addInfo(allObj,'draft');
                }
            } else {
                allObj.step2 = $scope.data
                $state.go('app.order.addAdOrder3',{projectId:$stateParams.projectId,addFlag:$stateParams.addFlag});
                dataAccess.sessionSave('allObj',allObj)
            }

            // if($scope.data.fileInfo[0].fileId){
            //     if($scope.data.screenType == 1 ) {

            //         // if($scope.data.fileInfo[1].fileId&&$scope.data.fileInfo[2].fileId&&$scope.data.fileInfo[3].fileId) {
            //         // }else {
            //         //     commonService.ctrlError('操作','请先选择素材')
            //         //     return;
            //         // }

            //     }
            //     if($scope.data.screenType == 2){
            //         if($scope.data.fileInfo[1].fileId) {
            //             $scope.data.fileInfo[2].delete
            //             $scope.data.fileInfo[3].delete
            //         } else {
            //             // commonService.ctrlError('操作','请先选择素材')
            //             // return;
            //         }
            //     }

            // if($stateParams.addFlag == 0 || $stateParams.addFlag == "newAdd") {
            //     console.log('新增或者草稿状态需要请求服务器');
            //     if(allObj.step1.billId) {
            //         console.log('存在billId就为编辑草稿状态');
            //         allObj.step2 = $scope.data
            //         $scope.addInfo(allObj,'draft',allObj.step1.billId);
            //     } else {
            //         allObj.step2 = $scope.data
            //         $scope.addInfo(allObj,'draft');
            //     }
            // } else {
            //     allObj.step2 = $scope.data
            //     $state.go('app.order.addAdOrder3',{addFlag:$stateParams.addFlag});
            //     dataAccess.sessionSave('allObj',allObj)
            // }
            //         // allObj.step2 = $scope.data
            //         // console.log(allObj);

            //         // dataAccess.sessionSave('allObj',allObj)
            //         // $state.go("app.order.addAdOrder3")


            // }else{
            //    // commonService.ctrlError('操作','请先选择素材')
            // }

            //dataAccess.sessionSave('allObj',allObj)

            //return
            //$scope.data.fileId =

        }

        //播放器
        var playerPre = {};
        $scope.playBool = false
        $scope.openOtherPlay = function (imgPath, videoPath) {
            $('.video-jsPre1').attr('id','a'+parseInt(Math.random()*3000))
            var videoId = $('.video-jsPre1').attr('id')
            //$scope.posterImg = $rootScope.address + imgPath;
            playerPre = videojs(videoId, {
                //"techOrder": ["flash","html"],
                "autoplay": false,
                //"poster": $scope.posterImg,

            });
            $scope.playBool = true
            playerPre.src($rootScope.address + videoPath);
            //playerPre.poster($scope.posterImg);
            playerPre.paused();
        };
        //预览
        $scope.openPlay = function (src) {
            $('#videoMask').fadeIn(200);
            $('#preview').fadeIn(200);


            $scope.openPlayImg = src
        }
        //关闭预览
        $scope.closePlay = function(){
            $('#videoMask').fadeOut(200);
            $('#preview').fadeOut(200);
        }

        //查询素材
        //预览
        $scope.query = function (screenNum,fileUid) {
            console.log(fileUid);
            var $com = $resource($scope.app.host +
                "/api/mps-filemanager/file/:fileUid/preview", {
                taskId: '@fileUid'
            });
            $com.get({ fileUid: fileUid},
                function (data) {
                        //         $scope.data.fileInfo = [
                        //     {
                        //         "deviceType" : 1, //终端类型 1：主屏 2：副屏1 3：副屏2 4：副屏3
                        //         "fileId" : "", //素材的uid
                        //         "format":"video" //素材格式
                        //     },
                        //     {
                        //         "deviceType" : 2,
                        //         "fileId" : "",
                        //         "format":"picture"
                        //     },
                        //     {
                        //         "deviceType" : 3,
                        //         "fileId" : "",
                        //         "format":"picture"
                        //     },
                        //     {
                        //         "deviceType" : 4,
                        //         "fileId" : "",
                        //         "format":"picture"
                        //     }
                        // ];
                        //console.log(data);
                    if(screenNum == 1){
                        $scope.screen1 = true;
                        if(orderType){
                            $('#order-video').fadeIn(200);
                            $scope.openOtherPlay(data.message[0].picPath,data.message[0].videoPath)
                        }else{
                            $scope.gameType = true
                            $scope.gameName = data.message[0].name
                        }
                        //去除相同位置的素材
                        if($scope.data.fileInfo.length > 0 ){
                            for(var i=$scope.data.fileInfo.length - 1;i>=0;i--) {
                                if($scope.data.fileInfo[i].deviceType == 1) {
                                    $scope.data.fileInfo.splice(i,1);
                                }
                            }
                        }
                        //显示大屏的游戏界面
                        $scope.screen1Pic =$rootScope.address + data.message[0].picPath
                        if(!$scope.gameOrVideo) {
                            $scope.data.fileInfo.push({

                                "deviceType" : 1,
                                    "fileId" : fileUid,
                                    "format":"game"
                            });
                        } else {
                            $scope.data.fileInfo.push({
                                "deviceType" : 1,
                                    "fileId" : fileUid,
                                    "format":"video"
                            });
                        }

                        //console.log($scope.data.fileInfo);
                        //$scope.data.fileInfo[0].fileId = fileUid;
                    }else if(screenNum == 3){
                        $scope.screen3 = true;
                        $scope.screen3Pic =$rootScope.address + data.message[0].picPath
                        //$scope.data.fileInfo[2].fileId = fileUid;

                        //去除相同位置的素材
                        for(var i=$scope.data.fileInfo.length - 1;i>=0;i--) {
                            if($scope.data.fileInfo[i].deviceType == 3) {
                                $scope.data.fileInfo.splice(i,1);
                            }
                        }

                        $scope.data.fileInfo.push({
                             "deviceType" : 3,
                                 "fileId" : fileUid,
                                 "format":"picture"
                        });
                    }else if(screenNum == 2){
                        $scope.screen2 = true;
                        $scope.screen2Pic =$rootScope.address + data.message[0].picPath
                        //$scope.data.fileInfo[1].fileId = fileUid;

                        //去除相同位置的素材
                        for(var i=$scope.data.fileInfo.length - 1;i>=0;i--) {
                            if($scope.data.fileInfo[i].deviceType == 2) {
                                $scope.data.fileInfo.splice(i,1);
                            }
                        }

                        $scope.data.fileInfo.push({
                             "deviceType" : 2,
                                 "fileId" : fileUid,
                                 "format":"picture"
                        });
                    }else if(screenNum == 4){
                        $scope.screen4 = true;
                        $scope.screen4Pic =$rootScope.address + data.message[0].picPath
                        //$scope.data.fileInfo[3].fileId = fileUid;

                        //去除相同位置的素材
                        for(var i=$scope.data.fileInfo.length - 1;i>=0;i--) {
                            if($scope.data.fileInfo[i].deviceType == 4) {
                                $scope.data.fileInfo.splice(i,1);
                            }
                        }

                        $scope.data.fileInfo.push({
                             "deviceType" : 4,
                                 "fileId" : fileUid,
                                 "format":"picture"
                        });
                    }else if(screenNum == 5){
                        $scope.screen5 = true;
                        $scope.screen5Pic =$rootScope.address + data.message[0].picPath

                        //去除相同位置的素材
                        for(var i=$scope.data.fileInfo.length - 1;i>=0;i--) {
                            if($scope.data.fileInfo[i].deviceType == 2) {
                                $scope.data.fileInfo.splice(i,1);
                            }
                        }
                        //$scope.data.fileInfo[1].fileId = fileUid;
                        $scope.data.fileInfo.push({
                             "deviceType" : 2,
                                 "fileId" : fileUid,
                                 "format":"picture"
                        });
                    }
                })
        }
        //数据回显
        console.log(allObj);
        if(!isEmptyObject(allObj.step2) && allObj.step1.pointType != 5){
            $scope.data = allObj.step2
            //console.log($scope.data)

            if(allObj.step2.fileInfo.length >0) {
                if(allObj.step2.screenType == 2){
                    // $scope.query(1,$scope.data.fileInfo[0])
                    // $scope.query(5,$scope.data.fileInfo[1].fileId)

                    for(var i=$scope.data.fileInfo.length - 1;i>=0;i--) {
                        if($scope.data.fileInfo[i].deviceType == 1) {
                            $scope.query(1,$scope.data.fileInfo[i].fileId)
                        }
                        if($scope.data.fileInfo[i].deviceType == 2) {
                            $scope.query(5,$scope.data.fileInfo[i].fileId)
                        }
                    }

                }else{
                    for(var i=$scope.data.fileInfo.length - 1;i>=0;i--) {
                        if($scope.data.fileInfo[i].deviceType == 1) {
                            $scope.query(1,$scope.data.fileInfo[i].fileId)
                        }
                        if($scope.data.fileInfo[i].deviceType == 2) {
                            console.log($scope.data.fileInfo[i].fileId);
                            $scope.query(2,$scope.data.fileInfo[i].fileId)
                        }
                        if($scope.data.fileInfo[i].deviceType == 3) {
                            $scope.query(3,$scope.data.fileInfo[i].fileId)
                        }
                        if($scope.data.fileInfo[i].deviceType == 4) {
                            $scope.query(4,$scope.data.fileInfo[i].fileId)
                        }
                    }
                    // $scope.query(1,$scope.data.fileInfo[0])
                    // $scope.query(2,$scope.data.fileInfo[1].fileId)
                    // $scope.query(3,$scope.data.fileInfo[2].fileId)
                    // $scope.query(4,$scope.data.fileInfo[3].fileId)

                }
            } else {
                    $scope.data = {

                        "fileInfo" : [
                            {
                                "deviceType" : 1, //终端类型 1：主屏 2：副屏1 3：副屏2 4：副屏3
                                "fileId" : "", //素材的uid
                                "format":"video" //素材格式
                            },
                            {
                                "deviceType" : 2,
                                "fileId" : "",
                                "format":"picture"
                            },
                            {
                                "deviceType" : 3,
                                "fileId" : "",
                                "format":"picture"
                            },
                            {
                                "deviceType" : 4,
                                "fileId" : "",
                                "format":"picture"
                            }
                        ],
                        "screenType" : 2 //副屏类型 1代表分屏 2代表全屏
                                }
                return;
            }
        }

        //换type
        $scope.changeType = function(num){
            if(num == 2){
                // $scope.data.fileInfo[1].fileId = ''
                // $scope.data.fileInfo[2].fileId = ''
                // $scope.data.fileInfo[3].fileId = ''
                //$scope.screen1 = false
                $scope.screen2 = false
                $scope.screen3 = false
                $scope.screen4 = false
                for(var i=$scope.data.fileInfo.length - 1;i>=0;i--) {
                    if($scope.data.fileInfo[i].deviceType > 1) {
                        $scope.data.fileInfo.splice(i,1);
                        //$scope.data.fileInfo[i].
                        console.log($scope.data.fileInfo);
                    }
                }
            }else{
               // $scope.data.fileInfo[1].fileId = ''

                $scope.screen5 = false
                for(var i=$scope.data.fileInfo.length - 1;i>=0;i--) {
                    if($scope.data.fileInfo[i].deviceType > 1) {
                        $scope.data.fileInfo.splice(i,1);
                        console.log($scope.data.fileInfo);

                    }
                }
            }
        }

        //$scope.nextStep();
        //获取子控制器的图片
        $scope.$on('to-parentImg',function(event, msg){
            $scope.openPlayImg = msg
        });
    }])


//第二步添加素材扩展1+1+1
app.controller('newScreenCtrl' , ['$scope' , 'staticData' , '$resource', 'commonService','dataAccess' , '$rootScope' , '$state','$stateParams',
    function($scope , staticData , $resource , commonService , dataAccess , $rootScope , $state ,$stateParams){
        $scope.data =  {

            "fileInfo" : [
                {
                    "deviceType" : 1, //终端类型 1：主屏 2：副屏1 3：副屏2 4：副屏3
                    "fileId" : "", //素材的uid
                    "format":"video" //素材格式
                },
                {
                    "deviceType" : 2,
                    "fileId" : "",
                    "format":"picture"
                },
                {
                    "deviceType" : 3,
                    "fileId" : "",
                    "format":"picture"
                },
                {
                    "deviceType" : 4,
                    "fileId" : "",
                    "format":"picture"
                }
            ],
            "screenType" : 2 //副屏类型
            //这是第二步的数据
        }

        $scope.screenNum = 0 //用于判断是哪个屏幕
        function isEmptyObject(e) {
            var t;
            for (t in e)
                return !1;
            return !0
        }
        //视频时长字段
        var videoCode1 = 0
        var videoCode2 = 0
        var allObj = dataAccess.sessionGet('allObj')
        //console.log(allObj)
        //判断是视频还是游戏
        var orderType = allObj.step1.billType == 1 ? true : false;

        $scope.deviceType = allObj.step1.pointType;

        $scope.gameOrVideo = orderType;

        $scope.allDel = function () {
            //console.log('清除素材');
            $scope.data.fileInfo = []
            $scope.screen1 = false
            $scope.screen5 = false
            $scope.screen7 = false
            $scope.gameType = false
            $scope.playBool1 = false
            $('.order-video1').fadeOut(20);
            if($scope.playBool){
                playerPre.pause();
            }
            $('.order-video2').fadeOut(20);
            if($scope.playBool1){
                playerPre1.pause();
            }
        }

        $scope.returnBack = function () {
            //history.back();
            $state.go('app.order.addAdOrder1', {projectId:$stateParams.projectId,billId: allObj.step1.billId, addFlag:$stateParams.addFlag})
        }
        $scope.selectMedia = function(number , format){
            $scope.screenNum = number
            console.log(number)
            var format = format
            // if(!orderType){
            //     format = 'other'
            // }
            //alert(0)
            commonService.fileManagerModal('选择' ,'' , format);
            //            commonService.addRoleMemberModal('b0b0ad174cfa4a449546c7ae599ab6da','%E6%B5%8B%E8%AF%95');


        }

        $rootScope.$on('selectFileObj',function(event,args){

            //console.log(args.selectFileObj.uid);
            $scope.query($scope.screenNum,args.selectFileObj.uid)
        })

        $scope.addInfo = function (allObj , operate , draftId) {
            var $com = $resource(staticData.hostUrl + '/api/cinema-adLaunch/adBill?operate=:operate&draftId=:draftId',{
                operate:'@operate',
                draftId:'@draftId'
            })
            $com.save({operate:operate,draftId:draftId} , allObj , function(res){
                console.log(res);
                if(res.success){
                    //commonService.ctrlSuccess('添加');
                    $state.go('app.order.addAdOrder3',{projectId:$stateParams.projectId,addFlag:$stateParams.addFlag});
                    dataAccess.sessionSave('allObj',allObj)

                    //$modalInstance.close()
                }else{
                    commonService.ctrlError('添加', res.message)
                    //$scope.noRepeat = false
                }
            })
        }

        //下一步
        $scope.nextStep = function () {

            // if($scope.data.screenType == 2){
            //         if($scope.data.fileInfo[1].fileId) {
            //             $scope.data.fileInfo[2].delete
            //             $scope.data.fileInfo[3].delete
            //         } else {
            //              commonService.ctrlError('操作','请先选择素材')
            //             // return;
            //         }
            //     }
            //console.log($scope.data);
            //判断视频时长
            if(allObj.step1.billType == 1 && $scope.data.screenType == 2){
                if(Math.abs(videoCode1 - videoCode2) > 1){
                    videoCode1 = parseInt(videoCode1);
                    videoCode2 = parseInt(videoCode2)
                    var obj = {
                        videoCode1 : videoCode1,
                        videoCode2 : videoCode2
                    }
                    commonService.ctrlModal('videoCode' , obj)
                    return;
                }
            }
            if($scope.data.fileInfo.length) {
                for(var i = $scope.data.fileInfo.length - 1;i >=0; i-- ) {
                    if($scope.data.fileInfo[i].fileId == "") {
                        $scope.data.fileInfo.splice(i, 1);
                    }
                }
            }
            if($scope.data.screenType == 1 && $scope.data.fileInfo.length > 0){
                //alert(0)
                if(allObj.step1.billType == 1){
                    var h = 0;
                    var k = 0
                    for(var i = 0; i < $scope.data.fileInfo.length; i++){
                        if($scope.data.fileInfo[i].deviceType == 1){
                            h = i;
                        }
                        if($scope.data.fileInfo[i].deviceType == 3){
                            k = i;
                        }
                    }
                    if($scope.data.fileInfo.length == 2){
                        $scope.data.fileInfo.push({
                            "deviceType" : 3,
                            "fileId" : $scope.data.fileInfo[h].fileId,
                            "format":"video"
                        });
                    }else{
                        $scope.data.fileInfo[k].fileId = $scope.data.fileInfo[h].fileId
                        //console.log('复制成功')
                        //console.log($scope.data.fileInfo[k].fileId)
                        //console.log($scope.data.fileInfo[h].fileId)
                    }
                }else{
                    for(var i = 0; i < $scope.data.fileInfo.length; i++){
                        if($scope.data.fileInfo[i].deviceType == 3){
                            $scope.data.fileInfo.splice(i, 1);
                        }
                    }
                }
            }

            if($stateParams.addFlag == 0 || $stateParams.addFlag == "newAdd") {
                //console.log('新增或者草稿状态需要请求服务器');
                if(allObj.step1.billId) {
                    //console.log('存在billId就为编辑草稿状态');
                    allObj.step2 = $scope.data
                    $scope.addInfo(allObj,'draft',allObj.step1.billId);
                } else {
                    allObj.step2 = $scope.data
                    $scope.addInfo(allObj,'draft');
                }
            } else {
                allObj.step2 = $scope.data
                $state.go('app.order.addAdOrder3',{projectId:$stateParams.projectId,addFlag:$stateParams.addFlag});
                dataAccess.sessionSave('allObj',allObj)
            }


        }

        //播放器
        var playerPre = {};
        $scope.playBool = false

        $scope.openOtherPlay = function (imgPath, videoPath) {
            $('.video-jsPre2').attr('id','b'+parseInt(Math.random()*2000))
            //console.log($('.video-jsPre2'))
            var videoId1 = $('.video-jsPre2').attr('id')
            //$scope.posterImg = $rootScope.address + imgPath;
            playerPre = videojs(videoId1, {
                //"techOrder": ["flash","html"],
                "autoplay": false,
                //"poster": $scope.posterImg,

            });
            $scope.playBool = true
            playerPre.src($rootScope.address + videoPath);
            //playerPre.poster($scope.posterImg);
            playerPre.pause();
        };

        //播放器2
        var playerPre1 = {};
        $scope.playBool1 = false

        $scope.openOtherPlay1 = function (imgPath, videoPath) {
            $('.video-jsPre3').attr('id','c'+parseInt(Math.random()*200))
            var videoId2 = $('.video-jsPre3').attr('id')
            //$scope.posterImg1 = $rootScope.address + imgPath;
            playerPre1 = videojs(videoId2, {
                //"techOrder": ["flash","html"],
                "autoplay": false,
                //"poster": $scope.posterImg1,

            });
            $scope.playBool1 = true
            playerPre1.src($rootScope.address + videoPath);
            //playerPre1.poster($scope.posterImg1);
            playerPre1.pause()

        };
        //预览
        $scope.openPlay = function (src) {
            $('#videoMask').fadeIn(200);
            $('#preview').fadeIn(200);
            $scope.newOpenPlayImg = src
            $scope.$emit('to-parentImg',$scope.newOpenPlayImg)
            //console.log(123213)
        }
        //关闭预览
        $scope.closePlay = function(){
            $('#videoMask').fadeOut(200);
            $('#preview').fadeOut(200);
        }
        //换type
        $scope.changeScreenType = function(num){
            $scope.screenType = num
            if($scope.playBool1){
                playerPre1.pause();
            }
        }

        //查询素材
        //预览
        $scope.query = function (screenNum,fileUid) {
            console.log(fileUid);
            var $com = $resource($scope.app.host +
                "/api/mps-filemanager/file/:fileUid/preview", {
                taskId: '@fileUid'
            });
            $com.get({ fileUid: fileUid},
                function (data) {
                    if(screenNum == 1){
                        $scope.screen1 = true;
                        if(orderType){
                            $('.order-video1').fadeIn(200);
                            $scope.openOtherPlay(data.message[0].picPath,data.message[0].videoPath)
                        }else{
                            $scope.gameType = true
                            $scope.gameName = data.message[0].name
                        }
                        //去除相同位置的素材
                        if($scope.data.fileInfo.length > 0 ){
                            for(var i=$scope.data.fileInfo.length - 1;i>=0;i--) {
                                if($scope.data.fileInfo[i].deviceType == 1) {
                                    $scope.data.fileInfo.splice(i,1);
                                }
                            }
                        }
                        //显示大屏的游戏界面
                        $scope.screen1Pic =$rootScope.address + data.message[0].picPath
                        if(!$scope.gameOrVideo) {
                            $scope.data.fileInfo.push({

                                "deviceType" : 1,
                                "fileId" : fileUid,
                                "format":"game"
                            });
                        } else {
                            $scope.data.fileInfo.push({
                                "deviceType" : 1,
                                "fileId" : fileUid,
                                "format":"video"
                            });
                        }

                        //console.log($scope.data.fileInfo);
                        videoCode1 = data.code
                        console.log(videoCode1);
                    }else if(screenNum == 3){
                        $scope.screen7 = true;
                        $('.order-video2').fadeIn(200);
                        $scope.openOtherPlay1(data.message[0].picPath,data.message[0].videoPath)
                        //去除相同位置的素材
                        if($scope.data.fileInfo.length > 0 ){
                            for(var i=$scope.data.fileInfo.length - 1;i>=0;i--) {
                                if($scope.data.fileInfo[i].deviceType == 3) {
                                    $scope.data.fileInfo.splice(i,1);
                                }
                            }
                        }
                        //if(!$scope.gameOrVideo) {
                        //    $scope.data.fileInfo.push({
                        //
                        //        "deviceType" : 3,
                        //        "fileId" : fileUid,
                        //        "format":"game"
                        //    });
                        //} else {
                            $scope.data.fileInfo.push({
                                "deviceType" : 3,
                                "fileId" : fileUid,
                                "format":"video"
                            });
                        //}

                        videoCode2 = data.code
                        console.log(videoCode2);
                        //console.log($scope.data.fileInfo);
                    }else if(screenNum == 5){
                        $scope.screen5 = true;
                        $scope.screen5Pic =$rootScope.address + data.message[0].picPath

                        //去除相同位置的素材
                        for(var i=$scope.data.fileInfo.length - 1;i>=0;i--) {
                            if($scope.data.fileInfo[i].deviceType == 2) {
                                $scope.data.fileInfo.splice(i,1);
                            }
                        }
                        //$scope.data.fileInfo[1].fileId = fileUid;
                        $scope.data.fileInfo.push({
                            "deviceType" : 2,
                            "fileId" : fileUid,
                            "format":"picture"
                        });
                    }
                })
        }
        //数据回显
        //console.log(allObj);
        if(!isEmptyObject(allObj.step2) && allObj.step1.pointType == 5){
            $scope.data = allObj.step2
            console.log($scope.data)

            if(allObj.step2.fileInfo.length >0) {
                if(allObj.step2.screenType == 2){
                    // $scope.query(1,$scope.data.fileInfo[0])
                    // $scope.query(5,$scope.data.fileInfo[1].fileId)

                    for(var i=$scope.data.fileInfo.length - 1;i>=0;i--) {
                        if($scope.data.fileInfo[i].deviceType == 1) {
                            $scope.query(1,$scope.data.fileInfo[i].fileId)
                        }
                        if($scope.data.fileInfo[i].deviceType == 2) {
                            $scope.query(5,$scope.data.fileInfo[i].fileId)
                        }
                        if($scope.data.fileInfo[i].deviceType == 3) {
                            $scope.query(3,$scope.data.fileInfo[i].fileId)
                        }
                    }
                    $scope.screenType = 2;
                }else{
                    for(var i=$scope.data.fileInfo.length - 1;i>=0;i--) {
                        if($scope.data.fileInfo[i].deviceType == 1) {
                            $scope.query(1,$scope.data.fileInfo[i].fileId)
                        }
                        if($scope.data.fileInfo[i].deviceType == 2) {
                            //console.log($scope.data.fileInfo[i].fileId);
                            $scope.query(5,$scope.data.fileInfo[i].fileId)
                        }
                        $scope.screenType = 1;
                        //if($scope.data.fileInfo[i].deviceType == 3) {
                        //    $scope.query(3,$scope.data.fileInfo[i].fileId)
                        //}
                        //if($scope.data.fileInfo[i].deviceType == 4) {
                        //    $scope.query(4,$scope.data.fileInfo[i].fileId)
                        //}
                    }
                    // $scope.query(1,$scope.data.fileInfo[0])
                    // $scope.query(2,$scope.data.fileInfo[1].fileId)
                    // $scope.query(3,$scope.data.fileInfo[2].fileId)
                    // $scope.query(4,$scope.data.fileInfo[3].fileId)

                }
            } else {
                $scope.data = {

                    "fileInfo" : [
                        {
                            "deviceType" : 1, //终端类型 1：主屏 2：副屏1 3：副屏2 4：副屏3
                            "fileId" : "", //素材的uid
                            "format":"video" //素材格式
                        },
                        {
                            "deviceType" : 2,
                            "fileId" : "",
                            "format":"picture"
                        },
                        {
                            "deviceType" : 3,
                            "fileId" : "",
                            "format":"picture"
                        },
                        {
                            "deviceType" : 4,
                            "fileId" : "",
                            "format":"picture"
                        }
                    ],
                    "screenType" : 2 //副屏类型 1代表分屏 2代表全屏
                }
                return;
            }
        }


    }])
//添加广告单第三步设置播放
app.controller('addAdOrder3Ctrl' , ['$rootScope','$scope' ,'$q', 'staticData' , '$resource', 'commonService','formatDateService', '$http' , 'dataAccess' ,'$state','checkTimeService','$stateParams',
    function($rootScope ,$scope , $q , staticData , $resource , commonService,formatDateService , $http , dataAccess , $state,checkTimeService,$stateParams){
        //初始化

        $scope.projectName = $stateParams.projectName
        $scope.projectId = $stateParams.projectId
        $scope.projectNum = $stateParams.projectNum

        var i = 0
        $rootScope.condArray = [],
        $rootScope.extra_condition = {}

        $scope.hover = false

        $scope.data = {}
        $scope.data.showCountday = ""
        $scope.data.beginTime = ""
        $scope.data.endTime = ""
        $scope.data.showCountround = 1
        $scope.data.showCountday = 1
        $scope.data.addedInfo = []
        $scope.data.addPlay = 1
            // step3 = {
            //     "addedInfo" : [
            //     {
            //         "countRound" : 1, //每轮加播次数
            //         "timerangeId" : 2 //加播时段Id 
            //     }
            // ],  //加播信息，不加播此字段不传，或者传递null
            // "beginTime" : "2017-12-10", //投放开始时间
            // "endTime" : "2017-12-31",  //投放结束时间
            // "showCountday" : "",      //每日播放次数,不限传""
            // "showCountround" : "2",   //每轮播放次数,不限传""
            // "timerangeIds" : [ 1 ]   //播放时段 1为不限
            // //这是第三步的数据
            // }

        $scope.editMode = false
        $scope.noRepeat = false
        //$scope.timeAllFlag = false //默认为非全选

        $scope.options = {
            locale: 'zh-cn',
            format: 'YYYY/MM/DD',
            showClear: true,
            //minDate: new Date()
        }

        $scope.timeArr = [];
        //$scope.selectAllFlag = false;
        $scope.selectAllTime = function () {
            console.log($("#selectAll").is(':checked'));
            if($("#selectAll").is(':checked')) {
                $scope.timeArr = [];
                for(var i = 0;i <= $scope.times.length - 1; i++) {
                    $scope.timeArr.push($scope.times[i].timerangeid);
                }
                $scope.removeAddClass();

            } else {
                $scope.timeArr = [];
                $(".timeShow").removeClass('active');
            }
        }

        $scope.removeAddClass = function(){
                //重新渲染样式图
                $(".timeShow").removeClass('active');
                for(var j = 0;j <= $scope.timeArr.length - 1; j++) {
                $("#" + $scope.timeArr[j]).addClass("active");
                }
        }

        $scope.queryTime = function () {
            var $com = $resource($scope.app.host + "/api/cinema-adLaunch/getTimerangeList")
            //var defer = $q.defer();
            $com.get(function(res){
                    console.log(res);
                    $scope.times = res.result;
                   //  defer.resolve(res)
                })
              //  return defer.promise
        }

        //搜索时间段
        $scope.queryTime();


        //时间段选择控件
        $scope.operateTimeArr = function (timeId) {
            var timeFlag = true;
            for(var i = 0;i <= $scope.timeArr.length - 1; i++) {
                //console.log($scope.timeArr[i]);
                if($scope.timeArr[i] == timeId) {
                   // console.log('存在不推送');
                    $scope.timeArr.splice(i,1);
                    timeFlag = false;
                }

            }
            if(timeFlag) {
               // console.log('开始推送');
                $scope.timeArr.push(timeId);

            }
                //全选按钮的勾选
                // if($scope.timeArr.length == $scope.times.length) {
                //     $scope.timeAllFlag = true;
                // }else {
                //     $scope.timeAllFlag = false;
                // }
               // $scope.selectedAll();
            //console.log($scope.timeArr);
            //重新渲染样式图
            $scope.removeAddClass();
           console.log($scope.timeArr);
        }


        $scope.selectedChecked = function (timeId) {
            return  $scope.timeArr.indexOf(timeId) >= 0 ? true:false;
        }

        $scope.timeOption = {
            locale: 'zh-cn',
            format: 'HH:mm',
            showClear: true,
        }

        $scope.data['timeLine'] = '1'
        $scope.data['playTimes'] = '1'

        $scope.returnBack = function () {
            history.back();
        }

        $scope.backStep = function(){
            history.back();
        }

        $scope.noRepeat = false

        //每次进入页面从缓存取数据
        var allObj = dataAccess.sessionGet('allObj')

        $scope.gameOrVideo = allObj.step1.billType //1 ：视频 2：游戏

        if($scope.gameOrVideo == 2) {
            if(!allObj.step3.timerangeIds) {
                $scope.timeArr = [];
                $(".timeShow").removeClass('active');
            } else {
               $scope.timeArr  = allObj.step3.timerangeIds;
            }
           $scope.addedInfo = []
        }

        //获取素材时长
        $scope.queryMediaLength = function(fileId){
            var $com = $resource($scope.app.host + '/api/cinema-adLaunch/adBill/getFileDuration/:fileId',{fileId:'@fileId'})
            $com.save({fileId:fileId},function(res){
                $scope.data.fileDuration = res.fileDuration
            })
        }
        // if(allObj.step2.fileInfo[0].fileId) {
        //     $scope.queryMediaLength(allObj.step2.fileInfo[0].fileId)
        // }
        if(allObj.step2.fileInfo.length > 0) {
            for(var i=0;i<=allObj.step2.fileInfo.length - 1;i++) {
                if(allObj.step2.fileInfo[i].deviceType == "1") {
                    if(allObj.step2.fileInfo[i].fileId) {
                        $scope.queryMediaLength(allObj.step2.fileInfo[i].fileId)
                    }
                }
            }
        }

        if($stateParams.addFlag=='newAdd' || $stateParams.addFlag=='0') {
            $scope.showButton = true;
        } else {
            $scope.showButton = false;
        }

        if($stateParams.addFlag=='newAdd') {
            $scope.timeArr = [];
        } else if($stateParams.addFlag==0){
            //如果step3数据对象存在，则为编辑模式
            if(allObj.step3.beginTime){
                //编辑模式数据预处理
                $scope.editMode = true
                $scope.data = allObj.step3
                $scope.data.fromDate = allObj.step3.beginTime
                $scope.data.endDate = allObj.step3.endTime
                $scope.timeArr = []; 


                //单选状态处理赋值
                allObj.step3.showCountday == ""?$scope.data.playTimes = "1":$scope.data.playTimes = "2"
                $scope.data.timeLine = 1;
                //allObj.step3.showTimes[0] == ""?$scope.data.timeLine = "1":$scope.data.timeLine = "2"

                //时间段控件赋值
                //var arr = allObj.step3.showTimes

                //$scope.data.fromTime = allObj.step3.showTimes[0].split("-")[0]
                //$scope.data.finishTime = allObj.step3.showTimes[0].split("-")[1]
            }

                if(allObj.step3.addedInfo) {
                    $scope.data.addPlay = 2
                    $scope.data.addPlayTime =  allObj.step3.addedInfo[0].countRound
                    for(var j = 0; j <= allObj.step3.addedInfo.length - 1;j++) {
                        $scope.timeArr.push(allObj.step3.addedInfo[j].timerangeId);
                    }
                    $scope.removeAddClass();
                } else {
                    $scope.data.addPlay = 1
                    allObj.step3.addedInfo = []
                }

                if(!!allObj.step3.timerangeIds) {
                    $scope.timeArr = allObj.step3.timerangeIds
                } else {
                    allObj.step3.timerangeIds = []
                    //$scope.timeArr = []
                    if($scope.gameOrVideo == 2) {
                        $scope.timeArr = []
                    }
                }

        } else {
                $scope.editMode = true
                $scope.data = allObj.step3
                $scope.data.fromDate = allObj.step3.beginTime
                $scope.data.endDate = allObj.step3.endTime

                $scope.timeArr = []; 
                if($scope.gameOrVideo == 1 && $scope.data.addPlay == 2) {
                    for(var j = 0; j <= allObj.step3.addedInfo.length - 1;j++) {
                        $scope.timeArr.push(allObj.step3.addedInfo[j].timerangeId);
                    // console.log($scope.timeArr);
                    }
                } else if($scope.gameOrVideo == 2 && allObj.step3.timerangeIds){
                    $scope.timeArr = allObj.step3.timerangeIds
                }

                $scope.removeAddClass();
                //单选状态处理赋值
                allObj.step3.showCountday == ""?$scope.data.playTimes = "1":$scope.data.playTimes = "2"
                $scope.data.timeLine = 1;
                if(allObj.step3.addedInfo) {
                    $scope.data.addPlay = 2
                    $scope.data.addPlayTime =  allObj.step3.addedInfo[0].countRound
                    //$scope.data.addPlayTime =  allObj.step3.addedInfo[0].countRound
                    for(var j = 0; j <= allObj.step3.addedInfo.length - 1;j++) {
                        $scope.timeArr.push(allObj.step3.addedInfo[j].timerangeId);
                    }
                    $scope.removeAddClass();
                } else {
                    $scope.data.addPlay = 1                    
                }
                //allObj.step3.showTimes[0] == ""?$scope.data.timeLine = "1":$scope.data.timeLine = "2"
        }

        $scope.selectedAll = function () {
            return parseInt($scope.timeArr.length) === parseInt($scope.times.length);
        }

        $scope.addInfo = function (allObj , operate , draftId) {
            //console.log($scope.data.beginTime._d + $scope.data.beginTime._d);
            if($scope.data.fromDate !== undefined && $scope.data.endDate !== undefined) {
            var startDate,
                endDate
            $scope.noRepeat = true
            $scope.data.beginTime = formatDateService.getDate($scope.data.fromDate._d)
            $scope.data.endTime = formatDateService.getDate($scope.data.endDate._d)

            startDate = checkTimeService.dateFormat($scope.data.beginTime)
            endDate = checkTimeService.dateFormat($scope.data.endTime)

            if(startDate - endDate <= 0){
                //if($scope.data.timeLine == "2"){
                //    //获取基础项
                //    var firstCond = formatDateService.formatTime($scope.data.fromTime._d)+'-'+formatDateService.formatTime($scope.data.finishTime._d)
                //    //提交数组
                //    var extraTimeLineArr = []
                //    extraTimeLineArr.push(firstCond)
                //    angular.forEach($rootScope.extra_condition, function (value, index) {
                //        extraTimeLineArr.push(value)
                //    })
                //    $scope.data.showTimes = extraTimeLineArr
                //}

                //组装sendObj
                //判断是否为不限


            } else {
                commonService.ctrlError('操作','起始日期不可大于结束日期')
                $scope.noRepeat = false
                return;
            } 
            } else {
                $scope.data.beginTime = '';
                $scope.data.endDate = '';
            }

            if($scope.data.timeLine == "1"){
                    //$scope.data.showTimes = []
                }
                if($scope.data.playTimes == "1"){
                    $scope.data.showCountday = ""
                }

                if($scope.data.addPlay == "1") {
                    $scope.data.addedInfo = []
                        if($scope.gameOrVideo == 2) {
                            $scope.data.timerangeIds = $scope.timeArr;
                        }
                        
                } else {
                    $scope.data.addedInfo = []
                    for(var i = 0;i <= $scope.timeArr.length - 1; i++) {
                        $scope.data.addedInfo.push({
                           "countRound" : $scope.data.addPlayTime,
                            "timerangeId" : $scope.timeArr[i]
                        });
                    }
                    // $scope.data.addedInfo = [
                    //     {
                    //         "countRound" : $scope.data.addPlayTime, //每轮加播次数
                    //         //"timerangeId" : 4 //加播时段Id
                    //         "timerangeId" : $scope.timeArr //加播时段Id
                    //     }
                    // ]
                }

                allObj.step3 = $scope.data

                var $com = $resource(staticData.hostUrl + '/api/cinema-adLaunch/adBill?operate=:operate&draftId=:draftId',{
                    operate:'@operate',
                    draftId:'@draftId'
                })
                $com.save({operate:operate,draftId:draftId} , allObj , function(res){
                    if(res.success){
                        if(operate == "draft") {
                            commonService.ctrlSuccess('保存草稿');
                            dataAccess.sessionRemove('allObj')
                            $state.go('app.order.adOrderList',{deviceId: $stateParams.projectId})
                        } else {
                            commonService.ctrlModal('waitCheckType').result.then(function(){
                            $state.go('app.order.checkSheetList')
                            dataAccess.sessionRemove('allObj')
                           })
                        }

                        
                        //commonService.ctrlSuccess('添加');
                        //$state.go('app.order.addAdOrder2',{addFlag:$stateParams.addFlag});
                            //dataAccess.sessionSave('allObj',allObj)
                            //dataAccess.sessionRemove('allObj')
                            //commonService.ctrlSuccess('保存草稿');
                            //commonService.ctrlModal('waitCheckType').result.then(function(){
                            //$state.go('app.order.checkSheetList')
                           // })
                        //$modalInstance.close()
                    }else{
                        commonService.ctrlError('保存草稿', res.message)
                        //$scope.noRepeat = false
                    }
                })
        }

        //添加新时段
        $scope.addCondtion = function () {
            //此处计数器i为了保证删除后i一致
            if($rootScope.i >= 0){
                i = $rootScope.i
                console.log(i)
            }
            //设置最多添加多少条数据
            if(i<4){
                var condObj = { id: i }
                $rootScope.condArray.push(condObj)

                $scope.condArray = $rootScope.condArray

                i++
                $rootScope.i = i
            }else {
                alert('最多只能设置5条数据')
            }
        }

        $scope.commitInfo = function () {
            $scope.addInfo(allObj,'draft',allObj.step1.billId);
        }

        //每日播放次数改变每轮播放次数
        $scope.changeShowCountround = function (type,num) {

            if(!isNaN(num)) {
            var $com = $resource(staticData.hostUrl + '/api/cinema-adLaunch/:count/getCountRoundOrDay?type=:type' , {count:'@count',type:'@type'})
            $com.get({count:num,type:type} , function(res){
                if(res.success) {
                    if(type == 'countRound') {
                        $scope.data.showCountday = res.message
                    } else {
                        $scope.data.showCountround = res.message
                    }
                } else {
                    commonService.ctrlError('操作',res.message)
                }

            })
            } 
        }

        $scope.submit = function(saveWay){ //是存为草稿还是存为广告单
            if(!$scope.data.fromDate || !$scope.data.endDate){
                commonService.ctrlError('操作','请填写日期')
                $scope.noRepeat = false
            }
            var startDate,
                endDate
            $scope.noRepeat = true
            $scope.data.beginTime = formatDateService.getDate($scope.data.fromDate._d)
            $scope.data.endTime = formatDateService.getDate($scope.data.endDate._d)

            startDate = checkTimeService.dateFormat($scope.data.beginTime)
            endDate = checkTimeService.dateFormat($scope.data.endTime)

            console.log($scope.data);
            console.log(startDate);

            var now = new Date();
            var year = now.getFullYear();       //年
            var month = now.getMonth() + 1;     //月
            var day = now.getDate();            //日
            var currentData = year + '-' + month + '-' + day;

            var currentDataChange = checkTimeService.dateFormat(currentData)

            if(startDate - currentDataChange < 0) {
                commonService.ctrlError('操作','起始日期需要大于等于今天日期')
                return;
            }

            if(startDate - endDate <= 0){
                //if($scope.data.timeLine == "2"){
                //    //获取基础项
                //    var firstCond = formatDateService.formatTime($scope.data.fromTime._d)+'-'+formatDateService.formatTime($scope.data.finishTime._d)
                //    //提交数组
                //    var extraTimeLineArr = []
                //    extraTimeLineArr.push(firstCond)
                //    angular.forEach($rootScope.extra_condition, function (value, index) {
                //        extraTimeLineArr.push(value)
                //    })
                //    $scope.data.showTimes = extraTimeLineArr
                //}

                //组装sendObj
                //判断是否为不限
                if($scope.data.timeLine == "1"){
                    //$scope.data.showTimes = []
                }
                if($scope.data.playTimes == "1"){
                    $scope.data.showCountday = ""
                }

                if($scope.data.addPlay == "1") {
                    $scope.data.addedInfo = []
                    if($scope.gameOrVideo == 2) {
                        $scope.data.timerangeIds = $scope.timeArr;
                    }

                } else {
                    // $scope.data.addedInfo = [
                    //     {
                    //         "countRound" : $scope.data.addPlayTime, //每轮加播次数
                    //         "timerangeId" : 4 //加播时段Id
                    //     }
                    // ]
                    $scope.data.addedInfo = []
                    for(var i = 0;i <= $scope.timeArr.length - 1; i++) {
                        $scope.data.addedInfo.push({
                           "countRound" : $scope.data.addPlayTime,
                            "timerangeId" : $scope.timeArr[i]
                        });
                    }
                }

                if($scope.gameOrVideo == 2) {
                        $scope.data.timerangeIds = $scope.timeArr;
                        if($scope.timeArr.length <= 0) {
                            commonService.ctrlError('操作','请至少选择一个时间段');
                            return;
                        }
                    }

                if($scope.data.addPlay == 2 && $scope.gameOrVideo == 1) {
                        if($scope.timeArr.length <= 0) {
                            commonService.ctrlError('操作','请至少选择一个时间段');
                            return;
                        }
                }


                if(allObj.step2.screenType == 2 && (allObj.step1.pointType == 2 || allObj.step1.pointType == 3)) {
                    if(allObj.step2.fileInfo.length < 2){
                        commonService.ctrlError('操作','请返回上一步先选择素材');
                        return;
                    }
                }

                if(allObj.step2.screenType == 1 && (allObj.step1.pointType == 2 || allObj.step1.pointType == 3)) {
                    if(allObj.step2.fileInfo.length < 4){
                        commonService.ctrlError('操作','请返回上一步先选择素材');
                        return;
                    }                 
                }

                if(allObj.step1.pointType == 1 || allObj.step1.pointType == 4) {
                    if(allObj.step2.fileInfo.length < 1){
                        commonService.ctrlError('操作','请返回上一步先选择素材');
                        return;
                    }                 
                }
                allObj.step3 = $scope.data

                //存为草稿
                // if(saveWay == 'draft') {
                //     $scope.addInfo(allObj,'draft',allObj.step1.billId);
                //     return;
                // }

                //提交广告单
                //编辑模式
                //if($scope.editMode){

                   // if($stateParams.addFlag == "0" || $stateParams.addFlag == "newAdd") {
                    if($stateParams.addFlag == "newAdd") {
                        $scope.addInfo(allObj,'add',allObj.step1.billId);
                    } else {
                        if(parseInt($stateParams.addFlag) == 0) {
                            allObj.isDraft = true;
                        } else {
                            allObj.isDraft = false;
                        }
                        var promise = $http({
                            method: 'put',
                            url: $scope.app.host + '/api/cinema-adLaunch/adBill',
                            data: allObj
                        })

                        promise.then(function (res) {

                            if(res.data.success){
                                //commonService.ctrlSuccess('编辑')
                                dataAccess.sessionRemove('allObj')
                                commonService.ctrlModal('waitCheckType').result.then(function(){
                                    $state.go('app.order.checkSheetList')
                                })
                            }else {
                                commonService.ctrlError('编辑', res.data.message)
                                $scope.noRepeat = false
                            }
                        })
                    }



                //}else {
                    // var $com = $resource($scope.app.host + '/api/cinema-adLaunch/adBill')

                    // $com.save({} , allObj , function(res){

                    //     if(res.success){
                    //         //commonService.ctrlSuccess('新建')
                    //         dataAccess.sessionRemove('allObj')
                    //         commonService.ctrlModal('waitCheckType').result.then(function(){
                    //             $state.go('app.order.checkSheetList')
                    //         })
                    //     }else {
                    //         commonService.ctrlError('新建', res.msg)
                    //         $scope.noRepeat = false
                    //     }
                    // })
                    //$scope.addInfo(allObj,'add',allObj.step1.billId);
                //}
            }else {
                commonService.ctrlError('操作','起始日期不可大于结束日期')
                $scope.noRepeat = false
            }
        }
    }])

//排期表
app.controller('adPlayListCtrl' , ['$scope' , 'staticData' , '$resource', 'commonService','$http','$stateParams','adService',
    function($scope , staticData , $resource , commonService ,$http,$stateParams,adService){

        $scope.statId = $stateParams.id
        $scope.name = $stateParams.name
        //console.log($scope.statId)
        //$scope.datas1 = {
        //    "error" : "",
        //    "pageNo" : 1,
        //    "pageSize" : 15,
        //    "pages" : 1,
        //    "result" : [
        //        {
        //            "data" : [
        //                [ 1, 2 ],
        //                [ 2, 2 ],
        //                [ 2 ],
        //                [ 8, 20 ],
        //                [ 8, 20 ],
        //                 [ 8, 20 ],
        //                 [ 8, 20 ],
        //                 [ 8, 20 ],
        //                [ 8, 20 ],
        //                 [ 8, 20 ],
        //                 [ 8, 20 ],
        //                 [ 20 ],
        //                 [ 20 ],
        //                 [ 20 ],
        //                 [ 20 ],
        //                 [ 20 ],
        //                 [ 20 ],
        //                 [ 20 ],
        //                 [ 20 ],
        //                 [ 20 ],
        //                 [ 20 ],
        //                [ 20 ],
        //                 [ 20 ],
        //                 [ 20 ],
        //                 [ 20 ],
        //                 [ 20 ],
        //                 [ 20 ],
        //                 [ 20 ],
        //                 [ 20 ],
        //                 [ 20 ]
        //            ],
        //            "pointId" : "12312312",
        //            "pointName" : "qweqwewqe",
        //            "pointType" : "2"
        //        },
        //        {
        //            "data" : [
        //                [ 1, 2 ],
        //                [ 2, 2 ],
        //                [ 2 ],
        //                [ 8, 20 ],
        //                [ 8, 20 ],
        //                [ 8, 20 ],
        //                [ 8, 20 ],
        //                [ 8, 20 ],
        //                [ 8, 20 ],
        //                [ 8, 20 ],
        //                [ 8, 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ]
        //            ],
        //            "pointId" : "12312312",
        //            "pointName" : "aaaaaaaaaa",
        //            "pointType" : "3"
        //        },
        //        {
        //            "data" : [
        //                [ 1, 2 ],
        //                [ 2, 2 ],
        //                [ 2 ],
        //                [ 8, 20 ],
        //                [ 8, 20 ],
        //                [ 8, 20 ],
        //                [ 8, 20 ],
        //                [ 8, 20 ],
        //                [ 8, 20 ],
        //                [ 8, 20 ],
        //                [ 8, 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ],
        //                [ 20 ]
        //            ],
        //            "pointId" : "12312312",
        //            "pointName" : "bbbbbbbb",
        //            "pointType" : "1"
        //        }
        //    ],
        //    "success" : true,
        //    "total" : 1
        //}
        //$scope.datas = $scope.datas1.result
        //console.log($scope.datas)

        //时间插件
        $scope.logSearchCond = staticData.logSearchCond
        $scope.fromDate = undefined
        $scope.fromHour = undefined
        $scope.fromMin = undefined

        $scope.option1 = {
            locale: 'zh-cn',
            format: 'YYYY-MM'
            //showClear: true,
            //minDate: '2017-11-01'

        }
        $scope.fromDate = new Date()

        //查询
        $scope.query = function(billId , date , pageNo , pageSize){
            var $com = $resource($scope.app.host + '/api/cinema-adLaunch/adBill/getSchedule/:billId/:date?pageNo=:pageNo&pageSize=:pageSize',{
                billId : '@billId',date:'@date' , pageNo : '@pageNo' , pageSize:'@pageSize'
            })
            $com.get({billId : billId,date:date , pageNo : pageNo , pageSize:pageSize},function(res){
                if(res){
                    $scope.datas = res.dataList
                    console.log( $scope.datas)
                    $scope.totalItems =   res.dataList.total
                    $scope.numPages = res.dataList.pages
                    $scope.currentPage = res.dataList.pageNo
                }
            })
        }
        //$scope.query($scope.statId , ' ' , ' ' , 1 , 20)
        //$scope.datas =[]
        //条件搜索e
        $scope.search = function(fromDate , pageNo , pageSize){
            if(fromDate){
                var fromDate = $scope.fromDate._d
                //console.log($scope.fromDate._d)
                var fromDateTrans = adService.getMoth(fromDate)
                //console.log(fromDateTrans)
                $scope.query($scope.statId , fromDateTrans, pageNo , pageSize)
            }

        }
        //$scope.search($scope.fromDate , 1 , 20)

        $scope.return = function(){
            history.back();
        }

    }])