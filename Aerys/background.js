chrome.tabs.onUpdated.addListener(function(){
	updateBadgeNumber();
});

chrome.tabs.onRemoved.addListener(function(){
	updateBadgeNumber();
});

function updateBadgeNumber(){

	chrome.tabs.getAllInWindow(null, function(tabs){
		var tabsCount = tabs.length;
		

		let w = tabs[0].width / tabsCount;
		console.log(w);
		if (w < 80){
			chrome.browserAction.setBadgeText({text: tabsCount.toString()});
			chrome.browserAction.setBadgeBackgroundColor({color: "#FF5722"}); 
			chrome.browserAction.setIcon({path: 'images/icon32.png'});  
		}
		else if( w < 120 && w >= 80){
			chrome.browserAction.setBadgeText({text: tabsCount.toString()});
			chrome.browserAction.setBadgeBackgroundColor({color: "#FFA726"}); 
			chrome.browserAction.setIcon({path: 'images/icon32_1.png'});  
		}
		else{
			chrome.browserAction.setBadgeText({text: ''});
			chrome.browserAction.setIcon({path: 'images/icon32_0.png'});  
			// chrome.browserAction.setBadgeBackgroundColor({color: "#8BC34A"}); 
		}
	});

}


updateBadgeNumber();