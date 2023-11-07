// @mui
import PropTypes from 'prop-types';
import { Box, Button, Card, Divider, Typography, CardHeader, CardContent } from '@mui/material';
import { Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineSeparator, TimelineConnector } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
// utils
import { fDateTime } from '../../../utils/formatTime';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

AppOrderTimeline.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppOrderTimeline({ title, subheader, list, ...other }) {
  const navigate = useNavigate()
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <CardContent
        sx={{
          '& .MuiTimelineItem-missingOppositeContent:before': {
            display: 'none',
          },
          py: 2,
        }}
      >
        <Timeline sx={{p: 0}}>
          {list?.map((item, index) => (
            <OrderItem key={item.id} item={item} isLast={index === list.length - 1} />
          ))}
        </Timeline>

      </CardContent>
        <Divider />
        <Box sx={{ p: 2, textAlign: 'right' }}>
          <Button size="small" color="inherit" onClick={() => navigate('/dashboard/pedidos')} endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
            Ver todos
          </Button>
        </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

OrderItem.propTypes = {
  isLast: PropTypes.bool,
  item: PropTypes.shape({
    time: PropTypes.instanceOf(Date),
    title: PropTypes.string,
    status: PropTypes.string,
  }),
};

function OrderItem({ item, isLast }) {
  const { status, title, time } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          variant={status === "F" ? "filled" : "outlined"}
          color={status === "F" ? "primary" : "secondary"}
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Typography variant="subtitle2">{title}</Typography>

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {fDateTime(time)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
