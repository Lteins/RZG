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
        </ul>
        <div class="panel-footer"></div>
        </div>
         
	</div>
{% endblock %}