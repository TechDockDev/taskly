import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
const TasklyLogo = () => (
  <View style={styles.logoContainer}>
    <View style={styles.logoIconContainer}>
      <View style={styles.blueDot} /> <View style={styles.checkmark} />
    </View>
    <Text style={styles.logoText}>Taskly</Text>
  </View>
);
const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <TasklyLogo />
        </View>
        <View style={styles.formContainer}>
          
          <Text style={styles.heading}>Login</Text>
          <Text style={styles.subheading}>
            Enter your mobile number to continue
          </Text>
          <View style={styles.inputContainer}>
            
            <Text style={styles.countryCode}>+91</Text>
            <View style={styles.separator} />
            <TextInput
              style={styles.input}
              placeholder="Enter Phone"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
          <View style={styles.inputLine} />
          <TouchableOpacity style={styles.continueButton}>
            
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
          <View style={styles.termsContainer}>
            
            <Text style={styles.termsText}>
              
              By clicking Continue, you agree to our
              <Text style={styles.termsLink}>Terms & Conditions</Text>.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  content: { flex: 1, padding: 30 , },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 50,
    margin:35
  },
  logoIconContainer: {
    width: 24,
    height: 24,
    marginRight: 8,
    position: "relative",
  },
  blueDot: {
    width: 8,
    height: 8,
    backgroundColor: "#007BFF",
    borderRadius: 4,
    position: "absolute",
    left: 0,
    top: 8,
  },
  checkmark: {
    width: 16,
    height: 16,
    borderRadius: 1,
    borderColor: "#000",
    borderWidth: 2,
    transform: [{ rotate: "45deg" }],
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  logoText: { fontSize: 60, fontWeight: "bold", color: "#000" },
  formContainer: { marginTop: 20 , backgroundColor:"#fff", padding:10, borderRadius:7},
  heading: { fontSize: 28, fontWeight: "bold", marginBottom: 8, color: "#000" },
  subheading: { fontSize: 16, color: "#333", marginBottom: 30 },
  inputContainer: { flexDirection: "row", alignItems: "center" },
  countryCode: { fontSize: 16, color: "#000", paddingRight: 10 },
  separator: { width: 1, height: 20, backgroundColor: "#ccc", marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: "#000", padding: 0 },
  inputLine: {
    height: 1,
    backgroundColor: "#000",
    marginTop: 10,
    marginBottom: 30,
  },
  continueButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  continueButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  termsContainer: { marginTop: 10 },
  termsText: { fontSize: 14, color: "#666", textAlign: "center" },
  termsLink: { color: "#007BFF", textDecorationLine: "underline" },
});
export default LoginScreen;
