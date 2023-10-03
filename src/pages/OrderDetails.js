import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import usePropostas from '../hooks/usePropostas';
import CardInformation from '../components/orders/orderCard';

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
    <Card sx={{padding: 2}}>
      <Card color="grey">
        <Grid container>
        <CardInformation title="Faixa de medição" content={`${order.faixa_medicao_min} - ${order.faixa_medicao_max} `}/>
        <CardInformation title="Quantidade" content={order.quantidade}/>
        <CardInformation title="Data do pedido" content={order.data_criacao}/>
        <CardInformation title="Tipo do serviço" content={order.tipo_do_servico}/>
        <CardInformation title="Local" content={order.local}/>
        <CardInformation title="Endereço de entrega" content={order.endereco_de_entrega}/>
        <CardInformation title="Endereço de faturamento" content={order.endereco_de_faturamento}/>
        <CardInformation title="Transporte" content={order.transporte}/>

        <CardInformation title="Validade" content={order.validade}/>


        <CardInformation title="Preço" content={order.preco}/>
        <CardInformation title="Total" content={order.total}/>
        <CardInformation title="Condição de pagamento" content={order.condicao_de_pagamento}/>

        </Grid>
      </Card>
    </Card>
  );
}

export default OrderDetails;
