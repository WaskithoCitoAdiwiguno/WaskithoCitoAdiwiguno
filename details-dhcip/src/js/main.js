(function () {
  'use strict';

  /* ---------- Screenshots slider data ---------- */
  var SLIDES = [
    {
      img: 'src/img/employee-details-performance.png',
      alt: { id: 'Modul Employee Details DHCIP — performa karyawan', en: 'DHCIP Employee Details module — employee performance' },
      title: { id: 'Employee Details — Performa Karyawan', en: 'Employee Details — Performance' },
      desc: {
        id: 'Ringkasan penilaian individu dalam satu halaman: skor KPI, akhlak, dan kehadiran. Ada rekap Ringkasan KPI & Kriteria per indikator, Ringkasan Kontribusi (rata-rata nilai, kontribusi, absensi), profil karyawan di sisi kanan, hingga daftar penilaian yang masih perlu ditindaklanjuti.',
        en: 'A one-page individual assessment summary: KPI, work attitude (akhlak), and attendance scores. Includes the KPI & criteria breakdown per indicator, a contribution summary (average score, contribution, absences), the employee profile on the right, and assessments still pending follow-up.'
      }
    },
    {
      img: 'src/img/employee-details-360.png',
      alt: { id: 'Modul Employee Details DHCIP — penilaian 360°', en: 'DHCIP Employee Details module — 360° assessment' },
      title: { id: 'Employee Details — Penilaian 360°', en: 'Employee Details — 360° Assessment' },
      desc: {
        id: 'Detail penilaian 360° untuk tiap karyawan: umpan balik dari rekan, atasan, dan bawahan direkap menjadi skor Aspek (1.43), Kinerja (3.57), dan Sopan (1.57) pada contoh ini — lengkap dengan nilai terendah/tertinggi serta rekomendasi platform yang siap dikirim via email.',
        en: 'Per-employee 360° detail: feedback from peers, managers, and subordinates is summarized into aspect (1.43), performance (3.57), and politeness (1.57) scores in this example — with lowest/highest values and platform recommendations ready to send via email.'
      }
    },
    {
      img: 'src/img/employee-details-ai.png',
      alt: { id: 'Modul Employee Details DHCIP — penilaian AI', en: 'DHCIP Employee Details module — AI assessment' },
      title: { id: 'Employee Details — Penilaian AI', en: 'Employee Details — AI Assessment' },
      desc: {
        id: 'Rekomendasi AI pada level individu: Gemini Flash 2.5 menganalisis data kinerja karyawan lalu menyusun saran pengembangan terstruktur dalam dua kolom — Rekomendasi AI dan Rekomendasi Platform — sehingga manajemen bisa membandingkan saran mesin dengan kebijakan internal.',
        en: 'Individual-level AI recommendations: Gemini Flash 2.5 analyzes each employee\u2019s performance data and produces structured development suggestions in two columns — AI Recommendations and Platform Recommendations — so management can compare machine advice against internal policy.'
      }
    },
    {
      img: 'src/img/nine-box-matrix.png',
      alt: { id: 'Modul Nine Box Matrix DHCIP — pemetaan karyawan', en: 'DHCIP Nine Box Matrix module — employee mapping' },
      title: { id: 'Nine Box Matrix — Pemetaan Karyawan', en: 'Nine Box Matrix — Employee Mapping' },
      desc: {
        id: 'Pemetaan talenta 3×3 berdasarkan dua sumbu: performa dan potensi. Setiap box menampilkan jumlah karyawan (seperti Star Talent 7 dan Risk Talent 10 pada contoh), dengan panel Rekap di sisi kanan untuk melihat distribusi talenta secara keseluruhan.',
        en: 'A 3×3 talent mapping across two axes: performance and potential. Each box shows its employee count (e.g., Star Talent 7 and Risk Talent 10 in this example), with a Recap panel on the right showing the overall talent distribution.'
      }
    },
    {
      img: 'src/img/nine-box-matrix-details.png',
      alt: { id: 'Modul Nine Box Matrix DHCIP — detail per divisi', en: 'DHCIP Nine Box Matrix module — per-division details' },
      title: { id: 'Nine Box Matrix — Detail per Divisi', en: 'Nine Box Matrix — Per-Division Details' },
      desc: {
        id: 'Mode detail Nine Box Matrix: pemetaan dapat dipecah per leader, divisi, hingga direktorat. Manajemen bisa membaca distribusi talenta di setiap unit kerja — mana tim yang kaya talenta bintang dan mana yang perlu program pengembangan.',
        en: 'Nine Box detail mode: the mapping can be broken down per leader, division, up to directorate. Management can read the talent distribution of every work unit — which teams are rich in star talent and which need development programs.'
      }
    },
    {
      img: 'src/img/ai-recommendation.png',
      alt: { id: 'Modul AI Recommendation DHCIP — rekomendasi perbaikan', en: 'DHCIP AI Recommendation module — improvement suggestions' },
      title: { id: 'AI Recommendation — Rekomendasi Perbaikan', en: 'AI Recommendation — Improvement Suggestions' },
      desc: {
        id: 'Daftar karyawan dengan rekomendasi yang dihasilkan otomatis oleh Gemini Flash 2.5 dari data kinerja: narasi kondisi karyawan, saran pengembangan, hingga keputusan (mis. dipromosikan/dipertahankan). Dilengkapi indikator progres implementasi rekomendasi.',
        en: 'The employee list with recommendations generated automatically by Gemini Flash 2.5 from performance data: a narrative of the employee\u2019s condition, development suggestions, and decisions (e.g., promote/retain). Includes an implementation-progress indicator.'
      }
    },
    {
      img: 'src/img/ai-recommendation-details.png',
      alt: { id: 'Modul AI Recommendation DHCIP — 5 teratas per karyawan', en: 'DHCIP AI Recommendation module — top 5 per employee' },
      title: { id: 'AI Recommendation — Detail Tindak Lanjut', en: 'AI Recommendation — Follow-up Details' },
      desc: {
        id: 'Lima karyawan teratas yang paling membutuhkan tindak lanjut: setiap kartu berisi skor aspek, indikator "Perlu Dikembangkan", penjelasan alasan dari AI, dan aksi cepat seperti kirim email untuk konsultasi atau mediasi.',
        en: 'The top five employees most needing follow-up: each card carries aspect scores, a "Needs Development" indicator, AI-generated reasoning, and quick actions such as sending an email for consultation or mediation.'
      }
    }
  ];

  var AUTOPLAY_MS = 10000;

  var i18n = {
    id: {
      back: 'Kembali ke Profil',
      kicker: 'Proyek Unggulan · Web Dashboard',
      lede: 'Sistem dashboard web untuk memantau performa karyawan DAMRI secara menyeluruh — dari ringkasan KPI perusahaan, detail penilaian tiap individu, pemetaan talenta lewat Nine Box Matrix, hingga rekomendasi perbaikan otomatis berbasis AI.',
      btnGithub: 'GitHub Profil',
      modulesTitle: 'Empat Modul Utama',
      modulesSub: 'Semua aspek manajemen kinerja karyawan DAMRI dalam satu platform terintegrasi.',
      card1Body: 'Ringkasan KPI seluruh karyawan dalam satu tampilan — agregasi performa lintas unit kerja secara real-time.',
      card2Body: 'Profil kinerja individual: KPI, akhlak, kehadiran, dan penilaian 360° dari rekan, atasan, serta bawahan.',
      card3Body: 'Pemetaan performa dan potensi pada tiga level: karyawan, leader, divisi, hingga direktorat.',
      card4Body: 'Rekomendasi perbaikan otomatis berbasis Gemini Flash 2.5, disusun dari data kinerja tiap karyawan.',
      galleryTitle: 'Tangkapan Layar',
      gallerySub: 'Bergeser otomatis setiap 10 detik — klik gambar untuk melihat lebih detail.',
      archTitle: 'Arsitektur &amp; Cakupan Data',
      archSub: 'Dibangun sebagai aplikasi web multi-layer dengan penilaian multi-sumber.',
      sysTitle: 'Struktur Sistem',
      sys1: '<b>Frontend</b> — antarmuka dashboard interaktif (JavaScript / TypeScript)',
      sys2: '<b>Backend</b> — layanan aplikasi Golang &amp; PHP (CodeIgniter)',
      sys3: '<b>Database</b> — MySQL untuk data karyawan, penilaian, dan histori KPI',
      sys4: '<b>Layanan AI</b> — integrasi Gemini API untuk analisis dan rekomendasi',
      aspTitle: 'Aspek Penilaian',
      asp1: '<b>KPI</b> — indikator kinerja utama per periode penilaian',
      asp2: '<b>Akhlak</b> — dimensi sikap dan perilaku kerja',
      asp3: '<b>Kehadiran</b> — rekam disiplin kehadiran karyawan',
      asp4: '<b>Penilaian 360°</b> — umpan balik dari rekan, atasan, dan bawahan',
      techTitle: 'Teknologi yang Digunakan',
      techSub: 'Stack yang menopang seluruh platform.',
      glanceTitle: 'Sekilas',
      glanceSub: 'Poin-poin yang membuat DHCIP bermanfaat bagi manajemen.',
      hl1Big: '4 Modul',
      hl2Lbl: 'Penilaian multi-sumber: rekan, atasan, dan bawahan',
      hl3Lbl: 'Rekomendasi perbaikan otomatis via Gemini Flash 2.5',
      ctaTitle: 'Lihat Platform Secara Langsung',
      ctaSub: 'Seluruh modul DHCIP dapat diakses melalui deployment resmi di dhcip.my.id.',
      ctaBtn1: 'Buka dhcip.my.id ↗',
      ctaBtn2: 'Profil GitHub ↗'
    },
    en: {
      back: 'Back to Profile',
      kicker: 'Featured Project · Web Dashboard',
      lede: 'A web dashboard system for monitoring DAMRI employee performance end to end — from company-wide KPI summaries and individual assessment details, to talent mapping via the Nine Box Matrix and automated AI-powered improvement recommendations.',
      btnGithub: 'GitHub Profile',
      modulesTitle: 'Four Core Modules',
      modulesSub: 'Every aspect of DAMRI employee performance management in one integrated platform.',
      card1Body: 'Company-wide KPI summary in a single view — real-time performance aggregation across work units.',
      card2Body: 'Individual performance profile: KPI, work attitude (akhlak), attendance, and 360° feedback from peers, managers, and subordinates.',
      card3Body: 'Performance and potential mapping across three levels: employee, leader, division, up to directorate.',
      card4Body: 'Automated improvement recommendations powered by Gemini Flash 2.5, built from each employee\u2019s performance data.',
      galleryTitle: 'Screenshots',
      gallerySub: 'Auto-advances every 10 seconds — click an image to view it in full size.',
      archTitle: 'Architecture &amp; Data Scope',
      archSub: 'Built as a multi-layer web application with multi-source assessments.',
      sysTitle: 'System Structure',
      sys1: '<b>Frontend</b> — interactive dashboard interface (JavaScript / TypeScript)',
      sys2: '<b>Backend</b> — application services in Golang &amp; PHP (CodeIgniter)',
      sys3: '<b>Database</b> — MySQL for employee data, assessments, and KPI history',
      sys4: '<b>AI Services</b> — Gemini API integration for analysis and recommendations',
      aspTitle: 'Assessment Aspects',
      asp1: '<b>KPI</b> — key performance indicators per assessment period',
      asp2: '<b>Akhlak</b> — work attitude and behavioral dimensions',
      asp3: '<b>Attendance</b> — employee attendance discipline records',
      asp4: '<b>360° Assessment</b> — feedback from peers, managers, and subordinates',
      techTitle: 'Technologies Used',
      techSub: 'The stack powering the entire platform.',
      glanceTitle: 'At a Glance',
      glanceSub: 'What makes DHCIP valuable for management.',
      hl1Big: '4 Modules',
      hl2Lbl: 'Multi-source assessment: peers, managers, and subordinates',
      hl3Lbl: 'Automated improvement recommendations via Gemini Flash 2.5',
      ctaTitle: 'See the Platform Live',
      ctaSub: 'All DHCIP modules are accessible through the official deployment at dhcip.my.id.',
      ctaBtn1: 'Open dhcip.my.id ↗',
      ctaBtn2: 'GitHub Profile ↗'
    }
  };

  var STORE_KEY = 'dhcip-lang';

  function currentLang() {
    return document.documentElement.lang === 'en' ? 'en' : 'id';
  }

  /* ---------- Slider ---------- */
  var slider = document.getElementById('slider');
  var slidesWrap = document.getElementById('slides');
  var dotsWrap = document.getElementById('slide-dots');
  var progressBar = document.getElementById('slide-progress-bar');
  var current = 0;
  var timer = null;
  var hovering = false;

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function renderSlides() {
    if (!slidesWrap || !dotsWrap) return;
    var lang = currentLang();
    var html = '';
    for (var i = 0; i < SLIDES.length; i++) {
      var s = SLIDES[i];
      html += '<figure class="slide" data-index="' + i + '">'
        + '<div class="slide-inner">'
        + '<div class="slide-img" data-lightbox>'
        + '<img src="' + s.img + '" alt="' + s.alt[lang] + '" data-full="' + s.img + '" />'
        + '</div>'
        + '<figcaption class="slide-info">'
        + '<span class="num">' + pad(i + 1) + ' / ' + pad(SLIDES.length) + '</span>'
        + '<h3>' + s.title[lang] + '</h3>'
        + '<p class="desc">' + s.desc[lang] + '</p>'
        + '</figcaption>'
        + '</div>'
        + '</figure>';
    }
    slidesWrap.innerHTML = html;

    var dotsHtml = '';
    for (var j = 0; j < SLIDES.length; j++) {
      dotsHtml += '<button type="button" data-go="' + j + '" aria-label="Slide ' + (j + 1) + '"></button>';
    }
    dotsWrap.innerHTML = dotsHtml;
  }

  function restartProgress() {
    if (!progressBar) return;
    progressBar.classList.remove('run');
    void progressBar.offsetWidth; /* reflow to restart the CSS animation */
    progressBar.classList.add('run');
  }

  function show(index) {
    if (!slidesWrap) return;
    var total = SLIDES.length;
    current = ((index % total) + total) % total;

    var slides = slidesWrap.children;
    for (var i = 0; i < slides.length; i++) {
      slides[i].classList.toggle('active', i === current);
    }

    var dots = dotsWrap.children;
    for (var d = 0; d < dots.length; d++) {
      dots[d].classList.toggle('active', d === current);
    }
    restartProgress();
  }

  function stopAuto() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function startAuto() {
    stopAuto();
    timer = setInterval(function () {
      if (!hovering) show(current + 1);
    }, AUTOPLAY_MS);
  }

  if (slider) {
    document.getElementById('slide-prev').addEventListener('click', function () { show(current - 1); });
    document.getElementById('slide-next').addEventListener('click', function () { show(current + 1); });

    dotsWrap.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-go]');
      if (btn) show(parseInt(btn.getAttribute('data-go'), 10));
    });

    /* Pause while hovering (timer skips ticks); fresh 10s cycle on leave */
    slider.addEventListener('mouseenter', function () { hovering = true; });
    slider.addEventListener('mouseleave', function () { hovering = false; show(current); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  /* ---------- Lightbox (delegation: works for hero + re-rendered slides) ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCap = document.getElementById('lightbox-cap');
  var closeBtn = document.getElementById('lightbox-close');

  function openLightbox(fig) {
    if (!lightbox) return;
    var img = fig.querySelector('img');
    if (!img) return;
    var cap = fig.querySelector('figcaption');
    if (!cap) {
      var host = fig.closest('figure');
      cap = host ? host.querySelector('.slide-info h3') : null;
    }
    lightboxImg.src = img.getAttribute('data-full') || img.src;
    lightboxImg.alt = img.alt;
    lightboxCap.textContent = cap ? cap.textContent : '';
    lightbox.classList.add('open');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
  }

  document.addEventListener('click', function (e) {
    var fig = e.target.closest('[data-lightbox]');
    if (fig) openLightbox(fig);
  });

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target === lightboxImg || e.target === lightboxCap) closeLightbox();
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ---------- i18n ---------- */
  function setLang(lang) {
    var dict = i18n[lang] || i18n.id;
    document.documentElement.lang = lang;

    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-i18n');
      if (dict[key] !== undefined) nodes[i].innerHTML = dict[key];
    }

    var buttons = document.querySelectorAll('.lang-toggle button');
    for (var j = 0; j < buttons.length; j++) {
      buttons[j].classList.toggle('active', buttons[j].getAttribute('data-lang') === lang);
    }

    renderSlides();
    show(current);

    try { localStorage.setItem(STORE_KEY, lang); } catch (err) { /* private mode */ }
  }

  var toggle = document.querySelectorAll('.lang-toggle button');
  for (var k = 0; k < toggle.length; k++) {
    toggle[k].addEventListener('click', function () {
      setLang(this.getAttribute('data-lang'));
    });
  }

  /* ---------- Init ---------- */
  var saved = 'id';
  try { saved = localStorage.getItem(STORE_KEY) || 'id'; } catch (err) { /* private mode */ }
  setLang(saved);
  show(0);
  startAuto();
})();
