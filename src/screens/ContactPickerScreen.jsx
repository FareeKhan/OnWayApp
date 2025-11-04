import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, PermissionsAndroid, Platform, Alert, StyleSheet } from 'react-native';
import Contacts from 'react-native-contacts';

const ContactPickerScreen = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    requestPermissionAndLoadContacts();
  }, []);

  const requestPermissionAndLoadContacts = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts Permission',
          message: 'This app needs access to your contacts.',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        loadContacts();
      } else {
        Alert.alert('Permission Denied', 'Cannot access contacts');
      }
    } else {
      loadContacts();
    }
  };

  const loadContacts = () => {
    Contacts.getAll()
      .then(contacts => {
        setContacts(contacts);
      })
      .catch(err => {
        console.log('Error loading contacts: ', err);
      });
  };

  const renderItem = ({ item }) => {
    const phoneNumber = item.phoneNumbers[0]?.number || 'No number';
    return (
      <TouchableOpacity style={styles.contactItem}>
        <Text style={styles.contactName}>{item.givenName} {item.familyName}</Text>
        <Text style={styles.contactNumber}>{phoneNumber}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts List</Text>
      <FlatList
        data={contacts}
        keyExtractor={item => item.recordID}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  contactItem: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  contactName: { fontSize: 18 },
  contactNumber: { fontSize: 14, color: '#555' },
});

export default ContactPickerScreen;
