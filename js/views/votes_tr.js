// Single Vote View

App.Views.Votes.TR = Backbone.View.extend({
	tagName: 'tr',
	events: {
		
	},
	render: function(){
		this.$el.html( _.template( $('#votes_tr_tpl').html(), this.model.toJSON() ) );
		return this;
	}
});
