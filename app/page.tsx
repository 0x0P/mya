"use client";
import { useEffect } from "react";
import styles from "@/styles/page.module.css";

export default function Home() {
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
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

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.face}>
        <div className={styles.eyes}>
          <div className={styles.eye}></div>
          <div className={styles.eye}></div>
        </div>
        <div className={styles.mouth}></div>
      </div>
    </div>
  );
}

//너 눈을 왜그렇게 떠?
