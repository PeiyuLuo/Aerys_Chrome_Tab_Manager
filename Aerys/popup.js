window.onload = function() {
  initialPage();
}
var tab_data = [];

function initialPage(){
    var tabNumCount = [];
    chrome.tabs.getAllInWindow(null, function(tabs){
        for (var i = 0; i < tabs.length; i++) {
                console.log(tabs[i].favIconUrl);

                var already_exist = false;
                let info;
                    
                if (tabs[i].url.split('/')[2].indexOf('www.') > -1 ){
                    info = tabs[i].url.split('/')[2].replace('www.','');
                }
                else{
                    info = tabs[i].url.split('/')[2];
                }

                for (var j=0; j<tab_data.length; j++){
                    if (info == tab_data[j].info){   
                        already_exist = true;
                        tab_data[j].count ++;
                        tab_data[j].id.push(i);
                        break;
                    }
                }
                if (!already_exist){
                    let this_tab_favIconUrl;

                    if(tabs[i].favIconUrl == "" || tabs[i].favIconUrl == null){
                            this_tab_favIconUrl = 'images/default.png';                        
                    }
                    else{
                        if(tabs[i].url.indexOf('chrome://') > -1){
                            if(tabs[i].url == 'chrome://extensions/'){
                                this_tab_favIconUrl = 'images/e.png';
                            }
                            else if(tabs[i].url == 'chrome://settings/'){
                                this_tab_favIconUrl = 'images/sc.png';
                            }
                            else if(tabs[i].url == 'chrome://history/'){
                                this_tab_favIconUrl = 'images/h.png';
                            }
                            else{
                                this_tab_favIconUrl = 'images/c.png';
                            }
                        }
                        else{
                            this_tab_favIconUrl = tabs[i].favIconUrl;
                        }
                        
                    }   
                    
                    tab_data.push({  "favIconUrl" : this_tab_favIconUrl,
                                     "count": 1, 
                                     "info": info,
                                     "id": [i]
                                 });
                    tabNumCount.push(0);
                }

                tab_data.sort(function(a,b){
                    return b.count - a.count;
                });               
        }

        for (let i =0; i< tab_data.length; i++){
            let text;
            if(tab_data[i].count > 1){
                text = tab_data[i].count +' <span>tabs at</span> '+ tab_data[i].info;
            }
            else{
                text = tabs[tab_data[i].id].title;
            }

            var newIcon = '<div class="icon_wrap" id="line' + i + '"><img class="favicon" src=" ' + tab_data[i].favIconUrl + 
                '"/><div class="count" id="c' + i + '">'+ text +'</div><div class="close_icon" id="close' + i + '"><img class="close_img" src="images/xs.gif"/></div></div>';

            $('#icons').append(newIcon);

            if(tab_data[i].count > 1){
                for (let j=0; j<tab_data[i].count; j++){
                    text = tabs[tab_data[i].id[j]].title;

                    newIcon = '<div class="icon_wrap hide icon_wrap_hide_' + i + '" id="line' + i + '_' + j 
                    + '"><img class="favicon" src="images/right_arrow.png"/><div class="count" id="c' + i +  '_' + j +'">'
                    + text +'</div><div class="close_icon" id="close' + i + '_' + j + '"><img class="close_img" src="images/xs.gif"/></div></div>';
                    $('#icons').append(newIcon);

                     ///Functions for 2nd hierarchy
                    $('#line'+ i + '_' + j).on("mouseover", function(){
                        // $(this).html('Remove them with 1-click');
                        $('#line'+ i + '_' + j).css('background-color','#EEEEEE');
                        $('#close'+ i + '_' + j).css('background-color','#E53935'); 
                    });
                    $('#line'+ i + '_' + j).on("mouseleave",function(){
                        $('#line'+i+ '_' + j).css('background-color','#F5F5F5');
                        $('#close'+i+ '_' + j).css('background-color','transparent');
                    });

                    $('#c'+i + '_' + j).on("click",function(){
                            chrome.tabs.highlight({'tabs': tabs[tab_data[i].id[j]].index}, function() {});  
                    });

                    $('#close'+i + '_' + j).on("click", function(){
                        $(this).css('animation','quit 0.25s');
                        $('#line'+i+ '_' + j).css('animation','lineShrink 0.25s');
                       
                        tabNumCount[i]++;
                        if(tab_data[i].count == tabNumCount[i]){
                            $('#close'+i).css('animation','quit 0.25s');
                            $('#line'+i).css('animation','lineShrink 0.25s');
                            setTimeout(function(){ $('#line'+i).remove();  },250);                     
                        }

                        setTimeout(function(){   
                            $( ".icon_wrap_hide_" + i + '_' + j).remove(); 
                            chrome.tabs.remove(tabs[tab_data[i].id[j]].id);
                            $('#line'+i+ '_' + j).remove();
                        },240);
                            
                    });  
                }
                
            }
            ///Functions for 1st hierarchy
            $('#line'+i).on("mouseover", function(){
                $('#line'+i).css('background-color','#EEEEEE');
                $('#close'+i).css('background-color','#E53935'); 
            });
            $('#line'+i).on("mouseleave",function(){
                $('#line'+i).css('background-color','transparent');
                $('#close'+i).css('background-color','transparent');
            });
            $('#c'+i).on("click",function(){
                if(tab_data[i].count > 1){
                    $( ".icon_wrap_hide_" + i ).toggle();
                }
                else{
                    chrome.tabs.highlight({'tabs': tabs[tab_data[i].id[0]].index}, function() {});
                }
                
            });
             $('#close'+i).on("mouseover", function(){
                $(this).css('background-color','#9C27B0'); 
             });

            $('#close'+i).on("click", function(){

                $(this).css('animation','quit 0.25s');
                $('#line'+i).css('animation','lineShrink 0.25s');


                $('#c'+i).html('');
                $( ".icon_wrap_hide_" + i ).remove();

                setTimeout(function(){
                    for (let j of tab_data[i].id){
                        
                        chrome.tabs.remove(tabs[j].id);
                        $('#line'+ i).remove();
                    }
                },240);
                
            });

        }//end for loop i in tab_data.length
        console.log(tab_data);

    }); 

}//end function intial page



