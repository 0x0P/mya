"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import styles from "@/styles/page.module.css";

export default function Home() {
  const [isMouthClicked, setIsMouthClicked] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mouthRef = useRef<HTMLDivElement>(null);

  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSleepingRef = useRef(isSleeping);

  useEffect(() => {
    isSleepingRef.current = isSleeping;
  }, [isSleeping]);

  const handleUserActivity = useCallback(() => {
    if (isSleepingRef.current) {
      setIsSleeping(false);
    }
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
    }
    sleepTimerRef.current = setTimeout(() => {
      setIsSleeping(true);
    }, 3000);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const eyeElements = document.querySelectorAll(`.${styles.eye}`);
      const mouth = document.querySelector(`.${styles.mouth}`) as HTMLElement;

      eyeElements.forEach((eyeElement) => {
        const x = (clientX - window.innerWidth / 2) * 0.1;
        const y = (clientY - window.innerHeight / 2) * 0.1;
        (
          eyeElement as HTMLElement
        ).style.transform = `translate(${x}px, ${y}px)`;
      });

      const mouthOffsetX = (clientX - window.innerWidth / 2) * 0.05;
      const mouthOffsetY = (clientY - window.innerHeight / 2) * 0.05;

      mouth.style.transform = `translate(${mouthOffsetX}px, ${mouthOffsetY}px)`;
      handleUserActivity();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    handleUserActivity();

    // 클린업 함수
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      if (sleepTimerRef.current) {
        clearTimeout(sleepTimerRef.current);
      }
    };
  }, [handleUserActivity]);

  useEffect(() => {
    if (isMouthClicked) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setIsMouthClicked(false);
        }
        handleUserActivity();
      };

      const handleClickOutside = (event: MouseEvent) => {
        if (
          mouthRef.current &&
          !mouthRef.current.contains(event.target as Node)
        ) {
          setIsMouthClicked(false);
        }
        handleUserActivity();
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("mousedown", handleClickOutside);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [handleUserActivity, isMouthClicked]);

  return (
    <div className={`${styles.container}`}>
      <div className={styles.face}>
        <div className={`${styles.eyes} ${isMouthClicked ? styles.up : ""}`}>
          <div
            className={`${styles.eye} ${
              isSleeping ? styles.sleeping : ""
            }`}></div>
          <div
            className={`${styles.eye} ${
              isSleeping ? styles.sleeping : ""
            }`}></div>
        </div>
        <div className={`${isMouthClicked ? styles.mouthContainer : ""}`}>
          <div
            ref={mouthRef}
            className={`${styles.mouth} ${
              isMouthClicked ? styles.mouthClicked : ""
            } ${isSubmitting ? styles.submitting : ""}`}
            onClick={() => {
              setIsMouthClicked(true);
              handleUserActivity();
            }}>
            {isMouthClicked && (
              <input
                type="text"
                className={`${styles.textInput} ${
                  isSubmitting ? styles.submittingInput : ""
                }`}
                placeholder="텍스트를 입력하세요..."
                autoFocus
                onKeyDown={(e) => {
                  handleUserActivity();
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
