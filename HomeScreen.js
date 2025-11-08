import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { db, auth } from './firebaseConfig'; // <-- IMPOR 'auth' JUGA
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query,
  doc,
  updateDoc,
  deleteDoc  
} from "firebase/firestore"; 
import { signOut } from 'firebase/auth'; // <-- IMPOR FUNGSI SIGNOUT

// Terima prop 'navigation'
export default function HomeScreen({ navigation }) {
  const [taskName, setTaskName] = useState('');
  const [tasks, setTasks] = useState([]); 

  // === FUNGSI LOGOUT BARU ===
  const handleLogout = () => {
    signOut(auth).catch(error => console.error('Error logging out: ', error));
    // Kita tidak perlu pindah layar manual.
    // Listener di App.js akan mendeteksi logout
    // dan otomatis memindahkan user ke LoginScreen.
  };

  // === PASANG TOMBOL LOGOUT DI HEADER ===
  // Kita gunakan 'useLayoutEffect' untuk mengatur tombol di header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={handleLogout} title="Logout" color="red" />
      ),
    });
  }, [navigation]);


  // === (SEMUA KODE CRUD ANDA YANG LAIN TETAP SAMA) ===
  useEffect(() => {
    const q = query(collection(db, "tasks"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksArray = [];
      querySnapshot.forEach((doc) => {
        tasksArray.push({ id: doc.id, ...doc.data() }); 
      });
      setTasks(tasksArray);
    });
    return () => unsubscribe();
  }, []);

  const handleAddTask = async () => {
    if (taskName === '') {
      Alert.alert('Error', 'Nama tugas tidak boleh kosong');
      return;
    }
    try {
      await addDoc(collection(db, "tasks"), {
        name: taskName,
        completed: false,
        createdAt: new Date()
      });
      setTaskName('');
    } catch (e) {
      console.error("Error menambah data: ", e);
      Alert.alert('Error', 'Gagal menambah data');
    }
  };

  const handleUpdateTask = async (taskId, currentCompletedStatus) => {
    const taskRef = doc(db, "tasks", taskId); 
    try {
      await updateDoc(taskRef, {
        completed: !currentCompletedStatus
      });
    } catch (e) {
      console.error("Error update data: ", e);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const taskRef = doc(db, "tasks", taskId);
    try {
      await deleteDoc(taskRef);
    } catch (e) {
      console.error("Error delete data: ", e);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={[
        styles.taskText, 
        item.completed ? styles.taskCompleted : null
      ]}>
        {item.name}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.updateButton]}
          onPress={() => handleUpdateTask(item.id, item.completed)}
        >
          <Text style={styles.buttonText}>{item.completed ? 'Batal' : 'Selesai'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDeleteTask(item.id)}
        >
          <Text style={styles.buttonText}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Kita pindahkan Judul ke header, jadi ini bisa dihapus/di-komen */}
      {/* <Text style={styles.title}>Daftar Tugas</Text> */} 
      <TextInput
        style={styles.input}
        placeholder="Nama Tugas Baru"
        onChangeText={setTaskName}
        value={taskName}
      />
      <Button title="Tambah Tugas" onPress={handleAddTask} />
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </View>
  );
}

// === (Styling Anda, tidak ada yang berubah kecuali menghapus 'title') ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // paddingTop: 50, // Kita hapus karena sudah ada header
  },
  // title: { ... } // Boleh dihapus
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  list: {
    marginTop: 20,
  },
  taskItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskText: {
    fontSize: 18,
    flex: 1,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  updateButton: {
    backgroundColor: '#007BFF',
  },
  deleteButton: {
    backgroundColor: '#DC3545',
  }
});