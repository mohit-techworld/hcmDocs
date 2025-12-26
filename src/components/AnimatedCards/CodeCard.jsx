import React from "react";
import styles from "./AnimatedCards.module.css";

export default function CodeCard() {
  return (
    <div className={styles.codeCard}>
      <div className={styles.codeSection}>
        <div className={styles.codeHeader}>
          <div className={styles.codeDots}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className={styles.codeContentWrapper}>
          <div className={styles.codeScrollingContent}>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>7</span>
              <span className={styles.code}>
                <span className={styles.keyword}>const</span>{" "}
                <span className={styles.bracket}>{"{"}</span>
                <span className={styles.variable}> employees</span>,{" "}
                <span className={styles.variable}>total</span>{" "}
                <span className={styles.bracket}>{"}"}</span> ={" "}
                <span className={styles.function}>useEmployeeList</span>
                <span className={styles.bracket}>()</span>;
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>9</span>
              <span className={styles.code}>
                <span className={styles.keyword}>if</span>{" "}
                <span className={styles.bracket}>{"("}</span>
                <span className={styles.variable}>isLoading</span>
                <span className={styles.bracket}>{"}"}</span>{" "}
                <span className={styles.keyword}>return</span>{" "}
                <span className={styles.tag}>{"<div>"}</span>Loading...
                <span className={styles.tag}>{"</div>"}</span>;
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>11</span>
              <span className={styles.code}>
                <span className={styles.keyword}>return</span>{" "}
                <span className={styles.bracket}>{"("}</span>
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>12</span>
              <span className={styles.code}>
                {"  "}
                <span className={styles.tag}>{"<h1>"}</span>Employees
                <span className={styles.tag}>{"</h1>"}</span>
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>13</span>
              <span className={styles.code}>
                {"  "}
                <span className={styles.tag}>{"<h3>"}</span>Showing{" "}
                <span className={styles.bracket}>{"{"}</span>
                <span className={styles.variable}>total</span>
                <span className={styles.bracket}>{"}"}</span> employees
                <span className={styles.tag}>{"</h3>"}</span>
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>14</span>
              <span className={styles.code}>
                {"  "}
                <span className={styles.tag}>{"<ul>"}</span>
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>15</span>
              <span className={styles.code}>
                {"    "}
                <span className={styles.variable}>employees</span>
                <span className={styles.function}>.map</span>
                <span className={styles.bracket}>{"("}</span>
                <span className={styles.variable}>emp</span>{" "}
                <span className={styles.keyword}>=></span>{" "}
                <span className={styles.bracket}>{"("}</span>
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>16</span>
              <span className={styles.code}>
                {"      "}
                <span className={styles.tag}>{"<li"}</span>{" "}
                <span className={styles.attr}>key</span>=
                <span className={styles.string}>{"{"}</span>
                <span className={styles.variable}>emp.id</span>
                <span className={styles.string}>{"}"}</span>
                <span className={styles.tag}>{">"}</span>
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>17</span>
              <span className={styles.code}>
                {"        "}
                <span className={styles.tag}>{"<span>"}</span>
                <span className={styles.bracket}>{"{"}</span>
                <span className={styles.variable}>emp.name</span>
                <span className={styles.bracket}>{"}"}</span>
                <span className={styles.tag}>{"</span>"}</span>
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>18</span>
              <span className={styles.code}>
                {"      "}
                <span className={styles.tag}>{"</li>"}</span>
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>19</span>
              <span className={styles.code}>
                {"    "}
                <span className={styles.bracket}>{"))"}</span>
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>20</span>
              <span className={styles.code}>
                {"  "}
                <span className={styles.tag}>{"</ul>"}</span>
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>21</span>
              <span className={styles.code}>
                <span className={styles.bracket}>{");"}</span>
              </span>
            </div>
            {/* Duplicate for seamless loop */}
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>7</span>
              <span className={styles.code}>
                <span className={styles.keyword}>const</span>{" "}
                <span className={styles.bracket}>{"{"}</span>
                <span className={styles.variable}> employees</span>,{" "}
                <span className={styles.variable}>total</span>{" "}
                <span className={styles.bracket}>{"}"}</span> ={" "}
                <span className={styles.function}>useEmployeeList</span>
                <span className={styles.bracket}>()</span>;
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>9</span>
              <span className={styles.code}>
                <span className={styles.keyword}>if</span>{" "}
                <span className={styles.bracket}>{"("}</span>
                <span className={styles.variable}>isLoading</span>
                <span className={styles.bracket}>{"}"}</span>{" "}
                <span className={styles.keyword}>return</span>{" "}
                <span className={styles.tag}>{"<div>"}</span>Loading...
                <span className={styles.tag}>{"</div>"}</span>;
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>11</span>
              <span className={styles.code}>
                <span className={styles.keyword}>return</span>{" "}
                <span className={styles.bracket}>{"("}</span>
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>12</span>
              <span className={styles.code}>
                {"  "}
                <span className={styles.tag}>{"<h1>"}</span>Employees
                <span className={styles.tag}>{"</h1>"}</span>
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>13</span>
              <span className={styles.code}>
                {"  "}
                <span className={styles.tag}>{"<h3>"}</span>Showing{" "}
                <span className={styles.bracket}>{"{"}</span>
                <span className={styles.variable}>total</span>
                <span className={styles.bracket}>{"}"}</span> employees
                <span className={styles.tag}>{"</h3>"}</span>
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>14</span>
              <span className={styles.code}>
                {"  "}
                <span className={styles.tag}>{"<ul>"}</span>
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>15</span>
              <span className={styles.code}>
                {"    "}
                <span className={styles.variable}>employees</span>
                <span className={styles.function}>.map</span>
                <span className={styles.bracket}>{"("}</span>
                <span className={styles.variable}>emp</span>{" "}
                <span className={styles.keyword}>=></span>{" "}
                <span className={styles.bracket}>{"("}</span>
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>16</span>
              <span className={styles.code}>
                {"      "}
                <span className={styles.tag}>{"<li"}</span>{" "}
                <span className={styles.attr}>key</span>=
                <span className={styles.string}>{"{"}</span>
                <span className={styles.variable}>emp.id</span>
                <span className={styles.string}>{"}"}</span>
                <span className={styles.tag}>{">"}</span>
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>17</span>
              <span className={styles.code}>
                {"        "}
                <span className={styles.tag}>{"<span>"}</span>
                <span className={styles.bracket}>{"{"}</span>
                <span className={styles.variable}>emp.name</span>
                <span className={styles.bracket}>{"}"}</span>
                <span className={styles.tag}>{"</span>"}</span>
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>18</span>
              <span className={styles.code}>
                {"      "}
                <span className={styles.tag}>{"</li>"}</span>
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>19</span>
              <span className={styles.code}>
                {"    "}
                <span className={styles.bracket}>{"))"}</span>
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>20</span>
              <span className={styles.code}>
                {"  "}
                <span className={styles.tag}>{"</ul>"}</span>
              </span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNumber}>21</span>
              <span className={styles.code}>
                <span className={styles.bracket}>{");"}</span>
              </span>
            </div>
          </div>
        </div>
        <div className={styles.reactLogo}>
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="30"
              cy="30"
              r="2"
              fill="#61dafb"
              className={styles.logoCenter}
            />
            <ellipse
              cx="30"
              cy="30"
              rx="20"
              ry="6"
              stroke="#61dafb"
              strokeWidth="1.5"
              className={styles.logoOrbit}
            />
            <ellipse
              cx="30"
              cy="30"
              rx="20"
              ry="6"
              stroke="#61dafb"
              strokeWidth="1.5"
              transform="rotate(60 30 30)"
              className={styles.logoOrbit}
            />
            <ellipse
              cx="30"
              cy="30"
              rx="20"
              ry="6"
              stroke="#61dafb"
              strokeWidth="1.5"
              transform="rotate(120 30 30)"
              className={styles.logoOrbit}
            />
          </svg>
        </div>
      </div>
      <div className={styles.cardContent}>
        <div>
          <h3 className={styles.cardTitle}>100% Pure React Code</h3>
          <p className={styles.cardDescription}>
            Don't get locked-in to proprietary solutions. With HCM you have
            always 100% control over your project and codebase. Built with
            modern React patterns, hooks, and best practices. Full TypeScript
            support and comprehensive component library included.
          </p>
        </div>
        <a
          href="https://github.com/Razor-Infotech/hcmFrontend"
          className={styles.cardButton}
          target="_blank"
          rel="noopener noreferrer"
        >
          HCM on GitHub →
        </a>
      </div>
    </div>
  );
}
