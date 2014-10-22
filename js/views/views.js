//Views

// Global App View

App.Views.App = Backbone.View.extend({
	initialize: function(){
		var addVote = new App.Views.addVote({ collection: App.votes });

		var allVotes = new App.Views.Votes({ collection: App.votes }).render();

		$('#votes_table').append(allVotes.el); // append tbody to table
	}
});

// allVotes View

App.Views.Votes = Backbone.View.extend({
	tagName: 'tbody',
	ajax_running: false,

	initialize: function(){
		var votes = this.collection;
		var _this = this;
		var my = function(){
			_this.chekScroll();
		}
		votes.on('add', this.addOne, this);
		$(window).scroll(my);
	},
	events:{
		'click #test_btn':'load',
		'click tr': 'load'
	},



	render: function(){
		this.collection.each(this.addOne, this);
		return this;
	},
	addOne: function(vote){
	//	console.log(this.collection);
		var singleVote = new App.Views.Vote({ model: vote });
		this.$el.append( singleVote.render().el );
	},
	load: function(){
		if(this.ajax_running){
			return;
		}
		this.ajax_running = true;
		console.log('load');
		var _votes_table = this;
		var last_id = this.collection.last().id; // last model id
		var limit = App.ajax_limit_votes; // how much items load






		$.ajax({
			type: "get",
			url: App.ajax_url,
			data:({
				'fromId': last_id,
				'limit': limit
				}),
			success: function(data){	
					$.each(data, function(){
						_votes_table.collection.add(this)						
					})
			},
			complete: function(){
				console.log('complete');
				_votes_table.ajax_running = false;
			}
		});
	},



	chekScroll: function(){
		var votes_table = $('#votes_page');
		console.log(votes_table[0].scrollHeight - votes_table.height() - votes_table.scrollTop());
		if(votes_table[0].scrollHeight - votes_table.height() - votes_table.scrollTop() <= 0){
			this.load();
		}
		
	}
});

// Single Vote View

App.Views.Vote = Backbone.View.extend({
	tagName: 'tr',
	template: _.template($('#votes_tr_tpl').html()),

	render: function(){
		this.$el.html( this.template( this.model.toJSON() ) );
		return this;
	}
});







// AddVote View

App.Views.addVote = Backbone.View.extend({
	el: '#add_vote_form',
	initialize: function(){

	},
	events: {
		'submit' : 'add_vote',
		'click #add_variant' : 'add_variant',
		'click .remove_variant' : 'remove_variant',
	},

	add_vote: function(e){
		console.log('start func');
		e.preventDefault();
		var variants = new Array();

		$('.variant').each(function(){
			variants.push($(this).val());
		});
		var added_collection = this.collection.create({
		//	id: this.collection.last().id + 1,
			name: this.$('#name').val(),
			question: this.$('#question').val(),
			variants: variants
		});
		console.log(added_collection);
	},
	toggleDelBtn: function(){
			var remove_icons = $('.remove_variant');
			if(remove_icons.length > 2){
				remove_icons.removeClass('hide');
			}
			else {
				remove_icons.addClass('hide');
			}

	},
	add_variant: function(){
		var variant_counter = $('.variant').length + 1;
		var variant_template = '<div class="input-append"><div><input type="text" class="variant" placeholder="Вариант ' + variant_counter + '"><button class="btn hide remove_variant"><span class="icon-remove-sign"></span></button></div></div>';
		$(variant_template).appendTo('#variants');

		this.toggleDelBtn();
	},
	remove_variant: function(e){
		e.target.parentNode.remove();
		this.toggleDelBtn();
	},
});
/*
,
	render: function(){
		var template = _.template($('#votes-template').html(), {votes: this.collection.models});
		this.$el.html(template);
	},


	
		<script src="text/template" id="votes-template">
				<div class="page-header">
					<h1>Голосования</h1>
				</div>
				<table id="votes_table" class="table-striped">
					<thead>
						<tr>
							<th>id</th>
							<!-- <th>Название</th> -->
							<th>Вопрос</th>
							<th>кнопка</th>
						</tr>
					</thead>
					<tbody>
						<% _.each(votes, function(vote) { %>			
							<tr>
								<td><%= vote.get('id') %></td>
								<!-- <td><%= vote.get('name') %></td> -->
								<td><%= vote.get('question') %></td>
								<td><a href="#" role="button" class="btn">Открыть</a></td>
							</tr>
						<% }) %>
					</tbody>
				</table>
		</script>
*/