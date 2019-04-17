// 文件上传服务
app.service('uploadService',function($http){
	this.uploadFile = function(){
		var formData=new FormData();
	    formData.append("uploadFile",file.files[0]);   
		return $http({
            method:'POST',
            url:"../pic/upload.do",
            data: formData,
            headers: {'Content-Type':undefined},
            transformRequest: angular.identity
        });		
	}
});