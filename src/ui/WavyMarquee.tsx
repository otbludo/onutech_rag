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
  // On garde un repeat élevé pour éviter les trous avec le gros texte mobile
  const repeatedText = `${displayContent}  •  `.repeat(30);

  useEffect(() => {
    let offset = 0;
    const animate = () => {
      // Retour à ta logique initiale : addition de la vitesse
      offset += speed;

      // Reset de l'offset quand il dépasse 100 ou tombe trop bas
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
          /* TAILLE MOBILE (Boostée) */
          #text-${id} {
            font-size: 28px; 
          }
          /* TAILLE ORDINATEUR (Ta taille initiale) */
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

        {/* La bordure noire s'adapte aussi : épaisse sur mobile, fine sur PC */}
        <use
          href={`#${id}`}
          stroke="black"
          strokeWidth="45"
          className="md:stroke-[20px]"
          fill="none"
          strokeLinecap="round"
        />

        <text
          id={`text-${id}`}
          className="font-black"
          style={{ fill: "white" }}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          <textPath ref={textPathRef} href={`#${id}`} dy="5">
            {repeatedText}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
