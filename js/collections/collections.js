//Collections

App.Collections.Votes = Backbone.Collection.extend({
	model: App.Models.Vote,
	url: 'ajax_votes.php'//App.ajax_url
});