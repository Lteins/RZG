{% extends "../layouts/default.swig" %}

{% block content %}
	<div class="container">
		<div class="jumbotron">
			<h2>{% if user %} 你好！ {{ user.name.first }} {{ user.name.last }}! {% endif %} 欢迎来到融掌柜</h2>
		 		<hr>
			{% if user  %}
				<p>
					<a href="/charge" class="btn btn-lg btn-primary">账号充值</a>
				</p>
			{% else %}
			 	<p>
					<a href="/join" style="margin-right: 10px" class="btn btn-lg btn-primary">创建账号</a>
					以购买商品
				</p>
			{% endif %}
			<hr>
		</div>
	</div>
    <div class = 'container'>
    <div style="vertical-align: middle;"class="panel panel-primary">
        
    <div class="img" id="slider" style = "background: lightyellow; width:100%">
        <figure >
            <img class="imgs" style="width:100%; height: 300px;" src="fat1.jpg">
            <img class="imgs" style="width:100%; height: 300px;" src="fat2.jpg">
            <img class="imgs" style="width:100%; height: 300px;" src="fat3.jpg">

            <img class="imgs" style="width:100%; height: 300px;" src="fat1.jpg">
            <img class="imgs" style="width:100%; height: 300px;" src="fat2.jpg">
        </figure>
    </div>
    </div>
    </div>

{% if user.ismember %}

<div class="container">
  <div class="panel panel-primary">
  <div class="panel-heading">批发商品</div>  <br>
  {% for row in data.row %}
      {% include 'row.swig' %}
  {% endfor %}
  </div>         
</div>
{% endif %}

<div class="container">
  <div class="panel panel-primary">
  <div class="panel-heading">零售市场</div>  <br>
  {% for row in data.row %}
      {% include 'retail_row.swig' %}
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