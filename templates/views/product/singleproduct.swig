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
            <p id = "ismember" style="display: none">{{user.ismember}}</p>
         
            <hr>
          {%if user%}
          {% if !user.ismember  %}
          <form action="/createBidding" name= "bidding_form" method="post" class="form-horizontal" onsubmit="return submitForm()">
          <input type="hidden" name="action" value="join">
          <fieldset>
          <div class="form-group required">
              <label class="col-md-4 control-label">交易量*</label>
              <div class="col-md-8">
                <input class="form-control" placeholder="请输入交易量" required="required" name="num" type="Number" value="{{form.num}}">
              </div>
          </div>

          <div class="form-group required">
              <label class="col-md-4 control-label">交易价格*</label>
              <div class="col-md-8">
                <input class="form-control" placeholder="请输入交易价格" required="required" name="price" type="Float" value="{{form.price}}">
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
          {% endif %}

        </div>
    </div>



    <div class="container">
        <div class="panel panel-primary">
        <!-- Default panel contents -->
        <div class="panel-heading">竞价纪录</div>

        <!-- Table -->
        <table id="bidding_list" class="table  table-striped">
        <tr>
               <td>
                    <p>竞价人</p>
               </td>

               <td> 

               <td>
                    <p>竞标数量</p>
               </td>

               <td>
                    <p>竞标价格</p>
               </td>
               
        </tr>
            {% for bidding in data.product.biddings %}
               {% include 'bidding.swig' %}
            {% endfor %}
        </table>
        <div class="panel-footer">
        </div>
        </div>
         
    </div>
{% endblock %}

{%- block js -%}
<script type="text/javascript">
  var socket = io('/' + $('#product_id')[0].innerHTML);

  function getbasePrice(){
    var price_tag = $('.price');
    var basePrice = Number.POSITIVE_INFINITY;
    for (var i = 0; i<price_tag.length;i++)
      basePrice = Math.min(basePrice, price_tag[i].innerHTML);

    basePrice = Math.min(basePrice, 0);
    
    return basePrice;
  }

  function validateForm(){
    if (document.forms["bidding_form"]["num"].value > parseInt($('#num_left')[0].innerHTML.match(/[0-9]+/g)[0])){
      alert('库存不够!');
      return false;
    }else{
      return true;
    }
 }  
  function submitForm(){
    if (validateForm()){
      var transaction_form = {
        price: document.forms['bidding_form']['price'].value,
        num: document.forms['bidding_form']['num'].value,
        product_id: $('#product_id')[0].innerHTML,
        user_id: $('#user_id')[0].innerHTML,
      };
      socket.emit('createBidding',transaction_form);
    }
    return false
  } 

  function accept_bid(id){
  console.log(id);
  var transaction = {
  bid_id: id,
  saler_id: $('#user_id')[0].innerHTML
  }
  socket.emit('acceptBidding', transaction);
  };

  $().ready(function(){

   

    $('#base')[0].innerHTML = "底价: " + getbasePrice() +"元";
    var tags = $('.transaction');
    var transaction_list = [];

    for (var i = 0; i<tags.length; i++){
      var spans = tags[i].getElementsByTagName('span');
      transaction_list.push({
        trader: spans[0].innerHTML,
        price: spans[1].innerHTML,
        num: spans[2].innerHTML
      });
    } 
    
    socket.on('new_bidding_list',function(bidding_list){
      console.log('Receive new bidding_list');
      var bidding_list_content = '<tr><td><p>竞价人</p></td><td> <td><p>竞标数量</p></td><td><p>竞标价格</p></td></tr>';

      if ($('#ismember')[0].innerHTML == 'false' || $('#ismember')[0].innerHTML == ''){
        if (bidding_list != null){
          for (var i = 0;i< bidding_list.length;i++){
            bidding_list_content = bidding_list_content + "<tr><td> <div class='col-md-1'><span class='label label-info pull-left'> " + bidding_list[i].bidder.username + "</span> </div></td><td> <td><div class='col-md-1'><span class='label label-info pull-left'>" + bidding_list[i].num + "</span></div></td><td><div class='col-md-1'><span class='price label label-info pull-left'>" + bidding_list[i].price+"</span></div></td></tr>";
          }
        }
      }else{
        if (bidding_list != null){
          for (var i = 0;i< bidding_list.length;i++){
            bidding_list_content = bidding_list_content + "<tr><td> <div class='col-md-1'><span class='label label-info pull-left'> " + bidding_list[i].bidder.username + "</span> </div></td><td> <td><div class='col-md-1'><span class='label label-info pull-left'>" + bidding_list[i].num + "</span></div></td><td><div class='col-md-1'><span class='price label label-info pull-left'>" + bidding_list[i].price+"</span></div></td>" +"<td><button id =" + bidding_list[i]._id + " onclick = 'accept_bid(this.id)'>接受交易</button></td>" + "</tr>";
          }
        }
      }
      $('#bidding_list')[0].innerHTML = bidding_list_content;
      $('#base')[0].innerHTML = "底价: " + getbasePrice() +"元";
    });



    socket.on('storage_update', function(num){
      $('#num_left')[0].innerHTML = num;
    })
  });
</script>
{%- endblock -%}