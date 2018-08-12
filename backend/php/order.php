<?php

ini_set('display_errors',1);

$startaddress = $_POST['start-address'];
$endaddress = $_POST['end-address'];

$to = "axiiom.home@gmail.com";
$subject = "Commande";
$message = $startaddress . " " . $endaddress;

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
$mail->Body    = $message;

$mail->SMTPDebug = 3;

if(!$mail->send()) {
   echo 'Message could not be sent.';
   echo 'Mailer Error: ' . $mail->ErrorInfo;
   exit;
}

echo 'Message has been sent';
?>