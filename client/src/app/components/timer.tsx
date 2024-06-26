"use client";
import { useState, useEffect, useRef } from "react";

const displayMediaOptions = {
  video: { mediaSource: "screen", displaySurface: "browser" },
  audio: false,
  preferCurrentTab: false,
  selfBrowserSurface: "exclude",
  systemAudio: "include",
  surfaceSwitching: "include",
  monitorTypeSurfaces: "include",
};

let captureStream: MediaStream;
let mediaRecorder: MediaRecorder;
let data: Blob[] = [];

const startCapture = async (
  displayMediaOptions: DisplayMediaStreamOptions
): Promise<MediaStream> => {
  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia(
      displayMediaOptions
    );
  } catch (err) {
    console.error(`Error: ${err}`);
  }
  mediaRecorder = new MediaRecorder(captureStream);
  mediaRecorder.ondataavailable = (e: BlobEvent) => {
    data.push(e.data);
  };
  mediaRecorder.start();

  console.log(`Capture Stream: ${captureStream}`);
  console.log("Screen Capture Started...");
  return captureStream;
};

const endCapture = () => {
  if (captureStream) {
    captureStream.getTracks().forEach((track: any) => track.stop());
  }
  if (mediaRecorder) {
    mediaRecorder.onstop = (e) => {
      const videoElement = document.querySelector("video") as HTMLVideoElement;
      if (data.length > 0) {
        videoElement.src = URL.createObjectURL(
          new Blob(data, { type: data[0].type })
        );
      }
    };
    console.log(`Media Recorder Data: ${data}`);
    console.log(`Media Recorder : ${mediaRecorder}`);
    mediaRecorder.stop();
  }
  console.log("Screen Capture Ended.");
};

const Timer = () => {
  const [time, setTime] = useState(60); // 1 minute in seconds
  const [isActive, setIsActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let timer: any;
    if (isActive && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isActive, time]);

  const formatTime = (time: any) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const startFunction = () => {
    handleStartPause();
    startCapture(displayMediaOptions);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(60);
  };

  const stopFunction = () => {
    handleReset();
    endCapture();
  };

  const [screenshots, setScreenshots] = useState<string[]>([]);
  const captureScreenshot = async () => {
    if (captureStream) {
      const videoTrack = captureStream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(videoTrack);
      const bitmap = await imageCapture.grabFrame();
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d");
      context?.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);
      const img = canvas.toDataURL("image/jpeg");
      console.log(img);
      setScreenshots((prevScreenshots) => [...prevScreenshots, img]);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      captureScreenshot();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        captureScreenshot();
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [captureStream]);

  //save to local storage until i get to backend
  useEffect(() => {
    const storedScreenshots = localStorage.getItem("screenshots");
    if (storedScreenshots) {
      setScreenshots(JSON.parse(storedScreenshots));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("screenshots", JSON.stringify(screenshots));
  }, [screenshots]);

  return (
    <div className="bg-[url('https://www.krqe.com/wp-content/uploads/sites/12/2022/12/AdobeStock_81556974.jpeg?w=2560&h=1440&crop=1')] flex flex-col ml-[300px] items-center justify-center h-screen bg-gray-100 bg-no-repeat	bg-cover">
      <div className="bg-white p-10 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Timer</h1>
        <div className="text-6xl font-mono mb-4">{formatTime(time)}</div>
        <div className="space-x-4">
          {isActive ? (
            <button
              onClick={stopFunction}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={startFunction}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Start
            </button>
          )}
        </div>
      </div>
      <div>
        <h1 className="text-lg text-white text-border font-bold">Video Test</h1>
        <video ref={videoRef} width="700" height="700" controls></video>
      </div>
    </div>
  );
};

export default Timer;
