<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['videoData'])) {
    // Retrieve the video data sent by the client
    $videoData = $_FILES['videoData']['tmp_name'];

    // Generate a unique filename for the saved video
    $filename = uniqid() . '.webm';

    // Specify the directory path to save the video
    $directory = 'videos/';

    // Create the directory if it doesn't exist
    if (!is_dir($directory)) {
        mkdir($directory);
    }

    // Move the uploaded video file to the specified directory
    if (move_uploaded_file($videoData, $directory . $filename)) {
        echo 'Video saved successfully!';
    } else {
        echo 'Error saving the video.';
    }
}
?>
