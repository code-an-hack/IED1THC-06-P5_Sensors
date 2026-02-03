**Demo**
https://code-an-hack.github.io/IED1THC-05-P5_Sensors/

**Steps**
1. Start the video capture and display the video feed in the canvas.
2. Downsize the video feed using a graphics buffer.
3. Create a function that will boost the saturation of the downsized video feed. This function takes in input the video buffer and a value from 0 to 100 that will control the boost of saturation. Use HSL color space conversion to boost saturation. Use the function in draw().
4. Create a function that will chroma key the downsized video feed. This function takes in input the video buffer, the key color and the threshold. Pixels close to the key color should remain visible, pixels far from it should become transparent.
5. Add a blur filter using the p5 library.
6. Get audio in from the microphone. Console logs its amplitude.
7. Use the Fast Fourier Transform analyzer to analyze the spectrume of the audio from the microphone. Extract frequency band energy to build the chroma key color: high energy in the bass range will mean more red color, high energy in the mids range will mean more green color, high energy in the treble range will mean more blue color.
