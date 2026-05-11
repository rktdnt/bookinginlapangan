import { query } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(request) {
  try {
    const { userType, email, password, ...data } = await request.json();

    if (userType === 'mitra') {
      await query(
        "INSERT INTO mitra (nama_mitra, email, password, no_hp, alamat) VALUES (?, ?, ?, ?, ?)",
        [data.nama_mitra, email, hashPassword(password), data.no_hp, data.alamat]
      );
    } else if (userType === 'pelanggan') {
      await query(
        "INSERT INTO pelanggan (nama, email, password, no_hp, alamat) VALUES (?, ?, ?, ?, ?)",
        [data.nama, email, hashPassword(password), data.no_hp, data.alamat]
      );
    } else if (userType === 'admin') {
      await query(
        "INSERT INTO admin (nama, email, password, no_hp) VALUES (?, ?, ?, ?)",
        [data.nama, email, hashPassword(password), data.no_hp]
      );
    }

    return Response.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    if (error.message.includes('Duplicate entry')) {
      return Response.json({ success: false, error: 'Email already exists' }, { status: 400 });
    }
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}
