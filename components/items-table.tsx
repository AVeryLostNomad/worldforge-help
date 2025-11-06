"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ItemTooltip } from "./item-tooltip"
import { useState } from "react"
import { Item } from "@/types";

interface ItemsTableProps {
  items: Item[]
}

const qualityColors: Record<string, string> = {
  Epic: "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/50",
  Rare: "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/50",
  Uncommon: "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/50",
  Common: "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/50",
}

export function ItemsTable({ items }: ItemsTableProps) {
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null)

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
            <TableHead className="text-card-foreground">Binding</TableHead>
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
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell
                  className="font-medium text-card-foreground relative cursor-pointer"
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                >
                  <span className={hoveredItemId === item.id ? "underline" : ""}>{item.name}</span>
                  {hoveredItemId === item.id && (
                    <div className="absolute left-0 top-full mt-2 z-50">
                      <ItemTooltip item={item} />
                    </div>
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
                <TableCell className="text-sm text-muted-foreground">{item.binding}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
