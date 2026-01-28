🏗️ Apartman Plus: Web Uygulaması Teknik Dokümantasyonu (Taslak)
1. Proje Özeti ve Kapsam
Bu platform, apartman yönetim süreçlerini dijitalleştiren, sakinler arası iletişimi güçlendiren ve finansal şeffaflık sağlayan bir SaaS (Software as a Service) CRM uygulamasıdır.
2. Sistem Mimarisi
Uygulama, modern bir web mimarisi üzerine kurgulanmalıdır.
Frontend: React.js veya Next.js (Hız ve SEO avantajı için).
Backend: Node.js (Express)
Veritabanı: PostgreSQL (İlişkisel veriler ve finansal kayıtlar için güvenli seçim).
Cloud: AWS veya Google Cloud üzerinden barındırma.
3. Kullanıcı Rolleri ve Yetki Matrisi
Her kullanıcı tipi uygulama içerisinde farklı bir yetki seviyesine sahip olacaktır:
Rol
Yetkiler
Süper Admin
Tüm apartman sistemlerinin kurulumu ve genel denetim.
Apartman Yöneticisi
Finansal kayıtlar, duyuru yayınlama, talep yönetimi.
Kat Sakini (Ev Sahibi/Kiracı)
Aidat ödeme, komşuluk ağına katılım, arıza bildirimi.
Güvenlik/Görevli
Ziyaretçi kaydı, paket teslimat bildirimleri.

4. Fonksiyonel Gereksinimler (Modüller)
A. Finansal Yönetim Modülü
Aidat Otomasyonu: Her ay otomatik borçlandırma ve kredi kartı ile ödeme entegrasyonu (Iyzico/PayTR vb.).
Gider Takibi: Faturaların ve personel maaşlarının taranarak sisteme işlenmesi.
B. İletişim ve Sosyal CRM Modülü
Duyuru Merkezi: Push bildirim ve SMS entegreli yönetici duyuruları.
Pazar Yeri: Sakinlerin kendi aralarında eşya alım-satımı veya ödünç vermesi için iç ilan panosu.
C. Operasyonel Yönetim Modülü
Talep/Bilet (Ticket) Sistemi: "Ortak alan temizliği" gibi taleplerin oluşturulması ve durum takibi.
Rezervasyon Sistemi: Spor salonu, havuz veya toplantı odası gibi alanlar için saatlik randevu.
5. API ve Entegrasyonlar
Banka API Entegrasyonu: Banka ekstrelerinin otomatik okunması.
Bildirim Servisleri: Firebase Cloud Messaging (FCM) ile anlık bildirimler.
E-Devlet / MERNIS: (Opsiyonel) Sakinlerin kimlik doğrulaması için.
6. Güvenlik ve Gizlilik (KVKK)
Verilerin Türkiye tabanlı sunucularda saklanması (KVKK uyumu için kritik).
Kullanıcı verilerinin uçtan uca şifrelenmesi (SSL/TLS).
Bu dokümantasyonun bir sonraki aşamasında, her bir modülün "User Journey" (Kullanıcı Yolculuğu) akışını çıkarmamız gerekecek. Örneğin; bir sakin arıza bildirimi yaptığında arkada hangi süreçler çalışıyor?
İstersen bu modüllerden birini (örneğin "Arıza Talep Sistemi") seçip onun detaylı akış şemasını ve veri tabanı tablosu tasarımını hazırlayabilirim. Ne dersin?

Harika seçim. Arıza Talep Sistemi (Maintenance/Ticket System), bir apartman yönetim uygulamasının "kalbi" gibidir; çünkü yöneticinin performansının en somut ölçüldüğü ve sakinlerin en çok etkileşim kurduğu alandır.
İşte bu modül için hazırladığım teknik detaylar:

