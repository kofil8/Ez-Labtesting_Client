"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface Point {
  x: number;
  y: number;
}

interface Shard {
  points: Point[];
  center: Point;
  velocity: { x: number; y: number };
  rotation: number;
  rotationVelocity: number;
  mass: number;
}

interface ShatterImageProps {
  imageUrl: string;
  rows?: number;
  cols?: number;
  jitterAmount?: number;
  prefersReducedMotion?: boolean;
}

/**
 * Generates random polygon shards from a perturbed grid
 * Creates more organic, irregular shapes compared to simple triangles
 */
function generateShards(
  rows: number = 8,
  cols: number = 12,
  jitterAmount: number = 0.35
): Shard[] {
  const shards: Shard[] = [];
  const vertices: Point[][] = [];

  // Generate perturbed grid vertices
  for (let r = 0; r <= rows; r++) {
    const rowVertices: Point[] = [];
    for (let c = 0; c <= cols; c++) {
      let x = (c / cols) * 100;
      let y = (r / rows) * 100;

      // Apply jitter to inner points (keep boundaries fixed)
      if (r > 0 && r < rows && c > 0 && c < cols) {
        const cellWidth = 100 / cols;
        const cellHeight = 100 / rows;
        const jitterRange = Math.min(cellWidth, cellHeight) * jitterAmount;
        
        // Use Perlin-like noise for smoother variation
        const noiseX = (Math.random() - 0.5) * jitterRange;
        const noiseY = (Math.random() - 0.5) * jitterRange;
        
        x += noiseX;
        y += noiseY;
      }
      
      rowVertices.push({ x, y });
    }
    vertices.push(rowVertices);
  }

  // Create irregular polygons from grid cells
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p1 = vertices[r][c];
      const p2 = vertices[r][c + 1];
      const p3 = vertices[r + 1][c + 1];
      const p4 = vertices[r + 1][c];

      // Calculate cell center for physics calculations
      const cellCenter = {
        x: (p1.x + p2.x + p3.x + p4.x) / 4,
        y: (p1.y + p2.y + p3.y + p4.y) / 4,
      };

      // Create multiple shards per cell for more organic breaking
      const splitType = Math.random();
      
      if (splitType < 0.4) {
        // Split into 2 triangles (diagonal)
        const diagonal = Math.random() > 0.5;
        if (diagonal) {
          // Split /
          createShard([p1, p2, p4], cellCenter, shards);
          createShard([p2, p3, p4], cellCenter, shards);
        } else {
          // Split \
          createShard([p1, p2, p3], cellCenter, shards);
          createShard([p1, p3, p4], cellCenter, shards);
        }
      } else if (splitType < 0.7) {
        // Split into 3 triangles (fan from center)
        const centerPoint = {
          x: cellCenter.x + (Math.random() - 0.5) * 5,
          y: cellCenter.y + (Math.random() - 0.5) * 5,
        };
        createShard([p1, p2, centerPoint], cellCenter, shards);
        createShard([p2, p3, centerPoint], cellCenter, shards);
        createShard([p3, p4, centerPoint], cellCenter, shards);
        createShard([p4, p1, centerPoint], cellCenter, shards);
      } else {
        // Split into 4 triangles (star pattern)
        createShard([p1, p2, cellCenter], cellCenter, shards);
        createShard([p2, p3, cellCenter], cellCenter, shards);
        createShard([p3, p4, cellCenter], cellCenter, shards);
        createShard([p4, p1, cellCenter], cellCenter, shards);
      }
    }
  }

  return shards;
}

/**
 * Creates a shard with physics properties
 */
