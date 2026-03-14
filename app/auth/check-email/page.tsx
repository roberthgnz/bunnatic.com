import { Suspense } from 'react'
import { Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CheckEmailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
            <CheckEmailContent />
        </Suspense>
    )
}

function CheckEmailContent() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="text-xl font-bold text-emerald-700"
                    >
                        Bunnatic
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                        {/* Icon */}
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                            <Mail className="h-8 w-8 text-emerald-700" />
                        </div>

                        {/* Title */}
                        <h1 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
                            Confirma tu correo electrónico
                        </h1>

                        {/* Description */}
                        <p className="mt-3 text-center text-sm text-gray-600">
                            Te hemos enviado un correo electrónico con un enlace de confirmación.
                            Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
                        </p>

                        {/* Additional Info */}
                        <div className="mt-6 rounded-lg bg-slate-50 p-4">
                            <p className="text-xs text-gray-600">
                                <strong className="font-semibold text-gray-900">¿No ves el correo?</strong>
                                <br />
                                Revisa tu carpeta de spam o correo no deseado. El correo puede tardar unos minutos en llegar.
                            </p>
                        </div>

                        {/* Back to Sign In */}
                        <div className="mt-6">
                            <Link
                                href="/signin"
                                className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-700 transition-colors hover:text-emerald-800"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    </div>

                    {/* Help Text */}
                    <p className="mt-6 text-center text-xs text-gray-500">
                        ¿Necesitas ayuda?{' '}
                        <a
                            href="mailto:hello@bunnatic.com"
                            className="font-medium text-emerald-700 hover:text-emerald-800"
                        >
                            Contacta con soporte
                        </a>
                    </p>
                </div>
            </main>
        </div>
    )
}
