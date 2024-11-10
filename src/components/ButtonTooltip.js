import { IconButton, Tooltip } from '@mui/material'
import React from 'react'

function ButtonTooltip({ title, action, icon }) {
    return (
      <Tooltip title={title}>
        <IconButton size="small" onClick={action}>
          {icon}
        </IconButton>
      </Tooltip>
    )
  }

export default ButtonTooltip