function createShard(
  points: Point[],
  cellCenter: Point,
  shards: Shard[]
): void {
  // Calculate shard center
  const center = {
    x: points.reduce((sum, p) => sum + p.x, 0) / points.length,
    y: points.reduce((sum, p) => sum + p.y, 0) / points.length,
  };

  // Calculate area for mass (affects physics - smaller shards move faster)
  const area = calculatePolygonArea(points);
  const mass = Math.max(0.5, Math.min(2.0, area / 50)); // Normalize mass (0.5-2.0)
  const massFactor = 1 / mass; // Inverse mass: lighter = faster

  // Calculate direction from image center (explosive radial pattern)
  const imageCenterX = 50;
  const imageCenterY = 50;
  const vecX = center.x - imageCenterX;
  const vecY = center.y - imageCenterY;
  const distance = Math.sqrt(vecX * vecX + vecY * vecY);
  const normalizedX = vecX / (distance || 1);
  const normalizedY = vecY / (distance || 1);

  // Base velocity: farther from center = faster (explosive effect)
  // Also affected by mass (lighter shards move faster)
  const baseVelocity = (120 + distance * 1.8) * massFactor;
  const velocityVariation = 40 + Math.random() * 80; // Random variation
  
  // Add randomness to direction for more organic breaking pattern
  const angleVariation = (Math.random() - 0.5) * 0.5; // ±25 degrees
  const cos = Math.cos(angleVariation);
  const sin = Math.sin(angleVariation);
  
  // Calculate velocity with directional variation
  const totalVelocity = baseVelocity + velocityVariation;
  const velocity = {
    x: (normalizedX * cos - normalizedY * sin) * totalVelocity,
    y: (normalizedX * sin + normalizedY * cos) * totalVelocity,
  };

  // Rotation velocity: smaller/lighter shards rotate faster
  // Also add some randomness for more chaotic motion
  const baseRotationVelocity = 150 + (1 / mass) * 150;
  const rotationVelocity = (Math.random() - 0.5) * baseRotationVelocity * 2;

  // Initial rotation (some shards start rotated)
  const rotation = (Math.random() - 0.5) * 45;

  shards.push({
    points,
    center,
    velocity,
    rotation,
    rotationVelocity,
    mass,
  });
}

/**
 * Calculates the area of a polygon using the shoelace formula
 */
function calculatePolygonArea(points: Point[]): number {
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area) / 2;
}

export function ShatterImage({
  imageUrl,
  rows = 8,
  cols = 12,
  jitterAmount = 0.35,
  prefersReducedMotion = false,
}: ShatterImageProps) {
  // Regenerate shards when image changes for variety
  const shards = useMemo(
    () => generateShards(rows, cols, jitterAmount),
    [rows, cols, jitterAmount, imageUrl] // Include imageUrl to force regeneration
  );

  return (
    <>
      {shards.map((shard, i) => {
        const clipPath = `polygon(${shard.points
          .map((p) => `${p.x}% ${p.y}%`)
          .join(", ")})`;

        // Calculate physics-based animation parameters
        // Duration varies by shard size (smaller shards move faster)
        const baseDuration = 0.9 + Math.random() * 0.5; // 0.9-1.4 seconds
        const duration = prefersReducedMotion ? 0 : baseDuration;
        
        // Calculate final position with gravity simulation
        // Using physics: final_position = initial_velocity * time + 0.5 * gravity * time^2
        const gravity = 600; // pixels per second squared (adjusted for visual effect)
        const finalX = shard.velocity.x * baseDuration;
        const finalY = shard.velocity.y * baseDuration + (gravity * baseDuration * baseDuration) / 2;

        // Final rotation with deceleration (air resistance effect)
        const rotationDeceleration = 0.85; // Rotation slows down over time
        const finalRotation = shard.rotation + shard.rotationVelocity * baseDuration * rotationDeceleration;

        // Scale animation (shards shrink slightly as they fall)
        const finalScale = 0.75 + Math.random() * 0.15; // 0.75-0.9

        // Stagger delay based on distance from center (center shards exit first)
        const distanceFromCenter = Math.sqrt(
          Math.pow(shard.center.x - 50, 2) + Math.pow(shard.center.y - 50, 2)
        );
        const delay = (distanceFromCenter / 100) * 0.1 + Math.random() * 0.05; // 0-0.15s

        return (
          <motion.div
            key={`shard-${i}`}
            initial={{
              opacity: 1,
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1.01, // Slight overlap to prevent gaps
            }}
            exit={{
              opacity: 0,
              x: finalX,
              y: finalY,
              rotate: finalRotation,
              scale: finalScale,
            }}
            transition={{
              duration: duration,
              // Custom easing: easeOut for X (deceleration), easeIn for Y (gravity acceleration)
              x: { ease: [0.25, 0.1, 0.25, 1] }, // Smooth deceleration
              y: { ease: [0.1, 0.1, 0.3, 1] }, // Gravity acceleration
              rotate: { ease: "easeOut" }, // Rotation slows down
              opacity: { ease: "easeIn", duration: duration * 0.6 }, // Fade out faster
              scale: { ease: "easeIn" },
              delay: delay,
            }}
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url('${imageUrl}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              clipPath: clipPath,
              filter: "drop-shadow(0px 0px 3px rgba(0,0,0,0.4))",
              transformOrigin: `${shard.center.x}% ${shard.center.y}%`,
              willChange: "transform, opacity",
            }}
          />
        );
      })}
    </>
  );
}

