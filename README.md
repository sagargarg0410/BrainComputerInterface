# Brain Computer Interface Using Prosthetics
This repository is made for demonstrating Brain Computer Interfaces with the help of Prosthetic Arm via Software and Hardware. <br>
## Description Of The Project 
Prosthetics are the artificial devices used when a person loses a part of their body due to war or injury. Here in this project, prosthetic arm  is designed using the EEG technique. EEG is a technique that measures the human brain activities when electrodes are placed on the human scalp. Using the signals and responses we acquire from the brain using the EEG technique we played BCI-based mini-games that are integrated into the website. Many interrelated technologies have been within to demonstate the concepts of BCI till the end. <br>
This project is a mixture of various technologies including Neuroscience, Analog Electronics, Embedded systems, Mechanic Engineering, and Website Development. <br>
This project aimed to collaborate state-of-the-art technologies and inventive concepts to offer prosthetic users a completely fresh and fulfilling experience.<br>
## Tools and TechStack Used
-> Emotiv Insight Headset <br>
-> Raspberry Pi 3B  <br>
-> Node-Red (IoT platform) <br>
-> MG996 Servo Motors <br> 
-> Switching-mode power supply(SMPS) <br>
-> Buck Convertor Circuit (XL4005) <br>
-> Pspice Software  <br>
-> InMoov & 3D Printing <br>
-> Front End Technologies (HTML, CSS,JS) <br>
-> ReactJs <br>
-> NodeJs <br>
-> Web Sockets <br>

## Table Of Contents 
 ### 1) Neuroscience Part <br>
 ### 2) Embedded Part <br>
 ### 3) Analog Part <br>
 ### 4) Mechanical Engineering Part <br>
 ### 5) Website Integration and BCI <br>
-----------------------------------------------------------------------------------------------------------------------------------------------------------------

## 1) Neuroscience Part <br>
In the neuroscience part, we used the Emotiv Insight headset to capture Electroencephalogram (EEG) signals from the brain for processing. This headset offers 5 channels for monitoring mental states for academic and research work. Through this device, we aimed to enhance mental performance and concentration. <br>
 By analyzing EEG data, on the AF3 region, we noticed clear responses to actions, indicating the brain's feedback mechanism. The software part provided detailed insights, including facial analysis for detecting emotions and engagement levels during activities. These insights, once trained, can be utilized to trigger specific functions through servos. <br>
 
 ![Emotiv Facial Gestures](https://github.com/sagargarg0410/BrainComputerInterface/assets/92421207/7b1f7128-ec6a-4cc5-b87e-d1eb0f0df2b9)

This API enabled seamless retrieval of raw EEG data for processing within the Emotiv suite, which includes training models using deep learning algorithms to adapt to individual differences in brain functioning. For better understanding and observation 2 facial gestures neutral face and smiling face are being used. <br>

## 2) Embedded Systems Part [ Maybe changes required ] <br>
To enable the transmission of signals from the 5-Channel EEG headset to the servos, The EEG signals, once sampled, are transmitted to the arm wirelessly, using a Raspberry Pi III microcomputer. <br>
The Raspberry Pi 3B was chosen because of its ample number of GPIO pins which makes internet connectivity easy.  Now for the Emotiv headsets signals are integrated using an IoT platform  NODE-RED which is used to connect the headsets to the microcontrollers. Node-RED is based on Node-js and is used for connectivity and interfacing between hardware and software.   <br>

![Flow Diagram](https://github.com/sagargarg0410/BrainComputerInterface/assets/92421207/730389c3-f333-48a9-9f08-f15065723c28)

The flow of information begins with the Emotiv which is accessed by the headset to take the information, facial expressions are compared then using a specific value and subsequently, it reaches the microcomputer output pins which direct it to servos. 

## 3) Analog Electronics Part <br>

To control the prosthetic arms we need proper circuitry.  For this purpose a Raspberry Pi 3B is used along with six MG996 servo motors, each having a current value of 440 mA. Under maximum load, the entire setup could consume between 3 to 4 amps of current.  <br>

![Buck Convertor](https://github.com/sagargarg0410/BrainComputerInterface/assets/92421207/43198516-92eb-482f-ac99-923113d82732)

We need a circuit that provides which supports low voltage and current. The Buck Converter circuit is found to be perfect for this role as it steps down the applied DC signal.  This indicates that the system is made to generate a DC signal as its output, which has a magnitude lower than the applied input. <br>
The circuit was designed and simulated in PSpice Software. Considering all the conditions and values required for testing, a Buck XL4005 buck converter was used to save money and time. XL4005  is a DC-DC 5-32V Adjustable Step Down 5A Buck Power Supply. <br>

## 4) Mechanical Engineering <br>

To produce a functional arm with a good level of degree of freedom keeping in mind the Physical Design, Control Scheme, Practicality, and Affordable for the prosthetic users. For referring to the models InMoov was used which is the first Open Source 3D printed life-size robot. Utilized the stl files of the forearm and the hand from the Project InMoov.  <br>

![InMoov](https://github.com/sagargarg0410/BrainComputerInterface/assets/92421207/4f37672d-5efe-4e34-b9dc-354a2f1be7c1)

These STL  files are used for 3D Printing. 3D printing is a technique used for the construction of 3D objects using CAD software. The material used in the prosthetic arm is ABS ( Acrylonitrile butadiene styrene) which is used because it does not melt when different parts are joined together in the prosthetic arm. <br>

## 5) Website Integration and BCI <br>

A website was made for the demonstration of the Brain-Computer Interface. Brain-computer interface is a technology through which there is direct communication between the brain’s electrical activities and the external environment. Concepts of BCI becomes crucial & plays a significant part in life of a prosthetic user. <br>

![BCIjpg](https://github.com/sagargarg0410/BrainComputerInterface/assets/92421207/b8666134-f178-4d66-b6c5-a8f8378a744f)

The front end of the website is made using  ReactJs which is an open-source free Javascript library used for creating user–interfaces.  The front end of the website includes information about the Prosthetics according to the Indian scenario, about emotive headsets, and InMoov, the authors’ page. <br>

The backend of the project is used for integration of the mini-games in the project. Using the mini-games the user can seamlessly play the game without using their hands or any part of their body which perfectly defines the concept of Brain–Computer Interface. <br>

Here real-time applications like mini projects are integrated on the website. Real-time applications can be used in websites using WebSockets. The WebSocket API represents a sophisticated technology enabling the establishment of a bidirectional interactive communication channel between a user's browser and a server. Through this API, users can transmit messages to a server and seamlessly receive event-triggered responses, eliminating the need to continuously poll the server for updates.<br>

2 Mini Games are integrated into the project <br>

#### Ping Ping  Game - 
The ping-pong game is crafted in such a way that features an AI opponent that intelligently counters the player's moves. The paddle control mechanism is innovatively linked to facial commands: a smile prompts the paddle to ascend, while a neutral expression prompts its descent. This design offers users an immersive experience, showcasing the capabilities of mental commands. It's worth noting that these actions are driven solely by brain signals, without reliance on real-time image processing. <br>

#### Fruit- Rally  - 
( no information yet )



