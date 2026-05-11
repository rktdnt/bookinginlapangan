"use client";

import { useEffect, useState } from "react";

type Venue = {
  id: string;
  name: string;
  image: string;
  price: number;
  location: string;
  description?: string;
  facilities?: string[];
  details?: Record<string, any>;
};

export default function VenueManagement() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [editingVenueId, setEditingVenueId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [facilitiesText, setFacilitiesText] = useState("");
  const [detailsText, setDetailsText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVenues();
  }, []);

  async function loadVenues() {
    try {
      const response = await fetch("/api/venues");
      const data = await response.json();
      setVenues(Array.isArray(data) ? data : []);
    } catch {
      setVenues([]);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("location", location);
      formData.append("description", description);
      formData.append("facilities", facilitiesText);
      formData.append("details", detailsText);
      if (image) formData.append("image", image);

      const response = await fetch(editingVenueId ? `/api/venues/${editingVenueId}` : "/api/venues", {
        method: editingVenueId ? "PUT" : "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || (editingVenueId ? "Gagal memperbarui venue" : "Gagal menambahkan venue"));
      }

      setName("");
      setPrice("");
      setLocation("");
      setDescription("");
      setImage(null);
      setEditingVenueId(null);
      await loadVenues();
    } catch (submitError: any) {
      setError(submitError?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(venue: Venue) {
    setEditingVenueId(venue.id);
    setName(venue.name);
    setPrice(String(venue.price || ""));
    setLocation(venue.location);
    setDescription(venue.description || "");
    setFacilitiesText(Array.isArray(venue.facilities) ? venue.facilities.join(", ") : "");
    setDetailsText(venue.details ? JSON.stringify(venue.details) : "");
    setImage(null);
    setError(null);
  }

  async function handleDelete(venueId: string) {
    if (!confirm("Hapus venue ini?")) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/venues/${venueId}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Gagal menghapus venue");
      }

      if (editingVenueId === venueId) {
        setEditingVenueId(null);
        setName("");
        setPrice("");
        setLocation("");
        setDescription("");
        setImage(null);
      }

      await loadVenues();
    } catch (deleteError: any) {
      setError(deleteError?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">Venue Management</p>
          <h2 className="mt-2 text-2xl font-black text-[var(--foreground)]">{editingVenueId ? "Edit venue" : "Tambah venue baru"}</h2>
          <p className="mt-1 text-sm text-zinc-600">Admin bisa menambahkan lapangan sekaligus upload gambar lapangan.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-[var(--foreground)]">Nama Venue</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]" placeholder="Contoh: Lapangan B" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--foreground)]">Harga per Jam</label>
            <input value={price} onChange={(e) => setPrice(e.target.value)} required type="number" min="0" className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]" placeholder="120000" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--foreground)]">Lokasi</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} required className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]" placeholder="Jakarta Selatan" />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-[var(--foreground)]">Deskripsi</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]" placeholder="Jelaskan fasilitas venue" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--foreground)]">Fasilitas (pisahkan dengan koma)</label>
            <input value={facilitiesText} onChange={(e) => setFacilitiesText(e.target.value)} className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]" placeholder="Contoh: Pencahayaan, Kamar Mandi, Parkir" />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-[var(--foreground)]">Detail (JSON, optional)</label>
            <textarea value={detailsText} onChange={(e) => setDetailsText(e.target.value)} rows={3} className="w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]" placeholder='Contoh: {"size":"40x20","type":"Sintetis","hours":"06:00-22:00"}' />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-[var(--foreground)]">Gambar Lapangan</label>
            <input onChange={(e) => setImage(e.target.files?.[0] ?? null)} required type="file" accept="image/*" className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm" />
          </div>

          {error ? (
            <div className="md:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="md:col-span-2 flex items-center gap-3">
            <button type="submit" disabled={loading} className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Menyimpan..." : editingVenueId ? "Simpan Perubahan" : "Tambah Venue"}
            </button>
            {editingVenueId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingVenueId(null);
                  setName("");
                  setPrice("");
                  setLocation("");
                  setDescription("");
                  setImage(null);
                  setError(null);
                }}
                className="rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-zinc-50"
              >
                Batal
              </button>
            ) : null}
            <span className="text-sm text-zinc-500">File akan disimpan ke folder upload lokal.</span>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-zinc-200 px-6 py-4">
          <h3 className="text-lg font-bold text-[var(--foreground)]">Daftar Venue</h3>
          <p className="mt-1 text-xs text-zinc-600">Venue yang tersimpan di sistem</p>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <article key={venue.id} className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
              <img src={venue.image} alt={venue.name} className="h-40 w-full object-cover" />
              <div className="space-y-2 p-4">
                <h4 className="font-bold text-[var(--foreground)]">{venue.name}</h4>
                <p className="text-sm text-zinc-600">{venue.location}</p>
                <p className="text-sm font-semibold text-[var(--primary)]">Rp {Number(venue.price || 0).toLocaleString("id-ID")}</p>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => startEdit(venue)}
                    className="rounded-full border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] transition hover:bg-white"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(venue.id)}
                    className="rounded-full bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </article>
          ))}
          {venues.length === 0 ? <p className="text-sm text-zinc-500">Belum ada venue.</p> : null}
        </div>
      </div>
    </div>
  );
}