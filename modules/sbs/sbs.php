<?php

/**
 * Streamline Bookkeeping Service
 *
 * Author: Mladen Mijatov
 */
use Core\Module;
use Core\Events;


class sbs extends Module {
	private static $_instance;

	/**
	 * Constructor
	 */
	protected function __construct() {
		global $section;
		parent::__construct(__FILE__);
		Events::connect('shop', 'transaction-completed', 'onTransactionCompleted', $this);
	}

	/**
	 * Public function that creates a single instance
	 */
	public static function getInstance() {
		if (!isset(self::$_instance))
			self::$_instance = new self();

		return self::$_instance;
	}

	/**
	 * Transfers control to module functions
	 *
	 * @param array $params
	 * @param array $children
	 */
	public function transferControl($params = array(), $children = array()) {
		// global control actions
		if (isset($params['action']))
			switch ($params['action']) {
				case 'json_set_data':
					$this->setUserData($params, $children);
					break;

				case 'show_data':
					$this->tag_UserData($params, $children);
					break;

				case 'redirect_user':
					$this->redirectUser();
					break;

				default:
					break;
			}
	}

	/**
	 * Event triggered upon module initialization
	 */
	public function onInit() {
	}

	/**
	 * Event triggered upon module deinitialization
	 */
	public function onDisable() {
	}

	/**
	 * Redirect user to either sign up page or control panel.
	 */
	private function redirectUser() {
		$shop = shop::getInstance();
		$user_data_manager = UserDataManager::getInstance();

		// redirect user based on active plan
		$plan = $shop->getRecurringPlan();

		if (is_null($plan))
			url_SetRefresh(url_Make('', 'sign-up')); else
			url_SetRefresh(url_Make('control-panel', 'user'));
	}

	/**
	 * Handle completed transaction.
	 *
	 * @param array $transaction
	 */
	public function onTransactionCompleted($transaction) {
		if (!class_exists('contact_form'))
			return;

		$plans_manager = ShopTransactionPlansManager::getInstance();
		$user_data_manager = UserDataManager::getInstance();
		$contact_form = contact_form::getInstance();
		$template = $contact_form->getTemplate('sbs_notify');

		// make sure template exists
		if (is_null($template))
			return;

		// get remaining variables
		$replacement_fields = array();
		$mailer = $contact_form->getMailer();
		$recipients = $contact_form->getRecipients();
		$sender = $contact_form->getSender();

		// get variables for system user
		$user_data = $user_data_manager->getItems(
							$user_data_manager->getFieldNames(),
							array(
								'user'		=> $transaction['system_user'],
								'namespace'	=> 'sbs'
							));

		foreach ($user_data as $data)
			$replacement_fields[$data->key] = $data->value;

		// get plan name
		$plan = $plans_manager->getSingleItem(array('plan_name'), array('transaction' => $transaction['id']));

		if (is_object($plan))
			$replacement_fields['plan'] = $plan->plan_name;

		// prepare mailer
		$mailer->start_message();
		$mailer->set_subject($template['subject']);
		$mailer->set_sender($sender['address'], $sender['name']);

		foreach ($recipients as $recipient)
			$mailer->add_recipient($recipient['address'], $recipient['name']);

		$mailer->set_body($template['plain_body'], $template['html_body']);
		$mailer->set_variables($replacement_fields);

		// send email
		$mailer->send();
	}

	/**
	 * Set data for current user.
	 *
	 * @param array $tag_params
	 * @param array $children
	 */
	private function setUserData($tag_params, $children) {
		if (!$_SESSION['logged'])
			return;

		$manager = UserDataManager::getInstance();
		$user_id = $_SESSION['uid'];

		// prepare data for entry
		$data = array(
				'first_name'	=> fix_chars($_REQUEST['first_name']),
				'last_name'		=> fix_chars($_REQUEST['last_name']),
				'phone_number'	=> fix_chars($_REQUEST['phone_number']),
				'hours'			=> fix_chars($_REQUEST['hours']),
			);

		// remove existing data
		$manager->deleteData(array(
				'user'		=> $user_id,
				'namspace'	=> 'sbs'
			));

		// add new data
		foreach ($data as $key => $value) {
			$manager->insertData(array(
					'user'		=> $user_id,
					'namespace'	=> 'sbs',
					'key'		=> $key,
					'value'		=> $value
				));
		}
	}

	/**
	 * Handle showing user data.
	 *
	 * @param array $tag_params
	 * @param array $children
	 */
	public function tag_UserData($tag_params, $children) {
		$manager = UserDataManager::getInstance();
		$conditions = array('namespace' => 'sbs');

		// get conditions
		if (isset($tag_params['user']))
			$conditions['user'] = fix_id($user);

		// get data from the database
		$params = array();
		$raw_data = $manager->getItems(array('key', 'value'), $conditions);

		if (count($raw_data) > 0)
			foreach ($raw_data as $entry)
				$params[$entry->key] = $entry->value;

		// load template
		$template = $this->loadTemplate($tag_params, 'user_info.xml');

		// show data
		if (!empty($params)) {
			$template->restoreXML();
			$template->setLocalParams($params);
			$template->parse();
		}
	}
}
