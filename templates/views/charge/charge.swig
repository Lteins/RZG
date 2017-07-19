{% extends "../../layouts/default.swig" %}

{% block content %}

<div class="container">
    <div class="panel panel-primary">
    <!-- Default panel contents -->
    <div class="panel-heading">会员充值</div>
    <div class="panel-body">

    <div class="col-md-4">
    <form role="form" action="/charge_submit" method="post">
     <div class="form-group">
        <label for="user-pass" class="control-label">充值金额:</label>
        <div class="input-icon"> 
        <input type="number" min="0.01" max="10000" class="form-control" placeholder="1~10000" name="total_amount" id="total_amount">
        </div>

        <div class="form-group">
        <label for="user-pass" class="control-label">充值金额:</label>
        <div class="input-icon"> 
         <select name="mode">
          <option id="PC" value ="PC">电脑支付</option>
          <option id="Mobile" value ="Mobile">手机支付</option>
        </select>
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

{%- block js -%}
<script type="text/javascript">
  $().ready(function(){
var sUserAgent= navigator.userAgent.toLowerCase(); 
var bIsIpad= sUserAgent.match(/ipad/i) == "ipad"; 
var bIsIphoneOs= sUserAgent.match(/iphone os/i) == "iphone os"; 
var bIsMidp= sUserAgent.match(/midp/i) == "midp"; 
var bIsUc7= sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4"; 
var bIsUc= sUserAgent.match(/ucweb/i) == "ucweb"; 
var bIsAndroid= sUserAgent.match(/android/i) == "android"; 
var bIsCE= sUserAgent.match(/windows ce/i) == "windows ce"; 
var bIsWM= sUserAgent.match(/windows mobile/i) == "windows mobile"; 

if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM){
    document.getElementById('Mobile').setAttribute('selected', 'selected');
}else{
    document.getElementById('PC').setAttribute('selected', 'selected');
}
  });
</script>
{%- endblock -%}