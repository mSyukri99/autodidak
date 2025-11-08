import React, { useState } from 'react';
// Tambahkan 'TouchableOpacity'
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";

// Terima prop 'navigation'
export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // ... (Fungsi handleRegister tetap sama, tidak perlu diubah) ...
    if (email === '' || password === '') {
      Alert.alert('Error', 'Email dan Password tidak boleh kosong!');
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('User berhasil terdaftar:', user.email);
        Alert.alert('Sukses', 'Akun berhasil didaftarkan! Silakan login.');
        // Setelah daftar, otomatis pindah ke layar Login
        navigation.navigate('Login'); 
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Error [${errorCode}]: ${errorMessage}`);
        if (errorCode === 'auth/email-already-in-use') {
          Alert.alert('Error', 'Email ini sudah terdaftar.');
        } else if (errorCode === 'auth/weak-password') {
          Alert.alert('Error', 'Password terlalu lemah (minimal 6 karakter).');
        } else {
          Alert.alert('Error', errorMessage);
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Akun Baru</Text>
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
        placeholder="Password (min. 6 karakter)"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button title="Daftar" onPress={handleRegister} />

      {/* === TOMBOL BARU KE LOGIN === */}
      <TouchableOpacity 
        style={styles.loginLink}
        onPress={() => navigation.navigate('Login')} // Navigasi ke 'Login'
      >
        <Text style={styles.loginText}>
          Sudah punya akun? <Text style={styles.loginButtonText}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Tambahkan styling untuk link login
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
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
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
  loginButtonText: {
    color: '#007BFF',
    fontWeight: 'bold',
  }
});