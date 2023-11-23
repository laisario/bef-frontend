import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import { useAuth } from '../../context/Auth';


const AvatarComponent = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const nomes = user?.nome?.split(" ").filter((nome,index) => index === 0 || index === 1)
  return <Avatar sx={{ bgcolor: theme.palette.secondary.dark }}>{nomes?.map(nome => nome[0].toUpperCase())}</Avatar>;
};

export default AvatarComponent;
