/**
 * Sign Up Process JavaScript
 * Streamline Bookkeeping Services
 *
 * Copyright (c) 2014. by Way2CU, http://way2cu.com
 * Authors: Mladen Mijatov
 */

var Caracal = Caracal || {};


function ProgressBar() {
	var self = this;

	self.user_data_form = null;
	self.page_control = null;

	/**
	 * Complete object initialization.
	 */
	self._init = function() {
		self.user_data_form = $('div#setup_call');
		self.user_data_form
				.data('validator', self._validateUserDataForm)
				.find('input').bind('focus', self._handleFieldFocus);

		// connect events
		self.page_control = Caracal.shop.buyer_information_form.page_control;
		self.page_control.connect('page-flip', self._handlePageSwitch);
	}

	/**
	 * Save user data to server.
	 */
	self._saveUserData = function() {
		var fields = self.user_data_form.find('input');
		var data = {};

		fields.each(function(index) {
			var field = $(this);
			var name = field.attr('name');
			data[name] = field.val();
		});

		new Communicator('sbs').send('json_set_data', data);
	};

	/**
	 * Validate user data form.
	 * @return boolean
	 */
	self._validateUserDataForm = function() {
		var fields = self.user_data_form.find('input');
		var empty_fields = 0;

		fields.each(function(index) {
			var field = $(this);

			if (field.val() == '') {
				empty_fields++;
				field.addClass('bad');

			} else {
				field.removeClass('bad');
			}
		});

		return empty_fields == 0;
	};

	/**
	 * Handle focusing user data field.
	 *
	 * @param object event
	 */
	self._handleFieldFocus = function(event) {
		$(this).removeClass('bad');
	};

	/**
	 * Handle switching page.
	 *
	 * @param integer current_page
	 * @param integer new_page
	 * @return boolean
	 */
	self._handlePageSwitch = function(current_page, new_page) {
		var class_name = 'step' + new_page;

		$('div.progress-bar')
			.attr('class', 'progress-bar')
			.addClass(class_name);

		// save user data
		if (current_page == 1 && new_page > current_page)
			self._saveUserData();

		return true;  // don't prevent page-flip
	};

	// finalize object
	self._init();
}

<<<<<<< HEAD

function PlanSelector() {
	var self = this;

	self.plans = null;
	self.current_plan = null;

	/**
	 * Complete object initialization.
	 */
	self._init = function() {
		self.plans = $('div#plans label input');
		self.plans.click(self._handlePlanChange);
	}

	/**
	 * Handle changin the plan in sign-up process.
	 *
	 * @param object event
	 */
	self._handlePlanChange = function(event) {
		var plan = self.plans.filter(':checked').val();

		if (plan == self.current_plan)
			return;

		new Communicator('shop')
			.on_success(self._handlePlanChange_Success)
			.on_error(self._handlePlanChange_Error)
			.send(
				'json_set_recurring_plan',
				{plan: plan}
			);
	};

	/**
	 * Handle successful plan change.
	 *
	 * @param object data
	 */
	self._handlePlanChange_Success = function(data) {
		// code
	};

	/**
	 * Handle error during setting of new recurring plan.
	 *
	 * @param object xhr
	 * @param string request_status
	 * @param string error_string
	 */
	self._handlePlanChange_Error = function(xhr, request_status, error_string) {
		// code
	};

	// finalize object
	self._init();
}


$(function() {
	Caracal.progress_bar = new ProgressBar();
	Caracal.plan_selector = new PlanSelector();
});
