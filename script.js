const request = new XMLHttpRequest();
request.open('GET','./JSON/data.json')
request.onreadystatechange = function() {
  if (request.readyState == 4 && request)
}
request.send(null);
const data = JSON.parse(request);
console.log(data);