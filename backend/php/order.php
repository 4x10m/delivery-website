<?php

ini_set('display_errors', 1);

$type = $_POST['order-type-radio'];

$startaddress = $_POST['start-address'];
$startDate = $_POST['start-date-input'];
$startTime = $_POST['start-time-input'];
$startInstruction = $_POST['start-instruction-input'];

$endaddress = $_POST['end-address'];
$endDate = $_POST['end-date-input'];
$endTime = $_POST['end-date-input'];
$endInstruction = $_POST['end-date-input'];

$distance = $_POST['order-distance-input'];
$distancePrice = $_POST['order-distance-price-input'];

$verticalGain = $_POST['order-verticalgain-input'];
$verticalGainPrice = $_POST['order-verticalgain-price-input'];

$weight = $_POST['choice-weight'];
$weightPrice = $_POST['order-weight-price-input'];

$urgency = $_POST['urgency-checkbox'];

$donation = $_POST['order-tip-input'];

$clientName = $_POST['client-name-input'];
$clientAddress = $_POST['client-address-input'];
$clientAddressComplement = $_POST['client-address-complement-input'];
$clientEmail = $_POST['client-mail-input'];
$clientNumber = $_POST['client-number-input'];

$totalPrice = $_POST['order-totalprice-input'];

$paid = $_POST['order-paid-input'];

$to = "testeraxiiom@gmail.com";

$subject = "";

if ($urgency) {
	$subject .= "[URGENT] "; 
}

$subject .= "Nouvelle commande de ";
$subject .= $clientName;

$message = "Type: " . $type . "\n" 
. "Addresse de retrait: " . $startaddress . "\n"
. "Date de retrait: " . $startDate . "\n"
. "Heure de retrait: " . $startTime . "\n"
. "Instruction de retrait: " . $startInstruction . "\n"
. "Addresse de dépot: " . $endaddress . "\n"
. "Date de dépot: " . $endDate . "\n"
. "Heure de dépot: " . $endTime . "\n"
. "Instruction de dépot: " . $endInstruction . "\n"
. "Distance: " . $distance . "\n"
. "Prix distance: " . $distancePrice . "\n"
. "Gain: " . $verticalGain . "\n"
. "Prix gain: " . $verticalGainPrice . "\n"
. "Poid: s" . $weight . "\n"
. "Prix poids: " . $weightPrice . "\n"
. "Urgence: " . $urgency . "\n"
. "Don: " . $donation . "\n"
. "Nom client: " . $clientName . "\n"
. "Addresse client: " . $clientAddress . "\n"
. "Complément addresse client: " . $clientAddressComplement . "\n"
. "Email client: " . $clientEmail . "\n"
. "Numéro client: " . $clientNumber . "\n"
. "Prix total: " . $totalPrice . "\n"
. "Payé: " . $paid . "\n";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

$mail = new PHPMailer;
















//$mail->isSMTP();
$mail->isMail();
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->Username = 'testeraxiiom@gmail.com';
$mail->Password = 'a1z2e3r4+';
$mail->SMTPSecure = 'tls';
$mail->Port = 587;

$mail->setFrom('testeraxiiom@gmail.com', 'Amit Agarwal');
$mail->addAddress('testeraxiiom@gmail.com', 'Josh Adams');
$mail->WordWrap = 50;

$mail->isHTML(true);

$mail->Subject = $subject;
$mail->Body    = nl2br($message);

$mail->SMTPDebug = 3;

if(!$mail->send()) {
   echo 'Message could not be sent.';
   echo 'Mailer Error: ' . $mail->ErrorInfo;
   exit;
}

//header('Location: file:///D:/Working/Coopcycle/delivery-website/index.html');
//exit;
?>