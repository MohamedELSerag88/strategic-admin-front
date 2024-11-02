export type CustomTableProps = {
  children: React.ReactNode;
  rowsHeaderText: string[];
  totalRows: number;
  hideActionColumn?: boolean;
  handleChangePage: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
};
