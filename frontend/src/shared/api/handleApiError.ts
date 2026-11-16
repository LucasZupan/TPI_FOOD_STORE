import axios from 'axios'

interface ApiErrorResponse {
  detail?: string
}

export const handleApiError = (
  error: unknown,
): string => {
  if (
    axios.isAxiosError<ApiErrorResponse>(
      error,
    )
  ) {
    return (
      error.response?.data?.detail ??
      'Ocurrió un error inesperado'
    )
  }

  return 'Ocurrió un error inesperado'
}