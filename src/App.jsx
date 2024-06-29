import React, { useEffect, useRef, useState } from "react";
import { app } from "./firebase";
import "./App.css";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import {
  Box,
  Button,
  Container,
  VStack,
  FormControl,
  Input,
} from "@chakra-ui/react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const Messages = React.lazy(() => import("./component/Messages")); // Dynamic import

const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [user, setUser] = useState(null);
  const [inputmsg, setinputmsg] = useState("");
  const [messages, setmessages] = useState([]);
  const scrollbottom = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userData) => {
      setUser(userData);
    });

    const q = query(collection(db, "Msg"), orderBy("createdAt", "asc"));

    const unsubscribeformessage = onSnapshot(q, (snap) => {
      setmessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      );
    });

    return () => {
      unsubscribe();
      unsubscribeformessage();
    };
  }, []);

  const submithandler = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, "Msg"), {
        text: inputmsg,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      alert(error);
    }
    setinputmsg("");
    scrollbottom.current.scrollIntoView({ behavior: "smooth" });
  };

  const logouthandler = () => signOut(auth);

  const loginHandler = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <Box h="100vh" w="100vw" paddingY={2}>
      {user ? (
        <Container h="100%" bg="white">
          <VStack h="100%" bg="blue.100" padding={1}>
            <Button colorScheme="red" w="100%" h="6%" onClick={logouthandler}>
              Logout
            </Button>
            <VStack className="chatbox" overflowY="auto" h="88%" w="100%">
              {messages.map((item) => (
                <Messages
                  key={item.id}
                  text={item.text}
                  user={item.uid === user.uid ? "me" : "other"}
                  uri={item.uri}
                />
              ))}
              <div ref={scrollbottom}></div>
            </VStack>
            <form
              onSubmit={submithandler}
              style={{
                height: "6%",
              }}
            >
              <FormControl
                display={"Flex"}
                flexDirection={"row"}
                justifyContent={"Center"}
                alignItems={"Center"}
                gap={2}
              >
                <Input
                  type="text"
                  w="80%"
                  bg="red.50"
                  placeholder="Enter message"
                  value={inputmsg}
                  onChange={(e) => setinputmsg(e.target.value)}
                />
                <Button
                  w="20%"
                  type="submit"
                  textTransform="capitalize"
                  colorScheme="green"
                >
                  Send
                </Button>
              </FormControl>
            </form>
          </VStack>
        </Container>
      ) : (
        <Container
          h="100%"
          w="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Button
            textTransform="capitalize"
            colorScheme="purple"
            onClick={loginHandler}
          >
            Sign up with Google
          </Button>
        </Container>
      )}
    </Box>
  );
}

export default App;
