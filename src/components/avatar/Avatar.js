import UIAvatar from 'react-ui-avatars';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../context/Auth';


const Avatar = ({size = 48}) => {
    const theme = useTheme()
    const { user } = useAuth()

    return <UIAvatar size={size} length={user?.nome?.split(' ').length <= 2 ? user?.nome?.split(' ').length : 2} name={user?.nome} background={theme.palette.secondary.dark} color={theme.palette.secondary.light} rounded />
}

export default Avatar
