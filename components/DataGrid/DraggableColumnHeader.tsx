"use client";

import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ArrowUp, ArrowDown, ArrowUpDown, GripVertical } from "lucide-react";
import { ColumnDefinition, SortConfig } from "@/types/data-grid.types";

const ITEM_TYPE = "COLUMN";

interface DragItem {
  index: number;
}

interface DraggableColumnHeaderProps<T> {
  column: ColumnDefinition<T>;
  index: number;
  sort: SortConfig;
  onSort: (key: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function DraggableColumnHeader<T>({
  column,
  index,
  sort,
  onSort,
  onReorder,
}: DraggableColumnHeaderProps<T>) {
  const ref = useRef<HTMLTableCellElement>(null);

  const [, drop] = useDrop<DragItem>({
    accept: ITEM_TYPE,
    hover(item) {
      if (!ref.current) return;
      if (item.index !== index) {
        onReorder(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <th
      ref={ref}
      style={{
        width: column.width,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="draggable-header"
    >
      <div className="th-content">
        <div className="drag-handle">
          <GripVertical size={14} />
        </div>

        <span>{column.label}</span>

        {column.sortable && (
          <button className="sort-btn" onClick={() => onSort(column.key)}>
            {sort.key === column.key && sort.direction === "asc" && (
              <ArrowUp size={16} />
            )}
            {sort.key === column.key && sort.direction === "desc" && (
              <ArrowDown size={16} />
            )}
            {sort.key !== column.key && (
              <ArrowUpDown size={16} className="inactive" />
            )}
          </button>
        )}
      </div>
    </th>
  );
}
