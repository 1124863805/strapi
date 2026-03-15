export const prefixFileUrlWithBackendUrl = (fileURL?: string) => {
  return !!fileURL && fileURL.startsWith('/') ? `${window.leao.backendURL}${fileURL}` : fileURL;
};
