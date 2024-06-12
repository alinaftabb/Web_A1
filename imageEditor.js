document.addEventListener('DOMContentLoaded', () => {
  const getElement = id => document.getElementById(id);
  const img = getElement('image');
  const imageInput = getElement('imageInput');
  const selectedImageData = localStorage.getItem('selectedImage');

  // Set the image source to the selected image data
  img.src = selectedImageData;

  const state = {
    brightnessValue: 100,
    contrast: 100,
    saturation: 100,
    vibrance: 100,
    blur: 0,
    rotation: 0,
    scale: 100,
    cropDirection: 0,
    crop: 0,
  };

  function updateImageFilters() {
    const {
      brightnessValue,
      contrast,
      saturation,
      vibrance,
      blur,
      rotation,
      scale,
      cropDirection,
      crop,
    } = state;
    img.style.filter = `brightness(${brightnessValue}%) contrast(${contrast}%) saturate(${saturation}%) brightness(${vibrance}%) blur(${blur}px)`;
    img.style.transform = `scale(${scale / 100}) rotate(${rotation}deg)`;
    let clipPathValue;

    switch (cropDirection) {
      case 0:
        clipPathValue = `inset(0 ${crop}% 0 0)`;
        break;
      case 1:
        clipPathValue = `inset(0 0 0 ${crop}%)`;
        break;
      case 2:
        clipPathValue = `inset(${crop}% 0 0 0)`;
        break;
      case 3:
        clipPathValue = `inset(0 0 ${crop}% 0)`;
        break;
    }

    img.style.clipPath = clipPathValue;
  }

  function handleButtonClick(button, property, increment) {
    getElement(button).addEventListener('click', () => {
      state[property] = Math.min(Math.max(state[property] + increment, 0), 200);
      updateImageFilters();
    });
  }

  handleButtonClick('brightness-plus', 'brightnessValue', 10);
  handleButtonClick('brightness-minus', 'brightnessValue', -10);
  handleButtonClick('contrast-plus', 'contrast', -10);
  handleButtonClick('contrast-minus', 'contrast', 10);
  handleButtonClick('saturation-plus', 'saturation', 10);
  handleButtonClick('saturation-minus', 'saturation', -10);
  handleButtonClick('vibrance-plus', 'vibrance', 10);
  handleButtonClick('vibrance-minus', 'vibrance', -10);
  handleButtonClick('blur-btn', 'blur', 3);
  handleButtonClick('rotate-btn', 'rotation', 90);
  handleButtonClick('scale-btn', 'scale', 10);

  getElement('remove-btn').addEventListener('click', () => {
    Object.assign(state, {
      brightnessValue: 100,
      contrast: 100,
      saturation: 100,
      vibrance: 100,
      blur: 0,
      rotation: 0,
      scale: 100,
      crop: 0,
      cropDirection: 0,
    });
    updateImageFilters();
  });

  getElement('download-btn').addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.src = img.src; // Use the displayed image as the source

    image.onload = function () {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.filter = `brightness(${state.brightnessValue}%) contrast(${state.contrast}%) saturate(${state.saturation}%) brightness(${state.vibrance}%) blur(${state.blur}px)`;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Convert canvas to a data URL
      const dataURL = canvas.toDataURL('image/jpeg');

      // Create a download link
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = 'edited_image.jpg'; // Set the desired file name
      a.click();
    };
  });

  // Add an event listener to the file input
  imageInput.addEventListener('change', event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        img.src = e.target.result; // Set the displayed image source to the selected file
      };
      reader.readAsDataURL(file);
    }
  });

  getElement('crop-btn').addEventListener('click', () => {
    state.cropDirection = (state.cropDirection + 1) % 4;
    state.crop = 50;
    updateImageFilters();
  });
});
