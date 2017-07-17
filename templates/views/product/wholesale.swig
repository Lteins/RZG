{% extends "../../layouts/default.swig" %}

{% block content %}
    <div class="container">
        <div class="jumbotron">
            <h2>{{data.product.name}}</h2>
                <hr>
            <p>描述: {{data.product.description}}</p>
            <p id = "num_left">剩余数量: {{data.product.num}}</p>
            <p id = "base">底价: </p>
            <p id = "product_id" style="display: none">{{data.product.id}}</p>
            <p id = "user_id" style="display: none">{{user.id}}</p>
         
            <hr>
          {% if user  %}
          <form action="/wholesale/{{data.product.id}}" name= "bidding_form" method="post" class="form-horizontal" onsubmit="return submitForm()">
          <input type="hidden" name="action" value="join">
          <fieldset>
          <div class="form-group required">
              <label class="col-md-4 control-label">交易量*</label>
              <div class="col-md-8">
                <input class="form-control" placeholder="请输入交易量" required="required" name="num" type="Number" value="{{form.num}}">

                <input class="form-control" required="required" name="user_id" type="String" value="{{user.id}}">
                <input class="form-control" required="required" name="product_id" type="String" value="{{data.product.id}}">
              </div>
          </div>

          <div class="form-group">
                      <label class="col-md-4 control-label"></label>
                      <div class="col-md-8">
                        
                        <div style="clear:both"></div>
                            <button class="btn btn-primary" type="submit">购买</button> 
              </div>     
                    </div>
                  </fieldset>
          </form>

          <hr>
          {% endif %}
        </div>
    </div>

{% endblock %}

{%- block js -%}
<script type="text/javascript">
   var socket = io('/' + $('#product_id')[0].innerHTML);


  function validateForm(){
    if (document.forms["bidding_form"]["num"].value > parseInt($('#num_left')[0].innerHTML.match(/[0-9]+/g)[0])){
      alert('库存不够!');
      return false;
    }else{
      return true;
    }
 }  
  function submitForm(){
  return validateForm();
  } 
  

  $().ready(function(){
    socket.on('storage_update', function(num){
      $('#num_left')[0].innerHTML = "剩余数量 "+ num;
    })
  });
</script>
{%- endblock -%}