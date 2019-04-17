//控制层 
app.controller('goodsController', function($scope, $controller, $location, 
		goodsService, itemCatService,typeTemplateService) {

	$controller('baseController', {
		$scope : $scope
	});// 继承

	// 读取列表数据绑定到表单中
	$scope.findAll = function() {
		goodsService.findAll().success(function(response) {
			$scope.list = response;
		});
	}

	// 分页
	$scope.findPage = function(page, rows) {
		goodsService.findPage(page, rows).success(function(response) {
			$scope.list = response.rows;
			$scope.paginationConf.totalItems = response.total;// 更新总记录数
		});
	}
	
	$scope.pages = {"page":"","rows":""};
	// 查询实体
	$scope.findOne = function() {
		// 接收地址栏参数 id
		var id = $location.search()['id'];
		if (id==null){
			return ;
		}
		// 接收上一次分页的记录
		$scope.pages.page = $location.search()['page'];
		$scope.pages.rows = $location.search()['rows'];
		
		goodsService.findOne(id).success(function(response) {
			$scope.entity = response;
			// 富文本内容
			editor.html(response.goodsDesc.introduction);
			 //显示图片列表
			$scope.entity.goodsDesc.itemImages=  
				JSON.parse($scope.entity.goodsDesc.itemImages);
			//显示扩展属性
			$scope.entity.goodsDesc.customAttributeItems= 
				JSON.parse($scope.entity.goodsDesc.customAttributeItems);
			// 显示规格
			$scope.entity.goodsDesc.specificationItems=
				JSON.parse($scope.entity.goodsDesc.specificationItems);		
			//SKU列表规格列转换				
			for( var i=0;i<$scope.entity.itemList.length;i++ ){
				$scope.entity.itemList[i].spec = 
				JSON.parse( $scope.entity.itemList[i].spec);		
			}

		});
	}

	$scope.findOneInfo = function(id) {
		location.href="goods_info.html#?id="+id
		+"&page="+$scope.paginationConf.currentPage
		+"&rows="+$scope.paginationConf.itemsPerPage;
	}
	
	// 保存
	$scope.save = function() {
		var serviceObject;// 服务层对象
		// 得到富文本内容 并设置到 组合实体中的商品详情内
		$scope.entity.goodsDesc.introduction = editor.html();
//		alert($scope.entity.goods.id);
		if ($scope.entity.goods.id != null) {// 如果有ID
			serviceObject = goodsService.update($scope.entity); // 修改
		} else {
			serviceObject = goodsService.add($scope.entity);// 增加
		}
		serviceObject.success(function(response) {
			if (response.status) {
				alert(response.message);
				location.href="goods.html#?page="+$scope.pages.page+"&rows="+$scope.pages.page;//跳转到商品列表页
//				$scope.entity = {};
//				editor.html('');
			} else {
				alert(response.message);
			}
		});
	}

	// 批量删除
	$scope.dele = function() {
		if ($scope.selectIds.length==0){
			alert("请至少选择一条记录删除");
			return ;
		}
		// 获取选中的复选框
		goodsService.dele($scope.selectIds).success(function(response) {
			if (response.status) {
				$scope.reloadList();// 刷新列表
			}
		});
	}
	// 批量修改商品状态
	$scope.updateStatus = function(status) {
		if ($scope.selectIds.length==0){
			alert("请至少选择一条记录");
			return ;
		}
		// 获取选中的复选框
		goodsService.updateStatus($scope.selectIds,status)
		.success(function(response) {
			alert(response.status);
			if (response.status) {
				$scope.reloadList();// 刷新列表
				$scope.selectIds = [];
			}else{
				alert(response.message);
			}
		});
	}

	$scope.searchEntity = {};// 定义搜索对象

	// 搜索
	$scope.search = function(page, rows) {
		goodsService.search(page, rows, $scope.searchEntity).success(
				function(response) {
					$scope.list = response.rows;
					$scope.paginationConf.totalItems = response.total;// 更新总记录数
				});
	}

	// 文件上传
//	$scope.uploadFile = function() {
//		uploadService.uploadFile().success(function(response) {
//			// alert(JSON.stringify(response));
//			if (response.error == 0) {
//				$scope.image_entity.url = response.url;
//			} else {
//				alert(response.message);
//			}
//		});
//	}

	// 定义图片列表实体  提交至后台的组合实体
	$scope.entity = {
		goods : {},
		goodsDesc : {
			itemImages : [],
			specificationItems:[]
		}
	};
	// 添加到列表
	$scope.add_image_entity = function() {
		$scope.entity.goodsDesc.itemImages.push($scope.image_entity);
	}
	// 删除图片列表
	$scope.remove_image_entity = function(index) {
		$scope.entity.goodsDesc.itemImages.splice(index, 1);
	}

	// 查询一级分类列表
	$scope.selectItemCat1List = function() {
		itemCatService.findByParentId(0).success(function(response) {
			$scope.itemCat1List = response;
		});
	}

	// 查询二级分类列表
	$scope.$watch('entity.goods.category1Id', function(newValue, oldValue) {
		itemCatService.findByParentId(newValue).success(function(response) {
			$scope.itemCat2List = response;
		});
	});
	
	// 查询三级分类列表
	$scope.$watch('entity.goods.category2Id', function(newValue, oldValue) {
		itemCatService.findByParentId(newValue).success(function(response) {
			$scope.itemCat3List = response;
		});
	});
	
	// 读取模板id
	$scope.$watch('entity.goods.category3Id', function(newValue, oldValue) {
		itemCatService.findOne(newValue).success(function(response) {
			$scope.entity.goods.typeTemplateId = response.typeId;
		});
	});
	
	// 监控模板id，查询品牌列表 tb_type_template
	$scope.$watch('entity.goods.typeTemplateId', function(newValue, oldValue) {
		typeTemplateService.findOne(newValue).success(function(response) {
			$scope.typeTemplate = response;
			$scope.typeTemplate.brandIds = JSON.parse($scope.typeTemplate.brandIds);
			// 扩展属性
			//如果没有ID，则加载模板中的扩展数据
			if($location.search()['id']==null){
				$scope.entity.goodsDesc.customAttributeItems = 
					JSON.parse($scope.typeTemplate.customAttributeItems);
			}	
			
		});
		// 显示规格选项
		typeTemplateService.findSpecList(newValue).success(
			function (response){
				$scope.specList=response;
			}
		);
	});
	
	/**
	 * 思路分析：
	 * 		1、当前选择的规格名称 已存在：在后面拼接对应的值（集合）
	 * 		2、当前选择的规格名称 不存在：直接在后面拼装对应的类型的数据
	 * 自定义：{"attributeName":name,"attributeValue":[value]}
	 */
	// 勾选规格选项   
	$scope.updateSpecAttribute = function ($event,name,value){
		// attributeName:网络
		var object= $scope.searchObjectByKey(
				$scope.entity.goodsDesc.specificationItems,
				"attributeName",name);
		if (object!=null){// 存在
			
			// 取消勾选
			if ($event.target.checked){
				object.attributeValue.push(value);
			}else{
				object.attributeValue.splice(object.attributeValue.indexOf(value),1);
				// 判断等于0 后把整个对象删除
				if (object.attributeValue.length==0){
					$scope.entity.goodsDesc.specificationItems.splice(
							$scope.entity.goodsDesc.specificationItems.indexOf(object),1);
				}
			}
		}else{// 不存在
			$scope.entity.goodsDesc.specificationItems.push(
				{"attributeName":name,"attributeValue":[value]}	
			);
		}
	}
	
	//创建SKU列表
	$scope.createItemList=function(){	
		//初始sku列表  spec：规格选项 ?
		$scope.entity.itemList=[{spec:{},price:0,num:99999,status:'0',isDefault:'0'}];
		// [{"attributeName":"网络","attributeValue":["移动3G","联通3G"]},{"attributeName":"机身内存","attributeValue":["128G","64G"]}]
		var items = $scope.entity.goodsDesc.specificationItems;	
		for(var i=0;i< items.length;i++){
			$scope.entity.itemList = 
				addColumn($scope.entity.itemList, 
					items[i].attributeName,
					items[i].attributeValue);
		}
	}
	
	// 添加列值 倍数增长  嵌套循环
	addColumn = function (list,columnName,columnValues){
		// 创建一个新的集合
		var newList=[];
		for (var i=0; i<list.length; i++){
			var oldRow = list[i];
			for (var j=0; j<columnValues.length; j++){
				// 深克隆
				var newRow = JSON.parse( JSON.stringify(oldRow) );
				newRow.spec[columnName] = columnValues[j];
				newList.push(newRow);
			}
		}
		
		return newList;
	}
	
	
	// 商品的状态
	$scope.status=['未审核','已审核','审核未通过','已关闭'];
	// 显示商品所属分类
	$scope.itemCatList=[];//商品分类列表
	$scope.findItemCatList = function (){
		itemCatService.findAll().success(
			function(response){
				for (var i=0; i<response.length; i++){
					$scope.itemCatList[response[i].id] = response[i].name;
				} 
			}
		);
	}
	
	// 商品编辑时 检测商品规格选项是否有选中 specName：网络    optionName：4G
	$scope.checkAttributeValue=function(specName,optionName){
//		alert(specName+"---"+optionName);
		var items = $scope.entity.goodsDesc.specificationItems;
		var obj = $scope.searchObjectByKey(items,'attributeName',specName);
		if (obj==null){// 没有 返回false
			return false;
		}else{
			// 有，在判断当前列表中是否包含optionName的值
			if (obj.attributeValue.indexOf(optionName)>=0){
				return true;
			}else{
				return false;
			}
		}
	}
	
	

});
