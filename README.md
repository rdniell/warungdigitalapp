# WarungDigitalApp — Domain: Warung Digital

![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)
![AsyncStorage](https://img.shields.io/badge/AsyncStorage-Local_Persistence-00b894)

> WarungDigitalApp adalah aplikasi kasir & katalog produk untuk UMKM warung. Pemilik warung bisa mengelola katalog produk lengkap dengan foto, menerima pesanan lewat keranjang belanja, dan melihat riwayat transaksi — semua tersimpan secara lokal di perangkat.

---

## 📸 Screenshots

| Login Screen | Katalog Screen | Keranjang Screen |
|:---:|:---:|:---:|
| ![Login](assets/screenshots/login.png) | ![Katalog](assets/screenshots/katalog.png) | ![Keranjang](assets/screenshots/keranjang.png) |

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

[Download APK terbaru](LINK_APK_GITHUB_RELEASE_ATAU_DRIVE)

---

## 🌐 Expo Snack

[Buka di Expo Snack](LINK_EXPO_SNACK)

---

## 👤 Developer

**Nama Lengkap** | NIM | Kelas
Universitas Prima Indonesia — Prodi Sistem Informasi
Mata Kuliah: Pemrograman Mobile (TI-MOBILE-01)
