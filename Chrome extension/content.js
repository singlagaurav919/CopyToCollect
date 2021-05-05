var sideBarDiv  = document.createElement("button");
sideBarDiv.innerHTML = "Show Copied Content";
sideBarDiv.className = "sideBarDiv";
sideBarDiv.id = "sideBarId";
sideBarDiv.onclick = function(){
    
    var existingDiv = document.getElementById("mainMegaDiv");
    var mainMega = existingDiv ? existingDiv : document.createElement('div');
    var div = document.createElement("div");
    var overlayDiv = document.createElement('div');
    overlayDiv.className = 'overlayDiv';
    var btn = document.createElement( 'button' );
    var textDiv = document.createElement('div');
    textDiv.className = "textAreaDiv";
    var text = document.createElement('textarea');
    textDiv.appendChild(text);
    text.className = "textArea";
    text.cols = "80";
    text.rows = "40";
    
    mainMega.innerHTML = "";
    mainMega.id = "mainMegaDiv";
    mainMega.className = 'mainMegaDiv';
    mainMega.style.display = 'block';
    mainMega.appendChild(overlayDiv);
    mainMega.appendChild(div);
    document.body.appendChild( mainMega );
    //document.body.appendChild( div );
    //div.innerHTML = "";
    //div.style.display = 'block';
    //overlayDiv.style.display = 'block';
    div.appendChild( btn );
    div.appendChild(textDiv);
    div.id = 'copiedContentDiv';
    div.className = "mainDiv";
    chrome.storage.local.get(['allContent'],function(result) {
        text.value = result.allContent ? result.allContent : "";
    });

    btn.innerHTML = 'Close';
    btn.className = "btnClass";
    btn.onclick = function(){ 
        mainMega.style.display = 'none';
        //overlayDiv.style.display = 'none';
    };
};
document.body.appendChild(sideBarDiv);

chrome.storage.local.get(['isEnabledKey'],function(result) {
    if(result.isEnabledKey)
    {
        sideBarDiv.style.display='block';
    }
    else{
        sideBarDiv.style.display='none';
    }
});

document.addEventListener("copy", () =>
    navigator.clipboard.readText()
        .then(copiedText => {
                chrome.storage.local.get(['allContent'],function(result) {
                    var text = copiedText;
                    if(result.allContent)
                        text = result.allContent + "\n\n" + text;
                    chrome.storage.local.set({allContent:  text},function() {});
                    console.log('All content\n', text);
            });
        })
        .catch(err => {
                console.error('Error occured while processing copied content ', err);
            })
)

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      document.getElementById("sideBarId").style.display = request.enabledValue ? "block" : "none";
  });