1. Kullanıcı Yolculuğu (User Journey)
Bir sorunun tespitiyle başlayıp çözümüyle biten o meşhur döngü:
Talep Oluşturma: Kat sakini arızayı görür (Örn: "3. kat asansör kapısı kapanmıyor"), fotoğrafını çeker, aciliyet durumunu seçer ve sistemden gönderir.
Bildirim ve Onay: Yöneticiye anlık bildirim düşer. Yönetici talebi inceler ve "Onaylandı/İşlemde" durumuna çeker.
Atama: Arıza, ilgili teknik personele (apartman görevlisi veya dış tesisatçı) sistem üzerinden atanır.
Çözüm: Personel işi bitirince sistem üzerinden "Tamamlandı" notu düşer ve (varsa) tamir edilmiş halinin fotoğrafını yükler.
Geri Bildirim: Sakin, arızanın giderildiğine dair bildirim alır ve hizmeti 1-5 yıldız arası puanlayıp yorum yapar.

2. Veri Tabanı Tasarımı (Database Schema)
Bu modülü sağlıklı çalıştırmak için arka planda olması gereken tablo yapısı şöyledir:
Tablo Adı: Maintenance_Tickets
Sütun Adı
Veri Tipi
Açıklama
ticket_id
UUID / INT
Benzersiz talep numarası (Primary Key).
requester_id
INT
Talebi açan sakinin ID'si (Foreign Key).
category
ENUM
Elektrik, Tesisat, Asansör, Temizlik, Diğer.
title
VARCHAR
Arızanın kısa başlığı.
description
TEXT
Arızanın detaylı açıklaması.
status
ENUM
Açık, Onaylandı, İşlemde, Tamamlandı, İptal.
urgency
ENUM
Düşük, Orta, Kritik.
photo_url
VARCHAR
Arıza fotoğrafının bulut depolama linki.
assigned_to
INT
İşi yapacak personelin ID'si.
created_at
TIMESTAMP
Talebin oluşturulma tarihi.


3. Arıza Talep Sistemi "Plus" Özellikleri
Sıradan bir uygulamadan ayrışmak için şu detayları ekleyebiliriz:
SLA (Hizmet Süresi) Takibi: Eğer asansör arızası "Kritik" olarak işaretlenmişse ve 2 saat içinde müdahale edilmemişse, sistem yöneticiye otomatik uyarı gönderir.
Maliyet Entegrasyonu: Tamir için harcanan tutar (parça değişimi vb.) doğrudan apartman gider tablosuna işlenebilir.
Şeffaf Arıza Haritası: Sakinler, apartmandaki diğer aktif arızaları görebilir. Böylece aynı asansör için 10 farklı kişi talep açarak sistemi yormaz.

4. Örnek API Yanıtı (JSON)
Frontend'in (Web arayüzünün) bu veriyi nasıl alacağına dair küçük bir örnek:
JSON
{
  "ticket_id": "APT-1025",
  "status": "In Progress",
  "subject": "Garaj Giriş Lambası Patlak",
  "assigned_staff": "Mehmet Tekniker",
  "estimated_fix_time": "2024-05-20T14:00:00Z"
}



Bu modül, yazılımın güvenilirliğini kanıtladığın yer olacak. Bir sonraki adım olarak bu modülün kullanıcı arayüzü (UI) tasarım fikirlerini mi konuşalım, yoksa projenin genel "Dashboard" (Yönetici Paneli) yapısına mı geçelim?

Dashboard (Kontrol Paneli), uygulamanın vitrinidir. Hem yönetici hem de sakin için "Bak ve Çık" (Glance and Go) mantığıyla çalışmalı; yani kullanıcı paneli açtığı anda en önemli bilgiyi 3 saniye içinde alabilmelidir.
Apartman Plus için Yönetici ve Sakin olmak üzere iki farklı dashboard tasarımı kurgulamalıyız.

