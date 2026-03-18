import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  IconButton,
  Stack
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const DataTable = ({ columns, rows, onEdit, onDelete }) => (
  <TableContainer
    component={Paper}
    className="table-container"
    sx={{ borderRadius: 3, width: "100%", overflow: "hidden" }}
  >
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key}>{col.label}</TableCell>
            ))}
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row._id} hover>
              {columns.map((col) => (
                <TableCell key={col.key}>{col.render ? col.render(row) : row[col.key]}</TableCell>
              ))}
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <IconButton size="small" onClick={() => onEdit(row)}>
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => onDelete(row)}>
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
  </TableContainer>
);

export default DataTable;
