//this is a working file server application created using Nodejs

const { log } = require("console");

const { createServer } = require("http");
const methods = Object.create(null);
const { parse } = require("url");
const { resolve, sep } = require("path");
const baseDirectory = process.cwd();
const { createReadStream, createWriteStream } = require("fs");
const { stat, readdir, rmdir, unlink } = require("fs").promises;
const mime = require("mime");

createServer((request, response) => {
  let handler = methods[request.method] || notAllowed;
  handler(request)
    .catch((error) => {
      if (error.status != null) return error;
      return { body: String(error), status: 500 };
    })
    .then(({ body, status = 200, type = "text/plain" }) => {
      response.writeHead(status, { "Content-Type": type });
      if (body && body.pipe) body.pipe(response);
      else response.end(body);
    });
}).listen(8000);
log("Server is active");

async function notAllowed(request) {
  return {
    status: 405,
    body: `Method ${request.method} not allowed`,
  };
}

function urlPath(url) {
  let { pathname } = parse(url);
  let path = resolve(decodeURIComponent(pathname).slice(1));
  if (path != baseDirectory && !path.startsWith(baseDirectory + sep)) {
    throw { status: 403, body: "Forbidden" };
  }
  return path;
}

methods.GET = async function (request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    else return { status: 404, body: "File not found" };
  }

  if (stats.isDirectory()) {
    return { body: (await readdir(path)).join("\n") };
  } else {
    return {
      body: createReadStream(path),
      type: mime.getType(path),
    };
  }
};

methods.DELETE = async function (req) {
  let path = urlPath(req.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    else
      return {
        status: 204,
      };
  }
  if (stats.isDirectory()) await rmdir(path);
  else await unlink(path);
  return { status: 204 };
};

function pipeStream(from, to) {
  return new Promise((resolve, reject) => {
    from.on("error", reject);
    to.on("error", reject);
    to.on("finish", resolve);
    from.pipe(to);
  });
}

methods.PUT = async function (request) {
  let path = urlPath(request.url);
  await pipeStream(request, createWriteStream(path));
  return { status: 204 };
};
