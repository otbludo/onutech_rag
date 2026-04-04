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
  const repeatedText = `${displayContent}  •  `.repeat(20);

  useEffect(() => {
    let offset = 0;
    const animate = () => {
      offset += speed;
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
      <svg
        viewBox="0 0 800 800"
        className="w-full h-full "
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <path id={id} d={pathDefinition} />
        </defs>
        <use
          href={`#${id}`}
          stroke="black"
          strokeWidth="20"
          fill="none"
          strokeLinecap="round"
        />
        <text
          className="font-black"
          style={{ fontSize: "9px", fill: "white" }}
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
