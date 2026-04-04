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
  // On augmente un peu le repeat pour s'assurer qu'il n'y ait pas de trou quand le texte est gros
  const repeatedText = `${displayContent}  •  `.repeat(30);

  useEffect(() => {
    let offset = 0;
    const animate = () => {
      // Pour un mouvement fluide vers la gauche
      offset -= (speed * 0.1); 
      if (offset <= -100) offset = 0;
      
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
      <style>
        {`
          /* Taille par défaut pour MOBILE */
          #text-${id} {
            font-size: 24px; 
          }
          /* Taille pour les écrans plus grands (Tablettes/PC) */
          @media (min-width: 768px) {
            #text-${id} {
              font-size: 9px;
            }
          }
        `}
      </style>
      
      <svg
        viewBox="0 0 800 800"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <path id={id} d={pathDefinition} />
        </defs>
        
        {/* On augmente le strokeWidth pour que la bande noire suive la taille du texte mobile */}
        <use
          href={`#${id}`}
          stroke="black"
          className="stroke-[40px] md:stroke-[20px]"
          fill="none"
          strokeLinecap="round"
        />

        <text
          id={`text-${id}`}
          className="font-black"
          style={{ fill: "white" }}
          dominantBaseline="middle"
        >
          <textPath 
            ref={textPathRef} 
            href={`#${id}`} 
            startOffset="0%"
          >
            {repeatedText}
          </textPath>
        </text>
      </svg>
    </div>
  );
}