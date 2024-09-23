import { IconButton, Tooltip } from '@mui/material'
import React from 'react'

function Button({ title, action, icon }) {
    return (
      <Tooltip title={title}>
        <IconButton size="small" onClick={action}>
          {icon}
        </IconButton>
      </Tooltip>
    )
  }

export default Button