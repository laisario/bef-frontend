import { format, getTime, formatDistanceToNow, addDays, isPast } from 'date-fns';
import ptLocale from 'date-fns/locale/pt-BR'

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || "dd 'de' MMMM 'de' yyyy";

  return date ? format(new Date(date), fm, { locale: ptLocale }) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ptLocale
    })
    : '';
}

export function isExpired(date, frequency) {
  return date ? isPast(addDays(new Date(date), frequency)) : false
}
