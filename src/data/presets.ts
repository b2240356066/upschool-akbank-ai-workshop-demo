import { InterviewPreset, TrainingPreset } from '../types';

export const interviewPresets: InterviewPreset[] = [
  {
    id: 'eng-manager',
    title: 'Engineering Manager (Yazılım Mühendisliği Müdürü)',
    titleEn: 'Engineering Manager',
    interviewerTitle: 'Engineering Manager',
    targetRole: 'Junior Full-Stack Developer',
    targetRoleEn: 'Junior Full-Stack Developer',
    candidateLevel: 'new_grad',
    companyType: 'Tech Startup / Scaleup',
    description: 'Yeni mezun veya junior yazılımcının kodlama disiplini, problem çözme refleksi ve ekip çalışmasına uyumunu sorgular.',
    descriptionEn: 'Evaluates coding rigor, debugging intuition, and collaboration potential in new grads and junior developers.',
  },
  {
    id: 'hr-talent-lead',
    title: 'Senior Talent Acquisition / Kampüs İşe Alım Uzmanı',
    titleEn: 'Senior Campus Recruiter / Talent Acquisition',
    interviewerTitle: 'Senior Talent Acquisition Specialist',
    targetRole: 'Management Trainee (MT) / Genç Yetenek Programı',
    targetRoleEn: 'Management Trainee / Future Leaders Program',
    candidateLevel: 'university_student',
    companyType: 'Kurumsal Global Şirket (FMCG / Telekom / Banka)',
    description: 'Öğrencinin kulüp liderlikleri, motivasyonu, öğrenme çevikliği ve şirket kültürüne uyumunu araştırır.',
    descriptionEn: 'Tests learning agility, student leadership initiatives, cultural fit, and long-term ambition for corporate fast-tracks.',
  },
  {
    id: 'lead-pm',
    title: 'Lead Product Manager (Ürün Lideri)',
    titleEn: 'Lead Product Manager',
    interviewerTitle: 'Lead Product Manager',
    targetRole: 'Associate Product Manager (APM)',
    targetRoleEn: 'Associate Product Manager (APM)',
    candidateLevel: 'new_grad',
    companyType: 'B2B SaaS / FinTech',
    description: 'Kullanıcı empatisi, ürün hissi, analitik karar alma ve yazılımcılarla nasıl iletişim kuracağını test eder.',
    descriptionEn: 'Assesses product intuition, structured thinking, user problem prioritization, and engineering empathy.',
  },
  {
    id: 'data-team-lead',
    title: 'Data Science & Analytics Lead (Veri Takım Lideri)',
    titleEn: 'Data Science & Analytics Lead',
    interviewerTitle: 'Head of Data & Analytics',
    targetRole: 'Junior Data Analyst / Scientist',
    targetRoleEn: 'Junior Data Analyst / Scientist',
    candidateLevel: 'new_grad',
    companyType: 'E-Ticaret / Perakende Analitiği',
    description: 'Akademik teoriyi iş problemlerine çevirebilme, SQL mantığı ve veri temizleme titizliğini sorgular.',
    descriptionEn: 'Probes practical SQL fluency, metric definitions, and ability to translate university coursework into business insight.',
  },
];

