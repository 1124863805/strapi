const getService = (name) => {
  return leao.service(`admin::${name}`);
};

export { getService };
