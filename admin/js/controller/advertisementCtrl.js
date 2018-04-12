app.controller('advertisementDescCtrl', ['$scope', '$state','$rootScope', '$http', '$resource', 'commonService', 'checkBtnService', 'showCheckBox','$stateParams', '$location',
    function ($scope, $state,$rootScope, $http, $resource, commonService, checkBtnService, showCheckBox, $stateParams, $location) {

        //edit_mode为true，即为正常跳转模式，false为审核模式
        var billId = $stateParams.id;
        $scope.bool = $stateParams.bool
        $scope.xiaKangBool = $stateParams.bool
        $scope.adType = true
        //console.log($stateParams.bool)
        //console.log(edit_mode)
        //查询
        $scope.projectId = $stateParams.projectId
        $scope.queryTimeList = function () {
            var $com = $resource($scope.app.host +
                "/api/cinema-adLaunch/getTimerangeList", {
            });
            $com.get({},
                function (res) {
                    $scope.timeObj = res.result
                    //console.log($scope.timeObj)
                })
        }
        $scope.queryTimeList();

        $scope.goDesc = function () {
           // ui-sref="app.order.adPointList({billId:id,bool:true,projectId:projectId,xiaKangBool:xiaKangBool})"
                $state.go('app.order.adPointList',{projectId:$stateParams.projectId,billId:$stateParams.id,bool:true,xiaKangBool:$scope.bool}) //详情带下刊
        }

        //查询列表
        $scope.query = function (billId) {

            var $com = $resource($scope.app.host +
                "/api/cinema-adLaunch/adBill/:billId", {
                billId: '@billId'
            });

            $com.get({ billId: billId},
                function (res) {
                    $scope.data = res
                    //$scope.queryPro($scope.data.step1.projectId)
                    if($scope.data.step2.screenType == 1 && $scope.data.step1.pointType != 5){
                        $scope.showType = true
                        var sData = $scope.data.step2.fileInfo
                        for(var i = 0; i < sData.length; i ++){
                            //console.log(sData)
                            switch (sData[i].deviceType){
                                case 1 : $scope.queryPic(1,sData[i].fileId); break;
                                case 2 : $scope.queryPic(2,sData[i].fileId); break;
                                case 3 : $scope.queryPic(3,sData[i].fileId); break;
                                case 4 : $scope.queryPic(4,sData[i].fileId); break;
                                default : break;
                            }
                        }
                        //$scope.queryPic(1,$scope.data.step2.fileId)
                        //$scope.queryPic(2,$scope.data.step2.picture1Id)
                        //$scope.queryPic(3,$scope.data.step2.picture2Id)
                        //$scope.queryPic(4,$scope.data.step2.picture3Id)
                    }else{
                        $scope.showType = false
                        //$scope.queryPic(1,$scope.data.step2.fileId)
                        //$scope.queryPic(5,$scope.data.step2.pictureId)
                        var sData = $scope.data.step2.fileInfo
                        if(sData.length == 3){
                            $scope.adType = false
                        }
                        for(var i = 0; i < sData.length; i ++){
                            switch (sData[i].deviceType){
                                case 1 : $scope.queryPic(1,sData[i].fileId); break;
                                case 2 : $scope.queryPic(5,sData[i].fileId); break;
                                case 3 : $scope.queryPic(6,sData[i].fileId); break;
                                default : break;
                            }
                        }
                    }
                    if($scope.data.step3.timerangeIds){
                        $scope.timeList = []
                        for(var i = 0; i < $scope.data.step3.timerangeIds.length; i++){
                            for(var n = 0; n < $scope.timeObj.length; n++){
                                if($scope.timeObj[n].timerangeid == $scope.data.step3.timerangeIds[i]){
                                    $scope.timeList.push($scope.timeObj[n].timerange)
                                }
                            }
                        }
                        //console.log($scope.timeList)
                    }
                    if($scope.data.step3.addedInfo){
                        $scope.videoTimeList = []
                        for(var i = 0; i < $scope.data.step3.addedInfo.length; i++){
                            for(var n = 0; n < $scope.timeObj.length; n++){
                                if($scope.timeObj[n].timerangeid == $scope.data.step3.addedInfo[i].timerangeId){
                                    $scope.videoTimeList.push($scope.timeObj[n].timerange)
                                }
                            }
                        }
                    }
                })
        }

        $scope.returnBack = function () {
            $state.go('app.order.adOrderList',{deviceId: $stateParams.projectId})
        }

        var playerPre = {};

        $scope.openOtherPlay = function (imgPath, videoPath) {
            $('.video-jsPre0').attr('id','a'+parseInt(Math.random()*100))
            var videoId = $('.video-jsPre0').attr('id')
            $scope.posterImg = $rootScope.address + imgPath;
            playerPre = videojs(videoId, {
                //"techOrder": ["flash","html"],
                "autoplay": false,
                "poster": $scope.posterImg,

            });
            playerPre.src($rootScope.address + videoPath);
            playerPre.poster($scope.posterImg);
            //playBool = true;
        };

        var playerPre1 = {};

        $scope.openOtherPlay1 = function (imgPath, videoPath) {
            $('.video-jsPre1').attr('id','b'+parseInt(Math.random()*100))
            var videoId = $('.video-jsPre1').attr('id')
            $scope.posterImg = $rootScope.address + imgPath;
            playerPre1 = videojs(videoId, {
                //"techOrder": ["flash","html"],
                "autoplay": false,
                "poster": $scope.posterImg,

            });
            playerPre1.src($rootScope.address + videoPath);
            playerPre1.poster($scope.posterImg);
            //playBool = true;
        };

        //$scope.openOtherPlay()

        $scope.queryPic = function (screenNum,fileUid) {
            //console.log(fileUid)
            var $com = $resource($scope.app.host +
                "/api/mps-filemanager/file/:fileUid/preview", {
                fileUid: '@fileUid'
            });
            $com.get({ fileUid: fileUid},
                function (data) {

                    if(screenNum == 1){
                        if($scope.data.step1.billType == 1){
                            //$('#order-video').fadeIn(200);
                            $scope.openOtherPlay(data.message[0].picPath,data.message[0].videoPath)
                        }else{
                            $scope.gameType = true
                            $scope.gameName = data.message[0].name
                        }
                    }else if(screenNum == 3){
                        $scope.screen3Pic =$rootScope.address + data.message[0].picPath
                    }else if(screenNum == 2){
                        $scope.screen2Pic =$rootScope.address + data.message[0].picPath
                    }else if(screenNum == 4){
                        $scope.screen4Pic =$rootScope.address + data.message[0].picPath
                    }else if(screenNum == 5){
                        $scope.screen5Pic =$rootScope.address + data.message[0].picPath
                    }else if(screenNum == 6){
                        $scope.openOtherPlay1(data.message[0].picPath,data.message[0].videoPath)
                    }
                })
        }
        $scope.query(billId)
        $scope.id = billId


        //下刊
        $scope.examine = function (billId) {

            checkBtnService.check("/api/cinema-adLaunch/adBill/:billId",'delete').then(function() {

                commonService.ctrlModal('downOrder').result.then(function () {
                    var $com = $resource($scope.app.host + "/api/cinema-adLaunch/adBill/:billId", {billId: '@billId'});
                    $com.delete({billId: billId}, {}, function (data) {
                        if (data.success) {
                            commonService.ctrlSuccess('下刊');
                            history.back();
                        }
                    });
                })
            })
        }

        //滚动条
        $scope.scrollHeight = function () {
            //console.log($(window).height())
            $('#scroll').css('height', $(window).height() - 230)
        }

        $scope.scrollHeight();
        $(window).resize(function () {
            $('#scroll').css('height', $(window).height() - 230)
        });
    }])
