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
                <p>状态</p>
           </td>


           <td>
                <p>成交量</p>
           </td>

           <td>
                <p>成交价格</p>
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
{% endblock %}