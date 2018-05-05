(function init() {
    const socket = io.connect('http://192.168.2.102:8000');
    

    socket.on('hello', (data) => {
      console.log("finished hello");  
      $('#userHello').html(data.info);
    });

    console.log("finished init");
}());