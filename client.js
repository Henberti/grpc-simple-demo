const grpc = require('@grpc/grpc-js')
const protoloader = require('@grpc/proto-loader')
const packageDef = protoloader.loadSync('files.proto',{})
const grpcObject = grpc.loadPackageDefinition(packageDef)
const FielsPackage = grpcObject.filesPackage


const client = new FielsPackage.Files("localhost:3050",grpc.credentials.createInsecure())


// Calls the createFile method on the gRPC client, which sends a request to the gRPC server.
// The request payload contains an ID and name for the file to be created.
client.createFile({
    "id": -1,
    "name": "Big-File"
}, (err, res) => { // Callback function to handle the response.
    // If the request is successful, the response (res) from the server is logged.
    // If there is an error (err), it will be logged as well. In this code, error handling is not explicitly covered.
    console.log("Received from server", JSON.stringify(res))
});


// Establishes a client stream to the downloadFiles gRPC service
const call = client.downloadFiles();

// Listens for data events from the server stream
// When a data event occurs (server sends data), logs the received item
call.on("data", item => console.log(item));

// Listens for the end event from the server stream
// When the end event occurs (server ends the stream), logs a "end stream" message
call.on("end", e => console.log("end stream"));
