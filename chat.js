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