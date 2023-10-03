import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import { Helmet } from 'react-helmet-async';
import TitleCard from '../components/orders/titleCard';
import usePropostas from '../hooks/usePropostas';
import CardInformation from '../components/orders/orderCard';
import Iconify from '../components/iconify';
import { capitalizeFirstLetter as CFL } from '../utils/formatString';
import { fDateTime } from '../utils/formatTime';

const formaPagamento = {
  CD: 'Débito',
  CC: 'Crédito',
  P: 'Pix',
  D: 'Dinheiro',
};

const statusProposta = {
  null: 'Proposta em análise',
  false: 'Proposta negada',
  true: 'Proposta aprovada',
};

const colorStatusProposta = {
  null: 'info',
  false: 'error',
  true: 'success',
};

function OrderDetails() {
  const [order, setOrder] = useState();
  const { id } = useParams();
  const { getOrder } = usePropostas();
  useEffect(() => {
    (async () => {
      const response = await getOrder(id);
      setOrder(response);
    })();
  }, []);
  console.log(order);

  return (
    <>
      <Helmet>
        <title> Pedido | B&F </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {CFL(order?.identificacao_instrumento)}
          </Typography>
          <Box>
            <Button color='info'>
              <Iconify icon="eva:trash-2-fill" />
            </Button>
            <Button color='info'>
              <Iconify icon="eva:edit-2-fill" />
            </Button>
            <Button variant="contained" startIcon={<Iconify icon="eva:checkmark-fill" />}>
              Aprovar pedido
            </Button>
          </Box>
        </Stack>
        <Card sx={{ padding: 2 }}>
          <Box>
            <Grid container>
              <TitleCard title="Calibração" />
              <Grid container>
                <CardInformation
                  title="Faixa de medição"
                  content={`${order?.faixa_medicao_min} - ${order?.faixa_medicao_max} `}
                />
                <CardInformation
                  title="Pontos de calibração"
                  content={order?.pontos_de_calibracao.map(({ nome }) => nome).join(', ')}
                />
                <CardInformation title="Quantidade" content={order?.quantidade} />
                <CardInformation title="Tipo de serviço" content={CFL(order?.tipo_de_servico)} />
                <CardInformation title="Validade" content={fDateTime(order?.validade)} />
                <CardInformation title="Observações" content={CFL(order?.informacoes_adicionais)} />
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Grid container>
              <TitleCard title="Pedido" />
              <Grid container>
                <CardInformation title="Data do pedido:" content={fDateTime(order?.data_criacao)} />
                <CardInformation title="Local" content={CFL(order?.local)} />
                {/* Arrumar campos de endereço pois retornam o numero do endereço da tabela de endereço */}
                <CardInformation title="Endereço de entrega" content={'Rua Batutinha de Lala, Centro - Barra Mansa'} />
                <CardInformation
                  title="Endereço de faturamento"
                  content={'Rua Batutinha de Lala, Centro - Barra Mansa'}
                />
                <CardInformation title="Transporte" content={CFL(order?.transporte)} />
                <CardInformation title="Status" color={colorStatusProposta[order?.aprovacao]} content={statusProposta[order?.aprovacao]} />
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Grid container>
              <TitleCard title="Pagamento" />
              <Grid container>
                <CardInformation title="Forma de pagamento:" content={formaPagamento[order?.condicao_de_pagamento]} />
                <CardInformation title="Preço:" content={`R$ ${Number(order?.preco).toFixed()}`} />
                <CardInformation title="Total:" content={`R$ ${Number(order?.total).toFixed()}`} />
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Container>
    </>
  );
}

export default OrderDetails;
