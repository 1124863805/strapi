export default (input: string) => {
  if (!input) return 'You must provide an input';
  return /^[A-Za-z-]+$/g.test(input) || "Please use only letters, '-' and no spaces";
};
