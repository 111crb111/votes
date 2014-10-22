//Collections

App.Collections.Votes = Backbone.Collection.extend({
	model: App.Models.Vote,
	url: 'ajax_votes',
	comparator: function(model) {
		return -model.get('id');
	}
});