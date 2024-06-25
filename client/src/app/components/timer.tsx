"use client";
import { useState, useEffect } from "react";

const Timer = () => {
  const [time, setTime] = useState(30 * 60); // 30 minutes in seconds
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isActive && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isActive, time]);

  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(30 * 60);
  };

  return (
    <div className="bg-[url('https://www.krqe.com/wp-content/uploads/sites/12/2022/12/AdobeStock_81556974.jpeg?w=2560&h=1440&crop=1')] flex flex-col ml-[300px] items-center justify-center h-screen bg-gray-100 bg-no-repeat	bg-cover	">
      <div className="bg-white p-10 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Timer</h1>
        <div className="text-6xl font-mono mb-4">{formatTime(time)}</div>
        <div className="space-x-4">
          <button
            onClick={handleStartPause}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            {isActive ? "Pause" : "Start"}
          </button>
          <button
            onClick={handleReset}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;
