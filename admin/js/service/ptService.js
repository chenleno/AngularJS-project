/**
 * Created by chenqi1 on 2017/10/17.
 */
//设备服务
app.service('ptService',[function(){
    //解析终端位置数据
    this.getDeviceLocation = function(list , data){

        var scopeObj = {}

        angular.forEach(list , function(province){
            if(province.name == data.deviceProvince){
                scopeObj.selected = province
                angular.forEach(province.child , function(city){
                    if(city.name == data.deviceCity){
                        scopeObj.selected2 = city
                        angular.forEach(city.child , function(deviceDistrict){
                            if(deviceDistrict.value == data.deviceDistrict){
                                scopeObj.selected3 = deviceDistrict
                            }
                        })
                    }
                })
            }
        })

        return scopeObj
    }

    //站点详情解析位置数据
    this.getStationLocation = function(list , data){

        var scopeObj = {}

        angular.forEach(list , function(province){
            if(province.name == data.stationProvince){
                scopeObj.selected = province
                angular.forEach(province.child , function(city){
                    if(city.name == data.stationCity){
                        scopeObj.selected2 = city
                        angular.forEach(city.child , function(deviceDistrict){
                            if(deviceDistrict.value == data.stationDistrict){
                                scopeObj.selected3 = deviceDistrict
                            }
                        })
                    }
                })
            }
        })

        return scopeObj
    }

    //站点详情解析位置数据
    this.getStationLocations = function(list , data){

        var scopeObj = {}

        //$scope.pointProvince + $scope.pointCity + $scope.pointDistrict + $scope.detailAddress
        angular.forEach(list , function(province){
            //console.log(data)
            //console.log(123)
            if(province.name == data.pointProvince){
                scopeObj.selected = province
                angular.forEach(province.child , function(city){
                    if(city.name == data.pointCity){
                        scopeObj.selected2 = city
                        angular.forEach(city.child , function(deviceDistrict){
                            if(deviceDistrict.value == data.pointDistrict){
                                scopeObj.selected3 = deviceDistrict
                            }
                        })
                    }
                })
            }
        })

        return scopeObj
    }

    //检查添加终端时mac输入合理性
    this.checkMac = function(data){
        var bool , patternBool,
            reg = /^[A-Fa-f0-9:]+$/


        //符合验证为true
        data.length == 17?
            bool = true:
            bool = false

        //符合验证则为true
        reg.test(data)?
            patternBool = true:
            patternBool = false

        return {bool:bool , patternBool : patternBool}
    }
}])