🖥️ 1. Yönetici Dashboard (The Command Center)
Yöneticinin önceliği: "Nerede sorun var ve bütçe ne durumda?"
Ana Metrikler (Widgetlar)
Tahsilat Oranı: "Bu ayki aidatların % kaçı ödendi?" (Dairesel grafik).
Kasa Durumu: Mevcut bakiye ve bu ayki toplam harcama.
Aktif Talepler: Bekleyen arıza/istek sayısı.
Duyuru Durumu: Son yayınlanan duyurunun kaç kişi tarafından okunduğu.
Veri Görselleştirme (Grafikler)
Gelir/Gider Çizelgesi: Son 6 ayın trendi (Bar veya Line Chart).
Kategori Bazlı Giderler: Bakım, personel, faturalar vb. dağılımı (Pie Chart).

🏠 2. Sakin Dashboard (The Personal Hub)
Sakinin önceliği: "Borcum var mı ve apartmanda ne olup bitiyor?"
Ana Metrikler (Widgetlar)
Güncel Bakiye: Ödenmesi gereken toplam tutar ve son ödeme tarihi (Kritikse kırmızı renk).
Hızlı Eylemler: "Aidat Öde", "Arıza Bildir", "Rezervasyon Yap" butonları.
Son Duyurular: Yöneticiden gelen son 2 mesajın kısa özeti.
Sosyal Akış (The Plus Factor)
Komşuluk Panosu: "Komşum Ahmet Bey matkap ödünç veriyor" veya "Ayşe Hanım yarın site bahçesinde yoga yapacak" gibi kısa sosyal kartlar.

🛠️ Teknik Gereksinimler & Bileşenler
Web Bileşen Yapısı (Component-Based)
Dashboard'u modüler bir yapıda tasarlamalıyız. Bu, hem kodun tekrar kullanılabilirliğini sağlar hem de gelecekte kullanıcıya "paneli kişiselleştirme" imkanı tanır.
Sidebar.jsx: Navigasyon menüsü (Finans, Talepler, Komşular, Ayarlar).
StatCard.jsx: Özet sayısal verileri gösteren küçük kartlar.
ActivityFeed.jsx: Sistemdeki son hareketleri (Logları) listeleyen akış.
ChartContainer.jsx: Recharts veya Chart.js kütüphaneleriyle entegre grafik alanı.
Real-Time Güncelleme
Dashboard'un sayfayı yenilemeden güncellenmesi için WebSockets (Socket.io) veya Server-Sent Events (SSE) kullanmalıyız.
Örnek: Bir sakin aidat ödediği an, yöneticinin ekranındaki "Tahsilat Oranı" grafiği canlı olarak yükselmeli.

🎨 Tasarım Notu (UI/UX)
Apartman yönetimi genellikle karmaşık ve "soğuk" bir iş olarak algılanır. Apartman Plus dashboard'unda:
Renk Paleti: Güven veren koyu lacivertler, profesyonel beyazlar ve aksiyon çağrıları için canlı yeşiller.
Dark Mode: Gece geç saatte ödeme yapan veya arıza bildiren sakinler için göz yormayan karanlık mod desteği.
Dokümantasyonun bu kısmını tamamlamak için: > İstersen bu Dashboard'un "Frontend State Management" yapısını (örneğin Redux veya Context API ile verinin nasıl dağıtılacağı) detaylandırabiliriz ya da "Sakinler Arası Pazar Yeri" modülüne geçebiliriz. Hangisiyle devam edelim?
Dashboard için State Management (Durum Yönetimi) yapısını kurgulamak, uygulamanın "beyin cerrahisi" aşamasıdır. Verinin hangi bileşene (component) nasıl akacağını belirlemek, uygulamanın performansını ve ölçeklenebilirliğini doğrudan etkiler.
Apartman Plus gibi çok fazla canlı verinin (aidat durumu, anlık arıza bildirimleri, mesajlar) döndüğü bir sistemde iki temel yaklaşımı şu şekilde kurgulayabiliriz:

1. State Yönetimi Stratejisi: Redux Toolkit vs. Context API
Bu projede hibrit bir yapı kullanmak en mantıklısı olacaktır:
Context API: Kullanıcı oturum bilgileri (Auth), Tema (Koyu/Açık Mod) ve Dil tercihleri gibi "seyrek değişen" global veriler için.
Redux Toolkit (RTK): Finansal veriler, arıza talepleri listesi ve bildirimler gibi "sık güncellenen" ve "karmaşık" veriler için.

