document.addEventListener('DOMContentLoaded', () => {
  const uploadBtn = document.getElementById('uploadBtn');
  const fileInput = document.getElementById('fileInput');

  uploadBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        // Store the selected image data in localStorage
        localStorage.setItem('selectedImage', e.target.result);

        // Redirect to the second page
        window.location.href = 'imageEditor.html';
      };
      reader.readAsDataURL(file);
    }
  });
});
