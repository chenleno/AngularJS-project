/**
 * Created by chenqi1 on 2017/6/13.
 */
app.controller('sendCtrl', ['$scope', '$rootScope', '$http', '$resource', '$state', '$timeout', 'selectService', 'backPathService', 'mediaService', 'commonService','FileUploader','checkBtnService',
    function ($scope, $rootScope, $http, $resource, $state, $timeout, selectService, backPathService, mediaService, commonService,FileUploader,checkBtnService) {

        //选中数组
        var sendSelectedArr = []
        $scope.sendSelectedArr = sendSelectedArr

        ////预览的地址
        //var address = 'http://mpsd.kdxcloud.com:88'

        //select调用
        $scope.updateSelection = selectService.updateSelection
        $scope.selectAll = selectService.selectAll
        $scope.isSelected = selectService.isSelected
        $scope.isSelectedAll = selectService.isSelectedAll

        //发送列表
        $scope.query = function ( pageNo, pageSize) {

            var $com = $resource($scope.app.host +
                "/api/mps-materialList/task?pageNo=:pageNo&pageSize=:pageSize", {
                pageNo: '@pageNo',
                pageSize: '@pageSize'
            });

            $com.get({ pageNo: pageNo, pageSize: pageSize },
                function (data) {
                    $scope.sendList = data.results
                    //$scope.programList = data.results
                })
        }
        $scope.query(1,10000)


        //删除
        $scope.delete = function (data) {
            //检测删除权限
            checkBtnService.check("/api/mps-materialList/task/deleteTask",'PUT').then(function(){
                //获取删除项对象集合
                var sendObj = []
                if(typeof data=='string'){
                    sendObj.push(data)
                }else{
                    sendObj = data

                }
                if(sendObj.length == 0){
                    commonService.ctrlError('操作','请先选择任务')
                }else {
                    commonService.ctrlModal("delRole").result.then(function () {

                        var $com = $resource($scope.app.host + "/api/mps-materialList/task/deleteTask",{
                        },{'update': { method:'PUT' }});

                        $com.update({taskIds:sendObj}, function (res) {
                            res.success ?
                                commonService.ctrlSuccess('删除') :
                                commonService.ctrlError('删除' , res.message)
                            $scope.sendSelectedArr = []
                            $scope.query(1,10000)
                        })

                    })
                }
            })

        }



        //审核通过
        $scope.rejectPass = function(taskId){
            checkBtnService.check("/api/mps-materialList/task/:taskId/check",'put').then(function(){
                var promise = $http({
                    method: 'put',
                    url: $scope.app.host + '/api/mps-materialList/task/'+taskId+'/check?result=Y',
                    data:{
                        rejectReason :'',
                        remark : ''
                    }
                })
                promise.then(function (res) {
                    if(res.data.success){
                        commonService.ctrlSuccess('审核通过')
                        $scope.query(1,10000)
                    }else{
                        commonService.ctrlError('审核', res.msg)
                    }
                    //$scope.query()
                })
            })

        }
        //驳回
        $scope.rejectRequest = function (taskId) {
            checkBtnService.check("/api/mps-materialList/task/:taskId/check",'put').then(function(){
                commonService.rejectRequest(taskId);
            })
        }

        //播放器
        var player = {}
        //播放标志位
        var playBool = false
        $scope.imgOnly = false
        $scope.openOtherPlay = function(imgPath,videoPath){
            if(videoPath != ''){
                $scope.imgOnly = false
                $scope.posterImg = $rootScope.address + imgPath
                player = videojs("my-video", {
                    //"techOrder": ["flash","html"],
                    "autoplay":false,
                    "poster": $scope.posterImg
                    //"src":"http://vjs.zencdn.net/v/oceans.mp4",
                    //controlBar: {
                    //    captionsButton: false,
                    //    chaptersButton : false,
                    //    liveDisplay:false,
                    //    playbackRateMenuButton: false,
                    //    subtitlesButton:false
                    //}

                });
                player.src($rootScope.address+videoPath)
                player.poster($scope.posterImg)
                playBool = true
            }else{
                //tupian
                $scope.imgOnly = true
                $scope.picPath = $rootScope.address+imgPath
            }
            if(playBool){
                player.paused();
            }

        }

        //预览
        $scope.openPlay = function (taskId) {
            checkBtnService.check("/api/mps-materialList/task/:taskId/preview",'get').then(function(){
                var $com = $resource($scope.app.host +
                    "/api/mps-materialList/task/:taskId/preview", {
                    taskId: '@taskId'
                });
            $com.get({ taskId: taskId},
                function (data) {
                    if(!data.success){
                        commonService.ctrlError('预览', data.message)
                    }else if(data.message.length == 0){
                        commonService.ctrlError('预览', '此节目单下没有可预览的素材')
                    } else{
                        $scope.dataImg = data.message;
                        //console.log($scope.dataImg)
                        $('#videoMask').fadeIn(200);
                        $('#video').fadeIn(200);
                        $scope.openOtherPlay($scope.dataImg[0].picPath,$scope.dataImg[0].videoPath)
                        setTimeout(function(){
                            var num =parseInt($('.videoListInfo').width() / 270)
                            //console.log(num)
                            jQuery("#videoList").slide({pnLoop:false,scroll:num,delayTime:400,mainCell:".bd ul",autoPage:true,effect:"left",autoPlay:false,vis:num,prevCell:".prev",nextCell:".next" });

                        },10)
                    }

                })

                    })

        }

        //关闭播放器
        $scope.closePlay = function(){
            //player.dispose();
            if(playBool){
                player.paused();
            }
            $('#videoMask').fadeOut(200);
            $('#video').fadeOut(200);
        }
    }])


