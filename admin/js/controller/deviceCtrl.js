/**
 * Created by chenqi1 on 2017/7/19.
 */

//设备模块控制器
app.controller('deviceListCtrl', ['$scope', '$rootScope', '$http', '$resource', '$state', '$timeout', '$interval' , 'selectService', 'commonService', 'deviceService','checkBtnService', 'staticData',

    function ($scope, $rootScope, $http, $resource, $state, $timeout, $interval , selectService, commonService, deviceService,checkBtnService , staticData) {

        //初始化多选组价
        var SelectedArr = []
        $scope.deviceSelectedArr = SelectedArr

        //设备状态选项绑定
        $scope.stateGroup = staticData.deviceState

        //城市json数据获取
        $http.get('admin/js/cityList.json').success(function(data) {
            $scope.cityGroup = data
        });



        $scope.query = function (name, province , state , pageNo, pageSize) {

            var $com = $resource($scope.app.host +
                "/api/mps-device/mpsDevice?province=:province&deviceName=:name&state=:state&pageNo=:pageNo&pageSize=:pageSize", {
                name: '@name',
                province: '@province',
                state: '@state',
                pageNo: '@pageNo',
                pageSize: '@pageSize'
            });

            $com.get({ name: name, province: province , state: state , pageNo: pageNo, pageSize: pageSize },
                function (data) {
                    $scope.datas = data.results
                    $scope.deviceList = data.results
                })
        }

        $scope.query()

        //监听按键
        $scope.search = function (name, e, pageNo, pageSize) {
            if (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    $scope.query(name, pageNo, pageSize)
                }
            }else{
                $scope.query(name, pageNo, pageSize)
            }
        }

        //点击新建按钮触发弹框
        $scope.addProgram = function () {
            checkBtnService.check("/api/mps-materialList/materialList",'POST').then(function(){
                commonService.addPro()
            })

        }

        //删除操作
        $scope.delete = function (data) {
            //检查删除权限
            //checkBtnService.check("/api/mps-device/mpsDevice",'put').then(function(){
                //获取删除项对象集合
                var sendObj = deviceService.getSelectedDevice(data, $scope.datas)
                if (sendObj.deviceIdList.length == 0) {
                    commonService.ctrlError('操作', '请先选择设备')
                } else {
                    commonService.ctrlModal("deleteDeviceType").result.then(function () {

                        var promise = $http({
                            method: 'put',
                            url: $scope.app.host + '/api/mps-device/mpsDevice',
                            data: sendObj
                        })

                        promise.then(function (res) {
                            res.data.success ?
                                commonService.ctrlSuccess('删除') :
                                commonService.ctrlError('删除', res.msg)
                            $scope.query()
                            $scope.keyword = ''
                        })
                    })
                }

            //})
        }

        //select相关操作的方法绑定
        $scope.updateSelection = selectService.updateSelection
        $scope.selectAll = selectService.selectAll
        $scope.isSelected = selectService.isSelected
        $scope.isSelectedAll = selectService.isSelectedAll

        //设备定时模态框
        $scope.setTime = function(id){

            //查询接口查看该设备是否已有定时任务
            $scope.querySetTime = function(deviceId){
                var $com = $resource($scope.app.host +
                    "/api/mps-device/device/timeswitch/:deviceId", {
                    deviceId: '@deviceId'
                });

                $com.get({deviceId:deviceId},
                    function (data) {
                        data.success?commonService.setTime(id,data.data):commonService.tipModal('serverErrorType')

                    })
            }
            $scope.querySetTime(id)
        }

        //临时接口（开机）
        $scope.deviceOn = function(deviceId){

            var sendObj = {}
            sendObj.deviceId = deviceId

            //正常对象
            var $comUpdate = $resource($scope.app.host + "/api/mps-device/device/open/:deviceId",{deviceId:'@deviceId'},{
                'update': { method:'PUT' }
            });

            $comUpdate.update({deviceId:deviceId},sendObj,function(res){
                res.success?
                    commonService.ctrlSuccess('操作',res.message):
                    commonService.ctrlError('操作')
                $scope.query()
            });
        }

        //临时接口（关机）
        $scope.deviceOff = function(deviceId){

            var sendObj = {}
            sendObj.deviceId = deviceId

            //正常对象
            var $comUpdate = $resource($scope.app.host + "/api/mps-device/device/close/:deviceId",{deviceId:'@deviceId'},{
                'update': { method:'PUT' }
            });

            $comUpdate.update({deviceId:deviceId},sendObj,function(res){
                res.success?
                    commonService.ctrlSuccess('操作',res.message):
                    commonService.ctrlError('操作')
                $scope.query()
            });
        }

        //每隔0.5s进行请求刷新
        $scope.refresh = function(taskId , deviceId , data){

            var $com = $resource($scope.app.host + '/api/mps-device/device/taskstate/:taskId',{taskId:'@taskId'})

            $com.get({taskId:taskId} , function(res){
                if(res.success){
                    if(res.code == 'opened' || res.code =='closed'){

                        $scope.onLoading = false
                        res.code == 'opened'?
                            commonService.ctrlSuccess('开机') :
                            commonService.ctrlSuccess('关机')

                        $scope.query()
                    }else if(res.code == 'upload_success'){
                        $scope.onLoading = false
                        //截图成功，打开截图模态框
                        commonService.showSS(deviceId , res.data.md5 , data)
                    }
                    else {
                        $timeout(function(){
                            $scope.refresh(taskId , deviceId , data)
                        },500)
                    }
                }else {
                    $scope.onLoading = false
                    commonService.ctrlError('操作',res.message)
                    $scope.query()
                }
            })
        }




        // switch模式下的开关机
        //$scope.onOff = function(deviceId , state){
        //
        //    $scope.onLoading = true
        //
        //    var sendObj = {}
        //    sendObj.deviceId = deviceId
        //
        //    if(state == '已关机'){
        //
        //        //正常对象
        //        //var $comUpdate = $resource($scope.app.host + "/api/mps-device/device/open/:deviceId",{deviceId:'@deviceId'},{
        //        //    'update': { method:'PUT' }
        //        //});
        //
        //        //测试对象
        //        var $com = $resource($scope.app.host + "/api/mps-device/device/open/:deviceId",{deviceId:'@deviceId'})
        //        //测试过程
        //
        //        //定时请求定时器
        //        //var timer = $interval(function(){
        //            refresh($com , sendObj)
        //        //},500)
        //
        //    }else if (state == '在线'){
        //
        //        //正常对象
        //        //var $comUpdate = $resource($scope.app.host + "/api/mps-device/device/cloes/:deviceId",{deviceId:'@deviceId'},{
        //        //    'update': { method:'PUT' }
        //        //});
        //
        //        //测试对象
        //        var $com = $resource($scope.app.host + "/api/mps-device/device/close/:deviceId",{deviceId:'@deviceId'})
        //        //测试过程
        //
        //        //定时请求定时器
        //        //var timer = $interval(function(){
        //            refresh($com , sendObj)
        //        //},500)
        //
        //    }
        //}


        //打开查看截图模态框
        $scope.showSS = function(deviceId , data){
            $scope.onLoading = true

            //先请求截图接口，终端开始截图
            var sendObj = {}
            sendObj.deviceId = deviceId

            var $com = $resource($scope.app.host + "/api/mps-device/device/screenshot/:deviceId",{deviceId:'@deviceId'})
            $com.save({} , sendObj , function(res){
                res.success?
                    $scope.refresh(res.data.taskId , deviceId , data):
                    commonService.ctrlError('操作',res.message)
                $scope.query()

            })
        }
    }])


