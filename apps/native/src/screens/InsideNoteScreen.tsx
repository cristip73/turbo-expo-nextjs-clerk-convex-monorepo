import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useQuery, useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { Id } from "@packages/backend/convex/_generated/dataModel";

const { width } = Dimensions.get("window");

export default function InsideNoteScreen({ route, navigation }) {
  const { item } = route.params;
  const [activeTab, setActiveTab] = useState("original");
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState(item.content);
  
  const currentNote = useQuery(api.notes.getNote, { id: item._id });
  const updateNote = useMutation(api.notes.updateNote);

  // Actualizăm valorile locale când notița se schimbă
  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
    }
  }, [currentNote]);

  const handleSave = async () => {
    try {
      await updateNote({ 
        id: item._id as Id<"notes">, 
        title, 
        content 
      });
      setIsEditing(false);
      // Actualizăm obiectul item pentru a reflecta schimbările
      route.params.item = { ...item, title, content };
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const renderEditForm = () => {
    return (
      <View style={styles.editFormContainer}>
        <Text style={styles.editFormLabel}>Titlu</Text>
        <TextInput
          style={styles.editFormInput}
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.editFormLabel}>Conținut</Text>
        <TextInput
          style={styles.editFormTextArea}
          value={content}
          onChangeText={setContent}
          multiline={true}
          numberOfLines={10}
        />
        <View style={styles.editFormButtonsContainer}>
          <TouchableOpacity 
            style={styles.editFormCancelButton}
            onPress={() => {
              setTitle(item.title);
              setContent(item.content);
              setIsEditing(false);
            }}
          >
            <Text style={styles.editFormCancelButtonText}>Anulează</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.editFormSaveButton}
            onPress={handleSave}
          >
            <Text style={styles.editFormSaveButtonText}>Salvează</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <Image
          source={require("../assets/icons/logo2small.png")}
          style={styles.logo}
        />
      </View>

      <View style={styles.underHeaderContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.arrowBack}
            source={require("../assets/icons/arrow-back.png")}
          />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>
        
        {!isEditing ? (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <View style={{width: 40}} />
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {isEditing ? (
          renderEditForm()
        ) : (
          <View style={styles.contentContainer}>
            <Text style={styles.contentDescription}>
              {activeTab === "original"
                ? content
                : currentNote?.summary
                  ? currentNote.summary
                  : "No summary available"}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Sticky footer */}
      {!isEditing && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.footerTab,
              activeTab === "original" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("original")}
          >
            <Image
              source={require("../assets/icons/OrignalIcon.png")}
              style={[
                styles.footerIcon,
                activeTab === "original"
                  ? styles.activeIcon
                  : styles.inactiveIcon,
              ]}
            />
            <Text
              style={[
                styles.footerText,
                activeTab === "original"
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}
            >
              Original
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.footerTab,
              activeTab === "summary" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("summary")}
          >
            <Image
              source={require("../assets/icons/summaryIcon.png")}
              style={[
                styles.footerIcon,
                activeTab === "summary" ? styles.activeIcon : styles.inactiveIcon,
              ]}
            />
            <Text
              style={[
                styles.footerText,
                activeTab === "summary"
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}
            >
              Summary
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FE",
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
  underHeaderContainer: {
    width: width,
    height: 62,
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderBottomColor: "#D9D9D9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  arrowBack: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: RFValue(17.5),
    fontFamily: "MMedium",
    color: "#2D2D2D",
  },
  contentContainer: {
    // Add styles for contentContainer if needed
  },
  contentTitle: {
    fontSize: RFValue(17.5),
    fontFamily: "MMedium",
    color: "#000",
    textAlign: "center",
    marginTop: 28,
  },
  contentDescription: {
    fontSize: RFValue(17.5),
    fontFamily: "MRegular",
    alignSelf: "center",
    textAlign: "justify",
    paddingLeft: 29,
    paddingRight: 21,
    marginTop: 30,
  },
  footer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#D9D9D9",
  },
  footerTab: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  footerIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  activeTab: {
    backgroundColor: "#0D87E1",
  },
  activeIcon: {
    tintColor: "#fff",
  },
  inactiveIcon: {
    tintColor: "#000",
  },
  footerText: {
    fontSize: RFValue(12.5),
    fontFamily: "MRegular",
  },
  activeTabText: {
    color: "#fff",
  },
  inactiveTabText: {
    color: "#000",
  },
  editButton: {
    backgroundColor: "#0D87E1",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  editButtonText: {
    color: "#fff",
    fontFamily: "MRegular",
    fontSize: RFValue(12),
  },
  editFormContainer: {
    padding: 20,
  },
  editFormLabel: {
    fontFamily: "MMedium",
    fontSize: RFValue(14),
    marginBottom: 5,
    color: "#2D2D2D",
  },
  editFormInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    fontFamily: "MRegular",
    fontSize: RFValue(14),
  },
  editFormTextArea: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
    fontFamily: "MRegular",
    fontSize: RFValue(14),
    textAlignVertical: "top",
    minHeight: 200,
  },
  editFormButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  editFormCancelButton: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  editFormCancelButtonText: {
    color: "#2D2D2D",
    fontFamily: "MRegular",
    fontSize: RFValue(14),
  },
  editFormSaveButton: {
    backgroundColor: "#0D87E1",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  editFormSaveButtonText: {
    color: "#fff",
    fontFamily: "MRegular",
    fontSize: RFValue(14),
  },
});
