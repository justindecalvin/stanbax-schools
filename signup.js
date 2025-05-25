import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Your Firebase config here
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Store role and name in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role,
      createdAt: new Date()
    });
    import { sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

createUserWithEmailAndPassword(auth, email, password)
  .then(async (cred) => {
    await sendEmailVerification(cred.user);
    alert("Signup successful! Please verify your email.");
    window.location.href = "login.html";
  })
  .catch((error) => alert(error.message));
  import { sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

createUserWithEmailAndPassword(auth, email, password)
  .then(async (cred) => {
    await sendEmailVerification(cred.user);
    alert("Signup successful! Please verify your email.");
    window.location.href = "login.html";
  })
  .catch((error) => alert(error.message));
  onAuthStateChanged(auth, (user) => {
  if (user && !user.emailVerified) {
    alert("Please verify your email first.");
    signOut(auth);
  }
});
    // Redirect after sign-up
    if (role === "teacher") {
      window.location.href = "teacher-dashboard.html";
    } else {
      window.location.href = "student-dashboard.html";
    }
  } catch (error) {
    document.getElementById("signup-error").textContent = error.message;
  }
});