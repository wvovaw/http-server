import * as net from "net";

const server = net.createServer((socket) => {
  socket.on("data", (buffer) => {
    const decoder = new TextDecoder();
    const data = decoder.decode(buffer);
    console.log("Data recieved: ", data);

    socket.write(Buffer.from("HTTP/1.1 200 OK\r\n\r\n"));
  });

  socket.on("close", () => {
    socket.end();
  });
});

server.listen(4221, "localhost");
