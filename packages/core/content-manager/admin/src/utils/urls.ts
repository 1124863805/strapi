const prefixFileUrlWithBackendUrl = (fileURL?: string): string | undefined => {
  return !!fileURL && fileURL.startsWith('/') ? `${window.leao.backendURL}${fileURL}` : fileURL;
};

export { prefixFileUrlWithBackendUrl };
