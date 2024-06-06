// @mui
import { TableRow, TableCell, TableHead } from '@mui/material';

// ----------------------------------------------------------------------

export default function UserListHead({
  order,
  orderBy,
  headLabel,
}) {
  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell
            sx={{background: (theme) => `${theme.palette.grey[300]}`, color: (theme) => `${theme.palette.grey[700]}`}}
            key={headCell.id}
            align={headCell.alignRight ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
              {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
