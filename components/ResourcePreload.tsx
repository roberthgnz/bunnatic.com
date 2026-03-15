/**
 * ResourcePreload Component
 * Preloads critical resources to improve performance
 */
export function ResourcePreload() {
    return (
        <>
            {/* Preconnect to external domains */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <link rel="preconnect" href="https://www.google-analytics.com" />

            {/* DNS prefetch for other domains */}
            <link rel="dns-prefetch" href="https://www.clarity.ms" />

            {/* Preload critical assets - add your critical images/fonts here */}
            {/* Example: <link rel="preload" as="image" href="/hero-image.jpg" /> */}
        </>
    )
}
