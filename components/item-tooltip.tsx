"use client";

import { cn } from "@/lib/utils";
import { Item } from "@/types";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ItemTooltipProps {
  item: Item;
  initialOpenAbove?: boolean;
  anchorRect: { left: number; top: number; bottom: number; };
}

const qualityColors: Record<string, string> = {
  Epic: "text-purple-400",
  Rare: "text-blue-400",
  Uncommon: "text-green-400",
  Common: "text-white",
};

export function ItemTooltip({ item, initialOpenAbove, anchorRect }: ItemTooltipProps) {
  const [openAbove, setOpenAbove] = useState<boolean>(initialOpenAbove ?? false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const viewportMidY = window.innerHeight / 2;
      setOpenAbove(e.clientY > viewportMidY);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!isMounted) return null;

  const GAP = 8; // px
  const tooltipWidthPx = 320; // Tailwind w-80 = 20rem ≈ 320px at 16px root
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  const leftClamped = Math.max(8, Math.min(anchorRect.left, viewportWidth - tooltipWidthPx - 8));
  const top = openAbove ? anchorRect.top - GAP : anchorRect.bottom + GAP;

  return createPortal(
    <div
      className={cn(
        "z-50",
        "w-80",
        "rounded-lg",
        "border-2",
        "border-gray-700",
        "bg-linear-to-b",
        "from-gray-900",
        "to-black",
        "p-3",
        "text-sm",
        "shadow-2xl",
        "pointer-events-none",
        "text-wrap"
      )}
      style={{
        position: "fixed",
        left: leftClamped,
        top,
        transform: openAbove ? "translateY(-100%)" : undefined,
      }}
    >
      {/* Item Name */}
      <div
        className={cn(
          "text-base",
          "font-bold",
          "mb-1",
          qualityColors[item.quality] || "text-white"
        )}
      >
        {item.name}
      </div>

      {/* Binding */}
      {item.binding && <div className="text-white text-xs mb-1">{item.binding}</div>}

      {/* Slot and Armor Type */}
      <div className="flex justify-between text-white text-xs mb-2">
        <span>{item.slot}</span>
        {item.slotType && <span>{item.slotType}</span>}
      </div>

      {/* Damage */}
      {item.damage && (
        <div className="text-white text-xs mb-2 space-y-0.5">
          <div className="flex justify-between">
            <span>
              {item.damage.min}-{item.damage.max} Damage
            </span>
            <span>Speed {item.damage.speed}</span>
          </div>
          <div>({item.damage.damagePerSecond} damage per second)</div>
        </div>
      )}

      {/* Primary Stats */}
      {item.primaryStats && Object.entries(item.primaryStats).length > 0 && (
        <div className="border-t border-gray-700 pt-1 mt-1">
          {Object.entries(item.primaryStats).map(([stat, value]) => (
            <div key={stat} className="text-white text-xs">
              +{value} {stat.charAt(0).toUpperCase() + stat.slice(1)}
            </div>
          ))}
        </div>
      )}

      {/* Secondary Stats */}
      {item.secondaryStats && Object.entries(item.secondaryStats).length > 0 && (
        <div className="border-t border-gray-700 pt-1 mt-1">
          {Object.entries(item.secondaryStats).map(([stat, value]) => {
            // Handle resistance stats (they're numbers)
            if (typeof value === "number") {
              return (
                <div key={stat} className="text-green-400 text-xs">
                  +{value} {stat}
                </div>
              );
            }
            // Handle text stats (like "Equip:" effects)
            const isEquipEffect =
              typeof value === "string" &&
              (value.includes("Increases") ||
                value.includes("Improves") ||
                value.includes("Restores") ||
                value.includes("chance"));

            return (
              <div key={stat} className={`text-xs wrap-break-word ${isEquipEffect ? "text-green-400" : "text-white"}`}>
                {isEquipEffect && "Equip: "}
                {value}
              </div>
            );
          })}
        </div>
      )}

      {/* Class Restrictions */}
      {item.classRestrictions && item.classRestrictions.length > 0 && (
        <div className="border-t border-gray-700 pt-1 mt-1">
          <div className="text-yellow-400 text-xs">
            Classes: {item.classRestrictions.join(", ")}
          </div>
        </div>
      )}

      {/* Descriptions */}
      {item.descriptions && item.descriptions.length > 0 && (
        <div className="border-t border-gray-700 pt-1 mt-1 space-y-1">
          {item.descriptions.map((desc, index) => (
            <div key={index} className="space-y-0.5">
              {desc.name && (
                <div className="text-cyan-400 text-xs font-semibold">
                  {desc.name}
                </div>
              )}
              {desc.cooldown && (
                <div className="text-gray-300 text-xs">
                  {desc.cooldown}
                </div>
              )}
              {desc.description && (
                <div className="text-white text-xs">
                  {desc.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Flavor Text */}
      {item.flavorText && (
        <div className="border-t border-gray-700 pt-1 mt-1">
          <div className="text-gray-400 text-xs italic">
            {item.flavorText}
          </div>
        </div>
      )}

      {/* Requirements */}
      <div className="border-t border-gray-700 pt-1 mt-1">
        <div className="text-white text-xs">Requires Level {item.requiredLevel}</div>
        <div className="text-white text-xs">Item Level {item.itemLevel}</div>
      </div>

      {/* Item ID */}
      <div className="border-t border-gray-700 pt-1 mt-1">
        <div className="text-orange-400 text-xs">ID {item.id}</div>
      </div>
    </div>,
    document.body
  );
}
