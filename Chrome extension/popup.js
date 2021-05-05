
$(document).ready(function(){
    chrome.storage.local.get(['isEnabledKey'],function(result) {
        var isEnabled = result.isEnabledKey;
        InitializeEnableButton(isEnabled, $('#enableButton'));
    });
    

    $('#enableButton').on('click', function() {
    chrome.storage.local.get(['isEnabledKey'],function(result) {
        var isEnabled = result.isEnabledKey;
        chrome.storage.local.set({isEnabledKey:  !isEnabled},function(result) {});
        InitializeEnableButton(!isEnabled, $('#enableButton'));
        });
    });
    $('#clearButton').on('click', function() {
        chrome.storage.local.remove('allContent',function() {
            alert("Data cleared");
        });
    });
});
 function InitializeEnableButton(isEnabled, enableButton)
 {
    $(enableButton).toggleClass("enabled", isEnabled);
    $(enableButton).html(isEnabled ? "On" : "Off");
 }