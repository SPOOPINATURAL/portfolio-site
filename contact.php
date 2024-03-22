<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the form fields
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
    
    // Set up the email
    $to = 'spoopimail@gmail.com';
    $subject = $name;
    $body = "Name: $name\nEmail: $email\n\n$message";
    
    // Send the email
    if (mail($to, $subject, $body)) {
        echo 'Email sent successfully.';
    } else {
        echo 'There was an error sending your email.';
    }
}
?>