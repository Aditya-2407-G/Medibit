// const uploadFile = async () => {
//     if (!fileUri) {
//       Alert.alert("Error", "Please pick a file first.");
//       return;
//     }

//     try {
//       // Create an object with properties name, type, size, and uri
//       const fileData = {
//         name: fileName,
//         type: fileType,
//         size: fileSize!,
//         uri: fileUri,
//       };

//       const ref = fileUploader(fileData);

//       ref
//         .then((response) => {
//           console.log("File uploaded successfully:", response);
//           ToastAndroid.show("File uploaded successfully", ToastAndroid.SHORT);
//         })
//         .catch((error) => {
//           console.error("Error uploading file:", error);
//           Alert.alert("Error", `Failed to upload file. ${error}`);
//         });
//     } catch (error) {
//       console.log("Error uploading file:", error);
//       Alert.alert("Error", `Failed to upload file. ${error}`);
//     }
//   };
