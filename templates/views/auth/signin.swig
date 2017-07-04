{% extends "../../layouts/default.swig" %}

{% block content %}

<div class="container">
    <div class="panel panel-primary">
    <!-- Default panel contents -->
    <div class="panel-heading">登录荣掌柜</div>
    <div class="panel-body">

    <div class="col-md-4">
    <form role="form" action="/signin" method="post">
     <div class="form-group">
        <label for="sender-email" class="control-label">邮箱地址:</label>
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

    </form>
    </div>
    </div>
    </div>
</div>
 {% endblock %}