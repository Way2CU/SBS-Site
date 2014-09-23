/**
 * Main JavaScript
 * Streamline Bookkeeping Service
 *
 * Copyright (c) 2014. by Way2CU, http://way2cu.com
 * Authors: Mladen Mijatov
 */

var Caracal = Caracal || {};


function LoginDialog() {
	var self = this;

	self.error = {};
	self.sign_up = {};
	self.login = {};
	self.recovery = {};

	/**
	 * Complete object initialization.
	 */
	self._init = function() {
		// create error reporting dialog
		self.error.dialog = new Dialog();
		self.error.dialog.setSize(400, 'auto');
		self.error.dialog.setScroll(false);
		self.error.dialog.setClearOnClose(false);
		self.error.dialog.setError(true);
		self.error.dialog.addClass('login error');

		self.error.content = $('<div>');
		self.error.dialog.setContent(self.error.content);

		// get sign up forms
		self.sign_up.forms = $('form.sign-up');
		self.sign_up.forms.submit(self._handleSignupSubmit);

		// create sign up dialog
		self.sign_up.dialog = new Dialog();
		self.sign_up.dialog.setSize(400, 'auto');
		self.sign_up.dialog.setScroll(false);
		self.sign_up.dialog.setClearOnClose(false);
		self.sign_up.dialog.setError(false);
		self.sign_up.dialog.addClass('login sign-up');

		self.sign_up.content = $('<form>');
		self.sign_up.message = $('<p>');

		self.sign_up.label_username = $('<label>');
		self.sign_up.input_username = $('<input>');

		self.sign_up.label_password = $('<label>');
		self.sign_up.input_password = $('<input>');

		self.sign_up.label_plan = $('<label><span/></label>');
		self.sign_up.input_plan = $('<input>');

		// configure elements
		self.sign_up.input_plan.attr('readonly', 'readonly');
		self.sign_up.label_plan.addClass('plan');

		// pack sign up dialog
		self.sign_up.message.appendTo(self.sign_up.content);

		self.sign_up.label_username
				.append(self.sign_up.input_username)
				.appendTo(self.sign_up.content);

		self.sign_up.label_password
				.append(self.sign_up.input_password)
				.appendTo(self.sign_up.content);

		self.sign_up.label_plan
				.append(self.sign_up.input_plan)
				.appendTo(self.sign_up.content);

		self.sign_up.dialog.setContent(self.sign_up.content);

		// create sign up button
		self.sign_up.signup_button = $('<a>');
		self.sign_up.signup_button
				.attr('href', 'javascript:void(0);')
				.click(self._handleSignupClick);
		self.sign_up.dialog.addControl(self.sign_up.signup_button);

		// prepare dialog
		self.login.dialog = new Dialog();
		self.login.dialog.setSize(400, 'auto');
		self.login.dialog.setScroll(false);
		self.login.dialog.setClearOnClose(false);
		self.login.dialog.setError(false);
		self.login.dialog.addClass('login');

		// create login button
		self.login.login_button = $('<a>');
		self.login.login_button
				.attr('href', 'javascript:void(0);')
				.click(self._handleLoginClick);
		self.login.dialog.addControl(self.login.login_button);

		// create login dialog content
		self.login.content = $('<form>');
		self.login.captcha_container = $('<div>');
		self.login.message = $('<p>');

		self.login.label_username = $('<label>');
		self.login.input_username = $('<input>');

		self.login.label_password = $('<label>');
		self.login.input_password = $('<input>');

		self.login.link_recovery = $('<a>');

		self.login.label_captcha = $('<label>');
		self.login.input_captcha = $('<input>');
		self.login.image_captcha = $('<img>');

		// configure elements
		self.login.input_username
				.on('keyup', self._handleLoginKeyPress)
				.attr('name', 'email')
				.attr('type', 'email');

		self.login.input_password
				.on('keyup', self._handleLoginKeyPress)
				.attr('name', 'password')
				.attr('type', 'password');

		self.login.link_recovery
				.click(self._showRecoveryDialog)
				.attr('href', 'javascript: void(0)');

		self.login.content
				.attr('action', '/')
				.attr('method', 'post');

		// pack elements
		self.login.content.append(self.login.message);
		self.login.label_username
				.append(self.login.input_username)
				.appendTo(self.login.content);

		self.login.label_password
				.append(self.login.input_password)
				.appendTo(self.login.content);

		self.login.label_captcha
				.append(self.login.input_captcha)
				.append(self.login.image_captcha)
				.appendTo(self.login.captcha_container);

		self.login.captcha_container
				.addClass('captcha')
				.hide()
				.appendTo(self.login.content);

		self.login.content.append(self.login.link_recovery);
		self.login.dialog.setContent(self.login.content);

		// prepare recovery dialog
		self.recovery.dialog = new Dialog();
		self.recovery.dialog.setSize(400, 'auto');
		self.recovery.dialog.setScroll(false);
		self.recovery.dialog.setClearOnClose(false);
		self.recovery.dialog.setError(false);
		self.recovery.dialog.addClass('login recovery');

		// create recover button
		self.recovery.recover_button = $('<a>');
		self.recovery.recover_button
				.attr('href', 'javascript: void(0);')
				.click(self._handleRecoverClick);

		self.recovery.dialog.addControl(self.recovery.recover_button);

		// create recovery dialog content
		self.recovery.content = $('<div>');
		self.recovery.captcha_container = $('<div>');
		self.recovery.message = $('<p>');

		self.recovery.label_email = $('<label>');
		self.recovery.input_email = $('<input>');

		self.recovery.label_captcha = $('<label>');
		self.recovery.input_captcha = $('<input>');
		self.recovery.image_captcha = $('<img>');

		self.recovery.input_email.on('keyup', self._handleRecoveryKeyPress);

		// prepare captcha image
		var base = $('base').attr('href');

		self.recovery.input_captcha
				.on('keyup', self._handleRecoveryKeyPress)
				.attr('maxlength', 4);
		self.login.input_captcha
				.on('keyup', self._handleLoginKeyPress)
				.attr('maxlength', 4);

		self.recovery.image_captcha
				.click(self._handleCaptchaClick)
				.attr('src', base + '?section=captcha&action=print_image');
		self.login.image_captcha
				.click(self._handleCaptchaClick)
				.attr('src', base + '?section=captcha&action=print_image');

		// pack elements
		self.recovery.content.append(self.recovery.message);
		self.recovery.label_email
				.append(self.recovery.input_email)
				.appendTo(self.recovery.content);

		self.recovery.label_captcha
				.append(self.recovery.input_captcha)
				.append(self.recovery.image_captcha)
				.appendTo(self.recovery.captcha_container);

		self.recovery.captcha_container
				.addClass('captcha')
				.appendTo(self.recovery.content);
		self.recovery.dialog.setContent(self.recovery.content);

		// bulk load language constants
		var constants = [
				'login', 'login_dialog_title', 'login_dialog_message', 'label_email', 'label_password',
				'label_password_recovery', 'recovery_dialog_title', 'recovery_dialog_message', 'submit',
				'label_captcha', 'captcha_message', 'signup_dialog_title', 'sign_up', 'signup_dialog_message',
				'label_plan'
			];
		language_handler.getTextArrayAsync(null, constants, self._handleStringsLoaded);

		// connect events
		$('a.login').click(self._showLoginDialog);
		$('a.logout').click(self._handleLogout);
		$('a.get_started_link').click(self._showSignUpDialog);
	}

	/**
	 * Handle pressing key on input fields in login dialog.
	 *
	 * @param object event
	 */
	self._handleLoginKeyPress = function(event) {
		var key_value = event.keyCode;

		switch (key_value) {
			case 13:  // enter
				self.login.login_button.trigger('click');
				event.preventDefault();
				break;

			case 27:
				self.login.dialog.hide();
				event.preventDefault();
				break;
		}
	};

	/**
	 * Handle pressing key on input fields in recovery dialog.
	 *
	 * @param object event
	 */
	self._handleRecoveryKeyPress = function(event) {
		var key_value = event.keyCode;

		switch (key_value) {
			case 13:  // enter
				self.recovery.recover_button.trigger('click');
				event.preventDefault();
				break;

			case 27:
				self.recovery.dialog.hide();
				event.preventDefault();
				break;
		}
	};

	/**
	 * Handle loading language constants from server.
	 *
	 * @param object data
	 */
	self._handleStringsLoaded = function(data) {
		with (self.login) {
			dialog.setTitle(data['login_dialog_title']);
			message.html(data['login_dialog_message']);
			login_button.html(data['login']);

			input_username.attr('placeholder', data['label_email']);
			input_password.attr('placeholder', data['label_password']);
			input_captcha.attr('placeholder', data['label_captcha']);
			link_recovery.html(data['label_password_recovery']);
			image_captcha.attr('title', data['captcha_message']);
		}

		with (self.recovery) {
			dialog.setTitle(data['recovery_dialog_title']);
			message.html(data['recovery_dialog_message']);
			recover_button.html(data['submit']);

			input_email.attr('placeholder', data['label_email']);
			input_captcha.attr('placeholder', data['label_captcha']);
			image_captcha.attr('title', data['captcha_message']);
		}

		with (self.sign_up) {
			dialog.setTitle(data['signup_dialog_title']);
			message.html(data['signup_dialog_message']);
			signup_button.html(data['sign_up']);

			input_username.attr('placeholder', data['label_email']);
			input_password.attr('placeholder', data['label_password']);
			label_plan.find('span').html(data['label_plan']);
		}
	};

	/**
	 * Logout user and navigate to linked page.
	 *
	 * @param object event
	 */
	self._handleLogout = function(event) {
		event.preventDefault();

		var link = $(this);
		var url = link.attr('href');

		// perform logout
		new Communicator('backend')
				.on_success(function(data) {
					if (!data.error)
						window.location = url;
				})
				.get('json_logout');
	};

	/**
	 * Handle clicking on login link.
	 *
	 * @param object event
	 */
	self._showLoginDialog = function(event) {
		// prevent default link behavior
		event.preventDefault();

		// get redirect url
		var link = $(this);
		self.login.redirect_url = link.data('redirect-url');

		// show dialog
		self.login.dialog.show();

		// focus username
		setTimeout(function() {
			self.login.input_username[0].focus();
		}, 100);
	};

	/**
	 * Show password recovery dialog.
	 *
	 * @param object event
	 */
	self._showRecoveryDialog = function(event) {
		// prevent default link behavior
		event.preventDefault();

		self.login.dialog.hide();
		self.recovery.dialog.show();

		// focus username
		setTimeout(function() {
			self.recovery.input_email[0].focus();
		}, 100);
	};

	/**
	 * Show sign up dialog when user clicks on get started link.
	 *
	 * @param object event
	 */
	self._showSignUpDialog = function(event) {
		// prevent default link behavior
		event.preventDefault();

		// show dialog
		self.sign_up.dialog.show();

		// focus username
		setTimeout(function() {
			self.sign_up.input_username[0].focus();
		}, 100);
	};

	/**
	 * Reload captcha image.
	 */
	self._handleCaptchaClick = function(event) {
		event.preventDefault();

		var base = $('base').attr('href');
		var url = base + '?section=captcha&action=print_image&' + Date.now();

		self.recovery.image_captcha.attr('src', url);
		self.login.image_captcha.attr('src', url);
	};

	/**
	 * Handle submission of sign up forms.
	 *
	 * @param object event
	 */
	self._handleSignupSubmit = function(event) {
		// prevent form from submitting
		event.preventDefault();

		// cache objects
		var form = $(this);
		var fields = form.find('input');

		// store redirect url
		self.sign_up.redirect_url = form.data('target-url');

		// collect data
		var data = {};
		fields.each(function(index) {
			var field = $(this);
			var name = field.attr('name');
			data[name] = field.val();
		});

		// fill in remaining data
		data.agreed = 1;
		data.fullname = '';
		data.email = data.username;
		data.show_result = 1;

		// create new user and redirect
		new Communicator('backend')
				.on_success(self._handleSignupSuccess)
				.on_error(self._handleSignupError)
				.send('save_unpriviledged_user', data);
	};

	/**
	 * Handle successful submission of sign up data.
	 *
	 * @param object data
	 */
	self._handleSignupSuccess = function(data) {
		if (!data.error) {
			// successfully created new user account, redirect
			window.location = self.sign_up.redirect_url;

		} else {
			// there was a problem creating new user
			self.error.dialog.setTitle(language_handler.getText(null, 'signup_dialog_title'));
			self.error.content.html(data.message);
			self.error.dialog.show();
		}
	};

	/**
	 * Handle communication error during sign up process.
	 *
	 * @param object xhr
	 * @param string status_code
	 * @param string description
	 */
	self._handleSignupError = function(xhr, status_code, description) {
		self.error.dialog.setTitle(language_handler.getText(null, 'signup_dialog_title'));
		self.error.content.html(description);
		self.error.dialog.show();
	};

	/**
	 * Handle clicking on login button in dialog.
	 *
	 * @param object event
	 */
	self._handleLoginClick = function(event) {
		// prevent default control behavior
		event.preventDefault();

		// prepare data
		var data = {
				username: self.login.input_username.val(),
				password: self.login.input_password.val()
			};

		// create communicator
		new Communicator('backend')
				.on_success(self._handleLoginSuccess)
				.on_error(self._handleLoginError)
				.get('json_login', data);
	};

	/**
	 * Handle successful login response.
	 *
	 * @param object data
	 */
	self._handleLoginSuccess = function(data) {
		if (data.logged_in) {
			// redirect on successful login
			window.location = self.login.redirect_url;

		} else {
			// hide login dialog
			self.login.dialog.hide();

			// show error message
			self.error.dialog.setTitle(language_handler.getText(null, 'login_dialog_title'));
			self.error.content.html(data.message);
			self.error.dialog.show();

			// show captcha if required
			if (data.show_captcha)
				self.login.captcha_container.slideDown(); else
				self.login.captcha_container.slideUp();
		}
	};

	/**
	 * Handle communication error.
	 *
	 * @param object xhr
	 * @param string transfer_status
	 * @param string description
	 */
	self._handleLoginError = function(xhr, transfer_status, description) {
		// hide login dialog
		self.login.dialog.hide();

		// show error dialog
		self.error.dialog.setTitle(language_handler.getText(null, 'login_dialog_title'));
		self.error.content.html(description);
		self.error.dialog.show();
	};

	/**
	 * Handle clicking on recover button in dialog.
	 *
	 * @param object event
	 */
	self._handleRecoverClick = function(event) {
		// prevent default control behavior
		event.preventDefault();
	};

	// finalize object
	self._init();
}


