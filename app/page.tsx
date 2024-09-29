"use client";
import { useEffect, useState, useRef } from "react";
import styles from "@/styles/page.module.css";

export default function Home() {
  const [isMouthClicked, setIsMouthClicked] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mouthRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    const resetInactivityTimer = () => {
      setIsSleeping(false);
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        setIsSleeping(true);
        console.log(isSleeping);
      }, 3000);
    };

    const handleMouseMove = (event: MouseEvent) => {
      resetInactivityTimer();
      if (isMouthClicked || isSleeping) return;

      const eyes = document.querySelectorAll(`.${styles.eye}`);
      const mouth = document.querySelector(`.${styles.mouth}`) as HTMLElement;
      const { clientX, clientY } = event;

      eyes.forEach((eye, index) => {
        const eyeElement = eye as HTMLElement;

        const offsetX = index === 0 ? 0.07 : 0.1;
        const offsetY = index === 0 ? 0.07 : 0.1;

        const x = (clientX - window.innerWidth / 2) * offsetX;
        const y = (clientY - window.innerHeight / 2) * offsetY;

        eyeElement.style.transform = `translate(${x}px, ${y}px)`;
      });

      const mouthOffsetX = (clientX - window.innerWidth / 2) * 0.05;
      const mouthOffsetY = (clientY - window.innerHeight / 2) * 0.05;

      mouth.style.transform = `translate(${mouthOffsetX}px, ${mouthOffsetY}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
    window.addEventListener("mousedown", resetInactivityTimer);

    resetInactivityTimer();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      window.removeEventListener("mousedown", resetInactivityTimer);
      clearTimeout(inactivityTimer);
    };
  }, [isMouthClicked, isSleeping]);

  useEffect(() => {
    if (isMouthClicked) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setIsMouthClicked(false);
        }
      };

      const handleClickOutside = (event: MouseEvent) => {
        if (
          mouthRef.current &&
          !mouthRef.current.contains(event.target as Node)
        ) {
          setIsMouthClicked(false);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("mousedown", handleClickOutside);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isMouthClicked]);

  return (
    <div className={`${styles.container}`}>
      <div className={styles.face}>
        <div className={`${styles.eyes}  ${isMouthClicked ? styles.up : ""}`}>
          <div
            className={`${styles.eye}  ${
              isSleeping ? styles.sleeping : ""
            } `}></div>
          <div
            className={`${styles.eye}  ${
              isSleeping ? styles.sleeping : ""
            } `}></div>
        </div>
        <div className={` ${isMouthClicked ? styles.mouthContainer : ""}`}>
          <div
            ref={mouthRef}
            className={`${styles.mouth} ${
              isMouthClicked ? styles.mouthClicked : ""
            } ${isSubmitting ? styles.submitting : ""}`}
            onClick={() => setIsMouthClicked(true)}>
            {isMouthClicked && (
              <input
                type="text"
                className={`${styles.textInput} ${
                  isSubmitting ? styles.submittingInput : ""
                }`}
                placeholder="텍스트를 입력하세요..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsSubmitting(true);
                    setTimeout(() => {
                      setIsSubmitting(false);
                      setIsMouthClicked(false);
                    }, 1200);
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
