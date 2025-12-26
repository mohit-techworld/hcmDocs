import { useEffect, useRef } from "react";
import { useLocation } from "@docusaurus/router";

/**
 * Component to handle dropdown closing behavior
 * Closes dropdowns when a link is clicked or when route changes
 * Uses delayed closing to prevent accidental closes when moving mouse
 */
export default function NavbarDropdownHandler() {
  const location = useLocation();
  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    // Close all dropdowns function
    const closeAllDropdowns = () => {
      // Clear any pending close timeouts
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }

      // Find all dropdown toggle buttons
      document
        .querySelectorAll(
          ".navbar__item--dropdown button[aria-expanded='true']"
        )
        .forEach((button) => {
          // Click the button to close (Docusaurus handles the toggle)
          button.click();
        });
    };

    // Close dropdowns on route change
    closeAllDropdowns();

    // Close dropdowns when clicking on dropdown links
    const handleDropdownLinkClick = (e) => {
      const link = e.target.closest("a.dropdown__link");
      if (link && link.hasAttribute("href") && !link.hasAttribute("target")) {
        // Close immediately when internal link is clicked
        closeAllDropdowns();
      }
    };

    // Close dropdowns when clicking outside (with small delay to allow mouse movement)
    const handleClickOutside = (e) => {
      const clickedDropdown = e.target.closest(".navbar__item--dropdown");
      const clickedDropdownMenu = e.target.closest(".dropdown__menu");
      const clickedDropdownButton = e.target.closest(
        ".navbar__item--dropdown button"
      );
      const clickedDropdownLink = e.target.closest(".dropdown__link");

      // If click is outside any dropdown (and not on the toggle button or link), close all
      if (
        !clickedDropdown &&
        !clickedDropdownMenu &&
        !clickedDropdownButton &&
        !clickedDropdownLink
      ) {
        // Small delay to prevent accidental closes
        closeTimeoutRef.current = setTimeout(() => {
          closeAllDropdowns();
        }, 150);
      } else {
        // Cancel close if hovering over dropdown area
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
          closeTimeoutRef.current = null;
        }
      }
    };

    // Handle mouse leave with delay - only close if truly leaving dropdown area
    const handleMouseLeave = (e) => {
      const relatedTarget = e.relatedTarget;

      // Check if mouse is moving to dropdown menu, navbar item, or dropdown container
      if (
        relatedTarget &&
        (relatedTarget.closest(".dropdown__menu") ||
          relatedTarget.closest(".navbar__item--dropdown") ||
          relatedTarget.closest(".dropdown") ||
          relatedTarget.classList.contains("dropdown__menu") ||
          relatedTarget.classList.contains("dropdown"))
      ) {
        return; // Don't close if moving to dropdown area
      }

      // Longer delay before closing to allow smooth mouse movement
      closeTimeoutRef.current = setTimeout(() => {
        // Double check that we're not hovering over dropdown area
        const isHoveringDropdown = document.querySelector(
          ".navbar__item--dropdown:hover, .dropdown__menu:hover, .dropdown:hover"
        );
        if (!isHoveringDropdown) {
          closeAllDropdowns();
        }
      }, 400); // Increased delay to 400ms for better UX
    };

    // Add event listeners
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("click", handleDropdownLinkClick, true);

    // Add mouse leave listeners to dropdown items and menus
    const setupMouseLeaveListeners = () => {
      const dropdownItems = document.querySelectorAll(
        ".navbar__item--dropdown"
      );
      const dropdownMenus = document.querySelectorAll(".dropdown__menu");

      dropdownItems.forEach((item) => {
        item.addEventListener("mouseleave", handleMouseLeave);
      });

      dropdownMenus.forEach((menu) => {
        menu.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    // Setup listeners after a short delay to ensure DOM is ready
    const setupTimeout = setTimeout(setupMouseLeaveListeners, 100);

    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      clearTimeout(setupTimeout);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("click", handleDropdownLinkClick, true);

      // Clean up mouse leave listeners
      document.querySelectorAll(".navbar__item--dropdown").forEach((item) => {
        item.removeEventListener("mouseleave", handleMouseLeave);
      });
      document.querySelectorAll(".dropdown__menu").forEach((menu) => {
        menu.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [location.pathname]);

  return null;
}
