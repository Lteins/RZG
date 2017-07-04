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
            <small>用户名</small><a href="" rel="tag">{{data.user.username}}</a>
        </li>
        <li>
            <small>名</small><a href="" rel="tag">{{data.user.name.first}}</a>
        </li>
        <li>
            <small>姓</small><a href="" rel="tag">{{data.user.name.last}}</a>
        </li>
        </ul>
        <div class="panel-footer"></div>
        </div>
         
	</div>
{% endblock %}