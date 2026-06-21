import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';

Future initFirebase() async {
  if (kIsWeb) {
    await Firebase.initializeApp(
        options: FirebaseOptions(
            apiKey: "AIzaSyDPRznvHNhICZlG_a_1F8a1s5GPS1ss3Yk",
            authDomain: "ssmi-database.firebaseapp.com",
            projectId: "ssmi-database",
            storageBucket: "ssmi-database.firebasestorage.app",
            messagingSenderId: "464475463837",
            appId: "1:464475463837:web:8f6d4a51f27d2672003474",
            measurementId: "G-ZMP83GTQTZ"));
  } else {
    await Firebase.initializeApp();
  }
}
