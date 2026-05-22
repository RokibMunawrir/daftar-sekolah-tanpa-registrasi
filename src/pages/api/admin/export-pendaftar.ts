import type { APIRoute } from 'astro';
import db from '../../../db';
import { 
  santri, pendaftaran, alamat, pendidikanSebelumnya, 
  bantuanSosial, informasiPenunjang, orangTua 
} from '../../../db/schema';
import { eq, desc } from 'drizzle-orm';
import * as XLSX from 'xlsx';

export const GET: APIRoute = async (context) => {
  // 1. Session check to protect the admin endpoint
  if (!context.locals.session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 2. Fetch main student data with left joins
    const rows = await db
      .select({
        id: santri.id,
        nis: santri.nis,
        nisn: santri.nisn,
        nik: santri.nik,
        namaLengkap: santri.namaLengkap,
        tempatLahir: santri.tempatLahir,
        tanggalLahir: santri.tanggalLahir,
        jenisKelamin: santri.jenisKelamin,
        hobi: santri.hobi,
        citaCita: santri.citaCita,
        anakKe: santri.anakKe,
        beratBadan: santri.beratBadan,
        tinggiBadan: santri.tinggiBadan,
        jumlahSaudaraKandung: santri.jumlahSaudaraKandung,
        jumlahSaudaraTiri: santri.jumlahSaudaraTiri,
        statusKondisiSantri: santri.statusKondisiSantri,
        createdAt: santri.createdAt,
        
        // Pendaftaran
        jenjangPendaftaran: pendaftaran.jenjangPendaftaran,
        kategoriPendaftaran: pendaftaran.kategoriPendaftaran,
        statusSantri: pendaftaran.statusSantri,
        
        // Alamat
        alamatLengkap: alamat.alamatLengkap,
        provinsiId: alamat.provinsiId,
        kabupatenId: alamat.kabupatenId,
        kecamatanId: alamat.kecamatanId,
        desaKelurahanId: alamat.desaKelurahanId,
        rt: alamat.rt,
        rw: alamat.rw,
        kodepos: alamat.kodepos,
        nomorHpOrangTua: alamat.nomorHpOrangTua,
        emailOrangTua: alamat.emailOrangTua,
        
        // Pendidikan Sebelumnya
        npsnSekolahLama: pendidikanSebelumnya.npsnSekolahLama,
        nsmNss: pendidikanSebelumnya.nsmNss,
        dariKelas: pendidikanSebelumnya.dariKelas,
        namaSekolah: pendidikanSebelumnya.namaSekolah,
        noSkhun: pendidikanSebelumnya.noSkhun,
        noPesertaUjian: pendidikanSebelumnya.noPesertaUjian,
        rataRataNilaiUn: pendidikanSebelumnya.rataRataNilaiUn,
        noIjazah: pendidikanSebelumnya.noIjazah,
        tahunLulus: pendidikanSebelumnya.tahunLulus,
        
        // Bantuan Sosial
        nomorKksKps: bantuanSosial.nomorKksKps,
        nomorPkh: bantuanSosial.nomorPkh,
        nomorKip: bantuanSosial.nomorKip,
        nomorBpjs: bantuanSosial.nomorBpjs,
        
        // Informasi Penunjang
        organisasiMasyarakatId: informasiPenunjang.organisasiMasyarakatId,
        programBeasiswaId: informasiPenunjang.programBeasiswaId,
      })
      .from(santri)
      .leftJoin(pendaftaran, eq(pendaftaran.santriId, santri.id))
      .leftJoin(alamat, eq(alamat.santriId, santri.id))
      .leftJoin(pendidikanSebelumnya, eq(pendidikanSebelumnya.santriId, santri.id))
      .leftJoin(bantuanSosial, eq(bantuanSosial.santriId, santri.id))
      .leftJoin(informasiPenunjang, eq(informasiPenunjang.santriId, santri.id))
      .orderBy(desc(santri.createdAt));

    // 3. Fetch all parents and group them in memory to prevent double rows join explosion
    const parents = await db.select().from(orangTua);
    const parentsBySantri: Record<string, { AYAH?: any; IBU?: any; WALI?: any }> = {};
    
    for (const p of parents) {
      if (!parentsBySantri[p.santriId]) {
        parentsBySantri[p.santriId] = {};
      }
      if (p.tipe === 'AYAH') {
        parentsBySantri[p.santriId].AYAH = p;
      } else if (p.tipe === 'IBU') {
        parentsBySantri[p.santriId].IBU = p;
      } else if (p.tipe === 'WALI') {
        parentsBySantri[p.santriId].WALI = p;
      }
    }

    // 4. Map query results to spreadsheet columns in Indonesian
    const workbookData = rows.map((item, index) => {
      const p = parentsBySantri[item.id] || {};
      const ayah = p.AYAH || {};
      const ibu = p.IBU || {};
      const wali = p.WALI || {};

      const formatDate = (d: any) => {
        if (!d) return '-';
        try {
          const dateObj = new Date(d);
          if (isNaN(dateObj.getTime())) return '-';
          return dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
        } catch {
          return '-';
        }
      };

      const formatDateTime = (d: any) => {
        if (!d) return '-';
        try {
          const dateObj = new Date(d);
          if (isNaN(dateObj.getTime())) return '-';
          return dateObj.toLocaleDateString('id-ID', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        } catch {
          return '-';
        }
      };

      return {
        'No.': index + 1,
        'NIS': item.nis || '-',
        'NISN': item.nisn || '-',
        'NIK': item.nik || '-',
        'Nama Lengkap': item.namaLengkap || '-',
        'Tempat Lahir': item.tempatLahir || '-',
        'Tanggal Lahir': formatDate(item.tanggalLahir),
        'Jenis Kelamin': item.jenisKelamin === 'L' ? 'Laki-laki' : item.jenisKelamin === 'P' ? 'Perempuan' : '-',
        'Hobi': item.hobi || '-',
        'Cita-cita': item.citaCita || '-',
        'Anak Ke': item.anakKe || 0,
        'Berat Badan (kg)': item.beratBadan || '-',
        'Tinggi Badan (cm)': item.tinggiBadan || '-',
        'Jumlah Saudara Kandung': item.jumlahSaudaraKandung || 0,
        'Jumlah Saudara Tiri': item.jumlahSaudaraTiri || 0,
        'Kondisi Santri': item.statusKondisiSantri || '-',
        
        // Pendaftaran
        'Jenjang Pendaftaran': item.jenjangPendaftaran || '-',
        'Kategori Pendaftaran': item.kategoriPendaftaran || '-',
        'Status Santri': item.statusSantri || '-',
        
        // Alamat
        'Alamat Lengkap': item.alamatLengkap || '-',
        'Provinsi': item.provinsiId || '-',
        'Kabupaten/Kota': item.kabupatenId || '-',
        'Kecamatan': item.kecamatanId || '-',
        'Desa/Kelurahan': item.desaKelurahanId || '-',
        'RT': item.rt || '-',
        'RW': item.rw || '-',
        'Kode Pos': item.kodepos || '-',
        'No. HP Orang Tua': item.nomorHpOrangTua || '-',
        'Email Orang Tua': item.emailOrangTua || '-',
        
        // Ayah
        'Nama Ayah': ayah.nama || '-',
        'NIK Ayah': ayah.nik || '-',
        'Tempat Lahir Ayah': ayah.tempatLahir || '-',
        'Tanggal Lahir Ayah': formatDate(ayah.tanggalLahir),
        'Pendidikan Ayah': ayah.pendidikanId || '-',
        'Pekerjaan Ayah': ayah.pekerjaanId || '-',
        'Penghasilan Ayah': ayah.penghasilanId || '-',
        'Kewarganegaraan Ayah': ayah.kewarganegaraan || '-',
        
        // Ibu
        'Nama Ibu': ibu.nama || '-',
        'NIK Ibu': ibu.nik || '-',
        'Tempat Lahir Ibu': ibu.tempatLahir || '-',
        'Tanggal Lahir Ibu': formatDate(ibu.tanggalLahir),
        'Pendidikan Ibu': ibu.pendidikanId || '-',
        'Pekerjaan Ibu': ibu.pekerjaanId || '-',
        'Penghasilan Ibu': ibu.penghasilanId || '-',
        'Kewarganegaraan Ibu': ibu.kewarganegaraan || '-',
        
        // Wali
        'Nama Wali': wali.nama || '-',
        'NIK Wali': wali.nik || '-',
        'Tempat Lahir Wali': wali.tempatLahir || '-',
        'Tanggal Lahir Wali': formatDate(wali.tanggalLahir),
        'Kewarganegaraan Wali': wali.kewarganegaraan || '-',
        'Hubungan Wali': wali.hubunganWali || '-',
        
        // Pendidikan Sebelumnya
        'NPSN Sekolah Asal': item.npsnSekolahLama || '-',
        'Nama Sekolah Asal': item.namaSekolah || '-',
        'Dari Kelas': item.dariKelas || '-',
        'NSM/NSS': item.nsmNss || '-',
        'No. SKHUN': item.noSkhun || '-',
        'No. Peserta Ujian': item.noPesertaUjian || '-',
        'Rata-rata Nilai UN': item.rataRataNilaiUn || '-',
        'No. Ijazah': item.noIjazah || '-',
        'Tahun Lulus': item.tahunLulus || '-',
        
        // Bantuan Sosial
        'No. KKS/KPS': item.nomorKksKps || '-',
        'No. PKH': item.nomorPkh || '-',
        'No. KIP': item.nomorKip || '-',
        'No. BPJS': item.nomorBpjs || '-',
        
        // Penunjang
        'Organisasi Masyarakat': item.organisasiMasyarakatId || '-',
        'Program Beasiswa': item.programBeasiswaId || '-',
        
        // Tanggal Daftar
        'Tanggal Daftar': formatDateTime(item.createdAt),
      };
    });

    // 5. Build SheetJS Workbook
    const worksheet = XLSX.utils.json_to_sheet(workbookData);
    
    // Auto-adjust column widths based on content length
    const colWidths = Object.keys(workbookData[0] || {}).map(key => {
      const maxLength = Math.max(
        key.length,
        ...workbookData.map(row => String((row as any)[key] || '').length)
      );
      return { wch: maxLength + 3 };
    });
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Calon Siswa');

    // 6. Write to buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // 7. Send the response as attachment download
    const dateStr = new Date().toISOString().split('T')[0];
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="pendaftaran_smp_it_darussalam_luwuk_${dateStr}.xlsx"`,
      },
    });
  } catch (error: any) {
    console.error('Export Excel Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
