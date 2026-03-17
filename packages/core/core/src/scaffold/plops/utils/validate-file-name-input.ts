export default (input: string) => {
  if (!input) return 'You must provide an input';
  return /^[A-Za-z-_0-9]+$/g.test(input) || "Please use only letters, numbers, '-' or '_' and no spaces";
};
