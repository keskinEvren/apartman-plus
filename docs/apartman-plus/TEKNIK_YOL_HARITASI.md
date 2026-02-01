# Apartman Plus: Geliştirme ve Modül Yol Haritası

Bu doküman, mevcut **Apartman Plus** projesinin modüler yapısını, halihazırda var olan özelliklerini ve gelecekteki gelişim fırsatlarını teknik bir dille özetler.

## 🏗️ 1. Mevcut Modül Envanteri

Proje, modern bir SaaS mimarisi (Next.js + tRPC + Drizzle ORM) üzerinde aşağıdaki temel modüllerle kurgulanmıştır:

| Modül | Router (`src/server/routers`) | Schema (`src/db/schema`) | Durum |
| :--- | :--- | :--- | :---: |
| **Kimlik (Auth)** | `auth.ts`, `users.ts` | `users.ts` | ✅ Aktif |
| **Yapısal (Core)** | `apartment.ts` | `apartments.ts` | ✅ Aktif |
| **Finans** | `finance.ts` | `finance.ts` | ✅ Aktif |
| **Operasyon** | `ops.ts` | `ops.ts` | ✅ Aktif |
| **Sosyal** | `social.ts` | `social.ts` | ✅ Aktif |
| **Bildirimler** | `notifications.ts` | `notifications.ts` | ✅ Aktif |

---

## 🚀 2. Modül Bazlı Geliştirme Önerileri

Aşağıda her bir modül için kod incelemesi ve sektör standartlarına dayalı geliştirme önerileri listelenmiştir.

### 🔐 A. Kimlik ve Kullanıcı Yönetimi (Auth Module)
*Sorumlu Dosyalar: `auth.ts`, `users.ts`, `users.ts (schema)`*

**Mevcut Durum:**
- Temel kayıt ve giriş işlemleri.
- Rol tabanlı yetkilendirme (Admin, Resident).
- JWT tabanlı oturum yönetimi.

**Geliştirme Önerileri:**
1.  **2FA (İki Faktörlü Doğrulama):** Yönetici hesapları için zorunlu SMS veya Authenticator app desteği. Finansal verilerin güvenliği için kritiktir.
2.  **Oturum Geçmişi (Audit Logs):** "Hesabıma en son kim, nereden girdi?" sorusu için IP ve cihaz kaydı tutulmalı.
3.  **Davetiye Sistemi:** Yöneticilerin e-posta ile sakinlere "siteye katılma linki" göndermesi. Şu anki kod tabanında manuel ekleme var gibi görünüyor.
4.  **Profil Zenginleştirme:** Sakinlerin araç plakası, evcil hayvan bilgisi gibi site yönetimi için önemli detayları profillerine ekleyebilmesi.

---

### 🏢 B. Yapısal Yönetim (Apartments Module)
*Sorumlu Dosyalar: `apartment.ts`, `apartments.ts (schema)`*

**Mevcut Durum:**
- Site, blok ve daire tanımları.
- Mülk sahibi / Kiracı atamaları.

**Geliştirme Önerileri:**
1.  **Dinamik Yerleşim Haritası:** Blokların ve dairelerin görsel olarak (SVG veya Canvas ile) kroki üzerinde seçilebilir olması.
2.  **Demirbaş Takibi:** Daireye veya bloğa zimmetli demirbaşların (jeneratör, spor aletleri) envanter yönetimi.
3.  **Sözleşme Arşivi:** Kira kontratı veya tapu senedi gibi belgelerin dijital olarak daire kaydına eklenebilmesi (PDF Upload).

---

### 💳 C. Finans Modülü (Finance Module)
*Sorumlu Dosyalar: `finance.ts`, `finance.ts (schema)`*

**Mevcut Durum:**
- Aidat tahakkuku ve takibi.
- Gelir/Gider kalemleri.

**Geliştirme Önerileri:**
1.  **Sanal POS Entegrasyonu (Iyzico/Stripe):** Kullanıcıların kredi kartı ile uygulama içinden tek tıkla aidat ödeyebilmesi. Şu an manuel işaretleme yapılıyor.
2.  **Otomatik Fatura/Makbuz:** Ödeme yapıldığı an sistemin PDF makbuz oluşturup e-posta atması.
3.  **Gider Analiz Grafikleri:** "Paramız en çok nereye gidiyor?" (Elektrik, Su, Personel vb.) dağılımını gösteren pasta grafikler.
4.  **İcra Takip Modülü:** Belirli bir gün sayısını geçen borçlar için otomatik hukuki uyarı mektubu oluşturucu.

---

### 🛠️ D. Operasyon Modülü (Ops/Maintenance)
*Sorumlu Dosyalar: `ops.ts`, `ops.ts (schema)`*

**Mevcut Durum:**
- Arıza talepleri ve durum takibi (Ticket system).

**Geliştirme Önerileri:**
1.  **Tedarikçi/Taşeron Portalı:** Arızanın sadece site görevlisine değil, dışarıdan anlaşmalı tesisatçıya veya elektrikçiye de atanabilmesi ve onların sisteme sınırlı erişimi.
2.  **Periyodik Bakım Takvimi:** Asansör bakımı, havuz temizliği gibi tekrarlayan işlerin takvime işlenmesi ve gün gelince otomatik görev açılması.
3.  **QR Kod ile Talep:** Asansör veya spor salonuna yapıştırılan QR kodu okutarak hızlıca "Burada sorun var" diyebilme.

---

### 📢 E. Sosyal ve İletişim (Social Module)
*Sorumlu Dosyalar: `social.ts`, `social.ts (schema)`*

**Mevcut Durum:**
- Duyurular ve basit etkileşimler.

**Geliştirme Önerileri:**
1.  **Anket Sistemi:** "Bahçeye çardak yapılsın mı?" gibi kararlar için dijital oylama (Salt çoğunluk hesabı ile).
2.  **Etkinlik Takvimi:** Site toplantıları, ilaçlama günleri veya sosyal etkinliklerin ortak takvimde gösterilmesi.
3.  **Pazar Yeri (Marketplace):** Site içi ikinci el eşya alım-satım veya "Matkap ödünç verilir" gibi yardımlaşma ilanları.

---

### 🔔 F. Bildirim Merkezi (Notifications)
*Sorumlu Dosyalar: `notifications.ts`, `notifications.ts (schema)`*

**Mevcut Durum:**
- Site içi uyarılar.

**Geliştirme Önerileri:**
1.  **Çoklu Kanal Desteği:** Sadece uygulama içi değil, acil durumlarda (Yangın, Su kesintisi) SMS ve WhatsApp Gateway entegrasyonu.
2.  **Özelleştirilebilir Bildirimler:** Sakinin "Sadece acil duyuruları al, pazar yeri ilanlarını sessize al" diyebilmesi.

---

## 🔮 3. Gelecek Vizyonu (Future Roadmap)

Projeyi sadece bir yönetim paneli olmaktan çıkarıp bir **"Yaşam Asistanı"**na dönüştürmek için uzun vadeli hedefler:

1.  **IoT Entegrasyonu:** Plaka tanıma sistemi veya akıllı kapı kilitleri ile entegre çalışarak siteye giriş çıkışların loglanması.
2.  **Yapay Zeka (AI) Yönetici Asistanı:** "Geçen kış doğalgaza ne kadar ödemiştik?" sorusuna veritabanından cevap veren bir Chatbot.
3.  **Mobil Uygulama (React Native):** Mevcut backend'i kullanarak iOS ve Android marketler için native uygulama.

---
*Bu doküman, projenin mevcut kod yapısı incelenerek 01.02.2026 tarihinde oluşturulmuştur.*
