import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Chip
} from "@mui/material";

const TimetableGrid = ({ schedule, onCellClick, selectedCell }) => {
  if (!schedule) return null;
  const { days, slots, grid } = schedule;

  return (
    <TableContainer component={Paper} className="table-container timetable-grid">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Time Slot</TableCell>
            {days.map((day) => (
              <TableCell key={day}>{day}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {slots.map((slot, idx) => (
            <TableRow key={slot + idx}>
              <TableCell sx={{ minWidth: 120 }}>{slot}</TableCell>
              {days.map((day) => {
                const entry = grid[day]?.[idx];
                const isBreak = entry?.isBreak;
                const isSelected =
                  selectedCell &&
                  selectedCell.day === day &&
                  selectedCell.slotIndex === idx;
                return (
                  <TableCell
                    key={`${day}-${slot}`}
                    onClick={() => !isBreak && onCellClick?.(day, idx)}
                    sx={{
                      cursor: isBreak ? "default" : "pointer",
                      bgcolor: isBreak
                        ? "action.hover"
                        : isSelected
                          ? "secondary.light"
                          : "transparent"
                    }}
                  >
                    {isBreak ? (
                      <Chip label="Break" size="small" />
                    ) : entry ? (
                      <Box>
                        <strong>{entry.subjectName}</strong>
                        <div>{entry.teacherName}</div>
                        <div>{entry.labName || entry.roomName}</div>
                        <Chip
                          label={entry.type}
                          size="small"
                          color={entry.type === "practical" ? "secondary" : "primary"}
                        />
                      </Box>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TimetableGrid;
