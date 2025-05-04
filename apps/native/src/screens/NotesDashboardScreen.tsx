import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useAuth, useUser, useClerk } from "@clerk/clerk-expo";
import { api } from "@packages/backend/convex/_generated/api";
import { useQuery } from "convex/react";

const NotesDashboardScreen = ({ navigation }) => {
  const user = useUser();
  const { signOut } = useClerk();
  const imageUrl = user?.user?.imageUrl;
  const firstName = user?.user?.firstName;
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const allNotes = useQuery(api.notes.getNotes);
  const [search, setSearch] = useState("");

  const finalNotes = search
    ? allNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.content.toLowerCase().includes(search.toLowerCase()),
      )
    : allNotes;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("InsideNoteScreen", {
          item: item,
        })
      }
      activeOpacity={0.5}
      style={styles.noteItem}
    >
      <Text style={styles.noteText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const handleLogout = async () => {
    try {
      await signOut();
      // Redirecționare explicită către LoginScreen după sign-out
      navigation.replace("LoginScreen");
    } catch (err) {
      console.error("Logout error:", err);
      Alert.alert("Error", "Couldn't sign out. Please try again.");
    }
  };

  const toggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/icons/logo2small.png")}
          style={styles.logo}
        />
      </View>

      <View style={styles.yourNotesContainer}>
        {/* @ts-ignore, for css purposes */}
        <Image style={styles.avatarSmall} />
        <Text style={styles.title}>Your Notes</Text>
        {imageUrl ? (
          <TouchableOpacity onPress={toggleLogoutModal}>
            <Image style={styles.avatarSmall} source={{ uri: imageUrl }} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={toggleLogoutModal}>
            <Text>{firstName ? firstName : ""}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={20}
          color="grey"
          style={styles.searchIcon}
        />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search"
          style={styles.searchInput}
        />
      </View>
      {!finalNotes || finalNotes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Create your first note to{"\n"}get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={finalNotes}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          style={styles.notesList}
          contentContainerStyle={{
            marginTop: 19,
            borderTopWidth: 0.5,
            borderTopColor: "rgba(0, 0, 0, 0.59)",
          }}
        />
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate("CreateNoteScreen")}
        style={styles.newNoteButton}
      >
        <AntDesign name="pluscircle" size={20} color="#fff" />
        <Text style={styles.newNoteButtonText}>Create a New Note</Text>
      </TouchableOpacity>

      {/* Modal pentru logout */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={toggleLogoutModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleLogoutModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Account</Text>
              
              <View style={styles.userInfoContainer}>
                {imageUrl && (
                  <Image 
                    style={styles.modalAvatar} 
                    source={{ uri: imageUrl }} 
                  />
                )}
                <View style={styles.userTextContainer}>
                  <Text style={styles.userName}>{user?.user?.fullName || firstName}</Text>
                  <Text style={styles.userEmail}>{user?.user?.primaryEmailAddress?.emailAddress}</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <AntDesign name="logout" size={20} color="#fff" />
                <Text style={styles.logoutButtonText}>Sign Out</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.cancelButton} onPress={toggleLogoutModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#0D87E1",
    height: 67,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: RFValue(17.5),
    fontFamily: "MMedium",
    alignSelf: "center",
  },
  yourNotesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 13,
    marginTop: 19,
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 15,
    marginTop: 30,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: RFValue(15),
    fontFamily: "MRegular",
    color: "#2D2D2D",
  },
  notesList: {
    flex: 1,
  },
  noteItem: {
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0, 0, 0, 0.59)",

    backgroundColor: "#F9FAFB",
  },
  noteText: {
    fontSize: 16,
    fontFamily: "MLight",
    color: "#2D2D2D",
  },

  newNoteButton: {
    flexDirection: "row",
    backgroundColor: "#0D87E1",
    borderRadius: 7,
    width: Dimensions.get("window").width / 1.6,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    position: "absolute",
    bottom: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  newNoteButtonText: {
    color: "white",
    fontSize: RFValue(15),
    fontFamily: "MMedium",
    marginLeft: 10,
  },
  switchContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  emptyStateText: {
    textAlign: "center",
    alignSelf: "center",
    fontSize: RFValue(15),
    color: "grey",
    fontFamily: "MLight",
  },
  emptyState: {
    width: "100%",
    height: "35%",
    marginTop: 19,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.59)",
  },
  // Stiluri pentru modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    maxWidth: 320,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: RFValue(18),
    fontFamily: "MSemiBold",
    marginBottom: 20,
    color: "#333",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    width: "100%",
  },
  modalAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: RFValue(16),
    fontFamily: "MMedium",
    color: "#333",
  },
  userEmail: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#666",
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#0D87E1",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 12,
  },
  logoutButtonText: {
    color: "white",
    fontFamily: "MMedium",
    fontSize: RFValue(15),
    marginLeft: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontFamily: "MMedium",
    fontSize: RFValue(14),
  },
});

export default NotesDashboardScreen;
