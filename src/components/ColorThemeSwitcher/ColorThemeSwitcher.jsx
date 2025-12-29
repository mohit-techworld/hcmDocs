import React, { useState, useEffect } from 'react';
import styles from './ColorThemeSwitcher.module.css';

const COLOR_THEMES = {
    green: {
        name: 'Green (Default)',
        primary: '#059669',
        primaryDark: '#047857',
        primaryLight: '#10b981',
    },
    blue: {
        name: 'Blue',
        primary: '#3b82f6',
        primaryDark: '#2563eb',
        primaryLight: '#60a5fa',
    },
    purple: {
        name: 'Purple',
        primary: '#8b5cf6',
        primaryDark: '#7c3aed',
        primaryLight: '#a78bfa',
    },
    orange: {
        name: 'Orange',
        primary: '#f97316',
        primaryDark: '#ea580c',
        primaryLight: '#fb923c',
    },
    pink: {
        name: 'Pink',
        primary: '#ec4899',
        primaryDark: '#db2777',
        primaryLight: '#f472b6',
    },
    teal: {
        name: 'Teal',
        primary: '#14b8a6',
        primaryDark: '#0d9488',
        primaryLight: '#2dd4bf',
    },
};

export default function ColorThemeSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentTheme, setCurrentTheme] = useState('green');

    useEffect(() => {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem('hcm-color-theme') || 'green';
        setCurrentTheme(savedTheme);
        applyTheme(savedTheme);
    }, []);

    const applyTheme = (themeName) => {
        const theme = COLOR_THEMES[themeName];
        if (theme) {
            document.documentElement.style.setProperty('--ifm-color-primary', theme.primary);
            document.documentElement.style.setProperty('--ifm-color-primary-dark', theme.primaryDark);
            document.documentElement.style.setProperty('--ifm-color-primary-darker', theme.primaryDark);
            document.documentElement.style.setProperty('--ifm-color-primary-darkest', theme.primaryDark);
            document.documentElement.style.setProperty('--ifm-color-primary-light', theme.primaryLight);
            document.documentElement.style.setProperty('--ifm-color-primary-lighter', theme.primaryLight);
            document.documentElement.style.setProperty('--ifm-color-primary-lightest', theme.primaryLight);
        }
    };

    const handleThemeChange = (themeName) => {
        setCurrentTheme(themeName);
        applyTheme(themeName);
        localStorage.setItem('hcm-color-theme', themeName);
        setIsOpen(false);
    };

    return (
        <div className={styles.colorThemeSwitcher}>
            <button
                className={styles.settingsButton}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Color Theme Settings"
                title="Change Color Theme"
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
                    <div className={styles.dropdown}>
                        <div className={styles.dropdownHeader}>
                            <h3>Choose Color Theme</h3>
                            <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
                                ×
                            </button>
                        </div>
                        <div className={styles.themeGrid}>
                            {Object.entries(COLOR_THEMES).map(([key, theme]) => (
                                <button
                                    key={key}
                                    className={`${styles.themeOption} ${currentTheme === key ? styles.active : ''}`}
                                    onClick={() => handleThemeChange(key)}
                                >
                                    <div
                                        className={styles.colorPreview}
                                        style={{ backgroundColor: theme.primary }}
                                    />
                                    <span className={styles.themeName}>{theme.name}</span>
                                    {currentTheme === key && (
                                        <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
