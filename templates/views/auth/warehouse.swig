{% extends "../../layouts/default.swig" %}

{% block content %}

    <div class="container">
        <div class="panel panel-primary">
        <!-- Default panel contents -->
        <div class="panel-heading">成交记录</div>

        <!-- Table -->
        <table id = 'transaction_list' class="table  table-striped">
        <tr>
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
