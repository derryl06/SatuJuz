/* script.js: Universal State & API Engine (Ultimate Edition) */

const APP_STORAGE_KEY = 'od1j_data_v2';
const API_BASE_QURAN = 'https://api.quran.com/api/v4';
const API_BASE_PRAYER = 'https://api.aladhan.com/v1';

const initialState = {
    user: { name: 'Guest', isLoggedIn: false, joiningDate: 'FEB 2026' },
    completions: [],
    bookmark: { juz: 1, key: '1:1', surahName: 'AL-FATIHAH' },
    stats: { totalJuz: 0, streak: 0 },
    settings: { city: 'Jakarta', country: 'Indonesia', notifications: true }
};

// --- CORE UTILS ---
const getState = () => {
    try {
        const data = localStorage.getItem(APP_STORAGE_KEY);
        return data ? JSON.parse(data) : initialState;
    } catch (e) { return initialState; }
};

const saveState = (state) => {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event('statechange'));
};

const showToast = (msg) => {
    const existing = document.querySelector('.app-toast');
    if (existing) existing.remove();
    const t = document.createElement('div');
    t.className = 'app-toast';
    t.style.cssText = `position:fixed; bottom:120px; left:50%; transform:translateX(-50%); background:var(--accent-neon); color:#000; padding:12px 24px; border-radius:12px; font-weight:900; z-index:9999; box-shadow:0 10px 30px rgba(0,0,0,0.5); transition: opacity 0.3s;`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 500); }, 2000);
};

// --- LOGIC ENGINES ---
async function fetchPrayerTimes() {
    try {
        const state = getState();
        let url = `${API_BASE_PRAYER}/timingsByCity?city=${state.settings.city}&country=${state.settings.country}&method=11`;

        const coords = await new Promise((res) => {
            navigator.geolocation.getCurrentPosition((p) => res(p.coords), () => res(null), { timeout: 2000 });
        });

        if (coords) {
            url = `${API_BASE_PRAYER}/timings/${Math.floor(Date.now() / 1000)}?latitude=${coords.latitude}&longitude=${coords.longitude}&method=11`;
        }

        const response = await fetch(url);
        const data = await response.json();
        return data.data.timings;
    } catch (err) { return null; }
}

async function fetchJuzData(juzNum) {
    try {
        const response = await fetch(`${API_BASE_QURAN}/verses/by_juz/${juzNum}?language=id&fields=text_uthmani&per_page=300`);
        const data = await response.json();
        const surahIds = [...new Set(data.verses.map(v => v.verse_key.split(':')[0]))];
        const surahPromises = surahIds.map(id => fetch(`${API_BASE_QURAN}/chapters/${id}?language=id`).then(r => r.json()));
        const surahResults = await Promise.all(surahPromises);
        const surahMap = {};
        surahResults.forEach(res => { surahMap[res.chapter.id] = res.chapter; });
        return { verses: data.verses, surahMap };
    } catch (err) { return null; }
}

const calculateStreak = (completions) => {
    if (!completions || completions.length === 0) return 0;
    const dates = completions.map(c => new Date(c.timestamp).toDateString());
    const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b) - new Date(a));
    const today = new Date().toDateString();
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    if (uniqueDates[0] !== today && uniqueDates[0] !== yesterdayStr) return 0;
    let streak = 0;
    let currentCheck = new Date(uniqueDates[0]);
    for (const dStr of uniqueDates) {
        const d = new Date(dStr);
        const diff = Math.floor((currentCheck - d) / (1000 * 60 * 60 * 24));
        if (diff <= 1) { streak++; currentCheck = d; } else break;
    }
    return streak;
};

function markJuzComplete(juzNum) {
    const state = getState();
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    const todayStr = now.toDateString();

    // Check if THIS SPECIFIC JUZ was marked TODAY
    if (!state.completions.some(c => c.juz == juzNum && new Date(c.timestamp).toDateString() === todayStr)) {
        state.completions.unshift({ juz: juzNum, date: dateStr, timestamp: Date.now() });
        state.stats.totalJuz = state.completions.length;
        state.stats.streak = calculateStreak(state.completions);
        saveState(state);
        showToast(`JUZ ${juzNum} KHATAM! 🎉`);
    } else {
        showToast(`JUZ ${juzNum} ALREADY MARKED TODAY`);
    }
}

function unmarkJuz(juzNum) {
    const state = getState();
    const originalLen = state.completions.length;
    state.completions = state.completions.filter(c => c.juz != juzNum);
    if (state.completions.length !== originalLen) {
        state.stats.totalJuz = state.completions.length;
        state.stats.streak = calculateStreak(state.completions);
        saveState(state);
        showToast(`JUZ ${juzNum} UNMARKED`);
    }
}

