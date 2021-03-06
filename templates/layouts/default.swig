{% import "../mixins/flash-messages.swig" as FlashMessages %}

<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">

		
        <title>{{ title|default("融掌柜") }}</title>
		<link rel="shortcut icon" href="RZG.png" type="image/x-icon">

		{# Customise the stylesheet for your site by editing /public/styles/site.less
		//- All .less files will be automatically compiled and minified in production. #}
		<link href="/styles/site.min.css" rel="stylesheet">
        <link href="/styles/incticket.css" rel="stylesheet">

		{# This file provides the default styling for the KeystoneJS Content Editor #}
		{%- if user and user.canAccessKeystone -%}
			<link href="/keystone/styles/content/editor.min.css" rel="stylesheet">
		{%- endif -%}
        
        <link rel="stylesheet" href="/styles/font-awesome.min.css">
        <link rel="stylesheet" href="/styles/demo.css">


		{# HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries
		   Safely remove this block if you are not targeting IE8 #}
		<!--[if lt IE 9]>
			<script src="//cdn.jsdelivr.net/html5shiv/3.7.3/html5shiv.js"></script>
			<script src="//cdn.jsdelivr.net/respond/1.4.2/respond.min.js"></script>
		<![endif]-->

		{# Include template-specific stylesheets by extending the css block #}
		{%- block css %}{% endblock -%}

		{# Add any other template-specific HEAD tags by extending the head block #}
		{%- block head %}{% endblock %}
	</head>
	<body>

		{# HEADER #}
        <div class="big-logo">
            <img id="biglogo" src="RZG2.png">
        </div>
		<div id="header" class="container">

			{# Customise your site"s navigation by
             changing the navLinks Array in ./routes/middleware.js
			   ... or completely change this header to suit your design. #}
			<div role="navigation" class="navbar navbar-default">
				<div class="container-fluid">
					<div class="navbar-header">
						<button class="navbar-toggle" type="button" data-toggle="collapse" data-target=".navbar-collapse">
							<span class="sr-only">Toggle navigation</span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
						</button>
						<a class="navbar-brand" href="/"><img class="logo" src="RZG2.png"></a>
					</div>
					<div class="collapse navbar-collapse">
						<ul class="nav navbar-nav navbar-left">
							{%- for link in navLinks -%}
								{%- set linkClass = '' -%}
								{%- if link.key == section -%}
									{%- set linkClass = ' class="active"' -%}
								{%- endif %}
								<li{{ linkClass | safe }}>
									<a href="{{ link.href }}">{{ link.label }}</a>
								</li>
                               
							{%- endfor %}
						</ul>
                        <form class="navbar-form navbar-left" role="search" action="/search" method="GET">
                            <div class="form-group">
                            <input type="text" class="form-control" id="keywords" name="keywords" placeholder="搜索商品">
                            </div>
                            <button type="submit" class="btn btn-default">搜索</button>
                        </form>
						<ul class="nav navbar-nav navbar-right">
							{% if user %}
                                <li><a href="/signout">登出</a></li>
                                <li><a href="/showuser">个人中心</a></li>
                            {% else %}
                                <li><a href="/join">注册账号</a></li>
                                <li><a href="/signin">登入</a></li>
                            {% endif %} 
						</ul>
					</div>
				</div>
			</div>
		</div>

		{# BODY #}
		<div id="body">
			{# NOTE:
			   There is no .container wrapping class around body blocks to allow more flexibility in design.
			   Remember to include it in your templates when you override the intro and content blocks! #}

			{# The Intro block appears above flash messages (used for temporary information display) #}
			{%- block intro -%}{%- endblock -%}

			{# Flash messages allow you to display once-off status messages to users, e.g. form
			   validation errors, success messages, etc. #}
			{{ FlashMessages.renderMessages(messages) }}

			{# The content block should contain the body of your template"s content #}
			{%- block content -%}{%- endblock -%}
		</div>

		{# FOOTER #}
		<div id="footer" class="container">
			{# You don"t _have_ to include a link saying your site is powered by KeystoneJS, but we appreciate it! #}
			{# <p>Powered by <a href="http://keystonejs.com" target="_blank">KeystoneJS</a>.</p> #}
            <p>Copyright © 2017 常容科技文化 地址：深圳市深南中路3003号北方工业大厦1109 服务热线：0755-83278125</p>
		</div>

		{# JAVASCRIPT #}

		{# jQuery 1.11.3 is included by default, and required by both Bootstrap
			and the KeystoneJS Content Editor. If you are not targeting IE8,
			you can upgrade to 2.1.4 (also bundled) for better performance. #}
		<script src="/js/jquery/jquery-1.11.3.min.js"></script>
		

		{# Customise which Bootstrap javascript files are served by including
			them specifically here, instead of bootstrap-3.3.5.min.js #}
		<script src="/js/bootstrap/bootstrap-3.3.5.min.js"></script>

		{# The KeystoneJS Content Editor provides support for ks-editable data attributes,
			which generate links to edit content for users who can access Keystone #}
		{% if user and user.canAccessKeystone -%}
			<script src="/keystone/js/content/editor.js"></script>
		{%- endif -%}

		{# Add scripts that are globally required by your site here. #}
		<script src="/js/socket/socket.io.js"></script>
		{# Include template-specific javascript files by extending the js block #}
		{%- block js -%}{%- endblock -%}
	</body>
</html>
