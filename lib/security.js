export const validateInput = (input) => {
  return input.replace(/[<>]/g, '');
};