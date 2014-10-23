App.Views.Createvote = Backbone.View.extend({
	el: '#create_vote_form',

	initialize: function(){
		this.add_variant();
		this.add_variant();
	},
	events:{
		'submit' : 'create_vote',
		'click #add_variant' : 'add_variant',
		'click .remove_variant' : 'remove_variant',
	},
	render: function(){
		//not using
	},
	create_vote: function(e){
		e.preventDefault();

		if( ! this.validateForm()){
			return;
		}

		var new_vote = {},
			variants = new Array(),
			colors = new Array(),
			_that = this,
			successMsg = '<div class="alert alert-success" role="alert">Голосование успешно создано</div>',
			errorMsg = '<div class="alert alert-danger" role="alert">Упс.. Произошла ошибка.</div>';




		$('.variant').each(function(){
			var text = $(this).val(),
				color = $(this).css('background-color'),
				temp_obj = {
					'text': text,
					'color': color
				}
			variants.push(temp_obj);
		});

		new_vote.name = this.$('#name').val();
		new_vote.question = this.$('#question').val();
		new_vote.variants = variants;
		new_vote.allowed_votes = this.$('#allowed_votes')[0].value;
		this.colorPicker.hidePicker();

		//show spinner
		App.utils.spinner.show();
		$.ajax({
				type: 'post',
				url: App.ajax_url,
				data:( new_vote ),
				success: function(data){
					new_vote.id = data.id;

					App.utils.messages.showMessage('#messagesArea_fixed', successMsg);
					App.Collections.votes.add(new_vote);
					App.Collections.votes.sort();
					document.location.href = location.pathname+ '#votes/' + new_vote.id;
					//App.router.createvote();
				},
				error: function(data){
					App.utils.messages.showMessage('#messagesArea_fixed', errorMsg);	
				},
				complete: function(){
					//rempve spinner
					App.utils.spinner.hide();
				}
			});
	},
	validateForm: function(){
		//form validation..
		var isValid = true,
			name = this.$('#name').val(),
			question = this.$('#question').val();

		//check for empty variants
		$('.variant').each(function(){
			if( ! $(this).val() ){
				isValid = false
			}
		});

		if( ! ( name && question )){
			isValid = false;
		}


		if(isValid){
			return true
		} else{
			return false
		}

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
		var variant_counter = $('.variant').length + 1, // +1 because add 1
			variant_template = '\n<div class="input-append"><input type="text" class="variant colorPicker" placeholder="Вариант ответа" required><div class="btn hide remove_variant"><span class="icon-remove-sign"></span></div></div>';

		$('#variants').append(variant_template);
		current_variant = $('.variant').last()[0];

		this.update_options(variant_counter);
		this.add_color_picker(current_variant);
		this.toggleDelBtn();
	},
	update_options: function(variant_counter){
		var option, i,
			options = '';
		for(i = 1; i <= variant_counter; i += 1){
			option = '<option  value="' + i + '">' + i + '</option>'
			options += option;
		}
		$('#allowed_votes').html(options);
	},
	add_color_picker: function(current_variant){
		var AppUtils = App.utils;
			// случайный цвет в диапазоне 0-1
			r = Math.random().toFixed(1),
			g = Math.random().toFixed(1),
			b = Math.random().toFixed(1),
			this.colorPicker = new jscolor.color(current_variant, {
			valueElement:'none',
		});
		this.colorPicker.fromRGB(r, g, b); // заливка инпута случйным цветом

	},
	remove_variant: function(e){
		var variant_counter = $('.variant').length - 1; // -1 because remove

		if(e.target.className == 'icon-remove-sign'){
			e.target.parentNode.parentNode.remove();
		}else{
			e.target.parentNode.remove();
		}
		this.toggleDelBtn();
		this.update_options(variant_counter);
	},
});