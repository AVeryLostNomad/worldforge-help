"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ItemTooltip } from "./item-tooltip";
import { useState } from "react";
import { Item } from "@/types";

interface ItemsTableProps {
  items: Item[];
}

const qualityColors: Record<string, string> = {
  Common: "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/50",
  Uncommon: "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/50",
  Rare: "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/50",
  Epic: "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/50",
  Legendary: "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/50",
  Artifact: "bg-yellow-400/20 text-yellow-900 dark:text-yellow-200 border-yellow-300/70",
};


export function ItemsTable({ items }: ItemsTableProps) {
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const [openAboveOnHover, setOpenAboveOnHover] = useState<boolean>(false);

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-card-foreground">Name</TableHead>
            <TableHead className="text-card-foreground">Quality</TableHead>
            <TableHead className="text-card-foreground">Slot Type</TableHead>
            <TableHead className="text-card-foreground">Slot</TableHead>
            <TableHead className="text-card-foreground">Req. Level</TableHead>
            <TableHead className="text-card-foreground">Item Level</TableHead>
            <TableHead className="text-card-foreground">Damage</TableHead>
            <TableHead className="text-card-foreground">Zone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                No items found matching your filters.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item, idx) => (
              <TableRow key={`${item.id}-${item.quality}-${item.itemLevel}-${item.zone}`} className="relative">
                <TableCell
                  className="font-medium text-card-foreground relative cursor-pointer"
                  onMouseEnter={(e) => {
                    const viewportMidY = window.innerHeight / 2;
                    setOpenAboveOnHover(e.clientY > viewportMidY);
                    setHoveredItemId(item.id);
                  }}
                  onMouseLeave={() => setHoveredItemId(null)}
                >
                  <span className={hoveredItemId === item.id ? "underline" : ""}>{item.name}</span>
                  {hoveredItemId === item.id && (
                    <ItemTooltip item={item} initialOpenAbove={openAboveOnHover} />
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={qualityColors[item.quality] || ""}>
                    {item.quality}
                  </Badge>
                </TableCell>
                <TableCell className="text-card-foreground">{item.slotType}</TableCell>
                <TableCell className="text-card-foreground">{item.slot}</TableCell>
                <TableCell className="text-card-foreground">{item.requiredLevel}</TableCell>
                <TableCell className="text-card-foreground">{item.itemLevel}</TableCell>
                <TableCell className="text-card-foreground">
                  {item.damage ? (
                    <span className="text-sm">
                      {item.damage.min}-{item.damage.max} ({item.damage.damagePerSecond} DPS)
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.zone}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
