export const oneUpperCase = () => {
  return /(?=.*?[A-Z])/;
};
export const oneLowerCase = () => {
  return /(?=.*?[a-z])/;
};
export const oneDigit = () => {
  return /(?=.*?[0-9])/;
};
export const minimumLength = () => {
  return /.{10,}/;
};
export const link = () => {
  return /^(?=.{1,255}$)(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/[^ ]*)?$/;
};

export default {
  minimumLength,
  oneUpperCase,
  oneLowerCase,
  oneDigit,
  link,
};
