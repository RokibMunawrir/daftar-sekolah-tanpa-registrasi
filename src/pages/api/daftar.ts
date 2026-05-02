import type { APIRoute } from 'astro';
import db from '../../db';
import { 
  santri, alamat, orangTua, pendaftaran, 
  pendidikanSebelumnya, bantuanSosial, prestasi, informasiPenunjang 
} from '../../db/schema';

/** Parse incoming request — supports both JSON and HTML form */
async function parseBody(request: Request): Promise<Record<string, string>> {
  const ct = request.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    return await request.json();
  }
  const fd = await request.formData();
  const out: Record<string, string> = {};
  fd.forEach((val, key) => { out[key] = String(val); });
  return out;
}

async function saveRegistration(data: Record<string, string>) {
  const santriId = crypto.randomUUID();

  await db.insert(santri).values({
    id: santriId,
    nisn: data.nisn || null,
    nik: data.nik,
    namaLengkap: data.namaLengkap,
    tempatLahir: data.tempatLahir,
    tanggalLahir: data.tanggalLahir as any,
    jenisKelamin: data.jenisKelamin as 'L' | 'P',
    hobi: data.hobi || null,
    citaCita: data.citaCita || null,
    anakKe: parseInt(data.anakKe) || 0,
    beratBadan: parseInt(data.beratBadan) || null,
    tinggiBadan: parseInt(data.tinggiBadan) || null,
    jumlahSaudaraKandung: parseInt(data.jumlahSaudaraKandung) || 0,
    jumlahSaudaraTiri: parseInt(data.jumlahSaudaraTiri) || 0,
    statusKondisiSantri: data.statusKondisiSantri || null,
  });

  await db.insert(pendaftaran).values({
    santriId,
    jenjangPendaftaran: data.jenjangPendaftaran,
    kategoriPendaftaran: data.kategoriPendaftaran,
    statusSantri: data.statusSantri,
  });

  await db.insert(alamat).values({
    santriId,
    alamatLengkap: data.alamatLengkap,
    provinsiId: data.provinsiNama || data.provinsiId || null,
    kabupatenId: data.kabupatenNama || data.kabupatenId || null,
    kecamatanId: data.kecamatanNama || data.kecamatanId || null,
    desaKelurahanId: data.desaNama || data.desaKelurahanId || null,
    rt: data.rt || null,
    rw: data.rw || null,
    kodepos: data.kodepos || null,
    nomorHpOrangTua: data.nomorHpOrangTua,
    emailOrangTua: data.emailOrangTua || null,
  });

  await db.insert(orangTua).values({
    santriId,
    tipe: 'AYAH',
    nama: data.namaAyah,
    nik: data.nikAyah || null,
    tempatLahir: data.tempatLahirAyah || null,
    tanggalLahir: (data.tanggalLahirAyah || null) as any,
    pendidikanId: data.pendidikanAyah || null,
    pekerjaanId: data.pekerjaanAyah || null,
    penghasilanId: data.penghasilanAyah || null,
    kewarganegaraan: (data.kewarganegaraanAyah as 'WNI' | 'WNA') || 'WNI',
  });

  await db.insert(orangTua).values({
    santriId,
    tipe: 'IBU',
    nama: data.namaIbu,
    nik: data.nikIbu || null,
    tempatLahir: data.tempatLahirIbu || null,
    tanggalLahir: (data.tanggalLahirIbu || null) as any,
    pendidikanId: data.pendidikanIbu || null,
    pekerjaanId: data.pekerjaanIbu || null,
    penghasilanId: data.penghasilanIbu || null,
    kewarganegaraan: (data.kewarganegaraanIbu as 'WNI' | 'WNA') || 'WNI',
  });

  if (data.namaWali) {
    await db.insert(orangTua).values({
      santriId,
      tipe: 'WALI',
      nama: data.namaWali,
      nik: data.nikWali || null,
      tempatLahir: data.tempatLahirWali || null,
      tanggalLahir: (data.tanggalLahirWali || null) as any,
      pendidikanId: null,
      pekerjaanId: null,
      penghasilanId: null,
      kewarganegaraan: (data.kewarganegaraanWali as 'WNI' | 'WNA') || 'WNI',
      hubunganWali: data.hubunganWali || null,
    });
  }

  await db.insert(pendidikanSebelumnya).values({
    santriId,
    npsnSekolahLama: data.npsnSekolahLama || null,
    nsmNss: data.nsmNss || null,
    dariKelas: data.dariKelas || null,
    namaSekolah: data.namaSekolah,
    noSkhun: data.noSkhun || null,
    noPesertaUjian: data.noPesertaUjian || null,
    rataRataNilaiUn: data.rataRataNilaiUn || null,
    noIjazah: data.noIjazah || null,
    tahunLulus: data.tahunLulus || null,
  });

  await db.insert(bantuanSosial).values({
    santriId,
    nomorKksKps: data.nomorKksKps || null,
    nomorPkh: data.nomorPkh || null,
    nomorKip: data.nomorKip || null,
    nomorBpjs: data.nomorBpjs || null,
  });

  if (data.cabangLomba) {
    await db.insert(prestasi).values({
      santriId,
      cabangLomba: data.cabangLomba,
      tingkatId: data.tingkatId || null,
      peringkatId: data.peringkatId || null,
      tahunLomba: data.tahunLomba || null,
    });
  }

  await db.insert(informasiPenunjang).values({
    santriId,
    organisasiMasyarakatId: data.organisasiMasyarakatId || null,
    programBeasiswaId: data.programBeasiswaId || null,
  });

  return santriId;
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const isHtmlForm = !request.headers.get('content-type')?.includes('application/json');

  try {
    const data = await parseBody(request);
    const santriId = await saveRegistration(data);

    if (isHtmlForm) {
      return redirect(`/daftar/sukses?nama=${encodeURIComponent(data.namaLengkap)}&jenjang=${encodeURIComponent(data.jenjangPendaftaran)}`, 303);
    }
    return new Response(JSON.stringify({ success: true, santriId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    if (isHtmlForm) {
      return redirect(`/daftar?error=${encodeURIComponent(error.message || 'Terjadi kesalahan')}`, 303);
    }
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
