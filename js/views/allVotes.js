// allVotes View

App.Views.Votes = Backbone.View.extend({
	tagName: 'tbody',
	ajax_url: 'ajax_votes',
	ajax_running: false,
	page: 2, // first page load in app initialization

	initialize: function(){
		that = this;
		App.Collections.votes.on('add', function(){
			that.render()
		});
		$(window).scroll($.proxy(this.chekScroll, this));
		$('#more_votes').on('click', this.nextPage())
	},
	events:{

	},
	render: function(){
		this.$el.empty();
		this.collection.each(this.addOne, this);
		var template = _.template($('#votes_page_tpl').html(), { 'tbody':this.$el.html() })
		$('.page').html(template);
	},
	addOne: function(vote){
		var tr = new App.Views.Votes.TR({ model: vote });
		this.$el.append( tr.render().$el );
	},
	load: function(){
		if(this.ajax_running){
			return;
		}
		this.ajax_running = true;
		var _votes_table = this;
			last_id = this.collection.last().id, // last model id
			page = this.page, // how much items load

		this.page += 1;

		$.ajax({
			type: "get",
			url: this.ajax_url,
			data:({
				'last_id': last_id,
				'page': page
				}),
			success: function(data){	
					$.each(data, function(){
						_votes_table.collection.add(this)						
					})
			},
			complete: function(){
				_votes_table.ajax_running = false;
			}
		});
	},
	chekScroll: function(){
		var page = $('html');
		if(page[0].scrollHeight - page.height() - page.scrollTop() <= 0){
			this.load();
		}
	},
	nextPage: function(){
		this.load();
	}
});
