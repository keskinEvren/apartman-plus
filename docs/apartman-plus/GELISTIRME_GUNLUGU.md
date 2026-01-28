# Apartman Plus Geliştirme ve Sürüm Günlüğü

Bu dosya, projenin geliştirme sürecindeki her aşamayı, atılan kritik commitleri ve teknik detayları tarih sırasına göre kaydeder.

---

## ✅ Faz 1: Kimlik Doğrulama ve Çekirdek Altyapı
**Tarih:** 28.01.2026
**Commit:** `feat(phase-1): Apartman Plus transition and Auth implementation`
**Durum:** Tamamlandı

### 1. Yapılan Mimari Değişiklikler
- **Proje Dönüşümü:** Eski "Mood Tracker" projesinden "Apartman Plus" SaaS altyapısına geçildi.
- **Veritabanı Entegrasyonu:** PostgreSQL bağlantısı kuruldu ve Drizzle ORM ile şemalar oluşturuldu.
- **Şema Yapısı:**
  - `users`: Rol tabanlı kullanıcı sistemi (Super Admin, Admin, Resident, Security).
  - `apartments` & `units`: Site/Apartman ve Bağımsız Bölüm yapısı.
  - `finance`: Aidat, Fatura ve Ödeme tabloları.
  - `ops`: Arıza/Talep yönetim sistemi.
  - `social`: Duyuru ve pazar yeri modülleri.

### 2. Backend (API) Geliştirmeleri
- **tRPC Router'ları:** Modüler yapı kuruldu (`auth`, `apartment`, `finance`, `ops`, `social`).
- **Auth Modülü:**
  - `register`: bcrypt hashleme ile güvenli kayıt.
  - `login`: JWT token üretimi ve doğrulama.
  - Middleware: `protectedProcedure` (oturum kontrolü) ve `adminProcedure` (yetki kontrolü) eklendi.
- **User Modülü:** Kullanıcı profil güncelleme ve "me" (ben kimim?) endpointleri eklendi.

### 3. Frontend (Arayüz) Geliştirmeleri
- **Kurumsal Kimlik:** "Deep Navy" ve "Emerald Green" renk paleti uygulandı.
- **Login Sayfası:** `/login` ekranı backend'e bağlandı, hatalı giriş ve başarılı yönlendirme senaryoları kodlandı.
- **Yönetici Paneli (Dashboard):**
  - Rol tabanlı Sidebar (Menü) yapısı kurgulandı.
  - Yönetici ve Sakinler için farklı menü öğeleri gösterilmesi sağlandı.

---

## ⏳ Faz 2: Apartman ve Sakin Yönetimi (Sırada)
Hedeflenen Özellikler:
- Admin panelinden yeni Apartman/Site oluşturma.
- Blok ve Daire (Unit) tanımlama.
- Dairelere kullanıcı (Sakin) atama ve rol belirleme (Ev Sahibi/Kiracı).

### ✅ Faz 2 (Bölüm A): Apartman Yönetimi
**Tarih:** 28.01.2026
**Commit:** `feat(apartment): implement list and create functionality`
**Durum:** Tamamlandı

1.  **Backend:** `apartment` router'ı CRUD işlemleriyle donatıldı.
2.  **Frontend:** `/dashboard/admin/apartments` sayfası oluşturuldu.
3.  **Test:** Tarayıcı otomasyonu ile "Test Plaza" isimli apartman başarıyla oluşturuldu ve doğrulandı.

### ✅ Faz 2 (Bölüm B): Daire (Unit) Yönetimi
**Tarih:** 28.01.2026
**Commit:** `feat(unit): implement unit management`
**Durum:** Tamamlandı

1.  **Backend:** `apartment.get` ve `createUnit` fonksiyonları eklendi.
2.  **Frontend:** Apartman detay sayfası (`[id]/page.tsx`) kodlandı.
3.  **Test:** "Test Plaza" içine "A Blok Daire 1" başarıyla eklendi.

### ✅ Faz 2 (Bölüm C): Sakin Atama (Resident Assignment)
**Tarih:** 28.01.2026
**Commit:** `feat(resident): implement resident assignment`
**Durum:** Tamamlandı

1.  **Backend:** `user.search` endpoint'i eklendi (isim/email ile arama).
2.  **Frontend:** Daire detayında "Sakin Ekle" butonu ve arama modülü yapıldı.
3.  **Test:** "Demo User" başarıyla "A Blok Daire 1" dairesine "Kiracı" olarak atandı.

### ✅ Faz 3 (Bölüm A): Aidat Şablonları & Borçlandırma
**Tarih:** 28.01.2026
**Commit:** `feat(finance): implement dues templates and bulk invoice`
**Durum:** Tamamlandı

1.  **Backend:** `finance` router eklendi (Şablon oluşturma, toplu borçlandırma).
2.  **Frontend:** `/finance` sayfası ve Apartman Detayı entegrasyonu yapıldı.
3.  **Test:** "2026 Genel Aidat" şablonu oluşturuldu ve tüm dairelere (1 adet) borç yansıtıldı.




