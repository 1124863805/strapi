export default (date: Date = new Date()) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toJSON()
    .replace(/[-:]/g, '.')
    .replace(/\....Z/, '');
