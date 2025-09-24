"use client";

import { useEffect, useState } from "react";

interface UseScrollSpyOptions {
  threshold?: number;
  rootMargin?: string;
  offset?: number;
}

export function useScrollSpy(
  sectionIds: string[],
  options: UseScrollSpyOptions = {}
) {
  const {
    threshold = 0.3,
    rootMargin = "-20% 0px -70% 0px",
    offset = 100,
  } = options;
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the section that has crossed into or out of the top third of the screen
        const viewportHeight = window.innerHeight;
        const topThirdThreshold = viewportHeight * (1 / 3); // Top third of screen

        let bestSection = "";
        let bestDistance = Infinity; // Closest to top third threshold

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rect = entry.boundingClientRect;
            const sectionTop = rect.top;

            // Check if section has crossed into the top third
            // We want the section that's closest to or has crossed the top third line
            if (sectionTop <= topThirdThreshold) {
              const distanceFromTopThird = Math.abs(
                sectionTop - topThirdThreshold
              );

              if (distanceFromTopThird < bestDistance) {
                bestDistance = distanceFromTopThird;
                bestSection = entry.target.id;
              }
            }
          }
        });

        // If no section has crossed into top third, find the one closest to crossing
        if (!bestSection) {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const rect = entry.boundingClientRect;
              const sectionTop = rect.top;

              // Find section closest to the top third threshold
              const distanceFromTopThird = Math.abs(
                sectionTop - topThirdThreshold
              );

              if (distanceFromTopThird < bestDistance) {
                bestDistance = distanceFromTopThird;
                bestSection = entry.target.id;
              }
            }
          });
        }

        if (bestSection && bestSection !== activeSection) {
          setActiveSection(bestSection);
        }
      },
      {
        threshold: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1.0], // Multiple thresholds for better detection
        rootMargin: "-20% 0px -70% 0px",
      }
    );

    // Observe all sections
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    console.log("ScrollSpy - sectionIds:", sectionIds);
    console.log("ScrollSpy - elements found:", elements.length);
    console.log("ScrollSpy - elements:", elements);

    elements.forEach((element) => {
      if (element) {
        observer.observe(element);
        console.log("ScrollSpy - observing element:", element.id);
      }
    });

    // Set initial active section if none is set
    if (!activeSection && elements.length > 0) {
      const viewportHeight = window.innerHeight;
      const topThirdThreshold = viewportHeight * (1 / 3);

      // Find the first section that's in the top third or closest to it
      let bestSection = "";
      let bestDistance = Infinity;

      elements.forEach((element) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          const sectionTop = rect.top;

          if (sectionTop <= topThirdThreshold) {
            const distanceFromTopThird = Math.abs(
              sectionTop - topThirdThreshold
            );
            if (distanceFromTopThird < bestDistance) {
              bestDistance = distanceFromTopThird;
              bestSection = element.id;
            }
          }
        }
      });

      // If no section is in top third, use the first one
      if (!bestSection && elements[0]) {
        bestSection = elements[0].id;
      }

      if (bestSection) {
        setActiveSection(bestSection);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [sectionIds, activeSection]);

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
