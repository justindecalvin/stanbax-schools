import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docSnap = await getDoc(doc(db, "users", user.uid));
    const data = docSnap.data();
    document.getElementById("teacher-name").textContent = data.name;
    
    // View students
    const querySnapshot = await getDocs(collection(db, "users"));
    const studentList = document.getElementById("student-list");
    studentList.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.role === "student") {
        const li = document.createElement("li");
        li.textContent = `${userData.name} - ${userData.email}`;
        studentList.appendChild(li);
      }
    });
import { setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Send a message
document.getElementById("send-chat").addEventListener("click", async () => {
  const content = document.getElementById("chat-message").value.trim();
  const recipientEmail = document.getElementById("chat-recipient").value.trim();
  if (!content || !recipientEmail) return alert("Enter recipient and message");
  
  const userSnapshot = await getDocs(collection(db, "users"));
  let receiverId = null;
  userSnapshot.forEach((doc) => {
    if (doc.data().email === recipientEmail) receiverId = doc.id;
  });
  
  if (!receiverId) return alert("Recipient not found");
  
  await addDoc(collection(db, "messages"), {
    senderId: user.uid,
    receiverId,
    content,
    timestamp: new Date()
  });
  
  document.getElementById("chat-message").value = "";
});

// Load messages in real time
onSnapshot(
  query(
    collection(db, "messages"),
    orderBy("timestamp")
  ),
  (snapshot) => {
    const box = document.getElementById("chat-box");
    box.innerHTML = "";
    snapshot.forEach((doc) => {
      const msg = doc.data();
      if (
        (msg.senderId === user.uid || msg.receiverId === user.uid)
      ) {
        const div = document.createElement("div");
        div.innerHTML = `<b>${msg.senderId === user.uid ? "You" : "Them"}:</b> ${msg.content}`;
        box.appendChild(div);
      }
    });
    box.scrollTop = box.scrollHeight;
  }
);
// Upload actual results to Firestore
document.getElementById("submit-result-btn").addEventListener("click", async () => {
  const email = document.getElementById("result-email").value.trim();
  const result = document.getElementById("result-text").value.trim();
  
  if (!email || !result) {
    document.getElementById("upload-result-msg").textContent = "Fill in both fields!";
    return;
  }
  
  const usersSnapshot = await getDocs(collection(db, "users"));
  let targetUID = null;
  usersSnapshot.forEach((doc) => {
    if (doc.data().email === email) targetUID = doc.id;
  });
  
  if (targetUID) {
    await setDoc(doc(db, "results", targetUID), {
      result,
      timestamp: new Date()
    });
    document.getElementById("upload-result-msg").textContent = "Result uploaded.";
  } else {
    document.getElementById("upload-result-msg").textContent = "Student not found.";
  }
});
    import { signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
});
    // Upload results placeholder
    document.getElementById("upload-results-btn").addEventListener("click", () => {
      const results = document.getElementById("results-input").value;
      document.getElementById("result-msg").textContent = "Results uploaded successfully (simulated).";
    });
    
  } else {
    window.location.href = "login.html";
  }
});