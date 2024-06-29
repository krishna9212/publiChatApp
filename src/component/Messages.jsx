import React from "react";
import { HStack, chakra, Text, Avatar } from "@chakra-ui/react";
function Messages({ text, user, uri }) {
  return (
    <HStack
      alignSelf={user === "other" ? "flex-start" : "flex-end"}
      padding={1}
      paddingRight={user === "other" ? "5" : "1"}
      paddingLeft={user === "other" ? "1" : "5"}
      bg={user === "other" ? "gray.500" : "green.500"}
      borderRadius={"full"}
    >
      {user === "other" && <Avatar src={uri}></Avatar>}
      <Text fontSize={"1.2rem"} fontWeight={"500"}>
        {text}
      </Text>
      {user === "me" && <Avatar src={uri}></Avatar>}
    </HStack>
  );
}

export default Messages;