//驳回模态框
app.controller('rejectRequestCtrl', ['$scope', '$rootScope', '$resource', 'commonService', '$state', 'info', '$modalInstance', 'staticData', 'selectService','$http', function ($scope, $rootScope, $resource, commonService, $state, info, $modalInstance, staticData, selectService,$http) {

    //console.log(info.taskId)
    var taskId = info.taskId
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    //发送列表
    $scope.query = function ( pageNo, pageSize) {

        var $com = $resource($scope.app.host +
            "/api/mps-materialList/task?pageNo=:pageNo&pageSize=:pageSize", {
            pageNo: '@pageNo',
            pageSize: '@pageSize'
        });

        $com.get({ pageNo: pageNo, pageSize: pageSize },
            function (data) {
                $scope.sendList = data.results
                //$scope.programList = data.results
            })
    }

    $scope.doSubmit = function(){
        var promise = $http({
            method: 'put',
            url:'/api/mps-materialList/task/'+taskId+'/check?result=Y',
            data:{
                rejectReason :$scope.reason,
                remark : $scope.reasonInfo
            }
        })
        promise.then(function (res) {
           if(res.data.success) {
               commonService.ctrlSuccess('驳回')
               $scope.query(1,10000)
               $modalInstance.dismiss('cancel');

           }else{
               commonService.ctrlError('驳回', res.msg)
           }
            //$scope.query()
        })
    }

}]);
app.controller('addSendTAskCtrl', ['$scope', '$rootScope', '$http', '$resource', '$state', '$timeout', 'selectService', 'commonService', 'programService','checkBtnService','staticData','$stateParams','formatDateService','checkTimeService',

    function ($scope, $rootScope, $http, $resource, $state, $timeout, selectService, commonService, programService,checkBtnService,staticData,$stateParams,formatDateService,checkTimeService) {
        //设备列表
        var equipmentSelectedArr = []
        $scope.equipmentSelectedArr = equipmentSelectedArr
        //节目列表
        $scope.materialList = '';

        //默认立即发送
        $scope.jobModeCode = 'immediately'

        //edit_mode为true，即为编辑模式
        var edit_mode = !!$stateParams.id;
        //console.log($stateParams.id)

        //时间插件
        $scope.logSearchCond = staticData.logSearchCond
        $scope.fromDate = undefined
        $scope.fromHour = undefined
        $scope.fromMin = undefined

        $scope.options = {
            locale: 'zh-cn',
            format: 'YYYY-MM-DD',
            showClear: true,
            minDate: new Date()
            //debug: true
        }

        $scope.optionsHour = {
            locale: 'zh-cn',
            format: 'HH',
            showClear: true
            //debug: true
        }
        $scope.optionsMin = {
            locale: 'zh-cn',
            format: 'mm',
            showClear: true,
            stepping: 10,
            //debug: true
            //debug: true
        }


        //城市json数据获取
        $http.get('admin/js/cityList.json').success(function(data) {
            $scope.cityGroup = data
        });


        $scope.query = function (sheetName, province, deviceName,state) {

            var $com = $resource($scope.app.host +
                "/api/mps-materialList/task/newTask?sheetName=:sheetName&province=:province&deviceName=:deviceName&state=:state", {
                sheetName: '@sheetName',
                province: '@province',
                deviceName: '@deviceName',
                state: '@state'
            });

            $com.get({ sheetName: sheetName, province: province, deviceName: deviceName, state: state },
                function (data) {
                    $scope.datas = data.sheetList;
                    $scope.devices = data.deviceList;

                    //$scope.programList = data.results
                })
        }
        if(!edit_mode){
            $scope.query()

        }

        //编辑下的数据回显
        $scope.editQuery = function (taskId) {

            var $com = $resource($scope.app.host +
                "/api/mps-materialList/task/:taskId?sheetName=&deviceName=&province=&state=", {
                taskId: '@taskId'
            });

            $com.get({ taskId: taskId},
                function (data) {
                    console.log(data)
                    $scope.materialList = data.sheetList[0].materialListId;
                    for(var i = 0; i < data.deviceList.length; i++){
                        if(data.deviceList[i].flag == 'Y'){
                            $scope.equipmentSelectedArr.push(data.deviceList[i].deviceId)
                        }
                    }
                    //var time = data.sendStartTime.split(' ');
                    //$scope.fromDate = time[0]
                    //$scope.fromHour = time[1].split(':')[0]
                    //$scope.fromMin = time[1].split(':')[1]
                    //$scope.programList = data.results
                    $scope.datas = data.sheetList;
                    $scope.devices = data.deviceList;
                    $scope.fromDate = data.sendStartTime
                    $scope.fromHour = data.sendStartTime

                    $scope.fromMin = data.sendStartTime

                })
        }
        if(edit_mode){
            $scope.editQuery($stateParams.id)
        }
        //查找节目单名称
        $scope.sheetNameQuery = function(sheetName){
            var $com = $resource($scope.app.host +
                "/api/mps-materialList/task/newTask?sheetName=:sheetName&province=&deviceName=&state=", {
                sheetName: '@sheetName'
            });

            $com.get({ sheetName: sheetName},
                function (data) {
                    $scope.datas = data.sheetList;
                    //$scope.programList = data.results
                })
        }

        //查找设备
        $scope.deviceQuery = function(province, deviceName,state){
            var $com = $resource($scope.app.host +
                "/api/mps-materialList/task/newTask?sheetName=&province=:province&deviceName=:deviceName&state=:state", {
                province: '@province',
                deviceName: '@deviceName',
                state: '@state'
            });

            $com.get({ province: province, deviceName: deviceName, state: state },
                function (data) {
                    $scope.devices = data.deviceList;

                    //$scope.programList = data.results
                })
        }
        //监听按键
        $scope.searchMater = function(name, e){
            if(e){
                var keycode = window.event?e.keyCode:e.which;

                if (keycode == 13){
                    $scope.sheetNameQuery(name)
                }

            }else {
                $scope.sheetNameQuery(name)

            }
        }

        $scope.searchDevice = function(province, deviceName, state ,e){
            console.log(e)
            if(e){
                var keycode = window.event?e.keyCode:e.which;
                if (keycode == 13){
                    $scope.deviceQuery(province, deviceName,state)
                }

            }else {
                $scope.deviceQuery(province, deviceName,state)
            }
        }

        //select相关操作的方法绑定
        $scope.updateSelection = selectService.updateSelection
        $scope.selectAll = selectService.selectAll
        $scope.isSelected = selectService.isSelected
        $scope.isSelectedAll = selectService.isSelectedAll
        //节目单操作
        $scope.isMaterialSelect =  function(id){
            return $scope.materialList == id
        }
        $scope.updateMaterialList = function(id){
            $scope.materialList = id
        }


        //提交表单
        $scope.saveTask = function(){
            //防止多次提交
            $('.btnSubmit').attr('disabled',true)
            if($scope.materialList == ''){
                $('.btnSubmit').attr('disabled',false)
                commonService.ctrlError('创建', '清选择节目单')
                return
            }
            if($scope.equipmentSelectedArr.length == 0){
                $('.btnSubmit').attr('disabled',false)
                commonService.ctrlError('创建', '清选择设备')
                return
            }
            if( $scope.jobModeCode == 'timing'){
                console.log($scope.fromDate)
                if($scope.fromDate == null || $scope.fromHour == null || $scope.fromMin == null){
                    commonService.ctrlError('创建', '清选择时间')
                    return
                }
                var fromDate = $scope.fromDate._d
                var fromDateTrans = formatDateService.getDate(fromDate)

                var fromHour = $scope.fromHour._d
                var fromHourTrans =  formatDateService.formatHour(fromHour)

                var fromMin = $scope.fromMin._d
                var fromMinTrans =  formatDateService.formatMinute(fromMin)

                //var todayDate = new Date();
                var todayDateTrans = new Date().getTime();
                //
                var starTime = fromDateTrans + ' ' + fromHourTrans + ':' +fromMinTrans;
                var starTime2 = starTime.replace(new RegExp("-","gm"),"/");
                starTime2 = (new Date(starTime2)).getTime();
                //console.log(fromDateTrans)
                //console.log(fromHourTrans)
                //console.log(starTime < (todayDateTrans + 60*1000))
                //return
                if(starTime2 < (todayDateTrans + 60*1000)){
                    $('.btnSubmit').attr('disabled',false)
                    commonService.ctrlError('创建', '时间不能早于当前时间10分钟')
                    return
                }
                if(!edit_mode){
                    var $com = $resource($scope.app.host + "/api/mps-materialList/task");
                    $com.save({},{materialListId:$scope.materialList,deviceIdList:$scope.equipmentSelectedArr,sendStartTime:starTime},function(res){
                        if(res.success){
                            commonService.ctrlSuccess('创建');
                            $state.go('app.send.sendList')
                        }else{
                            $('.btnSubmit').attr('disabled',false)
                            commonService.ctrlError('创建', res.message)
                        }
                    })
                }else{

                    var $com = $resource($scope.app.host + "/api/mps-materialList/task/:task",{
                        task: '@$stateParams.id'
                    },{'update': { method:'PUT' }});
                    $com.update({task:$stateParams.id},{materialListId:$scope.materialList,deviceIdList:$scope.equipmentSelectedArr,sendStartTime:starTime},function(res){
                        if(res.success){
                            commonService.ctrlSuccess('编辑');
                            $state.go('app.send.sendList')
                        }else{
                            $('.btnSubmit').attr('disabled',false)
                            commonService.ctrlError('编辑', res.message)
                        }
                    })
                }

            }else{
                if(!edit_mode){
                    var $com = $resource($scope.app.host + "/api/mps-materialList/task");
                    $com.save({},{materialListId:$scope.materialList,deviceIdList:$scope.equipmentSelectedArr,sendStartTime:starTime},function(res){
                        if(res.success){
                            commonService.ctrlSuccess('创建');
                            $state.go('app.send.sendList')
                        }else{
                            $('.btnSubmit').attr('disabled',false)
                            commonService.ctrlError('创建', res.message)
                        }
                    })
                }else{

                    var $com = $resource($scope.app.host + "/api/mps-materialList/task/:task",{
                        task: '@$stateParams.id'
                    },{'update': { method:'PUT' }});
                    $com.update({task:$stateParams.id},{materialListId:$scope.materialList,deviceIdList:$scope.equipmentSelectedArr,sendStartTime:starTime},function(res){
                        if(res.success){
                            commonService.ctrlSuccess('编辑');
                            $state.go('app.send.sendList')
                        }else{
                            $('.btnSubmit').attr('disabled',false)
                            commonService.ctrlError('编辑', res.message)
                        }
                    })
                }
            }

            //将提交的参数清理下


        }
    }])
