// Global App View

App.Views.App = Backbone.View.extend({
	initialize: function(){
		//var addVote = new App.Views.addVote({ collection: App.votes });

		var allVotes = new App.Views.Votes({ collection: App.votes }).render();

		//$('#votes_table').append(allVotes.el); // append tbody to table
	}
});
