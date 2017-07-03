{% extends "../../layouts/default.swig" %}

{% block content %}

	<div class="container">
    {#
        This is a comment.
    #}
		<div class="panel panel-primary">
        <!-- Default panel contents -->
        <div class="panel-heading">User details - {{data.user.username}}
        </div>
        <ul class="ticket-meta">
        <li>
            <small>Username</small><a href="" rel="tag">{{data.user.username}}</a>
        </li>
        <li>
            <small>First Name</small><a href="" rel="tag">{{data.user.name.first}}</a>
        </li>
        <li>
            <small>Last Name</small><a href="" rel="tag">{{data.user.name.last}}</a>
        </li>
        </ul>
        <div class="panel-footer"></div>
        </div>
         
	</div>
{% endblock %}