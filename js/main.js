(function(){

	window.App = {
		ajax_url: 'ajax_votes',
		utils: {
			spinner: {
				html: '<img id="spinner" src="img/spinner.gif"></img>', 
				show: function(){
					$('.page').children().hide(); 
					$('.page').append(App.utils.spinner.html);
				},
				hide: function(){
					$('.page').find('#spinner').remove();
					$('.page').children().show(); 
					}
				},
			messages: {
				showMessage: function(messageArea, message){
					var closeTime = 7000,
						last;
					last = $(messageArea).append(message)
											.children()
											.last()
											.append('<button type="button" class="close" data-dismiss="alert">&times;</button>')
											.hide()
											.slideDown();

					setTimeout(function(){
						last.slideUp('slow');
					}, closeTime);
				}
			},
			randomNumber: function(num, zero){
						if( zero ){
							var result = Math.round( Math.random() * num );
							return result;
						}
						else{
							num -= 1;
							var result = Math.round( Math.random() * num ) + 1;
							return result;
						}
					},
			randomColor: function(){
				var AppUtils = App.utils;
				rand_color = 'rgb('+ AppUtils.randomNumber(255) +','+ AppUtils.randomNumber(255) +','+ AppUtils.randomNumber(255) +')';
				
				return rand_color;
			}

		},
		Models: {},
		Collections: {},
		Views: {},
		Router: {},

		votes_page: 0,
		ajax_limit_votes: 10, //колво строк загружаемых аяксом

		initialize_collection: function(){
			App.Collections.votes = new App.Collections.Votes();
			App.utils.spinner.show();
			App.Collections.votes.fetch({data:{
				last_id: 999999,
				page: 1,
				request: 'getVotes',
			}}).then(function(){
				App.Views.votes = new App.Views.Votes({ collection: App.Collections.votes });
				App.router = new App.Router();
				App.utils.spinner.hide();
				Backbone.history.start();
			});
		}
	}

	window.vent = _.extend({}, Backbone.Events);
}());

$(document).ready(function(){
	App.initialize_collection();
});
