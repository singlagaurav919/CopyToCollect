var showCopiedBtn = document.createElement("button");
showCopiedBtn.innerHTML = "Show Copied Content";
showCopiedBtn.className = "showCopiedBtn";
showCopiedBtn.id = "showCopiedBtnId";
showCopiedBtn.onclick = function() {

    var existingParentContainer = document.getElementById("parentContainerDiv");
    var parentContainer = existingParentContainer ? existingParentContainer : document.createElement('div');


    //overlayDiv to hide background content
    var overlayDiv = document.createElement('div');
    overlayDiv.className = 'overlayDiv';

    //close button
    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = 'Close';
    closeBtn.className = "closeBtnClass";
    closeBtn.onclick = function() {
        parentContainer.style.display = 'none';
    };

    //Save button
    var saveBtn = document.createElement('button');
    saveBtn.innerHTML = 'Save';
    saveBtn.className = "saveBtnClass";
    saveBtn.onclick = function() {
        chrome.storage.local.set({ allContent: document.getElementById("copiedTextAreaId").value }, function() {
            alert("Updated Successfully");
        });
    };

    //header container
    var headerDiv = document.createElement('div');
    headerDiv.className = 'headerDiv';
    headerDiv.appendChild(closeBtn);
    headerDiv.appendChild(saveBtn);

    //copied text area
    var copiedtextArea = document.createElement('textarea');
    copiedtextArea.className = "textArea";
    copiedtextArea.id = "copiedTextAreaId";
    chrome.storage.local.get(['allContent'], function(result) {
        copiedtextArea.value = result.allContent ? result.allContent : "";
    });

    //copied text container
    var copiedTextContainerDiv = document.createElement('div');
    copiedTextContainerDiv.className = "textAreaDiv";
    copiedTextContainerDiv.appendChild(copiedtextArea);

    //content container
    var contentContainer = document.createElement("div");
    contentContainer.appendChild(headerDiv);
    contentContainer.appendChild(copiedTextContainerDiv);
    contentContainer.id = 'copiedContentDiv';
    contentContainer.className = "contentContainerDiv";

    //parent container
    parentContainer.innerHTML = "";
    parentContainer.id = "parentContainerDiv";
    parentContainer.className = 'parentContainerDiv';
    parentContainer.style.display = 'block';
    parentContainer.appendChild(overlayDiv);
    parentContainer.appendChild(contentContainer);

    //Appending dynamically to currently opened page
    document.body.appendChild(parentContainer);
};
document.body.appendChild(showCopiedBtn);

chrome.storage.local.get(['isEnabledKey'], function(result) {
    if (result.isEnabledKey) {
        showCopiedBtn.style.display = 'block';
    } else {
        showCopiedBtn.style.display = 'none';
    }
});

document.addEventListener("copy", (event) =>
    chrome.storage.local.get(['isEnabledKey'], function(result) {
        if (result.isEnabledKey && event.target != document.getElementById('copiedTextAreaId')) {
            navigator.clipboard.readText()
                .then(copiedText => {
                    chrome.storage.local.get(['allContent'], function(result) {
                        var text = copiedText;
                        if (result.allContent)
                            text = result.allContent + "\n\n" + text;
                        chrome.storage.local.set({ allContent: text }, function() {});
                        console.log('All content\n', text);
                    });
                })
                .catch(err => {
                    console.error('Error occured while processing copied content ', err);
                })
        }
    })
)

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.enabledValue)
            document.getElementById("showCopiedBtnId").style.display = "block";
        else {
            document.getElementById("showCopiedBtnId").style.display = "none";
            document.getElementById("parentContainerDiv").style.display = "none";
        }
    });

document.addEventListener('selectionchange', () => {
    console.log(document.getSelection());
});