function FileUpload() {
	var self = this;

	self.form = null;
	self.file_select = null;
	self.file_list = null;
	self.button_select = null;
	self.button_send = null;
	self.disabled = false;

	/**
	 * Complete object initialization.
	 */
	self._init = function() {
		// find objects
		self.form = $('div#file_upload form');
		self.file_select = self.form.find('input[type=file]');
		self.file_list = self.form.find('div.file_list');
		self.button_select = self.form.find('button.select');
		self.button_submit = self.form.find('button[type=submit]');

		// connect events
		self.file_select.on('change', self._handleSelectFiles);
		self.button_select.click(self._handleSelectClick);

		// disable submit initially
		self.disableSubmit();
	}

	/**
	 * Format file size to human readable format.
	 *
	 * @param integer size
	 * @return string
	 */
	self._formatSize = function(size) {
		var index = Math.floor(Math.log(size) / Math.log(1000));
		var units = ['B', 'kiB', 'MiB', 'GiB', 'TiB'];

		return (size / Math.pow(1000, index)).toFixed(2) + ' ' + units[index];
	}

	/**
	 * Disable form submission.
	 */
	self.disableSubmit = function() {
		self.disabled = true;
		self.button_submit.attr('disabled', 'disabled');
	};

	/**
	 * Enable form submission.
	 */
	self.enableSubmit = function() {
		self.disabled = false;
		self.button_submit.removeAttr('disabled');
	};

	/**
	 * Clear list of files.
	 */
	self.clearList = function() {
		self.file_list.html('');
		self.file_list.addClass('empty');
	};

	/**
	 * Handle clicking on select button.
	 *
	 * @param object event
	 */
	self._handleSelectClick = function(event) {
		// prevent default button behavior
		event.preventDefault();

		// dispatch event
		self.file_select.click();
	};

	/**
	 * Handle selection of files.
	 *
	 * @param object event
	 */
	self._handleSelectFiles = function(event) {
		var files = event.target.files;

		// clear existing list
		self.clearList();

		// hide empty list indicator
		if (files.length > 0) {
			self.file_list.removeClass('empty');
			self.enableSubmit();
		}

		// add all the files
		for (var i=0, count=files.length; i<count; i++) {
			var file = files[i];
			var control = $('<span>');

			control
				.html(file.name)
				.attr('data-size', self._formatSize(file.size))
				.css('transition', (i * 0.2).toString() + 's all')
				.appendTo(self.file_list);
		}

		// delay showing
		setTimeout(function() {
			self.file_list.children().addClass('visible');
		}, 100);
	};

	// finalize object
	self._init();
}


function on_site_load() {
	Caracal.login_dialog = new LoginDialog();

	// create file upload control
	if ($('#file_upload').length > 0)
		Caracal.file_upload = new FileUpload();
}

$(on_site_load);
