export default function registerServiceWorker() {
    if ('serviceWorker' in navigator && process.env.APP_ENV !== 'dev') {
        window.addEventListener('load', () => {
            const { serviceWorker } = navigator
            serviceWorker
                .register(`/service-worker.js?v=${new Date().getTime()}`)
                .then(registration => {
                    console.log('SW registered: ', registration)
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError)
                })
        })
    }
}
