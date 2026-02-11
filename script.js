const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const captureBtn = document.getElementById("capture-btn");
const downloadBtn = document.getElementById("download-btn");
const retakeBtn = document.getElementById("retake-btn");
const statusText = document.getElementById("status-text");
const progressText = document.getElementById("progress-text");

// ===== STATE =====
let maxPhotos = 4;
let capturedPhotos = [];
let photoTaken = false;

// ===== CAMERA =====
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream)
    .catch(() => alert("Camera access denied"));

// ===== CAPTURE =====
captureBtn.addEventListener("click", () => {

    if (photoTaken) return;
    photoTaken = true;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Un-mirror capture
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    // Save image to memory
    capturedPhotos.push(canvas.toDataURL("image/png"));

    // Update progress
    progressText.textContent = `📸 ${capturedPhotos.length} / ${maxPhotos} photos taken`;

    video.style.display = "none";
    canvas.style.display = "block";
    statusText.style.display = "block";
    retakeBtn.style.display = "inline-block";
    downloadBtn.style.display = "inline-block";

    // Disable capture
    captureBtn.disabled = true;
    captureBtn.style.opacity = "0.6";

    // Upload (single photo for now)
    canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append("photo", blob, "capture.png");

        fetch("http://127.0.0.1:8000/upload/", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            downloadBtn.href = data.image;
        })
        .catch(() => alert("Upload failed"));
    }, "image/png");
});

// ===== RETAKE =====
retakeBtn.addEventListener("click", () => {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.style.display = "none";
    video.style.display = "block";
    statusText.style.display = "none";
    retakeBtn.style.display = "none";
    downloadBtn.style.display = "none";

    photoTaken = false;
    captureBtn.disabled = false;
    captureBtn.style.opacity = "1";
});
