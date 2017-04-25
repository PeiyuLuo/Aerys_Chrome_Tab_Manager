(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-96433730-1', 'auto');
ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check.
ga('require', 'displayfeatures');
ga('send', 'pageview', '/options.html');

function save_options() {
  var disableTabNumber = document.getElementById('disableTabNumber').checked;
  var disableHistory = document.getElementById('disableHistory').checked;
  var closed_tabs_number = document.getElementById('closed_tabs_number').value;
  var changeTabsOrder = document.getElementById('changeTabsOrder').checked;

  if (disableTabNumber){
    ga('send', 'event', 'Options', 'Click', 'disableTabNumber');  
  }

  if (disableHistory){
    ga('send', 'event', 'Options', 'Click', 'disableHistory');  
  }

  if (changeTabsOrder){
    ga('send', 'event', 'Options', 'Click', 'changeTabsOrder');  
  }
  

  if (disableHistory){
    document.getElementById("closed_tabs_number").disabled = true;
    document.getElementById("closed_tabs_number").style.color = '#BDBDBD';
    document.getElementById("closed_tabs_number_text").style.color = '#BDBDBD';
  }
  else{
    document.getElementById("closed_tabs_number").disabled = false;
    document.getElementById("closed_tabs_number").style.color = '#333333';
    document.getElementById("closed_tabs_number_text").style.color = '#333333';
  }

  chrome.storage.sync.set({
    disableTabNumber : disableTabNumber,
    disableHistory: disableHistory,
    closed_tabs_number: closed_tabs_number,
    changeTabsOrder : changeTabsOrder
  }, function() {
    console.log("saved");
  });
}

// stored in chrome.storage.
function restore_options() {
  // Use default value
  chrome.storage.sync.get({
    disableTabNumber : false,
    disableHistory: false,
    closed_tabs_number: 8,
    changeTabsOrder: false
  }, function(items) {
    if(typeof items.disableTabNumber !== 'undefined') document.getElementById('disableTabNumber').checked = items.disableTabNumber;
    if(typeof items.disableHistory !== 'undefined') document.getElementById('disableHistory').checked = items.disableHistory;
    if(typeof items.closed_tabs_number !== 'undefined') document.getElementById('closed_tabs_number').value = items.closed_tabs_number;
    if(typeof items.changeTabsOrder !== 'undefined') document.getElementById('changeTabsOrder').checked = items.changeTabsOrder;
  });

  console.log(document.getElementById("t1").innerHTML);
  console.log(chrome.i18n.getMessage("disableTabNumber"));
  document.getElementById("t1").innerHTML += chrome.i18n.getMessage("disableTabNumber");
  document.getElementById("t2").innerHTML += chrome.i18n.getMessage("disableHistory");
  document.getElementById("closed_tabs_number_text").innerHTML += chrome.i18n.getMessage("closed_tabs_number_text");
  document.getElementById("t4").innerHTML += chrome.i18n.getMessage("changeTabsOrder");

  console.log(document.getElementById("t1").innerHTML);


  document.getElementById('disableTabNumber').addEventListener('click', save_options);
  document.getElementById('disableHistory').addEventListener('click', save_options);
  document.getElementById('changeTabsOrder').addEventListener('click', save_options);
  document.getElementById('closed_tabs_number').addEventListener('change', save_options);

}


document.addEventListener('DOMContentLoaded', restore_options);

document.getElementById('disableTabNumber').addEventListener('click', save_options);
document.getElementById('disableHistory').addEventListener('click', save_options);
document.getElementById('changeTabsOrder').addEventListener('click', save_options);
document.getElementById('closed_tabs_number').addEventListener('change', save_options);
