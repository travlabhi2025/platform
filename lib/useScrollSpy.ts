"use client";

import { useEffect, useState } from "react";

interface UseScrollSpyOptions {
  offset?: number;
}

export function useScrollSpy(
  sectionIds: string[],
  options: UseScrollSpyOptions = {}
) {
  const { offset = 100 } = options;
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const handleScroll = () => {
      // Get all section elements
      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);

      if (sections.length === 0) return;

      // Find which section is currently most visible
      // We check which section's top is closest to the top of the viewport (with offset)
      const scrollPosition = window.scrollY + offset + 150; // Extra offset for better UX

      // Find the section we're currently in
      let currentSection = sections[0].id;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionTop = section.offsetTop;

        // If we've scrolled past this section's start, it's the active one
        if (scrollPosition >= sectionTop) {
          currentSection = section.id;
          break;
        }
      }

      // Update active section if it changed
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    // Set initial active section
    handleScroll();

    // Add scroll listener with throttling for better performance
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener, { passive: true });

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, [sectionIds, activeSection, offset]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return { activeSection, scrollToSection };
}
