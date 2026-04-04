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
  // Repeat élevé pour mobile
  const repeatedText = `${displayContent}  •  `.repeat(30);

  useEffect(() => {
    let offset = 0;
    const animate = () => {
      // Vitesse et logique d'origine rétablies
      offset += speed; 
      if (offset >= 100) offset = 0;
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
          /* TAILLE ET CENTRAGE MOBILE (iOS/iPhone) */
          #textPath-${id} {
            font-size: 26px; /* Taille boostée pour mobile */
            
            /* C'est ICI que ça se joue pour l'iPhone */
            /*dy: 8px; /* Ajuste cette valeur (8px, 9px, 10px...) jusqu'à ce que ce soit parfait sur ton iPhone */
          }

          /* TAILLE ET CENTRAGE ORDINATEUR (Tes valeurs d'origine) */
          @media (min-width: 768px) {
            #textPath-${id} {
              font-size: 9px;
              dy: 3px; /* Ton décalage vertical d'origine (dy="5" était un peu fort pour 9px) */
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
        
        {/* Bande noire épaisse sur mobile, fine sur PC */}
        <use
          href={`#${id}`}
          stroke="black"
          strokeWidth="50" /* Épaisseur max pour mobile */
          className="md:stroke-[20px]" /* Épaisseur origine pour PC */
          fill="none"
          strokeLinecap="round"
        />

        <text
          id={`text-${id}`}
          className="font-black"
          style={{ fill: "white" }}
          // On n'utilise plus dominantBaseline="middle" ici, trop instable sur Safari
          textAnchor="middle"
        >
          <textPath 
            id={`textPath-${id}`} // ID ajouté ici pour le CSS
            ref={textPathRef} 
            href={`#${id}`} 
          >
            {repeatedText}
          </textPath>
        </text>
      </svg>
    </div>
  );
}