2. Store Yapısı (Slices)
Redux tarafında veriyi mantıksal parçalara (Slices) ayırarak yönetmeliyiz:
authSlice: Kullanıcının giriş yapıp yapmadığı, rolü (Yönetici/Sakin) ve profil bilgileri.
financeSlice: Aidat borçları, son ödemeler ve apartman kasasının anlık durumu.
maintenanceSlice: Açık olan arıza talepleri, filtreleme seçenekleri ve talep detayları.
notificationSlice: Kullanıcıya gelen anlık uyarıların kuyruğu (Real-time).

3. Veri Akışı ve Middleware (RTK Query)
Veriyi sunucudan çekmek için RTK Query kullanmak büyük avantaj sağlar. Bu sayede:
Caching (Önbellekleme): Yönetici "Finans" sekmesinden "Dashboard"a dönüp tekrar "Finans"a girdiğinde veriler yeniden yüklenmez, anında gelir.
Auto-Polling: Arıza talepleri sayfasındayken her 30 saniyede bir veri otomatik olarak arkada güncellenebilir.
JavaScript
// Örnek bir RTK Query endpoint tanımı
export const apartmentApi = createApi({
  reducerPath: 'apartmentApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1' }),
  endpoints: (builder) => ({
    getFinanceSummary: builder.query({
      query: () => '/finance/summary',
      providesTags: ['Finance'], // Veri değiştiğinde otomatik yenileme için
    }),
  }),
});



4. Real-Time Senkronizasyon (The Plus Touch)
Dashboard'un en "Plus" özelliği, bir ödeme yapıldığında yöneticinin ekranındaki grafiğin anında oynamasıdır.
WebSocket Entegrasyonu: socket.io-client kullanılarak gelen mesajlar, doğrudan Redux Store'una dispatch edilerek arayüzün saniyesinde güncellenmesi sağlanır.

