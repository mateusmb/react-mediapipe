# React Mediapipe - Tutorial and sample code to get Google's Mediapipe work in React

Google's Mediapipe is a set of open source cross-platform libraries for Machine Learning on real time media. If you don't know Mediapipe check out the [official webpage](https://mediapipe.dev/) and [code repo](https://github.com/google/mediapipe).

All in all, this toolset allows to easily apply feature detection and tracking for live video and media files aswell. The code base is mostly C++, but the libraries have bindings for most popular languages and platforms as of today. The official website and [docs](https://google.github.io/mediapipe/getting_started/getting_started.html) cites Android, iOS, Python and Javascript, but it should be possible to make it run in virtually any other popular language/framework.

The majority of code samples and tutorials with Mediapipe show it running in Python applications. The website shows samples with only the languages and platforms officially supported, but there are already some implementations with [Unity](https://github.com/mgyong/awesome-mediapipe/#unity), [Flutter](https://github.com/zhouzaihang/flutter_hand_tracking_plugin) and even [running directly on cloud](https://github.com/mgyong/awesome-mediapipe/#cloud-examples), just to name a few.

However there is almost no sample or tutorial to get Mediapipe running on popular web frameworks (React, Angular or Vue). Besides the official website [having setup explanations for Vanilla Javascript](https://google.github.io/mediapipe/getting_started/javascript.html), it lacks some bit of information that is needed to get it working with the frameworks. 

This repo have a setup tutorial and code samples of Mediapipe running with React, so anyone can use it right away to improve user experience and interactions in web applications made in React.

Disclaimer: Mediapipe is in an ongoing development stage. Things may change or may not. I will do my best to keep this repository updated and with the latest features. However, feel free to make pull requests if you know that something changed or if there is something new.

## Available Solutions for Javascript

