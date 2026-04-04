import React, { useEffect, useRef } from "react";

interface WavyMarqueeProps {
  text: string | string[];
  id: string;
  pathDefinition: string;
  speed?: number;
  className?: string;
}

export function WavyMarquee({
  text,
  id,
  pathDefinition,
  speed = 5,
  className = "",
}: WavyMarqueeProps) {
  const textPathRef = useRef<SVGTextPathElement>(null);

  const displayContent = Array.isArray(text) ? text.join("  •  ") : text;
  // On réduit un peu le repeat pour la performance si nécessaire
  const repeatedText = `${displayContent}  •  `.repeat(15);

  useEffect(() => {
    let offset = 0;
    const animate = () => {
      // On décrémente pour un mouvement naturel de droite à gauche
      offset -= speed / 10;
      if (offset <= -50) offset = 0;

      if (textPathRef.current) {
        textPathRef.current.setAttribute("startOffset", `${offset}%`);
      }
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [speed]);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <svg
        viewBox="0 0 800 800"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <path id={id} d={pathDefinition} />
        </defs>

        {/* Ligne de fond (optionnelle, ajustée selon le texte) */}
        <use
          href={`#${id}`}
          stroke="black"
          strokeWidth="30"
          fill="none"
          strokeLinecap="round"
        />

        <text
          className="font-black uppercase tracking-widest"
          style={{
            fill: "white",
            // On utilise une taille adaptative :
            // 24px sur mobile (par défaut) et 12px sur desktop (md: 768px)
            fontSize: window.innerWidth < 768 ? "24px" : "10px",
          }}
          dominantBaseline="middle"
        >
          <textPath ref={textPathRef} href={`#${id}`} startOffset="0%">
            {repeatedText}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
