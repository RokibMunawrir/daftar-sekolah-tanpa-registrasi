import React, { useState, useEffect } from 'react';

export default function RegistrationForm() {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const [formData, setFormData] = useState({
    // Step 1: Pendaftaran
    jenjangPendaftaran: '',
    kategoriPendaftaran: '',
    statusSantri: '',

    // Step 2: Data Santri
    nisn: '',
    nik: '',
    namaLengkap: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: 'L',
    hobi: '',
    citaCita: '',
    anakKe: '',
    beratBadan: '',
    tinggiBadan: '',
    jumlahSaudaraKandung: '0',
    jumlahSaudaraTiri: '0',
    statusKondisiSantri: '',

    // Step 3: Alamat
    alamatLengkap: '',
    provinsiId: '',
    kabupatenId: '',
    kecamatanId: '',
    desaKelurahanId: '',
    rt: '',
    rw: '',
    kodepos: '',
    nomorHpOrangTua: '',
    emailOrangTua: '',

    // Step 4: Orang Tua (Ayah, Ibu, Wali)
    namaAyah: '',
    nikAyah: '',
    tempatLahirAyah: '',
    tanggalLahirAyah: '',
    pendidikanAyah: '',
    pekerjaanAyah: '',
    penghasilanAyah: '',
    kewarganegaraanAyah: 'WNI',

    namaIbu: '',
    nikIbu: '',
    tempatLahirIbu: '',
    tanggalLahirIbu: '',
    pendidikanIbu: '',
    pekerjaanIbu: '',
    penghasilanIbu: '',
    kewarganegaraanIbu: 'WNI',

    namaWali: '',
    nikWali: '',
    tempatLahirWali: '',
    tanggalLahirWali: '',
    pendidikanWali: '',
    pekerjaanWali: '',
    penghasilanWali: '',
    kewarganegaraanWali: 'WNI',
    hubunganWali: '',

    // Step 5: Pendidikan Sebelumnya
    npsnSekolahLama: '',
    nsmNss: '',
    dariKelas: '',
    namaSekolah: '',
    noSkhun: '',
    noPesertaUjian: '',
    rataRataNilaiUn: '',
    noIjazah: '',
    tahunLulus: '',

    // Step 6: Bantuan Sosial & Penunjang
    nomorKksKps: '',
    nomorPkh: '',
    nomorKip: '',
    nomorBpjs: '',
    cabangLomba: '',
    tingkatId: '',
    peringkatId: '',
    tahunLomba: '',
    organisasiMasyarakatId: '',
    programBeasiswaId: '',
  });

  const [submitted, setSubmitted] = useState(false);

  // Cascading Dropdowns for Wilayah.id
  const [provinces, setProvinces] = useState<{ code: string; name: string }[]>([]);
  const [regencies, setRegencies] = useState<{ code: string; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ code: string; name: string }[]>([]);
  const [villages, setVillages] = useState<{ code: string; name: string }[]>([]);

  const [selectedProvinceCode, setSelectedProvinceCode] = useState('');
  const [selectedRegencyCode, setSelectedRegencyCode] = useState('');
  const [selectedDistrictCode, setSelectedDistrictCode] = useState('');

  // Fetch Provinces on mount
  useEffect(() => {
    fetch('/api/wilayah/provinces.json')
      .then((res) => res.json())
      .then((data) => setProvinces(data.data || []))
      .catch((err) => console.error('Error fetching provinces:', err));
  }, []);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = provinces.find((p) => p.code === code)?.name || '';

    setSelectedProvinceCode(code);
    setRegencies([]);
    setDistricts([]);
    setVillages([]);
    setSelectedRegencyCode('');
    setSelectedDistrictCode('');

    setFormData((prev) => ({
      ...prev,
      provinsiId: name,
      kabupatenId: '',
      kecamatanId: '',
      desaKelurahanId: '',
    }));

    if (code) {
      fetch(`/api/wilayah/regencies/${code}.json`)
        .then((res) => res.json())
        .then((data) => setRegencies(data.data || []))
        .catch((err) => console.error('Error fetching regencies:', err));
    }
  };

  const handleRegencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = regencies.find((r) => r.code === code)?.name || '';

    setSelectedRegencyCode(code);
    setDistricts([]);
    setVillages([]);
    setSelectedDistrictCode('');

    setFormData((prev) => ({
      ...prev,
      kabupatenId: name,
      kecamatanId: '',
      desaKelurahanId: '',
    }));

    if (code) {
      fetch(`/api/wilayah/districts/${code}.json`)
        .then((res) => res.json())
        .then((data) => setDistricts(data.data || []))
        .catch((err) => console.error('Error fetching districts:', err));
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = districts.find((d) => d.code === code)?.name || '';

    setSelectedDistrictCode(code);
    setVillages([]);

    setFormData((prev) => ({
      ...prev,
      kecamatanId: name,
      desaKelurahanId: '',
    }));

    if (code) {
      fetch(`/api/wilayah/villages/${code}.json`)
        .then((res) => res.json())
        .then((data) => setVillages(data.data || []))
        .catch((err) => console.error('Error fetching villages:', err));
    }
  };

  const handleVillageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = villages.find((v) => v.code === code)?.name || '';

    setFormData((prev) => ({
      ...prev,
      desaKelurahanId: name,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === totalSteps) {
      fetch('/api/daftar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setSubmitted(true);
          } else {
            alert('Gagal menyimpan data: ' + data.error);
          }
        })
        .catch((err) => {
          console.error('Error submitting form:', err);
          alert('Terjadi kesalahan saat mengirim data.');
        });
    } else {
      nextStep();
    }
  };


  const stepTitles = [
    'Informasi Pendaftaran',
    'Data Diri Siswa',
    'Alamat Lengkap',
    'Orang Tua / Wali',
    'Pendidikan Sebelumnya',
    'Prestasi & Penunjang',
  ];

  if (submitted) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl max-w-2xl mx-auto text-center border border-slate-100 dark:border-slate-800 animate-fadeIn">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          ✓
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Pendaftaran Berhasil!</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium">
          Terima kasih telah melakukan pendaftaran. Data Anda telah kami terima dan akan segera diproses oleh tim panitia PPDB.
        </p>
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 mb-8 text-left border border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Ringkasan Data:</p>
          <div className="grid grid-cols-2 gap-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <div><span className="text-slate-400 dark:text-slate-500 font-normal">Nama:</span> {formData.namaLengkap}</div>
            <div><span className="text-slate-400 dark:text-slate-500 font-normal">NIK:</span> {formData.nik}</div>
            <div><span className="text-slate-400 dark:text-slate-500 font-normal">Jenjang:</span> {formData.jenjangPendaftaran}</div>
            <div><span className="text-slate-400 dark:text-slate-500 font-normal">Kategori:</span> {formData.kategoriPendaftaran}</div>
          </div>
        </div>
        <a 
          href="/" 
          className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-500/30 transition-all cursor-pointer duration-200"
        >
          Kembali ke Beranda
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-300">
      
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 p-8 text-white relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest">
            Langkah {step} dari {totalSteps}
          </span>
          <span className="text-xs font-medium text-indigo-100">
            {Math.round((step / totalSteps) * 100)}% Selesai
          </span>
        </div>
        <h2 className="text-2xl font-black tracking-tight">{stepTitles[step - 1]}</h2>
        
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/10">
          <div 
            className="h-full bg-white transition-all duration-500 ease-out shadow-[0_0_10px_rgba(255,255,255,0.8)]" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        
        {/* STEP 1: INFORMASI PENDAFTARAN */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Jenjang Pendaftaran</label>
                <select
                  name="jenjangPendaftaran"
                  value={formData.jenjangPendaftaran}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                >
                  <option value="">-- Pilih Jenjang --</option>
                  <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
                  <option value="MTs">Madrasah Tsanawiyah (MTs)</option>
                  <option value="SMA">Sekolah Menengah Atas (SMA)</option>
                  <option value="SMK">Sekolah Menengah Kejuruan (SMK)</option>
                  <option value="MA">Madrasah Aliyah (MA)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Kategori Pendaftaran</label>
                <select
                  name="kategoriPendaftaran"
                  value={formData.kategoriPendaftaran}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                >
                  <option value="">-- Pilih Kategori --</option>
                  <option value="Reguler">Reguler</option>
                  <option value="Prestasi">Jalur Prestasi</option>
                  <option value="Beasiswa">Jalur Beasiswa</option>
                  <option value="Tahfidz">Tahfidz Quran</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Status Santri / Siswa</label>
                <select
                  name="statusSantri"
                  value={formData.statusSantri}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                >
                  <option value="">-- Pilih Status --</option>
                  <option value="Baru">Baru</option>
                  <option value="Pindahan">Pindahan</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: DATA DIRI SISWA */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  name="namaLengkap"
                  value={formData.namaLengkap}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">NIK (Nomor Induk Kependudukan)</label>
                <input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  maxLength={16}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">NISN (Nomor Induk Siswa Nasional)</label>
                <input
                  type="text"
                  name="nisn"
                  value={formData.nisn}
                  onChange={handleChange}
                  maxLength={10}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Tempat Lahir</label>
                <input
                  type="text"
                  name="tempatLahir"
                  value={formData.tempatLahir}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Tanggal Lahir</label>
                <input
                  type="date"
                  name="tanggalLahir"
                  value={formData.tanggalLahir}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Jenis Kelamin</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm text-slate-700 dark:text-slate-300">
                    <input
                      type="radio"
                      name="jenisKelamin"
                      value="L"
                      checked={formData.jenisKelamin === 'L'}
                      onChange={handleChange}
                      className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    />
                    Laki-Laki
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm text-slate-700 dark:text-slate-300">
                    <input
                      type="radio"
                      name="jenisKelamin"
                      value="P"
                      checked={formData.jenisKelamin === 'P'}
                      onChange={handleChange}
                      className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    />
                    Perempuan
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Anak Ke</label>
                <input
                  type="number"
                  name="anakKe"
                  value={formData.anakKe}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Hobi</label>
                <input
                  type="text"
                  name="hobi"
                  value={formData.hobi}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Cita-Cita</label>
                <input
                  type="text"
                  name="citaCita"
                  value={formData.citaCita}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Berat Badan (kg)</label>
                <input
                  type="number"
                  name="beratBadan"
                  value={formData.beratBadan}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Tinggi Badan (cm)</label>
                <input
                  type="number"
                  name="tinggiBadan"
                  value={formData.tinggiBadan}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Jumlah Saudara Kandung</label>
                <input
                  type="number"
                  name="jumlahSaudaraKandung"
                  value={formData.jumlahSaudaraKandung}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Jumlah Saudara Tiri</label>
                <input
                  type="number"
                  name="jumlahSaudaraTiri"
                  value={formData.jumlahSaudaraTiri}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Status Kondisi Santri (Kesehatan/Khusus)</label>
                <input
                  type="text"
                  name="statusKondisiSantri"
                  value={formData.statusKondisiSantri}
                  onChange={handleChange}
                  placeholder="Contoh: Sehat / Memerlukan pendampingan khusus"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ALAMAT LENGKAP */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Alamat Lengkap</label>
                <textarea
                  name="alamatLengkap"
                  value={formData.alamatLengkap}
                  onChange={handleChange}
                  rows={3}
                  required
                  placeholder="Jalan, RT/RW, Dusun..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Provinsi</label>
                <select
                  name="provinsiId"
                  value={selectedProvinceCode}
                  onChange={handleProvinceChange}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                >
                  <option value="">-- Pilih Provinsi --</option>
                  {provinces.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Kabupaten / Kota</label>
                <select
                  name="kabupatenId"
                  value={selectedRegencyCode}
                  onChange={handleRegencyChange}
                  required
                  disabled={!selectedProvinceCode}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                >
                  <option value="">-- Pilih Kabupaten/Kota --</option>
                  {regencies.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Kecamatan</label>
                <select
                  name="kecamatanId"
                  value={selectedDistrictCode}
                  onChange={handleDistrictChange}
                  required
                  disabled={!selectedRegencyCode}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                >
                  <option value="">-- Pilih Kecamatan --</option>
                  {districts.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Desa / Kelurahan</label>
                <select
                  name="desaKelurahanId"
                  value={formData.desaKelurahanId ? villages.find((v) => v.name === formData.desaKelurahanId)?.code || '' : ''}
                  onChange={handleVillageChange}
                  required
                  disabled={!selectedDistrictCode}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                >
                  <option value="">-- Pilih Desa/Kelurahan --</option>
                  {villages.map((v) => (
                    <option key={v.code} value={v.code}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">RT</label>
                <input
                  type="text"
                  name="rt"
                  value={formData.rt}
                  onChange={handleChange}
                  maxLength={5}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">RW</label>
                <input
                  type="text"
                  name="rw"
                  value={formData.rw}
                  onChange={handleChange}
                  maxLength={5}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Kodepos</label>
                <input
                  type="text"
                  name="kodepos"
                  value={formData.kodepos}
                  onChange={handleChange}
                  maxLength={10}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Nomor HP Orang Tua</label>
                <input
                  type="text"
                  name="nomorHpOrangTua"
                  value={formData.nomorHpOrangTua}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: 081234567890"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Email Orang Tua</label>
                <input
                  type="email"
                  name="emailOrangTua"
                  value={formData.emailOrangTua}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: ORANG TUA / WALI */}
        {step === 4 && (
          <div className="space-y-8 animate-fadeIn">
            {/* AYAH */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-xs">1</span>
                Data Ayah
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Nama Ayah</label>
                  <input type="text" name="namaAyah" value={formData.namaAyah} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">NIK Ayah</label>
                  <input type="text" name="nikAyah" value={formData.nikAyah} onChange={handleChange} maxLength={16} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Tempat Lahir</label>
                  <input type="text" name="tempatLahirAyah" value={formData.tempatLahirAyah} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Tanggal Lahir</label>
                  <input type="date" name="tanggalLahirAyah" value={formData.tanggalLahirAyah} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Kewarganegaraan</label>
                  <select name="kewarganegaraanAyah" value={formData.kewarganegaraanAyah} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent">
                    <option value="WNI">WNI</option>
                    <option value="WNA">WNA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Pekerjaan</label>
                  <input type="text" name="pekerjaanAyah" value={formData.pekerjaanAyah} onChange={handleChange} placeholder="Contoh: PNS / Karyawan Swasta" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent" />
                </div>
              </div>
            </div>

            {/* IBU */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-xs">2</span>
                Data Ibu
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Nama Ibu</label>
                  <input type="text" name="namaIbu" value={formData.namaIbu} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">NIK Ibu</label>
                  <input type="text" name="nikIbu" value={formData.nikIbu} onChange={handleChange} maxLength={16} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Tempat Lahir</label>
                  <input type="text" name="tempatLahirIbu" value={formData.tempatLahirIbu} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Tanggal Lahir</label>
                  <input type="date" name="tanggalLahirIbu" value={formData.tanggalLahirIbu} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Kewarganegaraan</label>
                  <select name="kewarganegaraanIbu" value={formData.kewarganegaraanIbu} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent">
                    <option value="WNI">WNI</option>
                    <option value="WNA">WNA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Pekerjaan</label>
                  <input type="text" name="pekerjaanIbu" value={formData.pekerjaanIbu} onChange={handleChange} placeholder="Contoh: Ibu Rumah Tangga" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent" />
                </div>
              </div>
            </div>

            {/* WALI */}
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center text-xs">3</span>
                Data Wali (Opsional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Nama Wali</label>
                  <input type="text" name="namaWali" value={formData.namaWali} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Hubungan Wali</label>
                  <input type="text" name="hubunganWali" value={formData.hubunganWali} onChange={handleChange} placeholder="Contoh: Paman / Bibi / Kakak" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: PENDIDIKAN SEBELUMNYA */}
        {step === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Nama Sekolah Asal</label>
                <input
                  type="text"
                  name="namaSekolah"
                  value={formData.namaSekolah}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">NPSN Sekolah Asal</label>
                <input
                  type="text"
                  name="npsnSekolahLama"
                  value={formData.npsnSekolahLama}
                  onChange={handleChange}
                  maxLength={8}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">NSM / NSS Sekolah</label>
                <input
                  type="text"
                  name="nsmNss"
                  value={formData.nsmNss}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Dari Kelas</label>
                <input
                  type="text"
                  name="dariKelas"
                  value={formData.dariKelas}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Tahun Lulus</label>
                <input
                  type="text"
                  name="tahunLulus"
                  value={formData.tahunLulus}
                  onChange={handleChange}
                  maxLength={4}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">No Ijazah</label>
                <input
                  type="text"
                  name="noIjazah"
                  value={formData.noIjazah}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Rata-Rata Nilai UN</label>
                <input
                  type="text"
                  name="rataRataNilaiUn"
                  value={formData.rataRataNilaiUn}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: PRESTASI & PENUNJANG */}
        {step === 6 && (
          <div className="space-y-6 animate-fadeIn">
            {/* BANSOS */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Bantuan Sosial (Jika Ada)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">No KKS / KPS</label>
                  <input type="text" name="nomorKksKps" value={formData.nomorKksKps} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">No PKH</label>
                  <input type="text" name="nomorPkh" value={formData.nomorPkh} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">No KIP</label>
                  <input type="text" name="nomorKip" value={formData.nomorKip} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">No BPJS</label>
                  <input type="text" name="nomorBpjs" value={formData.nomorBpjs} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent" />
                </div>
              </div>
            </div>

            {/* PRESTASI */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Prestasi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Cabang Lomba</label>
                  <input type="text" name="cabangLomba" value={formData.cabangLomba} onChange={handleChange} placeholder="Contoh: Matematika / Pencak Silat" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Tingkat Prestasi</label>
                  <input type="text" name="tingkatId" value={formData.tingkatId} onChange={handleChange} placeholder="Contoh: Kabupaten / Provinsi" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Peringkat / Juara</label>
                  <input type="text" name="peringkatId" value={formData.peringkatId} onChange={handleChange} placeholder="Contoh: Juara 1 / Harapan 2" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Tahun Lomba</label>
                  <input type="text" name="tahunLomba" value={formData.tahunLomba} onChange={handleChange} maxLength={4} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent" />
                </div>
              </div>
            </div>
            
            {/* PENUNJANG */}
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Informasi Penunjang</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Organisasi Masyarakat</label>
                  <input type="text" name="organisasiMasyarakatId" value={formData.organisasiMasyarakatId} onChange={handleChange} placeholder="Contoh: NU / Muhammadiyah" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Program Beasiswa</label>
                  <input type="text" name="programBeasiswaId" value={formData.programBeasiswaId} onChange={handleChange} placeholder="Contoh: KIP-K / Beasiswa Prestasi" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between items-center pt-8 border-t border-slate-100 dark:border-slate-800 mt-8">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="inline-flex items-center justify-center gap-2 cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 px-6 rounded-xl transition-all duration-200"
            >
              ← Kembali
            </button>
          ) : (
            <div></div>
          )}

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-500/30 dark:shadow-none transition-all duration-200"
          >
            {step === totalSteps ? 'Selesai & Kirim' : 'Lanjut →'}
          </button>
        </div>
      </form>
      
      {/* Small design hint */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