app.controller('examineDescCtrl', ['$scope', '$rootScope', '$http', '$resource', 'commonService', 'checkBtnService', 'showCheckBox','$stateParams', '$location','$state',
    function ($scope, $rootScope, $http, $resource, commonService, checkBtnService, showCheckBox, $stateParams, $location,$state) {

        //edit_mode为true，即为正常跳转模式，false为审核模式
        var billId = $stateParams.id;
        $scope.id = billId
        //console.log(edit_mode)
        $scope.adType = true

        $scope.rightMedia = true //单屏时显示

        //查询
        $scope.queryTimeList = function () {
            var $com = $resource($scope.app.host +
                "/api/cinema-adLaunch/getTimerangeList", {
            });
            $com.get({},
                function (res) {
                    $scope.timeObj = res.result
                    //console.log($scope.timeObj)
                })
        }
        $scope.queryTimeList();
        //查询项目
        $scope.queryPro = function (projectId) {
            var $com = $resource($scope.app.host +
                "/api/cinema-adLaunch/adProject/:projectId", {
                projectId: '@projectId'
            });

            $com.get({ projectId: projectId},
                function (res) {
                    $scope.proData = res
                    if($scope.proData.projectCosts.length == 2){
                        $scope.cost1 = true
                        $scope.cost2 = true
                    }else if($scope.proData.projectCosts[0] == 1){
                        $scope.cost1 = true
                        $scope.cost2 = false
                    }else{
                        $scope.cost2 = true
                        $scope.cost1 = false
                    }
                })
        }
        $scope.returnBack = function () {
            history.back();
        }

        //查询列表
        $scope.query = function (billId) {

            var $com = $resource($scope.app.host +
                "/api/cinema-adLaunch/adBill/:billId", {
                billId: '@billId'
            });

            $com.get({ billId: billId},
                function (res) {
                    if(res.step3.fileDuration != null){
                        res.step3.fileDuration = parseInt(res.step3.fileDuration)
                    }
                    $scope.data = res
                    //alert(123)
                    $scope.queryPro($scope.data.step1.projectId)

                    if($scope.data.step1.pointType == 4) {//单屏隐藏右侧图片
                        $scope.rightMedia = false;
                    }

                    if($scope.data.step2.screenType == 1 && $scope.data.step1.pointType != 5){
                        $scope.showType = true
                        var sData = $scope.data.step2.fileInfo
                        for(var i = 0; i < sData.length; i ++){
                            //console.log(sData)
                            switch (sData[i].deviceType){
                                case 1 : $scope.queryPic(1,sData[i].fileId); break;
                                case 2 : $scope.queryPic(2,sData[i].fileId); break;
                                case 3 : $scope.queryPic(3,sData[i].fileId); break;
                                case 4 : $scope.queryPic(4,sData[i].fileId); break;
                                default : break;
                            }
                        }
                        //$scope.queryPic(1,$scope.data.step2.fileId)
                        //$scope.queryPic(2,$scope.data.step2.picture1Id)
                        //$scope.queryPic(3,$scope.data.step2.picture2Id)
                        //$scope.queryPic(4,$scope.data.step2.picture3Id)
                    }else{
                        $scope.showType = false
                        //$scope.queryPic(1,$scope.data.step2.fileId)
                        //$scope.queryPic(5,$scope.data.step2.pictureId)
                        var sData = $scope.data.step2.fileInfo
                        if(sData.length == 3){
                            $scope.adType = false
                        }
                        for(var i = 0; i < sData.length; i ++){
                            switch (sData[i].deviceType){
                                case 1 : $scope.queryPic(1,sData[i].fileId); break;
                                case 2 : $scope.queryPic(5,sData[i].fileId); break;
                                case 3 : $scope.queryPic(6,sData[i].fileId); break;
                                default : break;
                            }
                        }
                    }
                    if($scope.data.step3.timerangeIds){
                        $scope.timeList = []
                        for(var i = 0; i < $scope.data.step3.timerangeIds.length; i++){
                            for(var n = 0; n < $scope.timeObj.length; n++){
                                if($scope.timeObj[n].timerangeid == $scope.data.step3.timerangeIds[i]){
                                    $scope.timeList.push($scope.timeObj[n].timerange)
                                }
                            }
                        }
                        //console.log($scope.timeList)
                    }
                    if($scope.data.step3.addedInfo){
                        $scope.videoTimeList = []
                        for(var i = 0; i < $scope.data.step3.addedInfo.length; i++){
                            for(var n = 0; n < $scope.timeObj.length; n++){
                                if($scope.timeObj[n].timerangeid == $scope.data.step3.addedInfo[i].timerangeId){
                                    $scope.videoTimeList.push($scope.timeObj[n].timerange)
                                }
                            }
                        }
                    }
                })
        }



        var playerPre = {};

        $scope.openOtherPlay = function (imgPath, videoPath) {
            $('.video-jsPre0').attr('id','a'+parseInt(Math.random()*100))
            var videoId = $('.video-jsPre0').attr('id')
            $scope.posterImg = $rootScope.address + imgPath;
            playerPre = videojs(videoId, {
                //"techOrder": ["flash","html"],
                "autoplay": false,
                "poster": $scope.posterImg,

            });
            playerPre.src($rootScope.address + videoPath);
            playerPre.poster($scope.posterImg);
            //playBool = true;
        };

        var playerPre1 = {};

        $scope.openOtherPlay1 = function (imgPath, videoPath) {
            $('.video-jsPre1').attr('id','b'+parseInt(Math.random()*100))
            var videoId = $('.video-jsPre1').attr('id')
            $scope.posterImg = $rootScope.address + imgPath;
            playerPre1 = videojs(videoId, {
                //"techOrder": ["flash","html"],
                "autoplay": false,
                "poster": $scope.posterImg,

            });
            playerPre1.src($rootScope.address + videoPath);
            playerPre1.poster($scope.posterImg);
            //playBool = true;
        };

        //$scope.openOtherPlay()

        $scope.queryPic = function (screenNum,fileUid) {
            var $com = $resource($scope.app.host +
                "/api/mps-filemanager/file/:fileUid/preview", {
                taskId: '@fileUid'
            });
            $com.get({ fileUid: fileUid},
                function (data) {

                    if(screenNum == 1){
                        //$scope.screen1 = true;
                        if($scope.data.step1.billType == 1){
                            //$('#order-video').fadeIn(200);
                            $scope.openOtherPlay(data.message[0].picPath,data.message[0].videoPath)
                        }else{
                            $scope.gameType = true
                            $scope.gameName = data.message[0].name
                        }
                        //$scope.data.fileId = fileUid;
                    }else if(screenNum == 3){
                        $scope.screen3Pic =$rootScope.address + data.message[0].picPath
                    }else if(screenNum == 2){
                        $scope.screen2Pic =$rootScope.address + data.message[0].picPath
                    }else if(screenNum == 4){
                        $scope.screen4Pic =$rootScope.address + data.message[0].picPath
                    }else if(screenNum == 5){
                        $scope.screen5Pic =$rootScope.address + data.message[0].picPath
                    }else if(screenNum == 6){
                        $scope.openOtherPlay1(data.message[0].picPath,data.message[0].videoPath)
                    }
                })
        }
        $scope.query(billId)

        //审核
        $scope.examine = function (num) {
            var orderData = {
                billId:billId,
                billStatus:num // 2代表审核不通过，3代表审核通过
            }
            var $comUpdate = $resource($scope.app.host + "/api/cinema-adLaunch/checkAdBillPermmison/check",{},{
                'update': { method:'PUT' }
            });

            $comUpdate.update({},orderData,function(res){
                if(res.success){
                    commonService.ctrlSuccess('审核');
                    $state.go('app.order.checkSheetList')
                }else {
                    //$('.btnSubmit').attr('disabled',false)
                    //$scope.errorMsg = res.message
                    if(res.orderId){
                        commonService.conflictModal(res)
                    }else{
                        commonService.ctrlError('操作' , res.message)
                    }
                }
            });
        }
        //滚动条
        //$scope.scrollHeight = function () {
        //    //console.log($(window).height())
        //    $('#scroll').css('height', $(window).height() - 230)
        //}
        //
        //$scope.scrollHeight();
        //$(window).resize(function () {
        //    $('#scroll').css('height', $(window).height() - 230)
        //});

        $scope.returnBack = function(){
            history.back();
        }


        //点位冲突的弹窗
        //var aData = {
        //    "suceess":false,  // false 排期冲突
        //    "error" : "xxx", //  该处给出排期错误的原因
        //    "taskId" : "8b7181ff69c044f5b56eac2616836ec3", // 任务UUID
        //    "orderId" : "c1c38fc126314a8e99d6ece3829f79e3", //广告单UUID
        //    "collidePoints" : [
        //        {
        //            "pointId" : "2ff3651b263f42008680aba96a69b88d", //点位UUID
        //            "pointName" : "测试分组" ,//点位名称
        //            "expectCount" : 6 , // 期望播放总次数（播放时间范围内播放的次数）
        //            "actualCount" : 5 //实际可播总次数
        //        },{
        //            "pointId" : "2ff3651b263f42008680aba96a69b88d", //点位UUID
        //            "pointName" : "测试分组1" ,//点位名称
        //            "expectCount" : 6 , // 期望播放总次数（播放时间范围内播放的次数）
        //            "actualCount" : 5 //实际可播总次数
        //        },{
        //            "pointId" : "2ff3651b263f42008680aba96a69b88d", //点位UUID
        //            "pointName" : "测试分组1" ,//点位名称
        //            "expectCount" : 6 , // 期望播放总次数（播放时间范围内播放的次数）
        //            "actualCount" : 5 //实际可播总次数
        //        },{
        //            "pointId" : "2ff3651b263f42008680aba96a69b88d", //点位UUID
        //            "pointName" : "测试分组1" ,//点位名称
        //            "expectCount" : 6 , // 期望播放总次数（播放时间范围内播放的次数）
        //            "actualCount" : 5 //实际可播总次数
        //        },{
        //            "pointId" : "2ff3651b263f42008680aba96a69b88d", //点位UUID
        //            "pointName" : "测试分组1" ,//点位名称
        //            "expectCount" : 6 , // 期望播放总次数（播放时间范围内播放的次数）
        //            "actualCount" : 5 //实际可播总次数
        //        },{
        //            "pointId" : "2ff3651b263f42008680aba96a69b88d", //点位UUID
        //            "pointName" : "测试分组1" ,//点位名称
        //            "expectCount" : 6 , // 期望播放总次数（播放时间范围内播放的次数）
        //            "actualCount" : 5 //实际可播总次数
        //        },{
        //            "pointId" : "2ff3651b263f42008680aba96a69b88d", //点位UUID
        //            "pointName" : "测试分组1" ,//点位名称
        //            "expectCount" : 6 , // 期望播放总次数（播放时间范围内播放的次数）
        //            "actualCount" : 5 //实际可播总次数
        //        },{
        //            "pointId" : "2ff3651b263f42008680aba96a69b88d", //点位UUID
        //            "pointName" : "测试分组1" ,//点位名称
        //            "expectCount" : 6 , // 期望播放总次数（播放时间范围内播放的次数）
        //            "actualCount" : 5 //实际可播总次数
        //        },{
        //            "pointId" : "2ff3651b263f42008680aba96a69b88d", //点位UUID
        //            "pointName" : "测试分组1" ,//点位名称
        //            "expectCount" : 6 , // 期望播放总次数（播放时间范围内播放的次数）
        //            "actualCount" : 5 //实际可播总次数
        //        }
        //    ]
        //}

        //$scope.conflict = function(){
        //    commonService.conflictModal(aData)
        //
        //}
    }

    ])