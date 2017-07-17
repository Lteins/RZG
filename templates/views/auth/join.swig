{% extends "../../layouts/default.swig" %}

{% block content %}
<div class="container">
    <div class="panel panel-primary">
    <div class="panel-heading">注册会员</div>
    <div class="panel-body">
     <div class="col-md-6">
    <form id='form1' action="/join" method="post" class="form-horizontal">
					<input type="hidden" name="action" value="join">
					 
                  <fieldset>
                  <div class="form-group required">
                      <label class="col-md-4 control-label">用户名*</label>
                      <div class="col-md-8">
                        <input class="form-control" id="username" placeholder="输入用户名" name="username" type="text" value="{{form.username}}">
                      </div>
                    </div>

					<div class="form-group required">
                      <label class="col-md-4 control-label">名*</label>
                      <div class="col-md-8">
                        <input class="form-control" id="firstname" placeholder="输入名字" name="firstname" type="text" value="{{form.firstname}}">
                      </div>
                    </div>

					<div class="form-group required">
                      <label class="col-md-4 control-label">姓*</label>
                      <div class="col-md-8">
                        <input class="form-control" id="lastname" placeholder="输入姓" name="lastname" type="text" value="{{form.lastname}}">
                      </div>
                    </div>
					<div class="form-group required">
                      <label class="col-md-4 control-label">Email 地址*</label>
                      <div class="col-md-8">
                        <input class="form-control" id="email" placeholder="输入 Email 地址" name="email" type="email" value="{{form.email}}">
                      </div>
                    </div>

					<div class="form-group required">
                      <label class="col-md-4 control-label">密码*</label>
                      <div class="col-md-8">
                        <input class="form-control" id="password" name="password" placeholder="设置密码" type="password">
                      </div>
                    </div> 

          <div class="form-group required">
            <label class="col-md-4 control-label">联系电话*</label>
            <div class="col-md-8">
              <input class="form-control" id="phone" name="phone" placeholder="手机号码" type="tel">
            </div>
          </div> 

          <div class="form-group required">
            <label class="col-md-4 control-label">快递地址*</label>
            <div class="col-md-8">
                        <input class="form-control" id="address" name="address" placeholder="收货人地址" type="text">
                        <input class="form-control" id="prepage" name="prepage" value="{{data.prepage}}" type="String">                        
            </div>
          </div> 

					<div class="form-group">
                      <label class="col-md-4 control-label"></label>
                      <div class="col-md-8">
                        
                        <div style="clear:both"></div>
                            <button class="btn btn-primary" type="submit">注册</button> 
					    </div>
							 
							
							
                    </div>
					  
                
                  </fieldset>
                </form>
                </div>
 </div>
  </div>
   </div>                
 {% endblock %}

