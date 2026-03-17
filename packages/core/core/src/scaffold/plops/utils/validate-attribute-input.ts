export default (input: string) => {
  if (!input) return 'You must provide an input';
  return /^[A-Za-z-|_]+$/g.test(input) || "Please use only letters, '-', '_', and no spaces";
};
