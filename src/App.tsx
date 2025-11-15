import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function App() {
  // 변경하면 다른 날짜로 카운트다운 가능
  const targetDate = new Date("2026-11-19T23:59:59");

  const calculateTimeLeft = (): TimeLeft | null => {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) return null;

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "2rem",
      }}>
        🎉 카운트다운이 종료되었습니다!
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "system-ui",
        flexDirection: "column",
      }}
    >
      <h1>🎯 GTA 6 출시까지 남은 시간</h1>
      <h2 style={{ marginTop: "2rem", fontSize: "2.4rem" }}>
        {timeLeft.days}일 {timeLeft.hours}시간{" "}
        {timeLeft.minutes}분 {timeLeft.seconds}초
      </h2>
    </div>
  );
}

export default App;