//添加设备控制器
app.controller('addDeviceCtrl', ['$scope', '$rootScope', '$http', '$resource', '$state', '$timeout', 'selectService', 'commonService', 'deviceService','checkBtnService', 'staticData',

    function ($scope, $rootScope, $http, $resource, $state, $timeout, selectService, commonService, deviceService,checkBtnService , staticData) {

        //初始化多选组价
        var SelectedArr = []
        $scope.deviceSelectedArr = SelectedArr

        //设备状态选项绑定
        $scope.stateGroup = staticData.deviceState

        //城市json数据获取
        $http.get('admin/js/cityList.json').success(function(data) {
            $scope.cityGroup = data
        });

        $scope.query = function (name, city , pageNo, pageSize) {

            var $com = $resource($scope.app.host +
                "/api/mps-device/usefulDevice?province=:city&deviceName=:name&pageNo=&pageSize=", {
                name: '@name',
                city: '@city',
                pageNo: '@pageNo',
                pageSize: '@pageSize'
            });

            $com.get({ name: name, city: city , pageNo: pageNo, pageSize: pageSize },
                function (data) {
                    $scope.datas = data.results
                    $scope.deviceList = data.results
                })
        }

        $scope.query()

        //监听按键
        $scope.search = function (name, e, pageNo, pageSize) {
            if (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    $scope.query(name, pageNo, pageSize)
                }
            }
        }


        //添加操作
        $scope.addDevice = function (data) {
            //检查删除权限
            //checkBtnService.check("/api/mps-device/mpsDevice",'put').then(function(){
            //获取删除项对象集合
            var sendObj = deviceService.getAddDevice(data, $scope.datas)

            console.log(sendObj)
            if (sendObj.deviceList.length == 0) {
                commonService.ctrlError('操作', '请先选择设备')
            } else {
                commonService.ctrlModal("addDeviceType").result.then(function () {

                    var promise = $http({
                        method: 'post',
                        url: $scope.app.host + '/api/mps-device/device',
                        data: sendObj
                    })

                    promise.then(function (res) {
                        res.data.success ?
                            commonService.ctrlSuccess('添加') :
                            commonService.ctrlError('添加', res.msg)
                        $scope.query()
                    })
                })
            }

            //})
        }

        //select相关操作的方法绑定
        $scope.updateSelection = selectService.updateSelection
        $scope.selectAll = selectService.selectAll
        $scope.isSelected = selectService.isSelected
        $scope.isSelectedAll = selectService.isSelectedAll



    }])


