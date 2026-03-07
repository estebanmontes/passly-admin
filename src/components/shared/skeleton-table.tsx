import { cn } from "@/lib/utils";

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 5, columns = 5 }: SkeletonTableProps) {
  return (
    <div className="organic-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-6 py-3">
                <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} className="border-b border-border last:border-0">
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx} className="px-6 py-4">
                  <div
                    className={cn(
                      "h-4 animate-pulse rounded bg-slate-100",
                      colIdx === 0 ? "w-32" : "w-20"
                    )}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
