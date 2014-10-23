// AddVoteForm View

App.Views.addVoteForm = Backbone.View.extend({
	el: '#add_vote_form',
	initialize: function(){

	},
	events: {
		'submit' : 'add_vote',
		'click #add_variant' : 'add_variant',
		'click .remove_variant' : 'remove_variant',
	},

	add_vote: function(e){
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
