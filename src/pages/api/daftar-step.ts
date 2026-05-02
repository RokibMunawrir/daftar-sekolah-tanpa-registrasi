import type { APIRoute } from 'astro';
import db from '../../db';
import {
  santri, alamat, orangTua, pendaftaran,
  pendidikanSebelumnya, bantuanSosial, prestasi, informasiPenunjang
} from '../../db/schema';

const TOTAL_STEPS = 6;
const COOKIE = 'ppdb_form';

function getSession(request: Request): Record<string, string> {
  try {
    const raw = request.headers.get('cookie')
      ?.split(';').find(c => c.trim().startsWith(COOKIE + '='))
      ?.split('=').slice(1).join('=');
    if (raw) return JSON.parse(decodeURIComponent(raw));
  } catch {}
  return {};
}

function setCookie(data: Record<string, string>): string {
  return `${COOKIE}=${encodeURIComponent(JSON.stringify(data))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`;
}

function clearCookie(): string {
  return `${COOKIE}=; Path=/; Max-Age=0`;
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const fd = await request.formData();
  const step = parseInt(fd.get('step') as string || '1');

  // Merge new fields into session
  const session = getSession(request);
  fd.forEach((val, key) => {
    if (key !== 'step') session[key] = String(val);
  });

  // Not final step → save to cookie and redirect to next step
  if (step < TOTAL_STEPS) {
    return new Response(null, {
      status: 303,
      headers: {
        Location: `/daftar?step=${step + 1}`,
        'Set-Cookie': setCookie(session),
      },
    });
  }

  // FINAL STEP → save everything to DB
  try {
    const d = session;
    const santriId = crypto.randomUUID();

    await db.insert(santri).values({
      id: santriId,
      nisn: d.nisn || null,
      nik: d.nik,
      namaLengkap: d.namaLengkap,
      tempatLahir: d.tempatLahir,
      tanggalLahir: d.tanggalLahir as any,
      jenisKelamin: d.jenisKelamin as 'L' | 'P',
      hobi: d.hobi || null,
      citaCita: d.citaCita || null,
      anakKe: parseInt(d.anakKe) || 0,
      beratBadan: parseInt(d.beratBadan) || null,
      tinggiBadan: parseInt(d.tinggiBadan) || null,
      jumlahSaudaraKandung: parseInt(d.jumlahSaudaraKandung) || 0,
      jumlahSaudaraTiri: parseInt(d.jumlahSaudaraTiri) || 0,
      statusKondisiSantri: d.statusKondisiSantri || null,
    });

    await db.insert(pendaftaran).values({
      santriId,
      jenjangPendaftaran: d.jenjangPendaftaran,
      kategoriPendaftaran: d.kategoriPendaftaran,
      statusSantri: d.statusSantri,
    });

    await db.insert(alamat).values({
      santriId,
      alamatLengkap: d.alamatLengkap,
      provinsiId: d.provinsiNama || null,
      kabupatenId: d.kabupatenNama || null,
      kecamatanId: d.kecamatanNama || null,
      desaKelurahanId: d.desaNama || null,
      rt: d.rt || null,
      rw: d.rw || null,
      kodepos: d.kodepos || null,
      nomorHpOrangTua: d.nomorHpOrangTua,
      emailOrangTua: d.emailOrangTua || null,
    });

    await db.insert(orangTua).values({
      santriId, tipe: 'AYAH',
      nama: d.namaAyah,
      nik: d.nikAyah || null,
      tempatLahir: d.tempatLahirAyah || null,
      tanggalLahir: (d.tanggalLahirAyah || null) as any,
      pendidikanId: d.pendidikanAyah || null,
      pekerjaanId: d.pekerjaanAyah || null,
      penghasilanId: d.penghasilanAyah || null,
      kewarganegaraan: (d.kewarganegaraanAyah as 'WNI' | 'WNA') || 'WNI',
    });

    await db.insert(orangTua).values({
      santriId, tipe: 'IBU',
      nama: d.namaIbu,
      nik: d.nikIbu || null,
      tempatLahir: d.tempatLahirIbu || null,
      tanggalLahir: (d.tanggalLahirIbu || null) as any,
      pendidikanId: d.pendidikanIbu || null,
      pekerjaanId: d.pekerjaanIbu || null,
      penghasilanId: d.penghasilanIbu || null,
      kewarganegaraan: (d.kewarganegaraanIbu as 'WNI' | 'WNA') || 'WNI',
    });

    if (d.namaWali) {
      await db.insert(orangTua).values({
        santriId, tipe: 'WALI',
        nama: d.namaWali,
        nik: d.nikWali || null,
        tempatLahir: d.tempatLahirWali || null,
        tanggalLahir: (d.tanggalLahirWali || null) as any,
        pendidikanId: null, pekerjaanId: null, penghasilanId: null,
        kewarganegaraan: (d.kewarganegaraanWali as 'WNI' | 'WNA') || 'WNI',
        hubunganWali: d.hubunganWali || null,
      });
    }

    await db.insert(pendidikanSebelumnya).values({
      santriId,
      npsnSekolahLama: d.npsnSekolahLama || null,
      nsmNss: d.nsmNss || null,
      dariKelas: d.dariKelas || null,
      namaSekolah: d.namaSekolah,
      noSkhun: d.noSkhun || null,
      noPesertaUjian: d.noPesertaUjian || null,
      rataRataNilaiUn: d.rataRataNilaiUn || null,
      noIjazah: d.noIjazah || null,
      tahunLulus: d.tahunLulus || null,
    });

    await db.insert(bantuanSosial).values({
      santriId,
      nomorKksKps: d.nomorKksKps || null,
      nomorPkh: d.nomorPkh || null,
      nomorKip: d.nomorKip || null,
      nomorBpjs: d.nomorBpjs || null,
    });

    if (d.cabangLomba) {
      await db.insert(prestasi).values({
        santriId,
        cabangLomba: d.cabangLomba,
        tingkatId: d.tingkatId || null,
        peringkatId: d.peringkatId || null,
        tahunLomba: d.tahunLomba || null,
      });
    }

    await db.insert(informasiPenunjang).values({
      santriId,
      organisasiMasyarakatId: d.organisasiMasyarakatId || null,
      programBeasiswaId: d.programBeasiswaId || null,
    });

    return new Response(null, {
      status: 303,
      headers: {
        Location: `/daftar/sukses?nama=${encodeURIComponent(d.namaLengkap)}&jenjang=${encodeURIComponent(d.jenjangPendaftaran)}`,
        'Set-Cookie': clearCookie(),
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return new Response(null, {
      status: 303,
      headers: {
        Location: `/daftar?step=${TOTAL_STEPS}&error=${encodeURIComponent(error.message || 'Terjadi kesalahan')}`,
        'Set-Cookie': setCookie(getSession(request)),
      },
    });
  }
};
