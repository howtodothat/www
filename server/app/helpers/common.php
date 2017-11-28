<?php

/**
 * Get current user
 *
 * @author : HungVT
 * @version: 1.0
 * @return : object
 */
function cuser() {
	return Auth::user();
}

/**
 * Get current user
 *
 * @author : HungVT
 * @version: 1.0
 * @return : object
 */
function isGuest() {
	return Auth::guest();
}

/**
 * Return json format
 *
 * @author: HungVT
 * @return: object user
 */
function jsonOut($error, $status, $message_key = false, $data = null) {
	$message = $message_key;
	if ($message_key === false) {
		$message = config("params.{$status}");
	}
	return response([
		'error' => $error,
		'status' => $status,
		'message' => $message,
		'data' => $data,
	], $status);
}

/**
 * Get key of params (defined in config/params.php)
 *
 * @author: HungVT
 * @return: object
 */
function getParam($message_key) {
	return is_null(config("params.{$message_key}")) ? $message_key : config("params.{$message_key}");
}

/**
 * Set API request Header
 *
 * @author: HungVT
 * @return: object
 */
function setAPIHeader($params = [], $method = 'POST') {
	$body = http_build_query($params);
	$opts = array('http' => array(
		'method' => $method,
		'header' => 'Content-type: application/x-www-form-urlencoded',
		'content' => $body,
		'timeout' => 30,
	),
	);
	return stream_context_create($opts);
}

/**
 * Check if current server is production or devlopment
 * @return bool
 */
function isProduction() {
	return getenv('APP_ENV') == 'production';
}

/**
 * @return bool
 */
function isDevelopment() {
	return getenv('APP_ENV') == 'local';
}

/**
 * Set cURL opts
 */
function setCurlOpt($url, $postfields) {
	$header = array(
		"cache-control: no-cache",
		"content-type: multipart/form-data",
	);
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	// Set so curl_exec returns the result instead of outputting it.
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $postfields);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // On dev server only!
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

	return $ch;
}

/**
 * Set uuid
 *
 * @author: HungVT
 * @return: string
 */
function uuid($hasDash = false) {
	$uuid = \Ramsey\Uuid\Uuid::uuid4();
	return $hasDash ? $uuid : str_replace('-', '', $uuid->toString());
}

/**
 * Get Hashid
 *
 * @author: HungVT
 * @return: string
 */
function hashid($digitNum = 12) {
	$hashids = new App\Helpers\Hashids\Hashids(uuid(false), $digitNum);
	return $hashids->encode(1, 2, 3);
}

/**
 * Return empty or value
 *
 * @author: HungVT
 * @return: string
 */
function vlike($value) {
	if (!is_string($value)) {
		return "%%";
	}
	return "%$value%";
}

/**
 * Return empty or value
 *
 * @author: HungVT
 * @return: string
 */
function isRoute($name) {
	$current = \Request::route()->getName();
	return $current === $name;
}

/**
 * Return empty or value
 *
 * @author: HungVT
 * @return: string
 */
function active($name) {
	return isRoute($name) ? 'active' : '';
}

/**
 * Return empty or value
 *
 * @author: HungVT
 * @return: string
 */
function getRequestParam($modelName, $attribute) {
	$params = \Request::input($modelName);

	if (isset($params[$attribute])) {
		return $params[$attribute];
	}
	return null;
}

function getMonthYearFromTimestamp($timestamp) {
	$date = getdate($timestamp);
	if (!empty($date['mon']) && !empty($date['year'])) {
		if ($date['mon'] < 10) {
			$date['mon'] = '0' . $date['mon'];
		}
		return $date['mon'] . substr($date['year'], 2, 2);
	}
	return false;
}

/**
 * Trim ingeter on string
 *
 * @author: HungVT
 * @param: $str string
 * @return: string
 */
function trimInt($str) {
	return preg_replace('/[0-9]+/', '', $str);
}

/**
 * Get lastday of month
 *
 * @author: DINHTIN
 * @param: $month int;
 * @param: $year int;
 * @return timestamp
 */
function lastday($month = '', $year = '') {
	if (empty($month)) {
		$month = date('m');
	}
	if (empty($year)) {
		$year = date('Y');
	}
	$time = strtotime("{$year}-{$month}-01");
	return strtotime('-1 second', strtotime('+1 month', $time));
}

/**
 * Get firstday of month
 *
 * @author: DINHTIN
 * @param: $month int;
 * @param: $year int;
 * @return timestamp
 */
function firstday($month = '', $year = '', $h = '00', $i = '00', $s = '00') {
	if (empty($month)) {
		$month = date('m');
	}
	if (empty($year)) {
		$year = date('Y');
	}
	return strtotime("{$year}-{$month}-01 $h:$i:$s");
}

/**
 * Convert pdf to image
 *
 * @author: DINHTIN
 * @param: $pdfPath string;
 * @param: $imagePath string;
 */
function convertPdfToImage($pdfPath, $imagePath) {
	try {
		$im = new imagick();
		$im->setResolution(300, 300);
		$im->readImage($pdfPath);
		$im->setImageFormat('png');
		$im->setImageCompressionQuality(100);
		$im->writeImage($imagePath);
		$im->clear();
		$im->destroy();
		return true;
	} catch (Exception $e) {
		return false;
	}
}

function encryptString($string) {
	return Cryption::encrypt($string);
}

/**
 * Returns decrypted original string
 */
function decryptString($string) {
	return Cryption::decrypt($string);
}
/**
 * format currency
 */
function formatCurrency($val, $tail = '$ ') {

	if (!empty($val)) {
		return $tail . number_format($val, 2);
	} else {
		return $tail . '0.00';
	}
}