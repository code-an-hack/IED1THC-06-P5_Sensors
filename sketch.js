let video;
let smallVideo;
let luminosity = 0;
let avgSaturation = 0;
let avgColor;

const SATURATION_BOOST = 60;

function setup() {
  createCanvas(1280, 720);
  background(0);

  frameRate(30);

  // Create video capture from webcam
  video = createCapture(VIDEO);
  video.size(1280, 720);
  video.hide();

  // Create a smaller graphics buffer for processing (e.g., 160x90 = 64x smaller)
  smallVideo = createGraphics(160, 90);
}

function draw() {
  // Draw the video feed to the smaller buffer for processing
  smallVideo.image(video, 0, 0, smallVideo.width, smallVideo.height);

  smallVideo.loadPixels();

  let totalLuminosity = 0;
  let totalSaturation = 0;
  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let pixelCount = 0;

  // Sample pixels from the downsized video feed
  if (smallVideo.pixels.length > 0) {
    for (let y = 0; y < smallVideo.height; y++) {
      for (let x = 0; x < smallVideo.width; x++) {
        let index = (y * smallVideo.width + x) * 4;

        if (index + 2 < smallVideo.pixels.length) {
          let r = smallVideo.pixels[index + 0];
          let g = smallVideo.pixels[index + 1];
          let b = smallVideo.pixels[index + 2];

          // Calculate brightness as average of RGB values
          let lum = (r + g + b) / 3;

          // Calculate saturation using p5's built-in saturation() function
          let sat = saturation(color(r, g, b));

          totalLuminosity += lum;
          totalSaturation += sat;
          totalR += r;
          totalG += g;
          totalB += b;
          pixelCount++;
        }
      }
    }
  }

  // Calculate averages
  if (pixelCount > 0) {
    luminosity = totalLuminosity / pixelCount;
    avgSaturation = totalSaturation / pixelCount;
    let avgR = totalR / pixelCount;
    let avgG = totalG / pixelCount;
    let avgB = totalB / pixelCount;
    avgColor = color(avgR, avgG, avgB);
  }

  boostSaturation(smallVideo, SATURATION_BOOST);
  image(smallVideo, 0, 0, width, height);
  filter(BLUR, 5);
  tint(255, 255, 255, 5);

  //   // Display the values as text
  //   fill(255);
  //   stroke(0);
  //   strokeWeight(2);
  //   textSize(24);
  //   textAlign(LEFT, TOP);

  //   let textY = 20;
  //   text(`Luminosity: ${luminosity.toFixed(3)}`, 20, textY);
  //   text(`Saturation: ${avgSaturation.toFixed(3)}`, 20, textY + 40);

  //   // Display average color
  //   if (avgColor) {
  //     let avgR = red(avgColor);
  //     let avgG = green(avgColor);
  //     let avgB = blue(avgColor);
  //     text(`Avg Color R: ${avgR.toFixed(0)} G: ${avgG.toFixed(0)} B: ${avgB.toFixed(0)}`, 20, textY + 80);

  //     // Draw a color swatch
  //     fill(avgColor);
  //     noStroke();
  //     rect(20, textY + 110, 100, 50);

  //     // Draw border around swatch
  //     noFill();
  //     stroke(0);
  //     strokeWeight(2);
  //     rect(20, textY + 110, 100, 50);
  //   }
}

function boostSaturation(videoBuffer, saturationBoost) {
  // Early return if no boost needed
  if (saturationBoost === 0) {
    return;
  }

  videoBuffer.loadPixels();

  for (let i = 0; i < videoBuffer.pixels.length; i += 4) {
    let r = videoBuffer.pixels[i + 0] / 255.0;
    let g = videoBuffer.pixels[i + 1] / 255.0;
    let b = videoBuffer.pixels[i + 2] / 255.0;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    s = constrain(s * 100 + saturationBoost, 0, 100) / 100;

    let rOut, gOut, bOut;
    if (s === 0) {
      rOut = gOut = bOut = l;
    } else {
      let hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;
      rOut = hue2rgb(p, q, h + 1 / 3);
      gOut = hue2rgb(p, q, h);
      bOut = hue2rgb(p, q, h - 1 / 3);
    }

    videoBuffer.pixels[i + 0] = Math.round(rOut * 255);
    videoBuffer.pixels[i + 1] = Math.round(gOut * 255);
    videoBuffer.pixels[i + 2] = Math.round(bOut * 255);
  }

  videoBuffer.updatePixels();
}

function keyPressed() {
  if (key === "e" || key === "E") {
    saveCanvas("canvas", "png");
    return false; // prevent default browser behavior
  }
}
