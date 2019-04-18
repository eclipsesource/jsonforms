import React from 'react';
import Typography from '@material-ui/core/Typography'
import styles from '../../../styles/global.module.css'

export default ({ title, body }) => (
  <div className={styles.greyBox}>
    <Typography variant="subtitle2" color="error">
      {title}
    </Typography>
    <Typography variant="body1">
      {body}
    </Typography>
  </div>
);