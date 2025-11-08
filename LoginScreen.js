import React, { useState } from 'react';
// Tambahkan 'TouchableOpacity' untuk membuat tombol kustom
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";

// Terima prop 'navigation'
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Email dan Password tidak boleh kosong!');
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Berhasil login
        // Kita tidak perlu Alert lagi, karena App.js
        // akan otomatis mendeteksi login dan pindah ke HomeScreen!
        console.log('User berhasil login:', userCredential.user.email);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'Email atau Password salah.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selamat Datang!</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />

      {/* === TOMBOL BARU KE REGISTER === */}
      <TouchableOpacity 
        style={styles.registerLink}
        onPress={() => navigation.navigate('Register')} // Navigasi ke 'Register'
      >
        <Text style={styles.registerText}>
          Belum punya akun? <Text style={styles.registerButtonText}>Daftar di sini</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Tambahkan styling untuk link register
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white', // Tambah background putih
  },
  title: {
    fontSize: 28, // Perbesar judul
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  registerLink: {
    marginTop: 20, // Beri jarak dari tombol Login
  },
  registerText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
  registerButtonText: {
    color: '#007BFF', // Warna biru
    fontWeight: 'bold',
  }
});