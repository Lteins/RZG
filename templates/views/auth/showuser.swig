{% extends "../../layouts/default.swig" %}

{% block content %}

	<div class="container">
    {#
        This is a comment.
    #}
		<div class="panel panel-primary">
        <!-- Default panel contents -->
        <div class="panel-heading">我的帐号 - {{data.user.username}}
        </div>
        <ul class="ticket-meta">
        <li>
            <small>用户名</small>{{data.user.username}}
        </li>
        <li>
            <small>名</small>{{data.user.name.first}}
        </li>
        <li>
            <small>姓</small>{{data.user.name.last}}
        </li>
        <li>
            <small>账户余额</small>{{data.user.capital}}
        </li>
        </ul>

        <p id = "user_id" style="display: none">{{user.id}}</p>
        <p id = "ismember" style="display: none">{{user.ismember}}</p>

        <div class="panel-footer"></div>
        </div>
         
	</div>

    <div class="container">
        <div class="panel panel-primary">
        <!-- Default panel contents -->
        <div class="panel-heading">成交记录</div>

        <!-- Table -->
        <table id = 'transaction_list' class="table  table-striped">
        <tr>
            <td>
                <p>产品</p>
           </td>

           <td>
                <p>成交量</p>
           </td>

           <td>
                <p>成交价格</p>
           </td>

            <td>
                <p>进货/出货</p>
           </td>
               
        </tr>
            {% for transaction in data.ledger %}
               {% include 'transaction.swig' %}
            {% endfor %}
        </table>

        <div class="panel-footer">
        </div>
        </div>
         
    </div>

    <div class="container">
        <div class="panel panel-primary">
        <!-- Default panel contents -->
        <div class="panel-heading">库存</div>

        <!-- Table -->
        <table id = 'book_list' class="table  table-striped">
        <tr>
            <td>
                <p>产品</p>
           </td>

           <td>
                <p>数量</p>
           </td>
        </tr>
            {% for book in data.inventory %}
               {% include 'book.swig' %}
            {% endfor %}
        </table>

        <div class="panel-footer">
        </div>
        </div>
         
    </div>

    {%if !user.ismember%}
    <div class="container">
        <div class="panel panel-primary">
        <!-- Default panel contents -->
        <div class="panel-heading">竞价纪录</div>

        <!-- Table -->
        <table id = 'bidding_list' class="table  table-striped">
        <tr>
            <td>
                <p>产品</p>
           </td>

           <td>
                <p>数量</p>
           </td>

           <td>
                <p>价格</p>
           </td>
        </tr>
            {% for bidding in data.biddings %}
               {% include 'bidding.swig' %}
            {% endfor %}
        </table>

        <div class="panel-footer">
        </div>
        </div>
         
    </div>
    {%endif%}
{% endblock %}

{%- block js -%}
<script type="text/javascript">
var socket = io('/users');
 
  function recall_bid(id){
      socket.emit('recall_bid', id);
  };


  $().ready(function(){
      
      socket.on('request_id', function(){

         socket.emit('submit_id', $('#user_id')[0].innerHTML);
      });



    socket.on('new_bidding_list',function(bidding_list){
      console.log('Receive new bidding_list');
      var bidding_list_content = '<tr><td><p>竞价产品</p></td><td> <td><p>竞标数量</p></td><td><p>竞标价格</p></td></tr>';

      if ($('#ismember')[0].innerHTML == 'true'){
        if (bidding_list != null){
          for (var i = 0;i< bidding_list.length;i++){
            bidding_list_content = bidding_list_content + "<tr><td> <div class='col-md-1'><span class='label label-info pull-left'> " + bidding_list[i].product.name + "</span> </div></td><td> <td><div class='col-md-1'><span class='label label-info pull-left'>" + bidding_list[i].num + "</span></div></td><td><div class='col-md-1'><span class='price label label-info pull-left'>" + bidding_list[i].price+"</span></div></td></tr>";
          }
        }
      }else{
        if (bidding_list != null){
          for (var i = 0;i< bidding_list.length;i++){
            bidding_list_content = bidding_list_content + "<tr><td> <div class='col-md-1'><span class='label label-info pull-left'> " + bidding_list[i].product.name + "</span> </div></td><td> <td><div class='col-md-1'><span class='label label-info pull-left'>" + bidding_list[i].num + "</span></div></td><td><div class='col-md-1'><span class='price label label-info pull-left'>" + bidding_list[i].price+"</span></div></td>" +"<td><button id =" + bidding_list[i]._id + " onclick = 'recall_bid(this.id)'>取消交易</button></td>" + "</tr>";
          }
        }
      }
      $('#bidding_list')[0].innerHTML = bidding_list_content;
    });

    socket.on('new_transaction', function(transaction){
      console.log('Receive new_transaction');
      var new_content = "<tr class='transaction'><td><div class='col-md-1'><span class='label label-info pull-left'>" + transaction.product + "</span></div></td><td><div class='col-md-1'><span class='label label-info pull-left'>" + transaction.num + "</span></div></td><td><div class='col-md-1'><span class='label label-info pull-left'>" + transaction.price + "</span></div></td><td><div class='col-md-1'><span class='label label-info pull-left'>" + transaction.direction +"</span></div></td></tr>";

      $('#transaction_list')[0].innerHTML =  $('#transaction_list')[0].innerHTML + new_content;
    });

    socket.on('new_book_list', function(books){
      console.log('Receive new books');
      var list_content = '<tr><td><p>产品</p></td> <td><p>数量</p></td></tr>';
      if (books != null){
        for (var i = 0;i< books.length;i++){
          list_content = list_content + "<tr class='book'><td><div class='col-md-1'><span class='label label-info pull-left'> " + books[i].product.name + "</span></div></td> <td><div class='col-md-1'><span class='label label-info pull-left'>" + books[i].num + "</span> </div></td><td><button>提取</button></td></tr>";
        }
      }
      $('#book_list')[0].innerHTML = list_content;
    });
  });
</script>
{%- endblock -%}