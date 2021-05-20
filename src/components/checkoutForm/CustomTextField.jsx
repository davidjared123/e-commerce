import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField'

function FormInput({name, label, required}) {
  const { control } = useFormContext();

  return (
    <Grid item xs={12} sm={6}>
      <Controller
        render={({...props})=> (
            <TextField name={name} label={label} required={required} />
            )}
        name={name}
        control={ control }
      />
      </Grid>
  );
}

export default FormInput;