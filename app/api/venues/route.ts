import { NextResponse } from "next/server";

const sample = [
  { id: "1", name: "Lapangan A", image: "/images/field1.svg", price: 150000, location: "Jakarta Utara", description: "Lapangan sintetis ukuran standar." },
  { id: "2", name: "Lapangan B", image: "/images/field2.svg", price: 120000, location: "Jakarta Selatan", description: "Lapangan futsal nyaman dengan tribun." },
  { id: "3", name: "Lapangan C", image: "/images/field3.svg", price: 100000, location: "Depok", description: "Lapangan rumput alami." },
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (id) {
    const found = sample.find((s) => s.id === id);
    return NextResponse.json(found || null);
  }
  return NextResponse.json(sample);
}
