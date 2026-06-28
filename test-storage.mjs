import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAmqOsHQG1VfKbuu1sH2KY6acU_P_HM2aY",
  authDomain: "alpha-home-tuition.firebaseapp.com",
  projectId: "alpha-home-tuition",
  storageBucket: "alpha-home-tuition.firebasestorage.app",
  messagingSenderId: "1085992732755",
  appId: "1:1085992732755:web:43b3891075dfd2b5985ea6",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function testStorage() {
  console.log("--- Testing Firebase Storage ---");
  try {
    const storageRef = ref(storage, 'test/test-file.txt');
    console.log("Uploading file...");
    await uploadString(storageRef, 'This is a test file.');
    console.log("✅ File uploaded successfully.");
    
    console.log("Getting download URL...");
    const url = await getDownloadURL(storageRef);
    console.log("✅ Download URL:", url);
    return true;
  } catch (error) {
    console.error("❌ Storage test failed:", error.code, error.message);
    return false;
  }
}

async function run() {
  await testStorage();
  setTimeout(() => process.exit(0), 1000);
}

run();
