# Setup Firebase (Realtime Produk & Ulasan)

Toko ini sekarang bisa jalan dalam 2 mode:

- **Tanpa Firebase** (default kalau `.env` belum diisi): tetap jalan seperti
  sebelumnya, data produk/kategori disimpan di localStorage, dan ulasan pakai
  data dummy fallback. Realtime lintas-device TIDAK aktif di mode ini.
- **Dengan Firebase**: produk, kategori, dan ulasan realtime lintas semua
  user/device lewat Firestore. Begitu admin tambah produk, semua orang yang
  sedang buka web langsung lihat produk itu muncul tanpa refresh. Begitu juga
  ulasan baru.

## 1. Buat project Firebase

1. Buka https://console.firebase.google.com → **Add project** → ikuti wizard.
2. Di dashboard project, klik ikon **Web (`</>`)** untuk menambahkan web app.
3. Beri nama app (bebas), lalu Firebase akan menampilkan objek `firebaseConfig`.

## 2. Aktifkan Firestore & Anonymous Auth

1. Menu kiri → **Build → Firestore Database** → **Create database** → pilih
   mode "production" → pilih region terdekat (mis. `asia-southeast2` Jakarta).
2. Menu kiri → **Build → Authentication** → tab **Sign-in method** → aktifkan
   **Anonymous**. (Ini dipakai supaya Firestore Security Rules bisa
   mewajibkan `request.auth != null` saat menulis, tanpa mengubah sistem
   login username/password toko yang sudah ada.)
3. Di tab **Rules** pada Firestore, tempel isi file `firestore.rules` yang
   ada di root project ini, lalu **Publish**.

## 3. Isi kredensial ke project

1. Salin `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
2. Isi setiap `VITE_FIREBASE_...` dengan nilai dari `firebaseConfig` yang
   didapat di langkah 1.
3. Install dependency baru lalu jalankan seperti biasa:
   ```bash
   npm install
   npm run dev
   ```

Begitu `.env` terisi dan valid, `DataContext` otomatis mendeteksi Firebase
aktif (`firebaseEnabled`) dan:
- Men-seed Firestore dengan data produk/kategori bawaan **satu kali** kalau
  koleksinya masih kosong.
- Berlangganan (`onSnapshot`) ke koleksi `products`, `categories`, dan
  `reviews`, jadi semua perubahan langsung tersinkron realtime ke semua
  klien yang terbuka.

## 4. Catatan penting

- **Foto produk**: form admin masih menyimpan foto sebagai base64 kalau kamu
  upload file dari komputer. Firestore membatasi 1 dokumen maksimal ~1MB,
  jadi untuk foto yang agak besar, **lebih aman tempel URL gambar** (kolom
  "Atau tempel URL gambar" di form produk) daripada upload file langsung.
  Kalau mau upload file besar dengan aman, langkah lanjutannya adalah
  menyambungkan **Firebase Storage** — belum termasuk di update ini.
- **Keamanan admin**: karena login admin masih pakai sistem kustom
  (localStorage, bukan Firebase Auth), rules di `firestore.rules` baru bisa
  membedakan "tamu (read-only)" vs "siapapun yang sudah anonymous-auth
  (boleh tulis)" — belum bisa membedakan admin vs user biasa di level
  Firestore. Untuk toko kecil ini cukup aman, tapi kalau butuh proteksi
  lebih ketat, langkah berikutnya adalah memigrasikan login admin ke
  Firebase Auth + custom claims.
- Kalau `.env` **tidak** diisi, semuanya tetap berjalan seperti sebelumnya
  (localStorage), jadi tidak ada resiko kalau kamu belum sempat setup
  Firebase sekarang.
