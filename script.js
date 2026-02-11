const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const captureBtn = document.getElementById("capture-btn");
const downloadBtn = document.getElementById("download-btn");
const retakeBtn = document.getElementById("retake-btn");
const statusText = document.getElementById("status-text");

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

    // Un-mirror capture (because preview is mirrored)
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    video.style.display = "none";
    canvas.style.display = "block";
    statusText.style.display = "block";
    retakeBtn.style.display = "inline-block";
    downloadBtn.style.display = "inline-block";

    // Disable capture
    captureBtn.disabled = true;
    captureBtn.style.opacity = "0.6";

    // Enable download
    downloadBtn.href = canvas.toDataURL("image/png");
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
