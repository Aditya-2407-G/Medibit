import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, Alert, Platform } from 'react-native';
import { downloadFile, viewDocument } from '@/lib/appwrite';
const DisplayDocuments = () => {
    const [userFiles, setUserFiles] = useState<any[]>([]);

    useEffect(() => {
        fetchUserFiles();
    }, []);

    const fetchUserFiles = async () => {
        try {
            const result = await viewDocument(); // Call the viewDocument function to fetch the user's files
            setUserFiles(result!.documents); // Set the user's files in the state
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch user files');
        }
    };

    const renderItem = ({ item }: any) => (
        <TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                <Text>{item.name}</Text>
                <Button title="Download" />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginVertical: 20 }}>User Files List</Text>
            <FlatList
                data={userFiles}
                renderItem={renderItem}
                keyExtractor={(item) => item.$id}
                ListEmptyComponent={() => <Text style={{ textAlign: 'center' }}>No files found</Text>}
            />
        </View>
    );
};

export default DisplayDocuments;
