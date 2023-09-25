import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import { useAuth } from '../../context/Auth';


const AvatarComponent = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const userName = user?.nome;
  return <Avatar sx={{ bgcolor: theme.palette.secondary.dark }}>{userName[0]}</Avatar>;
};

export default AvatarComponent;
