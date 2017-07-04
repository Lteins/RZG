{% extends "../../layouts/default.swig" %}

{% block content %}

<div class="container">
    <div class="panel panel-primary">
    <!-- Default panel contents -->
    <div class="panel-heading">会员登录</div>
    <div class="panel-body">

    <div class="col-md-4">
    <form role="form" action="/signin" method="post">
     <div class="form-group">
        <label for="sender-email" class="control-label">Email:</label>
        <div class="input-icon">  
        <input class="form-control email" id="signin-email" placeholder="you@mail.com" name="email" type="email" value="">
        </div>
    </div>
    <div class="form-group">
        <label for="user-pass" class="control-label">密码:</label>
        <div class="input-icon"> 
        <input type="password" class="form-control" placeholder="Password" name="password" id="password">
        </div>
    </div>
    <div class="form-group">
        <input type="submit" class="btn btn-primary " value="登录">    <br/>
        <a href='/forgotpassword' class="forget-pass">忘记密码</a>
    </div>
    </form>
    </div>
    </div>
    </div>
</div>
 {% endblock %}