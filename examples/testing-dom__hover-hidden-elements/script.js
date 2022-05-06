var $btnJquery   = $("#with-jquery")
var btnNoJquery  = $("#no-jquery").get(0)
var $msgs        = $("#messages");

// when our buttons have these mouse events fired on it
// we want to populate <p id="message"> with the event
["mouseover", "mouseout", "mouseenter", "mouseleave"].forEach(function(event){
  var append = function(){
    // append the <li> message into the messages <ul>
    var $li = $("<li />").text("the event " + event + " was fired")

    $msgs.append($li)
  }

  // add native DOM event listener to this button
  btnNoJquery.addEventListener(event, append)

  // add jquery bound event listener to this button
  $btnJquery.on(event, append)
})
