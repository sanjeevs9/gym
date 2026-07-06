import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TrendPoint } from "@/lib/actions/summary";

export function TrendsTable({ data }: { data: TrendPoint[] }) {
  const rows = [...data].reverse();

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Calories in</TableHead>
            <TableHead className="text-right">Protein</TableHead>
            <TableHead className="text-right">Carbs</TableHead>
            <TableHead className="text-right">Fat</TableHead>
            <TableHead className="text-right">Fiber</TableHead>
            <TableHead className="text-right">Burned</TableHead>
            <TableHead className="text-right">Weight</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.date}>
              <TableCell className="font-medium">{row.label}</TableCell>
              <TableCell className="text-right tabular-nums">{Math.round(row.calories)}</TableCell>
              <TableCell className="text-right tabular-nums">{Math.round(row.protein)}g</TableCell>
              <TableCell className="text-right tabular-nums">{Math.round(row.carbs)}g</TableCell>
              <TableCell className="text-right tabular-nums">{Math.round(row.fat)}g</TableCell>
              <TableCell className="text-right tabular-nums">{Math.round(row.fiber)}g</TableCell>
              <TableCell className="text-right tabular-nums">
                {Math.round(row.caloriesBurned)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.weightKg ? `${row.weightKg.toFixed(1)} kg` : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
