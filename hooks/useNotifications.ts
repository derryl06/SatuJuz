export function useNotifications() {
    // Determine the precise permission state dynamically (avoiding SSR issues)
    const getPermission = () => {
        if (typeof window !== "undefined" && "Notification" in window) {
            return Notification.permission;
        }
        return "default";
    };

    const requestPermission = async () => {
        if (typeof window === "undefined" || !("Notification" in window)) {
            alert("Perangkat atau browser kamu tidak mendukung fitur notifikasi.");
            return false;
        }

        const permission = await Notification.requestPermission();
        return permission === "granted";
    };

    const sendNotification = (title: string, options?: NotificationOptions) => {
        if (getPermission() === "granted") {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then((registration) => {
                    registration.showNotification(title, {
                        icon: "/icons/icon-192x192.png",
                        badge: "/icons/icon-72x72.png",
                        silent: false, // Make sure it pings!
                        ...options,
                    });
                }).catch(() => {
                    new Notification(title, {
                        icon: "/icons/icon-192x192.png",
                        badge: "/icons/icon-72x72.png",
                        silent: false, // Make sure it pings!
                        ...options,
                    });
                });
            } else {
                new Notification(title, {
                    icon: "/icons/icon-192x192.png",
                    badge: "/icons/icon-72x72.png",
                    silent: false, // Make sure it pings!
                    ...options,
                });
            }
        }
    };

    return { getPermission, requestPermission, sendNotification };
}