export const trainingPresets: TrainingPreset[] = [
  {
    id: 'cs-new-grad',
    label: 'Bilgisayar Müh. Mezunu (Frontend / Full-Stack Hedefi)',
    labelEn: 'CS Graduate (Frontend / Full-Stack Aspirant)',
    major: 'Bilgisayar Mühendisliği Son Sınıf',
    targetRole: 'Junior Frontend / Full-Stack Engineer',
    targetRoleEn: 'Junior Frontend / Full-Stack Engineer',
    content: `1. Üniversite Müfredatı:
- Algoritmalar ve Veri Yapıları (C++ & Java)
- Nesne Yönelimli Programlama
- Veritabanı Yönetim Sistemleri (İlişkisel SQL, Normalizasyon)
- İşletim Sistemleri ve Ağ Temelleri

2. Çevrimiçi Kurslar & Kendi Kendine Öğrenilenler:
- Udemy: Sıfırdan İleri Seviye Modern JavaScript (ES6+, Async/Await)
- React ile Modern Web Geliştirme (Hooks, useState, useEffect, Router)
- BTK Akademi: Git & GitHub ile Versiyon Kontrolü

3. Yaptığım Projeler:
- Üniversite Bitirme Projesi: React ve Node.js/Express ile Öğrenci Kulübü Etkinlik Yönetim Portalı (Temel CRUD işlemleri, JWT yetkilendirme).
- GitHub'da 2 adet basit Todo ve Hava Durumu API projesi.`,
    contentEn: `1. University Academic Coursework:
- Data Structures & Algorithms (C++ & Java)
- Object-Oriented Programming (OOP)
- Database Management Systems (Relational SQL, Normalization)
- Computer Networks & Operating Systems

2. Online Courses & Self-Taught:
- Udemy: Modern JavaScript Mastery (ES6+, Async/Await, DOM)
- React 18 Essentials (Functional components, Hooks, React Router)
- Git & GitHub Fundamentals

3. Completed Projects:
- Capstone Project: Campus Student Club Event Platform (React, Node.js, Express, Basic CRUD, JWT Auth).
- 2 personal portfolio mini-apps (Todo app with localStorage, Weather API app).`,
  },
  {
    id: 'data-analyst-grad',
    label: 'Mühendislik / İktisat Mezunu (Veri Analisti Hedefi)',
    labelEn: 'STEM / Economics Graduate (Data Analyst Aspirant)',
    major: 'Endüstri Mühendisliği / İktisat',
    targetRole: 'Junior Data Analyst / Business Intelligence Associate',
    targetRoleEn: 'Junior Data Analyst / Business Intelligence Associate',
    content: `1. Tamamlanan Eğitimler:
- Coursera: Google Data Analytics Professional Certificate (İlk 4 modül tamamlandı)
- Udemy: İleri Excel ve Pivot Tablolar (VLOOKUP, XLOOKUP, INDEX/MATCH, Koşullu Biçimlendirme)
- BTK Akademi: SQL ile Veritabanı Sorgulama (JOIN'ler, GROUP BY, Aggregate fonksiyonlar)
- Python Temelleri (Pandas ve Matplotlib ile temel veri manipülasyonu)

2. Yapılan Projeler:
- Kaggle üzerinden e-ticaret müşteri sipariş verisi seti ile satış trend analizi notebook'u.
- Üniversite dönem projesi: Süpermarket müşteri memnuniyet anket verisinin Excel ile raporlanması.`,
    contentEn: `1. Completed Coursework:
- Coursera: Google Data Analytics Professional Certificate (First 4 modules completed)
- Advanced Excel & Pivot Modeling (XLOOKUP, INDEX/MATCH, Dynamic Arrays)
- SQL Querying for Analytics (JOINs, GROUP BY, Subqueries, Aggregations)
- Python for Data Science Basics (Pandas, Matplotlib, Data Cleaning)

2. Projects:
- Kaggle E-Commerce Sales Trend Analysis exploratory Jupyter notebook.
- University term project: Customer churn and satisfaction survey report in Excel.`,
  },
  {
    id: 'agile-product-grad',
    label: 'İşletme / Sosyal Bilimler (Junior Ürün Yöneticisi Hedefi)',
    labelEn: 'Business / Humanities Graduate (Associate PM Aspirant)',
    major: 'İşletme / Yeni Mezun',
    targetRole: 'Associate Product Manager (APM)',
    targetRoleEn: 'Associate Product Manager (APM)',
    content: `1. Tamamlanan Eğitimler:
- Coursera: Digital Product Management: Modern Fundamentals (University of Virginia)
- Scrum.org PSPO I Hazırlık Kursu (Agile, Sprint planlama, User Story yazımı)
- Design Thinking ve Kullanıcı Araştırması Atölyesi (4 haftalık bootcamp)

2. Bildiğim Araçlar:
- Figma (Temel wireframe ve kullanıcı akış diyagramı çizimi)
- Jira & Trello (Backlog düzenleme ve görev takibi)
- Notion (Ürün gereksinim dokümanı - PRD taslakları hazırlama)

3. Projeler:
- Üniversite girişimcilik kulübünde 0'dan 1'e kampüs içi ikinci el kitap takas uygulaması fikri için kullanıcı görüşmeleri yapıldı ve PRD yazıldı.`,
    contentEn: `1. Completed Trainings:
- Coursera: Digital Product Management Fundamentals (UVA)
- Scrum Product Owner Foundations (Agile sprints, backlog grooming, user story acceptance criteria)
- 4-Week User Centric Design Thinking Workshop

2. Tools Acquired:
- Figma (Low-fidelity wireframing & user flow diagrams)
- Jira & Trello (Kanban boards, backlog tracking)
- Notion (PRD documentation drafting)

3. Projects:
- Led campus entrepreneurship club project: Conducted 25 user interviews and authored full PRD for a student textbook exchange app.`,
  },
];
