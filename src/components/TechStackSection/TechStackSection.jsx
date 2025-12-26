import React from "react";
import styles from "./TechStackSection.module.css";
import Heading from "@theme/Heading";

const technologies = [
    { name: "React", icon: "⚛️", color: "#61DAFB" },
    { name: "Node.js", icon: "🟢", color: "#339933" },
    { name: "MongoDB", icon: "🍃", color: "#47A248" },
    { name: "Redis", icon: "🔴", color: "#DC382D" },
    { name: "Socket.io", icon: "🔌", color: "#010101" },
    { name: "AWS", icon: "☁️", color: "#FF9900" },
];

export default function TechStackSection() {
    return (
        <section className={styles.techSection}>
            <div className="container">
                <div className={styles.header}>
                    <Heading as="h2" className={styles.title}>
                        Built with Modern Technology
                    </Heading>
                    <p className={styles.subtitle}>
                        Enterprise-grade stack powering reliable, scalable HR solutions
                    </p>
                </div>
                <div className={styles.techGrid}>
                    {technologies.map((tech, index) => (
                        <div
                            key={index}
                            className={styles.techItem}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={styles.techIcon}>{tech.icon}</div>
                            <div className={styles.techName}>{tech.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
