var allClosedTab = {};
var allOpenedTabs = {};
var disableTabNumber = false;

chrome.storage.sync.get({
    disableTabNumber : false
  }, function(items) {
    if(typeof items.disableTabNumber !== 'undefined') disableTabNumber= items.disableTabNumber;
    else console.log("undefined");
  });

window.addEventListener("load", function(){
	init();


	chrome.tabs.onUpdated.addListener(function(){
		updateBadgeNumber();
		updateAllTabs();
	});

	chrome.tabs.onCreated.addListener(function(){
		
	});

	chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
		updateAllTabs();
		updateBadgeNumber();
		
		addClosedTab(tabId);
		console.log(allClosedTab);
	});
});


function init(){
	updateBadgeNumber();
	updateAllTabs();
	
}

function updateAllTabs(){

	chrome.windows.getAll({populate:true},function(windows){

        for(let i in windows){
            for (let t of windows[i].tabs){
            	// console.log(t);
            	allOpenedTabs[t.id] = { 'tabId' : t.id,
										'windowId' : windows[i].id,
										'favIconUrl' : t.favIconUrl,
										'title' : t.title,
										'url' : t.url
            							};
            }

        }     
       
    });
}

function addClosedTab(tabId){

	let duplicateCheck = false;
	for (let i in allClosedTab){
		if (allClosedTab[i].url == allOpenedTabs[tabId].url){
			duplicateCheck = true;
			break;
		}
	}

	if (!duplicateCheck){
		if (allOpenedTabs[tabId].url.indexOf('chrome://newtab/') == -1){
			allClosedTab[tabId] = allOpenedTabs[tabId];
			allClosedTab[tabId].time = (new Date()).getTime();
		}
		else{
			console.log(allOpenedTabs[tabId]);
		}
	}
	else{
		console.log('duplicated tabs');
	}
	

}

function removeClosedTab(tabId){
	delete allClosedTab[tabId];
}



function updateBadgeNumber(){

 	chrome.storage.sync.get({
   	 	disableTabNumber : false
	  	}, function(items) {
	    if(typeof items.disableTabNumber !== 'undefined') disableTabNumber= items.disableTabNumber;
	    else console.log("undefined");
	});
	
	// console.log(disableTabNumber);

	chrome.tabs.getAllInWindow(null, function(tabs){
		var tabsCount = tabs.length;	

		let w = tabs[0].width / tabsCount;

		if (w < 80){
			if (!disableTabNumber){
				chrome.browserAction.setBadgeText({text: tabsCount.toString()});
				chrome.browserAction.setBadgeBackgroundColor({color: "#FFA726"}); 
			}
			chrome.browserAction.setIcon({path: 'images/icon32.png'});  
		}
		else if( w < 120 && w >= 80){
			if (!disableTabNumber){
				chrome.browserAction.setBadgeText({text: tabsCount.toString()});
				chrome.browserAction.setBadgeBackgroundColor({color: "#8BC34A"}); 
			}
			chrome.browserAction.setIcon({path: 'images/icon32_1.png'});  
		}
		else{
			chrome.browserAction.setBadgeText({text: ''});
			chrome.browserAction.setIcon({path: 'images/icon32_0.png'});  
			// chrome.browserAction.setBadgeBackgroundColor({color: "#8BC34A"}); 
		}
	});

	if (disableTabNumber){
		chrome.browserAction.setBadgeText({text: ''});
	}
	

}


