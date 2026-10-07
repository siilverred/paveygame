# ⛈️ Beat the Storm — Booth Interactive Game (Pavey App)

**Beat the Storm** adalah game arcade 3-lane dodger interaktif berbasis browser yang dirancang khusus untuk showcase booth Capstone Pavey App. Game ini mendemonstrasikan integrasi fitur **Travel Itinerary Checkpoint** dan **Dynamic AI Weather Rerouting** secara seru!

---

## 🌟 Fitur Baru & Pembaruan
1. **Sistem Pengumpulan Poin Adil & Presisi (Fair Pickup Mechanics)**:
   - Posisi pengambilan item (koin, bintang, pin destinasi, dan hati) dihitung presisi berdasarkan koordinat fisik `(x, y)` masing-masing pemain.
   - Tidak ada lagi bug "vacuum" di mana Player 1 menyedot item sebelum mencapainya atau mencuri item lintas lajur.
   - Dilengkapi **Floating Feedback Popups** arcade (`+5`, `+15 BOOST!`, `+25 📍`, `+1 ❤️`, `-1 ❤️`) yang muncul langsung di atas karakter.
2. **Durasi Permainan Lebih Panjang & Tanpa Timer**:
   - Game berjalan berkelanjutan dan **hanya over jika nyawa salah satu pemain benar-benar habis (0 hearts)**.
   - **Item Pemulih Nyawa (❤️ Heart Collectible)**: Muncul di lajur kosong untuk memulihkan +1 Nyawa (kapasitas hingga 4 hati!).
   - Menyelesaikan rute liburan setiap harinya memberikan reward bonus +100 XP dan +1 Nyawa untuk pemain yang bertahan.
3. **AI Bot Pintar & Kompetitif**:
   - Algoritma dodging Bot diperbarui dengan deteksi ancaman nyata dan pemindaian lajur aman.
   - Bot tidak lagi bunuh diri menabrak rintangan, melainkan mampu bertahan dan bersaing ketat selama beberapa menit.
4. **Kota Tujuan Wisata Asli Indonesia (Lengkap 3 Hari / Multi-Day Itinerary)**:
   - **🏰 Medan**: Hari 1 (Istana Maimun, Kopi Apek, Masjid Raya Al-Mashun, Bihun Bebek Asie), Hari 2 (Danau Toba Viewpoint, Tjong A Fie Mansion, Macehat Coffee, Merdeka Walk), Hari 3 (Graha Maria Annai Velangkanni, Rahmat Wildlife Museum, Bolu Meranti, Ucok Durian).
   - **🏙️ Jakarta**: Hari 1 (Monas, Cafe Batavia, Museum MACAN, Bundaran HI), Hari 2 (TMII, Tanamera Coffee, Grand Indonesia Skybridge, Pasar Santa), Hari 3 (Pantai Pasir Putih PIK 2, Museum Fatahillah, Sarinah Sky Terrace, Pecinan Glodok).
   - **🍃 Bandung**: Hari 1 (Gedung Sate, Kopi Toko Djawa, Tahura Djuanda, Jalan Riau), Hari 2 (Kawah Putih Ciwidey, Armor Kopi, Kebun Teh Rancabali, Paskal Food Market), Hari 3 (Tebing Keraton, NuArt Sculpture Park, Sudirman Street Bazaar, Ranca Upas Deer Sanctuary).
5. **Karakter Maskot TinTin 100% Identik**:
   - Player 1, Player 2, dan Bot menggunakan **aset gambar resmi TinTin (`/mascot.svg`)** yang sama persis dalam bentuk dan ekspresi, hanya dibedakan melalui filter warna dinamis:
     - **Player 1**: TinTin Biru Asli Pavey (`#3B5BFF`)
     - **Player 2**: TinTin Coral Oranye (`#F97316`)
     - **AI Bot**: TinTin Hijau Emerald (`#10B981`)
6. **3 Mode Permainan**:
   - **Solo Itinerary**: Menyelesaikan hari liburan dan mencetak rekor skor tertinggi.
   - **Vs AI Bot**: Balapan mengumpulkan destinasi wisata melawan TinTin AI pintar.
   - **1 vs 1 Teman**: Dua pemain tanding langsung dalam 1 layar di 3 jalur yang sama!
7. **Tema Terang / Light Theme Pavey**:
   - Tampilan bersih, cerah, dan 100% selaras dengan design system Pavey App frontend.
8. **Direct Link Pavey App**:
   - Tautan langsung ke live web app: [https://frontend-sage-ten-29.vercel.app/](https://frontend-sage-ten-29.vercel.app/)

---

## 🕹️ Skema Kontrol

| Pemain | Kontrol Keyboard | Kontrol Layar Sentuh |
| :--- | :--- | :--- |
| **Player 1 (TinTin Biru)** | **`W`** / **`S`** atau `Arrow Up/Down` (pada Solo & Vs Bot) | Tombol `P1 ATAS` / `P1 BAWAH` |
| **Player 2 (TinTin Coral)** | **`Arrow Up/Down`**, **`I`** / **`K`**, atau **`PageUp/Down`** | Tombol `P2 ATAS` / `P2 BAWAH` |
| **Demonstrator Secret Key** | **`[B]`** (Picu badai AI secara instan) | Tombol `AI Storm [B]` |
| **Mulai / Restart** | **`Spacebar`** / **`R`** | Tombol Mulai di layar |

---

## 🚀 Cara Menjalankan Game
```bash
cd D:\PaveyApp\game
npm run dev
```
Buka browser di: **[http://localhost:5174](http://localhost:5174)** (atau **[http://localhost:5175](http://localhost:5175)**).
