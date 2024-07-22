import PropTypes from 'prop-types';
import { Box, Stack, Link, Card, Button, Divider, Typography, CardHeader } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { isExpired, fDate } from '../../../utils/formatTime';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import palette from '../../../theme/palette';
import Label from '../../../components/label';
import useDocumentos from '../../../hooks/useDocumentos';

AppListItems.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppListItems({ title, subheader, list, document, ...other }) {
  const navigate = useNavigate();
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {list?.length ? list?.map((data) => (
            <ListItem key={data?.id} isDocument={document} data={data} />
          )) : <Typography textAlign="center" variant='h6'>{document ? 'Sem revisões para aprovar' : 'Nenhum instrumento cadastrado'}</Typography>}
        </Stack>
      </Scrollbar>

      <Divider />
      {!document && (
        <Box sx={{ p: 2, textAlign: 'right' }}>
          <Button size="small" color="inherit" onClick={() => navigate('/dashboard/instrumentos')} endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
            Ver todos
          </Button>
        </Box>
      )}
    </Card>
  );
}

// ----------------------------------------------------------------------

ListItem.propTypes = {
  list: PropTypes.shape({
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

const formatData = (data, isDocument) => {
  if (isDocument) {
    return {
      title: `Documento: ${data?.documento?.titulo}`,
      subtitle: data?.alteracao,
      url: `/admin/documento/${data?.documento?.id}/${data?.id}`,
      ...data,
    }
  }

  return {
    title: `${data?.tag} - ${data?.descricao}`,
    subtitle: `${data?.fabricante} | ${data?.modelo} | ${data?.faixaNominalMin} - ${data?.faixaNominalMax} ${data?.unidade?.map((u) => u.unidade)}`,
    url: `/dashboard/instrumento/${data?.id}`,
    ...data,
  }
}

function ListItem({ data, isDocument }) {
  const formattedData = formatData(data, isDocument)
  const { findCriticalAnalysisStage, criticalAnalysisMonths } = useDocumentos()
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 1.5,
          flexShrink: 0,
          background: isDocument ? palette.secondary.lighter : palette[data.isExpired ? 'error' : 'success'].light,
          backgroundImage: isDocument
            ? `linear-gradient(135deg, ${alpha(
              palette.secondary.dark,
              0
            )} 0%, ${alpha(palette[data.isExpired ? 'error' : 'success'].dark, 0.24)} 100%)`
            : `linear-gradient(135deg, ${alpha(
              palette[data.isExpired ? 'error' : 'success'].dark,
              0
            )} 0%, ${alpha(palette[data.isExpired ? 'error' : 'success'].dark, 0.24)} 100%)`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Iconify
          icon={isDocument ? 'mingcute:document-2-line' : data.isExpired ? 'ant-design:close-outlined' : 'ant-design:check-outlined'}
          color={isDocument ? palette.secondary.darker : palette[data.isExpired ? 'error' : 'success'].darker}
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
          <Link component={RouterLink} to={formattedData?.url} color="inherit" variant="subtitle2" underline="hover" noWrap>
            {formattedData?.title}
          </Link>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {formattedData?.subtitle}
          </Typography>
          {isDocument && data?.cliente && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {formattedData?.cliente?.empresa} - {formattedData?.cliente?.nome}
            </Typography>
          )}
        </Box>
        {isDocument && data?.documento ? (
          <Label color={findCriticalAnalysisStage(data?.documento?.analise_critica)} sx={{ mr: 3 }}>
            <Typography variant="caption">
              Análise Crítica: <b style={{ color: findCriticalAnalysisStage(data?.documento?.analise_critica) }}>{criticalAnalysisMonths(data?.documento?.analise_critica)}</b>
            </Typography>
          </Label>)
          : (
            <Label color={isExpired ? 'error' : 'success'} sx={{ mr: 3 }}>
              <Typography variant="caption">
                {isExpired ? "Data última calibração " : "Data próxima calibração "}{fDate(data?.data, "dd/MM/yy")}
              </Typography>
            </Label>
          )}
      </Box>
    </Stack>
  );
}
