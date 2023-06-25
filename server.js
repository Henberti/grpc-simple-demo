const grpc = require('@grpc/grpc-js')
const protoloader = require('@grpc/proto-loader')
const packageDef = protoloader.loadSync('files.proto',{})
const grpcObject = grpc.loadPackageDefinition(packageDef)
const FielsPackage = grpcObject.filesPackage


const server = new grpc.Server()
server.bindAsync('localhost:3050',grpc.ServerCredentials.createInsecure(),(err,port)=>{
    if(err){
        console.log(err)
        return
    }
    
    console.log('listening to port',port)
    
    server.addService(FielsPackage.Files.service,{

        'createFile':createFile,
        'downloadFiles':downloadFile,
    })  
    server.start()
})


// Global variable to store the name of the file to be created.
let fileName = '';

/**
 * gRPC service handler for the `createFile` function.
 * This function takes a `call` parameter from the client, which contains the file request information,
 * and a `callback` function to respond back to the client.
 * 
 * @param {Object} call - The call object for the gRPC service, expected to contain the 'name' attribute.
 * @param {Function} callback - The callback to be executed for sending the response back to the client.
 *
 * It retrieves the file name from the call object, logs it, and sends back a confirmation message 
 * through the callback function indicating that the file has been created and download is starting.
 */
function createFile(call, callback) {
    // Retrieve the file name from the call request
    fileName = call.request.name;

    // Log the name of the file to be created
    console.log(fileName);

    // Call the callback function to send a message back to the client
    callback(null, { message: 'file created, starting download' });
}


/** 
This function is used to simulate the download of a file over a gRPC call.
* It periodically updates the client about the progress of the download.
*
* @param {Object} call - The call object for the gRPC call.
* @param {Function} callback - The callback function to be executed once the operation is complete.
**/

function downloadFile (call, callback){
    let presentege  = 0;
    const arr = Array.from({length: 11})

  
    arr.forEach((t, index) => {
        setTimeout(() => {
            call.write({processPresentege: `${presentege}%`, fileName: fileName})
            presentege += 10;
            if (index === arr.length - 1) {
                call.end()
            }
        }, index * 1000);
    });
}
