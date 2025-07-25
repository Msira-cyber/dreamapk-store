function validateLogo(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                if (img.width > 512 || img.height > 512) {
                    alert('Logo dimensions must not exceed 512x512px. Your image is ' + img.width + 'x' + img.height + 'px.');
                    input.value = '';
                    return false;
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}
// Preview image before upload
function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            preview.classList.add('animate__animated', 'animate__zoomIn');
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.style.display = 'none';
    }
}

// Validate file type and size before upload
function validateFile(input, allowedTypes, maxSizeMB) {
    const file = input.files[0];
    if (!file) return;
    if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type!');
        input.value = '';
        return false;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
        alert('File is too large!');
        input.value = '';
        return false;
    }
    return true;
}

// Validate logo size (max 3MB)
function validateLogoSize(input) {
    const file = input.files[0];
    if (file && file.size > 3 * 1024 * 1024) {
        alert('Logo file size must not exceed 3MB.');
        input.value = '';
        return false;
    }
    return true;
}

// Validate screenshot size (max 6MB per file)
function validateScreenshotSize(input) {
    const files = input.files;
    for (let i = 0; i < files.length; i++) {
        if (files[i].size > 6 * 1024 * 1024) {
            alert('Each screenshot must not exceed 6MB.');
            input.value = '';
            return false;
        }
    }
    return true;
}

// Progress bar for upload
const form = document.querySelector('form[enctype="multipart/form-data"]');
if (form) {
    form.addEventListener('submit', function(e) {
        const progressContainer = document.querySelector('.progress-container');
        const progressBar = document.querySelector('.progress-bar');
        if (progressContainer && progressBar) {
            progressContainer.style.display = 'block';
            progressBar.style.width = '0%';
        }
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', function(e) {
            if (e.lengthComputable) {
                const percent = (e.loaded / e.total) * 100;
                progressBar.style.width = percent + '%';
            }
        });
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    progressBar.style.width = '100%';
                    window.location.href = 'dashboard.php';
                } else {
                    alert('Upload failed!');
                }
            }
        };
        xhr.open('POST', form.action, true);
        xhr.send(new FormData(form));
        e.preventDefault();
    });
} 

// Tags input enhancement (simple comma split)
document.addEventListener('DOMContentLoaded', function() {
    const tagsInput = document.getElementById('tags');
    if (tagsInput) {
        tagsInput.addEventListener('blur', function() {
            // Remove extra spaces and duplicate tags
            let tags = tagsInput.value.split(',').map(t => t.trim()).filter((v, i, a) => v && a.indexOf(v) === i);
            tagsInput.value = tags.join(', ');
        });
    }
});
