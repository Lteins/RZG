{% extends "../../layouts/default.swig" %}

{% block content %}

<div class="container">
    <div class="panel panel-primary">
    <!-- Default panel contents -->
    <div class="panel-heading">会员充值</div>
    <div class="panel-body">

    <div class="col-md-4">
    <form role="form" action="/charge" method="post">
     <div class="form-group">
        <label for="user-pass" class="control-label">充值金额:</label>
        <div class="input-icon"> 
        <input type="number" min="1" max="10000" class="form-control" placeholder="1~10000" name="total_amount" id="total_amount">
        </div>
     </div>

    <div class="form-group">
        <input type="submit" class="btn btn-primary " value="充值"> <br/>
    </div>
    </form>
    </div>
    </div>
    </div>
</div>
{% endblock %}