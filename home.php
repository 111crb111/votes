<?php

echo "included home.php";
?>
<!DOCTYPE html>
<html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title>votes</title>
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<link rel="stylesheet" href="css/bootstrap.min.css">
		 <!--Latest compiled and minified CSS -->
		<!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">	
		<!-- Optional theme -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css">
		<link rel="stylesheet" href="css/main.css">

	</head>
	<body>
		<!--[if lt IE 7]>
			<p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
		<![endif]-->
		<div class="container-fluid" id="wrapper">
			<header class="navbar">
				<div class="navbar-inner">
					<a class="brand" href="#">Votes</a>
					<ul class="nav">
						<li>
							<a href="#votes">Голосования</a>
						</li>
						<li>
							<a href="#createvote">Создать голосование</a>
						</li>
					</ul>
				</div>
			</header>
			<div class="page">

			</div>
			<div id="push"></div>
		</div>
		<footer>
			<div class="container-fluid">
				<br/>
				<p class="pull-right muted credit">Subota Yaroslav &copy; 2014</p>
			</div>
		</footer>
		<section id="messagesArea_fixed">
			
		</section>
		<script src="js/vendor/jquery.js"></script>
		<script src="js/vendor/underscore.js"></script>
		<script src="js/vendor/backbone.js"></script>
		<script src="js/vendor/bootstrap.min.js"></script>
		<script src="js/mudules/jscolor/jscolor.js"></script>
		<script src="js/mudules/grafs.js"></script>

		<script src="js/main.js"></script>		
		<!-- Models -->	
			<script src="js/models/vote.js"></script>
			<script src="js/models/createvote.js"></script>
		<!-- Collections -->
			<script src="js/collections/votes.js"></script>
		<!-- Views -->
			<script src="js/views/allVotes.js"></script>
			<script src="js/views/votes_tr.js"></script>
			<script src="js/views/singleVote.js"></script>
			<script src="js/views/createvote.js"></script>

		<script src="js/router.js"></script>		

		<script type="text/template" id="home_tpl">
				<h1>Добро пожаловать на сайт голосований!</h1>
				<p class="hero-unit">Меня зовут Субота Ярослав Владимирович. Я сделал этот сайт для своего портфолио. Сервис голосований имеет самый минимальный функционал: <a href="#createvote">создание</a> голосований и <a href="#votes">просмотр</a> уже созданных.</p>
		</script>		
		<script type="text/template" id="votes_tr_tpl">
			<td><%= id %></td>
			<td><%= name %></td>
			<td><%= question %></td>
			<td><a href="#votes/<%= id %>" role="button" class="btn">Открыть</a></td>
		</script>
		<script type="text/template" id="votes_page_tpl">
				<div class="page-header">
					<h1>Голосования</h1>
				</div>
				<table id="votes_table" class="table table-striped">
					<thead>
						<tr>
							<th>#</th>
							<th>Название</th>
							<th>Вопрос</th>
						</tr>
					</thead>
					<%= tbody %>
				</table>
		</script>
		<script type="text/template" id="singleVote_page_tpl">
			<div id="single_vote_wrapper">
				<div class="page-header">
					<h3>#<%= id %> - <%= name %></h3>
				</div>
				<div class="page-content">
					<h4><%= question %></h4>
				</div>
				<div class="container-fluid">
				<div class="row">
					<div class="vote_variants_form col-md-4">
						<table id="single_vote_variants" class="table table-striped">
							<% for(var i = 0; i < variants.length; i += 1){ %>
								<tr class="single_vote_tr">
									<td><%= variants[i].text %></td>
									<td id="sv_bar">
										<div class="votes_amount_bar" style="width: <%= variants[i].bar_width %>%; background-color: <%= variants[i].color %>" ></div>
									</td>
									<% if(!is_voted){ %>
										<td>
											<input type="checkbox">
										</td>
									<% } %>
									<td><%= variants[i].voted %></td>
								</tr>
							<% } %>
						</table>
						<% if(!is_voted){ %>
							<input type="button" id="send_vote_<%= id %>" value="Голосовать" class="btn btn-primary btn-large" />
						<% } %>
						
					</div>
					<div class="col-md-8">
						<canvas id="vote_pie" width="300" height="300"></canvas>
					</div>
				</div>
			</div>
			</div>
		</script>
		<script type="text/template" id="createvote_page_tpl">
				<h1>Создать голосование</h1>
				<form id="create_vote_form" class="form-vertical">
					<div>
						<input type="text" id="name" placeholder="Название" required>
					</div>
					<div>
						<input type="text" id="question" placeholder="Вопрос" required>
					</div>
					<div>
						<span>Доступно вариантов</span>
						<select id="allowed_votes">
						</select> 
					</div>
					<a id="add_variant" class="btn">Добавить вариант</a><br>
					<div id="variants">

					</div>
					<input type="submit" class="btn btn-primary btn-large" value="Добавить голосование">
				</form>
		</script>
	</body>
</html>
