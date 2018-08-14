<?php

$type = $_POST['order-type-radio'];

$printableType = NULL;

if ($type = "objectdelivery") {
	$printableType = "Livraison d'objet";
}

$startaddress = $_POST['start-address'];
$startDate = $_POST['start-date-input'];
$startTime = $_POST['start-time-input'];
$startInstruction = $_POST['start-instruction-input'];

$endaddress = $_POST['end-address'];
$endDate = $_POST['end-date-input'];
$endTime = $_POST['end-time-input'];
$endInstruction = $_POST['end-instruction-input'];

$distance = $_POST['order-distance-input'];
$distancePrice = $_POST['order-distance-price-input'];

$verticalGain = $_POST['order-verticalgain-input'];
$verticalGainPrice = $_POST['order-verticalgain-price-input'];

$weight = $_POST['choice-weight'];
$weightPrice = $_POST['order-weight-price-input'];

$urgency = false;
$printableUrgency = NULL;

if (isset($_POST['urgency-checkbox']) && $_POST['urgency-checkbox']) {
	$urgency = true;
}

if ($urgency) {
	$printableUrgency = "Oui";
} else {
	$printableUrgency = "Non";
}

$donation = $_POST['order-tip-input'];

$clientName = $_POST['client-name-input'];
$clientAddress = $_POST['client-address-input'];
$clientAddressComplement = $_POST['client-address-complement-input'];
$clientEmail = $_POST['client-mail-input'];
$clientNumber = $_POST['client-number-input'];

$totalPrice = $_POST['order-totalprice-input'];

$paid = $_POST['order-paid-input'];
$printablePaid = NULL;

if ($paid) {
	$printablePaid = "Oui";
} else {
	$printablePaid = "Non";
}

$subject = "";

if ($urgency) {
	$subject .= "[URGENT] "; 
}

$subject .= "Nouvelle commande de ";
$subject .= $clientName;

$message = "Type: " . $type . "\n" 
. "Adresse de retrait: " . $startaddress . "\n"
. "Date de retrait: " . $startDate . "\n"
. "Heure de retrait: " . $startTime . "\n"
. "Instructions de retrait: " . $startInstruction . "\n"
. "Addresse de dépôt: " . $endaddress . "\n"
. "Date de dépôt: " . $endDate . "\n"
. "Heure de dépôt: " . $endTime . "\n"
. "Instructions de dépôt: " . $endInstruction . "\n"
. "Distance: " . $distance . "\n"
. "Prix distance: " . $distancePrice . "\n"
. "Gain vertical: " . $verticalGain . "\n"
. "Prix gain: " . $verticalGainPrice . "\n"
. "Poids: " . $weight . "\n"
. "Prix poids: " . $weightPrice . "\n"
. "Urgence: " . $urgency . "\n"
. "Don: " . $donation . "\n"
. "Nom client: " . $clientName . "\n"
. "Adresse client: " . $clientAddress . "\n"
. "Complément adresse client: " . $clientAddressComplement . "\n"
. "Email client: " . $clientEmail . "\n"
. "Numéro client: " . $clientNumber . "\n"
. "Prix total: " . $totalPrice . "\n"
. "Payé: " . $paid . "\n";

$clientsubject = "Evan GAROT--ADRIAN: Recapitulatif de votre commande";
$clientmessage = 
"<h1>Evan GAROT--ADRIAN<small>, votre service de livraison à vélo sur Tours.</small></h1>" .
$clientName . ", vous avez récemment réaliser une demande de livraison via le formulaire de commande Evan GAROT--ADRIAN." .
"<h2>Recapitulatif de votre commande</h2>" .
"<hr>" .
"<table>" .
"	<tr>" .
"		<td>Type de commande</td>" .
"		<td>" . $printableType . "</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Date de retrait</td>" .
"		<td>" . $startDate . "</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Heure de retrait</td>" .
"		<td>" . $startTime . "</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Addresse de retrait</td>" .
"		<td>" . $startaddress . "</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Instructions de retrait</td>" .
"		<td>" . $startInstruction . "</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Date de dépôt</td>" .
"		<td>" . $endDate . "</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Heure de dépôt</td>" .
"		<td>" . $endTime . "</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Addresse de dépôt</td>" .
"		<td>" . $endaddress . "</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Instructions de dépôt</td>" .
"		<td>" . $endInstruction . "</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Distance</td>" .
"		<td>" . $distance . " m</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Prix de la distance</td>" .
"		<td>" . $distancePrice . " €</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Gain vertical</td>" .
"		<td>" . $verticalGain . " m</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Prix de l'altimétrie</td>" .
"		<td>" . $verticalGainPrice . " €</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Poids</td>" .
"		<td>" . $weight . " kg</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Prix du poids</td>" .
"		<td>" . $weightPrice . " €</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Urgence</td>" .
"		<td>" . $printableUrgency . "</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Donation</td>" .
"		<td>" . $donation . " €</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Nom client</td>" .
"		<td>" . $clientName . "</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Adresse</td>" .
"		<td>" . $clientAddress . "</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Complément d'adresse</td>" .
"		<td>" . $clientAddressComplement . "</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Adresse email</td>" .
"		<td>" . $clientEmail . "</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Numéro de téléphone</td>" .
"		<td>" . $clientNumber . "</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Prix total</td>" .
"		<td>" . $totalPrice . " €</td>" .
"	</tr>" .
"	<tr>" .
"		<td>Payé</td>" .
"		<td>" . $printablePaid . "</td>" .
"	</tr>" .
"</table>" .
"<br>" .
"A très vite";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

$mail = new PHPMailer;

$mail->isSMTP();
//$mail->isMail();
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->Username = 'testeraxiiom@gmail.com';
$mail->Password = '6474c3720083be3f1f3f13ffbb252b8521b6bb9cb64cc7e78bc812a9125cf05f';
$mail->SMTPSecure = 'tls';
$mail->Port = 587;

$mail->setFrom('testeraxiiom@gmail.com', 'T2R');
$mail->addAddress('testeraxiiom@gmail.com', 'Evan GAROT--ADRIAN');
$mail->WordWrap = 50;

$mail->isHTML(true);

$mail->Subject = $subject;
$mail->Body    = nl2br($message);

if(!$mail->send()) {
	//header('Location: index.html?order-success=false');
/*   echo 'Message could not be sent.';
   echo 'Mailer Error: ' . $mail->ErrorInfo;*/
}

$mail = new PHPMailer;

$mail->isSMTP();
//$mail->isMail();
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->Username = 'testeraxiiom@gmail.com';
$mail->Password = '6474c3720083be3f1f3f13ffbb252b8521b6bb9cb64cc7e78bc812a9125cf05f';
$mail->SMTPSecure = 'tls';
$mail->Port = 587;

$mail->setFrom('testeraxiiom@gmail.com', 'Evan GAROT--ADRIAN');
$mail->addAddress($clientEmail, $clientName);
$mail->WordWrap = 50;

$mail->isHTML(true);

$mail->Subject = $clientsubject;
$mail->Body    = $clientmessage;

if(!$mail->send()) {
	header('Location: index.html?order-success=false');
/*   echo 'Message could not be sent.';
   echo 'Mailer Error: ' . $mail->ErrorInfo;*/
}

header('Location: index.html?order-success=true');
exit;
?>