# WarungDigitalApp — Domain: Warung Digital

![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)
![AsyncStorage](https://img.shields.io/badge/AsyncStorage-Local_Persistence-00b894)

> WarungDigitalApp adalah aplikasi kasir & katalog produk untuk UMKM warung. Pemilik warung bisa mengelola katalog produk lengkap dengan foto, menerima pesanan lewat keranjang belanja, dan melihat riwayat transaksi — semua tersimpan secara lokal di perangkat.

---

## 📸 Screenshots


# Login Screen 

<img width="720" height="1600" alt="login" src="https://github.com/user-attachments/assets/a1ed9fa4-75cd-4f3e-adf6-95075d42ad4e" />


# Katalog Screen 

<img width="720" height="1600" alt="katalog" src="https://github.com/user-attachments/assets/51d50b0c-0822-437f-b893-846e71002abc" />


# Keranjang Screen 

<img width="720" height="1600" alt="keranjang" src="https://github.com/user-attachments/assets/e7dee0dc-f9b1-49e2-b9f6-7f46f9fab85e" />


---

## ✨ Fitur Utama

- [x] Login/Register pemilik warung dengan validasi form
- [x] Katalog produk dengan FlatList (tambah & hapus produk)
- [x] Detail produk dengan navigasi Stack + parameter
- [x] Keranjang belanja dengan total harga otomatis
- [x] Foto produk via expo-image-picker (dengan handling izin)
- [x] Riwayat transaksi tersimpan permanen
- [x] Data persisten dengan AsyncStorage (akun, sesi, produk, keranjang, riwayat)
- [x] Bottom Tab Navigation (Katalog, Keranjang, Riwayat, Profil)

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | React Native + Expo (SDK 57) |
| Navigation | React Navigation v7 (Native Stack + Bottom Tab) |
| Storage | @react-native-async-storage/async-storage |
| Device | expo-image-picker |
| Build | EAS Build (Expo Application Services) |

---

## 📁 Struktur Folder

```
WarungDigitalApp/
├── App.js
├── app.json
├── eas.json
├── src/
│   ├── navigation/AppNavigator.js
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── CatalogScreen.js
│   │   ├── ProductDetailScreen.js
│   │   ├── AddProductScreen.js
│   │   ├── CartScreen.js
│   │   ├── HistoryScreen.js
│   │   └── ProfileScreen.js
│   ├── components/
│   │   ├── ItemCard.js
│   │   ├── LoadingSpinner.js
│   │   └── EmptyState.js
│   ├── services/storage.js
│   └── constants/colors.js
└── assets/
```

---

## 🚀 Cara Menjalankan

```bash
git clone https://github.com/username/nama-repo.git
cd nama-repo
npm install
npx expo start
```
Scan QR Code dengan Expo Go di HP.

---

## 📦 Download APK

[Link Download](https://expo.dev/artifacts/eas/M41vUL-8xFp1jaKWTweqG1If_WEACTK5D7yOgIvl5sw.apk)

---

## 🌐 Expo Snack

[Buka di Expo Snack](https://snack.expo.dev/@niell77/warungdigital-app)

---

## 👤 Developer

**Revael Daniel** | 243303621203 | 4 Pagi A
Universitas Prima Indonesia — Prodi Sistem Informasi
Mata Kuliah: Pemrograman Mobile (TI-MOBILE-01)
