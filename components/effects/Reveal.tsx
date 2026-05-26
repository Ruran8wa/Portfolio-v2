"use client";
import { useEffect, useState, ElementType, HTMLAttributes } from "react";

interface RevealProps extends HTMLAttributes<HTMLElement> {
  delay?: number;
  as?: ElementType;
}

export default function Reveal({ children, delay = 0, as: Tag = "div", className = "", ...rest }: RevealProps) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setShown(true), Math.max(20, delay));
    return () => clearTimeout(id);
  }, [delay]);
  return (
    <Tag className={`reveal ${shown ? "in" : ""} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