//设备定时模态框控制器
app.controller('setTimeCtrl', ['$scope', '$modalInstance', '$resource', '$state', 'commonService', 'staticData','info','checkTimeService','formatDateService',
    function ($scope, $modalInstance, $resource, $state, commonService, staticData , info , checkTimeService,formatDateService) {

        var hostUrl = staticData.hostUrl
        var sendObj = {}
        //已设置时间数据
        var timeSetData = info.data
        sendObj.deviceId = info.id

        $scope.deviceId = info.id
        $scope.data = {}
        $scope.data.startDate = undefined
        $scope.data.endDate = undefined
        $scope.options = {
            locale: 'zh-cn',
            format: 'YYYY/MM/DD',
            showClear: true,
            minDate: new Date()
        }

//编辑模式检查各属性赋值情况
        if(Boolean(timeSetData)){
        //检查可选项赋值
            timeSetData.daily?$scope.data["daily"] = '1':$scope.data["daily"] = ''
            //日历插件赋值
            $scope.data = timeSetData
            //时间输入赋值
            $scope.data.openTime = checkTimeService.getModelTime(timeSetData.openTime)
            $scope.data.closeTime = checkTimeService.getModelTime(timeSetData.closeTime)
        }else {
            //必选
            $scope.data["daily"] = '1'
        }


    //提交校验逻辑
        $scope.doSubmit = function(deviceId){

            //时间输入合法标识符
            var timeComplete = false
            //时间格式合法标识符
            var timeCheck= false
            //日期格式合法标识符
            var dateCheck = false


            if($scope.data.openTime && $scope.data.closeTime){
                if($scope.data.openTime.length == 4 && $scope.data.closeTime.length == 4){
                    timeComplete = true
                    if( !checkTimeService.checkTime($scope.data.openTime) && !checkTimeService.checkTime($scope.data.closeTime)){
                        timeCheck = true
                            sendObj.openTime = checkTimeService.getSendTime($scope.data.openTime)
                            sendObj.closeTime = checkTimeService.getSendTime($scope.data.closeTime)

                    }
                }
            }

            sendObj.daily = Boolean($scope.data.daily)

            if($scope.data.startDate && $scope.data.endDate){

                if( formatDateService.getDate($scope.data.startDate._d) <= formatDateService.getDate($scope.data.endDate._d)){
                    dateCheck = true
                    sendObj.startDate = formatDateService.getDate($scope.data.startDate._d)
                    sendObj.endDate   = formatDateService.getDate($scope.data.endDate._d)
                }
            }


            //正常流程
            var $comUpdate = $resource(hostUrl + "/api/mps-device/device/timeswitch/:deviceId",{deviceId:'@deviceId'},{
                'update': { method:'PUT' }
            });

            //校验输入完整性和合法性并提示
            if(timeComplete){
                if(timeCheck){
                    if( sendObj.daily ){
                        $comUpdate.update({deviceId:deviceId},sendObj,function(res){
                            res.success ?
                                commonService.ctrlSuccess('保存') :
                                commonService.ctrlError('保存', res.msg)
                            $modalInstance.close();
                        });
                    }else {
                        if(dateCheck){
                            $comUpdate.update({deviceId:deviceId},sendObj,function(res){
                                res.success ?
                                    commonService.ctrlSuccess('保存') :
                                    commonService.ctrlError('保存', res.msg)
                                $modalInstance.close();
                            });
                        }else {
                            commonService.ctrlError('操作','请选择正确的日期')
                        }
                    }
                }else {
                    commonService.ctrlError('操作','时间格式有误')
                }
            }else {
                commonService.ctrlError('操作','时间字段未完整填写')
            }


            ////测试流程
            //var $com = $resource(hostUrl + "/api/mps-device/device/timeswitch/:deviceId",{deviceId:'@deviceId'})
            //
            ////校验输入完整性和合法性并提示
            //if(timeComplete){
            //    if(timeCheck){
            //        if( sendObj.daily ){
            //            $com.save({},sendObj,function(res){
            //                res.success ?
            //                    commonService.ctrlSuccess('保存') :
            //                    commonService.ctrlError('保存', res.msg)
            //            })
            //        }else {
            //            if(dateCheck){
            //                $com.save({},sendObj,function(res){
            //                    res.success ?
            //                        commonService.ctrlSuccess('保存') :
            //                        commonService.ctrlError('保存', res.msg)
            //                })
            //            }else {
            //                commonService.ctrlError('操作','请选择正确的日期')
            //            }
            //        }
            //    }else {
            //        commonService.ctrlError('操作','时间格式有误')
            //    }
            //}else {
            //    commonService.ctrlError('操作','时间字段未完整填写')
            //}

            console.log(sendObj)

        }



        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    }])


//查看终端截图控制器
//app.controller('ShowSSCtrl',['$scope', '$modalInstance', '$resource', '$state', 'commonService', 'info','formatDateService','staticData',
//    function($scope, $modalInstance, $resource, $state, commonService , info , formatDateService , staticData){
//
//        var host = staticData.hostUrl
//        var deviceData = info.data
//
//        $scope.deviceName = deviceData.deviceName
//        $scope.deviceId = deviceData.deviceId
//        $scope.time = formatDateService.getNowFormatDate()
//
//        //获取原图地址
//        var $com = $resource(host + '/api/mps-upload/file/' + info.md5)
//        $com.get(function(res){
//            res.success?
//                $scope.imgSrc = host + 'upload' + res.data.path:
//                commonService.ctrlError('操作',res.message)
//        })
//
//        $scope.cancel = function () {
//            $modalInstance.dismiss('cancel');
//        };
//}])
//
//
