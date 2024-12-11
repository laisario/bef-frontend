import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography, } from '@mui/material';
import { FixedSizeList } from 'react-window';
import React from 'react'
import { fDate } from '../../utils/formatTime';


function Calibrations({ calibrations, isMobile, setSelectedCalibration, selectedCalibration }) {
  function renderRow(props) {
    const { index, style } = props;
    return (
      <div key={index + calibrations[index]?.id}>
        <ListItem style={style} disablePadding onClick={() => setSelectedCalibration(calibrations[index])} sx={{ bgcolor: selectedCalibration?.id === calibrations[index]?.id ? 'background.neutral' : 'background.paper', }}>
          <ListItemAvatar sx={{p: 1}}>
            <Avatar>
              OS
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={calibrations[index]?.ordem_de_servico || `${index + 1}°`} secondary={fDate(calibrations[index]?.data)} />
        </ListItem>
        <Divider variant="inset" component="li" />
      </div>
    );
  }
  return (
    <List sx={{
      width: '100%',
      overflow: 'auto',
      maxHeight: 'auto'
    }}>
      {!calibrations?.length ? <Typography color='grey' fontWeight={400} textAlign='center'>Nenhuma calibração cadastrada</Typography> :
        <FixedSizeList
          height={300}
          width="100%"
          itemSize={55}
          itemCount={calibrations?.length}
          overscanCount={3}
        >
          {renderRow}
        </FixedSizeList>
      }
    </List>
  );
}

export default Calibrations