// Get the video and record button elements
const video = document.getElementById('video');
const recordBtn = document.getElementById('record-btn');

// Global variables for recording
let mediaRecorder;
let recordedChunks = [];

// When the record button is clicked
recordBtn.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        // Stop recording if it's already in progress
        mediaRecorder.stop();
        recordBtn.textContent = 'Stop Following';
    } else {
        // Start recording
        startRecording();
        recordBtn.textContent = 'Stop Following ';
    }
});

// Function to start the recording process
function startRecording() {
    // Check if the browser supports MediaRecorder
    if (!MediaRecorder || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('MediaRecorder is not supported in this browser.');
        return;
    }
    
    // Get access to the camera stream
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            // Create a new MediaRecorder instance
            mediaRecorder = new MediaRecorder(stream);
            
            // Event handler for when data is available
            mediaRecorder.ondataavailable = event => {
                recordedChunks.push(event.data);
            };
            
            // Event handler for when recording is stopped
            mediaRecorder.onstop = () => {
                // Create a new Blob from the recorded chunks
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                
                // Reset recordedChunks
                recordedChunks = [];
                
                // Create a FormData object to send the recorded video
                const formData = new FormData();
                formData.append('videoData', blob);
                
                // Send the recorded video to the PHP script for saving
                fetch('save-video.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (response.ok) {
                        console.log('Video saved successfully!');
                    } else {
                        console.error('Error saving the video.');
                    }
                })
                .catch(error => {
                    console.error('Error saving the video:', error);
                });
            };
            
            // Start recording
            mediaRecorder.start();
        })
        .catch(error => {
            console.error('Error accessing camera:', error);
        });
}
