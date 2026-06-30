# 🏟️ Booking Lapangan

Aplikasi web untuk pemesanan lapangan olahraga (futsal, badminton, dll) secara online. Dibangun dengan **Next.js** dan **MongoDB**.

---

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Teknologi](#-teknologi)
- [Prasyarat](#-prasyarat)
- [Instalasi](#-instalasi)
- [Konfigurasi MongoDB](#-konfigurasi-mongodb)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Halaman Utama](#-halaman-utama)
- [API Endpoints](#-api-endpoints)
- [Struktur Folder](#-struktur-folder)
- [Akun Default (Setelah Seed)](#-akun-default-setelah-seed)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Fitur

| Pengguna | Fitur |
|---|---|
| 👤 **Pelanggan** | Lihat lapangan, booking, bayar, beri ulasan |
| 🤝 **Mitra (Pemilik Lapangan)** | Daftarkan lapangan, kelola harga & jadwal |
| 🔑 **Admin** | Kelola semua data, verifikasi pembayaran, broadcast notifikasi |

---

## 🛠️ Teknologi

- **[Next.js 16](https://nextjs.org/)** — Framework React untuk web fullstack
- **[MongoDB](https://www.mongodb.com/)** — Database NoSQL
- **[TypeScript](https://www.typescriptlang.org/)** — JavaScript dengan type checking
- **[Tailwind CSS](https://tailwindcss.com/)** — Framework CSS utility-first

---

## 📦 Prasyarat

Pastikan sudah terinstall di komputer kamu:

1. **Node.js** versi 18 ke atas → [Download di nodejs.org](https://nodejs.org/)
2. **MongoDB** → pilih salah satu:
   - **Lokal**: [Download MongoDB Community](https://www.mongodb.com/try/download/community) (gratis, jalankan di laptop)
   - **Cloud (Atlas)**: [Daftar gratis di mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register) (lebih mudah, tidak perlu install)
3. **Git** → [Download di git-scm.com](https://git-scm.com/)

---

## 🚀 Instalasi

### Langkah 1 — Clone repositori

```bash
git clone https://github.com/rktdnt/bookinginlapangan.git
cd bookinginlapangan
```

### Langkah 2 — Install dependencies

```bash
npm install
```

> ⏳ Tunggu beberapa menit sampai selesai. Proses ini mengunduh semua library yang dibutuhkan.

---

## 🗄️ Konfigurasi MongoDB

### Opsi A: MongoDB Lokal (di laptop sendiri)

1. Install dan jalankan MongoDB Community di laptop kamu
2. Buat file **`.env.local`** di folder utama proyek (sudah ada template-nya):

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=bookinginlapangan
```

### Opsi B: MongoDB Atlas (cloud, rekomendasi untuk pemula)

1. Daftar akun gratis di [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register)
2. Buat cluster baru (pilih yang **FREE / M0**)
3. Klik **Connect** → **Drivers** → salin connection string-nya
4. Buat file **`.env.local`** dan isi:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/
MONGODB_DATABASE=bookinginlapangan
```

> ⚠️ Ganti `USERNAME` dan `PASSWORD` dengan kredensial MongoDB Atlas kamu.
> Jangan lupa whitelist IP kamu di **Network Access** di Atlas.

---

## ▶️ Menjalankan Aplikasi

### Langkah 1 — Buat indexes database

```bash
npm run db:init
```

Output yang benar:
```
Connected to MongoDB at mongodb://localhost:27017
Using database: bookinginlapangan
- index: users.email (unique)
- index: sessions.token_hash (unique)
...
MongoDB indexes created successfully.
```

### Langkah 2 — Isi data awal (seed)

```bash
npm run db:seed
```

Output yang benar:
```
- seeded: admin
- seeded: mitra
- seeded: pelanggan
- seeded: lapangan (2 records)
- seeded: venues (3 records)
- seeded: users
Seed completed successfully.
```

### Langkah 3 — Jalankan server development

```bash
npm run dev
```

Buka browser dan akses: **[http://localhost:3000](http://localhost:3000)**

---

## 🌐 Halaman Utama

| URL | Keterangan |
|---|---|
| `http://localhost:3000` | Halaman utama |
| `http://localhost:3000/login` | Halaman login |
| `http://localhost:3000/register` | Halaman daftar akun baru |
| `http://localhost:3000/customer-landing` | Daftar lapangan untuk pelanggan |
| `http://localhost:3000/customer-dashboard` | Dashboard pelanggan (riwayat booking) |
| `http://localhost:3000/admin-dashboard` | Panel admin |
| `http://localhost:3000/venues` | Daftar venue |
| `http://localhost:3000/api/debug/db` | Cek koneksi database ✅ |

---

## 📡 API Endpoints

Semua endpoint mengembalikan JSON. Contoh response sukses:
```json
{ "success": true, "data": [...] }
```

### 🔐 Autentikasi

| Method | URL | Keterangan |
|---|---|---|
| `POST` | `/api/auth/register` | Daftar akun user baru |
| `POST` | `/api/auth/login` | Login user |
| `POST` | `/api/auth/logout` | Logout |
| `GET` | `/api/auth/me` | Info user yang sedang login |
| `POST` | `/api/auth/register-v2` | Daftar sebagai admin/mitra/pelanggan |
| `POST` | `/api/auth/login-v2` | Login admin/mitra/pelanggan |

### 🏟️ Lapangan & Venue

| Method | URL | Keterangan |
|---|---|---|
| `GET` | `/api/venues` | Daftar semua venue |
| `POST` | `/api/venues` | Tambah venue baru (form-data) |
| `PUT` | `/api/venues/:id` | Update venue |
| `DELETE` | `/api/venues/:id` | Hapus venue (soft delete) |
| `GET` | `/api/lapangan` | Daftar lapangan (sistem lama) |
| `POST` | `/api/lapangan` | Tambah lapangan |
| `GET/PUT/DELETE` | `/api/lapangan/:id` | CRUD lapangan by ID |

### 📅 Booking & Order

| Method | URL | Keterangan |
|---|---|---|
| `GET` | `/api/bookings` | Riwayat booking user yang login |
| `POST` | `/api/bookings` | Buat booking baru |
| `GET` | `/api/orders` | Semua orders |
| `POST` | `/api/orders` | Buat order baru |
| `GET/PUT/DELETE` | `/api/orders/:id` | CRUD order by ID |

### 💳 Pembayaran

| Method | URL | Keterangan |
|---|---|---|
| `POST` | `/api/payment/confirm` | Konfirmasi pembayaran (QRIS / transfer) |
| `GET` | `/api/pembayaran` | Daftar semua pembayaran |
| `POST` | `/api/pembayaran` | Buat record pembayaran |
| `GET/PUT/DELETE` | `/api/pembayaran/:id` | CRUD pembayaran by ID |

### 👥 Manajemen User

| Method | URL | Keterangan |
|---|---|---|
| `GET/POST` | `/api/admin` | Daftar / tambah admin |
| `GET/PUT/DELETE` | `/api/admin/:id` | CRUD admin by ID |
| `GET/POST` | `/api/mitra` | Daftar / tambah mitra |
| `GET/PUT/DELETE` | `/api/mitra/:id` | CRUD mitra by ID |
| `GET/POST` | `/api/pelanggan` | Daftar / tambah pelanggan |
| `GET/PUT/DELETE` | `/api/pelanggan/:id` | CRUD pelanggan by ID |

### ⭐ Review, Riwayat, Broadcast, CS

| Method | URL | Keterangan |
|---|---|---|
| `GET/POST` | `/api/review` | Daftar / tambah review |
| `GET/PUT/DELETE` | `/api/review/:id` | CRUD review |
| `GET/POST` | `/api/riwayat` | Riwayat selesai |
| `GET/POST` | `/api/broadcast` | Pesan siaran dari admin |
| `GET/POST` | `/api/customer_service` | Tiket customer service |

---

## 📁 Struktur Folder

```
bookinginlapangan/
│
├── app/                        ← Halaman & API Routes (Next.js App Router)
│   ├── api/                    ← Semua backend API
│   │   ├── auth/               ← Login, register, logout, me
│   │   ├── bookings/           ← Booking baru & riwayat
│   │   ├── venues/             ← CRUD venue
│   │   ├── orders/             ← CRUD orders
│   │   ├── pembayaran/         ← CRUD pembayaran
│   │   ├── lapangan/           ← CRUD lapangan
│   │   ├── mitra/              ← CRUD mitra
│   │   ├── pelanggan/          ← CRUD pelanggan
│   │   ├── admin/              ← CRUD admin & kelola booking
│   │   ├── review/             ← CRUD review
│   │   ├── riwayat/            ← CRUD riwayat
│   │   ├── broadcast/          ← CRUD broadcast
│   │   ├── customer_service/   ← CRUD tiket CS
│   │   ├── payment/confirm/    ← Konfirmasi pembayaran
│   │   └── debug/db/           ← Cek koneksi database
│   │
│   ├── admin-dashboard/        ← Halaman dashboard admin
│   ├── customer-landing/       ← Halaman daftar lapangan
│   ├── customer-dashboard/     ← Halaman dashboard pelanggan
│   ├── login/                  ← Halaman login
│   ├── register/               ← Halaman register
│   ├── venues/                 ← Halaman daftar venue
│   └── payment/                ← Halaman pembayaran
│
├── lib/                        ← Kode utility / helper
│   ├── db.js                   ← Koneksi MongoDB (getCollection, getDb, dll)
│   ├── db-operations.ts        ← Helper CRUD untuk semua collection
│   ├── auth.js                 ← Password hashing, session token
│   └── utils.ts                ← Format uang, tanggal, validasi
│
├── scripts/                    ← Script setup database
│   ├── init-db.js              ← Buat indexes MongoDB
│   └── seed-db.js              ← Isi data awal
│
├── db/migrations/              ← File SQL lama (referensi historis)
├── public/                     ← File statis (gambar, dll)
├── .env.local                  ← Konfigurasi (MONGODB_URI, dll) ← JANGAN di-commit!
└── package.json                ← Daftar dependencies & scripts
```

---

## 🔑 Akun Default (Setelah Seed)

Setelah menjalankan `npm run db:seed`, tersedia akun-akun berikut:

| Role | Email | Password |
|---|---|---|
| 🔑 Admin | `admin@bookinginlapangan.com` | `admin123` |
| 🤝 Mitra | `mitra@example.com` | `mitra123` |
| 👤 Pelanggan | `pelanggan@example.com` | `pelanggan123` |
| 👤 User (baru) | `user@example.com` | `user123456` |

> ⚠️ Ganti password ini setelah deploy ke production!

---

## 🔧 Troubleshooting

### ❌ Error: "Cannot connect to MongoDB"

**Penyebab**: MongoDB belum berjalan atau URI salah.

**Solusi**:
1. Pastikan MongoDB service berjalan (lokal) atau connection string Atlas benar
2. Cek file `.env.local` sudah ada dan isinya benar
3. Buka `http://localhost:3000/api/debug/db` — jika `canConnect: false`, berarti koneksi gagal
4. Untuk Atlas: pastikan IP kamu sudah di-whitelist di **Network Access**

---

### ❌ Error: "Module not found: mongodb"

**Solusi**:
```bash
npm install
```

---

### ❌ Port 3000 sudah dipakai

**Solusi**: Jalankan di port lain:
```bash
npm run dev -- -p 3001
```
Lalu buka `http://localhost:3001`

---

### ❌ Data tidak muncul di halaman

**Kemungkinan penyebab**: Seed belum dijalankan.

**Solusi**:
```bash
npm run db:seed
```

---

### ✅ Cek Status Koneksi Database

Buka URL ini di browser:
```
http://localhost:3000/api/debug/db
```

Jika berhasil, responnya:
```json
{ "envPresent": true, "canConnect": true, "driver": "mongodb" }
```

---

## 📜 Scripts yang Tersedia

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Jalankan server development (hot reload) |
| `npm run build` | Build untuk production |
| `npm run start` | Jalankan hasil build production |
| `npm run db:init` | Buat indexes di MongoDB |
| `npm run db:seed` | Isi data awal ke database |

---

## 🔐 Keamanan

- ✅ Password di-hash dengan **PBKDF2** (120.000 iterasi) — sangat aman
- ✅ Session token di-hash sebelum disimpan di database
- ✅ Session otomatis expired setelah 7 hari
- ✅ Input divalidasi di semua API endpoint
- ✅ File `.env.local` tidak ikut ter-commit ke Git

---

## 🤝 Kontribusi

1. Fork repositori ini
2. Buat branch baru: `git checkout -b fitur-saya`
3. Commit perubahan: `git commit -m "Tambah fitur X"`
4. Push: `git push origin fitur-saya`
5. Buat Pull Request

---

*Dibuat dengan ❤️ menggunakan Next.js + MongoDB*
