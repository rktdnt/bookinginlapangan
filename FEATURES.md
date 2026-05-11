# Booking Lapangan - Complete Feature Documentation

## 📋 Overview

Booking Lapangan is a comprehensive sports field booking system built with Next.js and MySQL. It supports multiple user types: Admins, Mitra (Venue Partners), and Pelanggan (Customers).

## 🗄️ Database Schema

### Tables

1. **admin** - Administrator accounts
   - id_admin (INT, Primary Key)
   - nama, email, password, no_hp
   - Timestamps for audit

2. **mitra** - Venue owners/partners
   - id_mitra (INT, Primary Key)
   - nama_mitra, alamat, no_hp, email, password
   - status (active/inactive)

3. **pelanggan** - Customers
   - id_pelanggan (INT, Primary Key)
   - nama, email, password, no_hp, alamat

4. **lapangan** - Sports fields/courts
   - id_lapangan (INT, Primary Key)
   - id_mitra (Foreign Key)
   - nama_lapangan, jenis_olahraga, lokasi, harga
   - status_ketersediaan, deskripsi, foto

5. **orders** - Bookings
   - id_order (INT, Primary Key)
   - id_pelanggan, id_lapangan (Foreign Keys)
   - tanggal_pesan, jadwal_main, durasi, total_harga
   - status_order (pending/confirmed/completed/cancelled)

6. **pembayaran** - Payments
   - id_pembayaran (INT, Primary Key)
   - id_order (Foreign Key, Unique)
   - metode_pembayaran, tanggal_bayar, status_pembayaran
   - jumlah_bayar, bukti_pembayaran

7. **review** - Customer reviews
   - id_review (INT, Primary Key)
   - id_pelanggan, id_mitra (Foreign Keys)
   - rating (1-5), komentar, tanggal_review

8. **riwayat** - Booking history
   - id_riwayat (INT, Primary Key)
   - id_order (Foreign Key, Unique)
   - status_akhir, tanggal_selesai, catatan

9. **broadcast** - Admin broadcasts
   - id_broadcast (INT, Primary Key)
   - id_admin (Foreign Key)
   - judul, isi, tanggal_kirim, tipe_penerima

10. **customer_service** - Support tickets
    - id_cs (INT, Primary Key)
    - id_pelanggan, id_mitra (Foreign Keys)
    - pesan, tanggal, status_keluhan, respons_admin

## 🔌 API Endpoints

### Admin Management
- `GET /api/admin` - List all admins
- `POST /api/admin` - Create admin
- `GET /api/admin/[id]` - Get admin details
- `PUT /api/admin/[id]` - Update admin
- `DELETE /api/admin/[id]` - Delete admin

### Mitra Management
- `GET /api/mitra` - List all mitra
- `POST /api/mitra` - Create mitra
- `GET /api/mitra/[id]` - Get mitra details
- `PUT /api/mitra/[id]` - Update mitra
- `DELETE /api/mitra/[id]` - Delete mitra

### Pelanggan Management
- `GET /api/pelanggan` - List all pelanggan
- `POST /api/pelanggan` - Create pelanggan
- `GET /api/pelanggan/[id]` - Get pelanggan details
- `PUT /api/pelanggan/[id]` - Update pelanggan
- `DELETE /api/pelanggan/[id]` - Delete pelanggan

### Lapangan Management
- `GET /api/lapangan` - List all lapangan
- `POST /api/lapangan` - Create lapangan
- `GET /api/lapangan/[id]` - Get lapangan details
- `PUT /api/lapangan/[id]` - Update lapangan
- `DELETE /api/lapangan/[id]` - Delete lapangan

### Orders
- `GET /api/orders` - List all orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get order details
- `PUT /api/orders/[id]` - Update order status
- `DELETE /api/orders/[id]` - Delete order

### Payments
- `GET /api/pembayaran` - List all payments
- `POST /api/pembayaran` - Create payment
- `GET /api/pembayaran/[id]` - Get payment details
- `PUT /api/pembayaran/[id]` - Update payment
- `DELETE /api/pembayaran/[id]` - Delete payment

### Reviews
- `GET /api/review` - List all reviews
- `POST /api/review` - Create review
- `GET /api/review/[id]` - Get review details
- `PUT /api/review/[id]` - Update review
- `DELETE /api/review/[id]` - Delete review

