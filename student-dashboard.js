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
import {
  getStorage,
  ref,
  uploadBytes
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    
    document.getElementById("student-name").textContent = data.name;
    document.getElementById("student-email").textContent = data.email;
    
import { getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

document.getElementById("view-results-btn").addEventListener("click", async () => {
  const resultDoc = await getDoc(doc(db, "results", user.uid));
  if (resultDoc.exists()) {
    document.getElementById("results-display").innerHTML = `<p>${resultDoc.data().result}</p>`;
  } else {
    document.getElementById("results-display").innerHTML = "<p>No result uploaded yet.</p>";
  }
});
    
    // Upload assignment
    document.getElementById("upload-assignment-btn").addEventListener("click", async () => {
      const file = document.getElementById("assignment-file").files[0];
      if (!file) return alert("Please choose a file");
      const fileRef = ref(storage, `assignments/${user.uid}/${file.name}`);
      await uploadBytes(fileRef, file);
      document.getElementById("assignment-msg").textContent = "Assignment uploaded!";
    });
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
// Upload payment proof
document.getElementById("upload-payment-btn").addEventListener("click", async () => {
  const file = document.getElementById("payment-file").files[0];
  if (!file) return alert("Please choose a file");
  const fileRef = ref(storage, `payments/${user.uid}/${file.name}`);
  await uploadBytes(fileRef, file);
  document.getElementById("payment-msg").textContent = "Payment proof uploaded!";
});
import { signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
});
    // Progress report (placeholder)
    document.getElementById("progress-content").innerHTML = `
      <ul>
        <li>Attendance: 90%</li>
        <li>Assignments Submitted: 8/10</li>
        <li>Tests Taken: 5</li>
      </ul>`;
  } else {
    window.location.href = "login.html";
  }
});