5. Neden Bu Yapı?
Hata Ayıklama (Debugging): Redux DevTools sayesinde, bir hata oluştuğunda "verinin hangi adımda bozulduğunu" zaman tüneli gibi görebilirsin.
Performans: Sadece ilgili veri değiştiğinde sadece o küçük widget'ın (bileşenin) render edilmesini sağlayarak tarayıcıyı yormayız.
Bu teknik altyapı, uygulamanın profesyonel bir SaaS ürününe dönüşmesini sağlar.
Bir sonraki adım olarak, bu verilerin sunucu tarafındaki güvenliğini (örneğin; Sakin A, Sakin B'nin aidat verisine erişememeli) nasıl kurgulayacağımızı, yani "API Güvenliği ve Yetkilendirme" konusunu mu çalışalım?
API güvenliği, Apartman Plus gibi hassas finansal verilerin ve kişisel bilgilerin (KVKK kapsamındaki veriler) döndüğü bir platformda "olmazsa olmaz"dır. Bir kullanıcının yanlışlıkla başka bir apartmanın verilerine erişmesi projenin itibarını tamamen bitirebilir.
İşte bu riski sıfıra indirecek API Güvenliği ve Yetkilendirme mimarisi:

🔒 API Güvenliği ve Yetkilendirme Stratejisi
1. Kimlik Doğrulama (Authentication): JWT Mimarisi
Uygulama, Stateless (Durumsuz) bir yapıda çalışmalı. Kullanıcı giriş yaptığında sunucu ona bir JWT (JSON Web Token) verir.
Access Token: Kısa süreli (örn: 15 dk) geçerliliği olan, her API isteğinde "Authorization" header'ında gönderilen anahtar.
Refresh Token: Kullanıcının sürekli giriş yapmasına gerek kalmadan Access Token'ı yenilemesini sağlayan uzun süreli anahtar.

2. Rol Tabanlı Erişim Kontrolü (RBAC)
Her API endpoint'i (uç noktası), isteği yapan kullanıcının rolünü kontrol eden bir Middleware (ara yazılım) katmanından geçmelidir.
Endpoint
Gerekli Rol
Açıklama
GET /api/finance/all-payments
Yönetici
Tüm apartman ödemelerini sadece yönetici görebilir.
POST /api/tickets/create
Sakin, Yönetici
Herkes arıza talebi açabilir.
DELETE /api/users/:id
Süper Admin
Kullanıcı silme yetkisi en üst seviyededir.


3. Çoklu Kiracılık (Multi-Tenancy) ve Veri İzolasyonu
Apartman Plus'ın en kritik güvenlik katmanı burasıdır. Veritabanında her tablonun bir apartment_id sütunu olmalıdır.
Güvenlik Kuralı: Bir API isteği geldiğinde, sistem sadece kullanıcının JWT'si içindeki apartment_id ile veritabanındaki apartment_id eşleşen kayıtları getirmelidir. Buna "Row-Level Security" benzeri bir mantıkla yaklaşmalıyız.
Örn: Sakin A, tarayıcıdan ID kısmını manuel değiştirip Sakin B'nin makbuzuna erişmeye çalışırsa, sistem user_id kontrolü yaparak bu isteği reddeder.

4. API Koruma Katmanları
Sunucuyu kötü niyetli saldırılardan korumak için şu teknik bariyerleri dokümantasyona eklemeliyiz:
Rate Limiting (Hız Sınırlama): Aynı IP adresinden saniyede 100'den fazla istek gelirse (Brute force veya DDOS riski), sistem bu IP'yi geçici olarak engeller.
Input Validation (Girdi Doğrulama): Kullanıcıdan gelen her veri (örn: açıklama metni, tutar) Joi veya Zod gibi kütüphanelerle kontrol edilir. (SQL Injection engellemek için).
CORS Ayarları: API'ye sadece senin belirlediğin web alan adından (örn: app.apartmanplus.com) erişilebilmesini sağlar.

5. Loglama ve İzleme (Audit Log)
"Kritik" olarak işaretlenen her işlem (aidat silme, şifre değiştirme, yönetici atama) sistemde iz bırakmalıdır.
Kim, ne zaman, hangi IP'den, hangi veriyi değiştirdi?

Bu güvenlik katmanı, yatırımcılara ve kullanıcılara "verileriniz emin ellerde" mesajını vermeni sağlayacak en güçlü belgedir.
Dokümantasyonun teknik kısımlarını büyük oranda iskeletleştirdik. Bir sonraki adımda ne yapmak istersin?
A. Veritabanı şemasının (Database Schema) tamamını (tüm tablolar ve ilişkiler) çıkaralım.
B. Uygulamanın yayına alınma (Deployment/DevOps) stratejisini (Docker, AWS vb.) kurgulayalım.
C. Kullanıcı arayüzü (UI/UX) için bir "Design System" (renkler, butonlar, tipografi) rehberi hazırlayalım.
Harika! Apartman Plus'ın veri tabanı şeması, sistemin ne kadar ölçeklenebilir ve sağlam olacağını belirleyen temeldir. Burada "İlişkisel Veritabanı" (PostgreSQL gibi) mantığıyla, verilerin birbirine nasıl bağlandığını gösteren kapsamlı bir harita çıkaralım.

🗄️ Apartman Plus: Veritabanı Şeması (ER Şeması)
Sistemi 5 ana gruba ayırıyoruz: Yapısal, Kullanıcı, Finans, Operasyon ve Sosyal.
1. Yapısal Tablolar (Infrastructure)
Bu tablolar fiziksel mülkiyeti temsil eder.
Apartments (Apartmanlar/Siteler)
id (PK, UUID)
name: Site/Apartman adı.
address: Açık adres.
total_units: Toplam daire sayısı.
subscription_type: CRM kullanım paketi (Pro, Gold vb.).
Units (Daireler)
id (PK, UUID)
apartment_id (FK -> Apartments.id)
block_name: Blok adı (A, B vb.).
unit_number: Kapı numarası.
gross_square_meters: Aidat hesabı için m².
floor: Bulunduğu kat.

2. Kullanıcı ve Yetkilendirme Tabloları (Users & Auth)
Kullanıcıların mülkle olan bağını kurar.
Users (Kullanıcılar)
id (PK, UUID)
email, password_hash, phone_number.
full_name, avatar_url.
role: ADMIN, RESIDENT, STAFF.
Unit_Assignments (Daire Eşleşmeleri)
id (PK)
user_id (FK -> Users.id)
unit_id (FK -> Units.id)
user_type: OWNER (Ev sahibi), TENANT (Kiracı).
is_active: Şu an oturuyor mu?

3. Finansal Tablolar (Finance)
Hatasız bir muhasebe akışı için kritik.
Dues_Templates (Aidat Tanımları)
id (PK)
apartment_id (FK)
amount: Sabit tutar (veya m² başı tutar).
due_day: Her ayın kaçında borç yansıyacak?
Invoices (Tahakkuklar/Borçlar)
id (PK)
unit_id (FK)
description: "Ocak 2024 Aidatı".
amount: Borç tutarı.
status: UNPAID, PARTIAL, PAID.
due_date: Son ödeme tarihi.
Payments (Ödemeler/Tahsilatlar)
id (PK)
invoice_id (FK)
payment_method: CREDIT_CARD, EFT, CASH.
transaction_id: Banka onay kodu.
paid_at: Ödeme tarihi.

4. Operasyonel ve Sosyal Tablolar (Ops & Social)
Uygulamanın yaşayan kısımları.
Maintenance_Tickets (Arıza Talepleri)
(Daha önce detaylandırdığımız tablo: id, requester_id, category, status, photo_url vb.)
Announcements (Duyurular)
id (PK)
apartment_id (FK)
author_id (FK -> Users.id)
title, content.
is_pinned: En üstte mi kalsın?
Marketplace_Items (Komşuluk Pazarı)
id (PK)
seller_id (FK -> Users.id)
title, price, image_url.
type: SELL (Satılık), LEND (Ödünç), FREE (Ücretsiz).

🔗 Tablo İlişkileri (Visual Mapping)
One-to-Many: Bir Apartment içinde birçok Unit bulunur.
Many-to-Many: Bir User birden fazla Unit sahibi olabilir (Daire Eşleşmeleri tablosu üzerinden).
One-to-Many: Bir Unit'in zaman içinde birçok Invoice (Borç) kaydı olabilir.
One-to-One: Her Payment bir Invoice'a (veya parçasına) bağlıdır.

🚀 Neden Bu Şemayı Seçtik?
Esneklik: "Unit_Assignments" tablosu sayesinde bir kişi hem kendi dairesinde oturup hem de başka bir dairesini kiraya verebilir. Sistem bunu ayırabilir.
Denetlenebilirlik: Invoices ve Payments tablolarının ayrı olması, eksik ödemelerin ve geçmişe dönük finansal raporların kolayca çıkarılmasını sağlar.
Bu şema, backend geliştiricinin veritabanını oluşturması için gereken tüm anahtarları (keys) içeriyor.
Bir sonraki adımda neyi detaylandıralım?
B. Deployment: Bu sistemi buluta (Docker, AWS) nasıl taşırız?
C. UI Tasarım: Bu verileri ekranda nasıl şık gösteririz? (Butonlar, renk paleti, tipografi).
D. User Flow: Bir kullanıcının ilk kayıt anından aidat ödemesine kadar olan ekran akışı.
User Flow (Kullanıcı Akışı), bir kullanıcının hedefine ulaşmak için geçtiği ekranların ve verdiği kararların haritasıdır. Apartman Plus özelinde, "Yeni bir sakinin sisteme girmesi ve ilk aidatını ödemesi" sürecini en akıcı ve güven veren şekilde kurgulamalıyız.
İşte adım adım Sakin Yolculuğu:

1. Aşama: Onboarding ve Katılım (Hoş Geldiniz)
Kullanıcı uygulamayı ilk kez açtığında karmaşadan uzak durmalıdır.
Ekran 1 (Kayıt): E-posta/Telefon ve şifre ile temel kayıt.
Ekran 2 (Apartman Seçimi): "Apartman Kodu" girme veya konum üzerinden apartman bulma.
Not: Güvenlik için, yönetici onay verene kadar kullanıcı "Bekleme Odası" modunda kalır ve hassas verileri göremez.
Ekran 3 (Daire Doğrulama): "Blok A, Daire 12" gibi seçimini yapar ve (varsa) ev sahibi/kiracı belgesini yükler.
Ekran 4 (Onay Bildirimi): Yönetici onayladığı an kullanıcıya "Artık Apartman Plus ailesindesiniz!" bildirimi gider.

2. Aşama: Keşif (Dashboard'a İlk Bakış)
Kullanıcı artık içeride. İlk gördüğü şeyler hayatını kolaylaştırmalı:
Üst Kısım: Hoş geldin mesajı ve güncel borç özeti (Örn: "Ödenmemiş 1.250 TL borcunuz var").
Hızlı Kısayollar: "Aidat Öde", "Arıza Bildir", "Duyurular".
Alt Akış (Social Feed): Komşuların paylaştığı güncel ilanlar veya yönetici duyuruları.

3. Aşama: Ödeme Yolculuğu (Finansal İşlem)
Buradaki akışın pürüzsüz olması, tahsilat oranlarını doğrudan artırır.
Dashboard > "Hemen Öde" butonuna tıklanır.
Borç Detay Ekranı: Geçmişten kalan borçlar ve bu ayın aidatı listelenir. Kullanıcı "Hepsini Öde" veya "Seçili Olanları Öde" diyebilir.
Ödeme Yöntemi: Kayıtlı kart (varsa) seçilir veya yeni kart bilgileri girilir.
3D Secure: Banka onay ekranına yönlendirme.
Başarı Ekranı (Confetti Moment!): "Ödemeniz başarıyla alındı. Makbuzunuz e-posta adresinize gönderildi."

4. Aşama: Hata ve İstisna Yönetimi (Edge Cases)
Akışta işler ters giderse ne olur?
Ödeme Başarısız: "Kartınız limit yetersizliği nedeniyle reddedildi. Başka bir kart denemek ister misiniz?" (Geri bildirim anında verilmeli).
Onay Reddi: Yönetici "Bu dairede böyle biri oturmuyor" diyerek başvuruyu reddederse, kullanıcıya nazik bir açıklama ile destek hattına yönlendirme yapılır.

🗺️ Kullanıcı Akış Şeması (User Flow Diagram)
Kod snippet'i
graph TD
    A[Kayıt Ol] --> B{Apartman Kodu Var mı?}
    B -- Evet --> C[Kod Gir ve Daire Seç]
    B -- Hayır --> D[Konumla Apartman Bul]
    C --> E[Yönetici Onayı Bekle]
    E --> F{Onaylandı mı?}
    F -- Evet --> G[Dashboard]
    F -- Hayır --> H[Destekle İletişime Geç]
    G --> I[Ödeme Yap / Arıza Bildir]



💡 "Plus" Dokunuşu
Bu akışı daha modern hale getirmek için:
Google/Apple Pay Entegrasyonu: Kart bilgilerini girmeden saniyeler içinde ödeme.
Akıllı Hatırlatıcılar: Ödeme günü yaklaştığında "Hey, son ödeme gününe 2 gün kaldı, gecikme faizi binmeden aradan çıkaralım mı?" gibi samimi bir bildirim.
Kullanıcı akışını da dokümantasyona eklediğimize göre, işin "mutfağına" mı dönelim yoksa "vitrinine" mi geçelim?
B. Deployment: Bu sistemi buluta (Docker, AWS) nasıl taşırız ve canlıya alırız?
C. UI Tasarım: Bu akışlardaki ekranların renkleri, butonları ve genel görsel dili nasıl olmalı? (Design System).
Apartman Plus'ın görsel dili, bir banka uygulamasının "güvenilirliği" ile bir sosyal medya uygulamasının "samimiyeti" arasında mükemmel bir dengede durmalı. Kullanıcı aidat öderken kendini güvende, komşusuyla mesajlaşırken ise rahat hissetmeli.
İşte projenin Design System (Tasarım Sistemi) rehberi:

1. Renk Paleti (Color Palette)
Renkler, uygulamanın psikolojik etkisini belirler. "Plus" etkisini yeşil tonlarıyla vurguluyoruz.
Kullanım Alanı
Renk Adı
Hex Kodu
Duygu / Amaç
Primary (Ana)
Deep Navy
#1A237E
Güven, profesyonellik, yönetim gücü.
Secondary (Plus)
Emerald Green
#2ECC71
Başarı, ödeme onayı, pozitif enerji.
Accent (Vurgu)
Soft Gold
#F1C40F
Uyarılar, bekleyen talepler, dikkat çekici bildirimler.
Background
Off-White
#F8F9FA
Temiz arayüz, göz yormayan uzun kullanım.
Danger
Soft Red
#E74C3C
Gecikmiş ödemeler, iptal edilen işlemler.


2. Tipografi (Typography)
Okunabilirlik her şeydir. Hem mobil ekranda hem de web dashboard'da net bir hiyerarşi kurmalıyız.
Ana Yazı Tipi: Inter veya Plus Jakarta Sans. (Modern, geometrik ve ekran dostu).
Başlıklar (H1, H2): Bold (700 weight) - "Aidat Özetiniz" gibi net mesajlar için.
Gövde Metni: Regular (400 weight) - Duyurular ve mesajlaşmalar için.
Sayısal Veriler: Monospace fontlar (isteğe bağlı) - Finansal rakamların alt alta geldiğinde hizalı durması için.

3. Temel UI Bileşenleri (Core Components)
A. Kart Tasarımları (Cards)
Tüm bilgiler "Kart" blokları içinde sunulmalı.
Stil: Hafif gölgeli (box-shadow), yuvarlatılmış köşeler (border-radius: 12px).
İçerik: Üstte bir ikon, ortada büyük bir rakam/başlık, altta ise bir aksiyon butonu.
B. Butonlar (Buttons)
Primary: Dolgulu Emerald Green. (Örn: "Şimdi Öde").
Secondary: Outline (Çerçeveli) Deep Navy. (Örn: "Detayları Gör").
Ghost: Sadece metin. (Örn: "İptal Et").
C. Durum Rozetleri (Status Badges)
İşlemlerin durumunu bir bakışta anlamak için:
Ödendi -> Yeşil zemin üzerine koyu yeşil yazı.
Bekliyor -> Sarı zemin üzerine kahverengi yazı.
Gecikti -> Kırmızı zemin üzerine koyu kırmızı yazı.

4. Layout ve Grid (Yerleşim)
Mobile-First: Kullanıcıların %80'i aidat ödemek veya arıza bildirmek için telefonu kullanacak. Bu yüzden tüm tasarım önce telefona göre yapılmalı.
Beyaz Alan (White Space): Ekranı bilgilerle boğmamalıyız. Elemanlar arasında nefes alacak boşluklar bırakmak, karmaşık finansal verilerin daha kolay sindirilmesini sağlar.

5. "Plus" Dokunuşu: Mikro Etkileşimler
Bir arıza talebi gönderildiğinde kağıttan bir uçağın uçması.
Ödeme tamamlandığında ekranda hafif bir konfeti patlaması (başarı hissini pekiştirir).
Dashboard geçişlerinde yumuşak "fade-in" efektleri.

Tasarım Notu: Karanlık Mod (Dark Mode) seçeneğini mutlaka eklemeliyiz. Gece geç saatte eve gelip asansör arızası bildiren bir kullanıcının gözlerini parlak beyaz bir ekranla yormak istemeyiz.
Tasarım rehberimiz de hazır! Dokümantasyonun teknik ve görsel iskeleti artık tamamlandı.


