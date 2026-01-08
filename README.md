# Push-Up Detection Using ml5.js and PoseNet

## Overview

This project is a real-time push-up counter built using **p5.js** and **ml5.js PoseNet**.  
It uses a webcam feed to detect human body keypoints and counts push-ups based on body movement logic.

The system tracks the relative position of the nose, shoulders, and wrists to determine whether the user is in the **UP** or **DOWN** position and increments the counter when a full push-up is completed.

---

## Features

- Live webcam video feed  
- Real-time PoseNet body tracking  
- Automatic push-up counting  
- UP / DOWN state detection  
- Confidence-based keypoint validation  
- On-canvas reset button  
- Visual overlays for shoulders, wrists, and nose  
- Debug values for tuning thresholds  

---

## Tech Stack

- HTML5  
- JavaScript  
- p5.js  
- ml5.js (PoseNet)

---

## How It Works

1. Webcam captures live video  
2. PoseNet detects body keypoints  
3. The program calculates:
   - Vertical difference between nose and shoulders
   - Wrist position relative to shoulders  
4. A state machine (`UP → DOWN → UP`) is used:
   - Head moves down past a threshold → `DOWN`
   - Head returns up → push-up count increases  
5. Each full movement cycle counts as one push-up  

---
