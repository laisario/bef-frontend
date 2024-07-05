<FormControl sx={{ width: '50%' }} margin="normal">
<InputLabel id="label-local">Local</InputLabel>
<Select
  labelId="label-local"
  id="label-local"
  name="local"
  label="Local"
  {...form.register("local")}
  value={local}
>
  <MenuItem value="L">Laboratório</MenuItem>
  <MenuItem value="C">Cliente</MenuItem>
</Select>
</FormControl>

<DatePicker
label="Prazo de entrega"
{...form.register("prazoDeEntrega")}
value={prazoDeEntrega ? dayjs(prazoDeEntrega) : null}
onChange={newValue => form.setValue("prazoDeEntrega", newValue)}
sx={{ width: '50%' }}
/>