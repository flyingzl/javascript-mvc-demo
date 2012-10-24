
var start =new Date().getTime();

window.onload = function(){
	
	//模型定义
	var Employee = function(model){
		var self =this;
		this.id = model.id || guid();
		this.username =ko.observable(model.username);
		this.sex = ko.observable(model.sex);
		this.age = ko.observable(model.age);
		this.position = ko.observable(model.position);
		
		//格式化性别
		self.formatSex = ko.computed(function(){
			if (!self.sex()) return;
			return self.sex()['value'] == '1' ? '女': '男';
		});
	};


	var store = new Store("employees"),
		sexOptions=[{name: '女', value: '1'}, {name: '男', value: '0'}];


	var EmployeeViewModel = function(){
		var self = this;

		self.sexOptions=sexOptions;

		//获取所有的记录
		self.employees = ko.observableArray($.map(store.findAll(), function(item){
			return new Employee({
				id: item.id, 
				username: item.username, 
				sex: self.sexOptions[item.sex] , 
				age: item.age, 
				position: item.position
			});
		}));


		//增加一条记录
		self.addEmployee = function(emp){
			self.employees.push(emp);
			var obj ={
				id: emp.id,
				username: emp.username(),
				sex: emp.sex()['value'],
				age: emp.age(),
				position: emp.position()
			}
			//存到本地存储
			store.create(obj);
		}


		//删除一条记录
		self.removeEmployee = function(emp){
			self.employees.destroy(emp);
			store.destroy({id: emp['id']});
		}


		//显示编辑框
		self.showInput = function(emp, event){
			$(event.currentTarget).addClass("editing").find("input,select").focus();
		}

		//隐藏编辑框
		self.hideInput = function(emp, event){
			$(event.currentTarget).parents("td").removeClass("editing");
			//更新记录
			store.update({
				id: emp['id'],
				username: emp.username(),
				sex: emp.sex()['value'],
				position: emp.position(),
				age: emp.age()
			});
		}

	}


	//整个应用视图
	var AppViewModel = function(){
		var self = this;
		self.username = ko.observable();
		self.age = ko.observable();
		self.position = ko.observable();
		self.sexOptions=sexOptions;
		self.sex = ko.observable(self.sexOptions[1]);

		//增加一条记录
		self.addEmployee = function(emp){
			if (isNaN(emp.age()) || emp.age() == ''){
				alert("年龄必须为数字且不能为空！")
				return;
			}
			employeeModel.addEmployee(new Employee({
				username: emp.username(),
				sex: emp.sex()['value'],
				age: emp.age(),
				position: emp.position()
			}));
			self.clearForm();
		}

		//清空表单
		self.clearForm = function(){
			self.username('');
			self.age('');
			self.position('');
		}

	}

	var employeeModel = new EmployeeViewModel(),
		appModel = new AppViewModel();


	//视图绑定


	ko.applyBindings({appModel: appModel, employeeModel: employeeModel});

	var end =new Date().getTime();

	console && console.log(end-start);
	
}