function resetState() {
    if (confirm('ARE YOU SURE? THIS WILL WIPE ALL PROGRESS!')) {
        localStorage.removeItem(APP_STORAGE_KEY);
        window.location.reload();
    }
}

// --- UI COMPONENTS ---
function updateStatsUI() {
    const state = getState();

    // Streak Updates (Targets all instances)
    document.querySelectorAll('#home-streak, #stats-streak').forEach(el => {
        el.textContent = el.id.includes('stats') ? `${state.stats.streak}d` : `${state.stats.streak} DAYS`;
    });

    // Total Juz Updates
    const sTotal = document.getElementById('stats-total');
    if (sTotal) sTotal.textContent = state.completions.length;

    // Home Bookmark Update
    const hBookmark = document.getElementById('home-bookmark');
    if (hBookmark) {
        if (state.bookmark && state.bookmark.key) {
            hBookmark.innerHTML = `
                <div class="card-premium animate-fade-up" onclick="window.location.href='quran.html?juz=${state.bookmark.juz}'" style="cursor:pointer; border-color:var(--accent-neon); background:rgba(255,214,10,0.05)">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <span class="text-caption" style="color:var(--accent-neon)">CONTINUE READING</span>
                            <h2 class="text-title" style="font-size: 24px; margin-top: 4px;">JUZ ${state.bookmark.juz}</h2>
                        </div>
                        <div class="text-right">
                             <span class="text-mono text-dim" style="font-size:10px">${state.bookmark.key}</span>
                             <div class="text-small text-mono" style="color:var(--accent-neon); margin-top:4px;">${state.bookmark.surahName}</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            hBookmark.innerHTML = '';
        }
    }

    // Heatmap Updates
    const g = document.getElementById('heatmap-grid');
    if (g) {
        g.innerHTML = '';
        const now = new Date();
        for (let i = 0; i < 90; i++) {
            const d = new Date(); d.setDate(now.getDate() - (89 - i));
            const active = state.completions.some(c => new Date(c.timestamp).toDateString() === d.toDateString());
            const box = document.createElement('div');
            box.style.cssText = `aspect-ratio:1; border-radius:3px; background:${active ? 'var(--accent-neon)' : 'rgba(255,255,255,0.05)'}; ${active ? 'box-shadow:0 0 5px rgba(255,214,10,0.4);' : ''}`;
            g.appendChild(box);
        }
    }

    // Activity Flow Updates (Targets all instances across pages)
    document.querySelectorAll('#activity-list').forEach(l => {
        l.innerHTML = state.completions.length ? '' : '<div class="text-dim" style="text-align:center; padding:12px;">NO ACTIVITY YET</div>';
        state.completions.slice(0, 5).forEach(c => {
            const row = document.createElement('div');
            row.className = 'card-stealth';
            row.style.cssText = 'padding:16px; display:flex; justify-content:space-between; margin-bottom:12px;';
            row.innerHTML = `<span>JUZ ${c.juz}</span><span class="text-mono text-dim" style="font-size:10px">${c.date}</span>`;
            l.appendChild(row);
        });
    });
}

async function updatePrayerUI() {
    const container = document.getElementById('prayer-widget-content');
    if (!container) return;
    const timings = await fetchPrayerTimes();
    if (!timings) return;
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    const list = [
        { n: 'FAJR', t: timings.Fajr }, { n: 'DHUHR', t: timings.Dhuhr },
        { n: 'ASR', t: timings.Asr }, { n: 'MAGHRIB', t: timings.Maghrib }, { n: 'ISHA', t: timings.Isha }
    ];
    let next = list.find(p => { const [h, m] = p.t.split(':').map(Number); return (h * 60 + m) > cur; }) || list[0];
    container.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <span class="text-caption" style="color:black">NEXT: ${next.n}</span>
            <h2 id="prayer-time-display" style="font-size: 32px; font-weight: 900; color:black; margin:0">${next.t}</h2>
        </div>
        <div style="display:flex; gap:8px; opacity:0.6; color:black; font-size:10px" class="text-mono">
            <span>PRAYER TIMES • ${getState().settings.city.toUpperCase()}</span>
        </div>
    `;
}

async function initReader(juzNum) {
    const list = document.getElementById('verses-list');
    if (!list) return;
    const shn = document.getElementById('surah-name');
    const shm = document.getElementById('surah-meta');
    list.innerHTML = '<div class="text-dim text-mono animate-pulse" style="text-align:center; padding:40px;">RETRIEVING AYATS...</div>';
    const data = await fetchJuzData(juzNum);
    if (!data) { list.innerHTML = '<div class="text-dim">CONNECTION ERROR</div>'; return; }
    const { verses, surahMap } = data;
    list.innerHTML = '';

    // Initial Header Update (with first verse)
    const firstSid = verses[0].verse_key.split(':')[0];
    const firstSurah = surahMap[firstSid];
    if (shn) shn.textContent = firstSurah.name_simple.toUpperCase();
    if (shm) shm.textContent = `${firstSurah.verses_count} VERSES • ${firstSurah.revelation_place.toUpperCase()}`;

    let lastSurahId = null;
    verses.forEach((v) => {
        const sid = v.verse_key.split(':')[0];
        const surah = surahMap[sid];
        if (sid !== lastSurahId) {
            const h = document.createElement('div');
            h.className = 'card-premium animate-fade-up';
            h.style.cssText = 'text-align:center; margin-top:40px; margin-bottom:24px; padding:32px; border-color:var(--accent-neon);';
            h.innerHTML = `<span class="text-caption" style="color:var(--accent-neon)">SURAH</span><h2 class="text-large-title" style="font-size: 28px; margin-top: 8px;">${surah.name_simple.toUpperCase()}</h2><p class="text-dim text-mono" style="margin-top: 12px; font-size:10px;">${surah.verses_count} VERSES • ${surah.revelation_place.toUpperCase()}</p>`;
            list.appendChild(h);
            lastSurahId = sid;
        }
        const div = document.createElement('div');
        div.className = 'verse-card';
        div.id = `v-${v.verse_key.replace(/:/g, '-')}`;
        div.innerHTML = `<span class="verse-number">${v.verse_key}</span><p class="arabic-text">${v.text_uthmani}</p>`;
        list.appendChild(div);
        new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                if (shn) shn.textContent = surah.name_simple.toUpperCase();
                if (shm) shm.textContent = `${surah.verses_count} VERSES • ${surah.revelation_place.toUpperCase()}`;
                const s = getState();
                if (s.bookmark.key !== v.verse_key) {
                    s.bookmark = { juz: juzNum, key: v.verse_key, surahName: surah.name_simple };
                    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(s));
                    // Update Home bookmark dynamically if it exists (state changed silently)
                    const hb = document.getElementById('home-bookmark');
                    if (hb) updateStatsUI();
                }
            }
        }, { threshold: 0.1 }).observe(div);
    });
    const s = getState();
    if (s.bookmark && s.bookmark.juz == juzNum) {
        const target = document.getElementById(`v-${s.bookmark.key.replace(/:/g, '-')}`);
        if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 600);
    }
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    const isHome = !!document.getElementById('juz-strip');
    const isReader = !!document.getElementById('verses-list');
    const isProgress = !!document.getElementById('heatmap-grid');
    const isProfile = !!document.getElementById('profile-name');

    const render = () => {
        const s = getState();
        updateStatsUI();

        if (isHome) {
            updatePrayerUI();
            const hGreeting = document.getElementById('home-greeting');
            if (hGreeting) hGreeting.textContent = `SALAAM, ${s.user.name.toUpperCase()}!`;

            const strip = document.getElementById('juz-strip');
            strip.innerHTML = '';
            for (let i = 1; i <= 30; i++) {
                const c = document.createElement('div');
                const done = s.completions.some(x => x.juz == i);
                c.className = `strip-card ${done ? 'active' : ''}`;
                if (done) { c.style.background = 'var(--accent-neon)'; c.style.color = '#000'; }
                c.textContent = i;
                c.onclick = () => window.location.href = `quran.html?juz=${i}`;
                strip.appendChild(c);
            }
        }

        if (isProfile) {
            const pn = document.getElementById('profile-name');
            if (pn) pn.textContent = s.user.isLoggedIn ? s.user.name.toUpperCase() : 'APP GUEST';
            const authBtn = document.getElementById('auth-toggle');
            if (authBtn) authBtn.textContent = s.user.isLoggedIn ? 'LOGOUT' : 'LOGIN';
        }
    };

    render();
    window.addEventListener('statechange', render);
    window.addEventListener('storage', (e) => {
        if (e.key === APP_STORAGE_KEY) {
            console.log('Syncing across tabs...');
            render();
        }
    });

    if (isHome) {
        const ab = document.getElementById('add-completion');
        const mc = document.getElementById('modal-container');
        if (ab && mc) {
            ab.onclick = () => {
                const g = document.getElementById('juz-grid');
                if (!g) return;
                const { completions } = getState();
                const todayStr = new Date().toDateString();
                g.innerHTML = '';
                for (let i = 1; i <= 30; i++) {
                    const b = document.createElement('div');
                    // Check if completed TODAY
                    const markedToday = completions.some(x => x.juz == i && new Date(x.timestamp).toDateString() === todayStr);
                    b.className = `strip-card`;
                    if (markedToday) {
                        b.style.background = 'var(--accent-neon)';
                        b.style.color = '#000';
                        b.style.boxShadow = 'var(--shadow-neon-glow)';
                    }
                    b.textContent = i;
                    b.onclick = () => {
                        if (markedToday) unmarkJuz(i);
                        else markJuzComplete(i);
                        mc.style.display = 'none';
                    };
                    g.appendChild(b);
                }
                mc.style.display = 'flex';
            };
            const cm = document.getElementById('close-modal');
            if (cm) cm.onclick = () => mc.style.display = 'none';
        }
        const sb = document.getElementById('share-btn');
        const sm = document.getElementById('share-modal');
        if (sb && sm) {
            sb.onclick = () => {
                const s = getState();
                const m = sm.querySelector('.text-dim, .text-mono');
                if (m) m.textContent = `STREAK: ${s.stats.streak} DAYS • TOTAL: ${s.completions.length}`;
                sm.style.display = 'flex';
            };
            const cs = document.getElementById('close-share');
            if (cs) cs.onclick = () => sm.style.display = 'none';
            const si = document.getElementById('save-image');
            if (si) si.onclick = () => showToast('GENERATING IMAGE...');
        }
    }

    if (isReader) {
        const juz = new URLSearchParams(window.location.search).get('juz') || 1;
        const cjn = document.getElementById('current-juz-num');
        if (cjn) cjn.textContent = juz;
        initReader(juz);

        const kb = document.querySelector('button.card-neon');
        if (kb) kb.onclick = () => { markJuzComplete(juz); setTimeout(() => window.location.href = 'index.html', 1500); };

        const inc = document.getElementById('font-increase');
        const dec = document.getElementById('font-decrease');
        let fs = 32;
        if (inc) inc.onclick = () => { fs += 4; document.querySelectorAll('.arabic-text').forEach(t => t.style.fontSize = fs + 'px'); };
        if (dec) dec.onclick = () => { fs = Math.max(20, fs - 4); document.querySelectorAll('.arabic-text').forEach(t => t.style.fontSize = fs + 'px'); };

        const sel = document.getElementById('juz-selector-btn');
        const sidebar = document.getElementById('juz-sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sel && sidebar && overlay) {
            sel.onclick = (e) => {
                e.stopPropagation();
                const jg = document.getElementById('sidebar-grid');
                if (!jg) return;
                jg.innerHTML = '';
                const { completions } = getState();
                for (let i = 1; i <= 30; i++) {
                    const b = document.createElement('div');
                    const done = completions.some(x => x.juz == i);
                    b.className = `strip-card`;
                    if (done) { b.style.background = 'var(--accent-neon)'; b.style.color = '#000'; }
                    b.textContent = i;
                    b.onclick = (ev) => {
                        ev.stopPropagation();
                        window.location.href = `quran.html?juz=${i}`;
                    };
                    jg.appendChild(b);
                }
                overlay.style.display = 'block';
                setTimeout(() => { sidebar.style.transform = 'translateX(320px)'; }, 10);
                document.body.style.overflow = 'hidden';
            };

            const closeSidebar = () => {
                sidebar.style.transform = 'translateX(0)';
                setTimeout(() => {
                    overlay.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 400);
            };

            const cp = document.getElementById('close-sidebar');
            if (cp) cp.onclick = (e) => { e.stopPropagation(); closeSidebar(); };
            overlay.onclick = (e) => { e.stopPropagation(); closeSidebar(); };
        }
    }

    if (isProfile) {
        const sc = document.querySelector('section.card-stealth');
        if (sc && !document.getElementById('auth-row')) {
            const r = document.createElement('div');
            r.id = 'auth-row'; r.className = 'setting-row'; r.style.borderTop = '1px solid var(--border-glass)'; r.style.marginTop = '16px';
            r.innerHTML = `<span class="text-headline" style="font-size: 15px;">ACCOUNT</span><button id="auth-toggle" class="btn-glass" style="height:32px; padding:0 16px; font-size:10px;">AUTH</button>`;
            sc.appendChild(r);
            document.getElementById('auth-toggle').onclick = () => {
                const st = getState();
                st.user.isLoggedIn = !st.user.isLoggedIn;
                if (st.user.isLoggedIn) st.user.name = 'BINTANG';
                else st.user.name = 'Guest';
                saveState(st);
                showToast(st.user.isLoggedIn ? 'LOGGED IN!' : 'LOGGED OUT');
            };

            const resetRow = document.createElement('div');
            resetRow.className = 'setting-row';
            resetRow.style.marginTop = '16px';
            resetRow.innerHTML = `<span class="text-headline" style="font-size: 15px; color: #ff4444;">DANGER ZONE</span><button id="reset-data" class="btn-glass" style="height:32px; padding:0 16px; font-size:10px; border-color: #ff4444; color: #ff4444;">RESET ALL</button>`;
            sc.appendChild(resetRow);
            document.getElementById('reset-data').onclick = resetState;
        }
        render(); // Initial render to populate login state
        document.querySelectorAll('.toggle').forEach(t => t.onclick = () => t.classList.toggle('active'));
    }
});
