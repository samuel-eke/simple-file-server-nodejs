/\*\*

- @fileoverview A simple file server using Node.js and the built-in http and
- fs modules.
-
- @author Samuel Eke
- @license MIT
- @version 1.0.0
- @since 1.0.0
-
- @example
- node fileServer.js
-
- @description
- This application allows users to upload, download, and delete files on a
- server. It uses the built-in Node.js http module to create an http server
- and the built-in fs module to interact with the file system.
-
- @see https://github.com/samuel-eke/simple-file-server-nodejs -On command
  prompt type command 'curl http://localhost:8000/' it will return the list of
  all avaliable files in your current directory -'curl
  http://localhost:8000/filename' if you want to read content of a particular
  file -'curl -X PUT -d hello http://localhost:8000/file.txt' to add in a new
  file to the system. -'curl -X DELETE http://localhost:8000/file.txt' to delete
  the file from the system

\*/
