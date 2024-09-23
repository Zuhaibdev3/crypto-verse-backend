
export function rawBody(req: any, res: any, next: any) {
  let data = '';

  req.on('data', function (chunk: any) {
    data += chunk;
  })
  req.on('end', function () {
    req.rawBody = data;
    next();
  })

}
