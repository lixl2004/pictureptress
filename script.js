document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const previewArea = document.getElementById('previewArea');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const originalDimensions = document.getElementById('originalDimensions');
    const compressionRatio = document.getElementById('compressionRatio');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalImage = null;

    // 上传区域交互效果
    function handleDragEvents(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.type === 'dragenter' || e.type === 'dragover') {
            uploadArea.querySelector('.upload-box').style.borderColor = '#007AFF';
            uploadArea.querySelector('.upload-box').style.backgroundColor = 'rgba(0, 122, 255, 0.05)';
        } else {
            uploadArea.querySelector('.upload-box').style.borderColor = '#ddd';
            uploadArea.querySelector('.upload-box').style.backgroundColor = 'transparent';
        }
    }

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, handleDragEvents);
    });

    // 处理文件上传
    uploadArea.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files[0];
        if (file && file.type.match('image.*')) {
            processFile(file);
        }
    });

    uploadArea.addEventListener('click', () => imageInput.click());

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    });

    // 处理文件
    function processFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage = new Image();
            originalImage.src = e.target.result;
            originalImage.onload = () => {
                originalPreview.src = originalImage.src;
                originalSize.textContent = `大小: ${formatFileSize(file.size)}`;
                originalDimensions.textContent = `尺寸: ${originalImage.width} x ${originalImage.height}`;
                compressImage();
                previewArea.style.display = 'block';
                
                // 平滑滚动到预览区域
                previewArea.scrollIntoView({ behavior: 'smooth' });
            };
        };
        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        
        ctx.drawImage(originalImage, 0, 0);
        
        const quality = qualitySlider.value / 100;
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        compressedPreview.src = compressedDataUrl;
        
        // 计算压缩后的大小和压缩率
        const originalSize = Math.round(atob(originalImage.src.split(',')[1]).length);
        const compressedSize = Math.round(atob(compressedDataUrl.split(',')[1]).length);
        const ratio = Math.round((1 - compressedSize / originalSize) * 100);
        
        document.getElementById('compressedSize').textContent = 
            `大小: ${formatFileSize(compressedSize)}`;
        document.getElementById('compressionRatio').textContent = 
            `压缩率: ${ratio}%`;
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
        else return (bytes / 1048576).toFixed(2) + ' MB';
    }

    // 质量滑块控制
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = qualitySlider.value + '%';
        if (originalImage) {
            compressImage();
        }
    });

    // 下载压缩后的图片
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        const timestamp = new Date().getTime();
        link.download = `compressed-image-${timestamp}.jpg`;
        link.href = compressedPreview.src;
        link.click();
    });
}); 