{% extends "../layouts/default.swig" %}

{% block content %}
	<div class="container">
		<div class="jumbotron">
			<h2>{% if user %} 你好！ {{ user.name.first }} {{ user.name.last }}! {% endif %} 欢迎来到融掌柜</h2>
		 		<hr>
			{% if user  %}
				<p>
					<a href="/createticket" class="btn btn-lg btn-primary">购买商品</a>
				</p>
			{% else %}
			 	<p>
					<a href="/join" style="margin-right: 10px" class="btn btn-lg btn-primary">创建账号</a>
					已购买商品
				</p>
			{% endif %}
			<hr>
		</div>
	</div>

    <div class="container img" id="slider">
        <figure>
            <img class="imgs" src="fat1.jpg">
            <img class="imgs" src="fat2.jpg">
            <img class="imgs" src="fat3.jpg">
        </figure>
    </div>

	<div class="container">
        <div class="panel panel-primary">
        <!-- Default panel contents -->
        <div class="panel-heading">商品一览</div>

        <!-- Table -->
        <table class="table  table-striped">
        <tr>
               <td>
                    <p>商品数量</p>
               </td>


               <td>
                    <p>商品名</p>
               </td>

               <td>
                    <p>商品描述</p>
               </td>
               
        </tr>
            {% for product in data.products %}
               {% include 'product.swig' %}
            {% endfor %}
        </table>

        <div class="panel-footer">
        </div>
      </div>

</div>

<div class="container">
  <div class="panel panel-primary">
  <div class="panel-heading">商品一览</div>  <br>
  {% for row in data.row %}
      {% include 'row.swig' %}
  {% endfor %}
  </div>         
</div>
{% endblock %}

{%- block js -%}
<script type="text/javascript">
  $().ready(function(){
    var socket = io();
    socket.on('news',function(data){
    console.log(data);
    })
  });
</script>
{%- endblock -%}