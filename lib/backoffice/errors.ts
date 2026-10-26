export class BackofficeError extends Error {
  constructor(
    public readonly code:
      | 'UNAUTHENTICATED'
      | 'NOT_FOUND'
      | 'FORBIDDEN'
      | 'DATABASE_ERROR',
    message: string,
    options?: ErrorOptions
  ) {
    super(message, options)
    this.name = 'BackofficeError'
  }
}

export function throwDataError(error: unknown): never {
  throw new BackofficeError(
    'DATABASE_ERROR',
    'No se han podido cargar los datos. Vuelve a intentarlo.',
    { cause: error }
  )
}

export type ActionResult =
  | { success: true; error?: never }
  | { error: string; success?: never }

export function actionError(error: unknown): ActionResult {
  if (error instanceof BackofficeError) return { error: error.message }
  console.error('[backoffice] La operación no se pudo completar.', error)
  return { error: 'No se pudo guardar el cambio. Vuelve a intentarlo.' }
}
