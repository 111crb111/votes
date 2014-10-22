//router

App.Router = Backbone.Router.extend({
	routes: {
		'': 'index',
		'createvote': 'createvote',
		'votes': 'votes',
		'votes/:query': 'singleVote'

	},
	index: function(){
		console.log('index');
		var template = _.template($('#home_tpl').html());
		$('.page').html(template);
	},
	createvote: function(){
		console.log('addvote_ROUTE');

		if(App.Views.createvote){ 
			App.Views.createvote.remove();
		}
		var template = _.template($('#createvote_page_tpl').html());
		$('.page').html(template);
		App.Models.createvote = new App.Models.Createvote();
		App.Views.createvote = new App.Views.Createvote({ collection: App.Collections.votes });


	},
	votes: function(){	
		console.log('votes_ROUTE');
		App.Views.votes.render();
		//console.log(App.Views.votes.render);
	},
	singleVote: function(vote_id){
		console.log('vote_id = ' + vote_id);
		var routeHash = Backbone.history.getHash(),
			model = App.Collections.votes.get(vote_id), //singleVote model
			view; //singleVote view
		
		if(model['hasVariants'] == true){ // if model exist dont need ajax
			console.log('DONT NEED AJAX')
			view = new App.Views.SingleVote({ 'model': model });
			view.render();
		}
		else{ // if model not exist fetch ddata from server
			model['hasVariants'] = true;
			App.utils.spinner.show();
			$.ajax({
				type: "get",
				url: App.ajax_url+'/variant',
				data:({
						'parent_id':vote_id
					}),
				success: function(data){
					model.attributes.variants = []; // create variants array in current model
					for(index in data){
						model.attributes.variants.push({
							'id': data[index].id,
							'text': data[index].text,
							'voted': data[index].voted,
							'color': data[index].color
						});
					}	
					view = new App.Views.SingleVote({ 'model': model });
					if(routeHash === Backbone.history.getHash()){
						view.render();
					}
				},
				error: function(){
					console.log('ERRRORRRR on loading model with id = ' + vote_id);
				},
				complete: function(){
					App.utils.spinner.hide();
				}
			});
		}
	}
});