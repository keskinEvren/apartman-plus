Apartman Plus: Kapsamlı Proje Tanıtım Dosyası
1.0 Proje Vizyonu ve Stratejik Kapsam
1.1 Proje Özeti ve Değer Önerisi
Günümüz konut yönetiminde dijitalleşme, operasyonel verimliliği artırmak ve sakin memnuniyetini yükseltmek için stratejik bir zorunluluk haline gelmiştir. Pazardaki mevcut çözümlerin genellikle karmaşık veya tek boyutlu kalması, entegre, şeffaf ve kullanıcı dostu bir platform ihtiyacını açıkça ortaya koymaktadır. Apartman Plus, bu ihtiyaca doğrudan cevap vermek üzere tasarlanmıştır.Apartman Plus , apartman ve site yönetimi süreçlerini dijitalleştiren, sakinler arası iletişimi ve sosyal etkileşimi güçlendiren, aynı zamanda tam finansal şeffaflık sağlayan bulut tabanlı bir  SaaS (Software as a Service) CRM uygulamasıdır . Projenin temel değer önerisi; yönetimsel karmaşayı ortadan kaldırmak, tahsilat oranlarını artırmak ve modern bir komşuluk deneyimi yaratarak yaşam alanlarının değerini yükseltmektir.
1.2 Hedeflenen Kullanıcı Profilleri ve Rolleri
Platformun başarısı, farklı kullanıcı segmentlerinin ihtiyaçlarını ve platformla etkileşimlerini derinlemesine anlamaktan geçer. Her rolün yetki ve sorumluluklarının net bir şekilde tanımlanması, hem güvenli bir veri ortamı yaratır hem de her kullanıcının kendi görevine odaklanarak maksimum verim almasını sağlar.Platform erişimi, aşağıdaki Rol Tabanlı Yetki Matrisi (Role-Based Access Matrix) ile yönetilmektedir:| Rol | Yetkiler || ------ | ------ || Süper Admin | Tüm apartman sistemlerinin kurulumu, genel denetim ve en üst düzey sistem yönetimi. || Apartman Yöneticisi | Finansal kayıtları yönetme (aidat/gider takibi), duyuru yayınlama ve arıza/talep yönetimi. || Kat Sakini (Ev Sahibi/Kiracı) | Aidat ve faturaları online ödeme, komşuluk ağına (pazar yeri vb.) katılım ve arıza bildirimi yapma. || Güvenlik/Görevli | Ziyaretçi kaydı tutma ve sakinlere gelen kargo/paket teslimatları için bildirim gönderme. |
Bu net kullanıcı segmentasyonu, platformun fonksiyonel mimarisinin modüler ve role özgü bir yapıda geliştirilmesine zemin hazırlamaktadır.
2.0 Platformun Fonksiyonel Mimarisi ve Çekirdek Modülleri
2.1 Stratejik Modül Grupları
Apartman Plus'ın fonksiyonel mimarisi, salt özellik listelerinden ziyade, her kullanıcı rolünün temel iş hedeflerini gerçekleştirmesini sağlayan stratejik yetenek kümeleri olarak tasarlanmıştır. Bu üç çekirdek modül grubu, bir araya gelerek yönetim verimliliğini maksimize eden ve sakin deneyimini zenginleştiren entegre bir ekosistem oluşturur.Finansal Yönetim Modülü:
Aidat Otomasyonu:  Her ay otomatik borçlandırma oluşturur ve Iyzico/PayTR gibi ödeme ağ geçitleri entegrasyonu ile online tahsilatı mümkün kılar. Bu özellik, tahsilat süreçlerindeki gecikmeleri ve insan hatasını ortadan kaldırarak apartman nakit akışını stabilize eder ve yöneticinin stratejik görevlere odaklanmasını sağlar.
Gider Takibi:  Faturaların ve personel maaşları gibi apartman harcamalarının sisteme işlenmesini sağlayarak bütçe yönetiminde tam şeffaflık ve denetlenebilirlik sunar. Bu modül, belgelenmiş ve kategorize edilmiş harcamalarla finansal denetimi kusursuzlaştırır ve bütçe sapmalarının proaktif olarak tespit edilmesini sağlar.İletişim ve Sosyal CRM Modülü:
Duyuru Merkezi:  Yönetimin önemli duyuruları anlık bildirim (push notification) ve SMS entegrasyonu ile tüm sakinlere anında ulaştırmasını sağlar. Bu, iletişimdeki gecikmeleri ortadan kaldırarak kritik bilgi akışını garanti altına alır ve yönetimsel şeffaflığı artırır.
Pazar Yeri:  Sakinlerin kendi aralarında eşya alım-satımı veya ödünç vermesi için güvenli bir iç ilan panosu sunarak komşuluk ilişkilerini ve site içi sosyal hayatı canlandırır. Bu özellik, sakin bağlılığını artırarak yaşam alanının algılanan değerini yükseltir.Operasyonel Yönetim Modülü:
Talep/Bilet (Ticket) Sistemi:  Sakinlerin "asansör arızası" veya "ortak alan temizliği" gibi taleplerini kolayca oluşturup durumunu anlık olarak takip etmelerini sağlar. Bu sistem, tüm hizmet talepleri için denetlenebilir bir kayıt yaratarak hizmet kalitesini ölçülebilir hale getirir ve sakin memnuniyetini artırır.
Rezervasyon Sistemi:  Spor salonu, havuz veya toplantı odası gibi ortak sosyal alanlar için online randevu oluşturma imkanı tanıyarak adil ve düzenli bir kullanım planı oluşturur. Bu, ortak kaynakların verimli kullanımını maksimize eder ve olası çatışmaları önler.Bu modüllerin sorunsuz ve entegre bir şekilde çalışmasını mümkün kılan ise arkalarındaki sağlam teknik altyapıdır.
3.0 Kullanıcı Deneyimi (UX) ve Tasarım Felsefesi (UI)
3.1 Kullanıcı Akışı: Yeni Sakin Kaydı ve İlk Aidat Ödemesi
Bir SaaS platformunun başarısı, teknik üstünlüğünden önce, sunduğu kullanıcı deneyiminin akıcılığına ve sezgiselliğine bağlıdır. "Yeni bir sakinin sisteme kaydolup ilk aidatını ödemesi" gibi kritik bir akışın kusursuz tasarlanması, kullanıcı adaptasyonunu hızlandırır, platforma olan güveni tesis eder ve uzun vadeli kullanıcı bağlılığının temelini atar.3.1.1. Aşama: Onboarding ve Katılım  Bu aşamanın amacı, kullanıcıyı yormadan ve güvenli bir şekilde sisteme dahil etmektir.
Kayıt:  Kullanıcı, e-posta veya telefon numarası ve şifre ile temel bir hesap oluşturur.
Apartman Seçimi:  Kendisine verilen "Apartman Kodu"nu girerek veya konum tabanlı arama yaparak sitesini bulur.
Daire Doğrulama:  Oturduğu bloğu ve daire numarasını seçer. Bu aşamada, kullanıcının hassas verilere erişimi kısıtlıdır.
Yönetici Onayı:  Başvuru yönetici paneline düşer. Yönetici onayıyla birlikte kullanıcıya "Apartman Plus ailesine hoş geldiniz!" bildirimi gönderilir ve tüm fonksiyonlar aktif hale gelir.3.1.2. Aşama: Keşif (Dashboard'a İlk Bakış)  Kullanıcı ilk giriş yaptığında, en çok ihtiyaç duyacağı bilgilere ve eylemlere anında ulaşmalıdır.
Borç Özeti:  Ekranın en görünür yerinde güncel borç durumu net bir şekilde belirtilir.
Hızlı Kısayollar:  "Aidat Öde", "Arıza Bildir" gibi en sık kullanılan fonksiyonlar için büyük ve erişilebilir butonlar bulunur.
Sosyal Akış:  Alt bölümde ise yöneticinin son duyuruları veya komşuların pazar yeri ilanları gibi güncel bilgiler yer alır.3.1.3. Aşama: Ödeme Yolculuğu  Bu akış, tahsilat başarısı için kritik öneme sahiptir ve mümkün olan en az adımla tamamlanmalıdır.
Kullanıcı, Dashboard'daki  "Hemen Öde"  butonuna tıklar.
Borç detay ekranında ödenecek kalemleri (bu ayki aidat, geçmiş borçlar vb.) görür ve seçimini yapar.
Kayıtlı kartını seçer veya yeni kart bilgilerini girer.
Banka tarafından sağlanan  3D Secure  ekranına yönlendirilir.
İşlem tamamlandığında, "Ödemeniz başarıyla alındı" mesajını içeren bir başarı ekranı ile karşılaşır.3.1.4. Aşama: Hata ve İstisna Yönetimi  Sistem, olası aksaklıklara karşı kullanıcıyı doğru şekilde yönlendirmelidir.
Ödeme Başarısızlığı:  Limit yetersizliği gibi durumlarda, "Kartınız reddedildi. Başka bir kart denemek ister misiniz?" gibi net ve yol gösterici bir mesaj gösterilir.
Onay Reddi:  Yönetici tarafından başvurusu reddedilen kullanıcıya, destek hattına yönlendiren nazik bir açıklama sunulur.
3.2 Görsel Kimlik ve Tasarım Sistemi (Design System)
Tutarlı bir görsel dil, marka kimliğini güçlendirmenin ötesinde, kullanılabilirliği artırarak kullanıcıların platformu sezgisel bir şekilde benimsemesini sağlayan stratejik bir araçtır. Apartman Plus'ın tasarım felsefesi, bir banka uygulamasının  "güvenilirliği"  ile bir sosyal medya uygulamasının  "samimiyeti"  arasında bir denge kurmayı hedefler. Kullanıcı aidat öderken kendini güvende, komşusuyla etkileşim kurarken ise rahat hissetmelidir.
Renk Paleti  Renkler, uygulamanın psikolojik etkisini belirler ve kullanıcıyı eyleme yönlendirir.| Kullanım Alanı | Renk Adı | Hex Kodu | Duygu / Amaç || ------ | ------ | ------ | ------ || Primary (Ana) | Deep Navy | #1A237E | Güven, profesyonellik, yönetim gücü. || Secondary (Plus) | Emerald Green | #2ECC71 | Başarı, ödeme onayı, pozitif enerji. || Accent (Vurgu) | Soft Gold | #F1C40F | Uyarılar, bekleyen talepler, dikkat çekici bildirimler. || Background | Off-White | #F8F9FA | Temiz arayüz, göz yormayan uzun kullanım. || Danger | Soft Red | #E74C3C | Gecikmiş ödemeler, iptal edilen işlemler. |
Tipografi  Okunabilirlik, hem mobil hem de web arayüzlerinde net bir bilgi hiyerarşisi kurmak için esastır.
Ana Yazı Tipi:  Inter veya Plus Jakarta Sans (Modern, geometrik ve ekran dostu).
Başlıklar:   Bold (700 weight)  - Net ve dikkat çekici mesajlar için.
Gövde Metni:  Regular (400 weight) - Duyurular ve açıklamalar için.
Sayısal Veriler:  Monospace fontlar (isteğe bağlı) - Finansal rakamların hizalı ve kolay okunur olması için.
Temel UI Bileşenleri
Kart Tasarımları:  Bilgiler, hafif gölgeli ve yuvarlatılmış köşeli (border-radius: 12px) kart blokları içinde sunulur.
Butonlar:
Primary:  Dolgulu Emerald Green ("Şimdi Öde" gibi ana eylemler için).
Secondary:  Çerçeveli Deep Navy ("Detayları Gör" gibi ikincil eylemler için).
Ghost:  Sadece metin ("İptal Et" gibi daha az öncelikli eylemler için).
Durum Rozetleri:  Ödendi (Yeşil), Bekliyor (Sarı) ve Gecikti (Kırmızı) gibi renk kodlu rozetler, işlemlerin durumunu bir bakışta anlaşılır kılar.
Layout ve "Plus" Dokunuşları
Mobile-First Yaklaşımı:  Tasarım öncelikli olarak mobil cihazlar için yapılarak kullanıcıların büyük çoğunluğunun deneyimi optimize edilir.
Beyaz Alan Kullanımı:  Arayüzün ferah ve anlaşılır olması, karmaşık verilerin daha kolay sindirilmesini sağlar.
Mikro Etkileşimler:  Ödeme tamamlandığında ekranda beliren konfeti efekti veya talep gönderildiğinde uçan bir kağıt uçak animasyonu gibi küçük detaylar, kullanıcı deneyimini zenginleştirir.
Tasarım Notu  Karanlık Mod (Dark Mode) seçeneği, özellikle gece saatlerinde uygulamayı kullanan kullanıcıların göz yorgunluğunu azaltmak ve modern bir kullanım deneyimi sunmak için stratejik bir öneme sahiptir.Bu özenle hazırlanmış görsel tasarımın arkasında, platformun performansını ve güvenliğini sağlayan güçlü bir teknik mimari bulunmaktadır.
4.0 Teknik Mimari ve Veri Yönetimi
4.1 Sistem Mimarisi ve Teknoloji Yığını
Apartman Plus için alınan mimari kararlar, temel bir stratejiye dayanmaktadır: yüksek düzeyde duyarlı, güvenli ve sonsuz ölçeklenebilir bir platform inşa etmek. Seçilen teknoloji yığını, yalnızca modern araçların bir koleksiyonu değil, gelecekteki teknik borcu azaltmak ve uzun vadeli operasyonel mükemmelliği garanti etmek üzere tasarlanmış bilinçli bir ekosistemdir.
Frontend:   React.js veya Next.js
Seçim Nedeni:  Bileşen tabanlı mimarisi sayesinde yeniden kullanılabilir ve bakımı kolay arayüzler geliştirmeyi sağlar. Next.js, sunucu tarafı render (SSR) yetenekleriyle hem performansı hem de SEO uyumluluğunu artırır.
Backend:   Node.js (Express)
Seçim Nedeni:  Asenkron yapısı sayesinde yüksek trafik altında bile performanslı çalışır. JavaScript tabanlı olması, frontend ile aynı dili kullanarak tam yığın (full-stack) geliştirme süreçlerini hızlandırır.
Veritabanı:   PostgreSQL
Seçim Nedeni:  İlişkisel veri bütünlüğünü koruma konusundaki güvenirliği, karmaşık finansal kayıtlar ve kullanıcı ilişkileri için idealdir. Gelişmiş sorgulama yetenekleri ve ölçeklenebilirliği ile sağlam bir temel sunar.
Cloud:   AWS veya Google Cloud
Seçim Nedeni:  Yönetilen veritabanları, otomatik ölçeklendirme ve yüksek erişilebilirlik gibi bulut hizmetleri sunarak altyapı yönetim karmaşıklığını azaltır ve uygulamanın güvenilir bir şekilde barındırılmasını sağlar.
4.2 Frontend Durum Yönetimi (State Management)
Gerçek zamanlı finansal veriler, anlık bildirimler ve dinamik taleplerle dolu bir uygulamada, verimli durum yönetimi (state management) uygulamanın yanıt verme kabiliyetinin temel taşıdır. Verinin uygulama genelinde tutarlı ve performanslı bir şekilde akmasını sağlamak için hibrit bir strateji benimsenmiştir.
Context API:  Kullanıcı oturum bilgileri (kimlik doğrulama durumu, rolü vb.) ve tema tercihleri (Açık/Koyu Mod) gibi seyrek değişen ve global olarak erişilmesi gereken veriler için kullanılır.
Redux Toolkit (RTK):  Aidat borçları listesi, arıza talepleri, ödeme geçmişi ve anlık bildirimler gibi sık güncellenen, karmaşık ve uygulama genelinde birçok bileşeni etkileyen verilerin yönetimi için tercih edilir.
Veri Akışı ve Middleware:  Sunucu ile veri iletişimini yönetmek için  RTK Query  kullanılır. Bu kütüphane,  Caching (Önbellekleme)  özelliği sayesinde verilerin tekrar tekrar sunucudan istenmesini engelleyerek performansı artırır.  Auto-Polling  yeteneği ise belirli ekranlardaki verilerin düzenli aralıklarla otomatik olarak güncellenmesini sağlar. Bu teknik yetenek, Yönetici Dashboard'undaki (Bölüm 3.1.2'de açıklanan) "Tahsilat Oranı" gibi metriklerin manuel yenileme gerektirmeden canlı olarak güncellenmesini sağlayarak yöneticinin "komuta ve kontrol" deneyimini doğrudan güçlendirir.
4.3 Kapsamlı Veritabanı Şeması
İyi yapılandırılmış bir veritabanı şeması, uygulamanın esnekliği, ölçeklenebilirliği ve denetlenebilirliği için temel taşıdır. Apartman Plus'ın veri modeli, sistemin tüm fonksiyonel gereksinimlerini karşılayacak ve gelecekteki iş zekası ihtiyaçlarına zemin hazırlayacak şekilde 5 ana grup altında mantıksal olarak düzenlenmiştir.
1. Yapısal Tablolar (Infrastructure)
Apartments:  id, name, address, subscription_type
Units:  id, apartment_id, block_name, unit_number
2. Kullanıcı ve Yetkilendirme Tabloları (Users & Auth)
Users:  id, email, password_hash, phone_number, full_name, avatar_url, role
Unit_Assignments:  id, user_id, unit_id, user_type (Ev Sahibi/Kiracı)
3. Finansal Tablolar (Finance)
Dues_Templates:  id, apartment_id, amount, due_day
Invoices:  id, unit_id, description, amount, status, due_date
Payments:  id, invoice_id, payment_method, transaction_id
4. Operasyonel Tablolar (Ops)
Maintenance_Tickets:  id, requester_id, category, status, photo_url
Announcements:  id, apartment_id, author_id, title, content
5. Sosyal Tablolar (Social)
Marketplace_Items:  id, seller_id, title, price, type (Satılık/Ödünç)Temel İlişkiler:
One-to-Many:  Bir Apartment içinde birden çok Unit bulunur.
Many-to-Many:  Bir User, Unit_Assignments tablosu aracılığıyla birden fazla Unit'e (daireye) sahip olabilir veya kiracı olarak atanabilir.Bu sağlam teknik yapı, platformun güvenliğini sağlamak için tasarlanmış kapsamlı güvenlik katmanları ile korunmaktadır.
5.0 API Güvenliği ve Veri İzolasyonu Mimarisi
5.1 Kimlik Doğrulama ve Yetkilendirme
Hassas finansal verilerin ve KVKK kapsamındaki kişisel bilgilerin yönetildiği bir platformda API güvenliği, kullanıcı güvenini ve yasal uyumluluğu sağlayan, pazarlık konusu yapılamayacak bir önceliktir. Uygulamanın ve kullanıcı verilerinin bütünlüğünü korumak için çok katmanlı, savunma odaklı bir güvenlik stratejisi benimsenmiştir.
Kimlik Doğrulama (Authentication)  Uygulama, her isteğin kim tarafından yapıldığını doğrulamak için modern  JWT (JSON Web Token)  mimarisini kullanır. Kullanıcı giriş yaptığında, sunucu tarafından iki adet token üretilir:
Access Token:  Kısa ömürlü (örn: 15 dakika) olan bu anahtar, her API isteğinin Authorization başlığında gönderilerek kullanıcının kimliğini doğrular.
Refresh Token:  Uzun ömürlü olan bu anahtar, Access Token'ın süresi dolduğunda kullanıcının yeniden şifre girmesine gerek kalmadan yeni bir Access Token almasını sağlar.
Rol Tabanlı Erişim Kontrolü (RBAC)  Her API uç noktası (endpoint), isteği yapan kullanıcının rolünü kontrol eden bir ara yazılım (middleware) katmanı tarafından korunur. Bu sayede, bir kullanıcının yetkisi dışındaki verilere erişmesi engellenir.| Endpoint | Gerekli Rol | Açıklama || ------ | ------ | ------ || GET /api/finance/all-payments | Yönetici | Tüm apartman ödemelerini sadece yönetici görebilir. || POST /api/tickets/create | Sakin, Yönetici | Hem sakinler hem de yöneticiler arıza talebi oluşturabilir. || DELETE /api/users/:id | Süper Admin | Kullanıcı silme gibi kritik bir yetki sadece en üst role aittir. |
5.2 Çoklu Kiracılık (Multi-Tenancy) ve Veri Güvenliği
Çok kiracılı bir SaaS mimarisinde veri izolasyonu, yalnızca teknik bir gereklilik değil, aynı zamanda platformun ticari itibarının ve güvenilirliğinin temel garantisidir. Bir müşterinin verilerinin başka bir müşteri tarafından görülme riskinin sıfır olması gerekir.
Veri İzolasyonu  Bu izolasyon, veritabanı seviyesinde sağlanır. Her bir kritik tablo (Units, Invoices, Maintenance_Tickets vb.) zorunlu bir apartment_id sütunu içerir. Bir kullanıcı API isteği gönderdiğinde, arka plan sistemi gelen isteğin JWT'sindeki apartment_id ile veritabanındaki apartment_id'nin eşleştiği kayıtları sorgular. Bu "Row-Level Security" mantığı, bir apartman yöneticisinin veya sakininin başka bir apartmanın verilerine erişmesini imkansız hale getirir.
API Koruma Katmanları
Rate Limiting (Hız Sınırlama):  Aynı IP adresinden kısa süre içinde anormal sayıda istek gelmesini (Brute force saldırılarını) engelleyerek sunucu kaynaklarını korur.
Input Validation (Girdi Doğrulama):  Kullanıcıdan gelen tüm veriler (metin, sayı vb.), SQL Injection gibi saldırıları önlemek için Joi veya Zod gibi kütüphanelerle doğrulanır.
CORS Ayarları:  API'ye sadece yetkilendirilmiş web alan adlarından (örn: app.apartmanplus.com) erişilebilmesini sağlar.
Loglama ve İzleme (Audit Log)  Aidat silme, şifre değiştirme veya yönetici atama gibi kritik tüm işlemler sistemde ayrıntılı bir iz kaydı (log) bırakır. Bu loglar,  "Kim, ne zaman, hangi IP'den, hangi veriyi değiştirdi?"  sorusuna net bir cevap vererek tam bir denetlenebilirlik ve güvenlik sağlar.Bu karmaşık teknik yapının ve güvenlik katmanlarının pratikte nasıl bir kullanıcı deneyimine dönüştüğünü, spesifik bir modül analizi ile daha net görebiliriz.
6.0 Örnek Modül Derinlemesine Analizi: Arıza Talep Sistemi
6.1 Kullanıcı Yolculuğu ve İş Akışı
Tek bir modülün derinlemesine analizi, projenin bütününe yayılan titiz planlama ve kullanıcı odaklı ürün geliştirme felsefesini somut bir şekilde ortaya koyar. Arıza Talep Sistemi, yönetici performansı ile sakin memnuniyetinin en doğrudan kesiştiği nokta olduğu için, iş akışının her adımının kusursuz, şeffaf ve verimli olması zorunludur.
Talep Oluşturma:  Kat sakini, "3. kat asansör kapısı kapanmıyor" gibi bir arızayı tespit eder. Mobil uygulama üzerinden arızanın fotoğrafını çeker, "Kritik", "Orta" veya "Düşük" gibi bir aciliyet durumu seçer ve talebini gönderir.
Bildirim ve Onay:  Talep oluşturulduğu anda yöneticiye anlık bildirim (push notification) gider. Yönetici, talebi inceleyerek "Onaylandı" veya "İşlemde" durumuna alır.
Atama:  Yönetici, talebi sistem üzerinden ilgili teknik personele (apartman görevlisi veya dışarıdan bir teknisyen) atar.
Çözüm:  Atanan personel işi tamamladığında, sistem üzerinden durumu "Tamamlandı" olarak günceller ve isteğe bağlı olarak onarılmış durumun bir fotoğrafını yükler.
Geri Bildirim:  Talep sahibi sakine arızanın giderildiğine dair bir bildirim gönderilir. Sakin, aldığı hizmeti 1-5 yıldız arası puanlayabilir ve yorum ekleyebilir.
6.2 Teknik Detaylar ve "Plus" Özellikleri
Bu modülü standart bir bilet sisteminden ayıran ve Apartman Plus'a özgü katma değeri yaratan özellikler, platformun sadece bir yönetim aracı değil, aynı zamanda bir hizmet kalitesi ve şeffaflık platformu olduğunu gösterir.
Veritabanı Tablosu (  Maintenance_Tickets  )  Bu iş akışını destekleyen temel veri yapısı aşağıdaki gibidir:| Sütun Adı | Veri Tipi | Açıklama || ------ | ------ | ------ || ticket_id | UUID / INT | Benzersiz talep numarası (Primary Key). || requester_id | INT | Talebi açan sakinin ID'si (Foreign Key). || category | ENUM | Elektrik, Tesisat, Asansör, Temizlik, Diğer. || title | VARCHAR | Arızanın kısa başlığı. || description | TEXT | Arızanın detaylı açıklaması. || status | ENUM | Açık, Onaylandı, İşlemde, Tamamlandı, İptal. || urgency | ENUM | Düşük, Orta, Kritik. || photo_url | VARCHAR | Arıza fotoğrafının bulut depolama linki. || assigned_to | INT | İşi yapacak personelin ID'si. || created_at | TIMESTAMP | Talebin oluşturulma tarihi. |
"Plus" Özellikleri
SLA (Hizmet Süresi) Takibi:  "Kritik" olarak işaretlenen bir asansör arızasına 2 saat içinde müdahale edilmezse, sistem yöneticiye otomatik bir uyarı göndererek hizmet kalitesinin proaktif takibini sağlar.
Maliyet Entegrasyonu:  Tamir için yapılan harcamalar (yedek parça, servis ücreti vb.) doğrudan bu talebe işlenerek apartmanın genel gider tablosuna otomatik olarak yansıtılabilir. Bu, tam maliyet şeffaflığı sağlar.
Şeffaf Arıza Haritası:  Sakinler, apartmandaki diğer aktif arızaları görebilirler. Bu özellik, aynı sorun için birden fazla talep açılmasını engelleyerek sistemin verimli kullanılmasını sağlar ve yönetime olan güveni artırır.
Örnek API Yanıtı  Frontend tarafının bir talep detayını sunucudan nasıl alacağını gösteren örnek bir JSON yanıtı:

