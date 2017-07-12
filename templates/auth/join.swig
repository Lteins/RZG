{% extends "../../layouts/default.swig" %}

{% block content %}
<div class="container">
    <div class="panel panel-primary">
    <div class="panel-heading">Create An Account At IncTicket</div>
    <div class="panel-body">
     <div class="col-md-6">
    <form  id = 'form1' action="/join" method="post" class="form-horizontal">
					<input type="hidden" name="action" value="join">
					 
                  <fieldset>
                  <div class="form-group required">
                      <label class="col-md-4 control-label">用户名*</label>
                      <div class="col-md-8">
                        <input class="form-control" id="username" placeholder="Pick a user name" name="username" type="text" value="{{form.username}}">
                      </div>
                    </div>
					<div class="form-group required">
                      <label class="col-md-4 control-label">名字*</label>
                      <div class="col-md-8">
                        <input class="form-control" id="firstname" placeholder="First name" name="firstname" type="text" value="{{form.firstname}}">
                      </div>
                    </div>
					<div class="form-group required">
                      <label class="col-md-4 control-label">姓氏*</label>
                      <div class="col-md-8">
                        <input class="form-control" id="lastname" placeholder="Last name" name="lastname" type="text" value="{{form.lastname}}">
                      </div>
                    </div>
					<div class="form-group required">
                      <label class="col-md-4 control-label">邮箱地址*</label>
                      <div class="col-md-8">
                        <input class="form-control" id="email" placeholder="Email address" name="email" type="email" value="{{form.email}}">
                      </div>
                    </div>
					<div class="form-group required">
                      <label class="col-md-4 control-label">密码*</label>
                      <div class="col-md-8">
                        <input class="form-control" id="password" name="password" placeholder="password" type="password">
                      </div>
                    </div> 

          <div class="form-group required">
                      <label class="col-md-4 control-label">快递地址*</label>
                      <div class="col-md-8">
<!--                         <input class="form-control" id="address" name="address" placeholder="Your Address" type="password">
 -->                      
                    <select name="province" style="width:130px;"></select>
                    <select name="city" style="width:130px;"></select>
                    </div>
                    </div> 

					<div class="form-group">
                      <label class="col-md-4 control-label"></label>
                      <div class="col-md-8">
                        
                        <div style="clear:both"></div>
                            <button class="btn btn-primary" type="submit">Join</button> 
					    </div>
							 
							
							
                    </div>
					  
                
                  </fieldset>
                </form>
                </div>
 </div>
  </div>
</div>                
 {% endblock %}


{%- block js -%}
<script type="text/javascript">
  $().ready(function(){
    console.log('Something');
  });
</script>
{%- endblock -%}