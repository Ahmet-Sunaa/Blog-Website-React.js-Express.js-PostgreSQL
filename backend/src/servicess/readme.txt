Güvenli: Şifreyi kodda tutmak yerine OAuth Token kullanır.
Daha Uzun Süreçsiz Erişim: SMTP gibi sürekli giriş gerektirmez.
Google Tarafından Öneriliyor: Daha az spam riski var.

1. Google Cloud’da OAuth 2.0 API Erişimi Aç
Google Cloud Console'a git:
https://console.cloud.google.com/
Yeni bir proje oluştur (veya mevcut projeyi seç).
API'ler ve Hizmetler → Etkinleştir ve Yönet kısmına git.
Gmail API’yi Etkinleştir
Kimlik Bilgileri → OAuth 2.0 Client ID oluştur:
Uygulama Tipi: Web Application
Authorized JavaScript origins URL’si: http://localhost:5000
Yetkili yönlendirme URL’si: http://localhost:5000/auth/google/callback
Client ID ve Client Secret değerlerini kaydet.


OAuth Playground sayfasına git.(google araması ile)
"Gmail API v1" → ".../gmail.send" Yetkisini Seç
Access Token ve Refresh Token Oluştur
.env dosyana ekle:

EMAIL_USER=your-email@gmail.com
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
REFRESH_TOKEN=your-refresh-token