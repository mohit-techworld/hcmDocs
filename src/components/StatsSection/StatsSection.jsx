import React, { useEffect, useRef, useState } from "react";
import styles from "./StatsSection.module.css";

const stats = [
    { number: "18+", label: "Core Modules" },
    { number: "50+", label: "API Endpoints" },
    { number: "100%", label: "Real-time" },
    { number: "∞", label: "Scalability" },
];

function AnimatedNumber({ value, isVisible }) {
    const [displayValue, setDisplayValue] = useState("0");

    useEffect(() => {
        if (!isVisible) return;

        // Handle non-numeric values
        if (value === "∞" || value === "100%") {
            setDisplayValue(value);
            return;
        }

        // Extract number and suffix
        const numericPart = parseInt(value.replace(/\D/g, ""), 10);
        const suffix = value.replace(/[0-9]/g, "");

        let start = 0;
        const duration = 2000;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * numericPart);

            setDisplayValue(`${current}${suffix}`);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }, [value, isVisible]);

    return <span>{displayValue}</span>;
}

export default function StatsSection() {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section className={styles.statsSection} ref={sectionRef}>
            <div className="container">
                <div className={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={styles.statItem}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={styles.statNumber}>
                                <AnimatedNumber value={stat.number} isVisible={isVisible} />
                            </div>
                            <div className={styles.statLabel}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
