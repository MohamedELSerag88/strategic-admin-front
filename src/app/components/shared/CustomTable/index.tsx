import React from "react";
import { CustomTableProps } from "@/app/components/shared/CustomTable/types";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  TableBody,
  TableFooter,
  Pagination,
  Box,
} from "@mui/material";

const CustomTable: React.FC<CustomTableProps> = ({
  children,
  totalRows,
  rowsHeaderText,
  hideActionColumn,
  handleChangePage,
}) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {rowsHeaderText.map((item) => (
              <TableCell key={item}>
                <Typography variant="h6">{item}</Typography>
              </TableCell>
            ))}
            {!hideActionColumn && (
              <TableCell align="right">
                <Typography variant="h6">Action</Typography>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody sx={{ width: "100%", overflowY: "auto" }}>
          {children}
        </TableBody>
        {totalRows > 1 && (
          <TableFooter>
            <TableRow>
              <Box
                my={8}
                display="flex"
                justifyContent={"center"}
                sx={{ width: "max-content" }}
              >
                <Pagination
                  count={totalRows}
                  color="primary"
                  onClick={handleChangePage}
                />
              </Box>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
