{% extends "../../layouts/default.swig" %}

{% block content %}

<div class="container">
    <div class="panel panel-primary">
    <!-- Default panel contents -->
    <div class="panel-heading">会员充值</div>
    <div class="panel-body">

    <div class="col-md-4">
    <form id="ali-form" action="https://openapi.alipay.com/gateway.do" method="get">
        <input name="app_id" value="2017071807795260">
        <input name="biz_content" value='{{data.biz_content}}'>
        <input name="return_url" value="{{data.return_url}}">
        <input name="notify_url" value="{{data.notify_url}}">  
        <input name="charset" value="{{data.charset}}">
        <input name="method" value="{{data.method}}">
        <input name="sign_type" value="{{data.sign_type}}">
        <input name="timestamp" value="{{data.timestamp}}">
        <input name="version" value="{{data.version}}">
        <input name="passback_params" value="{{data.passback_params}}">
        <input name="sign" value="{{data.sign}}">
        <input type="submit">
    </form>
    </div>
    </div>
    </div>
</div>
{% endblock %}