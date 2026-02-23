"use client";

import { useState, useEffect } from 'react';

export function useReminder() {
    const [reminderTime, setReminderTime] = useState<string | null>(null);
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        // Load from local storage
        const savedTime = localStorage.getItem('satu_juz_reminder_time');
        if (savedTime) setReminderTime(savedTime);

        // Check current notification permission
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (!('Notification' in window)) {
            alert('Browser Anda tidak mendukung notifikasi.');
            return false;
        }

        const result = await Notification.requestPermission();
        setPermission(result);

        if (result === 'granted') {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then((registration) => {
                    registration.showNotification('Notifikasi Aktif! ✅', {
                        body: 'Alarm SatuJuz berhasil dihubungkan ke perangkatmu.',
                        icon: '/icon-192x192.png',
                    });
                }).catch(() => {
                    new Notification('Notifikasi Aktif! ✅', {
                        body: 'Alarm SatuJuz berhasil dihubungkan ke perangkatmu.',
                        icon: '/icon-192x192.png',
                    });
                });
            } else {
                new Notification('Notifikasi Aktif! ✅', {
                    body: 'Alarm SatuJuz berhasil dihubungkan ke perangkatmu.',
                    icon: '/icon-192x192.png',
                });
            }
        }

        return result === 'granted';
    };

    const setReminder = async (time: string) => {
        if (permission !== 'granted') {
            const granted = await requestPermission();
            if (!granted) return;
        }

        setReminderTime(time);
        localStorage.setItem('satu_juz_reminder_time', time);
    };

    const clearReminder = () => {
        setReminderTime(null);
        localStorage.removeItem('satu_juz_reminder_time');
    };

    // The actual alarm checker (runs when tab is open)
    useEffect(() => {
        if (!reminderTime || permission !== 'granted') return;

        const interval = setInterval(() => {
            const now = new Date();
            const currentHours = now.getHours().toString().padStart(2, '0');
            const currentMinutes = now.getMinutes().toString().padStart(2, '0');
            const currentTimeStr = `${currentHours}:${currentMinutes}`;

            if (currentTimeStr === reminderTime) {
                // Check if we already notified today
                const lastNotified = localStorage.getItem('satu_juz_last_notified');
                const today = now.toDateString();

                if (lastNotified !== today) {
                    // Trigger notification
                    if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.ready.then((registration) => {
                            registration.showNotification('Waktunya Membaca Al-Qur\'an 📖', {
                                body: 'Satu Juz memanggilmu. Yuk lanjutkan progres bacaanmu hari ini!',
                                icon: '/icon-192x192.png',
                            });
                        }).catch(() => {
                            // Fallback if service worker fails
                            new Notification('Waktunya Membaca Al-Qur\'an 📖', {
                                body: 'Satu Juz memanggilmu. Yuk lanjutkan progres bacaanmu hari ini!',
                                icon: '/icon-192x192.png',
                            });
                        });
                    } else {
                        new Notification('Waktunya Membaca Al-Qur\'an 📖', {
                            body: 'Satu Juz memanggilmu. Yuk lanjutkan progres bacaanmu hari ini!',
                            icon: '/icon-192x192.png',
                        });
                    }

                    // Option to play a soft sound could be added here

                    localStorage.setItem('satu_juz_last_notified', today);
                }
            }
        }, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, [reminderTime, permission]);

    return {
        reminderTime,
        permission,
        requestPermission,
        setReminder,
        clearReminder
    };
}
