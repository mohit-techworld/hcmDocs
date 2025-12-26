import React from "react";
import styles from "./AnimatedCards.module.css";

export default function MobileCodeCard() {
  return (
    <div className={styles.mobileCard}>
      <div className={styles.mobileCodeSection}>
        <div className={styles.mobileCodeHeader}>
          <div className={styles.mobileDeviceFrame}>
            <div className={styles.mobileNotch}></div>
            <div className={styles.mobileScreen}>
              <div className={styles.mobileCodeContentWrapper}>
                <div className={styles.mobileCodeScrollingContent}>
                  <div className={styles.mobileCodeLine}>
                    <span className={styles.mobileLineNumber}>1</span>
                    <span className={styles.mobileCode}>
                      <span className={styles.keyword}>import</span>{" "}
                      <span className={styles.string}>React</span>{" "}
                      <span className={styles.keyword}>from</span>{" "}
                      <span className={styles.string}>'react-native'</span>;
                    </span>
                  </div>
                  <div className={styles.mobileCodeLine}>
                    <span className={styles.mobileLineNumber}>2</span>
                    <span className={styles.mobileCode}></span>
                  </div>
                  <div className={styles.mobileCodeLine}>
                    <span className={styles.mobileLineNumber}>3</span>
                    <span className={styles.mobileCode}>
                      <span className={styles.keyword}>const</span>{" "}
                      <span className={styles.function}>AttendanceScreen</span>{" "}
                      = <span className={styles.bracket}>{"()"}</span> => {"{"}
                    </span>
                  </div>
                  <div className={styles.mobileCodeLine}>
                    <span className={styles.mobileLineNumber}>4</span>
                    <span className={styles.mobileCode}>
                      {"  "}
                      <span className={styles.keyword}>const</span>{" "}
                      <span className={styles.bracket}>{"{"}</span>
                      <span className={styles.variable}>checkIn</span>,{" "}
                      <span className={styles.variable}>checkOut</span>
                      <span className={styles.bracket}>{"}"}</span> ={" "}
                      <span className={styles.function}>useAttendance</span>
                      <span className={styles.bracket}>()</span>;
                    </span>
                  </div>
                  <div className={styles.mobileCodeLine}>
                    <span className={styles.mobileLineNumber}>5</span>
                    <span className={styles.mobileCode}></span>
                  </div>
                  <div className={styles.mobileCodeLine}>
                    <span className={styles.mobileLineNumber}>6</span>
                    <span className={styles.mobileCode}>
                      {"  "}
                      <span className={styles.keyword}>return</span>{" "}
                      <span className={styles.bracket}>{"("}</span>
                    </span>
                  </div>
                  <div className={styles.mobileCodeLine}>
                    <span className={styles.mobileLineNumber}>7</span>
                    <span className={styles.mobileCode}>
                      {"    "}
                      <span className={styles.tag}>{"<View"}</span>{" "}
                      <span className={styles.attr}>style</span>=
                      <span className={styles.string}>
                        {"{styles.container}"}
                      </span>
                      <span className={styles.tag}>{">"}</span>
                    </span>
                  </div>
                  <div className={styles.mobileCodeLine}>
                    <span className={styles.mobileLineNumber}>8</span>
                    <span className={styles.mobileCode}>
                      {"      "}
                      <span className={styles.tag}>{"<Button"}</span>{" "}
                      <span className={styles.attr}>onPress</span>=
                      <span className={styles.string}>{"{checkIn}"}</span>
                      <span className={styles.tag}>{" />"}</span>
                    </span>
                  </div>
                  <div className={styles.mobileCodeLine}>
                    <span className={styles.mobileLineNumber}>9</span>
                    <span className={styles.mobileCode}>
                      {"    "}
                      <span className={styles.tag}>{"</View>"}</span>
                    </span>
                  </div>
                  <div className={styles.mobileCodeLine}>
                    <span className={styles.mobileLineNumber}>10</span>
                    <span className={styles.mobileCode}>
                      {"  "}
                      <span className={styles.bracket}>{");"}</span>
                    </span>
                  </div>
                  {/* Duplicate for seamless loop */}
                  <div className={styles.mobileCodeLine}>
                    <span className={styles.mobileLineNumber}>1</span>
                    <span className={styles.mobileCode}>
                      <span className={styles.keyword}>import</span>{" "}
                      <span className={styles.string}>React</span>{" "}
                      <span className={styles.keyword}>from</span>{" "}
                      <span className={styles.string}>'react-native'</span>;
                    </span>
                  </div>
                  <div className={styles.mobileCodeLine}>
                    <span className={styles.mobileLineNumber}>2</span>
                    <span className={styles.mobileCode}></span>
                  </div>
                  <div className={styles.mobileCodeLine}>
                    <span className={styles.mobileLineNumber}>3</span>
                    <span className={styles.mobileCode}>
                      <span className={styles.keyword}>const</span>{" "}
                      <span className={styles.function}>AttendanceScreen</span>{" "}
                      = <span className={styles.bracket}>{"()"}</span> => {"{"}
                    </span>
                  </div>
                  <div className={styles.mobileCodeLine}>
                    <span className={styles.mobileLineNumber}>4</span>
                    <span className={styles.mobileCode}>
                      {"  "}
                      <span className={styles.keyword}>const</span>{" "}
                      <span className={styles.bracket}>{"{"}</span>
                      <span className={styles.variable}>checkIn</span>,{" "}
                      <span className={styles.variable}>checkOut</span>
                      <span className={styles.bracket}>{"}"}</span> ={" "}
                      <span className={styles.function}>useAttendance</span>
                      <span className={styles.bracket}>()</span>;
                    </span>
                  </div>
                  <div className={styles.mobileCodeLine}>
                    <span className={styles.mobileLineNumber}>5</span>
                    <span className={styles.mobileCode}></span>
                  </div>
                  <div className={styles.mobileCodeLine}>
                    <span className={styles.mobileLineNumber}>6</span>
                    <span className={styles.mobileCode}>
                      {"  "}
                      <span className={styles.keyword}>return</span>{" "}
                      <span className={styles.bracket}>{"("}</span>
                    </span>
                  </div>
                  <div className={styles.mobileCodeLine}>
                    <span className={styles.mobileLineNumber}>7</span>
                    <span className={styles.mobileCode}>
                      {"    "}
                      <span className={styles.tag}>{"<View"}</span>{" "}
                      <span className={styles.attr}>style</span>=
                      <span className={styles.string}>
                        {"{styles.container}"}
                      </span>
                      <span className={styles.tag}>{">"}</span>
                    </span>
                  </div>
                  <div className={styles.mobileCodeLine}>
                    <span className={styles.mobileLineNumber}>8</span>
                    <span className={styles.mobileCode}>
                      {"      "}
                      <span className={styles.tag}>{"<Button"}</span>{" "}
                      <span className={styles.attr}>onPress</span>=
                      <span className={styles.string}>{"{checkIn}"}</span>
                      <span className={styles.tag}>{" />"}</span>
                    </span>
                  </div>
                  <div className={styles.mobileCodeLine}>
                    <span className={styles.mobileLineNumber}>9</span>
                    <span className={styles.mobileCode}>
                      {"    "}
                      <span className={styles.tag}>{"</View>"}</span>
                    </span>
                  </div>
                  <div className={styles.mobileCodeLine}>
                    <span className={styles.mobileLineNumber}>10</span>
                    <span className={styles.mobileCode}>
                      {"  "}
                      <span className={styles.bracket}>{");"}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.mobileLogo}>
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="8"
              y="4"
              width="24"
              height="32"
              rx="4"
              stroke="#61dafb"
              strokeWidth="2"
              className={styles.mobilePulse}
            />
            <circle
              cx="20"
              cy="30"
              r="2"
              fill="#61dafb"
              className={styles.mobilePulse}
            />
          </svg>
        </div>
      </div>
      <div className={styles.cardContent}>
        <div>
          <h3 className={styles.cardTitle}>Mobile-First Design</h3>
          <p className={styles.cardDescription}>
            Full React Native support for iOS and Android. Access attendance,
            leave requests, tasks, and more from anywhere with native mobile
            apps. Offline capabilities, push notifications, and biometric
            authentication are all built-in for a seamless mobile experience.
          </p>
        </div>
        <a href="/docs/mobile" className={styles.cardButton}>
          Mobile Docs →
        </a>
      </div>
    </div>
  );
}
