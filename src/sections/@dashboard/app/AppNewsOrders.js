// @mui
import PropTypes from 'prop-types';
import { Box, Stack, Link, Card, Button, Divider, Typography, CardHeader } from '@mui/material';
import { alpha } from '@mui/material/styles';
// utils
import { useNavigate } from 'react-router-dom';
import { fToNow } from '../../../utils/formatTime';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import palette from '../../../theme/palette';

// ----------------------------------------------------------------------

AppNewsOrders.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppNewsOrders({ title, subheader, list, admin, ...other }) {
  const navigate = useNavigate();
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {list?.map((news) => (
            <NewsItem key={news.id} admin news={news} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider />
      {!admin && (
        <Box sx={{ p: 2, textAlign: 'right' }}>
          <Button size="small" color="inherit" onClick={() => navigate('/dashboard/produtos')} endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
            Ver todos
          </Button>
        </Box>
      )}
    </Card>
  );
}

// ----------------------------------------------------------------------

NewsItem.propTypes = {
  news: PropTypes.shape({
    tag: PropTypes.string,
    fabricante: PropTypes.string,
    modelo: PropTypes.string,
    faixaNominalMax: PropTypes.string,
    faixaNominalMin: PropTypes.string,
    unidade: PropTypes.string,
    data: PropTypes.string,
    isExpired: PropTypes.bool,
  }),
};

function NewsItem({ news, admin }) {
  const {
    isExpired,
    tag,
    fabricante,
    modelo,
    faixaNominalMin,
    faixaNominalMax,
    unidade,
    data_proxima_calibracao: data,
    cliente,
  } = news;

  const faixaNominal = faixaNominalMax === faixaNominalMin ? faixaNominalMax : `${faixaNominalMin}-${faixaNominalMax}`;
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 1.5,
          flexShrink: 0,
          background: palette[isExpired ? 'error' : 'success'].light,
          backgroundImage: `linear-gradient(135deg, ${alpha(
            palette[isExpired ? 'error' : 'success'].dark,
            0
          )} 0%, ${alpha(palette[isExpired ? 'error' : 'success'].dark, 0.24)} 100%)`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Iconify
          icon={isExpired ? 'ant-design:close-outlined' : 'ant-design:check-outlined'}
          color={palette[isExpired ? 'error' : 'success'].darker}
          width={24}
          height={24}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          width: '100%',
          flexDirection: { md: 'row', xs: 'column' },
          alignItems: { md: 'center', xs: 'flex-start' },
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
            {tag}
          </Link>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {fabricante} | {modelo} | {faixaNominal}
            {unidade}
          </Typography>
          {admin && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {cliente?.empresa} - {cliente?.nome}
            </Typography>
          )}
        </Box>
        {data && (
          <Typography variant="caption" sx={{ pr: 3, color: 'text.secondary' }}>
            <b>Vencimento:</b> {fToNow(data)}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
