function createApp(dictionary){
  React.render(
    React.createElement(MashupContainer, {dictionary: dictionary}), 
    document.getElementById("main")
  );


}