### History (Riwayat)
- `GET /api/riwayat` - List all history
- `POST /api/riwayat` - Create history record
- `GET /api/riwayat/[id]` - Get history details
- `PUT /api/riwayat/[id]` - Update history
- `DELETE /api/riwayat/[id]` - Delete history

### Broadcast
- `GET /api/broadcast` - List all broadcasts
- `POST /api/broadcast` - Send broadcast
- `GET /api/broadcast/[id]` - Get broadcast details
- `PUT /api/broadcast/[id]` - Update broadcast
- `DELETE /api/broadcast/[id]` - Delete broadcast

### Customer Service
- `GET /api/customer_service` - List all tickets
- `POST /api/customer_service` - Create ticket
- `GET /api/customer_service/[id]` - Get ticket details
- `PUT /api/customer_service/[id]` - Respond to ticket
- `DELETE /api/customer_service/[id]` - Delete ticket

## 🎨 React Components

### Management Components

1. **AdminManagement** - Manage admin accounts
   - Add new admin
   - View all admins
   - Delete admin

2. **MitraManagement** - Manage venue partners
   - Register new mitra
   - View mitra details
   - Update mitra info
   - Manage status

3. **LapanganManagement** - Manage sports fields
   - Add new field
   - View all fields
   - Edit field details
   - Update availability status
   - Upload photos

4. **OrdersManagement** - Manage bookings
   - View all orders
   - Update order status
   - Track booking history

5. **PaymentManagement** - Manage payments
   - View payment records
   - Update payment status
   - Verify payment proof

6. **ReviewManagement** - Manage reviews
   - View customer reviews
   - Filter by rating
   - Moderate reviews

7. **BroadcastManagement** - Send messages
   - Create broadcasts
   - Select recipient type
   - Schedule messages

8. **CustomerServiceManagement** - Handle support
   - View support tickets
   - Respond to complaints
   - Track ticket status

## 📄 Pages

- `/admin-dashboard` - Main admin dashboard
- `/admin/management` - Admin management
- `/admin/mitra` - Mitra management
- `/admin/lapangan` - Lapangan management
- `/admin/orders` - Orders management
- `/admin/payment` - Payment management
- `/admin/review` - Review management
- `/admin/broadcast` - Broadcast management
- `/admin/customer-service` - Customer service management

## 🔐 Authentication

The system uses password hashing with PBKDF2:
- 120,000 iterations
- SHA-512 algorithm
- 16-byte random salt

### Supported User Types
1. Admin - Full system access
2. Mitra - Manage own fields and receive bookings
3. Pelanggan - Browse fields and make bookings

## 🛠️ Utilities

### DB Operations (`lib/db-operations.ts`)
- User creation and retrieval
- CRUD operations for all entities
- Email lookup functions

### Utils (`lib/utils.ts`)
- Currency formatting (Indonesian Rupiah)
- Date formatting
- Status color coding
- Email and phone validation
- Price calculation

## 🚀 Getting Started

### Installation

```bash
npm install
npm run db:create
npm run db:init
```

### Environment Variables

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=bookinginlapangan
```

### Running the Application

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📊 Features Summary

✅ Multi-user system (Admin, Mitra, Pelanggan)
✅ Complete CRUD operations for all entities
✅ Payment management
✅ Review system
✅ Customer support system
✅ Broadcasting system
✅ Order history tracking
✅ Responsive UI with Tailwind CSS
✅ Secure password hashing
✅ RESTful API endpoints

## 🔄 Data Relationships

```
Admin (1) ──> (Many) Broadcast
    
Mitra (1) ──> (Many) Lapangan
Mitra (1) ──> (Many) Review
Mitra (1) ──> (Many) Customer Service

Pelanggan (1) ──> (Many) Orders
Pelanggan (1) ──> (Many) Review
Pelanggan (1) ──> (Many) Customer Service

Lapangan (1) ──> (Many) Orders

Orders (1) ──> (One) Pembayaran
Orders (1) ──> (One) Riwayat
```

## 📝 Status Values

### Order Status
- pending: Waiting for confirmation
- confirmed: Approved by system
- completed: Booking finished
- cancelled: Cancelled by user

### Payment Status
- pending: Waiting for verification
- confirmed: Payment verified
- rejected: Payment failed

### Keluhan Status (Customer Service)
- open: New ticket
- closed: Resolved

### Mitra Status
- active: Currently operating
- inactive: Temporarily closed

---

**Version:** 1.0.0
**Last Updated:** May 2026
