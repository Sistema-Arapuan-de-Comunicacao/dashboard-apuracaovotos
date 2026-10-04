"use client"

import type { Key, ReactNode } from "react"
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react"

import { cn } from "@/lib/utils"

type AnimatedRankingProps<T> = {
  items: T[]
  getKey: (item: T) => Key
  renderItem: (item: T, index: number) => ReactNode
  className?: string
  itemClassName?: string
  label: string
}

export function AnimatedRanking<T>({
  items,
  getKey,
  renderItem,
  className,
  itemClassName,
  label,
}: AnimatedRankingProps<T>) {
  const reduceMotion = useReducedMotion()

  return (
    <LayoutGroup>
      <ol aria-label={label} className={cn("relative isolate", className)}>
        {/* Stable candidate IDs preserve positions across query snapshots.
            popLayout lets the remaining rows move while removed rows exit. */}
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item, index) => (
            <motion.li
              key={getKey(item)}
              layout={reduceMotion ? false : "position"}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: reduceMotion ? 0 : 24,
                transition: { duration: reduceMotion ? 0 : 0.2 },
              }}
              transition={{
                layout: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: reduceMotion ? 0 : 0.25 },
                y: { duration: reduceMotion ? 0 : 0.35 },
              }}
              className={cn("relative min-w-0", itemClassName)}
            >
              {renderItem(item, index)}
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    </LayoutGroup>
  )
}
