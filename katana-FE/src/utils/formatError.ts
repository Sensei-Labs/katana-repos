export function formatErrorMessage(error: any) {
  return (
    // @ts-ignore
    error?.response?.data?.error?.message ||
    error?.message ||
    'Sorry, you can try later, please!'
  );
}

export function getStatusErrorCode(error: any) {
  return (
    // @ts-ignore
    error?.response?.data?.error?.status || 500
  );
}
