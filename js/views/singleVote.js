// Single Vote View

App.Views.SingleVote = Backbone.View.extend({
	tagName: 'div#single_vote_wrapper',
	checked_variants: [],
	initialize: function(){
		this.model.attributes.is_voted = false;
	},
	render: function(){
		var tpl_data = this.model.attributes,
			template, i,
			votes_sum = 0
			_that = this;
		
		for (i = 0; i < tpl_data.variants.length; i += 1) {
			votes_sum += tpl_data.variants[i].voted;
		}
		for (i = 0; i < tpl_data.variants.length; i += 1) {
			if(votes_sum == 0){
				tpl_data.variants[i].bar_width = 1;
			}else{
				tpl_data.variants[i].bar_width = (tpl_data.variants[i].voted / votes_sum) * 100; // %
			}
		}
			
			
		template = _.template($('#singleVote_page_tpl').html(), tpl_data);
		$('.page').html(template);
		new diagram.PieChart('vote_pie', this.model.attributes.variants);


		// set some initalize props
		this.checkboxes = $('#single_vote_variants > tbody > tr > td > input[type=checkbox]');
		this.allowed_votes = this.model.attributes.allowed_votes;
		this.checked = 0;
		// set events after render
		this.checkboxes.on('change', function(){
			var i = 0;

			if( $(this)[0].checked ){
				_that.checked++
			} else {
				_that.checked--
			}
			_that.checkAllowed();
		});
		$('#send_vote_'+this.model.attributes.id).on('click', function(){_that.sendVote.call(_that)});
	},
	checkAllowed: function(){
		var _that = this;
		this.checkboxes.each(function(){
				// disable or enable checkboxes depends of allowed votes
				if(_that.allowed_votes == _that.checked){
					if( ! $(this)[0].checked ){
						$(this).attr('disabled', 'true');
					}
				} else{
					$(this).removeAttr('disabled');
				}
		});
	},
	saveChecks: function(){
		var _that = this,
			i = 0;
		this.checked_variants = [];
		this.checkboxes.each(function(){
				// push checkedboxes in voted array for send in ajax
				if( $(this)[0].checked ){
					_that.checked_variants.push(_that.model.attributes.variants[i].id)
				}
				i += 1;	
				//$(this).prop('checked', false);
			});
	},
	sendVote: function(){
		var _that = this,
			routeHash = Backbone.history.getHash(),
			successMsg = '<div class="alert alert-success" role="alert">Ваш голос принят.</div>',
			errorMsg = '<div class="alert alert-danger" role="alert">Упс.. Произошла ошибка.</div>',
			infoMsg = '<div class="alert alert-info" role="alert">Нет отмеченых вариантов.</div>';
		
		this.saveChecks();
		if(this.checked_variants.length === 0){
			App.utils.messages.showMessage('#messagesArea_fixed', infoMsg);
			return;
		}
		App.utils.spinner.show();
		$.ajax({
			type: 'post',
			url: App.ajax_url+'/variant',
			data: ({
				variants_id: this.checked_variants
			}),
			success: function(data){
				App.utils.messages.showMessage('#messagesArea_fixed', successMsg);
				if(routeHash === Backbone.history.getHash()){
					$.ajax({
						type: 'get',
						url: App.ajax_url+'/variant',
						data: ({
							parent_id: _that.model.id
						}),
						success: function(data){
							_that.model.attributes.variants = data;
							_that.model.attributes.is_voted = true;
							_that.render();
						},
						error: function(xhr, ajaxOptions, thrownError){
							errorMsg = '<div class="alert alert-danger" role="alert">xhr - '+xhr+', thrownError - '+thrownError+'</div>';
							App.utils.messages.showMessage('#messagesArea_fixed', errorMsg);	
						},
						complete: function(){
							//remove spinner
							App.utils.spinner.hide();
						}
					});
				}
			},
			error: function(xhr, ajaxOptions, thrownError){
				errorMsg = '<div class="alert alert-danger" role="alert">xhr - '+xhr+', thrownError - '+thrownError+'</div>';
				App.utils.messages.showMessage('#messagesArea_fixed', errorMsg);	
			},
			complete: function(){
			}
		});
	}
});
